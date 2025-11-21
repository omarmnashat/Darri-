const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'darri-secret-key';

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// إعدادات MySQL لـ XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // كلمة المرور فارغة في XAMPP الافتراضي
    database: 'darri_db'
});

// الاتصال بقاعدة البيانات
db.connect((err) => {
    if (err) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message);
        console.log('💡 تأكد من:');
        console.log('   1. تشغيل XAMPP');
        console.log('   2. تشغيل Apache و MySQL');
        console.log('   3. إنشاء قاعدة بيانات darri_db في phpMyAdmin');
        return;
    }
    console.log('✅ تم الاتصال بقاعدة البيانات MySQL');
    createTables();
});

// إنشاء الجداول
function createTables() {
    console.log('🔨 جاري إنشاء الجداول...');

    const tables = [
        // جدول المستخدمين
        `CREATE TABLE IF NOT EXISTS users (
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
        )`,

        // جدول العقارات
        `CREATE TABLE IF NOT EXISTS properties (
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
        )`,

        // جدول العقود
        `CREATE TABLE IF NOT EXISTS contracts (
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
        )`,

        // جدول طلبات الصيانة
        `CREATE TABLE IF NOT EXISTS maintenance_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contract_id INT NOT NULL,
            type VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            priority ENUM('urgent', 'high', 'medium', 'low') DEFAULT 'medium',
            status ENUM('pending', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (contract_id) REFERENCES contracts(id)
        )`,

        // جدول الفواتير
        `CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contract_id INT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            due_date DATE NOT NULL,
            status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contract_id) REFERENCES contracts(id)
        )`,

        // جدول المدفوعات
        `CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_id INT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
            payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (invoice_id) REFERENCES invoices(id)
        )`,

        // جدول الإشعارات
        `CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`
    ];

    tables.forEach((sql, index) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.error(`❌ خطأ في إنشاء الجدول ${index + 1}:`, err.message);
            } else {
                console.log(`✅ تم إنشاء الجدول ${index + 1}`);
            }
        });
    });

    // إضافة مستخدم مشرف بعد إنشاء الجداول
    setTimeout(() => {
        addAdminUser();
    }, 1000);
}

// إضافة مستخدم مشرف
function addAdminUser() {
    const adminEmail = 'admin@darri.com';
    
    // التحقق إذا كان المستخدم موجوداً already
    db.query('SELECT * FROM users WHERE email = ?', [adminEmail], (err, results) => {
        if (err) {
            console.error('❌ خطأ في التحقق من المستخدم:', err.message);
            return;
        }

        if (results.length === 0) {
            // إنشاء المستخدم المشرف
            bcrypt.hash('admin123', 10, (err, hashedPassword) => {
                if (err) {
                    console.error('❌ خطأ في تشفير كلمة المرور:', err.message);
                    return;
                }

                db.query(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    ['المشرف العام', adminEmail, hashedPassword, 'admin'],
                    (err, result) => {
                        if (err) {
                            console.error('❌ خطأ في إضافة المستخدم المشرف:', err.message);
                        } else {
                            console.log('✅ تم إضافة المستخدم المشرف بنجاح');
                            console.log('🔐 بيانات الدخول:');
                            console.log('   البريد: admin@darri.com');
                            console.log('   كلمة المرور: admin123');
                            console.log('   الدور: admin');
                        }
                    }
                );
            });
        } else {
            console.log('✅ المستخدم المشرف موجود already');
        }
    });
}

// middleware المصادقة
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'رمز الوصول مطلوب' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'رمز وصول غير صالح' });
        }
        req.user = user;
        next();
    });
};

// المسارات الأساسية

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// التسجيل
app.post('/api/register', (req, res) => {
    const { name, email, password, phone, national_id, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في تشفير كلمة المرور' });
        }

        db.query(
            'INSERT INTO users (name, email, password, phone, national_id, role) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, national_id, role],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'البريد الإلكتروني مسجل مسبقاً' });
                    }
                    return res.status(500).json({ error: 'خطأ في الخادم' });
                }

                const token = jwt.sign(
                    { userId: result.insertId, email, role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    message: 'تم إنشاء الحساب بنجاح',
                    token,
                    user: {
                        id: result.insertId,
                        name,
                        email,
                        role
                    }
                });
            }
        );
    });
});

// تسجيل الدخول
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ? AND role = ?',
        [email, role],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في الخادم' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
            }

            const user = results[0];

            bcrypt.compare(password, user.password, (err, validPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'خطأ في التحقق من كلمة المرور' });
                }

                if (!validPassword) {
                    return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
                }

                const token = jwt.sign(
                    { userId: user.id, email: user.email, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    message: 'تم تسجيل الدخول بنجاح',
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            });
        }
    );
});

// الحصول على بيانات المستخدم
app.get('/api/user', authenticateToken, (req, res) => {
    db.query(
        'SELECT id, name, email, phone, role, status FROM users WHERE id = ?',
        [req.user.userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في الخادم' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'المستخدم غير موجود' });
            }

            res.json({ user: results[0] });
        }
    );
});

// إحصائيات تجريبية
app.get('/api/stats', authenticateToken, (req, res) => {
    const stats = {
        properties: 8,
        tenants: 12,
        payments: 45,
        maintenance: 3,
        monthlyRent: 2400,
        daysUntilPayment: 15
    };
    res.json({ stats });
});

// ==================== نظام الإشعارات ====================

// إرسال إشعار جديد
app.post('/api/notifications', authenticateToken, (req, res) => {
    const { userId, title, message, type } = req.body;

    db.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [userId, title, message, type],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في إرسال الإشعار' });
            }
            res.json({ 
                message: 'تم إرسال الإشعار بنجاح',
                notificationId: result.insertId 
            });
        }
    );
});

// الحصول على إشعارات المستخدم
app.get('/api/notifications', authenticateToken, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // جلب الإشعارات مع الت pagination
    db.query(
        `SELECT * FROM notifications 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [req.user.userId, limit, offset],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في جلب الإشعارات' });
            }

            // جلب عدد الإشعارات غير المقروءة
            db.query(
                'SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND is_read = FALSE',
                [req.user.userId],
                (err, countResults) => {
                    if (err) {
                        return res.status(500).json({ error: 'خطأ في جلب عدد الإشعارات' });
                    }

                    res.json({
                        notifications: results,
                        unreadCount: countResults[0].unreadCount,
                        currentPage: page,
                        totalPages: Math.ceil(countResults[0].unreadCount / limit)
                    });
                }
            );
        }
    );
});

// تحديث حالة الإشعار كمقروء
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
    const notificationId = req.params.id;

    db.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
        [notificationId, req.user.userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في تحديث الإشعار' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'الإشعار غير موجود' });
            }

            res.json({ message: 'تم تعيين الإشعار كمقروء' });
        }
    );
});

// تعيين كل الإشعارات كمقروءة
app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
    db.query(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
        [req.user.userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في تحديث الإشعارات' });
            }

            res.json({ 
                message: 'تم تعيين جميع الإشعارات كمقروءة',
                updatedCount: result.affectedRows 
            });
        }
    );
});

// حذف إشعار
app.delete('/api/notifications/:id', authenticateToken, (req, res) => {
    const notificationId = req.params.id;

    db.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [notificationId, req.user.userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في حذف الإشعار' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'الإشعار غير موجود' });
            }

            res.json({ message: 'تم حذف الإشعار بنجاح' });
        }
    );
});

// إشعارات البث (للمشرفين)
app.post('/api/notifications/broadcast', authenticateToken, (req, res) => {
    const { title, message, type, roles } = req.body;

    // التحقق من صلاحيات المشرف
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'غير مصرح لك بإرسال إشعارات البث' });
    }

    // جلب جميع المستخدمين الذين يتطابقون مع الأدوار المحددة
    let query = 'SELECT id FROM users WHERE status = "active"';
    const queryParams = [];

    if (roles && roles.length > 0) {
        query += ' AND role IN (?)';
        queryParams.push(roles);
    }

    db.query(query, queryParams, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في جلب المستخدمين' });
        }

        // إرسال إشعار لكل مستخدم
        const notifications = users.map(user => [user.id, title, message, type]);
        
        if (notifications.length === 0) {
            return res.json({ message: 'لا يوجد مستخدمين لإرسال الإشعارات لهم' });
        }

        db.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES ?',
            [notifications],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'خطأ في إرسال الإشعارات' });
                }

                res.json({ 
                    message: `تم إرسال الإشعار إلى ${notifications.length} مستخدم`,
                    sentCount: notifications.length 
                });
            }
        );
    });
});

// وظائف مساعدة للإشعارات التلقائية
function sendAutoNotification(userId, title, message, type = 'info') {
    db.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [userId, title, message, type],
        (err) => {
            if (err) {
                console.error('❌ خطأ في إرسال الإشعار التلقائي:', err.message);
            } else {
                console.log(`✅ تم إرسال إشعار تلقائي للمستخدم ${userId}`);
            }
        }
    );
}

// إشعارات تلقائية عند إنشاء عقد
app.post('/api/contracts', authenticateToken, (req, res) => {
    const { property_id, tenant_id, start_date, end_date, monthly_rent } = req.body;

    db.query(
        'INSERT INTO contracts (property_id, tenant_id, start_date, end_date, monthly_rent) VALUES (?, ?, ?, ?, ?)',
        [property_id, tenant_id, start_date, end_date, monthly_rent],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في إنشاء العقد' });
            }

            // إرسال إشعار للمستأجر
            sendAutoNotification(
                tenant_id,
                'عقد إيجار جديد',
                `تم إنشاء عقد إيجار جديد لك. قيمة الإيجار: ${monthly_rent} ريال`,
                'success'
            );

            // إرسال إشعار للمالك
            db.query('SELECT owner_id FROM properties WHERE id = ?', [property_id], (err, propertyResults) => {
                if (!err && propertyResults.length > 0) {
                    sendAutoNotification(
                        propertyResults[0].owner_id,
                        'عقد إيجار جديد',
                        `تم تأجير عقارك لمستأجر جديد. قيمة الإيجار: ${monthly_rent} ريال`,
                        'success'
                    );
                }
            });

            res.json({
                message: 'تم إنشاء العقد بنجاح',
                contractId: result.insertId
            });
        }
    );
});

// إشعارات تلقائية عند إنشاء فاتورة
app.post('/api/invoices', authenticateToken, (req, res) => {
    const { contract_id, amount, due_date } = req.body;

    db.query(
        'INSERT INTO invoices (contract_id, amount, due_date) VALUES (?, ?, ?)',
        [contract_id, amount, due_date],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في إنشاء الفاتورة' });
            }

            // إرسال إشعار للمستأجر
            db.query(
                `SELECT c.tenant_id, p.name as property_name 
                 FROM contracts c 
                 JOIN properties p ON c.property_id = p.id 
                 WHERE c.id = ?`,
                [contract_id],
                (err, contractResults) => {
                    if (!err && contractResults.length > 0) {
                        sendAutoNotification(
                            contractResults[0].tenant_id,
                            'فاتورة إيجار جديدة',
                            `تم إصدار فاتورة إيجار جديدة للعقار ${contractResults[0].property_name}. المبلغ: ${amount} ريال`,
                            'payment'
                        );
                    }
                }
            );

            res.json({
                message: 'تم إنشاء الفاتورة بنجاح',
                invoiceId: result.insertId
            });
        }
    );
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});