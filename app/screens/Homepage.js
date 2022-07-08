import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, Button} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getProfile, getProfileImage, setNewImage } from '../controllers/Api';
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

const Homepage = ({token, setPage, name}) => {
    const { colors } = useTheme();
    const [profile, setProfile] = useState({});
    const [profileImg, setProfileImg] = useState();
    const navigation = useNavigation();
    const [pickerResponse, setPickerResponse] = useState(null);

    if(!token){
        navigation.navigate("login")
    }
    useEffect(()=>{
        getProfile(token, setProfile, name); //name
        getProfileImage(setProfileImg);
        
    }, [])

    useEffect(()=>{
        // Check if the response exists and if they canceled before submitting to avoid errors.
        console.log(pickerResponse)
        if(pickerResponse && !pickerResponse["didCancel"] && !pickerResponse.error){
            setNewImage(token, pickerResponse, setProfileImg, name)
            setPickerResponse("");
        }
    }, [pickerResponse])

    useEffect(()=>{
        console.log(profileImg)
        if(profileImg && profileImg.error){
            ToastAndroid.show(profileImg.error, ToastAndroid.SHORT)
        }
    }, [profileImg])

    useFocusEffect(()=>{
        setPage("Homepage")

    });

    if(profile.error){
        ToastAndroid.show(profile.error, ToastAndroid.SHORT)
    }

    return(
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <View style={{alignItems: "center"}}>
                {profileImg ? 
                <View>
                    <Image source={{uri: 'file://' + profileImg.path}} style={{width: 100, height: 100, resizeMode: "contain", borderRadius: 10}}/>
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
    const { token, name } = state.reducer
    return { token, name }
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