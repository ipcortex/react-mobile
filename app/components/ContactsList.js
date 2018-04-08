import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
	Button,
	Dimensions,
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

import Contact from './Contact';

import { IPCortexAPI } from '../lib/IPCortexAPI';
import { actions } from '../reducers';
import { styles, uiTheme } from '../config/styles.js';


class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};

	}

	render() {
		const width = Dimensions.get(`window`)
			.width;
		console.log('Searchbar', this.props, { width });
		return (<View style={[{ width }, styles.header_container]}>
                <Icon name="search" style={styles.header_button} size={30}/>
                <TextInput
                    style={[styles.header_text, {width: width-112}]}
                    textAlign={'center'}
                    placeholder={'Search name'}
                    onChangeText = {(text) => {
                        this.setState({search: text})
                        dispatch({ type: actions.constrainContacts, name: text })
                    }}/>
                <TouchableHighlight onPress={() => {console.log('cancel press')}}>
                    <Icon name="cancel" style={styles.header_button} size={30}/>
                    </TouchableHighlight>
                </View>);
	}
};

Navigation.registerComponent('IPCMobile.ContactSearchHeader', () => SearchBar);

class ContactsList extends Component {
	constructor(props) {
		super(props);
		this.state = { refreshing: false };
		this.IPCortex = new IPCortexAPI();
		this.loadContacts = this.loadContacts.bind(this);
		this.updateContacts = this.updateContacts.bind(this);
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
			key: contact.key + '',
			name: contact.name,
			blf: contact.blf,
			state: contact.canCall ? 'online' : 'offline',
			number: contact.number
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
	componentWillReceiveProps(newProps) {
		// If we weren't logged in and now are
		if (newProps.isLoggedIn && !this.props.isLoggedIn) {
			this.loadContacts();
		}
	}
	renderSectionHeader({ section }) {
		return (<Text>{section.title}</Text>);
	}
	renderIndividualContact({ item }) {
		return (
			<Contact contact={item} dial={this.props.dial(item.number)}/>
		);
	}
	render() {
		return (
			<SectionList
          sections={this.alphabetise(this.props.contacts)}
          renderItem={this.renderIndividualContact}
          renderSectionHeader={this.renderSectionHeader}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
        />
		);
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
	dial: (number) => () => dispatch({ type: actions.Dial, number })
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList);
