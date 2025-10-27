# Client Context System - CA Workspace Implementation

## Overview
This system allows a CA (Chartered Accountant) to view and work with individual client data across all pages of the application.

## How It Works

### 1. Client Selection
- CA navigates to the Clients page (`/dashboard/clients`)
- Clicks on a client card's menu (three dots)
- Selects "Access Client Data"
- The client is stored in global context (React Context API)
- CA is redirected to the dashboard

### 2. Client Context Banner
- When a client is selected, a blue banner appears at the top of all dashboard pages
- Shows: Client name, email, business type, and GSTIN
- Provides a "Clear Selection" button to return to full CA view

### 3. Data Filtering
- All pages should check the `selectedClient` context
- If a client is selected, API calls should filter by that client's business ID
- If no client is selected, show all data (full CA view)

## Implementation Details

### Context Structure
```typescript
interface SelectedClient {
  id: string                  // User ID
  name: string               // Client name
  email: string              // Client email
  businessId?: string        // Business/Company ID (for filtering)
  businessName?: string      // Business/Company name
  gstin?: string            // GST Identification Number
  pan?: string              // PAN number
  businessType?: string     // Type of business
}

interface ClientContextType {
  selectedClient: SelectedClient | null
  selectClient: (client: SelectedClient) => void
  clearClient: () => void
  isViewingAsClient: boolean  // True if a client is selected
  isCAMode: boolean          // True if logged-in user is a CA
}
```

### Files Created/Modified

#### Created:
1. **contexts/ClientContext.tsx** - Global state management
   - Provides client selection state
   - Persists selection in localStorage
   - Detects CA mode from user role

2. **components/clients/client-selector-banner.tsx** - Visual indicator
   - Shows selected client information
   - Allows clearing selection
   - Only visible when client is selected

#### Modified:
1. **app/layout.tsx** - Added ClientProvider wrapper
2. **app/dashboard/layout.tsx** - Added ClientSelectorBanner
3. **components/clients/clients-list.tsx** - Added "Access Client Data" button

## Usage in Components

### Check if Client is Selected
```typescript
import { useClientContext } from '@/contexts/ClientContext'

export function MyComponent() {
  const { selectedClient, isViewingAsClient } = useClientContext()
  
  if (isViewingAsClient) {
    // Show only selected client's data
    const businessId = selectedClient?.businessId
    // Use businessId in API calls
  } else {
    // Show all data (full CA view)
  }
}
```

### Filtering API Calls
```typescript
const fetchTransactions = async () => {
  const { selectedClient } = useClientContext()
  
  let url = 'http://localhost:5000/api/transactions'
  
  // If viewing a specific client, add business filter
  if (selectedClient?.businessId) {
    url += `?business=${selectedClient.businessId}`
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}
```

## Testing the System

### Test Credentials
- **CA Account:** ca@financeflow.com / ca123456
- **Client Accounts:** client1@test.com through client5@test.com / client123

### Test Steps
1. Login as CA: `ca@financeflow.com`
2. Navigate to Clients page
3. Click menu (three dots) on any client
4. Click "Access Client Data"
5. Verify:
   - Blue banner appears showing client info
   - Dashboard shows only that client's data
   - Navigate to other pages (transactions, invoices) - should show client's data
6. Click "Clear Selection" in banner
7. Verify:
   - Banner disappears
   - Full CA view restored

## Next Steps - Pages to Update

The following pages need to be updated to respect the selected client context:

### High Priority:
1. **Dashboard Page** (`app/dashboard/page.tsx`)
   - Filter stats by selected client's business ID
   - Show client-specific metrics

2. **Transactions Page** (`app/dashboard/transactions`)
   - Filter transactions by business ID
   - Update transaction list

3. **Invoices Page** (`app/dashboard/invoices`)
   - Show only selected client's invoices
   - Filter GST invoices

### Medium Priority:
4. **Reports** (`components/reporting/`)
   - Balance Sheet - client-specific
   - Profit & Loss - client-specific
   - Cash Flow - client-specific
   - GST Reports - client-specific

5. **Tax Calculations** (`app/dashboard/tax`)
   - Show client-specific tax data
   - Filter calculations

### Low Priority:
6. **Settings** - May not need filtering
7. **Tasks** - Filter by client if applicable

## Backend Support

### Current Status
- Backend already supports filtering by business ID
- Each transaction, invoice, etc. has a `business` field
- CA can access all clients' data (verified by `assignedCA` field)

### API Endpoint Pattern
Most endpoints should support a `business` query parameter:
```
GET /api/transactions?business=<businessId>
GET /api/invoices?business=<businessId>
GET /api/gst-returns?business=<businessId>
```

### Security Notes
- Backend validates that CA has access to the requested business
- JWT token identifies the CA making the request
- Business ID must match a business assigned to that CA

## Database Schema Reference

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  role: 'ca' | 'client',
  assignedCA: ObjectId  // For clients only
}
```

### Business Collection
```javascript
{
  _id: ObjectId,
  owner: ObjectId,      // User ID
  name: String,
  gstin: String,
  pan: String,
  businessType: String
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  business: ObjectId,   // Filter by this
  userId: ObjectId,
  amount: Number,
  date: Date,
  // ... other fields
}
```

## Troubleshooting

### Banner Not Showing
- Check if ClientProvider is wrapping the app (in `app/layout.tsx`)
- Verify client was selected (check localStorage: `selectedClient`)
- Check console for errors

### Data Not Filtering
- Ensure component is using `useClientContext()`
- Check if API calls include `business` parameter
- Verify businessId is being passed correctly

### Selection Not Persisting
- Check localStorage permissions
- Verify ClientContext is saving to localStorage
- Check browser console for errors

## Future Enhancements

1. **Client Switching Without Redirect**
   - Allow quick switching between clients
   - Dropdown in header to select client

2. **Recent Clients**
   - Track recently accessed clients
   - Quick access menu

3. **Bulk Operations**
   - Work with multiple clients at once
   - Compare data across clients

4. **Client Dashboard Customization**
   - Different views for different client types
   - Customizable widgets per client
