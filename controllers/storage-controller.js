const Image = require("../models/images");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelpers");
// const { image } = require("../config/cloudinary");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const uploadImageContoller = async (req, res) => {
  try {
    //check if file is missing in file object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
      });
    }

    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store the image and public id along with the uploaded user id in database

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //delete the file from local storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const getImagesController = async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1; // first page or current page
    const limit = parseInt(req.query.limit) || 5; // limit to how many images to show at a time
    const skip = (page - 1) * limit; //

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sotOrder == "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPage: totalPages,
        totalImage: totalImages,
        data: images,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    //get image id
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    //userId
    const userId = req.userInfo.userId;
    //findcurrent image
    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    //check if this image is uploaded by the current user is trying to delete this image
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this image as you as not the owner",
      });
    }

    //delete image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //delete image from mongodb database
    await Image.findById(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully ",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

module.exports = {
  uploadImageContoller,
  getImagesController,
  deleteImageController,
};
