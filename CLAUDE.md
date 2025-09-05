# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Thai-language **Light Measurement Recording System** built as a web application for occupational health and safety compliance. The system manages light measurement inspections, generates PDF reports, and maintains customer/inspector master data using Firebase Firestore as the backend.

**Current Status**: Version 6.1+ with modular architecture optimization completed. Performance improved by 71% through module system implementation.

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

### Migration Status
- **✅ Fully Migrated**: All files moved to root directory
- **✅ Module System**: `main.html` (v6.0), `new-job.html` (v3.2.0), `master-data-manager.html` (v6.1), `job-details.html` (v10.0)
- **🔄 Needs Module Migration**: `report-finalizer.html`, `template-manager.html`

### Firebase Data Structure
```
/artifacts/{app-id}/public/data/
├── jobs/                 # Job records with measurements
├── customers/            # Customer data with branches
├── inspectors/           # Personnel data with licenses
├── instruments/          # Measurement equipment
├── work_types/           # Standard lighting requirements
├── running_numbers/      # Auto-increment counters (NEW in v6.1)
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

### 5. PDF Report Generation
- **TagProcessor**: Processes template tags like `{{JOB_ID}}`, `{{CUSTOMER_NAME}}`
- **Dynamic Content**: Auto-generates measurement tables
- **Company Data**: Integrates licenses and signatory information
- **File Location**: Logic in `pdf-generator.js` and `tag-processor.js`

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
- **main.html**: v6.0 (Module system + Enhanced navigation)
- **new-job.html**: v3.2.0 (Modern toast notifications + Running numbers)  
- **master-data-manager.html**: v6.1 (Running numbers management)
- **job-details.html**: v10.0 (Auto-save + Bulk edit + LUX validation + Search/Filter)
- **ui-helpers.js**: v1.1 (Modern toast notifications)
- **firebase-init.js**: v1.1 (Added getCurrentUserId and getCurrentUser methods)

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

### job-details.html v10.0 - Complete UX Overhaul
- **Auto-save System**: 3-second debounced auto-save with visual indicators
- **Bulk Edit Modal**: Multi-row selection with batch operations (work type, standard, tolerance)
- **LUX Validation**: Real-time format validation with visual feedback
- **Search/Filter System**: Text search + dropdown filters for area/work type
- **Remark Column**: Additional notes field for each measurement
- **Performance**: Optimized data handling and Firebase operations
- **Module Migration**: Converted from inline CSS/JS to modular architecture

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