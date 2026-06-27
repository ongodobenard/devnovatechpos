import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pos.devnovatech.co.ke/backend/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('pos_user')
    if (stored) {
        const user = JSON.parse(stored)
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
    }
    return config
})

// Log the real reason behind any failed request
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[axios error]', {
            message: error.message,
            code: error.code,
            url: error.config?.url,
            fullURL: (error.config?.baseURL || '') + (error.config?.url || ''),
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
        })
        return Promise.reject(error)
    }
)

export const authAPI = {
    login: (email, password) => api.post('/auth.php?action=login', { email, password }),
    logout: () => api.get('/auth.php?action=logout'),
    me: () => api.get('/users.php?action=me'),
}

export const productsAPI = {
    list: (business_id) => api.get(`/products.php?action=list&business_id=${business_id}`),
    add: (data) => api.post('/products.php?action=add', data),
    update: (data) => api.put('/products.php?action=update', data),
    delete: (id) => api.delete(`/products.php?action=delete&id=${id}`),
    lowStock: (business_id) => api.get(`/products.php?action=low_stock&business_id=${business_id}`),
}

export const salesAPI = {
    list:        (business_id, date) => api.get(`/sales.php?action=list&business_id=${business_id}&date=${date}`),
    listAll:     (business_id, from, to) => api.get(`/sales.php?action=list_all&business_id=${business_id}&from=${from}&to=${to}`),
    create:      (data)       => api.post('/sales.php?action=create', data),
    receipt:     (sale_id)    => api.get(`/sales.php?action=receipt&sale_id=${sale_id}`),
    return:      (sale_id, admin_password, business_id) => api.post('/sales.php?action=return', { sale_id, admin_password, business_id }),
    dailySummary:(business_id, date) => api.get(`/sales.php?action=daily_summary&business_id=${business_id}&date=${date}`),
}

export const reportsAPI = {
    salesSummary:   (business_id, from, to) => api.get(`/reports.php?action=sales_summary&business_id=${business_id}&from=${from}&to=${to}`),
    topProducts:    (business_id, from, to) => api.get(`/reports.php?action=top_products&business_id=${business_id}&from=${from}&to=${to}`),
    stockValue:     (business_id)           => api.get(`/reports.php?action=stock_value&business_id=${business_id}`),
    dashboardStats: (business_id)           => api.get(`/reports.php?action=dashboard_stats&business_id=${business_id}`),
    fullReport:     (business_id, from, to, period) => api.get(`/reports.php?action=full_report&business_id=${business_id}&from=${from}&to=${to}&period=${period}`),
}

export const businessesAPI = {
    list: () => api.get('/businesses.php?action=list'),
    create: (data) => api.post('/businesses.php?action=create', data),
    update: (data) => api.put('/businesses.php?action=update', data),
    delete: (id) => api.delete(`/businesses.php?action=delete&id=${id}`),
    single: (id) => api.get(`/businesses.php?action=single&id=${id}`),
}

export const usersAPI = {
    list: (business_id) => api.get(`/users.php?action=list&business_id=${business_id}`),
    create: (data) => api.post('/users.php?action=create', data),
    update: (data) => api.put('/users.php?action=update', data),
    delete: (id) => api.delete(`/users.php?action=delete&id=${id}`),
}

export const customersAPI = {
    list: (business_id) => api.get(`/customers.php?action=list&business_id=${business_id}`),
    create: (data) => api.post('/customers.php?action=create', data),
    update: (data) => api.put('/customers.php?action=update', data),
    delete: (id) => api.delete(`/customers.php?action=delete&id=${id}`),
}

export const expensesAPI = {
    list: (business_id, month) => api.get(`/expenses.php?action=list&business_id=${business_id}&month=${month}`),
    create: (data) => api.post('/expenses.php?action=create', data),
    update: (data) => api.put('/expenses.php?action=update', data),
    delete: (id) => api.delete(`/expenses.php?action=delete&id=${id}`),
}

export const categoriesAPI = {
    list:   (business_id) => api.get(`/categories.php?action=list&business_id=${business_id}`),
    create: (data)        => api.post('/categories.php?action=create', data),
    delete: (id)          => api.delete(`/categories.php?action=delete&id=${id}`),
}

export default api