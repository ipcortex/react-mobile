import React, {Component} from 'react';

import {
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';
import {connect} from 'react-redux';

import RecentCall from './RecentCall';

import {IPCortexAPI} from '../lib/IPCortexAPI';
import { actions } from '../reducers';
import {styles, uiTheme} from '../config/styles.js';

class RecentsList extends Component {
	constructor(props) {
		super(props);
		this.IPCortex = new IPCortexAPI();
		if (props.isLoggedIn) {
			this.registerHistory();
		}
	}
	componentWillReceiveProps(newProps) {
		if (newProps.isLoggedIn && !this.props.isLoggedIn) {
			this.registerHistory();
		}
	}
	registerHistory() {
		// Register the handler for history updates
		this.IPCortex.PBX.enableHistory(history => {
			this.props.addCall(history);
		});
		// enable history on the first device (might want to do a different device)
		this.IPCortex.PBX.owned[0].history(true);
	}
	render() {
		return (
			<View style={styles.container}>
				{this.props.recentCalls.map(call => <RecentCall key={call.callID} call={call} />)}
			</View>
		);
	}
};

const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn,
	recentCalls: state.recents
});
const mapDispatchToProps = dispatch => ({
	addCall: (call) => dispatch({type: actions.AddRecentCall, call})
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentsList);

