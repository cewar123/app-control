import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';
import Header from "../components/header";
import SearchBar from "../components/searchBar";
import UserCard from '../components/userCard';

const userData = {ID: "123456789", name: "JOHN DOE", phoneNumber: "987654321", address: "Puerto Ordaz, Av las americas", email: "email@example.com"}

export default function ManageUsers() {
    return(
        <ScrollView style={styles.container}>
            <Header 
                text="GESTIONAR USUARIOS"/>

            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>LISTA DE USUARIOS</Text>
                
                <SearchBar 
                    text="Buscar..."/>
            </View>

            <View style={styles.usersContainer}>
                <UserCard 
                    userData={userData}/>
                <UserCard 
                    userData={userData}/>
                <UserCard 
                    userData={userData}/>
                <UserCard 
                    userData={userData}/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBlockStart: Constants.statusBarHeight,
    },

    titleContainer: {
        flex: 1,
        alignItems: 'center',
        marginInline: 70,
        marginBlockStart: 100,
        gap: 20,
        zIndex: 2,
    },

    titleStyle: {
        fontFamily: 'LeagueSpartanBold',
        textAlign: 'center',
        color: '#324766',
        fontSize: 40
    },

    usersContainer: {
        marginInline: 30,
        backgroundColor: '#fff',
        borderColor: '#31587A',
        borderRadius: 8,
        borderWidth: 3,
        overflow: 'hidden',
        zIndex: 2,
    }
})