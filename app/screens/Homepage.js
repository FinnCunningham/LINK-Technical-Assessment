import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, Button} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getProfile, getProfileImage, getCountries } from '../controllers/Api';

const Item = ({ dialCode, flagCode, isoCode, name }) => (
    <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}}>
        <Paragraph style={style.item}>{dialCode}</Paragraph>
        <Paragraph style={style.item}>{flagCode}</Paragraph>
        <Paragraph style={style.item}>{isoCode}</Paragraph>
        <Paragraph style={style.item}>{name}</Paragraph>
    </View>
  );

const Homepage = ({token}) => {
    const { colors } = useTheme();
    const [profile, setProfile] = useState({});
    const [profileImg, setProfileImg] = useState();
    // const [countries, setCountries] = useState();
    console.log(token)
    const navigation = useNavigation();
    if(!token){
        navigation.navigate("login")
    }
    useEffect(()=>{
        getProfile(token, setProfile);
        getProfileImage(setProfileImg);
        
    }, [])
    useEffect(()=>{
        console.log(profile)
    }, [profile])

    // const renderItem = ({ item }) => (
    //     <Item name={item.name} dialCode={item.dialCode} flagCode={item.flagCode} isoCode={item.isoCode}/>
    // );
    
    return(
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <Paragraph>Home Page</Paragraph>
            <View style={{alignItems: "center"}}>
                {profileImg ? 
                <View>
                    <Image source={{uri: 'file://' + profileImg}} style={{width: 100, height: 100, resizeMode: "contain"}}/>
                </View> : <></>}
                {profile ? 
                    <View>
                        <Paragraph>{profile.displayName}</Paragraph>
                        <Paragraph>{profile.emailAddress}</Paragraph>
                        <Paragraph>{profile.firstName} {profile.lastName}</Paragraph>
                    </View> : <></>}
                <View style={{flexDirection: "row"}}>
                    <Button onPress={() => {navigation.navigate("contact")}}>Contact Details</Button>
                    {/* <Button onPress={()=>{getCountries(setCountries);}}>View Countries</Button> */}
                </View>
                {/* {countries ? <FlatList
                    data={countries}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                /> : <></>} */}
                
            </View>
        </View>
    )
}

const mapStateToProps = (state) => {
    const { token } = state.reducer
    return { token }
  };

  const style = StyleSheet.create({
    item:{
        width: 100
    }
  })

export default connect(mapStateToProps)(Homepage);