// js/main.js
console.log('✅ جاري تحميل main.js...');

// تعريف app object
const app = {
    init: function() {
        console.log('🚀 التطبيق اشتغل بنجاح!');
        this.showHomePage();
    },

    showHomePage: function() {
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; color: white;">
                    <h1 style="font-size: 3em; margin-bottom: 20px;">🏠 داري</h1>
                    <h2 style="margin-bottom: 30px;">نظام إدارة العقارات</h2>
                    
                    <div style="background: white; color: #333; padding: 30px; border-radius: 15px; max-width: 400px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                        <h3 style="color: #2c3e50; margin-bottom: 20px;">مرحباً بك! 👋</h3>
                        
                        <button onclick="app.showLogin()" style="width: 100%; padding: 15px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 16px; margin: 10px 0; cursor: pointer;">
                            🔐 تسجيل الدخول
                        </button>
                        
                        <button onclick="app.showRegister()" style="width: 100%; padding: 15px; background: #27ae60; color: white; border: none; border-radius: 8px; font-size: 16px; margin: 10px 0; cursor: pointer;">
                            📝 إنشاء حساب
                        </button>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <p style="color: #666; margin: 0;">✅ التطبيق جاهز للاستخدام</p>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    showLogin: function() {
        document.getElementById('app').innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; color: white;">
                <div style="background: white; color: #333; padding: 30px; border-radius: 15px; max-width: 400px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <button onclick="app.showHomePage()" style="background: none; border: none; color: #666; cursor: pointer; margin-bottom: 20px;">← الرجوع</button>
                    
                    <h2 style="color: #2c3e50;">تسجيل الدخول</h2>
                    
                    <div style="margin: 20px 0;">
                        <input type="email" id="email" placeholder="البريد الإلكتروني" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                        <input type="password" id="password" placeholder="كلمة المرور" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    
                    <button onclick="app.handleLogin()" style="width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                        دخول
                    </button>
                    
                    <p style="margin-top: 20px;">
                        <a href="#" onclick="app.showRegister()" style="color: #3498db;">إنشاء حساب جديد</a>
                    </p>
                </div>
            </div>
        `;
    },

    showRegister: function() {
        document.getElementById('app').innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; color: white;">
                <div style="background: white; color: #333; padding: 30px; border-radius: 15px; max-width: 400px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <button onclick="app.showHomePage()" style="background: none; border: none; color: #666; cursor: pointer; margin-bottom: 20px;">← الرجوع</button>
                    
                    <h2 style="color: #2c3e50;">إنشاء حساب جديد</h2>
                    
                    <div style="margin: 20px 0;">
                        <input type="text" placeholder="الاسم الكامل" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                        <input type="email" placeholder="البريد الإلكتروني" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                        <input type="password" placeholder="كلمة المرور" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                        <input type="password" placeholder="تأكيد كلمة المرور" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    
                    <button style="width: 100%; padding: 12px; background: #27ae60; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                        إنشاء حساب
                    </button>
                    
                    <p style="margin-top: 20px;">
                        <a href="#" onclick="app.showLogin()" style="color: #3498db;">لديك حساب already؟</a>
                    </p>
                </div>
            </div>
        `;
    },

    handleLogin: function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('⚠️ أدخل البريد الإلكتروني وكلمة المرور');
            return;
        }
        
        alert('✅ تم الدخول بنجاح! (وضع تجريبي)');
        console.log('بيانات الدخول:', { email, password });
    }
};

// جعل app متاح globally
window.app = app;

console.log('✅ تم تحميل main.js بنجاح - app جاهز');