<template>
  <div class="financial-analysis">
    <h2>Análisis Financiero</h2>
    <div class="analysis-grid">
      <div class="analysis-item">
        <h3>Tasa de Ahorro</h3>
        <div class="metric">
          <span class="value">{{ savingsRate }}%</span>
          <div class="progress-bar" :style="{ width: `${savingsRate}%` }"></div>
        </div>
      </div>
      <div class="analysis-item">
        <h3>Ratio Deuda/Ingreso</h3>
        <div class="metric">
          <span class="value">{{ debtToIncomeRatio }}%</span>
          <div class="progress-bar" :style="{ width: `${debtToIncomeRatio}%` }"></div>
        </div>
      </div>
      <div class="analysis-item">
        <h3>Gastos Fijos/Ingresos</h3>
        <div class="metric">
          <span class="value">{{ fixedExpensesRatio }}%</span>
          <div class="progress-bar" :style="{ width: `${fixedExpensesRatio}%` }"></div>
        </div>
      </div>
      <div class="analysis-item score">
        <h3>Score de Salud Financiera</h3>
        <div class="financial-score" :class="scoreClass">
          {{ financialScore }}
        </div>
        <p class="score-label">{{ scoreLabel }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinancialAnalysis',
  data() {
    return {
      savingsRate: 0,
      debtToIncomeRatio: 0,
      fixedExpensesRatio: 0,
      financialScore: 0
    }
  },
  computed: {
    scoreClass() {
      if (this.financialScore >= 80) return 'excellent'
      if (this.financialScore >= 60) return 'good'
      if (this.financialScore >= 40) return 'fair'
      return 'poor'
    },
    scoreLabel() {
      if (this.financialScore >= 80) return 'Excelente'
      if (this.financialScore >= 60) return 'Bueno'
      if (this.financialScore >= 40) return 'Regular'
      return 'Necesita Mejorar'
    }
  }
}
</script>

<style scoped>
.financial-analysis {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.analysis-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
}

.metric {
  position: relative;
  margin-top: 15px;
}

.value {
  font-size: 1.5em;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.progress-bar {
  height: 8px;
  background: #4caf50;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.score {
  text-align: center;
}

.financial-score {
  font-size: 3em;
  font-weight: bold;
  margin: 15px 0;
}

.excellent { color: #2e7d32; }
.good { color: #1976d2; }
.fair { color: #f57c00; }
.poor { color: #c62828; }

.score-label {
  font-size: 1.2em;
  margin-top: 10px;
}
</style> 