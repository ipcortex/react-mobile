import React, {Component} from 'react';
// Will probably want SectionList eventually
import {
  Platform,
  StyleSheet,
  FlatList,
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import {IPCortexAPI} from '../lib/IPCortexAPI';
import { actions } from '../reducers';
import {styles, uiTheme} from '../config/styles.js';

class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.phoneIcons = ["phone-hangup", "phone", "phone-in-talk", "phone-incoming"];
    this.IPCortex = new IPCortexAPI();
    this.loadContacts = this.loadContacts.bind(this);
    this.renderIndividualContact = this.renderIndividualContact.bind(this);
    if (props.isLoggedIn) {
      this.loadContacts();
    }
  }
  loadContacts() {
    this.props.addContacts(
      this.IPCortex.PBX.contacts.map(contact => ({
        key: contact.cID+'',
        name: contact.name,
        state: contact.blf
      }))
    );
    this.IPCortex.PBX.contacts.forEach(contact => {
      contact.addListener('update', contact => {
        this.props.updateContact({
          key: contact.cID+'',
          name: contact.name,
          state: contact.blf
        });
      });
    });
  }
  componentWillReceiveProps(newProps) {
    // If we weren't logged in and now are
    if (newProps.isLoggedIn && !this.props.isLoggedIn) {
      this.loadContacts();
    }
  }
  renderIndividualContact({item}) {
    return (
      <View style={{flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'}}>
        <Text>{item.name}</Text>
        <Icon
          name={this.phoneIcons[item.state]}
          style={{
            backgroundColor: "#00aa00",
            color: 'white',
            borderRadius: 3,
            padding: 3,
            marginHorizontal: 10,
            marginVertical: 2
          }}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          data={this.props.contacts}
          renderItem={this.renderIndividualContact}
        />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  contacts: state.contacts
});
const mapDispatchToProps = dispatch => ({
  addContacts: (contacts) => dispatch({type: actions.AddContacts, contacts}),
  updateContact: (contact) => dispatch({type: actions.UpdateContact, contact})
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList);

