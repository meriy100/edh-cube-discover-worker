import {
  processCloudEvent,
  handlePubSubMessage,
  handleStorageEvent,
  handleFirestoreEvent,
  processCubeDiscoveryTask
} from '../src/index';
import { CloudEvent } from '@google-cloud/functions-framework';

// Mock CloudEvent
const createMockCloudEvent = (overrides?: Partial<CloudEvent<any>>): CloudEvent<any> => {
  return {
    specversion: '1.0',
    id: 'test-id-123',
    source: 'test-source',
    type: 'google.cloud.pubsub.topic.v1.messagePublished',
    datacontenttype: 'application/json',
    subject: 'test-subject',
    time: '2024-01-01T00:00:00Z',
    data: {},
    ...overrides,
  } as CloudEvent<any>;
};

describe('EDH Cube Discover Worker - CloudEvent Processing', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('processCloudEvent', () => {
    it('should process Pub/Sub events', () => {
      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.pubsub.topic.v1.messagePublished',
        source: '//pubsub.googleapis.com/projects/test-project/topics/test-topic',
      });

      processCloudEvent(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Processing event type: google.cloud.pubsub.topic.v1.messagePublished from source: //pubsub.googleapis.com/projects/test-project/topics/test-topic'
      );
    });

    it('should process Storage events', () => {
      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.storage.object.v1.finalized',
        source: '//storage.googleapis.com/projects/test-project',
      });

      processCloudEvent(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Processing event type: google.cloud.storage.object.v1.finalized from source: //storage.googleapis.com/projects/test-project'
      );
    });

    it('should process Firestore events', () => {
      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.firestore.document.v1.created',
        source: '//firestore.googleapis.com/projects/test-project/databases/(default)',
      });

      processCloudEvent(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Processing event type: google.cloud.firestore.document.v1.created from source: //firestore.googleapis.com/projects/test-project/databases/(default)'
      );
    });

    it('should handle unknown event types', () => {
      const cloudEvent = createMockCloudEvent({
        type: 'unknown.event.type',
        source: 'unknown-source',
      });

      processCloudEvent(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Processing event type: unknown.event.type from source: unknown-source'
      );
      expect(consoleSpy).toHaveBeenCalledWith('Processing generic event');
    });
  });

  describe('handlePubSubMessage', () => {
    it('should decode and process Pub/Sub message with JSON data', () => {
      const testData = { action: 'discover', searchQuery: 'test query' };
      const encodedData = Buffer.from(JSON.stringify(testData)).toString('base64');

      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.pubsub.topic.v1.messagePublished',
        data: {
          message: {
            data: encodedData,
            attributes: {},
          },
        },
      });

      handlePubSubMessage(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Processing Pub/Sub message');
      expect(consoleSpy).toHaveBeenCalledWith('Decoded Pub/Sub message:', testData);
      expect(consoleSpy).toHaveBeenCalledWith('Processing cube discovery task:', testData);
    });

    it('should handle Pub/Sub message with string data', () => {
      const testString = 'simple string message';
      const encodedData = Buffer.from(testString).toString('base64');

      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.pubsub.topic.v1.messagePublished',
        data: {
          message: {
            data: encodedData,
            attributes: {},
          },
        },
      });

      handlePubSubMessage(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Processing Pub/Sub message');
      expect(consoleSpy).toHaveBeenCalledWith('Decoded Pub/Sub message:', testString);
    });

    it('should handle Pub/Sub message without data', () => {
      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.pubsub.topic.v1.messagePublished',
        data: {
          message: {
            attributes: {},
          },
        },
      });

      handlePubSubMessage(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Processing Pub/Sub message');
      expect(consoleSpy).toHaveBeenCalledWith('Decoded Pub/Sub message:', null);
    });
  });

  describe('handleStorageEvent', () => {
    it('should process Cloud Storage event', () => {
      const storageData = {
        bucket: 'test-bucket',
        name: 'test-file.json',
        eventType: 'OBJECT_FINALIZE',
      };

      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.storage.object.v1.finalized',
        data: storageData,
      });

      handleStorageEvent(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Processing Cloud Storage event');
      expect(consoleSpy).toHaveBeenCalledWith('Storage event data:', storageData);
    });
  });

  describe('handleFirestoreEvent', () => {
    it('should process Firestore event', () => {
      const firestoreData = {
        value: {
          name: 'projects/test-project/databases/(default)/documents/cubes/test-cube',
          fields: {
            name: { stringValue: 'Test Cube' },
          },
        },
      };

      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.firestore.document.v1.created',
        data: firestoreData,
      });

      handleFirestoreEvent(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Processing Firestore event');
      expect(consoleSpy).toHaveBeenCalledWith('Firestore event data:', firestoreData);
    });
  });

  describe('processCubeDiscoveryTask', () => {
    it('should process discover action', () => {
      const taskData = {
        action: 'discover',
        searchQuery: 'test search query',
      };

      processCubeDiscoveryTask(taskData);

      expect(consoleSpy).toHaveBeenCalledWith('Processing cube discovery task:', taskData);
      expect(consoleSpy).toHaveBeenCalledWith('Starting cube discovery for query: test search query');
      expect(consoleSpy).toHaveBeenCalledWith('Cube discovery task completed successfully');
    });

    it('should process update action', () => {
      const taskData = {
        action: 'update',
        cubeId: 'cube-123',
      };

      processCubeDiscoveryTask(taskData);

      expect(consoleSpy).toHaveBeenCalledWith('Processing cube discovery task:', taskData);
      expect(consoleSpy).toHaveBeenCalledWith('Updating cube data for cubeId: cube-123');
      expect(consoleSpy).toHaveBeenCalledWith('Cube discovery task completed successfully');
    });

    it('should process analyze action', () => {
      const taskData = {
        action: 'analyze',
        cubeId: 'cube-456',
      };

      processCubeDiscoveryTask(taskData);

      expect(consoleSpy).toHaveBeenCalledWith('Processing cube discovery task:', taskData);
      expect(consoleSpy).toHaveBeenCalledWith('Analyzing cube data for cubeId: cube-456');
      expect(consoleSpy).toHaveBeenCalledWith('Cube discovery task completed successfully');
    });

    it('should handle unknown action', () => {
      const taskData = {
        action: 'unknown',
        data: 'test data',
      };

      processCubeDiscoveryTask(taskData);

      expect(consoleSpy).toHaveBeenCalledWith('Processing cube discovery task:', taskData);
      expect(consoleSpy).toHaveBeenCalledWith('Unknown action:', 'unknown');
      expect(consoleSpy).toHaveBeenCalledWith('Cube discovery task completed successfully');
    });

    it('should handle non-object task data', () => {
      const taskData = 'string task data';

      processCubeDiscoveryTask(taskData);

      expect(consoleSpy).toHaveBeenCalledWith('Processing cube discovery task:', taskData);
      expect(consoleSpy).toHaveBeenCalledWith('Cube discovery task completed successfully');
    });

    it('should handle null task data', () => {
      processCubeDiscoveryTask(null);

      expect(consoleSpy).toHaveBeenCalledWith('Processing cube discovery task:', null);
      expect(consoleSpy).toHaveBeenCalledWith('Cube discovery task completed successfully');
    });
  });
});