# 🚀 UpBox Backend – Scalable Cloud Storage API

## 📌 Overview

This repository contains the backend system for **UpBox**, a cloud storage platform inspired by Google Drive.

It is responsible for:

* Authentication & authorization
* File & folder management
* Multipart upload handling (AWS S3)
* Upload session tracking
* Real-time updates using Server-Sent Events (SSE)
* Search functionality (MongoDB Atlas Search)
* Background processing via AWS Lambda

## 🏗️ Backend Architecture

```
Client (React / Next.js)
        │
        ▼
Express API Server (Node.js)
        │
 ┌──────┼──────────┐
 │      │          │
 ▼      ▼          ▼
MongoDB  AWS S3   SSE Server
(Atlas)  (Storage) (Realtime)
        │
        ▼
AWS Lambda (Event Processing)
```

## 📂 Project Structure

```
src/
├── controllers/        # Handles request/response logic
├── services/           # Business logic layer
├── middlewares/        # Auth, validation, error handling
├── models/             # Mongoose schemas
├── routes/             # API routes
├── utils/
│   ├── sse/            # SSE connection + broadcast manager
│   └── aws/            # S3 helpers (multipart, presigned URLs)
├── config/             # DB & environment configs
```

## 🔐 Authentication & Authorization

* JWT-based authentication
* Middleware-protected routes
* User-level data isolation (`userID` enforced across all queries)

### Flow:

```
User Login/Register
        ↓
JWT issued
        ↓
Protected routes validate token
        ↓
UserID injected into request
```

## 📁 File Upload System (Multipart – AWS S3)

### Why Multipart?

* Efficient large file uploads
* Supports resume
* Parallel chunk uploads

### Upload Flow

```
1. Client → Create upload session
2. Backend → Generate uploadId (S3), Metadata in DB
3. Client → Request presigned URL per chunk
4. Client → Upload chunks directly to S3
5. Backend → Track uploaded parts
6. Backend → Complete multipart upload
```
### Key APIs

* `POST /user/uploadfile` → Create upload session, File Metadata
* `GET /user/``file/:fileID` → Get presigned URL
* `POST /user``/uploadfile/initiate` → Save uploaded chunk info
* `POST /user/upload/complete` → Finalize upload

## 🧾 Upload Session Management

Schema: `UploadSession`

Tracks:

* uploadId
* fileID
* uploadedParts
* chunkSize
* totalParts

### Purpose:

* Resume uploads
* Prevent data loss
* Track upload progress

## 📂 File & Folder System

### Features:

* Nested folder hierarchy
* Path tracking (`pathIds`, `pathNames`)
* Copy / Paste (recursive cloning)
* Duplicate handling (auto rename)

### Schemas:

#### File

* filename
* storagePath
* parentID
*  pathIds  
*  pathNames  
* size, type
* status

#### Folder

* name
* parentID
* pathIds
* pathNames

## 📡 Real-Time System (SSE)

### Why SSE?

* Lightweight
* One-way real-time updates
* Perfect for upload events

### Flow:

```
Client connects → /connection/:userID
        ↓
Server stores connection
        ↓
Events triggered (upload, folder, etc.)
        ↓
Server pushes updates to client
```

### Events:

* `file_uploaded`
* `folder_created`
* `folder_uploaded`
* `file_renamed`

## 🔍 Search System (MongoDB Atlas Search)

### Features:

* Full-text search
* Autocomplete
* Fast indexed queries
* User-isolated results

### Example:

```
$search:
  compound:
    must → autocomplete/text
    filter → userID
```

## ⚡ AWS Integration

### S3

* Multipart upload
* Pre-signed URLs
* Direct client uploads

### Lambda

Used for:

* Post-file upload processing
* Metadata extraction
* Notifying backend via webhook

## 🔄 Folder Upload Handling

* Metadata stored first
* Files uploaded individually
* Supports partial success
* Status-based tracking (`pending`, `completed`, `failed`)

## 🧠 Design Decisions

### 1. Direct S3 Upload

* Reduces backend load
* Improves scalability

### 2. Upload Session Layer

* Enables resume functionality
* Keeps upload state consistent

### 3. SSE for Real-Time

* Simpler than WebSockets
* Ideal for event-based updates

### 4. Service Layer Separation

* Controllers → request/response
* Services → business logic

## 📊 Performance Optimizations

* Chunked uploads
* Indexed search (Atlas Search)
* Parallel upload support
* SSE instead of polling

## 🔐 Security

* JWT authentication
* User-scoped queries
* Pre-signed URL expiration
* Validation middleware

## 🚀 Setup & Installation

```bash
git clone <repo-url>
cd upbox-backend
npm install
```

### Environment Variables

```
PORT=
MONGO_URI=
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=
```

## ▶️ Run Server

```bash
npm start
```
