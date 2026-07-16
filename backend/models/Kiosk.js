const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const kioskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  pin: {
    type: String,
    required: true
  }
}, { timestamps: true });


// Avant d'enregistrer le kiosque, on hache son code PIN
kioskSchema.pre('save', async function () {
    if (!this.isModified('pin')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
  });

// Méthode pour comparer le PIN saisi avec le PIN haché en BDD
kioskSchema.methods.comparePin = async function (candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

module.exports = mongoose.model('Kiosk', kioskSchema);