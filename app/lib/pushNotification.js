import PushNotification from 'react-native-push-notification';
import config from '../config/private';

/**
 * Implements a wrapper around push notification setup.
 */
class pushNotification {

/**
 * create
 *
 * @method constructor
 * @param  {function}    dispatch           function used to dispatch redux events
 * @param  {function}    registerAction     redux action to dispatch when a push token is received
 * @param  {function}    notificationAction redux action to dispatch when a notification is received
 */
  constructor(dispatch, registerAction, notificationAction) {
    Object.assign(this, { dispatch, registerAction, notificationAction });


  }

/**
 * Configure push notification handlers and register callbacks
 *
 * @method register
 * @return {[type]} Return value from react-native-push-notification configure
 */
  register(){
      return PushNotification.configure({

        // (optional) Called when Token is generated (iOS and Android)
        onRegister: ({ token, os }) => {
          console.log('onregister: ', token, os)
          store.dispatch(actions.notificationToken.token({ token, os }));
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: (notification) => {
          console.log('notification', notification)
          store.dispatch(actions.Phone);
        },

        // ANDROID ONLY: (optional) GCM Sender ID.
        senderID: config.push.senderID,

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        // Leave this off unless you have good reason.
        popInitialNotification: true,

        requestPermissions: true
      });

  }

}

export default pushNotification;
