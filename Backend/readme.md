# File Upload Server with Cloudinary

A robust Node.js/Express server for handling file uploads with Cloudinary storage and MongoDB database integration.

## 📋 Features

- ✅ File upload to Cloudinary
- ✅ Custom server URLs instead of direct Cloudinary links
- ✅ MongoDB database for file metadata storage
- ✅ Storage usage checking before upload
- ✅ File deletion from both Cloudinary and database
- ✅ Bulk file clearing functionality
- ✅ RESTful API endpoints
- ✅ CORS enabled
- ✅ Request logging with Morgan
- ✅ Clean MVC architecture

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd file-upload-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/file-upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Project Structure
```
project/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary configuration
├── models/
│   └── File.js            # File schema/model
├── controllers/
│   └── fileController.js  # Business logic
├── routes/
│   └── fileRoutes.js      # API routes
├── middleware/
│   └── upload.js          # Multer configuration
├── utils/
│   └── cloudinaryUtils.js # Cloudinary helper functions
├── server.js              # Entry point
├── .env                   # Environment variables
├── package.json
└── README.md
```

## 🔌 API Endpoints

### 1. Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: [File]
```

**Response:**
```json
{
  "success": true,
  "message": "Upload successful",
  "data": {
    "url": "http://localhost:5000/api/files/abc123",
    "fileName": "example.jpg",
    "fileId": "64f5a2b3c1d2e3f4a5b6c7d8",
    "size": 245760
  }
}
```

### 2. Get All Files
```http
GET /api/files
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f5a2b3c1d2e3f4a5b6c7d8",
      "fileName": "example.jpg",
      "fileUrl": "http://localhost:5000/api/files/abc123",
      "fileSize": 245760,
      "mimeType": "image/jpeg",
      "createdAt": "2024-12-02T10:30:00.000Z"
    }
  ]
}
```

### 3. Get/Serve Single File
```http
GET /api/files/:fileId
```

This endpoint serves the actual file (image, PDF, etc.) directly in the browser.

### 4. Delete File
```http
DELETE /api/files/:fileId
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 5. Clear All Files
```http
DELETE /api/files
```

**⚠️ Warning:** This deletes ALL files from both Cloudinary and database!

**Response:**
```json
{
  "success": true,
  "message": "All files cleared successfully"
}
```

## 📝 Usage Examples

### Using cURL

**Upload a file:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/your/file.jpg"
```

**Get all files:**
```bash
curl http://localhost:5000/api/files
```

**Delete a file:**
```bash
curl -X DELETE http://localhost:5000/api/files/64f5a2b3c1d2e3f4a5b6c7d8
```

### Using JavaScript (Fetch API)

**Upload a file:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
```

**Get all files:**
```javascript
const response = await fetch('http://localhost:5000/api/files');
const data = await response.json();
console.log(data);
```

**Delete a file:**
```javascript
const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
  method: 'DELETE'
});

const data = await response.json();
console.log(data);
```

## 🗄️ Database Schema
```javascript
{
  fileName: String,           // Original file name
  fileUrl: String,            // Your server URL
  cloudinaryPublicId: String, // Cloudinary identifier
  cloudinaryUrl: String,      // Direct Cloudinary URL
  fileSize: Number,           // File size in bytes
  mimeType: String,           // File MIME type
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## ⚙️ Configuration

### File Size Limit

Modify in `middleware/upload.js`:
```javascript
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (change this value)
  },
});
```

### CORS Settings

Modify in `server.js`:
```javascript
app.use(cors({ 
  origin: "*" // Change to specific domain for production
}));
```

### Cloudinary Folder

Modify in `utils/cloudinaryUtils.js`:
```javascript
const result = await cloudinary.uploader.upload(fileBase64, {
  folder: "uploads", // Change folder name here
});
```

## 🛡️ Security Recommendations

For production environments:

1. **Restrict CORS:**
```javascript
app.use(cors({ 
  origin: "https://yourdomain.com"
}));
```

2. **Add authentication middleware** for protected routes

3. **Validate file types:**
```javascript
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

4. **Rate limiting:**
```bash
npm install express-rate-limit
```
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

5. **Use environment-specific URLs**

## 🐛 Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 📦 Dependencies
```json
{
  "express": "^4.18.2",
  "dotenv": "^16.3.1",
  "multer": "^1.4.5-lts.1",
  "axios": "^1.6.0",
  "cloudinary": "^1.41.0",
  "cors": "^2.8.5",
  "morgan": "^1.10.0",
  "mongoose": "^8.0.0"
}
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or use MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Cloudinary Upload Fails
- Verify credentials in `.env`
- Check storage quota in Cloudinary dashboard
- Ensure file size is within limits

### Port Already in Use
```bash
# Change port in .env
PORT=3000
```

## 📄 License

MIT

## 👤 Author

[@shah-ashish](https://github.com/shah-ashish)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Happy Coding! 🚀**