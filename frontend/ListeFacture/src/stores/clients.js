import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClientStore = defineStore('client', () => {
    const clients = ref([])
    const loading = ref(false)
    const error = ref(null)

    const API_BASE = 'http://localhost:3000/api'

    // Liste des  clients
    async function fetchClients() {
        loading.value = true
        try {
            const response = await fetch(`${API_BASE}/clients`)
            if (!response.ok) throw new Error('Erreur lors du chargement')
            clients.value = await response.json()
        } catch (err) {
            error.value = err.message
            console.error('Erreur fetch clients:', err)
        } finally {
            loading.value = false
        }
    }

    // Récupérer un client par ID
    async function getClientById(id) {
        try {
            const response = await fetch(`${API_BASE}/clients/${id}`)
            if (!response.ok) throw new Error('Client non trouvé')
            return await response.json()
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    // Créer un client
    async function createClient(clientData) {
        try {
            const response = await fetch(`${API_BASE}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...clientData,
                    dateCreation: new Date().toISOString()
                }),
            })
            if (!response.ok) throw new Error('Erreur lors de la création')
            const newClient = await response.json()
            clients.value.push(newClient)
            return newClient
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    // Mettre à jour un client
    async function updateClient(id, clientData) {
        try {
            const response = await fetch(`${API_BASE}/clients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData),
            })
            if (!response.ok) throw new Error('Erreur lors de la mise à jour')
            const updatedClient = await response.json()

            const index = clients.value.findIndex(c => c.id == id)
            if (index !== -1) {
                clients.value[index] = updatedClient
            }
            return updatedClient
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    // Supprimer un client
    async function deleteClient(id) {
        try {
            const response = await fetch(`${API_BASE}/clients/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error('Erreur lors de la suppression')

            clients.value = clients.value.filter(c => c.id != id)
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    return {
        clients,
        loading,
        error,
        fetchClients,
        getClientById,
        createClient,
        updateClient,
        deleteClient,
    }
})