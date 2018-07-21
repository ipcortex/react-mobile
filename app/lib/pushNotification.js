import PushNotification from 'react-native-push-notification';
import PushNotificationAndroid from 'react-native-push-notification';
import { DeviceEventEmitter } from 'react-native';
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
        this.outstanding = false;
    }

    /**
     * Configure push notification handlers and register callbacks
     *
     * @method register
     * @return {[type]} Return value from react-native-push-notification configure
     */
    register(onMessage = null, actionListeners = null) {
        this.onMessage = onMessage;
        console.log('registering', actionListeners);
        this.actionListeners = actionListeners;
        if (this.actionListeners != null) {
            console.log(`registering actionListeners for: ${Object.keys(this.actionListeners)}`);
            PushNotificationAndroid.registerNotificationActions(Object.keys(this.actionListeners))
            DeviceEventEmitter.addListener('notificationActionReceived', (action) => {
                console.log('Notification action received: ', action);
                const info = JSON.parse(action.dataJSON);
                Object.keys(this.actionListeners)
                    .forEach((l) => {
                        if (info.action == l) {
                            if (this.oustandingTimer) {
                                clearTimeout(this.oustandingTimer);
                                delete this.oustandingTimer;
                            }
                            this.outstanding = false;
                            console.log(`firing ${l} action`)
                            this.actionListeners[l]();
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
                console.log('this', this);

                if (!this.outstanding) {
                    PushNotification.localNotification({
                        /* Android Only Properties */
                        id: 1,
                        autoCancel: false, // (optional) default: true
                        //largeIcon: "phone", // (optional) default: "ic_launcher"
                        //smallIcon: "phone", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                        bigText: `Incoming phone call`, // (optional) default: "message" prop
                        subText: ` from ${notification.data.CLI}`, // (optional) default: none
                        color: "green", // (optional) default: system default
                        vibrate: true, // (optional) default: true
                        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                        //tag: 'some_tag', // (optional) add tag to message
                        //group: "group", // (optional) add group to message
                        //ongoing: false, // (optional) set whether this is an "ongoing" notification

                        /* iOS only properties */
                        alertAction: 'slide to accept', // (optional) default: view
                        category: 'accept', // (optional) default: null
                        userInfo: `${notification.data.CLI}`, // (optional) default: null (object containing additional notification data)

                        /* iOS and Android properties */
                        title: 'IPCortex Phone', // (optional)
                        message: `Incoming Call from ${notification.data.CLI}`, // (required)
                        playSound: false,
                        actions: '["Accept", "Reject"]'
                    });
                    this.outstanding = true;
                    this.outstanstandingTimer = setTimeout(() => {
                        this.outstanding = false;
                        PushNotification.cancelLocalNotifications({ id: 1 });
                    }, 15000);
                }
                if (this.onMessage[notification.data.type] != null) {
                    console.log('invoking onMessage for ', notification.data.type);
                    this.onMessage[notification.data.type](notification.data);
                }
                this.dispatch(this.notificationAction);
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
            //popInitialNotification: false,

            requestPermissions: true
        });

    }

}

export default pushNotification;
