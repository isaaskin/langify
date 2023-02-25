<script setup lang="ts">
import { ref } from 'vue';

import { getFirestore, collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { app } from "./firestore";
import Loading from "./components/Loading.vue";

interface Word {
  en: string,
  tr: string,
  id: number
}

interface Question {
  context: Word,
  choices: Word[]
}

const db = getFirestore(app);
const isLoading = ref<boolean>(true);

var lastId: number;

const q = query(collection(db, "words"), orderBy("id", "desc"), limit(1))

var words = [] as Word[];

const question = ref<Question>({} as Question);

getDocs(q).then((doc) => {
  lastId = doc.docs[0].data().id;
  nextQuestion();
});

const nextQuestion = () => {
  isLoading.value = true;

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
  isLoading.value = false;

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
  <div id="container">
    <div v-if="isLoading">
      <Loading></Loading>
    </div>
    <div v-else>
      <div id="qbox" v-if="Object.keys(question).length > 0">
        <div id="word">
          {{ question.context.en }}
        </div>
        <div id="choices">
          <div class="choice" @click="onChoiceMake" v-for="c in question.choices">{{ c.tr }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

#qbox {
  width: 400px;
  height: 300px;
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
