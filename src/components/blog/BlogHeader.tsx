import { FileText } from 'lucide-react';

export function BlogHeader() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center p-2 bg-purple-500/20 rounded-xl mb-6">
        <FileText className="w-5 h-5 text-purple-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Portfolio Creation Guide</h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Expert tips and guides to help you create an impressive portfolio that stands out from the crowd
      </p>
    </div>
  );
} 