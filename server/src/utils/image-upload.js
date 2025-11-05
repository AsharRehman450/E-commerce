import { randomUUID } from 'crypto';
import { squareClient } from "./square.config.js";
import { safeSerialize } from './jsonUtils.js';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';

// Configure multer storage
const storage = multer.memoryStorage();

// Create multer instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit per Square docs
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.match(/^image\/(jpeg|pjpeg|png|gif)$/)) {
      cb(new Error('Only JPEG, PNG, and GIF files are allowed!'), false);
    }
    cb(null, true);
  }
});

export class ImageUploader {
  /**
   * Transforms simple form data into Square's expected format and uploads
   * @param {Object} simpleData - Simple form data
   * @param {Buffer} simpleData.imageBuffer - The image buffer
   * @param {string} simpleData.mimeType - The image mime type
   * @param {string} simpleData.caption - Optional caption for the image
   */
  static async uploadImage(simpleData) {
    try {
      const form = new FormData();
      
      // Add the image file with field name 'file'
      form.append('file', simpleData.imageBuffer, {
        filename: 'image.jpg',
        contentType: simpleData.mimeType
      });

      // Add the request JSON with field name 'request'
      const requestJson = {
        idempotency_key: randomUUID(),
        image: {
          id: "#121212",
          type: "IMAGE",
          image_data: {
            caption: simpleData.caption || ''
          }
        }
      };

      form.append('request', JSON.stringify(requestJson));

      // Make the request
      const response = await axios.post(
        'https://connect.squareupsandbox.com/v2/catalog/images',
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
            'Square-Version': '2024-11-20'
          }
        }
      );

      console.log('Square API Success Response:', response.data);

      return {
        success: true,
        imageId: response.data.image.id,
        url: response.data.image.image_data.url
      };
    } catch (error) {
      console.error('Square image upload error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.detail || error.message
      };
    }
  }

  static async getSquareImage(imageId) {
    try {
      const { result } = await squareClient.catalogApi.retrieveCatalogObject(imageId);
      return {
        success: true,
        url: result.object.imageData.url
      };
    } catch (error) {
      console.error('Square image retrieval error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deleteSquareImage(imageId) {
    try {
      await squareClient.catalogApi.deleteCatalogObject(imageId);
      return { success: true };
    } catch (error) {
      console.error('Square image deletion error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}