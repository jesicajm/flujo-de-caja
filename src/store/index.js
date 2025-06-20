import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import auth from './modules/auth'
import cashFlow from './modules/cashFlow'
import financialData from './modules/financialData'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['auth', 'financialData']
})

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    cashFlow,
    financialData
  },
  plugins: [vuexLocal.plugin]
}) 