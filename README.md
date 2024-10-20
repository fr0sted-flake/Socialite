# Socialite

Socialite is an event management system with a React Native mobile application and a Node.js backend using express. Users can create, manage, and register for events through the mobile app. Users also has an option to add friends. The backend provides APIs for user authentication, event management, and more.

## Hosted Backend

The backend is hosted on Vercel. You can access the API at:

- **Backend URL**: [Hosted Backend](https://socialite-gamma.vercel.app/)

## Features

- User Authentication (JWT-based)
- Event Creation, Editing, and Deletion
- Search Events by Title
- Registration for Events
- Secure API endpoints
- Friend Management System
  - Add friends
  - Remove friends
  - View friend list
- AI-powered Chatbot
  - Provides information about events

## Prerequisites

- Node.js (v14 or later)
- npm or yarn (for package management)
- Expo CLI (for running the React Native app)

## Getting Started

### 1. Clone the Repository and navigate to Socialite

```
git clone https://github.com/fr0sted-flake/Socialite.git
```
```
cd Socialite
```

### 2. Navigate to backend directory, install dependencies, set up your dotenv and then run the server
```
cd backend
```

### 3. Set up your .env in root directory and then run the server
```
npm run dev
```

### 4. Navigate to socialite directory, install dependencies and then start the react native application
```
cd socialite
```
```
npm install
npm start
```
#### Now install Expo Go on your mobile and scan the QR code to run it