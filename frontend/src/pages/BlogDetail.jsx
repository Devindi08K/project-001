import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/blogs/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blog:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle PDF download
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
      Error loading blog: {error}
    </div>
  );

  if (!blog) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-700">Blog not found</h2>
      <p className="mt-4 text-gray-500">The blog post you're looking for might have been removed or doesn't exist.</p>
      <Link to="/blogs" className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-teal-700">
        Back to Blogs
      </Link>
    </div>
  );

  // If blog is not published and user is not admin, redirect
  if (!blog.published && !isAdmin) {
    navigate('/blogs');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Admin edit button */}
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link 
            to={`/admin/blogs/edit/${blog._id}`}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Edit Blog
          </Link>
        </div>
      )}

      {/* Back to blogs */}
      <div className="mb-6">
        <Link to="/blogs" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blogs
        </Link>
      </div>

      <article>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-600 mb-4">
            <span className="mr-4">By {blog.author}</span>
            <span className="mr-4">•</span>
            <span>{formatDate(blog.createdAt)}</span>
            
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <>
                <span className="mr-4 ml-4">•</span>
                <span>Updated: {formatDate(blog.updatedAt)}</span>
              </>
            )}
          </div>
          
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.categories.map((category, idx) => (
                <Link 
                  key={idx} 
                  to={`/blogs?category=${category}`}
                  className="bg-secondary/20 px-3 py-1 rounded-full text-sm hover:bg-secondary/30"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Featured image */}
        {blog.image && (
          <div className="mb-8">
            <img 
              src={blog.image} 
              alt={blog.title}
              className="w-full rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x600?text=Sri+Lanka+Travel';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-10">
          {/* Split by paragraphs and render */}
          {blog.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="border-t border-b border-gray-200 py-4 my-8">
            <div className="flex flex-wrap items-center">
              <span className="text-gray-700 font-medium mr-3">Tags:</span>
              {blog.tags.map((tag, idx) => (
                <Link 
                  key={idx} 
                  to={`/blogs?tag=${tag}`}
                  className="bg-gray-100 px-2 py-1 rounded mr-2 mb-2 text-sm text-gray-600 hover:bg-gray-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* PDF Document */}
        {blog.document && (
          <div className="bg-gray-50 rounded-lg p-6 mt-8 shadow-sm">
            <h3 className="text-lg font-bold mb-3">Additional Resources</h3>
            <button 
              onClick={() => handlePDFDownload(blog.document, `${blog.title}.pdf`)}
              className="flex items-center text-primary hover:underline bg-white px-4 py-2 rounded border border-primary hover:bg-primary hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Guide
            </button>
          </div>
        )}
      </article>

      {/* Related blogs placeholder - You could implement this with actual related blogs */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Placeholder items - you can replace these with actual related blogs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/blogs">Best Beaches in Southern Sri Lanka</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Discover pristine beaches along the southern coast...</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/blogs">Exploring Ancient Ruins of Anuradhapura</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Step back in time at Sri Lanka's ancient capital...</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/blogs">Tea Plantations of Nuwara Eliya</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Visit the lush tea estates in Sri Lanka's hill country...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;