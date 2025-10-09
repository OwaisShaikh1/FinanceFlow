// TaxPro Theme Utilities
// Helper functions and constants for consistent theme application

export const themeClasses = {
  // Status Colors
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-700 border-green-200'
  },
  warning: {
    bg: 'bg-blue-50',  // Changed from amber/yellow to blue
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-700 border-red-200'
  },
  
  // Primary Colors
  primary: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    text: 'text-blue-700',
    textDark: 'text-blue-900',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50'
  },

  // Cards
  card: {
    base: 'bg-white border border-blue-100 rounded-lg shadow-sm',
    gradient: 'bg-gradient-to-br from-white to-blue-50',
    hover: 'hover:shadow-lg transition-all duration-300'
  },

  // Stats Cards
  stats: {
    total: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600'
    },
    success: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600'
    },
    warning: {
      bg: 'bg-gradient-to-br from-blue-50 to-sky-50', // Changed from amber to blue
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600'
    },
    error: {
      bg: 'bg-gradient-to-br from-red-50 to-rose-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600'
    }
  }
}

// Helper function to get status classes
export function getStatusClasses(status: 'success' | 'warning' | 'error' | 'pending' | 'overdue' | 'completed') {
  switch (status) {
    case 'success':
    case 'completed':
      return themeClasses.success
    case 'warning':
    case 'pending':
      return themeClasses.warning
    case 'error':
    case 'overdue':
      return themeClasses.error
    default:
      return themeClasses.primary
  }
}

// Helper function to get priority classes
export function getPriorityClasses(priority: 'high' | 'medium' | 'low') {
  switch (priority) {
    case 'high':
      return themeClasses.error
    case 'medium':
      return themeClasses.warning
    case 'low':
      return themeClasses.success
    default:
      return themeClasses.primary
  }
}