import React, {Component} from 'react';
// Will probably want SectionList eventually
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles, uiTheme } from '../config/styles.js';

const phoneIcons = ["phone-hangup", "phone", "phone-in-talk", "phone-incoming", "cellphone-android"];
const iconColors = {
  "online": "#00bb00",
  "away": "#e09131",
  "dnd": "#e09131"
};

function Contact({contact, dial}) {
  return (
    <TouchableHighlight onPress={dial}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 3
      }}>
        <Text style={styles.contact_text}>{contact.name}</Text>
        <Icon
          name={phoneIcons[contact.blf]}
          style={{
            color: iconColors[contact.state] || "#d1312b",
            padding: 6
          }}
          size={32}
        />
      </View>
    </TouchableHighlight>
  );
};

function Number({number, contact, dial}) {
  return (
    <TouchableHighlight onPress={dial}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 3
      }}>
        <Text style={styles.contact_text}>{number.label}</Text>
        <Text style={styles.contact_text}>{number.number}</Text>
        <Icon
          name={phoneIcons[contact.blf]}
          style={{
            color: iconColors[contact.state] || "#d1312b",
            padding: 6
          }}
          size={32}
        />
      </View>
    </TouchableHighlight>
  );
};

export {Contact, Number };
