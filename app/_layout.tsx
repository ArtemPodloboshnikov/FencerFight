import { FG, SURFACE } from '@/constants';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { Provider } from 'jotai';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast } from 'react-native-toast-message';

export default function RootLayout() {
    useEffect(() => {
    if (!__DEV__) {
      (async () => {
        try {
          const { isAvailable } = await Updates.checkForUpdateAsync();
          if (isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        } catch (e) {
          console.log('Update check error:', e);
        }
      })();
    }
  }, []);
  const [loaded] = useFonts({
    IBMPlexSansRegular: require('../assets/fonts/IBMPlexSans-Regular.ttf'),
    IBMPlexSansMedium:  require('../assets/fonts/IBMPlexSans-Medium.ttf'),
    IBMPlexSansSemiBold:require('../assets/fonts/IBMPlexSans-SemiBold.ttf'),
    IBMPlexSansBold:    require('../assets/fonts/IBMPlexSans-Bold.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" translucent backgroundColor="transparent" />
      </ThemeProvider>
    <Toast config={{ info: (props)=><BaseToast {...props} style={{ height: 100, borderLeftColor: FG, backgroundColor: SURFACE }} /> }} />
    </Provider>
  );
}
