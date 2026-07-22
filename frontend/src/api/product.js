import api from './axiosInstance'

// Admin-only mutations require the admin session's token, since this module
// is shared with customer-facing product browsing which uses the customer token.
const adminAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

export const getProducts = (params) => api.get('/products', { params })
export const getProductById = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data, { headers: adminAuthHeader() })
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: adminAuthHeader() })
export const deleteProduct = (id) => api.delete(`/products/${id}`, { headers: adminAuthHeader() })
export const getFilterMetadata = () => api.get('/products/filters/metadata')
export const getRelatedProducts = (id, limit) => api.get(`/products/${id}/related`, { params: limit ? { limit } : undefined })

export const getProductVariants = (productId) => api.get(`/products/${productId}/variants`)
export const createProductVariant = (productId, data) => api.post(`/products/${productId}/variants`, data, { headers: adminAuthHeader() })
export const updateProductVariant = (productId, variantId, data) => api.put(`/products/${productId}/variants/${variantId}`, data, { headers: adminAuthHeader() })
export const deleteProductVariant = (productId, variantId) => api.delete(`/products/${productId}/variants/${variantId}`, { headers: adminAuthHeader() })

export const exportProductsCsv = () => api.get('/products/export/csv', { responseType: 'blob', headers: adminAuthHeader() })
export const importProductsCsv = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/products/import/csv', formData, { headers: { 'Content-Type': 'multipart/form-data', ...adminAuthHeader() } })
}
