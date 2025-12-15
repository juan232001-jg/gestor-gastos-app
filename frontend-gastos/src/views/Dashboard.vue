<template>
    <div class="dashboard-container">
        <!-- Header con estadísticas principales -->
        <div class="stats-grid">
            <!-- Stat Card 1 -->
            <div class="stat-card stat-card--primary">
                <div class="stat-card__header">
                    <span class="stat-card__icon">💰</span>
                    <span class="stat-card__title">Balance Total</span>
                </div>
                <div class="stat-card__value">{{ formatCurrency(totalBalance) }}</div>
                <div class="stat-card__footer">
                    <div class="stat-card__trend trend--positive">
                        <span class="trend-icon">↗</span>
                        <span class="trend-text">{{ Math.abs(balanceTrend) }}%</span>
                        <span class="trend-label">vs mes anterior</span>
                    </div>
                </div>
            </div>

            <!-- Stat Card 2 -->
            <div class="stat-card stat-card--danger">
                <div class="stat-card__header">
                    <span class="stat-card__icon">💸</span>
                    <span class="stat-card__title">Gastos del Mes</span>
                </div>
                <div class="stat-card__value">{{ formatCurrency(monthExpenses) }}</div>
                <div class="stat-card__footer">
                    <div class="stat-card__trend trend--negative">
                        <span class="trend-icon">↘</span>
                        <span class="trend-text">{{ Math.abs(expensesTrend) }}%</span>
                        <span class="trend-label">vs mes anterior</span>
                    </div>
                </div>
            </div>

            <!-- Stat Card 3 -->
            <div class="stat-card stat-card--warning">
                <div class="stat-card__header">
                    <span class="stat-card__icon">🎯</span>
                    <span class="stat-card__title">Presupuesto Restante</span>
                </div>
                <div class="stat-card__value">{{ formatCurrency(budgetRemaining) }}</div>
                <div class="stat-card__footer">
                    <div class="stat-card__progress">
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: `${budgetPercentage}%` }"></div>
                        </div>
                        <span class="progress-text">{{ budgetPercentage }}% del presupuesto</span>
                    </div>
                </div>
            </div>

            <!-- Stat Card 4 -->
            <div class="stat-card stat-card--success">
                <div class="stat-card__header">
                    <span class="stat-card__icon">🏦</span>
                    <span class="stat-card__title">Ahorro</span>
                </div>
                <div class="stat-card__value">{{ formatCurrency(savings) }}</div>
                <div class="stat-card__footer">
                    <div class="stat-card__trend trend--positive">
                        <span class="trend-icon">↗</span>
                        <span class="trend-text">{{ Math.abs(savingsTrend) }}%</span>
                        <span class="trend-label">vs mes anterior</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráficas principales -->
        <div class="charts-grid">
            <!-- Gráfica de gastos por categoría -->
            <div class="chart-card">
                <h3>Gastos por Categoría</h3>
                <canvas ref="categoryChart"></canvas>
            </div>

            <!-- Gráfica de tendencia mensual -->
            <div class="chart-card">
                <h3>Tendencia Mensual</h3>
                <canvas ref="trendChart"></canvas>
            </div>
        </div>

        <!-- Últimas transacciones -->
        <div class="recent-transactions">
            <h3>Transacciones Recientes</h3>

            <div v-if="recentTransactions.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No hay transacciones recientes</p>
            </div>

            <div v-else class="transactions">
                <div v-for="transaction in recentTransactions" :key="transaction.id" class="transaction-item"
                    :class="{ 'transaction-income': transaction.amount > 0 }">
                    <div class="transaction-icon">
                        {{ getCategoryIcon(transaction.category) }}
                    </div>

                    <div class="transaction-details">
                        <h4 class="transaction-description">{{ transaction.description }}</h4>
                        <div class="transaction-meta">
                            <span class="transaction-category">{{ transaction.category }}</span>
                            <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
                        </div>
                    </div>

                    <div class="transaction-amount" :class="amountClass(transaction.amount)">
                        {{ formatCurrency(transaction.amount) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'Dashboard',
    setup() {
        const categoryChart = ref(null);
        const trendChart = ref(null);

        // Datos de ejemplo - reemplazar con API
        const totalBalance = ref(5420500);
        const monthExpenses = ref(2340750);
        const budgetRemaining = ref(1659250);
        const savings = ref(3079750);

        const balanceTrend = ref(12.5);
        const expensesTrend = ref(-8.3);
        const savingsTrend = ref(15.2);

        const budgetPercentage = computed(() => {
            return ((budgetRemaining.value / 4000000) * 100).toFixed(1);
        });

        const recentTransactions = ref([
            { id: 1, description: 'Supermercado Éxito', amount: -85500, category: 'Alimentación', date: '2024-12-08' },
            { id: 2, description: 'Salario Mensual', amount: 2500000, category: 'Ingreso', date: '2024-12-05' },
            { id: 3, description: 'Netflix Suscripción', amount: -45000, category: 'Entretenimiento', date: '2024-12-03' },
            { id: 4, description: 'Gasolina Terpel', amount: -120000, category: 'Transporte', date: '2024-12-02' },
        ]);

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(Math.abs(value));
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            today.setHours(0, 0, 0, 0);
            yesterday.setHours(0, 0, 0, 0);
            date.setHours(0, 0, 0, 0);

            if (date.getTime() === today.getTime()) {
                return 'Hoy';
            } else if (date.getTime() === yesterday.getTime()) {
                return 'Ayer';
            } else {
                return new Intl.DateTimeFormat('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).format(new Date(dateString));
            }
        };

        const amountClass = (amount) => {
            return amount >= 0 ? 'amount-positive' : 'amount-negative';
        };

        const getCategoryIcon = (category) => {
            const icons = {
                'Alimentación': '🍕',
                'Transporte': '🚗',
                'Entretenimiento': '🎮',
                'Servicios': '💡',
                'Salud': '🏥',
                'Educación': '📚',
                'Hogar': '🏠',
                'Ropa': '👕',
                'Ingreso': '💰',
                'Otros': '📦'
            };
            return icons[category] || '📊';
        };

        const initCharts = () => {
            // Gráfica de categorías (Doughnut)
            if (categoryChart.value) {
                const ctxCategory = categoryChart.value.getContext('2d');
                new Chart(ctxCategory, {
                    type: 'doughnut',
                    data: {
                        labels: ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Otros'],
                        datasets: [{
                            data: [450000, 280000, 190000, 320000, 180000],
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }

            // Gráfica de tendencia (Line)
            if (trendChart.value) {
                const ctxTrend = trendChart.value.getContext('2d');
                new Chart(ctxTrend, {
                    type: 'line',
                    data: {
                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                        datasets: [
                            {
                                label: 'Ingresos',
                                data: [2500000, 2500000, 2700000, 2500000, 2800000, 2500000, 2600000, 2500000, 2700000, 2500000, 2900000, 2500000],
                                borderColor: '#10B981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                tension: 0.4,
                                fill: true
                            },
                            {
                                label: 'Gastos',
                                data: [1800000, 2100000, 1950000, 2200000, 1900000, 2300000, 2100000, 1950000, 2000000, 2150000, 1850000, 2340000],
                                borderColor: '#EF4444',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                tension: 0.4,
                                fill: true
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        };

        onMounted(() => {
            initCharts();
        });

        return {
            categoryChart,
            trendChart,
            totalBalance,
            monthExpenses,
            budgetRemaining,
            savings,
            balanceTrend,
            expensesTrend,
            savingsTrend,
            budgetPercentage,
            recentTransactions,
            formatCurrency,
            formatDate,
            amountClass,
            getCategoryIcon
        };
    }
};
</script>

<style scoped>
.dashboard-container {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    background: #F9FAFB;
    min-height: 100vh;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

/* Stat Cards */
.stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-card--primary {
    --card-color: #3B82F6;
    --card-color-light: #60A5FA;
}

.stat-card--success {
    --card-color: #10B981;
    --card-color-light: #34D399;
}

.stat-card--danger {
    --card-color: #EF4444;
    --card-color-light: #F87171;
}

.stat-card--warning {
    --card-color: #F59E0B;
    --card-color-light: #FBBF24;
}

.stat-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.stat-card__icon {
    font-size: 2rem;
    line-height: 1;
}

.stat-card__title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stat-card__value {
    font-size: 2rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 1rem;
    line-height: 1;
}

.stat-card__trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    width: fit-content;
}

.trend--positive {
    background: #D1FAE5;
    color: #065F46;
}

.trend--negative {
    background: #FEE2E2;
    color: #991B1B;
}

.trend-icon {
    font-size: 1rem;
    font-weight: 700;
}

.trend-text {
    font-weight: 600;
}

.trend-label {
    color: #6B7280;
    font-size: 0.75rem;
    margin-left: 0.25rem;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #E5E7EB;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
    border-radius: 4px;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.75rem;
    color: #6B7280;
}

/* Charts */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.chart-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: 400px;
}

.chart-card h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1F2937;
}

.chart-card canvas {
    max-height: 320px;
}

/* Transactions */
.recent-transactions {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-transactions h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1F2937;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6B7280;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.transactions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.transaction-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    transition: all 0.2s;
}

.transaction-item:hover {
    border-color: #D1D5DB;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transform: translateX(4px);
}

.transaction-item.transaction-income {
    background: linear-gradient(to right, #ECFDF5 0%, white 20%);
    border-left: 3px solid #10B981;
}

.transaction-icon {
    font-size: 2rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F3F4F6;
    border-radius: 12px;
}

.transaction-details {
    flex: 1;
    min-width: 0;
}

.transaction-description {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1F2937;
}

.transaction-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #6B7280;
}

.transaction-category {
    padding: 0.125rem 0.5rem;
    background: #F3F4F6;
    border-radius: 4px;
    font-size: 0.75rem;
}

.transaction-date {
    font-size: 0.75rem;
}

.transaction-amount {
    font-size: 1.25rem;
    font-weight: 700;
    white-space: nowrap;
}

.amount-positive {
    color: #10B981;
}

.amount-negative {
    color: #EF4444;
}

@media (max-width: 768px) {
    .dashboard-container {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .charts-grid {
        grid-template-columns: 1fr;
    }

    .stat-card__value {
        font-size: 1.5rem;
    }

    .transaction-item {
        grid-template-columns: auto 1fr;
        gap: 0.75rem;
    }

    .transaction-amount {
        grid-column: 2;
        text-align: right;
        font-size: 1rem;
    }
}
</style>