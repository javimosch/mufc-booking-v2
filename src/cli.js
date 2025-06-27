#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const ConfigManager = require('../utils/config-manager');
const FileOperations = require('../utils/file-operations');
const manageOrganizations = require('./cli/organization');

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
    
    // Default speed settings
    this.speedSettings = SPEED_PRESETS.normal;
    
    // Database status
    this.databaseConnected = false;
    
    // Current user role (for role-based access control)
    this.currentUserRole = null;
    this.currentUser = null;
  }

  // Utility methods
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadConfig() {
    // Initialize database connections
    try {
      this.databaseConnected = await this.configManager.initialize();
    } catch (error) {
      console.log('⚠️  Database initialization failed, using file-based storage');
    }

    this.config = await this.configManager.load();
    
    // Load speed settings if saved
    if (this.config.speedPreset && SPEED_PRESETS[this.config.speedPreset]) {
      this.speedSettings = SPEED_PRESETS[this.config.speedPreset];
    }

    // Check for current user role
    await this.checkUserRole();
  }

  async checkUserRole() {
    if (!this.databaseConnected) {
      // If no database, assume superAdmin for CLI access
      this.currentUserRole = 'superAdmin';
      return;
    }

    // Check if there's a configured super admin
    if (this.config.currentUserEmail) {
      try {
        const { WebUIUser } = require('../utils/schemas');
        const user = await WebUIUser.findOne({ email: this.config.currentUserEmail });
        if (user) {
          this.currentUser = user;
          this.currentUserRole = user.role;
        }
      } catch (error) {
        console.log('⚠️  Could not verify user role');
      }
    }

    // If no user is set, prompt for login or assume superAdmin
    if (!this.currentUserRole) {
      this.currentUserRole = 'superAdmin'; // Default for CLI access
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
    const choices = this.getMenuChoices();
    console.log('📋 Main Menu:');
    console.log();
    choices.forEach((choice, index) => {
      console.log(`  ${index + 1}. ${choice.name}`);
    });
    console.log();
    console.log(`💾 Storage: ${this.databaseConnected ? 'MongoDB' : 'File-based'}`);
    if (this.currentUserRole) {
      console.log(`👤 Role: ${this.currentUserRole}`);
    }
    console.log();
  }

  getMenuChoices() {
    const allChoices = [
      { name: 'Manage Organizations', value: 'manageOrganizations', roles: ['superAdmin'] },
      { name: 'Manage WebUI Users', value: 'manageWebUIUsers', roles: ['superAdmin', 'orgAdmin'] },
      { name: 'Manage Match Events', value: 'manageMatchEvents', roles: ['orgAdmin'] },
      { name: 'Configure Super Admin', value: 'manageSuperAdmin', roles: ['superAdmin'] },
      { name: 'Launch Web UI', value: 'launchWebUI', roles: ['superAdmin', 'orgAdmin'] },
      { name: 'Exit', value: 'exit', roles: ['superAdmin', 'orgAdmin', 'user'] }
    ];

    // Filter choices based on current user role
    return allChoices.filter(choice => 
      !choice.roles || choice.roles.includes(this.currentUserRole)
    );
  }

  // Core functionality will be replaced with management functions
  async manageOrganizations() {
    await manageOrganizations(this);
  }

  

  async manageWebUIUsers() {
    await manageWebUIUsers(this);
  }

  async manageMatchEvents() {
    await manageMatchEvents(this);
  }

  async manageSuperAdmin() {
    console.clear();
    console.log('🔧 Configure Super Admin');
    console.log('═══════════════════════');
    
    if (!this.databaseConnected) {
      console.log('❌ Database connection required for user management.');
      await this.question('Press Enter to continue...');
      return;
    }

    const email = await this.question('Enter super admin email: ');
    if (!email) {
      console.log('❌ Email is required.');
      await this.question('Press Enter to continue...');
      return;
    }

    try {
      const { WebUIUser, Organization } = require('../utils/schemas');
      
      // Check if user exists
      let user = await WebUIUser.findOne({ email });
      
      if (user) {
        // Update existing user to superAdmin
        user.role = 'superAdmin';
        await user.save();
        console.log('✅ User updated to super admin successfully!');
      } else {
        // Create new superAdmin user
        const password = await this.question('Enter password for new super admin: ');
        if (!password) {
          console.log('❌ Password is required.');
          await this.question('Press Enter to continue...');
          return;
        }

        // Get or create a default organization for the superAdmin
        let org = await Organization.findOne();
        if (!org) {
          org = new Organization({ name: 'Default Organization', description: 'Default organization for system administration' });
          await org.save();
        }

        user = new WebUIUser({
          email,
          password,
          role: 'superAdmin',
          organizationId: org._id
        });
        await user.save();
        console.log('✅ Super admin created successfully!');
      }

      // Save current user email to config
      this.config.currentUserEmail = email;
      await this.saveConfig();
      
      // Update current user info
      this.currentUser = user;
      this.currentUserRole = 'superAdmin';
      
    } catch (error) {
      console.error('❌ Error configuring super admin:', error.message);
    }
    
    await this.question('Press Enter to continue...');
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

      const choices = this.getMenuChoices();

      const choice = await this.question(`Select an option (1-${choices.length}): `);
      const selectedChoice = choices[parseInt(choice.trim()) - 1];

      if (selectedChoice) {
        // Check role permissions before executing
        if (selectedChoice.roles && !selectedChoice.roles.includes(this.currentUserRole)) {
          console.log('❌ Access denied. Insufficient permissions.');
          await this.question('Press Enter to continue...');
          continue;
        }

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
