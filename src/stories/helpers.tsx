const faker = require("faker");

export function generateUrlEntries(howMany: number) {
    faker.seed(42 + howMany); // keep it random, but stable
    return Array.from({length: howMany}, () => {
        return {
            host: "github.com",
            url: faker.internet.url(),
            title: faker.lorem.sentence(10),
            value: faker.random.number(10)
        }
    })
}

export function generateSentence(words: number): string {
    faker.seed(42 + words);
    return faker.lorem.sentence(words);
}