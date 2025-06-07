import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'calculadora-flujo-caja',
  reducer: state => ({
    financialData: state.financialData
  })
})

export default new Vuex.Store({
  state: {
    financialData: {
      incomes: {
        items: [
          { id: 1, name: 'Salario/Sueldo Principal', amount: 0 },
          { id: 2, name: 'Ingresos por Freelance/Consultoría', amount: 0 },
          { id: 3, name: 'Ingresos de Negocio Propio', amount: 0 },
          { id: 4, name: 'Ingresos por Inversiones', amount: 0 }
        ],
        customItems: []
      },
      expenses: {
        fixed: {
          items: [
            { id: 1, name: 'Arriendo/Hipoteca', amount: 0 },
            { id: 2, name: 'Servicios Públicos', amount: 0 },
            { id: 3, name: 'Alimentación', amount: 0 },
            { id: 4, name: 'Transporte', amount: 0 },
            { id: 5, name: 'Seguros', amount: 0 }
          ],
          customItems: []
        },
        variable: {
          items: [
            { id: 1, name: 'Entretenimiento', amount: 0 },
            { id: 2, name: 'Ropa y Accesorios', amount: 0 },
            { id: 3, name: 'Gastos de Salud', amount: 0 },
            { id: 4, name: 'Educación/Cursos', amount: 0 }
          ],
          customItems: []
        }
      },
      debts: {
        items: [
          { id: 1, name: 'Tarjetas de Crédito', monthlyPayment: 0, totalDebt: 0, interestRate: 0 },
          { id: 2, name: 'Préstamo Personal', monthlyPayment: 0, totalDebt: 0, interestRate: 0 },
          { id: 3, name: 'Crédito Vehículo', monthlyPayment: 0, totalDebt: 0, interestRate: 0 }
        ],
        customItems: []
      },
      savings: {
        items: [
          { id: 1, name: 'Ahorro de Emergencia', monthlyAmount: 0, totalSaved: 0, goal: 0 },
          { id: 2, name: 'Inversiones Mensuales', monthlyAmount: 0, totalSaved: 0, goal: 0 },
          { id: 3, name: 'Pensión Voluntaria', monthlyAmount: 0, totalSaved: 0, goal: 0 }
        ],
        customItems: []
      }
    }
  },
  mutations: {
    updateIncomeItem(state, { id, amount, isCustom }) {
      const collection = isCustom ? state.financialData.incomes.customItems : state.financialData.incomes.items
      const item = collection.find(item => item.id === id)
      if (item) item.amount = amount
    },
    addCustomIncome(state, { name, amount }) {
      const newId = state.financialData.incomes.customItems.length + 1
      state.financialData.incomes.customItems.push({
        id: newId,
        name,
        amount
      })
    },
    deleteCustomIncome(state, { id }) {
      state.financialData.incomes.customItems = state.financialData.incomes.customItems.filter(item => item.id !== id)
    },
    updateExpenseItem(state, { id, amount, type, isCustom }) {
      const collection = isCustom 
        ? state.financialData.expenses[type].customItems 
        : state.financialData.expenses[type].items
      const item = collection.find(item => item.id === id)
      if (item) item.amount = amount
    },
    addCustomExpense(state, { name, amount, type }) {
      const collection = state.financialData.expenses[type].customItems
      const newId = collection.length + 1
      collection.push({
        id: newId,
        name,
        amount
      })
    },
    deleteCustomExpense(state, { id, type }) {
      state.financialData.expenses[type].customItems = state.financialData.expenses[type].customItems.filter(item => item.id !== id)
    },
    updateDebtItem(state, { id, monthlyPayment, totalDebt, interestRate, isCustom }) {
      const collection = isCustom ? state.financialData.debts.customItems : state.financialData.debts.items
      const item = collection.find(item => item.id === id)
      if (item) {
        item.monthlyPayment = Number(monthlyPayment)
        item.totalDebt = Number(totalDebt)
        item.interestRate = Number(interestRate)
      }
    },
    addCustomDebt(state, { name, monthlyPayment, totalDebt, interestRate }) {
      const newId = state.financialData.debts.customItems.length + 1
      state.financialData.debts.customItems.push({
        id: newId,
        name,
        monthlyPayment,
        totalDebt,
        interestRate
      })
    },
    deleteCustomDebt(state, { id }) {
      state.financialData.debts.customItems = state.financialData.debts.customItems.filter(item => item.id !== id)
    },
    updateSavingItem(state, { id, monthlyAmount, totalSaved, goal, isCustom }) {
      const collection = isCustom ? state.financialData.savings.customItems : state.financialData.savings.items
      const item = collection.find(item => item.id === id)
      if (item) {
        item.monthlyAmount = monthlyAmount
        item.totalSaved = totalSaved
        item.goal = goal
      }
    },
    addCustomSaving(state, { name, monthlyAmount, totalSaved, goal }) {
      const newId = state.financialData.savings.customItems.length + 1
      state.financialData.savings.customItems.push({
        id: newId,
        name,
        monthlyAmount,
        totalSaved,
        goal
      })
    },
    deleteCustomSaving(state, { id }) {
      state.financialData.savings.customItems = state.financialData.savings.customItems.filter(item => item.id !== id)
    },
    resetAllData(state) {
      Object.assign(state.financialData, {
        incomes: {
          items: state.financialData.incomes.items.map(item => ({ ...item, amount: 0 })),
          customItems: []
        },
        expenses: {
          fixed: {
            items: state.financialData.expenses.fixed.items.map(item => ({ ...item, amount: 0 })),
            customItems: []
          },
          variable: {
            items: state.financialData.expenses.variable.items.map(item => ({ ...item, amount: 0 })),
            customItems: []
          }
        },
        debts: {
          items: state.financialData.debts.items.map(item => ({ 
            ...item, 
            monthlyPayment: 0,
            totalDebt: 0,
            interestRate: 0
          })),
          customItems: []
        },
        savings: {
          items: state.financialData.savings.items.map(item => ({
            ...item,
            monthlyAmount: 0,
            totalSaved: 0,
            goal: 0
          })),
          customItems: []
        }
      })
    }
  },
  actions: {
    updateFinancialData({ commit }, payload) {
      if (payload.income) {
        commit('updateIncomeItem', payload.income)
      }
      if (payload.expenses) {
        commit('updateExpenseItem', payload.expenses)
      }
      if (payload.debts) {
        commit('updateDebtItem', payload.debts)
      }
      if (payload.savings) {
        commit('updateSavingItem', payload.savings)
      }
    }
  },
  getters: {
    totalIncome: state => {
      const regularIncome = state.financialData.incomes.items.reduce((sum, item) => sum + item.amount, 0)
      const customIncome = state.financialData.incomes.customItems.reduce((sum, item) => sum + item.amount, 0)
      return regularIncome + customIncome
    },
    totalFixedExpenses: state => {
      const fixedItems = state.financialData.expenses.fixed.items
      const customFixedItems = state.financialData.expenses.fixed.customItems
      
      const fixedTotal = fixedItems.reduce((sum, item) => sum + Number(item.amount), 0)
      const customFixedTotal = customFixedItems.reduce((sum, item) => sum + Number(item.amount), 0)
      
      return fixedTotal + customFixedTotal
    },
    totalVariableExpenses: state => {
      const variableItems = state.financialData.expenses.variable.items
      const customVariableItems = state.financialData.expenses.variable.customItems
      
      const variableTotal = variableItems.reduce((sum, item) => sum + Number(item.amount), 0)
      const customVariableTotal = customVariableItems.reduce((sum, item) => sum + Number(item.amount), 0)
      
      return variableTotal + customVariableTotal
    },
    totalExpenses: (state, getters) => {
      return getters.totalFixedExpenses + getters.totalVariableExpenses
    },
    totalMonthlyDebtPayments: state => {
      const regularPayments = state.financialData.debts.items.reduce((sum, item) => sum + Number(item.monthlyPayment), 0)
      const customPayments = state.financialData.debts.customItems.reduce((sum, item) => sum + Number(item.monthlyPayment), 0)
      return regularPayments + customPayments
    },
    totalDebt: state => {
      const regularDebt = state.financialData.debts.items.reduce((sum, item) => sum + Number(item.totalDebt), 0)
      const customDebt = state.financialData.debts.customItems.reduce((sum, item) => sum + Number(item.totalDebt), 0)
      return regularDebt + customDebt
    },
    totalMonthlySavings: state => {
      const regularSavings = state.financialData.savings.items.reduce((sum, item) => sum + item.monthlyAmount, 0)
      const customSavings = state.financialData.savings.customItems.reduce((sum, item) => sum + item.monthlyAmount, 0)
      return regularSavings + customSavings
    },
    totalSaved: state => {
      const regularSaved = state.financialData.savings.items.reduce((sum, item) => sum + item.totalSaved, 0)
      const customSaved = state.financialData.savings.customItems.reduce((sum, item) => sum + item.totalSaved, 0)
      return regularSaved + customSaved
    },
    savingsGoalProgress: state => {
      const totalGoal = state.financialData.savings.items.reduce((sum, item) => sum + item.goal, 0) +
                       state.financialData.savings.customItems.reduce((sum, item) => sum + item.goal, 0)
      return totalGoal > 0 ? Math.round((state.getters.totalSaved / totalGoal) * 100) : 0
    },
    netCashFlow: (state, getters) => {
      return getters.totalIncome - getters.totalFixedExpenses - 
             getters.totalVariableExpenses - getters.totalMonthlyDebtPayments
    },
    savingsRate: (state, getters) => {
      return getters.totalIncome ? Math.round((getters.totalMonthlySavings / getters.totalIncome) * 100) : 0
    },
    debtToIncomeRatio: (state, getters) => {
      const annualIncome = getters.totalIncome * 12
      return annualIncome > 0 ? Math.round((getters.totalDebt / annualIncome) * 100) : 0
    },
    fixedExpensesRatio: (state, getters) => {
      return getters.totalIncome ? Math.round((getters.totalFixedExpenses / getters.totalIncome) * 100) : 0
    },
    financialScore: (state, getters) => {
      let score = 100

      if (getters.debtToIncomeRatio > 40) score -= 30
      else if (getters.debtToIncomeRatio > 30) score -= 20
      else if (getters.debtToIncomeRatio > 20) score -= 10

      if (getters.savingsRate < 10) score -= 30
      else if (getters.savingsRate < 15) score -= 20
      else if (getters.savingsRate < 20) score -= 10

      if (getters.fixedExpensesRatio > 60) score -= 30
      else if (getters.fixedExpensesRatio > 50) score -= 20
      else if (getters.fixedExpensesRatio > 40) score -= 10

      if (getters.netCashFlow < 0) score -= 20

      return Math.max(0, Math.min(100, score))
    }
  },
  plugins: [vuexLocal.plugin]
}) 