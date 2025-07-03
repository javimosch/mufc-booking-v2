class CLIWebUI {
    constructor() {
        this.canCompose = canCompose(this)
        this.canCompose.compose('canLog',canLog(this))
        this.canCompose.compose('canUseApi',canUseApi(this))
        this.canCompose.compose('canManageUsers',canManageUsers(this))
        this.canCompose.compose('canManageAccount',canManageAccount(this))
        this.canCompose.compose('canShowModal',canShowModal(this))
        this.canCompose.compose('canManageEvents',canManageEvents(this))
        this.canCompose.compose('canManageOrgs',canManageOrgs(this))
        this.canCompose.compose('useNavigation',useNavigation(this))
        this.canCompose.compose('useDashboard',useDashboard(this))

        //====
        //register new composables here...) (remember to add js file in index.html)
        //====

        this.canCompose.callComposablesLifeCycleMethod('init');       
        this.canCompose.callComposablesLifeCycleMethod('mounted');         
    }
}

// Initialize the UI instance
//Wait for DOM load
window.addEventListener('DOMContentLoaded', () => {
    window.ui = new CLIWebUI();
    console.debug('CLIWebUI initialized successfully');
});