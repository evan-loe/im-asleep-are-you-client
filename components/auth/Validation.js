import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore/lite";

import { db } from "../../firebase/firebase-config";

function sleep(ms) {
  console.log("sleepin now for ", ms / 1000, " seconds");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function userOrEmailTaken(username, email) {
  await sleep(5000);
  let results = {
    usernameTaken: false,
    emailTaken: false,
  };

  const userSnap = await getDoc(doc(db, "users", username.toLowerCase()));
  results.usernameTaken = userSnap.exists();

  const qSnapEmail = await getDocs(
    query(collection(db, "users"), where("email", "==", email.toLowerCase()))
  );
  qSnapEmail.forEach((doc) => {
    results.emailTaken = results.emailTaken || doc.data().email == email.toLowerCase();
  });
  console.log(results);
  return results;
}

export async function registerValidation({ state, onSetState, onSignUp }) {
  console.log("validation info");
  const { email, password, confirmPassword, username } = state;
  const errors = [],
    emptyFields = [];

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // check valid email
  if (email === "") {
    emptyFields.push("EMPTY_EMAIL");
  }
  if (password === "") {
    emptyFields.push("EMPTY_PASSWORD");
  }
  if (username === "") {
    emptyFields.push("EMPTY_USERNAME");
  }
  if (!String(email).toLowerCase().match(emailRegex)) {
    console.log("invalid email");
    errors.push("INVALID_EMAIL");
  }
  // check valid passowrd
  if (password !== confirmPassword) {
    console.log("passwords don't match");
    errors.push("PASSWORD_NO_MATCH");
  }
  // check password length
  if (password.length < 5) {
    console.log("password too short");
    errors.push("PASSWORD_TOO_SHORT");
  }
  if (emptyFields.length || errors.length) {
    onSetState({ ...state, errors, emptyFields, disabled: false }, () =>
      console.log("new state", state)
    );
  } else {
    // check database for existing user
    console.log("checking db for user");
    userOrEmailTaken(state.username, state.email)
      .then((searchRes) => {
        if (searchRes.usernameTaken) {
          errors.push("USERNAME_TAKEN");
        }
        if (searchRes.emailTaken) {
          errors.push("EMAIL_TAKEN");
        }
        if (errors.length) {
          state = { ...state, errors, emptyFields };
          onSetState(
            {
              ...state,
              errors: [...errors],
              emptyFields: [...emptyFields],
            },
            () => console.log("After db update", state)
          );
        } else {
          console.log("creating new user");
          onSignUp();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("enabling", state);
        onSetState({
          ...state,
          disabled: false,
        });
      });
  }
}

export async function loginValidation({ state, onSetState, onLogin }) {
  console.log("validation info");
  const { email, password } = state;
  const errors = [],
    emptyFields = [];

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // check valid email
  if (email === "") {
    emptyFields.push("EMPTY_EMAIL");
  }
  if (password === "") {
    emptyFields.push("EMPTY_PASSWORD");
  }
  if (!String(email).toLowerCase().match(emailRegex)) {
    errors.push("INVALID_EMAIL");
  }
  if (emptyFields.length || errors.length) {
    onSetState({ ...state, errors, emptyFields, disabled: false }, () =>
      console.log("new state", state)
    );
  } else {
    onLogin();
  }
}
