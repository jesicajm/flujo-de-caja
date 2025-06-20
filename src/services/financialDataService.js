import { db, auth } from '../firebase/config'

export const financialDataService = {
  // Obtener los datos financieros de un usuario
  async getFinancialData(userId) {
    if (!userId) {
      throw new Error('Se requiere un ID de usuario para obtener los datos financieros')
    }

    try {
      console.log('🔍 Obteniendo datos financieros para usuario:', userId)
      const doc = await db.collection('financialData').doc(userId).get()
      if (!doc.exists) {
        console.log('📄 Documento no existe, creando estructura inicial')
        // Si no existe, creamos la estructura inicial
        const initialData = {
          expenses: {
            fixed: { items: [], customItems: [] },
            variable: { items: [], customItems: [] }
          },
          debts: { items: [], customItems: [] },
          incomes: { items: [], customItems: [] },
          savings: { items: [], customItems: [] },
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        // Crear el documento inicial
        await this.updateFinancialData(userId, initialData)
        return initialData
      }
      console.log('✅ Datos financieros obtenidos correctamente')
      return doc.data()
    } catch (error) {
      console.error('❌ Error al obtener datos financieros:', error)
      throw new Error('Error al obtener los datos financieros')
    }
  },

  // Actualizar los datos financieros
  async updateFinancialData(userId, data) {
    if (!userId) {
      throw new Error('Se requiere un ID de usuario para actualizar los datos financieros')
    }

    try {
      console.log('💾 Actualizando datos financieros para usuario:', userId)
      
      // Verificar autenticación
      const currentUser = auth.currentUser
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('Usuario no autenticado o ID no coincide')
      }

      await db.collection('financialData').doc(userId).set({
        ...data,
        updatedAt: new Date()
      }, { merge: true })
      
      console.log('✅ Datos financieros actualizados correctamente')
    } catch (error) {
      console.error('❌ Error al actualizar datos financieros:', error)
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para actualizar los datos financieros. Verifica que estés autenticado.')
      }
      throw new Error('Error al actualizar los datos financieros')
    }
  },

  // Actualizar una sección específica de los datos financieros
  async updateFinancialSection(userId, section, data) {
    if (!userId) {
      throw new Error('Se requiere un ID de usuario para actualizar la sección')
    }

    try {
      console.log(`📝 Actualizando sección ${section} para usuario:`, userId)
      
      // Verificar autenticación
      const currentUser = auth.currentUser
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('Usuario no autenticado o ID no coincide')
      }

      await db.collection('financialData').doc(userId).set({
        [section]: data,
        updatedAt: new Date()
      }, { merge: true })
      
      console.log(`✅ Sección ${section} actualizada correctamente`)
    } catch (error) {
      console.error(`❌ Error al actualizar sección ${section}:`, error)
      if (error.code === 'permission-denied') {
        throw new Error(`No tienes permisos para actualizar la sección ${section}. Verifica que estés autenticado.`)
      }
      throw new Error(`Error al actualizar la sección ${section}`)
    }
  },

  // Actualizar un ítem específico
  async updateFinancialItem(userId, section, itemType, itemId, data) {
    if (!userId || !section || !itemType || !itemId) {
      throw new Error('Se requieren todos los parámetros para actualizar el ítem')
    }

    try {
      console.log('🔧 Actualizando ítem:', { userId, section, itemType, itemId, data })
      
      // Verificar autenticación
      const currentUser = auth.currentUser
      console.log('👤 Usuario actual:', currentUser ? currentUser.uid : 'No autenticado')
      
      if (!currentUser) {
        throw new Error('Usuario no autenticado')
      }
      
      if (currentUser.uid !== userId) {
        throw new Error('ID de usuario no coincide con el usuario autenticado')
      }

      const docRef = db.collection('financialData').doc(userId)
      console.log('📄 Obteniendo documento:', docRef.path)
      
      const doc = await docRef.get()
      
      if (!doc.exists) {
        console.log('📄 Documento no existe, creando estructura inicial')
        // Si el documento no existe, lo creamos con la estructura inicial
        await this.getFinancialData(userId)
        // Intentar de nuevo después de crear la estructura
        return await this.updateFinancialItem(userId, section, itemType, itemId, data)
      }

      const currentData = doc.data()
      console.log('📊 Datos actuales:', currentData)
      
      // Verificar que la estructura existe
      if (!currentData[section] || !currentData[section][itemType]) {
        throw new Error(`Estructura de datos inválida: ${section}.${itemType} no existe`)
      }

      const items = currentData[section][itemType]
      const itemIndex = items.findIndex(item => item.id === itemId)

      if (itemIndex === -1) {
        throw new Error(`Ítem no encontrado: ${itemId} en ${section}.${itemType}`)
      }

      items[itemIndex] = { ...items[itemIndex], ...data }

      console.log('💾 Actualizando documento con:', {
        [`${section}.${itemType}`]: items,
        updatedAt: new Date()
      })

      await docRef.update({
        [`${section}.${itemType}`]: items,
        updatedAt: new Date()
      })
      
      console.log('✅ Ítem actualizado correctamente')
    } catch (error) {
      console.error('❌ Error al actualizar ítem:', error)
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para actualizar este ítem. Verifica que estés autenticado y que las reglas de Firestore estén configuradas correctamente.')
      }
      throw new Error('Error al actualizar el ítem')
    }
  }
} 