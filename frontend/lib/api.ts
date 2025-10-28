// Consolidated API utilities
import { toast } from "@/hooks/use-toast"

// ===================== API CONFIGURATION =====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// ===================== REQUEST HELPERS =====================
class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...options.headers
    }

    try {
      const response = await fetch(url, { ...options, headers })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // HTTP Methods
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options })
  }

  post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
  }

  put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }
}

// ===================== API INSTANCES =====================
export const api = new ApiClient()

// ===================== SPECIFIC API SERVICES =====================
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    api.post('/api/auth/register', userData),
  
  googleLogin: (googleData: any) =>
    api.post('/api/auth/google', googleData),
  
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email })
}

export const userAPI = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data: any) => api.put('/api/user/profile', data),
  completeProfile: (data: any) => api.post('/api/user/complete-profile', data),
  
  getClients: (params?: any) => api.get(`/api/user/clients${params ? `?${new URLSearchParams(params)}` : ''}`),
  getClientStats: () => api.get('/api/user/clients/stats'),
  getClient: (id: string) => api.get(`/api/user/clients/${id}`)
}

export const taxAPI = {
  calculate: (data: any) => api.post('/api/tax/calculate', data),
  saveCalculation: (data: any) => api.post('/api/tax/save', data),
  getCalculations: () => api.get('/api/tax/calculations')
}

export const invoiceAPI = {
  create: (data: any) => api.post('/api/invoice', data),
  getAll: (params?: any) => api.get(`/api/invoice${params ? `?${new URLSearchParams(params)}` : ''}`),
  getById: (id: string) => api.get(`/api/invoice/${id}`),
  update: (id: string, data: any) => api.put(`/api/invoice/${id}`, data),
  delete: (id: string) => api.delete(`/api/invoice/${id}`)
}

export const gstAPI = {
  getDashboard: () => api.get('/api/gst/dashboard'),
  calculate: (data: any) => api.post('/api/gst/calculate', data),
  fileReturn: (data: any) => api.post('/api/gst/file-return', data)
}

export const tdsAPI = {
  calculate: (data: any) => api.post('/api/tds/calculate', data),
  getDashboard: () => api.get('/api/tds/dashboard'),
  getSections: () => api.get('/api/tds/sections')
}

// ===================== ERROR HANDLING =====================
export const handleApiError = (error: any, customMessage?: string) => {
  const message = error.message || customMessage || 'An error occurred'
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive'
  })
  
  console.error('API Error:', error)
  return message
}

// ===================== SUCCESS HANDLING =====================
export const handleApiSuccess = (message: string) => {
  toast({
    title: 'Success',
    description: message
  })
}

export default api