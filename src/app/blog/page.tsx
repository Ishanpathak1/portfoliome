import { Navigation } from '@/components/Navigation';
import NavigationPadding from '@/components/NavigationPadding';
import { Footer } from '@/components/Footer';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogList } from '@/components/blog/BlogList';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      <Navigation />
      <NavigationPadding>
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-white/5 border-b border-white/10 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <BlogHeader />
            </div>
          </div>

          {/* Blog List Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <BlogList />
          </div>
        </main>
      </NavigationPadding>
      <Footer />
    </div>
  );
} 