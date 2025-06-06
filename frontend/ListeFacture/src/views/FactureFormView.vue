<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex align-items-center mb-4">
      <router-link to="/factures" class="btn btn-outline-secondary me-3">
        <i class="fas fa-arrow-left me-2"></i>
        Retour
      </router-link>
      <h1 class="mb-0">
        <i class="fas fa-file-invoice me-2"></i>
        {{ isEdit ? 'Modifier la facture' : 'Nouvelle facture' }}
      </h1>
    </div>

    <!-- Formulaire -->
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="sauvegarder">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="numero" class="form-label">Numéro de facture *</label>
                <input
                  type="text"
                  id="numero"
                  v-model="form.numero"
                  class="form-control"
                  placeholder="F-2024-001"
                  required
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="date" class="form-label">Date *</label>
                <input
                  type="date"
                  id="date"
                  v-model="form.date"
                  class="form-control"
                  required
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-8">
              <div class="mb-3">
                <label for="client" class="form-label">Client *</label>
                <select 
                  id="client" 
                  v-model="form.client" 
                  class="form-select" 
                  required
                >
                  <option value="">Sélectionner un client</option>
                  <option 
                    v-for="client in clients" 
                    :key="client.id" 
                    :value="client.nom"
                  >
                    {{ client.nom }} ({{ client.type }})
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label for="etat" class="form-label">État *</label>
                <select id="etat" v-model="form.etat" class="form-select" required>
                  <option value="">Sélectionner</option>
                  <option value="en attente">En attente</option>
                  <option value="payée">Payée</option>
                  <option value="en retard">En retard</option>
                </select>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="total" class="form-label">Total (€) *</label>
            <input
              type="number"
              id="total"
              v-model.number="form.total"
              class="form-control"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            >
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              class="form-control"
              rows="3"
              placeholder="Description de la facture..."
            ></textarea>
          </div>

          <!-- Boutons -->
          <div class="d-flex gap-2 justify-content-end">
            <button type="button" @click="annuler" class="btn btn-outline-secondary">
              <i class="fas fa-times me-2"></i>
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="fas fa-save me-2"></i>
              {{ loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFacturesStore } from '@/stores/factures'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const facturesStore = useFacturesStore()

const { clients } = storeToRefs(facturesStore)
const { fetchClients, getFactureById, createFacture, updateFacture } = facturesStore

const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

// Formulaire
const form = ref({
  numero: '',
  date: new Date().toISOString().split('T')[0],
  client: '',
  etat: 'en attente',
  total: 0,
  description: ''
})

onMounted(async () => {
  // Charger les clients
  await fetchClients()
  
  // Si mode édition, charger la facture
  if (isEdit.value) {
    try {
      const facture = await getFactureById(route.params.id)
      form.value = { 
        ...facture,
        date: facture.date ? facture.date.split('T')[0] : new Date().toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('Erreur chargement facture:', error)
      alert('Facture introuvable')
      router.push('/factures')
    }
  }
})

async function sauvegarder() {
  loading.value = true
  try {
    if (isEdit.value) {
      await updateFacture(route.params.id, form.value)
    } else {
      await createFacture(form.value)
    }
    router.push('/factures')
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
    alert('Erreur lors de la sauvegarde')
  } finally {
    loading.value = false
  }
}

function annuler() {
  router.push('/factures')
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 12px;
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
}
</style>