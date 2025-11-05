import { squareClient } from "../utils/square.config.js";
import { safeSerialize } from '../utils/jsonUtils.js';

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const { result } = await squareClient.locationsApi.listLocations();

    // Filter to only include active locations
    const activeLocations = result.locations?.filter(location => 
      location.status === "ACTIVE"
    ) || [];

    return res.json(safeSerialize({
      success: true,
      locations: activeLocations
    }));

  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch locations",
      details: error.message
    });
  }
};

// Get location by ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const { result } = await squareClient.locationsApi.retrieveLocation(id);

    return res.json(safeSerialize({
      success: true,
      location: result.location
    }));

  } catch (error) {
    console.error('Error fetching location:', error);
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: "Location not found"
      });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to fetch location",
      details: error.message
    });
  }
};

// Create location
export const createLocation = async (req, res) => {
  try {
    const { 
      name,
      address,
      description,
      phoneNumber,
      businessEmail,
      websiteUrl,
      businessHours,
      languageCode = "en-US"
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        success: false,
        error: "Name and address are required"
      });
    }

    const locationPayload = {
      location: {
        name,
        address,
        description,
        phoneNumber,
        businessEmail,
        websiteUrl,
        businessHours,
        languageCode,
        type: "PHYSICAL",
        status: "ACTIVE"
      }
    };

    console.log('Creating location with payload:', JSON.stringify(locationPayload, null, 2));

    const { result } = await squareClient.locationsApi.createLocation(locationPayload);

    return res.status(201).json(safeSerialize({
      success: true,
      message: "Location created successfully",
      location: result.location
    }));

  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to create location",
      details: error.message
    });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name,
      description,
      phoneNumber,
      businessEmail,
      websiteUrl,
      businessHours,
      languageCode
    } = req.body;

    // Format phone number if provided
    const formattedPhone = phoneNumber ? formatPhoneNumber(phoneNumber) : undefined;

    // Build update payload with snake_case field names
    const locationPayload = {
      location: {
        name,
        description,
        phone_number: formattedPhone,
        business_email: businessEmail,
        website_url: websiteUrl,
        business_hours: businessHours ? {
          periods: businessHours.periods.map(period => ({
            day_of_week: period.dayOfWeek,
            start_local_time: period.startLocalTime,
            end_local_time: period.endLocalTime
          }))
        } : undefined,
        language_code: languageCode
      }
    };

    // Remove undefined fields
    Object.keys(locationPayload.location).forEach(key => 
      locationPayload.location[key] === undefined && delete locationPayload.location[key]
    );

    console.log('Update payload:', JSON.stringify(locationPayload, null, 2));

    const { result } = await squareClient.locationsApi.updateLocation(id, locationPayload);

    return res.json({
      success: true,
      message: "Location updated successfully",
      location: result.location
    });

  } catch (error) {
    console.error('Error updating location:', error);
    
    // Handle specific error cases
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: "Location not found"
      });
    }

    // Handle name uniqueness error
    if (error.errors?.[0]?.code === 'BAD_REQUEST' && 
        error.errors[0].detail?.includes('nickname is not unique')) {
      return res.status(400).json({
        success: false,
        error: "Location name must be unique",
        details: "Please choose a different location name"
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      error: "Failed to update location",
      details: error.errors?.[0]?.detail || error.message
    });
  }
};

// Helper function to format phone number
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // For US numbers, must be exactly 10 digits
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // If number already includes country code
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return null;
};

// Delete/Deactivate location
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Attempting to deactivate location:', id);

    // First check if location exists
    const locationResponse = await squareClient.locationsApi.retrieveLocation(id);
    
    console.log('Location response:', JSON.stringify(locationResponse, null, 2));

    if (!locationResponse?.result?.location) {
      return res.status(404).json({
        success: false,
        error: "Location not found"
      });
    }

    const location = locationResponse.result.location;
    
    // Check if location is already inactive
    if (location.status === "INACTIVE") {
      return res.json({
        success: true,
        message: "Location is already inactive",
        location: location
      });
    }

    // Safely get the version number
    const version = location.version ? 
      (typeof location.version === 'bigint' ? 
        Number(location.version.toString()) : 
        Number(location.version)
      ) : 1;

    // If location exists, update its status to INACTIVE
    const deactivatePayload = {
      location: {
        status: "INACTIVE",
        version: version
      }
    };

    console.log('Deactivate payload:', JSON.stringify(deactivatePayload, null, 2));

    try {
      const { result } = await squareClient.locationsApi.updateLocation(id, deactivatePayload);
      
      // Verify the status was actually updated
      if (result.location.status !== "INACTIVE") {
        throw new Error("Failed to deactivate location - status not updated");
      }

      return res.json({
        success: true,
        message: "Location deactivated successfully",
        location: result.location
      });
    } catch (updateError) {
      console.error('Error updating location status:', updateError);
      throw new Error(`Failed to update location status: ${updateError.message}`);
    }

  } catch (error) {
    console.error('Error deactivating location:', error);
    
    // Handle specific error cases
    if (error.statusCode === 404 || error.errors?.[0]?.code === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: "Location not found"
      });
    }

    // Log detailed error information
    console.error('Full error object:', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      errors: error.errors,
      stack: error.stack,
      response: error.response
    });

    return res.status(error.statusCode || 500).json({
      success: false,
      error: "Failed to deactivate location",
      details: error.errors?.[0]?.detail || error.message
    });
  }
};