import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/blogs')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Function to truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePDFDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback to opening in new tab if download fails
      window.open(url, '_blank');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      Error loading blogs: {error}
    </div>
  );

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Travel Blogs</h1>
        <p className="mb-8">
          Discover fascinating stories, travel tips, and insights about Sri Lanka from our community
          of experienced travelers and local experts. Get inspired for your next adventure!
        </p>
      </section>

      {blogs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No blogs have been published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.filter(blog => blog.published).map(blog => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {blog.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Sri+Lanka+Travel';
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.categories.map((category, idx) => (
                        <span key={idx} className="bg-secondary/20 text-xs px-2 py-1 rounded text-dark">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-2 text-primary hover:text-primary-dark">
                  <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                </h2>

                <p className="text-gray-600 mb-4">{truncateContent(blog.content)}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    By {blog.author} • {formatDate(blog.createdAt)}
                  </span>
                  <Link 
                    to={`/blogs/${blog._id}`} 
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Read more →
                  </Link>
                </div>
                
                {blog.document && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handlePDFDownload(blog.document, `${blog.title}.pdf`)}
                      className="flex items-center text-primary hover:underline bg-white px-3 py-2 rounded border border-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Download PDF Guide
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="bg-primary/10 p-8 rounded-lg mt-12">
        <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
        <div className="flex flex-wrap gap-4">
          {Array.from(new Set(blogs.flatMap(blog => blog.categories || []))).slice(0, 8).map((category, idx) => (
            <Link 
              key={idx} 
              to={`/blogs?category=${category}`} 
              className="bg-white px-4 py-2 rounded-full shadow hover:shadow-md transition-shadow"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Blogs;
