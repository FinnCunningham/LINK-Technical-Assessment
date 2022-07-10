import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, Button} from 'react-native-paper';
import { bindActionCreators } from 'redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getContacts } from '../controllers/Api';
import ContactsDisplay from '../components/ContactsDisplay';
import { setPage } from '../controllers/ReduxAction';
import GloabalStyle from '../components/GloabalStyle';

const Contact = ({token, setPage, name}) => {
    const { colors } = useTheme();
    const [contacts, setContacts] = useState();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [updateContacts, setUpdateContacts] = useState(false);

    useEffect(()=>{
        setPage("Contact");
    }, [])

    useEffect(()=>{
        let isMounted = true;
        if(updateContacts){
            getContacts(token, name)
            .then((data) =>{
                if(isMounted){
                    setContacts(data);
                    setUpdateContacts(false);
                }
            })
        }
        return ()=>{isMounted = false};
    }, [updateContacts])

    useEffect(()=>{
        let isMounted = true;
        getContacts(token, name)
        .then((data)=>{
            if(isMounted){
                setContacts(data);
            }
        })
        return ()=>{isMounted = false};
    }, [isFocused])


    return( 
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <View style={{flex: 1, justifyContent: "center", flexDirection: "column"}}>
                <Button mode="outlined" style={[GloabalStyle.button, {alignSelf: "center", justifyContent: "center", borderColor: colors.primary}]} onPress={()=>{
                    navigation.navigate("edit-contact", {type: "add", contact: {}})}
                }>Add A New Contact</Button>
            </View>
            {contacts && contacts.length > 0 ? 
            <View style={{flex: 4}}>
                <ContactsDisplay data={contacts} token={token} name={name} setUpdateContacts={setUpdateContacts}/>
            </View> : <Paragraph style={{textAlign: "center"}}>No Contacts</Paragraph>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Contact);