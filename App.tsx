import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './app/components/HomeScreen';
import MapScreen from './app/components/AirportsMapScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import FlightForm from './app/components/FlightForm';
import LoginScreen from './app/components/LoginScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Airports Map" component={MapScreen} options={{
          headerShown: false,
          tabBarLabel: 'Airports map',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          )
        }} />
        <Tab.Screen name="Flight search" component={FlightForm} options={{
          headerShown: false,
          tabBarLabel: 'Flight search',
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          )
        }} />
        <Tab.Screen name="Login" component={LoginScreen} options={{
          tabBarLabel: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Icon name="lock" color={color} size={size} />
          )
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
