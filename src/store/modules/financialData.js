import { financialDataService } from '@/services/financialDataService'

const state = {
  expenses: {
    fixed: {
      items: [
        { id: 'rent', name: 'Alquiler/Hipoteca', amount: 0 },
        { id: 'utilities', name: 'Servicios Públicos', amount: 0 },
        { id: 'insurance', name: 'Seguros', amount: 0 }
      ],
      customItems: []
    },
    variable: {
      items: [
        { id: 'food', name: 'Alimentación', amount: 0 },
        { id: 'transport', name: 'Transporte', amount: 0 },
        { id: 'entertainment', name: 'Entretenimiento', amount: 0 }
      ],
      customItems: []
    }
  },
  debts: {
    items: [
      { id: 'creditCard', name: 'Tarjeta de Crédito', monthlyPayment: 0, totalDebt: 0, interestRate: 0 },
      { id: 'personalLoan', name: 'Préstamo Personal', monthlyPayment: 0, totalDebt: 0, interestRate: 0 }
    ],
    customItems: []
  },
  incomes: {
    items: [
      { id: 'salary', name: 'Salario', amount: 0 },
      { id: 'investments', name: 'Inversiones', amount: 0 }
    ],
    customItems: []
  },
  savings: {
    items: [
      { id: 'emergency', name: 'Fondo de Emergencia', monthlyAmount: 0, totalSaved: 0, goal: 0 },
      { id: 'retirement', name: 'Jubilación', monthlyAmount: 0, totalSaved: 0, goal: 0 }
    ],
    customItems: []
  },
  loading: false,
  error: null
}

const mutations = {
  setFinancialData(state, data) {
    Object.assign(state, data)
  },

  setLoading(state, loading) {
    state.loading = loading
  },

  setError(state, error) {
    state.error = error
  },

  updateExpenseItem(state, { id, amount, type, isCustom }) {
    const items = isCustom ? state.expenses[type].customItems : state.expenses[type].items
    const item = items.find(i => i.id === id)
    if (item) {
      item.amount = amount
    }
  },

  addCustomExpense(state, { name, amount, type }) {
    const id = Date.now().toString()
    state.expenses[type].customItems.push({ id, name, amount })
  },

  deleteCustomExpense(state, { id, type }) {
    state.expenses[type].customItems = state.expenses[type].customItems.filter(item => item.id !== id)
  },

  updateDebtItem(state, { id, monthlyPayment, totalDebt, interestRate, isCustom }) {
    const items = isCustom ? state.debts.customItems : state.debts.items
    const item = items.find(i => i.id === id)
    if (item) {
      item.monthlyPayment = monthlyPayment
      item.totalDebt = totalDebt
      item.interestRate = interestRate
    }
  },

  addCustomDebt(state, { name, monthlyPayment, totalDebt, interestRate }) {
    const id = Date.now().toString()
    state.debts.customItems.push({ id, name, monthlyPayment, totalDebt, interestRate })
  },

  deleteCustomDebt(state, { id }) {
    state.debts.customItems = state.debts.customItems.filter(item => item.id !== id)
  },

  updateIncomeItem(state, { id, amount, isCustom }) {
    const items = isCustom ? state.incomes.customItems : state.incomes.items
    const item = items.find(i => i.id === id)
    if (item) {
      item.amount = amount
    }
  },

  addCustomIncome(state, { name, amount }) {
    const id = Date.now().toString()
    state.incomes.customItems.push({ id, name, amount })
  },

  deleteCustomIncome(state, id) {
    state.incomes.customItems = state.incomes.customItems.filter(item => item.id !== id)
  },

  updateSavingItem(state, { id, monthlyAmount, totalSaved, goal, isCustom }) {
    const items = isCustom ? state.savings.customItems : state.savings.items
    const item = items.find(i => i.id === id)
    if (item) {
      item.monthlyAmount = monthlyAmount
      item.totalSaved = totalSaved
      item.goal = goal
    }
  },

  addCustomSaving(state, { name, monthlyAmount, totalSaved, goal }) {
    const id = Date.now().toString()
    state.savings.customItems.push({ id, name, monthlyAmount, totalSaved, goal })
  },

  deleteCustomSaving(state, id) {
    state.savings.customItems = state.savings.customItems.filter(item => item.id !== id)
  }
}

const actions = {
  async fetchFinancialData({ commit }, userId) {
    commit('setLoading', true)
    try {
      const data = await financialDataService.getFinancialData(userId)
      commit('setFinancialData', data)
    } catch (error) {
      commit('setError', error.message)
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async updateExpenseItem({ commit, rootState }, payload) {
    try {
      const userId = rootState.auth.user.uid
      console.log('🔄 Actualizando gasto:', { payload, userId })
      
      // Obtener los datos actuales de Firestore
      const currentData = await financialDataService.getFinancialData(userId)
      console.log('📊 Datos actuales antes de actualizar:', currentData.expenses?.[payload.type])
      
      // Determinar si es un item personalizado o predefinido
      const targetArray = payload.isCustom ? 'customItems' : 'items'
      const currentItems = currentData.expenses?.[payload.type]?.[targetArray] || []
      
      // Actualizar el item específico
      const updatedItems = currentItems.map(item => 
        item.id === payload.id 
          ? { ...item, amount: payload.amount }
          : item
      )
      
      console.log('📊 Items actualizados:', updatedItems)
      
      // Actualizar en Firestore
      await financialDataService.updateFinancialSection(
        userId,
        'expenses',
        { 
          ...currentData.expenses,
          [payload.type]: {
            ...currentData.expenses?.[payload.type],
            [targetArray]: updatedItems
          }
        }
      )
      
      console.log('✅ Gasto actualizado en Firestore, actualizando estado local')
      commit('updateExpenseItem', payload)
    } catch (error) {
      console.error('❌ Error al actualizar gasto:', error)
      commit('setError', error.message)
      throw error
    }
  },

  async addCustomExpense({ commit, rootState }, payload) {
    try {
      const userId = rootState.auth.user.uid
      console.log('➕ Agregando gasto personalizado:', { payload, userId })
      
      const newItem = {
        id: Date.now().toString(),
        name: payload.name,
        amount: payload.amount
      }
      console.log('📝 Nuevo gasto creado:', newItem)
      
      // Obtener los datos actuales de Firestore
      const currentData = await financialDataService.getFinancialData(userId)
      console.log('📊 Datos actuales antes de agregar:', currentData.expenses?.[payload.type]?.customItems)
      
      const updatedCustomItems = [...(currentData.expenses?.[payload.type]?.customItems || []), newItem]
      console.log('📊 Datos después de agregar:', updatedCustomItems)
      
      // Actualizar en Firestore
      await financialDataService.updateFinancialSection(
        userId,
        'expenses',
        { 
          ...currentData.expenses,
          [payload.type]: {
            ...currentData.expenses?.[payload.type],
            customItems: updatedCustomItems
          }
        }
      )
      
      console.log('✅ Gasto agregado a Firestore, actualizando estado local')
      commit('addCustomExpense', { ...payload, id: newItem.id })
    } catch (error) {
      console.error('❌ Error al agregar gasto personalizado:', error)
      commit('setError', error.message)
      throw error
    }
  },

  async deleteCustomExpense({ commit, rootState }, { id, type }) {
    try {
      const userId = rootState.auth.user.uid
      console.log('🗑️ Eliminando gasto personalizado:', { id, type, userId })
      
      // Obtener los datos actuales de Firestore
      const currentData = await financialDataService.getFinancialData(userId)
      console.log('📊 Datos actuales antes de eliminar:', currentData.expenses?.[type]?.customItems)
      
      const updatedCustomItems = (currentData.expenses?.[type]?.customItems || []).filter(item => item.id !== id)
      console.log('📊 Datos después de filtrar:', updatedCustomItems)
      
      // Actualizar en Firestore
      await financialDataService.updateFinancialSection(
        userId,
        'expenses',
        { 
          ...currentData.expenses,
          [type]: {
            ...currentData.expenses?.[type],
            customItems: updatedCustomItems
          }
        }
      )
      
      console.log('✅ Gasto eliminado de Firestore, actualizando estado local')
      commit('deleteCustomExpense', { id, type })
    } catch (error) {
      console.error('❌ Error al eliminar gasto personalizado:', error)
      commit('setError', error.message)
      throw error
    }
  },

  async updateIncomeItem({ commit, rootState }, payload) {
    try {
      const userId = rootState.auth.user.uid
      await financialDataService.updateFinancialItem(
        userId,
        'incomes',
        payload.isCustom ? 'customItems' : 'items',
        payload.id,
        { amount: payload.amount }
      )
      commit('updateIncomeItem', payload)
    } catch (error) {
      commit('setError', error.message)
      throw error
    }
  },

  async addCustomIncome({ commit, rootState }, payload) {
    try {
      const userId = rootState.auth.user.uid
      console.log('➕ Agregando ingreso personalizado:', { payload, userId })
      
      const newItem = {
        id: Date.now().toString(),
        name: payload.name,
        amount: payload.amount
      }
      console.log('📝 Nuevo item creado:', newItem)
      
      // Obtener los datos actuales de Firestore
      const currentData = await financialDataService.getFinancialData(userId)
      console.log('📊 Datos actuales antes de agregar:', currentData.incomes?.customItems)
      
      const updatedCustomItems = [...(currentData.incomes?.customItems || []), newItem]
      console.log('📊 Datos después de agregar:', updatedCustomItems)
      
      // Actualizar en Firestore
      await financialDataService.updateFinancialSection(
        userId,
        'incomes',
        { ...currentData.incomes, customItems: updatedCustomItems }
      )
      
      console.log('✅ Ingreso agregado a Firestore, actualizando estado local')
      commit('addCustomIncome', { ...payload, id: newItem.id })
    } catch (error) {
      console.error('❌ Error al agregar ingreso personalizado:', error)
      commit('setError', error.message)
      throw error
    }
  },

  async deleteCustomIncome({ commit, rootState }, id) {
    try {
      const userId = rootState.auth.user.uid
      console.log('🗑️ Eliminando ingreso personalizado:', { id, userId })
      
      // Obtener los datos actuales de Firestore
      const currentData = await financialDataService.getFinancialData(userId)
      console.log('📊 Datos actuales antes de eliminar:', currentData.incomes?.customItems)
      
      const updatedCustomItems = (currentData.incomes?.customItems || []).filter(item => item.id !== id)
      console.log('📊 Datos después de filtrar:', updatedCustomItems)
      
      // Actualizar en Firestore
      await financialDataService.updateFinancialSection(
        userId,
        'incomes',
        { ...currentData.incomes, customItems: updatedCustomItems }
      )
      
      console.log('✅ Ingreso eliminado de Firestore, actualizando estado local')
      commit('deleteCustomIncome', id)
    } catch (error) {
      console.error('❌ Error al eliminar ingreso personalizado:', error)
      commit('setError', error.message)
      throw error
    }
  },

  // Acciones similares para deudas y ahorros...
}

const getters = {
  totalFixedExpenses: state => {
    const fixedItems = state.expenses.fixed.items.reduce((sum, item) => sum + Number(item.amount), 0)
    const customFixedItems = state.expenses.fixed.customItems.reduce((sum, item) => sum + Number(item.amount), 0)
    return fixedItems + customFixedItems
  },

  totalVariableExpenses: state => {
    const variableItems = state.expenses.variable.items.reduce((sum, item) => sum + Number(item.amount), 0)
    const customVariableItems = state.expenses.variable.customItems.reduce((sum, item) => sum + Number(item.amount), 0)
    return variableItems + customVariableItems
  },

  totalMonthlyDebtPayments: state => {
    const debtPayments = state.debts.items.reduce((sum, item) => sum + Number(item.monthlyPayment), 0)
    const customDebtPayments = state.debts.customItems.reduce((sum, item) => sum + Number(item.monthlyPayment), 0)
    return debtPayments + customDebtPayments
  },

  totalDebt: state => {
    const debts = state.debts.items.reduce((sum, item) => sum + Number(item.totalDebt), 0)
    const customDebts = state.debts.customItems.reduce((sum, item) => sum + Number(item.totalDebt), 0)
    return debts + customDebts
  },

  totalIncome: state => {
    const incomes = state.incomes.items.reduce((sum, item) => sum + Number(item.amount), 0)
    const customIncomes = state.incomes.customItems.reduce((sum, item) => sum + Number(item.amount), 0)
    return incomes + customIncomes
  },

  totalMonthlySavings: state => {
    const savings = state.savings.items.reduce((sum, item) => sum + Number(item.monthlyAmount), 0)
    const customSavings = state.savings.customItems.reduce((sum, item) => sum + Number(item.monthlyAmount), 0)
    return savings + customSavings
  },

  totalSaved: state => {
    const saved = state.savings.items.reduce((sum, item) => sum + Number(item.totalSaved), 0)
    const customSaved = state.savings.customItems.reduce((sum, item) => sum + Number(item.totalSaved), 0)
    return saved + customSaved
  },

  savingsRate: (state, getters) => {
    return getters.totalIncome ? Math.round((getters.totalMonthlySavings / getters.totalIncome) * 100) : 0
  },

  debtToIncomeRatio: (state, getters) => {
    const annualIncome = getters.totalIncome * 12
    return annualIncome ? Math.round((getters.totalDebt / annualIncome) * 100) : 0
  },

  fixedExpensesRatio: (state, getters) => {
    return getters.totalIncome ? Math.round((getters.totalFixedExpenses / getters.totalIncome) * 100) : 0
  },

  netCashFlow: (state, getters) => {
    return getters.totalIncome - getters.totalFixedExpenses - getters.totalVariableExpenses - 
           getters.totalMonthlyDebtPayments - getters.totalMonthlySavings
  },

  financialScore: (state, getters) => {
    let score = 100

    // Penalize high debt-to-income ratio
    if (getters.debtToIncomeRatio > 40) score -= 30
    else if (getters.debtToIncomeRatio > 30) score -= 15

    // Penalize low savings rate
    if (getters.savingsRate < 10) score -= 20
    else if (getters.savingsRate < 20) score -= 10

    // Penalize high fixed expenses ratio
    if (getters.fixedExpensesRatio > 50) score -= 20
    else if (getters.fixedExpensesRatio > 40) score -= 10

    // Penalize negative cash flow
    if (getters.netCashFlow < 0) score -= 30

    return Math.max(0, Math.min(100, score))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 