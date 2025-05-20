
import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/ AuthContext'
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const Account = () => {
    const { token, setToken } = useAuth();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        loadStoredImage();
    }, []);

    useEffect(() => {
        if (token) {
            getProfile();
        }
    }, [token]);

    const getProfile = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (data && data.name) {
                setName(data.name);
                setSurname(data.surname);
            } else {
                console.error("Invalid API response format");
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const loadStoredImage = async () => {
        try {
            const storedImage = await AsyncStorage.getItem('profileImage');
            if (storedImage) {
                setImageUri(storedImage);
            }
        } catch (error) {
            console.error('Error loading image from storage:', error);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0 && result.assets[0].uri) {
            const selectedImageUri = result.assets[0].uri;
            setImageUri(selectedImageUri);
            saveImageToStorage(selectedImageUri);
        }
    };

    const saveImageToStorage = async (uri: string) => {
        try {
            await AsyncStorage.setItem('profileImage', uri);
            console.log('Image saved to storage:', uri);
        } catch (error) {
            console.error('Error saving image to storage:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            setToken(null);
            router.replace('/')
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    const Help = () => {
        router.replace('/help');
    }
    const account = () => {
        router.replace('/info')
    }

    return (
        <BlurView tint={'regular'} intensity={180} style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.profileImage} />
                    ) : (
                        <Text style={styles.noImageText}>No image selected</Text>
                    )}
                </TouchableOpacity>

                {token && (
                    <View style={styles.infoRow}>
                        <Text style={styles.nameText}>{name} {surname}</Text>
                    </View>
                )}

                <Button title="Pick an image" onPress={pickImage} />
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.btn} onPress={logout}>
                    <Ionicons name="log-out" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => account()}>
                    <Ionicons name="person" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => Help()}>
                    <Ionicons name="bulb" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Learn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}>
                    <Ionicons name="megaphone" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18, flex: 1 }}>Inbox</Text>
                    <View
                        style={{
                            backgroundColor: Colors.primary,
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            justifyContent: 'center',
                        }}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>14</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'white',
    },
    noImageText: {
        fontSize: 16,
        color: 'white',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    nameText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    actions: {
        width: '100%',
        backgroundColor: 'rgba(256, 256, 256, 0.1)',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(256, 256, 256, 0.2)',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        flex: 1,
    },
    notificationBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default Account;

