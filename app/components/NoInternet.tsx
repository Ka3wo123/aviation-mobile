import { View, Text, StyleSheet, Image } from "react-native"

type NoInternetViewProps = {
    text: string
}

export const NoInternetView = ({ text }: NoInternetViewProps) => {
    return (
        <View style={styles.offlineContainer}>
            <Image
                    source={require("../assets/images/no-wifi.png")}
                />
            <Text style={styles.offlineText}>You are offline. {text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    offlineContainer: {
        
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B9B9B9',
        padding: 20,
        marginBottom: 10
    },
    offlineText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
})