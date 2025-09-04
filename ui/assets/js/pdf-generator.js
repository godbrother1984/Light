/*
  path: /ui/assets/js/pdf-generator.js
  version: 1.1 (Fixed Syntax Errors)
  date: 2025-09-04
  time: 17:30:00
  description: PDF generation logic extracted from report-finalizer.html - Fixed all syntax errors
*/

import { showAlert, hideLoading, showLoading } from './ui-helpers.js';

/**
 * PDF Generator Class for Light Measurement Reports
 */
export class PDFGenerator {
    constructor() {
        this.jsPDF = null;
        this.html2canvas = null;
        this.initialized = false;
    }

    /**
     * Initialize PDF generator with required libraries
     * @returns {Promise<boolean>} Success status
     */
    async initialize() {
        try {
            // Check if libraries are loaded
            if (typeof window.jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
                throw new Error('PDF generation libraries not loaded');
            }

            this.jsPDF = window.jsPDF.jsPDF;
            this.html2canvas = html2canvas;
            this.initialized = true;

            console.log('PDF Generator initialized successfully');
            return true;
        } catch (error) {
            console.error('PDF Generator initialization failed:', error);
            showAlert('ไม่สามารถโหลดระบบสร้าง PDF ได้', 'danger');
            return false;
        }
    }

    /**
     * Generate PDF from HTML content
     * @param {string} htmlContent - HTML content to convert
     * @param {string} jobId - Job ID for filename
     * @param {boolean} preview - Show preview instead of download
     * @returns {Promise<boolean>} Success status
     */
    async generatePDF(htmlContent, jobId = '', preview = false) {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.initialized) {
            return false;
        }

        let tempDiv = null;

        try {
            // Show loading
            const targetBtn = document.querySelector('.btn-primary[onclick*="generatePDF"]') || 
                             document.getElementById('generate-pdf-btn');
            
            if (targetBtn) {
                showLoading(targetBtn, 'กำลังสร้าง PDF...');
            }

            // Create temporary div for rendering
            tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.cssText = `
                position: absolute;
                left: -9999px;
                top: 0;
                width: 794px;
                background: white;
                padding: 20px;
                font-family: 'Sarabun', sans-serif;
                font-size: 16px;
                line-height: 1.6;
            `;

            // Apply inline styles for better rendering
            this.applyInlineStyles(tempDiv);
            
            document.body.appendChild(tempDiv);

            // Wait for fonts and images to load
            await this.waitForContent(tempDiv);

            // Generate canvas from HTML
            const canvas = await this.html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 794,
                scrollX: 0,
                scrollY: 0
            });

            // PDF configuration
            const imgData = canvas.toDataURL('image/png');
            const doc = new this.jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = doc.internal.pageSize.getHeight();
            const margins = { top: 10, right: 10, bottom: 20, left: 10 };
            
            const contentWidth = pdfWidth - margins.left - margins.right;
            const contentHeight = pdfHeight - margins.top - margins.bottom;
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / contentWidth;
            const scaledHeight = imgHeight / ratio;

            // Calculate pages needed
            let heightLeft = scaledHeight;
            let position = 0;
            let pageNumber = 1;

            // Function to add page assets (header, footer)
            const addPageAssets = () => {
                // Add page number
                doc.setFontSize(10);
                doc.setTextColor(128, 128, 128);
                doc.text(
                    `หน้า ${pageNumber}`, 
                    pdfWidth - margins.right - 20, 
                    pdfHeight - 10
                );

                // Add watermark if needed
                if (window.addPDFWatermark) {
                    window.addPDFWatermark(doc, pageNumber);
                }
            };
            
            // Add first page
            addPageAssets();
            doc.addImage(imgData, 'PNG', margins.left, margins.top, contentWidth, Math.min(scaledHeight, contentHeight));
            heightLeft -= contentHeight;
            
            // Add additional pages if needed
            while (heightLeft > 0) {
                position = heightLeft - scaledHeight;
                doc.addPage();
                pageNumber++;
                addPageAssets();
                doc.addImage(imgData, 'PNG', margins.left, margins.top + position, contentWidth, scaledHeight);
                heightLeft -= contentHeight;
            }

            if (preview) {
                await this.showPDFPreview(doc);
            } else {
                this.downloadPDF(doc, jobId);
            }

            showAlert('สร้าง PDF สำเร็จแล้ว!', 'success');
            return true;

        } catch (error) {
            console.error("PDF Generation Error:", error);
            showAlert(`เกิดข้อผิดพลาดในการสร้าง PDF: ${error.message}`, 'danger');
            return false;
        } finally {
            // Clean up
            if (tempDiv && tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
            }

            // Hide loading
            const targetBtn = document.querySelector('.btn-primary[onclick*="generatePDF"]') || 
                             document.getElementById('generate-pdf-btn');
            
            if (targetBtn) {
                hideLoading(targetBtn);
            }
        }
    }

    /**
     * Apply inline styles to improve PDF rendering
     * @param {Element} element - Element to apply styles to
     */
    applyInlineStyles(element) {
        // Apply font family to all elements
        element.style.fontFamily = "'Sarabun', sans-serif";
        
        // Apply styles to tables
        const tables = element.querySelectorAll('table');
        tables.forEach(table => {
            table.style.cssText += `
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 14px;
            `;

            // Style table headers
            const headers = table.querySelectorAll('th');
            headers.forEach(th => {
                th.style.cssText += `
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 8px;
                    text-align: center;
                    font-weight: bold;
                `;
            });

            // Style table cells
            const cells = table.querySelectorAll('td');
            cells.forEach(td => {
                td.style.cssText += `
                    border: 1px solid #dee2e6;
                    padding: 8px;
                    vertical-align: top;
                `;
            });
        });

        // Style headings
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.cssText += `
                color: #0d47a1;
                font-weight: bold;
                margin: 20px 0 10px 0;
            `;
        });

        // Style paragraphs
        const paragraphs = element.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.cssText += `
                margin: 10px 0;
                line-height: 1.6;
            `;
        });
    }

    /**
     * Wait for content to load (fonts, images)
     * @param {Element} element - Element to wait for
     * @returns {Promise<void>}
     */
    async waitForContent(element) {
        // Wait for fonts to load
        if (document.fonts) {
            await document.fonts.ready;
        }

        // Wait for images to load
        const images = element.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = resolve;
                }
            });
        });

        await Promise.all(imagePromises);

        // Give a little extra time for layout to settle
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    /**
     * Show PDF preview in modal
     * @param {object} doc - jsPDF document
     */
    async showPDFPreview(doc) {
        const previewContainer = document.getElementById('pdf-preview-container');
        
        if (!previewContainer) {
            // Create preview modal if it doesn't exist
            this.createPreviewModal();
        }

        const pdfDataUri = doc.output('datauristring');
        
        document.getElementById('pdf-preview-container').innerHTML = `
            <iframe src="${pdfDataUri}" 
                    width="100%" 
                    height="600px" 
                    style="border: none; border-radius: 8px;"></iframe>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('pdfPreviewModal'));
        modal.show();
    }

    /**
     * Create preview modal if it doesn't exist
     */
    createPreviewModal() {
        const modalHtml = `
            <div class="modal fade" id="pdfPreviewModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-file-pdf me-2"></i>
                                ตัวอย่างรายงาน PDF
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div id="pdf-preview-container"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                            <button type="button" class="btn btn-primary" onclick="downloadFromPreview()">
                                <i class="fas fa-download me-2"></i>ดาวน์โหลด PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    /**
     * Download PDF file
     * @param {object} doc - jsPDF document
     * @param {string} jobId - Job ID for filename
     */
    downloadPDF(doc, jobId) {
        const filename = `รายงาน${jobId ? '-' + jobId : ''}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
    }

    /**
     * Generate PDF from template content
     * @param {string} templateContent - Template content with tags
     * @param {object} data - Data to replace tags
     * @param {string} jobId - Job ID for filename
     * @param {boolean} preview - Show preview instead of download
     * @returns {Promise<boolean>} Success status
     */
    async generatePDFFromTemplate(templateContent, data, jobId = '', preview = false) {
        if (!templateContent || !data) {
            showAlert('ไม่พบเนื้อหาเทมเพลตหรือข้อมูล', 'warning');
            return false;
        }

        try {
            // Process template with TagProcessor if available
            let processedContent = templateContent;
            
            if (window.tagProcessor || window.TagProcessor) {
                const processor = window.tagProcessor || new window.TagProcessor();
                processedContent = await processor.processTemplate(templateContent, data);
            } else {
                // Basic tag replacement if TagProcessor is not available
                processedContent = this.basicTagReplacement(templateContent, data);
            }

            return await this.generatePDF(processedContent, jobId, preview);
        } catch (error) {
            console.error('Template processing error:', error);
            showAlert(`เกิดข้อผิดพลาดในการประมวลผลเทมเพลต: ${error.message}`, 'danger');
            return false;
        }
    }

    /**
     * Basic tag replacement for templates
     * @param {string} template - Template content
     * @param {object} data - Data to replace
     * @returns {string} Processed content
     */
    basicTagReplacement(template, data) {
        let processed = template;

        // Replace simple tags
        const tags = {
            '{{JOB_ID}}': data.jobId || '',
            '{{CUSTOMER_NAME}}': data.customerName || '',
            '{{LOCATION}}': data.location || '',
            '{{INSPECTION_DATE}}': data.inspectionDate || '',
            '{{INSPECTOR_NAME}}': data.inspectorName || '',
            '{{CURRENT_DATE}}': new Date().toLocaleDateString('th-TH'),
            '{{REPORT_TITLE}}': data.reportTitle || 'รายงานการตรวจวัดแสง'
        };

        Object.keys(tags).forEach(tag => {
            const regex = new RegExp(tag.replace(/[{}]/g, '\\$&'), 'g');
            processed = processed.replace(regex, tags[tag]);
        });

        return processed;
    }

    /**
     * Create PDF with custom page settings
     * @param {object} options - PDF options
     * @returns {object} jsPDF instance
     */
    createCustomPDF(options = {}) {
        if (!this.initialized) {
            throw new Error('PDF Generator not initialized');
        }

        const defaultOptions = {
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        };

        const pdfOptions = { ...defaultOptions, ...options };
        return new this.jsPDF(pdfOptions.orientation, pdfOptions.unit, pdfOptions.format);
    }

    /**
     * Check if PDF generation is supported
     * @returns {boolean} Support status
     */
    static isSupported() {
        return typeof window !== 'undefined' && 
               typeof window.jsPDF !== 'undefined' && 
               typeof html2canvas !== 'undefined';
    }
}

// Create singleton instance
export const pdfGenerator = new PDFGenerator();

// Auto-initialize if libraries are available
if (PDFGenerator.isSupported()) {
    pdfGenerator.initialize().catch(console.error);
}

// Helper functions for backward compatibility
export const generatePDF = (htmlContent, jobId, preview = false) => {
    return pdfGenerator.generatePDF(htmlContent, jobId, preview);
};

export const generatePDFFromTemplate = (template, data, jobId, preview = false) => {
    return pdfGenerator.generatePDFFromTemplate(template, data, jobId, preview);
};

// Make functions available globally
if (typeof window !== 'undefined') {
    window.PDFGenerator = PDFGenerator;
    window.pdfGenerator = pdfGenerator;
    window.generatePDF = generatePDF;
    window.generatePDFFromTemplate = generatePDFFromTemplate;
    
    // Download from preview function
    window.downloadFromPreview = () => {
        if (window.currentPDFDoc && window.currentJobId) {
            pdfGenerator.downloadPDF(window.currentPDFDoc, window.currentJobId);
        }
    };
}

export default pdfGenerator;