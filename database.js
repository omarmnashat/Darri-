// في ملف database.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,        // 127.0.0.1
  user: process.env.DB_USER,        // root
  password: process.env.DB_PASSWORD, // كلمة السر
  database: process.env.DB_NAME     // darri_db
});

connection.connect((error) => {
  if (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
  } else {
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
  }
});