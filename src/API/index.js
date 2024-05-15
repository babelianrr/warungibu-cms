import serverAuthAPI from './serverAuthAPI'
import { formatQueryString } from 'helpers/formatter'

// login
export function fetchLogin(payload) {
  return serverAuthAPI({
    url: `/admin/users/login_admin`,
    method: 'POST',
    payload: payload,
  })
}

// report
export function fetchReport() {
  return serverAuthAPI({
    url: `/admin/report`,
    method: 'GET',
  })
}

// categories
export function fetchCategories() {
  return serverAuthAPI({
    url: '/admin/categories',
    method: 'GET',
  })
}
export function fetchCategoryById(categoryId) {
  return serverAuthAPI({
    url: `/admin/categories/${categoryId}`,
    method: 'GET',
  })
}
export function fetchPostCategory(payload) {
  return serverAuthAPI({
    url: `/admin/categories`,
    method: 'POST',
    payload: payload,
  })
}
export function fetchPatchCategory(categoryId, payload) {
  return serverAuthAPI({
    url: `/admin/categories/${categoryId}`,
    method: 'PATCH',
    payload: payload,
  })
}
export function fetchDeleteCategory(categoryId) {
  return serverAuthAPI({
    url: `/admin/categories/${categoryId}`,
    method: 'DELETE',
  })
}
export function fetchUploadCategory(payload) {
  return serverAuthAPI({
    url: `/admin/categories/upload`,
    method: 'POST',
    payload: payload,
  })
}

// products
export function fetchProducts(query = { page: 1, limit: 15 }) {
  const apiQuery = formatQueryString(query)

  return serverAuthAPI({
    url: `/admin/products${apiQuery}`,
    method: 'GET',
  })
}

// PPOB
export function fetchPPOB(query) {
  // const apiQuery = formatQueryString(query)
  const apiQuery = ''

  return serverAuthAPI({
    url: `/admin/ppob${apiQuery}`,
    method: 'GET',
  })
}

export function fetchActiveProducts(query = { page: 1, limit: 8 }) {
  const apiQuery = formatQueryString(query)

  return serverAuthAPI({
    url: `/products${apiQuery}`,
    method: 'GET',
  })
}

export function createProduct(payload) {
  return serverAuthAPI({
    url: `/admin/products`,
    method: 'POST',
    payload: payload,
  })
}


export function fetchUploadProduct(payload) {
  return serverAuthAPI({
    url: `/admin/products/upload`,
    method: 'POST',
    payload: payload,
  })
}

export function fetchProductById(productId) {
  return serverAuthAPI({
    url: `/admin/products/${productId}`,
    method: 'GET',
  })
}
export function fetchUpdateProduct(productId, payload) {
  return serverAuthAPI({
    url: `/admin/products/${productId}`,
    method: 'PATCH',
    payload: payload,
  })
}
export function fetchUploadImageProduct(productId, formData) {
  return serverAuthAPI({
    url: `/admin/products/${productId}/upload`,
    method: 'PATCH',
    payload: formData,
  })
}
export function fetchDeleteImageProduct(payload) {
  return serverAuthAPI({
    url: `/admin/products/images/${payload.imageId}`,
    method: 'DELETE',
  })
}

export function syncProduct() {
  return serverAuthAPI({
    url: `/admin/products/sync-product`,
    method: 'POST',
  })
}

// order
export function fetchOrders(query = { page: 1, limit: 15 }) {
  const apiQuery = formatQueryString(query)

  return serverAuthAPI({
    url: `/admin/orders${apiQuery}`,
    method: 'GET',
  })
}

export function exportOrders(query = { page: 1, limit: 15 }) {
  const apiQuery = formatQueryString(query)
  return serverAuthAPI({
    url: `/admin/orders/export-excel${apiQuery}`,
    method: 'GET',
    responseType: 'blob'
  })
}

export function fetchOrderById(transactionNumber) {
  return serverAuthAPI({
    url: `/admin/orders/${transactionNumber}`,
    method: 'GET',
  })
}

export function fetchFakturById(transactionNumber) {
  return serverAuthAPI({
    url: `/admin/orders/${transactionNumber}/get-faktur`,
    method: 'GET',
  })
}

export function fetchGetCartsBatch(cart_id) {
  return serverAuthAPI({
    url: `/carts_batch/${cart_id}`,
    method: 'GET',
  })
}

export function downloadInvoice(transactionNumber) {
  return serverAuthAPI({
    url: `/admin/orders/${transactionNumber}/invoice`,
    method: 'GET',
    responseType: 'blob',
  })
}

export function AddProductCart(transactionNumber, payload) {
  return serverAuthAPI({
    url: `/admin/orders/${transactionNumber}/add-product`,
    method: 'POST',
    payload: payload,
  })
}

export function UpdateProductCart(transactionNumber, payload) {
  return serverAuthAPI({
    url: `/admin/orders/${transactionNumber}/update-cart`,
    method: 'PATCH',
    payload: payload,
  })
}

export function DeleteProductCart(transactionNumber, payload) {
  return serverAuthAPI({
    url: `/admin/orders/${transactionNumber}/delete-product`,
    method: 'DELETE',
    payload: payload,
  })
}

//batch
export function AddBatch(payload) {
  return serverAuthAPI({
    url: '/carts_batch',
    method: 'POST',
    payload: payload,
  })
}

export function UpdateBatch(id, payload) {
  return serverAuthAPI({
    url: `/carts_batch/${id}`,
    method: 'PATCH',
    payload: payload,
  })
}

export function DeleteBatch(id, payload) {
  return serverAuthAPI({
    url: `/carts_batch/${id}`,
    method: 'DELETE',
    payload: payload,
  })
}

// banner
export function fetchBanner() {
  return serverAuthAPI({
    url: '/banners',
    method: 'GET',
  })
}
export function createBanner(payload) {
  return serverAuthAPI({
    url: `/banners/upload`,
    method: 'POST',
    payload: payload,
  })
}
export function deleteBanner(id) {
  return serverAuthAPI({
    url: `/banners/${id}`,
    method: 'DELETE',
  })
}

// admin
export function fetchAdmin(query = { page: 1, limit: 15, role: 'ADMIN' }) {
  const apiQuery = formatQueryString(query)
  return serverAuthAPI({
    url: `/admin/users${apiQuery}`,
    method: 'GET',
  })
}
export function fetchCreateAdmin(payload) {
  return serverAuthAPI({
    url: `/admin/users/register_admin`,
    method: 'POST',
    payload: payload,
  })
}

// users
export function fetchUsers(query = { page: 1, limit: 15, role: 'NON_ADMIN' }) {
  const apiQuery = formatQueryString(query)
  return serverAuthAPI({
    url: `/admin/users${apiQuery}`,
    method: 'GET',
  })
}

export function exportUser(query = { role: 'NON_ADMIN' }) {
  const apiQuery = formatQueryString(query)
  return serverAuthAPI({
    url: `/users/export-excel${apiQuery}`,
    method: 'GET',
    responseType: 'blob'
  })
}

export function fetchDetailUser(emailUser) {
  return serverAuthAPI({
    url: `/admin/users/${emailUser}`,
    method: 'GET',
  })
}

export function fetchCreateUser(payload) {
  return serverAuthAPI({
    url: `/users/register`,
    method: 'POST',
    payload: payload,
  })
}

export function fetchEditUser(id, payload) {
  return serverAuthAPI({
    url: `/admin/users/${id}`,
    method: 'PATCH',
    payload: payload,
  })
}

export function fetchImportUser(payload) {
  return serverAuthAPI({
    url: `/users/import-excel`,
    method: 'POST',
    payload: payload,
  })
}

// Product review
export function fetchProductReview(productId, query = { page: 1, limit: 15 }) {
  const apiQuery = formatQueryString(query)

  return serverAuthAPI({
    url: `/product_reviews/${productId}${apiQuery}`,
    method: 'GET',
  })
}

// flash sale
export function fetchFlashsale() {
  return serverAuthAPI({
    url: '/admin/flash-sales',
    method: 'GET',
  })
}

export function addProductFlashSale(flashSaleId, productIds) {
  return serverAuthAPI({
    url: `/admin/flash-sales/${flashSaleId}/add-products`,
    payload: {
      product_ids: productIds,
    },
    method: 'POST',
  })
}

export function removeProductFlashSale(flashSaleId, productIds) {
  return serverAuthAPI({
    url: `/admin/flash-sales/${flashSaleId}/remove-products`,
    payload: {
      product_ids: productIds,
    },
    method: 'POST',
  })
}

export function createFlashSale(payload) {
  return serverAuthAPI({
    url: `/admin/flash-sales`,
    payload,
    method: 'POST',
  })
}

export function editFlashSale(flashSaleId, payload) {
  return serverAuthAPI({
    url: `/admin/flash-sales/${flashSaleId}`,
    payload,
    method: 'PATCH',
  })
}

export function fetchFlashSaleProduct(flashSaleId) {
  return serverAuthAPI({
    url: `/admin/flash-sales/${flashSaleId}`,
    method: 'GET',
  })
}

// chat
export function createChat(payload) {
  return serverAuthAPI({
    url: '/admin/users/chats',
    method: 'POST',
    payload,
  })
}

export function readChat(userId) {
  return serverAuthAPI({
    url: '/admin/users/chats/read',
    method: 'POST',
    payload: { user_id: userId },
  })
}

// outlet types
export function fetchOutletTypes() {
  return serverAuthAPI({
    url: '/outlet_types',
    method: 'GET',
  })
}
export function fetchOutletTypeById(outletTypeId) {
  return serverAuthAPI({
    url: `/outlet_types/${outletTypeId}`,
    method: 'GET',
  })
}
export function createOutletType(payload) {
  return serverAuthAPI({
    url: `/outlet_types`,
    method: 'POST',
    payload: payload,
  })
}
export function updateOutletType(outletTypeId, payload) {
  return serverAuthAPI({
    url: `/outlet_types/${outletTypeId}`,
    method: 'PUT',
    payload: payload,
  })
}
export function deleteOutletType(outletTypeId) {
  return serverAuthAPI({
    url: `/outlet_types/${outletTypeId}`,
    method: 'DELETE',
  })
}

// export function deleteOutletType(outletTypeId) {
//   return serverAuthAPI({
//     url: `/outlet_types/${outletTypeId}`,
//     method: 'DELETE',
//   })
// }

// news
export function getNews() {
  return serverAuthAPI({
    url: `/news`,
    method: 'GET',
  })
}
export function getNewsBySlug(slug) {
  return serverAuthAPI({
    url: `/news/${slug}`,
    method: 'GET',
  })
}
export function createNews(payload) {
  return serverAuthAPI({
    url: `/news`,
    method: 'POST',
    payload: payload,
  })
}
export function createNewsImage(payload) {
  return serverAuthAPI({
    url: `/news/upload`,
    method: 'POST',
    payload: payload,
  })
}
export function editNews(newsId, payload) {
  return serverAuthAPI({
    url: `/news/${newsId}`,
    method: 'PUT',
    payload: payload,
  })
}
export function deleteNews(newsId) {
  return serverAuthAPI({
    url: `/news/${newsId}`,
    method: 'DELETE',
  })
}


//promotion
export function getPromotion(query = { page: 1, limit: 15 }) {
  const apiQuery = formatQueryString(query)
  return serverAuthAPI({
    url: `/admin/promotions${apiQuery}`,
    method: 'GET',
  })
}

export function createPromotion(payload) {
  return serverAuthAPI({
    url: `/admin/promotions`,
    method: 'POST',
    payload: payload,
  })
}

export function updatePromotion(promotionId, payload) {
  return serverAuthAPI({
    url: `/admin/promotions/${promotionId}`,
    method: 'PATCH',
    payload
  })
}

export function deletePromotion(promotionId) {
  return serverAuthAPI({
    url: `/admin/promotions/${promotionId}`,
    method: 'DELETE',
  })
}

//promotion detail (produk)
export function detailPromotion(promotionId) {
  return serverAuthAPI({
    url: `/admin/promotions/${promotionId}`,
    method: 'GET',
  })
}

export function createProductDetail(promotionId, payload) {
  return serverAuthAPI({
    url: `/admin/promotions/${promotionId}`,
    method: 'POST',
    payload: payload,
  })
}

export function updateProductDetail(promotionDetailId, payload) {
  return serverAuthAPI({
    url: `/admin/promotions/detail/${promotionDetailId}`,
    method: 'PATCH',
    payload
  })
}

export function getPaymentTerm({ page, limit, name, status }) {
  const payload = {
    limit: limit,
    offset: page,
    name: name,
    status: status
  }
  return serverAuthAPI({
    url: `/payment_terms`,
    method: 'POST',
    payload: payload,
  })
}

export function createPaymentTerm(payload) {
  return serverAuthAPI({
    url: `/payment_terms/create`,
    method: 'POST',
    payload: payload,
  })
}

export function updatePaymentTerms(paymentTermsId, payload) {
  return serverAuthAPI({
    url: `/payment_terms/${paymentTermsId}`,
    payload,
    method: 'PUT',
  })
}