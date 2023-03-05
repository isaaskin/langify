<script setup lang="ts">
import { ref } from 'vue';

import { getFirestore, collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { app } from "./firestore";
import Loading from "./components/Loading.vue";
import { WordTypeMap } from './models/word_type';
import type { Word } from "./models/word";

interface Question {
  context: Word,
  choices: Word[]
}

const db = getFirestore(app);
const isLoading = ref<boolean>(true);

const askedQuestionsId = ref<number[]>([]);

var lastId: number;

const q = query(collection(db, "words"), orderBy("id", "desc"), limit(1))

var words = [] as Word[];

const question = ref<Question>({} as Question);

// Temp solution
const randomOverlapCount = ref<number>(0);
const randomLimit = 200;

getDocs(q).then((doc) => {
  lastId = doc.docs[0].data().id;
  nextQuestion();
});

const nextQuestion = () => {
  isLoading.value = true;

  words = [] as Word[];
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
      id: word.data().id,
      type: word.data().type,
      docId: word.id
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
  console.log("qqqqq")
  isLoading.value = false;

  let randomNumbers = generateRandomNumbers(words.length, 1);

  while(askedQuestionsId.value.includes(randomNumbers[0])) {
    if (randomOverlapCount.value > randomLimit) {
      break;
    }
    randomOverlapCount.value++;
    randomNumbers = generateRandomNumbers(words.length, 1);
  }

  randomOverlapCount.value = 0;
  askedQuestionsId.value.push(randomNumbers[0]);

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
  <div class="container">
    <div v-if="isLoading">
      <Loading></Loading>
    </div>
    <div v-else>
      <div class="qbox" v-if="Object.keys(question).length > 0">
        <div class="qbox-info">
          <div class="qbox-info-light"
          v-for="value, key in WordTypeMap"
          :class="{active: key === question.context.type}">
            <i>{{ value.shortName }}</i>
          </div>
        </div>
        <div class="qbox-word">
          {{ question.context.en }}
        </div>
        <div class="qbox-choices">
          <div class="qbox-choices-choice" @click="onChoiceMake" v-for="c in question.choices">{{ c.tr }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;

  background-color: darkblue;

  display: flex;
  justify-content: center;
  align-items: center;

  .qbox {
    width: 400px;
    height: 300px;

    &-info {
      display: flex;
      justify-content: space-around;

      &-light {
        padding: 10px;
        text-align: center;
        opacity: 0.1;
        color: ghostwhite;

        &.active {
          opacity: 1.0;
          color: greenyellow;
        }
      }
    }

    &-word {
      padding: 15px;
      text-align: center;
    }

    &-choices {
      display: flex;
      flex-direction: column;

      &-choice {
        background-color: lightblue;
        color: #121212;
        padding: 10px;
        margin: 10px;
        text-align: center;
        border-radius: 10px;
        transition: .35s ease;

        &:hover {
          cursor: pointer;
        }

        &.correct {
          background-color: greenyellow;
        }

        &.wrong {
          background-color: red;
          color: white;
        }
      }
    }
  }
}
</style>
