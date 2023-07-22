import { useEffect } from "react";
import { auth } from "../../../firebase"
import { StyleSheet, View, Text, Image } from "react-native";

const EntryPage = ({navigation}) => {
    console.log('Entry')

    useEffect(() => {
        const delay = setTimeout(() => {
            if (auth.currentUser) {
                navigation.replace("Home");
            } else {
                navigation.replace("Landing");
            }
        }, 2000);

        return () => clearTimeout(delay);
    });

    return (
        <View style={styles.container}>
            <Image source={require("../../../assets/logo.png")}/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default EntryPage