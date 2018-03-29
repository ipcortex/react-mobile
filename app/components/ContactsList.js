import React, {Component} from 'react';
// Will probably want SectionList eventually
import {
  Platform,
  StyleSheet,
  FlatList,
  View,
  Text,
  RefreshControl
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
    this.state = {refreshing: false};
    this.IPCortex = new IPCortexAPI();
    this.loadContacts = this.loadContacts.bind(this);
    this.renderIndividualContact = this.renderIndividualContact.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    if (props.isLoggedIn) {
      this.loadContacts();
    }
  }
  loadContacts() {
    return new Promise(resolve => {
      this.IPCortex.PBX.getAddressbook((contacts) => {
        this.props.addContacts(
          contacts.map(this.mapContact)
        );
        contacts.forEach(contact => {
          contact.addListener('update', contact => {
            this.props.updateContact(this.mapContact(contact));
          });
        });
        resolve();
      });
    });
  }
  onRefresh() {
    this.setState({refreshing: true});
    this.loadContacts().then(() => {
      this.setState({refreshing: false});
    });
  }
  mapContact(contact) {
    return {
      key: contact.key+'',
      name: contact.name,
      blf: contact.blf,
      state: contact.canCall ? 'online' : 'offline',
      number: contact.number
    };
  }
  componentWillReceiveProps(newProps) {
    // If we weren't logged in and now are
    if (newProps.isLoggedIn && !this.props.isLoggedIn) {
      this.loadContacts();
    }
  }
  renderIndividualContact({item}) {
    return (
      <Contact contact={item} dial={this.props.dial(item.number)}/>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          data={this.props.contacts}
          renderItem={this.renderIndividualContact}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
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
  updateContact: (contact) => dispatch({type: actions.UpdateContact, contact}),
  dial: (number) => () => dispatch({type: actions.Dial, number})
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList);

