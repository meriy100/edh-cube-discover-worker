# EDH Cube Discover Worker

Google Cloud Function for EDH Cube Discovery Worker built with TypeScript.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Google Cloud Functions**: Ready to deploy to Google Cloud Platform
- **Testing**: Jest testing framework with TypeScript support
- **Code Quality**: ESLint for code linting and formatting
- **Version Management**: Volta for Node.js and Yarn version management

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (>=18.0.0)
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

### Deploy to Google Cloud Functions

1. Make sure you have Google Cloud CLI installed and authenticated
2. Set your project ID:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. Deploy the function:
   ```bash
   yarn deploy
   ```

   Or manually:
   ```bash
   gcloud functions deploy edh-cube-discover-worker \\
     --source . \\
     --entry-point main \\
     --runtime nodejs18 \\
     --trigger-http \\
     --allow-unauthenticated
   ```

## 📁 Project Structure

```
edh-cube-discover-worker/
├── src/
│   └── index.ts          # Main Cloud Function entry point
├── tests/
│   └── index.test.ts     # Test files
├── dist/                 # Build output (auto-generated)
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest configuration
├── .eslintrc.js         # ESLint configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🔧 Configuration

### Volta Configuration
This project uses Volta to manage Node.js and Yarn versions. The versions are pinned in `package.json`:

```json
{
  "volta": {
    "node": "18.18.2",
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

For more information about Google Cloud Functions, visit:
- [Google Cloud Functions Documentation](https://cloud.google.com/functions/docs)
- [Functions Framework for Node.js](https://github.com/GoogleCloudPlatform/functions-framework-nodejs)