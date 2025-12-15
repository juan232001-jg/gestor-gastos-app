<template>
    <div class="transaction-list">
        <div v-if="transactions.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <p>No hay transacciones recientes</p>
        </div>

        <div v-else class="transactions">
            <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item"
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

                <div class="transaction-actions">
                    <button class="action-btn action-btn-edit" @click="$emit('edit', transaction)" title="Editar">
                        ✏️
                    </button>
                    <button class="action-btn action-btn-delete" @click="$emit('delete', transaction)" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    name: 'TransactionList',
    props: {
        transactions: {
            type: Array,
            default: () => []
        }
    },
    emits: ['edit', 'delete'],
    setup() {
        const formatCurrency = (value) => {
            const absValue = Math.abs(value);
            const formatted = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(absValue);

            return value >= 0 ? `+${formatted}` : `-${formatted}`;
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // Resetear horas para comparación
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

        return {
            formatCurrency,
            formatDate,
            amountClass,
            getCategoryIcon
        };
    }
};
</script>

<style scoped>
.transaction-list {
    width: 100%;
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

.empty-state p {
    margin: 0;
    font-size: 1rem;
}

.transactions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.transaction-item {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

.transaction-actions {
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.transaction-item:hover .transaction-actions {
    opacity: 1;
}

.action-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #F3F4F6;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.action-btn:hover {
    transform: scale(1.1);
}

.action-btn-edit:hover {
    background: #DBEAFE;
}

.action-btn-delete:hover {
    background: #FEE2E2;
}

@media (max-width: 768px) {
    .transaction-item {
        grid-template-columns: auto 1fr auto;
        gap: 0.75rem;
    }

    .transaction-actions {
        opacity: 1;
        grid-column: 1 / -1;
        justify-content: flex-end;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #E5E7EB;
    }

    .transaction-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }

    .transaction-amount {
        font-size: 1rem;
    }
}
</style>
