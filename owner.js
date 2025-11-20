// لوحة تحكم مالك العقار
const ownerDashboard = {
    init: function() {
        dashboard.init('owner');
        this.setupOwnerSpecificEvents();
        this.loadOwnerData();
    },
    
    setupOwnerSpecificEvents: function() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-property')) {
                ownerDashboard.showAddPropertyModal();
            }
            
            if (e.target.classList.contains('view-property')) {
                ownerDashboard.viewProperty(e.target.dataset.propertyId);
            }
            
            if (e.target.classList.contains('approve-maintenance')) {
                ownerDashboard.approveMaintenance(e.target.dataset.requestId);
            }
        });
        
        // نموذج إضافة عقار
        const addPropertyForm = document.getElementById('add-property-form');
        if (addPropertyForm) {
            addPropertyForm.addEventListener('submit', function(e) {
                e.preventDefault();
                ownerDashboard.addProperty();
            });
        }
    },
    
    loadOwnerData: function() {
        const ownerData = {
            stats: {
                properties: 8,
                occupancyRate: 92,
                monthlyIncome: 45200,
                newMaintenance: 3
            },
            properties: [
                {
                    id: 1,
                    name: 'عمارة الربيع',
                    location: 'حي الربيع، الرياض',
                    units: 12,
                    occupied: 10,
                    monthlyRent: 120000,
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'فيلا النخيل',
                    location: 'حي النخيل، جدة',
                    units: 1,
                    occupied: 1,
                    monthlyRent: 8000,
                    status: 'active'
                }
            ],
            maintenanceRequests: [
                {
                    id: 'MT-0015',
                    property: 'عمارة الربيع',
                    type: 'سباكة',
                    date: '2023-11-20',
                    status: 'pending'
                },
                {
                    id: 'MT-0014',
                    property: 'فيلا النخيل',
                    type: 'كهرباء',
                    date: '2023-11-18',
                    status: 'in_progress'
                }
            ],
            contracts: [
                {
                    id: 'CNT-0042',
                    property: 'عمارة الربيع - الوحدة 101',
                    tenant: 'أحمد محمد',
                    startDate: '2023-06-01',
                    endDate: '2024-05-31',
                    rent: 2400,
                    status: 'active'
                }
            ]
        };
        
        this.renderOwnerData(ownerData);
    },
    
    renderOwnerData: function(data) {
        this.renderProperties(data.properties);
        this.renderMaintenanceRequests(data.maintenanceRequests);
        this.renderContracts(data.contracts);
    },
    
    renderProperties: function(properties) {
        const tbody = document.querySelector('#properties-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = properties.map(property => `
            <tr>
                <td><div class="property-image">🏠</div></td>
                <td>${property.name}</td>
                <td>${property.location}</td>
                <td>${property.units}</td>
                <td>${property.occupied}/${property.units}</td>
                <td>${app.formatCurrency(property.monthlyRent)}</td>
                <td><span class="status-badge status-${property.status}">${this.getStatusText(property.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm view-property" data-property-id="${property.id}">عرض</button>
                    <button class="btn btn-primary btn-sm">تعديل</button>
                </td>
            </tr>
        `).join('');
    },
    
    renderMaintenanceRequests: function(requests) {
        const tbody = document.querySelector('#maintenance-requests-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = requests.map(request => `
            <tr>
                <td>${request.id}</td>
                <td>${request.property}</td>
                <td>${request.type}</td>
                <td>${app.formatDate(request.date)}</td>
                <td><span class="status-badge status-${request.status}">${this.getStatusText(request.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm">عرض</button>
                    ${request.status === 'pending' ? 
                        '<button class="btn btn-success btn-sm approve-maintenance" data-request-id="' + request.id + '">قبول</button>' : 
                        ''
                    }
                </td>
            </tr>
        `).join('');
    },
    
    renderContracts: function(contracts) {
        // تنفيذ مشابه
    },
    
    showAddPropertyModal: function() {
        app.showModal('add-property-modal');
    },
    
    addProperty: function() {
        const formData = {
            name: document.getElementById('property-name').value,
            type: document.getElementById('property-type').value,
            address: document.getElementById('property-address').value,
            city: document.getElementById('property-city').value,
            units: document.getElementById('property-units').value,
            rent: document.getElementById('property-rent').value,
            description: document.getElementById('property-description').value
        };
        
        console.log('Adding property:', formData);
        app.closeModal('add-property-modal');
        alert('تم إضافة العقار بنجاح!');
        
        // في التطبيق الحقيقي، إرسال البيانات للخادم
    },
    
    viewProperty: function(propertyId) {
        console.log('Viewing property:', propertyId);
        // عرض تفاصيل العقار
    },
    
    approveMaintenance: function(requestId) {
        console.log('Approving maintenance request:', requestId);
        alert('تم قبول طلب الصيانة');
        // في التطبيق الحقيقي، تحديث حالة الطلب في الخادم
    },
    
    getStatusText: function(status) {
        const statusMap = {
            'active': 'نشط',
            'pending': 'قيد المراجعة',
            'in_progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }
};