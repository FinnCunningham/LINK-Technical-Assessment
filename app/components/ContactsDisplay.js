import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Paragraph, useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { deleteContact } from '../controllers/Api';
import {Swipeable} from 'react-native-gesture-handler';

const displayPhoneNumbers = (phoneNumbers, navigation, contact) => {
    let items = [];
    phoneNumbers.forEach((number, numIndex) => {
        items.push(<View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}} key={"View " + numIndex}>
            <Paragraph style={[style.itemPhone, {marginLeft: 20}]} key={"Phone Category Paragraph " + numIndex}>{number.category}</Paragraph>
            <Paragraph style={[style.itemPhone, {flex: 2, marginRight: 20}]} key={"Phone Num Paragraph " + numIndex}>{number.phoneNumberFormatted}</Paragraph>
        </View>)
    });
    items.push(<Button key={"Phone num edit button"} style={{width: "40%", alignSelf: "center"}} 
    onPress={()=>{navigation.navigate("edit-contact", {type: "edit", contact: contact})}}>Edit</Button>)
    return items;
}

const getRandomColor = () => {
    return Math.floor(Math.random()*16777215).toString(16);
}

const rightAction = (token, id, setUpdateContacts, name) => {
    // Update render
    return(
        <View style={{padding: 15}}>
            <Button onPress={()=>{
                deleteContact(token, id, name);
                setUpdateContacts(true)
            }}>Delete</Button>
        </View>  
    )
}

const Item = ({ item, itemOnClick, index, showDetails, colors, contactColors, token, setUpdateContacts, name, localPhoneDisplay }) => (
    <Swipeable renderRightActions={() => {return rightAction(token, item.id, setUpdateContacts, name, showDetails)}}>
        <TouchableOpacity style={{backgroundColor: colors.surface, marginTop: 10, width: "90%", alignSelf: "center", borderRadius: 10, minHeight: 50}}
        onPress={()=>itemOnClick(index)}>
            <View style={{flexDirection: "row"}}>
                <View style={{marginLeft: 8, alignSelf: "center"}}>
                    <View style={{width: 40, height: 40, borderRadius: 25, backgroundColor: contactColors ? "#" + contactColors[index] : "blue"}}>
                        <Paragraph style={{textAlign: "center", top: "30%", fontSize: 20}}>{item.contactName[0]}</Paragraph>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: "column", marginLeft: 30}}>
                    <Paragraph style={[style.itemPhone, {fontWeight: "bold", marginBottom: 10}]}>{item.contactName}</Paragraph>
                    <Paragraph style={[style.itemPhone]}>{item.company}</Paragraph>
                </View>
                <View>
                    <Paragraph style={[style.itemPhone,  {marginRight: 20, flex: 2, textAlignVertical: "center"}]}>{item.primaryEmailAddress}</Paragraph>
                </View> 
            </View>
            <View >
                {index == showDetails.index && showDetails.show ? localPhoneDisplay() : <></>}
            </View>
        </TouchableOpacity>
    </Swipeable>

  );

const ContactsDisplay = ({data, token, name, setUpdateContacts}) => {
    const {colors} = useTheme();
    const [showDetails, setShowDetails] = useState({show: false, index: 0});
    const [contactColors, setContactColors] = useState();
    const navigation = useNavigation();
    const itemOnClick = (index) => {
        let temp = {...showDetails};
        if(showDetails.index != index){
            temp.index = index;
            temp.show = true;
        }else{
            if(showDetails.show){
                temp.show = false;
            }else{
                temp.show = true;
            }
        }
        setShowDetails(temp)
    }
    console.log(showDetails)

    const renderItem = ({ item, index }) => {
        const localPhoneDisplay = () => displayPhoneNumbers(item.phoneNumbers, navigation, data[showDetails.index]);
        return(
            <Item item={item} itemOnClick={itemOnClick} index={index} showDetails={showDetails} colors={colors} 
            contactColors={contactColors} token={token} name={name} setUpdateContacts={setUpdateContacts}
            localPhoneDisplay={localPhoneDisplay}/>)
    };

    useEffect(()=>{
        let temp = [];
        data.forEach(dataItem => {
            temp.push(getRandomColor());
        });
        setContactColors(temp);
    }, [data])

    return(
        <View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                
            /> 
            
        </View>
    )
}

const style = StyleSheet.create({
    item:{
        width: 100,
        height: 50
    },
    itemPhone: {
        flex: 1,
    }
  })

export default ContactsDisplay;