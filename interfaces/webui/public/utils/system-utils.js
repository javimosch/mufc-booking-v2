
/**
 * Copies text to clipboard and logs the result.
 * @param {*} textToCopy 
 */
function copyToClipboard(textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        this.canLog.addLog('success', '✅ Copied to clipboard!');
    }).catch(err => {
        this.canLog.addLog('error', '❌ Failed to copy to clipboard.');
        console.error('Error copying to clipboard:', err);
    });
}