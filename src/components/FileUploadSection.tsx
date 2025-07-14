'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ResumeData } from '@/types/resume';
// Using API route for resume parsing

interface FileUploadSectionProps {
  onFileUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function FileUploadSection({ onFileUpload, isLoading }: FileUploadSectionProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setUploadedFile(file);
    try {
      await onFileUpload(file);
    } catch (error) {
      setError('Failed to process file. Please try again.');
      setUploadedFile(null);
    }
  }, [onFileUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Transform Your Resume Into a
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {' '}Beautiful Portfolio
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          🤖 AI-powered resume analysis creates stunning portfolios in minutes. 
          Advanced parsing intelligently extracts your details for beautiful presentation.
        </p>
      </div>

      {/* File Support Notice */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-white font-medium mb-1">🤖 AI-Powered File Analysis</p>
            <p className="text-gray-300">
              <strong>✅ PDF files:</strong> Advanced OCR + intelligent name detection<br />
              <strong>✅ DOCX files:</strong> Smart parsing with context understanding<br />
              <strong>✅ TXT files:</strong> AI pattern recognition for structure analysis
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-400 bg-blue-500/20'
              : error
              ? 'border-red-400 bg-red-500/20'
              : uploadedFile && !isLoading
              ? 'border-green-400 bg-green-500/20'
              : 'border-white/40 hover:border-purple-400 hover:bg-purple-500/20'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            {isLoading ? (
              <>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">🧠 GPT-3.5 analyzing your resume...</h3>
                  <p className="text-gray-300">AI reading and understanding your career story for perfect extraction</p>
                </div>
              </>
            ) : error ? (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-2">Upload Failed</h3>
                  <p className="text-red-400 mb-4 text-center max-w-md">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setUploadedFile(null);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              </>
            ) : uploadedFile ? (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Resume uploaded successfully!</h3>
                  <p className="text-green-400">{uploadedFile.name}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Drag and drop your PDF, DOCX, or TXT file, or click to browse
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>PDF, DOCX, TXT</span>
                    </div>
                    <span>•</span>
                    <span>Max 10MB</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {fileRejections.length > 0 && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
            <h4 className="text-sm font-semibold text-red-300 mb-2">File rejected:</h4>
            <ul className="text-sm text-red-400 space-y-1">
              {fileRejections.map(({ file, errors }) => (
                <li key={file.name}>
                  {file.name}: {errors.map(e => e.message).join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">💡 Tips for Best Results</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>PDF files:</strong> Ensure text is selectable (not scanned images)</p>
            <p><strong>DOCX files:</strong> Use standard formatting with clear section headers</p>
            <p><strong>All files:</strong> Include sections like "Experience", "Education", "Skills"</p>
          </div>
        </div>
      </div>

      {/* Quick Test Section */}
      <div className="mt-6 max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">🚀 Quick Test</h3>
          <p className="text-sm text-gray-300 mb-3">
            Want to try it immediately? Use the <code className="bg-white/20 text-white px-1 rounded">test-resume.txt</code> file 
            or create your own resume file and upload it.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Smart Parsing</h3>
          <p className="text-gray-300">
            Advanced AI extracts information from PDF, DOCX, and text files automatically
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Multiple Themes</h3>
          <p className="text-gray-300">
            Choose from beautiful, professional templates that match your style
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Instant Generation</h3>
          <p className="text-gray-300">
            Get your portfolio website ready in minutes, not hours
          </p>
        </div>
      </div>
    </div>
  );
} 