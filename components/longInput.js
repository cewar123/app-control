import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import EyeOpen from './icons/EyeOpen.jsx';
import EyeClosed from './icons/EyeClosed.jsx';

export default function LongInput({type, security, text, value, onChangeText}) {
    const [isPassword, setPassword] = useState(security);
    const EyeIcon = isPassword ? EyeClosed : EyeOpen;

    return (
        <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>{text}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputStyle}
                    keyboardType={type}
                    secureTextEntry={isPassword}
                    value={value}
                    onChangeText={onChangeText}/>

                {security && (
                    <Pressable
                        onPress={() => setPassword(!isPassword)}
                    >
                        <EyeIcon />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        marginBlockStart: 10,
    },

    textStyle: {
        fontFamily: 'LeagueSpartanBold',
        fontSize: 16,
        paddingInlineStart: 5,
        paddingBlockEnd: 5,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 6,
        width: '100%',
        height: 50,
        paddingInlineEnd: 40,
        paddingInlineStart: 10,
    },

    inputStyle: {
        width: '100%',
    }
})