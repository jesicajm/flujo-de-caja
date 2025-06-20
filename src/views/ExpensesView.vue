<template>
  <div class="expenses-view">
    <h2>Gestión de Gastos</h2>
    
    <!-- Gastos Fijos -->
    <div class="expenses-form card">
      <h3>Gastos Fijos Mensuales</h3>
      
      <!-- Gastos fijos predefinidos -->
      <div v-for="item in fixedExpenseItems" :key="item.id" class="form-group">
        <label :for="'fixed-' + item.id">{{ item.name }}</label>
        <div class="input-group">
          <span class="currency-symbol">$</span>
          <input
            type="text"
            :id="'fixed-' + item.id"
            :value="formatNumber(item.amount)"
            @input="handleInput($event, item.id, 'fixed', false)"
            class="number-input"
            :class="{ 'error': hasError(item.id, 'fixed') }"
          >
        </div>
        <span class="error-message" v-if="hasError(item.id, 'fixed')">
          El valor debe ser un número válido mayor o igual a 0
        </span>
      </div>

      <!-- Gastos fijos personalizados -->
      <div v-for="item in customFixedExpenseItems" :key="'custom-fixed-' + item.id" class="form-group">
        <div class="custom-item">
          <label :for="'custom-fixed-' + item.id">{{ item.name }}</label>
          <button class="delete-btn" @click="deleteCustomExpense(item.id, 'fixed')" aria-label="Eliminar gasto fijo">
            ×
          </button>
        </div>
        <div class="input-group">
          <span class="currency-symbol">$</span>
          <input
            type="text"
            :id="'custom-fixed-' + item.id"
            :value="formatNumber(item.amount)"
            @input="handleInput($event, item.id, 'fixed', true)"
            class="number-input"
            :class="{ 'error': hasError(item.id, 'fixed', true) }"
          >
        </div>
        <span class="error-message" v-if="hasError(item.id, 'fixed', true)">
          El valor debe ser un número válido mayor o igual a 0
        </span>
      </div>

      <!-- Formulario para agregar nuevo gasto fijo -->
      <div class="add-item-form" v-if="showAddFixedForm">
        <div class="form-group">
          <label for="new-fixed-name">Nombre del Gasto Fijo</label>
          <input
            type="text"
            id="new-fixed-name"
            v-model="newFixedExpense.name"
            placeholder="Ej: Internet"
            :class="{ 'error': v$.newFixedExpense.name.$error }"
          >
          <span class="error-message" v-if="v$.newFixedExpense.name.$error">
            {{ v$.newFixedExpense.name.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group">
          <label for="new-fixed-amount">Cantidad Mensual</label>
          <div class="input-group">
            <span class="currency-symbol">$</span>
            <input
              type="text"
              id="new-fixed-amount"
              :value="formatNumber(newFixedExpense.amount)"
              @input="handleNewExpenseInput($event, 'fixed')"
              class="number-input"
              :class="{ 'error': v$.newFixedExpense.amount.$error }"
            >
          </div>
          <span class="error-message" v-if="v$.newFixedExpense.amount.$error">
            {{ v$.newFixedExpense.amount.$errors[0].$message }}
          </span>
        </div>
        <div class="button-group">
          <button class="btn primary" @click="addCustomExpense('fixed')" :disabled="v$.newFixedExpense.$invalid">
            Guardar
          </button>
          <button class="btn secondary" @click="cancelAddExpense('fixed')">Cancelar</button>
        </div>
      </div>

      <button v-else class="btn add-btn" @click="showAddFixedForm = true">
        + Agregar Gasto Fijo
      </button>
    </div>

    <!-- Gastos Variables -->
    <div class="expenses-form card">
      <h3>Gastos Variables Mensuales</h3>
      
      <!-- Gastos variables predefinidos -->
      <div v-for="item in variableExpenseItems" :key="item.id" class="form-group">
        <label :for="'variable-' + item.id">{{ item.name }}</label>
        <div class="input-group">
          <span class="currency-symbol">$</span>
          <input
            type="text"
            :id="'variable-' + item.id"
            :value="formatNumber(item.amount)"
            @input="handleInput($event, item.id, 'variable', false)"
            class="number-input"
            :class="{ 'error': hasError(item.id, 'variable') }"
          >
        </div>
        <span class="error-message" v-if="hasError(item.id, 'variable')">
          El valor debe ser un número válido mayor o igual a 0
        </span>
      </div>

      <!-- Gastos variables personalizados -->
      <div v-for="item in customVariableExpenseItems" :key="'custom-variable-' + item.id" class="form-group">
        <div class="custom-item">
          <label :for="'custom-variable-' + item.id">{{ item.name }}</label>
          <button class="delete-btn" @click="deleteCustomExpense(item.id, 'variable')" aria-label="Eliminar gasto variable">
            ×
          </button>
        </div>
        <div class="input-group">
          <span class="currency-symbol">$</span>
          <input
            type="text"
            :id="'custom-variable-' + item.id"
            :value="formatNumber(item.amount)"
            @input="handleInput($event, item.id, 'variable', true)"
            class="number-input"
            :class="{ 'error': hasError(item.id, 'variable', true) }"
          >
        </div>
        <span class="error-message" v-if="hasError(item.id, 'variable', true)">
          El valor debe ser un número válido mayor o igual a 0
        </span>
      </div>

      <!-- Formulario para agregar nuevo gasto variable -->
      <div class="add-item-form" v-if="showAddVariableForm">
        <div class="form-group">
          <label for="new-variable-name">Nombre del Gasto Variable</label>
          <input
            type="text"
            id="new-variable-name"
            v-model="newVariableExpense.name"
            placeholder="Ej: Regalos"
            :class="{ 'error': v$.newVariableExpense.name.$error }"
          >
          <span class="error-message" v-if="v$.newVariableExpense.name.$error">
            {{ v$.newVariableExpense.name.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group">
          <label for="new-variable-amount">Cantidad Mensual</label>
          <div class="input-group">
            <span class="currency-symbol">$</span>
            <input
              type="text"
              id="new-variable-amount"
              :value="formatNumber(newVariableExpense.amount)"
              @input="handleNewExpenseInput($event, 'variable')"
              class="number-input"
              :class="{ 'error': v$.newVariableExpense.amount.$error }"
            >
          </div>
          <span class="error-message" v-if="v$.newVariableExpense.amount.$error">
            {{ v$.newVariableExpense.amount.$errors[0].$message }}
          </span>
        </div>
        <div class="button-group">
          <button class="btn primary" @click="addCustomExpense('variable')" :disabled="v$.newVariableExpense.$invalid">
            Guardar
          </button>
          <button class="btn secondary" @click="cancelAddExpense('variable')">Cancelar</button>
        </div>
      </div>

      <button v-else class="btn add-btn" @click="showAddVariableForm = true">
        + Agregar Gasto Variable
      </button>
    </div>

    <!-- Resumen de Gastos -->
    <div class="expenses-summary card">
      <h3>Resumen de Gastos</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Gastos Fijos</span>
          <span class="value">{{ formatCurrency(totalFixedExpenses) }}</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: fixedExpensesPercentage + '%' }"></div>
          </div>
          <span class="percentage">{{ fixedExpensesPercentage }}% del total</span>
        </div>
        <div class="summary-item">
          <span class="label">Gastos Variables</span>
          <span class="value">{{ formatCurrency(totalVariableExpenses) }}</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: variableExpensesPercentage + '%' }"></div>
          </div>
          <span class="percentage">{{ variableExpensesPercentage }}% del total</span>
        </div>
        <div class="summary-item total">
          <span class="label">Total Gastos</span>
          <span class="value">{{ formatCurrency(totalExpenses) }}</span>
          <div class="ratio-indicator" :class="expenseRatioClass">
            {{ expenseRatioMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, minLength } from '@vuelidate/validators'
import { mapState, mapGetters, mapActions } from 'vuex'
import { unformatNumber, formatNumber, formatCurrency } from '@/utils/formatters'

export default {
  name: 'ExpensesManagement',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      showAddFixedForm: false,
      showAddVariableForm: false,
      newFixedExpense: {
        name: '',
        amount: 0
      },
      newVariableExpense: {
        name: '',
        amount: 0
      },
      errors: {
        fixed: {},
        variable: {}
      }
    }
  },
  validations() {
    const expenseRules = {
      name: { 
        required, 
        minLength: minLength(3)
      },
      amount: { 
        required,
        minValue: minValue(0)
      }
    }
    return {
      newFixedExpense: expenseRules,
      newVariableExpense: expenseRules
    }
  },
  computed: {
    ...mapState({
      fixedExpenseItems: state => state.financialData.expenses.fixed.items || [],
      variableExpenseItems: state => state.financialData.expenses.variable.items || [],
      customFixedExpenseItems: state => state.financialData.expenses.fixed.customItems || [],
      customVariableExpenseItems: state => state.financialData.expenses.variable.customItems || [],
      totalIncome: state => state.financialData.totalIncome
    }),
    ...mapState('auth', ['user']),
    ...mapGetters('financialData', [
      'totalFixedExpenses',
      'totalVariableExpenses',
      'fixedExpensesRatio'
    ]),
    totalExpenses() {
      return Number(this.totalFixedExpenses) + Number(this.totalVariableExpenses)
    },
    fixedExpensesPercentage() {
      return this.totalExpenses ? Math.round((this.totalFixedExpenses / this.totalExpenses) * 100) : 0
    },
    variableExpensesPercentage() {
      return this.totalExpenses ? Math.round((this.totalVariableExpenses / this.totalExpenses) * 100) : 0
    },
    expenseRatioClass() {
      const ratio = this.totalExpenses / this.totalIncome
      if (ratio > 0.7) return 'danger'
      if (ratio > 0.5) return 'warning'
      return 'success'
    },
    expenseRatioMessage() {
      const ratio = this.totalExpenses / this.totalIncome
      if (ratio > 0.7) return '¡Alerta! Gastos muy elevados'
      if (ratio > 0.5) return 'Gastos moderados'
      return 'Gastos saludables'
    }
  },
  async created() {
    // Cargar datos financieros de Firestore al inicializar el componente
    await this.loadFinancialData()
  },
  methods: {
    ...mapActions('financialData', ['fetchFinancialData']),
    async loadFinancialData() {
      if (this.user && this.user.uid) {
        try {
          console.log('🔄 Cargando datos financieros desde Firestore...')
          await this.fetchFinancialData(this.user.uid)
          console.log('✅ Datos financieros cargados correctamente')
        } catch (error) {
          console.error('❌ Error al cargar datos financieros:', error)
        }
      } else {
        console.warn('⚠️ Usuario no autenticado, no se pueden cargar datos')
      }
    },
    formatNumber,
    formatCurrency,
    async handleInput(event, id, type, isCustom) {
      const value = event.target.value
      const numericValue = unformatNumber(value)
      
      if (isNaN(numericValue) || numericValue < 0) {
        this.setError(id, type, isCustom)
        return
      }
      
      this.clearError(id, type, isCustom)
      
      // Usar action para guardar en Firestore
      this.$store.dispatch('financialData/updateExpenseItem', { 
        id, 
        amount: numericValue, 
        type, 
        isCustom 
      }).catch(error => {
        console.error('Error al guardar en Firestore:', error)
        // Fallback: actualizar solo localmente si falla Firestore
        this.$store.commit('financialData/updateExpenseItem', { 
          id, 
          amount: numericValue, 
          type, 
          isCustom 
        })
      })
    },
    
    async handleNewExpenseInput(event, type) {
      const value = event.target.value
      const numericValue = unformatNumber(value)
      
      if (type === 'fixed') {
        this.newFixedExpense.amount = numericValue
        await this.v$.newFixedExpense.amount.$touch()
      } else {
        this.newVariableExpense.amount = numericValue
        await this.v$.newVariableExpense.amount.$touch()
      }
    },
    
    async addCustomExpense(type) {
      const expense = type === 'fixed' ? this.newFixedExpense : this.newVariableExpense
      const validation = type === 'fixed' ? this.v$.newFixedExpense : this.v$.newVariableExpense
      
      const isValid = await validation.$validate()
      if (!isValid) return
      
      const expenseData = {
        name: expense.name.trim(),
        amount: Number(unformatNumber(expense.amount)) || 0,
        type
      }
      
      // Usar action para guardar en Firestore
      this.$store.dispatch('financialData/addCustomExpense', expenseData).catch(error => {
        console.error('Error al guardar en Firestore:', error)
        // Fallback: actualizar solo localmente si falla Firestore
        this.$store.commit('financialData/addCustomExpense', expenseData)
      })
      
      this.resetForm(type)
    },
    
    async deleteCustomExpense(id, type) {
      if (confirm('¿Está seguro de que desea eliminar este gasto?')) {
        try {
          console.log('🗑️ Iniciando eliminación de gasto:', { id, type })
          // Usar action para guardar en Firestore
          await this.$store.dispatch('financialData/deleteCustomExpense', { id, type })
          console.log('✅ Gasto eliminado correctamente de Firestore')
        } catch (error) {
          console.error('❌ Error al eliminar gasto de Firestore:', error)
          // Fallback: actualizar solo localmente si falla Firestore
          this.$store.commit('financialData/deleteCustomExpense', { id, type })
          console.log('⚠️ Gasto eliminado solo localmente debido al error')
        }
      }
    },
    
    setError(id, type, isCustom) {
      this.errors[type][`${isCustom ? 'custom-' : ''}${id}`] = true
    },
    
    clearError(id, type, isCustom) {
      delete this.errors[type][`${isCustom ? 'custom-' : ''}${id}`]
    },
    
    hasError(id, type, isCustom = false) {
      return this.errors[type][`${isCustom ? 'custom-' : ''}${id}`]
    },
    
    cancelAddExpense(type) {
      this.resetForm(type)
    },
    
    resetForm(type) {
      if (type === 'fixed') {
        this.newFixedExpense = { name: '', amount: 0 }
        this.showAddFixedForm = false
        this.v$.newFixedExpense.$reset()
      } else {
        this.newVariableExpense = { name: '', amount: 0 }
        this.showAddVariableForm = false
        this.v$.newVariableExpense.$reset()
      }
    }
  }
}
</script>

<style scoped>
.expenses-view {
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

.number-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  outline: none;
}

.number-input.error {
  border-color: #dc3545;
  background-color: #fff8f8;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

.custom-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-top: 15px;
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
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
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

@media (max-width: 768px) {
  .expenses-view {
    padding: 10px;
  }
  
  .card {
    padding: 15px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>