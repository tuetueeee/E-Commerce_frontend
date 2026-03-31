/// <reference types="vite/client" />

/**
 * API Configuration & Mapping
 * This file contains all API endpoints and configuration for the Sustainique frontend
 */

// ============================================
// API BASE CONFIGURATION
// ============================================

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";
const SWAGGER_URL = "http://localhost:5000/api-docs";

// ============================================
// INITIALIZATION FLAG
// ============================================
export const INITIALIZE_DEMO_DATA =
  (import.meta.env.VITE_INIT_DEMO as string) === "true" || true;

// ============================================
// API ENDPOINTS MAPPING
// ============================================

export const API_ENDPOINTS = {
  // ==================
  // AUTH ENDPOINTS
  // ==================
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },

  // ==================
  // PRODUCTS ENDPOINTS
  // ==================
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/products`,
    GET_BLANKS: `${API_BASE_URL}/products/blanks`,
    GET_READY_MADE: `${API_BASE_URL}/products/ready-made`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/products/${id}`,
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: (id: string) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/products/${id}`,
    // AI Recommendation endpoints
    GET_AI_TRENDING: `${API_BASE_URL}/products/ai/trending`,
    GET_AI_SIMILAR: (id: string) => `${API_BASE_URL}/products/ai/similar/${id}`,
    GET_AI_FREQUENTLY_BOUGHT: (id: string) => `${API_BASE_URL}/products/ai/frequently-bought/${id}`,
    GET_AI_RECOMMENDED: `${API_BASE_URL}/products/ai/recommended`,
  },

  // ==================
  // DESIGNS ENDPOINTS
  // ==================
  DESIGNS: {
    GET_ALL: `${API_BASE_URL}/designs`,
    GET_TRENDING: `${API_BASE_URL}/designs/trending`,
    GET_AI_RECOMMENDED: `${API_BASE_URL}/designs/ai/recommended`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/designs/${id}`,
    CREATE: `${API_BASE_URL}/designs`,
    UPDATE: (id: string) => `${API_BASE_URL}/designs/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/designs/${id}`,
  },

  // ==================
  // CUSTOMIZER ENDPOINTS
  // ==================
  CUSTOMIZER: {
    SAVE_DESIGN: `${API_BASE_URL}/customizer/save`,
    GET_SAVED_DESIGNS: `${API_BASE_URL}/customizer/saved`,
    GET_SAVED_DESIGN_BY_ID: (id: string) => `${API_BASE_URL}/customizer/saved/${id}`,
    DELETE_SAVED_DESIGN: (id: string) => `${API_BASE_URL}/customizer/saved/${id}`,
    CALCULATE_PRICE: `${API_BASE_URL}/customizer/calculate-price`,
  },

  // ==================
  // CART ENDPOINTS
  // ==================
  CART: {
    GET: `${API_BASE_URL}/cart`,
    SUMMARY: `${API_BASE_URL}/cart/summary`,
    ADD_ITEM: `${API_BASE_URL}/cart/add`,
    UPDATE_ITEM: (itemId: string) => `${API_BASE_URL}/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `${API_BASE_URL}/cart/items/${itemId}`,
    CLEAR: `${API_BASE_URL}/cart/clear`,
    APPLY_VOUCHER: `${API_BASE_URL}/cart/apply-voucher`,
  },

  // ==================
  // ORDERS ENDPOINTS
  // ==================
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    GET_ALL: `${API_BASE_URL}/orders`, // Admin only
    GET_MY_ORDERS: `${API_BASE_URL}/orders/my-orders`, // User orders
    GET_BY_ID: (id: string) => `${API_BASE_URL}/orders/${id}`,
    GET_TRACKING: (id: string) => `${API_BASE_URL}/orders/${id}/tracking`,
    GET_STATS: `${API_BASE_URL}/orders/stats`, // Admin stats
    CANCEL: (id: string) => `${API_BASE_URL}/orders/${id}/cancel`,
  },

  // ==================
  // SHIPMENTS ENDPOINTS
  // ==================
  SHIPMENTS: {
    GET_BY_ORDER: (orderId: string) =>
      `${API_BASE_URL}/shipments/order/${orderId}`,
    UPDATE: (id: string) => `${API_BASE_URL}/shipments/${id}`,
  },

  // ==================
  // FAVORITES ENDPOINTS
  // ==================
  FAVORITES: {
    ADD: `${API_BASE_URL}/favorites`,
    GET_ALL: `${API_BASE_URL}/favorites`,
    CHECK: `${API_BASE_URL}/favorites/check`,
    REMOVE: (favoriteId: string) => `${API_BASE_URL}/favorites/${favoriteId}`,
  },

  // ==================
  // REWARDS ENDPOINTS
  // ==================
  REWARDS: {
    GET_BALANCE: `${API_BASE_URL}/rewards/points`,
    GET_HISTORY: `${API_BASE_URL}/rewards/history`,
    GET_CATALOG: `${API_BASE_URL}/rewards/catalog`,
    REDEEM: (rewardId: string) => `${API_BASE_URL}/rewards/redeem/${rewardId}`,
    // Admin catalog endpoints (if available)
    CATALOG_GET_ALL: `${API_BASE_URL}/rewards/catalog`,
    CATALOG_GET_BY_ID: (id: string) => `${API_BASE_URL}/rewards/catalog/${id}`,
    CATALOG_CREATE: `${API_BASE_URL}/rewards/catalog`,
    CATALOG_UPDATE: (id: string) => `${API_BASE_URL}/rewards/catalog/${id}`,
    CATALOG_DELETE: (id: string) => `${API_BASE_URL}/rewards/catalog/${id}`,
  },

  // ==================
  // VOUCHERS ENDPOINTS
  // ==================
  VOUCHERS: {
    MY_VOUCHERS: `${API_BASE_URL}/vouchers/my-vouchers`,
    VALIDATE: `${API_BASE_URL}/vouchers/validate`,
    // Admin endpoints (if available)
    GET_ALL: `${API_BASE_URL}/vouchers`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/vouchers/${id}`,
    CREATE: `${API_BASE_URL}/vouchers`,
    UPDATE: (id: string) => `${API_BASE_URL}/vouchers/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/vouchers/${id}`,
  },

  // ==================
  // USERS ENDPOINTS
  // ==================
  USERS: {
    GET_PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    GET_DASHBOARD_STATS: `${API_BASE_URL}/users/dashboard/stats`,
    GET_RECENT_ORDERS: `${API_BASE_URL}/users/dashboard/recent-orders`,
    GET_TREES_PLANTED: `${API_BASE_URL}/users/dashboard/trees-planted`,
    // Admin endpoints
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
    CREATE: `${API_BASE_URL}/users`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
    ACTIVATE: (id: string) => `${API_BASE_URL}/users/${id}/activate`,
    DEACTIVATE: (id: string) => `${API_BASE_URL}/users/${id}/deactivate`,
    DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
    GET_STATS: `${API_BASE_URL}/users/stats`,
  },

  // ==================
  // REVIEWS ENDPOINTS
  // ==================
  REVIEWS: {
    CREATE: `${API_BASE_URL}/reviews`,
    GET_BY_PRODUCT: (productId: string) =>
      `${API_BASE_URL}/reviews/product/${productId}`,
    GET_PRODUCT_STATS: (productId: string) =>
      `${API_BASE_URL}/reviews/product/${productId}/stats`,
    GET_MY_REVIEWS: `${API_BASE_URL}/reviews/my-reviews`,
    UPDATE: (id: string) => `${API_BASE_URL}/reviews/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/reviews/${id}`,
  },

  // ==================
  // ADDRESSES ENDPOINTS
  // ==================
  ADDRESSES: {
    GET_ALL: `${API_BASE_URL}/addresses`,
    CREATE: `${API_BASE_URL}/addresses`,
    UPDATE: (id: string) => `${API_BASE_URL}/addresses/${id}`,
    SET_DEFAULT: (id: string) => `${API_BASE_URL}/addresses/${id}/set-default`,
    DELETE: (id: string) => `${API_BASE_URL}/addresses/${id}`,
  },

  // ==================
  // CONTACT ENDPOINTS
  // ==================
  CONTACT: {
    SUBMIT: `${API_BASE_URL}/contact`,
    GET_ALL: `${API_BASE_URL}/contact`,
    GET_MY_MESSAGES: `${API_BASE_URL}/contact/my-messages`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/contact/${id}/status`,
  },

  // ==================
  // INVENTORY ENDPOINTS
  // ==================
  INVENTORY: {
    GET_STOCK: `${API_BASE_URL}/inventory/stock`,
    GET_STOCK_BY_SKU: (skuId: string) =>
      `${API_BASE_URL}/inventory/stock/${skuId}`,
    INBOUND: (skuId: string) =>
      `${API_BASE_URL}/inventory/stock/${skuId}/inbound`,
    OUTBOUND: (skuId: string) =>
      `${API_BASE_URL}/inventory/stock/${skuId}/outbound`,
    RESERVE: (skuId: string) =>
      `${API_BASE_URL}/inventory/stock/${skuId}/reserve`,
    RELEASE: (skuId: string) =>
      `${API_BASE_URL}/inventory/stock/${skuId}/release`,
    GET_MOVEMENTS: (skuId: string) =>
      `${API_BASE_URL}/inventory/stock/${skuId}/movements`,
  },

  // ==================
  // PACKAGING ENDPOINTS
  // ==================
  PACKAGING: {
    GET_ALL: `${API_BASE_URL}/packaging`,
    CREATE: `${API_BASE_URL}/packaging`,
    UPDATE: (id: string) => `${API_BASE_URL}/packaging/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/packaging/${id}`,
  },

  // ==================
  // CATEGORIES ENDPOINTS
  // ==================
  CATEGORIES: {
    GET_ALL: `${API_BASE_URL}/categories`,
    GET_TREE: `${API_BASE_URL}/categories/tree`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/categories/${id}`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id: string) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/categories/${id}`,
  },

  // ==================
  // CATALOGS ENDPOINTS
  // ==================
  SIZES: {
    GET_ALL: `${API_BASE_URL}/sizes`,
    CREATE: `${API_BASE_URL}/sizes`,
    UPDATE: (id: string) => `${API_BASE_URL}/sizes/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/sizes/${id}`,
  },
  MATERIALS: {
    GET_ALL: `${API_BASE_URL}/materials`,
    CREATE: `${API_BASE_URL}/materials`,
    UPDATE: (id: string) => `${API_BASE_URL}/materials/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/materials/${id}`,
  },
  PRINT_METHODS: {
    GET_ALL: `${API_BASE_URL}/print-methods`,
    CREATE: `${API_BASE_URL}/print-methods`,
    UPDATE: (id: string) => `${API_BASE_URL}/print-methods/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/print-methods/${id}`,
  },

  // ==================
  // RETURN REASONS ENDPOINTS
  // ==================
  RETURN_REASONS: {
    GET_ALL: `${API_BASE_URL}/return-reasons`,
    CREATE: `${API_BASE_URL}/return-reasons`,
    UPDATE: (id: string) => `${API_BASE_URL}/return-reasons/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/return-reasons/${id}`,
  },

  // ==================
  // EMPLOYEES ENDPOINTS
  // ==================
  EMPLOYEES: {
    GET_ALL: `${API_BASE_URL}/employees`,
    CREATE: `${API_BASE_URL}/employees`,
    UPDATE: (id: string) => `${API_BASE_URL}/employees/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/employees/${id}`,
  },

  // ==================
  // ASSETS ENDPOINTS
  // ==================
  ASSETS: {
    GET_ALL: `${API_BASE_URL}/assets`,
    CREATE: `${API_BASE_URL}/assets`,
    UPDATE: (id: string) => `${API_BASE_URL}/assets/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/assets/${id}`,
    DISPOSE: (id: string) => `${API_BASE_URL}/assets/${id}/dispose`,
    GET_DISPOSALS: (id: string) => `${API_BASE_URL}/assets/${id}/disposals`,
  },

  // ==================
  // PAYMENT ENDPOINTS
  // ==================
  PAYMENTS: {
    INITIATE: `${API_BASE_URL}/payments/initiate`,
    VERIFY: (paymentId: string) => `${API_BASE_URL}/payments/${paymentId}/verify`,
    GET_STATUS: (paymentId: string) => `${API_BASE_URL}/payments/${paymentId}/status`,
    CANCEL: (paymentId: string) => `${API_BASE_URL}/payments/${paymentId}/cancel`,
    CALLBACK_VNPAY: `${API_BASE_URL}/payments/callback/vnpay`,
  },

  // ==================
  // PAYMENT METHODS ENDPOINTS
  // ==================
  PAYMENT_METHODS: {
    GET_ALL: `${API_BASE_URL}/payment-methods`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/payment-methods/${id}`,
    CREATE: `${API_BASE_URL}/payment-methods`,
    UPDATE: (id: string) => `${API_BASE_URL}/payment-methods/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/payment-methods/${id}`,
    SET_DEFAULT: (id: string) => `${API_BASE_URL}/payment-methods/${id}/set-default`,
  },
};

// ============================================
// FRONTEND PAGES TO API MAPPING
// ============================================

export const PAGE_API_MAPPING = {
  // Page: Home
  HOME: {
    featuredProducts: API_ENDPOINTS.PRODUCTS.GET_ALL,
    trendingDesigns: API_ENDPOINTS.DESIGNS.GET_TRENDING,
  },

  // Page: Shop Blanks
  SHOP_BLANKS: {
    products: API_ENDPOINTS.PRODUCTS.GET_BLANKS,
  },

  // Page: Blank Detail
  BLANK_DETAIL: {
    getProduct: (id: string) => API_ENDPOINTS.PRODUCTS.GET_BY_ID(id),
    addToCart: API_ENDPOINTS.CART.ADD_ITEM,
  },

  // Page: Customizer
  CUSTOMIZER: {
    getProduct: (id: string) => API_ENDPOINTS.PRODUCTS.GET_BY_ID(id),
    saveDesign: API_ENDPOINTS.CUSTOMIZER.SAVE_DESIGN,
    calculatePrice: API_ENDPOINTS.CUSTOMIZER.CALCULATE_PRICE,
    getSavedDesigns: API_ENDPOINTS.CUSTOMIZER.GET_SAVED_DESIGNS,
    addToCart: API_ENDPOINTS.CART.ADD_ITEM,
  },

  // Page: Design Gallery
  DESIGN_GALLERY: {
    designs: API_ENDPOINTS.DESIGNS.GET_ALL,
    trendingDesigns: API_ENDPOINTS.DESIGNS.GET_TRENDING,
    addToFavorites: API_ENDPOINTS.FAVORITES.ADD,
  },

  // Page: Favorites
  FAVORITES: {
    getFavorites: API_ENDPOINTS.FAVORITES.GET_ALL,
    removeFavorite: (id: string) => API_ENDPOINTS.FAVORITES.REMOVE(id),
  },

  // Page: Shopping Cart
  SHOPPING_CART: {
    getCart: API_ENDPOINTS.CART.GET,
    updateItem: (itemId: string) => API_ENDPOINTS.CART.UPDATE_ITEM(itemId),
    removeItem: (itemId: string) => API_ENDPOINTS.CART.REMOVE_ITEM(itemId),
    applyVoucher: API_ENDPOINTS.CART.APPLY_VOUCHER,
  },

  // Page: Checkout
  CHECKOUT: {
    getAddresses: API_ENDPOINTS.ADDRESSES.GET_ALL,
    createOrder: API_ENDPOINTS.ORDERS.CREATE,
  },

  // Page: Order Success
  ORDER_SUCCESS: {
    getOrder: (id: string) => API_ENDPOINTS.ORDERS.GET_BY_ID(id),
  },

  // Page: Order Tracking
  ORDER_TRACKING: {
    getTracking: (orderId: string) =>
      API_ENDPOINTS.SHIPMENTS.GET_BY_ORDER(orderId),
  },

  // Page: User Dashboard
  DASHBOARD: {
    getStats: API_ENDPOINTS.USERS.GET_DASHBOARD_STATS,
    getRecentOrders: API_ENDPOINTS.USERS.GET_RECENT_ORDERS,
    getTreesPlanted: API_ENDPOINTS.USERS.GET_TREES_PLANTED,
  },

  // Page: User Profile
  PROFILE: {
    getProfile: API_ENDPOINTS.USERS.GET_PROFILE,
    updateProfile: API_ENDPOINTS.USERS.UPDATE_PROFILE,
  },

  // Page: Contact
  CONTACT: {
    submitForm: API_ENDPOINTS.CONTACT.SUBMIT,
    getMyMessages: API_ENDPOINTS.CONTACT.GET_MY_MESSAGES,
  },

  // Page: Reviews
  REVIEWS: {
    createReview: API_ENDPOINTS.REVIEWS.CREATE,
    getProductReviews: (productId: string) =>
      API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT(productId),
  },
};

// ============================================
// HTTP HEADERS CONFIGURATION
// ============================================

export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// ============================================
// API HELPER FUNCTIONS
// ============================================

/**
 * Fetch with error handling
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  token?: string
): Promise<T> {
  const headers = getHeaders(token);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ============================================
// API SERVICES
// ============================================

export const apiServices = {
  // Auth Services
  auth: {
    register: (email: string, password: string, name: string) =>
      apiFetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      }),

    login: (email: string, password: string) =>
      apiFetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    forgotPassword: (email: string) =>
      apiFetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }, token: string) =>
      apiFetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: "POST",
        body: JSON.stringify(data),
      }, token),
  },

  // Products Services
  products: {
    getAll: (page = 1, limit = 10, params?: Record<string, any>) => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...params,
      });
      return apiFetch(`${API_ENDPOINTS.PRODUCTS.GET_ALL}?${query}`);
    },

    getBlanks: (page = 1, limit = 10, params?: Record<string, any>) => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(params || {}),
      });
      return apiFetch(`${API_ENDPOINTS.PRODUCTS.GET_BLANKS}?${query}`);
    },

    getReadyMade: (page = 1, limit = 10) =>
      apiFetch(
        `${API_ENDPOINTS.PRODUCTS.GET_READY_MADE}?page=${page}&limit=${limit}`
      ),

    getById: (id: string) => apiFetch(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id)),

    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PRODUCTS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PRODUCTS.UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    delete: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.PRODUCTS.DELETE(id),
        {
          method: "DELETE",
        },
        token
      ),

    // AI Recommendation Services
    getAITrending: (limit = 10) =>
      apiFetch(`${API_ENDPOINTS.PRODUCTS.GET_AI_TRENDING}?limit=${limit}`),

    getSimilar: (id: string, limit = 5) =>
      apiFetch(`${API_ENDPOINTS.PRODUCTS.GET_AI_SIMILAR(id)}?limit=${limit}`),

    getFrequentlyBought: (id: string, limit = 5) =>
      apiFetch(`${API_ENDPOINTS.PRODUCTS.GET_AI_FREQUENTLY_BOUGHT(id)}?limit=${limit}`),

    getRecommended: (token: string, limit = 5) =>
      apiFetch(`${API_ENDPOINTS.PRODUCTS.GET_AI_RECOMMENDED}?limit=${limit}`, undefined, token),
  },

  // Designs Services
  designs: {
    getAll: (page = 1, limit = 10, params?: Record<string, any>) => {
      const offset = (page - 1) * limit;
      const query = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(params || {}),
      });
      return apiFetch(`${API_ENDPOINTS.DESIGNS.GET_ALL}?${query}`);
    },

    getTrending: (limit = 10) =>
      apiFetch(`${API_ENDPOINTS.DESIGNS.GET_TRENDING}?limit=${limit}`),

    getRecommended: (token: string, limit = 5) =>
      apiFetch(`${API_ENDPOINTS.DESIGNS.GET_AI_RECOMMENDED}?limit=${limit}`, undefined, token),

    getById: (id: string) => apiFetch(API_ENDPOINTS.DESIGNS.GET_BY_ID(id)),
    
    search: (query: string, limit = 10) =>
      apiFetch(`${API_ENDPOINTS.DESIGNS.GET_ALL}?search=${encodeURIComponent(query)}&limit=${limit}`),
    
    filterByCategory: (category: string, limit = 10) =>
      apiFetch(`${API_ENDPOINTS.DESIGNS.GET_ALL}?category=${encodeURIComponent(category)}&limit=${limit}`),
    
    filterByTags: (tags: string[], limit = 10) =>
      apiFetch(`${API_ENDPOINTS.DESIGNS.GET_ALL}?tags=${encodeURIComponent(tags.join(','))}&limit=${limit}`),
  },

  // Cart Services
  cart: {
    get: (token: string) => apiFetch(API_ENDPOINTS.CART.GET, undefined, token),

    getSummary: (token: string) => apiFetch(API_ENDPOINTS.CART.SUMMARY, undefined, token),

    addItem: (item: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.CART.ADD_ITEM,
        {
          method: "POST",
          body: JSON.stringify(item),
        },
        token
      ),

    updateItem: (itemId: string, token: string, data: any) =>
      apiFetch(
        API_ENDPOINTS.CART.UPDATE_ITEM(itemId),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    removeItem: (itemId: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.CART.REMOVE_ITEM(itemId),
        {
          method: "DELETE",
        },
        token
      ),

    clear: (token: string) =>
      apiFetch(
        API_ENDPOINTS.CART.CLEAR,
        {
          method: "DELETE",
        },
        token
      ),

    applyVoucher: (code: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.CART.APPLY_VOUCHER,
        {
          method: "POST",
          body: JSON.stringify({ voucherCode: code }),
        },
        token
      ),
  },

  // Orders Services
  orders: {
    create: (orderData: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.ORDERS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(orderData),
        },
        token
      ),

    getAll: (token: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return apiFetch(
        API_ENDPOINTS.ORDERS.GET_ALL + queryString,
        undefined,
        token
      );
    },

    getMyOrders: (token: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return apiFetch(
        API_ENDPOINTS.ORDERS.GET_MY_ORDERS + queryString,
        undefined,
        token
      );
    },

    getById: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.ORDERS.GET_BY_ID(id), undefined, token),

    getTracking: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.ORDERS.GET_TRACKING(id), undefined, token),

    cancel: (orderId: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.ORDERS.CANCEL(orderId),
        {
          method: "PATCH",
        },
        token
      ),

    getStats: (token: string) =>
      apiFetch(API_ENDPOINTS.ORDERS.GET_STATS, undefined, token),
  },

  // Shipments Services
  shipments: {
    getByOrder: (orderId: string, token: string) =>
      apiFetch(API_ENDPOINTS.SHIPMENTS.GET_BY_ORDER(orderId), undefined, token),

    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.SHIPMENTS.UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),
  },

  // Users Services
  users: {
    getProfile: (token: string) =>
      apiFetch(API_ENDPOINTS.USERS.GET_PROFILE, undefined, token),

    updateProfile: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    getDashboardStats: (token: string) =>
      apiFetch(API_ENDPOINTS.USERS.GET_DASHBOARD_STATS, undefined, token),

    getRecentOrders: (token: string, limit = 5) =>
      apiFetch(
        `${API_ENDPOINTS.USERS.GET_RECENT_ORDERS}?limit=${limit}`,
        undefined,
        token
      ),

    getTreesPlanted: (token: string) =>
      apiFetch(API_ENDPOINTS.USERS.GET_TREES_PLANTED, undefined, token),

    // Admin services
    getAll: (token: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return apiFetch(
        API_ENDPOINTS.USERS.GET_ALL + queryString,
        undefined,
        token
      );
    },

    getById: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.USERS.GET_BY_ID(id), undefined, token),

    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.USERS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.USERS.UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    activate: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.USERS.ACTIVATE(id),
        {
          method: "PATCH",
        },
        token
      ),

    deactivate: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.USERS.DEACTIVATE(id),
        {
          method: "PATCH",
        },
        token
      ),

    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.USERS.DELETE(id), { method: "DELETE" }, token),

    getStats: (token: string) =>
      apiFetch(API_ENDPOINTS.USERS.GET_STATS, undefined, token),
  },

  // Contact Services
  contact: {
    submit: (data: any) =>
      apiFetch(API_ENDPOINTS.CONTACT.SUBMIT, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getMyMessages: (token: string) =>
      apiFetch(API_ENDPOINTS.CONTACT.GET_MY_MESSAGES, undefined, token),
  },

  // Addresses Services
  addresses: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.ADDRESSES.GET_ALL, undefined, token),

    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.ADDRESSES.CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.ADDRESSES.UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    setDefault: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id),
        {
          method: "PATCH",
        },
        token
      ),

    delete: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.ADDRESSES.DELETE(id),
        {
          method: "DELETE",
        },
        token
      ),
  },

  // Favorites Services
  favorites: {
    add: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.FAVORITES.ADD,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.FAVORITES.GET_ALL, undefined, token),

    check: (productId: string | undefined, designId: string | undefined, token: string) => {
      const params = new URLSearchParams();
      if (productId) params.append('productId', productId);
      if (designId) params.append('designId', designId);
      return apiFetch(
        `${API_ENDPOINTS.FAVORITES.CHECK}?${params}`,
        undefined,
        token
      );
    },

    remove: (favoriteId: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.FAVORITES.REMOVE(favoriteId),
        {
          method: "DELETE",
        },
        token
      ),
  },

  // Reviews Services
  reviews: {
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.REVIEWS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    getByProduct: (productId: string, page = 1, limit = 10) =>
      apiFetch(
        `${API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT(
          productId
        )}?page=${page}&limit=${limit}`
      ),

    getProductStats: (productId: string) =>
      apiFetch(API_ENDPOINTS.REVIEWS.GET_PRODUCT_STATS(productId)),

    getMyReviews: (token: string, page = 1, limit = 10) => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      return apiFetch(
        `${API_ENDPOINTS.REVIEWS.GET_MY_REVIEWS}?${query}`,
        undefined,
        token
      );
    },

    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.REVIEWS.UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    delete: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.REVIEWS.DELETE(id),
        {
          method: "DELETE",
        },
        token
      ),
  },

  // Vouchers Services
  vouchers: {
    getMyVouchers: (token: string) =>
      apiFetch(API_ENDPOINTS.VOUCHERS.MY_VOUCHERS, undefined, token),

    validate: (code: string, orderAmount: number, token: string) => {
      const query = new URLSearchParams({
        code: code.toUpperCase().trim(),
        orderAmount: orderAmount.toString(),
      });
      return apiFetch(
        `${API_ENDPOINTS.VOUCHERS.VALIDATE}?${query}`,
        undefined,
        token
      );
    },

    // Admin services (if available)
    getAll: (token: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return apiFetch(
        API_ENDPOINTS.VOUCHERS.GET_ALL + queryString,
        undefined,
        token
      );
    },

    getById: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.VOUCHERS.GET_BY_ID(id), undefined, token),

    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.VOUCHERS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.VOUCHERS.UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.VOUCHERS.DELETE(id), { method: "DELETE" }, token),
  },

  // Rewards Services
  rewards: {
    getBalance: (token: string) =>
      apiFetch(API_ENDPOINTS.REWARDS.GET_BALANCE, undefined, token),

    getHistory: (token: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return apiFetch(
        API_ENDPOINTS.REWARDS.GET_HISTORY + queryString,
        undefined,
        token
      );
    },

    getCatalog: (token: string) =>
      apiFetch(API_ENDPOINTS.REWARDS.GET_CATALOG, undefined, token),

    redeem: (rewardId: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.REWARDS.REDEEM(rewardId),
        {
          method: "POST",
        },
        token
      ),

    // Admin catalog services (if available)
    catalogGetAll: (token: string) =>
      apiFetch(API_ENDPOINTS.REWARDS.CATALOG_GET_ALL, undefined, token),

    catalogGetById: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.REWARDS.CATALOG_GET_BY_ID(id), undefined, token),

    catalogCreate: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.REWARDS.CATALOG_CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    catalogUpdate: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.REWARDS.CATALOG_UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    catalogDelete: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.REWARDS.CATALOG_DELETE(id),
        { method: "DELETE" },
        token
      ),
  },

  // Customizer Services
  customizer: {
    saveDesign: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.CUSTOMIZER.SAVE_DESIGN,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    getSavedDesigns: (token: string) =>
      apiFetch(API_ENDPOINTS.CUSTOMIZER.GET_SAVED_DESIGNS, undefined, token),

    getSavedDesignById: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.CUSTOMIZER.GET_SAVED_DESIGN_BY_ID(id), undefined, token),

    deleteSavedDesign: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.CUSTOMIZER.DELETE_SAVED_DESIGN(id), { method: "DELETE" }, token),

    calculatePrice: (data: any, token?: string) =>
      apiFetch(
        API_ENDPOINTS.CUSTOMIZER.CALCULATE_PRICE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token // Optional - endpoint is public
      ),
  },

  // Payment Services
  payments: {
    initiate: (data: {
      orderId: string;
      amount: number;
      paymentMethodId: string;
      description: string;
    }, token: string) =>
      apiFetch(
        API_ENDPOINTS.PAYMENTS.INITIATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    verify: (paymentId: string, transactionId: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.PAYMENTS.VERIFY(paymentId),
        {
          method: "POST",
          body: JSON.stringify({ transactionId }),
        },
        token
      ),

    getStatus: (paymentId: string, token: string) =>
      apiFetch(API_ENDPOINTS.PAYMENTS.GET_STATUS(paymentId), undefined, token),

    cancel: (paymentId: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.PAYMENTS.CANCEL(paymentId),
        { method: "POST" },
        token
      ),
  },

  // Inventory Services
  inventory: {
    getStock: (token: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return apiFetch(
        API_ENDPOINTS.INVENTORY.GET_STOCK + queryString,
        undefined,
        token
      );
    },
    getStockBySku: (skuId: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.INVENTORY.GET_STOCK_BY_SKU(skuId),
        undefined,
        token
      ),
    inbound: (skuId: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.INVENTORY.INBOUND(skuId),
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    outbound: (skuId: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.INVENTORY.OUTBOUND(skuId),
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    reserve: (skuId: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.INVENTORY.RESERVE(skuId),
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    release: (skuId: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.INVENTORY.RELEASE(skuId),
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    getMovements: (skuId: string, token: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return apiFetch(
        API_ENDPOINTS.INVENTORY.GET_MOVEMENTS(skuId) + queryString,
        undefined,
        token
      );
    },
  },

  // Packaging Services
  packaging: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.PACKAGING.GET_ALL, undefined, token),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PACKAGING.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PACKAGING.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.PACKAGING.DELETE(id), { method: "DELETE" }, token),
  },

  // Categories Services
  categories: {
    getAll: () => apiFetch(API_ENDPOINTS.CATEGORIES.GET_ALL),
    getTree: () => apiFetch(API_ENDPOINTS.CATEGORIES.GET_TREE),
    getById: (id: string) => apiFetch(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id)),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.CATEGORIES.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.CATEGORIES.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.CATEGORIES.DELETE(id), { method: "DELETE" }, token),
  },

  // Catalog Services
  sizes: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.SIZES.GET_ALL, undefined, token),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.SIZES.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.SIZES.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.SIZES.DELETE(id), { method: "DELETE" }, token),
  },
  materials: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.MATERIALS.GET_ALL, undefined, token),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.MATERIALS.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.MATERIALS.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.MATERIALS.DELETE(id), { method: "DELETE" }, token),
  },
  printMethods: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.PRINT_METHODS.GET_ALL, undefined, token),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PRINT_METHODS.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PRINT_METHODS.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.PRINT_METHODS.DELETE(id),
        { method: "DELETE" },
        token
      ),
  },

  // Return Reasons Services
  returnReasons: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.RETURN_REASONS.GET_ALL, undefined, token),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.RETURN_REASONS.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.RETURN_REASONS.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.RETURN_REASONS.DELETE(id),
        { method: "DELETE" },
        token
      ),
  },

  // Employees Services
  employees: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.EMPLOYEES.GET_ALL, undefined, token),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.EMPLOYEES.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.EMPLOYEES.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.EMPLOYEES.DELETE(id), { method: "DELETE" }, token),
  },

  // Assets Services
  assets: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.ASSETS.GET_ALL, undefined, token),
    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.ASSETS.CREATE,
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.ASSETS.UPDATE(id),
        { method: "PATCH", body: JSON.stringify(data) },
        token
      ),
    delete: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.ASSETS.DELETE(id), { method: "DELETE" }, token),
    dispose: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.ASSETS.DISPOSE(id),
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    getDisposals: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.ASSETS.GET_DISPOSALS(id), undefined, token),
  },

  // Payment Methods Services
  paymentMethods: {
    getAll: (token: string) =>
      apiFetch(API_ENDPOINTS.PAYMENT_METHODS.GET_ALL, undefined, token),

    getById: (id: string, token: string) =>
      apiFetch(API_ENDPOINTS.PAYMENT_METHODS.GET_BY_ID(id), undefined, token),

    create: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PAYMENT_METHODS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    update: (id: string, data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PAYMENT_METHODS.UPDATE(id),
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    delete: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.PAYMENT_METHODS.DELETE(id),
        { method: "DELETE" },
        token
      ),

    setDefault: (id: string, token: string) =>
      apiFetch(
        API_ENDPOINTS.PAYMENT_METHODS.SET_DEFAULT(id),
        {
          method: "PATCH",
        },
        token
      ),
  },

  // Admin Services (require admin role)
  admin: {
    // Orders
    updateOrderStatus: (orderId: string, status: string, token: string) =>
      apiFetch(
        `${API_BASE_URL}/orders/${orderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
        token
      ),

    // Designs
    updateDesignStatus: (designId: string, status: string, token: string) =>
      apiFetch(
        `${API_BASE_URL}/designs/${designId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
        token
      ),

    // Products
    createProduct: (data: any, token: string) =>
      apiFetch(
        API_ENDPOINTS.PRODUCTS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      ),

    updateProduct: (productId: string, data: any, token: string) =>
      apiFetch(
        `${API_BASE_URL}/products/${productId}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token
      ),

    deleteProduct: (productId: string, token: string) =>
      apiFetch(
        `${API_BASE_URL}/products/${productId}`,
        {
          method: "DELETE",
        },
        token
      ),
  },
};

// ============================================
// EXPORT CONFIGURATION
// ============================================

export default {
  API_BASE_URL,
  SWAGGER_URL,
  API_ENDPOINTS,
  PAGE_API_MAPPING,
  apiServices,
  apiFetch,
  getHeaders,
  INITIALIZE_DEMO_DATA,
};
