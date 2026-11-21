
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { AuthProvider, useAuth } from "../contexts/AuthContext";

// Keep the splash screen visible while restoring the session.
SplashScreen.preventAutoHideAsync();

function SplashScreenController() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}

function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!user} redirectTo="/home">
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="confirmation"
          options={{ title: "Confirmation" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!!user} redirectTo="/">
        <Stack.Screen
          name="home"
          options={{ headerShown: false }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  );
}
