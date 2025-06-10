#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const ConfigManager = require('../utils/config-manager');
const FileOperations = require('../utils/file-operations');
const manageOrganizations = require('./cli/organization');
const manageUsers = require('./cli/user');
const manageWebUIUsers = require('./cli/webui-user');
const manageMatchEvents = require('./cli/match-event');

// Load environment variables
require('dotenv').config();

// Configuration
const CONFIG_FILE = '.cliui-config.json';

// Command line argument parsing
const args = process.argv.slice(2);
const hasUIFlag = args.includes('--ui') || args.includes('-u');
const hasHelpFlag = args.includes('--help') || args.includes('-h');

// Show help if requested
if (hasHelpFlag) {
  console.log(`
🚀 CLI+WebUI Boilerplate

Usage:
  cliui-boilerplate [options]
  node src/cli.js [options]

Options:
  --ui, -u     Launch web UI instead of CLI interface
  --help, -h   Show this help message

Examples:
  cliui-boilerplate          # Run interactive CLI
  cliui-boilerplate --ui     # Launch web UI
  cliui-boilerplate -u       # Launch web UI (short form)

For more information, visit: https://github.com/your-username/cliui-boilerplate
`);
  process.exit(0);
}

// Speed presets for performance control
const SPEED_PRESETS = {
  'turbo': {
    name: '🚀 Turbo (Fastest)',
    sleepBetweenOps: 0,
    batchSize: 500,
    progressInterval: 100
  },
  'fast': {
    name: '⚡ Fast',
    sleepBetweenOps: 10,
    batchSize: 200,
    progressInterval: 75
  },
  'normal': {
    name: '🐢 Normal (Balanced)',
    sleepBetweenOps: 50,
    batchSize: 100,
    progressInterval: 50
  },
  'gentle': {
    name: '🌱 Gentle (System-friendly)',
    sleepBetweenOps: 100,
    batchSize: 50,
    progressInterval: 25
  }
};

// Function to launch web UI
async function launchWebUI() {
  console.log('🚀 Launching Web UI...');
  console.log();

  const webuiPath = path.join(__dirname, '../interfaces/webui');
  try {
    await fs.access(webuiPath);
  } catch (error) {
    console.log('❌ Web UI directory not found.');
    throw new Error('Web UI directory not found');
  }

  const nodeModulesPath = path.join(webuiPath, 'node_modules');
  try {
    await fs.access(nodeModulesPath);
  } catch (error) {
    console.log('📦 Web UI dependencies not found. Installing...');
    console.log();
    const installProcess = spawn('npm', ['install'], {
      cwd: webuiPath,
      stdio: 'inherit'
    });
    const installResultCode = await new Promise((resolve, reject) => {
      installProcess.on('close', resolve);
      installProcess.on('error', reject);
    });
    if (installResultCode !== 0) {
      throw new Error(`npm install for web UI failed with code ${installResultCode}`);
    }
    console.log();
    console.log('✅ Web UI dependencies installed successfully!');
    console.log();
  }

  console.log('🌐 Starting web server...');
  console.log();

  return new Promise((resolve, reject) => {
    const serverProcess = spawn('npm', ['start'], {
      cwd: webuiPath,
      stdio: 'inherit',
      detached: false
    });

    serverProcess.on('close', (code) => {
      console.log(code === 0 || code === null ? '✅ Web server stopped.' : `❌ Web server exited with code ${code}.`);
      resolve({ exitCode: code === null ? 0 : code });
    });

    serverProcess.on('error', (err) => {
      console.error('❌ Failed to start web server process:', err.message);
      reject(err);
    });
  });
}

class GenericCLI {
  constructor() {
    this.config = {};
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Initialize managers
    this.configManager = new ConfigManager(CONFIG_FILE);
    this.fileOps = new FileOperations();
    // this.processService = new ProcessService(); // No longer needed
    
    // Default speed settings
    this.speedSettings = SPEED_PRESETS.normal;
    
    // Database status
    this.databaseConnected = false;
  }

  // Utility methods
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadConfig() {
    // Initialize database connections
    try {
      this.databaseConnected = await this.configManager.initialize();
      // await this.processService.initialize(); // No longer needed
      
      // if (this.databaseConnected) { // No longer needed
      //   await this.processService.logActivity('CLI_STARTED', { timestamp: new Date() });
      // }
    } catch (error) {
      console.log('⚠️  Database initialization failed, using file-based storage');
    }

    this.config = await this.configManager.load();
    
    // Load speed settings if saved
    if (this.config.speedPreset && SPEED_PRESETS[this.config.speedPreset]) {
      this.speedSettings = SPEED_PRESETS[this.config.speedPreset];
    }
  }

  async saveConfig() {
    const saved = await this.configManager.save(this.config);
    // if (saved && this.databaseConnected) { // No longer needed
    //   await this.processService.logActivity('CONFIG_SAVED', this.config);
    // }
    return saved;
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  // Display methods
  displayHeader() {
    console.clear();
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                   ⚽ MUFC Booking v2 ⚽                      ║');
    console.log('║                                                              ║');
    console.log('║        CLI for Super Admins to manage the system. 🚀         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log();
  }

  displayMenu() {
    const choices = [
      { name: 'Manage Organizations', value: 'manageOrganizations' },
      { name: 'Manage WebUI Users', value: 'manageWebUIUsers' },
      { name: 'Manage Match Events', value: 'manageMatchEvents' },
      { name: 'Manage Users', value: 'manageUsers' },
      { name: 'Configure Super Admin', value: 'manageSuperAdmin' },
      { name: 'Launch Web UI', value: 'launchWebUI' },
      { name: 'Exit', value: 'exit' }
    ];
    console.log('📋 Main Menu:');
    console.log();
    choices.forEach(choice => {
      console.log(`  ${choice.name}`);
    });
    console.log();
    console.log(`💾 Storage: ${this.databaseConnected ? 'MongoDB' : 'File-based'}`);
    console.log();
  }

  // Core functionality will be replaced with management functions
  async manageOrganizations() {
    await manageOrganizations(this);
  }

  async manageUsers() {
    await manageUsers(this);
  }

  async manageWebUIUsers() {
    await manageWebUIUsers(this);
  }

  async manageMatchEvents() {
    await manageMatchEvents(this);
  }

  async manageSuperAdmin() {
    this.displayHeader('Configure Super Admin');
    const username = await this.question('Enter super admin username: ');
    const password = await this.question('Enter super admin password: ', true);
    this.config.superAdmin = { username, password };
    await this.saveConfig();
    console.log('Super admin configured successfully.');
    await this.sleep(2000);
  }

  async launchWebUIFromMenu() {
    console.log('🚀 Launching Web UI...');
    console.log();
    console.log('💡 The web interface will run in the foreground of this terminal session.');
    console.log('💡 Close the web server (Ctrl+C) to return to this CLI menu.');
    console.log();

    const confirm = await this.question('Do you want to launch the web UI? (y/n): ');
    if (confirm.toLowerCase().startsWith('y')) {
      console.log('🌐 Starting web interface...');
      console.log();

      const tempSigintHandler = () => {
        console.log('\nℹ️  SIGINT received by CLI. Web server is expected to close.');
      };

      process.on('SIGINT', tempSigintHandler);

      try {
        await launchWebUI();
        console.log('✅ Web UI session finished.');
      } catch (error) {
        console.error('❌ Error during Web UI session:', error.message);
      } finally {
        process.removeListener('SIGINT', tempSigintHandler);
      }
      
      if (!this.rl.closed) {
        try {
          await this.question('Press Enter to return to the menu...');
        } catch (e) {
          console.log('\nℹ️  CLI prompt was interrupted. Returning to main loop.');
        }
      }
    } else {
      console.log('❌ Web UI launch cancelled.');
      await this.question('Press Enter to continue...');
    }
  }

  async run() {
    await this.loadConfig();

    while (true) {
      this.displayHeader();
      this.displayMenu();

      const choices = [
        { name: 'Manage Organizations', value: 'manageOrganizations' },
        { name: 'Manage WebUI Users', value: 'manageWebUIUsers' },
        { name: 'Manage Match Events', value: 'manageMatchEvents' },
        { name: 'Manage Users', value: 'manageUsers' },
        { name: 'Configure Super Admin', value: 'manageSuperAdmin' },
        { name: 'Launch Web UI', value: 'launchWebUI' },
        { name: 'Exit', value: 'exit' }
      ];

      const choice = await this.question(`Select an option (1-${choices.length}): `);
      const selectedChoice = choices[parseInt(choice.trim()) - 1];

      if (selectedChoice) {
        switch (selectedChoice.value) {
          case 'manageOrganizations':
            await this.manageOrganizations();
            break;
          case 'manageWebUIUsers':
            await this.manageWebUIUsers();
            break;
          case 'manageMatchEvents':
            await this.manageMatchEvents();
            break;
          case 'manageUsers':
            await this.manageUsers();
            break;
          case 'manageSuperAdmin':
            await this.manageSuperAdmin();
            break;
          case 'launchWebUI':
            await this.launchWebUIFromMenu();
            break;
          case 'exit':
            console.log('👋 Goodbye! Thanks for using MUFC Booking V2!');
            this.rl.close();
            return;
        }
      } else {
        console.log(`❌ Invalid option. Please select 1-${choices.length}.`);
        await this.question('Press Enter to continue...');
      }
    }
  }
}

// Main execution block
if (require.main === module) {
  if (hasUIFlag) {
    (async () => {
      try {
        process.on('SIGINT', () => {
          console.log('\n👋 SIGINT received in --ui mode. Web server should be shutting down.');
        });
        const { exitCode } = await launchWebUI();
        process.exit(exitCode);
      } catch (error) {
        console.error('❌ Failed to launch web UI:', error.message);
        process.exit(1);
      }
    })();
  } else {
    // Run the interactive CLI
    const cli = new GenericCLI();
    cli.run().catch(error => {
      if (error.message && error.message.includes('readline was closed')) {
        console.log('\n👋 CLI session terminated.');
      } else {
        console.error('❌ Fatal error in CLI:', error.message);
      }
      process.exit(1);
    });
  }
}

module.exports = GenericCLI;

