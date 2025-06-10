const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const { ENCRYPTION_SALT_ROUNDS } = require('./constants');
const { getWorkingDir } = require('./file-operations');
const databaseManager = require('./database');
const { Organization, WebUIUser } = require('./schemas');

class ConfigManager {
  constructor(configFile) {
    this.configFile = configFile;
    this.defaults = {
      superAdminUsername: 'admin',
      superAdminPassword: 'password',
      lastUpdated: null
    };
    this.useDatabase = false;
    this.userId = 'superadmin';
  }

  async initialize() {
    // Try to connect to database
    const dbResult = await databaseManager.connect();
    this.useDatabase = dbResult.success;
    
    if (this.useDatabase) {
      console.log('📊 Using MongoDB for configuration storage');
      // Ensure super admin user exists, or create it.
      // This part will be implemented later.
    } else {
      console.log('📁 Using file-based configuration storage');
    }
    
    return this.useDatabase;
  }

  async load() {
    try {
      if (this.useDatabase) {
        return await this.loadFromDatabase();
      } else {
        return await this.loadFromFile();
      }
    } catch (error) {
      console.error('❌ Failed to load configuration:', error.message);
      return { ...this.defaults };
    }
  }

  async loadFromDatabase() {
    try {
      // This will need to be adapted for super admin config
      // For now, returning defaults.
      return { ...this.defaults };
    } catch (error) {
      console.error('❌ Database load error:', error.message);
      return { ...this.defaults };
    }
  }

  async loadFromFile() {
    try {
      const configData = await fs.readFile(this.configFile, 'utf8');
      const config = JSON.parse(configData);
      return { ...this.defaults, ...config };
    } catch (error) {
      // Return defaults if config file doesn't exist or is invalid
      return { ...this.defaults };
    }
  }

  async save(config) {
    try {
      const configToSave = { ...config };
      if (configToSave.superAdmin && configToSave.superAdmin.password) {
        const salt = await bcrypt.genSalt(ENCRYPTION_SALT_ROUNDS);
        configToSave.superAdmin.password = await bcrypt.hash(configToSave.superAdmin.password, salt);
      }
      const success = await this.saveToFile(configToSave);
      if (success) {
        this.config = configToSave;
      }
      return success;
    } catch (error) {
      console.error('Error saving configuration:', error);
      return false;
    }
  }

  async saveToDatabase(config) {
    try {
      // This will need to be adapted for super admin config
      return true;
    } catch (error) {
      console.error('❌ Database save error:', error.message);
      return false;
    }
  }

  async saveToFile(config) {
    const configToSave = {
      ...config,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      await fs.writeFile(this.configFile, JSON.stringify(configToSave, null, 2));
      return true;
    } catch (error) {
      console.error('❌ Failed to save configuration:', error.message);
      return false;
    }
  }

  async exists() {
    if (this.useDatabase) {
      // This will need to be adapted for super admin config
      return false;
    } else {
      try {
        await fs.access(this.configFile);
        return true;
      } catch (error) {
        return false;
      }
    }
  }

  async reset() {
    if (this.useDatabase) {
      // This will need to be adapted for super admin config
      return true;
    } else {
      try {
        await fs.unlink(this.configFile);
        return true;
      } catch (error) {
        return false;
      }
    }
  }

  async getStats() {
    if (this.useDatabase) {
      try {
        const orgCount = await Organization.countDocuments();
        const webUserCount = await WebUIUser.countDocuments();
        
        return {
          storageType: 'MongoDB',
          organizationCount: orgCount,
          webUserCount: webUserCount,
          databaseStatus: databaseManager.getConnectionStatus()
        };
      } catch (error) {
        return {
          storageType: 'MongoDB (Error)',
          error: error.message
        };
      }
    } else {
      return {
        storageType: 'File-based',
        configFile: this.configFile
      };
    }
  }
}

module.exports = ConfigManager;
