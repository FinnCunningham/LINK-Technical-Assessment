import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Paragraph, Button, TextInput, IconButton} from 'react-native-paper';
import { getCountries } from '../controllers/Api';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Item = ({ dialCode, flagCode, isoCode, name, setSelectedCountry }) => (
    <TouchableOpacity onPress={()=>{        
        setSelectedCountry({dialCode: dialCode, category: "HOME", flagCode: flagCode, isoCode: isoCode, name: name})
        }}>
        <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}}>
            <Paragraph style={style.item}>{dialCode}</Paragraph>
            <Paragraph style={style.item}>{flagCode}</Paragraph>
            <Paragraph style={style.item}>{isoCode}</Paragraph>
            <Paragraph style={style.item}>{name}</Paragraph>
        </View>
    </TouchableOpacity>

  );

const CountryDisplay = ({modalVisible, setModalVisible, colors, selectedCountry, setSelectedCountry, selectedPhoneIndex,
    newContactDetails, setNewContactDetails}) => {
    const [countries, setCountries] = useState();
    const [typeCountry, setTypeCountry] = useState();
    const countryData = () => {
        let reducedCountries = [];
        if(typeCountry && countries){
            console.log("HIT")
            reducedCountries = countries.filter(country => country.name.toLowerCase().includes(typeCountry.toLowerCase()));
        }else{
            console.log("HIT FAILED")
            reducedCountries = countries;
        }
        return reducedCountries;
    }

    const renderItem = ({ item }) => (
        <Item name={item.name} dialCode={item.dialCode} flagCode={item.flagCode} isoCode={item.isoCode}
        selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedPhoneIndex={selectedPhoneIndex}/>
    );

    useEffect(()=>{
        if(modalVisible){
            getCountries(setCountries);
        }
    }, [modalVisible])
    // console.log(countries)
    return(
        <View>
            <Modal visible={modalVisible}>
                <View style={{flex: 1, backgroundColor: colors.background}}>
                    <View style={{marginTop: 20, flexDirection: "row", justifyContent: "space-between"}}>
                        <TextInput style={{flex: 3, marginLeft: 10}} label={<Paragraph style={{color: "darkgray", fontSize: 15}}>Country name</Paragraph>} placeholder={"Type here..."}
                        value={typeCountry} onChangeText={text => {
                            setTypeCountry(text);
                        }}/>
                        <IconButton 
                        style={{flex: 1}}
                        icon={() => <Icon name="trash" size={20} color={colors.text}/>}
                        onPress={()=>{
                            setTypeCountry("")
                        }}/>
                    </View>
                
                    <View style={{flex: 4}}>{countries ? <FlatList
                        data={countryData()}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index}
                        initialNumToRender={15}
                        maxToRenderPerBatch={15}
                    /> : <></>}
                    </View>
                    {selectedCountry ? 
                        <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 50}}>
                            <Paragraph style={style.item}>{selectedCountry.dialCode}</Paragraph>
                            <Paragraph style={style.item}>{selectedCountry.flagCode}</Paragraph>
                            <Paragraph style={style.item}>{selectedCountry.isoCode}</Paragraph>
                            <Paragraph style={style.item}>{selectedCountry.name}</Paragraph>
                        </View> : <></>}
                    <View style={{flex: 1}}>
                        <Button onPress={()=>{
                            setModalVisible(false)
                            let temp = {...newContactDetails};
                            temp.phoneNumbers[selectedPhoneIndex] = {areaCode: "", category: "HOME",
                            countryCode: selectedCountry.dialCode, extension: newContactDetails.phoneNumbers[selectedPhoneIndex].extension,
                            id: selectedPhoneIndex, number: newContactDetails.phoneNumbers[selectedPhoneIndex].number};
                            setNewContactDetails(temp);
                            }}>Accept selected</Button>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const style = StyleSheet.create({
    item:{
        width: 100,
        height: 50
    }
  })

export default CountryDisplay;