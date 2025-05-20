import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/ AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setToken, setName } = useAuth();
    const router = useRouter();

    const [fadeAnim] = useState(new Animated.Value(0)); // Animasyon için state
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

    const onSignIn = async () => {
        if (!email || !password) {
            setError('Please fill in both fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { token, expiresIn, name } = response.data;
            setToken(token);
            //setName(name);
            console.log(token);

            Alert.alert("Login Successful", `Welcome`);
            router.replace('/(authenticated)/(tabs)/home');

        } catch (error) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', error);
        }

        setLoading(false);
    };

    const animateError = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
    };

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
                <View style={styles.innerContainer}>
                    <Text style={styles.header}>Welcome Back!</Text>
                    <Text style={styles.descriptionText}>Please enter your credentials.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Gmail Address"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        onFocus={() => setError('')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        onFocus={() => setError('')}
                    />

                    {error && (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Text style={styles.errorText}>{error}</Text>
                        </Animated.View>
                    )}

                    <TouchableOpacity
                        style={[styles.pillButton, email && password ? styles.enabled : styles.disabled, { marginBottom: 20 }]}
                        onPress={onSignIn}
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer Text */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.replace('/signup')}>
                            <Text style={styles.signupText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background, // Soft background color
        paddingHorizontal: 20,
    },
    innerContainer: {
        width: '100%',
        maxWidth: 380,
        paddingHorizontal: 30,
        paddingVertical: 40,
        backgroundColor: 'white',
        borderRadius: 16,
        elevation: 5, // Android shadow
        shadowColor: 'black', // iOS shadow
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 18,
        color: Colors.primary, // Strong primary color
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.primaryMuted, // Light gray for description text
        marginBottom: 24,
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 16,
        borderRadius: 25,
        fontSize: 16,
        marginVertical: 12,
        width: '100%',
        borderColor: Colors.primary,
        borderWidth: 1, // Slight border for modern look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primary
    },
    errorText: {
        color: 'red',
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    pillButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    footerContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: Colors.primary
    },
    signupText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default LoginPage;
