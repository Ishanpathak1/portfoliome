import { ResumeData, PersonalizationData } from '@/types/resume';
import { promises as fs } from 'fs';
import path from 'path';

export interface StoredPortfolio {
  id: string;
  resumeData: ResumeData;
  personalization: PersonalizationData;
  createdAt: string;
  updatedAt: string;
  views: number;
}

// Storage directory
const STORAGE_DIR = path.join(process.cwd(), 'data', 'portfolios');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Generate unique portfolio ID
export function generatePortfolioId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

// Save portfolio data
export async function savePortfolio(
  id: string, 
  resumeData: ResumeData, 
  personalization: PersonalizationData
): Promise<StoredPortfolio> {
  await ensureStorageDir();
  
  const portfolio: StoredPortfolio = {
    id,
    resumeData,
    personalization,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0
  };

  const filePath = path.join(STORAGE_DIR, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(portfolio, null, 2));
  
  console.log(`Portfolio saved: ${id}`);
  return portfolio;
}

// Load portfolio data
export async function loadPortfolio(id: string): Promise<StoredPortfolio | null> {
  try {
    await ensureStorageDir();
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const portfolio: StoredPortfolio = JSON.parse(data);
    
    // Increment view count
    portfolio.views += 1;
    portfolio.updatedAt = new Date().toISOString();
    await fs.writeFile(filePath, JSON.stringify(portfolio, null, 2));
    
    console.log(`Portfolio loaded: ${id} (Views: ${portfolio.views})`);
    return portfolio;
  } catch (error) {
    console.error(`Failed to load portfolio ${id}:`, error);
    return null;
  }
}

// Check if portfolio exists
export async function portfolioExists(id: string): Promise<boolean> {
  try {
    await ensureStorageDir();
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// List all portfolios (for admin/analytics)
export async function listPortfolios(): Promise<StoredPortfolio[]> {
  try {
    await ensureStorageDir();
    const files = await fs.readdir(STORAGE_DIR);
    const portfolios: StoredPortfolio[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(STORAGE_DIR, file);
        const data = await fs.readFile(filePath, 'utf-8');
        portfolios.push(JSON.parse(data));
      }
    }
    
    return portfolios.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Failed to list portfolios:', error);
    return [];
  }
}

// Delete portfolio
export async function deletePortfolio(id: string): Promise<boolean> {
  try {
    await ensureStorageDir();
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    await fs.unlink(filePath);
    console.log(`Portfolio deleted: ${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete portfolio ${id}:`, error);
    return false;
  }
} 