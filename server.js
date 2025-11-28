const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves index.html by default

// Ensure upload folder exists
const uploadFolder = path.join(__dirname, "public/images");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

// Helper functions
const getPhotos = () => {
    if (!fs.existsSync("data.json")) fs.writeFileSync("data.json", "[]");
    const photos = JSON.parse(fs.readFileSync("data.json"));
    return photos.map(p => ({ category: "uncategorized", ...p }));
};
const savePhotos = (photos) => fs.writeFileSync("data.json", JSON.stringify(photos, null, 4));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
    const category = (req.body.category || "uncategorized").trim();
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = "images/" + req.file.filename;
    const photos = getPhotos();
    photos.push({ url: filePath, category, uploaded_at: new Date().toISOString() });
    savePhotos(photos);
    res.json({ message: "Upload successful", path: filePath });
});

// Get photos
app.get("/photos", (req, res) => {
    res.json(getPhotos());
});

// Get categories
app.get("/categories", (req, res) => {
    const categories = [...new Set(getPhotos().map(p => p.category))];
    res.json(categories);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
