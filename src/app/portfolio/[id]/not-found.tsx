'use client';

import Link from 'next/link';
import { Home, Search, AlertTriangle } from 'lucide-react';

export default function PortfolioNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
          <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-12 h-12 text-orange-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Portfolio Not Found
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Sorry, the portfolio you're looking for doesn't exist or may have been removed.
          </p>
          
          <div className="space-y-4">
            <p className="text-gray-400">
              This could happen if:
            </p>
            <ul className="text-gray-400 text-left max-w-md mx-auto space-y-2">
              <li>• The portfolio link is incorrect</li>
              <li>• The portfolio has been deleted</li>
              <li>• The link has expired</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link 
              href="/"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Home className="w-5 h-5" />
              <span>Create New Portfolio</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 