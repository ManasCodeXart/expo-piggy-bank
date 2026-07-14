import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {

   
  const [fontsLoaded] = useFonts({
    
  })

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 500, gestureEnabled: true }} />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})