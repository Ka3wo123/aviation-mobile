import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './app/components/HomeScreen';
import MapScreen from './app/components/AirportsMapScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import FlightForm from './app/components/FlightForm';
import LoginScreen from './app/components/LoginScreen';
import UserFlightsScreen from './app/components/UserFlightsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn ] = useState<boolean>();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem("@access_token");
      setIsLoggedIn(!!userToken);
    };

    checkLoginStatus();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@user_email");
    await AsyncStorage.removeItem("@access_token");
    setIsLoggedIn(false);
    ToastAndroid.show("Successfully logged out", ToastAndroid.SHORT);
  };

  return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              unmountOnBlur: true,
              headerRight: () => isLoggedIn ? (
                <Icon
                  onLongPress={() => ToastAndroid.show("Logout", ToastAndroid.SHORT)}
                  name="sign-out"
                  size={25}
                  color="black"
                  onPress={handleLogout}
                  style={{ marginRight: 20 }}
                />
              ) : null,
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Airports Map"
            component={MapScreen}
            options={{
              headerShown: false,
              tabBarLabel: 'Airports map',
              unmountOnBlur: true,
              tabBarIcon: ({ color, size }) => (
                <Icon name="map" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Flight search"
            component={FlightForm}
            options={{
              tabBarLabel: 'Search flight',
              tabBarIcon: ({ color, size }) => (
                <Icon name="search" color={color} size={size} />
              ),
            }}
          />

          {!isLoggedIn ? (
            <Tab.Screen
              name="Login bottom"
              component={LoginScreen}
              options={{
                tabBarLabel: 'Login',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="lock" color={color} size={size} />
                ),
              }}
              key="login"
            />
          ) : (
            <Tab.Screen
              name="Your Flights"
              component={UserFlightsScreen}
              options={{
                tabBarLabel: 'Your flights',
                tabBarIcon: ({ color, size }) => (
                  <Icon name="plane" color={color} size={size} />
                ),
              }}
              key="userFlights"
            />
          )}
        </Tab.Navigator>
      </NavigationContainer>
  );
}
