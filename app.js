// js/api.js
const API = {
    baseURL: 'http://localhost:3000/api',
    
    // دالة الطلبات العامة
    async request(endpoint, options = {}) {
        try {
            console.log(`🔄 جاري الاتصال: ${this.baseURL}${endpoint}`);
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`خطأ في السيرفر: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ استجابة ناجحة:', data);
            return data;
        } catch (error) {
            console.error('❌ فشل في الاتصال:', error);
            return { 
                success: false, 
                error: error.message,
                message: 'فشل في الاتصال بالسيرفر'
            };
        }
    },

    // دوال المصادقة
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // دوال الاختبار
    async test() {
        return this.request('/test');
    }
};

// جعل API متاح globally
window.API = API;
console.log('✅ API جاهز للاستخدام');