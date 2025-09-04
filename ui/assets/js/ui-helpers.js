/*
  path: /ui/assets/js/ui-helpers.js
  version: 1.0 (JavaScript Module Extraction - UI Helper Functions)
  date: 2025-09-04
  time: 16:00:00
  description: Common UI helper functions for alerts, formatting, dropdowns, and form operations
*/

/**
 * UI Helper Functions for Light Measurement System
 * Contains all common UI operations used across multiple pages
 */

// ===== ALERT SYSTEM =====

/**
 * Show alert message to user
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, warning, danger, info)
 * @param {number} duration - Auto hide duration in milliseconds (0 = no auto hide)
 */
export function showAlert(message, type = 'info', duration = 5000) {
    const alertPlaceholder = document.getElementById('alert-placeholder');
    if (!alertPlaceholder) {
        console.warn('Alert placeholder not found');
        return;
    }

    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.setAttribute('role', 'alert');
    
    alertElement.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Add to placeholder
    alertPlaceholder.appendChild(alertElement);

    // Auto hide if duration is set
    if (duration > 0) {
        setTimeout(() => {
            if (alertElement && alertElement.parentNode) {
                alertElement.classList.remove('show');
                setTimeout(() => {
                    if (alertElement && alertElement.parentNode) {
                        alertElement.parentNode.removeChild(alertElement);
                    }
                }, 150);
            }
        }, duration);
    }

    return alertElement;
}

/**
 * Get appropriate icon for alert type
 * @param {string} type - Alert type
 * @returns {string} Icon class
 */
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Clear all alerts
 */
export function clearAlerts() {
    const alertPlaceholder = document.getElementById('alert-placeholder');
    if (alertPlaceholder) {
        alertPlaceholder.innerHTML = '';
    }
}

// ===== DATE & TIME FORMATTING =====

/**
 * Format date to Thai format
 * @param {Date|string} date - Date to format
 * @param {boolean} includeTime - Include time in format
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
    if (!date) return '-';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return '-';
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Bangkok'
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    }

    return dateObj.toLocaleDateString('th-TH', options);
}

/**
 * Format date to ISO string for input fields
 * @param {Date|string} date - Date to format
 * @returns {string} ISO date string
 */
export function formatDateForInput(date) {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return '';
    }

    return dateObj.toISOString().split('T')[0];
}

/**
 * Format time to Thai format
 * @param {Date|string} date - Date/time to format
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
    if (!date) return '-';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return '-';
    }

    return dateObj.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok'
    });
}

/**
 * Get current Thai date string
 * @returns {string} Current date in Thai format
 */
export function getCurrentThaiDate() {
    return formatDate(new Date());
}

// ===== NUMBER FORMATTING =====

/**
 * Format number with Thai number format
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    
    const num = parseFloat(value);
    if (isNaN(num)) {
        return '-';
    }

    return num.toLocaleString('th-TH', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Format currency with Thai Baht symbol
 * @param {number} value - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    
    const num = parseFloat(value);
    if (isNaN(num)) {
        return '-';
    }

    return num.toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB'
    });
}

// ===== DROPDOWN MANAGEMENT =====

/**
 * Populate dropdown with options
 * @param {string|Element} selectElement - Select element or selector
 * @param {Array} options - Array of option objects
 * @param {string} valueField - Field name for option value
 * @param {string} textField - Field name for option text
 * @param {boolean} addEmptyOption - Add empty option at beginning
 */
export function populateDropdown(selectElement, options, valueField = 'id', textField = 'name', addEmptyOption = true) {
    const select = typeof selectElement === 'string' ? document.querySelector(selectElement) : selectElement;
    
    if (!select) {
        console.warn('Select element not found:', selectElement);
        return;
    }

    // Clear existing options
    select.innerHTML = '';

    // Add empty option if requested
    if (addEmptyOption) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- เลือก --';
        select.appendChild(emptyOption);
    }

    // Add options from data
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option[valueField] || option.id || '';
        optionElement.textContent = option[textField] || option.name || option.text || '';
        
        // Add data attributes if needed
        if (option.data) {
            Object.keys(option.data).forEach(key => {
                optionElement.setAttribute(`data-${key}`, option.data[key]);
            });
        }
        
        select.appendChild(optionElement);
    });
}

/**
 * Get selected option data from dropdown
 * @param {string|Element} selectElement - Select element or selector
 * @returns {object|null} Selected option data
 */
export function getSelectedOptionData(selectElement) {
    const select = typeof selectElement === 'string' ? document.querySelector(selectElement) : selectElement;
    
    if (!select || !select.selectedIndex || select.selectedIndex === 0) {
        return null;
    }

    const selectedOption = select.options[select.selectedIndex];
    const data = {
        value: selectedOption.value,
        text: selectedOption.textContent
    };

    // Get data attributes
    Array.from(selectedOption.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
            const key = attr.name.substring(5); // Remove 'data-' prefix
            data[key] = attr.value;
        }
    });

    return data;
}

// ===== FORM HELPERS =====

/**
 * Clear form fields
 * @param {string|Element} formElement - Form element or selector
 */
export function clearForm(formElement) {
    const form = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;
    
    if (!form) {
        console.warn('Form element not found:', formElement);
        return;
    }

    // Reset form
    form.reset();

    // Clear validation states
    form.querySelectorAll('.is-valid, .is-invalid').forEach(element => {
        element.classList.remove('is-valid', 'is-invalid');
    });

    // Clear validation messages
    form.querySelectorAll('.valid-feedback, .invalid-feedback').forEach(element => {
        element.style.display = 'none';
    });
}

/**
 * Get form data as object
 * @param {string|Element} formElement - Form element or selector
 * @returns {object} Form data object
 */
export function getFormData(formElement) {
    const form = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;
    
    if (!form) {
        console.warn('Form element not found:', formElement);
        return {};
    }

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        if (data[key]) {
            // Handle multiple values (checkboxes, etc.)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    });

    return data;
}

/**
 * Populate form with data
 * @param {string|Element} formElement - Form element or selector
 * @param {object} data - Data to populate
 */
export function populateForm(formElement, data) {
    const form = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;
    
    if (!form) {
        console.warn('Form element not found:', formElement);
        return;
    }

    Object.keys(data).forEach(key => {
        const element = form.elements[key];
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = Boolean(data[key]);
            } else if (element.type === 'radio') {
                const radioButton = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            } else {
                element.value = data[key] || '';
            }
        }
    });
}

/**
 * Validate form field
 * @param {Element} field - Form field element
 * @param {string} message - Validation message
 * @param {boolean} isValid - Validation result
 */
export function validateField(field, message = '', isValid = true) {
    if (!field) return;

    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Add appropriate validation class
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');

    // Find or create feedback element
    let feedbackElement = field.parentNode.querySelector(isValid ? '.valid-feedback' : '.invalid-feedback');
    
    if (!feedbackElement && message) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = isValid ? 'valid-feedback' : 'invalid-feedback';
        field.parentNode.appendChild(feedbackElement);
    }

    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.style.display = message ? 'block' : 'none';
    }
}

// ===== TABLE HELPERS =====

/**
 * Create table row with action buttons
 * @param {object} data - Row data
 * @param {Array} columns - Column definitions
 * @param {Array} actions - Action button definitions
 * @returns {string} Table row HTML
 */
export function createTableRow(data, columns, actions = []) {
    let rowHtml = '<tr>';
    
    // Add data columns
    columns.forEach(column => {
        let cellValue = '';
        
        if (typeof column === 'string') {
            cellValue = data[column] || '';
        } else {
            cellValue = column.formatter ? column.formatter(data[column.field], data) : (data[column.field] || '');
        }
        
        const cellClass = column.class ? ` class="${column.class}"` : '';
        rowHtml += `<td${cellClass}>${cellValue}</td>`;
    });
    
    // Add action column if actions are defined
    if (actions.length > 0) {
        rowHtml += '<td class="text-center">';
        actions.forEach(action => {
            const buttonClass = action.class || 'btn btn-sm btn-outline-secondary';
            const icon = action.icon ? `<i class="${action.icon}"></i>` : '';
            const title = action.title ? ` title="${action.title}"` : '';
            const dataAttrs = action.data ? Object.keys(action.data).map(key => `data-${key}="${action.data[key]}"`).join(' ') : '';
            
            rowHtml += `<button class="${buttonClass} ${action.action}-btn table-action-btn" data-id="${data.id}"${title} ${dataAttrs}>${icon}</button>`;
        });
        rowHtml += '</td>';
    }
    
    rowHtml += '</tr>';
    return rowHtml;
}

/**
 * Create empty state row for tables
 * @param {number} colspan - Number of columns to span
 * @param {string} message - Empty state message
 * @returns {string} Empty state row HTML
 */
export function createEmptyTableRow(colspan, message = 'ยังไม่มีข้อมูล') {
    return `<tr><td colspan="${colspan}" class="text-center text-muted py-4">${message}</td></tr>`;
}

// ===== LOADING STATES =====

/**
 * Show loading state on element
 * @param {string|Element} element - Element or selector
 * @param {string} text - Loading text
 */
export function showLoading(element, text = 'กำลังโหลด...') {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!el) {
        console.warn('Element not found:', element);
        return;
    }

    // Store original content
    if (!el.dataset.originalContent) {
        el.dataset.originalContent = el.innerHTML;
    }

    // Add loading class and content
    el.classList.add('loading');
    el.innerHTML = `<span class="d-flex align-items-center justify-content-center">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ${text}
    </span>`;
    
    if (el.tagName === 'BUTTON') {
        el.disabled = true;
    }
}

/**
 * Hide loading state from element
 * @param {string|Element} element - Element or selector
 */
export function hideLoading(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!el) {
        console.warn('Element not found:', element);
        return;
    }

    // Restore original content
    if (el.dataset.originalContent) {
        el.innerHTML = el.dataset.originalContent;
        delete el.dataset.originalContent;
    }

    // Remove loading class
    el.classList.remove('loading');
    
    if (el.tagName === 'BUTTON') {
        el.disabled = false;
    }
}

// ===== MODAL HELPERS =====

/**
 * Show confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {function} onConfirm - Callback on confirm
 * @param {function} onCancel - Callback on cancel
 */
export function showConfirmModal(title, message, onConfirm, onCancel) {
    // Create modal HTML
    const modalHtml = `
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-primary" id="confirmBtn">ยืนยัน</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const confirmBtn = document.getElementById('confirmBtn');
    
    // Handle confirm
    confirmBtn.addEventListener('click', () => {
        modal.hide();
        if (onConfirm) onConfirm();
    });
    
    // Handle modal hidden
    document.getElementById('confirmModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('confirmModal').remove();
        if (onCancel) onCancel();
    });
    
    modal.show();
}

// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function calls
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {function} Debounced function
 */
export function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showAlert('คัดลอกเรียบร้อยแล้ว', 'success', 2000);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showAlert('ไม่สามารถคัดลอกได้', 'warning');
        return false;
    }
}

/**
 * Scroll to element
 * @param {string|Element} element - Element or selector
 * @param {object} options - Scroll options
 */
export function scrollToElement(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!el) {
        console.warn('Element not found:', element);
        return;
    }

    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };

    el.scrollIntoView({ ...defaultOptions, ...options });
}

// ===== EXPORT DEFAULT OBJECT =====

const UIHelpers = {
    showAlert,
    clearAlerts,
    formatDate,
    formatDateForInput,
    formatTime,
    getCurrentThaiDate,
    formatNumber,
    formatCurrency,
    populateDropdown,
    getSelectedOptionData,
    clearForm,
    getFormData,
    populateForm,
    validateField,
    createTableRow,
    createEmptyTableRow,
    showLoading,
    hideLoading,
    showConfirmModal,
    debounce,
    generateId,
    copyToClipboard,
    scrollToElement
};

export default UIHelpers;

// Make functions available globally for backward compatibility
if (typeof window !== 'undefined') {
    window.UIHelpers = UIHelpers;
    window.showAlert = showAlert;
    window.formatDate = formatDate;
    window.populateDropdown = populateDropdown;
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
}