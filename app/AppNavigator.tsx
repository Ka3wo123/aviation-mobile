import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "./AuthContext";
import HomeScreen from "../app/components/HomeScreen";
import MapScreen from "../app/components/AirportsMapScreen";
import FlightForm from "../app/components/FlightForm";
import LoginScreen from "../app/components/LoginScreen";
import UserFlightsScreen from "../app/components/UserFlightsScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
    const { isLoggedIn, logOut } = useAuth();

    const handleLogout = async () => {
        await AsyncStorage.removeItem("@user_email");
        await AsyncStorage.removeItem("@access_token");
        logOut();
        ToastAndroid.show("Successfully logged out", ToastAndroid.SHORT);
    };

    return (
        <Tab.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerTintColor: 'wheat',
            tabBarHideOnKeyboard: true,
            headerStyle: {
                backgroundColor: '#0065FD'
            },

        }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
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
                    tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Airports map"
                component={MapScreen}
                options={{
                    headerShown: false,
                    unmountOnBlur: true,
                    tabBarIcon: ({ color, size }) => <Icon name="map" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Flight search"
                component={FlightForm}
                initialParams={{flightData: null}}
                options={{
                    unmountOnBlur: true,
                    tabBarIcon: ({ color, size }) => <Icon name="search" color={color} size={size} />,
                }}
            />

            {!isLoggedIn ? (
                <Tab.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: false,                        
                        tabBarIcon: ({ color, size }) => <Icon name="lock" color={color} size={size} />,
                    }}
                />
            ) : (
                <Tab.Screen
                    name="Your flights"
                    component={UserFlightsScreen}
                    options={{
                        unmountOnBlur: true,
                        tabBarIcon: ({ color, size }) => <Icon name="plane" color={color} size={size} />,
                    }}
                />
            )}
        </Tab.Navigator>
    );
};

export default AppNavigator;
