async function initDashboard() {
    const response = await fetch('/api/reports/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const stats = await response.json();
    
    document.getElementById('stat-revenue').textContent = `฿${stats.totalRevenue.toLocaleString()}`;
    
    renderRevenueChart();
}

function renderRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [1200, 1900, 3000, 500, 2000, 3500, 4000],
                borderColor: '#22c55e',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(34, 197, 94, 0.1)'
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

document.addEventListener('DOMContentLoaded', initDashboard);