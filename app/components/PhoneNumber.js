import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    Picker,
    Switch,
    View
} from 'react-native';
import { Button, Icon } from 'react-native-material-ui';

import { styles, uiTheme } from '../config/styles.js';


export default class PhoneNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: ''
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.number != this.state.number && typeof this.props.onChange === 'function')
            this.props.onChange(nextState.number);
    }


    render() {
        return(
            <View style={styles.vsub}>
          <View style={styles.hsub}>
        { this.props.icon  && <Icon name={this.props.icon}/>}
        { this.props.title && <Text style={styles.h1}>{this.props.title}</Text>}
    </View>
     <View style={styles.fullcontrol}>
        <TextInput
        textAlign={'center'}
        placeholder={'number'}
        onChangeText = {(text) => this.setState({number: text})}
        value={this.state.number}
        keyboardType="phone-pad"/>
      </View>
    </View>);
    }
}
