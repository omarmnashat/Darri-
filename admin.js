// لوحة تحكم المشرف العام
const adminDashboard = {
    init: function() {
        dashboard.init('admin');
        this.setupAdminSpecificEvents();
        this.loadAdminData();
    },
    
    setupAdminSpecificEvents: function() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-user')) {
                adminDashboard.showAddUserModal();
            }
            
            if (e.target.classList.contains('edit-user')) {
                adminDashboard.editUser(e.target.dataset.userId);
            }
            
            if (e.target.classList.contains('toggle-user-status')) {
                adminDashboard.toggleUserStatus(e.target.dataset.userId);
            }
            
            if (e.target.classList.contains('system-settings')) {
                adminDashboard.showSystemSettings();
            }
        });
    },
    
    loadAdminData: function() {
        const adminData = {
            stats: {
                totalUsers: 156,
                activeProperties: 42,
                systemPerformance: 98.7,
                systemNotifications: 7
            },
            users: [
                {
                    id: 1,
                    name: 'أحمد محمد',
                    email: 'ahmed@example.com',
                    role: 'tenant',
                    joinDate: '2023-11-15',
                    status: 'active',
                    lastLogin: '2023-11-25'
                },
                {
                    id: 2,
                    name: 'سعيد عبدالله',
                    email: 'saied@example.com',
                    role: 'owner',
                    joinDate: '2023-11-12',
                    status: 'active',
                    lastLogin: '2023-11-24'
                },
                {
                    id: 3,
                    name: 'خالد إبراهيم',
                    email: 'khaled@example.com',
                    role: 'payment',
                    joinDate: '2023-11-10',
                    status: 'active',
                    lastLogin: '2023-11-25'
                }
            ],
            system: {
                performance: 98.7,
                uptime: '99.9%',
                activeSessions: 24,
                storageUsed: '2.3/10 GB',
                lastBackup: '2023-11-24 02:00'
            }
        };
        
        this.renderAdminData(adminData);
    },
    
    renderAdminData: function(data) {
        this.renderUsers(data.users);
        this.renderSystemInfo(data.system);
    },
    
    renderUsers: function(users) {
        const tbody = document.querySelector('#users-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge status-${user.role}">${this.getRoleText(user.role)}</span></td>
                <td>${app.formatDate(user.joinDate)}</td>
                <td><span class="status-badge status-${user.status}">${this.getStatusText(user.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm edit-user" data-user-id="${user.id}">عرض</button>
                    <button class="btn btn-primary btn-sm">تعديل</button>
                    <button class="btn btn-${user.status === 'active' ? 'warning' : 'success'} btn-sm toggle-user-status" 
                            data-user-id="${user.id}">
                        ${user.status === 'active' ? 'تعطيل' : 'تفعيل'}
                    </button>
                </td>
            </tr>
        `).join('');
    },
    
    renderSystemInfo: function(system) {
        const systemInfo = document.getElementById('system-info');
        if (!systemInfo) return;
        
        systemInfo.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${system.performance}%</div>
                    <div class="stat-label">أداء النظام</div>
                </div>
                <div class="stat-card success">
                    <div class="stat-value">${system.uptime}</div>
                    <div class="stat-label">معدل التشغيل</div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-value">${system.activeSessions}</div>
                    <div class="stat-label">جلسات نشطة</div>
                </div>
                <div class="stat-card danger">
                    <div class="stat-value">${system.storageUsed}</div>
                    <div class="stat-label">مساحة التخزين</div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">معلومات النظام</h3>
                </div>
                <div class="card-body">
                    <div class="system-details">
                        <p><strong>آخر نسخة احتياطية:</strong> ${system.lastBackup}</p>
                        <p><strong>إصدار النظام:</strong> 1.0.0</p>
                        <p><strong>خادم قاعدة البيانات:</strong> MySQL 8.0</p>
                        <p><strong>وقت التشغيل:</strong> 15 يوم, 4 ساعات</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    showAddUserModal: function() {
        app.showModal('add-user-modal');
    },
    
    editUser: function(userId) {
        console.log('Editing user:', userId);
        // عرض نموذج تعديل المستخدم
    },
    
    toggleUserStatus: function(userId) {
        console.log('Toggling user status:', userId);
        const button = document.querySelector(`[data-user-id="${userId}"].toggle-user-status`);
        const newStatus = button.textContent.includes('تعطيل') ? 'inactive' : 'active';
        
        alert(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} المستخدم`);
        // في التطبيق الحقيقي، تحديث حالة المستخدم في الخادم
    },
    
    showSystemSettings: function() {
        console.log('Showing system settings');
        // عرض إعدادات النظام
    },
    
    getRoleText: function(role) {
        const roleMap = {
            'tenant': 'مستأجر',
            'owner': 'مالك عقار',
            'payment': 'مسؤول الدفع',
            'maintenance': 'فريق الصيانة',
            'admin': 'مشرف'
        };
        return roleMap[role] || role;
    },
    
    getStatusText: function(status) {
        const statusMap = {
            'active': 'نشط',
            'inactive': 'غير نشط',
            'suspended': 'موقوف',
            'pending': 'بانتظار التفعيل'
        };
        return statusMap[status] || status;
    }
};