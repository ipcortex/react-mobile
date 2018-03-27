/**
 * Phone Component
 * @module Phone
 */

import React, { Component } from 'react';
import { ListView, Platform, StyleSheet, Text, ScrollView, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import {
    IPCortexAPI,
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia
} from '../lib/IPCortexAPI';
import InCallManager from 'react-native-incall-manager';



import PhoneNumber from '../components/PhoneNumber';

import { styles } from '../config/styles.js';
import { actions } from '../reducers';

var JsSIP, IPCortex;

Object.assign(styles, {
    upButton: {
        backgroundColor: 'green', //	Background color of the button.	#007AFF
        borderRadius: 25 //	Border radius of the button, set to 0 to disable.	5
    },
    downButton: {
        backgroundColor: 'red', //	Background color of the button.	#007AFF
        borderRadius: 25 //	Border radius of the button, set to 0 to disable.	5
    }
})


/**
 * Renders one or more buttons based on the callState prop
 *
 * @extends Component
 */
class PhoneButton extends Component {


    render() {

        // Build an array of which buttons we need for the current call state.
        // This is all a bit quick and hacky as it needs replacing with a proper
        // gesture based UI but we are only a proof of concept for now
        // TODO: proper mobile UI rather than button stab for call control
        switch(`${this.props.callState}`) {
            case 'up':
                buttons = [{
                    type: "down",
                    name: "phone-hangup",
                    text: 'Hangup',
                    onPress: this.props.onHangup
                }]
                break;
            case 'down':
                buttons = [this.props.haveNumber && {
                    type: "up",
                    name: "phone-outgoing",
                    text: 'Call',
                    onPress: this.props.onDial

                }]
                break;
            case 'ring':
                buttons = [{
                        type: "up",
                        name: 'phone-incoming',
                        text: 'Answer',
                        onPress: this.props.onAccept

                    },
                    {
                        type: "down",
                        name: 'phone-hangup',
                        text: 'Reject',
                        onPress: this.props.onHangup

                    }
                ];
                break;
            case 'dial':
                buttons = [{
                    type: "down",
                    name: 'phone-hangup',
                    text: 'Cancel',
                    onPress: this.props.onHangup

                }]
                break;
            // We shouldn't ever see anything else, but give a public indication
            // of breakage if we do.
            default:
                buttons = [{
                    type: "down",
                    text: "Shouldnt happen",
                    name: "phone-settings"

                }]
        }

        // Now output the rendered buttons
        return(<View style={styles.hspaced}>
                {buttons.map((button, index) => (<Icon.Button
                    key={index}
                    color="white"
                    backgroundColor = "transparent"
                    size={50}
                    style={styles[button.type+'Button']}
                    name={button.name}
                    onPress={button.onPress}>{button.text}</Icon.Button>
                    ))}
                </View>)





    }
}

/**
 * Implements a softphone
 *
 * @extends Component
 * @alias module:Phone
 */
class Phone extends Component {



    constructor(props) {
        super(props);
        this.state = { callState: 'down', dialNumber: '', videoURL: null };
        this.IPCortex = new IPCortexAPI();
        if(props.isLoggedIn) {
            this.initAPI();
        }

        if(props.testing) {
            // Test rig that just does some sensible asnyc state transitions
            // used in development and manual testing
            setInterval(() => {
                let transitions = {
                    up: 'down',
                    down: 'ringing-in',
                    'ringing-in': 'down',
                    'ringing-out': 'up'
                };
                this.setState({ callState: transitions[this.state.callState] });
            }, 8000);
        }
    }

    initAPI() {
        // Called when we know we are logged in so should have an IPCortex API
        // with an owned softphone at this point.
        if(this.IPCortex.PBX && this.IPCortex.PBX.owned && this.IPCortex.PBX.owned[0]) {
            // TODO: More error checking (plus just how many places do we stash
            // IPCortex and JsSIP objects??)
            JsSIP = this.IPCortex.JsSIP;
            IPCortex = this.IPCortex;
            this.myPhone = this.IPCortex.PBX.owned[0];
            var { inRinging, inRingback, haveCall } = false;
            /* Assume the phone is a keevio phone and enable it for WebRTC */
            this.myPhone.enableRTC()
                .catch(err => {
                    console.log(err)
                })
            /* Listener which wait for new call events to arrive */
            this.myPhone.addListener('update', (device) => {
                /* If there are multiple calls, ignore all except the first */
                console.log('Got cb with ', device, device.calls);
                let Cstate = 'down';
                if(device.calls.length > 0)
                    Cstate = device.calls[0].state;
                console.log(Cstate);

                if(inRingback && Cstate != 'dial') {
                    InCallManager.stopRingback();
                    inRingback = false;
                }
                if(inRinging && Cstate != 'ring') {
                    InCallManager.stopRingtone();
                    inRinging = false;
                }
                switch(Cstate) {
                    case 'dead':
                        Cstate = 'down';
                    case 'down':
                        InCallManager.stop();
                        this.setState({ callState: Cstate });
                        break;
                    case 'up':
                        InCallManager.start({ media: 'audio' });
                        this.setState({ callState: Cstate });
                        /* If the call is up and has media, attach it to the video tag */
                        if(device.calls[0].remoteMedia && device.calls[0].remoteMedia.length > 0)
                            this.setState({ videoURL: device.calls[0].remoteMedia[0].toURL() });
                        break;
                    case 'ring':
                        InCallManager.startRingtone('_DEFAULT_', true, 'playback');
                        inRinging = true;
                        this.setState({ callState: Cstate });
                    case 'dial':
                        // Use native platform ringback tone
                        // TODO early media???
                        InCallManager.start({ media: 'audio', ringback: '_BUNDLE_' });
                        this.setState({ callState: Cstate });
                        inRingback = true;
                        break;
                    default:
                        thow `didn't expect call state ${Cstate}`;
                        break;
                }
            });
        } else {
            //throw 'IPCortex API not loaded when trying to start Phone';
        }
    }

    // Called by react when props are about to change
    componentWillReceiveProps(newProps, newState) {
        // If we weren't logged in, but now we are then initialise a phone
        if(newProps.isLoggedIn === true && this.props.isLoggedIn === false)
            initAPI();
    }

    render() {
        //TODO: Styling!!!
        return(<View style={styles.container}>
        <PhoneNumber title="Phone" icon="phone" onChange={(number) => {this.setState({dialNumber: number})}}/>
        <RTCView streamURL={this.state.videoURL}/>
        <Text>Call State is {this.state.callState}</Text>
                            <PhoneButton
                                haveNumber={this.state.dialNumber && this.state.dialNumber.length}
                                callState={this.state.callState}
                                onDial={() => {
                                    this.myPhone.dial(this.state.dialNumber)
                                    .then((status) => {
                                        InCallManager.start({media: 'audio'});
                                        this.setState({callState: `up`});
                                    })
                                    .catch((err) => {
                                        console.log('dial fail: ', err);
                                    })
                                }}
                                onAccept={ () => {
                                    this.myPhone.calls[0].talk(() =>
                                    this.setState({callState: 'up'}));
                                }}
                                onHangup={() => {
                                    this.myPhone.calls[0].hangup(() =>
                                    this.setState({callState: 'down'}));
                                }}
                            />
    <RTCView streamURL={this.state.videoURL}/>
    </View>)
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    logout: () => dispatch(actions.Logout),
    loginScreen: () =>
        dispatch(NavigationActions.navigate({ routeName: 'Login' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Phone);
