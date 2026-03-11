---
name: webcomponents
description: Comprehensive skill for working with @diniz/webcomponents library. Provides guidance on form components, data components, layout components, styling, theming, validation patterns, API integration, and best practices for building modern web applications with Web Components.
keywords: [web-components, ui-library, components, validation, theming, styling, frontend]
---

# Web Components Library Skill

Complete guidance for using the **@diniz/webcomponents** library — a lightweight, framework-agnostic Web Components library with form controls, data components, routing, state management, and theming.

## Quick Links to Documentation

- **[Storybook](https://rodiniz.github.io/webcomponents/)** — Interactive demos and live theme switching
- **[Table Documentation](../docs/TABLE.md)** — Data table with sorting, pagination, and child rows
- **[Sidebar Documentation](../docs/SIDEBAR.md)** — Navigation sidebar with theming
- **[Treeview Documentation](../docs/TREEVIEW.md)** — Hierarchical tree with lazy loading
- **[HTTP Client Documentation](../docs/HTTP_CLIENT.md)** — Lightweight fetch wrapper
- **[Date Picker Documentation](../docs/DATE_PICKER.md)** — Calendar date selection
- **[Toast Documentation](../docs/TOAST.md)** — Notifications with multiple types

## Installation

```bash
npm install @diniz/webcomponents
```

## Import & Usage

```html
<!-- Option 1: Import all components -->
<script type="module">
  import '@diniz/webcomponents';
</script>

<!-- Option 2: Import specific components -->
<script type="module">
  import '@diniz/webcomponents/components/button';
  import '@diniz/webcomponents/components/input';
  import '@diniz/webcomponents/components/table';
</script>
```

## Available Components

## Available Components

### Form Components

#### ui-button
- **Variants**: `primary`, `secondary`, `ghost`, `danger`
- **Sizes**: `sm`, `md`, `lg`
- **Features**: Icon support, loading state, disabled state, keyboard navigation
- **Common Props**: `variant`, `size`, `icon`, `icon-position`, `disabled`, `loading`

```html
<ui-button variant="primary" size="md" icon="plus">Add Item</ui-button>
<ui-button variant="secondary" icon="edit" icon-position="right">Edit</ui-button>
<ui-button variant="ghost" icon="trash-2" icon-position="left"></ui-button>
<ui-button variant="danger" disabled>Disabled</ui-button>
```

**Event**: `click` - Standard click event

#### ui-input
- **Types**: `text`, `email`, `password`, `number`, `tel`, `url`, `date`
- **Native Validation**: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max`
- **Custom Validation**: Custom rules via `validate` attribute
- **Features**: Icon support, error display, placeholder, label, disabled
- **Common Props**: `label`, `type`, `required`, `pattern`, `validate`, `custom-error`, `icon`, `icon-position`

**Custom Validators**:
- `validate="email:domain.com"` - Must end with @domain.com
- `validate="match:#selector"` - Must match another input's value
- `validate="min:N"` - Minimum length
- `validate="max:N"` - Maximum length
- `validate="regex:pattern"` - Custom regex pattern

```html
<ui-input label="Email" type="email" required></ui-input>
<ui-input label="Corporate Email" validate="email:company.com" custom-error="Must be company email"></ui-input>
<ui-input label="Confirm Password" validate="match:#password" custom-error="Passwords must match"></ui-input>
<ui-input label="Search" icon="search" icon-position="left" placeholder="Search..."></ui-input>
<ui-input label="Amount" icon="dollar-sign" icon-position="right" type="number"></ui-input>
```

**Events**:
- `input` - Fires on value change
- `change` - Fires on blur
- `invalid` - Fires on validation error

#### ui-checkbox
- **Features**: Indeterminate state, keyboard navigation, icon support
- **Common Props**: `label`, `checked`, `disabled`, `indeterminate`
- **Sizes**: `sm`, `md`, `lg`

```html
<ui-checkbox label="Accept terms"></ui-checkbox>
<ui-checkbox label="Subscribe" checked></ui-checkbox>
<ui-checkbox label="Indeterminate" indeterminate></ui-checkbox>
<ui-checkbox label="Disabled" disabled></ui-checkbox>
```

**Events**:
- `checkbox-change` - Fires when state changes

#### ui-radio
- **Features**: Grouped radios, descriptions, keyboard navigation
- **Common Props**: `name`, `value`, `label`, `checked`, `disabled`

```html
<ui-radio name="option" value="1" label="Option 1"></ui-radio>
<ui-radio name="option" value="2" label="Option 2"></ui-radio>
<ui-radio name="option" value="3" label="Option 3"></ui-radio>
```

#### ui-toggle-switch
- **Sizes**: `sm`, `md` (default), `lg`
- **Features**: Label, disabled state, keyboard navigation, form integration
- **Common Props**: `label`, `checked`, `disabled`, `size`, `name`

```html
<ui-toggle-switch label="Enable notifications"></ui-toggle-switch>
<ui-toggle-switch label="Dark mode" checked></ui-toggle-switch>
<ui-toggle-switch label="Small switch" size="sm"></ui-toggle-switch>

<!-- In forms -->
<form>
  <ui-toggle-switch name="newsletter" label="Subscribe"></ui-toggle-switch>
  <ui-toggle-switch name="terms" label="Accept terms" checked></ui-toggle-switch>
</form>
```

**Events**:
- `toggle-change` - Fires when state changes with `{ checked }` detail

#### ui-select
- **Features**: Searchable, multi-select support, custom rendering
- **Common Props**: `label`, `options`, `multiple`, `required`, `disabled`, `placeholder`

```html
<ui-select label="Choose color" .options=${['Red', 'Green', 'Blue']}></ui-select>
<ui-select label="Skills" multiple .options=${['JavaScript', 'TypeScript', 'React']}></ui-select>
```

**Events**:
- `change` - Fires when selection changes

### Layout Components

#### ui-card
- **Variants**: `default`, `elevated`, `bordered`, `ghost`
- **Elevation levels**: `none`, `sm`, `md`, `lg`, `xl`
- **Features**: Customizable shadow color, rounded corners, background color
- **Common Props**: `variant`, `elevation`, `shadow`, `shadow-color`, `rounded`, `bg`

```html
<ui-card shadow elevation="md">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</ui-card>

<ui-card variant="elevated" shadow shadow-color="99, 102, 241" elevation="lg">
  <p>Card with blue-tinted shadow</p>
</ui-card>

<ui-card variant="bordered" rounded="false">
  <p>Square card with border</p>
</ui-card>

<ui-card bg="rose" shadow elevation="md">
  <p>Card with a rose background</p>
</ui-card>
```

#### ui-accordion
- **Features**: Collapsible sections, keyboard navigation, single/multiple expand
- **Common Props**: `label`, `expanded`, `disabled`

```html
<ui-accordion label="Section 1" expanded>
  <p>Content for section 1</p>
</ui-accordion>
<ui-accordion label="Section 2">
  <p>Content for section 2</p>
</ui-accordion>
```

#### ui-tabs
- **Features**: Smooth animations, keyboard navigation, labels as props
- **Common Props**: `labels`, `active`

```html
<ui-tabs .labels=${['Tab 1', 'Tab 2', 'Tab 3']}>
  <div>Content for tab 1</div>
  <div>Content for tab 2</div>
  <div>Content for tab 3</div>
</ui-tabs>
```

#### ui-modal
- **Features**: Accessible dialogs, animations, backdrop click handling
- **Common Props**: `open`, `title`, `size`

```html
<ui-modal id="modal" title="Confirm Action" size="md">
  <p>Are you sure you want to continue?</p>
  <button onclick="document.querySelector('#modal').open = false">Close</button>
</ui-modal>
```

**Methods**:
- `show()` - Open modal
- `hide()` - Close modal

#### ui-sidebar  
_See [SIDEBAR.md](../docs/SIDEBAR.md) for complete documentation_

- **Features**: Navigation menu, brand section, footer links, theme-aware
- **Common Props**: `brand`, `version`, `items`, `footerItems`
- **CSS Custom Properties**: `--sidebar-bg`, `--sidebar-text`, `--sidebar-border`, `--sidebar-hover`

```html
<ui-sidebar
  brand="My App"
  version="v1.0"
  .items=${[
    { icon: 'home', label: 'Home', href: '/' },
    { icon: 'settings', label: 'Settings', href: '/settings' }
  ]}
  .footerItems=${[
    { icon: 'github', label: 'GitHub', href: 'https://github.com' }
  ]}
></ui-sidebar>
```

**Events**:
- `nav` - Fires when item clicked with `{ href }` detail

#### ui-top-bar
- **Features**: Header with logo, title, actions
- **Common Props**: `title`, `logo`

```html
<ui-top-bar title="Dashboard" logo="My App"></ui-top-bar>
```

### Data Components

#### ui-table
_See [TABLE.md](../docs/TABLE.md) for complete documentation_

- **Features**: Sorting, resizing, expandable rows, server-side pagination
- **Common Props**: `columns`, `rows`, `sortMode`, `bordered`, `zebra`

```javascript
const table = document.querySelector('ui-table');
table.columns = [
  { key: 'name', label: 'Name', sortable: true, resizable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'actions', label: 'Actions', actions: { edit: true, delete: true } }
];
table.rows = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' }
];

// Server-side sorting
table.sortMode = 'server';
table.addEventListener('sort-change', (e) => {
  const { key, direction } = e.detail;
  console.log('Sort:', key, direction);
});
```

**Events**:
- `action` - Row action clicked with `{ action, row, rowIndex }` detail
- `sort-change` - Sort requested with `{ key, direction }` detail

#### ui-treeview
_See [TREEVIEW.md](../docs/TREEVIEW.md) for complete documentation_

- **Features**: Hierarchical data, lazy loading, multi-select, keyboard navigation
- **Common Props**: `items`, `options`, `multiSelect`

```javascript
const treeview = document.querySelector('ui-treeview');
treeview.items = [
  { id: '1', label: 'Users', lazy: true },
  { id: '2', label: 'Posts', lazy: true }
];

treeview.options = {
  onLoadChildren: async (node) => {
    const data = await http.get(`/api/${node.id}/children`);
    return data.map(item => ({ id: item.id, label: item.name }));
  }
};

treeview.addEventListener('node-selected', (e) => {
  console.log('Selected:', e.detail.node);
});
```

**Events**:
- `node-selected` - Node clicked
- `node-expanded` - Node expanded

#### ui-pagination
_See [TABLE.md](../docs/TABLE.md#pagination-integration) for complete documentation_

- **Features**: Page navigation, configurable items per page
- **Common Props**: `page`, `per-page`, `total`

```javascript
const pagination = document.querySelector('ui-pagination');
pagination.total = 100;
pagination.page = 1;
pagination.perPage = 10;

pagination.addEventListener('page-change', (e) => {
  console.log('New page:', e.detail.page);
});

pagination.addEventListener('per-page-change', (e) => {
  console.log('Items per page:', e.detail.perPage);
});
```

**Events**:
- `page-change` - Page changed with `{ page }` detail
- `per-page-change` - Items per page changed with `{ perPage }` detail

#### ui-picklist
- **Features**: Dual-list selection, drag-and-drop
- **Common Props**: `available`, `selected`

```html
<ui-picklist
  .available=${['Item 1', 'Item 2', 'Item 3']}
  .selected=${[]}
></ui-picklist>
```

### Feedback Components

#### ui-toast
_See [TOAST.md](../docs/TOAST.md) for complete documentation_

- **Types**: `success`, `error`, `warning`, `info`
- **Positions**: `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`
- **Features**: Auto-dismiss, progress bar, stacking, programmatic API

```html
<ui-toast id="toaster" position="top-right"></ui-toast>
```

```javascript
const toaster = document.querySelector('#toaster');

// Convenience methods
toaster.success('Success!', 'Operation completed.');
toaster.error('Error!', 'Something failed.');
toaster.warning('Warning', 'Be careful.');
toaster.info('Info', 'New updates available.');

// Full API
toaster.show({
  title: 'Upload complete',
  description: 'File uploaded successfully.',
  type: 'success',
  duration: 5000,
  closable: true
});

// Programmatic dismiss
toaster.dismissAll();
```

**Events**:
- `toast-show` - Toast displayed
- `toast-dismiss` - Toast dismissed

#### ui-spinner
- **Features**: Loading indicator, customizable size and color
- **Common Props**: `size`, `color`

```html
<ui-spinner size="md" color="primary"></ui-spinner>
```

#### ui-tooltip
- **Features**: Hover/click tooltips, positioning, arrow
- **Common Props**: `content`, `position`, `trigger`

```html
<ui-tooltip content="Click to refresh" position="top" trigger="hover">
  <button>Refresh</button>
</ui-tooltip>
```

#### ui-stepper
- **Features**: Multi-step flows, step validation, navigation
- **Common Props**: `steps`, `active`

```html
<ui-stepper .steps=${['Step 1', 'Step 2', 'Step 3']} active="0">
  <!-- Step content -->
</ui-stepper>
```

### Utility Components

#### ui-date-picker
_See [DATE_PICKER.md](../docs/DATE_PICKER.md) for complete documentation_

- **Features**: Calendar picker, date range, format support
- **Common Props**: `value`, `min`, `max`, `format`, `placeholder`, `disabled`, `label`

```html
<ui-date-picker label="Start Date" format="YYYY-MM-DD"></ui-date-picker>
<ui-date-picker label="End Date" min="2024-01-01" max="2024-12-31"></ui-date-picker>
```

**Events**:
- `change` - Date changed

#### ui-upload
- **Features**: File upload with progress, multiple files, drag-drop
- **Common Props**: `accept`, `multiple`, `disabled`

```html
<ui-upload accept=".pdf,.doc" multiple></ui-upload>
```

**Events**:
- `upload` - Files uploaded
- `progress` - Upload progress

#### ui-link
- **Features**: Semantic anchor links, external link indicator
- **Common Props**: `href`, `external`

```html
<ui-link href="/page">Internal Link</ui-link>
<ui-link href="https://example.com" external>External Link</ui-link>
```

#### ui-dropdown
- **Features**: Menu dropdowns, keyboard navigation, positioning
- **Common Props**: `trigger`, `items`

```html
<ui-dropdown .items=${[
  { label: 'Edit', icon: 'edit' },
  { label: 'Delete', icon: 'trash' }
]}>
  <button>Actions</button>
</ui-dropdown>
```

## Styling & Theming

### Theme System

The library includes 7 built-in themes. Apply globally or per-component:

```javascript
import { applyTheme } from '@diniz/webcomponents';

// Apply theme globally
await applyTheme('shadcn');  // Default
// or 'zinc', 'rose', 'blue', 'green', 'orange', 'violet'
```

**Available Themes**:
- `shadcn` — Modern blue-based design (default)
- `zinc` — Neutral grayscale
- `rose` — Warm rose tones
- `blue` — Bright blue theme
- `green` — Green/teal theme
- `orange` — Warm orange theme
- `violet` — Purple/violet theme

### CSS Custom Properties

Components inherit theme variables:

```css
:root {
  --primary-h: 222.2;
  --primary-s: 47.4%;
  --primary-l: 11.2%;
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --muted: 210 40% 96.1%;
  --radius: 0.5rem;
}
```

Override at component level:

```css
ui-button {
  --color-primary: rgb(34, 197, 94);
}

ui-sidebar {
  --sidebar-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --sidebar-text: #ffffff;
}
```

### Component-Specific Styling

Each component supports theming. See individual documentation:
- [Sidebar Theming](../docs/SIDEBAR.md#styling)
- [Table Styling](../docs/TABLE.md#theming)
- [Card Customization](../docs/CARD.md)

## Advanced Usage

### HTTP Client Integration

Use the built-in HTTP client for API calls:

_See [HTTP_CLIENT.md](../docs/HTTP_CLIENT.md) for complete documentation_

```javascript
import { http } from '@diniz/webcomponents';

// Configuration
http.setBaseURL('https://api.example.com');
http.setDefaultHeaders({ Authorization: 'Bearer token' });
http.setDefaultTimeout(5000);

// Requests
const users = await http.get('/users');
const created = await http.post('/users', { name: 'John' });
await http.put('/users/1', { name: 'Jane' });
await http.delete('/users/1');

// Interceptors
http.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

http.interceptors.response.use((response) => {
  // Transform response
  return response.data?.result ? { ...response, data: response.data.result } : response;
});

// Error handling
try {
  await http.get('/users');
} catch (error) {
  console.error('HTTP error:', error);
}
```

### Validation Patterns

#### Form Validation

```javascript
// Custom validation
const input = document.querySelector('ui-input');

// External validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

input.addEventListener('blur', () => {
  if (!validateEmail(input.value)) {
    input.setAttribute('data-invalid', 'true');
  }
});

// Programmatic validation
if (input.checkValidity()) {
  // Submit form
}
```

#### Table Validation

```javascript
const table = document.querySelector('ui-table');

// Validate before action
table.addEventListener('action', async (e) => {
  const { action, row } = e.detail;
  
  if (action === 'delete' && !confirm('Delete this item?')) {
    return;
  }
  
  try {
    await http.delete(`/items/${row.id}`);
    table.rows = table.rows.filter(r => r.id !== row.id);
  } catch (error) {
    showError(`Failed to delete: ${error.message}`);
  }
});
```

### State Management

```javascript
import { createStore } from '@diniz/webcomponents';

// Create store
const store = createStore({
  user: null,
  theme: 'shadcn',
  sidebarOpen: true
});

// Access state
const { state } = store;
console.log(state.user, state.theme);

// Update state
store.setState('user', { name: 'John', id: 1 });
store.setState('theme', 'violet');

// Watch for changes
store.subscribe('user', (newUser) => {
  console.log('User updated:', newUser);
});
```

### Routing

```javascript
import { createRouter } from '@diniz/webcomponents';

const router = createRouter([
  { 
    path: '/', 
    component: 'home-page',
    load: () => import('./pages/home')
  },
  { 
    path: '/users/:id', 
    component: 'user-page',
    load: () => import('./pages/user'),
    guards: [authGuard]
  },
  { 
    path: '/admin',
    component: 'admin-page',
    guard: (route) => isAdmin(),
    load: () => import('./pages/admin')
  }
]);

// Navigate programmatically
router.navigate('/users/123');

// Current route
const current = router.current();
console.log(current.path, current.params);
```

## Common Patterns

### Dynamic Data Loading

```javascript
import { http } from '@diniz/webcomponents';

async function loadTableData() {
  try {
    const response = await http.get('/api/items');
    const table = document.querySelector('ui-table');
    table.rows = response;
  } catch (error) {
    console.error('Failed to load data:', error);
    showError('Failed to load data');
  }
}

loadTableData();
```

### Form Submission

```html
<form id="create-form">
  <ui-input name="username" label="Username" required></ui-input>
  <ui-input name="email" label="Email" type="email" required></ui-input>
  <ui-button type="submit">Create</ui-button>
</form>

<script>
  document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const result = await http.post('/api/users', data);
      showSuccess('User created!');
      e.target.reset();
    } catch (error) {
      showError(`Failed: ${error.message}`);
    }
  });
</script>
```

### Navigation with Active State

```javascript
const sidebar = document.querySelector('ui-sidebar');

sidebar.addEventListener('nav', (e) => {
  const { href } = e.detail;
  
  // Update page
  loadPage(href);
  
  // Update URL
  window.history.pushState(null, '', href);
});

// Restore active state on page load
function setActiveSidebarItem() {
  const current = window.location.pathname;
  const link = document.querySelector(`ui-sidebar a[href="${current}"]`);
  if (link) {
    link.classList.add('is-active');
  }
}

setActiveSidebarItem();
```

## Best Practices

### 1. Component Organization
```html
<!-- Group related components -->
<div class="form-group">
  <ui-input label="Name"></ui-input>
  <ui-input label="Email" type="email"></ui-input>
</div>

<div class="actions">
  <ui-button variant="primary">Submit</ui-button>
  <ui-button variant="secondary">Cancel</ui-button>
</div>
```

### 2. Error Handling
```javascript
async function safeOperation(fn) {
  try {
    return await fn();
  } catch (error) {
    console.error('Operation failed:', error);
    showError(error.message || 'Operation failed');
    return null;
  }
}

const data = await safeOperation(() => http.get('/api/data'));
```

### 3. Type Safety
```typescript
import type { ValidateRuleInput, SelectOption } from '@diniz/webcomponents';

interface FormData {
  username: string;
  email: string;
  terms: boolean;
}

const options: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' }
];
```

### 4. Accessibility
- All components include ARIA attributes
- Keyboard navigation support
- Color contrast meets WCAG standards
- Focus indicators visible

```html
<!-- Components are accessible by default -->
<ui-input label="Name" required aria-required="true"></ui-input>
<ui-button>Accessible button</ui-button>
```

### 5. Performance
- Use server-side pagination for large datasets
- Lazy load tree nodes
- Minimize re-renders with proper state management
- Debounce search/filter inputs

```javascript
// Server-side pagination
table.addEventListener('page-change', async (e) => {
  const data = await http.get(`/api/items?page=${e.detail.page}`);
  table.rows = data.items;
});

// Lazy tree loading
treeview.options = {
  onLoadChildren: async (node) => {
    return await http.get(`/api/nodes/${node.id}/children`);
  }
};
```

## Resources

- **[Storybook Demos](https://rodiniz.github.io/webcomponents/)** — Interactive component playground
- **[Component Documentation](../docs/)** — Detailed guides for each component
- **[TypeScript Types](../src/)** — Full type definitions
- **[Test Suite](../vitest.config.ts)** — 260+ tests for reference
<ui-card variant="elevated">
  <div class="card-content">
    <h2>Main Title</h2>      <!-- Largest -->
    <h3>Section Title</h3>   <!-- Medium -->
    <p>Body text content</p> <!-- Regular -->
    <small>Helper text</small> <!-- Small -->
  </div>
</ui-card>
```

### Design Patterns

**Login Form**:
```html
<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #667eea, #764ba2);
  }
  .login-form { max-width: 400px; width: 100%; margin: 0 20px; }
  .login-form ui-card { width: 100%; }
  .form-content { padding: 40px; display: flex; flex-direction: column; gap: 24px; }
  .form-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
</style>

<div class="login-container">
  <ui-card variant="elevated" shadow elevation="xl" class="login-form">
    <div class="form-content">
      <h2>Login</h2>
      <ui-input label="Email" type="email" required></ui-input>
      <ui-input label="Password" type="password" required></ui-input>
      <div class="form-actions">
        <ui-button variant="secondary">Cancel</ui-button>
        <ui-button variant="primary">Login</ui-button>
      </div>
    </div>
  </ui-card>
</div>
```

**Feature Cards Grid**:
```html
<style>
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
    padding: 60px 20px;
  }
  .feature-card { text-align: center; }
  .feature-icon { font-size: 36px; margin-bottom: 16px; }
</style>

<div class="features-grid">
  <ui-card variant="ghost">
    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <h3>Fast</h3>
      <p>Lightning quick performance</p>
    </div>
  </ui-card>
  <!-- More cards -->
</div>
```

### Common Styling Mistakes to Avoid

- ❌ Using all variants on one page (use 1-2 max)
- ❌ Inconsistent spacing (use a consistent scale: 4px, 8px, 16px, etc.)
- ❌ Too many colors (3-4 color maximum)
- ❌ Forgetting mobile responsiveness
- ❌ Over-animating elements
- ❌ Mixing bold and timid design choices (commit to a direction)

## Validation

Use the native HTML5 validation attributes or custom validation:
- Native: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max`
- Custom: `validate` attribute with rules
- Error messages: `error-message` or `custom-error` attributes

## Importing

```javascript
import '@your-org/webcomponents';
```

Or via CDN:
```html
<script src="https://unpkg.com/@your-org/webcomponents/dist/webcomponents.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@your-org/webcomponents/dist/style.css">
```

## TypeScript

Import types for better IDE support:
```typescript
import type { TableColumn, TableRow } from '@your-org/webcomponents';
```
