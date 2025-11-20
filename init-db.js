const mysql = require('mysql2');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    
    try {
        // الاتصال بقاعدة البيانات (بدون تحديد قاعدة بيانات)
        connection = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true  // مهم لهذا الإصلاح
        });

        // استخدام callback بدلاً من promise للتحكم أفضل
        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ تم الاتصال بخادم MySQL');
                    resolve();
                }
            });
        });

        // إنشاء قاعدة البيانات إذا لم تكن موجودة
        await new Promise((resolve, reject) => {
            connection.query('CREATE DATABASE IF NOT EXISTS darri_db', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ تم إنشاء/التأكد من قاعدة البيانات');
                    resolve();
                }
            });
        });

        // استخدام قاعدة البيانات
        await new Promise((resolve, reject) => {
            connection.query('USE darri_db', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ تم استخدام قاعدة البيانات darri_db');
                    resolve();
                }
            });
        });

        // إنشاء الجداول
        console.log('🔨 جاري إنشاء الجداول...');

        // جدول المستخدمين
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    phone VARCHAR(20),
                    national_id VARCHAR(20),
                    role ENUM('tenant', 'owner', 'payment', 'maintenance', 'admin') NOT NULL,
                    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `, (err, results) => {
                if (err) reject(err);
                else {
                    console.log('✅ تم إنشاء جدول users');
                    resolve();
                }
            });
        });

        // جدول العقارات
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS properties (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    owner_id INT NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    type ENUM('villa', 'apartment', 'building', 'compound') NOT NULL,
                    address TEXT NOT NULL,
                    city VARCHAR(100) NOT NULL,
                    units INT NOT NULL,
                    monthly_rent DECIMAL(10,2) NOT NULL,
                    description TEXT,
                    status ENUM('active', 'inactive') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (owner_id) REFERENCES users(id)
                )
            `, (err, results) => {
                if (err) reject(err);
                else {
                    console.log('✅ تم إنشاء جدول properties');
                    resolve();
                }
            });
        });

        // جدول العقود
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS contracts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    property_id INT NOT NULL,
                    tenant_id INT NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    monthly_rent DECIMAL(10,2) NOT NULL,
                    status ENUM('active', 'expired', 'terminated') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (property_id) REFERENCES properties(id),
                    FOREIGN KEY (tenant_id) REFERENCES users(id)
                )
            `, (err, results) => {
                if (err) reject(err);
                else {
                    console.log('✅ تم إنشاء جدول contracts');
                    resolve();
                }
            });
        });

        // جدول طلبات الصيانة
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS maintenance_requests (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    contract_id INT NOT NULL,
                    type VARCHAR(100) NOT NULL,
                    description TEXT NOT NULL,
                    priority ENUM('urgent', 'high', 'medium', 'low') DEFAULT 'medium',
                    status ENUM('pending', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (contract_id) REFERENCES contracts(id)
                )
            `, (err, results) => {
                if (err) reject(err);
                else {
                    console.log('✅ تم إنشاء جدول maintenance_requests');
                    resolve();
                }
            });
        });

        // جدول الفواتير
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS invoices (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    contract_id INT NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    due_date DATE NOT NULL,
                    status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (contract_id) REFERENCES contracts(id)
                )
            `, (err, results) => {
                if (err) reject(err);
                else {
                    console.log('✅ تم إنشاء جدول invoices');
                    resolve();
                }
            });
        });

        // جدول المدفوعات
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS payments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    invoice_id INT NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    payment_method VARCHAR(50) NOT NULL,
                    status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
                    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
                )
            `, (err, results) => {
                if (err) reject(err);
                else {
                    console.log('✅ تم إنشاء جدول payments');
                    resolve();
                }
            });
        });

        // جدول الإشعارات
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `, (err, results) => {
                if (err) reject(err);
                else {
                    console.log('✅ تم إنشاء جدول notifications');
                    resolve();
                }
            });
        });

        // إضافة مستخدم مشرف افتراضي
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await new Promise((resolve, reject) => {
            connection.query(
                'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['المشرف العام', 'admin@darri.com', hashedPassword, 'admin'],
                (err, results) => {
                    if (err) reject(err);
                    else {
                        console.log('✅ تم إضافة المستخدم المشرف');
                        resolve();
                    }
                }
            );
        });

        console.log('\n🎉 تم تهيئة قاعدة البيانات بنجاح!');
        console.log('🔐 بيانات الدخول الافتراضية:');
        console.log('   البريد: admin@darri.com');
        console.log('   كلمة المرور: admin123');
        console.log('   الدور: admin');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة قاعدة البيانات:', error.message);
    } finally {
        // إغلاق الاتصال
        if (connection) {
            connection.end();
            console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
        }
    }
}

// تشغيل التهيئة
initializeDatabase();