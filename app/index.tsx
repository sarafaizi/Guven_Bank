import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAssets } from 'expo-asset'
import { ResizeMode, Video } from 'expo-av'
import { Link } from 'expo-router'
import { defaultStyles } from '@/constants/Styles'
import Colors from '@/constants/Colors'

const Page = () => {
    const [assets] = useAssets([require('@/assets/videos/3669508649-preview.mp4')])
    return (
        <View style={styles.container}>
            {
                assets && (
                    <Video
                        resizeMode={ResizeMode.COVER}
                        isMuted
                        isLooping
                        shouldPlay
                        source={{ uri: assets[0].uri }}
                        style={styles.video}
                    />
                )

            }
            <View style={{ marginTop: 80, padding: 20 }}>
                <Text style={styles.header} >Welcome To        the App!</Text>
            </View>
            <View style={styles.buttons}>
                <Link href={'/login'} style={[defaultStyles.pillButton, { flex: 1, backgroundColor: '#fff' }]} asChild>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 22, fontWeight: '400' }}>Login in</Text>
                    </TouchableOpacity>
                </Link>
                <Link href={'/signup'} style={[defaultStyles.pillButton, { flex: 1, backgroundColor: '#fff' }]} asChild>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 22, fontWeight: '400' }}>Sign up</Text>
                    </TouchableOpacity>
                </Link>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',


    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    header: {
        fontSize: 35,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: "white"
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 45,
        color: "white",
        paddingHorizontal: 20
    }
})




export default Page

