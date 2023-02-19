<script setup lang="ts">
import { ref } from 'vue';


import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit, documentId, where } from "firebase/firestore";

interface Word {
  en: string,
  tr: string,
  id: number
}

interface Question {
  context: Word,
  choices: Word[]
}

const name = ref<string>('isa samed');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARxPHJYjVLOJjq6lzxh9WZnh1vyYgtj04",
  authDomain: "langify-45b13.firebaseapp.com",
  projectId: "langify-45b13",
  storageBucket: "langify-45b13.appspot.com",
  messagingSenderId: "796821918654",
  appId: "1:796821918654:web:32e461599e0b15050edfef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

var lastId : number;

const q = query(collection(db, "words"), orderBy("id", "desc"), limit(1))

var words = [] as Word[];

const question = ref<Question>({} as Question);

getDocs(q).then((doc) => {
  lastId = doc.docs[0].data().id;
  nextQuestion();
});

const nextQuestion = () => {
  words = [];
  let docs = document.getElementsByClassName('choice');
  for (let i = 0; i < docs.length; i++) {
    docs[i].classList.remove('wrong')
    docs[i].classList.remove('correct')
  }
  generateRandomNumbers(lastId, 4).forEach(async n => {
    let word = await getWordById(n);
    words.push({
      en: word.data().en,
      tr: word.data().tr,
      id: word.data().id
    });
    question.value = generateQuestion(words);
  });
}

const generateRandomNumbers = (max: number, count: number): number[] => {
  const randomNumbers = [] as number[];

  while (randomNumbers.length < count) {
    let random = Math.floor(Math.random() * max);
    if (randomNumbers.includes(random)) {
      continue;
    }
    randomNumbers.push(random);
  }

  return randomNumbers;
}

const getWordById = async (id: number) => {
  const doc = await getDocs(
    query(collection(db, "words"), where("id", "==", id))
  );
  return doc.docs[0];
}

const generateQuestion = (words: Word[]) => {
  let randomNumbers = generateRandomNumbers(words.length, 1);
  return {
    context: words[randomNumbers[0]],
    choices: words
  } as Question;
}

const onChoiceMake = (event: MouseEvent) => {
  let target = event.target! as HTMLElement; 
  if (question.value.context.tr === target.innerHTML) {
    target.classList.add('correct')
    setTimeout(() => {
      nextQuestion();
    }, 350)
  } else {
    target.classList.add('wrong')
  }
}

</script>

<template>
  <div id="qbox" v-if="Object.keys(question).length > 0">
    <div id="word">
      {{ question.context.en }}
    </div>
    <div id="choices">
      <div class="choice" @click="onChoiceMake"  v-for="c in question.choices">{{ c.tr }}</div>
    </div>
  </div>
</template>

<style scoped>
  #qbox {
    width: 250px;
  }
  #word {
    padding: 15px;
    text-align: center;
  }
  #choices {
    display: flex;
    flex-direction: column;
  }
  .choice {
    background-color: lightblue;
    color: #121212;
    padding: 10px;
    margin: 10px;
    text-align: center;
    border-radius: 10px;
    transition: .35s ease;
  }
  .wrong {
    background-color: red;
    color: white;
  }
  .correct {
    background-color: greenyellow;
  }
  .choice:hover {
    cursor: pointer;
  }
</style>
