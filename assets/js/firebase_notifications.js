import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCZRvNy1dHBNbeUSi-ZglAmZkYpBQjtnUY",
  authDomain: "elixirus-push.firebaseapp.com",
  projectId: "elixirus-push",
  storageBucket: "elixirus-push.appspot.com",
  messagingSenderId: "260638114728",
  appId: "1:260638114728:web:16152623a7602a5ef0539d"
};


const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
