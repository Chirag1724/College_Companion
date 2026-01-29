# 📚 Complete API Reference Guide

**College Companion - Full Backend/Frontend Integration Documentation**

---

## 🚀 Quick Start

### Base Configuration

```javascript
// Frontend: Environment Variables (.env)
VITE_API_BASE_URL=http://localhost:5000
```

### Headers for All Authenticated Requests

```
Authorization: Bearer {firebaseIdToken}
Content-Type: application/json
```

### Getting Firebase Token (Frontend)

```javascript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { currentUser } = useAuth();
  
  const getToken = async () => {
    if (!currentUser) throw new Error('User not authenticated');
    return await currentUser.getIdToken();
  };
}
```

---

## 🔐 Authentication

### How Authentication Works

1. **User logs in** → Firebase creates session
2. **Frontend gets ID token** → `currentUser.getIdToken()`
3. **Send token in Authorization header** → `Bearer {token}`
4. **Backend verifies token** → `verifyFirebaseToken` middleware
5. **Request succeeds** → User UID extracted from token

### API Service Helper (Use This!)

All API calls automatically include authentication via the `apiRequest()` helper in `src/services/api.js`:

```javascript
import API from '@/services/api';

// Use like this - authentication handled automatically:
const questions = await API.generateQuestions(data);
const profile = await API.getMyProfile();
```

**OR use the hook:**

```javascript
import { useProtectedAPI } from '@/hooks/useProtectedAPI';

function MyComponent() {
  const { callAPI } = useProtectedAPI();
  
  const fetchData = async () => {
    const result = await callAPI('/api/profile/me', { method: 'GET' });
  };
}
```

---

## 📋 All Endpoints by Module

---

## 🔐 **1. PROFILE MANAGEMENT** (`/api/profile`)

### POST `/api/profile/setup`
**Create or update user profile during onboarding**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "fullName": "John Doe",
    "name": "John",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "department": "Computer Science",
    "year": "2nd Year",
    "collegeName": "XYZ University",
    "degree": "B.Tech",
    "age": 20
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Profile created successfully",
    "profile": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+91-9876543210",
      "department": "Computer Science",
      "year": "2nd Year",
      "collegeName": "XYZ University",
      "course": "B.Tech",
      "age": 20,
      "photoURL": "",
      "semester": "",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "isNewUser": true
  }
  ```

- **Error Response (400):**
  ```json
  {
    "success": false,
    "error": "Invalid profile data",
    "message": "Full name is required"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function setupProfile() {
    try {
      const response = await API.setupProfile({
        fullName: "John Doe",
        email: "john@example.com",
        department: "Computer Science",
        year: "2nd Year",
        collegeName: "XYZ University",
        degree: "B.Tech",
        age: 20
      });
      console.log("Profile created:", response.profile);
    } catch (error) {
      console.error("Setup failed:", error.message);
    }
  }
  ```

- **cURL Test:**
  ```bash
  curl -X POST http://localhost:5000/api/profile/setup \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "fullName": "John Doe",
      "email": "john@example.com",
      "department": "Computer Science",
      "year": "2nd Year",
      "collegeName": "XYZ University",
      "degree": "B.Tech",
      "age": 20
    }'
  ```

---

### GET `/api/profile/me`
**Get current user's profile**

- **Auth:** Required ✅
- **Query Parameters:** None
- **Success Response (200):**
  ```json
  {
    "success": true,
    "profile": {
      "_id": "user-uid-123",
      "uid": "user-uid-123",
      "profile": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210",
        "department": "Computer Science",
        "year": "2nd Year",
        "collegeName": "XYZ University",
        "course": "B.Tech",
        "age": 20,
        "photoURL": "/uploads/avatars/avatar-123.jpg",
        "semester": "Spring 2024",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    }
  }
  ```

- **Error Response (401):**
  ```json
  {
    "success": false,
    "error": "Unauthorized",
    "message": "No valid authentication token provided"
  }
  ```

- **Frontend Example:**
  ```javascript
  import { useAuth } from '@/contexts/AuthContext';
  import API from '@/services/api';
  
  function ProfilePage() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    
    useEffect(async () => {
      if (currentUser) {
        try {
          const data = await API.getMyProfile();
          setProfile(data.profile);
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      }
    }, [currentUser]);
  }
  ```

- **cURL Test:**
  ```bash
  curl -X GET http://localhost:5000/api/profile/me \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```

---

### PUT `/api/profile/update`
**Update user profile fields**

- **Auth:** Required ✅
- **Body Parameters (all optional):**
  ```json
  {
    "fullName": "Jane Doe",
    "phone": "+91-8765432109",
    "department": "Electronics Engineering",
    "year": "3rd Year",
    "collegeName": "ABC Institute",
    "course": "B.Tech",
    "age": 21,
    "semester": "Spring 2024"
  }
  ```

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "profile": {
      "fullName": "Jane Doe",
      "phone": "+91-8765432109",
      "department": "Electronics Engineering",
      "year": "3rd Year",
      "collegeName": "ABC Institute",
      "course": "B.Tech",
      "age": 21,
      "semester": "Spring 2024",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  }
  ```

- **Error Response (400):**
  ```json
  {
    "success": false,
    "error": "Validation error",
    "message": "Phone number format is invalid"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function updateProfile(updatedData) {
    try {
      const response = await API.updateProfile({
        fullName: "Jane Doe",
        phone: "+91-8765432109",
        department: "Electronics Engineering"
      });
      console.log("Updated profile:", response.profile);
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  }
  ```

---

### POST `/api/profile/avatar`
**Upload user avatar/profile picture**

- **Auth:** Required ✅
- **Content-Type:** `multipart/form-data`
- **Body Parameters:**
  - `avatar` (file, required): Image file (JPEG, PNG, WebP, max 5MB)

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Avatar uploaded successfully",
    "avatarUrl": "/uploads/avatars/avatar-user-uid-123-1234567890.jpg"
  }
  ```

- **Error Response (400):**
  ```json
  {
    "success": false,
    "error": "Invalid file",
    "message": "File size exceeds 5MB limit"
  }
  ```

- **Error Response (415):**
  ```json
  {
    "success": false,
    "error": "Invalid file type",
    "message": "Only JPEG, PNG, and WebP files are allowed"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function uploadAvatar(file) {
    try {
      const response = await API.uploadAvatar(file);
      console.log("Avatar URL:", response.avatarUrl);
      // Use the URL: <img src={response.avatarUrl} />
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  }
  
  // In your component:
  function AvatarUpload() {
    const handleFileSelect = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await uploadAvatar(file);
      }
    };
    
    return <input type="file" accept="image/*" onChange={handleFileSelect} />;
  }
  ```

---

### PUT `/api/profile/settings`
**Update user settings and preferences**

- **Auth:** Required ✅
- **Body Parameters (all optional):**
  ```json
  {
    "theme": "dark",
    "notifications": true,
    "language": "en",
    "defaultStudyHours": 4,
    "aiPreference": true,
    "privacyLevel": "private"
  }
  ```

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Settings updated successfully",
    "settings": {
      "theme": "dark",
      "notifications": true,
      "language": "en",
      "defaultStudyHours": 4,
      "aiPreference": true,
      "privacyLevel": "private"
    }
  }
  ```

---

### DELETE `/api/profile/delete`
**Delete user profile (does NOT delete Firebase auth account)**

- **Auth:** Required ✅
- **Body Parameters:** None

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Profile deleted successfully"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function deleteProfile() {
    if (window.confirm("Are you sure? This cannot be undone!")) {
      try {
        await API.deleteProfile();
        console.log("Profile deleted. Redirecting to login...");
        // Redirect to login page
      } catch (error) {
        console.error("Deletion failed:", error.message);
      }
    }
  }
  ```

---

---

## 📚 **2. SURVIVAL KIT** (`/api/survival`)

### POST `/api/survival/essentials`
**Add essential study material to survival kit**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "title": "Unit 1: Basic Concepts",
    "content": "Key topics covered: Variables, Data types, Control structures, Functions..."
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Essential added successfully",
    "essential": {
      "_id": "essential-id-123",
      "title": "Unit 1: Basic Concepts",
      "content": "Key topics covered: Variables, Data types, Control structures, Functions...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

- **Error Response (400):**
  ```json
  {
    "success": false,
    "error": "Title and content are required"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function addEssential() {
    try {
      const response = await API.addEssential({
        title: "Unit 1: Basic Concepts",
        content: "Key topics: Variables, Data types, Control structures..."
      });
      console.log("Essential added:", response.essential);
    } catch (error) {
      console.error("Failed to add essential:", error.message);
    }
  }
  ```

- **cURL Test:**
  ```bash
  curl -X POST http://localhost:5000/api/survival/essentials \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Unit 1: Basic Concepts",
      "content": "Key topics covered..."
    }'
  ```

---

### GET `/api/survival/essentials`
**Get all essentials from survival kit**

- **Auth:** Required ✅
- **Query Parameters:** None

- **Success Response (200):**
  ```json
  {
    "success": true,
    "essentials": [
      {
        "_id": "essential-id-123",
        "title": "Unit 1: Basic Concepts",
        "content": "Key topics covered: Variables, Data types...",
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "_id": "essential-id-124",
        "title": "Unit 2: Advanced Topics",
        "content": "Includes: Design patterns, Architecture...",
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  import { useEffect, useState } from 'react';
  
  function SurvivalKitView() {
    const [essentials, setEssentials] = useState([]);
    
    useEffect(async () => {
      try {
        const response = await API.getEssentials();
        setEssentials(response.essentials);
      } catch (error) {
        console.error("Failed to load essentials:", error);
      }
    }, []);
    
    return (
      <div>
        {essentials.map(essential => (
          <div key={essential._id}>
            <h3>{essential.title}</h3>
            <p>{essential.content}</p>
          </div>
        ))}
      </div>
    );
  }
  ```

---

### DELETE `/api/survival/essentials/:id`
**Delete an essential from survival kit**

- **Auth:** Required ✅
- **URL Parameters:**
  - `id` (string, required): Essential ID

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Essential deleted successfully"
  }
  ```

- **Error Response (404):**
  ```json
  {
    "success": false,
    "error": "Essential not found"
  }
  ```

- **Frontend Example:**
  ```javascript
  async function deleteEssential(essentialId) {
    try {
      await API.deleteEssential(essentialId);
      console.log("Essential deleted!");
    } catch (error) {
      console.error("Deletion failed:", error.message);
    }
  }
  ```

---

### POST `/api/survival/revision-strategies`
**Add revision strategy**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "title": "Spaced Repetition Method",
    "description": "Review topics at increasing intervals",
    "frequency": "Daily",
    "duration": "30 minutes"
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Revision strategy added successfully",
    "strategy": {
      "_id": "strategy-id-123",
      "title": "Spaced Repetition Method",
      "description": "Review topics at increasing intervals",
      "frequency": "Daily",
      "duration": "30 minutes",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

---

### GET `/api/survival/revision-strategies`
**Get all revision strategies**

- **Auth:** Required ✅

- **Success Response (200):**
  ```json
  {
    "success": true,
    "strategies": [
      {
        "_id": "strategy-id-123",
        "title": "Spaced Repetition Method",
        "description": "Review topics at increasing intervals",
        "frequency": "Daily",
        "duration": "30 minutes",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

---

### POST `/api/survival/plans`
**Create a survival plan (uses AI)**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "subjectsToStudy": ["Mathematics", "Physics", "Chemistry"],
    "examsInDays": 60,
    "studyHoursPerDay": 4,
    "learningStyle": "visual",
    "weakAreas": ["Calculus", "Organic Chemistry"]
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Survival plan generated successfully",
    "plan": {
      "_id": "plan-id-123",
      "title": "60-Day Exam Preparation Plan",
      "content": "Week 1-2: Foundation building for Math, Week 3-4: Physics fundamentals...",
      "subjects": ["Mathematics", "Physics", "Chemistry"],
      "estimatedHours": 240,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

- **Error Response (429):**
  ```json
  {
    "success": false,
    "error": "Rate limit exceeded",
    "message": "Please wait before generating another plan"
  }
  ```

---

### GET `/api/survival/plans`
**Get all survival plans**

- **Auth:** Required ✅

- **Success Response (200):**
  ```json
  {
    "success": true,
    "plans": [
      {
        "_id": "plan-id-123",
        "title": "60-Day Exam Preparation Plan",
        "content": "Week 1-2: Foundation building...",
        "subjects": ["Mathematics", "Physics", "Chemistry"],
        "estimatedHours": 240,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

---

---

## 📝 **3. NOTES MANAGEMENT** (`/api/notes`)

### POST `/api/notes`
**Create a new note**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "title": "Chapter 5: Recursion",
    "content": "Recursion is a technique where a function calls itself...",
    "subject": "Data Structures",
    "tags": ["recursion", "algorithms", "important"],
    "color": "blue"
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Note created successfully",
    "note": {
      "_id": "note-id-123",
      "title": "Chapter 5: Recursion",
      "content": "Recursion is a technique where a function calls itself...",
      "subject": "Data Structures",
      "tags": ["recursion", "algorithms", "important"],
      "color": "blue",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

- **Error Response (400):**
  ```json
  {
    "success": false,
    "error": "Title and content are required"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function createNote() {
    try {
      const response = await API.createNote({
        title: "Chapter 5: Recursion",
        content: "Recursion is a technique...",
        subject: "Data Structures",
        tags: ["recursion", "algorithms"],
        color: "blue"
      });
      console.log("Note created:", response.note);
    } catch (error) {
      console.error("Failed to create note:", error.message);
    }
  }
  ```

---

### GET `/api/notes`
**Get all notes for current user**

- **Auth:** Required ✅
- **Query Parameters:**
  - `subject` (optional): Filter by subject
  - `tag` (optional): Filter by tag
  - `limit` (optional): Number of notes to fetch (default: 100)

- **Success Response (200):**
  ```json
  {
    "success": true,
    "notes": [
      {
        "_id": "note-id-123",
        "title": "Chapter 5: Recursion",
        "content": "Recursion is a technique...",
        "subject": "Data Structures",
        "tags": ["recursion", "algorithms", "important"],
        "color": "blue",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  import { useEffect, useState } from 'react';
  
  function NotesPage() {
    const [notes, setNotes] = useState([]);
    
    useEffect(async () => {
      try {
        // Get all notes
        const allNotes = await API.getNotes();
        
        // Or filter by subject
        const mathNotes = await API.getNotes({ subject: "Mathematics" });
        
        setNotes(allNotes.notes);
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }, []);
  }
  ```

---

### PUT `/api/notes/:id`
**Update a note**

- **Auth:** Required ✅
- **URL Parameters:**
  - `id` (string, required): Note ID
- **Body Parameters (all optional):**
  ```json
  {
    "title": "Chapter 5: Advanced Recursion",
    "content": "Updated content...",
    "subject": "Data Structures",
    "tags": ["recursion", "backtracking"],
    "color": "green"
  }
  ```

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Note updated successfully",
    "note": {
      "_id": "note-id-123",
      "title": "Chapter 5: Advanced Recursion",
      "content": "Updated content...",
      "subject": "Data Structures",
      "tags": ["recursion", "backtracking"],
      "color": "green",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  }
  ```

- **Frontend Example:**
  ```javascript
  async function updateNote(noteId, updatedData) {
    try {
      const response = await API.updateNote(noteId, {
        title: "Chapter 5: Advanced Recursion",
        content: "Updated content..."
      });
      console.log("Note updated:", response.note);
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  }
  ```

---

### DELETE `/api/notes/:id`
**Delete a note**

- **Auth:** Required ✅
- **URL Parameters:**
  - `id` (string, required): Note ID

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Note deleted successfully"
  }
  ```

- **Error Response (404):**
  ```json
  {
    "success": false,
    "error": "Note not found"
  }
  ```

- **Frontend Example:**
  ```javascript
  async function deleteNote(noteId) {
    if (confirm("Delete this note?")) {
      try {
        await API.deleteNote(noteId);
        console.log("Note deleted!");
      } catch (error) {
        console.error("Deletion failed:", error.message);
      }
    }
  }
  ```

---

---

## ❓ **4. QUESTIONS GENERATOR** (`/api/questions`)

### POST `/api/questions/generate`
**Generate exam questions using AI**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "topic": "Chapter 5: Functions",
    "subject": "Data Structures",
    "difficulty": "medium",
    "questionTypes": ["2m", "3m", "14m", "16m"],
    "numberOfQuestions": 5,
    "style": "objective"
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Questions generated successfully",
    "questions": [
      {
        "_id": "q-id-123",
        "question": "What is the time complexity of binary search?",
        "answer": "O(log n)",
        "type": "2m",
        "difficulty": "easy",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

- **Error Response (429):**
  ```json
  {
    "success": false,
    "error": "Rate limit exceeded",
    "message": "You can generate questions once every 2 minutes"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function generateQuestions() {
    try {
      const response = await API.generateQuestions({
        topic: "Chapter 5: Functions",
        subject: "Data Structures",
        difficulty: "medium",
        questionTypes: ["2m", "3m", "14m", "16m"],
        numberOfQuestions: 5,
        style: "objective"
      });
      console.log("Questions generated:", response.questions);
    } catch (error) {
      console.error("Generation failed:", error.message);
    }
  }
  ```

- **cURL Test:**
  ```bash
  curl -X POST http://localhost:5000/api/questions/generate \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "topic": "Chapter 5: Functions",
      "subject": "Data Structures",
      "difficulty": "medium",
      "questionTypes": ["2m", "3m", "14m", "16m"],
      "numberOfQuestions": 5,
      "style": "objective"
    }'
  ```

---

### GET `/api/questions`
**Get all saved questions**

- **Auth:** Required ✅
- **Query Parameters:**
  - `subject` (optional): Filter by subject
  - `difficulty` (optional): Filter by difficulty
  - `limit` (optional): Number of questions to fetch

- **Success Response (200):**
  ```json
  {
    "success": true,
    "questions": [
      {
        "_id": "q-id-123",
        "question": "What is the time complexity of binary search?",
        "answer": "O(log n)",
        "type": "2m",
        "difficulty": "easy",
        "subject": "Data Structures",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

- **Frontend Example:**
  ```javascript
  import { useEffect, useState } from 'react';
  import API from '@/services/api';
  
  function QuestionsLibrary() {
    const [questions, setQuestions] = useState([]);
    
    useEffect(async () => {
      try {
        const response = await API.getQuestionHistory();
        setQuestions(response.questions);
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    }, []);
  }
  ```

---

### DELETE `/api/questions/:id`
**Delete a generated question**

- **Auth:** Required ✅
- **URL Parameters:**
  - `id` (string, required): Question ID

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Question deleted successfully"
  }
  ```

---

---

## 📊 **5. ATTENDANCE ADVISOR** (`/api/attendance`)

### POST `/api/attendance`
**Add attendance record**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "date": "2024-01-15",
    "subject": "Mathematics",
    "present": 18,
    "total": 20,
    "predicted": "Will maintain 80% by end of semester"
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Attendance record added successfully",
    "record": {
      "_id": "att-id-123",
      "date": "2024-01-15",
      "subject": "Mathematics",
      "present": 18,
      "total": 20,
      "predicted": "Will maintain 80% by end of semester",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

- **Error Response (400):**
  ```json
  {
    "success": false,
    "error": "Date, subject, present, and total are required"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function addAttendance() {
    try {
      const response = await API.addAttendance({
        date: "2024-01-15",
        subject: "Mathematics",
        present: 18,
        total: 20,
        predicted: "Will maintain 80% by end of semester"
      });
      console.log("Attendance added:", response.record);
    } catch (error) {
      console.error("Failed to add attendance:", error.message);
    }
  }
  ```

---

### GET `/api/attendance`
**Get all attendance records**

- **Auth:** Required ✅
- **Query Parameters:**
  - `subject` (optional): Filter by subject
  - `month` (optional): Filter by month (YYYY-MM)

- **Success Response (200):**
  ```json
  {
    "success": true,
    "history": [
      {
        "_id": "att-id-123",
        "date": "2024-01-15",
        "subject": "Mathematics",
        "present": 18,
        "total": 20,
        "percentage": 90,
        "predicted": "Will maintain 80% by end of semester",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

---

### GET `/api/attendance/stats`
**Get attendance statistics**

- **Auth:** Required ✅

- **Success Response (200):**
  ```json
  {
    "success": true,
    "stats": {
      "totalClasses": 100,
      "totalPresent": 85,
      "overallPercentage": 85,
      "bySubject": {
        "Mathematics": { "present": 18, "total": 20, "percentage": 90 },
        "Physics": { "present": 17, "total": 20, "percentage": 85 }
      },
      "riskSubjects": ["Physics", "Chemistry"]
    }
  }
  ```

---

### DELETE `/api/attendance/:id`
**Delete attendance record**

- **Auth:** Required ✅
- **URL Parameters:**
  - `id` (string, required): Record ID

- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Attendance record deleted successfully"
  }
  ```

---

---

## 📖 **6. ESSENTIALS EXTRACTOR** (`/api/essentials`)

### POST `/api/essentials/extract`
**Extract essentials from uploaded syllabus file**

- **Auth:** Required ✅
- **Content-Type:** `multipart/form-data`
- **Body Parameters:**
  - `file` (file, required): PDF, image (JPG, PNG), or text file
  - `subject` (optional): Subject name

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Essentials extracted successfully",
    "essentials": {
      "subject": "Data Structures",
      "topics": [
        "Arrays and Linked Lists",
        "Stacks and Queues",
        "Trees and Graphs",
        "Sorting and Searching"
      ],
      "importantConcepts": [
        "Time complexity analysis",
        "Space optimization",
        "Recursion techniques"
      ],
      "studyTips": [
        "Practice coding problems",
        "Visualize data structure operations"
      ],
      "keyPoints": [
        "Big O notation is crucial",
        "Understand trade-offs"
      ]
    }
  }
  ```

- **Error Response (400):**
  ```json
  {
    "success": false,
    "error": "Invalid file type",
    "message": "Only PDF, JPEG, PNG, and text files are supported"
  }
  ```

- **Error Response (413):**
  ```json
  {
    "success": false,
    "error": "File too large",
    "message": "File size must be less than 10MB"
  }
  ```

- **Frontend Example:**
  ```javascript
  import API from '@/services/api';
  
  async function extractEssentials(file, subject) {
    try {
      const response = await API.extractEssentials(file, subject);
      console.log("Essentials extracted:", response.essentials);
    } catch (error) {
      console.error("Extraction failed:", error.message);
    }
  }
  
  // In component:
  function SyllabusUpload() {
    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await extractEssentials(file, "Data Structures");
      }
    };
    
    return <input type="file" accept=".pdf,.jpg,.png,.txt" onChange={handleFileUpload} />;
  }
  ```

---

### GET `/api/essentials`
**Get all extracted essentials**

- **Auth:** Required ✅
- **Query Parameters:**
  - `subject` (optional): Filter by subject

- **Success Response (200):**
  ```json
  {
    "success": true,
    "essentials": [
      {
        "_id": "ess-id-123",
        "subject": "Data Structures",
        "topics": ["Arrays and Linked Lists", "Stacks and Queues"],
        "importantConcepts": ["Time complexity analysis"],
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

---

---

## 🔄 **7. REVISION PLANNER** (`/api/revision`)

### POST `/api/revision/generate`
**Generate personalized revision plan**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "subjects": ["Mathematics", "Physics"],
    "daysAvailable": 30,
    "hoursPerDay": 3,
    "weakAreas": ["Calculus", "Optics"],
    "testDate": "2024-02-15"
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Revision plan generated successfully",
    "plan": {
      "_id": "rev-id-123",
      "title": "30-Day Revision Strategy",
      "content": "Week 1: Fundamentals review...",
      "schedule": {
        "week1": "Fundamentals review",
        "week2": "Problem solving",
        "week3": "Mock tests",
        "week4": "Final revision"
      },
      "estimatedHours": 90,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

---

### GET `/api/revision`
**Get all revision plans**

- **Auth:** Required ✅

- **Success Response (200):**
  ```json
  {
    "success": true,
    "plans": [
      {
        "_id": "rev-id-123",
        "title": "30-Day Revision Strategy",
        "content": "Week 1: Fundamentals review...",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

---

---

## 💬 **8. DOUBT SOLVER** (`/api/doubt`)

### POST `/api/doubt/ask`
**Ask a doubt or question**

- **Auth:** Required ✅
- **Body Parameters:**
  ```json
  {
    "question": "How do I implement binary search?",
    "subject": "Data Structures",
    "topic": "Searching Algorithms",
    "context": "I understand linear search but binary search is confusing"
  }
  ```

- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Doubt saved successfully",
    "doubt": {
      "_id": "doubt-id-123",
      "question": "How do I implement binary search?",
      "answer": "Binary search is a divide-and-conquer algorithm...",
      "subject": "Data Structures",
      "topic": "Searching Algorithms",
      "resolved": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

---

### GET `/api/doubt`
**Get all doubts and answers**

- **Auth:** Required ✅
- **Query Parameters:**
  - `subject` (optional): Filter by subject
  - `resolved` (optional): Filter by resolved status

- **Success Response (200):**
  ```json
  {
    "success": true,
    "doubts": [
      {
        "_id": "doubt-id-123",
        "question": "How do I implement binary search?",
        "answer": "Binary search is a divide-and-conquer algorithm...",
        "subject": "Data Structures",
        "resolved": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

---

---

## 📌 **9. STUDY ROOM CHAT** (Socket.io, `/api/study-room-chat`)

### WebSocket Connection

```javascript
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

function StudyRoom() {
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      query: {
        token: firebaseIdToken,
        roomCode: 'ABC123'
      }
    });
    
    // Listen for messages
    socket.on('receive_message', (data) => {
      console.log('Message:', data);
    });
    
    // Send message
    const sendMessage = (message) => {
      socket.emit('send_message', {
        message,
        sender: currentUser.email,
        timestamp: new Date()
      });
    };
    
    return () => socket.disconnect();
  }, []);
}
```

---

---

## 🎯 **Common Patterns & Best Practices**

### Error Handling Pattern

```javascript
import { useAuth } from '@/contexts/AuthContext';
import API from '@/services/api';

async function myFunction() {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    throw new Error('User must be logged in');
  }
  
  try {
    const response = await API.someEndpoint(data);
    
    if (!response.success) {
      console.error('API Error:', response.error);
      return null;
    }
    
    console.log('Success:', response.data);
    return response.data;
    
  } catch (error) {
    if (error.message.includes('401')) {
      // Token expired - redirect to login
      console.error('Session expired');
    } else if (error.message.includes('429')) {
      // Rate limited
      console.error('Too many requests. Please try again later.');
    } else {
      // General error
      console.error('API Error:', error.message);
    }
  }
}
```

---

### File Upload Pattern

```javascript
import API from '@/services/api';

async function handleFileUpload(file, endpoint) {
  // Validate file
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    console.error('File too large');
    return;
  }
  
  // Check file type
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    console.error('Invalid file type');
    return;
  }
  
  // Upload
  try {
    const response = await API.uploadFile(endpoint, file);
    console.log('Upload successful:', response);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}
```

---

### Pagination Pattern

```javascript
import { useState, useEffect } from 'react';
import API from '@/services/api';

function DataList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;
  
  useEffect(async () => {
    try {
      const response = await API.getNotes({
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage
      });
      
      setItems(response.notes);
      setHasMore(response.notes.length === itemsPerPage);
    } catch (error) {
      console.error('Failed to load:', error);
    }
  }, [page]);
  
  return (
    <div>
      {items.map(item => <Item key={item._id} item={item} />)}
      <button disabled={!hasMore} onClick={() => setPage(p => p + 1)}>
        Load More
      </button>
    </div>
  );
}
```

---

## 📱 **Testing & Debugging**

### Using Postman/Thunder Client

1. **Set Authorization Header:**
   - Type: Bearer Token
   - Token: Your Firebase ID token

2. **Get Your Firebase Token:**
   ```javascript
   // In browser console
   const token = await firebase.auth().currentUser.getIdToken();
   console.log(token);
   ```

3. **Test an Endpoint:**
   ```
   GET http://localhost:5000/api/profile/me
   Header: Authorization: Bearer {YOUR_TOKEN}
   ```

---

### Using cURL

```bash
# Get token first (from browser console)
TOKEN="your_firebase_token_here"

# Test profile endpoint
curl -X GET http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer $TOKEN"

# Test create note
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Note",
    "content": "Test content"
  }'
```

---

## 🔒 **Security Notes**

✅ **All endpoints are protected with Firebase authentication**
- Token verified on every request
- User UID extracted from token
- User can only access their own data

✅ **CORS enabled for localhost development**
- Production deployment requires environment-specific CORS settings

✅ **File uploads validated**
- Size limits enforced
- File type whitelist applied
- Stored securely on server

---

## 📞 **Support & Troubleshooting**

### Common Issues

**401 Unauthorized**
- Check if user is logged in
- Verify Firebase token is valid
- Token may have expired - call `getIdToken()` again

**400 Bad Request**
- Check request body matches schema
- Required fields missing
- Invalid data types

**429 Too Many Requests**
- Rate limiting active
- Wait before making another request
- Different endpoints may have different limits

**500 Internal Server Error**
- Check backend logs
- Verify environment variables are set
- Database connection may be down

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
