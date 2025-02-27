const express = require("express");
const adminMiddleware = require("../middleware/admin-middleware");
const authMiddleware = require("../middleware/auth-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImageContoller,
  getImagesController,
  deleteImageController,
} = require("../controllers/storage-controller");
const router = express.Router();

//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageContoller
);

//to get all images
router.get("/get", authMiddleware, getImagesController);

//delete image route
//67b89428e06df1a05b1c8732 - uploadedBy Id
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;
