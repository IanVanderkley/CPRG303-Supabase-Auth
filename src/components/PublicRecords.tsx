import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { supabase } from "../lib/supabase";

type DemoRecord = {
  id: number;
  title: string;
  description: string;
};

export default function PublicRecords() {
  const [records, setRecords] = useState<DemoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRecords() {
      try {
        const { data, error } = await supabase
          .from("demo")
          .select("id, title, description")
          .order("id");

        if (error) {
          setErrorMessage("Unable to load public information.");
        } else {
          setRecords(data ?? []);
        }
      } catch {
        setErrorMessage("Could not connect to Supabase.");
      } finally {
        setLoading(false);
      }
    }

    loadRecords();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Public Information</Text>

      {loading ? (
        <ActivityIndicator />
      ) : errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : records.length === 0 ? (
        <Text>No public records available.</Text>
      ) : (
        records.map((record) => (
          <View key={record.id} style={styles.record}>
            <Text style={styles.recordTitle}>{record.title}</Text>
            <Text style={styles.description}>{record.description}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  record: {
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 10,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666666",
  },
  error: {
    color: "#DC2626",
  },
});
