import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, Button, Paragraph } from 'react-native-paper';
import { changePasswordValue } from '../controllers/Api';

const changePassword = ({setChangePassword, colors, token, name}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [response, setResponse] = useState(null);

    useEffect(()=>{
        // Check if the response exists and if they canceled before submitting to avoid errors.
        if(response && !response.error){
            setChangePassword(false);
        }else if(response && response.error){
            ToastAndroid.show(response.error, ToastAndroid.SHORT)

        }
    }, [response])
    return(
        <View style={{flex: 1}}>
            <Button onPress={()=> {setChangePassword(false);}}>Go back</Button>
            <View>
                <Paragraph>Change Password</Paragraph>
            </View>
            <View>
                <TextInput placeholder='Old Password' style={style.textInput} value={oldPassword} onChangeText={text => {
                    setOldPassword(text)
                }}/> 
                <TextInput placeholder='New Password' style={style.textInput} value={newPassword} onChangeText={text => {
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
    )
}

const style = StyleSheet.create({
    textInput:{
        marginBottom: 10
    },
    button:{
        marginTop: 10,
        padding: 10,
        width: "100%",
        borderRadius: 10,
        borderWidth: 1.5
    }
  })

export default changePassword;