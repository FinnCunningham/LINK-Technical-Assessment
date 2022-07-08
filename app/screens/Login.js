import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, TextInput, Button } from 'react-native-paper';
import { bindActionCreators } from 'redux';
import { reduxAdd, setPage, setName } from '../controllers/ReduxAction';
import { useNavigation } from '@react-navigation/native';
import { loginAuth } from '../controllers/Api'

const Login = ({token, reduxAdd, setPage, setName}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigation = useNavigation();
    const { colors } = useTheme();
    useEffect(()=>{
        setPage("Login")
        console.log("LOGGEDIN")
        
    }, [])
    return(
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <Paragraph style={{textAlign: "center", fontSize:30, padding: 70}}>Login</Paragraph>
            <View style={{alignItems: "center", marginTop: 30}}>
                <TextInput style={{width:"60%"}} placeholder="Username" value={username} onChangeText={text => setUsername(text)}/>
                <TextInput style={{width:"60%"}} secureTextEntry={true} placeholder="Password" value={password} onChangeText={text => setPassword(text)}/>
                <Button onPress={()=>{
                    loginAuth(username, password, reduxAdd, navigation, setError, setName);
                }}>Submit</Button>
                {error ? <Paragraph>{error}</Paragraph>: <></>}
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
        reduxAdd,
        setPage,
        setName
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);