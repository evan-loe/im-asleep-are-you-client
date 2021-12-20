// import React, { Component } from "react";
// import { StyleSheet, Text, View } from "react-native";

// import { Button, TextInput } from "react-native-web";

// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { collection, getDoc, doc, setDoc } from "firebase/firestore/lite";

// import { auth, db } from "../../firebase/firebase-config";

// const initialState = {
//   email: "",
//   password: "",
//   confirmPassword: "",
//   username: "",
//   errors: [],
//   emptyFields: [],
//   disabled: false,
// };

// export class Register extends Component {
//   constructor(props) {
//     super(props);

//     this.state = initialState;

//     this.onSignUp = this.signUp.bind(this);
//     this.validateInfo = this.validateInfo.bind(this);
//   }

//   signUp() {
//     const { email, password } = this.state;
//     createUserWithEmailAndPassword(auth, email, password)
//       .then(() =>
//         setDoc(doc(db, "users", this.state.username), {
//           email: email,
//           createdAt: new Date().toISOString(),
//           userId: auth.currentUser.uid,
//         })
//       )
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   async userTaken(username) {
//     const userRef = doc(db, "users", username);
//     const userSnap = await getDoc(userRef);
//     return userSnap.exists();
//   }

//   validateInfo() {
//     if (this.state.disabled) {
//       return;
//     } else {
//       this.setState({
//         ...this.state,
//         disabled: true,
//       });
//     }
//     const { email, password, confirmPassword, username } = this.state;
//     let errorsList = [],
//       emptyFieldsList = [];

//     const emailRegex =
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//     // check valid email
//     if (email === "") {
//       emptyFieldsList.push("EMPTY_EMAIL");
//     }
//     if (password === "") {
//       emptyFieldsList.push("EMPTY_PASSWORD");
//     }
//     if (username === "") {
//       emptyFieldsList.push("EMPTY_USERNAME");
//     }
//     if (!String(email).toLowerCase().match(emailRegex)) {
//       console.log("invalid email");
//       errorsList.push("INVALID_EMAIL");
//     }
//     // check valid passowrd
//     if (password !== confirmPassword) {
//       console.log("passwords don't match");
//       errorsList.push("PASSWORD_NO_MATCH");
//     }
//     // check password length
//     if (password.length < 5) {
//       console.log("password too short");
//       errorsList.push("PASSWORD_TOO_SHORT");
//     }
//     if (emptyFieldsList.length || errorsList.length) {
//       console.log("updating lol");
//       console.log("before", this.state);
//       this.setState(
//         {
//           errors: [...errorsList],
//           emptyFields: emptyFieldsList,
//           ...this.state,
//         },
//         () => console.log("after", this.state)
//       );
//     } else {
//       // check database for existing user
//       console.log("checking db for user");
//       if (this.userTaken(this.state.username)) {
//         errorsList.push("USERNAME_TAKEN");
//         console.log(...errorsList);
//         this.setState(
//           {
//             ...this.state,
//             errors: ["errorlol"],
//             emptyFields: ["this stateafs"],
//           },
//           () => console.log(this.state)
//         );
//       } else {
//         console.log("no user exists, creating user!");
//         this.onSignUp();
//       }
//       // const docRef = doc(db, "users");
//       // const docSnap = await getDoc(docRef);
//       // if (docSnap.exists()) {
//       //   console.log("Document data", docSnap.data());
//       // } else {
//       //   console.log("No such document");
//       // }

//       // db.collection("users")
//       //   .doc(username)
//       //   .get()
//       //   .then((snapshot) => {
//       //     if (snapshot.exists) {
//       //       console.log("no user exists, creating user!");
//       //       this.onSignUp();
//       //     } else {
//       //       this.setState({
//       //         ...this.state,
//       //         errors: errors.push("USERNAME_TAKEN"),
//       //       });
//       //     }
//       //   });
//       this.setState({
//         ...this.state,
//         disabled: false,
//       });
//     }
//   }

//   render() {
//     let usernameAlert = false,
//       emailAlert = false,
//       passwordAlert = false,
//       confirmPasswordAlert = false;
//     const { errors, emptyFields } = this.state;

//     if (emptyFields.length) {
//       if (emptyFields.includes("EMPTY_EMAIL")) {
//         emailAlert = (
//           <Text style={styles.textAlert}>Please provide an email!</Text>
//         );
//       }
//       if (emptyFields.includes("EMPTY_PASSWORD")) {
//         passwordAlert = (
//           <Text style={styles.textAlert}>Please provide a password!</Text>
//         );
//       }
//       if (emptyFields.includes("EMPTY_USERNAME")) {
//         usernameAlert = (
//           <Text style={styles.textAlert}>Please provide a username!</Text>
//         );
//       }
//     } else if (errors.length) {
//       if (errors.includes("INVALID_EMAIL")) {
//         emailAlert = (
//           <Text style={styles.textAlert}>Please provide a valid email!</Text>
//         );
//       }
//       if (errors.includes("USERNAME_TAKEN")) {
//         usernameAlert = (
//           <Text style={styles.textAlert}>Sorry... username is taken ;w;</Text>
//         );
//         this.setState({
//           ...this.state,
//           username: "",
//         });
//       }
//       if (errors.includes("PASSWORD_TOO_SHORT")) {
//         passwordAlert = (
//           <Text style={styles.textAlert}>
//             Please provide a longer password!
//           </Text>
//         );
//       }
//       if (errors.includes("PASSWORD_NO_MATCH")) {
//         confirmPasswordAlert = (
//           <Text style={styles.textAlert}>Passwords don't match!</Text>
//         );
//       }
//     }
//     return (
//       <View>
//         <TextInput
//           placeholder="username"
//           onChangeText={(username) => this.setState({ username })}
//         />
//         {usernameAlert}
//         <TextInput
//           placeholder="email"
//           onChangeText={(email) => this.setState({ email })}
//         />
//         {emailAlert}
//         <TextInput
//           placeholder="password"
//           secureTextEntry={true}
//           onChangeText={(password) => this.setState({ password })}
//         />
//         {passwordAlert}
//         <TextInput
//           placeholder="confirm password"
//           secureTextEntry={true}
//           onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
//         />
//         {confirmPasswordAlert}
//         <Button
//           onPress={this.validateInfo}
//           disabled={this.state.disabled}
//           title={this.state.disabled ? "Registering..." : "Register Me!"}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   textAlert: {},
// });

// export default Register;
