import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRelatedProducts } from '../api/product'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function RelatedProducts() {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const revealRef = useScrollReveal()

  useEffect(() => {
    fetchRelated()
  }, [id])

  const fetchRelated = async () => {
    try {
      setLoading(true)
      const response = await getRelatedProducts(id, 4)
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || products.length === 0) return null

  return (
    <div ref={revealRef} className="mt-16 border-t border-white/10 pt-16">
      <h2 data-reveal className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.02em] text-center mb-10">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            data-reveal
            to={`/products/${product._id}`}
            className="group block"
          >
            <div className="relative bg-secondary ring-1 ring-white/10 group-hover:ring-gold/40 aspect-[3/4] flex items-center justify-center mb-3 transition-colors">
              <span className="absolute left-0 top-0 bg-gold/90 text-black text-[10px] font-medium tracking-[0.15em] uppercase px-2 py-1">
                New
              </span>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <span className="text-muted-foreground text-sm">No Image</span>
              )}
            </div>
            <p className="font-medium text-sm truncate">{product.name}</p>
            <p className="text-gold font-semibold">৳{product.discountPrice || product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
