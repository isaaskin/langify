<script setup lang="ts">
import { app, getLastDocumentById, db } from "./firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore"; 
import { async } from "@firebase/util";

const auth = getAuth(app);
const isUserLoggedIn = ref<boolean>(false);


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    isUserLoggedIn.value = true;
    // ...
  } else {
    // User is not signed in.
    // ...
    isUserLoggedIn.value = false;
  }
});

const email = ref<string>('');
const password = ref<string>('');

const logout = () => {
  signOut(auth).then()
}

const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

const en = ref<string>('');
const tr = ref<string>('');

const addWord = () => {
  addDoc(collection(db, "words"), {
    en: en.value,
    tr: tr.value,
    id: lastDocId.value + 1
  }).then(docRef => {
    en.value = ''
    tr.value = ''
    loadLastDocId();
  })
}


const lastDocId = ref<number>(-1);

const loadLastDocId = async () => {
  lastDocId.value = await getLastDocumentById()
}

loadLastDocId();

</script>

<template>
  {{ lastDocId }}
  <div v-if="isUserLoggedIn">
    <button @click="logout">Logout</button>
    <div>
      <form @submit.prevent="addWord">
        <div>
          <input type="text" v-model="en" required placeholder="en" />
        </div>
        <div>
          <input type="text" v-model="tr" required placeholder="tr" />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  </div>
  <div v-else>
    <h2>Login</h2>
    <div>
      <form @submit.prevent="login">
        <div>
          <input type="email" v-model="email" required placeholder="Email" />
        </div>
        <div>
          <input type="password" v-model="password" required placeholder="Password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>