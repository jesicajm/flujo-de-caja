<template>
  <div class="incomes-view">
    <h2>Gestión de Ingresos</h2>
    
    <div class="income-form card">
      <h3>Ingresos Mensuales</h3>
      
      <!-- Ingresos predefinidos -->
      <div v-for="item in incomeItems" :key="item.id" class="form-group">
        <label :for="'income-' + item.id">{{ item.name }}</label>
        <div class="input-group">
          <span class="currency-symbol">$</span>
          <input
            type="text"
            :id="'income-' + item.id"
            :value="formatNumber(item.amount)"
            @input="handleInput($event, item.id, false)"
            class="number-input"
          >
        </div>
      </div>

      <!-- Ingresos personalizados -->
      <div v-for="item in customIncomeItems" :key="'custom-' + item.id" class="form-group">
        <div class="custom-item">
          <label :for="'custom-income-' + item.id">{{ item.name }}</label>
          <button class="delete-btn" @click="deleteCustomIncome(item.id)" aria-label="Eliminar ingreso">
            ×
          </button>
        </div>
        <div class="input-group">
          <span class="currency-symbol">$</span>
          <input
            type="text"
            :id="'custom-income-' + item.id"
            :value="formatNumber(item.amount)"
            @input="handleInput($event, item.id, true)"
            class="number-input"
          >
        </div>
      </div>

      <!-- Formulario para agregar nuevo ingreso -->
      <div class="add-item-form" v-if="showAddForm">
        <div class="form-group">
          <label for="new-income-name">Nombre del Ingreso</label>
          <input
            type="text"
            id="new-income-name"
            v-model="newIncome.name"
            placeholder="Ej: Dividendos"
          >
        </div>
        <div class="form-group">
          <label for="new-income-amount">Cantidad Mensual</label>
          <div class="input-group">
            <span class="currency-symbol">$</span>
            <input
              type="text"
              id="new-income-amount"
              :value="formatNumber(newIncome.amount)"
              @input="handleNewIncomeInput($event)"
              class="number-input"
            >
          </div>
        </div>
        <div class="button-group">
          <button class="btn primary" @click="addCustomIncome">Guardar</button>
          <button class="btn secondary" @click="cancelAddIncome">Cancelar</button>
        </div>
      </div>

      <button v-else class="btn add-btn" @click="showAddForm = true">
        + Agregar Otro Ingreso
      </button>
    </div>

    <div class="income-summary card">
      <h3>Resumen de Ingresos</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Ingresos Fijos</span>
          <span class="value">{{ formatCurrency(totalFixedIncome) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Ingresos Variables</span>
          <span class="value">{{ formatCurrency(totalVariableIncome) }}</span>
        </div>
        <div class="summary-item total">
          <span class="label">Total Ingresos</span>
          <span class="value">{{ formatCurrency(totalIncome) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { formatNumber, unformatNumber, formatCurrency } from '@/utils/formatters'

export default {
  name: 'IncomesManagement',
  data() {
    return {
      showAddForm: false,
      newIncome: {
        name: '',
        amount: 0
      }
    }
  },
  computed: {
    ...mapState({
      incomeItems: state => state.financialData.incomes.items,
      customIncomeItems: state => state.financialData.incomes.customItems
    }),
    ...mapGetters(['totalIncome']),
    totalFixedIncome() {
      return this.incomeItems.slice(0, 1).reduce((sum, item) => sum + item.amount, 0)
    },
    totalVariableIncome() {
      return this.totalIncome - this.totalFixedIncome
    }
  },
  methods: {
    ...mapMutations(['updateIncomeItem', 'addCustomIncome', 'deleteCustomIncome']),
    handleInput(event, id, isCustom) {
      const value = event.target.value
      const numericValue = Number(unformatNumber(value))
      this.updateIncome(id, numericValue, isCustom)
    },
    handleNewIncomeInput(event) {
      const value = event.target.value
      this.newIncome.amount = unformatNumber(value)
    },
    updateIncome(id, amount, isCustom) {
      this.updateIncomeItem({ id, amount, isCustom })
    },
    addCustomIncome() {
      if (!this.newIncome.name.trim()) {
        alert('Por favor, ingrese un nombre para el ingreso')
        return
      }
      this.$store.commit('addCustomIncome', {
        name: this.newIncome.name,
        amount: Number(unformatNumber(this.newIncome.amount)) || 0
      })
      this.resetForm()
    },
    deleteCustomIncome(id) {
      if (confirm('¿Está seguro de que desea eliminar este ingreso?')) {
        this.$store.commit('deleteCustomIncome', id)
      }
    },
    cancelAddIncome() {
      this.resetForm()
    },
    resetForm() {
      this.newIncome = { name: '', amount: 0 }
      this.showAddForm = false
    },
    formatNumber,
    formatCurrency
  }
}
</script>

<style scoped>
.incomes-view {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: bold;
  font-size: 0.95rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  color: #666;
}

.number-input {
  text-align: right;
  padding-right: 0.75rem !important;
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.custom-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.delete-btn:hover {
  color: #d32f2f;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.btn.secondary {
  background-color: #e0e0e0;
  color: var(--text-color);
}

.btn.add-btn {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px dashed #ccc;
  width: 100%;
  margin-top: 1rem;
}

.summary-grid {
  display: grid;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-item .label {
  color: #666;
  font-weight: normal;
}

.summary-item .value {
  font-weight: bold;
  color: var(--primary-color);
}

.summary-item.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.summary-item.total .label {
  font-weight: bold;
  color: var(--text-color);
}

.summary-item.total .value {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .incomes-view {
    padding: 0.5rem;
  }

  .card {
    padding: 1rem;
  }

  .btn {
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .card {
    border-radius: 0;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }

  .button-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .summary-item {
    font-size: 0.9rem;
  }

  .summary-item.total .value {
    font-size: 1.1rem;
  }
}
</style> 