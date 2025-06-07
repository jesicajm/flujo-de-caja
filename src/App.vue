<template>
  <div id="app">
    <header class="app-header">
      <h1>Calculadora de Flujo de Caja</h1>
      <nav class="main-nav">
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/ingresos" class="nav-link">Ingresos</router-link>
        <router-link to="/gastos" class="nav-link">Gastos</router-link>
        <router-link to="/deudas" class="nav-link">Deudas</router-link>
        <router-link to="/ahorros" class="nav-link">Ahorros</router-link>
        <router-link to="/analisis" class="nav-link">Análisis</router-link>
      </nav>
    </header>
    
    <main class="app-content">
      <router-view></router-view>
    </main>

    <footer class="app-footer">
      <p>&copy; 2024 Calculadora de Flujo de Caja</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  --primary-color: #1976d2;
  --background-color: #f5f5f5;
  --text-color: #333;
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--primary-color);
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: var(--box-shadow);
}

.app-header h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.main-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.app-content {
  flex: 1;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  margin-top: 2rem;
}

h1, h2, h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.2rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.5rem;
  }

  .main-nav {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-link {
    text-align: center;
    padding: 0.75rem;
    margin: 0.2rem 0;
  }

  .app-content {
    padding: 1rem 0.5rem;
  }
}

/* Form styles */
.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

@media (max-width: 480px) {
  input {
    padding: 0.5rem;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Card styles */
.card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1rem;
}

@media (max-width: 480px) {
  .card {
    padding: 1rem;
  }
}
</style>
