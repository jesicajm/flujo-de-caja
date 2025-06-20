<template>
  <div class="cash-flow-detail">
    <div class="header">
      <button @click="$router.push('/dashboard')" class="back-btn">
        ← Volver al Dashboard
      </button>
      <h1>{{ currentCashFlow ? currentCashFlow.title : 'Cargando...' }}</h1>
    </div>

    <div v-if="loading" class="loading">
      Cargando detalles...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="currentCashFlow" class="cash-flow-content">
      <div class="info-section">
        <h2>Información General</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Fecha de Creación</label>
            <span>{{ formatDate(currentCashFlow.createdAt) }}</span>
          </div>
          <div class="info-item">
            <label>Última Actualización</label>
            <span>{{ formatDate(currentCashFlow.updatedAt) }}</span>
          </div>
          <div class="info-item full-width">
            <label>Descripción</label>
            <p>{{ currentCashFlow.description || 'Sin descripción' }}</p>
          </div>
        </div>
      </div>

      <div class="actions-section">
        <button @click="editCashFlow" class="edit-btn">
          Editar Flujo de Caja
        </button>
        <button @click="confirmDelete" class="delete-btn">
          Eliminar Flujo de Caja
        </button>
      </div>

      <!-- Aquí puedes agregar más secciones según necesites, como:
      - Gráficos de ingresos/egresos
      - Lista de transacciones
      - Análisis y métricas
      - etc. -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CashFlowDetail',
  computed: {
    ...mapGetters('cashFlow', ['currentCashFlow', 'loading', 'error'])
  },
  methods: {
    ...mapActions('cashFlow', ['fetchCashFlow', 'deleteCashFlow']),

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    editCashFlow() {
      // Implementar lógica de edición
      console.log('Editar flujo de caja')
    },

    async confirmDelete() {
      if (confirm('¿Estás seguro de que deseas eliminar este flujo de caja?')) {
        try {
          await this.deleteCashFlow(this.currentCashFlow.id)
          this.$router.push('/dashboard')
        } catch (error) {
          console.error('Error al eliminar el flujo de caja:', error)
        }
      }
    }
  },
  async created() {
    const cashFlowId = this.$route.params.id
    if (cashFlowId) {
      await this.fetchCashFlow(cashFlowId)
    }
  }
}
</script>

<style scoped>
.cash-flow-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  color: #2196F3;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  margin-bottom: 1rem;
}

.info-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: bold;
  color: #666;
  margin-bottom: 0.5rem;
}

.actions-section {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.edit-btn, .delete-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.edit-btn {
  background-color: #FFC107;
  color: black;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  color: #f44336;
  padding: 1rem;
  border: 1px solid #f44336;
  border-radius: 4px;
  margin: 1rem 0;
}
</style> 