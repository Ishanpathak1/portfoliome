export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Skeleton */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
            <div>
              <div className="w-32 h-6 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* About Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="w-24 h-6 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-white/20 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-white/20 rounded animate-pulse"></div>
            <div className="w-5/6 h-4 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="w-32 h-6 bg-white/20 rounded animate-pulse mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-2 border-white/20 pl-6">
                <div className="w-48 h-5 bg-white/20 rounded animate-pulse mb-2"></div>
                <div className="w-36 h-4 bg-white/20 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-white/20 rounded animate-pulse"></div>
                  <div className="w-4/5 h-3 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="w-20 h-6 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="w-20 h-8 bg-white/20 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/40 border-t border-white/10 p-6 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-48 h-4 bg-white/20 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );
} 