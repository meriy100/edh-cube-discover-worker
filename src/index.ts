import { CloudEvent, cloudEvent } from '@google-cloud/functions-framework';
import { z } from 'zod';
import { attachScryfall } from './attachScryfall';

/**
 * EDH Cube Discover Worker
 * Google Cloud Function for discovering and processing EDH cube data
 * Triggered by Pub/Sub messages via Eventarc
 */

// CloudEvent entry point for Eventarc triggers
cloudEvent('worker', async (cloudEvent: CloudEvent<any>) => {
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
    await processCloudEvent(cloudEvent);
  } catch (error) {
    console.error('Error processing CloudEvent:', error);
    throw error; // Re-throw to trigger function retry if needed
  }
});

async function processCloudEvent(cloudEvent: CloudEvent<any>): Promise<void> {
  const eventType = cloudEvent.type;
  const eventSource = cloudEvent.source;

  console.log(`Processing event type: ${eventType} from source: ${eventSource}`);

  switch (eventType) {
    case 'google.cloud.pubsub.topic.v1.messagePublished':
      await handlePubSubMessage(cloudEvent);
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

async function handlePubSubMessage(cloudEvent: CloudEvent<any>): Promise<void> {
  console.log('Processing Pub/Sub message');

  const messageData = cloudEvent.data;
  let decodedData: unknown = null;
  let messageAttributes: Record<string, string> = {};

  try {
    if (messageData && typeof messageData === 'object' && 'message' in messageData) {
      const message = (messageData as { message: { data?: string; attributes?: Record<string, string> } }).message;

      if (message.data) {
        const decodedString = Buffer.from(message.data, 'base64').toString('utf-8');
        try {
          decodedData = JSON.parse(decodedString);
        } catch {
          decodedData = decodedString;
        }
      }

      if (message.attributes && typeof message.attributes === 'object') {
        messageAttributes = message.attributes;
      }
    }

    console.log('Decoded Pub/Sub message:', decodedData);
    console.log('Pub/Sub message attributes:', messageAttributes);

    await processCubeDiscoveryTask(decodedData, messageAttributes);

  } catch (error) {
    console.error('Error processing Pub/Sub message:', error);
    throw error;
  }
}

function handleStorageEvent(cloudEvent: CloudEvent<any>): void {
  console.log('Processing Cloud Storage event');

  const storageData = cloudEvent.data;
  console.log('Storage event data:', storageData);

}

function handleFirestoreEvent(cloudEvent: CloudEvent<any>): void {
  console.log('Processing Firestore event');

  const firestoreData = cloudEvent.data;
  console.log('Firestore event data:', firestoreData);

  // Process Firestore document changes related to cube discovery
}

function handleGenericEvent(cloudEvent: CloudEvent<any>): void {
  console.log('Processing generic event');
  console.log('Event data:', cloudEvent.data);

  // Default processing for unknown event types
}



async function processCubeDiscoveryTask(taskData: unknown, attributes?: Record<string, string>): Promise<void> {
  console.log('Processing cube discovery task:', taskData);
  console.log('Message attributes:', attributes);
  const { eventType } = z.object({ eventType: z.string() }).parse(attributes);
  switch (eventType) {
    case 'attachScryfall':
      await attachScryfall(z.object({ names:  z.array(z.string()) }).parse(taskData));
      break;
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
