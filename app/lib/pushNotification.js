import PushNotification from 'react-native-push-notification';
import PushNotificationAndroid from 'react-native-push-notification';
import { DeviceEventEmitter } from 'react-native';
import InCallManager from 'react-native-incall-manager';
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
  register(listners = null) {
    console.log('registering', listners);
    this.listners = listners;
    if(this.listners != null) {
      console.log(`registering listners for: ${Object.keys(this.listners)}`);
      PushNotificationAndroid.registerNotificationActions(Object.keys(this.listners))
      DeviceEventEmitter.addListener('notificationActionReceived', (action) => {
        console.log('Notification action received: ' + action);
        const info = JSON.parse(action.dataJSON);
        Object.keys(this.listners)
          .forEach((l) => {
            if(info.action == l) {
              console.log(`firing ${l} action`)
              this.listners[l]();
            }
          });
      })
    }

    return PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: ({ token, os }) => {
        console.log('onregister: ', token, os)
        this.dispatch(this.registerAction({ token, os }));
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: (notification) => {
        console.log('notification', notification, notification.data);
        InCallManager.startRingtone('_BUNDLE_');
        PushNotification.localNotification({
          /* Android Only Properties */
          ticker: "My Notification Ticker", // (optional)
          autoCancel: false, // (optional) default: true
          largeIcon: "phone", // (optional) default: "ic_launcher"
          smallIcon: "phone", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: `Incoming phone call`, // (optional) default: "message" prop
          subText: ` from ${notification.data.CLI}`, // (optional) default: none
          color: "green", // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          //tag: 'some_tag', // (optional) add tag to message
          //group: "group", // (optional) add group to message
          ongoing: false, // (optional) set whether this is an "ongoing" notification

          /* iOS only properties */
          alertAction: 'slide to accept', // (optional) default: view
          category: 'accept', // (optional) default: null
          userInfo: `${notification.data.CLI}`, // (optional) default: null (object containing additional notification data)

          /* iOS and Android properties */
          title: 'IPCortex Phone', // (optional)
          message: `Incoming Call from ${notification.data.CLI}`, // (required)
          playSound: false, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          //number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          //repeatType: 'day', // (Android only) Repeating interval. Could be one of `week`, `day`, `hour`, `minute, `time`. If specified as time, it should be accompanied by one more parameter 'repeatTime` which should the number of milliseconds between each interval
          actions: '["Accept", "Reject"]', // (Android only) See the doc for notification actions to know more
        });
        //this.dispatch(this.notificationAction);
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
      popInitialNotification: false,

      requestPermissions: true
    });

  }

}

export default pushNotification;
