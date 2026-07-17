export default function App() {
  return (
    <div className="w-full bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">FashionHub</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">Shop</a>
            <a href="#" className="hover:text-gray-300">Cart</a>
            <a href="#" className="hover:text-gray-300">Login</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to FashionHub</h1>
          <p className="text-xl mb-8">Discover the latest trends in Bangladesh clothing</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700">
            Shop Now
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Men', 'Women', 'Kids', 'Accessories', 'Shoes', 'Winter', 'Summer', 'Sale'].map(cat => (
            <div key={cat} className="bg-gray-100 p-6 rounded text-center hover:bg-gray-200 cursor-pointer">
              <h3 className="font-bold text-lg">{cat}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded shadow hover:shadow-lg transition">
              <div className="bg-gray-200 h-48 rounded-t flex items-center justify-center">
                <span className="text-gray-400">Product {i}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Summer Collection</h3>
                <p className="text-gray-600 text-sm mb-2">High-quality apparel</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">৳500</span>
                  <span className="text-green-600 text-sm">In Stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 FashionHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
