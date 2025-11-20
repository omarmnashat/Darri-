// لوحة تحكم المستأجر
const tenantDashboard = {
    init: function() {
        dashboard.init('tenant');
        this.setupTenantSpecificEvents();
        this.loadTenantData();
    },
    
    setupTenantSpecificEvents: function() {
        // أحداث خاصة بالمستأجر
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-contract')) {
                tenantDashboard.viewContract(e.target.dataset.contractId);
            }
            
            if (e.target.classList.contains('renew-contract')) {
                tenantDashboard.renewContract(e.target.dataset.contractId);
            }
            
            if (e.target.classList.contains('new-maintenance')) {
                tenantDashboard.showNewMaintenanceModal();
            }
        });
    },
    
    loadTenantData: function() {
        // جلب بيانات المستأجر
        const tenantData = {
            contracts: [
                {
                    id: 1,
                    property: 'فيلا - حي الربيع',
                    startDate: '2023-06-01',
                    endDate: '2024-05-31',
                    rent: 2400,
                    status: 'active'
                },
                {
                    id: 2,
                    property: 'شقة - حي النخيل',
                    startDate: '2023-09-01',
                    endDate: '2024-08-31',
                    rent: 1800,
                    status: 'active'
                }
            ],
            maintenanceRequests: [
                {
                    id: 'MT-0012',
                    type: 'صيانة تكييف',
                    date: '2023-11-15',
                    status: 'pending'
                },
                {
                    id: 'MT-0008',
                    type: 'تصليح سباكة',
                    date: '2023-11-05',
                    status: 'completed'
                }
            ],
            payments: [
                {
                    id: 'INV-0045',
                    amount: 2400,
                    dueDate: '2023-12-05',
                    status: 'pending'
                }
            ]
        };
        
        this.renderTenantData(tenantData);
    },
    
    renderTenantData: function(data) {
        this.renderContracts(data.contracts);
        this.renderMaintenanceRequests(data.maintenanceRequests);
        this.renderPayments(data.payments);
    },
    
    renderContracts: function(contracts) {
        const tbody = document.querySelector('#contracts-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = contracts.map(contract => `
            <tr>
                <td>${contract.property}</td>
                <td>${app.formatDate(contract.startDate)}</td>
                <td>${app.formatDate(contract.endDate)}</td>
                <td>${app.formatCurrency(contract.rent)}</td>
                <td><span class="status-badge status-${contract.status}">${this.getStatusText(contract.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm view-contract" data-contract-id="${contract.id}">عرض</button>
                    <button class="btn btn-primary btn-sm renew-contract" data-contract-id="${contract.id}">تجديد</button>
                </td>
            </tr>
        `).join('');
    },
    
    renderMaintenanceRequests: function(requests) {
        const tbody = document.querySelector('#maintenance-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = requests.map(request => `
            <tr>
                <td>${request.id}</td>
                <td>${request.type}</td>
                <td>${app.formatDate(request.date)}</td>
                <td><span class="status-badge status-${request.status}">${this.getStatusText(request.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm">تفاصيل</button>
                </td>
            </tr>
        `).join('');
    },
    
    renderPayments: function(payments) {
        // تنفيذ مشابه للوظائف السابقة
    },
    
    viewContract: function(contractId) {
        console.log('Viewing contract:', contractId);
        // عرض تفاصيل العقد
    },
    
    renewContract: function(contractId) {
        console.log('Renewing contract:', contractId);
        // تجديد العقد
    },
    
    showNewMaintenanceModal: function() {
        app.showModal('new-maintenance-modal');
    },
    
    getStatusText: function(status) {
        const statusMap = {
            'active': 'نشط',
            'pending': 'قيد المعالجة',
            'completed': 'مكتمل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }
};