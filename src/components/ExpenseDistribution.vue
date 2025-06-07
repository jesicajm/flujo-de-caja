<template>
  <div class="expense-distribution">
    <h2>Distribución de Gastos</h2>
    <div class="distribution-grid">
      <div class="distribution-item">
        <h3>Gastos Fijos</h3>
        <div class="chart-container">
          <div class="percentage">{{ fixedExpensesPercentage }}%</div>
          <div class="amount">{{ formatCurrency(fixedExpenses) }}</div>
        </div>
      </div>
      <div class="distribution-item">
        <h3>Gastos Variables</h3>
        <div class="chart-container">
          <div class="percentage">{{ variableExpensesPercentage }}%</div>
          <div class="amount">{{ formatCurrency(variableExpenses) }}</div>
        </div>
      </div>
      <div class="distribution-item">
        <h3>Deudas</h3>
        <div class="chart-container">
          <div class="percentage">{{ debtsPercentage }}%</div>
          <div class="amount">{{ formatCurrency(debts) }}</div>
        </div>
      </div>
      <div class="distribution-item">
        <h3>Ahorros/Inversiones</h3>
        <div class="chart-container">
          <div class="percentage">{{ savingsPercentage }}%</div>
          <div class="amount">{{ formatCurrency(savings) }}</div>
        </div>
      </div>
    </div>
    <div class="pie-chart">
      <!-- Aquí se agregará el gráfico circular usando una librería de gráficos -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpenseDistribution',
  data() {
    return {
      fixedExpenses: 0,
      variableExpenses: 0,
      debts: 0,
      savings: 0
    }
  },
  computed: {
    total() {
      return this.fixedExpenses + this.variableExpenses + this.debts + this.savings
    },
    fixedExpensesPercentage() {
      return this.calculatePercentage(this.fixedExpenses)
    },
    variableExpensesPercentage() {
      return this.calculatePercentage(this.variableExpenses)
    },
    debtsPercentage() {
      return this.calculatePercentage(this.debts)
    },
    savingsPercentage() {
      return this.calculatePercentage(this.savings)
    }
  },
  methods: {
    calculatePercentage(value) {
      return this.total === 0 ? 0 : Math.round((value / this.total) * 100)
    },
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
.expense-distribution {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.distribution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.distribution-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.chart-container {
  margin-top: 15px;
}

.percentage {
  font-size: 2em;
  font-weight: bold;
  color: #1976d2;
}

.amount {
  margin-top: 5px;
  color: #666;
}

.pie-chart {
  margin-top: 30px;
  height: 300px;
  /* Se configurará con la librería de gráficos elegida */
}
</style> 