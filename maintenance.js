// لوحة تحكم فريق الصيانة
const maintenanceDashboard = {
    init: function() {
        dashboard.init('maintenance');
        this.setupMaintenanceSpecificEvents();
        this.loadMaintenanceData();
    },
    
    setupMaintenanceSpecificEvents: function() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('assign-technician')) {
                maintenanceDashboard.assignTechnician(e.target.dataset.requestId);
            }
            
            if (e.target.classList.contains('update-status')) {
                maintenanceDashboard.updateStatus(e.target.dataset.requestId);
            }
            
            if (e.target.classList.contains('view-request')) {
                maintenanceDashboard.viewRequest(e.target.dataset.requestId);
            }
        });
    },
    
    loadMaintenanceData: function() {
        const maintenanceData = {
            stats: {
                activeRequests: 12,
                weeklyCompleted: 5,
                urgentRequests: 2,
                availableTechnicians: 4
            },
            requests: [
                {
                    id: 'MT-0015',
                    property: 'عمارة الربيع',
                    unit: 'الوحدة 101',
                    type: 'سباكة',
                    priority: 'urgent',
                    date: '2023-11-20',
                    status: 'pending_assignment',
                    description: 'تسرب ماء في الحمام'
                },
                {
                    id: 'MT-0014',
                    property: 'فيلا النخيل',
                    unit: 'الفيلا الرئيسية',
                    type: 'كهرباء',
                    priority: 'medium',
                    date: '2023-11-18',
                    status: 'in_progress',
                    technician: 'محمد أحمد',
                    description: 'أضواء لا تعمل في الصالة'
                }
            ],
            technicians: [
                {
                    id: 1,
                    name: 'محمد أحمد',
                    specialty: 'كهرباء وسباكة',
                    status: 'available',
                    currentJobs: 2
                },
                {
                    id: 2,
                    name: 'خالد إبراهيم',
                    specialty: 'دهان وتصليحات عامة',
                    status: 'available',
                    currentJobs: 1
                }
            ],
            schedule: [
                {
                    id: 'SCH-0042',
                    requestId: 'MT-0014',
                    technician: 'محمد أحمد',
                    property: 'فيلا النخيل',
                    date: '2023-11-25',
                    time: '10:00 ص',
                    duration: '2 ساعات'
                }
            ]
        };
        
        this.renderMaintenanceData(maintenanceData);
    },
    
    renderMaintenanceData: function(data) {
        this.renderRequests(data.requests);
        this.renderTechnicians(data.technicians);
        this.renderSchedule(data.schedule);
    },
    
    renderRequests: function(requests) {
        const tbody = document.querySelector('#maintenance-requests-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = requests.map(request => `
            <tr>
                <td>${request.id}</td>
                <td>${request.property}</td>
                <td>${request.unit || ''}</td>
                <td>${request.type}</td>
                <td><span class="status-badge status-${request.priority}">${this.getPriorityText(request.priority)}</span></td>
                <td>${app.formatDate(request.date)}</td>
                <td><span class="status-badge status-${request.status}">${this.getStatusText(request.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm view-request" data-request-id="${request.id}">عرض</button>
                    ${request.status === 'pending_assignment' ? 
                        '<button class="btn btn-primary btn-sm assign-technician" data-request-id="' + request.id + '">تعيين</button>' : 
                        '<button class="btn btn-success btn-sm update-status" data-request-id="' + request.id + '">تحديث</button>'
                    }
                </td>
            </tr>
        `).join('');
    },
    
    renderTechnicians: function(technicians) {
        const tbody = document.querySelector('#technicians-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = technicians.map(tech => `
            <tr>
                <td>${tech.name}</td>
                <td>${tech.specialty}</td>
                <td><span class="status-badge status-${tech.status}">${this.getStatusText(tech.status)}</span></td>
                <td>${tech.currentJobs}</td>
                <td>
                    <button class="btn btn-outline btn-sm">تفاصيل</button>
                    <button class="btn btn-primary btn-sm">جدولة</button>
                </td>
            </tr>
        `).join('');
    },
    
    renderSchedule: function(schedule) {
        const tbody = document.querySelector('#schedule-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = schedule.map(item => `
            <tr>
                <td>${item.requestId}</td>
                <td>${item.technician}</td>
                <td>${item.property}</td>
                <td>${app.formatDate(item.date)}</td>
                <td>${item.time}</td>
                <td>${item.duration}</td>
                <td>
                    <button class="btn btn-outline btn-sm">عرض</button>
                    <button class="btn btn-warning btn-sm">تعديل</button>
                </td>
            </tr>
        `).join('');
    },
    
    assignTechnician: function(requestId) {
        console.log('Assigning technician to request:', requestId);
        // عرض نموذج تعيين فني
        this.showAssignTechnicianModal(requestId);
    },
    
    updateStatus: function(requestId) {
        console.log('Updating status for request:', requestId);
        // عرض نموذج تحديث الحالة
        this.showUpdateStatusModal(requestId);
    },
    
    viewRequest: function(requestId) {
        console.log('Viewing maintenance request:', requestId);
        // عرض تفاصيل طلب الصيانة
    },
    
    showAssignTechnicianModal: function(requestId) {
        // تنفيذ عرض نموذج تعيين الفني
        alert(`تعيين فني لطلب الصيانة ${requestId}`);
    },
    
    showUpdateStatusModal: function(requestId) {
        // تنفيذ عرض نموذج تحديث الحالة
        alert(`تحديث حالة طلب الصيانة ${requestId}`);
    },
    
    getPriorityText: function(priority) {
        const priorityMap = {
            'urgent': 'عاجل',
            'high': 'مرتفع',
            'medium': 'متوسط',
            'low': 'منخفض'
        };
        return priorityMap[priority] || priority;
    },
    
    getStatusText: function(status) {
        const statusMap = {
            'pending_assignment': 'بانتظار التعيين',
            'assigned': 'تم التعيين',
            'in_progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'cancelled': 'ملغي',
            'available': 'متاح',
            'busy': 'مشغول'
        };
        return statusMap[status] || status;
    }
};