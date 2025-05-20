import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/ AuthContext'

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0)); // Animasyon için state
    const router = useRouter();
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

    const onSignUp = async () => {
        if (!name || !surname || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "User registered successfully!");
                //router.replace('/login');
            } else {
                setError(data.message || 'An error occurred');
            }
        } catch (error) {
            setError('Network error. Please try again.');
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
                <View style={styles.innerContainer}>
                    <Text style={styles.header}>Create Your Account</Text>
                    <Text style={styles.descriptionText}>Please enter your information.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Surname"
                        value={surname}
                        onChangeText={(text) => setSurname(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Gmail Address"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />

                    {error && (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Text style={styles.errorText}>{error}</Text>
                        </Animated.View>
                    )}

                    <TouchableOpacity
                        style={[styles.pillButton, name && surname && email && password ? styles.enabled : styles.disabled]}
                        onPress={onSignUp}
                        disabled={loading || !name || !surname || !email || !password}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Text style={styles.signupText}>Login</Text>
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
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
    },
    innerContainer: {
        width: '100%',
        maxWidth: 380,
        paddingHorizontal: 30,
        paddingVertical: 40,
        backgroundColor: 'white',
        borderRadius: 16,
        elevation: 5,
        shadowColor: 'black',
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
        color: Colors.primary,
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.primaryMuted,
        marginBottom: 24,
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 16,
        borderRadius: 25,
        fontSize: 16,
        marginVertical: 10,
        width: '100%',
        borderColor: Colors.primary,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
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

export default SignUpPage;
