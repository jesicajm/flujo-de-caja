<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Panel de Control - Flujos de Caja</h1>
      <div class="user-actions">
        <span>{{ currentUser.email }}</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </header>

    <div class="dashboard-content">
      <div class="actions-bar">
        <button @click="showNewCashFlowForm = true" class="new-btn">
          Nuevo Flujo de Caja
        </button>
      </div>

      <div v-if="loading" class="loading">
        Cargando...
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else class="cash-flows-list">
        <div v-if="allCashFlows.length === 0" class="no-data">
          No hay flujos de caja registrados. ¡Crea uno nuevo!
        </div>
        
        <div v-else class="cash-flow-cards">
          <div v-for="cashFlow in allCashFlows" :key="cashFlow.id" class="cash-flow-card">
            <h3>{{ cashFlow.title }}</h3>
            <p class="date">Creado: {{ formatDate(cashFlow.createdAt) }}</p>
            <div class="card-actions">
              <button @click="viewCashFlow(cashFlow)" class="view-btn">Ver</button>
              <button @click="editCashFlow(cashFlow)" class="edit-btn">Editar</button>
              <button @click="confirmDelete(cashFlow)" class="delete-btn">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para nuevo/editar flujo de caja -->
    <div v-if="showNewCashFlowForm" class="modal">
      <div class="modal-content">
        <h2>{{ editingCashFlow ? 'Editar' : 'Nuevo' }} Flujo de Caja</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">Título</label>
            <input
              type="text"
              id="title"
              v-model="cashFlowForm.title"
              required
            >
          </div>

          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea
              id="description"
              v-model="cashFlowForm.description"
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeForm" class="cancel-btn">
              Cancelar
            </button>
            <button type="submit" class="save-btn">
              {{ editingCashFlow ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserDashboard',
  data() {
    return {
      showNewCashFlowForm: false,
      editingCashFlow: null,
      cashFlowForm: {
        title: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('cashFlow', ['allCashFlows', 'loading', 'error'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('cashFlow', [
      'fetchUserCashFlows',
      'createCashFlow',
      'updateCashFlow',
      'deleteCashFlow'
    ]),

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    async handleSubmit() {
      try {
        if (this.editingCashFlow) {
          await this.updateCashFlow({
            cashFlowId: this.editingCashFlow.id,
            updateData: this.cashFlowForm
          })
        } else {
          await this.createCashFlow({
            userId: this.currentUser.uid,
            cashFlowData: this.cashFlowForm
          })
        }
        this.closeForm()
        this.fetchUserCashFlows(this.currentUser.uid)
      } catch (error) {
        console.error('Error al guardar el flujo de caja:', error)
      }
    },

    editCashFlow(cashFlow) {
      this.editingCashFlow = cashFlow
      this.cashFlowForm = { ...cashFlow }
      this.showNewCashFlowForm = true
    },

    viewCashFlow(cashFlow) {
      this.$router.push(`/cash-flow/${cashFlow.id}`)
    },

    async confirmDelete(cashFlow) {
      if (confirm('¿Estás seguro de que deseas eliminar este flujo de caja?')) {
        try {
          await this.deleteCashFlow(cashFlow.id)
          this.fetchUserCashFlows(this.currentUser.uid)
        } catch (error) {
          console.error('Error al eliminar el flujo de caja:', error)
        }
      }
    },

    closeForm() {
      this.showNewCashFlowForm = false
      this.editingCashFlow = null
      this.cashFlowForm = {
        title: '',
        description: ''
      }
    }
  },
  async created() {
    if (this.currentUser) {
      await this.fetchUserCashFlows(this.currentUser.uid)
    } else {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.actions-bar {
  margin-bottom: 2rem;
}

.new-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cash-flow-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.cash-flow-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.view-btn, .edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.view-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn {
  background-color: #FFC107;
  color: black;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
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
  margin-bottom: 1rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.date {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style> 