document.addEventListener('DOMContentLoaded', function() {
        const wordDisplay = document.getElementById('wordDisplay');
        const startButton = document.getElementById('startButton');
        const speedControl = document.getElementById('speed');
        const speedValue = document.getElementById('speedValue');
        const errorMessage = document.getElementById('errorMessage');

        // Ensure words are correctly passed from the backend
        const words = JSON.parse('{{ words|tojson|safe }}');
        let currentIndex = 0;
        let isPlaying = false;
        let animationTimeout = null;
        let displayInterval = null;

        if (!Array.isArray(words) || words.length === 0) {
            showError("Geçerli kelime listesi bulunamadı!");
            disableControls();
            return;
        }

        speedControl.addEventListener('input', function() {
            speedValue.textContent = this.value + 'ms';
        });

        startButton.addEventListener('click', function() {
            if (isPlaying) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });

        function startAnimation() {
            if (words.length === 0) return;

            isPlaying = true;
            startButton.textContent = 'Durdur';
            startButton.classList.add('btn-stop');
            showNextWord();
        }

        function stopAnimation() {
            isPlaying = false;
            startButton.textContent = 'Başla';
            startButton.classList.remove('btn-stop');
            clearTimeout(animationTimeout);
            clearInterval(displayInterval);
            wordDisplay.classList.remove('fade-out');
        }

        function showNextWord() {
            if (!isPlaying || !words.length) return;

            let word = words[currentIndex];
            let middleIndex = Math.floor(word.length / 2);
            let styledWord;

            if (word.length % 2 === 0) {
                styledWord = `
                    ${word.slice(0, middleIndex - 1)}
                    <span style="color: red;">${word[middleIndex - 1]}</span>
                    <span style="color: red;">${word[middleIndex]}</span>
                    ${word.slice(middleIndex + 1)}
                `;
            } else {
                styledWord = `
                    ${word.slice(0, middleIndex)}
                    <span style="color: red;">${word[middleIndex]}</span>
                    ${word.slice(middleIndex + 1)}
                `;
            }

            wordDisplay.innerHTML = styledWord.trim();
            wordDisplay.classList.remove('fade-out');

            animationTimeout = setTimeout(() => {
                wordDisplay.classList.add('fade-out');

                displayInterval = setTimeout(() => {
                    currentIndex++;
                    if (currentIndex >= words.length) {
                        currentIndex = 0;
                    }
                    showNextWord();
                }, 100);
            }, speedControl.value - 100);
        }

        function showError(message) {
            errorMessage.textContent = message;
            console.error(message);
        }

        function disableControls() {
            startButton.disabled = true;
            speedControl.disabled = true;
        }
    });