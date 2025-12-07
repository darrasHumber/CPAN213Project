const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Guest = require('../models/Guest');
const Event = require('../models/Event');

// ============================================
// GET ALL GUESTS FOR AN EVENT
// ============================================
router.get('/event/:eventId', async (req, res) => {
  try {
    const { rsvpStatus } = req.query;
    let query = { eventId: req.params.eventId };

    if (rsvpStatus) {
      query.rsvpStatus = rsvpStatus;
    }

    const guests = await Guest.find(query).sort({ name: 1 });
    
    res.json({
      success: true,
      count: guests.length,
      data: guests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guests',
      error: error.message
    });
  }
});

// ============================================
// GET SINGLE GUEST BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.json({
      success: true,
      data: guest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guest',
      error: error.message
    });
  }
});

// ============================================
// GET GUEST STATISTICS FOR AN EVENT
// ============================================
router.get('/event/:eventId/stats', async (req, res) => {
  try {
    const totalGuests = await Guest.countDocuments({ eventId: req.params.eventId });
    const confirmedGuests = await Guest.countDocuments({ 
      eventId: req.params.eventId, 
      rsvpStatus: 'confirmed' 
    });
    const pendingGuests = await Guest.countDocuments({ 
      eventId: req.params.eventId, 
      rsvpStatus: 'pending' 
    });
    const declinedGuests = await Guest.countDocuments({ 
      eventId: req.params.eventId, 
      rsvpStatus: 'declined' 
    });
    
    const guestsWithPlusOne = await Guest.countDocuments({ 
      eventId: req.params.eventId, 
      plusOne: true,
      rsvpStatus: 'confirmed'
    });

    const estimatedAttendees = confirmedGuests + guestsWithPlusOne;

    res.json({
      success: true,
      data: {
        total: totalGuests,
        confirmed: confirmedGuests,
        pending: pendingGuests,
        declined: declinedGuests,
        withPlusOne: guestsWithPlusOne,
        estimatedAttendees: estimatedAttendees
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guest statistics',
      error: error.message
    });
  }
});

// ============================================
// ADD SINGLE GUEST
// ============================================
router.post('/', async (req, res) => {
  try {
    // Verify event exists
    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const guest = new Guest(req.body);
    await guest.save();

    // Update guest count in event
    const guestCount = await Guest.countDocuments({ eventId: req.body.eventId });
    await Event.findByIdAndUpdate(req.body.eventId, { guestCount });
    
    res.status(201).json({
      success: true,
      message: 'Guest added successfully',
      data: guest
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
      message: 'Error adding guest',
      error: error.message
    });
  }
});

// ============================================
// ADD MULTIPLE GUESTS (BULK)
// ============================================
router.post('/bulk', async (req, res) => {
  try {
    const { eventId, guests } = req.body;

    if (!eventId || !guests || !Array.isArray(guests)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Provide eventId and guests array'
      });
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Add eventId to each guest
    const guestsWithEventId = guests.map(guest => ({
      ...guest,
      eventId
    }));

    const createdGuests = await Guest.insertMany(guestsWithEventId);

    // Update guest count in event
    const guestCount = await Guest.countDocuments({ eventId });
    await Event.findByIdAndUpdate(eventId, { guestCount });
    
    res.status(201).json({
      success: true,
      message: `${createdGuests.length} guests added successfully`,
      count: createdGuests.length,
      data: createdGuests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding guests',
      error: error.message
    });
  }
});

// ============================================
// UPDATE GUEST
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.json({
      success: true,
      message: 'Guest updated successfully',
      data: guest
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
      message: 'Error updating guest',
      error: error.message
    });
  }
});

// ============================================
// UPDATE GUEST RSVP STATUS
// ============================================
router.patch('/:id/rsvp', async (req, res) => {
  try {
    const { rsvpStatus } = req.body;
    
    if (!rsvpStatus) {
      return res.status(400).json({
        success: false,
        message: 'RSVP status is required'
      });
    }

    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { rsvpStatus },
      { new: true, runValidators: true }
    );
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.json({
      success: true,
      message: 'RSVP status updated successfully',
      data: guest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating RSVP status',
      error: error.message
    });
  }
});

// ============================================
// DELETE GUEST
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Update guest count in event
    const guestCount = await Guest.countDocuments({ eventId: guest.eventId });
    await Event.findByIdAndUpdate(guest.eventId, { guestCount });

    res.json({
      success: true,
      message: 'Guest deleted successfully',
      deletedGuest: guest.name
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting guest',
      error: error.message
    });
  }
});

// ============================================
// DELETE ALL GUESTS FOR AN EVENT
// ============================================
router.delete('/event/:eventId/all', async (req, res) => {
  try {
    const result = await Guest.deleteMany({ eventId: req.params.eventId });
    
    // Update guest count in event
    await Event.findByIdAndUpdate(req.params.eventId, { guestCount: 0 });

    res.json({
      success: true,
      message: `${result.deletedCount} guests deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting guests',
      error: error.message
    });
  }
});

module.exports = router;
