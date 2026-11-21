
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  Controller,
  useForm,
  type Control,
  type FieldPath,
} from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { signInSchema, type SignInValues } from "../schemas/signin-schema";

type FormFieldProps = {
  control: Control<SignInValues>;
  name: FieldPath<SignInValues>;
  label: string;
  secure?: boolean;
  email?: boolean;
};

function FormField({ control, name, label, secure, email }: FormFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder={label}
            accessibilityLabel={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secure}
            keyboardType={email ? "email-address" : "default"}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </>
      )}
    />
  );
}

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: SignInValues) {
    setErrorMessage("");

    try {
      await signIn(email, password);
      // AuthContext updates the session after a successful sign-in.
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes("invalid login credentials")) {
          setErrorMessage("Incorrect email or password.");
        } else if (message.includes("email not confirmed")) {
          setErrorMessage("Please confirm your email before signing in.");
        } else if (
          message.includes("network") ||
          message.includes("failed to fetch")
        ) {
          setErrorMessage("Network error. Check your internet connection.");
        } else {
          setErrorMessage("Unable to sign in. Please try again.");
        }
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Enter your email and password to continue.
        </Text>

        <FormField control={control} name="email" label="Email" email />
        <FormField
          control={control}
          name="password"
          label="Password"
          secure
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <Pressable
        style={styles.link}
        onPress={() => {
            if (router.canGoBack()) {
            router.back();
            } else {
            router.replace("/");
            }
        }}
        disabled={isSubmitting}
        >
        <Text style={styles.linkText}>
            Don't have an account? Sign Up
        </Text>
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
    justifyContent: "center",
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
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 6,
  },
  button: {
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
  link: {
    alignItems: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#2563EB",
    fontSize: 15,
  },
});
