import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Marquee } from "@/components/ui/marquee"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

// Single testimonial card shown inside the marquee columns.
function TestimonialCard({ name, rating, comment }) {
  return (
    <Card className="w-64 shrink-0 bg-secondary/80 ring-white/10">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="bg-gold/20 text-gold font-semibold">
              {name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-foreground tracking-wide">{name}</p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i <= rating ? "fill-gold text-gold" : "text-muted-foreground"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {comment || "Great quality and fast shipping!"}
        </blockquote>
      </CardContent>
    </Card>
  )
}

// Fetches approved reviews for the current product and displays them as a 3D marquee wall.
export default function TestimonialsMarquee() {
  const { id } = useParams()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    let cancelled = false

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE}/reviews/product/${id}`)
        if (!cancelled) setReviews(response.data.data.items || [])
      } catch (error) {
        console.error("Error fetching testimonials:", error)
      }
    }

    fetchReviews()
    return () => { cancelled = true }
  }, [id])

  if (reviews.length < 3) return null

  const columns = [[], [], [], []]
  reviews.forEach((review, i) => columns[i % 4].push(review))

  return (
    <div className="mt-16">
      <h2 className="font-display text-3xl font-extrabold uppercase tracking-[0.02em] mb-6">
        What Customers Say
      </h2>
      <div className="relative flex h-96 w-full flex-row items-center justify-center overflow-hidden gap-1.5 rounded-lg ring-1 ring-white/10 bg-background [perspective:300px]">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
          }}
        >
          {columns.map((columnReviews, colIndex) =>
            columnReviews.length > 0 ? (
              <Marquee
                key={colIndex}
                vertical
                pauseOnHover
                reverse={colIndex % 2 === 1}
                repeat={3}
                className="[--duration:40s]"
              >
                {columnReviews.map((review) => (
                  <TestimonialCard
                    key={review._id}
                    name={review.customerId?.name || "Anonymous"}
                    rating={review.rating}
                    comment={review.comment}
                  />
                ))}
              </Marquee>
            ) : null
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
        </div>
      </div>
    </div>
  )
}
