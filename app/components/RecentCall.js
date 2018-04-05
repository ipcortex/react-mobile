import React, {Component} from 'react';
// Will probably want SectionList eventually
import {
  Platform,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import moment from 'moment';

const phoneIcons = {
	'caller': 'call-made',
	'callee': 'call-received',
	'missed': 'call-missed',
	'noanswer': 'call-made'
};

export default function RecentCall({call, dial}) {
	return (
        <TouchableHighlight onPress={dial}>
		<View style={{
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			paddingHorizontal: 25,
			paddingVertical: 3
		}}>
		<View style={{flexDirection: 'row'}}>
				<Icon
					name={phoneIcons[call.party]}
					style={{
						color: '#ddd'
					}}
					size={22}
				/>
				<View style={{paddingHorizontal: 25}}>
					<Text style={{fontSize: 20}}>{call.remoteName}</Text>
					<Text style={{color: '#bbb'}}>{call.remoteNumber}</Text>
				</View>
			</View>
			<Text>{formatDate(call.stamp)}</Text>
		</View>
        </TouchableHighlight>
	);
}

function formatDate(date) {
	return moment(date).fromNow(true);
}
