import { StatusBar } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import ReduxReducer from './app/controllers/ReduxReducer';
import Login from './app/screens/Login';
import Header from './app/components/Header';
import Homepage from './app/screens/Homepage';
import Contact from './app/screens/Contact';


let theme = "dark"
const darkTheme = {
  ...DarkTheme,
  roundness: 2,
  colors: {
    ...DarkTheme.colors,
    background: "#121212",
    accent: "#14dbf5",
    surface: "#1D1D1D"
  },
};

const lightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
  },
}



const stack = createStackNavigator();
const store = createStore(ReduxReducer);

export default function App() {
  return (
    <PaperProvider theme={theme =='dark' ? darkTheme : lightTheme}>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <Header/>
          <StatusBar hidden/>
          <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name="login" children={()=> <Login/>} />
            <stack.Screen name="home" children={()=> <Homepage/>} />
            <stack.Screen name="contact" children={()=> <Contact/>} />
          </stack.Navigator>
        </NavigationContainer>
      </ReduxProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
