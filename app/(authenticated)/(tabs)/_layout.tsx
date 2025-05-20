
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { BlurView } from 'expo-blur'
import CustomHeader from '@/component/CustomHeader'

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarBackground: () => (
                    <BlurView
                        intensity={100}
                        tint={'extraLight'}
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                    />
                ),
                tabBarStyle: {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    elevation: 0,
                    borderTopWidth: 0,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    header: () => <CustomHeader />,
                    headerShadowVisible: false,
                    title: 'Home',
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome name="registered" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="crypto"

                options={{
                    title: 'Crypto',
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome name="bitcoin" size={size} color={color} />
                    ),

                    headerShown: false

                }}
            />

            <Tabs.Screen
                name="currency"
                options={{
                    headerStyle: {
                        backgroundColor: 'rgba(201, 200, 250, 0.7)',
                    },

                    title: 'Currency',
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome name="exchange" size={size} color={color} />
                    ),
                    headerShown: false

                }}
            />
            <Tabs.Screen
                name="Market"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome name="registered" size={size} color={color} />

                    ),
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="info"
                options={{
                    header: () => <CustomHeader />,
                    title: 'Information',
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome name="info" size={size} color={color} />

                    ),
                    headerTitle: '',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.background
                    },

                }}
            />
        </Tabs>
    );
};

export default _layout;

const styles = StyleSheet.create({});

