const mongoose = require('mongoose');

const rpgSaveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slotId: {
        type: String,
        required: true,
        default: 'default'
    },
    saveData: {
        type: Object,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only have one save per slot
rpgSaveSchema.index({ userId: 1, slotId: 1 }, { unique: true });

module.exports = mongoose.model('RpgSave', rpgSaveSchema);
