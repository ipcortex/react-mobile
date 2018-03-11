import React, { Component } from 'react';
import { ListView, Platform, StyleSheet, Text, ScrollView, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import {
    IPCortexAPI,
    IPCortex,
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia
} from './IPCortexAPI';


import PhoneNumber from '../components/PhoneNumber';

import { styles } from '../config/styles.js';
import { actions } from '../reducers';

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



class PhoneButton extends Component {


    render() {


        switch(`${this.props.callState}`) {
            case 'up':
                buttons = [this.props.haveNumber && {
                    type: "down",
                    name: "phone-hangup",
                    text: 'Hangup',
                    onPress: this.props.onHangup
                }]
                break;
            case 'down':
                buttons = [{
                    type: "up",
                    name: "phone-outgoing",
                    text: 'Call',
                    onPress: this.props.onDial

                }]
                break;
            case 'ringing-in':
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
            case 'ringing-out':
                buttons = [{
                    type: "down",
                    name: 'phone-hangup',
                    text: 'Cancel',
                    onPress: this.props.onHangup

                }]
                break;
            default:
                buttons = [{
                    type: "down",
                    text: "Shouldnt happen",
                    name: "phone-settings"

                }]
        }



        return(<View style={styles.hspaced}>
                {buttons.map((button) => (<Icon.Button
                    key={button.type}
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

class Phone extends Component {



    constructor(props) {
        super(props);
        this.state = { callState: 'down', videoURL: null, dialNumber: '' };

        if(IPCortex.PBX) {
            this.myPhone = IPCortex.PBX.owned[0];
            /* Assume the phone is a keevio phone and enable it for WebRTC */
            this.myPhone.enableRTC();
            /* Wait for new call events to arrive */
            this.myPhone.addListener('update', function(device) {
                /* If there are multiple calls, ignore all except the first */
                if(device.calls.length > 0) {

                    /* If the call is up and has media, attach it to the video tag */
                    if(device.calls[0].remoteMedia && device.calls[0].state !== 'dead')
                        attachMediaStream(videoTag, device.calls[0].remoteMedia[0]);
                }
            });
        }
        /*
                setInterval(() => {
                    let transitions = {
                        up: 'down',
                        down: 'ringing-in',
                        'ringing-in': 'down',
                        'ringing-out': 'up'
                    };
                    this.setState({ callState: transitions[this.state.callState] });
                }, 8000);
        */
    }

    render() {
        return(<View style={styles.container}>

        <PhoneNumber title="Phone" icon="phone" onChange={(number) => {this.setState({dialNumber: number})}}/>
        <Text>Call State is {this.state.callState}</Text>

                            <PhoneButton
                                haveNumber={this.state.dialNumber && this.state.dialNumber.length}
                                callState={this.state.callState}
                                onDial={() => {
                                    this.myPhone.dial()
                                    this.setState({callState: 'ringing-out'});

                                }}
                                onAccept={ () => {
                                    this.setState({callState: 'up'});
                                }}
                                onHangup={() => {
                                    this.setState({callState: 'down'});
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
