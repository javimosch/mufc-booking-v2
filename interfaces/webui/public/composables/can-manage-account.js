function canManageAccount(vm) {
  const scope = {
    init() {
      scope.userRole = null;
      scope.userEmail = null;
      scope.token = null;

      scope.userEmailDisplay = document.getElementById("user-email-display");
      scope.emailInput = document.getElementById("email-input");
      scope.passwordInput = document.getElementById("password-input");
      scope.loginSection = document.getElementById("login-section");
      scope.logoutBtn = document.getElementById("logout-btn");
      scope.loginBtn = document.getElementById("login-btn");
      scope.userControls = document.getElementById("user-controls");
      scope.loginBtn.addEventListener("click", () => {
        console.log("Login button clicked");
        scope.login()
      });
      scope.logoutBtn.addEventListener("click", () => scope.confirmLogout());
      scope.passwordInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") scope.login();
      });

      console.log("Account composables initialized",{
        loginBtn:scope.loginBtn
      });
    },
    mounted(){
      scope.checkLoginStatus();
    },

    confirmLogout() {
      // Show confirmation modal before logout
      vm.canShowModal.showModal("Confirm Logout", "Are you sure you want to log out?", () =>
        scope.logout()
      );
    },
    isTokenExpired(token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expirationTime;
      } catch (e) {
        console.error("Error decoding token:", e);
        return true; // Assume expired or invalid if decoding fails
      }
    },

    logout() {
      console.debug("Logging out user:", scope.userEmail);

      // Clear user data
      scope.token = null;
      vm.canManageOrgs.organizationId = null;
      scope.userRole = null;
      scope.userEmail = null;

      // Clear localStorage
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("organizationId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");

      // Update UI for logged out state
      scope.loginSection.style.display = "flex";
      vm.useNavigation.dashboardSection.style.display = "none";
      scope.userControls.style.display = "none";
      scope.userEmailDisplay.textContent = "";

      vm.canLog.addLog("info", "👋 Logged out successfully");

      // Close the modal if it's open
      if (vm.canShowModal.modal.open) {
        vm.canShowModal.close();
      }
    },
    async login() {
      console.debug("Logging in user:", this.emailInput.value);
      const email = this.emailInput.value.trim();
      const password = this.passwordInput.value.trim();

      if (!email || !password) {
        vm.canLog.addLog("error", "❌ Email and password are required");
        return;
      }

      try {
        console.debug("Attempting login with:", { email });
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        console.debug("Login response data:", data);

        this.token = data.token;
        scope.userEmail = email;

        // Extract organizationId and role either from direct response or from token
        if (data.organizationId) {
          vm.canManageOrgs.organizationId = data.organizationId;
        } else {
          // Try to extract from token
          try {
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            vm.canManageOrgs.organizationId = payload.organizationId || null;
            console.debug(
              "Extracted organizationId from token:",
              vm.canManageOrgs.organizationId
            );
          } catch (e) {
            console.debug("Failed to extract organizationId from token:", e);
            vm.canManageOrgs.organizationId = null;
          }
        }

        // Get role from response or token
        if (data.role) {
          this.userRole = data.role;
        } else {
          // Try to extract from token
          try {
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            this.userRole = payload.role || null;
            console.debug("Extracted role from token:", this.userRole);
          } catch (e) {
            console.debug("Failed to extract role from token:", e);
            this.userRole = null;
          }
        }

        // Store user data in localStorage (only if values exist)
        localStorage.setItem("jwtToken", this.token);
        if (vm.canManageOrgs.organizationId)
          localStorage.setItem("organizationId", vm.canManageOrgs.organizationId);
        if (this.userRole) localStorage.setItem("userRole", this.userRole);
        localStorage.setItem("userEmail", email);

        // Update UI for logged in state
        scope.loginSection.style.display = "none";
        vm.useNavigation.dashboardSection.style.display = "grid";
        this.userControls.style.display = "block";
        scope.userEmailDisplay.textContent = email;

        vm.canLog.addLog("success", "✅ Logged in successfully");
        vm.useDashboard.loadDashboard();
        vm.useNavigation.updateUIVisibility();
      } catch (error) {
        console.error("Login failed:", error);
        vm.canLog.addLog("error", `❌ ${error.message}`);
      }
    },
    checkLoginStatus() {
      const storedToken = localStorage.getItem("jwtToken");
      const storedOrgId = localStorage.getItem("organizationId");
      const storedRole = localStorage.getItem("userRole");
      const storedEmail = localStorage.getItem("userEmail");

      console.debug("Checking login status:", {
        hasToken: !!storedToken,
        organizationId: storedOrgId,
        role: storedRole,
        email: storedEmail,
      });

      if (storedToken) {
        if (this.isTokenExpired(storedToken)) {
          vm.canLog.addLog("info", "Token expired. Please log in again.");
          this.logout(); // Clear token and redirect to login
        } else {
          this.token = storedToken;

          // Ensure organizationId is valid and not 'undefined' or 'null' strings
          if (
            storedOrgId &&
            storedOrgId !== "undefined" &&
            storedOrgId !== "null"
          ) {
            vm.canManageOrgs.organizationId = storedOrgId;
          } else {
            // Try to extract organizationId from JWT token
            try {
              const payload = JSON.parse(atob(storedToken.split(".")[1]));
              vm.canManageOrgs.organizationId = payload.organizationId || null;
              // Update localStorage with the extracted value if found
              if (vm.canManageOrgs.organizationId) {
                localStorage.setItem("organizationId", vm.canManageOrgs.organizationId);
              }
              console.debug(
                "Extracted organizationId from token:",
                vm.canManageOrgs.organizationId
              );
            } catch (e) {
              console.debug("Failed to extract organizationId from token:", e);
              vm.canManageOrgs.organizationId = null;
            }
          }

          scope.userRole = storedRole;
          scope.userEmail = storedEmail || "User";

          // Update UI for logged in state
          scope.loginSection.style.display = "none";
          vm.useNavigation.dashboardSection.style.display = "grid";
          scope.userControls.style.display = "block";
          scope.userEmailDisplay.textContent = scope.userEmail;

          vm.canLog.addLog("success", "✅ Auto-logged in");
          vm.useDashboard.loadDashboard();
          vm.useNavigation.updateUIVisibility();
        }
      } else {
        scope.loginSection.style.display = "flex";
        vm.useNavigation.dashboardSection.style.display = "none";
      }
    },
  };
  return scope;
}
