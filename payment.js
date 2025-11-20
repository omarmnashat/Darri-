// لوحة تحكم مسؤول الدفع
const paymentDashboard = {
    init: function() {
        dashboard.init('payment');
        this.setupPaymentSpecificEvents();
        this.loadPaymentData();
    },
    
    setupPaymentSpecificEvents: function() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('create-invoice')) {
                paymentDashboard.showCreateInvoiceModal();
            }
            
            if (e.target.classList.contains('confirm-payment')) {
                paymentDashboard.confirmPayment(e.target.dataset.paymentId);
            }
            
            if (e.target.classList.contains('send-reminder')) {
                paymentDashboard.sendReminder(e.target.dataset.invoiceId);
            }
        });
    },
    
    loadPaymentData: function() {
        const paymentData = {
            stats: {
                monthlyInvoices: 32,
                totalPayments: 28500,
                latePayments: 4,
                collectionRate: 89
            },
            invoices: [
                {
                    id: 'INV-0045',
                    tenant: 'أحمد محمد',
                    property: 'عمارة الربيع - الوحدة 101',
                    amount: 2400,
                    dueDate: '2023-12-05',
                    status: 'pending'
                },
                {
                    id: 'INV-0044',
                    tenant: 'سعيد عبدالله',
                    property: 'فيلا النخيل',
                    amount: 3200,
                    dueDate: '2023-12-01',
                    status: 'paid'
                }
            ],
            payments: [
                {
                    id: 'PAY-0078',
                    invoiceId: 'INV-0044',
                    tenant: 'سعيد عبدالله',
                    amount: 3200,
                    date: '2023-11-28',
                    method: 'تحويل بنكي',
                    status: 'confirmed'
                }
            ]
        };
        
        this.renderPaymentData(paymentData);
    },
    
    renderPaymentData: function(data) {
        this.renderInvoices(data.invoices);
        this.renderPayments(data.payments);
    },
    
    renderInvoices: function(invoices) {
        const tbody = document.querySelector('#invoices-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = invoices.map(invoice => `
            <tr>
                <td>${invoice.id}</td>
                <td>${invoice.tenant}</td>
                <td>${invoice.property}</td>
                <td>${app.formatCurrency(invoice.amount)}</td>
                <td>${app.formatDate(invoice.dueDate)}</td>
                <td><span class="status-badge status-${invoice.status}">${this.getStatusText(invoice.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm">عرض</button>
                    ${invoice.status === 'pending' ? 
                        '<button class="btn btn-primary btn-sm send-reminder" data-invoice-id="' + invoice.id + '">إشعار</button>' : 
                        ''
                    }
                </td>
            </tr>
        `).join('');
    },
    
    renderPayments: function(payments) {
        const tbody = document.querySelector('#payments-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td>${payment.id}</td>
                <td>${payment.invoiceId}</td>
                <td>${payment.tenant}</td>
                <td>${app.formatCurrency(payment.amount)}</td>
                <td>${app.formatDate(payment.date)}</td>
                <td>${payment.method}</td>
                <td><span class="status-badge status-${payment.status}">${this.getStatusText(payment.status)}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm">تفاصيل</button>
                    ${payment.status === 'pending' ? 
                        '<button class="btn btn-success btn-sm confirm-payment" data-payment-id="' + payment.id + '">تأكيد</button>' : 
                        ''
                    }
                </td>
            </tr>
        `).join('');
    },
    
    showCreateInvoiceModal: function() {
        app.showModal('create-invoice-modal');
    },
    
    confirmPayment: function(paymentId) {
        console.log('Confirming payment:', paymentId);
        alert('تم تأكيد الدفع بنجاح');
        // في التطبيق الحقيقي، تحديث حالة الدفع في الخادم
    },
    
    sendReminder: function(invoiceId) {
        console.log('Sending reminder for invoice:', invoiceId);
        alert('تم إرسال تذكير للمستأجر');
        // في التطبيق الحقيقي، إرسال إشعار للمستأجر
    },
    
    getStatusText: function(status) {
        const statusMap = {
            'pending': 'بانتظار الدفع',
            'paid': 'مدفوع',
            'overdue': 'متأخر',
            'confirmed': 'مؤكد',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }
};