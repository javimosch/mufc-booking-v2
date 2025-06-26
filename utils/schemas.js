const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const webUIUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Added role field
}, { timestamps: true });

// Pre-save hook to hash password
webUIUserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nickName: String,
  phone: String,
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }
});

const matchEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  repeatEach: { type: String, enum: ['none', 'week', 'month'], default: 'none' },
  subscriptions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: mongoose.Schema.Types.Mixed,
  }],
  metadata: mongoose.Schema.Types.Mixed,
  active: { type: Boolean, default: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
}, { timestamps: true });

const passedMatchEventSchema = new mongoose.Schema({
  matchEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchEvent' },
  eventDate: { type: Date, required: true },
  subscriptions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'WebUIUser' },
    metadata: mongoose.Schema.Types.Mixed,
  }],
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);
const WebUIUser = mongoose.model('WebUIUser', webUIUserSchema);
const User = mongoose.model('User', userSchema);
const MatchEvent = mongoose.model('MatchEvent', matchEventSchema);
const PassedMatchEvent = mongoose.model('PassedMatchEvent', passedMatchEventSchema);

module.exports = {
  Organization,
  WebUIUser,

  MatchEvent,
  PassedMatchEvent,
};
