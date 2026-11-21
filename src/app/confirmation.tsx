
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ConfirmationScreen() {
  const router = useRouter();
  const { firstName, status } = useLocalSearchParams<{
    firstName?: string;
    status?: string;
  }>();

  const needsConfirmation = status === "check-email";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {needsConfirmation ? "Check Your Email" : "Account Created!"}
      </Text>

      <Text style={styles.message}>
        {needsConfirmation
          ? `Thank you${firstName ? `, ${firstName}` : ""}! Check your email for a confirmation link. Verify your account before signing in.`
          : `Welcome${firstName ? `, ${firstName}` : ""}! Your account has been created and you're signed in.`}
      </Text>

      {needsConfirmation && (
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/sign-in")}
        >
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    color: "#333333",
    lineHeight: 26,
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
