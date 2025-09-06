/* 
  path: /tag-processor.js
  version: 1.1 (Enhanced Remark System + Master/Job Remarks)
  date: 2025-09-06
  time: 10:30:00
  description: Added {{REMARK_MASTER}} and {{REMARK_JOB}} tags with auto-pagination
*/

class TagProcessor {
    constructor() {
        this.masterData = {
            inspectors: [],
            companyInfo: null
        };
    }

    // Set master data for advanced tag processing
    setMasterData(inspectors = [], companyInfo = null) {
        this.masterData.inspectors = inspectors;
        this.masterData.companyInfo = companyInfo;
    }

    // Get inspector details by name
    getInspectorDetails(name) {
        return this.masterData.inspectors.find(inspector => 
            inspector.inspectorName === name
        ) || { inspectorName: name, inspectorTitle: '', inspectorLicense: '' };
    }

    // Process all tags in content
    processTags(content, jobData, jobId) {
        if (!jobData || !jobId) return content;
        
        // Basic tags
        const basicTags = this.getBasicTags(jobData, jobId);
        
        // Advanced personnel tags
        const personnelTags = this.getPersonnelTags(jobData);
        
        // Company info tags
        const companyTags = this.getCompanyTags();
        
        // Results tags
        const resultsTags = this.getResultsTags(jobData);
        
        // Measurement detail tags
        const measurementTags = this.getMeasurementTags(jobData);

        // Remark tags
        const remarkTags = this.getRemarkTags(jobData);

        // Combine all tags
        const allTags = {
            ...basicTags,
            ...personnelTags,
            ...companyTags,
            ...resultsTags,
            ...measurementTags,
            ...remarkTags
        };

        // Replace tags in content
        let processedContent = content;
        Object.entries(allTags).forEach(([tag, value]) => {
            const regex = new RegExp(tag.replace(/[{}]/g, '\\$&'), 'g');
            processedContent = processedContent.replace(regex, value);
        });

        return processedContent;
    }

    // Basic job information tags
    getBasicTags(jobData, jobId) {
        return {
            '{{JOB_ID}}': jobId,
            '{{CUSTOMER_NAME}}': jobData.customerName || '',
            '{{LOCATION}}': jobData.location || '',
            '{{ADDRESS}}': jobData.address || '',
            '{{CONTACT_PERSON}}': jobData.contactPerson || '',
            '{{CONTACT_PHONE}}': jobData.contactPhone || '',
            '{{DATE}}': jobData.date || '',
            '{{TIME}}': jobData.time || '',
            '{{STATUS}}': jobData.status || '',
            '{{RECOMMENDATIONS}}': jobData.recommendations || '',
            '{{OBSERVATIONS}}': jobData.observations || '',
            '{{CURRENT_DATE}}': new Date().toLocaleDateString('th-TH'),
            '{{CURRENT_TIME}}': new Date().toLocaleTimeString('th-TH'),
            '{{THAI_DATE}}': new Date().toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                era: 'short'
            })
        };
    }

    // Advanced personnel tags with details
    getPersonnelTags(jobData) {
        const tags = {};

        // Basic personnel tags (backward compatibility)
        tags['{{INSPECTORS}}'] = Array.isArray(jobData.inspectors) ? 
            jobData.inspectors.join(', ') : (jobData.inspectors || '');
        tags['{{ANALYSTS}}'] = Array.isArray(jobData.analysts) ? 
            jobData.analysts.join(', ') : (jobData.analysts || '');
        tags['{{REPORT_CREATOR}}'] = jobData.reportCreator || '';

        // Advanced personnel tags
        if (Array.isArray(jobData.inspectors)) {
            // Staff Controllers - ผู้ควบคุมดูแลห้องปฏิบัติการ
            const controllers = jobData.inspectors
                .map(name => this.getInspectorDetails(name))
                .filter(inspector => inspector.inspectorTitle.includes('ผู้ควบคุม'))
                .map(inspector => `${inspector.inspectorName} (${inspector.inspectorTitle}${inspector.inspectorLicense ? ' - ' + inspector.inspectorLicense : ''})`)
                .join('<br>');
            tags['{{STAFF_CONTROLLERS}}'] = controllers || 'ไม่ระบุ';

            // Staff Inspectors - ผู้ตรวจวัดและวิเคราะห์
            const inspectors = jobData.inspectors
                .map(name => this.getInspectorDetails(name))
                .filter(inspector => inspector.inspectorTitle.includes('ผู้ตรวจวัด') || inspector.inspectorTitle.includes('นักวิชาการ') || inspector.inspectorTitle.includes('เจ้าหน้าที่'))
                .map(inspector => `${inspector.inspectorName} (${inspector.inspectorTitle})`)
                .join('<br>');
            tags['{{STAFF_INSPECTORS}}'] = inspectors || 'ไม่ระบุ';
        }

        // Report Creator with position
        if (jobData.reportCreator) {
            const reporter = this.getInspectorDetails(jobData.reportCreator);
            tags['{{STAFF_REPORTERS}}'] = `${reporter.inspectorName} (${reporter.inspectorTitle})`;
        } else {
            tags['{{STAFF_REPORTERS}}'] = 'ไม่ระบุ';
        }

        // All Staff - รวมบุคลากรทั้งหมด
        const allStaff = [];
        if (Array.isArray(jobData.inspectors)) {
            jobData.inspectors.forEach(name => {
                const inspector = this.getInspectorDetails(name);
                allStaff.push(`${inspector.inspectorName} - ${inspector.inspectorTitle}${inspector.inspectorLicense ? ' (' + inspector.inspectorLicense + ')' : ''}`);
            });
        }
        if (jobData.reportCreator && !allStaff.some(staff => staff.includes(jobData.reportCreator))) {
            const reporter = this.getInspectorDetails(jobData.reportCreator);
            allStaff.push(`${reporter.inspectorName} - ${reporter.inspectorTitle}${reporter.inspectorLicense ? ' (' + reporter.inspectorLicense + ')' : ''}`);
        }
        tags['{{ALL_STAFF}}'] = allStaff.join('<br>') || 'ไม่ระบุ';

        return tags;
    }

    // Company information tags
    getCompanyTags() {
        const tags = {};
        
        if (this.masterData.companyInfo) {
            const company = this.masterData.companyInfo;
            
            // Individual license tags
            tags['{{LICENSE_FACTORY}}'] = company.license_factory || '';
            tags['{{LICENSE_LIGHT}}'] = company.license_welfare_light || '';
            
            // Complete licenses list
            const licenses = [];
            if (company.license_factory) {
                licenses.push(`<strong>กรมโรงงานอุตสาหกรรม:</strong><br>- บริษัท ห้องปฏิบัติการไทย จำกัด เลขทะเบียน ${company.license_factory}`);
            }
            if (company.license_chemical_measurement) {
                licenses.push(`- ผู้ให้บริการตรวจวัดระดับความเข้มข้นของสารเคมีอันตราย ใบอนุญาตเลขที่ ${company.license_chemical_measurement}`);
            }
            if (company.license_chemical_analysis) {
                licenses.push(`- ผู้ให้บริการวิเคราะห์ระดับความเข้มข้นของสารเคมีอันตราย ใบอนุญาตเลขที่ ${company.license_chemical_analysis}`);
            }
            if (company.license_heat) {
                licenses.push(`- ผู้ให้บริการตรวจวัดและวิเคราะห์สภาวะการทำงานเกี่ยวกับระดับความร้อน ใบอนุญาตเลขที่ ${company.license_heat}`);
            }
            if (company.license_welfare_light) {
                licenses.push(`- ผู้ให้บริการตรวจวัดและวิเคราะห์สภาวะการทำงานเกี่ยวกับระดับแสงสว่าง ใบอนุญาตเลขที่ ${company.license_welfare_light}`);
            }
            if (company.license_sound) {
                licenses.push(`- ผู้ให้บริการตรวจวัดและวิเคราะห์สภาวะการทำงานเกี่ยวกับระดับเสียง ใบอนุญาตเลขที่ ${company.license_sound}`);
            }
            
            tags['{{COMPANY_LICENSES}}'] = licenses.join('<br><br>');
        } else {
            tags['{{LICENSE_FACTORY}}'] = '';
            tags['{{LICENSE_LIGHT}}'] = '';
            tags['{{COMPANY_LICENSES}}'] = 'ไม่พบข้อมูลใบอนุญาต';
        }

        return tags;
    }

    // Results summary tags
    getResultsTags(jobData) {
        const tags = {};
        
        if (jobData.results && jobData.results.length > 0) {
            tags['{{RESULTS_COUNT}}'] = jobData.results.length.toString();
            tags['{{PASS_COUNT}}'] = jobData.results.filter(r => r.evaluation === 'ผ่าน').length.toString();
            tags['{{FAIL_COUNT}}'] = jobData.results.filter(r => r.evaluation === 'ไม่ผ่าน').length.toString();
            
            // Count by measurement type
            tags['{{SPOT_COUNT}}'] = jobData.results.filter(r => r.measurementType === 'spot').length.toString();
            tags['{{AREA_COUNT}}'] = jobData.results.filter(r => r.measurementType === 'area').length.toString();
            
            // Results table with pagination
            tags['{{RESULTS_TABLE}}'] = this.generateResultsTable(jobData.results);
        } else {
            tags['{{RESULTS_COUNT}}'] = '0';
            tags['{{PASS_COUNT}}'] = '0';
            tags['{{FAIL_COUNT}}'] = '0';
            tags['{{SPOT_COUNT}}'] = '0';
            tags['{{AREA_COUNT}}'] = '0';
            tags['{{RESULTS_TABLE}}'] = '<p class="text-center">ไม่มีข้อมูลการตรวจวัด</p>';
        }

        return tags;
    }

    // Measurement details tags
    getMeasurementTags(jobData) {
        const tags = {};
        
        if (jobData.results && jobData.results.length > 0) {
            tags['{{MEASUREMENT_DETAILS_TABLE}}'] = this.generateDetailedTable(jobData.results);
        } else {
            tags['{{MEASUREMENT_DETAILS_TABLE}}'] = '<p class="text-center">ไม่มีรายละเอียดการตรวจวัด</p>';
        }

        return tags;
    }

    // Generate standard results table with pagination
    generateResultsTable(results, itemsPerPage = 20) {
        if (!results || results.length === 0) {
            return '<p class="text-center">ไม่มีข้อมูลการตรวจวัด</p>';
        }

        const totalPages = Math.ceil(results.length / itemsPerPage);
        let tablesHtml = '';

        for (let page = 0; page < totalPages; page++) {
            const startIndex = page * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, results.length);
            const pageResults = results.slice(startIndex, endIndex);

            if (page > 0) {
                tablesHtml += '<div style="page-break-before: always;"></div>';
            }

            tablesHtml += `
                <table border="1" style="width: 100%; border-collapse: collapse; margin: 1em 0;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 8px; text-align: center;">ลำดับ</th>
                            <th style="padding: 8px;">Lay Out</th>
                            <th style="padding: 8px;">พื้นที่ตรวจวัด</th>
                            <th style="padding: 8px;">ลักษณะงาน</th>
                            <th style="padding: 8px; text-align: center;">ค่ามาตรฐาน</th>
                            <th style="padding: 8px; text-align: center;">ผลที่วัดได้</th>
                            <th style="padding: 8px; text-align: center;">ผลการประเมิน</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            pageResults.forEach((result, index) => {
                const globalIndex = startIndex + index + 1;
                const resultValue = result.measurementType === 'spot' 
                    ? (result.spotValue || '-')
                    : `${result.areaAvgValue || '-'} / ${result.areaMinValue || '-'}`;
                
                const evaluationColor = result.evaluation === 'ผ่าน' ? '#28a745' : '#dc3545';
                
                tablesHtml += `
                    <tr>
                        <td style="padding: 8px; text-align: center;">${globalIndex}</td>
                        <td style="padding: 8px;">${result.layout || ''}</td>
                        <td style="padding: 8px;">${result.area || ''}</td>
                        <td style="padding: 8px;">${result.workType || ''}</td>
                        <td style="padding: 8px; text-align: center;">${result.standard || ''}</td>
                        <td style="padding: 8px; text-align: center;">${resultValue}</td>
                        <td style="padding: 8px; text-align: center; color: ${evaluationColor}; font-weight: bold;">${result.evaluation || ''}</td>
                    </tr>
                `;
            });

            tablesHtml += '</tbody></table>';

            // Add REMARK_MASTER and REMARK_JOB after each page table
            tablesHtml += `
                <div style="margin-top: 20px; margin-bottom: 20px;">
                    <div style="margin-bottom: 15px;">
                        {{REMARK_MASTER}}
                    </div>
                    <div>
                        {{REMARK_JOB}}
                    </div>
                </div>
            `;

            if (totalPages > 1) {
                tablesHtml += `<p style="text-align: center; font-size: 0.9em; color: #666;">หน้าที่ ${page + 1} จาก ${totalPages} (รายการที่ ${startIndex + 1}-${endIndex} จากทั้งหมด ${results.length} รายการ)</p>`;
            }
        }

        return tablesHtml;
    }

    // Generate detailed measurement table
    generateDetailedTable(results) {
        if (!results || results.length === 0) {
            return '<p class="text-center">ไม่มีรายละเอียดการตรวจวัด</p>';
        }

        let tableHtml = `
            <table border="1" style="width: 100%; border-collapse: collapse; margin: 1em 0;">
                <thead>
                    <tr style="background-color: #e3f2fd;">
                        <th style="padding: 10px; text-align: center;">ลำดับ</th>
                        <th style="padding: 10px;">Lay Out</th>
                        <th style="padding: 10px;">พื้นที่ตรวจวัด</th>
                        <th style="padding: 10px;">ลักษณะงาน</th>
                        <th style="padding: 10px; text-align: center;">ประเภทการวัด</th>
                        <th style="padding: 10px; text-align: center;">ค่ามาตรฐาน (LUX)</th>
                        <th style="padding: 10px; text-align: center;">ผลที่วัดได้ (LUX)</th>
                        <th style="padding: 10px; text-align: center;">ผลการประเมิน</th>
                        <th style="padding: 10px; text-align: center;">หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
        `;

        results.forEach((result, index) => {
            const measurementTypeText = result.measurementType === 'spot' ? 'แบบจุด' : 'แบบพื้นที่';
            const resultValue = result.measurementType === 'spot' 
                ? (result.spotValue || '-')
                : `เฉลี่ย: ${result.areaAvgValue || '-'}<br>ต่ำสุด: ${result.areaMinValue || '-'}`;
            
            const evaluationColor = result.evaluation === 'ผ่าน' ? '#4caf50' : '#f44336';
            const evaluationBg = result.evaluation === 'ผ่าน' ? '#e8f5e8' : '#ffebee';
            
            tableHtml += `
                <tr>
                    <td style="padding: 8px; text-align: center;">${index + 1}</td>
                    <td style="padding: 8px;">${result.layout || ''}</td>
                    <td style="padding: 8px;">${result.area || ''}</td>
                    <td style="padding: 8px;">${result.workType || ''}</td>
                    <td style="padding: 8px; text-align: center;">${measurementTypeText}</td>
                    <td style="padding: 8px; text-align: center;">${result.standard || ''}</td>
                    <td style="padding: 8px; text-align: center;">${resultValue}</td>
                    <td style="padding: 8px; text-align: center; color: ${evaluationColor}; font-weight: bold; background-color: ${evaluationBg};">${result.evaluation || ''}</td>
                    <td style="padding: 8px; text-align: center;">-</td>
                </tr>
            `;
        });

        tableHtml += '</tbody></table>';
        
        // Add summary
        const passCount = results.filter(r => r.evaluation === 'ผ่าน').length;
        const failCount = results.filter(r => r.evaluation === 'ไม่ผ่าน').length;
        const spotCount = results.filter(r => r.measurementType === 'spot').length;
        const areaCount = results.filter(r => r.measurementType === 'area').length;
        
        tableHtml += `
            <div style="margin-top: 1em; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                <h4 style="margin-bottom: 10px;">สรุปผลการตรวจวัด</h4>
                <div style="display: flex; justify-content: space-around; text-align: center;">
                    <div><strong>รวมทั้งหมด:</strong> ${results.length} จุด</div>
                    <div style="color: #4caf50;"><strong>ผ่านเกณฑ์:</strong> ${passCount} จุด</div>
                    <div style="color: #f44336;"><strong>ไม่ผ่านเกณฑ์:</strong> ${failCount} จุด</div>
                </div>
                <div style="display: flex; justify-content: space-around; text-align: center; margin-top: 10px;">
                    <div><strong>แบบจุด:</strong> ${spotCount} จุด</div>
                    <div><strong>แบบพื้นที่:</strong> ${areaCount} จุด</div>
                </div>
            </div>
        `;

        return tableHtml;
    }

    // Remark tags for master and job-specific remarks
    getRemarkTags(jobData) {
        const tags = {};
        
        // REMARK_MASTER - ข้อเสนอแนะมาตรฐานจาก Master Data (ยังไม่มี - จะเพิ่มใน master-data-manager.html)
        tags['{{REMARK_MASTER}}'] = `
            <div style="padding: 15px; border-left: 4px solid #2196f3; background-color: #f8f9fa; margin-bottom: 10px;">
                <h5 style="color: #2196f3; margin: 0 0 10px 0;"><i class="fas fa-lightbulb"></i> ข้อเสนอแนะมาตรฐาน</h5>
                <div style="font-size: 14px; line-height: 1.6;">
                    • เพิ่มจำนวนหลอดไฟในพื้นที่ที่มีค่าแสงสว่างไม่เพียงพอ<br>
                    • เปลี่ยนหลอดไฟเป็นแบบให้แสงสว่างมากกว่าเดิม<br>
                    • ตรวจสอบและทำความสะอาดหลอดไฟเป็นประจำ<br>
                    • ปรับตำแหน่งการจัดวางโต๊ะทำงานให้รับแสงได้ดีขึ้น<br>
                    • หลีกเลี่ยงการติดตั้งไฟส่องสว่างในตำแหน่งที่ก่อให้เกิดเงา
                </div>
            </div>
        `;
        
        // REMARK_JOB - ข้อเสนอแนะและข้อสังเกตจากงานเฉพาะ
        const recommendations = jobData.recommendations || '';
        const observations = jobData.observations || '';
        
        let jobRemarkContent = '';
        if (recommendations) {
            jobRemarkContent += `
                <div style="margin-bottom: 10px;">
                    <strong style="color: #ff9800;">ข้อเสนอแนะเฉพาะงาน:</strong><br>
                    <div style="margin-left: 15px; font-size: 14px; line-height: 1.6;">
                        ${recommendations.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        }
        
        if (observations) {
            jobRemarkContent += `
                <div style="margin-bottom: 10px;">
                    <strong style="color: #4caf50;">ข้อสังเกตและหมายเหตุ:</strong><br>
                    <div style="margin-left: 15px; font-size: 14px; line-height: 1.6;">
                        ${observations.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        }
        
        if (!jobRemarkContent) {
            jobRemarkContent = '<div style="font-style: italic; color: #666;">ไม่มีข้อเสนอแนะเฉพาะสำหรับงานนี้</div>';
        }
        
        tags['{{REMARK_JOB}}'] = `
            <div style="padding: 15px; border-left: 4px solid #ff9800; background-color: #fff8e1; margin-bottom: 10px;">
                <h5 style="color: #ff9800; margin: 0 0 10px 0;"><i class="fas fa-clipboard-check"></i> ข้อเสนอแนะเฉพาะงาน</h5>
                ${jobRemarkContent}
            </div>
        `;
        
        return tags;
    }
}

// Export for use in other modules
window.TagProcessor = TagProcessor;