/* =====================================
   WordSnap V1
   storage.js
===================================== */

const STORAGE_KEY = "wordsnap_words";

/* -----------------------------
   모든 단어 불러오기
------------------------------ */

function getWords() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("단어 불러오기 실패", e);
        return [];
    }

}

/* -----------------------------
   전체 저장
------------------------------ */

function saveWords(words) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(words)
    );

}

/* -----------------------------
   단어 추가
------------------------------ */

function addWords(newWords) {

    let words = getWords();

    newWords.forEach(newWord => {

        const exists = words.some(word =>

            word.word.toLowerCase() ===
            newWord.word.toLowerCase()

        );

        if (!exists) {

            words.push({

                word: newWord.word,

                meaning: newWord.meaning

            });

        }

    });

    saveWords(words);

}

/* -----------------------------
   랜덤 5개 가져오기
------------------------------ */

function getRandomWords(count = 5) {

    const words = getWords();

    if (words.length <= count) {

        return words;

    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);

}

/* -----------------------------
   전체 삭제
------------------------------ */

function clearWords() {

    localStorage.removeItem(STORAGE_KEY);

}

/* -----------------------------
   단어 개수
------------------------------ */

function getWordCount() {

    return getWords().length;

}
