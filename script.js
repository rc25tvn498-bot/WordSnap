/* =====================================
   WordSnap V1
   script.js
===================================== */

const wordList = document.getElementById("wordList");
const shuffleBtn = document.getElementById("shuffleBtn");

/* -----------------------------
   화면 출력
------------------------------ */

function renderWords() {

    const words = getRandomWords(5);

    wordList.innerHTML = "";

    if (words.length === 0) {

        wordList.innerHTML = `
            <div class="word-card">
                <div class="word">
                    📷 단어장 사진을 먼저 업로드하세요.
                </div>
            </div>
        `;

        return;

    }

    words.forEach(item => {

        const card = document.createElement("div");

        card.className = "word-card";

        card.innerHTML = `

            <div class="word">

                ${item.word}

            </div>

            <button class="meaning-btn">

                ▼ 뜻 보기

            </button>

            <div class="meaning">

                ${item.meaning}

            </div>

        `;

        const btn = card.querySelector(".meaning-btn");

        const meaning = card.querySelector(".meaning");

        btn.addEventListener("click", () => {

            meaning.classList.toggle("show");

            if (meaning.classList.contains("show")) {

                btn.textContent = "▲ 뜻 숨기기";

            } else {

                btn.textContent = "▼ 뜻 보기";

            }

        });

        wordList.appendChild(card);

    });

}

/* -----------------------------
   랜덤 버튼
------------------------------ */

shuffleBtn.addEventListener("click", () => {

    renderWords();

});

/* -----------------------------
   페이지 시작
------------------------------ */

window.addEventListener("load", () => {

    renderWords();

});
