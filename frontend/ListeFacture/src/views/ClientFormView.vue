<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex align-items-center mb-4">
      <router-link to="/clients" class="btn btn-outline-secondary me-3">
        <i class="fas fa-arrow-left me-2"></i>
        Retour
      </router-link>
      <h1 class="mb-0">
        <i class="fas fa-user me-2"></i>
        {{ isEdit ? 'Modifier le client' : 'Nouveau client' }}
      </h1>
    </div>

    <!-- Formulaire -->
    <div class="row">
      <div class="col-lg-8">
        <div class="form-card">
          <form @submit.prevent="sauvegarder">
            <!-- Informations générales -->
            <div class="form-section">
              <h5 class="section-title">
                <i class="fas fa-info-circle me-2"></i>
                Informations générales
              </h5>
              
              <div class="row">
                <div class="col-md-8">
                  <div class="form-group">
                    <label for="nom" class="form-label required">Nom du client</label>
                    <input
                      type="text"
                      id="nom"
                      v-model="form.nom"
                      class="form-control"
                      placeholder="Nom de l'entreprise ou du particulier"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="type" class="form-label required">Type</label>
                    <select id="type" v-model="form.type" class="form-select" required>
                      <option value="">Sélectionner</option>
                      <option value="Entreprise">Entreprise</option>
                      <option value="Particulier">Particulier</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row" v-if="form.type === 'Entreprise'">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="siret" class="form-label">SIRET</label>
                    <input
                      type="text"
                      id="siret"
                      v-model="form.siret"
                      class="form-control"
                      placeholder="12345678901234"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact -->
            <div class="form-section">
              <h5 class="section-title">
                <i class="fas fa-address-book me-2"></i>
                Informations de contact
              </h5>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      class="form-control"
                      placeholder="contact@exemple.fr"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="telephone" class="form-label">Téléphone</label>
                    <input
                      type="tel"
                      id="telephone"
                      v-model="form.telephone"
                      class="form-control"
                      placeholder="01 23 45 67 89"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Adresse -->
            <div class="form-section">
              <h5 class="section-title">
                <i class="fas fa-map-marker-alt me-2"></i>
                Adresse
              </h5>
              
              <div class="form-group">
                <label for="adresse" class="form-label">Adresse</label>
                <input
                  type="text"
                  id="adresse"
                  v-model="form.adresse"
                  class="form-control"
                  placeholder="123 Rue de l'Exemple"
                >
              </div>
              
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="codePostal" class="form-label">Code postal</label>
                    <input
                      type="text"
                      id="codePostal"
                      v-model="form.codePostal"
                      class="form-control"
                      placeholder="75000"
                    >
                  </div>
                </div>
                <div class="col-md-9">
                  <div class="form-group">
                    <label for="ville" class="form-label">Ville</label>
                    <input
                      type="text"
                      id="ville"
                      v-model="form.ville"
                      class="form-control"
                      placeholder="Paris"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="form-section">
              <h5 class="section-title">
                <i class="fas fa-sticky-note me-2"></i>
                Notes (optionnel)
              </h5>
              
              <div class="form-group">
                <label for="notes" class="form-label">Notes internes</label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="form-control"
                  rows="4"
                  placeholder="Notes, remarques, informations complémentaires..."
                ></textarea>
              </div>
            </div>

            <!-- Boutons -->
            <div class="form-actions">
              <button type="button" @click="annuler" class="btn btn-outline-secondary">
                <i class="fas fa-times me-2"></i>
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fas fa-save me-2"></i>
                {{ loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer le client') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Aperçu -->
      <div class="col-lg-4">
        <div class="preview-card">
          <h5 class="preview-title">
            <i class="fas fa-eye me-2"></i>
            Aperçu
          </h5>
          
          <div class="client-preview">
            <div class="preview-header">
              <div class="client-avatar">
                <i :class="form.type === 'Entreprise' ? 'fas fa-building' : 'fas fa-user'"></i>
              </div>
              <div class="client-name">
                {{ form.nom || 'Nom du client' }}
              </div>
              <div class="client-type">

                <span :class="getTypeBadgeClass(form.type)" v-if="form.type">
                  {{ form.type }}
                </span>
              </div>
            </div>
            
            <div class="preview-details">
              <div class="detail-item" v-if="form.email">
                <i class="fas fa-envelope text-muted"></i>
                <span>{{ form.email }}</span>
              </div>
              <div class="detail-item" v-if="form.telephone">
                <i class="fas fa-phone text-muted"></i>
                <span>{{ form.telephone }}</span>
              </div>
              <div class="detail-item" v-if="form.adresse || form.ville">
                <i class="fas fa-map-marker-alt text-muted"></i>
                <div>
                  <div v-if="form.adresse">{{ form.adresse }}</div>
                  <div v-if="form.codePostal || form.ville">
                    {{ form.codePostal }} {{ form.ville }}
                  </div>
                </div>
              </div>
              <div class="detail-item" v-if="form.siret">
                <i class="fas fa-building text-muted"></i>
                <span>SIRET: {{ form.siret }}</span>
              </div>
            </div>
            
            <div class="preview-notes" v-if="form.notes">
              <div class="notes-title">Notes:</div>
              <div class="notes-content">{{ form.notes }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientStore } from '@/stores/clients'

const route = useRoute()
const router = useRouter()
const clientStore = useClientStore()

const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

// Formulaire
const form = ref({
  nom: '',
  type: '',
  email: '',
  telephone: '',
  adresse: '',
  codePostal: '',
  ville: '',
  siret: '',
  notes: ''
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const client = await clientStore.getClientById(route.params.id)
      form.value = { ...client }
    } catch (error) {
      console.error('Erreur chargement client:', error)
      alert('Client introuvable')
      router.push('/clients')
    }
  }
})

function getTypeBadgeClass(type) {
  return type === 'Entreprise' ? 'badge bg-primary' : 'badge bg-info'
}

async function sauvegarder() {
  loading.value = true
  try {
    if (isEdit.value) {
      await clientStore.updateClient(route.params.id, form.value)
    } else {
      await clientStore.createClient(form.value)
    }
    router.push('/clients')
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
    alert('Erreur lors de la sauvegarde')
  } finally {
    loading.value = false
  }
}

function annuler() {
  router.push('/clients')
}
</script>

<style scoped>
/* Carte formulaire */
.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

/* Sections du formulaire */
.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

/* Groupes de formulaire */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-label.required::after {
  content: ' *';
  color: #dc3545;
}

.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.2s;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Actions du formulaire */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

/* Carte d'aperçu */
.preview-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
}

.preview-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

/* Aperçu client */
.client-preview {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.preview-header {
  margin-bottom: 1.5rem;
}

.client-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: #6c757d;
}

.client-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.client-type .badge {
  font-size: 0.8rem;
}

.preview-details {
  text-align: left;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.detail-item i {
  width: 20px;
  margin-right: 0.75rem;
  margin-top: 0.1rem;
}

.preview-notes {
  text-align: left;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.notes-title {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.notes-content {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 992px) {
  .preview-card {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .form-card {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style>