import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, Button, TextInput} from 'react-native-paper';
import { bindActionCreators } from 'redux';
import { useNavigation } from '@react-navigation/native';
import { getContacts, addNewContact } from '../controllers/Api';
import CountryDisplay from '../components/CountryDisplay';
import ContactsDisplay from '../components/ContactsDisplay';
import { setPage } from '../controllers/ReduxAction';

const Contact = ({token, setPage}) => {
    const { colors } = useTheme();
    const [contacts, setContacts] = useState();
    const [addContact, setAddContact] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [selectedPhoneIndex, setSelectedPhoneIndex] = useState();
    const navigation = useNavigation();

    const [newContactDetails, setNewContactDetails] = useState({
        company: "",
        contactName: "",
        phoneNumbers: [
            {
                "areaCode": "",
                "category": "HOME",
                "countryCode": "",
                "extension": "",
                "id": "",
                "number": ""
            }
        ],
        primaryEmailAddress: ""
    })
    useEffect(()=>{
        getContacts( token, setContacts)
        setPage("Contact");
    }, [])
    const phoneNumbers = () => {
        let elements = [];
        if(newContactDetails.phoneNumbers.length == 0){
            elements.push(<Text key="text input 1" style={{width:"40%"}} placeholder={"Enter Phone Number"} value={newContactDetails.phoneNumbers} onChangeText={text => {
                let temp = {...newContactDetails};
                temp.phoneNumbers[0].number = text;
                setNewContactDetails(temp);
            }}/>)
        }else{
            newContactDetails.phoneNumbers.forEach((number, index) => {
                elements.push(<View style={{flexDirection: "row"}}>
                    <Button style={{flex: 1, alignSelf: "center"}} onPress={()=>{
                        setModalVisible(true);
                        setSelectedPhoneIndex(index);
                    }}><Paragraph style={{flex: 1, textAlign: "center"}}>Location</Paragraph></Button>
                    <TextInput key={"text input " + index} style={{flex: 3}} placeholder={"Enter Phone Number"}
                    keyboardType={"numeric"}
                    value={newContactDetails.phoneNumbers[index].number} onChangeText={text => {
                        let temp = {...newContactDetails};
                        temp.phoneNumbers[index].number = text;
                        setNewContactDetails(temp)
                    }}/><TextInput key={"text input Extension " + index} style={{flex: 2, marginLeft: 5}} placeholder={"Extension"}
                    keyboardType={"numeric"}
                    value={newContactDetails.phoneNumbers[index].extension} onChangeText={text => {
                        let temp = {...newContactDetails};
                        temp.phoneNumbers[index].extension = text;
                        setNewContactDetails(temp)
                    }}/></View>
                );
            }); 
        }
        elements.push(<Button id="button 1" onPress={()=>{
            let temp = {...newContactDetails};
            temp.phoneNumbers.push({number: ""});
            setNewContactDetails(temp)
        }}>Add Another Phone Number</Button>)
        return elements;

    }

    return( 
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <View style={{flex: 1, justifyContent: "center", flexDirection: "column"}}>
                {!addContact ? <Button style={{alignSelf: "center", justifyContent: "center"}} onPress={
                    ()=>{setAddContact(true)}
                }>Add A New Contact</Button> : <></>}
            </View>
            {addContact ? <View style={{flex: 4}}>
            <Paragraph style={{textAlign: "center"}}>Enter the contact details here</Paragraph>
            <TextInput style={style.input} placeholder={"Enter Company"} value={newContactDetails.company} onChangeText={text => {
                let temp = {...newContactDetails};
                temp.company = text;
                setNewContactDetails(temp)
            }}/>
            <TextInput style={style.input} placeholder={"Enter Contact Name"} value={newContactDetails.contactName} onChangeText={text => {
                let temp = {...newContactDetails};
                temp.contactName = text;
                setNewContactDetails(temp)
            }}/>
            {phoneNumbers()}
            <TextInput style={style.input} placeholder={"Enter Primary Email Address"} value={newContactDetails["primaryEmailAddress"]} onChangeText={text => {
                let temp = {...newContactDetails};
                temp["primaryEmailAddress"] = text;
                setNewContactDetails(temp)
            }}/>
            {modalVisible ? <CountryDisplay modalVisible={modalVisible} setModalVisible={setModalVisible} colors={colors}
            selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedPhoneIndex={selectedPhoneIndex}
            newContactDetails={newContactDetails} setNewContactDetails={setNewContactDetails} setAddContact={setAddContact}/>  : <></>}
            
            <Button onPress={()=>{
                let tempHold = {...newContactDetails};
                newContactDetails.phoneNumbers.forEach((phoneNumber, index) => {
                    if(phoneNumber.number){
                        console.log(phoneNumber.number)
                        tempHold.phoneNumbers[index].areaCode = phoneNumber.number.substring(0,3);
                        tempHold.phoneNumbers[index].number = phoneNumber.number.slice(3);
                    }
                });
                if(tempHold){
                    console.log(token)
                    console.log(tempHold)
                    addNewContact(token, tempHold)
                    setModalVisible(false);
                    setAddContact(false);

                    console.log(modalVisible)
                }
            }}>Add New Contact</Button>

            </View> : <View style={{flex: 4}}>
                {contacts && contacts.length > 0 ? <View>
                    <ContactsDisplay data={contacts}/>
                </View> : <Paragraph style={{textAlign: "center"}}>No Contacts</Paragraph>}

            </View>}
            
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
    input:{
        alignSelf: "center",
        width:"40%"
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Contact);