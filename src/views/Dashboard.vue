<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Panel de Control Financiero</h2>
      <div class="financial-score">
        <div class="score-circle" :class="financialScoreClass">
          {{ financialScore }}
        </div>
        <div class="score-details">
          <h3>Puntuación Financiera</h3>
          <p>{{ financialScoreMessage }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h3>Resumen de Flujo de Caja</h3>
        <div class="summary-content">
          <div class="summary-item">
            <span class="label">Ingresos Totales</span>
            <span class="value">{{ formatCurrency(totalIncome) }}</span>
            <div class="progress-bar">
              <div class="progress income" style="width: 100%"></div>
            </div>
          </div>
          <div class="summary-item">
            <span class="label">Gastos Totales</span>
            <span class="value">{{ formatCurrency(totalExpenses) }}</span>
            <div class="progress-bar">
              <div class="progress expenses" :style="{ width: expensesPercentage + '%' }"></div>
            </div>
          </div>
          <div class="summary-item">
            <span class="label">Flujo de Caja Neto</span>
            <span class="value" :class="{ negative: netCashFlow < 0, positive: netCashFlow > 0 }">
              {{ formatCurrency(netCashFlow) }}
            </span>
            <div class="progress-bar">
              <div class="progress" :class="netCashFlowClass" :style="{ width: netCashFlowPercentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <h3>Análisis Financiero</h3>
        <div class="analysis-content">
          <div class="indicator">
            <div class="indicator-header">
              <span class="label">Tasa de Ahorro</span>
              <span class="value" :class="savingsRateClass">{{ savingsRate }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: `${savingsRate}%` }" :class="savingsRateClass"></div>
            </div>
            <span class="indicator-message">{{ savingsRateMessage }}</span>
          </div>
          <div class="indicator">
            <div class="indicator-header">
              <span class="label">Ratio Deuda/Ingreso</span>
              <span class="value" :class="debtRatioClass">{{ debtToIncomeRatio }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: `${debtToIncomeRatio}%` }" :class="debtRatioClass"></div>
            </div>
            <span class="indicator-message">{{ debtRatioMessage }}</span>
          </div>
          <div class="indicator">
            <div class="indicator-header">
              <span class="label">Ratio Gastos Fijos</span>
              <span class="value" :class="fixedExpensesRatioClass">{{ fixedExpensesRatio }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: `${fixedExpensesRatio}%` }" :class="fixedExpensesRatioClass"></div>
            </div>
            <span class="indicator-message">{{ fixedExpensesRatioMessage }}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <h3>Distribución de Gastos</h3>
        <div class="expenses-content">
          <div class="expense-item">
            <div class="expense-header">
              <span class="label">Gastos Fijos</span>
              <span class="value">{{ formatCurrency(totalFixedExpenses) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress fixed" :style="{ width: fixedExpensesPercentage + '%' }"></div>
            </div>
            <span class="percentage">{{ fixedExpensesPercentage }}% del total</span>
          </div>
          <div class="expense-item">
            <div class="expense-header">
              <span class="label">Gastos Variables</span>
              <span class="value">{{ formatCurrency(totalVariableExpenses) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress variable" :style="{ width: variableExpensesPercentage + '%' }"></div>
            </div>
            <span class="percentage">{{ variableExpensesPercentage }}% del total</span>
          </div>
          <div class="expense-item">
            <div class="expense-header">
              <span class="label">Pagos de Deudas</span>
              <span class="value">{{ formatCurrency(totalMonthlyDebtPayments) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress debt" :style="{ width: debtPaymentsPercentage + '%' }"></div>
            </div>
            <span class="percentage">{{ debtPaymentsPercentage }}% del total</span>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <h3>Objetivos y Progreso</h3>
        <div class="goals-content">
          <div class="goal-item">
            <div class="goal-header">
              <span class="label">Ahorro de Emergencia</span>
              <span class="value">{{ formatCurrency(emergencyFundSaved) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress emergency" :style="{ width: emergencyFundProgress + '%' }"></div>
            </div>
            <span class="goal-target">Meta: {{ formatCurrency(emergencyFundGoal) }}</span>
          </div>
          <div class="goal-item">
            <div class="goal-header">
              <span class="label">Inversiones</span>
              <span class="value">{{ formatCurrency(investmentsSaved) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress investment" :style="{ width: investmentsProgress + '%' }"></div>
            </div>
            <span class="goal-target">Meta: {{ formatCurrency(investmentsGoal) }}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-card recommendations-card">
        <h3>Recomendaciones Personalizadas</h3>
        <div class="recommendations-content">
          <div v-if="recommendations.length > 0" class="recommendations-list">
            <div v-for="(rec, index) in recommendations" :key="index" class="recommendation-item" :class="rec.type">
              <i :class="rec.icon"></i>
              <div class="recommendation-text">
                <h4>{{ rec.title }}</h4>
                <p>{{ rec.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-recommendations">
            <i class="fas fa-check-circle"></i>
            <p>¡Excelente! Tus finanzas están en buen estado.</p>
          </div>
        </div>
      </div>

      <div class="dashboard-card actions-card">
        <h3>Acciones Rápidas</h3>
        <div class="actions-grid">
          <button class="action-btn" @click="exportData">
            <i class="fas fa-download"></i>
            Exportar Datos
          </button>
          <button class="action-btn" @click="resetData">
            <i class="fas fa-redo"></i>
            Reiniciar Datos
          </button>
          <button class="action-btn" @click="generateReport">
            <i class="fas fa-file-pdf"></i>
            Generar Reporte
          </button>
          <button class="action-btn" @click="showTips">
            <i class="fas fa-lightbulb"></i>
            Consejos Financieros
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'DashboardView',
  computed: {
    ...mapState({
      financialData: state => state.financialData
    }),
    ...mapGetters([
      'totalIncome',
      'totalExpenses',
      'netCashFlow',
      'savingsRate',
      'debtToIncomeRatio',
      'fixedExpensesRatio',
      'totalFixedExpenses',
      'totalVariableExpenses',
      'totalMonthlyDebtPayments',
      'financialScore'
    ]),
    expensesPercentage() {
      return this.totalIncome ? Math.min(100, Math.round((this.totalExpenses / this.totalIncome) * 100)) : 0
    },
    netCashFlowPercentage() {
      return this.totalIncome ? Math.min(100, Math.round((Math.abs(this.netCashFlow) / this.totalIncome) * 100)) : 0
    },
    netCashFlowClass() {
      return this.netCashFlow >= 0 ? 'positive' : 'negative'
    },
    fixedExpensesPercentage() {
      const total = this.totalExpenses + this.totalMonthlyDebtPayments
      return total ? Math.round((this.totalFixedExpenses / total) * 100) : 0
    },
    variableExpensesPercentage() {
      const total = this.totalExpenses + this.totalMonthlyDebtPayments
      return total ? Math.round((this.totalVariableExpenses / total) * 100) : 0
    },
    debtPaymentsPercentage() {
      const total = this.totalExpenses + this.totalMonthlyDebtPayments
      return total ? Math.round((this.totalMonthlyDebtPayments / total) * 100) : 0
    },
    savingsRateClass() {
      if (this.savingsRate >= 20) return 'good'
      if (this.savingsRate >= 10) return 'warning'
      return 'poor'
    },
    savingsRateMessage() {
      if (this.savingsRate >= 20) return 'Excelente tasa de ahorro'
      if (this.savingsRate >= 10) return 'Tasa de ahorro moderada'
      return 'Necesitas aumentar tus ahorros'
    },
    debtRatioClass() {
      if (this.debtToIncomeRatio <= 30) return 'good'
      if (this.debtToIncomeRatio <= 40) return 'warning'
      return 'poor'
    },
    debtRatioMessage() {
      if (this.debtToIncomeRatio <= 30) return 'Nivel de deuda saludable'
      if (this.debtToIncomeRatio <= 40) return 'Nivel de deuda moderado'
      return 'Nivel de deuda alto'
    },
    fixedExpensesRatioClass() {
      if (this.fixedExpensesRatio <= 40) return 'good'
      if (this.fixedExpensesRatio <= 50) return 'warning'
      return 'poor'
    },
    fixedExpensesRatioMessage() {
      if (this.fixedExpensesRatio <= 40) return 'Gastos fijos controlados'
      if (this.fixedExpensesRatio <= 50) return 'Gastos fijos moderados'
      return 'Gastos fijos elevados'
    },
    financialScoreClass() {
      if (this.financialScore >= 80) return 'excellent'
      if (this.financialScore >= 60) return 'good'
      if (this.financialScore >= 40) return 'warning'
      return 'poor'
    },
    financialScoreMessage() {
      if (this.financialScore >= 80) return 'Excelente salud financiera'
      if (this.financialScore >= 60) return 'Buena salud financiera'
      if (this.financialScore >= 40) return 'Salud financiera regular'
      return 'Necesita atención urgente'
    },
    emergencyFundSaved() {
      return this.financialData.savings.items.find(item => item.name === 'Ahorro de Emergencia')?.totalSaved || 0
    },
    emergencyFundGoal() {
      return this.financialData.savings.items.find(item => item.name === 'Ahorro de Emergencia')?.goal || 0
    },
    emergencyFundProgress() {
      return this.emergencyFundGoal ? Math.min(100, Math.round((this.emergencyFundSaved / this.emergencyFundGoal) * 100)) : 0
    },
    investmentsSaved() {
      return this.financialData.savings.items.find(item => item.name === 'Inversiones Mensuales')?.totalSaved || 0
    },
    investmentsGoal() {
      return this.financialData.savings.items.find(item => item.name === 'Inversiones Mensuales')?.goal || 0
    },
    investmentsProgress() {
      return this.investmentsGoal ? Math.min(100, Math.round((this.investmentsSaved / this.investmentsGoal) * 100)) : 0
    },
    recommendations() {
      const recs = []

      if (this.savingsRate < 20) {
        recs.push({
          type: 'warning',
          icon: 'fas fa-piggy-bank',
          title: 'Aumenta tus Ahorros',
          description: 'Intenta ahorrar al menos el 20% de tus ingresos mensuales.'
        })
      }

      if (this.debtToIncomeRatio > 40) {
        recs.push({
          type: 'danger',
          icon: 'fas fa-exclamation-triangle',
          title: 'Reduce tus Deudas',
          description: 'Tu nivel de deuda es alto. Considera estrategias de consolidación o reducción de deudas.'
        })
      }

      if (this.fixedExpensesRatio > 50) {
        recs.push({
          type: 'warning',
          icon: 'fas fa-home',
          title: 'Revisa tus Gastos Fijos',
          description: 'Tus gastos fijos son elevados. Busca formas de reducirlos.'
        })
      }

      if (this.netCashFlow < 0) {
        recs.push({
          type: 'danger',
          icon: 'fas fa-chart-line',
          title: 'Flujo de Caja Negativo',
          description: 'Estás gastando más de lo que ingresas. Revisa tus gastos y busca aumentar tus ingresos.'
        })
      }

      if (this.emergencyFundProgress < 50) {
        recs.push({
          type: 'info',
          icon: 'fas fa-shield-alt',
          title: 'Fondo de Emergencia',
          description: 'Tu fondo de emergencia está por debajo del 50%. Prioriza este ahorro.'
        })
      }

      return recs
    }
  },
  methods: {
    ...mapMutations(['resetAllData']),
    formatCurrency,
    exportData() {
      const data = JSON.stringify(this.financialData, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'finanzas-personales.json'
      a.click()
      window.URL.revokeObjectURL(url)
    },
    resetData() {
      if (confirm('¿Estás seguro de que deseas reiniciar todos los datos? Esta acción no se puede deshacer.')) {
        this.resetAllData()
      }
    },
    generateReport() {
      // Implementar generación de reporte PDF
      alert('Función de generación de reporte en desarrollo')
    },
    showTips() {
      // Implementar modal de consejos financieros
      alert('Función de consejos financieros en desarrollo')
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.financial-score {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.score-circle.excellent { background: #2e7d32; }
.score-circle.good { background: #388e3c; }
.score-circle.warning { background: #f57c00; }
.score-circle.poor { background: #c62828; }

.score-details {
  flex: 1;
}

.score-details h3 {
  margin: 0;
  font-size: 1.2rem;
}

.score-details p {
  margin: 5px 0 0;
  color: #666;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.summary-content,
.analysis-content,
.expenses-content,
.goals-content {
  margin-top: 20px;
}

.summary-item,
.expense-item,
.goal-item {
  margin-bottom: 20px;
}

.indicator {
  margin-bottom: 20px;
}

.indicator-header,
.expense-header,
.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress.good { background: #2e7d32; }
.progress.warning { background: #f57c00; }
.progress.poor { background: #c62828; }

.value {
  font-weight: bold;
  color: var(--text-color);
}

.value.negative {
  color: #c62828;
}

.recommendations {
  list-style: none;
  padding: 0;
}

.recommendations li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.recommendations li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 0.5rem;
  }

  .dashboard-card {
    padding: 1rem;
  }
}
</style> 