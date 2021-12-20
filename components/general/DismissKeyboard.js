import React from "react";
import { TouchableWithoutFeedback, Keyboard, Platform } from "react-native";

export default function DismissKeyboard({ children }) {
  return (
    <TouchableWithoutFeedback disabled={Platform.OS === "web"} onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
}
