import express from 'express';
import { getImageById, uploadImage } from '../controllers/custom.controller.js';
import { upload } from '../utils/image-upload.js';

const customRoutes = express.Router();

customRoutes.post('/upload', upload.single('image'), uploadImage);

customRoutes.get('/image/:id', getImageById);

export default customRoutes;