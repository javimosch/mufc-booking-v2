const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseManager {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.callbacks = [];
  }

  async connect() {
    try {
      if (this.isConnected) {
        return { success: true, message: 'Already connected to database' };
      }

      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      console.log('Connecting to MongoDB...');
      this.connection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully');
      this.onConnect();
      return { success: true, message: 'Connected to database successfully' };
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      return { success: false, error: error.message };
    }
  }

  onConnect() {
    this.callbacks.forEach(callback => callback());
  }

  on(event, callback) {
    if (event === 'connected') {
      this.callbacks.push(callback);
    }
  }

  async disconnect() {
    try {
      if (!this.isConnected) {
        return { success: true, message: 'Already disconnected from database' };
      }

      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
      return { success: true, message: 'Disconnected from database successfully' };
    } catch (error) {
      console.error('❌ Failed to disconnect from MongoDB:', error.message);
      return { success: false, error: error.message };
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }

  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { success: false, error: 'Not connected to database' };
      }

      // Simple ping to check if database is responsive
      await mongoose.connection.db.admin().ping();
      return { success: true, message: 'Database is healthy' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create a singleton instance
const databaseManager = new DatabaseManager();

module.exports = databaseManager;