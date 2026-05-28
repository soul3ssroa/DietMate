import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCBLxHLzl3axYwbLrMYzt9r5qHAIRDA26g',
  authDomain: 'dietmate-80b63.firebaseapp.com',
  projectId: 'dietmate-80b63',
  storageBucket: 'dietmate-80b63.firebasestorage.app',
  messagingSenderId: '473336509391',
  appId: '1:473336509391:android:cafa7778b41dff808c18ba',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
