import { useNavigate } from 'react-router-dom'

const categories = [
  { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-600' },
  { name: 'Clothing', icon: '👕', color: 'bg-green-100 text-green-600' },
  { name: 'Books', icon: '📚', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Home', icon: '🏠', color: 'bg-red-100 text-red-600' },
  { name: 'Sports', icon: '⚽', color: 'bg-purple-100 text-purple-600' },
  { name: 'Beauty', icon: '💄', color: 'bg-pink-100 text-pink-600' },
  { name: 'Food', icon: '🍟', color: 'bg-orange-100 text-orange-600' },
]

const Categories = () => {
  const navigate = useNavigate()

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/products?category=${cat.name}`)}
              className={`${cat.color} rounded-xl p-6 flex flex-col items-center gap-2 hover:scale-105 transition cursor-pointer`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="font-semibold text-sm">{cat.name}</span>
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Categories