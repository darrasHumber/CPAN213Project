const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['venue', 'catering', 'decorations', 'entertainment', 'photography', 'transportation', 'florist', 'other'],
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  services: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['researching', 'contacted', 'quoted', 'booked', 'confirmed', 'cancelled'],
    default: 'researching'
  },
  quotedPrice: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  finalPrice: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  contractSigned: {
    type: Boolean,
    default: false
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  depositAmount: {
    type: Number,
    min: [0, 'Deposit cannot be negative'],
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
vendorSchema.index({ eventId: 1, category: 1 });
vendorSchema.index({ eventId: 1, status: 1 });
vendorSchema.index({ name: 1 });

// Virtual to check if vendor is fully secured
vendorSchema.virtual('isSecured').get(function() {
  return this.contractSigned && this.depositPaid;
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
