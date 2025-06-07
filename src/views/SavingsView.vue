<template>
  <div class="savings-view">
    <h2>Gestión de Ahorros e Inversiones</h2>
    
    <div class="savings-form card">
      <h3>Ahorros e Inversiones Mensuales</h3>
      
      <!-- Ahorros predefinidos -->
      <div v-for="item in savingItems" :key="item.id" class="saving-item">
        <h4>{{ item.name }}</h4>
        <div class="saving-details">
          <div class="form-group">
            <label :for="'monthly-' + item.id">Aporte Mensual</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'monthly-' + item.id"
                :value="formatNumber(item.monthlyAmount)"
                @input="handleInput($event, item.id, 'monthlyAmount', false)"
                class="number-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label :for="'total-' + item.id">Total Acumulado</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'total-' + item.id"
                :value="formatNumber(item.totalSaved)"
                @input="handleInput($event, item.id, 'totalSaved', false)"
                class="number-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label :for="'goal-' + item.id">Meta</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'goal-' + item.id"
                :value="formatNumber(item.goal)"
                @input="handleInput($event, item.id, 'goal', false)"
                class="number-input"
              >
            </div>
          </div>
          <div class="progress-container">
            <label>Progreso</label>
            <div class="progress-bar">
              <div 
                class="progress" 
                :style="{ width: calculateProgress(item.totalSaved, item.goal) + '%' }"
                :class="{ complete: item.totalSaved >= item.goal }"
              ></div>
            </div>
            <span class="progress-text">{{ calculateProgress(item.totalSaved, item.goal) }}%</span>
          </div>
        </div>
      </div>

      <!-- Ahorros personalizados -->
      <div v-for="item in customSavingItems" :key="'custom-' + item.id" class="saving-item">
        <div class="custom-item-header">
          <h4>{{ item.name }}</h4>
          <button class="delete-btn" @click="deleteCustomSaving(item.id)" aria-label="Eliminar ahorro">
            ×
          </button>
        </div>
        <div class="saving-details">
          <div class="form-group">
            <label :for="'custom-monthly-' + item.id">Aporte Mensual</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'custom-monthly-' + item.id"
                :value="formatNumber(item.monthlyAmount)"
                @input="handleInput($event, item.id, 'monthlyAmount', true)"
                class="number-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label :for="'custom-total-' + item.id">Total Acumulado</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'custom-total-' + item.id"
                :value="formatNumber(item.totalSaved)"
                @input="handleInput($event, item.id, 'totalSaved', true)"
                class="number-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label :for="'custom-goal-' + item.id">Meta</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                :id="'custom-goal-' + item.id"
                :value="formatNumber(item.goal)"
                @input="handleInput($event, item.id, 'goal', true)"
                class="number-input"
              >
            </div>
          </div>
          <div class="progress-container">
            <label>Progreso</label>
            <div class="progress-bar">
              <div 
                class="progress" 
                :style="{ width: calculateProgress(item.totalSaved, item.goal) + '%' }"
                :class="{ complete: item.totalSaved >= item.goal }"
              ></div>
            </div>
            <span class="progress-text">{{ calculateProgress(item.totalSaved, item.goal) }}%</span>
          </div>
        </div>
      </div>

      <!-- Formulario para agregar nuevo ahorro -->
      <div class="add-item-form" v-if="showAddForm">
        <h4>Nuevo Ahorro/Inversión</h4>
        <div class="form-group">
          <label for="new-saving-name">Nombre</label>
          <input
            type="text"
            id="new-saving-name"
            v-model="newSaving.name"
            placeholder="Ej: Fondo de Inversión"
          >
        </div>
        <div class="saving-details">
          <div class="form-group">
            <label for="new-saving-monthly">Aporte Mensual</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                id="new-saving-monthly"
                :value="formatNumber(newSaving.monthlyAmount)"
                @input="handleNewSavingInput($event, 'monthlyAmount')"
                class="number-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label for="new-saving-total">Total Acumulado</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                id="new-saving-total"
                :value="formatNumber(newSaving.totalSaved)"
                @input="handleNewSavingInput($event, 'totalSaved')"
                class="number-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label for="new-saving-goal">Meta</label>
            <div class="input-group">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                id="new-saving-goal"
                :value="formatNumber(newSaving.goal)"
                @input="handleNewSavingInput($event, 'goal')"
                class="number-input"
              >
            </div>
          </div>
        </div>
        <div class="button-group">
          <button class="btn primary" @click="addCustomSaving">Guardar</button>
          <button class="btn secondary" @click="cancelAddSaving">Cancelar</button>
        </div>
      </div>

      <button v-else class="btn add-btn" @click="showAddForm = true">
        + Agregar Ahorro/Inversión
      </button>
    </div>

    <div class="savings-summary card">
      <h3>Resumen de Ahorros</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Total Ahorros Mensuales</span>
          <span class="value">{{ formatCurrency(totalMonthlySavings) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Total Acumulado</span>
          <span class="value">{{ formatCurrency(totalSaved) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Tasa de Ahorro</span>
          <span class="value" :class="savingsRateClass">{{ savingsRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { formatNumber, unformatNumber, formatCurrency } from '@/utils/formatters'

export default {
  name: 'SavingsManagement',
  data() {
    return {
      showAddForm: false,
      newSaving: {
        name: '',
        monthlyAmount: 0,
        totalSaved: 0,
        goal: 0
      }
    }
  },
  computed: {
    ...mapState({
      savingItems: state => state.financialData.savings.items,
      customSavingItems: state => state.financialData.savings.customItems
    }),
    ...mapGetters([
      'totalMonthlySavings',
      'totalSaved',
      'savingsRate'
    ]),
    savingsRateClass() {
      if (this.savingsRate >= 20) return 'success'
      if (this.savingsRate >= 10) return 'warning'
      return 'danger'
    }
  },
  methods: {
    ...mapMutations(['updateSavingItem', 'addCustomSaving', 'deleteCustomSaving']),
    handleInput(event, id, field, isCustom) {
      const value = event.target.value
      const numericValue = Number(unformatNumber(value))
      const items = isCustom ? this.customSavingItems : this.savingItems
      const item = items.find(i => i.id === id)
      if (item) {
        this.updateSavingItem({
          id,
          monthlyAmount: field === 'monthlyAmount' ? numericValue : Number(unformatNumber(item.monthlyAmount)),
          totalSaved: field === 'totalSaved' ? numericValue : Number(unformatNumber(item.totalSaved)),
          goal: field === 'goal' ? numericValue : Number(unformatNumber(item.goal)),
          isCustom
        })
      }
    },
    handleNewSavingInput(event, field) {
      const value = event.target.value
      this.newSaving[field] = unformatNumber(value)
    },
    addCustomSaving() {
      if (!this.newSaving.name.trim()) {
        alert('Por favor, ingrese un nombre para el ahorro')
        return
      }
      this.$store.commit('addCustomSaving', {
        name: this.newSaving.name,
        monthlyAmount: Number(unformatNumber(this.newSaving.monthlyAmount)) || 0,
        totalSaved: Number(unformatNumber(this.newSaving.totalSaved)) || 0,
        goal: Number(unformatNumber(this.newSaving.goal)) || 0
      })
      this.resetForm()
    },
    deleteCustomSaving(id) {
      if (confirm('¿Está seguro de que desea eliminar este ahorro?')) {
        this.$store.commit('deleteCustomSaving', id)
      }
    },
    cancelAddSaving() {
      this.resetForm()
    },
    resetForm() {
      this.newSaving = {
        name: '',
        monthlyAmount: 0,
        totalSaved: 0,
        goal: 0
      }
      this.showAddForm = false
    },
    formatCurrency,
    formatNumber,
    calculateProgress(current, goal) {
      if (!goal) return 0
      return Math.min(Math.round((Number(current) / Number(goal)) * 100), 100)
    }
  }
}
</script>

<style scoped>
.savings-view {
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

.saving-item {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.saving-item:last-child {
  border-bottom: none;
}

.saving-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.custom-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
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

input[type="number"] {
  width: 100%;
  padding: 0.75rem;
  padding-left: 2rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
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

.progress-container {
  margin-top: 0.5rem;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.progress.complete {
  background: #2e7d32;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
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

.summary-item .value.danger {
  color: #d32f2f;
}

.summary-item .value.warning {
  color: #f57c00;
}

.summary-item .value.success {
  color: #2e7d32;
}

@media (max-width: 768px) {
  .savings-view {
    padding: 0.5rem;
  }

  .card {
    padding: 1rem;
  }

  .saving-details {
    grid-template-columns: 1fr;
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

  .saving-item {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .progress-container {
    margin-top: 1rem;
  }
}

.number-input {
  text-align: right;
  padding-right: 0.75rem !important;
}
</style> 