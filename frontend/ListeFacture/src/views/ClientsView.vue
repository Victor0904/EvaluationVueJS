<template>
  <div class="container py-4">
    <!-- Header avec statistiques -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Liste des clients</h1>
        <div class="text-muted">
          <i class="fas fa-users me-1"></i>
          {{ clients.length }} client{{ clients.length > 1 ? 's' : '' }}
        </div>
      </div>
      <router-link to="/clients/create" class="btn btn-success">
        <i class="fas fa-plus me-2"></i>
        Nouveau client
      </router-link>
    </div>

    <!-- Statistiques rapides -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="stat-card bg-primary">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ clients.length }}</h3>
            <p>Clients</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-success">
          <div class="stat-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="stat-content">
            <h3>{{ clientsEntreprises }}</h3>
            <p>Entreprises</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-info">
          <div class="stat-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="stat-content">
            <h3>{{ clientsParticuliers }}</h3>
            <p>Particuliers</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-warning">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ clientsRecents }}</h3>
            <p>Nouveaux (30j)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des clients -->
    <div class="table-card">
      <div class="table-header">
        <h5 class="mb-0">
          <i class="fas fa-table me-2"></i>
          Tous les clients
        </h5>
      </div>
      
      <div class="table-responsive">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Contact</th>
              <th>Adresse</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id" class="table-row">
              <!-- Nom du client -->
              <td>
                <div class="client-info">
                  <div class="client-nom">{{ client.nom }}</div>
                  <div class="client-id">#{{ client.id }}</div>
                </div>
              </td>
              
              <!-- Type -->
              <td>
                <span :class="getTypeBadgeClass(client.type)">
                  <i :class="getTypeIcon(client.type)" class="me-1"></i>
                  {{ client.type }}
                </span>
              </td>
              
              <!-- Contact -->
              <td>
                <div class="contact-info">
                  <div v-if="client.email">
                    <i class="fas fa-envelope text-muted me-2"></i>
                    {{ client.email }}
                  </div>
                  <div v-if="client.telephone">
                    <i class="fas fa-phone text-muted me-2"></i>
                    {{ client.telephone }}
                  </div>
                </div>
              </td>
              
              <!-- Adresse -->
              <td>
                <div class="adresse-info">
                  <div v-if="client.adresse">{{ client.adresse }}</div>
                  <div v-if="client.ville" class="text-muted">
                    {{ client.codePostal }} {{ client.ville }}
                  </div>
                </div>
              </td>
              
              <!-- Date création -->
              <td>
                <div class="date-info">
                  <i class="fas fa-calendar text-muted me-2"></i>
                  {{ formatDate(client.dateCreation) }}
                </div>
              </td>
              
              <!-- Actions -->
              <td>
                <div class="actions-group">
                  <button 
                    @click="voirDetails(client)"
                    class="action-btn view-btn"
                    title="Voir détails"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <router-link 
                    :to="`/clients/edit/${client.id}`" 
                    class="action-btn edit-btn"
                    title="Modifier"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                  <button 
                    @click="confirmerSuppression(client)"
                    class="action-btn delete-btn"
                    title="Supprimer"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Message si aucun client -->
        <div v-if="clients.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-users"></i>
          </div>
          <h5>Aucun client enregistré</h5>
          <p>Commencez par ajouter votre premier client</p>
          <router-link to="/clients/create" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>
            Créer un client
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal détails client -->
    <div class="modal fade" id="detailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-user me-2"></i>
              Détails du client {{ clientSelectionne?.nom }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="clientSelectionne">
            <div class="row">
              <div class="col-md-6">
                <h6><i class="fas fa-info-circle me-2"></i>Informations générales</h6>
                <p><strong>Nom :</strong> {{ clientSelectionne.nom }}</p>
                <p><strong>Type :</strong> 
                  <span :class="getTypeBadgeClass(clientSelectionne.type)">
                    {{ clientSelectionne.type }}
                  </span>
                </p>
                <p v-if="clientSelectionne.siret"><strong>SIRET :</strong> {{ clientSelectionne.siret }}</p>
                <p><strong>Créé le :</strong> {{ formatDate(clientSelectionne.dateCreation) }}</p>
              </div>
              <div class="col-md-6">
                <h6><i class="fas fa-address-book me-2"></i>Contact</h6>
                <p v-if="clientSelectionne.email"><strong>Email :</strong> {{ clientSelectionne.email }}</p>
                <p v-if="clientSelectionne.telephone"><strong>Téléphone :</strong> {{ clientSelectionne.telephone }}</p>
                <p v-if="clientSelectionne.adresse"><strong>Adresse :</strong><br>
                  {{ clientSelectionne.adresse }}<br>
                  {{ clientSelectionne.codePostal }} {{ clientSelectionne.ville }}
                </p>
              </div>
            </div>
            <div v-if="clientSelectionne.notes" class="mt-3">
              <h6><i class="fas fa-sticky-note me-2"></i>Notes</h6>
              <p>{{ clientSelectionne.notes }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <router-link 
              :to="`/clients/edit/${clientSelectionne?.id}`" 
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
            <p>Êtes-vous sûr de vouloir supprimer le client <strong>{{ clientASupprimer?.nom }}</strong> ?</p>
            <p class="text-muted">Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-danger" @click="supprimerClient">
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
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/clients'
import { storeToRefs } from 'pinia'

const router = useRouter()
const clientStore = useClientStore()
const { clients } = storeToRefs(clientStore)
const { fetchClients, deleteClient } = clientStore

const clientASupprimer = ref(null)
const clientSelectionne = ref(null)

onMounted(() => {
  fetchClients()
})

// Statistiques calculées
const clientsEntreprises = computed(() => 
  clients.value.filter(c => c.type === 'Entreprise').length
)

const clientsParticuliers = computed(() => 
  clients.value.filter(c => c.type === 'Particulier').length
)

const clientsRecents = computed(() => {
  const unMoisAgo = new Date()
  unMoisAgo.setMonth(unMoisAgo.getMonth() - 1)
  return clients.value.filter(c => 
    new Date(c.dateCreation) > unMoisAgo
  ).length
})

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function getTypeBadgeClass(type) {
  return type === 'Entreprise' ? 'badge bg-primary' : 'badge bg-info'
}

function getTypeIcon(type) {
  return type === 'Entreprise' ? 'fas fa-building' : 'fas fa-user'
}

function voirDetails(client) {
  clientSelectionne.value = client
  const modal = new bootstrap.Modal(document.getElementById('detailsModal'))
  modal.show()
}

function confirmerSuppression(client) {
  clientASupprimer.value = client
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'))
  modal.show()
}

async function supprimerClient() {
  try {
    await deleteClient(clientASupprimer.value.id)
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'))
    modal.hide()
    clientASupprimer.value = null
  } catch (error) {
    console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression')
  }
}
</script>

<style scoped>
/* Cartes de statistiques */
.stat-card {
  background: linear-gradient(135deg, var(--bs-primary), var(--bs-primary-dark));
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.stat-card.bg-success {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.stat-card.bg-info {
  background: linear-gradient(135deg, #17a2b8, #6f42c1);
}

.stat-card.bg-warning {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
  opacity: 0.8;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.stat-content p {
  margin: 0;
  opacity: 0.9;
}

/* Tableau moderne */
.table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modern-table {
  width: 100%;
  margin: 0;
}

.modern-table th {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 1rem;
  border: none;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.modern-table td {
  padding: 1rem;
  border: none;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
}

.table-row:hover {
  background: #f8f9fa;
}

/* Informations client */
.client-info .client-nom {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.client-info .client-id {
  font-size: 0.85rem;
  color: #6c757d;
}

.contact-info div {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.adresse-info {
  font-size: 0.9rem;
  line-height: 1.4;
}

.date-info {
  font-size: 0.9rem;
  color: #6c757d;
}

/* Boutons d'action */
.actions-group {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.view-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.view-btn:hover {
  background: #1976d2;
  color: white;
}

.edit-btn {
  background: #fff3e0;
  color: #f57c00;
}

.edit-btn:hover {
  background: #f57c00;
  color: white;
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #d32f2f;
  color: white;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h5 {
  margin-bottom: 1rem;
  color: #495057;
}

/* Badges */
.badge {
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .modern-table {
    font-size: 0.9rem;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .actions-group {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-btn {
    width: 30px;
    height: 30px;
  }
}
</style>