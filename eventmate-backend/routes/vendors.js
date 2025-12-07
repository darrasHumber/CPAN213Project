const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Event = require('../models/Event');

// ============================================
// GET ALL VENDORS FOR AN EVENT
// ============================================
router.get('/event/:eventId', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = { eventId: req.params.eventId };

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const vendors = await Vendor.find(query).sort({ category: 1, name: 1 });
    
    res.json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors',
      error: error.message
    });
  }
});

// ============================================
// GET SINGLE VENDOR BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor',
      error: error.message
    });
  }
});

// ============================================
// GET VENDORS BY CATEGORY
// ============================================
router.get('/event/:eventId/category/:category', async (req, res) => {
  try {
    const vendors = await Vendor.find({
      eventId: req.params.eventId,
      category: req.params.category
    }).sort({ name: 1 });

    res.json({
      success: true,
      count: vendors.length,
      category: req.params.category,
      data: vendors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors by category',
      error: error.message
    });
  }
});

// ============================================
// GET VENDOR STATISTICS FOR AN EVENT
// ============================================
router.get('/event/:eventId/stats', async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments({ eventId: req.params.eventId });
    
    const bookedVendors = await Vendor.countDocuments({ 
      eventId: req.params.eventId, 
      status: { $in: ['booked', 'confirmed'] }
    });
    
    const contractsSigned = await Vendor.countDocuments({ 
      eventId: req.params.eventId, 
      contractSigned: true 
    });
    
    const depositsPaid = await Vendor.countDocuments({ 
      eventId: req.params.eventId, 
      depositPaid: true 
    });

    // Get all vendors to calculate totals
    const vendors = await Vendor.find({ eventId: req.params.eventId });
    
    const totalQuoted = vendors.reduce((sum, v) => sum + (v.quotedPrice || 0), 0);
    const totalFinal = vendors.reduce((sum, v) => sum + (v.finalPrice || 0), 0);
    const totalDeposits = vendors.reduce((sum, v) => sum + (v.depositAmount || 0), 0);

    // Get category breakdown
    const categoryMap = {};
    vendors.forEach(vendor => {
      if (!categoryMap[vendor.category]) {
        categoryMap[vendor.category] = {
          category: vendor.category,
          count: 0,
          booked: 0
        };
      }
      categoryMap[vendor.category].count++;
      if (vendor.status === 'booked' || vendor.status === 'confirmed') {
        categoryMap[vendor.category].booked++;
      }
    });

    const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: {
        total: totalVendors,
        booked: bookedVendors,
        contractsSigned,
        depositsPaid,
        pricing: {
          totalQuoted,
          totalFinal,
          totalDeposits
        },
        categoryBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor statistics',
      error: error.message
    });
  }
});

// ============================================
// ADD SINGLE VENDOR
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

    const vendor = new Vendor(req.body);
    await vendor.save();

    // Update vendor count in event
    const vendorCount = await Vendor.countDocuments({ eventId: req.body.eventId });
    await Event.findByIdAndUpdate(req.body.eventId, { vendorCount });
    
    res.status(201).json({
      success: true,
      message: 'Vendor added successfully',
      data: vendor
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
      message: 'Error adding vendor',
      error: error.message
    });
  }
});

// ============================================
// ADD MULTIPLE VENDORS (BULK)
// ============================================
router.post('/bulk', async (req, res) => {
  try {
    const { eventId, vendors } = req.body;

    if (!eventId || !vendors || !Array.isArray(vendors)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Provide eventId and vendors array'
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

    // Add eventId to each vendor
    const vendorsWithEventId = vendors.map(vendor => ({
      ...vendor,
      eventId
    }));

    const createdVendors = await Vendor.insertMany(vendorsWithEventId);

    // Update vendor count in event
    const vendorCount = await Vendor.countDocuments({ eventId });
    await Event.findByIdAndUpdate(eventId, { vendorCount });
    
    res.status(201).json({
      success: true,
      message: `${createdVendors.length} vendors added successfully`,
      count: createdVendors.length,
      data: createdVendors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding vendors',
      error: error.message
    });
  }
});

// ============================================
// UPDATE VENDOR
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor
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
      message: 'Error updating vendor',
      error: error.message
    });
  }
});

// ============================================
// UPDATE VENDOR STATUS
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

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor status updated successfully',
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating vendor status',
      error: error.message
    });
  }
});

// ============================================
// UPDATE CONTRACT AND DEPOSIT STATUS
// ============================================
router.patch('/:id/contract', async (req, res) => {
  try {
    const { contractSigned, depositPaid, depositAmount } = req.body;
    
    const updateData = {};
    if (contractSigned !== undefined) updateData.contractSigned = contractSigned;
    if (depositPaid !== undefined) updateData.depositPaid = depositPaid;
    if (depositAmount !== undefined) updateData.depositAmount = depositAmount;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Contract/deposit status updated successfully',
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contract status',
      error: error.message
    });
  }
});

// ============================================
// DELETE VENDOR
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Update vendor count in event
    const vendorCount = await Vendor.countDocuments({ eventId: vendor.eventId });
    await Event.findByIdAndUpdate(vendor.eventId, { vendorCount });

    res.json({
      success: true,
      message: 'Vendor deleted successfully',
      deletedVendor: vendor.name
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting vendor',
      error: error.message
    });
  }
});

// ============================================
// DELETE ALL VENDORS FOR AN EVENT
// ============================================
router.delete('/event/:eventId/all', async (req, res) => {
  try {
    const result = await Vendor.deleteMany({ eventId: req.params.eventId });
    
    // Update vendor count in event
    await Event.findByIdAndUpdate(req.params.eventId, { vendorCount: 0 });

    res.json({
      success: true,
      message: `${result.deletedCount} vendors deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting vendors',
      error: error.message
    });
  }
});

module.exports = router;
