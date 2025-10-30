// Consolidated custom hooks for common functionality
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { api, handleApiError, handleApiSuccess } from '@/lib/api'

// ===================== AUTHENTICATION HOOK =====================
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const loadUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Error loading user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials: any) => {
    try {
      setLoading(true)
      const response = await api.post<any>('/api/auth/login', credentials)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      setUser(response.data.user)
      setIsAuthenticated(true)
      
      handleApiSuccess('Login successful')
      router.push('/dashboard')
    } catch (error) {
      handleApiError(error, 'Login failed')
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/auth/login')
  }, [router])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    setUser
  }
}

// ===================== API HOOK =====================
interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export const useApi = <T>(
  apiCall: () => Promise<any>,
  dependencies: any[] = [],
  immediate = true
) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiCall()
      setState({
        data: response.data || response,
        loading: false,
        error: null
      })
      return response.data || response
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred'
      setState({
        data: null,
        loading: false,
        error: errorMessage
      })
      throw error
    }
  }, [apiCall])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, dependencies)

  return {
    ...state,
    execute,
    refetch: execute
  }
}

// ===================== FORM HOOK =====================
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    if (validate) {
      const fieldErrors = validate(values)
      if (fieldErrors[field]) {
        setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }))
      }
    }
  }, [values, validate])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    setLoading(true)
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)

    // Validate all fields
    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)
      
      if (Object.keys(validationErrors).length > 0) {
        setLoading(false)
        return
      }
    }

    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }, [values, validate, onSubmit])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setLoading(false)
  }, [initialValues])

  return {
    values,
    errors,
    loading,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors
  }
}

// ===================== LOCAL STORAGE HOOK =====================
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// ===================== DEBOUNCE HOOK =====================
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ===================== PAGINATION HOOK =====================
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useMemo(() => 
    Math.ceil(totalItems / itemsPerPage), 
    [totalItems, itemsPerPage]
  )

  const startIndex = useMemo(() => 
    (currentPage - 1) * itemsPerPage, 
    [currentPage, itemsPerPage]
  )

  const endIndex = useMemo(() => 
    Math.min(startIndex + itemsPerPage, totalItems), 
    [startIndex, itemsPerPage, totalItems]
  )

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}