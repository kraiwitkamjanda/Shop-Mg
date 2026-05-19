# Garden Shop Management System — Current Progress

## Tech Stack

* Frontend: HTML + TailwindCSS + Vanilla JavaScript
* Backend: Node.js + Express
* Database: Prisma ORM + SQLite (Development)
* Authentication: JWT
* Future Production DB: PostgreSQL

---

# ✅ COMPLETED PHASES

---

# Phase 1 — Project Setup

## Completed

* Node.js Express server setup
* Prisma ORM installation
* SQLite database setup
* Basic folder structure
* Environment variables (.env)
* Nodemon development environment

## Working

* `npm run dev`
* Prisma connection
* Express API server

---

# Phase 2 — Authentication System

## Completed

* JWT Login API
* Password hashing
* Auth middleware & Security middleware
* Token validation
* LocalStorage token storage

## Files

* `src/controllers/authController.js`
* `src/routes/authRoutes.js`
* `src/middlewares/authMiddleware.js`
* `src/middlewares/security.js`
* `public/login.html`
* `public/js/auth.js`
* `public/js/guard.js`

## Working

* Login page
* JWT generation & Security checks
* Protected routes
* Redirect if not logged in

---

# Phase 3 — Product Management API

## Completed

* GET / POST / PUT / DELETE Products API (Protected)
* Prisma Product & Category model integration
* Frontend Integration & Bug Fix (แก้ไขปัญหา 403 Forbidden และดึงข้อมูลวาดตารางเรียบร้อยแล้ว)

## Files

* `src/controllers/productController.js`
* `src/routes/productRoutes.js`
* `public/products.html`

---

# Phase 4 — Sales & POS System (New!)

## Completed

* Sales Management API (`saleController.js`, `saleRoutes.js`)
* POST /api/sales (บันทึกยอดขาย ตัดสต็อก)
* GET /api/sales (ดึงประวัติการขาย)
* Frontend UI หน้าขายหน้าร้าน (`pos.html`, `pos.js`) - ออกแบบ UI ระบบตะกร้าสินค้าและการคิดเงินเสร็จสมบูรณ์ อยู่ระหว่างทดสอบระบบเชื่อมโยงข้อมูล

## Files

* `src/controllers/saleController.js`
* `src/routes/saleRoutes.js`
* `public/pos.html`
* `public/js/pos.js`

---

# Phase 5 — Database Models & Extended Schemas

## Completed Models (Backend Verified in Postman)

### Core & Inventory

* **Product & Category:** จัดการข้อมูลสินค้าและหมวดหมู่
* **StockMovement:** ระบบบันทึกการเข้า-ออกของสต็อกสินค้า

### CRM & Loyalty

* **Customer & LoyaltyPoint:** ระบบฐานข้อมูลลูกค้าและคะแนนสะสม
* **Coupon & CustomerCoupon:** ระบบคูปองส่วนลด
* **Webhook:** รองรับการต่อขยายระบบ เช่น LINE OA Integration ในอนาคต

### Purchasing & HRM

* **Employee:** ข้อมูลพนักงานและระบบสิทธิ์
* **Supplier:** ข้อมูลซัพพลายเออร์/ผู้ผลิต
* **PurchaseOrder & PurchaseOrderItem:** ระบบใบสั่งซื้อสินค้าเข้าพืชสวน

---

# ✅ FRONTEND STATUS

| หน้าจอ (UI Pages) | สถานะ (Status) | รายละเอียด (Details) |
| :--- | :--- | :--- |
| **Index / Dashboard** | 🟡 IP (In Progress) | มีไฟล์โครงสร้างหลักแล้ว (`index.html`) |
| **Login** | ✅ PASS | ระบบล็อกอิน, จัดเก็บ JWT และการเปลี่ยนภาษาทำงานได้สมบูรณ์ |
| **Products** | ✅ PASS | ตารางแสดงสินค้า ดึงข้อมูลจาก API ได้ถูกต้อง และใช้งานฟังก์ชันลบสินค้าได้แล้ว |
| **POS (หน้าขาย)** | 🟡 IP (In Progress) | โครงสร้าง UI (30 KB) เสร็จเรียบร้อย กำลังต่อยอดระบบเชื่อมโยงข้อมูลฝั่งหน้าบ้าน |
| **Customers / Loyalty** | 💤 UI Prepared | เตรียมไฟล์ `customers.html`, `customer-detail.html`, `coupons.html` ไว้แล้ว |
| **Analytics / Reports** | 💤 UI Prepared | มีไฟล์โครงสร้างเริ่มต้น `analytics.html` และ `analytics.js` |
| **Purchase Orders** | 💤 UI Prepared | มีไฟล์โครงสร้างเริ่มต้น `purchase-orders.html` |
| **Suppliers** | 💤 UI Prepared | มีไฟล์ `suppliers.html` รอการพัฒนาต่อยอด |
| **Employees** | 💤 UI Prepared | มีไฟล์ `employees.html` รอการพัฒนาต่อยอด |

---

# ✅ API TESTING STATUS (Postman)

| API Module | Endpoint Tested | Status |
| :--- | :--- | :--- |
| **Auth** | Login / Token Verify | ✅ 100% |
| **Products** | GET, POST, PUT, DELETE | ✅ 100% |
| **Categories** | GET, POST, PUT, DELETE | ✅ 100% |
| **Sales (POS)** | Create Sale, Get History | ✅ 100% |
| **Customers / CRM**| Management & Loyalty Points | ✅ 100% |
| **Purchasing (PO)** | Purchase Orders & Supplier Flows| ✅ 100% |
| **Employees** | Employee Profiles & Roles | ✅ 100% |
| **Webhooks** | Endpoint Preparation | ✅ 100% |

---

# ⚠ CURRENT FOCUS & NEXT STEPS

## 1. Immediate Next Step (Priority 1)
* **Connect POS Frontend:** นำหน้าจอ `pos.html` มาเชื่อมต่อกับ API งานขาย (`/api/sales`) เพื่อให้สามารถยิงบาร์โค้ด ตัดสต็อก และบันทึกยอดขายลงฐานข้อมูล SQLite ได้จริงจากหน้าจอ

## 2. Secondary Steps (Priority 2)
* **Build Modals for Product Page:** เพิ่มปุ่มเปิดหน้าต่างย่อย (Modal) สำหรับการ กดเพิ่มสินค้า (Add) และ แก้ไขสินค้า (Edit) ในหน้า `products.html`
* **Implement Search & Filter:** ทำระบบค้นหาชื่อสินค้า, รหัส SKU และการเลือกตัวกรองตามหมวดหมู่สินค้าในหน้า Frontend

## 3. Future Roadmap
* พัฒนาหน้าจอฝั่ง CRM (ลูกค้า/ระบบแต้มสะสม) และหน้าจอจัดซื้อ (Suppliers / PO)
* ย้ายระบบฐานข้อมูลจาก SQLite ไปเป็น PostgreSQL ในขั้นตอน Production
* ทำการ Deploy บนระบบ Docker + Nginx + Cloudflare Tunnel

---

# Helpful Commands

## Start Server
```bash
npm run dev