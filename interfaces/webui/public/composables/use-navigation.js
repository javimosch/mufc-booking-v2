function useNavigation(vm) {
  const scope =  {
    init() {
      scope.dashboardSection = document.getElementById('dashboard-section');    
      // Bind sidebar navigation events
      scope.bindNavigationEvents();
    },
    bindNavigationEvents() {
      // Get navigation links
      const navLinks = document.querySelectorAll(".nav-link");
      const mobileMenuBtn = document.getElementById("mobile-menu-btn");
      const sidebar = document.getElementById("sidebar");
      const sidebarOverlay = document.getElementById("sidebar-overlay");

      // Handle navigation clicks
      navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();

          // Extract view name from link id (nav-dashboard -> dashboard)
          const viewName = link.id.replace("nav-", "");
          scope.activateView(viewName);

          // Close mobile sidebar if open
          if (window.innerWidth < 768 && sidebar && sidebarOverlay) {
            sidebar.classList.add("hidden");
            sidebarOverlay.style.display = "none";
          }
        });
      });

      // Mobile menu toggle
      if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener("click", () => {
          sidebar.classList.toggle("hidden");
          sidebarOverlay.style.display = sidebar.classList.contains("hidden")
            ? "none"
            : "block";
        });

        // Close sidebar when clicking overlay
        sidebarOverlay.addEventListener("click", () => {
          sidebar.classList.add("hidden");
          sidebarOverlay.style.display = "none";
        });
      }
    },
    updateUIVisibility() {
      console.debug("Updating UI visibility with role:", vm.canManageAccount.userRole);

      // Get sidebar navigation links
      const navDashboard = document.getElementById("nav-dashboard");
      const navEvents = document.getElementById("nav-events");
      const navUsers = document.getElementById("nav-users");
      const navOrganizations = document.getElementById("nav-organizations");
      const navPublicLinks = document.getElementById("nav-public-links");

      // Hide all navigation items by default
      [
        navDashboard,
        navEvents,
        navUsers,
        navOrganizations,
        navPublicLinks,
      ].forEach((nav) => {
        if (nav) nav.classList.add("hidden");
      });

      // Show dashboard section and hide login section when logged in
      if (vm.canManageAccount.token) {
        if (vm.canManageAccount.loginSection) vm.canManageAccount.loginSection.style.display = "none";
        if (scope.dashboardSection) scope.dashboardSection.style.display = "flex";

        // Show sidebar
        const sidebar = document.getElementById("sidebar");
        if (sidebar) sidebar.classList.remove("hidden");

        // Always show dashboard for logged in users
        if (navDashboard) navDashboard.classList.remove("hidden");

        // Role-based navigation visibility
        if (vm.canManageAccount.userRole === "superAdmin") {
          // SuperAdmin sees everything
          [navEvents, navUsers, navOrganizations, navPublicLinks].forEach(
            (nav) => {
              if (nav) nav.classList.remove("hidden");
            }
          );
        } else if (vm.canManageAccount.userRole === "orgAdmin") {
          // OrgAdmin sees events, users and public links
          [navEvents, navUsers, navPublicLinks].forEach((nav) => {
            if (nav) nav.classList.remove("hidden");
          });
        } else {
          // Regular users only see public links
          if (navPublicLinks) navPublicLinks.classList.remove("hidden");
        }

        // Activate dashboard view by default
        scope.activateView("dashboard");
      } else {
        // Not logged in - show login section and hide dashboard
        if (vm.canManageAccount.loginSection) vm.canManageAccount.loginSection.style.display = "block";
        if (scope.dashboardSection) scope.dashboardSection.style.display = "none";

        // Hide sidebar when not logged in
        const sidebar = document.getElementById("sidebar");
        if (sidebar) sidebar.classList.add("hidden");
      }
    },

    // Helper method to activate a specific view
    activateView(viewName) {
      console.debug("Activating view:", viewName);

      // Hide all views
      const views = document.querySelectorAll(".view-content");
      views.forEach((view) => view.classList.add("hidden"));

      // Show the requested view
      const targetView = document.getElementById(`view-${viewName}`);
      if (targetView) {
        targetView.classList.remove("hidden");
      } else {
        console.debug(`View not found: view-${viewName}`);
      }

      // Update active state in navigation
      const navLinks = document.querySelectorAll(".nav-link");
      navLinks.forEach((link) =>
        link.classList.remove("active-nav", "bg-base-300")
      );

      const activeLink = document.getElementById(`nav-${viewName}`);
      if (activeLink) activeLink.classList.add("active-nav", "bg-base-300");
    },
  };
  return scope;
}
