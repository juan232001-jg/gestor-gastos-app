<template>
    <div class="dashboard-container">
        <!-- Background Animations (Consistent with Gastos.vue) -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse">
            </div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                style="animation-delay: 1s"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                style="animation-delay: 2s"></div>
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto">
            <h1 class="text-3xl font-bold text-white mb-2 tracking-tight pl-2">Panel Principal</h1>
            <p class="text-purple-200 text-sm mb-8 pl-2">Resumen de tu actividad financiera</p>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Balance Card -->
                <div class="stat-card group">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-white/60 text-sm font-medium mb-1">Balance Total</p>
                            <h3 class="text-2xl font-bold text-white">{{ formatCurrency(totalBalance) }}</h3>
                        </div>
                        <div
                            class="p-3 rounded-xl bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/30 transition-colors">
                            <span class="text-2xl">💰</span>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span class="trend-badge bg-emerald-500/20 text-emerald-300">
                            {{ balanceTrend >= 0 ? '↗' : '↘' }} {{ Math.abs(balanceTrend) }}%
                        </span>
                        <span class="text-white/40 ml-2">vs mes anterior</span>
                    </div>
                </div>

                <!-- Expenses Card -->
                <div class="stat-card group">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-white/60 text-sm font-medium mb-1">Gastos del Mes</p>
                            <h3 class="text-2xl font-bold text-white">{{ formatCurrency(monthExpenses) }}</h3>
                        </div>
                        <div
                            class="p-3 rounded-xl bg-red-500/20 text-red-300 group-hover:bg-red-500/30 transition-colors">
                            <span class="text-2xl">💸</span>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span class="trend-badge"
                            :class="expensesTrend > 0 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'">
                            {{ expensesTrend >= 0 ? '↗' : '↘' }} {{ Math.abs(expensesTrend) }}%
                        </span>
                        <span class="text-white/40 ml-2">vs mes anterior</span>
                    </div>
                </div>

                <!-- Budget Remaining Card -->
                <div class="stat-card group">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-white/60 text-sm font-medium mb-1">Presupuesto Restante</p>
                            <h3 class="text-2xl font-bold text-white">{{ formatCurrency(budgetRemaining) }}</h3>
                        </div>
                        <div
                            class="p-3 rounded-xl bg-amber-500/20 text-amber-300 group-hover:bg-amber-500/30 transition-colors">
                            <span class="text-2xl">🎯</span>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="w-full bg-white/10 rounded-full h-2 mb-2">
                            <div class="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                :style="{ width: `${Math.min(budgetPercentage, 100)}%` }"></div>
                        </div>
                        <p class="text-xs text-white/50 text-right">{{ budgetPercentage }}% disponible</p>
                    </div>
                </div>

                <!-- Savings Card -->
                <div class="stat-card group">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-white/60 text-sm font-medium mb-1">Ahorro Estimado</p>
                            <h3 class="text-2xl font-bold text-white">{{ formatCurrency(savings) }}</h3>
                        </div>
                        <div
                            class="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500/30 transition-colors">
                            <span class="text-2xl">🏦</span>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span class="trend-badge bg-emerald-500/20 text-emerald-300">
                            {{ savingsTrend >= 0 ? '↗' : '↘' }} {{ Math.abs(savingsTrend) }}%
                        </span>
                        <span class="text-white/40 ml-2">vs mes anterior</span>
                    </div>
                </div>
            </div>

            <!-- Charts & Transactions Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <!-- Charts Section (Span 2 cols) -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Trend Chart -->
                    <div class="glass-panel p-6">
                        <h3 class="text-lg font-semibold text-white mb-6">Tendencia Mensual</h3>
                        <div class="h-64">
                            <canvas ref="trendChart"></canvas>
                        </div>
                    </div>

                    <!-- Category Chart -->
                    <div class="glass-panel p-6">
                        <h3 class="text-lg font-semibold text-white mb-6">Gastos por Categoría</h3>
                        <div class="h-64">
                            <canvas ref="categoryChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Recent Transactions (Span 1 col) -->
                <div class="glass-panel p-6 h-fit">
                    <h3 class="text-lg font-semibold text-white mb-6">Transacciones Recientes</h3>

                    <div v-if="recentTransactions.length === 0"
                        class="flex flex-col items-center justify-center py-10 text-white/40">
                        <div class="text-4xl mb-2">📋</div>
                        <p>Sin movimientos</p>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="t in recentTransactions" :key="t.id"
                            class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">

                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 flex items-center justify-center text-lg">
                                    {{ getCategoryIcon(t.category) }}
                                </div>
                                <div>
                                    <h4
                                        class="text-white font-medium text-sm group-hover:text-fuchsia-300 transition-colors">
                                        {{ t.description }}</h4>
                                    <p class="text-white/40 text-xs">{{ t.category }} • {{ formatDate(t.date) }}</p>
                                </div>
                            </div>

                            <div class="font-bold text-red-400">
                                {{ formatCurrency(t.amount) }}
                            </div>
                        </div>
                    </div>

                    <button @click="$router.push('/gastos')"
                        class="w-full mt-6 py-2 text-sm text-center text-fuchsia-300 hover:text-white transition-colors border-t border-white/10 pt-4">
                        Ver todas las transacciones →
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import Chart from 'chart.js/auto';
import { obtenerGastos } from '../api/gastos';
import presupuestoService from '../api/presupuestos';
import categoryService from '../api/categorias';

export default {
    name: 'Dashboard',
    setup() {
        const categoryChart = ref(null);
        const trendChart = ref(null);
        const loading = ref(true);

        // State for real data
        const gastos = ref([]);
        const presupuestos = ref([]);
        const categorias = ref([]);

        // Statistics
        const totalBalance = ref(0);
        const monthExpenses = ref(0);
        const budgetRemaining = ref(0);
        const savings = ref(0);

        // Trends
        const balanceTrend = ref(0);
        const expensesTrend = ref(0);
        const savingsTrend = ref(0);

        const recentTransactions = ref([]);

        let categoryChartInstance = null;
        let trendChartInstance = null;

        const budgetPercentage = computed(() => {
            if (activeBudget.value === 0) return 0;
            return ((budgetRemaining.value / activeBudget.value) * 100).toFixed(0);
        });

        const activeBudget = computed(() => {
            const now = new Date();
            return presupuestos.value
                .filter(p => {
                    const start = new Date(p.fecha_inicio);
                    const end = new Date(p.fecha_fin);
                    return now >= start && now <= end;
                })
                .reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);
        });

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(Math.abs(value));
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('es-CO', { month: 'short', day: 'numeric' }).format(date);
        };

        const getCategoryIcon = (categoryName) => {
            const icons = {
                'Alimentación': '🍕', 'Comida': '🍔', 'Transporte': '🚗', 'Gasolina': '⛽',
                'Entretenimiento': '🎮', 'Cine': '🎬', 'Servicios': '💡', 'Agua': '💧',
                'Luz': '⚡', 'Salud': '🏥', 'Farmacia': '💊', 'Educación': '📚',
                'Hogar': '🏠', 'Arriendo': '🔑', 'Ropa': '👕', 'Ingreso': '💰',
                'Salario': '💵', 'Otros': '📦', 'Varios': '🎲'
            };
            for (const [key, icon] of Object.entries(icons)) {
                if (categoryName && categoryName.includes(key)) return icon;
            }
            return '📊';
        };

        const loadData = async () => {
            try {
                const [gastosRes, presupuestosRes, categoriasRes] = await Promise.all([
                    obtenerGastos(),
                    presupuestoService.getAll(),
                    categoryService.getAll()
                ]);

                // Normalize data
                gastos.value = gastosRes.data.gastos || gastosRes.data || [];
                presupuestos.value = presupuestosRes.data.presupuestos || presupuestosRes.data || [];
                categorias.value = categoriasRes.data.categorias || categoriasRes.data || [];

                calculateStats();
                initCharts();

            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                loading.value = false;
            }
        };

        const calculateStats = () => {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // 1. Month Expenses
            const thisMonthExpenses = gastos.value.filter(g => {
                const d = new Date(g.fecha_gasto);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });
            monthExpenses.value = thisMonthExpenses.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

            // 2. Budget Remaining & Savings
            budgetRemaining.value = activeBudget.value - monthExpenses.value;
            savings.value = budgetRemaining.value;

            // 3. Total Balance
            totalBalance.value = activeBudget.value; // Using Active Budget as fund source

            // 4. Trends
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthParams = { month: lastMonthDate.getMonth(), year: lastMonthDate.getFullYear() };

            const lastMonthExpensesList = gastos.value.filter(g => {
                const d = new Date(g.fecha_gasto);
                return d.getMonth() === lastMonthParams.month && d.getFullYear() === lastMonthParams.year;
            });

            const lastMonthTotal = lastMonthExpensesList.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

            if (lastMonthTotal > 0) {
                expensesTrend.value = ((monthExpenses.value - lastMonthTotal) / lastMonthTotal) * 100;
            } else {
                expensesTrend.value = lastMonthExpensesList.length > 0 ? 100 : 0;
            }
            expensesTrend.value = Number(expensesTrend.value.toFixed(1));

            // 5. Recent Transactions
            const sortedGastos = [...gastos.value].sort((a, b) => new Date(b.fecha_gasto) - new Date(a.fecha_gasto));
            recentTransactions.value = sortedGastos.slice(0, 5).map(g => {
                const cat = categorias.value.find(c => c.id === g.categoria_id);
                return {
                    id: g.id,
                    description: g.descripcion,
                    amount: -(Number(g.monto) || 0),
                    category: cat ? cat.nombre : 'Sin categoría',
                    date: g.fecha_gasto
                };
            });
        };

        const initCharts = () => {
            if (categoryChartInstance) categoryChartInstance.destroy();
            if (trendChartInstance) trendChartInstance.destroy();

            // Colors
            const textColor = '#e2e8f0';
            const gridColor = 'rgba(255, 255, 255, 0.1)';

            // Category Data
            const expensesByCategory = {};
            gastos.value.forEach(g => {
                const cat = categorias.value.find(c => c.id === g.categoria_id);
                const catName = cat ? cat.nombre : 'Otros';
                expensesByCategory[catName] = (expensesByCategory[catName] || 0) + (Number(g.monto) || 0);
            });

            const bgColors = [
                'rgba(244, 114, 182, 0.8)', 'rgba(167, 139, 250, 0.8)', 'rgba(52, 211, 153, 0.8)',
                'rgba(96, 165, 250, 0.8)', 'rgba(251, 191, 36, 0.8)', 'rgba(239, 68, 68, 0.8)'
            ];

            if (categoryChart.value) {
                categoryChartInstance = new Chart(categoryChart.value, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(expensesByCategory),
                        datasets: [{
                            data: Object.values(expensesByCategory),
                            backgroundColor: bgColors,
                            borderColor: 'transparent',
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { color: textColor, font: { size: 11 } }
                            }
                        }
                    }
                });
            }

            // Trend Data
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const today = new Date();
            const labels = [];
            const dataExpenses = [];

            for (let i = 5; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                labels.push(monthNames[d.getMonth()]);

                const total = gastos.value.filter(g => {
                    const gDate = new Date(g.fecha_gasto);
                    return gDate.getMonth() === d.getMonth() && gDate.getFullYear() === d.getFullYear();
                }).reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

                dataExpenses.push(total);
            }

            if (trendChart.value) {
                const ctx = trendChart.value.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(167, 139, 250, 0.4)');
                gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');

                trendChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Gastos',
                            data: dataExpenses,
                            borderColor: '#a78bfa',
                            backgroundColor: gradient,
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#8b5cf6',
                            pointBorderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: { color: textColor }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: textColor }
                            }
                        }
                    }
                });
            }
        };

        onMounted(loadData);

        return {
            categoryChart, trendChart,
            totalBalance, monthExpenses, budgetRemaining, savings,
            balanceTrend, expensesTrend, savingsTrend, budgetPercentage,
            recentTransactions,
            formatCurrency, formatDate, getCategoryIcon
        };
    }
};
</script>

<style scoped>
.dashboard-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0720 0%, #1e1b4b 100%);
    padding: 2rem;
    position: relative;
    font-family: 'Inter', sans-serif;
}

.stat-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    padding: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.2);
}

.glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.trend-badge {
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

/* Scrollbar styling for recent transactions if needed */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}
</style>