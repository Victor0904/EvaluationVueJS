<template>
  <div class="container py-4">
    <!-- Header avec actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <router-link to="/factures" class="btn btn-outline-secondary me-3">
          <i class="fas fa-arrow-left me-2"></i>
          Retour
        </router-link>
        <h1 class="mb-0">
          <i class="fas fa-file-invoice me-2"></i>
          Facture {{ facture?.numero }}
        </h1>
      </div>
      <div class="btn-group">
        <button @click="imprimerFacture" class="btn btn-outline-primary">
          <i class="fas fa-print me-2"></i>
          Imprimer
        </button>
        <router-link 
          :to="`/factures/edit/${facture?.id}`" 
          class="btn btn-primary"
        >
          <i class="fas fa-edit me-2"></i>
          Modifier
        </router-link>
      </div>
    </div>

    <!-- Facture -->
    <div class="facture-container" id="facture-print">
      <div class="facture-paper">
        <!-- En-tête de la facture -->
        <div class="facture-header">
          <div class="row">
            <div class="col-md-6">
              <div class="company-info">
                <h2 class="company-name">Mon Entreprise</h2>
                <p class="company-details">
                  123 Rue de l'Exemple<br>
                  75000 Paris<br>
                  Tél: 01 23 45 67 89<br>
                  Email: contact@monentreprise.fr
                </p>
              </div>
            </div>
            <div class="col-md-6 text-end">
              <div class="facture-info">
                <h1 class="facture-title">FACTURE</h1>
                <div class="facture-meta">
                  <p><strong>N° {{ facture?.numero }}</strong></p>
                  <p>Date: {{ formatDate(facture?.date) }}</p>
                  <p v-if="facture?.dateEcheance">Échéance: {{ formatDate(facture?.dateEcheance) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations client -->
        <div class="client-section">
          <div class="row">
            <div class="col-md-6">
              <div class="client-info">
                <h5>Facturé à :</h5>
                <div class="client-details">
                  <strong>{{ facture?.client }}</strong><br>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="status-info">
                <span :class="getEtatBadgeClass(facture?.etat)" class="status-large">
                  <i :class="getEtatIcon(facture?.etat)" class="me-2"></i>
                  {{ facture?.etat?.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description générale -->
        <div v-if="facture?.description" class="description-section">
          <h5>Description :</h5>
          <p>{{ facture.description }}</p>
        </div>

        <!-- Tableau des prestations -->
        <div class="prestations-section">
          <h5>Détail des prestations :</h5>
          <div class="table-responsive">
            <table class="prestations-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-center">Quantité</th>
                  <th class="text-end">Prix unitaire HT</th>
                  <th class="text-end">Total HT</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prestation, index) in facture?.prestations || []" :key="index">
                  <td>{{ prestation.description }}</td>
                  <td class="text-center">{{ prestation.quantite }}</td>
                  <td class="text-end">{{ formatPrice(prestation.prixUnitaire) }}</td>
                  <td class="text-end font-weight-bold">
                    {{ formatPrice(prestation.quantite * prestation.prixUnitaire) }}
                  </td>
                </tr>
                <!-- Ligne vide si pas de prestations -->
                <tr v-if="!facture?.prestations || facture.prestations.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">
                    Aucune prestation détaillée
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totaux -->
        <div class="totaux-section">
          <div class="row justify-content-end">
            <div class="col-md-4">
              <div class="totaux-box">
                <div class="total-line">
                  <span>Total HT :</span>
                  <span class="total-value">{{ formatPrice(facture?.totalHT || 0) }}</span>
                </div>
                <div class="total-line">
                  <span>TVA ({{ facture?.tauxTVA || 20 }}%) :</span>
                  <span class="total-value">{{ formatPrice(facture?.montantTVA || 0) }}</span>
                </div>
                <div class="total-line total-final">
                  <span><strong>Total TTC :</strong></span>
                  <span class="total-value"><strong>{{ formatPrice(facture?.total || 0) }}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions supplémentaires -->
    <div class="actions-section mt-4">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h6><i class="fas fa-history me-2"></i>Historique</h6>
              <div class="timeline">
                <div class="timeline-item">
                  <i class="fas fa-plus-circle text-success"></i>
                  <span>Facture créée le {{ formatDate(facture?.dateCreation) }}</span>
                </div>
                <div class="timeline-item" v-if="facture?.etat === 'payée'">
                  <i class="fas fa-check-circle text-success"></i>
                  <span>Facture payée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h6><i class="fas fa-cog me-2"></i>Actions rapides</h6>
              <div class="d-grid gap-2">
                <button 
                  @click="changerEtat('payée')" 
                  v-if="facture?.etat !== 'payée'"
                  class="btn btn-success btn-sm"
                >
                  <i class="fas fa-check me-2"></i>
                  Marquer comme payée
                </button>
                <button 
                  @click="changerEtat('en attente')" 
                  v-if="facture?.etat !== 'en attente'"
                  class="btn btn-warning btn-sm"
                >
                  <i class="fas fa-clock me-2"></i>
                  Marquer en attente
                </button>
                <button @click="dupliquerFacture" class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-copy me-2"></i>
                  Dupliquer cette facture
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFactureStore } from '@/stores/facture'

const route = useRoute()
const router = useRouter()
const factureStore = useFactureStore()

const facture = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    facture.value = await factureStore.getFactureById(route.params.id)
  } catch (error) {
    console.error('Erreur chargement facture:', error)
    alert('Facture introuvable')
    router.push('/factures')
  } finally {
    loading.value = false
  }
})

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price || 0)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function getEtatBadgeClass(etat) {
  const classes = {
    'en attente': 'status-warning',
    'payée': 'status-success',
    'en retard': 'status-danger'
  }
  return classes[etat] || 'status-secondary'
}

function getEtatIcon(etat) {
  const icons = {
    'en attente': 'fas fa-clock',
    'payée': 'fas fa-check-circle',
    'en retard': 'fas fa-exclamation-triangle'
  }
  return icons[etat] || 'fas fa-question-circle'
}

function imprimerFacture() {
  window.print()
}

async function changerEtat(nouvelEtat) {
  try {
    const factureModifiee = { ...facture.value, etat: nouvelEtat }
    await factureStore.updateFacture(facture.value.id, factureModifiee)
    facture.value.etat = nouvelEtat
  } catch (error) {
    console.error('Erreur changement état:', error)
    alert('Erreur lors du changement d\'état')
  }
}

function dupliquerFacture() {
  const nouvelleFacure = {
    ...facture.value,
    numero: `${facture.value.numero}-COPIE`,
    date: new Date().toISOString().split('T')[0],
    etat: 'en attente'
  }
  delete nouvelleFacure.id
  
  router.push({
    name: 'facture-create',
    state: { factureData: nouvelleFacure }
  })
}
</script>

<style scoped>
/* Conteneur principal */
.facture-container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.facture-paper {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 210mm;
  margin: 0 auto;
}

/* En-tête */
.facture-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e9ecef;
}

.company-name {
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 1rem;
}

.company-details {
  color: #6c757d;
  line-height: 1.6;
}

.facture-title {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.facture-meta p {
  margin-bottom: 0.5rem;
  color: #495057;
}

/* Section client */
.client-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.client-info h5 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.client-details {
  color: #495057;
  line-height: 1.6;
}

.status-large {
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: bold;
}

.status-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-danger {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Description */
.description-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.description-section h5 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

/* Tableau des prestations */
.prestations-section {
  margin-bottom: 2rem;
}

.prestations-section h5 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.prestations-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.prestations-table th {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  font-weight: 600;
  border: 1px solid #dee2e6;
}

.prestations-table td {
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  vertical-align: middle;
}

.prestations-table tbody tr:nth-child(even) {
  background: #f8f9fa;
}

.prestations-table tbody tr:hover {
  background: #e9ecef;
}

/* Totaux */
.totaux-section {
  margin-bottom: 2rem;
}

.totaux-box {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dee2e6;
}

.total-line:last-child {
  border-bottom: none;
}

.total-final {
  background: #e8f5e8;
  margin: 0.5rem -1.5rem -1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 0 0 6px 6px;
  font-size: 1.1rem;
  color: #155724;
}

.total-value {
  font-weight: 600;
}

/* Actions supplémentaires */
.actions-section .card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline {
  padding-left: 0;
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.timeline-item i {
  margin-right: 0.75rem;
  width: 20px;
}

@media print {
  .container {
    max-width: none !important;
    padding: 0 !important;
  }
  
  .facture-container {
    background: white !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  
  .facture-paper {
    box-shadow: none !important;
    padding: 2rem !important;
  }
  
  .actions-section,
  .btn,
  .btn-group {
    display: none !important;
  }
  
  .prestations-table th {
    background: #f8f9fa !important;
    color: #2c3e50 !important;
  }
  
  .total-final {
    background: #f8f9fa !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .facture-paper {
    padding: 1.5rem;
  }
  
  .facture-title {
    font-size: 2rem;
  }
  
  .prestations-table {
    font-size: 0.9rem;
  }
  
  .prestations-table th,
  .prestations-table td {
    padding: 0.5rem;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    margin-bottom: 0.5rem;
  }
}
</style>
