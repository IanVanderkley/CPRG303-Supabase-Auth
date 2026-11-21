
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

import PublicRecords from "../components/PublicRecords";
import { useAuth } from "../contexts/AuthContext";
import { signUpSchema, type SignUpValues } from "../schemas/signup-schema";

type FormFieldProps = {
  control: Control<SignUpValues>;
  name: FieldPath<SignUpValues>;
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
            autoCapitalize={email || secure ? "none" : "words"}
            autoCorrect={false}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </>
      )}
    />
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({
    firstName,
    lastName,
    email,
    password,
  }: SignUpValues) {
    setErrorMessage("");

    try {
      const session = await signUp(
        email,
        password,
        firstName,
        lastName
      );

      if (session) {
        router.replace("/home");
      } else {
        router.replace({
          pathname: "/confirmation",
          params: {
            firstName,
            status: "check-email",
          },
        });
      }

    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (
          message.includes("already registered") ||
          message.includes("already exists")
        ) {
          setErrorMessage("This email may already be registered.");
        } else if (
          message.includes("weak password") ||
          message.includes("password should")
        ) {
          setErrorMessage("Please choose a stronger password.");
        } else if (
          message.includes("network") ||
          message.includes("failed to fetch")
        ) {
          setErrorMessage(
            "Network error. Check your internet connection."
          );
        } else if (
          message.includes("rate limit") ||
          message.includes("too many requests")
        ) {
          setErrorMessage(
            "Too many attempts. Please try again later."
          );
        } else {
          setErrorMessage(
            "Unable to create your account. Please try again."
          );
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
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Enter your information below.
        </Text>

        <FormField control={control} name="firstName" label="First Name" />
        <FormField control={control} name="lastName" label="Last Name" />
        <FormField control={control} name="email" label="Email" email />
        <FormField control={control} name="password" label="Password" secure />
        <FormField
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          secure
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => {
            handleSubmit(onSubmit)();
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.link}
          onPress={() => router.push("/sign-in")}
          disabled={isSubmitting}
        >
          <Text style={styles.linkText}>
            Already have an account? Sign In
          </Text>
        </Pressable>

        <PublicRecords />
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
    marginTop: 8,
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
