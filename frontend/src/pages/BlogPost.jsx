import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setNotFound(false)
      const response = await axios.get(`${API_BASE}/blog/slug/${slug}`)
      setPost(response.data.data)
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true)
      } else {
        console.error('Error fetching blog post:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">Loading...</div>
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-blue-600 hover:underline">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/blog" className="text-sm text-blue-600 hover:underline">
        ← Back to Blog
      </Link>

      {post.category && (
        <span className="block text-xs font-semibold text-blue-600 uppercase mt-6">
          {post.category}
        </span>
      )}

      <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>

      <p className="text-sm text-gray-500 mb-6">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
        {post.author?.fullName ? ` · ${post.author.fullName}` : ''}
      </p>

      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full rounded-lg mb-8 max-h-96 object-cover"
        />
      )}

      <div
        className="max-w-none text-gray-800 leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
