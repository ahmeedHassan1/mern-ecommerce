import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import logger from "../utils/logger.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, uploadsDir);
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	}
});
function fileFilter(req, file, cb) {
	const filetypes = /jpg|jpeg|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);
	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb({ message: "Images only!" });
	}
}
const upload = multer({
	storage,
	fileFilter
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				message: "File too large"
			});
		}
		if (error.code === "LIMIT_FILE_COUNT") {
			return res.status(400).json({
				message: "Too many files"
			});
		}
		if (error.code === "LIMIT_UNEXPECTED_FILE") {
			return res.status(400).json({
				message: "Unexpected field name"
			});
		}
	}

	if (error?.message) {
		return res.status(400).json({
			message: error.message
		});
	}

	next(error);
};

// Route to check if an uploaded file exists
router.get("/check/:filename", (req, res) => {
	try {
		const filename = req.params.filename;
		const filePath = path.join(uploadsDir, filename);

		if (fs.existsSync(filePath)) {
			const stats = fs.statSync(filePath);
			res.json({
				exists: true,
				filename: filename,
				size: stats.size,
				created: stats.birthtime,
				modified: stats.mtime
			});
		} else {
			res.status(404).json({
				exists: false,
				filename: filename,
				message: "File not found"
			});
		}
	} catch (error) {
		res.status(500).json({
			exists: false,
			message: "Error checking file",
			error: error.message
		});
	}
});

// Route to list all uploaded files
router.get("/list", (req, res) => {
	try {
		const files = fs
			.readdirSync(uploadsDir)
			.filter((file) => file !== ".gitkeep")
			.map((file) => {
				const filePath = path.join(uploadsDir, file);
				const stats = fs.statSync(filePath);
				return {
					filename: file,
					size: stats.size,
					created: stats.birthtime,
					modified: stats.mtime,
					url: `/uploads/${file}`
				};
			});

		res.json({
			message: "Files retrieved successfully",
			count: files.length,
			files: files
		});
	} catch (error) {
		logger.error("Error listing uploaded files:", error);
		res.status(500).json({
			message: "Error listing files",
			error: error.message
		});
	}
});

// Route to delete an uploaded file
router.delete("/:filename", (req, res) => {
	try {
		const filename = req.params.filename;
		const filePath = path.join(uploadsDir, filename);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				message: "File not found"
			});
		}

		fs.unlinkSync(filePath);
		logger.info(`File deleted: ${filename}`);

		res.json({
			message: "File deleted successfully",
			filename: filename
		});
	} catch (error) {
		logger.error("Error deleting file:", error);
		res.status(500).json({
			message: "Error deleting file",
			error: error.message
		});
	}
});

router.post("/", upload.single("image"), handleMulterError, (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "No image file provided"
			});
		}

		// Verify the file was actually written to disk
		const filePath = path.join(uploadsDir, req.file.filename);
		if (!fs.existsSync(filePath)) {
			return res.status(500).json({
				message: "File upload failed - file not saved to disk"
			});
		}

		res.send({
			message: "Image uploaded successfully",
			image: `/uploads/${req.file.filename}`,
			filename: req.file.filename,
			size: req.file.size
		});
	} catch (error) {
		console.error("Upload error:", error);
		res.status(500).json({
			message: "File upload failed",
			error: error.message
		});
	}
});
export default router;
