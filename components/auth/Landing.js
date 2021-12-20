import React, { Component } from "react";
import { Text, StyleSheet, View, Button, Pressable } from "react-native";

import { theme } from "../theme/colors";

export default function Landing({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.text}>Register</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.light_pink,
    alignItems: "center",
    justifyContent: "center",
  },
  inputStyle: {
    marginTop: 20,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: theme.alabaster,
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: theme.white,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
    backgroundColor: theme.mountbatten_pink,
    marginTop: 30,
    flexDirection: "row",
    width: 150,
  },
  loading: {
    marginLeft: 20,
  },
});
