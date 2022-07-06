import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Paragraph } from 'react-native-paper';

const displayPhoneNumbers = (phoneNumbers) => {
    let items = [];
    console.log(phoneNumbers)
    phoneNumbers.forEach(number => {
        items.push(<View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}}>
            <Paragraph style={[style.itemPhone, {marginLeft: 20}]}>{number.category}</Paragraph>
            <Paragraph style={style.itemPhone}>{number.id}</Paragraph>
            <Paragraph style={[style.itemPhone, {flex: 2, marginRight: 20}]}>{number.phoneNumberFormatted}</Paragraph>


        </View>)
    });
    return items;
}

const Item = ({ item }) => (
    <TouchableOpacity style={{backgroundColor: "gray"}}>
        <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}}>
            <Paragraph style={[style.itemPhone, {marginLeft: 20}]}>{item.company}</Paragraph>
            <Paragraph style={style.itemPhone}>{item.contactName}</Paragraph>
            <Paragraph style={[style.itemPhone,  {marginRight: 20}]}>{item.primaryEmailAddress}</Paragraph>
        </View>
        <View >
            {displayPhoneNumbers(item.phoneNumbers)}
        </View>
    </TouchableOpacity>

  );

const ContactsDisplay = ({data}) => {

    const renderItem = ({ item }) => (
        <Item item={item}/>
    );

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