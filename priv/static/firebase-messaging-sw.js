importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');


const firebaseConfig = {
  apiKey: "AIzaSyCZRvNy1dHBNbeUSi-ZglAmZkYpBQjtnUY",
  authDomain: "elixirus-push.firebaseapp.com",
  projectId: "elixirus-push",
  storageBucket: "elixirus-push.appspot.com",
  messagingSenderId: "260638114728",
  appId: "1:260638114728:web:16152623a7602a5ef0539d"
};


const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
