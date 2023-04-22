export const WordTypeMap = {
  0: {
    fullName: "NOUN",
    shortName: "noun"
  },
  1: {
    fullName: "VERB",
    shortName: "verb"
  },
  2: {
    fullName: "ADJECTIVE",
    shortName: "adj."
  },
  3: {
    fullName: "ADVERB",
    shortName: "adv."
  },
  4: {
    fullName: "CONJUNCTION",
    shortName: "conj."
  },
  5: {
    fullName: "PREPOSITION",
    shortName: "prep."
  },
  6: {
    fullName: "IDIOM",
    shortName: "idiom"
  },
  7: {
    fullName: "EXPRESSION",
    shortName: "expr."
  }
} as {
  [key: number]: {
    fullName: string,
    shortName: string
  }
}