import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { setProducts, setFilter, setPage } from '../store/slices/productSlice'
import { getProducts } from '../api/product'

// Demo products when API fails
const DEMO_PRODUCTS = [
  { _id: '1', name: 'DeerFit Classic T-Shirt', brand: 'DeerFit', price: 1200, stock: 50 },
  { _id: '2', name: 'DeerFit Navy Casual Shirt', brand: 'DeerFit', price: 2500, stock: 40 },
  { _id: '3', name: 'DeerFit Black Formal Shirt', brand: 'DeerFit', price: 3500, stock: 30 },
  { _id: '4', name: 'DeerFit Polo Shirt', brand: 'DeerFit', price: 2000, stock: 45 },
  { _id: '5', name: 'DeerFit Denim Jeans', brand: 'DeerFit', price: 3500, stock: 35 },
  { _id: '6', name: 'DeerFit Chino Pants', brand: 'DeerFit', price: 2800, stock: 40 },
  { _id: '7', name: 'DeerFit White Cotton Top', brand: 'DeerFit', price: 1500, stock: 45 },
  { _id: '8', name: 'DeerFit Pink Saree', brand: 'DeerFit', price: 4500, stock: 20 },
  { _id: '9', name: 'DeerFit Red T-Shirt Kids', brand: 'DeerFit', price: 800, stock: 60 },
  { _id: '10', name: 'DeerFit Baseball Cap', brand: 'DeerFit', price: 600, stock: 100 },
  { _id: '11', name: 'DeerFit Wool Scarf', brand: 'DeerFit', price: 900, stock: 80 },
  { _id: '12', name: 'DeerFit Leather Belt', brand: 'DeerFit', price: 1200, stock: 70 },
]

export default function Shop() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { products, filters, pagination } = useSelector(state => state.products)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await getProducts(filters)
      if (response?.data?.data?.items && response.data.data.items.length > 0) {
        dispatch(setProducts(response.data.data))
      } else {
        dispatch(setProducts({
          items: DEMO_PRODUCTS,
          pagination: { page: 1, limit: 12, total: DEMO_PRODUCTS.length, pages: 1 }
        }))
      }
    } catch (error) {
      console.error('Error fetching products, showing demo data:', error)
      dispatch(setProducts({
        items: DEMO_PRODUCTS,
        pagination: { page: 1, limit: 12, total: DEMO_PRODUCTS.length, pages: 1 }
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-4">Filters</h3>
            <input
              type="text"
              placeholder="Search products"
              onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
              className="w-full p-2 border rounded mb-4"
            />
          </div>
        </div>

        {/* Products */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(product => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="bg-white rounded shadow hover:shadow-lg transition"
              >
                <div className="bg-gray-200 h-48 rounded-t flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">৳{product.price}</span>
                    {product.stock > 0 ? (
                      <span className="text-green-600 text-sm">In Stock</span>
                    ) : (
                      <span className="text-red-600 text-sm">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => dispatch(setPage(page))}
                  className={`px-4 py-2 rounded ${
                    filters.page === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
