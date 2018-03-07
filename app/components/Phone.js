import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Button, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import PhoneNumber from '../components/PhoneNumber';

import { styles } from '../config/styles.js';
import { actions } from '../reducers';

class Phone extends Component {

    constructor(props) {
      super(props);
    }

    render(){
        return(<View>
        <PhoneNumber title="Number"/>
    </View>

        )
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
