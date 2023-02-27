<script setup lang="ts">
import { app, getLastDocumentById, db } from "./firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { ref } from "vue";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

import Loading from './components/Loading.vue';

import type { Word } from './models/word';
import { WordType } from "./models/word_type";

const auth = getAuth(app);

enum LoginStatus {
  Loading,
  LoggedIn,
  LoggedOut
}

const loginStatus = ref<LoginStatus>(LoginStatus.Loading);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    loginStatus.value = LoginStatus.LoggedIn;
  } else {
    // User is not signed in.
    loginStatus.value = LoginStatus.LoggedOut;
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
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

const en = ref<string>("");
const tr = ref<string>("");
const searchWord = ref<string>("");

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


const foundWords = ref<Word[]>([]);
const selectedFoundWord = ref<Word>({} as Word);
const wordToBeUpdated = ref<Word>({} as Word);

const getDocumentByWord = async () => {
  foundWords.value = [];
  const q = await getDocs(query(collection(db, "words"), where("en", "==", searchWord.value)));

  q.docs.forEach(d => {
    foundWords.value.push({
      en: d.data().en,
      tr: d.data().tr,
      id: d.data().id,
      docId: d.id
    })
  })
}

const selectFoundWord = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  selectedFoundWord.value = foundWords.value.find(f => f.en === target.getAttribute("value"))!;
  wordToBeUpdated.value = { ...selectedFoundWord.value };
}

const updateWord = () => {
  updateDoc(doc(db, "words", selectedFoundWord.value.docId), {
    en: wordToBeUpdated.value.en,
    tr: wordToBeUpdated.value.tr
  })
}

const wordTypes = Object.keys(WordType).filter(x => !(parseInt(x) >= 0));

</script>

<template>
  <div class="container">
    <div v-if="loginStatus === LoginStatus.Loading">
      <Loading></Loading>
    </div>
    <div class="main" v-else-if="loginStatus === LoginStatus.LoggedIn">
      <div class="main-navbar">
        <RouterLink to="/">Home</RouterLink>
        <button @click="logout">Logout</button>
      </div>
      <div class="main-main">
        <div class="main-main-section">
          <div class="main-main-section-header">Add word</div>
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
        <div class="main-main-section">
          <div class="main-main-section-header">Edit word</div>
          <div>
            <div>
              <input type="text" placeholder="Enter word" v-model="searchWord">
              <button @click="getDocumentByWord">Search</button>
            </div>
            <div>
              <select name="found-words" id="found-words" multiple>
                <option v-for="foundWord in foundWords" :value="foundWord.en" @dblclick="selectFoundWord($event)">
                  {{ foundWord.en }} -> {{ foundWord.tr }}
                </option>
              </select>
              <hr>
              <div>Selected word: {{ selectedFoundWord.en }}</div>
              <div>
                <input type="text" v-model="wordToBeUpdated.en" placeholder="en">
              </div>
              <div>
                <input type="text" v-model="wordToBeUpdated.tr" placeholder="tr">
              </div>
              <div>
                <button @click="updateWord">Update</button>
              </div>
            </div>
            <div>
              <div v-for="wordType in wordTypes">
                <input :id="wordType" type="checkbox">
                <label :for="wordType">{{ wordType }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="login">
      <div class="login-header">
        Login
      </div>
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
  </div>
</template>

<style scoped lang="scss">
.container {
  background-color: darkcyan;
  width: 100%;
  height: 100%;
}

.main {
  width: 100%;
  height: 100%;

  &-navbar {
    width: 100%;
    height: 10%;
    background-color: blue;

    display: flex;
    align-items: center;
    /* justify-content: space-between; */
  }

  &-main {
    width: 100%;
    height: 90%;
    background-color: chartreuse;

    display: flex;
  }
}

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
}

.login-header {
  font-size: 32px;
  padding: 10px;
}
</style>