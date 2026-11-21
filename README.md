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
- Display the signed-in user's name and email in the navigation bar.
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

Do not commit your `.env` file to GitHub.

## Supabase Setup

The project uses Supabase Authentication with email and password sign-in.

A table named `demo` was created in the public schema with the following columns:

- `id` – Primary key
- `title` – Record title
- `description` – Record description
- `is_public` – Determines whether a record is public

The table contains four sample records: two public records and two protected records.

Row Level Security (RLS) is enabled with SELECT policies that allow:

- Anonymous users to read only records where `is_public` is true.
- Authenticated users to read all records.

Public records appear on the Sign-Up screen, while protected records appear on the authenticated Home screen.

## Testing

Users can create an account using the Sign-Up screen, confirm their email if required, and sign in to access the protected Home screen.

No shared test account credentials are included. A new account can be created for testing.

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