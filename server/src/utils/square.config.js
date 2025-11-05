import * as Square from "square";
import dotenv from "dotenv";

dotenv.config();

// Debug configuration
const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
console.log('Square Configuration Debug:');
console.log('- Access Token Present:', !!squareAccessToken);
console.log('- Access Token Format:', squareAccessToken?.startsWith('EAAA') ? 'Valid' : 'Invalid');
console.log('- Access Token Length:', squareAccessToken?.length);

// Create Square client with explicit sandbox configuration
export const squareClient = new Square.Client({
    bearerAuthCredentials: {
        accessToken: squareAccessToken,
    },
    environment: process.env.NODE_ENV === "PRODUCTION" ? Square.Environment.Production : Square.Environment.Sandbox,
});

// Verify client configuration
console.log('Square Client Configuration:');
console.log('- Client Environment:', squareClient.environment);
console.log('- Authentication Set:', !!squareClient.bearerAuthCredentials);

