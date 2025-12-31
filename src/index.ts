import { http } from '@google-cloud/functions-framework';
import { Request, Response } from 'express';

/**
 * EDH Cube Discover Worker
 * Google Cloud Function for discovering and processing EDH cube data
 */

// Main HTTP Cloud Function entry point
http('main', (req: Request, res: Response) => {
  console.log('EDH Cube Discover Worker started');
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);

  // Handle CORS if needed
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Handle CORS preflight
    res.set('Access-Control-Allow-Methods', 'GET,POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        handleGetRequest(req, res);
        break;
      case 'POST':
        handlePostRequest(req, res);
        break;
      default:
        res.status(405).json({
          error: 'Method not allowed',
          allowedMethods: ['GET', 'POST']
        });
    }
  } catch (error) {
    console.error('Error in main function:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Handle GET requests
 */
function handleGetRequest(req: Request, res: Response): void {
  const { query } = req;

  console.log('GET request received with query:', query);

  // Example response
  res.status(200).json({
    message: 'EDH Cube Discover Worker is running',
    timestamp: new Date().toISOString(),
    method: 'GET',
    query: query
  });
}

/**
 * Handle POST requests
 */
function handlePostRequest(req: Request, res: Response): void {
  const { body } = req;

  console.log('POST request received with body:', body);

  // Example response
  res.status(200).json({
    message: 'POST request processed successfully',
    timestamp: new Date().toISOString(),
    method: 'POST',
    receivedData: body
  });
}

// Export for testing
export { handleGetRequest, handlePostRequest };