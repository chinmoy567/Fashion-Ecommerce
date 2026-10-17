import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function ReviewSection() {
  const { id } = useParams()
  const { isAuthenticated } = useSelector(state => state.customerAuth)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [id])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/reviews/product/${id}`)
      setReviews(response.data.data.items)
      setAverageRating(response.data.data.averageRating)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.warning('Please login to write a review')
      return
    }

    try {
      setSubmitting(true)
      await axios.post(
        `${API_BASE}/reviews`,
        {
          productId: id,
          rating: formData.rating,
          comment: formData.comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('customer_token')}` },
        }
      )
      toast.success('Review submitted! It will be visible after approval.')
      setFormData({ rating: 5, comment: '' })
      setShowReviewForm(false)
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />
      ))}
    </div>
  )

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
  }

  return (
    <div className="mt-16 border-t border-white/10 pt-10">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-[0.02em] mb-6">Customer Reviews</h2>

        <div className="mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-display font-bold">{averageRating}</span>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-muted-foreground mt-1 tracking-wide uppercase">Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {isAuthenticated && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)} className="mb-6 rounded-none bg-gold text-black hover:bg-gold-light text-sm tracking-[0.15em] uppercase">
            Write a Review
          </Button>
        )}

        <AnimatePresence>
          {showReviewForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmitReview}
              className="mb-6 p-5 border border-white/10 overflow-hidden"
            >
              <div className="mb-4">
                <label className="block text-xs tracking-[0.15em] uppercase font-medium mb-2">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full bg-secondary border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Very Poor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs tracking-[0.15em] uppercase font-medium mb-2">Comment (optional)</label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  maxLength={500}
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.comment.length}/500</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="rounded-none bg-gold text-black hover:bg-gold-light text-sm tracking-[0.15em] uppercase">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button type="button" variant="outline" className="rounded-none" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="divide-y divide-white/10 border-t border-white/10">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="py-6">
              <div className="flex justify-between items-start mb-3">
                {renderStars(review.rating)}
                <p className="text-xs text-muted-foreground tracking-wide">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="font-medium text-sm tracking-[0.1em] uppercase mb-2">{review.customerId?.name || 'Anonymous'}</p>
              {review.comment && <p className="text-muted-foreground leading-relaxed">{review.comment}</p>}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  )
}
