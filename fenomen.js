// === 1. CONFIG FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyADYoNWoYidn2VUZNp3p_gQ6oQpjqz84_s",
  authDomain: "fenomen-school-2026.firebaseapp.com",
  projectId: "fenomen-school-2026",
  storageBucket: "fenomen-school-2026.firebasestorage.app",
  messagingSenderId: "569695363829",
  appId: "1:569695363829:web:4b21ae0a29d2eaa5769bbc"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// === 2. ТЕСТ И УРОВНИ (Твоя рабочая логика) ===
const questions = [
    { q: "როგორ იქნება 'Привет'?", a: ["გამარჯობა", "ნახვამდის", "მადლობა"], correct: 0 },
    { q: "როგორ ითარგმნება 'წყალი'?", a: ["პური", "წყალი", "ღვინო"], correct: 1 },
    { q: "როგორ ვთქვათ 'Спасибо'?", a: ["გაუმარჯოს", "ინებეთ", "მადლობა"], correct: 2 },
    { q: "რას ნიშნავს 'მე ვსწავლობ'?", a: ["მე ვსწავლობ", "მე ვკითხულობ", "მე ვწერ"], correct: 0 },
    { q: "როგორ ითარგმნება 'Солнце'?", a: ["მთვარე", "ვარსკვლავი", "მზე"], correct: 2 },
    { q: "როგორ იქნება 'წიგნი'?", a: ["რვეული", "წიგნი", "კალამი"], correct: 1 },
    { q: "რას ნიშნავს 'დილა მშვიდობისა'?", a: ["Доброе утро", "Добрый день", "Добрый вечер"], correct: 0 },
    { q: "როგორ ითარგმნება 'Друг'?", a: ["მტერი", "მეზობელი", "მეგობარი"], correct: 2 },
    { q: "რას ნიშნავს 'სახლი'?", a: ["Сад", "Дом", "Улица"], correct: 1 },
    { q: "როგორ ვთქვათ 'მე შენ მიყვარხარ'?", a: ["მე შენ მიყვარხარ", "მე შენ გხედავ", "მე შენ გიცნობ"], correct: 0 }
];

let currentQuestion = 0;
let score = 0;
let detectedLevel = "A1"; // По умолчанию

function loadMainQuiz() {
    const qText = document.getElementById('question-text');
    const btnContainer = document.getElementById('answer-buttons');
    if (!qText || !btnContainer) return;
    qText.innerText = questions[currentQuestion].q;
    btnContainer.innerHTML = ''; 
    questions[currentQuestion].a.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.className = 'btn-primary';
        button.style.margin = '10px';
        button.style.display = 'block';
        button.style.width = '100%';
        button.onclick = () => checkAnswer(index);
        btnContainer.appendChild(button);
    });
}

function checkAnswer(index) {
    if (index === questions[currentQuestion].correct) score++;
    currentQuestion++;
    if (currentQuestion < questions.length) loadMainQuiz();
    else showResults();
}

function showResults() {
    document.getElementById('quiz-step').style.display = 'none';
    document.getElementById('result-step').style.display = 'block';
    document.getElementById('score-text').innerText = score + "/10";
    
    let targetId = "";
    if (score <= 4) { detectedLevel = "A1"; targetId = "level-a1"; }
    else if (score <= 8) { detectedLevel = "B1"; targetId = "level-b1"; }
    else { detectedLevel = "C1"; targetId = "level-c1"; }
    
    document.getElementById('level-recommendation').innerText = "თქვენი დონეა: " + detectedLevel;
    
    setTimeout(() => {
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
        document.getElementById(targetId).classList.add('highlight-level');
    }, 2000);
}

// === 3. РЕГИСТРАЦИЯ И ВХОД (С НОМЕРОМ ТЕЛЕФОНА) ===
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        const phone = document.getElementById('reg-phone').value; // Нужно добавить в HTML

        auth.createUserWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                const user = userCredential.user;
                db.ref('users/' + user.uid).set({
                    email: email,
                    phone: phone,
                    regDate: new Date().toLocaleDateString(),
                    role: 'student',
                    level: detectedLevel // Сохраняем уровень из теста!
                });
                alert("რეგისტრაცია წარმატებულია!");
                window.location.href = "course.html";
            })
            .catch((error) => alert("შეცდომა: " + error.message));
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        auth.signInWithEmailAndPassword(email, pass)
            .then(() => {
                if (email === "admin@fenomen.ge") window.location.href = "admin.html";
                else window.location.href = "course.html";
            })
            .catch((error) => alert("არასწორი მონაცემები!"));
    });
}
