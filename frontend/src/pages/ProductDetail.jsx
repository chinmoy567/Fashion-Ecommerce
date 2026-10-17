import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getProductById } from '../api/product'
import { addToCart } from '../api/cart'
import { setSelectedProduct } from '../store/slices/productSlice'
import { addItem } from '../store/slices/cartSlice'
import ReviewSection from '../components/ReviewSection'
import TestimonialsMarquee from '../components/TestimonialsMarquee'
import RelatedProducts from '../components/RelatedProducts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.customerAuth)
  const { selectedProduct } = useSelector(state => state.products)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id)
      dispatch(setSelectedProduct(response.data.data))
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (selectedProduct.trackVariantStock && !selectedVariantId) {
      toast.warning('Please select a size/color')
      return
    }

    try {
      await addToCart({ productId: id, variantId: selectedVariantId || undefined, quantity })
      dispatch(addItem({
        productId: id,
        variantId: selectedVariantId || undefined,
        quantity,
        price: selectedProduct.discountPrice || selectedProduct.price,
      }))
      toast.success('Added to cart!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to cart')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }
  if (!selectedProduct) return <div className="text-center py-24 text-muted-foreground">Product not found</div>

  const variants = selectedProduct.variants || []
  const selectedVariant = variants.find(v => v._id === selectedVariantId)
  const availableStock = selectedProduct.trackVariantStock
    ? (selectedVariant?.stock ?? 0)
    : selectedProduct.stock

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={() => window.history.back()}
        className="mb-8 text-sm tracking-[0.15em] uppercase text-gold hover:text-gold-light font-medium flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-24 h-fit"
        >
          <div className="bg-secondary ring-1 ring-white/10 flex items-center justify-center aspect-[3/4]">
            {selectedProduct.image ? (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
                No Image Available
              </div>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-3">{selectedProduct.brand || 'DeerFit'}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-6 text-balance">{selectedProduct.name}</h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <span className="text-2xl font-semibold text-gold">৳{selectedProduct.price}</span>
            {selectedProduct.discountPrice && (
              <span className="text-muted-foreground line-through">৳{selectedProduct.discountPrice}</span>
            )}
            {availableStock > 0 ? (
              <span className="text-success font-medium text-xs tracking-[0.1em] uppercase">In Stock</span>
            ) : (
              <span className="text-destructive font-medium text-xs tracking-[0.1em] uppercase">Out of Stock</span>
            )}
          </div>

          <p className="text-muted-foreground mb-8 leading-relaxed">{selectedProduct.description}</p>

          {/* Variant Picker (size/color with per-variant stock) */}
          {selectedProduct.trackVariantStock && variants.length > 0 && (
            <div className="mb-8 pb-8 border-b border-white/10">
              <label className="block text-xs tracking-[0.15em] uppercase font-medium mb-3">Select Size / Color</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {variants.map(v => (
                  <motion.button
                    key={v._id}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    disabled={v.stock === 0}
                    onClick={() => setSelectedVariantId(v._id)}
                    className={`h-11 px-2 text-sm font-medium border transition-colors ${
                      selectedVariantId === v._id
                        ? 'bg-gold text-black border-gold'
                        : 'bg-secondary text-secondary-foreground border-white/10 hover:border-gold/50'
                    } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                  >
                    {[v.size, v.color].filter(Boolean).join(' / ')}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Colors & Sizes (informational, for products without variant tracking) */}
          {!selectedProduct.trackVariantStock && (
            <div className="mb-8 pb-8 border-b border-white/10 space-y-5">
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase font-medium mb-3">Available Colors</label>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProduct.colors.map(color => (
                      <span key={color} className="px-3 py-1 border border-white/10 text-sm capitalize">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase font-medium mb-3">Available Sizes</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedProduct.sizes.map(size => (
                      <span key={size} className="h-11 flex items-center justify-center border border-white/10 text-sm uppercase font-medium">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-8">
            <div className="flex gap-3">
              <div className="flex items-center border border-white/10">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="h-12 w-11 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 h-12 text-center bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(q => Math.min(availableStock || q + 1, q + 1))}
                  className="h-12 w-11 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={availableStock === 0 || (selectedProduct.trackVariantStock && !selectedVariantId)}
                className="flex-1 h-12 rounded-none bg-gold text-black hover:bg-gold-light disabled:opacity-40 text-sm tracking-[0.2em] uppercase"
              >
                Add to Cart
              </Button>
            </div>
          </div>

          <div className="border border-white/10 p-5 space-y-2 text-sm">
            <p><span className="text-muted-foreground">Available Stock:</span> <span className="text-success font-medium">{availableStock}</span></p>
            <p><span className="text-muted-foreground">SKU:</span> {selectedProduct.sku}</p>
            <p><span className="text-muted-foreground">Material:</span> {selectedProduct.material || 'N/A'}</p>
            <p><span className="text-muted-foreground">Brand:</span> {selectedProduct.brand || 'DeerFit'}</p>
          </div>
        </motion.div>
      </div>

      <TestimonialsMarquee />
      <ReviewSection />
      <RelatedProducts />
    </div>
  )
}
