<template>
  <div class="financial-recommendations">
    <h2>Recomendaciones Personalizadas</h2>
    <div class="recommendations-container">
      <div v-for="(recommendation, index) in recommendations" 
           :key="index" 
           class="recommendation-card"
           :class="recommendation.type">
        <div class="recommendation-icon">
          <i :class="recommendation.icon"></i>
        </div>
        <div class="recommendation-content">
          <h3>{{ recommendation.title }}</h3>
          <p>{{ recommendation.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinancialRecommendations',
  data() {
    return {
      recommendations: [
        {
          title: 'Optimiza tus Gastos',
          description: 'Basado en tu perfil de gastos, considera reducir gastos en categorías no esenciales.',
          type: 'warning',
          icon: 'fas fa-chart-line'
        },
        {
          title: 'Aumenta tus Ahorros',
          description: 'Establece una meta mensual de ahorro del 20% de tus ingresos.',
          type: 'info',
          icon: 'fas fa-piggy-bank'
        },
        {
          title: 'Gestión de Deudas',
          description: 'Prioriza el pago de deudas con mayor tasa de interés.',
          type: 'danger',
          icon: 'fas fa-credit-card'
        },
        {
          title: 'Inversiones',
          description: 'Considera diversificar tus inversiones para optimizar los rendimientos.',
          type: 'success',
          icon: 'fas fa-chart-pie'
        }
      ]
    }
  }
}
</script>

<style scoped>
.financial-recommendations {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recommendations-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.recommendation-card {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: transform 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
}

.recommendation-icon {
  font-size: 1.5em;
  margin-right: 15px;
  padding: 10px;
  border-radius: 50%;
  background: #e3f2fd;
  color: #1976d2;
}

.recommendation-content {
  flex: 1;
}

.recommendation-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.recommendation-content p {
  margin: 0;
  color: #666;
  line-height: 1.4;
}

.recommendation-card.warning .recommendation-icon {
  background: #fff3e0;
  color: #f57c00;
}

.recommendation-card.danger .recommendation-icon {
  background: #ffebee;
  color: #c62828;
}

.recommendation-card.success .recommendation-icon {
  background: #e8f5e9;
  color: #2e7d32;
}

.recommendation-card.info .recommendation-icon {
  background: #e3f2fd;
  color: #1976d2;
}
</style> 