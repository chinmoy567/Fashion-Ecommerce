import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Shared product tile used on Home, Shop, Wishlist, and RelatedProducts
export default function ProductCard({ product, onToggleWishlist, isWishlisted = false, onQuickAdd }) {
  const hasDiscount = Boolean(product.discountPrice)
  const hasVariants = Boolean(product.trackVariantStock && product.variants?.length)
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <motion.div
      data-reveal
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-white/10 transition-shadow hover:shadow-xl hover:shadow-black/30 hover:ring-gold/40"
    >
      <Link
        to={`/products/${product._id}`}
        className="flex flex-1 flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No Image
            </div>
          )}

          {hasDiscount && (
            <Badge variant="destructive" className="absolute left-3 top-3 bg-destructive text-destructive-foreground">
              -{discountPercent}%
            </Badge>
          )}

          {onToggleWishlist && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.preventDefault()
                onToggleWishlist(product)
              }}
              className="glass absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-gold text-gold' : 'text-foreground'}`} />
            </motion.button>
          )}

          {onQuickAdd && !hasVariants && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => {
                e.preventDefault()
                onQuickAdd(product)
              }}
              className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-lg bg-gold py-2 text-sm font-medium text-background opacity-0 transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light group-hover:opacity-100"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </motion.button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="truncate font-medium">{product.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{product.brand}</p>

          {typeof product.rating === 'number' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-label={`Rated ${product.rating} out of 5`}>
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span>{product.rating.toFixed(1)}</span>
              {typeof product.reviewCount === 'number' && <span>({product.reviewCount})</span>}
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 pt-2">
            <span className="font-semibold text-gold">৳{product.discountPrice || product.price}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">৳{product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
