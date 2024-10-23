import React, { useState } from "react";
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Modal, View, ToastAndroid, Image } from "react-native";
import axios from "axios";
import { BE_AUTH_HOST } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        const response = await axios.post(`${BE_AUTH_HOST}/login`,
            {
                username: email,
                password: password
            }
        );

        const accessToken = response.data.access_token;

        await AsyncStorage.setItem('@access_token', accessToken);

        ToastAndroid.show("Successfully logged in", ToastAndroid.SHORT);
        // @ts-ignore
        navigation.navigate('Home');
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${BE_AUTH_HOST}/api/auth/register`, {
                email: registerEmail,
                password: registerPassword,
            });
            Alert.alert("Registration Successful", `Welcome, ${response.data.user.name}!`);
            setModalVisible(false);
        } catch (error) {
            console.error('Registration Error:', error);
            Alert.alert("Registration Failed", "Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/aviation_logo.webp')} style={styles.logo} />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => setModalVisible(true)}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Register</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={registerEmail}
                            onChangeText={setRegisterEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={registerPassword}
                            onChangeText={setRegisterPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.linkText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 200,
        overflow: 'hidden',
    },
    input: {
        height: 40,
        backgroundColor: "#ccc",
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '100%',
        color: 'black'
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
    link: {
        marginTop: 10,
        alignItems: "center",
    },
    linkText: {
        color: "#007bff",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
});

export default LoginScreen;
