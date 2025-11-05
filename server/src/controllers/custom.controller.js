import { ImageUploader } from '../utils/image-upload.js';

export const uploadImage = async (req, res) => {
  try {
    console.log('Uploading image:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided"
      });
    }

    const imageData = {
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      caption: req.body.caption || 'Product image'
    };

    const imageResult = await ImageUploader.uploadImage(imageData);

    if (!imageResult.success) {
      return res.status(400).json({
        success: false,
        error: "Failed to upload image",
        details: imageResult.error
      });
    }

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        id: imageResult.imageId,
        url: imageResult.url
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to upload image",
      details: error.message
    });
  }
};

export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Image ID is required"
      });
    }

    const imageResult = await ImageUploader.getSquareImage(id);

    if (!imageResult.success) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
        details: imageResult.error
      });
    }

    return res.status(200).json(imageResult);

  } catch (error) {
    console.error('Image fetch error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch image",
      details: error.message
    });
  }
};