import React, {Component} from 'react';
// Will probably want SectionList eventually
import {
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';

import moment from 'moment';

export default function RecentCall({call}) {
	return (
		<View style={{
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		}}>
			<Text>{call.name+' - '+call.number}</Text>
			<Text>{formatDate(call.stamp)}</Text>
		</View>
	);
}

function formatDate(date) {
	return moment(date).fromNow(true);
}

