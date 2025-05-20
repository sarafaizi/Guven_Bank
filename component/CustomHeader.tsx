import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/ AuthContext'
import { Link } from 'expo-router';

const CustomHeader = () => {
    const { token } = useAuth();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const getname = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setName(data.name);
                setSurname(data.surname);
                console.log(data.name);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (token) {
            getname();
        }
    }, [token]);

    return (
        <BlurView intensity={80} tint="extraLight" style={{ paddingTop: 40 }}>
            <View style={styles.container}>
                <Link href={"/(authenticated)/modals/account"} asChild>
                    <TouchableOpacity style={styles.roundBtn}>
                        <Text style={{ color: Colors.primary, fontWeight: '500', fontSize: 17 }}>
                            {name} {surname}
                        </Text>
                    </TouchableOpacity>
                </Link>

            </View>
        </BlurView>
    );
};

export default CustomHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        height: 60,
        backgroundColor: 'transparent'
    },
    roundBtn: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: Colors.primaryMuted,
        justifyContent: 'center', // Text'i ortalamak için
        alignItems: 'center', // Text'i ortalamak için
        right: 160,
        bottom: -18,
        borderWidth: 1,
        borderColor: Colors.primary
    },
});
