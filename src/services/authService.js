import { auth } from '../firebase/config'

export const authService = {
  // Registrar un nuevo usuario
  async register(email, password) {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password)
      return {
        uid: user.uid,
        email: user.email
      }
    } catch (error) {
      console.error('Error in registration:', error)
      throw error
    }
  },

  // Iniciar sesión
  async login(email, password) {
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password)
      return {
        uid: user.uid,
        email: user.email
      }
    } catch (error) {
      console.error('Error in login:', error)
      throw error
    }
  },

  // Cerrar sesión
  async logout() {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Error in logout:', error)
      throw error
    }
  },

  // Obtener el usuario actual
  getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe()
        if (user) {
          resolve({
            uid: user.uid,
            email: user.email
          })
        } else {
          resolve(null)
        }
      })
    })
  },

  // Actualizar perfil de usuario
  async updateUserProfile(displayName) {
    try {
      const user = auth.currentUser
      if (user) {
        await user.updateProfile({
          displayName
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
} 