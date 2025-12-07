const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'completed', 'cancelled'],
    default: 'planning'
  },
  budget: {
    type: Number,
    default: 0,
    min: [0, 'Budget cannot be negative']
  },
  guestCount: {
    type: Number,
    default: 0,
    min: [0, 'Guest count cannot be negative']
  },
  vendorCount: {
    type: Number,
    default: 0,
    min: [0, 'Vendor count cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ createdAt: -1 });

// Virtual to check if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Method to calculate days until event
eventSchema.methods.daysUntilEvent = function() {
  const today = new Date();
  const eventDate = new Date(this.date);
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
