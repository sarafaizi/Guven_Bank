import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from '@/context/ AuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler';



export const unstable_settings = {

  initialRouteName: '(tabs)',
};


SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const router = useRouter();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });



  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (

    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity
            onPress={router.back}>
            <Ionicons name="arrow-back" size={34} color={Colors.dark} style={{ right: 12 }}

            />

          </TouchableOpacity>
        )
      }} />
      <Stack.Screen name="signup"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} style={{ right: 12 }}

              />

            </TouchableOpacity>
          )
        }} />
      <Stack.Screen
        name="(authenticated)/(tabs)"
        options={{
          headerShown: false

        }} />
      <Stack.Screen
        name="(authenticated)/modals/account"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={router.back}>
              <Ionicons name="close-outline" size={34} color={Colors.primary} style={{ right: 12 }}
              />

            </TouchableOpacity>
          )
        }} />


      <Stack.Screen name="help" options={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity
            onPress={router.back}>
            <Ionicons name="arrow-back" size={34} color={Colors.dark} style={{ right: 12 }}

            />

          </TouchableOpacity>
        )
      }} />

    </Stack>
  )

}

const RootLayoutNav = () => {
  return (
    <>

      <AuthProvider>
        <InitialLayout />
      </AuthProvider>

    </>
  );


}
export default RootLayoutNav;







