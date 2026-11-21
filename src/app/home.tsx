
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

type DemoRecord = {
  id: number;
  title: string;
  description: string;
};

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const [records, setRecords] = useState<DemoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signOutError, setSignOutError] = useState("");

  const userId = user?.id;
  const firstName =
    typeof user?.user_metadata.first_name === "string"
      ? user.user_metadata.first_name
      : "";

  useEffect(() => {
    let active = true;

    if (!userId) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    async function loadProtectedRecords() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("demo")
        .select("id, title, description")
        .eq("is_public", false)
        .order("id");

      if (!active) {
        return;
      }

      if (error) {
        setErrorMessage("Unable to load protected records.");
        setRecords([]);
      } else {
        setRecords(data ?? []);
      }

      setIsLoading(false);
    }

    loadProtectedRecords();

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleSignOut() {
    setSignOutError("");
    setIsSigningOut(true);

    try {
      await signOut();
    } catch {
      setSignOutError("Unable to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Welcome{firstName ? `, ${firstName}` : ""}!
        </Text>

        <Text style={styles.subtitle}>
          You are successfully signed in.
        </Text>

        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Your Account</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <Text style={styles.sectionTitle}>Protected Records</Text>

        <Text style={styles.description}>
          These records are only available to authenticated users.
        </Text>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={styles.loading}
          />
        ) : errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : records.length === 0 ? (
          <Text>No protected records found.</Text>
        ) : (
          records.map((record) => (
            <View key={record.id} style={styles.record}>
              <Text style={styles.recordTitle}>{record.title}</Text>
              <Text style={styles.recordDescription}>
                {record.description}
              </Text>
            </View>
          ))
        )}

        {signOutError ? (
          <Text style={styles.errorText}>{signOutError}</Text>
        ) : null}

        <Pressable
          style={[
            styles.signOutButton,
            isSigningOut && styles.buttonDisabled,
          ]}
          onPress={() => {
            handleSignOut();
          }}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Out</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
  },
  accountSection: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    color: "#333333",
  },
  description: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 16,
  },
  loading: {
    marginTop: 24,
  },
  record: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  recordTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
  },
  recordDescription: {
    fontSize: 15,
    color: "#555555",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginTop: 12,
  },
  signOutButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
