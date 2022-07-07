import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, Button} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getProfile, getProfileImage, getCountries, setNewImage } from '../controllers/Api';
import { bindActionCreators } from 'redux';
import { setPage } from '../controllers/ReduxAction';
import { launchImageLibrary } from 'react-native-image-picker';

const openGallery = (setPickerResponse) => {
    const options = {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
    };
    launchImageLibrary(options, setPickerResponse);
}

const Homepage = ({token, setPage}) => {
    const { colors } = useTheme();
    const [profile, setProfile] = useState({});
    const [profileImg, setProfileImg] = useState();
    const navigation = useNavigation();
    const [pickerResponse, setPickerResponse] = useState(null);

    if(!token){
        navigation.navigate("login")
    }
    useEffect(()=>{
        getProfile(token, setProfile);
        getProfileImage(setProfileImg);
        
    }, [])

    useEffect(()=>{
        if(pickerResponse){
            setNewImage(token, pickerResponse, setProfileImg)
            setPickerResponse("");
        }
    }, [pickerResponse])

    useFocusEffect(()=>{
        setPage("Homepage")

    });
    
    return(
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <View style={{alignItems: "center"}}>
                {profileImg ? 
                <View>
                    <Image source={{uri: 'file://' + profileImg}} style={{width: 100, height: 100, resizeMode: "contain", borderRadius: 10}}/>
                </View> : <></>}
                <Button onPress={()=>{
                    openGallery(setPickerResponse);
                }}>Change Profile Image</Button>
                {/* { pickerResponse ? <Image source={{uri: 'file://' + pickerResponse.assets[0].uri}} style={{width: 100, height: 100, resizeMode: "contain", borderRadius: 10}}/>
                : <></>} */}

                {profile ? 
                    <View>
                        <Paragraph style={{fontWeight: "bold", textAlign: "center"}}>{profile.firstName} {profile.lastName}</Paragraph>
                        <Paragraph style={{ textAlign: "center"}}>{profile.displayName}</Paragraph>
                        <Paragraph>{profile.emailAddress}</Paragraph>
                    </View> : <></>}
                <View style={{flexDirection: "row"}}>
                    <Button onPress={() => {navigation.navigate("contact")}}>Contact Details</Button>
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => {
    const { token } = state.reducer
    return { token }
  };

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setPage,
    }, dispatch)
);

  const style = StyleSheet.create({
    item:{
        width: 100
    }
  })

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);