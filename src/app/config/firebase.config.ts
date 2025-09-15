import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from 'src/environments';

// Initialize Firebase
export const app = initializeApp(environment.firebase);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
