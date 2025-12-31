import { App, initializeApp, applicationDefault  } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

let app: App | null = null;
let db: Firestore | null = null;

/**
 * Initialize Firebase Admin SDK
 * Uses Application Default Credentials in production (Cloud Functions)
 * or service account key file in development
 */
function initializeFirebase(): App {
  if (app) {
    return app;
  }

  try {
    // In Cloud Functions, use Application Default Credentials
    if (process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT) {
      app = initializeApp({
        credential: applicationDefault(),
        projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
      });
      console.log('Firebase Admin SDK initialized with Application Default Credentials');
    } else {
      // For local development, you can use a service account key file
      // Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to your key file
      app = initializeApp({
        credential: applicationDefault(),
      });
      console.log('Firebase Admin SDK initialized with credential file');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }

  return app;
}

/**
 * Get Firestore database instance
 * Initializes Firebase Admin SDK if not already initialized
 */
export function adminDb(): Firestore {
  if (db) {
    return db;
  }

  const firebaseApp = initializeFirebase();
  db = getFirestore(firebaseApp);
  db.settings({
    ignoreUndefinedProperties: true,
  });

  console.log('Firestore database instance created');
  return db;
}

/**
 * Get Firebase Admin App instance
 */
export function getAdminApp(): App {
  return initializeFirebase();
}
