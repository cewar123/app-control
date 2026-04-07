import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';
import Header from "../components/header";
import ShortInput from "../components/shortInput";
import LongInput from "../components/longInput";
import LongButton from "../components/longButton";


export default function AddUser(){
    return(
        <ScrollView style={styles.container}>
            <Header 
                text="AGREGAR USUARIO"/>

            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>DATOS DEL USUARIO</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.shortInputContainer}>
                    <ShortInput 
                        text="NOMBRE"
                        type="default"/>

                    <ShortInput 
                        text="APELLIDO"
                        type="default"/>
                </View>

                <LongInput 
                    type="numeric"
                    security={false}
                    text="CEDULA"/>
                
                <LongInput 
                    type="default"
                    security={false}
                    text="DIRECCIÓN"/>

                <LongInput 
                    type="phone-pad"
                    security={false}
                    text="TELÉFONO"/>

                <LongInput 
                    type="email-address"
                    security={false}
                    text="CORREO"/>

                <LongInput 
                    type="default"
                    security={true}
                    text="CONTRASEÑA"/>

                <LongButton 
                    text="CREAR USUARIO"/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBlockStart: Constants.statusBarHeight,
    },

    titleContainer: {
        alignItems: 'center',
        marginInline: 30,
        marginBlockStart: 100,
        zIndex: 2,
    },

    titleStyle: {
        fontFamily: 'LeagueSpartanBold',
        textAlign: 'center',
        color: '#324766',
        fontSize: 40
    },

    formContainer: {
        paddingInline: 35,
        zIndex: 2,
        marginBlockStart: 20,
    },

    shortInputContainer: {
        flexDirection: 'row',
        gap: 13,
    }
})