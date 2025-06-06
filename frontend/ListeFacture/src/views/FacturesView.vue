<!-- src/views/FacturesView.vue -->
<template>
  <div class="container py-4">
    <!-- Header avec statistiques -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Liste des factures</h1>
        <div class="text-muted">
          <i class="fas fa-file-invoice me-1"></i>
          {{ factures.length }} facture{{ factures.length > 1 ? 's' : '' }} • 
          <i class="fas fa-euro-sign me-1 ms-2"></i>
          Total : <strong class="text-success">{{ formatPrice(totalFactures) }}</strong>
        </div>
      </div>
      <router-link to="/factures/create" class="btn btn-success">
        <i class="fas fa-plus me-2"></i>
        Nouvelle facture
      </router-link>
    </div>

    <!-- Statistiques rapides -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card border-primary">
          <div class="card-body text-center">
            <i class="fas fa-file-invoice text-primary fa-2x mb-2"></i>
            <h5 class="card-title">{{ factures.length }}</h5>
            <p class="card-text text-muted">Factures</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-success">
          <div class="card-body text-center">
            <i class="fas fa-euro-sign text-success fa-2x mb-2"></i>
            <h5 class="card-title">{{ formatPrice(totalFactures) }}</h5>
            <p class="card-text text-muted">Chiffre d'affaires</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-warning">
          <div class="card-body text-center">
            <i class="fas fa-clock text-warning fa-2x mb-2"></i>
            <h5 class="card-title">{{ facturesEnAttente }}</h5>
            <p class="card-text text-muted">En attente</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-info">
          <div class="card-body text-center">
            <i class="fas fa-check-circle text-info fa-2x mb-2"></i>
            <h5 class="card-title">{{ facturesPayees }}</h5>
            <p class="card-text text-muted">Payées</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des factures -->
    <div class="card">
      <div class="card-body">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>Numéro</th>
              <th>Date</th>
              <th>Client</th>
              <th>Prestations</th>
              <th>Total HT</th>
              <th>TVA</th>
              <th>Total TTC</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="facture in factures" :key="facture.id">
              <td class="fw-bold">{{ facture.numero }}</td>
              <td>{{ formatDate(facture.date) }}</td>
              <td>{{ facture.client }}</td>
              <td>
                <span class="badge bg-secondary">
                  {{ (facture.prestations || []).length }} prestation{{ (facture.prestations || []).length > 1 ? 's' : '' }}
                </span>
              </td>
              <td class="fw-bold">{{ formatPrice(facture.totalHT || 0) }}</td>
              <td class="text-muted">{{ formatPrice(facture.montantTVA || 0) }}</td>
              <td class="fw-bold text-success">{{ formatPrice(facture.total) }}</td>
              <td>
                <span :class="etatClass(facture.etat)">
                  {{ facture.etat }}
                </span>
              </td>
              <td>
                <div class="btn-group" role="group">
                  <button 
                    @click="voirDetails(facture)"
                    class="btn btn-outline-info btn-sm"
                    title="Voir détails"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <router-link 
                    :to="`/factures/edit/${facture.id}`" 
                    class="btn btn-outline-primary btn-sm"
                    title="Modifier"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                  <button 
                    @click="confirmerSuppression(facture)"
                    class="btn btn-outline-danger btn-sm"
                    title="Supprimer"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Message si aucune facture -->
        <div v-if="factures.length === 0" class="text-center py-5">
          <i class="fas fa-file-invoice fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Aucune facture enregistrée</h5>
          <p class="text-muted">Commencez par créer votre première facture</p>
          <router-link to="/factures/create" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>
            Créer une facture
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal détails facture -->
    <div class="modal fade" id="detailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-file-invoice me-2"></i>
              Détails de la facture {{ factureSelectionnee?.numero }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="factureSelectionnee">
            <!-- Informations générales -->
            <div class="row mb-4">
              <div class="col-md-6">
                <h6><i class="fas fa-info-circle me-2"></i>Informations</h6>
                <p><strong>Client :</strong> {{ factureSelectionnee.client }}</p>
                <p><strong>Date :</strong> {{ formatDate(factureSelectionnee.date) }}</p>
                <p><strong>État :</strong> 
                  <span :class="etatClass(factureSelectionnee.etat)">
                    {{ factureSelectionnee.etat }}
                  </span>
                </p>
                <p v-if="factureSelectionnee.description">
                  <strong>Description :</strong> {{ factureSelectionnee.description }}
                </p>
              </div>
              <div class="col-md-6">
                <h6><i class="fas fa-calculator me-2"></i>Totaux</h6>
                <p><strong>Total HT :</strong> {{ formatPrice(factureSelectionnee.totalHT || 0) }}</p>
                <p><strong>TVA ({{ factureSelectionnee.tauxTVA || 20 }}%) :</strong> {{ formatPrice(factureSelectionnee.montantTVA || 0) }}</p>
                <p class="h5 text-success"><strong>Total TTC :</strong> {{ formatPrice(factureSelectionnee.total) }}</p>
              </div>
            </div>

            <!-- Prestations -->
            <h6><i class="fas fa-list me-2"></i>Prestations</h6>
            <div v-if="(factureSelectionnee.prestations || []).length === 0" class="alert alert-info">
              Aucune prestation détaillée
            </div>
            <div v-else class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Description</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(prestation, index) in factureSelectionnee.prestations" :key="index">
                    <td>{{ prestation.description }}</td>
                    <td>{{ prestation.quantite }}</td>
                    <td>{{ formatPrice(prestation.prixUnitaire) }}</td>
                    <td class="fw-bold">{{ formatPrice(prestation.quantite * prestation.prixUnitaire) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <router-link 
              :to="`/factures/edit/${factureSelectionnee?.id}`" 
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              <i class="fas fa-edit me-2"></i>
              Modifier
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmer la suppression</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer la facture <strong>{{ factureASupprimer?.numero }}</strong> ?</p>
            <p class="text-muted">Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-danger" @click="supprimerFacture">
              <i class="fas fa-trash me-2"></i>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useFactureStore } from '@/stores/facture'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const factureStore = useFactureStore()
const { factures } = storeToRefs(factureStore)
const { fetchFactures, deleteFacture } = factureStore

const factureASupprimer = ref(null)
const factureSelectionnee = ref(null)
const router = useRouter()

onMounted(() => {
  fetchFactures()
})

// Statistiques calculées
const totalFactures = computed(() => 
  factures.value.reduce((sum, facture) => sum + (facture.total || 0), 0)
)

const facturesEnAttente = computed(() => 
  factures.value.filter(f => f.etat === 'en attente').length
)

const facturesPayees = computed(() => 
  factures.value.filter(f => f.etat === 'payée').length
)

// Fonctions utilitaires
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

function etatClass(etat) {
  switch (etat) {
    case 'en attente': return 'badge bg-warning text-dark'
    case 'payée': return 'badge bg-success'
    case 'en retard': return 'badge bg-danger'
    default: return 'badge bg-secondary'
  }
}

// Gestion des modals
function voirDetails(facture) {



  router.push(`/factures/${facture.id}`)
}

function confirmerSuppression(facture) {
  factureASupprimer.value = facture
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'))
  modal.show()
}

async function supprimerFacture() {
  if (factureASupprimer.value) {
    try {
      await deleteFacture(factureASupprimer.value.id)
      const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'))
      modal.hide()
      factureASupprimer.value = null
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.table th {
  border-top: none;
}

.btn-group .btn {
  margin-right: 0;
}

.modal-body .table {
  margin-bottom: 0;
}
</style>
