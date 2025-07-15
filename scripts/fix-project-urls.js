const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function ensureUrlProtocol(url) {
  if (!url || typeof url !== 'string') return url;
  
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  
  // If URL already has protocol, return as-is
  if (trimmed.match(/^https?:\/\//)) {
    return trimmed;
  }
  
  // Add https:// protocol
  return `https://${trimmed}`;
}

function fixUrlsInResumeData(resumeData) {
  if (!resumeData || typeof resumeData !== 'object') return resumeData;
  
  const fixed = { ...resumeData };
  
  // Fix project URLs
  if (fixed.projects && Array.isArray(fixed.projects)) {
    fixed.projects = fixed.projects.map(project => ({
      ...project,
      link: ensureUrlProtocol(project.link),
      github: ensureUrlProtocol(project.github)
    }));
  }
  
  // Fix contact URLs
  if (fixed.contact && typeof fixed.contact === 'object') {
    fixed.contact = {
      ...fixed.contact,
      website: ensureUrlProtocol(fixed.contact.website),
      linkedin: ensureUrlProtocol(fixed.contact.linkedin)
    };
  }
  
  return fixed;
}

async function fixProjectUrls() {
  console.log('🔍 Checking for portfolios with URLs that need fixing...');
  
  try {
    const portfolios = await prisma.portfolio.findMany({
      select: {
        id: true,
        slug: true,
        resumeData: true
      }
    });
    
    console.log(`📊 Found ${portfolios.length} portfolios to check`);
    
    let fixedCount = 0;
    
    for (const portfolio of portfolios) {
      const originalData = portfolio.resumeData;
      const fixedData = fixUrlsInResumeData(originalData);
      
      // Check if any URLs were actually changed
      const originalJson = JSON.stringify(originalData);
      const fixedJson = JSON.stringify(fixedData);
      
      if (originalJson !== fixedJson) {
        await prisma.portfolio.update({
          where: { id: portfolio.id },
          data: { resumeData: fixedData }
        });
        
        fixedCount++;
        console.log(`✅ Fixed URLs for portfolio: ${portfolio.slug}`);
        
        // Log what was changed for debugging
        if (fixedData.projects) {
          fixedData.projects.forEach((project, index) => {
            const original = originalData.projects?.[index];
            if (original?.link !== project.link) {
              console.log(`   📎 Project "${project.name}" link: ${original?.link} → ${project.link}`);
            }
            if (original?.github !== project.github) {
              console.log(`   🔗 Project "${project.name}" github: ${original?.github} → ${project.github}`);
            }
          });
        }
        
        if (fixedData.contact) {
          const original = originalData.contact;
          if (original?.website !== fixedData.contact.website) {
            console.log(`   🌐 Contact website: ${original?.website} → ${fixedData.contact.website}`);
          }
          if (original?.linkedin !== fixedData.contact.linkedin) {
            console.log(`   💼 Contact LinkedIn: ${original?.linkedin} → ${fixedData.contact.linkedin}`);
          }
        }
      }
    }
    
    console.log(`\n🎉 Migration complete! Fixed URLs in ${fixedCount} portfolios.`);
    
    if (fixedCount === 0) {
      console.log('✨ All URLs already have proper protocols!');
    }
    
  } catch (error) {
    console.error('❌ Error fixing URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixProjectUrls(); 