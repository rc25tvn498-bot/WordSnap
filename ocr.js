/* =====================================
   WordSnap V1
   ocr.js
===================================== */

/* ---------- DOM ---------- */

const imageInput = document.getElementById("imageInput");

/* ---------- 이미지 선택 ---------- */

imageInput.addEventListener("change", async (event)=>{

    const file = event.target.files[0];

    if(!file){

        return;

    }

    startOCR();

    const image = await loadImage(file);

    const images = splitImage(image);

    await runOCR(images);

});

/* ---------- 이미지 불러오기 ---------- */

function loadImage(file){

    return new Promise((resolve)=>{

        const reader = new FileReader();

        reader.onload = function(e){

            const img = new Image();

            img.onload = ()=>{

                resolve(img);

            };

            img.src = e.target.result;

        };

        reader.readAsDataURL(file);

    });

}

/* ---------- 가운데 기준 분할 ---------- */

function splitImage(image){

    const width = image.width;

    const height = image.height;

    const middle = Math.floor(width/2);

    /* 영어 */

    const leftCanvas = document.createElement("canvas");

    leftCanvas.width = middle;

    leftCanvas.height = height;

    const leftCtx = leftCanvas.getContext("2d");

    leftCtx.drawImage(

        image,

        0,

        0,

        middle,

        height,

        0,

        0,

        middle,

        height

    );

    /* 한국어 */

    const rightCanvas = document.createElement("canvas");

    rightCanvas.width = width-middle;

    rightCanvas.height = height;

    const rightCtx = rightCanvas.getContext("2d");

    rightCtx.drawImage(

        image,

        middle,

        0,

        width-middle,

        height,

        0,

        0,

        width-middle,

        height

    );

    return{

        english:leftCanvas,

        korean:rightCanvas

    };

}
/* =====================================
   OCR 실행
===================================== */

async function runOCR(images){

    try{

        /* ---------- 영어 OCR ---------- */

        const englishResult = await Tesseract.recognize(

            images.english,

            "eng",

            {

                logger:(m)=>{

                    if(m.status==="recognizing text"){

                        showOCRLoading(

                            Math.floor(m.progress*50)

                        );

                    }

                }

            }

        );

        /* ---------- 한국어 OCR ---------- */

        const koreanResult = await Tesseract.recognize(

            images.korean,

            "kor+eng",

            {

                logger:(m)=>{

                    if(m.status==="recognizing text"){

                        showOCRLoading(

                            50+

                            Math.floor(m.progress*50)

                        );

                    }

                }

            }

        );

        const englishText =
            englishResult.data.text;

        const koreanText =
            koreanResult.data.text;

        parseOCRResult(

            englishText,

            koreanText

        );

    }

    catch(error){

        console.error(error);

        showOCRError();

    }

}

/* =====================================
   OCR 문자열 정리
===================================== */

function cleanLines(text){

    return text

        .split("\n")

        .map(line=>line.trim())

        .filter(line=>line.length>0);

}ㄷ/* =====================================
   OCR 결과 파싱
===================================== */

function parseOCRResult(englishText, koreanText){

    const englishLines = cleanLines(englishText);
    const koreanLines = cleanLines(koreanText);

    const words = [];

    const max = Math.min(
        englishLines.length,
        koreanLines.length
    );

    for(let i=0;i<max;i++){

        const english = englishLines[i]
            .replace(/\s+/g," ")
            .trim();

        const korean = koreanLines[i]
            .replace(/\s+/g," ")
            .trim();

        if(
            english.length===0 ||
            korean.length===0
        ){
            continue;
        }

        words.push({

            word: english,

            meaning: korean

        });

    }

    console.log("OCR 결과",words);

    updateAfterOCR(words);

}

/* =====================================
   OCR 종료
===================================== */

function finishOCR(){

    setStatus("✅ OCR 완료");

}

/* =====================================
   OCR 오류
===================================== */

function showOCRError(){

    setStatus("❌ OCR 실패");

    wordList.innerHTML = `

        <div class="word-card">

            <div class="word">

                OCR 인식에 실패했습니다.

            </div>

        </div>

    `;

}

