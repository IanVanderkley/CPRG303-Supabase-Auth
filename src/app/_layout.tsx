import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native";

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

  const firstName = user?.user_metadata?.first_name;
  const displayName =
    typeof firstName === "string" && firstName.trim()
      ? firstName
      : user?.email ?? "User";

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
          options={{
            title: "Home",
            headerShown: true,
            headerTransparent: false,
            headerLargeTitle: false,
            headerRight: () => (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#333333",
                  maxWidth: 150,
                }}
              >
                Hi, {displayName}
              </Text>
            ),
          }}
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
