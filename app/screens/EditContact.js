import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useTheme, Paragraph, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import { useRoute, useNavigation} from '@react-navigation/native';
import CountryDisplay from '../components/CountryDisplay';
import { editContact, addNewContact } from '../controllers/Api';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Item = ({ item, newContactDetails, index, colors, setModalVisible, setSelectedPhoneIndex, setNewContactDetails }) => (
    <View>
        <View style={{flexDirection: "row"}}>
            <Button style={{flex: 1, alignSelf: "center"}} onPress={()=>{
            setModalVisible(true);
            setSelectedPhoneIndex(index);
        }}><Paragraph style={{flex: 1, textAlign: "center"}}>{item.countryCode ? item.countryCode : "Location"}</Paragraph></Button>
        
        <TextInput key={"text input " + index} style={{flex: 4}} label={<Paragraph style={{color: "darkgray", fontSize: 15}}>Phone Number</Paragraph>} placeholder={"Type here..."}
        keyboardType={"numeric"}
        value={item.number} onChangeText={text => {
            let temp = {...newContactDetails};
            temp.phoneNumbers[index].number = text.replace(/[^0-9]/g, '');
            setNewContactDetails(temp)
        }}/>
        <TextInput key={"text input Extension " + index} style={{flex: 3, marginLeft: 5}} label={<Paragraph style={{color: "darkgray", fontSize: 15}}>Extension</Paragraph>} placeholder={"Type here..."}
        keyboardType={"numeric"} maxLength={5}
        value={item.extension} onChangeText={text => {
            let temp = {...newContactDetails};
            temp.phoneNumbers[index].extension = text.replace(/[^0-9]/g, '');
            setNewContactDetails(temp)
        }}/>
        {index == newContactDetails.phoneNumbers.length -1 ? 
        <IconButton 
        key={"phone delete button" + index}
        style={{alignSelf: "center"}}
        icon={() => <Icon name="trash" size={20} color={colors.text}/>}
        onPress={()=>{
            let temp = {...newContactDetails};
            temp.phoneNumbers.splice(index, 1);
            setNewContactDetails(temp);
        }}/>  : <View style={{flex: 1}}></View>}
        </View>
    </View>
  );


const EditContact = ({token, name}) => {
    const {colors} = useTheme();
    const route = useRoute();
    const {type, contact} = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [selectedPhoneIndex, setSelectedPhoneIndex] = useState();
    const [errorMsg, setErrorMsg] = useState();
    let contactDetails = {};
    if(type == "edit"){
        contactDetails = contact;
    }else{
        contactDetails = {
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
        }
    }
    const [newContactDetails, setNewContactDetails] = useState(contactDetails)
    const navigation = useNavigation();

    useEffect(()=>{
        if(type == "edit" &&  newContactDetails.phoneNumbers &&  !newContactDetails.phoneNumbers[0].countryCode){
            let temp = [];
            newContactDetails.phoneNumbers.forEach(phoneNumber => {
                let countryCode = phoneNumber.phoneNumberFormatted.split('-')[0];
                let areaCode = phoneNumber.phoneNumberFormatted.split('-')[1];
                let number = phoneNumber.phoneNumberFormatted.split('-')[2].split('#')[0];
                let extension = phoneNumber.phoneNumberFormatted.split('#')[1];
                temp.push({category: phoneNumber.category, countryCode: countryCode, extension: extension, id: phoneNumber.id, number: areaCode + number})
            });
            let tempHold = {...newContactDetails}
            tempHold.phoneNumbers = temp;
            setNewContactDetails(tempHold)
        }
        
    }, [])
    const checkDetails = () =>{
        let details = {working: true, msg: ""};
        if(!newContactDetails.company || !newContactDetails.contactName || !newContactDetails.primaryEmailAddress){
            details.working = false;
            details.msg = "Make sure Company name, contact name and primary email is completely filled in!";
        }else if(!newContactDetails.phoneNumbers.length > 0){
            console.log(newContactDetails.phoneNumbers.length)
            details.working = false;
            details.msg = "Make sure there is at least one phone number!";
        }
        else{
            for(let number of newContactDetails.phoneNumbers){
                if(!number.category || !number.countryCode || !number.extension || !number.number){
                    details.working = false;
                    details.msg = "Make sure all Phone number details are completely filled in! (such as location, extension and number)";
                    break;
                }
            }
        } 
        return details;
    }


    const renderItem = ({ item, index }) => (
        <Item item={item} newContactDetails={newContactDetails} index={index} colors={colors} setModalVisible={setModalVisible}
        setSelectedPhoneIndex={setSelectedPhoneIndex} setNewContactDetails={setNewContactDetails}/>
    );

    return(
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <View>
                <View>
                    <FlatList 
                    ListHeaderComponent={
                        <>
                            <Paragraph style={{textAlign: "center"}}>Enter the contact details here</Paragraph>
                            <TextInput style={style.input} label={<Paragraph style={{color: "darkgray", fontSize: 20}}>Company Name</Paragraph>} placeholder={"Type here..."} value={newContactDetails.company} onChangeText={text => {
                                let temp = {...newContactDetails};
                                temp.company = text;
                                setNewContactDetails(temp)
                            }}/>
                            <TextInput style={style.input} label={<Paragraph style={{color: "darkgray", fontSize: 20}}>Contact Name</Paragraph>} placeholder={"Type here..."} value={newContactDetails.contactName} onChangeText={text => {
                                let temp = {...newContactDetails};
                                temp.contactName = text;
                                setNewContactDetails(temp)
                            }}/>
                            <View style={{marginTop: 10}}>
                                <Paragraph style={{textAlign: "center"}}>Phone Numbers</Paragraph>
                                <Divider style={{marginTop: 6}}/>
                            </View>
                        </>
                    }
                    data={newContactDetails.phoneNumbers}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={
                        <>
                        <Button id="button 1" onPress={()=>{
                        let temp = {...newContactDetails};
                        temp.phoneNumbers.push({number: ""});
                        setNewContactDetails(temp)
                        }}>Add Another Phone Number</Button>
                        <Divider style={{marginTop: 6}}/>
                        <TextInput style={style.input} label={<Paragraph style={{color: "darkgray", fontSize: 20}}>Primary Email Address</Paragraph>} placeholder={"Type here..."} value={newContactDetails["primaryEmailAddress"]} onChangeText={text => {
                        let temp = {...newContactDetails};
                        temp["primaryEmailAddress"] = text;
                        setNewContactDetails(temp)
                        }}/>
                        {modalVisible ? <CountryDisplay modalVisible={modalVisible} setModalVisible={setModalVisible} colors={colors}
                        selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedPhoneIndex={selectedPhoneIndex}
                        newContactDetails={newContactDetails} setNewContactDetails={setNewContactDetails}/>  : <></>}
                        <Button onPress={()=>{
                            let workingDetails = checkDetails();
                            if(workingDetails.working){
                                let tempHold = {...newContactDetails};
                                newContactDetails.phoneNumbers.forEach((phoneNumber, index) => {
                                    if(phoneNumber.number){
                                        console.log(phoneNumber.number)
                                        tempHold.phoneNumbers[index].areaCode = phoneNumber.number.substring(0,3);
                                        tempHold.phoneNumbers[index].number = phoneNumber.number.slice(3);
                                    }
                                });
                                if(tempHold){
                                    if(type == "edit"){
                                        let id = tempHold.id;
                                        delete tempHold.id;
                                        editContact(token, id, tempHold, name);
                                        navigation.navigate("contact");
                                    }else{
                                        console.log("ADDING WORKS")
                                        addNewContact(token, tempHold, name)
                                        navigation.navigate("contact");
                                    }
                                }
                            }else{
                                console.log("FAILED");
                                setErrorMsg(workingDetails.msg)
                            }
                        }}>{type == "edit" ? "Edit Contact" : "Add New Contact"}</Button>
                        <Paragraph>{errorMsg}</Paragraph>
                        </>
                    }
                    />
                </View>  
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    input:{
        alignSelf: "center",
        width:"60%"
    }
});

const mapStateToProps = (state) => {
    const { token, name } = state.reducer;
    return { token, name };
};

export default connect(mapStateToProps)(EditContact);