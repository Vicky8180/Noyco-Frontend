"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import { 
  SparklesIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  ClockIcon,
  FolderOpenIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function DocsPage() {
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/docs/'));
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Backend API is not running. Please start the backend server.');
        }
        throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setDocs(data.documentation || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching docs:', err);
      if (err.message.includes('JSON') || err.message.includes('<!DOCTYPE')) {
        setError('Backend API is not running. Please start the backend server at http://localhost:8000');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;
    
    try {
      setSearching(true);
      const response = await fetch(getApiUrl(`/docs/search/${encodeURIComponent(searchQuery)}`));
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Error searching docs:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Failed to Load Documentation</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button 
                  onClick={fetchDocs}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recentDocs = docs
    .sort((a, b) => b.modified - a.modified)
    .slice(0, 6);

  const popularDocs = docs.filter(doc => 
    doc.name.includes('api-gateway') || 
    doc.name.includes('auth') || 
    doc.name.includes('documentation-guide')
  );

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-8 w-8 text-yellow-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Documentation
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Explore our comprehensive documentation for all microservices and APIs. 
            Use the sidebar to navigate through different topics and services.
          </p>
          
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <RocketLaunchIcon className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Getting Started</h3>
                <p className="text-yellow-700 mt-1">
                  Browse the sidebar to find documentation for specific services, or use the search function below.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Documentation</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search through all documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching || searchQuery.length < 2}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Results ({searchResults.length})
              </h3>
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <Link 
                      href={`/docs/${result.name}`}
                      className="block"
                    >
                      <h4 className="font-semibold text-gray-900 hover:text-yellow-600">
                        {result.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {result.matching_lines?.slice(0, 2).map((line, i) => (
                          <span key={i} className="block">
                            Line {line.line_number}: {line.content.substring(0, 100)}...
                          </span>
                        ))}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Access Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ClockIcon className="h-6 w-6 text-gray-500 mr-2" />
              Recently Updated
            </h2>
            <div className="space-y-3">
              {recentDocs.map((doc) => (
                <Link
                  key={doc.name}
                  href={`/docs/${doc.name}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {doc.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(doc.size)} • {formatDate(doc.modified)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular/Important Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FolderOpenIcon className="h-6 w-6 text-gray-500 mr-2" />
              Essential Reading
            </h2>
            <div className="space-y-3">
              {popularDocs.map((doc) => (
                <Link
                  key={doc.name}
                  href={`/docs/${doc.name}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {doc.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              
              {popularDocs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No essential documents identified yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentation Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{docs.length}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {docs.reduce((acc, doc) => acc + doc.size, 0) > 1024 
                  ? Math.round(docs.reduce((acc, doc) => acc + doc.size, 0) / 1024) + 'KB'
                  : docs.reduce((acc, doc) => acc + doc.size, 0) + 'B'
                }
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {new Set(docs.map(doc => doc.name.split('-')[0])).size}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {docs.filter(doc => {
                  const now = Date.now() / 1000;
                  const dayInSeconds = 24 * 60 * 60;
                  return (now - doc.modified) < (7 * dayInSeconds);
                }).length}
              </div>
              <div className="text-sm text-gray-600">Updated This Week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}