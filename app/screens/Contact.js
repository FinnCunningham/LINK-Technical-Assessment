import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { useTheme, Paragraph, Button, TextInput} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getContacts, getCountries } from '../controllers/Api';

const Item = ({ dialCode, flagCode, isoCode, name, setSelectedCountry, selectedPhoneIndex, selectedCountry }) => (
    <TouchableOpacity onPress={()=>{
        let temp = [...selectedCountry];
        temp[selectedPhoneIndex] = {dialCode: dialCode, flagCode: flagCode, isoCode: isoCode, name: name}
        setSelectedCountry(temp)
        }}>
        <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}}>
            <Paragraph style={style.item}>{dialCode}</Paragraph>
            <Paragraph style={style.item}>{flagCode}</Paragraph>
            <Paragraph style={style.item}>{isoCode}</Paragraph>
            <Paragraph style={style.item}>{name}</Paragraph>
        </View>
    </TouchableOpacity>

  );

const Contact = ({token}) => {
    const { colors } = useTheme();
    const [contacts, setContacts] = useState();
    const [addContact, setAddContact] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [countries, setCountries] = useState();
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [selectedPhoneIndex, setSelectedPhoneIndex] = useState();
    const testDropDownValues = [
        {
           "dialCode":"+93",
           "flagCode":"🇦🇫",
           "isoCode":"AF",
           "name":"Afghanistan"
        },
    ]
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
    }, [])
    useEffect(()=>{
        getCountries(setCountries);
    }, [modalVisible])

    const renderItem = ({ item }) => (
        <Item name={item.name} dialCode={item.dialCode} flagCode={item.flagCode} isoCode={item.isoCode}
        selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedPhoneIndex={selectedPhoneIndex}/>
    );

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
                    {/* <TextInput style={{flex: 2}} placeholder='extention'/> */}
                    <Button style={{flex: 1}} onPress={()=>{
                        setModalVisible(true);
                        setSelectedPhoneIndex(index);
                    }}>Extension</Button>
                    <TextInput key={"text input " + index} style={{flex: 3}} placeholder={"Enter Phone Number"}
                    value={newContactDetails.phoneNumbers[index].number} onChangeText={text => {
                        let temp = {...newContactDetails};
                        temp.phoneNumbers[index].number = text;
                        setNewContactDetails(temp)
                    }}/></View>)
                
            }); 

        }
        

        elements.push(<Button id="button 1" onPress={()=>{
            let temp = {...newContactDetails};
            temp.phoneNumbers.push({});
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
            <TextInput style={{width:"40%"}} placeholder={"Enter Company"} value={newContactDetails.company} onChangeText={text => {
                let temp = {...newContactDetails};
                temp.company = text;
                setNewContactDetails(temp)
            }}/>
            <TextInput style={{width:"40%"}} placeholder={"Enter Contact Name"} value={newContactDetails.contactName} onChangeText={text => {
                let temp = {...newContactDetails};
                temp.contactName = text;
                setNewContactDetails(temp)
            }}/>
            {phoneNumbers()}
            <TextInput style={{width:"40%"}} placeholder={"Enter Primary Email Address"} value={newContactDetails["primaryEmailAddress"]} onChangeText={text => {
                let temp = {...newContactDetails};
                temp["primaryEmailAddress"] = text;
                setNewContactDetails(temp)
            }}/>
            <Modal visible={modalVisible}>
                <View style={{flex: 1, backgroundColor: colors.background}}>
                <View style={{flex: 3}}>{countries ? <FlatList
                    data={countries}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                /> : <></>}
                </View>
                {selectedCountry[selectedPhoneIndex] ? 
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 50}}>
                        <Paragraph style={style.item}>{selectedCountry[selectedPhoneIndex].dialCode}</Paragraph>
                        <Paragraph style={style.item}>{selectedCountry[selectedPhoneIndex].flagCode}</Paragraph>
                        <Paragraph style={style.item}>{selectedCountry[selectedPhoneIndex].isoCode}</Paragraph>
                        <Paragraph style={style.item}>{selectedCountry[selectedPhoneIndex].name}</Paragraph>
                    </View> : <></>}
                <View style={{flex: 1}}>
                    <Button onPress={()=>{setModalVisible(false)}}>Accept selected</Button>
                </View>
                </View>
            </Modal>
            <Button>Add New Contact</Button>

            </View> : <View style={{flex: 4}}>
                {contacts && contacts.length > 0 ? <></> : <Paragraph style={{textAlign: "center"}}>No Contacts</Paragraph>}

            </View>}
            
        </View>
    )
}

const mapStateToProps = (state) => {
    const { token } = state.reducer
    return { token }
};

const style = StyleSheet.create({
    item:{
        width: 100,
        height: 50
    }
  })

export default connect(mapStateToProps)(Contact);