import { notFound } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import NavigationPadding from '@/components/NavigationPadding';
import { Footer } from '@/components/Footer';
import { getBlogPostBySlug } from '@/lib/blog';
import { Calendar, Clock, Tag } from 'lucide-react';

interface BlogPostParams {
  params: {
    slug: string;
  };
}

export default async function BlogPost({ params }: BlogPostParams) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      <Navigation />
      <NavigationPadding>
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-gray-900 to-black py-20">
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{post.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto px-6 py-16">
            <article className="prose prose-lg max-w-none">
              <div 
                className="
                  blog-content
                  [&_h1]:text-white [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-8 [&_h1]:mt-16 [&_h1]:leading-tight
                  [&_h2]:text-white [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-6 [&_h2]:mt-12 [&_h2]:leading-tight
                  [&_h3]:text-white [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-8
                  [&_p]:text-gray-300 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6
                  [&_p:first-child]:mt-0
                  [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:text-blue-300 [&_a]:font-medium
                  [&_strong]:text-white [&_strong]:font-semibold
                  [&_em]:text-gray-300 [&_em]:italic
                  [&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:text-gray-300
                  [&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:text-gray-300
                  [&_li]:mb-3 [&_li]:text-lg [&_li]:leading-relaxed
                  [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_blockquote]:my-8 [&_blockquote]:bg-gray-800/30 [&_blockquote]:py-4 [&_blockquote]:rounded-r-lg
                  [&_code]:text-pink-400 [&_code]:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                  [&_pre]:bg-gray-900 [&_pre]:p-6 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:border [&_pre]:border-gray-700
                  [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-300 [&_pre_code]:text-sm
                  [&_img]:rounded-lg [&_img]:shadow-2xl [&_img]:my-12 [&_img]:w-full
                  [&_hr]:border-gray-700 [&_hr]:my-16 [&_hr]:border-t-2
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-8
                  [&_th]:border [&_th]:border-gray-600 [&_th]:p-3 [&_th]:bg-gray-800 [&_th]:text-white [&_th]:font-semibold
                  [&_td]:border [&_td]:border-gray-600 [&_td]:p-3 [&_td]:text-gray-300
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>
        </main>
      </NavigationPadding>
      <Footer />
    </div>
  );
} 