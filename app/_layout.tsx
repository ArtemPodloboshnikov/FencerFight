import { ACCENT, FG, SURFACE } from '@/constants';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'jotai';
import 'react-native-reanimated';
import Toast, { BaseToast } from 'react-native-toast-message';

export default function RootLayout() {
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
    <Toast config={{
      info: (props)=><BaseToast
                    {...props}
                    style={{ height: 100, borderLeftColor: FG, backgroundColor: SURFACE }}
                    text1Style={[{ color: ACCENT, fontSize: 15, fontFamily: "IBMPlexSansMedium" }, props.text1Style]}
                    text2Style={[{ color: FG, fontSize: 15, fontFamily: "IBMPlexSansMedium" }, props.text2Style]}
                    />,
      success: (props)=><BaseToast
                        {...props}
                        style={{ backgroundColor: SURFACE, borderLeftColor: FG }}
                        text1Style={{ fontSize: 15, fontFamily: "IBMPlexSansMedium", color: FG }}
                        text2Style={{ fontSize: 15, fontFamily: "IBMPlexSansMedium", color: FG }}
                        />,
      error: (props)=><BaseToast
                      {...props}
                      style={{ backgroundColor: SURFACE, borderLeftColor: ACCENT }}
                      text1Style={{ fontSize: 15, fontFamily: "IBMPlexSansMedium", color: ACCENT }}
                      text2Style={{ fontSize: 15, fontFamily: "IBMPlexSansMedium", color: FG }}
                      /> }}
    />
    </Provider>
  );
}
