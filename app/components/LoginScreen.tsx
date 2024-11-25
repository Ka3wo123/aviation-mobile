import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ToastAndroid,
    Image,
} from "react-native";
import axios from "axios";
import { BE_AUTH_HOST, BE_USER_HOST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useAuth } from "../AuthContext";
import { Role } from "../types/Role";


const LoginForm = ({ navigation }: any) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { logIn } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${BE_AUTH_HOST}/login`, {
                username: email,
                password: password,
            });

            const accessToken = response.data.access_token;

            await AsyncStorage.setItem("@access_token", accessToken);
            await AsyncStorage.setItem("@user_email", email);

            logIn();

            ToastAndroid.show("Successfully logged in", ToastAndroid.SHORT);
            // @ts-ignore
            navigation.navigate("Home")
        } catch (err: unknown) {
            ToastAndroid.show("Invalid credentials", ToastAndroid.SHORT);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Aviation Explorer</Text>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/images/aviation_logo.webp")}
                    style={styles.logo}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={styles.forgotPasswordLink}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const RegisterForm = () => {
    const [registerName, setRegisterName] = useState<string>("");
    const [registerSurname, setRegisterSurname] = useState<string>("");
    const [registerAge, setRegisterAge] = useState<string>("");
    const [registerPhoneNumber, setRegisterPhoneNumber] = useState<string>("");
    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");
    const [registerErrors, setRegisterErrors] = useState<any>({});

    useEffect(() => {
        const errors: any = {};
        if (!registerName) errors.name = "Name is required";
        if (!registerSurname) errors.surname = "Surname is required";
        if (!registerEmail) errors.email = "Email is required";
        if (!registerPassword) errors.password = "Password is required";

        if (Object.keys(errors).length > 0) {
            setRegisterErrors(errors);
            return;
        }

        setRegisterErrors({});

    }, [registerName, registerSurname, registerEmail, registerPassword]);

    const handleRegister = async () => {
        try {
            await axios.post(`${BE_USER_HOST}/api/user`, {
                name: registerName,
                surname: registerSurname,
                email: registerEmail,
                password: registerPassword,
                phoneNumber: registerPhoneNumber,
                age: registerAge ? parseInt(registerAge, 10) : null,
                role: Role.USER
            });
            ToastAndroid.show("Registration Successful", ToastAndroid.SHORT);
        } catch (error) {
            console.error("Registration Error:", error);
            ToastAndroid.show("Error: " + error, ToastAndroid.SHORT);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/images/aviation_logo.webp")}
                    style={styles.logo}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={registerName}
                    onChangeText={setRegisterName}
                />
                {registerErrors.name && <Text style={styles.errorText}>{registerErrors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Surname"
                    value={registerSurname}
                    onChangeText={setRegisterSurname}
                />
                {registerErrors.surname && <Text style={styles.errorText}>{registerErrors.surname}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    keyboardType="email-address"
                />
                {registerErrors.email && <Text style={styles.errorText}>{registerErrors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    secureTextEntry
                />
                {registerErrors.password && <Text style={styles.errorText}>{registerErrors.password}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    value={registerPhoneNumber}
                    onChangeText={setRegisterPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Age"
                    value={registerAge}
                    onChangeText={setRegisterAge}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const Tab = createMaterialTopTabNavigator();

export default function LoginScreen() {    
    return (
        <Tab.Navigator                    
            screenOptions={{
                tabBarLabelStyle: { color: 'white', fontSize: 16 },
                tabBarStyle: {
                    backgroundColor: '#007bff',
                    elevation: 10,
                    height: 50
                },
                tabBarIndicatorStyle: {
                    backgroundColor: 'white',
                    height: 2,
                }
            }}
        >
            <Tab.Screen
                name="Login"
                component={LoginForm}
                options={{ tabBarLabel: 'Login'}}
            />
            <Tab.Screen
                name="Register"
                component={RegisterForm}
                options={{ tabBarLabel: 'Register' }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    header: {
        color: 'black',
        fontSize: 28,
        alignSelf: 'center'
    },
    logoContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 200,
        overflow: "hidden",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        height: 50,
        backgroundColor: "#c9c9cf",
        borderColor: "#ddf",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        flex: 1,
        color: "black",
    },
    button: {
        backgroundColor: "#007bff",
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
    errorText: {
        position: 'absolute',
        color: "red",
        right: 0,
        marginRight: 10,
        fontSize: 12,
    },
    forgotPasswordLink: {
        alignSelf: 'center',
        marginVertical: 15,

    },
    forgotPasswordText: {
        color: "#007bff",
        textDecorationLine: "underline",
    },
});
