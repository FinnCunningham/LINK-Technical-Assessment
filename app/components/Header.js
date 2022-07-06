/**
 * @file Custom header component that is positioned at the top of the app
 */

 import React from 'react';
 import { Appbar } from 'react-native-paper';
 import { useNavigation } from '@react-navigation/native';
 import { connect } from 'react-redux';
 
 /**
  * Header component of the app
  * @param {String} page - Name of current page/screen of the app 
  * @returns {Component} - Returns a react-native-paper header component
  */
 const Header = ({page}) => {
     const navigation = useNavigation();
    console.log(page)
     /**
      * Function that go back a screen in the navigation stack
      */
     const goBacka = () => {
        navigation.goBack()
     };
     return(
         <Appbar.Header>
             { (page && (page != "Login" && page !="Homepage"))  ? <Appbar.BackAction onPress={goBacka} /> : <></>}
             <Appbar.Content title="LINK Assessment" />
         </Appbar.Header>
     )
 }
 const mapStateToProps = (state) => {
    const { page } = state.reducer
    console.log(state.reducer)
    console.log("===============REDUCER===============")
    console.log(page)

    return { page }
  };
 export default connect(mapStateToProps)(Header);