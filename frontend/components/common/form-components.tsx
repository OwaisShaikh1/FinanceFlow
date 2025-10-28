// Consolidated form components with consistent styling
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

// ===================== FORM FIELD =====================
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const FormField = ({ label, error, required, children, className }: FormFieldProps) => (
  <div className={cn("space-y-2", className)}>
    <Label className={cn(
      "text-sm font-medium text-blue-900",
      required && "after:content-['*'] after:ml-0.5 after:text-red-500"
    )}>
      {label}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-red-600 font-medium">{error}</p>
    )}
  </div>
)

// ===================== FORM INPUT =====================
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, className, ...props }, ref) => (
    <FormField label={label} error={error} required={required}>
      <Input
        ref={ref}
        className={cn(
          "border-blue-200 focus:border-blue-500 focus:ring-blue-500",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    </FormField>
  )
)
FormInput.displayName = "FormInput"

// ===================== FORM SELECT =====================
interface FormSelectProps {
  label: string
  error?: string
  required?: boolean
  placeholder?: string
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  className?: string
}

export const FormSelect = ({ 
  label, 
  error, 
  required, 
  placeholder, 
  value, 
  onValueChange, 
  options,
  className 
}: FormSelectProps) => (
  <FormField label={label} error={error} required={required}>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(
        "border-blue-200 focus:border-blue-500 focus:ring-blue-500",
        error && "border-red-300 focus:border-red-500 focus:ring-red-500",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormField>
)

// ===================== FORM TEXTAREA =====================
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, className, ...props }, ref) => (
    <FormField label={label} error={error} required={required}>
      <Textarea
        ref={ref}
        className={cn(
          "border-blue-200 focus:border-blue-500 focus:ring-blue-500 resize-none",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    </FormField>
  )
)
FormTextarea.displayName = "FormTextarea"

// ===================== LOADING BUTTON =====================
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading, loadingText, disabled, className, ...props }, ref) => (
    <Button
      ref={ref}
      disabled={disabled || loading}
      className={cn("relative", className)}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? (loadingText || children) : children}
    </Button>
  )
)
LoadingButton.displayName = "LoadingButton"

// ===================== SECTION HEADER =====================
interface SectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const SectionHeader = ({ title, description, action, className }: SectionHeaderProps) => (
  <div className={cn("flex items-center justify-between", className)}>
    <div>
      <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
      {description && (
        <p className="text-slate-600 mt-1">{description}</p>
      )}
    </div>
    {action}
  </div>
)

// ===================== EMPTY STATE =====================
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => (
  <div className={cn("text-center py-12", className)}>
    <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action}
  </div>
)

// ===================== STATUS BADGE =====================
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
  className?: string
}

export const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-blue-100 text-blue-800 border-blue-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      variants[status],
      className
    )}>
      {children}
    </span>
  )
}

// ===================== CARD WRAPPER =====================
interface CardWrapperProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export const CardWrapper = ({ title, description, children, className, headerAction }: CardWrapperProps) => (
  <div className={cn(
    "bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden",
    className
  )}>
    {(title || description || headerAction) && (
      <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-blue-900">{title}</h3>}
            {description && <p className="text-sm text-blue-600 mt-1">{description}</p>}
          </div>
          {headerAction}
        </div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
)