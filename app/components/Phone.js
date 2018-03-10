import React, { Component } from 'react';
import { ListView, Platform, StyleSheet, Text, ScrollView, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Swipeable from 'react-native-swipeout';



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

    swipebutton(type, name, onLeft, onRight) {
        const leftContent = '';



        return(
            <Swipeable>
                <Icon
                        color="white"
                        size={50}
                        style={styles[type+'Button']}
                        name={name}/><Text>hello</Text>
            </Swipeable>
        );

    }

    render() {
        var onPress = () => {};
        var name = 'phone';
        var type = 'up'
        var onRight, onLeft = () => {};

        switch(`${this.props.callState}`) {
            case 'up':
                type = "down";
                name = "phone-hangup";
                onPress = this.props.onHangup;
                break;
            case 'down':
                disabled = "up";
                name = "phone-outgoing";
                onPress = this.props.onDial;
                break;
            case 'ringing-in':
                type = "slider";
                name = 'phone-incoming';
                onRight = this.props.onAccept;
                onLeft = this.props.onHangup;
                break;
            case 'ringing-out':
                type = "down";
                name = 'phone-hangup';
                onPress = this.props.onHangup;
                break;
            default:
                type = "down";
                name = "phone-settings";
                break;
        }

        const rightButtons = [
            { component: <Icon
                    color="white"
                    size={50}
                    style={styles['downButton']}
                    name='phone-hangup'
                    onPress={onLeft}/> }
        ];
        const leftButtons = [
            { component: <Icon
                style={{width:50}}
                    color="white"
                    size={50}
                    style={styles['upButton']}
                    name='phone-incoming'
                    onPress={onRight}/> }
        ];
        if(type != 'slider')
            return(<Icon.Button
                style={{width:50}}
                    color="white"
                    size={50}
                    style={styles[type+'Button']}
                    name={name}
                    onPress={onPress}/>);
        else
            return(<Swipeable style={{width: 300}} buttonWidth={50} left={leftButtons} right={rightButtons}>
                <View style={styles.hsub}></View>
                <Icon style={{width:50}}
                        color="white"
                        size={50}
                        name="phone-incoming"
                        onPress={onLeft}/><Text>Call from fred</Text>

            </Swipeable>)



    }
}

class Phone extends Component {



    constructor(props) {
        super(props);
        this.state = { callState: 'ringing-in' }

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

    render() {
        return(<View style={styles.container}>
        <PhoneNumber title="Phone" icon="phone"/>
        <Text>Call State is {this.state.callState}</Text>
            <View style={styles.hsub}>
                        <View style={styles.button}>
                            <PhoneButton
                                 callState={this.state.callState}
                                onDial={() => {
                                    this.setState({callState: 'ringing-out'});

                                }}
                                onAccept={ () => {
                                    this.setState({callState: 'up'});
                                }}
                                onHangup={() => {
                                    this.setState({callState: 'down'});
                                }}
                            />
                        </View>
                    </View>
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
