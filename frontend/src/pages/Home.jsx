import { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { setProducts, setLoading } from '../store/slices/productSlice'
import { getProducts } from '../api/product'
import { gsap } from '@/lib/gsap'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import heroImage from '@/assets/images/hero-storm-coast.png'
import heroVideo from '@/assets/videos/hero-orb-glow.mp4'

const categories = [
  { name: 'Men', slug: 'mens-clothing' },
  { name: 'Women', slug: 'womens-clothing' },
  { name: 'Kids', slug: 'kids-clothing' },
  { name: 'Accessories', slug: 'accessories' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.products)
  const heroRef = useRef(null)
  const heroVideoRef = useRef(null)
  const categoryReveal = useScrollReveal()
  const productReveal = useScrollReveal()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    dispatch(setLoading(true))
    try {
      const response = await getProducts({ featured: 'true', limit: 8 })
      dispatch(setProducts(response.data.data))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const targets = heroRef.current.querySelectorAll('[data-hero]')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 })
        heroVideoRef.current?.pause()
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.1 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden py-32 sm:py-44">
        {/* Base video — looping ambient glow, falls back to the static photo poster when it can't play */}
        <video
          ref={heroVideoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '78% top' }}
          src={heroVideo}
          poster={heroImage}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        {/* Darkening overlay for text contrast */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p data-hero className="text-gold text-xs sm:text-sm tracking-[0.4em] uppercase mb-6">New Season Arrivals</p>
          <h1 data-hero className="font-display text-6xl sm:text-8xl font-extrabold uppercase tracking-[0.02em] mb-8 text-balance text-white">
            Welcome to DeerFit
          </h1>
          <p data-hero className="text-base sm:text-lg tracking-wide text-white/80 mb-12 text-balance">
            Discover the latest trends in Bangladesh clothing
          </p>
          <div data-hero>
            <Button
              size="lg"
              className="bg-gold text-black hover:bg-gold-light h-12 px-10 text-sm tracking-[0.2em] uppercase"
              render={<Link to="/shop" />} nativeButton={false}
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div ref={categoryReveal} className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <h2 data-reveal className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.02em] mb-16">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {categories.map(cat => (
            <motion.div key={cat.slug} data-reveal whileHover={{ y: -4 }} className="bg-background">
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group flex h-full flex-col items-center justify-center gap-2 p-10 text-center transition-colors hover:bg-card"
              >
                <h3 className="font-display font-semibold text-xl uppercase tracking-[0.1em] group-hover:text-gold transition-colors">{cat.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div ref={productReveal} className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <div data-reveal className="flex items-baseline justify-between gap-4 mb-16 border-b border-border pb-6">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.02em]">Featured Products</h2>
          <span className="text-gold text-sm tracking-[0.2em] uppercase shrink-0">({products.length})</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={{ ...product, images: product.image ? [product.image] : [] }} />
          ))}
        </div>
      </div>
    </div>
  )
}
