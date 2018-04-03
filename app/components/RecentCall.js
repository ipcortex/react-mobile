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
			alignItems: 'center',
			paddingHorizontal: 25,
			paddingVertical: 3
		}}>
			<View>
				<Text style={{fontSize: 20}}>{call.remoteName}</Text>
				<Text style={{color: '#bbb'}}>{call.remoteNumber}</Text>
			</View>
			<Text>{formatDate(call.stamp)}</Text>
		</View>
	);
}

function formatDate(date) {
	return moment(date).fromNow(true);
}

