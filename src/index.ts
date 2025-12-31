import { CloudEvent, cloudEvent } from '@google-cloud/functions-framework';

/**
 * EDH Cube Discover Worker
 * Google Cloud Function for discovering and processing EDH cube data
 * Triggered by Pub/Sub messages via Eventarc
 */

// CloudEvent entry point for Eventarc triggers
cloudEvent('main', (cloudEvent: CloudEvent<any>) => {
  console.log('EDH Cube Discover Worker started');
  console.log('CloudEvent received:', {
    id: cloudEvent.id,
    source: cloudEvent.source,
    type: cloudEvent.type,
    datacontenttype: cloudEvent.datacontenttype,
    subject: cloudEvent.subject,
    time: cloudEvent.time
  });

  try {
    // Process the CloudEvent based on its type
    processCloudEvent(cloudEvent);
  } catch (error) {
    console.error('Error processing CloudEvent:', error);
    throw error; // Re-throw to trigger function retry if needed
  }
});

/**
 * Process CloudEvent based on its type and source
 */
function processCloudEvent(cloudEvent: CloudEvent<any>): void {
  const eventType = cloudEvent.type;
  const eventSource = cloudEvent.source;

  console.log(`Processing event type: ${eventType} from source: ${eventSource}`);

  // Handle different event types
  switch (eventType) {
    case 'google.cloud.pubsub.topic.v1.messagePublished':
      handlePubSubMessage(cloudEvent);
      break;
    case 'google.cloud.storage.object.v1.finalized':
      handleStorageEvent(cloudEvent);
      break;
    case 'google.cloud.firestore.document.v1.created':
    case 'google.cloud.firestore.document.v1.updated':
    case 'google.cloud.firestore.document.v1.deleted':
      handleFirestoreEvent(cloudEvent);
      break;
    default:
      handleGenericEvent(cloudEvent);
  }
}

/**
 * Handle Pub/Sub message events
 */
function handlePubSubMessage(cloudEvent: CloudEvent<any>): void {
  console.log('Processing Pub/Sub message');

  const messageData = cloudEvent.data;
  let decodedData: any = null;

  try {
    // Decode Pub/Sub message data (base64 encoded)
    if (messageData && typeof messageData === 'object' && 'message' in messageData) {
      const message = (messageData as any).message;
      if (message.data) {
        const decodedString = Buffer.from(message.data, 'base64').toString('utf-8');
        try {
          decodedData = JSON.parse(decodedString);
        } catch {
          decodedData = decodedString;
        }
      }
    }

    console.log('Decoded Pub/Sub message:', decodedData);

    // Process the cube discovery task
    processCubeDiscoveryTask(decodedData);

  } catch (error) {
    console.error('Error processing Pub/Sub message:', error);
    throw error;
  }
}

/**
 * Handle Cloud Storage events
 */
function handleStorageEvent(cloudEvent: CloudEvent<any>): void {
  console.log('Processing Cloud Storage event');

  const storageData = cloudEvent.data;
  console.log('Storage event data:', storageData);

  // Process storage-related cube discovery tasks
  // e.g., when a new cube list file is uploaded
}

/**
 * Handle Firestore events
 */
function handleFirestoreEvent(cloudEvent: CloudEvent<any>): void {
  console.log('Processing Firestore event');

  const firestoreData = cloudEvent.data;
  console.log('Firestore event data:', firestoreData);

  // Process Firestore document changes related to cube discovery
}

/**
 * Handle generic events
 */
function handleGenericEvent(cloudEvent: CloudEvent<any>): void {
  console.log('Processing generic event');
  console.log('Event data:', cloudEvent.data);

  // Default processing for unknown event types
}

/**
 * Process cube discovery task
 */
function processCubeDiscoveryTask(taskData: any): void {
  console.log('Processing cube discovery task:', taskData);

  // Example cube discovery logic
  if (taskData && typeof taskData === 'object') {
    const { action, cubeId, searchQuery } = taskData;

    switch (action) {
      case 'discover':
        console.log(`Starting cube discovery for query: ${searchQuery}`);
        // Implement cube discovery logic
        break;
      case 'update':
        console.log(`Updating cube data for cubeId: ${cubeId}`);
        // Implement cube update logic
        break;
      case 'analyze':
        console.log(`Analyzing cube data for cubeId: ${cubeId}`);
        // Implement cube analysis logic
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  console.log('Cube discovery task completed successfully');
}

// Export for testing
export {
  processCloudEvent,
  handlePubSubMessage,
  handleStorageEvent,
  handleFirestoreEvent,
  processCubeDiscoveryTask
};