เอกสารการดำเนินงานโครงการ
โครงการพัฒนาระบบบันทึกผลการตรวจวัดแสง
เวอร์ชัน: 5.0 (Final As-Built Documentation)
วันที่: 3 กันยายน 2568

1. บทสรุปสำหรับผู้บริหาร (Executive Summary)
โครงการนี้ประสบความสำเร็จในการพัฒนาระบบ Web Application สำหรับบันทึกผลการตรวจวัดแสง และสร้างรายงานคุณภาพสูงในรูปแบบ PDF โดยอัตโนมัติ ระบบได้ปฏิรูปกระบวนการทำงานเดิมให้เป็นดิจิทัลอย่างสมบูรณ์ ทำให้สามารถทำงานทั้งหมดได้จากเว็บเบราว์เซอร์เพียงที่เดียว โดยไม่จำเป็นต้องพึ่งพาโปรแกรมภายนอกอีกต่อไป

หัวใจสำคัญของระบบที่พัฒนาเสร็จสมบูรณ์คือ "ระบบจัดการข้อมูลหลัก (Master Data Management)" แบบรวมศูนย์ ที่ให้ผู้ดูแลระบบสามารถบริหารจัดการข้อมูลมาตรฐานทั้งหมด (เช่น ลักษณะงาน, ค่ามาตรฐาน, รายชื่อผู้ตรวจวัด, เครื่องมือ, และข้อมูลบริษัท) ได้จากส่วนกลาง ซึ่งเป็นการรับประกันความถูกต้องและเป็นมาตรฐานของข้อมูลในทุกรายงาน และได้ยกระดับสู่การเป็นระบบที่ครบวงจร, ยืดหยุ่น, และพร้อมใช้งานในระดับองค์กรอย่างแท้จริง

2. ข้อกำหนดคุณสมบัติของระบบ (Functional Requirements)
2.1. ศูนย์จัดการข้อมูลหลัก (Master Data Management)

FR-01: ระบบต้องมีหน้า "ศูนย์จัดการข้อมูลหลัก" (master-data-manager.html) เป็นศูนย์กลางในการบริหารจัดการข้อมูลอ้างอิงทั้งหมด

FR-02 (Work Types): ผู้ใช้ต้องสามารถ สร้าง/แก้ไข/ลบ "ลักษณะงาน" พร้อมกำหนดค่ามาตรฐานความสว่างที่เกี่ยวข้อง

FR-03 (Inspectors): ผู้ใช้ต้องสามารถ สร้าง/แก้ไข/ลบ "รายชื่อผู้ตรวจวัด" และบุคลากรที่เกี่ยวข้อง

FR-04 (Instruments): ผู้ใช้ต้องสามารถ สร้าง/แก้ไข/ลบ "รายการเครื่องมือตรวจวัด" พร้อมข้อมูล Serial No. และวันที่สอบเทียบ

FR-05 (Company Info): ผู้ใช้ต้องสามารถจัดการ "ข้อมูลบริษัท" เช่น เลขที่ใบอนุญาตต่างๆ และ "รายชื่อผู้ลงนาม" ในตำแหน่งต่างๆ ได้

FR-06 (Recommendations): ผู้ใช้ต้องสามารถสร้างและบริหารจัดการ "คลังข้อเสนอแนะ" มาตรฐานได้

2.2. ระบบจัดการงาน (Job Management)

FR-07: ระบบต้องแสดงรายการงานทั้งหมดจากฐานข้อมูลแบบ Real-time

FR-08: ผู้ใช้ต้องสามารถสร้างงานใหม่ โดยระบบจะสร้าง Job ID และบันทึกข้อมูลลงฐานข้อมูลโดยอัตโนมัติ

2.3. ระบบบันทึกผลการตรวจวัด (Measurement Entry)

FR-09: Dropdown ทั้งหมดในหน้าบันทึกผล (เช่น ลักษณะงาน, ผู้รับผิดชอบ) ต้องดึงข้อมูลมาจาก Master Data

FR-10: เมื่อเลือก "ลักษณะงาน", คอลัมน์ "ค่ามาตรฐาน" ต้องแสดงผลตามที่กำหนดไว้ใน Master Data โดยอัตโนมัติ

FR-11: ระบบต้องมีเครื่องมือช่วยสร้างแถว, รองรับการวัดหลายประเภท, และประเมินผล "ผ่าน/ไม่ผ่าน" อัตโนมัติ

2.4. ศูนย์จัดการและออกแบบรายงาน (Report Design Center)

FR-12 (Template Hub): ระบบต้องมีหน้า "ศูนย์จัดการ Template เนื้อหา" (template-manager.html)

FR-13 (Report Finalizer): หน้า "ตัวสร้างรายงาน PDF" (report-finalizer.html) ต้องมีความสามารถดังนี้:

FR-13.1 (Load Content): เมื่อเปิดหน้า, ระบบต้องตรวจสอบว่า "งานนี้" มีเนื้อหารายงานที่เคยบันทึกไว้หรือไม่

ถ้ามี: โหลดเนื้อหานั้นขึ้นมาใน Editor

ถ้าไม่มี: โหลดเนื้อหาจาก Template ที่ถูกเลือกใน Dropdown ตามปกติ

FR-13.2 (Save for Job): ผู้ใช้ต้องสามารถ "บันทึกเนื้อหารายงานสำหรับงานนี้" ได้ โดยข้อมูลจะถูกเก็บไว้ในเอกสารของ Job นั้นๆ ในฐานข้อมูล (ไม่กระทบ Template ต้นฉบับ)

FR-13.3 (Save as Template): ผู้ใช้ต้องสามารถ "บันทึกเนื้อหาปัจจุบันเป็น Template ใหม่" ได้ โดยระบบจะถามชื่อและสร้างเป็น Template ใหม่เก็บไว้ในฐานข้อมูล

FR-13.4 (PDF Customization): ผู้ใช้ต้องสามารถอัปโหลดรูปภาพสำหรับ Header, Footer, Watermark และตั้งค่าหน้ากระดาษได้

FR-13.5 (PDF Generation): ระบบต้องสามารถสร้างไฟล์ PDF ที่แสดงผลภาษาไทยได้อย่างถูกต้อง

3. สถาปัตยกรรมและโครงสร้างของระบบ (System Architecture & Structure)
3.1. สถาปัตยกรรม

Frontend: HTML5, CSS3 (Bootstrap 5), JavaScript (ES6 Modules)

Backend as a Service (BaaS):

Database: Google Firebase Firestore

Authentication: Firebase Anonymous Authentication

3.2. โครงสร้างไฟล์

/
├── ui/
│   ├── main.html
│   ├── new-job.html
│   ├── job-details.html
│   ├── report-finalizer.html
│   ├── template-manager.html
│   ├── master-data-manager.html  # ศูนย์กลางจัดการ Master Data ทั้งหมด
│   └── firebase-config.js
│
├── .gitignore
└── Project-Report-Final.md     # เอกสารฉบับนี้

ภาคผนวก ก: รายละเอียดทางเทคนิค (Technical Appendix)
A.1: โครงสร้างข้อมูลใน Firestore (Data Structure)
ระบบใช้ฐานข้อมูลแบบ NoSQL (Firestore) โดยมี Collection หลัก 6 ส่วน:

jobs: เก็บข้อมูล "งาน" การตรวจวัดแต่ละครั้ง

jobId, customer, location, date, status, results (Array of Objects)

reportContent (ใหม่): (String) ใช้เก็บเนื้อหา HTML ของรายงานที่แก้ไขแล้วสำหรับงานนี้โดยเฉพาะ

work_types: Master Data "ลักษณะงาน"

name: (String) ชื่อลักษณะงาน

stdSpotMin, stdSpotMax, stdAreaAvg, stdAreaMin: (Number) ค่ามาตรฐาน

inspectors: Master Data "ผู้ตรวจวัดและบุคลากร"

name: (String) ชื่อ-นามสกุล

title: (String) ตำแหน่ง (เช่น "ผู้ตรวจวัด", "ผู้จัดทำรายงาน")

instruments: Master Data "เครื่องมือตรวจวัด"

name: (String) ชื่อ/รุ่นของเครื่องมือ

serialNo: (String) หมายเลขเครื่อง

calibrationDueDate: (String) วันที่สอบเทียบครั้งถัดไป

company_info: Master Data "ข้อมูลบริษัทและผู้ลงนาม" (สามารถจัดเก็บเป็น Document เดียว)

license_factory: (String) เลขทะเบียน ว-๓๒๙

license_welfare_light: (String) ใบอนุญาตตรวจวัดแสงสว่าง

signatories: (Array of Objects) รายชื่อผู้ลงนาม

name: (String) ชื่อผู้ลงนาม

title: (String) ตำแหน่ง (เช่น "ผู้ควบคุมห้องปฏิบัติการวิเคราะห์")

report_templates: Master Data "คลัง Template เนื้อหารายงาน"

name: (String) ชื่อ Template

content: (String) เนื้อหาข้อเสนอแนะในรูปแบบ HTML

A.2: การตั้งค่ากฎความปลอดภัย Firestore (Firestore Security Rules)
กฎความปลอดภัยถูกตั้งค่าให้ผู้ใช้ที่ผ่านการยืนยันตัวตนแล้วเท่านั้น ที่จะสามารถอ่านและเขียนข้อมูลได้

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
