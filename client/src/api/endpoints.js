import API from './axios'

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)

// Products
export const getProducts = (params) => API.get('/products', { params })
export const getProductById = (id) => API.get(`/products/${id}`)
export const createProduct = (data) => API.post('/products', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// Orders
export const createOrder = (data) => API.post('/orders', data)
export const getMyOrders = () => API.get('/orders/myorders')
export const getOrderById = (id) => API.get(`/orders/${id}`)
export const getAllOrders = () => API.get('/orders')
export const updateOrderToDelivered = (id) => API.put(`/orders/${id}/deliver`)
export const updateOrderToPaid = (id) => API.put(`/orders/${id}/pay`)


// Users - Admin
export const getAllUsers = () => API.get('/users')
export const deleteUser = (id) => API.delete(`/users/${id}`)

// Reviews
export const getReviews = (productId) => API.get(`/products/${productId}/reviews`)

export const addReview = (productId, data) => API.post(`/products/${productId}/reviews`, data)

export const deleteReview = (productId, reviewId) => API.delete(`/products/${productId}/reviews/${reviewId}`)

// Analytics
export const getAnalytics = () => API.get('/analytics')

// Wishlist
export const getWishlist = () => API.get('/wishlist')
export const addToWishlist = (productId) => API.post('/wishlist', { productId })
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`)
export const clearWishlist = () => API.delete('/wishlist/clear')

// Upload
export const uploadImage = (formData) => API.post('/upload', formData, {headers: { 'Content-Type': 'multipart/form-data' }})
export const deleteImage = (public_id) => API.delete('/upload', { data: { public_id } })