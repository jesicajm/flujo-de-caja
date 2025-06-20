<template>
  <div class="debts-view">
    <h2>Gestión de Deudas</h2>
    
    <div class="debts-form card">
      <h3>Pagos de Deudas Mensuales</h3>
      
      <!-- Deudas predefinidas -->
      <div v-for="item in debtItems" :key="item.id" class="debt-item">
        <h4>{{ item.name }}</h4>
        <div class="debt-details">
          <div class="form-group">
            <label :for="'payment-' + item.id">Pago Mensual</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'payment-' + item.id"
                :value="formatNumber(item.monthlyPayment)"
                @input="handleInput($event, item.id, 'monthlyPayment', false)"
                class="number-input"
                :class="{ 'error': hasError(item.id, 'monthlyPayment') }"
              >
            </div>
            <span class="error-message" v-if="hasError(item.id, 'monthlyPayment')">
              El pago mensual debe ser un número válido mayor o igual a 0
            </span>
          </div>
          <div class="form-group">
            <label :for="'total-' + item.id">Deuda Total</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'total-' + item.id"
                :value="formatNumber(item.totalDebt)"
                @input="handleInput($event, item.id, 'totalDebt', false)"
                class="number-input"
                :class="{ 'error': hasError(item.id, 'totalDebt') }"
              >
            </div>
            <span class="error-message" v-if="hasError(item.id, 'totalDebt')">
              La deuda total debe ser un número válido mayor o igual a 0
            </span>
          </div>
          <div class="form-group">
            <label :for="'interest-' + item.id">Tasa de Interés (%)</label>
            <div class="input-group">
              <input
                type="number"
                :id="'interest-' + item.id"
                v-model.number="item.interestRate"
                @input="handleInput($event, item.id, 'interestRate', false)"
                min="0"
                max="100"
                step="0.1"
                :class="{ 'error': hasError(item.id, 'interestRate') }"
              >
              <span class="percentage-symbol">%</span>
            </div>
            <span class="error-message" v-if="hasError(item.id, 'interestRate')">
              La tasa de interés debe estar entre 0 y 100
            </span>
          </div>
        </div>
      </div>

      <!-- Deudas personalizadas -->
      <div v-for="item in customDebtItems" :key="'custom-' + item.id" class="debt-item">
        <div class="custom-item-header">
          <h4>{{ item.name }}</h4>
          <button class="delete-btn" @click="deleteCustomDebt(item.id)" aria-label="Eliminar deuda">
            ×
          </button>
        </div>
        <div class="debt-details">
          <div class="form-group">
            <label :for="'custom-payment-' + item.id">Pago Mensual</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'custom-payment-' + item.id"
                :value="formatNumber(item.monthlyPayment)"
                @input="handleInput($event, item.id, 'monthlyPayment', true)"
                class="number-input"
                :class="{ 'error': hasError(item.id, 'monthlyPayment', true) }"
              >
            </div>
            <span class="error-message" v-if="hasError(item.id, 'monthlyPayment', true)">
              El pago mensual debe ser un número válido mayor o igual a 0
            </span>
          </div>
          <div class="form-group">
            <label :for="'custom-total-' + item.id">Deuda Total</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'custom-total-' + item.id"
                :value="formatNumber(item.totalDebt)"
                @input="handleInput($event, item.id, 'totalDebt', true)"
                class="number-input"
                :class="{ 'error': hasError(item.id, 'totalDebt', true) }"
              >
            </div>
            <span class="error-message" v-if="hasError(item.id, 'totalDebt', true)">
              La deuda total debe ser un número válido mayor o igual a 0
            </span>
          </div>
          <div class="form-group">
            <label :for="'custom-interest-' + item.id">Tasa de Interés (%)</label>
            <div class="input-group">
              <input
                type="number"
                :id="'custom-interest-' + item.id"
                v-model.number="item.interestRate"
                @input="handleInput($event, item.id, 'interestRate', true)"
                min="0"
                max="100"
                step="0.1"
                :class="{ 'error': hasError(item.id, 'interestRate', true) }"
              >
              <span class="percentage-symbol">%</span>
            </div>
            <span class="error-message" v-if="hasError(item.id, 'interestRate', true)">
              La tasa de interés debe estar entre 0 y 100
            </span>
          </div>
        </div>
      </div>

      <!-- Formulario para agregar nueva deuda -->
      <div class="add-item-form" v-if="showAddForm">
        <h4>Nueva Deuda</h4>
        <div class="form-group">
          <label for="new-debt-name">Nombre de la Deuda</label>
          <input
            type="text"
            id="new-debt-name"
            v-model="newDebt.name"
            placeholder="Ej: Préstamo Coche"
            :class="{ 'error': v$.newDebt.name.$error }"
          >
          <span class="error-message" v-if="v$.newDebt.name.$error">
            {{ v$.newDebt.name.$errors[0].$message }}
          </span>
        </div>
        <div class="debt-details">
          <div class="form-group">
            <label for="new-debt-payment">Pago Mensual</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                id="new-debt-payment"
                :value="formatNumber(newDebt.monthlyPayment)"
                @input="handleNewDebtInput($event, 'monthlyPayment')"
                class="number-input"
                :class="{ 'error': v$.newDebt.monthlyPayment.$error }"
              >
            </div>
            <span class="error-message" v-if="v$.newDebt.monthlyPayment.$error">
              {{ v$.newDebt.monthlyPayment.$errors[0].$message }}
            </span>
          </div>
          <div class="form-group">
            <label for="new-debt-total">Deuda Total</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                id="new-debt-total"
                :value="formatNumber(newDebt.totalDebt)"
                @input="handleNewDebtInput($event, 'totalDebt')"
                class="number-input"
                :class="{ 'error': v$.newDebt.totalDebt.$error }"
              >
            </div>
            <span class="error-message" v-if="v$.newDebt.totalDebt.$error">
              {{ v$.newDebt.totalDebt.$errors[0].$message }}
            </span>
          </div>
          <div class="form-group">
            <label for="new-debt-interest">Tasa de Interés (%)</label>
            <div class="input-group">
              <input
                type="number"
                id="new-debt-interest"
                v-model.number="newDebt.interestRate"
                min="0"
                max="100"
                step="0.1"
                :class="{ 'error': v$.newDebt.interestRate.$error }"
              >
              <span class="percentage-symbol">%</span>
            </div>
            <span class="error-message" v-if="v$.newDebt.interestRate.$error">
              {{ v$.newDebt.interestRate.$errors[0].$message }}
            </span>
          </div>
        </div>
        <div class="button-group">
          <button class="btn primary" @click="addCustomDebt" :disabled="v$.newDebt.$invalid">
            Guardar
          </button>
          <button class="btn secondary" @click="cancelAddDebt">Cancelar</button>
        </div>
      </div>

      <button v-else class="btn add-btn" @click="showAddForm = true">
        + Agregar Deuda
      </button>
    </div>

    <div class="debts-summary card">
      <h3>Resumen de Deudas</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Total Pagos Mensuales</span>
          <span class="value">{{ formatCurrency(totalMonthlyDebtPayments) }}</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: monthlyPaymentPercentage + '%' }"></div>
          </div>
          <span class="percentage">{{ monthlyPaymentPercentage }}% del ingreso mensual</span>
        </div>
        <div class="summary-item">
          <span class="label">Deuda Total</span>
          <span class="value">{{ formatCurrency(totalDebt) }}</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: debtToIncomeRatio + '%' }"></div>
          </div>
          <span class="percentage">{{ debtToIncomeRatio }}% del ingreso anual</span>
        </div>
        <div class="summary-item">
          <span class="label">Estado de Deuda</span>
          <div class="ratio-indicator" :class="debtRatioClass">
            {{ debtRatioMessage }}
          </div>
          <div class="debt-tips" v-if="debtTips.length > 0">
            <h4>Recomendaciones:</h4>
            <ul>
              <li v-for="(tip, index) in debtTips" :key="index">{{ tip }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, minLength, maxValue } from '@vuelidate/validators'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { unformatNumber, formatNumber, formatCurrency } from '@/utils/formatters'

export default {
  name: 'DebtsManagement',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      showAddForm: false,
      newDebt: {
        name: '',
        monthlyPayment: 0,
        totalDebt: 0,
        interestRate: 0
      },
      errors: {
        monthlyPayment: {},
        totalDebt: {},
        interestRate: {}
      }
    }
  },
  validations() {
    return {
      newDebt: {
        name: { 
          required, 
          minLength: minLength(3)
        },
        monthlyPayment: { 
          required,
          minValue: minValue(0)
        },
        totalDebt: {
          required,
          minValue: minValue(0)
        },
        interestRate: {
          required,
          minValue: minValue(0),
          maxValue: maxValue(100)
        }
      }
    }
  },
  computed: {
    ...mapState({
      debtItems: state => state.financialData.debts.items,
      customDebtItems: state => state.financialData.debts.customItems,
      totalIncome: state => state.financialData.totalIncome
    }),
    ...mapGetters('financialData', [
      'totalMonthlyDebtPayments',
      'totalDebt',
      'debtToIncomeRatio'
    ]),
    monthlyPaymentPercentage() {
      return this.totalIncome ? Math.round((this.totalMonthlyDebtPayments / this.totalIncome) * 100) : 0
    },
    debtRatioClass() {
      if (this.debtToIncomeRatio > 40) return 'danger'
      if (this.debtToIncomeRatio > 30) return 'warning'
      return 'success'
    },
    debtRatioMessage() {
      if (this.debtToIncomeRatio > 40) return '¡Nivel de deuda alto!'
      if (this.debtToIncomeRatio > 30) return 'Nivel de deuda moderado'
      return 'Nivel de deuda saludable'
    },
    debtTips() {
      const tips = []
      if (this.debtToIncomeRatio > 40) {
        tips.push('Considere consolidar sus deudas para reducir los intereses')
        tips.push('Priorice el pago de deudas con mayor tasa de interés')
        tips.push('Evite adquirir nuevas deudas hasta reducir las actuales')
      } else if (this.debtToIncomeRatio > 30) {
        tips.push('Intente aumentar los pagos mensuales para reducir deudas más rápido')
        tips.push('Revise sus gastos para encontrar áreas de ahorro')
      }
      return tips
    }
  },
  methods: {
    ...mapMutations('financialData', [
      'updateDebtItem',
      'addCustomDebt',
      'deleteCustomDebt'
    ]),
    formatNumber,
    formatCurrency,
    
    async handleInput(event, id, field, isCustom) {
      const value = event.target.value
      const numericValue = Number(unformatNumber(value))
      
      if (field === 'interestRate') {
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
          this.setError(id, field, isCustom)
          return
        }
      } else {
        if (isNaN(numericValue) || numericValue < 0) {
          this.setError(id, field, isCustom)
          return
        }
      }
      
      this.clearError(id, field, isCustom)
      const items = isCustom ? this.customDebtItems : this.debtItems
      const item = items.find(i => i.id === id)
      
      if (item) {
        const updateData = {
          id,
          monthlyPayment: field === 'monthlyPayment' ? numericValue : Number(unformatNumber(item.monthlyPayment)),
          totalDebt: field === 'totalDebt' ? numericValue : Number(unformatNumber(item.totalDebt)),
          interestRate: field === 'interestRate' ? numericValue : Number(item.interestRate),
          isCustom
        }
        this.updateDebtItem(updateData)
      }
    },
    
    async handleNewDebtInput(event, field) {
      const value = event.target.value
      const numericValue = Number(unformatNumber(value))
      this.newDebt[field] = numericValue
      await this.v$.newDebt[field].$touch()
    },
    
    async addCustomDebt() {
      const isValid = await this.v$.newDebt.$validate()
      if (!isValid) return
      
      this.$store.commit('financialData/addCustomDebt', {
        name: this.newDebt.name.trim(),
        monthlyPayment: Number(unformatNumber(this.newDebt.monthlyPayment)) || 0,
        totalDebt: Number(unformatNumber(this.newDebt.totalDebt)) || 0,
        interestRate: Number(this.newDebt.interestRate) || 0
      })
      
      this.resetForm()
    },
    
    deleteCustomDebt(id) {
      if (confirm('¿Está seguro de que desea eliminar esta deuda?')) {
        this.$store.commit('financialData/deleteCustomDebt', { id })
      }
    },
    
    setError(id, field, isCustom) {
      this.errors[field][`${isCustom ? 'custom-' : ''}${id}`] = true
    },
    
    clearError(id, field, isCustom) {
      delete this.errors[field][`${isCustom ? 'custom-' : ''}${id}`]
    },
    
    hasError(id, field, isCustom = false) {
      return this.errors[field][`${isCustom ? 'custom-' : ''}${id}`]
    },
    
    cancelAddDebt() {
      this.resetForm()
    },
    
    resetForm() {
      this.newDebt = {
        name: '',
        monthlyPayment: 0,
        totalDebt: 0,
        interestRate: 0
      }
      this.showAddForm = false
      this.v$.newDebt.$reset()
    }
  }
}
</script>

<style scoped>
.debts-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.debt-item {
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.debt-item:last-child {
  border-bottom: none;
}

.debt-details {
  display: grid;
  gap: 20px;
  margin-top: 15px;
}

.custom-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-group {
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.currency-symbol {
  padding: 8px 12px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  color: #666;
}

.percentage-symbol {
  padding: 8px 12px;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  color: #666;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  outline: none;
}

input.error {
  border-color: #dc3545;
  background-color: #fff8f8;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

.delete-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 8px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn.primary {
  background: #007bff;
  color: white;
}

.btn.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn.secondary {
  background: #6c757d;
  color: white;
}

.btn.add-btn {
  width: 100%;
  background: #f8f9fa;
  border: 1px dashed #ddd;
  color: #007bff;
  margin-top: 15px;
}

.summary-grid {
  display: grid;
  gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item .label {
  color: #666;
  font-size: 0.9rem;
}

.summary-item .value {
  font-size: 1.2rem;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #007bff;
  transition: width 0.3s ease;
}

.percentage {
  font-size: 0.8rem;
  color: #666;
}

.ratio-indicator {
  padding: 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 8px;
}

.ratio-indicator.success {
  background: #d4edda;
  color: #155724;
}

.ratio-indicator.warning {
  background: #fff3cd;
  color: #856404;
}

.ratio-indicator.danger {
  background: #f8d7da;
  color: #721c24;
}

.debt-tips {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.debt-tips h4 {
  margin: 0 0 10px 0;
  color: #666;
}

.debt-tips ul {
  margin: 0;
  padding-left: 20px;
}

.debt-tips li {
  color: #666;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .debts-view {
    padding: 10px;
  }
  
  .card {
    padding: 15px;
  }
  
  .debt-details {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) {
  .debt-details {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style> 