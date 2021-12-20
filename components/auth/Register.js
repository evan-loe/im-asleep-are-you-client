import React, { Component, createRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from "react-native";

import { theme } from "../theme/colors";

import DismissKeyboard from "../general/DismissKeyboard";
import { registerValidation } from "./Validation";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore/lite";

import { auth, db } from "../../firebase/firebase-config";

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

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.signUp = this.signUp.bind(this);
    this.handleSetState = this.handleSetState.bind(this);
    this.emailRef = createRef();
    this.passwordRef = createRef();
    this.confirmRef = createRef();
  }

  handleSetState(state, callback) {
    this.setState({ ...state, errors: [...state.errors], emptyFields: [...state.emptyFields] });
    console.log("handling setstate", state);
    console.log("update this state?", this.state);
    if (callback && typeof callback === "function") {
      callback();
    }
  }

  signUp() {
    const { email, password } = this.state;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() =>
        setDoc(doc(db, "users", this.state.username), {
          email: email,
          createdAt: new Date().toISOString(),
          userId: auth.currentUser.uid,
        })
      )
      .catch((err) => {
        if (err.message === "Firebase: Error (auth/email-already-in-use).") {
          this.setState({ ...this.state, errors: ["EMAIL_TAKEN", ...this.state.errors] });
        }
        console.log(err);
      });
  }

  render() {
    let usernameAlert = false,
      emailAlert = false,
      passwordAlert = false,
      confirmPasswordAlert = false;
    const { errors, emptyFields } = this.state;
    if (emptyFields.length || errors.length) {
      if (emptyFields.includes("EMPTY_EMAIL")) {
        emailAlert = <Text style={styles.text && styles.textAlert}>Please provide an email!</Text>;
      } else if (errors.includes("INVALID_EMAIL")) {
        emailAlert = <Text style={styles.textAlert}>Please provide a valid email!</Text>;
      } else if (errors.includes("EMAIL_TAKEN")) {
        emailAlert = <Text style={styles.textAlert}>Email is taken...hmmm was dat a typo?</Text>;
      }
      if (emptyFields.includes("EMPTY_PASSWORD")) {
        passwordAlert = <Text style={styles.textAlert}>Please provide a password!</Text>;
      } else if (errors.includes("PASSWORD_TOO_SHORT")) {
        passwordAlert = <Text style={styles.textAlert}>Please provide a longer password!</Text>;
      }
      if (emptyFields.includes("EMPTY_USERNAME")) {
        usernameAlert = <Text style={styles.textAlert}>Please provide a username!</Text>;
      } else if (errors.includes("USERNAME_TAKEN")) {
        usernameAlert = <Text style={styles.textAlert}>Sorry... username is taken ;w;</Text>;
      }
      if (errors.includes("PASSWORD_NO_MATCH")) {
        confirmPasswordAlert = <Text style={styles.textAlert}>Passwords don't match!</Text>;
      }
    }

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <TextInput
            style={styles.inputStyle}
            placeholder="username"
            autoCorrect={false}
            returnKeyType={this.state.hasEmpty ? "next" : "done"}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.state.hasEmpty
                ? this.emailRef.current.focus()
                : (this.setState({ ...this.state, disabled: true }),
                  registerValidation({
                    state: this.state,
                    onSetState: this.handleSetState,
                    onSignUp: this.signUp,
                  }));
            }}
            onChangeText={(username) =>
              this.setState({
                username,
                hasEmpty: username === "",
                errors: errors.filter((item) => item != "USERNAME_TAKEN"),
                emptyFields: emptyFields.filter((item) => item != "EMPTY_USERNAME"),
              })
            }
          />
          {usernameAlert}
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
                  registerValidation({
                    state: this.state,
                    onSetState: this.handleSetState,
                    onSignUp: this.signUp,
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
                  registerValidation({
                    state: this.state,
                    onSetState: this.handleSetState,
                    onSignUp: this.signUp,
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
          <TextInput
            ref={this.confirmRef}
            style={styles.inputStyle}
            placeholder="confirm password"
            secureTextEntry={true}
            autoCorrect={false}
            returnKeyType="done"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              this.setState({ ...this.state, disabled: true }, () => {
                registerValidation({
                  state: this.state,
                  onSetState: this.handleSetState,
                  onSignUp: this.signUp,
                });
              });
            }}
            selectTextOnFocus={true}
            onChangeText={(confirmPassword) =>
              this.setState({
                confirmPassword,
                hasEmpty: confirmPassword === "",
                errors: errors.filter((item) => item != "PASSWORD_NO_MATCH"),
                emptyFields,
              })
            }
          />
          {confirmPasswordAlert}
          <Pressable
            style={styles.button}
            onPress={() => {
              Keyboard.dismiss();
              this.setState({ ...this.state, disabled: true }, () => {
                registerValidation({
                  state: this.state,
                  onSetState: this.handleSetState,
                  onSignUp: this.signUp,
                });
              });
            }}
          >
            <Text style={styles.text}>{this.state.disabled ? "Registering" : "Register Me!"}</Text>
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

export default Register;
