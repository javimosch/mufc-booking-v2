function canManageOrgs(vm) {
  const scope =  {
    init() {
      scope.organizationId = null;
      scope.organizationsContent = document.getElementById(
        "organizations-content"
      );
   

      scope.addOrganizationBtn = document.getElementById("add-organization-btn");


      scope.addOrganizationBtn.addEventListener('click', () => scope.showAddOrganizationModal());
        
    },
    renderOrganizations(organizations) {
      if (organizations.length === 0) {
        scope.organizationsContent.innerHTML = "<p>No organizations found.</p>";
        return;
      }
      const list = document.createElement("ul");
      organizations.forEach((org) => {
        const item = document.createElement("li");
        item.innerHTML = `
                    <div class="list-item-content">
                        <span>${org.name} - ${
          org.description || "No description"
        }</span>
                    </div>
                    <div class="list-item-actions button-group">
                        <button class="btn btn--secondary" onclick="ui.showEditOrganizationModal('${
                          org._id
                        }', '${org.name}', '${
          org.description || ""
        }')">Edit</button>
                        <button class="btn btn--danger" onclick="ui.showDeleteOrganizationModal('${
                          org._id
                        }', '${org.name}')">Delete</button>
                    </div>
                `;
        list.appendChild(item);
      });
      scope.organizationsContent.innerHTML = "";
      scope.organizationsContent.appendChild(list);
    },
    showAddOrganizationModal() {
      vm.canShowModal.showModal(
        "Add Organization",
        scope.getOrganizationForm(),
        () => scope.addOrganization()
      );
    },
    getOrganizationForm(name = "", description = "") {
      return `
                <div class="form-group">
                    <label class="label" for="org-name-input">Name</label>
                    <input type="text" id="org-name-input" class="input" placeholder="Organization name..." value="${name}">
                </div>
                <div class="form-group">
                    <label class="label" for="org-description-input">Description</label>
                    <input type="text" id="org-description-input" class="input" placeholder="Description..." value="${description}">
                </div>
            `;
    },
    async addOrganization() {
      console.debug('Adding organization...');
      const name = document.getElementById("org-name-input").value.trim();
      const description = document
        .getElementById("org-description-input")
        .value.trim();

      if (!name) {
        vm.canLog.addLog("error", "❌ Organization name is required");
        return;
      }

      try {
        const response = await vm.canUseApi.authenticatedFetch(
          "/api/organizations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add organization");
        }

        vm.canLog.addLog("success", "✅ Organization added successfully");
        scope.loadOrganizations();
      } catch (error) {
        console.error("Failed to add organization:", error);
        vm.canLog.addLog("error", `❌ ${error.message}`);
      }
    },

    showEditOrganizationModal(id, currentName, currentDescription) {
      const form = scope.getOrganizationForm(currentName, currentDescription);
      vm.canShowModal.showModal("Edit Organization", form, () =>
        scope.editOrganization(id)
      );
    },

    async editOrganization(id) {
      console.debug('Editing organization with id:', id);
      const name = document.getElementById("org-name-input").value.trim();
      const description = document
        .getElementById("org-description-input")
        .value.trim();

      if (!name) {
        vm.canLog.addLog("error", "❌ Organization name is required");
        return;
      }

      try {
        const response = await vm.canUseApi.authenticatedFetch(
          `/api/organizations/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update organization");
        }

        vm.canLog.addLog("success", "✅ Organization updated successfully");
        scope.loadOrganizations();
      } catch (error) {
        console.error("Failed to update organization:", error);
        vm.canLog.addLog("error", `❌ ${error.message}`);
      }
    },

    showDeleteOrganizationModal(id, name) {
      const message = `<p>Are you sure you want to delete <strong>${name}</strong>? This is irreversible.</p>`;
      vm.canShowModal.showModal("Delete Organization", message, () =>
        scope.deleteOrganization(id)
      );
    },

    async deleteOrganization(id) {
      console.debug('Deleting organization with id:', id);
      try {
        const response = await vm.canUseApi.authenticatedFetch(
          `/api/organizations/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete organization");
        }

        vm.canLog.addLog("success", "✅ Organization deleted successfully");
        scope.loadOrganizations();
      } catch (error) {
        console.error("Failed to delete organization:", error);
        vm.canLog.addLog("error", `❌ ${error.message}`);
      }
    },
    async loadOrganizations() {
      console.debug('Loading organizations...');
      try {
        const response = await vm.canUseApi.authenticatedFetch(
          "/api/organizations"
        );
        if (!response.ok) throw new Error("Failed to load organizations");
        const organizations = await response.json();
        scope.renderOrganizations(organizations);
      } catch (error) {
        console.error("Failed to load organizations:", error);
        vm.canLog.addLog("error", `❌ ${error.message}`);
      }
    },
  };
  return scope;
}
