import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFactureStore = defineStore('facture', () => {
  const factures = ref([])
  const loading = ref(false)
  const error = ref(null)

  const API_BASE = 'http://localhost:3000/api'

  // Liste des factures
  async function fetchFactures() {
    loading.value = true
    try {
      const response = await fetch(`${API_BASE}/factures`)
      if (!response.ok) throw new Error('Erreur lors du chargement')
      factures.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Erreur fetch factures:', err)
    } finally {
      loading.value = false
    }
  }

  // Récupérer une facture par ID
  async function getFactureById(id) {
    try {
      const response = await fetch(`${API_BASE}/factures/${id}`)
      if (!response.ok) throw new Error('Facture non trouvée')
      return await response.json()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Créer une facture
  async function createFacture(factureData) {
    try {
      const response = await fetch(`${API_BASE}/factures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...factureData,
          dateCreation: new Date().toISOString()
        }),
      })
      if (!response.ok) throw new Error('Erreur lors de la création')
      const newFacture = await response.json()
      factures.value.push(newFacture)
      return newFacture
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Mettre à jour une facture
  async function updateFacture(id, factureData) {
    try {
      const response = await fetch(`${API_BASE}/factures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factureData),
      })
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      const updatedFacture = await response.json()

      const index = factures.value.findIndex(f => f.id == id)
      if (index !== -1) {
        factures.value[index] = updatedFacture
      }
      return updatedFacture
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Supprimer une facture
  async function deleteFacture(id) {
    try {
      const response = await fetch(`${API_BASE}/factures/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression')

      factures.value = factures.value.filter(f => f.id != id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    factures,
    loading,
    error,
    fetchFactures,
    getFactureById,
    createFacture,
    updateFacture,
    deleteFacture,
  }
})
