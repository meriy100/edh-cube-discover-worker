# EDH Cube Discover Worker Makefile
# Builds and deploys source code to Google Cloud Storage

# Variables
ZIP_FILE = source.zip
GCS_BUCKET = edh-cube-discover-worker-source-localdev
TEMP_DIR = .temp-deploy
PROJECT_NAME = edh-cube-discover-worker

# Default target
.PHONY: help
help:
	@echo "EDH Cube Discover Worker - Available Commands:"
	@echo ""
	@echo "  make zip                    Create source.zip with project files"
	@echo "  make upload                 Upload source.zip to Google Cloud Storage"
	@echo "  make deploy-source          Create zip and upload to GCS (zip + upload)"
	@echo "  make clean                  Remove generated files (source.zip, temp dirs)"
	@echo "  make build                  Build TypeScript project"
	@echo "  make test                   Run tests"
	@echo "  make lint                   Run ESLint"
	@echo "  make install                Install dependencies"
	@echo ""
	@echo "  GCS Bucket: gs://$(GCS_BUCKET)"
	@echo ""

# Install dependencies
.PHONY: install
install:
	@echo "Installing dependencies with yarn..."
	yarn install

# Build TypeScript project
.PHONY: build
build:
	@echo "Building TypeScript project..."
	yarn build

# Run tests
.PHONY: test
test:
	@echo "Running tests..."
	yarn test

# Run linting
.PHONY: lint
lint:
	@echo "Running ESLint..."
	yarn lint

# Create source zip file
.PHONY: zip
zip: clean
	@echo "Creating source.zip..."
	@mkdir -p $(TEMP_DIR)

	# Copy source files to temp directory
	@cp -r src $(TEMP_DIR)/
	@cp package.json $(TEMP_DIR)/
	@cp tsconfig.json $(TEMP_DIR)/
	@cp jest.config.js $(TEMP_DIR)/
	@cp .eslintrc.js $(TEMP_DIR)/
	@cp yarn.lock $(TEMP_DIR)/
	@cp README.md $(TEMP_DIR)/
	@cp -r dist $(TEMP_DIR)/
	@cp .gitignore $(TEMP_DIR)/

	# Copy tests directory if it exists
	@if [ -d "tests" ]; then cp -r tests $(TEMP_DIR)/; fi

	# Create zip file from temp directory
	@cd $(TEMP_DIR) && zip -r ../$(ZIP_FILE) . -x "*.DS_Store" "*/node_modules/*" "*/dist/*" "*/.git/*" "*/.idea/*" "*/coverage/*" "*.log"

	# Clean up temp directory
	@rm -rf $(TEMP_DIR)

	@echo "✓ Created $(ZIP_FILE) (size: $$(du -h $(ZIP_FILE) | cut -f1))"

# Upload to Google Cloud Storage
.PHONY: upload
upload:
	@if [ ! -f "$(ZIP_FILE)" ]; then \
		echo "Error: $(ZIP_FILE) not found. Run 'make zip' first."; \
		exit 1; \
	fi

	@echo "Uploading $(ZIP_FILE) to gs://$(GCS_BUCKET)/"
	@echo "Checking if bucket exists..."

	# Check if bucket exists, create if it doesn't
	@if ! gsutil ls -b gs://$(GCS_BUCKET) >/dev/null 2>&1; then \
		echo "Bucket gs://$(GCS_BUCKET) not found. Creating bucket..."; \
		gsutil mb gs://$(GCS_BUCKET); \
		echo "✓ Created bucket gs://$(GCS_BUCKET)"; \
	else \
		echo "✓ Bucket gs://$(GCS_BUCKET) exists"; \
	fi

	# Upload the file
	@gsutil cp $(ZIP_FILE) gs://$(GCS_BUCKET)/
	@echo "✓ Uploaded $(ZIP_FILE) to gs://$(GCS_BUCKET)/"

	# Show file info
	@gsutil ls -l gs://$(GCS_BUCKET)/$(ZIP_FILE)

# Create zip and upload (main deployment command)
.PHONY: deploy-source
deploy-source: zip upload
	@echo ""
	@echo "🎉 Source deployment completed successfully!"
	@echo ""
	@echo "   File: $(ZIP_FILE)"
	@echo "   Location: gs://$(GCS_BUCKET)/$(ZIP_FILE)"
	@echo ""
	@echo "   You can download it with:"
	@echo "   gsutil cp gs://$(GCS_BUCKET)/$(ZIP_FILE) ."
	@echo ""

# Clean up generated files
.PHONY: clean
clean:
	@echo "Cleaning up generated files..."
	@rm -f $(ZIP_FILE)
	@rm -rf $(TEMP_DIR)
	@rm -rf coverage/
	@echo "✓ Cleanup completed"

# Verify GCS setup
.PHONY: verify-gcs
verify-gcs:
	@echo "Verifying Google Cloud Storage setup..."
	@echo ""

	# Check if gcloud is installed
	@if ! command -v gcloud >/dev/null 2>&1; then \
		echo "❌ gcloud CLI not found. Please install Google Cloud SDK."; \
		echo "   https://cloud.google.com/sdk/docs/install"; \
		exit 1; \
	else \
		echo "✓ gcloud CLI found: $$(gcloud --version | head -n1)"; \
	fi

	# Check if gsutil is installed
	@if ! command -v gsutil >/dev/null 2>&1; then \
		echo "❌ gsutil not found. Please install Google Cloud SDK."; \
		exit 1; \
	else \
		echo "✓ gsutil found"; \
	fi

	# Check authentication
	@if ! gcloud auth list --format="value(account)" --filter="status:ACTIVE" | grep -q .; then \
		echo "❌ Not authenticated with gcloud. Run:"; \
		echo "   gcloud auth login"; \
		exit 1; \
	else \
		echo "✓ Authenticated as: $$(gcloud auth list --format='value(account)' --filter='status:ACTIVE' | head -n1)"; \
	fi

	# Show current project
	@echo "✓ Current project: $$(gcloud config get-value project 2>/dev/null || echo 'Not set')"
	@echo ""
	@echo "✓ Google Cloud Storage setup verified!"

# Show current GCS bucket contents
.PHONY: list-gcs
list-gcs:
	@echo "Contents of gs://$(GCS_BUCKET)/"
	@gsutil ls -la gs://$(GCS_BUCKET)/ 2>/dev/null || echo "Bucket gs://$(GCS_BUCKET)/ not found or empty"

# Full development workflow
.PHONY: dev-deploy
dev-deploy: install lint test build deploy-source
	@echo ""
	@echo "🚀 Full development deployment completed!"
	@echo ""
