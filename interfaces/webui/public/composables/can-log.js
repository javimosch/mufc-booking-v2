function canLog() {
  const scope = {
    init() {
      console.debug('Initializing activity log');
      this.logContainer = document.getElementById("log-container");
    },
    addLog(type, message) {
      console.debug(`Adding log entry: ${message}`);
      const logEntry = document.createElement("div");
      logEntry.className = `log-entry ${type}`;
      logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

      scope.logContainer.appendChild(logEntry);
      scope.logContainer.scrollTop = scope.logContainer.scrollHeight;
    },
  };
  return scope;
}
