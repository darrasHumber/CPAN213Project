const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Guest = require('../models/Guest');
const Vendor = require('../models/Vendor');

// ============================================
// GET ALL EVENTS
// ============================================
router.get('/', async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query).sort({ date: 1 });
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
});

// ============================================
// GET SINGLE EVENT BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
});

// ============================================
// GET EVENT WITH FULL DETAILS (Guests + Vendors)
// ============================================
router.get('/:id/details', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get all guests for this event
    const guests = await Guest.find({ eventId: req.params.id }).sort({ name: 1 });
    
    // Get all vendors for this event
    const vendors = await Vendor.find({ eventId: req.params.id }).sort({ category: 1, name: 1 });

    // Calculate guest statistics
    const guestStats = {
      total: guests.length,
      confirmed: guests.filter(g => g.rsvpStatus === 'confirmed').length,
      pending: guests.filter(g => g.rsvpStatus === 'pending').length,
      declined: guests.filter(g => g.rsvpStatus === 'declined').length
    };

    // Calculate vendor statistics
    const vendorStats = {
      total: vendors.length,
      booked: vendors.filter(v => v.status === 'booked' || v.status === 'confirmed').length,
      totalQuoted: vendors.reduce((sum, v) => sum + (v.quotedPrice || 0), 0),
      totalFinal: vendors.reduce((sum, v) => sum + (v.finalPrice || 0), 0)
    };

    res.json({
      success: true,
      data: {
        event,
        guests,
        guestStats,
        vendors,
        vendorStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event details',
      error: error.message
    });
  }
});

// ============================================
// GET EVENT STATISTICS
// ============================================
router.get('/:id/stats', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const guestCount = await Guest.countDocuments({ eventId: req.params.id });
    const confirmedGuests = await Guest.countDocuments({ 
      eventId: req.params.id, 
      rsvpStatus: 'confirmed' 
    });
    
    const vendorCount = await Vendor.countDocuments({ eventId: req.params.id });
    const bookedVendors = await Vendor.countDocuments({ 
      eventId: req.params.id, 
      status: { $in: ['booked', 'confirmed'] }
    });

    res.json({
      success: true,
      data: {
        event: {
          name: event.name,
          date: event.date,
          location: event.location,
          status: event.status,
          budget: event.budget,
          daysUntil: event.daysUntilEvent()
        },
        guests: {
          total: guestCount,
          confirmed: confirmedGuests,
          pending: guestCount - confirmedGuests
        },
        vendors: {
          total: vendorCount,
          booked: bookedVendors,
          researching: vendorCount - bookedVendors
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event statistics',
      error: error.message
    });
  }
});

// ============================================
// CREATE NEW EVENT
// ============================================
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
});

// ============================================
// UPDATE EVENT
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
});

// ============================================
// UPDATE EVENT STATUS
// ============================================
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event status updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event status',
      error: error.message
    });
  }
});

// ============================================
// DELETE EVENT (and all related guests and vendors)
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete all guests associated with this event
    await Guest.deleteMany({ eventId: req.params.id });
    
    // Delete all vendors associated with this event
    await Vendor.deleteMany({ eventId: req.params.id });

    res.json({
      success: true,
      message: 'Event and all related data deleted successfully',
      deletedEvent: event.name
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
});

module.exports = router;
