// Правильные ответы
const correctAnswers = {
    question1: "HTML",
    question2: "Python",
    question3: "HTML"
};

// Функция для отображения результатов
function displayResults(score) {
    const resultMessage = `Ваш результат: ${score} из 3 правильных ответов.`;
    document.getElementById('result').innerHTML = resultMessage;
}

// Функция для сохранения результатов
function saveResults(score, answers) {
    const results = JSON.parse(localStorage.getItem('testResults')) || [];
    results.push({ score, answers }); // Сохраняем объект с результатами и ответами
    localStorage.setItem('testResults', JSON.stringify(results));
}

// Функция для отображения сохраненных результатов
function showSavedResults() {
    const results = JSON.parse(localStorage.getItem('testResults')) || [];
    const savedResultsDiv = document.getElementById('savedResults');
    savedResultsDiv.innerHTML = ''; // Очищаем предыдущие результаты

    if (results.length > 0) {
        results.forEach((result, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = `Результат ${index + 1}: ${result.score} из 3 правильных ответов. Ответы: ${JSON.stringify(result.answers)}`;
            
            // Создаем кнопку для подсветки ответов
            const highlightButton = document.createElement('button');
            highlightButton.textContent = 'Подсветить ответы';
            highlightButton.onclick = function() {
                highlightAnswers(result.answers);
            };

            resultDiv.appendChild(highlightButton);
            savedResultsDiv.appendChild(resultDiv);
        });
    } else {
        savedResultsDiv.innerHTML = 'Нет сохраненных результатов. Пожалуйста, проведите тест.';
    }
}

// Функция для подсветки правильных и неправильных ответов
function highlightAnswers(answers) {
    // Сбросить предыдущие подсветки
    const options = document.querySelectorAll('.options li');
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
    });

    // Подсвечиваем правильные и неправильные ответы
    for (let i = 1; i <= 3; i++) {
        const selectedAnswer = answers[`question${i}`];
        const correctAnswer = correctAnswers[`question${i}`];
        const options = document.querySelectorAll(`input[name="question${i}"]`);

        options.forEach(option => {
            const li = option.parentElement;
            if (option.value === correctAnswer) {
                // Подсвечиваем правильный ответ только если выбранный ответ правильный
                if (selectedAnswer === correctAnswer) {
                    li.classList.add('correct'); // правильный ответ
                }
            } else if (option.value === selectedAnswer) {
                li.classList.add('incorrect'); // выбранный неправильный ответ
                li.classList.add('selected'); // помечаем выбранный вариант
            }
        });
    }
}

// Функция для очистки результатов
function clearResults() {
    localStorage.removeItem('testResults'); // Удаляем сохраненные результаты
    showSavedResults(); // Обновляем отображение результатов
}

document.getElementById('quizForm').onsubmit = function(event) {
    event.preventDefault(); // предотвращаем отправку формы

    let score = 0; // счетчик правильных ответов
    const answers = {}; // объект для сохранения ответов

    for (let i = 1; i <= 3; i++) {
        const answer = document.querySelector(`input[name="question${i}"]:checked`);
        const options = document.querySelectorAll(`input[name="question${i}"]`);
        if (answer) {
            const selectedValue = answer.value;
            answers[`question${i}`] = selectedValue; // сохраняем выбранный ответ
            
            // Подсвечиваем правильный и неправильный варианты
            options.forEach(option => {
                const li = option.parentElement;
                if (option.value === correctAnswers[`question${i}`]) {
                    li.classList.add('correct'); // правильный ответ
                } else if (option === answer) {
                    li.classList.add('incorrect'); // выбранный неправильный ответ
                    li.classList.add('selected'); // помечаем выбранный вариант
                }
            });

            if (selectedValue === correctAnswers[`question${i}`]) {
                score++; // увеличиваем счетчик за правильный ответ
            }
        }
    }

    // Выводим результаты
    displayResults(score);
    saveResults(score, answers); // сохраняем результаты и ответы
    showSavedResults(); // отображаем сохраненные результаты сразу после отправки
};

document.getElementById('showResults').onclick = function() {
    showSavedResults(); // отображаем сохраненные результаты при нажатии на кнопку
};

document.getElementById('clearResults').onclick = function() {
    clearResults(); // очищаем результаты при нажатии на кнопку
};