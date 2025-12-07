const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'declined'],
    default: 'pending'
  },
  plusOne: {
    type: Boolean,
    default: false
  },
  dietaryRestrictions: {
    type: String,
    trim: true,
    maxlength: [200, 'Dietary restrictions cannot exceed 200 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
guestSchema.index({ eventId: 1, rsvpStatus: 1 });
guestSchema.index({ name: 1 });

// Virtual to get total attendees (including plus one)
guestSchema.virtual('totalAttendees').get(function() {
  return this.plusOne ? 2 : 1;
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
