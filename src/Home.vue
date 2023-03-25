<script setup lang="ts">
import { ref } from 'vue';

import { getFirestore, collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { app } from "./firestore";
import Loading from "./components/Loading.vue";
import { WordTypeMap } from './models/word_type';
import type { Word } from "./models/word";
import { generateRandomNumbers, shuffleArray } from './helpers';

interface Question {
  context: Word,
  choices: Word[]
}

const db = getFirestore(app);
const isLoading = ref<boolean>(true);

const askedQuestionsIDs = ref<number[]>([]);

var lastId: number;
var words = [] as Word[];

const question = ref<Question>({} as Question);

const q = query(collection(db, "words"), orderBy("id", "desc"), limit(1))
getDocs(q).then((doc) => {
  lastId = doc.docs[0].data().id;
  nextQuestion();
});

const isError = ref<boolean>(false);

const isShownOriginal = ref<boolean[]>([false, false, false, false]);

const showOriginal = (index: number) => {
  isShownOriginal.value[index] = !isShownOriginal.value[index];
}

const nextQuestion = async () => {
  isLoading.value = true;

  try {
    let contextID = generateRandomNumbers(lastId, 1, askedQuestionsIDs.value)[0];
    const wordIDs = [contextID, ...generateRandomNumbers(lastId, 3, [contextID])];

    askedQuestionsIDs.value.push(contextID);

    words = [] as Word[];
    let docs = document.getElementsByClassName('choice');
    for (let i = 0; i < docs.length; i++) {
      docs[i].classList.remove('wrong')
      docs[i].classList.remove('correct')
    }

    await Promise.all(wordIDs.map(async n => {
      let word = await getWordById(n);
      words.push({
        en: word.data().en,
        tr: word.data().tr,
        id: word.data().id,
        type: word.data().type,
        docId: word.id
      });
    }))

    question.value = {
      context: words[0],
      choices: shuffleArray(words)
    }

  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

const getWordById = async (id: number) => {
  const doc = await getDocs(
    query(collection(db, "words"), where("id", "==", id))
  );
  return doc.docs[0];
}

const onChoiceMake = (event: MouseEvent) => {
  let target = event.target! as HTMLElement;
  if (question.value.context.tr === target.innerHTML) {
    target.classList.add('correct');
    setTimeout(() => {
      nextQuestion();
    }, 350)
  } else {
    target.classList.add('wrong');
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
          <div class="qbox-info-light" v-for="value, key in WordTypeMap"
            :class="{ active: +key === question.context.type }">
            <i>{{ value.shortName }}</i>
          </div>
        </div>
        <div class="qbox-word">
          {{ question.context.en }}
        </div>
        <div class="qbox-choices">
          <div class="qbox-choices-choice" @click="onChoiceMake" v-for="c, i in question.choices">
            <div style="position: relative;">
              <div v-if="isShownOriginal[i]">
                {{ c.en }}
              </div>
              <div v-else>
                {{ c.tr }}
              </div>
              <div class="qbox-choices-choice-info" style="position: absolute; right: 0px; top: 0px;">
                <span :class="{ 'on': isShownOriginal[i] }" class="material-icons qbox-choices-choice-info-translate"
                  @click="showOriginal(i)">
                  translate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$material-design-icons-font-directory-path: 'material-design-icons-iconfont/dist/fonts/';
@import 'material-design-icons-iconfont/src/material-design-icons';

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

        &-info {
          &-translate {
            transition: .35s ease;
          }
          &-translate.on {
            color: green;
          }
        }

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
