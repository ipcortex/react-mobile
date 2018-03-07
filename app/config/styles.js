import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
        flexDirection: 'column',
/*
    backgroundColor: '#F5FCFF',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da'
    */
  },
  hsub: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  hsubThin: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  vsub: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  vsubThin: {
    flex: 0.2,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  label: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  control: {
    flex: 3,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  fullcontrol: {
    flex: 5,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10
  },
  heading: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 10
  },
  h1: {
  fontWeight: 'bold',
  fontSize: 19,
  textAlign: 'center'
},
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
},


  domainInput: {  backgroundColor: "#ededed", borderWidth: 4, borderColor: "#ffffff" },
  domainInputOK: { backgroundColor: "#ededed", borderWidth: 4, borderColor: "green" },
  domainInputWarning: { backgroundColor: "#ededed", borderWidth: 4, borderColor: "yellow" },
  domainInputError: {  backgroundColor: "#ededed", borderWidth: 4, borderColor: "red" }

});


import { COLOR, ThemeProvider } from 'react-native-material-ui';


const uiTheme = {
    palette: {
        primaryColor: COLOR.green500,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};


export {
  styles, uiTheme, ThemeProvider
};
