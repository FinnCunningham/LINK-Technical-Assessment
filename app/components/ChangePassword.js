import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, Button, Paragraph, IconButton } from 'react-native-paper';
import { changePasswordValue } from '../controllers/Api';
import Icon from 'react-native-vector-icons/FontAwesome5';

const changePassword = ({setChangePassword, colors, token, name}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [response, setResponse] = useState(null);

    useEffect(()=>{
        // Check if the response exists and if they canceled before submitting to avoid errors.
        if(response && !response.error){
            setChangePassword(false);
            ToastAndroid.show("The password has been changed!", ToastAndroid.SHORT)
        }else if(response && response.error){
            ToastAndroid.show(response.error, ToastAndroid.SHORT)

        }
    }, [response])
    return(
        <View style={{flex: 1, width: "100%"}}>
            <IconButton 
            style={{position: "absolute", left: 0}}
            icon={() => <Icon name="arrow-left" size={25} color={colors.text} />}
            onPress={()=> {setChangePassword(false);}}></IconButton>
            <View style={{flex: 1, alignItems: "center"}}>
                <View style={{flex: 1}}>
                    <Paragraph>Change Password</Paragraph>
                </View>
                <View style={{flex: 4}}>
                    <TextInput placeholder='Old Password' secureTextEntry={true} style={style.textInput} value={oldPassword} onChangeText={text => {
                        setOldPassword(text)
                    }}/> 
                    <TextInput placeholder='New Password' secureTextEntry={true} style={style.textInput} value={newPassword} onChangeText={text => {
                        setNewPassword(text)
                    }}/>   
                    <Button mode="outlined" style={[style.button, {borderColor: colors.primary}]}
                    onPress={()=>{
                        if(oldPassword && newPassword){
                            changePasswordValue(token, oldPassword, newPassword, setResponse, name);
                        }else{
                            ToastAndroid.show("Enter Both old and new passwords", ToastAndroid.SHORT)
                        }
                    }}>Change Password</Button>   
                </View>
            </View>  
        </View>
    )
}

const style = StyleSheet.create({
    textInput:{
        marginBottom: 40,
        flex: 1
    },
    button:{
        marginTop: 20,
        padding: 10,
        width: "100%",
        borderRadius: 10,
        borderWidth: 1.5
    }
  })

export default changePassword;