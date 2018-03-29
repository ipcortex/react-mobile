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

const phoneIcons = ["phone-hangup", "phone", "phone-in-talk", "phone-incoming"];
const iconColors = {
  "online": "#00bb00",
  "away": "#e09131",
  "dnd": "#e09131"
};

export default function Contact({contact, dial}) {
  return (
    <TouchableHighlight onPress={dial}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 25,
          paddingVertical: 3
        }}>
        <Text>{contact.name}</Text>
        <Icon
          name={phoneIcons[contact.blf]}
          style={{
            backgroundColor: iconColors[contact.state] || "#d1312b",
            color: 'white',
            borderRadius: 5,
            padding: 2
          }}
        />
      </View>
    </TouchableHighlight>
  );
};

