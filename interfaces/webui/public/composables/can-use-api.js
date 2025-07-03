function canUseApi(vm){
    return {
        authenticatedFetch: async (url, options = {}) => {
            if (!options.headers) {
                options.headers = {};
            }
            if (vm.canManageAccount.token) {
                options.headers['Authorization'] = `Bearer ${vm.canManageAccount.token}`;
            }
        
            const response = await fetch(url, options);
        
            if (response.status === 401) {
                vm.canLog.addLog('error', 'Unauthorized: Your session has expired. Please log in again.');
                vm.canManageAccount.logout();
                throw new Error('Unauthorized'); // Prevent further processing of this response
            }
        
            return response;
        }
    }
}