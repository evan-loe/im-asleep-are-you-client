import React, { Component, createRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import DismissKeyboard from "../general/DismissKeyboard";

import { theme } from "../theme/colors";

import { loginValidation } from "./Validation";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  errors: [],
  emptyFields: [],
  disabled: false,
  hasEmpty: true,
};

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleSetState = this.handleSetState.bind(this);
    this.login = this.login.bind(this);
    this.passwordRef = createRef();
  }

  handleSetState(state, callback) {
    this.setState({ ...state, errors: [...state.errors], emptyFields: [...state.emptyFields] });
    if (callback && typeof callback === "function") {
      callback();
    }
  }

  login() {
    const errors = [];
    const { email, password } = this.state;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => console.log("signed in"))
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          errors.push("INVALID_PASSWORD");
        }
        if (error.code === "auth/user-not-found") {
          errors.push("USER_NOT_FOUND");
        }
        this.setState({ ...this.state, errors: [...errors], disabled: false });
      });
  }

  render() {
    let emailAlert = false,
      passwordAlert = false;
    const { errors, emptyFields } = this.state;
    if (emptyFields.length || errors.length) {
      if (emptyFields.includes("EMPTY_EMAIL")) {
        emailAlert = <Text style={styles.text && styles.textAlert}>Please provide an email!</Text>;
      } else if (errors.includes("INVALID_EMAIL")) {
        emailAlert = <Text style={styles.textAlert}>Invalid email!</Text>;
      } else if (errors.includes("USER_NOT_FOUND")) {
        emailAlert = <Text style={styles.textAlert}>Could not find email!</Text>;
      }
      if (emptyFields.includes("EMPTY_PASSWORD")) {
        passwordAlert = <Text style={styles.textAlert}>Please provide a password!</Text>;
      } else if (errors.includes("INVALID_PASSWORD")) {
        passwordAlert = (
          <Text style={styles.textAlert}>
            Incorrect password..use a password manager if ur memory is this bad
          </Text>
        );
      }
    }
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <TextInput
            ref={this.emailRef}
            style={styles.inputStyle}
            placeholder="email"
            autoCorrect={false}
            returnKeyType={this.state.hasEmpty ? "next" : "done"}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.state.hasEmpty
                ? this.passwordRef.current.focus()
                : (this.setState({ ...this.state, disabled: true }),
                  loginValidation({
                    state: this.state,
                    onSetState: this.handleSetState,
                    onLogin: this.login,
                  }));
            }}
            keyboardType="email-address"
            onChangeText={(email) =>
              this.setState({
                email,
                hasEmpty: email === "",
                errors: errors.filter((item) => item != "EMAIL_TAKEN" && item != "INVALID_EMAIL"),
                emptyFields: emptyFields.filter((item) => item != "EMPTY_EMAIL"),
              })
            }
          />
          {emailAlert}
          <TextInput
            ref={this.passwordRef}
            style={styles.inputStyle}
            placeholder="password"
            secureTextEntry={true}
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.state.hasEmpty
                ? this.confirmRef.current.focus()
                : (this.setState({ ...this.state, disabled: true }),
                  loginValidation({
                    state: this.state,
                    onSetState: this.handleSetState,
                    onLogin: this.login,
                  }));
            }}
            selectTextOnFocus={true}
            onChangeText={(password) =>
              this.setState({
                password,
                hasEmpty: password === "",
                errors: errors.filter((item) => item != "PASSWORD_TOO_SHORT"),
                emptyFields: emptyFields.filter((item) => item != "EMPTY_PASSWORD"),
              })
            }
          />
          {passwordAlert}
          <Pressable
            style={styles.button}
            onPress={() => {
              Keyboard.dismiss();
              this.setState({ ...this.state, disabled: true }, () => {
                loginValidation({
                  state: this.state,
                  onSetState: this.handleSetState,
                  onLogin: this.login,
                });
              });
            }}
          >
            <Text style={styles.text}>{this.state.disabled ? "Logging In" : "Login In!"}</Text>
            {this.state.disabled && (
              <ActivityIndicator
                style={styles.loading}
                animating={this.state.disabled}
                size="small"
                color={theme.white}
              />
            )}
          </Pressable>
        </View>
      </DismissKeyboard>
    );
  }
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
  textAlert: {
    color: "#fc6449",
    fontSize: 20,
    lineHeight: 15,
    fontWeight: "600",
    letterSpacing: 0.25,
    marginTop: 12,
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
  },
  loading: {
    marginLeft: 20,
  },
});

export default Login;
