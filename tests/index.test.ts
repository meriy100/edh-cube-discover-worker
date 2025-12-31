import { processCloudEvent } from '../src/index';
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
    xit('should process Pub/Sub events', async () => {
      const testData = '{ "names": ["Card2", "Card2"] } ';
      const encodedData = Buffer.from(testData).toString('base64');

      const cloudEvent = createMockCloudEvent({
        type: 'google.cloud.pubsub.topic.v1.messagePublished',
        source: '//pubsub.googleapis.com/projects/test-project/topics/test-topic',
        data: {
          message: {
            data: encodedData,
            attributes: {
              eventType: 'attachScryfall'
            }
          }
        }
      });

      await processCloudEvent(cloudEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Processing event type: google.cloud.pubsub.topic.v1.messagePublished from source: //pubsub.googleapis.com/projects/test-project/topics/test-topic'
      );
    });
  });
});
