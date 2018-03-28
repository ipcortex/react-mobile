import React, {Component} from 'react';
// Will probably want SectionList eventually
import {
  Platform,
  StyleSheet,
  FlatList,
  View,
  Text
} from 'react-native';
import {connect} from 'react-redux';

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
        name: contact.name
      }))
    );
  }
  componentWillReceiveProps(newProps) {
    // If we weren't logged in and now are
    if (newProps.isLoggedIn && !this.props.isLoggedIn) {
      this.loadContacts();
    }
  }
  renderIndividualContact({item}) {
    return (
      <Text>{item.name}</Text>
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
  addContacts: (contacts) => dispatch({type: actions.AddContacts.type, contacts})
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList);

