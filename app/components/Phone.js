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
} from './IPCortexAPI';



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



class PhoneButton extends Component {


    render() {


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
            default:
                buttons = [{
                    type: "down",
                    text: "Shouldnt happen",
                    name: "phone-settings"

                }]
        }



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

class Phone extends Component {



    constructor(props) {
        super(props);
        this.state = { callState: 'down', videoURL: null, dialNumber: '', videoURL: null };
        this.IPCortex = new IPCortexAPI();
        if(props.isLoggedIn){
            this.initAPI();
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

    initAPI() {
        if(this.IPCortex.PBX) {
            JsSIP = this.IPCortex.JsSIP;
            IPCortex = this.IPCortex;
            this.myPhone = this.IPCortex.PBX.owned[0];
            /* Assume the phone is a keevio phone and enable it for WebRTC */
            this.myPhone.enableRTC()
            .catch(err => {
                console.log(err)
            })
            /* Wait for new call events to arrive */
            this.myPhone.addListener('update', (device) => {
                /* If there are multiple calls, ignore all except the first */
                console.log('Got cb with ', device, device.calls);
                if(device.calls.length > 0) {
                    let Cstate = device.calls[0].state;
                    switch(Cstate){
                        case 'dead':
                            Cstate = 'down'
                        case 'down':
                        case 'up':
                        case 'ring':
                        case 'dial':
                            this.setState({callState: Cstate});
                            /* If the call is up and has media, attach it to the video tag */
                            if(device.calls[0].remoteMedia && device.calls[0].remoteMedia.length === 1)
                                this.setState({videoURL: device.calls[0].remoteMedia[0].toURL()});
                            break;
                        default:
                            thow `didn't expect call state ${Cstate}`;
                            break;
                    }


                }
                else
                    this.setState({callState: 'down'});
            });
        }
    }

    // Called by react when props are about to change
    componentWillReceiveProps(newProps, newState) {
        // If the API just initialised and we have a previous login token then give it a try
        if(newProps.isLoggedIn === true && this.props.isLoggedIn === false)
            initAPI();
    }

    render() {
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
                                        this.setState({callState: `up`});
                                    })
                                    .catch((err) => {
                                        this.setState({callState: `down`});
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
