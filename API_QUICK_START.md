# 🚀 API Documentation - Quick Start

**Want to integrate the API? Start here!**

---

## ⚡ 30-Second Overview

College Companion has **31 documented API endpoints** across **9 modules**:

| Module | Count | Examples |
|--------|-------|----------|
| 🔐 Profile | 5 | Create, Update, Upload Avatar |
| 📚 Survival Kit | 8 | Add Essentials, Revision Plans |
| 📝 Notes | 4 | CRUD Operations |
| ❓ Questions | 3 | Generate, Get, Delete |
| 📊 Attendance | 4 | Track, Stats |
| 📖 Essentials | 2 | Extract from Files |
| 🔄 Revision | 2 | Generate Plans |
| 💬 Doubt Solver | 2 | Ask, Get Answers |
| 💻 Study Room | 1 | Real-time Chat |

**All documented with:** Request examples • Response examples • Code samples • Error handling • cURL commands

---

## 📁 Documentation Files

| File | What It Contains | Best For |
|------|-----------------|----------|
| **[COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)** | 📚 Full reference for all 31 endpoints | **Developers integrating APIs** |
| **[API_DOCUMENTATION_SUMMARY.md](./API_DOCUMENTATION_SUMMARY.md)** | 📋 Overview of what's documented | **Understanding the scope** |
| **[API_IMPLEMENTATION_COMPLETE.md](./API_IMPLEMENTATION_COMPLETE.md)** | ✅ What was delivered & verification | **Project leads & reviews** |
| **[README.md](./README.md)** | 🎓 Project overview (updated with API links) | **New to the project** |

---

## 🎯 Getting Started in 5 Minutes

### **Step 1: Get Your Firebase Token** (1 min)
```javascript
// In browser console (while logged into the app)
const token = await firebase.auth().currentUser.getIdToken();
console.log(token);
// Copy this token - you'll use it for API calls
```

### **Step 2: Pick Your First Endpoint** (1 min)
Visit: [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)

Find a module you want to work with:
- Profile? → Section 1
- Notes? → Section 3
- Questions? → Section 4
- etc.

### **Step 3: Test with cURL** (1 min)
Each endpoint has a cURL command. Copy it:

```bash
# Example: Get your profile
curl -X GET http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with your actual token and run it!

### **Step 4: Copy the Code Example** (1 min)
Each endpoint has a "Frontend Example" section:

```javascript
import API from '@/services/api';

async function getMyProfile() {
  try {
    const profile = await API.getMyProfile();
    console.log("Profile:", profile);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

Copy this to your component and modify as needed!

### **Step 5: You're Ready!** (1 min)
- ✅ You tested the API with cURL
- ✅ You have working code
- ✅ You understand error handling
- ✅ You can now integrate!

---

## 💻 Most Common Use Cases

### **I want to create a note**
👉 Go to: [COMPLETE_API_REFERENCE.md → Notes → POST /api/notes](./COMPLETE_API_REFERENCE.md#post-apinotes)

You'll find:
- ✅ Exact URL
- ✅ What to send (request body)
- ✅ What you'll get back (response)
- ✅ Working React code
- ✅ cURL command to test

### **I want to get user profile**
👉 Go to: [COMPLETE_API_REFERENCE.md → Profile → GET /api/profile/me](./COMPLETE_API_REFERENCE.md#get-apiprofileme)

Same format - everything you need!

### **I want to upload an avatar**
👉 Go to: [COMPLETE_API_REFERENCE.md → Profile → POST /api/profile/avatar](./COMPLETE_API_REFERENCE.md#post-apiprofileavatar)

Special handling for file uploads? It's documented!

### **I want to generate questions**
👉 Go to: [COMPLETE_API_REFERENCE.md → Questions → POST /api/questions/generate](./COMPLETE_API_REFERENCE.md#post-apiquestionsgenerate)

AI integration? All explained!

---

## 🔍 Finding What You Need

### **By Module Name:**
1. Open [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)
2. Use Ctrl+F to search for module name
3. Jump to that section
4. Pick your endpoint

### **By Feature:**
1. What are you trying to do?
2. Find it in the module list below
3. Click the section link

**Module Sections:**
- [Profile Management](./COMPLETE_API_REFERENCE.md#-1-profile-management-apiprofile)
- [Survival Kit](./COMPLETE_API_REFERENCE.md#-2-survival-kit-apisurvival)
- [Notes](./COMPLETE_API_REFERENCE.md#-3-notes-management-apinotes)
- [Questions](./COMPLETE_API_REFERENCE.md#-4-questions-generator-apiquestions)
- [Attendance](./COMPLETE_API_REFERENCE.md#-5-attendance-advisor-apiattendance)
- [Essentials](./COMPLETE_API_REFERENCE.md#-6-essentials-extractor-apiessentials)
- [Revision](./COMPLETE_API_REFERENCE.md#-7-revision-planner-apirevision)
- [Doubt Solver](./COMPLETE_API_REFERENCE.md#-8-doubt-solver-apidoubt)
- [Study Room Chat](./COMPLETE_API_REFERENCE.md#-9-study-room-chat-sockio-apistudy-room-chat)

### **By HTTP Method:**
Use Ctrl+F in [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md):
- `### POST` - Create operations
- `### GET` - Retrieve operations
- `### PUT` - Update operations
- `### DELETE` - Remove operations

---

## 📋 What You Get for Every Endpoint

### Example: GET /api/profile/me

**Section 1: HTTP Details**
```
GET /api/profile/me
Auth: Required ✅
```

**Section 2: Request**
```
No body needed - user comes from your token
```

**Section 3: Success Response**
```json
{
  "success": true,
  "profile": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "...": "..."
  }
}
```

**Section 4: Error Response**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "No valid authentication token"
}
```

**Section 5: Frontend Code**
```javascript
// Copy this → Use in your component
const profile = await API.getMyProfile();
```

**Section 6: cURL Test**
```bash
# Copy this → Run in terminal
curl -X GET http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🛠️ Troubleshooting

### **API returns 401 Unauthorized**
- ❌ Check your token is valid
- ❌ Verify token is fresh (not expired)
- ✅ Get new token from browser console

### **API returns 400 Bad Request**
- ❌ Check your request matches the example
- ❌ Verify required fields are included
- ✅ See error message for details

### **API returns 429 Too Many Requests**
- ❌ You're making requests too fast
- ✅ Wait a moment and retry
- ✅ Some endpoints have rate limits

### **API returns 500 Server Error**
- ❌ Backend issue
- ✅ Check backend is running: `npm run dev` in backend folder
- ✅ Check logs for error details

### **I don't see the endpoint I need**
- ❌ Check all 9 modules in the documentation
- ❌ Search in [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)
- ✅ All 31 endpoints are documented

---

## 🎓 Learning Paths

### **I'm new to REST APIs**
1. Read: [COMPLETE_API_REFERENCE.md → Quick Start](./COMPLETE_API_REFERENCE.md#-quick-start)
2. Learn: [COMPLETE_API_REFERENCE.md → Authentication](./COMPLETE_API_REFERENCE.md#-authentication)
3. Try: Run a cURL command
4. Code: Copy a Frontend Example
5. Build: Create your first API call

### **I'm a backend developer**
1. Open: [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)
2. Skip to: Your module of interest
3. Verify: Your endpoint matches the spec
4. Check: Response format is correct
5. Done: Integration ready

### **I'm a frontend developer**
1. Find: Your needed endpoint
2. Copy: The "Frontend Example" code
3. Paste: Into your component
4. Modify: To match your needs
5. Test: Use cURL first, then run app

### **I'm a QA engineer**
1. Get: Firebase token from test account
2. Copy: cURL commands from docs
3. Test: Each endpoint with different data
4. Verify: Response matches examples
5. Log: Any mismatches

---

## ⚙️ Common Patterns

### **Making an API Call**
```javascript
import API from '@/services/api';

// Simple GET
const data = await API.getMyProfile();

// With data
const result = await API.createNote({
  title: "My Note",
  content: "Content"
});

// With file
const response = await API.uploadAvatar(file);
```

### **Handling Errors**
```javascript
try {
  const data = await API.someEndpoint(params);
  console.log("Success:", data);
} catch (error) {
  if (error.message.includes('401')) {
    // Auth error - redirect to login
  } else if (error.message.includes('429')) {
    // Rate limited - wait and retry
  } else {
    // Other error - show message
    console.error("Error:", error.message);
  }
}
```

### **Authentication Check**
```javascript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <div>Please login first</div>;
  }
  
  // Your component here
}
```

---

## 📞 Quick References

### **File Paths:**
- Frontend service: `src/services/api.js`
- Backend server: `backend/server.js`
- Backend routes: `backend/routes/`

### **Ports:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Question API: `http://localhost:5001`

### **Environment:**
- Frontend config: `.env` (root)
- Backend config: `backend/.env`
- Firebase: `src/firebase/config.js`

---

## ✅ Before You Start Coding

- ✅ Are you logged into the app?
- ✅ Do you have your Firebase token?
- ✅ Is backend running? (`npm run dev` in backend folder)
- ✅ Have you read the endpoint documentation?
- ✅ Have you tested with cURL first?

If all ✅, you're ready to code!

---

## 🎯 Final Tips

1. **Always test with cURL first**
   - Proves the API works
   - Catches auth issues early
   - Verifies response format

2. **Copy the code examples**
   - They're tested and working
   - Saves time
   - Shows best practices

3. **Read the error examples**
   - Helps with error handling
   - Know what can go wrong
   - Be prepared

4. **Check required vs optional**
   - Some fields are required
   - Some are optional
   - Examples show all

5. **Keep documentation open**
   - Reference while coding
   - Copy examples as needed
   - Verify response formats

---

## 🚀 You're Ready!

Pick an endpoint from [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md) and start building! 

**Questions?** Check the [Troubleshooting](#-troubleshooting) section or review the complete endpoint documentation.

---

**Last Updated:** January 29, 2026  
**Ready to Use:** Yes ✅  
**All Endpoints:** 31  
**Code Examples:** 40+  
**Happy Coding!** 🎉
