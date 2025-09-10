/* 
  path: /assets/js/pdf-generator.js
  version: 2.0 (CSS Print System - แม่นยำ 100%)
  date: 2025-09-10
  time: 14:00:00
  description: PDF Generator ใหม่ด้วย CSS Print System สำหรับความแม่นยำสูง
*/

import { showAlert, hideLoading, showLoading } from './ui-helpers.js';

/**
 * PDF Generator Class with CSS Print System - แม่นยำ 100%
 */
class PDFGenerator {
    constructor() {
        this.tagProcessor = null;
        this.initialized = false;
        this.defaultSettings = {
            paperSize: 'A4',
            orientation: 'portrait',
            margins: {
                top: '15mm',
                bottom: '15mm', 
                left: '15mm',
                right: '15mm'
            },
            header: {
                enabled: false,
                text: '',
                align: 'center',
                fontSize: '12px'
            },
            footer: {
                enabled: true,
                text: 'หน้า {page} จาก {total}',
                align: 'center',
                fontSize: '10px'
            },
            watermark: {
                enabled: false,
                text: '',
                opacity: 0.2,
                size: '48px',
                color: '#cccccc',
                rotation: 45
            }
        };
    }

    // ตั้งค่า TagProcessor
    setTagProcessor(tagProcessor) {
        this.tagProcessor = tagProcessor;
    }

    /**
     * Initialize PDF generator 
     * @returns {Promise<boolean>} Success status
     */
    async initialize() {
        try {
            this.initialized = true;
            console.log('✅ CSS Print PDF Generator initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ PDF Generator initialization failed:', error);
            showAlert('ไม่สามารถเริ่มระบบ PDF ได้', 'danger');
            return false;
        }
    }

    // สร้าง CSS สำหรับการพิมพ์
    generatePrintCSS(settings = {}) {
        const config = { ...this.defaultSettings, ...settings };
        
        return `
            <style>
                /* CSS Print System - แม่นยำ 100% */
                @page {
                    size: ${config.paperSize} ${config.orientation};
                    margin-top: ${config.margins.top};
                    margin-bottom: ${config.margins.bottom};
                    margin-left: ${config.margins.left}; 
                    margin-right: ${config.margins.right};
                    
                    ${config.header.enabled ? `
                    @top-${config.header.align} {
                        content: "${config.header.text}";
                        font-size: ${config.header.fontSize};
                        font-family: 'Sarabun', sans-serif;
                    }` : ''}
                    
                    ${config.footer.enabled ? `
                    @bottom-${config.footer.align} {
                        content: "${config.footer.text.replace('{page}', '" counter(page) "').replace('{total}', '" counter(pages) "')}";
                        font-size: ${config.footer.fontSize};
                        font-family: 'Sarabun', sans-serif;
                    }` : ''}
                }

                /* ฟอนต์และการจัดรูปแบบ */
                * {
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }

                html, body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Sarabun', 'Segoe UI', Arial, sans-serif;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #333;
                    background: white;
                }

                /* หัวข้อและย่อหน้า */
                h1 {
                    font-size: 20px;
                    font-weight: 700;
                    margin: 0 0 20px 0;
                    text-align: center;
                    color: #2c3e50;
                }

                h2 {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 25px 0 15px 0;
                    color: #34495e;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 5px;
                }

                h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 20px 0 10px 0;
                    color: #2c3e50;
                }

                p {
                    margin: 0 0 12px 0;
                    line-height: 1.6;
                }

                /* ตารางสวยงาม */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    background: white;
                    border: 1px solid #34495e;
                }

                th {
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    font-weight: 600;
                    padding: 12px 8px;
                    text-align: center;
                    border: 1px solid #2c3e50;
                    font-size: 13px;
                }

                td {
                    padding: 10px 8px;
                    border: 1px solid #bdc3c7;
                    vertical-align: middle;
                    font-size: 13px;
                }

                /* แถวสลับสี */
                tbody tr:nth-child(even) {
                    background-color: #f8f9fa;
                }

                tbody tr:nth-child(odd) {
                    background-color: white;
                }

                /* การจัดตำแหน่งข้อความ */
                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .text-right { text-align: right; }

                /* สีผลการประเมิน */
                .result-pass {
                    color: #27ae60;
                    font-weight: 600;
                    background-color: #d5f4e6 !important;
                }

                .result-fail {
                    color: #e74c3c;
                    font-weight: 600;
                    background-color: #fdf2f2 !important;
                }

                /* Page Break */
                .page-break {
                    page-break-before: always;
                }

                .avoid-break {
                    page-break-inside: avoid;
                }

                /* หมายเหตุและข้อเสนอแนะ */
                .remark-section {
                    margin: 20px 0;
                    padding: 15px;
                    border-radius: 8px;
                    page-break-inside: avoid;
                }

                .remark-master {
                    background: linear-gradient(135deg, #e8f4fd, #f0f8ff);
                    border-left: 5px solid #3498db;
                }

                .remark-job {
                    background: linear-gradient(135deg, #fff8e1, #fef9e7);
                    border-left: 5px solid #f39c12;
                }

                .remark-title {
                    font-weight: 600;
                    margin: 0 0 10px 0;
                    font-size: 15px;
                }

                .remark-content {
                    font-size: 13px;
                    line-height: 1.6;
                }

                /* ลายน้ำ */
                ${config.watermark.enabled ? `
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(${config.watermark.rotation}deg);
                    font-size: ${config.watermark.size};
                    color: ${config.watermark.color};
                    opacity: ${config.watermark.opacity};
                    z-index: -1;
                    font-weight: bold;
                    pointer-events: none;
                    user-select: none;
                }` : ''}

                /* ข้อมูลบริษัท */
                .company-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    border: 2px solid #3498db;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #f8f9fa, #ffffff);
                }

                .company-name {
                    font-size: 18px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0 0 10px 0;
                }

                .company-license {
                    font-size: 12px;
                    color: #7f8c8d;
                    margin: 5px 0;
                }

                /* สรุปผลการตรวจวัด */
                .summary-section {
                    margin: 25px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #f8f9fa, #ffffff);
                    border: 1px solid #dee2e6;
                    border-radius: 10px;
                    page-break-inside: avoid;
                }

                .summary-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin: 0 0 15px 0;
                    text-align: center;
                }

                .summary-stats {
                    display: flex;
                    justify-content: space-around;
                    text-align: center;
                    margin-bottom: 15px;
                }

                .stat-item {
                    flex: 1;
                    padding: 10px;
                }

                .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    display: block;
                    margin-bottom: 5px;
                }

                .stat-pass { color: #27ae60; }
                .stat-fail { color: #e74c3c; }
                .stat-total { color: #3498db; }

                /* ลายเซ็นและอนุมัติ */
                .signature-section {
                    margin-top: 40px;
                    page-break-inside: avoid;
                }

                .signature-row {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 60px;
                }

                .signature-item {
                    text-align: center;
                    flex: 1;
                    margin: 0 20px;
                }

                .signature-line {
                    border-bottom: 1px solid #333;
                    margin-bottom: 10px;
                    height: 50px;
                }

                .signature-title {
                    font-weight: 600;
                    margin-bottom: 5px;
                }

                .signature-name {
                    font-size: 12px;
                    color: #666;
                }

                /* การพิมพ์เท่านั้น */
                @media print {
                    .no-print { display: none !important; }
                    
                    body {
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }
                    
                    table, th, td {
                        border-color: #000 !important;
                    }
                }

                /* จอแสดงผล */
                @media screen {
                    body {
                        background: #f5f5f5;
                        padding: 20px;
                    }
                    
                    .page-container {
                        background: white;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        margin: 0 auto;
                        max-width: 210mm;
                        min-height: 297mm;
                        padding: 20mm;
                    }
                }
            </style>
        `;
    }

    // สร้างเนื้อหา HTML Template
    generateHTMLTemplate(templateContent, jobData, jobId, settings = {}) {
        console.log('🔧 Generating HTML template...');
        
        // ประมวลผล tags
        let processedContent = templateContent;
        if (this.tagProcessor) {
            processedContent = this.tagProcessor.processTags(templateContent, jobData, jobId);
        }

        // เพิ่มการจัดรูปแบบพิเศษ
        processedContent = this.enhanceHTMLContent(processedContent, jobData);

        const printCSS = this.generatePrintCSS(settings);
        const watermarkHTML = settings.watermark?.enabled ? 
            `<div class="watermark">${settings.watermark.text}</div>` : '';

        const fullHTML = `
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>รายงานการตรวจวัดความสว่าง - ${jobId || 'Draft'}</title>
                <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                ${printCSS}
            </head>
            <body>
                ${watermarkHTML}
                <div class="page-container">
                    ${processedContent}
                </div>
                
                <script>
                    // Auto-print option
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('autoprint') === 'true') {
                        window.onload = () => {
                            setTimeout(() => window.print(), 500);
                        };
                    }
                </script>
            </body>
            </html>
        `;

        console.log('✅ HTML template generated successfully');
        return fullHTML;
    }

    /**
     * สร้าง PDF แบบใหม่ด้วย CSS Print System
     * @param {string} templateContent - เนื้อหา template
     * @param {object} jobData - ข้อมูลงาน
     * @param {string} jobId - รหัสงาน
     * @param {object} settings - การตั้งค่า
     * @returns {Promise<boolean>} สถานะสำเร็จ
     */
    async generatePDF(templateContent, jobData, jobId, settings = {}) {
        try {
            console.log('🚀 Starting CSS Print PDF generation...');
            
            const targetBtn = document.getElementById('generate-pdf-btn');
            if (targetBtn) {
                showLoading(targetBtn, 'กำลังสร้าง PDF...');
            }
            
            // สร้าง HTML
            const htmlContent = this.generateHTMLTemplate(templateContent, jobData, jobId, settings);
            
            // สร้างหน้าต่างใหม่สำหรับ PDF
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('ไม่สามารถเปิดหน้าต่างสำหรับพิมพ์ได้ กรุณาอนุญาต popup');
            }

            // เขียน HTML ลงในหน้าต่างใหม่
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // รอให้ฟอนต์โหลดเสร็จแล้วเปิด print dialog
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 1000);
            };

            console.log('✅ PDF generation completed');
            showAlert('เปิดหน้าต่างพิมพ์แล้ว กรุณาเลือก "Save as PDF"', 'success', 4000);
            return true;

        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            showAlert(`การสร้าง PDF ล้มเหลว: ${error.message}`, 'danger');
            return false;
        } finally {
            const targetBtn = document.getElementById('generate-pdf-btn');
            if (targetBtn) {
                hideLoading(targetBtn);
            }
        }
    }

    // ปรับปรุงเนื้อหา HTML
    enhanceHTMLContent(content, jobData) {
        let enhanced = content;

        // แปลงตารางผลการตรวจวัดให้สวยงาม
        enhanced = enhanced.replace(/{{RESULTS_TABLE_ROWS}}/g, (match) => {
            return this.generateEnhancedResultsTable(jobData?.results || []);
        });

        // เพิ่ม CSS class สำหรับผลการประเมิน
        enhanced = enhanced.replace(/ผ่าน/g, '<span class="result-pass">ผ่าน</span>');
        enhanced = enhanced.replace(/ไม่ผ่าน/g, '<span class="result-fail">ไม่ผ่าน</span>');

        // แปลง REMARK sections
        enhanced = enhanced.replace(/{{REMARK_MASTER}}/g, `
            <div class="remark-section remark-master avoid-break">
                <div class="remark-title">📋 ข้อเสนอแนะมาตรฐาน</div>
                <div class="remark-content">
                    • เพิ่มจำนวนหลอดไฟในพื้นที่ที่มีค่าแสงสว่างไม่เพียงพอ<br>
                    • เปลี่ยนหลอดไฟเป็นแบบให้แสงสว่างมากกว่าเดิม<br>
                    • ตรวจสอบและทำความสะอาดหลอดไฟเป็นประจำ<br>
                    • ปรับตำแหน่งการจัดวางโต๊ะทำงานให้รับแสงได้ดีขึ้น<br>
                    • หลีกเลี่ยงการติดตั้งไฟส่องสว่างในตำแหน่งที่ก่อให้เกิดเงา
                </div>
            </div>
        `);

        enhanced = enhanced.replace(/{{REMARK_JOB}}/g, `
            <div class="remark-section remark-job avoid-break">
                <div class="remark-title">📝 ข้อเสนอแนะเฉพาะงาน</div>
                <div class="remark-content">
                    ${jobData?.recommendations ? 
                        jobData.recommendations.replace(/\n/g, '<br>') : 
                        '<em>ไม่มีข้อเสนอแนะเฉพาะสำหรับงานนี้</em>'
                    }
                    ${jobData?.observations ? `
                        <br><br><strong>ข้อสังเกต:</strong><br>
                        ${jobData.observations.replace(/\n/g, '<br>')}
                    ` : ''}
                </div>
            </div>
        `);

        return enhanced;
    }

    // สร้างตารางผลการตรวจวัดที่สวยงาม
    generateEnhancedResultsTable(results) {
        if (!results || results.length === 0) {
            return '<p class="text-center">ไม่มีข้อมูลการตรวจวัด</p>';
        }

        const itemsPerPage = 15; // ลดจำนวนเพื่อให้พอดีกับหน้า
        const totalPages = Math.ceil(results.length / itemsPerPage);
        let tablesHtml = '';

        for (let page = 0; page < totalPages; page++) {
            const startIndex = page * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, results.length);
            const pageResults = results.slice(startIndex, endIndex);

            if (page > 0) {
                tablesHtml += '<div class="page-break"></div>';
            }

            tablesHtml += `
                <div class="avoid-break">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 8%;">ลำดับ</th>
                                <th style="width: 18%;">Lay Out</th>
                                <th style="width: 25%;">พื้นที่ตรวจวัด</th>
                                <th style="width: 20%;">ลักษณะงาน</th>
                                <th style="width: 12%;">ค่ามาตรฐาน</th>
                                <th style="width: 12%;">ผลที่วัดได้</th>
                                <th style="width: 15%;">ผลการประเมิน</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            pageResults.forEach((result, index) => {
                const globalIndex = startIndex + index + 1;
                const resultValue = result.measurementType === 'spot' 
                    ? (result.spotValue || '-')
                    : `${result.areaAvgValue || '-'} / ${result.areaMinValue || '-'}`;
                
                const evaluationClass = result.evaluation === 'ผ่าน' ? 'result-pass' : 'result-fail';
                
                tablesHtml += `
                    <tr>
                        <td class="text-center">${globalIndex}</td>
                        <td>${result.layout || `จุดที่ ${globalIndex}`}</td>
                        <td>${result.area || ''}</td>
                        <td>${result.workType || ''}</td>
                        <td class="text-center">${result.standard || ''}</td>
                        <td class="text-center">${resultValue}</td>
                        <td class="text-center ${evaluationClass}">${result.evaluation || ''}</td>
                    </tr>
                `;
            });

            tablesHtml += '</tbody></table>';

            // เพิ่มหมายเหตุหลังแต่ละหน้า
            tablesHtml += `
                <div style="margin: 20px 0;">
                    {{REMARK_MASTER}}
                    {{REMARK_JOB}}
                </div>
            `;

            // แสดงหมายเลขหน้าสำหรับตารางหลายหน้า
            if (totalPages > 1) {
                tablesHtml += `
                    <p class="text-center" style="margin-top: 15px; font-size: 12px; color: #666;">
                        หน้าที่ ${page + 1} จาก ${totalPages} 
                        (รายการที่ ${startIndex + 1}-${endIndex} จากทั้งหมด ${results.length} รายการ)
                    </p>
                `;
            }
            
            tablesHtml += '</div>';
        }

        // เพิ่มสรุปผลการตรวจวัด
        const passCount = results.filter(r => r.evaluation === 'ผ่าน').length;
        const failCount = results.filter(r => r.evaluation === 'ไม่ผ่าน').length;
        
        tablesHtml += `
            <div class="summary-section">
                <div class="summary-title">📊 สรุปผลการตรวจวัดความสว่าง</div>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-number stat-total">${results.length}</span>
                        <div>รวมทั้งหมด</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number stat-pass">${passCount}</span>
                        <div>ผ่านเกณฑ์</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number stat-fail">${failCount}</span>
                        <div>ไม่ผ่านเกณฑ์</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <strong>อัตราผ่านเกณฑ์: ${results.length > 0 ? Math.round((passCount / results.length) * 100) : 0}%</strong>
                </div>
            </div>
        `;

        return tablesHtml;
    }

    // สร้าง Print Preview
    generatePrintPreview(templateContent, jobData, jobId, settings = {}) {
        console.log('👁️ Generating print preview...');
        
        try {
            const htmlContent = this.generateHTMLTemplate(templateContent, jobData, jobId, settings);
            
            // สร้างหน้าต่างสำหรับ preview
            const previewWindow = window.open('', '_blank');
            if (!previewWindow) {
                throw new Error('ไม่สามารถเปิดหน้าต่างสำหรับ preview ได้');
            }

            previewWindow.document.write(htmlContent);
            previewWindow.document.close();

            // เพิ่มปุ่มสำหรับพิมพ์และปิด
            previewWindow.onload = () => {
                const controls = previewWindow.document.createElement('div');
                controls.className = 'no-print';
                controls.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: white;
                    padding: 10px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    z-index: 1000;
                `;
                controls.innerHTML = `
                    <button onclick="window.print()" style="margin-right: 10px; padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        🖨️ พิมพ์
                    </button>
                    <button onclick="window.close()" style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        ❌ ปิด
                    </button>
                `;
                previewWindow.document.body.appendChild(controls);
            };

            console.log('✅ Print preview generated successfully');
            return previewWindow;

        } catch (error) {
            console.error('❌ Error generating preview:', error);
            throw error;
        }
    }

    // บันทึกการตั้งค่า
    saveSettings(settings) {
        try {
            localStorage.setItem('pdf-generator-settings', JSON.stringify(settings));
            console.log('💾 PDF settings saved');
        } catch (error) {
            console.error('❌ Error saving settings:', error);
        }
    }

    // โหลดการตั้งค่า
    loadSettings() {
        try {
            const saved = localStorage.getItem('pdf-generator-settings');
            return saved ? JSON.parse(saved) : this.defaultSettings;
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            return this.defaultSettings;
        }
    }

}

// Create global instance
const pdfGeneratorInstance = new PDFGenerator();

// Make available globally
if (typeof window !== 'undefined') {
    window.PDFGenerator = PDFGenerator;
    window.pdfGenerator = pdfGeneratorInstance;
}

// Export for use in modules  
export { PDFGenerator };
export default pdfGeneratorInstance;