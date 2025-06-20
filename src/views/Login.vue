<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="correo@ejemplo.com"
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="********"
            :disabled="isLoading"
          >
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading || !isFormValid">
          {{ isLoading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Ingresar') }}
        </button>

        <p class="toggle-form">
          {{ isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?' }}
          <a href="#" @click.prevent="toggleForm" :class="{ disabled: isLoading }">
            {{ isRegister ? 'Inicia sesión' : 'Regístrate' }}
          </a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      isRegister: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  computed: {
    isFormValid() {
      return this.email && this.password && this.password.length >= 6
    }
  },
  methods: {
    ...mapActions('auth', ['login', 'register']),
    
    async handleSubmit() {
      if (!this.isFormValid) return

      this.isLoading = true
      this.errorMessage = ''

      try {
        if (this.isRegister) {
          await this.register({ email: this.email, password: this.password })
        } else {
          await this.login({ email: this.email, password: this.password })
        }
        
        // Redirigir al usuario
        const redirectPath = this.$route.query.redirect || '/dashboard'
        await this.$router.push(redirectPath)
      } catch (error) {
        console.error('Error en autenticación:', error)
        this.errorMessage = this.getErrorMessage(error)
      } finally {
        this.isLoading = false
      }
    },
    
    toggleForm() {
      if (this.isLoading) return
      this.isRegister = !this.isRegister
      this.email = ''
      this.password = ''
      this.errorMessage = ''
    },

    getErrorMessage(error) {
      const errorCode = error.code || ''
      switch (errorCode) {
        case 'auth/email-already-in-use':
          return 'Este correo electrónico ya está registrado'
        case 'auth/invalid-email':
          return 'Correo electrónico inválido'
        case 'auth/operation-not-allowed':
          return 'Operación no permitida'
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres'
        case 'auth/user-disabled':
          return 'Esta cuenta ha sido deshabilitada'
        case 'auth/user-not-found':
          return 'No existe una cuenta con este correo electrónico'
        case 'auth/wrong-password':
          return 'Contraseña incorrecta'
        default:
          return error.message || 'Ha ocurrido un error. Por favor, intenta nuevamente'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  color: #333;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  font-size: 0.875rem;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
  text-align: center;
}

.toggle-form {
  text-align: center;
  margin-top: 1rem;
}

.toggle-form a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: bold;
}

.toggle-form a.disabled {
  color: #ccc;
  cursor: not-allowed;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}
</style> 