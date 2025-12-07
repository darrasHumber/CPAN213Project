# 🎉 EventMate - Event Planning Application

Full-Stack Event Management System with Express.js + MongoDB + React Native

---

## 👥 Team Members

**Group 18 - CPAN 213 - Humber College**

- **Mohammed Darras** - API Developer & Backend
- **Carl Baptiste** - Database Design
- **Kayle Krystal Hunyinbo** - Pages & UI
- **Alaa Attia** - Navigation & Routing

---

## ✨ What You Can Do

- 📅 **Events** - Create, edit, and manage events
- 👥 **Guests** - Track RSVPs (tap to change status)
- 🏢 **Vendors** - Manage by category (tap to change status)
- 📊 **Statistics** - Real-time counts and analytics
- 🗑️ **Quick Actions** - Long press to delete

---

## 🛠 Tech Stack

**Backend:** Express 5.2.1, MongoDB, Mongoose 9.0.1  
**Frontend:** React Native 0.74.5, Expo 51, React Navigation

---

## 🚀 Backend Setup

### 1. Install Dependencies

```bash
cd eventmate-backend
npm install
```

### 2. Create `.env` File

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eventmate
```

**For MongoDB Atlas (Cloud):**

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventmate
```

### 3. Start MongoDB

```bash
mongod
```

### 4. Run Backend

```bash
npm start
```

✅ Server running at `http://localhost:5000`

### 5. Test with Postman

See `POSTMAN_TESTING_GUIDE.md` for 34 ready-to-use test cases covering all API endpoints.

---

## 📱 Frontend Setup

### 1. Install Dependencies

```bash
cd eventmate-frontend
npm install
```

### 2. Configure API URL

Edit `api/api.js` line 7:

```javascript
// For Android Emulator:
const API_BASE_URL = "http://10.0.2.2:5000/api";

// For Phone/iOS:
const API_BASE_URL = "http://YOUR_IP:5000/api";
```

**Find Your IP:**

- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

### 3. Run Frontend

```bash
npx expo start
```

### 4. Open in Android

- Open Android Studio
- Start Android emulator
- Press `a` in terminal

**Alternative:** Scan QR code with Expo Go app on your phone

---

## 📋 Quick Start

```bash
# Terminal 1 - Backend
cd eventmate-backend
npm install
# Create .env file
npm start

# Terminal 2 - Frontend
cd eventmate-frontend
npm install
# Edit api/api.js with your IP
npx expo start
# Press 'a' for Android
```

---

## 🎯 Using the App

### Create Event

1. Tap **Events** tab → **+** button
2. Fill: Name, Date (YYYY-MM-DD), Time (HH:MM), Location
3. Tap **Create Event**

### Manage Guests

1. Open event → **Guest List** → **+** button
2. Add guest details
3. **Tap card** = Change RSVP (pending → confirmed → declined)
4. **Long press** = Delete

### Manage Vendors

1. Open event → **Vendors** → **+** button
2. Select category, add details
3. **Tap card** = Change status (researching → contacted → quoted → booked → confirmed)
4. **Long press** = Delete

## 🎓 Features

**Events API (10 endpoints)**

- Create, read, update, delete events
- Get event details with guests & vendors
- Statistics and filtering

**Guests API (10 endpoints)**

- Add single or bulk guests
- Update RSVP status
- Track dietary restrictions
- Guest statistics

**Vendors API (11 endpoints)**

- Add by category
- Track status and contracts
- Pricing and contact info
- Vendor statistics

---

## 📚 Documentation

- **Backend README:** Complete API docs
- **POSTMAN_TESTING_GUIDE:** 34 test cases
- **Frontend README:** Mobile app guide

---

## 🎊 Success!

Your event planning app is ready!

**Backend:** `http://localhost:5000`  
**API Docs:** `http://localhost:5000/`  
**Frontend:** Opens in Expo Dev Tools

---

**Built by Group 18 | CPAN 213 | Humber College** 🚀
