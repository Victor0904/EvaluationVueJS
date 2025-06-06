import { createRouter, createWebHistory } from 'vue-router'
import FacturesView from '../views/FacturesView.vue'
import FactureFormView from '../views/FactureFormView.vue'
import FactureDetailView from '../views/FactureDetailView.vue'
import ClientsView from '../views/ClientsView.vue'
import ClientFormView from '../views/ClientFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/factures'
    },
    // ------------------------------- Factures
    {
      path: '/factures',
      name: 'factures',
      component: FacturesView,
    },
    {
      path: '/factures/create',
      name: 'facture-create',
      component: FactureFormView,
    },
    {
      path: '/factures/:id',
      name: 'facture-detail',
      component: FactureDetailView,
    },
    {
      path: '/factures/edit/:id',
      name: 'facture-edit',
      component: FactureFormView,
    },
    // ----------------------- Clients-------------
    {
      path: '/clients',
      name: 'clients',
      component: ClientsView,
    },
    {
      path: '/clients/create',
      name: 'client-create',
      component: ClientFormView,
    },
    {
      path: '/clients/edit/:id',
      name: 'client-edit',
      component: ClientFormView,
    },
  ],
})

export default router
