/* =====================================
   WordSnap V1.1
   script.js
===================================== */

/* ---------- DOM ---------- */

const wordList = document.getElementById("wordList");
const shuffleBtn = document.getElementById("shuffleBtn");
const statusText = document.getElementById("statusText");

/* ---------- 상태 ---------- */

let currentWords = [];

/* ---------- 상태 메시지 ---------- */

function setStatus(message){

    statusText.textContent = message;

}

/* ---------- 현재 단어 새로 불러오기 ---------- */

function refreshWords(){

    currentWords = getRandomWords(5);

}

/* ---------- 카드 하나 생성 ---------- */

function createWordCard(item){

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

    btn.addEventListener("click",()=>{

        meaning.classList.toggle("show");

        if(meaning.classList.contains("show")){

            btn.textContent="▲ 뜻 숨기기";

        }else{

            btn.textContent="▼ 뜻 보기";

        }

    });

    return card;

}

/* ---------- 화면 출력 ---------- */

function renderWords(){

    refreshWords();

    wordList.innerHTML = "";

    if(currentWords.length===0){

        setStatus("📷 단어장 사진을 업로드하세요.");

        wordList.innerHTML = `

            <div class="word-card">

                <div class="word">

                    아직 저장된 단어가 없습니다.

                </div>

            </div>

        `;

        return;

    }

    setStatus(`📚 저장된 단어 ${getWordCount()}개`);

    currentWords.forEach(item=>{

        wordList.appendChild(

            createWordCard(item)

        );

    });

}
/* ---------- 랜덤 버튼 ---------- */

shuffleBtn.addEventListener("click", () => {

    renderWords();

});

/* ---------- OCR에서 호출할 함수 ---------- */

function updateAfterOCR(words){

    if(!Array.isArray(words)){

        return;

    }

    if(words.length===0){

        setStatus("❌ 인식된 단어가 없습니다.");

        return;

    }

    addWords(words);

    setStatus(`✅ ${words.length}개의 단어를 저장했습니다.`);

    renderWords();

}

/* ---------- OCR 진행상태 ---------- */

function showOCRLoading(progress){

    wordList.innerHTML = `

        <div class="loading">

            <div class="spinner"></div>

            <p>

                📖 단어를 읽는 중입니다...

            </p>

            <p>

                ${progress}%

            </p>

        </div>

    `;

}

/* ---------- OCR 시작 ---------- */

function startOCR(){

    setStatus("📖 OCR을 시작합니다...");

    showOCRLoading(0);

}

/* ---------- OCR 종료 ---------- */

function finishOCR(){

    renderWords();

}

/* ---------- OCR 오류 ---------- */

function showOCRError(){

    setStatus("❌ OCR 인식에 실패했습니다.");

}

/* ---------- 페이지 시작 ---------- */

window.addEventListener("load",()=>{

    renderWords();

});
