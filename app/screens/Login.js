import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, TextInput, Button } from 'react-native-paper';
import { bindActionCreators } from 'redux';
import { reduxAdd, setPage, setName } from '../controllers/ReduxAction';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { loginAuth } from '../controllers/Api'
import GloabalStyle from '../components/GloabalStyle';

const Login = ({reduxAdd, setPage, setName}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigation = useNavigation();
    const { colors } = useTheme();
    const isFocused = useIsFocused();
    useEffect(()=>{
        setPage("Login")        
    }, [isFocused])
    return(
        <View style={{flex: 1, backgroundColor: colors.background, alignItems: "center"}}>
            <Image source={require('../assets/Circle-profile.png')} style={{width: 100, height: 100, borderRadius: 50, marginTop: 50}} 
            resizeMode="contain"/>
            <Paragraph style={{fontSize:30, padding: 20, marginTop: 10}}>Login</Paragraph>
            <View style={{alignItems: "center", marginTop: 10, width: "100%"}}>
                <TextInput style={{width:"80%", fontSize: 20}} label={<Paragraph style={{color: "darkgray", fontSize: 20}}>Username</Paragraph>} placeholder="Type here..." value={username} onChangeText={text => setUsername(text)}/>
                <TextInput style={{width:"80%", fontSize: 20}} secureTextEntry={true} label={<Paragraph style={{color: "darkgray", fontSize: 20}}>Password</Paragraph>} placeholder="Type here..." value={password} onChangeText={text => setPassword(text)}/>
                <Button style={[GloabalStyle.button, {borderColor: colors.primary, marginTop: 20, width: "50%", borderRadius: 100}]} labelStyle={{fontSize: 16}} mode="outlined" onPress={()=>{
                    loginAuth(username, password, reduxAdd, navigation, setError, setName);
                }}>Sign in</Button>
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