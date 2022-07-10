/**
 * @file Custom header component that is positioned at the top of the app
 */

 import React from 'react';
 import { Appbar, IconButton } from 'react-native-paper';
 import { useNavigation } from '@react-navigation/native';
 import { connect } from 'react-redux';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
            { (page && (page != "Login" && page !="Homepage"))  ? <Appbar.BackAction onPress={goBacka} /> : <>{page == "Homepage" && page != "Login" ?<IconButton 
            style={{}}
            icon={() => <Icon name="logout" size={25} color={"#fff"}/>}
            onPress={()=> {
                goBacka();
            }}/> : <></>}</>}
            <Appbar.Content title="LINK Assessment" />
        </Appbar.Header>
    )
 }
 const mapStateToProps = (state) => {
    const { page } = state.reducer
    return { page }
  };
 export default connect(mapStateToProps)(Header);