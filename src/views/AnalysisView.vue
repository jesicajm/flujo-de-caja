<template>
  <div class="analysis-view">
    <h2>Análisis Financiero</h2>
    <div class="analysis-grid">
      <div class="analysis-card">
        <h3>Indicadores Principales</h3>
        <div class="indicator">
          <span class="label">Tasa de Ahorro</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${savingsRate}%` }"></div>
          </div>
          <span class="value">{{ savingsRate }}%</span>
        </div>
        <div class="indicator">
          <span class="label">Ratio Deuda/Ingreso</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${debtToIncomeRatio}%` }" :class="{ warning: debtToIncomeRatio > 30 }"></div>
          </div>
          <span class="value">{{ debtToIncomeRatio }}%</span>
        </div>
        <div class="indicator">
          <span class="label">Gastos Fijos/Ingresos</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${fixedExpensesRatio}%` }" :class="{ warning: fixedExpensesRatio > 50 }"></div>
          </div>
          <span class="value">{{ fixedExpensesRatio }}%</span>
        </div>
      </div>

      <div class="analysis-card">
        <h3>Score de Salud Financiera</h3>
        <div class="score-container">
          <div class="score" :class="scoreClass">
            {{ financialScore }}
          </div>
          <p class="score-label">{{ scoreLabel }}</p>
        </div>
      </div>

      <div class="analysis-card">
        <h3>Recomendaciones</h3>
        <ul class="recommendations">
          <li v-if="savingsRate < 20">
            Intenta aumentar tu tasa de ahorro al 20% de tus ingresos
          </li>
          <li v-if="debtToIncomeRatio > 30">
            Tu ratio de deuda es alto. Considera reducir tus deudas
          </li>
          <li v-if="fixedExpensesRatio > 50">
            Los gastos fijos son elevados. Busca formas de reducirlos
          </li>
          <li v-if="netCashFlow < 0">
            Tu flujo de caja es negativo. Revisa tus gastos y busca aumentar ingresos
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FinancialAnalysisView',
  computed: {
    ...mapGetters([
      'netCashFlow',
      'savingsRate',
      'debtToIncomeRatio',
      'fixedExpensesRatio',
      'financialScore'
    ]),
    scoreClass() {
      const score = this.calculateFinancialScore()
      if (score >= 80) return 'excellent'
      if (score >= 60) return 'good'
      if (score >= 40) return 'fair'
      return 'poor'
    },
    scoreLabel() {
      const score = this.calculateFinancialScore()
      if (score >= 80) return 'Excelente'
      if (score >= 60) return 'Bueno'
      if (score >= 40) return 'Regular'
      return 'Necesita Mejorar'
    }
  },
  methods: {
    calculateFinancialScore() {
      let score = 100

      // Penalización por baja tasa de ahorro
      if (this.savingsRate < 20) {
        score -= (20 - this.savingsRate) * 2
      }

      // Penalización por alto ratio de deuda
      if (this.debtToIncomeRatio > 30) {
        score -= (this.debtToIncomeRatio - 30) * 1.5
      }

      // Penalización por altos gastos fijos
      if (this.fixedExpensesRatio > 50) {
        score -= (this.fixedExpensesRatio - 50)
      }

      // Penalización por flujo de caja negativo
      if (this.netCashFlow < 0) {
        score -= 20
      }

      return Math.max(0, Math.min(100, Math.round(score)))
    }
  }
}
</script>

<style scoped>
.analysis-view {
  padding: 1rem;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.analysis-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.indicator {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-size: 0.9rem;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress.warning {
  background: #f57c00;
}

.value {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.score-container {
  text-align: center;
  padding: 1.5rem 0;
}

.score {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.score.excellent { color: #2e7d32; }
.score.good { color: #1976d2; }
.score.fair { color: #f57c00; }
.score.poor { color: #c62828; }

.score-label {
  font-size: 1.1rem;
  color: var(--text-color);
}

.recommendations {
  list-style: none;
  padding: 0;
}

.recommendations li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.95rem;
  line-height: 1.4;
}

.recommendations li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

@media (max-width: 480px) {
  .analysis-view {
    padding: 0.5rem;
  }

  .analysis-card {
    padding: 1rem;
  }

  .score {
    font-size: 3rem;
  }

  .score-label {
    font-size: 1rem;
  }

  .recommendations li {
    font-size: 0.9rem;
    padding-left: 1.2rem;
  }
}
</style> 