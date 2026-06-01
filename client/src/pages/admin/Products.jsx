import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../api/endpoints'

const AdminProducts = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const emptyForm = {
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [''],
  }

  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/')
  }, [user, navigate])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [e.target.value] })
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images || [''],
    })
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      setSuccess('Product deleted successfully')
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete product')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSubmit = async () => {
    setError('')

    if (!formData.name || !formData.price ||
        !formData.category || !formData.stock) {
      return setError('Please fill all required fields')
    }

    try {
      if (editProduct) {
        await updateProduct(editProduct._id, formData)
        setSuccess('Product updated successfully')
      } else {
        await createProduct(formData)
        setSuccess('Product created successfully')
      }
      setFormData(emptyForm)
      setEditProduct(null)
      setShowForm(false)
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Products
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditProduct(null)
            setFormData(emptyForm)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Success & Error */}
      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editProduct ? 'Edit Product' : 'Add New Product'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="iPhone 15 Pro"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
                <option value="Food">Food</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="999"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={formData.images[0]}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            {editProduct ? 'Update Product' : 'Create Product'}
          </button>

        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/50'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <span className="font-medium text-gray-800 truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default AdminProducts