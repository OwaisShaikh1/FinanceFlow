// TaxPro Accounting Theme Configuration
export const taxProTheme = {
  // Primary Colors
  primary: {
    50: '#eff6ff',   // Very light blue background
    100: '#dbeafe',  // Light blue backgrounds
    200: '#bfdbfe',  // Border colors
    300: '#93c5fd',  // Subtle accents
    400: '#60a5fa',  // Medium blue
    500: '#3b82f6',  // Primary blue
    600: '#2563eb',  // Primary dark blue
    700: '#1d4ed8',  // Dark blue text
    800: '#1e40af',  // Very dark blue
    900: '#1e3a8a',  // Darkest blue
  },

  // Secondary Colors (Slate for text and neutral elements)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Status Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Component Styles
  components: {
    // Card styling
    card: {
      background: 'bg-gradient-to-br from-white to-blue-50',
      border: 'border-blue-200',
      shadow: 'shadow-sm',
      hover: 'hover:shadow-lg transition-all duration-300',
    },

    // Header styling
    header: {
      background: 'bg-white',
      border: 'border-b border-blue-100',
      text: 'text-blue-900',
    },

    // Button styling
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50',
      outline: 'border border-blue-300 text-blue-700 hover:bg-blue-50',
    },

    // Input styling
    input: {
      base: 'bg-white border-blue-200 hover:border-blue-300 focus:border-blue-500',
      focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20',
    },

    // Navigation
    navigation: {
      background: 'bg-white',
      border: 'border-r border-blue-100',
      activeItem: 'bg-blue-100 text-blue-700',
      inactiveItem: 'text-slate-600 hover:text-blue-600 hover:bg-blue-50',
    },

    // Tabs
    tabs: {
      background: 'bg-blue-50 border border-blue-200',
      active: 'data-[state=active]:bg-blue-600 data-[state=active]:text-white',
      inactive: 'text-blue-600 hover:bg-blue-100',
    },

    // Stats/Dashboard cards
    stats: {
      background: 'bg-gradient-to-br from-white to-blue-50',
      border: 'border-blue-100',
      title: 'text-blue-700',
      value: 'text-blue-900',
      change: 'text-blue-600',
    },
  },

  // Typography
  typography: {
    heading: 'text-blue-900 font-bold',
    subheading: 'text-blue-700 font-semibold',
    body: 'text-slate-600',
    caption: 'text-blue-600 text-sm',
    muted: 'text-slate-500',
  },

  // Layout
  layout: {
    container: 'bg-slate-50',
    sidebar: 'bg-white border-r border-blue-100',
    main: 'bg-slate-50',
    section: 'bg-white rounded-lg border border-blue-100',
  },
}

// CSS Custom Properties for consistent theming
export const cssVariables = `
  :root {
    --primary-50: 239 246 255;
    --primary-100: 219 234 254;
    --primary-200: 191 219 254;
    --primary-300: 147 197 253;
    --primary-400: 96 165 250;
    --primary-500: 59 130 246;
    --primary-600: 37 99 235;
    --primary-700: 29 78 216;
    --primary-800: 30 64 175;
    --primary-900: 30 58 138;
    
    --secondary-50: 248 250 252;
    --secondary-100: 241 245 249;
    --secondary-200: 226 232 240;
    --secondary-300: 203 213 225;
    --secondary-400: 148 163 184;
    --secondary-500: 100 116 139;
    --secondary-600: 71 85 105;
    --secondary-700: 51 65 85;
    --secondary-800: 30 41 59;
    --secondary-900: 15 23 42;
  }
`

// Utility classes for consistent styling
export const themeClasses = {
  // Page layouts
  pageContainer: 'min-h-screen bg-slate-50',
  pageHeader: 'bg-white border-b border-blue-100 px-6 py-4',
  pageTitle: 'text-3xl font-bold text-blue-900',
  pageSubtitle: 'text-slate-600 mt-2',
  
  // Content areas
  contentArea: 'p-6 space-y-6',
  section: 'bg-white rounded-lg border border-blue-100 p-6',
  
  // Cards
  card: 'bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300',
  cardHeader: 'border-b border-blue-100 pb-4 mb-6',
  cardTitle: 'text-xl font-semibold text-blue-900',
  cardSubtitle: 'text-sm text-blue-700 mt-1',
  
  // Forms
  formGroup: 'space-y-2',
  label: 'text-sm font-medium text-blue-700',
  input: 'bg-white border border-blue-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 rounded-md',
  
  // Buttons
  buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors',
  buttonSecondary: 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-md transition-colors',
  buttonOutline: 'border border-blue-300 text-blue-700 hover:bg-blue-50 font-medium px-4 py-2 rounded-md transition-colors',
  
  // Navigation
  navItem: 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors',
  navItemActive: 'bg-blue-100 text-blue-700 px-3 py-2 rounded-md',
  
  // Stats
  statCard: 'bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-6 hover:shadow-md transition-shadow',
  statTitle: 'text-sm font-medium text-blue-700',
  statValue: 'text-3xl font-bold text-blue-900 mt-2',
  statChange: 'text-sm text-blue-600 mt-1',
  
  // Tables
  table: 'bg-white border border-blue-100 rounded-lg overflow-hidden',
  tableHeader: 'bg-blue-50 border-b border-blue-100',
  tableHeaderCell: 'text-left text-sm font-medium text-blue-700 px-4 py-3',
  tableCell: 'text-sm text-slate-600 px-4 py-3 border-b border-blue-50',
  
  // Badges
  badgeSuccess: 'bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full text-xs font-medium',
  badgeWarning: 'bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full text-xs font-medium',
  badgeError: 'bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-full text-xs font-medium',
  badgeInfo: 'bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded-full text-xs font-medium',
}

export default taxProTheme