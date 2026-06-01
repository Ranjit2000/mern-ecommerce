import { Link } from 'react-router-dom'

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">

        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Shop The Best Products
        </h1>
        <p className="text-xl text-blue-200 mb-8 max-w-xl">
          Discover thousands of products at unbeatable prices.
          Fast delivery, easy returns.
        </p>

        <div className="flex gap-4">
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
          >
            Shop Now
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          >
            Join Free
          </Link>
        </div>

      </div>
    </div>
  )
}

export default HeroBanner