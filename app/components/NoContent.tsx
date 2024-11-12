import { View, Text, StyleSheet, Image } from "react-native"

type NoContentViewProps = {
    text: string
}

export const NoContent = ({ text }: NoContentViewProps) => {
    return (
        <View style={styles.offlineContainer}>
            <Image
                style={styles.noContent}
                source={require("../assets/images/no-content.png")}
            />
            <Text style={styles.offlineText}>{text}</Text>
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
    noContent: {
        opacity: 0.5
    }
})