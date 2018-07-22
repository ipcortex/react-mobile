import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NativeContacts from 'react-native-contacts';
import { Dialog, DialogDefaultActions, Container } from 'react-native-material-ui';

import {
    Button,
    Dimensions,
    FlatList,
    Modal,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    TouchableHighlight,
    SectionList,
    View,
    Text,
    TextInput,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';

import { Contact, Number } from './Contact';

import { IPCortexAPI } from '../lib/IPCortexAPI';
import { actions } from '../reducers';
import { styles, uiTheme } from '../config/styles.js';

/**
 * Simple SearchBar for us in mobile app header
 *
 * @extends Component
 */
class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };

    }

    render() {
        const width = Dimensions.get(`window`)
            .width;
        //console.log('Searchbar', this.props, { width });
        return (
            <View style={[{ width }, styles.header_container]}>
            <TextInput
              ref={(ref) => {this.textInput = ref}}
              value={this.state.value}
              style={[styles.header_text, {width: width-76}]}
              textAlign={'center'}
              inlineImageLeft='search_icon'
              placeholder={'Search'}
              onChangeText = {(text) => {
                this.props.FilterContacts(text);
              }}/>
              <TouchableHighlight onPress={() => {
                  console.log('cancel press');
                  if(this.textInput)
                  this.textInput.clear();
                  this.props.FilterContacts('');
                }}>
                <Icon
                  name="cancel"
                  style={styles.header_button}
                  size={30}/>
              </TouchableHighlight>
            </View>
        );
    }
};

const mapSbStateToProps = state => ({
    contacts: state.contacts
});
const mapSbDispatchToProps = dispatch => ({
    FilterContacts: (name) => dispatch({ type: actions.FilterContacts, name }),
});

const ContactSearchHeader = connect(mapSbStateToProps, mapSbDispatchToProps)(SearchBar);

export { ContactSearchHeader };


class ContactsList extends Component {
    constructor(props) {
        super(props);
        this.state = { refreshing: false, modalVisible: false };
        this.IPCortex = new IPCortexAPI();
        this.loadContacts = this.loadContacts.bind(this);
        this.updateContacts = this.updateContacts.bind(this);
        this.renderIndividualContact = this.renderIndividualContact.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    async requestPermission() {
        console.log('requestingPermission');
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                    'title': 'IPCMobile',
                    'message': 'We want to access your contacts so that ' +
                        'they can be dialed directly from the app.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.canReadNativeContacts = true;
            } else {
                this.canReadNativeContacts = false;
            }
            return this.canReadNativeContacts;
        } catch (err) {
            console.warn(err)
        }
    }

    async loadContacts() {
        this.IPCortex.PBX.getAddressbook((contacts) => {
            this.props.addContacts(
                contacts.map(this.mapContact)
            );
            contacts.forEach(contact => {
                contact.addListener('update', contact => {
                    this.props.updateContact(this.mapContact(contact));
                });
            });
        });
        if (!this.canReadNativeContacts) {
            setTimeout(async () => {
                if (await this.requestPermission()) this.getNativeContacts();
            }, 5000);
        } else {
            this.getNativeContacts();
        }
    }


    async getNativeContacts() {
        NativeContacts.getAll((err, nativeContacts) => {
            console.log('getAll', err, Object.keys(nativeContacts));
            this.props.addContacts(
                nativeContacts
                .map(this.mapNativeContact)
                .filter(c => (c.phone && c.phone.length))
            );
        });
    }

    updateContacts() {
        return new Promise(resolve => {
            this.IPCortex.PBX.getAddressbook((added, removed) => {
                added.forEach(contact =>
                    this.props.updateContact(this.mapContact(contact))
                );
                removed.forEach(key =>
                    this.props.deleteContact(key)
                );
                resolve();
            });
        });
    }
    onRefresh() {
        this.setState({ refreshing: true });
        this.updateContacts()
            .then(() => {
                this.setState({ refreshing: false });
            });
    }
    mapContact(contact) {
        return {
            key: contact.key + contact.name,
            name: contact.name,
            blf: contact.blf,
            state: contact.canCall ? 'online' : 'offline',
            phone: [{ label: 'local', key: 'local', number: contact.number }]
        };
    }
    mapNativeContact(contact) {
        //TODO lot smarter, interstitial, merge etc
        return {
            key: contact.recordID + contact.name,
            name: `${contact.givenName} ${contact.familyName}`,
            blf: 4,
            state: 'online',
            phone: contact.phoneNumbers.map(n => ({ ...n, key: n.label }))
        };
    }
    alphabetise(contacts) {
        return contacts.reduce((sections, contact) => {
            const contactFirstLetter = ((character) => isNaN(character) ? character.toUpperCase() : '123')(contact.name.substr(0, 1));
            const sectionIndex = sections.findIndex((section) => section.title == contactFirstLetter);
            if (sectionIndex >= 0) sections[sectionIndex].data.push(contact);
            else sections.push({ title: contactFirstLetter, data: [contact] });
            return sections;
        }, []);
    }
    componentDidMount() {
        if (this.props.isLoggedIn) {
            this.loadContacts();
        }
    }
    renderSectionHeader({ section }) {
        return (<Text style={styles.contact_sectionhead}>{section.title}</Text>);
    }
    renderIndividualContact({ item }) {
        return (
            <Contact contact={item} dial={() => this.dial(item)}/>
        );
    }
    renderNumber(number) {
        console.log('called with: ', number);
        return (
            <Number number={number} contact={this.state.currentContact} dial={() => {
                this.setModalVisible(false);
                this.props.dial(number.number);
              }}/>
        );
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    dial(item) {
        console.log('dial called to dial on ', item, item.phone[0].number, this.props.dial);
        this.setState({ currentContact: item });
        this.setModalVisible(true);
        //this.props.dial(item.phone[0].number);
    }
    render() {
        console.log('called to re-render');
        return (<View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>
            <View style="styles.container">
              <Dialog.Title>
                <Text>
                  Call {this.state.currentContact && this.state.currentContact.name}
                </Text>
              </Dialog.Title>
              <Dialog.Content>
                  <FlatList
                    data={this.state.currentContact && this.state.currentContact.phone}
                    renderItem={({item}) => this.renderNumber(item)}
                    />
              </Dialog.Content>
              <Dialog.Actions>
                <DialogDefaultActions
                  actions={['cancel', 'ok']}
                  /**
                  * this will disable the button for "ok"
                  */
                  options={{ ok: { disabled: true } }}
                  onActionPress={() => {this.setModalVisible(false);}}
                  />
              </Dialog.Actions>
            </View>
          </Modal>
          <SectionList
            sections={this.alphabetise(this.props.contacts.filter((contact) => contact.hide?null:contact))}
            renderItem={this.renderIndividualContact}
            renderSectionHeader={this.renderSectionHeader}
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            />
        </View>);
    }
};

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
    contacts: state.contacts
});
const mapDispatchToProps = dispatch => ({
    addContacts: (contacts) => dispatch({ type: actions.AddContacts, contacts }),
    updateContact: (contact) => dispatch({ type: actions.UpdateContact, contact }),
    deleteContact: (key) => dispatch({ type: actions.DeleteContact, key }),
    dial: (number) => dispatch({ type: actions.Dial, number })
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList);
