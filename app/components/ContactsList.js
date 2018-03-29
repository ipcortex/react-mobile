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

import Contact from './Contact';

import {IPCortexAPI} from '../lib/IPCortexAPI';
import { actions } from '../reducers';
import {styles, uiTheme} from '../config/styles.js';

class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.IPCortex = new IPCortexAPI();
    this.loadContacts = this.loadContacts.bind(this);
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
      <Contact contact={item} />
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

