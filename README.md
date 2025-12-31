# EDH Cube Discover Worker

Google Cloud Function for EDH Cube Discovery Worker built with TypeScript. Processes events via Eventarc triggers including Pub/Sub messages, Cloud Storage, and Firestore events.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Google Cloud Functions**: Ready to deploy to Google Cloud Platform with Eventarc triggers
- **CloudEvent Support**: Handles CloudEvent format for Pub/Sub, Storage, and Firestore events
- **Testing**: Jest testing framework with TypeScript support for CloudEvent processing
- **Code Quality**: ESLint for code linting and formatting
- **Version Management**: Volta for Node.js and Yarn version management

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (>=22.0.0)
- [Yarn](https://yarnpkg.com/) (1.22.19)
- [Volta](https://volta.sh/) for version management
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) for deployment

## 🛠️ Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Build the project:
   ```bash
   yarn build
   ```

## 🧪 Development

### Available Scripts

- `yarn build` - Build TypeScript to JavaScript
- `yarn start` - Start the built function locally
- `yarn dev` - Watch mode for development
- `yarn clean` - Remove build artifacts
- `yarn test` - Run tests
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues automatically

### Local Development

1. Build the project:
   ```bash
   yarn build
   ```

2. Start the function locally:
   ```bash
   yarn start
   ```

3. Or use watch mode during development:
   ```bash
   yarn dev
   ```

### Testing

Run the test suite:
```bash
yarn test
```

Run tests with coverage:
```bash
yarn test -- --coverage
```

## 🚀 Deployment

### Deploy to Google Cloud Functions with Eventarc

1. Make sure you have Google Cloud CLI installed and authenticated
2. Set your project ID:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. Create a Pub/Sub topic (if not exists):
   ```bash
   gcloud pubsub topics create YOUR_PUBSUB_TOPIC
   ```

4. Deploy the function with Pub/Sub trigger:
   ```bash
   # Simple Pub/Sub trigger
   yarn deploy
   # (Make sure to replace YOUR_PUBSUB_TOPIC in package.json)

   # Or deploy with Eventarc trigger
   yarn deploy:eventarc
   # (Make sure to replace YOUR_PROJECT_ID and YOUR_TOPIC_NAME in package.json)
   ```

   Or manually:
   ```bash
   # Deploy with Pub/Sub trigger
   gcloud functions deploy edh-cube-discover-worker \\
     --source . \\
     --entry-point main \\
     --runtime nodejs22 \\
     --trigger-topic YOUR_PUBSUB_TOPIC

   # Deploy with Eventarc trigger
   gcloud functions deploy edh-cube-discover-worker \\
     --source . \\
     --entry-point main \\
     --runtime nodejs22 \\
     --trigger-event-filters type=google.cloud.pubsub.topic.v1.messagePublished \\
     --trigger-event-filters-path-pattern topic=projects/YOUR_PROJECT_ID/topics/YOUR_TOPIC_NAME
   ```

### Event Types Supported

This function can handle various CloudEvent types:

- **Pub/Sub Messages**: `google.cloud.pubsub.topic.v1.messagePublished`
- **Cloud Storage**: `google.cloud.storage.object.v1.finalized`
- **Firestore**: `google.cloud.firestore.document.v1.created/updated/deleted`

### Testing the Function

Send a test message to your Pub/Sub topic:

```bash
gcloud pubsub topics publish YOUR_PUBSUB_TOPIC --message='{"action":"discover","searchQuery":"test"}'
```

## 📁 Project Structure

```
edh-cube-discover-worker/
├── src/
│   └── index.ts          # CloudEvent entry point for Eventarc triggers
├── tests/
│   └── index.test.ts     # CloudEvent processing tests
├── dist/                 # Build output (auto-generated)
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest configuration
├── .eslintrc.js         # ESLint configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 💡 Usage Examples

### Pub/Sub Message Format

Send JSON messages to trigger cube discovery tasks:

```json
{
  "action": "discover",
  "searchQuery": "Atraxa infect"
}
```

```json
{
  "action": "update",
  "cubeId": "cube-123"
}
```

```json
{
  "action": "analyze",
  "cubeId": "cube-456"
}
```

## 🔧 Configuration

### Volta Configuration
This project uses Volta to manage Node.js and Yarn versions. The versions are pinned in `package.json`:

```json
{
  "volta": {
    "node": "22.12.0",
    "yarn": "1.22.19"
  }
}
```

### TypeScript Configuration
- Target: ES2022
- Module: CommonJS
- Strict mode enabled
- Source maps generated for debugging

### ESLint Configuration
- TypeScript parser and rules
- Extends recommended configurations
- Custom rules for Cloud Functions development

## 📜 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📚 Documentation

For more information about Google Cloud Functions and Eventarc, visit:
- [Google Cloud Functions Documentation](https://cloud.google.com/functions/docs)
- [Functions Framework for Node.js](https://github.com/GoogleCloudPlatform/functions-framework-nodejs)
- [Eventarc Documentation](https://cloud.google.com/eventarc/docs)
- [CloudEvents Specification](https://cloudevents.io/)
- [Pub/Sub Triggers for Cloud Functions](https://cloud.google.com/functions/docs/calling/pubsub)
- [Cloud Storage Triggers](https://cloud.google.com/functions/docs/calling/storage)
- [Firestore Triggers](https://cloud.google.com/functions/docs/calling/cloud-firestore)