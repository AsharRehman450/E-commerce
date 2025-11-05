import express from 'express';
import { 
  getAllLocations,
  getLocationById,
  updateLocation,
  createLocation,
  deleteLocation
} from '../controllers/location.controller.js';

const router = express.Router();

// Get all locations
router.get('/location', getAllLocations);

// Get single location
router.get('/location/:id', getLocationById);

// Update location
router.put('/location/:id', updateLocation);

// Delete location
router.delete('/location/:id', deleteLocation);  

// Create new location
router.post('/location', createLocation);

export default router;