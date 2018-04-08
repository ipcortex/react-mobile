import React, { Component } from 'react';
import {
	AppRegistry,
	Platform,
	StyleSheet,
	View,
	Text
} from 'react-native';

import ContactsList from '../components/ContactsList';

import { styles, uiTheme, ThemeProvider } from '../config/styles.js';

class ContactsScreen extends React.Component {
	static navigatorStyle = {
		navBarHideOnScroll: true,
		navBarBackgroundColor: '#ffffff', // This will be the TitleBars color when the react view is hidden and collapsed
		collapsingToolBarComponent: 'IPCMobile.ContactSearchHeader',
		navBarTranslucent: true, // Optional, sets a translucent dark background to the TitleBar. Useful when displaying bright colored header to emphasize the title and buttons in the TitleBar
		showTitleWhenExpended: true, // default: true. Show the screens title only when the toolbar is collapsed
		collapsingToolBarCollapsedColor: 'green', // optional. The TitleBar (navBar) color in collapsed state
		collapsingToolBarExpendedColor: '#ffffff' // optional. The TitleBar (navBar) color in expended state
	};
	render() {
		return (
			<ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
          <ContactsList />
        </View>
      </ThemeProvider>
		);
	}
}

export {
	ContactsScreen
};

AppRegistry.registerComponent('ContactsScreen', () => ContactsScreen);
