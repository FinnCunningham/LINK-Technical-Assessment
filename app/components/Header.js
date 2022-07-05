/**
 * @file Custom header component that is positioned at the top of the app
 */

 import React, {useContext} from 'react';
 import { Appbar } from 'react-native-paper';
 import { useNavigation } from '@react-navigation/native';
 
 /**
  * Header component of the app
  * @param {String} page - Name of current page/screen of the app 
  * @returns {Component} - Returns a react-native-paper header component
  */
 const Header = ({page}) => {
     const navigation = useNavigation();
 
     /**
      * Function that go back a screen in the navigation stack
      */
     const goBacka = () => {
        navigation.goBack()
     };
     return(
         <Appbar.Header>
             { page != "Login" ? <Appbar.BackAction onPress={goBacka} /> : <></>}
             <Appbar.Content title="LINK Assessment" />
         </Appbar.Header>
     )
 }
 
 export default Header;