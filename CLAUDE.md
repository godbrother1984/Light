# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Thai-language **Light Measurement Recording System** built as a web application for occupational health and safety compliance. The system manages light measurement inspections, generates PDF reports, and maintains customer/inspector master data using Firebase Firestore as the backend.

**Current Status**: Version 8.0+ with Complete UI/UX Standardization and Template System Redesign. All major components migrated and optimized. Performance improved by 71% through module system implementation. UI Consistency achieved across all pages with standardized Action Button System.

## Key Architecture

### Module System Architecture (Completed)
The project uses a **module-based architecture** for performance and maintainability:

```
/
├── assets/
│   ├── css/              # Modular CSS system
│   │   ├── main-styles.css      # Variables, typography, layouts
│   │   ├── sidebar.css          # Navigation components  
│   │   └── components.css       # Cards, forms, modals, toast notifications
│   └── js/               # JavaScript modules
│       ├── firebase-init.js     # Firebase operations & FirebaseManager class
│       ├── ui-helpers.js        # Common UI functions (showAlert, formatDate, etc.)
│       └── pdf-generator.js     # PDF generation logic
│
├── firebase-config.js    # Firebase configuration
├── tag-processor.js      # Report template tag processing
└── [page].html          # Individual page files
```

### Migration Status & Current Versions
- **✅ Fully Migrated**: All files moved to root directory
- **✅ Module System**: All major files successfully migrated
- **✅ UI Standardization**: Complete UI/UX consistency achieved

#### **Page Versions (Updated December 2024)**
  - `main.html` (v6.1) - Modern Button Design
  - `new-job.html` (v3.2.0) - Modern toast notifications + Running numbers  
  - `master-data-manager.html` (v7.3) - Enhanced Remark System - Standard Recommendations
  - `job-details.html` (v10.7) - Enhanced Modal Title Contrast
  - `report-finalizer.html` (v7.1) - Integrated Template Management + Enhanced UX
  - `template-manager.html` (v3.1) - ✅ **UI Standardized** + Redesigned architecture
  - `template-editor.html` (v1.1) - ✅ **New Universal Editor** for templates & reports
  - `branch-manager.html` (v1.2) - Enhanced UX with beautiful modals

### Firebase Data Structure
```
/artifacts/{app-id}/public/data/
├── jobs/                 # Job records with measurements
├── customers/            # Customer data with branches
├── inspectors/           # Personnel data with licenses
├── instruments/          # Measurement equipment
├── work_types/           # Standard lighting requirements
├── running_numbers/      # Auto-increment counters
├── remarks/              # Standard recommendations (NEW in v7.3)
├── users/                # User accounts and authentication (PLANNED)
└── company_info/         # Company licenses and signatories
```

## Development Commands

### Local Development
```bash
# Start PHP development server
php -S localhost:8000

# Or Python server in root directory  
python -m http.server 8001
```

### Testing
```bash
# Test specific features
open test-toast.html          # Toast notification system
open test-running-numbers.html   # Running number system
open test-validation.html     # Form validation system
```

### No Build Process
This is a vanilla JavaScript/HTML/CSS project with no build step required. Files are served directly.

## Core Systems

### 1. Firebase Integration
- **FirebaseManager Class**: Centralized Firebase operations in `firebase-init.js`
- **Authentication**: Anonymous auth with custom token support
- **Real-time Data**: Uses `onSnapshot` for live updates
- **Collection Naming**: Uses `/artifacts/{app-id}/public/data/` pattern
- **User Management**: `getCurrentUserId()` and `getCurrentUser()` methods

### 2. Running Number System
- **Format**: `PREFIX-YYYY-MM-XXX` (e.g., `JOB-2568-09-001`)  
- **Thai Buddhist Year**: Auto-converts to Buddhist calendar
- **Auto-reset**: Counter resets monthly
- **Types**: Supports multiple number types (JOB, REPORT, etc.)
- **Management**: Full CRUD interface in master-data-manager.html

### 3. Modern UI System
- **Toast Notifications**: Modern popup notifications (bottom-right)
- **Form Validation**: Enhanced validation with visual feedback
- **Responsive Design**: Mobile-optimized with Bootstrap 5.3.3
- **Thai Language**: Full Thai language support with Sarabun font
- **Auto-save**: Real-time data persistence with 3-second debounce timer

### 4. Advanced Table Features (NEW in job-details v10.0)
- **Auto-save**: Automatic data persistence with debounce timer
- **Bulk Edit**: Multi-row selection and batch operations
- **LUX Validation**: Real-time format validation with visual feedback
- **Search/Filter**: Text search and dropdown filtering capabilities
- **Remark Column**: Additional notes field for each measurement

### 5. Enhanced Remark System (NEW in v7.3)
- **Standard Recommendations**: Master data for common recommendations
- **Category System**: LOW_LIGHT, HIGH_LIGHT, GENERAL classifications
- **Priority System**: HIGH, MEDIUM, LOW importance levels
- **Status Management**: ACTIVE/INACTIVE recommendations
- **Search & Filter**: Real-time filtering by category, priority, and text search

### 6. Standardized Action Button System (NEW in v8.0)
- **Universal Design**: Consistent action buttons across all pages
- **Standard Classes**: `action-btn`, `action-edit`, `action-delete`, `action-view`, `action-add`, `action-save`
- **Icon Consistency**: `fa-edit`, `fa-trash`, `fa-eye`, `fa-plus`, `fa-save` (standardized)
- **Spacing**: `action-btn-group` with `gap: 0.25rem` for uniform spacing
- **Responsive Sizes**: `action-btn-sm`, `action-btn-xs`, `action-btn-icon-only`
- **Color Standards**: Edit (Gray #6c757d), Delete (Red #dc3545), View (Blue #17a2b8), Add/Save (Green #28a745)

### 7. Template System Redesign (NEW in v8.0)
- **Separate Architecture**: Template Manager (hub) → Template Editor (universal editor)  
- **Universal Editor**: Single editor for both template creation and report generation
- **Mode System**: `?mode=template` for template editing, `?mode=report` for report generation
- **Settings Panel**: Page setup, headers, footers, watermarks with tabbed interface
- **Real-time Preview**: Live preview of template changes
- **Tag System**: Comprehensive tag library with search and categorization

### 8. PDF Report Generation with Enhanced Tags
- **TagProcessor v1.1**: Processes template tags like `{{JOB_ID}}`, `{{CUSTOMER_NAME}}`
- **Enhanced Tags**: Added `{{REMARK_MASTER}}` and `{{REMARK_JOB}}` with auto-pagination
- **Dynamic Content**: Auto-generates measurement tables with remarks after each 20-row page
- **Company Data**: Integrates licenses and signatory information
- **File Location**: Logic in `pdf-generator.js` and `tag-processor.js`

## UI/UX Standards & Design Guidelines (NEW in v8.0)

### 🎨 Complete UI Design Standards

#### **Design Philosophy & Principles**
- **Professional First**: Clean, elegant, business-appropriate interface
- **Thai-Centric**: Optimized for Thai language and cultural context
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Consistency**: Unified design language across all components
- **Performance**: Optimized for fast loading and smooth interactions
- **Mobile-First**: Responsive design for all device types

#### **Color System & Palette (Modernized HSL Design Tokens)**
```css
/* Modern HSL Design Token Architecture */
:root {
  /* Primary Brand Colors - HSL Format */
  --primary: 211 100% 50%;         /* #0080FF - Bright Professional Blue */
  --primary-hover: 211 100% 45%;   /* Darker blue for hover states */
  --primary-light: 211 70% 85%;    /* Light blue for highlights */
  --primary-foreground: 0 0% 98%;  /* Text on primary backgrounds */
  
  /* Secondary Colors */
  --secondary: 210 15% 85%;        /* Light gray-blue for secondary elements */
  --secondary-hover: 210 15% 80%;  /* Secondary hover states */
  --secondary-foreground: 210 20% 20%; /* Text on secondary backgrounds */
  
  /* Semantic Colors - HSL Format */
  --success: 142 71% 45%;          /* #38A169 - Professional green */
  --success-foreground: 0 0% 98%;  /* Text on success backgrounds */
  --warning: 38 92% 50%;           /* #ED8936 - Professional orange */
  --warning-foreground: 0 0% 10%;  /* Text on warning backgrounds */
  --destructive: 0 84% 60%;        /* #F56565 - Professional red */
  --destructive-foreground: 0 0% 98%; /* Text on destructive backgrounds */
  --info: 195 90% 45%;             /* #1493C7 - Professional teal */
  --info-foreground: 0 0% 98%;     /* Text on info backgrounds */
  
  /* Background & Surface Colors */
  --background: 0 0% 100%;         /* Pure white background */
  --foreground: 210 20% 20%;       /* Main text color - dark blue-gray */
  --card: 0 0% 100%;               /* Card backgrounds */
  --card-foreground: 210 20% 20%;  /* Text on cards */
  
  /* Interactive Elements */
  --border: 210 20% 88%;           /* Border color - light blue-gray */
  --input: 210 20% 88%;            /* Input field borders */
  --ring: 211 100% 50%;            /* Focus ring color */
  
  /* Muted/Subtle Elements */
  --muted: 210 20% 96%;            /* Subtle backgrounds */
  --muted-foreground: 210 15% 45%; /* Muted text color */
  
  /* Accent Colors */
  --accent: 0 75% 55%;             /* Red accent for important actions */
  --accent-foreground: 0 0% 98%;   /* Text on accent backgrounds */
  
  /* Legacy HEX Support (for backward compatibility) */
  --primary-blue: hsl(var(--primary));
  --success-green: hsl(var(--success));
  --warning-orange: hsl(var(--warning));
  --danger-red: hsl(var(--destructive));
  --info-teal: hsl(var(--info));
}
```

#### **HSL Color Usage Guide**
```css
/* Using HSL Design Tokens */
.primary-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.primary-button:hover {
  background-color: hsl(var(--primary-hover));
}

.success-alert {
  background-color: hsl(var(--success) / 0.1); /* 10% opacity */
  border: 1px solid hsl(var(--success));
  color: hsl(var(--success));
}

.card {
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
}
```

#### **Color Team Matrix & Usage Guidelines**

| **Color Token** | **HSL Value** | **HEX Value** | **Usage** |
|-----------------|---------------|---------------|-----------||
| **Primary Blue** | `211 100% 50%` | `#0080FF` | Main brand, buttons, links, active states |
| **Success Green** | `142 71% 45%` | `#38A169` | Success messages, save actions, positive indicators |
| **Warning Orange** | `38 92% 50%` | `#ED8936` | Warning states, pending actions, caution indicators |
| **Destructive Red** | `0 84% 60%` | `#F56565` | Error states, delete actions, danger alerts |
| **Info Teal** | `195 90% 45%` | `#1493C7` | Information, view actions, neutral highlights |
| **Background** | `0 0% 100%` | `#FFFFFF` | Page backgrounds, card backgrounds |
| **Foreground** | `210 20% 20%` | `#293747` | Main text color, headings |
| **Muted** | `210 20% 96%` | `#F4F7F9` | Subtle backgrounds, disabled states |
| **Border** | `210 20% 88%` | `#D4DDE6` | Borders, dividers, outlines |

#### **Dark Mode Support**
```css
.dark {
  --background: 210 25% 8%;        /* Very dark blue background */
  --foreground: 207 20% 95%;       /* Very light blue text */
  --card: 210 25% 10%;             /* Dark card background */
  --primary: 211 85% 60%;          /* Lighter primary for contrast */
  --secondary: 210 25% 20%;        /* Darker secondary */
  --muted: 210 25% 15%;            /* Dark muted background */
  --border: 210 25% 25%;           /* Dark borders */
}
```

#### **Typography System**
```css
/* Font Stack */
:root {
  --font-primary: 'Sarabun', 'Segoe UI', 'Roboto', sans-serif;
  --font-monospace: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

/* Typography Scale */
.text-xs { font-size: 0.75rem; line-height: 1.5; }    /* 12px */
.text-sm { font-size: 0.875rem; line-height: 1.5; }   /* 14px */
.text-base { font-size: 1rem; line-height: 1.5; }     /* 16px - Base */
.text-lg { font-size: 1.125rem; line-height: 1.4; }   /* 18px */
.text-xl { font-size: 1.25rem; line-height: 1.4; }    /* 20px */
.text-2xl { font-size: 1.5rem; line-height: 1.3; }    /* 24px */
.text-3xl { font-size: 1.875rem; line-height: 1.3; }  /* 30px */
.text-4xl { font-size: 2.25rem; line-height: 1.2; }   /* 36px */

/* Font Weights */
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

#### **Spacing System (8px Base Grid)**
```css
/* Spacing Scale - 8px base unit */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
}

/* Usage Examples */
.p-2 { padding: var(--space-2); }
.m-4 { margin: var(--space-4); }
.gap-3 { gap: var(--space-3); }
```

#### **Border Radius & Shadows**
```css
:root {
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px - Small elements */
  --radius: 0.375rem;     /* 6px - Default */
  --radius-md: 0.5rem;    /* 8px - Cards, modals */
  --radius-lg: 0.75rem;   /* 12px - Large cards */
  --radius-xl: 1rem;      /* 16px - Hero sections */
  --radius-full: 9999px;  /* Pills, badges */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 8px 10px rgba(0, 0, 0, 0.04);
}
```

#### **Animation & Transitions**
```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-bounce: 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Standard Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### **Layout System & Grid**
```css
/* Container Sizes */
.container-sm { max-width: 576px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 992px; }
.container-xl { max-width: 1200px; }
.container-2xl { max-width: 1400px; }

/* Grid System */
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }

/* Flexbox Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
```

### Standardized Action Button System

#### **CSS Classes (components.css v1.2)**
```css
/* Base Action Button */
.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.75rem;
    border-radius: var(--border-radius);
    transition: all var(--transition-speed) ease;
    min-width: 36px;
    min-height: 36px;
}

/* Action Button Groups */
.action-btn-group {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem; /* Standard 4px spacing */
}

/* Sizes */
.action-btn-sm { min-width: 32px; min-height: 32px; }
.action-btn-xs { min-width: 28px; min-height: 28px; }
.action-btn-icon-only { padding: 0.25rem; justify-content: center; }
```

#### **Standard Action Types & Colors**
```css
.action-edit    { border-color: #6c757d; color: #6c757d; }  /* Gray */
.action-delete  { border-color: #dc3545; color: #dc3545; }  /* Red */
.action-view    { border-color: #17a2b8; color: #17a2b8; }  /* Teal */
.action-add     { background: #28a745; color: #fff; }       /* Green */
.action-save    { background: #28a745; color: #fff; }       /* Green */
.action-download{ border-color: #007bff; color: #007bff; }  /* Blue */
```

#### **Standard Icons (FontAwesome 5)**
- **Edit**: `fa-edit` (consistent across all pages)
- **Delete**: `fa-trash` (not fa-trash-alt)
- **View**: `fa-eye` 
- **Add**: `fa-plus` (not fa-plus-circle)
- **Save**: `fa-save`
- **Download**: `fa-download`
- **Copy**: `fa-copy`

#### **Usage Examples**
```html
<!-- Table Action Buttons (Icon Only) -->
<div class="action-btn-group">
    <button class="action-btn action-edit action-btn-sm action-btn-icon-only" title="แก้ไข">
        <i class="fas fa-edit"></i>
    </button>
    <button class="action-btn action-delete action-btn-sm action-btn-icon-only" title="ลบ">
        <i class="fas fa-trash"></i>
    </button>
</div>

<!-- Form Buttons (With Text) -->
<div class="action-btn-group">
    <button class="action-btn action-save action-btn-sm">
        <i class="fas fa-save me-1"></i>บันทึก
    </button>
    <button class="action-btn action-cancel action-btn-sm">
        <i class="fas fa-times me-1"></i>ยกเลิก
    </button>
</div>
```

#### **Component Design Standards**

### 📱 **Card Components**
```css
.card {
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  transition: var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card-header {
  padding: var(--space-4) var(--space-6);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.card-body {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-4) var(--space-6);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
}
```

### 📋 **Form Design Standards**
```css
/* Form Layout */
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: var(--space-2);
  font-size: 0.875rem;
}

.form-control {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--gray-900);
  background: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  transition: var(--transition-base);
}

.form-control:focus {
  border-color: var(--primary-blue);
  outline: 0;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Validation States */
.form-control.is-invalid {
  border-color: var(--danger-red);
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

.form-control.is-valid {
  border-color: var(--success-green);
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
}

.invalid-feedback {
  display: block;
  margin-top: var(--space-1);
  font-size: 0.875rem;
  color: var(--danger-red);
}

.valid-feedback {
  display: block;
  margin-top: var(--space-1);
  font-size: 0.875rem;
  color: var(--success-green);
}
```

### 📊 **Table Design Standards**
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table th {
  background: var(--gray-50);
  padding: var(--space-4);
  font-weight: 600;
  color: var(--gray-700);
  border-bottom: 2px solid var(--gray-200);
  text-align: left;
}

.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  vertical-align: middle;
}

.table tbody tr:hover {
  background: var(--gray-50);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* Table Responsive Wrapper */
.table-responsive {
  overflow-x: auto;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* Empty Table State */
.table-empty {
  padding: var(--space-12);
  text-align: center;
  color: var(--gray-500);
}

.table-empty-icon {
  font-size: 3rem;
  color: var(--gray-300);
  margin-bottom: var(--space-4);
}
```

### 🎭 **Modal Design Standards**
```css
.modal-backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-dialog {
  max-width: 500px;
  margin: var(--space-12) auto;
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: none;
  overflow: hidden;
}

.modal-header {
  padding: var(--space-6);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-4) var(--space-6);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

/* Modal Animations */
.modal.fade .modal-dialog {
  transform: translateY(-50px);
  transition: var(--transition-slow);
}

.modal.show .modal-dialog {
  transform: translateY(0);
}
```

### 🔔 **Toast Notification Standards**
```css
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 1055;
  max-width: 350px;
}

.toast {
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid var(--primary-blue);
  margin-bottom: var(--space-3);
  overflow: hidden;
  animation: slideUp var(--transition-slow);
}

.toast.toast-success { border-left-color: var(--success-green); }
.toast.toast-warning { border-left-color: var(--warning-orange); }
.toast.toast-danger { border-left-color: var(--danger-red); }
.toast.toast-info { border-left-color: var(--info-teal); }

.toast-header {
  padding: var(--space-3) var(--space-4);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toast-body {
  padding: var(--space-4);
  color: var(--gray-700);
}

.toast-progress {
  height: 3px;
  background: var(--gray-200);
  overflow: hidden;
}

.toast-progress-bar {
  height: 100%;
  background: var(--primary-blue);
  transition: width linear;
}
```

### 🎯 **Badge & Status Indicators**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25em 0.6em;
  font-size: 0.75em;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: var(--radius-full);
}

.badge-primary { background: var(--primary-blue); color: var(--white); }
.badge-success { background: var(--success-green); color: var(--white); }
.badge-warning { background: var(--warning-orange); color: var(--gray-800); }
.badge-danger { background: var(--danger-red); color: var(--white); }
.badge-info { background: var(--info-teal); color: var(--white); }
.badge-light { background: var(--gray-100); color: var(--gray-800); }
.badge-dark { background: var(--gray-800); color: var(--white); }

/* Status Dots */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: var(--space-2);
}

.status-active { background: var(--success-green); }
.status-inactive { background: var(--gray-400); }
.status-pending { background: var(--warning-orange); }
.status-error { background: var(--danger-red); }
```

### 📱 **Responsive Design Breakpoints**
```css
/* Mobile First Breakpoints */
:root {
  --breakpoint-sm: 576px;   /* Small devices (landscape phones) */
  --breakpoint-md: 768px;   /* Medium devices (tablets) */
  --breakpoint-lg: 992px;   /* Large devices (desktops) */
  --breakpoint-xl: 1200px;  /* Extra large devices */
  --breakpoint-2xl: 1400px; /* Extra extra large devices */
}

/* Media Query Mixins Usage */
@media (max-width: 767px) {
  .mobile-hidden { display: none; }
  .mobile-full-width { width: 100%; }
  .mobile-stack { flex-direction: column; }
}

@media (min-width: 768px) {
  .desktop-only { display: block; }
}

/* Responsive Typography */
@media (max-width: 767px) {
  .text-responsive-lg { font-size: 1.25rem; }
  .text-responsive-xl { font-size: 1.5rem; }
}

@media (min-width: 768px) {
  .text-responsive-lg { font-size: 1.5rem; }
  .text-responsive-xl { font-size: 2rem; }
}
```

### ♿ **Accessibility Standards**
```css
/* Focus Indicators */
:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  z-index: 1000;
  padding: var(--space-2) var(--space-4);
  background: var(--gray-800);
  color: var(--white);
  text-decoration: none;
  border-radius: var(--radius);
}

.skip-link:focus {
  top: var(--space-4);
}

/* Screen Reader Only */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  :root {
    --primary-blue: #0066cc;
    --gray-300: #999999;
    --gray-600: #333333;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 🌐 **Thai Language Optimizations**
```css
/* Thai Font Optimization */
body {
  font-family: 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif;
  line-height: 1.6; /* Increased for Thai readability */
  font-feature-settings: "liga" 1; /* Enable ligatures */
}

/* Thai Text Spacing */
.thai-text {
  word-spacing: 0.1em;
  letter-spacing: 0.02em;
}

/* Thai Number Formatting */
.thai-number {
  font-variant-numeric: lining-nums;
  font-feature-settings: "tnum" 1; /* Tabular numbers */
}

/* Thai Date Display */
.thai-date {
  white-space: nowrap;
  font-variant-numeric: lining-nums;
}

/* Buddhist Era Support */
.buddhist-year::after {
  content: " พ.ศ.";
  color: var(--gray-600);
  font-size: 0.9em;
}
```

### UI Consistency Rules

#### **1. Action Button Placement**
- **Table Actions**: Right-aligned column with `text-center` class
- **Form Actions**: Bottom of modal/form with `action-btn-group`
- **Page Actions**: Top-right of page header
- **Spacing**: Always use `action-btn-group` for consistent 4px gaps

#### **2. Modal Standards**
- **Header**: Bootstrap modal-header with btn-close
- **Body**: Bootstrap modal-body with proper form structure
- **Footer**: Bootstrap modal-footer with action-btn-group for buttons
- **Size**: Use `modal-lg` for forms with multiple fields

#### **3. Table Standards**
- **Action Column**: Fixed width with `text-center` alignment
- **Action Buttons**: Icon-only with tooltips (title attribute)
- **Responsive**: Use `table-responsive` wrapper
- **Empty State**: Centered text with colspan for empty tables

#### **4. Form Validation Standards**
- **Visual Feedback**: Red borders for invalid fields (`is-invalid` class)
- **Error Messages**: Below field with `invalid-feedback` class
- **Success States**: Green borders with `is-valid` class
- **Real-time**: Validate on input/blur events

#### **5. Loading States & Indicators**
```html
<!-- Page Loading -->
<div class="loading-spinner">
  <div class="spinner-border text-primary" role="status">
    <span class="sr-only">กำลังโหลด...</span>
  </div>
</div>

<!-- Button Loading State -->
<button class="action-btn action-save" disabled>
  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
  กำลังบันทึก...
</button>

<!-- Content Skeleton -->
<div class="skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
  <div class="skeleton-line"></div>
</div>
```

#### **6. Error States & Empty States**
```html
<!-- Error State -->
<div class="error-state">
  <i class="fas fa-exclamation-triangle error-icon"></i>
  <h3>เกิดข้อผิดพลาด</h3>
  <p>ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>
  <button class="action-btn action-primary">ลองใหม่</button>
</div>

<!-- Empty State -->
<div class="empty-state">
  <i class="fas fa-inbox empty-icon"></i>
  <h3>ไม่มีข้อมูล</h3>
  <p>ยังไม่มีรายการในส่วนนี้</p>
  <button class="action-btn action-add">เพิ่มรายการแรก</button>
</div>
```

### 📋 **Implementation Usage Patterns**

#### **HTML Structure Standards**
```html
<!-- Page Layout Template -->
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ชื่อหน้า - ระบบวัดแสง</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
  <link href="./assets/css/main-styles.css" rel="stylesheet">
  <link href="./assets/css/components.css" rel="stylesheet">
</head>
<body>
  <!-- Skip Link for Accessibility -->
  <a href="#main-content" class="skip-link">ข้ามไปยังเนื้อหาหลัก</a>
  
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <!-- Navigation content -->
  </nav>
  
  <!-- Main Content -->
  <main id="main-content" class="container-fluid py-4">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-2xl font-semibold">ชื่อหน้า</h1>
      <div class="action-btn-group">
        <!-- Page actions -->
      </div>
    </div>
    
    <!-- Page Content -->
    <div class="card">
      <div class="card-body">
        <!-- Content here -->
      </div>
    </div>
  </main>
  
  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="./assets/js/firebase-init.js"></script>
  <script type="module" src="./assets/js/ui-helpers.js"></script>
  <script type="module" src="script.js"></script>
</body>
</html>
```

#### **CSS Class Naming Conventions**
```css
/* BEM-like naming with utility classes */
.component-name { }              /* Block */
.component-name__element { }     /* Element */
.component-name--modifier { }    /* Modifier */

/* Utility Classes */
.u-text-center { text-align: center; }
.u-margin-bottom-large { margin-bottom: var(--space-8); }
.u-visually-hidden { /* Screen reader only */ }

/* State Classes */
.is-active { }
.is-disabled { }
.is-loading { }
.is-error { }

/* JavaScript Hooks */
.js-trigger { }                  /* JavaScript behavior triggers */
.js-target { }                   /* JavaScript manipulation targets */
```

#### **JavaScript Standards**
```javascript
// Event Delegation Pattern
document.addEventListener('click', (e) => {
  const target = e.target;
  
  // Action Button Handling
  if (target.matches('.action-edit') || target.closest('.action-edit')) {
    handleEdit(target);
  } else if (target.matches('.action-delete') || target.closest('.action-delete')) {
    handleDelete(target);
  }
});

// Loading State Management
const showLoadingState = (element) => {
  element.disabled = true;
  element.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2"></span>
    กำลังโหลด...
  `;
};

const hideLoadingState = (element, originalText) => {
  element.disabled = false;
  element.innerHTML = originalText;
};

// Error Handling Pattern
const handleApiError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  showAlert(`เกิดข้อผิดพลาด: ${error.message}`, 'danger');
  
  // Track error for debugging
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: `${context}: ${error.message}`,
      fatal: false
    });
  }
};
```

#### **Form Validation Implementation**
```javascript
// Form Validation Class
class FormValidator {
  constructor(form) {
    this.form = form;
    this.rules = new Map();
    this.setupEventListeners();
  }
  
  addRule(fieldName, validationFn, errorMessage) {
    this.rules.set(fieldName, { validationFn, errorMessage });
  }
  
  validateField(field) {
    const rule = this.rules.get(field.name);
    if (!rule) return true;
    
    const isValid = rule.validationFn(field.value);
    this.setFieldState(field, isValid, rule.errorMessage);
    return isValid;
  }
  
  setFieldState(field, isValid, errorMessage) {
    field.classList.remove('is-valid', 'is-invalid');
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = isValid ? '' : errorMessage;
    }
  }
  
  validateAll() {
    let isFormValid = true;
    const fields = this.form.querySelectorAll('[name]');
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
        if (isFormValid) field.focus(); // Focus first invalid field
      }
    });
    
    return isFormValid;
  }
}

// Usage Example
const validator = new FormValidator(document.getElementById('myForm'));
validator.addRule('email', (value) => /\S+@\S+\.\S+/.test(value), 'กรุณากรอกอีเมลที่ถูกต้อง');
validator.addRule('phone', (value) => /^[0-9]{10}$/.test(value), 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก');
```

### 🎯 **Quality Assurance Checklist**

#### **Before Deployment Checklist**
- [ ] **Responsive Design**: Test on mobile, tablet, desktop
- [ ] **Cross-Browser**: Test on Chrome, Firefox, Safari, Edge
- [ ] **Accessibility**: Keyboard navigation, screen reader compatibility
- [ ] **Performance**: Page load time < 2 seconds
- [ ] **Thai Language**: Proper font rendering, text spacing
- [ ] **Error Handling**: All error states properly displayed
- [ ] **Loading States**: Appropriate loading indicators
- [ ] **Form Validation**: Real-time validation working
- [ ] **Toast Notifications**: Proper success/error feedback
- [ ] **Action Buttons**: Consistent styling and behavior

#### **Code Quality Standards**
```javascript
// File Header Template
/*
 * File: path/to/file.js
 * Version: 1.0.0
 * Description: Brief description of file purpose
 * Dependencies: List of dependencies
 * Author: Development Team
 * Last Modified: 2025-09-09
 */

// Function Documentation
/**
 * Function description
 * @param {string} param1 - Description of parameter
 * @param {Object} options - Configuration options
 * @param {boolean} options.validate - Whether to validate input
 * @returns {Promise<Object>} Description of return value
 * @throws {Error} When validation fails
 */
async function myFunction(param1, options = {}) {
  // Implementation
}
```

### 🚀 **Performance Optimization Guidelines**

#### **CSS Performance**
- Use CSS custom properties for theme consistency
- Minimize specificity conflicts
- Use efficient selectors
- Leverage browser caching with versioned assets

#### **JavaScript Performance**
- Use event delegation for dynamic content
- Debounce expensive operations (auto-save, search)
- Lazy load non-critical components
- Optimize DOM queries with caching

#### **Asset Optimization**
- Compress images and use modern formats (WebP, AVIF)
- Use CDN for external resources
- Implement proper caching headers
- Bundle and minify CSS/JS for production

### 📱 **Mobile-First Implementation**
```css
/* Mobile-First Approach */
.component {
  /* Mobile styles first (default) */
  padding: var(--space-4);
  font-size: 0.875rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: var(--space-6);
    font-size: 1rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
    font-size: 1.125rem;
  }
}
```

This comprehensive UI design standard ensures consistency, accessibility, and professional appearance across the entire Light Measurement Recording System.

### Firebase Integration Standards

#### **1. Use FirebaseManager Only**
```javascript
// ✅ Correct - Use firebaseManager
const data = await firebaseManager.getDocument('collection', 'id');
await firebaseManager.updateDocument('collection', 'id', data);

// ❌ Incorrect - Don't use Firebase SDK directly
const docRef = doc(db, 'collection', 'id');
const docSnap = await getDoc(docRef);
```

#### **2. Event Listener Pattern**
```javascript
// ✅ Support both old and new classes for backward compatibility
if (target.classList.contains('action-edit') || target.classList.contains('edit-btn')) {
    // Edit logic
} else if (target.classList.contains('action-delete') || target.classList.contains('delete-btn')) {
    // Delete logic
}
```

#### **3. Error Handling Pattern**
```javascript
try {
    const result = await firebaseManager.someOperation();
    showAlert('สำเร็จ', 'success');
} catch (error) {
    console.error('Error:', error);
    showAlert(`เกิดข้อผิดพลาด: ${error.message}`, 'danger');
}
```

## Important Implementation Details

### Module Import Pattern
```javascript
// Standard module imports used throughout
import { firebaseManager } from './assets/js/firebase-init.js';
import { showAlert, formatDate, showLoading, hideLoading } from './assets/js/ui-helpers.js';
import { onSnapshot } from './assets/js/firebase-init.js'; // For real-time updates
```

### Auto-save Implementation (job-details v10.0)
```javascript
// Debounced auto-save with 3-second delay
let autoSaveTimer = null;
let isDataChanged = false;

const triggerAutoSave = () => {
    isDataChanged = true;
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(autoSaveData, 3000);
};

const autoSaveData = async () => {
    if (!isDataChanged || !jobId) return;
    // Auto-save logic with Firebase updates
};
```

### Bulk Edit System
```javascript
// Multi-row selection with checkbox toggles
const toggleBulkSelection = (checkbox, rowIndex) => {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        selectedRows.add(rowIndex);
        row.classList.add('table-warning');
    } else {
        selectedRows.delete(rowIndex);
        row.classList.remove('table-warning');
    }
};
```

### LUX Validation System
```javascript
// Real-time LUX value validation with visual feedback
const validateLuxValue = (input) => {
    const value = input.value.trim();
    const luxPattern = /^\d+(\.\d{1,2})?$/; // Decimal with up to 2 places
    
    if (value && !luxPattern.test(value)) {
        input.classList.add('is-invalid');
        return false;
    } else {
        input.classList.remove('is-invalid');
        return true;
    }
};
```

### Toast Notifications (v1.1)
- **Modern Design**: Gradient backgrounds, progress bars, animations
- **Position**: Bottom-right with slide-up animation  
- **Types**: success, warning, danger, info
- **Usage**: `showAlert(message, type, duration)`

### Form Validation System
- **Custom Validation**: Uses `novalidate` to bypass browser validation
- **Choices.js Integration**: Special handling for dropdown validation
- **Visual Feedback**: Red borders, error messages, field highlighting
- **Scroll-to-Error**: Auto-scrolls to first validation error

### Navigation System
- **Referrer-based**: Tracks navigation origin with URL parameters
- **Dynamic Back Buttons**: Context-aware navigation (main vs job-details)
- **Example**: `new-job.html?id=123&from=main`

## Version Management

### File Versioning
All HTML/CSS/JS files include version headers:
```html
<!-- 
  path: /ui/filename.html
  version: 3.2.0 (Feature description)  
  date: 2025-09-05
  time: 11:15:00
  description: Change description
-->
```

### Current Versions
- **main.html**: v6.1 (Modern Button Design)
- **new-job.html**: v3.2.0 (Modern toast notifications + Running numbers)  
- **master-data-manager.html**: v7.3 (Enhanced Remark System - Standard Recommendations)
- **job-details.html**: v10.7 (Enhanced Modal Title Contrast)
- **report-finalizer.html**: v7.1 (Integrated Template Management + Enhanced UX)
- **template-manager.html**: v3.0 (Module system migration + Modern design)
- **branch-manager.html**: v1.2 (Enhanced UX with beautiful modals)
- **ui-helpers.js**: v1.1 (Modern toast notifications)
- **firebase-init.js**: v1.1 (Added getCurrentUserId and getCurrentUser methods)
- **tag-processor.js**: v1.1 (Enhanced Remark System + Master/Job Remarks + Auto-pagination)

## Firebase Configuration

Firebase config is in `firebase-config.js`:
```javascript
window.firebaseConfig = {
  projectId: "light-report-8bb0e",
  // ... other config
};
```

## Common Development Patterns

### Page Initialization
```javascript
async function initializeApp() {
    if (!await firebaseManager.initialize()) return;
    await loadMasterData();
    initializeDropdowns(); 
    setupEventListeners();
    // No startup alert - removed in v3.2.0
}
```

### Error Handling
```javascript
try {
    await operation();
    showAlert('สำเร็จ', 'success');
} catch (error) {
    console.error('Error:', error);
    showAlert(`เกิดข้อผิดพลาด: ${error.message}`, 'danger');
}
```

### Data Loading Pattern
```javascript
const collectionRef = firebaseManager.getCollection('customers');
onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderData(data);
});
```

## Migration Guidelines

When migrating legacy HTML files to module system:
1. **Extract inline CSS** to appropriate module file
2. **Extract inline JavaScript** to module imports  
3. **Add version header** with migration notes
4. **Update Firebase calls** to use FirebaseManager
5. **Replace alert system** with modern toast notifications
6. **Add form validation** with visual feedback
7. **Implement modern UX features** (auto-save, bulk operations, validation)
8. **Test thoroughly** with existing data

## Recent Major Updates (September 2025)

### master-data-manager.html v7.3 - Enhanced Remark System (September 2025)
- **Standard Recommendations Management**: New tab for managing standard light measurement recommendations
- **Category Classification System**: LOW_LIGHT, HIGH_LIGHT, GENERAL categories for organized recommendations
- **Priority Management**: HIGH, MEDIUM, LOW priority levels for recommendation importance
- **Status Control**: ACTIVE/INACTIVE status management for recommendations
- **Advanced Filtering**: Real-time search and filtering by category, priority, and text content
- **CRUD Operations**: Full create, read, update, delete functionality with modern modals
- **Firebase Integration**: Real-time updates with onSnapshot for collaborative editing

### master-data-manager.html v7.2 + branch-manager.html v1.2 - Complete Branch Management Overhaul
- **Hierarchical Branch Management**: Region → Province → Branch structure for handling 500+ branches efficiently
- **Dedicated Branch Manager Page**: Standalone page with full-screen interface and modern modals
- **Beautiful Modal System**: Replaced prompt() dialogs with professional Bootstrap modals
- **Advanced Features**: Import/Export Excel, bulk operations, search/filter functionality
- **Consistent Navigation**: Same-window navigation for better user flow
- **Performance**: Optimized tree rendering and data management for large datasets

### job-details.html v10.0 - Complete UX Overhaul  
- **Auto-save System**: 3-second debounced auto-save with visual indicators
- **Bulk Edit Modal**: Multi-row selection with batch operations (work type, standard, tolerance)
- **LUX Validation**: Real-time format validation with visual feedback
- **Search/Filter System**: Text search + dropdown filters for area/work type
- **Remark Column**: Additional notes field for each measurement
- **Performance**: Optimized data handling and Firebase operations
- **Module Migration**: Converted from inline CSS/JS to modular architecture

### Complete Module System Migration
- **All Pages Migrated**: `report-finalizer.html` (v7.0) and `template-manager.html` (v3.0) completed
- **Architecture Consistency**: All major pages now use modular CSS/JS architecture  
- **Performance**: 71% file size reduction and faster loading across all pages
- **Maintainability**: Shared components and consistent code patterns

### tag-processor.js v1.1 - Enhanced Remark System Integration
- **New Template Tags**: Added `{{REMARK_MASTER}}` for standard recommendations and `{{REMARK_JOB}}` for job-specific remarks
- **Auto-pagination Integration**: Remark sections automatically appear after each 20-row table page in PDF reports
- **Professional Styling**: Color-coded remark sections with icons and proper spacing
- **Dynamic Content**: REMARK_MASTER pulls from Firebase remarks collection, REMARK_JOB combines recommendations + observations

### firebase-init.js v1.1 Enhancements
- **User Management**: Added `getCurrentUserId()` and `getCurrentUser()` methods
- **Improved Error Handling**: Better error messages and debugging
- **Data Access Patterns**: Fixed Firebase document access patterns

## Performance Notes

- **71% file size reduction** achieved through modularization
- **71% faster loading** on return visits due to module caching  
- **Toast notifications** are more efficient than DOM-based alerts
- **Running numbers** use Firebase atomic operations for concurrency safety
- **Auto-save optimization**: Debounced saves prevent excessive Firebase writes
- **Bulk operations**: Batch updates reduce database calls
- **Search/Filter**: Client-side filtering for instant results

## Thai Language Support

- **Primary Language**: All UI text in Thai
- **Font**: Sarabun (Google Fonts)
- **Date Format**: Thai Buddhist calendar support (พ.ศ.)
- **Number Format**: Thai locale formatting
- **Form Labels**: Use Thai with English equivalents in placeholders

## Development Guidelines

- **Professional Design**: Clean, elegant, modern interface - avoid flashy colors, maintain professional appearance
- **Thai Communication**: Use Thai language for all communication
- **File Headers**: Every modified file must include path, version, date, and time
- **No Unnecessary Changes**: Never modify UX/UI or functions unrelated to the current task
- **Documentation-Driven**: Development must follow and align with existing documentation
- **User-Friendly**: Optimize for ease of use by employees
- **Modern Frameworks**: Use contemporary tools and frameworks when appropriate

## System Analysis & Development Roadmap (December 2024)

### Current System Strengths
- ✅ **Module Architecture**: Well-structured, maintainable codebase
- ✅ **Performance**: 71% file size reduction, faster loading
- ✅ **UX Features**: Auto-save, bulk operations, toast notifications
- ✅ **Firebase Integration**: Real-time updates and data sync
- ✅ **Thai Language Support**: Complete localization

### Areas for Improvement
- ⚠️ **No Authentication**: System lacks user access control
- ⚠️ **No Audit Trail**: Cannot track user activities
- ⚠️ **Template Mismatch**: Reports don't match actual Test Report format
- ⚠️ **No Dashboard**: Missing overview and analytics
- ⚠️ **No Backup System**: Risk of data loss

## Development Roadmap 2025 - Modern UI Standards Implementation

### Current Status Overview (September 2025)
✅ **System Architecture**: Module-based system with 71% performance improvement  
✅ **UI/UX Standardization**: Complete action button consistency across all pages  
✅ **Firebase Integration**: Real-time updates with firebaseManager abstraction  
🚧 **Template System**: Core foundation complete, integration features in progress  
🔶 **Modern UI Standards**: HSL design tokens and modern components implementation  
⏳ **Authentication**: Design complete, implementation ready  

---

## 🎨 Priority 0: Modern UI Standards Implementation (Critical Priority)
**Estimated Timeline**: 3-4 days | **Status**: 🔶 Ready for Implementation

### Phase A: HSL Design Token Migration (1 day)
**Current Status**: CSS variables modernization with HSL format

**Implementation Tasks**:
1. **Color System Migration**
   ```css
   /* Update main-styles.css */
   :root {
     /* Migrate from HEX to HSL design tokens */
     --primary: 211 100% 50%;          /* #0080FF */
     --success: 142 71% 45%;           /* #38A169 */
     --destructive: 0 84% 60%;         /* #F56565 */
   }
   ```

2. **Component CSS Updates**
   - Update `components.css` to use HSL color functions
   - Implement hover state transitions with HSL
   - Add opacity support using HSL syntax

3. **Action Button System Enhancement**
   ```css
   .action-btn {
     background-color: hsl(var(--primary));
     color: hsl(var(--primary-foreground));
     transition: background-color var(--transition-base);
   }
   
   .action-btn:hover {
     background-color: hsl(var(--primary-hover));
   }
   ```

**Files to Update**:
- `assets/css/main-styles.css` → v2.0 (HSL design tokens)
- `assets/css/components.css` → v2.0 (HSL color functions)

### Phase B: Dark Mode Infrastructure (1 day)
**Current Status**: No dark mode support, modern systems require it

**Implementation Tasks**:
1. **Dark Mode CSS Variables**
   ```css
   .dark {
     --background: 210 25% 8%;        /* Dark blue background */
     --foreground: 207 20% 95%;       /* Light text */
     --card: 210 25% 10%;             /* Dark cards */
   }
   ```

2. **Theme Toggle Component**
   - Add theme switcher to navigation
   - Implement localStorage theme persistence
   - Add system preference detection

3. **All Component Dark Mode Support**
   - Update modals, cards, forms for dark mode
   - Ensure proper contrast ratios (WCAG AA)
   - Test readability in both modes

**Files to Create/Update**:
- `assets/js/theme-manager.js` (new file)
- Update all HTML files with theme toggle option

### Phase C: Modern Animation System (1 day)  
**Current Status**: Basic CSS transitions, needs modern micro-interactions

**Implementation Tasks**:
1. **CSS Animation Library**
   ```css
   /* Add to main-styles.css */
   @keyframes fadeIn {
     from { opacity: 0; transform: translateY(10px); }
     to { opacity: 1; transform: translateY(0); }
   }
   
   @keyframes slideUp {
     from { transform: translateY(100%); }
     to { transform: translateY(0); }
   }
   
   .animate-fade-in { animation: fadeIn 200ms ease-out; }
   .animate-slide-up { animation: slideUp 300ms ease-out; }
   ```

2. **Loading State Animations**
   - Modern skeleton loading components
   - Button loading states with spinners
   - Page transition effects

3. **Micro-interactions**
   - Button hover effects
   - Form validation feedback animations
   - Toast notification animations

### Phase D: Component Modernization (0.5 day)
**Current Status**: Bootstrap 5.3.3 components, needs modern variants

**Implementation Tasks**:
1. **Enhanced Card Components**
   ```html
   <div class="card modern-card">
     <div class="card-header gradient-header">
       <h5 class="card-title modern-title">Title</h5>
     </div>
   </div>
   ```

2. **Modern Form Components**
   - Floating labels
   - Enhanced validation states
   - Better focus indicators

3. **Advanced Table Components**
   - Sticky headers
   - Enhanced sorting indicators  
   - Better responsive behavior

---

## 🚀 Priority 1: Template System Integration (Critical)
**Estimated Timeline**: 5-7 days | **Status**: 🔶 In Development

### Phase A: Report Finalizer → Template Editor Integration (2-3 days)
**Current Status**: Basic template selection implemented, job data injection needed

**Implementation Tasks**:
1. **Job Data Context Passing**
   ```javascript
   // In report-finalizer.html
   window.location.href = `template-editor.html?mode=report&jobId=${jobId}&templateId=${templateId}`;
   ```
   
2. **Template Editor Report Mode Enhancement**
   - Load job data from Firebase using jobId parameter
   - Inject measurement data into template content
   - Apply tag processing for {{JOB_ID}}, {{CUSTOMER_NAME}}, etc.
   - Enable preview functionality with actual data

3. **Template Selection UI**
   - Dynamic template dropdown in report-finalizer
   - Template preview thumbnails
   - Template filtering by category/type

**Technical Integration Points**:
- **File**: `template-editor.html` (current v1.1) → target v2.0
- **Dependencies**: `tag-processor.js`, `report-finalizer.html`
- **Firebase Collections**: `jobs`, `report_templates`

### Phase B: PDF Generation Integration (2-3 days)  
**Current Status**: TagProcessor v1.1 ready, PDF integration needed

**Implementation Tasks**:
1. **Template → PDF Conversion Pipeline**
   ```javascript
   // New function in pdf-generator.js
   const generateReportFromTemplate = async (templateContent, jobData) => {
       const processedContent = await tagProcessor.processAllTags(templateContent, jobData);
       return generatePDFFromHTML(processedContent);
   };
   ```

2. **Enhanced Tag Processing**
   - Measurement table generation with auto-pagination
   - Remark integration ({{REMARK_MASTER}}, {{REMARK_JOB}})
   - Company signature blocks
   - Dynamic content sections

3. **Print-Optimized Output**
   - CSS media queries for print layout
   - Page break controls
   - Professional formatting

**Files to Update**:
- `pdf-generator.js` → v2.0 (template integration)
- `tag-processor.js` → v1.2 (enhanced processing)
- `template-editor.html` → v2.0 (PDF preview)

### Phase C: Template Management Features (1-2 days)
**Current Status**: Basic CRUD operations complete, advanced features needed

**Implementation Tasks**:
1. **Template Preview System**
   - Thumbnail generation for template list
   - Preview modal with sample data injection
   - Template comparison view

2. **Advanced Template Features**
   - Template categories/tags system
   - Template search and filtering
   - Template import/export (HTML format)
   - Template versioning system

**Files to Update**:
- `template-manager.html` → v4.0 (advanced features)
- Firebase schema extension for template metadata

---

## 🔴 Priority 2: User Authentication & Access Control (High Priority)
**Estimated Timeline**: 5-6 days | **Status**: 🔶 Planning Complete - Ready for Implementation

### System Architecture (Admin-based User Management)
- **No Email Dependency**: Admin creates username/password directly
- **Firebase Authentication**: Integration with existing Firebase backend  
- **Role-Based Access Control**: 4-tier permission system
- **Session Management**: Secure login/logout with persistence

### User Role Structure
```
🔴 ADMIN: Full system access + user management
🟡 MANAGER: Data access + report approval  
🟢 INSPECTOR: Create jobs + record measurements
🔵 VIEWER: View reports only
```

### Implementation Phases
1. **Phase 1**: Login system with Firebase Auth (1-2 days)
   - Create `login.html` with modern UI
   - Implement Firebase authentication flow
   - Session persistence and auto-logout

2. **Phase 2**: User management interface (2 days)
   - Admin panel in `master-data-manager.html`
   - User CRUD operations
   - Role assignment interface

3. **Phase 3**: Access control implementation (2 days)
   - Navigation menu filtering by permissions
   - Page-level access control
   - Function-level permission checks

### Database Structure
```javascript
/users/
├── {userId}/
│   ├── username: "admin001"
│   ├── displayName: "ผู้ดูแลระบบ"
│   ├── role: "ADMIN|MANAGER|INSPECTOR|VIEWER"
│   ├── permissions: ["view_jobs", "create_jobs", "manage_users"]
│   ├── isActive: true
│   └── lastLogin: timestamp
```

---

## 🟡 Priority 3: Dashboard & Analytics System (Medium Priority)
**Estimated Timeline**: 4-5 days | **Status**: 📋 Design Phase

### Core Features
1. **Job Statistics Dashboard**
   - Monthly/yearly job completion trends
   - Customer activity analysis
   - Inspector performance metrics
   - Light measurement statistics

2. **Visual Analytics**
   - Chart.js integration for data visualization
   - Interactive graphs and reports
   - Export functionality (PDF, Excel)

3. **Quick Actions Panel**
   - Recent jobs access
   - Pending approvals
   - System notifications

### Implementation Plan
- Create `dashboard.html` as new main landing page
- Integrate Chart.js for data visualization
- Add analytics queries to Firebase operations
- Design responsive layout with modern cards

---

## 🔵 Priority 4: System Enhancement Features (Low Priority)
**Estimated Timeline**: 3-4 days | **Status**: 📋 Planned

### Audit Trail System (1-2 days)
- User action logging
- Change history tracking  
- Activity reports and analytics
- Data integrity monitoring

### Backup & Recovery (1-2 days)
- Automated daily backups
- Data export/import functionality
- Version control for critical data
- Disaster recovery procedures

### Performance Optimizations (1 day)
- Image lazy loading
- Data caching strategies
- Bundle optimization
- Loading state improvements

---

## Quick Wins (Fast Implementation, High Impact)
**Estimated Timeline**: 1-2 days total

### UX Improvements (0.5 day)
- Loading states with spinners during data load
- Better error messages with clear, actionable text
- Keyboard shortcuts (Ctrl+S save, ESC cancel)
- Enhanced tooltips and help text

### Mobile & Accessibility (0.5 day) 
- Mobile-optimized layouts
- Touch-friendly button sizes
- Screen reader compatibility
- High contrast mode support

### Developer Experience (0.5 day)
- Enhanced debugging tools
- Development documentation
- Code linting setup
- Performance monitoring

---

## Implementation Schedule & Resource Allocation

### 🎯 Sprint 0: Modern UI Standards (Priority Week)
**Estimated Duration**: 3-4 days | **Must Complete Before Other Development**

#### **Day 1: HSL Design Token Migration**
```bash
# Morning (2-3 hours)
1. Backup current CSS files
   cp assets/css/main-styles.css assets/css/main-styles.css.backup
   
2. Update main-styles.css with HSL design tokens
   - Migrate :root variables from HEX to HSL format
   - Add new semantic color tokens
   - Test color consistency across existing pages

3. Update components.css  
   - Convert action buttons to use HSL colors
   - Add hover state transitions with HSL syntax
   - Test all interactive elements

# Afternoon (2-3 hours) 
4. Test HSL migration on critical pages
   - main.html, job-details.html, master-data-manager.html
   - Verify color consistency and visual appearance
   - Fix any color issues discovered

5. Create color utility CSS classes
   .text-primary { color: hsl(var(--primary)); }
   .bg-primary { background-color: hsl(var(--primary)); }
```

#### **Day 2: Dark Mode Infrastructure**
```bash  
# Morning (3-4 hours)
1. Create theme-manager.js module
   - Theme toggle functionality
   - localStorage persistence  
   - System preference detection

2. Add dark mode CSS variables to main-styles.css
   - .dark class with all color overrides
   - Ensure WCAG AA contrast ratios
   - Test readability in dark mode

# Afternoon (2-3 hours)
3. Update HTML templates with theme toggle
   - Add toggle button to navigation
   - Update all page templates
   - Test theme switching functionality

4. Dark mode component testing
   - Verify modals, cards, forms in dark mode
   - Fix contrast issues
   - Ensure consistent dark mode experience
```

#### **Day 3: Modern Animation System**
```bash
# Morning (2-3 hours)
1. Add animation keyframes to main-styles.css
   - fadeIn, slideUp, pulse animations
   - Loading spinner variations
   - Micro-interaction effects

2. Update toast notification system  
   - Enhanced slide-up animations
   - Progress bar animations
   - Better timing and easing

# Afternoon (2-3 hours)
3. Implement loading state animations
   - Button loading states with spinners
   - Skeleton loading for tables
   - Page transition effects

4. Add form validation animations
   - Error state feedback animations  
   - Success state micro-interactions
   - Focus ring animations
```

#### **Day 4: Component Modernization & Testing**
```bash
# Morning (2-3 hours)
1. Enhanced card components
   - Gradient headers for important cards
   - Better shadow and border-radius system
   - Modern spacing and typography

2. Advanced table components
   - Sticky headers for long tables
   - Enhanced sorting indicators
   - Better responsive behavior on mobile

# Afternoon (2-3 hours)
3. Cross-browser testing
   - Chrome, Firefox, Safari, Edge
   - Mobile responsiveness testing
   - Performance impact assessment

4. Documentation updates
   - Update CLAUDE.md with new standards
   - Create component usage examples
   - Performance benchmarking
```

---

### 🚀 Sprint 1: Template System Integration (Week 2-3)
**Days 1-3**: Report Finalizer → Template Editor Integration
- Job data injection and context passing
- Template selection and preview functionality
- Real-time template content updates

**Days 4-6**: PDF Generation Integration  
- Template → PDF conversion pipeline
- Enhanced tag processing with measurement data
- Print-optimized formatting and layouts

**Day 7**: Template Management Features
- Preview system and advanced template operations
- Quality assurance and testing

### 🔐 Sprint 2: Authentication & Security (Week 4)
**Days 1-2**: Login system implementation
**Days 3-4**: User management interface  
**Days 5-6**: Access control and permissions
**Day 7**: Security testing and documentation

### Sprint 3: Analytics & Enhancement (Week 4)
**Days 1-3**: Dashboard and analytics system
**Days 4-5**: Quick wins implementation
**Days 6-7**: Final testing and deployment preparation

---

## Success Metrics & Quality Assurance

### Performance Targets
- **Page Load Time**: <2 seconds for all pages
- **Firebase Response**: <500ms for data operations  
- **PDF Generation**: <3 seconds for standard reports
- **Mobile Performance**: Lighthouse score >90

### User Experience Goals
- **Task Completion Rate**: >95% for core workflows
- **Error Rate**: <1% for critical operations
- **User Satisfaction**: Consistent UI/UX across all pages
- **Learning Curve**: <30 minutes for new user onboarding

### Technical Quality Standards  
- **Code Coverage**: >80% for critical functions
- **Cross-browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Mobile Responsiveness**: All screen sizes 320px+
- **Security Compliance**: Firebase security rules implemented

---

## Risk Assessment & Mitigation

### High-Risk Areas
1. **Template System Complexity**: Mitigation through incremental development and comprehensive testing
2. **Firebase Integration**: Mitigation through firebaseManager abstraction layer
3. **User Authentication**: Mitigation through Firebase Auth best practices
4. **Data Migration**: Mitigation through backup procedures and rollback plans

### Contingency Plans
- **Template Integration Delays**: Focus on core report generation first
- **Authentication Complications**: Implement basic auth before role-based features  
- **Performance Issues**: Progressive enhancement approach
- **Browser Compatibility**: Graceful degradation for older browsers

---

## Future Development & Advanced Features

### Template System Evolution
- **Template Marketplace**: Shareable template library
- **Collaborative Editing**: Multi-user template development
- **Version Control**: Template change management
- **A/B Testing**: Template performance analytics

### System Integrations
- **External APIs**: Government compliance systems
- **Email Notifications**: Automated report delivery
- **Calendar Integration**: Inspection scheduling
- **Mobile App**: Native iOS/Android applications

### AI-Powered Features  
- **Smart Recommendations**: ML-based template suggestions
- **Auto-completion**: Intelligent form filling
- **Anomaly Detection**: Unusual measurement patterns
- **Predictive Analytics**: Maintenance scheduling

---

## Technical Debt & Code Quality

### Current Technical Debt
1. **Legacy Code Patterns**: Some pages still use old Firebase SDK directly
2. **Inconsistent Error Handling**: Need standardization across all modules
3. **Missing Unit Tests**: No automated testing framework implemented
4. **Documentation Gaps**: Some functions lack comprehensive documentation

### Code Quality Improvements
1. **ESLint Integration**: Implement code linting standards
2. **TypeScript Migration**: Consider gradual migration for better type safety
3. **Automated Testing**: Jest/Cypress integration for comprehensive testing
4. **Performance Monitoring**: Real User Monitoring (RUM) implementation

## Planned Features (In Development)

### User Authentication & Access Control System
**Status**: 🔶 Planning Phase - Design Complete

#### **System Architecture (Admin-based User Management)**
- **No Email Dependency**: Admin creates username/password directly
- **Firebase Authentication**: Integration with existing Firebase backend
- **Role-Based Access Control**: 4-tier permission system
- **Session Management**: Secure login/logout with persistence

#### **User Role Structure**
```
🔴 ADMIN: Full system access + user management
🟡 MANAGER: Data access + report approval
🟢 INSPECTOR: Create jobs + record measurements  
🔵 VIEWER: View reports only
```

#### **Implementation Plan**
1. **Phase 1**: Login system with Firebase Auth (1 day)
2. **Phase 2**: Admin panel for user management (2 days)
3. **Phase 3**: Role-based access control implementation (2 days)
4. **Phase 4**: In-app notification system (1 day)

#### **Database Structure**
```javascript
/users/
├── {userId}/
│   ├── username: "admin001"
│   ├── password: "hashed_password"
│   ├── displayName: "ผู้ดูแลระบบ"
│   ├── role: "ADMIN|MANAGER|INSPECTOR|VIEWER"
│   ├── permissions: ["view_jobs", "create_jobs", "manage_users"]
│   ├── isActive: true
│   └── lastLogin: timestamp
```

#### **Permission Matrix**
- **Jobs**: view_jobs, create_jobs, edit_jobs, delete_jobs
- **Reports**: view_reports, create_reports, approve_reports
- **Master Data**: manage_customers, manage_inspectors, manage_templates
- **System**: manage_users, system_settings

#### **Integration Points**
- All existing pages will require authentication check
- Menu items filtered by user permissions  
- Audit trail for all user actions
- Session timeout and security controls