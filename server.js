// بعد كل الـ imports وقبل app.listen

// route لاختبار API
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true,
        message: '✅ الـ API شغال بنجاح!',
        timestamp: new Date().toISOString(),
        data: {
            service: 'Darri Real Estate',
            version: '1.0.0',
            status: 'active'
        }
    });
});

// route أساسي للصفحة الرئيسية
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Darri Backend</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #2c3e50; }
                .status { background: #27ae60; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; }
            </style>
        </head>
        <body>
            <h1>🚀 Darri Backend Server</h1>
            <p class="status">✅ السيرفر شغال بنجاح</p>
            <p>البورت: 3000</p>
            <p>اختبار API: <a href="/api/test">/api/test</a></p>
        </body>
        </html>
    `);
});