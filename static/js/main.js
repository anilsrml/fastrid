document.addEventListener('DOMContentLoaded', function() {
    // Debug için kontrol
    console.log("DOM loaded");
    console.log("Words data:", words);

    const wordDisplay = document.getElementById('wordDisplay');
    const startButton = document.getElementById('startButton');
    const prevButton = document.getElementById('prevButton');
    const speedControl = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    const errorMessage = document.getElementById('errorMessage');

    let currentIndex = 0;
    let isPlaying = false;
    let animationTimeout = null;
    let displayInterval = null;

    // Hata kontrolü
    if (!Array.isArray(words) || words.length === 0) {
        showError("Geçerli kelime listesi bulunamadı!");
        disableControls();
        return;
    }

    // Önceki kelime butonunu başlangıçta devre dışı bırak
    updatePrevButtonState();

    // Hız kontrolü
    speedControl.addEventListener('input', function() {
        speedValue.textContent = this.value + 'ms';
    });

    // Başlat/Durdur butonu
    startButton.addEventListener('click', function() {
        if (isPlaying) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    // Önceki kelime butonu
    prevButton.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            showWord(currentIndex);
            updatePrevButtonState();
        }
    });

    function startAnimation() {
        if (words.length === 0) return;

        isPlaying = true;
        startButton.textContent = 'Durdur';
        startButton.classList.add('btn-stop');
        prevButton.disabled = true;
        showNextWord();
    }

    function stopAnimation() {
        isPlaying = false;
        startButton.textContent = 'Başla';
        startButton.classList.remove('btn-stop');
        clearTimeout(animationTimeout);
        clearInterval(displayInterval);
        wordDisplay.classList.remove('fade-out');
        updatePrevButtonState();
    }

    function showWord(index) {
        let word = words[index];
        let middleIndex = Math.floor(word.length / 2);
        let styledWord;

        if (word.length % 2 === 0) {
            // Çift harfli kelimelerde ortadaki 2 harfi kırmızı yap
            styledWord = `
                ${word.slice(0, middleIndex - 1)}
                <span style="color: red;">${word[middleIndex - 1]}</span>
                <span style="color: red;">${word[middleIndex]}</span>
                ${word.slice(middleIndex + 1)}
            `;
        } else {
            // Tek harfli kelimelerde ortadaki tek harfi kırmızı yap
            styledWord = `
                ${word.slice(0, middleIndex)}
                <span style="color: red;">${word[middleIndex]}</span>
                ${word.slice(middleIndex + 1)}
            `;
        }

        wordDisplay.innerHTML = styledWord.trim();
        wordDisplay.classList.remove('fade-out');
    }

    function showNextWord() {
        if (!isPlaying || !words.length) return;

        showWord(currentIndex);

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

    function updatePrevButtonState() {
        prevButton.disabled = currentIndex === 0;
    }

    function showError(message) {
        errorMessage.textContent = message;
        console.error(message);
    }

    function disableControls() {
        startButton.disabled = true;
        speedControl.disabled = true;
        prevButton.disabled = true;
    }
}); 