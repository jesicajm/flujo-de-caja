<template>
  <div class="cash-flow-summary">
    <h2>Resumen de Flujo de Caja</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <h3>Ingresos Totales</h3>
        <p class="amount">{{ formatCurrency(totalIncome) }}</p>
      </div>
      <div class="summary-item">
        <h3>Gastos Totales</h3>
        <p class="amount">{{ formatCurrency(totalExpenses) }}</p>
      </div>
      <div class="summary-item">
        <h3>Deudas Mensuales</h3>
        <p class="amount">{{ formatCurrency(monthlyDebts) }}</p>
      </div>
      <div class="summary-item">
        <h3>Ahorros/Inversiones</h3>
        <p class="amount">{{ formatCurrency(savings) }}</p>
      </div>
      <div class="summary-item highlight">
        <h3>Flujo de Caja Neto</h3>
        <p class="amount" :class="{ positive: netCashFlow > 0, negative: netCashFlow < 0 }">
          {{ formatCurrency(netCashFlow) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CashFlowSummary',
  data() {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      monthlyDebts: 0,
      savings: 0
    }
  },
  computed: {
    netCashFlow() {
      return this.totalIncome - this.totalExpenses - this.monthlyDebts - this.savings
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    }
  }
}
</script>

<style scoped>
.cash-flow-summary {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.summary-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.summary-item.highlight {
  background: #e3f2fd;
  grid-column: 1 / -1;
}

.amount {
  font-size: 1.5em;
  font-weight: bold;
  margin: 10px 0;
}

.positive {
  color: #2e7d32;
}

.negative {
  color: #c62828;
}
</style> 