import { authService } from '@/services/authService'

const state = {
  user: null,
  loading: false,
  error: null
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  }
}

const actions = {
  async register({ commit }, { email, password }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    try {
      const user = await authService.register(email, password)
      commit('SET_USER', user)
      return user
    } catch (error) {
      commit('SET_ERROR', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async login({ commit }, { email, password }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    try {
      const user = await authService.login(email, password)
      commit('SET_USER', user)
      return user
    } catch (error) {
      commit('SET_ERROR', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async logout({ commit }) {
    try {
      await authService.logout()
      commit('SET_USER', null)
    } catch (error) {
      commit('SET_ERROR', error)
      throw error
    }
  },

  async checkAuth({ commit }) {
    try {
      const user = await authService.getCurrentUser()
      commit('SET_USER', user)
      return user
    } catch (error) {
      commit('SET_ERROR', error)
      throw error
    }
  }
}

const getters = {
  isAuthenticated: state => !!state.user,
  currentUser: state => state.user,
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