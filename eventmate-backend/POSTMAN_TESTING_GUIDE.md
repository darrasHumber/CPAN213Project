# EventMate API - Postman Testing Guide

## 🚀 SETUP

### Step 1: Start Server
```bash
cd eventmate-backend
npm install
npm start
```
✅ Server running on: `http://localhost:5000`

### Step 2: Postman Setup
1. Open Postman
2. Create Collection: "EventMate API"
3. Base URL: `http://localhost:5000/api`

---

## 📋 COMPLETE TEST SUITE

Copy and paste these tests directly into Postman!

---

## ✅ TEST 0: Server Check

**GET** `http://localhost:5000/`

**Expected:** Welcome message with all endpoints

---

# 🎯 EVENTS (10 Tests)

## TEST 1: Create Event

**POST** `http://localhost:5000/api/events`  
**Headers:** `Content-Type: application/json`

```json
{
  "name": "Sarah & John's Wedding",
  "date": "2025-08-15",
  "time": "16:00",
  "location": "Riverside Gardens Hotel",
  "description": "Beautiful outdoor summer wedding",
  "status": "planning",
  "budget": 35000
}
```

💾 **SAVE THE `_id` FROM RESPONSE!** You'll need it for other tests.

---

## TEST 2: Create Another Event

**POST** `http://localhost:5000/api/events`

```json
{
  "name": "Tech Company Annual Gala",
  "date": "2025-12-20",
  "time": "18:30",
  "location": "Downtown Convention Center",
  "description": "Year-end celebration",
  "status": "confirmed",
  "budget": 50000
}
```

---

## TEST 3: Get All Events

**GET** `http://localhost:5000/api/events`

**Expected:** Array of both events

---

## TEST 4: Get Single Event

**GET** `http://localhost:5000/api/events/YOUR_EVENT_ID_HERE`

Replace `YOUR_EVENT_ID_HERE` with the `_id` from TEST 1

---

## TEST 5: Get Event Full Details

**GET** `http://localhost:5000/api/events/YOUR_EVENT_ID_HERE/details`

**Expected:** Event + all guests + all vendors + statistics

---

## TEST 6: Get Upcoming Events Only

**GET** `http://localhost:5000/api/events?upcoming=true`

---

## TEST 7: Update Event

**PUT** `http://localhost:5000/api/events/YOUR_EVENT_ID_HERE`

```json
{
  "name": "Sarah & John's Dream Wedding (Updated)",
  "budget": 38000,
  "location": "Riverside Gardens - Premium Package"
}
```

---

## TEST 8: Update Event Status

**PATCH** `http://localhost:5000/api/events/YOUR_EVENT_ID_HERE/status`

```json
{
  "status": "confirmed"
}
```

---

## TEST 9: Get Event Statistics

**GET** `http://localhost:5000/api/events/YOUR_EVENT_ID_HERE/stats`

**Expected:** Complete stats for guests, vendors, budget

---

## TEST 10: Delete Event (Save for Last!)

**DELETE** `http://localhost:5000/api/events/YOUR_EVENT_ID_HERE`

⚠️ **Warning:** This also deletes ALL guests and vendors for this event!

---

# 👥 GUESTS (10 Tests)

## TEST 11: Add Single Guest

**POST** `http://localhost:5000/api/guests`

```json
{
  "eventId": "YOUR_EVENT_ID_HERE",
  "name": "Michael Thompson",
  "email": "michael.t@email.com",
  "phone": "+1-555-0101",
  "rsvpStatus": "pending",
  "plusOne": true,
  "dietaryRestrictions": "None",
  "notes": "Bride's college friend"
}
```

💾 **SAVE THE GUEST `_id`!**

---

## TEST 12: Add Multiple Guests (Bulk)

**POST** `http://localhost:5000/api/guests/bulk`

```json
{
  "eventId": "YOUR_EVENT_ID_HERE",
  "guests": [
    {
      "name": "Emily Rodriguez",
      "email": "emily.r@email.com",
      "phone": "+1-555-0102",
      "rsvpStatus": "confirmed",
      "plusOne": false,
      "dietaryRestrictions": "Vegetarian"
    },
    {
      "name": "James Wilson",
      "email": "james.w@email.com",
      "phone": "+1-555-0103",
      "rsvpStatus": "confirmed",
      "plusOne": true
    },
    {
      "name": "Sarah Chen",
      "email": "sarah.c@email.com",
      "phone": "+1-555-0104",
      "rsvpStatus": "pending",
      "dietaryRestrictions": "Gluten-free"
    },
    {
      "name": "David Martinez",
      "email": "david.m@email.com",
      "phone": "+1-555-0105",
      "rsvpStatus": "confirmed",
      "plusOne": true
    },
    {
      "name": "Lisa Anderson",
      "email": "lisa.a@email.com",
      "phone": "+1-555-0106",
      "rsvpStatus": "declined"
    }
  ]
}
```

---

## TEST 13: Get All Guests for Event

**GET** `http://localhost:5000/api/guests/event/YOUR_EVENT_ID_HERE`

**Expected:** All guests for this event

---

## TEST 14: Get Confirmed Guests Only

**GET** `http://localhost:5000/api/guests/event/YOUR_EVENT_ID_HERE?rsvpStatus=confirmed`

---

## TEST 15: Get Single Guest

**GET** `http://localhost:5000/api/guests/YOUR_GUEST_ID_HERE`

Use guest ID from TEST 11

---

## TEST 16: Update Guest

**PUT** `http://localhost:5000/api/guests/YOUR_GUEST_ID_HERE`

```json
{
  "phone": "+1-555-9999",
  "dietaryRestrictions": "Allergic to shellfish",
  "notes": "Prefers table near bride's family"
}
```

---

## TEST 17: Update Guest RSVP

**PATCH** `http://localhost:5000/api/guests/YOUR_GUEST_ID_HERE/rsvp`

```json
{
  "rsvpStatus": "confirmed"
}
```

---

## TEST 18: Get Guest Statistics

**GET** `http://localhost:5000/api/guests/event/YOUR_EVENT_ID_HERE/stats`

**Expected:** Total, confirmed, pending, declined counts

---

## TEST 19: Delete Single Guest

**DELETE** `http://localhost:5000/api/guests/YOUR_GUEST_ID_HERE`

---

## TEST 20: Delete All Guests for Event

**DELETE** `http://localhost:5000/api/guests/event/YOUR_EVENT_ID_HERE/all`

⚠️ **Warning:** Deletes ALL guests!

---

# 🏢 VENDORS (11 Tests)

## TEST 21: Add Single Vendor

**POST** `http://localhost:5000/api/vendors`

```json
{
  "eventId": "YOUR_EVENT_ID_HERE",
  "name": "Riverside Gardens Hotel",
  "category": "venue",
  "contactPerson": "Jennifer Smith",
  "email": "events@riversidegardens.com",
  "phone": "+1-555-1001",
  "website": "www.riversidegardens.com",
  "rating": 4.8,
  "priceRange": "$$$",
  "services": ["Garden ceremony", "Indoor reception", "Parking"],
  "status": "booked",
  "quotedPrice": 6000,
  "finalPrice": 6000
}
```

💾 **SAVE THE VENDOR `_id`!**

---

## TEST 22: Add Multiple Vendors (Bulk)

**POST** `http://localhost:5000/api/vendors/bulk`

```json
{
  "eventId": "YOUR_EVENT_ID_HERE",
  "vendors": [
    {
      "name": "Gourmet Catering Co",
      "category": "catering",
      "contactPerson": "Chef Michael",
      "email": "bookings@gourmetcatering.com",
      "phone": "+1-555-1002",
      "rating": 4.9,
      "priceRange": "$$$",
      "services": ["Full dinner", "Appetizers", "Open bar"],
      "status": "quoted",
      "quotedPrice": 9000
    },
    {
      "name": "Perfect Moments Studio",
      "category": "photography",
      "contactPerson": "Sarah Johnson",
      "email": "hello@perfectmoments.com",
      "phone": "+1-555-1003",
      "rating": 5.0,
      "priceRange": "$$",
      "services": ["8-hour coverage", "Digital photos", "Album"],
      "status": "confirmed",
      "quotedPrice": 3500,
      "finalPrice": 3500
    },
    {
      "name": "Elegant Florals",
      "category": "decorations",
      "contactPerson": "Maria Garcia",
      "email": "orders@elegantflorals.com",
      "phone": "+1-555-1004",
      "rating": 4.7,
      "priceRange": "$$",
      "services": ["Bouquet", "Centerpieces", "Arch flowers"],
      "status": "contacted",
      "quotedPrice": 2000
    },
    {
      "name": "Beat Masters DJ",
      "category": "entertainment",
      "contactPerson": "DJ Marcus",
      "email": "bookings@beatmasters.com",
      "phone": "+1-555-1005",
      "rating": 4.6,
      "priceRange": "$$",
      "services": ["Professional DJ", "Sound system", "Lighting"],
      "status": "quoted",
      "quotedPrice": 1500
    }
  ]
}
```

---

## TEST 23: Get All Vendors for Event

**GET** `http://localhost:5000/api/vendors/event/YOUR_EVENT_ID_HERE`

---

## TEST 24: Get Vendors by Category

**GET** `http://localhost:5000/api/vendors/event/YOUR_EVENT_ID_HERE/category/catering`

---

## TEST 25: Get Booked Vendors Only

**GET** `http://localhost:5000/api/vendors/event/YOUR_EVENT_ID_HERE?status=booked`

---

## TEST 26: Get Single Vendor

**GET** `http://localhost:5000/api/vendors/YOUR_VENDOR_ID_HERE`

---

## TEST 27: Update Vendor

**PUT** `http://localhost:5000/api/vendors/YOUR_VENDOR_ID_HERE`

```json
{
  "finalPrice": 5800,
  "notes": "Negotiated better price!"
}
```

---

## TEST 28: Update Vendor Status

**PATCH** `http://localhost:5000/api/vendors/YOUR_VENDOR_ID_HERE/status`

```json
{
  "status": "confirmed"
}
```

---

## TEST 29: Update Contract & Deposit

**PATCH** `http://localhost:5000/api/vendors/YOUR_VENDOR_ID_HERE/contract`

```json
{
  "contractSigned": true,
  "depositPaid": true,
  "depositAmount": 2000
}
```

---

## TEST 30: Get Vendor Statistics

**GET** `http://localhost:5000/api/vendors/event/YOUR_EVENT_ID_HERE/stats`

**Expected:** Total vendors, booked, contracts, deposits, pricing

---

## TEST 31: Delete Single Vendor

**DELETE** `http://localhost:5000/api/vendors/YOUR_VENDOR_ID_HERE`

---

# 🧪 ERROR HANDLING TESTS

## TEST 32: Create Event with Missing Data (Should Fail)

**POST** `http://localhost:5000/api/events`

```json
{
  "name": ""
}
```

**Expected:** 400 Validation Error

---

## TEST 33: Get Non-Existent Event (Should Fail)

**GET** `http://localhost:5000/api/events/000000000000000000000000`

**Expected:** 404 Not Found

---

## TEST 34: Invalid Status Update (Should Fail)

**PATCH** `http://localhost:5000/api/events/YOUR_EVENT_ID_HERE/status`

```json
{
  "status": "invalid_status"
}
```

**Expected:** 400 Validation Error

---

# 📊 TESTING SUMMARY

## Quick Reference

| Category | Tests | Endpoints |
|----------|-------|-----------|
| **Events** | 10 | Create, Read, Update, Delete, Stats |
| **Guests** | 10 | Add, Bulk Add, Update, RSVP, Stats |
| **Vendors** | 11 | Add, Bulk Add, Update, Status, Contract |
| **Errors** | 3 | Validation testing |

**Total: 34 Test Cases**

---

## ✅ Success Criteria

Each test should return:
- ✅ Status **200** or **201** for success
- ✅ `"success": true` in response
- ✅ Proper data in `data` field
- ✅ Status **400** for validation errors
- ✅ Status **404** for not found

---

## 💡 PRO TIPS

1. **Test in Order** - Some tests depend on previous ones
2. **Save IDs** - Copy `_id` values for use in other tests
3. **Replace Placeholders** - Change `YOUR_EVENT_ID_HERE` to actual IDs
4. **Check Responses** - Verify data matches expectations
5. **Use Variables** - Set Postman environment variables for IDs

---

## 🎯 Testing Workflow

### Basic Flow:
```
1. Create Event (save event ID)
2. Add Guests to that event
3. Add Vendors to that event
4. Get event details (see everything)
5. Update as needed
6. Get statistics
7. Delete when done
```

### Complete Flow:
```
1. TEST 1 → Create Event (SAVE ID!)
2. TEST 12 → Add 5 guests
3. TEST 22 → Add 4 vendors
4. TEST 5 → Get full event details
5. TEST 9 → Get event statistics
6. TEST 18 → Get guest statistics
7. TEST 30 → Get vendor statistics
8. Update guests/vendors as needed
9. TEST 10 → Delete event (cleanup)
```

---

## 🚨 Common Issues

### Issue: "Event not found"
**Solution:** Make sure you're using the correct event ID from the create response

### Issue: "Validation error"
**Solution:** Check all required fields are included and properly formatted

### Issue: Connection refused
**Solution:** Make sure server is running on port 5000

### Issue: Empty guest/vendor list
**Solution:** Create guests/vendors first before trying to fetch them

---

## 📝 TESTING CHECKLIST

- [ ] Server is running
- [ ] Postman is open
- [ ] Created at least one event
- [ ] Saved event ID
- [ ] Added guests to event
- [ ] Added vendors to event
- [ ] Tested all GET endpoints
- [ ] Tested all POST endpoints
- [ ] Tested all PUT/PATCH endpoints
- [ ] Tested DELETE endpoints
- [ ] Verified statistics endpoints
- [ ] Tested error handling

---

## 🎉 You're Ready!

Start with **TEST 0** to check server, then follow the tests in order.

**Happy Testing! 🚀**

---

**EventMate API v2.0**  
Built by Group 18 - Mohammed Darras
