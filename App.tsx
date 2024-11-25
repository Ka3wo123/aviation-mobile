import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/AuthContext";
import AppNavigator from "./app/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
