// وظائف مشتركة لجميع لوحات التحكم
const dashboard = {
    init: function(role) {
        this.setupSidebar(role);
        this.setupNotifications();
        this.loadDashboardData(role);
    },
    
    setupSidebar: function(role) {
        // تحميل الشريط الجانبي المناسب
        fetch(`components/sidebar-${role}.html`)
            .then(response => response.text())
            .then(html => {
                document.querySelector('.sidebar').innerHTML = html;
                this.setupSidebarEvents(role);
            });
    },
    
    setupSidebarEvents: function(role) {
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // إزالة النشاط من جميع العناصر
                document.querySelectorAll('.sidebar-menu a').forEach(item => {
                    item.classList.remove('active');
                });
                
                // إضافة النشاط للعنصر الحالي
                this.classList.add('active');
                
                // تحميل المحتوى المناسب
                const tabName = this.getAttribute('data-tab');
                if (tabName) {
                    dashboard.switchTab(role, tabName);
                }
            });
        });
    },
    
    setupNotifications: function() {
        document.querySelectorAll('.notification-bell').forEach(bell => {
            bell.addEventListener('click', function() {
                const panel = this.querySelector('.notifications-panel');
                if (panel) {
                    panel.classList.toggle('show');
                }
            });
        });
    },
    
    switchTab: function(role, tabName) {
        // إخفاء جميع المحتويات
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // إظهار المحتوى المطلوب
        const targetTab = document.getElementById(`${role}-${tabName}`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // تحديث عنوان الصفحة
        const pageTitle = document.getElementById(`${role}-page-title`);
        if (pageTitle) {
            const titles = this.getTabTitles(role);
            pageTitle.textContent = titles[tabName] || 'لوحة التحكم';
        }
    },
    
    getTabTitles: function(role) {
        const titles = {
            'tenant': {
                'overview': 'نظرة عامة',
                'contracts': 'عقودي',
                'payments': 'المدفوعات',
                'maintenance': 'طلبات الصيانة',
                'visits': 'الزيارات',
                'notifications': 'الإشعارات'
            },
            'owner': {
                'overview': 'نظرة عامة',
                'properties': 'عقاراتي',
                'contracts': 'العقود',
                'payments': 'المدفوعات',
                'maintenance': 'طلبات الصيانة',
                'reports': 'التقارير',
                'notifications': 'الإشعارات'
            },
            'payment': {
                'overview': 'نظرة عامة',
                'invoices': 'الفواتير',
                'payments': 'المدفوعات',
                'reports': 'التقارير'
            },
            'maintenance': {
                'overview': 'نظرة عامة',
                'requests': 'طلبات الصيانة',
                'schedule': 'الجدول الزمني',
                'technicians': 'الفنيين'
            },
            'admin': {
                'overview': 'نظرة عامة',
                'users': 'إدارة المستخدمين',
                'properties': 'إدارة العقارات',
                'contracts': 'إدارة العقود',
                'reports': 'التقارير',
                'system': 'إعدادات النظام'
            }
        };
        
        return titles[role] || {};
    },
    
    loadDashboardData: function(role) {
        // في التطبيق الحقيقي، هنا سيتم جلب البيانات من الخادم
        console.log(`Loading data for ${role} dashboard`);
        
        // بيانات تجريبية
        const sampleData = this.getSampleData(role);
        this.updateDashboardUI(role, sampleData);
    },
    
    getSampleData: function(role) {
        // إرجاع بيانات تجريبية حسب الدور
        const data = {
            tenant: {
                stats: {
                    activeContracts: 3,
                    pendingMaintenance: 1,
                    monthlyRent: 2400,
                    daysUntilPayment: 15
                }
            },
            owner: {
                stats: {
                    properties: 8,
                    occupancyRate: 92,
                    monthlyIncome: 45200,
                    newMaintenance: 3
                }
            },
            payment: {
                stats: {
                    monthlyInvoices: 32,
                    totalPayments: 28500,
                    latePayments: 4,
                    collectionRate: 89
                }
            },
            maintenance: {
                stats: {
                    activeRequests: 12,
                    weeklyCompleted: 5,
                    urgentRequests: 2,
                    availableTechnicians: 4
                }
            },
            admin: {
                stats: {
                    totalUsers: 156,
                    activeProperties: 42,
                    systemPerformance: 98.7,
                    systemNotifications: 7
                }
            }
        };
        
        return data[role] || {};
    },
    
    updateDashboardUI: function(role, data) {
        // تحديث واجهة المستخدم بالبيانات
        if (data.stats) {
            this.updateStats(role, data.stats);
        }
    },
    
    updateStats: function(role, stats) {
        // تحديث إحصائيات لوحة التحكم
        Object.keys(stats).forEach(statKey => {
            const element = document.querySelector(`[data-stat="${statKey}"]`);
            if (element) {
                element.textContent = stats[statKey];
            }
        });
    }
};