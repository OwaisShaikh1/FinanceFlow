"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect, useReducer } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

// Transaction state interface
interface TransactionState {
  description: string;
  amount: string;
  category: string;
  reference: string;
  notes: string;
  isLoading: boolean;
  error: string | null;
}

type TransactionAction =
  | { type: 'UPDATE_FIELD'; field: keyof TransactionState; value: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FORM' };

const initialState: TransactionState = {
  description: "",
  amount: "",
  category: "",
  reference: "",
  notes: "",
  isLoading: false,
  error: null,
};

// Reducer for transaction state management
function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        error: null, // Clear error when user makes changes
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'RESET_FORM':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

const transactionCategories = {
  income: ["Sales Revenue", "Service Income", "Interest Income", "Rental Income", "Other Income"],
  expense: [
    "Office Rent",
    "Utilities", 
    "Office Supplies",
    "Travel & Transportation",
    "Marketing & Advertising",
    "Professional Services",
    "Insurance",
    "Maintenance & Repairs",
    "Salaries & Wages",
    "Other Expenses",
  ],
};

interface TransactionFormProps {
  onSubmit?: (data: any) => void;
  initialData?: Partial<TransactionState & { date: Date; type: "income" | "expense" }>;
  isEditing?: boolean;
}

export function TransactionForm({ onSubmit, initialData, isEditing = false }: TransactionFormProps) {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();

  // Use useReducer for complex transaction state
  const [state, dispatch] = useReducer(transactionReducer, {
    ...initialState,
    ...initialData,
  });

  // Local state for date, type, and attachments
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [type, setType] = useState<"income" | "expense">(initialData?.type || "income");
  const [attachments, setAttachments] = useState<File[]>([]);

  // useRef for form elements
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect to focus on description field when component mounts
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, []);

  // useEffect to handle URL parameter for transaction type
  useEffect(() => {
    const typeParam = searchParams?.get('type');
    if (typeParam === 'income' || typeParam === 'expense') {
      setType(typeParam);
    }
  }, [searchParams]);

  // Clear error when user types
  useEffect(() => {
    if (state.error) {
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  }, [state.description, state.amount, state.category, state.error]);

  // useCallback for state updates
  const updateField = useCallback((field: keyof TransactionState, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // useCallback for file handling
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
    }
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // useCallback for type and date changes
  const handleTypeChange = useCallback((value: "income" | "expense") => {
    setType(value);
    // Reset category when type changes
    updateField('category', '');
  }, [updateField]);

  const handleDateChange = useCallback((selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, []);

  // useCallback for form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add transaction data
      formData.append('description', state.description);
      formData.append('amount', state.amount);
      formData.append('type', type);
      formData.append('category', state.category);
      formData.append('date', date.toISOString());
      formData.append('reference', state.reference);
      formData.append('notes', state.notes);
      formData.append('userId', user?.id || '');

      // Add attachments
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const endpoint = isEditing ? '/api/transactions/update' : '/api/transactions/create';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save transaction');
      }

      console.log('Transaction saved successfully:', data);

      if (onSubmit) {
        onSubmit({
          ...state,
          date,
          type,
          attachments,
        });
      }

      // Reset form if creating new transaction
      if (!isEditing) {
        dispatch({ type: 'RESET_FORM' });
        setDate(new Date());
        setAttachments([]);
      }

    } catch (error) {
      console.error('Transaction submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [state, date, type, attachments, token, user?.id, onSubmit, isEditing, setLoading, setError]);

  // useMemo for computed values
  const categories = useMemo(() => {
    return transactionCategories[type] || [];
  }, [type]);

  const isFormValid = useMemo(() => {
    return (
      state.description.trim() &&
      state.amount.trim() &&
      !isNaN(parseFloat(state.amount)) &&
      parseFloat(state.amount) > 0 &&
      state.category &&
      date
    );
  }, [state.description, state.amount, state.category, date]);

  const totalAttachmentSize = useMemo(() => {
    return attachments.reduce((total, file) => total + file.size, 0);
  }, [attachments]);

  const formattedDate = useMemo(() => {
    return date ? format(date, "PPP") : "Pick a date";
  }, [date]);

  const buttonText = useMemo(() => {
    if (state.isLoading) return "Processing...";
    return isEditing ? "Update Transaction" : "Add Transaction";
  }, [state.isLoading, isEditing]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {state.error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </div>
      )}

      {/* Transaction Type */}
      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Input
            ref={descriptionRef}
            id="description"
            placeholder="Enter transaction description"
            value={state.description}
            onChange={(e) => updateField('description', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={state.amount}
            onChange={(e) => updateField('amount', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={state.category} onValueChange={(value) => updateField('category', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formattedDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Reference and Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            placeholder="Invoice number, check number, etc."
            value={state.reference}
            onChange={(e) => updateField('reference', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes"
            value={state.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <Label>Attachments</Label>
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileUpload}
            className="w-full"
            disabled={state.isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {attachments.length} file(s) selected ({(totalAttachmentSize / 1024 / 1024).toFixed(2)} MB)
              </p>
              <div className="space-y-1">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <span>{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={state.isLoading || !isFormValid}
      >
        {buttonText}
      </Button>
    </form>
  );
}