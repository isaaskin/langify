export const generateRandomNumbers = (max: number, count: number, except: number[] = []): number[] => {
    if ((max + 1) - except.length < count) {
        throw new Error("Cannot generate a random number with given parameters")
    }
    const randomNumbers = [] as number[];
    let generatedRandomNumbers = new Set<number>();

    while (true) {
        let random = Math.floor(Math.random() * (max + 1));
        generatedRandomNumbers.add(random);

        if (except.includes(random) || randomNumbers.includes(random)) {
            continue;
        }

        randomNumbers.push(random);
        if (randomNumbers.length === count) {
            break;
        }
    }

    generatedRandomNumbers.clear();

    return randomNumbers;
};

export const shuffleArray = <T>(arr: T[]): T[] => {
    return arr.sort(() => Math.random() - 0.5);
}