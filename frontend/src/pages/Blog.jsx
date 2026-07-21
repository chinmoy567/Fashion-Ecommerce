import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/blog?page=${page}&limit=9`)
      setPosts(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No blog posts yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 flex-1 flex flex-col">
                {post.category && (
                  <span className="text-xs font-semibold text-blue-600 uppercase mb-2">
                    {post.category}
                  </span>
                )}
                <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm flex-1">{post.excerpt}</p>
                )}
                <p className="text-xs text-gray-400 mt-4">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                  {post.author?.fullName ? ` · ${post.author.fullName}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
