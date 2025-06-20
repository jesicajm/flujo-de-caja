import { cashFlowService } from '@/services/cashFlowService'

const state = {
  cashFlows: [],
  loading: false,
  error: null
}

const mutations = {
  setCashFlows(state, cashFlows) {
    state.cashFlows = cashFlows
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchUserCashFlows({ commit, rootState }) {
    try {
      const userId = rootState.auth.user.uid
      commit('setLoading', true)
      console.log('🔄 Cargando flujos de caja del usuario...')
      
      const cashFlows = await cashFlowService.getUserCashFlows(userId)
      console.log('📊 Flujos de caja cargados:', cashFlows)
      
      commit('setCashFlows', cashFlows)
      commit('setLoading', false)
    } catch (error) {
      console.error('❌ Error al cargar flujos de caja:', error)
      commit('setError', error.message)
      commit('setLoading', false)
      throw error
    }
  },

  async createCashFlow({ commit, state }, { userId, cashFlowData }) {
    try {
      commit('setLoading', true)
      console.log('➕ Creando nuevo flujo de caja:', { userId, cashFlowData })
      
      const newCashFlow = await cashFlowService.createCashFlow(userId, cashFlowData)
      console.log('✅ Flujo de caja creado:', newCashFlow)
      
      commit('setCashFlows', [...state.cashFlows, newCashFlow])
      commit('setLoading', false)
    } catch (error) {
      console.error('❌ Error al crear flujo de caja:', error)
      commit('setError', error.message)
      commit('setLoading', false)
      throw error
    }
  },

  async updateCashFlow({ commit, state }, { cashFlowId, updateData }) {
    try {
      commit('setLoading', true)
      console.log('🔄 Actualizando flujo de caja:', { cashFlowId, updateData })
      
      const updatedCashFlow = await cashFlowService.updateCashFlow(cashFlowId, updateData)
      console.log('✅ Flujo de caja actualizado:', updatedCashFlow)
      
      const updatedCashFlows = state.cashFlows.map(cf => 
        cf.id === cashFlowId ? updatedCashFlow : cf
      )
      commit('setCashFlows', updatedCashFlows)
      commit('setLoading', false)
    } catch (error) {
      console.error('❌ Error al actualizar flujo de caja:', error)
      commit('setError', error.message)
      commit('setLoading', false)
      throw error
    }
  },

  async deleteCashFlow({ commit, state }, cashFlowId) {
    try {
      commit('setLoading', true)
      console.log('🗑️ Eliminando flujo de caja:', cashFlowId)
      
      await cashFlowService.deleteCashFlow(cashFlowId)
      console.log('✅ Flujo de caja eliminado')
      
      const updatedCashFlows = state.cashFlows.filter(cf => cf.id !== cashFlowId)
      commit('setCashFlows', updatedCashFlows)
      commit('setLoading', false)
    } catch (error) {
      console.error('❌ Error al eliminar flujo de caja:', error)
      commit('setError', error.message)
      commit('setLoading', false)
      throw error
    }
  }
}

const getters = {
  allCashFlows: state => state.cashFlows,
  loading: state => state.loading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 