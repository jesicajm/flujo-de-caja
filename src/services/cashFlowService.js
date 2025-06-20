import { db } from '../firebase/config'

export const cashFlowService = {
  // Crear un nuevo flujo de caja
  async createCashFlow(userId, cashFlowData) {
    if (!userId) {
      throw new Error('Se requiere un ID de usuario para crear un flujo de caja')
    }

    try {
      const docRef = await db.collection('cashFlows').add({
        userId,
        ...cashFlowData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      // Obtener el documento recién creado
      const newDoc = await docRef.get()
      return {
        id: docRef.id,
        ...newDoc.data()
      }
    } catch (error) {
      console.error('Error creating cash flow:', error)
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para crear flujos de caja')
      }
      throw error
    }
  },

  // Obtener todos los flujos de caja de un usuario
  async getUserCashFlows(userId) {
    if (!userId) {
      throw new Error('Se requiere un ID de usuario para obtener los flujos de caja')
    }

    try {
      const snapshot = await db.collection('cashFlows')
        .where('userId', '==', userId)
        .get()
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
      console.error('Error fetching user cash flows:', error)
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para ver los flujos de caja')
      }
      throw error
    }
  },

  // Obtener un flujo de caja específico
  async getCashFlow(cashFlowId) {
    if (!cashFlowId) {
      throw new Error('Se requiere un ID de flujo de caja')
    }

    try {
      const doc = await db.collection('cashFlows').doc(cashFlowId).get()
      if (!doc.exists) {
        throw new Error('Flujo de caja no encontrado')
      }
      return {
        id: doc.id,
        ...doc.data()
      }
    } catch (error) {
      console.error('Error fetching cash flow:', error)
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para ver este flujo de caja')
      }
      throw error
    }
  },

  // Actualizar un flujo de caja
  async updateCashFlow(cashFlowId, updateData) {
    if (!cashFlowId) {
      throw new Error('Se requiere un ID de flujo de caja para actualizar')
    }

    try {
      await db.collection('cashFlows').doc(cashFlowId).update({
        ...updateData,
        updatedAt: new Date()
      })
      
      // Obtener el documento actualizado
      const updatedDoc = await this.getCashFlow(cashFlowId)
      return updatedDoc
    } catch (error) {
      console.error('Error updating cash flow:', error)
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para actualizar este flujo de caja')
      }
      throw error
    }
  },

  // Eliminar un flujo de caja
  async deleteCashFlow(cashFlowId) {
    if (!cashFlowId) {
      throw new Error('Se requiere un ID de flujo de caja para eliminar')
    }

    try {
      await db.collection('cashFlows').doc(cashFlowId).delete()
    } catch (error) {
      console.error('Error deleting cash flow:', error)
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para eliminar este flujo de caja')
      }
      throw error
    }
  }
} 