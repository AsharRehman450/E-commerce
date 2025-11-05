import { randomUUID } from 'crypto';
import { squareClient } from "../utils/square.config.js";

// Helper function to format phone number
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // For US numbers, must be exactly 10 digits
  if (cleaned.length === 10) {
    return `+1${cleaned}`; // Format: +1XXXXXXXXXX
  }
  
  // If number already includes country code (11 digits starting with 1)
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`; // Format: +1XXXXXXXXXX
  }
  
  return null;
};

// Helper function to safely serialize BigInt
const safeSerialize = (obj) => {
  return JSON.parse(JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
};

// Create customer
export const createCustomer = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber,
      address 
    } = req.body;

    // Validate required fields
    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Either email or phone number is required"
      });
    }

    // Format and validate phone number
    const formattedPhone = phoneNumber ? formatPhoneNumber(phoneNumber) : null;
    if (phoneNumber && !formattedPhone) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number. Please provide a valid 10-digit US phone number"
      });
    }

    // Create customer payload
    const customerPayload = {
      idempotencyKey: randomUUID(),
      givenName: firstName,
      familyName: lastName,
      emailAddress: email,
      phoneNumber: formattedPhone,
      address: address ? {
        addressLine1: address.addressLine1,
        locality: address.locality,
        administrativeDistrictLevel1: address.administrativeDistrictLevel1,
        postalCode: address.postalCode,
        country: address.country || 'US'
      } : undefined
    };

    console.log('Creating customer with payload:', JSON.stringify(customerPayload, null, 2));

    const { result } = await squareClient.customersApi.createCustomer(customerPayload);

    return res.status(201).json(safeSerialize({
      success: true,
      message: "Customer created successfully",
      customer: result.customer
    }));

  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to create customer",
      details: error.message
    });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const { cursor, limit = 100 } = req.query;

    const { result } = await squareClient.customersApi.listCustomers(cursor, limit);

    return res.json(safeSerialize({
      success: true,
      customers: result.customers || [],
      cursor: result.cursor
    }));

  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch customers",
      details: error.message
    });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const { result } = await squareClient.customersApi.retrieveCustomer(id);

    return res.json(safeSerialize({
      success: true,
      customer: result.customer
    }));

  } catch (error) {
    console.error('Error fetching customer:', error);
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: "Customer not found"
      });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to fetch customer",
      details: error.message
    });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber,
      address 
    } = req.body;

    // First get the existing customer for version number
    const { result: existingCustomer } = await squareClient.customersApi.retrieveCustomer(id);

    // Build update payload with snake_case field names
    const updatePayload = {
      given_name: firstName + ' ' + lastName,
      email_address: email,
      phone_number: phoneNumber ? formatPhoneNumber(phoneNumber) : undefined,
      address: {
        address_line_1: address?.addressLine1,
        locality: address?.locality,
        administrative_district_level_1: address?.administrativeDistrictLevel1,
        postal_code: address?.postalCode,
        country: address?.country
      },
      version: 1
    };

    // Remove undefined fields and nested undefined fields in address
    Object.keys(updatePayload).forEach(key => {
      if (updatePayload[key] === undefined) {
        delete updatePayload[key];
      } else if (key === 'address' && updatePayload[key]) {
        Object.keys(updatePayload[key]).forEach(addressKey => {
          if (updatePayload[key][addressKey] === undefined) {
            delete updatePayload[key][addressKey];
          }
        });
        // Remove address if empty
        if (Object.keys(updatePayload[key]).length === 0) {
          delete updatePayload[key];
        }
      }
    });

    console.log('Update payload:', JSON.stringify(updatePayload, null, 2));

    const { result } = await squareClient.customersApi.updateCustomer(id, updatePayload);

    return res.json({
      success: true,
      message: "Customer updated successfully",
      customer: {
        ...result.customer,
        version: Number(result.customer.version.toString())
      }
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    console.log('Full error details:', error);
    
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: "Customer not found"
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      error: "Failed to update customer",
      details: error.errors?.[0]?.detail || error.message
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await squareClient.customersApi.deleteCustomer(id);

    return res.json({
      success: true,
      message: "Customer deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: "Customer not found"
      });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to delete customer",
      details: error.message
    });
  }
};

// Search customers
export const searchCustomers = async (req, res) => {
  try {
    const { 
      email, 
      phoneNumber, 
      name 
    } = req.query;

    const searchPayload = {
      limit: 100,
      query: {
        filter: {
          emailAddress: {
            exact: email
          },
          phoneNumber: {
            exact: phoneNumber
          },
          givenName: {
            fuzzy: name
          }
        }
      }
    };

    const { result } = await squareClient.customersApi.searchCustomers(searchPayload);

    return res.json(safeSerialize({
      success: true,
      customers: result.customers || []
    }));

  } catch (error) {
    console.error('Error searching customers:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to search customers",
      details: error.message
    });
  }
};