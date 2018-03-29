import React, {Component} from 'react';
// Will probably want SectionList eventually
import {
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const phoneIcons = ["phone-hangup", "phone", "phone-in-talk", "phone-incoming"];

export default function Contact({contact}) {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 25,
      paddingVertical: 3
    }}>
      <Text>{contact.name}</Text>
      <Icon
        name={phoneIcons[contact.state]}
        style={{
          backgroundColor: "#00aa00",
          color: 'white',
          borderRadius: 5,
          padding: 2
        }}
      />
    </View>
  );
};

