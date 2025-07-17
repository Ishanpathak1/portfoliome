import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getBlogPosts, BlogPost } from '@/lib/blog';

export function BlogList() {
  const posts = getBlogPosts();

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Link 
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="bg-purple-500/20 rounded-xl p-3">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-300 mb-4">{post.description}</p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 