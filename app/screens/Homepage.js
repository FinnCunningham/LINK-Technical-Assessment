import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, Button} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getProfile, getProfileImage, setNewImage } from '../controllers/Api';
import { bindActionCreators } from 'redux';
import { setPage } from '../controllers/ReduxAction';
import { launchImageLibrary } from 'react-native-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ChangePassword from '../components/ChangePassword';

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
    const [changePassword, setChangePassword] = useState(false);

    if(!token){
        navigation.navigate("login")
    }
    useEffect(()=>{
        getProfile(token, setProfile, name);
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
        setPage("Homepage");
    });

    if(profile.error){
        ToastAndroid.show(profile.error, ToastAndroid.SHORT)
    }

    return(
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <View style={{alignItems: "center", flex: 1}}>
                <View style={{alignItems: "center", backgroundColor: colors.surface, flex: 3, width: "100%"}}>
                    {profileImg ? 
                    <View style={{marginTop: 20}}>
                        <TouchableOpacity onPress={()=>{
                            openGallery(setPickerResponse);
                        }}>
                            <View style={{borderColor: "darkred", borderWidth: 1.5, borderRadius: 100, padding: 5}}>
                                <Image source={{uri: 'file://' + profileImg.path}} style={{width: 100, height: 100, borderRadius: 50}} 
                                resizeMode="stretch"/>
                            </View>
                            
                        </TouchableOpacity>
                    </View> : <></>}
                    {profile ? 
                        <View style={{alignItems: "center"}}>
                            <Paragraph style={{fontWeight: "bold", padding: 10, fontSize: 19}}>{profile.displayName}</Paragraph>
                            {/* <Paragraph style={{}}>@{profile.displayName}</Paragraph> */}
                            <Paragraph style={{padding: 5}}>{profile.emailAddress}</Paragraph>
                            <Paragraph style={{}}>Joined: {new Date(profile.joinDate).toDateString()}</Paragraph>
                        </View> : <></>}
                    
                </View>
                <View style={{flex: 3, borderTopEndRadius: 20, borderTopStartRadius: 20, width: "100%", marginTop: -20,
                 backgroundColor: colors.background, alignItems: "center", padding: 15}}>
                    {!changePassword ? 
                    <View style={{flex: 1, width: "100%", alignItems: "center"}}>
                    <Button mode="outlined" style={[style.profileButton, {borderColor: colors.primary}]} onPress={() => {navigation.navigate("contact")}}>Contact Details</Button>
                    <Button mode="outlined" style={[style.profileButton, {borderColor: colors.primary, marginTop: 20}]} onPress={() => {
                        setChangePassword(true);
                    }}>Change Password</Button></View> : <ChangePassword setChangePassword={setChangePassword} colors={colors}
                    token={token} name={name}/>}
                    
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
    },
    profileButton:{
        padding: 10,
        width: "60%",
        borderRadius: 10,
        borderWidth: 1,
    }
  })

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);