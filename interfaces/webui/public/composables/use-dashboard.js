function useDashboard(vm) {
  const scope = {
    async loadDashboard() {
      console.debug("Loading dashboard with role:", vm.canManageAccount.userRole);

      // Load data for all sections regardless of current view
      vm.canManageEvents.loadPublicEventLinks();

      // Role-based content loading
      if (vm.canManageAccount.userRole === "superAdmin") {
        vm.canManageOrgs.loadOrganizations();
        vm.canManageEvents.loadMatchEvents();
        vm.canManageUsers.loadUsers();

        // Update stats counters on dashboard
        scope.updateDashboardStats();
      } else if (vm.canManageAccount.userRole === "orgAdmin") {
        vm.canManageEvents.loadMatchEvents();
        vm.canManageUsers.loadUsers();

        // Update stats counters on dashboard
        scope.updateDashboardStats();
      }

      // Add a welcome message to the log
      vm.canLog.addLog(
        "info",
        `Welcome back, ${vm.canManageAccount.userEmail || "User"}! Role: ${
          vm.canManageAccount.userRole || "unknown"
        }`
      );
    },

    // Update dashboard stats
    updateDashboardStats() {
      console.debug('Updating dashboard stats...');
      const eventsCounter = document.getElementById("stats-events");
      const usersCounter = document.getElementById("stats-users");

      // Simple example - in a real app, you'd want to get actual counts from the server
      if (eventsCounter) {
        vm.canUseApi.authenticatedFetch("/api/match-events/count")
          .then((response) => response.json())
          .then((data) => {
            eventsCounter.textContent = data.count || "0";
          })
          .catch((err) => {
            console.debug("Error fetching event stats:", err);
            eventsCounter.textContent = "0";
          });
      }

      if (usersCounter) {
        vm.canUseApi.authenticatedFetch("/api/users/count")
          .then((response) => response.json())
          .then((data) => {
            usersCounter.textContent = data.count || "0";
          })
          .catch((err) => {
            console.debug("Error fetching user stats:", err);
            usersCounter.textContent = "0";
          });
      }
    },
  };
  return scope;
}
