<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="fas fa-file-invoice-dollar me-2"></i>
          Gestion Factures
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/factures" active-class="active">
                <i class="fas fa-file-invoice me-1"></i>
                Factures
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/clients" active-class="active">
                <i class="fas fa-users me-1"></i>
                Clients
              </router-link>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-plus me-1"></i>
                Nouveau
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/factures/create">
                    <i class="fas fa-file-invoice me-2"></i>
                    Nouvelle facture
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/clients/create">
                    <i class="fas fa-user-plus me-2"></i>
                    Nouveau client
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>



<style>
/* Styles globaux */
body {
  background-color: #f8f9fa;
}

.navbar-brand {
  font-weight: bold;
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

main {
  min-height: calc(100vh - 56px);
}
</style>
