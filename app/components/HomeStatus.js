import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Button, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import { styles } from '../config/styles.js';
import { actions } from '../reducers';

class HomeStatus extends Component {

    constructor(props) {
      super(props);
    }

    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    render() {
        if(!this.props.isLoggedIn)
            return(
                <View>
        <Text>Please log in</Text>
        <Button
            title={'Open Login Screen'}
            onPress={this.props.loginScreen}
        />
        </View>)
        else
            return(<View>
        <Button onPress={() => this.props.dispatch( actions.Forward )} title="Set forwards"/>
          <Button onPress={() => this.props.dispatch( actions.NightMode )} title="Manage Nightmodes"/>
      </View>);

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

export default connect(mapStateToProps, mapDispatchToProps)(HomeStatus);
