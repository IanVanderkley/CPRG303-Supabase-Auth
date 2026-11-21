# Supabase Authentication

CPRG 303 – Mobile Application Development

A React Native authentication app built with Expo and TypeScript. The app uses Supabase to handle user registration, sign-in, sign-out, and session management.

React Hook Form and Zod are used for form validation, while Expo Router and React Context manage navigation and authentication state.

## Features

- Create an account using a first name, last name, email, and password.
- Sign in and sign out using Supabase Authentication.
- Display registration errors, validation messages, and loading indicators.
- Support email verification during registration.
- Keep users signed in when the app restarts.
- Protect the Home screen from unauthenticated users.
- Display the signed-in user's name and email.
- Retrieve public and protected records from Supabase using Row Level Security (RLS).

## Run the Project

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root with your Supabase project credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_publishable_key
```

Start the app:

```bash
npx expo start
```

Open the app using Expo Go or an emulator.

The Supabase project must have a `demo` table with the appropriate Row Level Security policies configured for public and authenticated access.

Do not commit your `.env` file to GitHub.

## Technologies

- React Native and Expo
- TypeScript
- Supabase Authentication and Database
- React Hook Form
- Zod
- Expo Router
- React Context
- AsyncStorage

## AI Usage

See [Ai-usage.md](Ai-usage.md) for AI assistance disclosure.