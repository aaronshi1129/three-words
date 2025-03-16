import confetti from 'confetti';

// Game configuration and state
const GameState = {
    words: [],
    currentWordIndex: 0,
    passedWords: [],
    startTime: null,
    timerInterval: null,
    remainingTime: 120, // 2 minutes in seconds
    isGameActive: false
};

// Word banks
const WordBanks = {
    builtIn: {
        starters: [
            "cat", "dog", "house", "ball", "tree", "sun", "moon", "apple", "book", "chair",
            "car", "fish", "shoe", "hat", "bird", "door", "water", "flower", "baby", "cake",
            "thick", "fast", "skull", "wild", "bra", "bar", "camel", "stamp", "sheep", "little",
            "type", "donkey", "protect", "runner", "champion", "user", "punch", "city", "county", "state",
            "typo", "stock", "clap", "share", "brunch", "spotted", "player", "nation", "country", "list",
            "simple", "perfect", "clock", "again", "mile", "kilogram", "valentine", "independence", "gender", "label",
            "bookstore", "supermarket", "grocery store", "fat", "sexy", "meat", "window", "fridge", "late", "early",
            "liar", "December", "Friday", "weekend", "ride", "flour", "save", "Spring", "engine", "heat",
            "hungry", "author", "song", "expensive", "sky", "hell", "broken", "Uber", "tortoise", "piece",
            "toy", "school", "ice cream", "banana", "monkey", "chicken", "pizza", "milk", "bear", "bed"
        ],
        movers: [
            "elephant", "skyscraper", "birthday", "umbrella", "basketball",
            "octopus", "strawberry", "keyboard", "telescope", "volcano",
            "submarine", "mosquito", "calendar", "mountain", "laptop",
            "rainbow", "treasure", "universe", "dinosaur", "chocolate",
            "fireworks", "pineapple", "lighthouse", "werewolf", "hurricane",
            "ripple", "counter", "pore", "dramatic", "siren",
            "borrow", "logo", "shack", "digit", "margarita",
            "tease", "crowded", "triathlon", "Snickers", "jade",
            "blonde", "champion", "Atlanta", "mozzarella", "lark",
            "hummingbird", "referee", "group", "enlist", "rolling stone",
            "magnify", "magnifier", "telescope", "microscope", "binoculars",
            "president", "mayor", "sure", "significant", "allergy",
            "quit", "give up", "game show", "bandage", "tofu",
            "panda", "refuse", "cast", "swipe", "steep",
            "villain", "kidnap", "PowerPoint", "wasabi", "mustard",
            "decoration", "obese", "bald", "delta", "applaud",
            "shadow", "angle", "stepfather", "aquarius", "stall",
            "strike", "lyric", "pricy", "curious", "good game",
            "price", "official", "tune", "helmet", "menu",
            "jellyfish", "rollercoaster", "snowflake", "avocado", "rhinoceros"
        ],
        flyers: [
            "sustainability", "cryptocurrency", "procrastination", "nostalgia", "philosophy",
            "democracy", "algorithm", "stereotype", "revolution", "empathy",
            "biodiversity", "infrastructure", "capitalism", "pandemic", "renaissance",
            "metaphor", "innovation", "diplomacy", "conspiracy", "paradox",
            "equilibrium", "civilization", "philanthropy", "superstition", "psychology",
            "OK boomer", "gingerbread house", "leaf blower", "glass blower", "fortunate",
            "delirious", "chandelier", "sway", "moisturizer", "fundraiser",
            "governor", "super glue", "free parking", "fund", "decimal",
            "range rover", "park ranger", "grinch", "owl", "fortune",
            "canary", "spanx", "Greenland", "Narnia", "utopia",
            "prom", "cluck", "chuckle", "hyper market", "red panda",
            "whisker", "pelvis", "Party City", "Joshua Tree", "page-turner",
            "flower power", "overthrow", "decor", "obesity", "gravel",
            "Scooby-Doo", "fossil", "bus pass", "fair game", "soap opera",
            "crop dust", "hymn", "thigh", "mule", "standing room",
            "house call", "co-sign", "no cap", "slumber party", "leapfrog",
            "baby formula", "ugli fruit", "no-hitter", "hot pink", "true crime",
            "futon", "dirt cheap", "boon", "curse", "photography",
            "sit in", "veto", "opinion poll", "placard", "report card",
            "democracy", "colonialism", "globalization", "relativity", "consciousness"
        ]
    },
    custom: []
};

// DOM Elements
const elements = {
    screens: {
        home: document.getElementById('home-screen'),
        game: document.getElementById('game-screen'),
        end: document.getElementById('end-screen')
    },
    buttons: {
        startGame: document.getElementById('start-game-btn'),
        settings: document.getElementById('settings-btn'),
        correct: document.getElementById('correct-btn'),
        pass: document.getElementById('pass-btn'),
        fault: document.getElementById('fault-btn'),
        backToHome: document.getElementById('back-to-home'),
        playAgain: document.getElementById('play-again-btn'),
        home: document.getElementById('home-btn'),
        saveSettings: document.getElementById('save-settings-btn'),
        cancelSettings: document.getElementById('cancel-settings-btn')
    },
    wordDisplay: document.getElementById('current-word'),
    timerDisplay: document.getElementById('timer-display'),
    wordsRemaining: document.getElementById('words-remaining'),
    finalTime: document.getElementById('final-time'),
    settingsModal: document.getElementById('settings-modal'),
    wordBankType: document.getElementsByName('word-bank-type'),
    customWordBankSection: document.getElementById('custom-word-bank-section'),
    customWords: document.getElementById('custom-words'),
    wordCount: document.getElementById('word-count'),
    difficultyLevel: document.getElementsByName('difficulty-level'),
    currentBank: document.getElementById('current-bank')
};

// Initialize the game
function init() {
    loadSettings();
    addEventListeners();
}

// Load settings from local storage
function loadSettings() {
    const savedCustomWords = localStorage.getItem('customWordBank');
    if (savedCustomWords) {
        WordBanks.custom = JSON.parse(savedCustomWords);
        elements.customWords.value = WordBanks.custom.join('\n');
        elements.wordCount.textContent = WordBanks.custom.length;
    }

    const wordBankType = localStorage.getItem('wordBankType') || 'built-in';
    document.getElementById(wordBankType).checked = true;
    
    if (wordBankType === 'custom') {
        elements.customWordBankSection.classList.remove('hidden');
        document.getElementById('difficulty-section').classList.add('hidden');
    } else {
        document.getElementById('difficulty-section').classList.remove('hidden');
    }
    
    const difficultyLevel = localStorage.getItem('difficultyLevel') || 'movers';
    document.getElementById(difficultyLevel).checked = true;
}

// Set up event listeners
function addEventListeners() {
    // Navigation buttons
    elements.buttons.startGame.addEventListener('click', startGame);
    elements.buttons.settings.addEventListener('click', openSettings);
    elements.buttons.backToHome.addEventListener('click', goToHome);
    elements.buttons.playAgain.addEventListener('click', startGame);
    elements.buttons.home.addEventListener('click', goToHome);

    // Game control buttons
    elements.buttons.correct.addEventListener('click', handleCorrect);
    elements.buttons.pass.addEventListener('click', handlePass);
    elements.buttons.fault.addEventListener('click', handleFault);

    // Settings modal buttons
    elements.buttons.saveSettings.addEventListener('click', saveSettings);
    elements.buttons.cancelSettings.addEventListener('click', closeSettings);

    // Word bank type radio buttons
    for (const radio of elements.wordBankType) {
        radio.addEventListener('change', toggleCustomWordBank);
    }

    // Custom words textarea
    elements.customWords.addEventListener('input', updateWordCount);

    // Difficulty level radio buttons
    for (const radio of elements.difficultyLevel) {
        radio.addEventListener('change', () => {});
    }
}

// Word count update
function updateWordCount() {
    const words = elements.customWords.value.trim().split('\n').filter(word => word.trim().length > 0);
    elements.wordCount.textContent = words.length;
}

// Toggle custom word bank section
function toggleCustomWordBank() {
    if (document.getElementById('custom').checked) {
        elements.customWordBankSection.classList.remove('hidden');
        document.getElementById('difficulty-section').classList.add('hidden');
    } else {
        elements.customWordBankSection.classList.add('hidden');
        document.getElementById('difficulty-section').classList.remove('hidden');
    }
}

// Open settings modal
function openSettings() {
    elements.settingsModal.style.display = 'flex';
}

// Close settings modal
function closeSettings() {
    elements.settingsModal.style.display = 'none';
}

// Save settings
function saveSettings() {
    const isCustom = document.getElementById('custom').checked;
    
    if (isCustom) {
        const words = elements.customWords.value.trim().split('\n')
            .filter(word => word.trim().length > 0)
            .map(word => word.trim());
        
        if (words.length < 5) {
            alert('Please enter at least 5 custom words.');
            return;
        }
        
        WordBanks.custom = words;
        localStorage.setItem('customWordBank', JSON.stringify(words));
    }
    
    localStorage.setItem('wordBankType', isCustom ? 'custom' : 'built-in');
    
    // Save difficulty level
    const difficultyLevel = document.querySelector('input[name="difficulty-level"]:checked').value;
    localStorage.setItem('difficultyLevel', difficultyLevel);
    
    closeSettings();
}

// Start a new game
function startGame() {
    // Reset game state
    GameState.words = [];
    GameState.currentWordIndex = 0;
    GameState.passedWords = [];
    GameState.isGameActive = true;
    
    // Choose words for this game
    const wordBankType = document.getElementById('custom').checked ? 'custom' : 'built-in';
    
    if (wordBankType === 'built-in') {
        const difficultyLevel = localStorage.getItem('difficultyLevel') || 'movers';
        const wordBank = WordBanks.builtIn[difficultyLevel];
        GameState.words = getRandomWords(wordBank, 5);
        
        // Update the current bank display
        elements.currentBank.textContent = difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1);
    } else {
        if (WordBanks.custom.length < 5) {
            alert('Please configure at least 5 custom words in the settings.');
            return;
        }
        GameState.words = getRandomWords(WordBanks.custom, 5);
        
        // Update the current bank display
        elements.currentBank.textContent = 'Custom';
    }
    
    // Show first word
    updateWordDisplay();
    
    // Reset and start timer
    startTimer();
    
    // Update UI
    elements.wordsRemaining.textContent = GameState.words.length + GameState.passedWords.length;
    
    // Switch to game screen
    showScreen('game');
}

// Get random words from the word bank
function getRandomWords(wordBank, count) {
    // Ensure wordBank is an array and has items
    const wordsArray = Array.isArray(wordBank) && wordBank.length > 0 ? wordBank : WordBanks.builtIn.movers;
    const shuffled = [...wordsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Start the timer
function startTimer() {
    clearInterval(GameState.timerInterval);
    GameState.remainingTime = 120; // Reset to 2 minutes
    
    // Initial display update
    const minutes = Math.floor(GameState.remainingTime / 60).toString().padStart(2, '0');
    const seconds = (GameState.remainingTime % 60).toString().padStart(2, '0');
    elements.timerDisplay.textContent = `${minutes}:${seconds}`;
    
    GameState.timerInterval = setInterval(() => {
        if (!GameState.isGameActive) return;
        
        if (GameState.remainingTime <= 0) {
            // Time's up, end the game
            handleTimeUp();
            return;
        }
        
        GameState.remainingTime--;
        
        // Update timer display
        const minutes = Math.floor(GameState.remainingTime / 60).toString().padStart(2, '0');
        const seconds = (GameState.remainingTime % 60).toString().padStart(2, '0');
        elements.timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Handle time up
function handleTimeUp() {
    GameState.isGameActive = false;
    clearInterval(GameState.timerInterval);
    
    // Update final time display
    elements.finalTime.textContent = `00:00`;
    
    // Show time up message
    document.getElementById('game-result').textContent = 'Time\'s up! You ran out of time.';
    document.getElementById('game-result').style.color = '#e74c3c';
    
    // Show end screen
    showScreen('end');
}

// Update the word display
function updateWordDisplay() {
    if (GameState.currentWordIndex < GameState.words.length) {
        elements.wordDisplay.textContent = GameState.words[GameState.currentWordIndex];
    } else if (GameState.passedWords.length > 0) {
        // Move a passed word to the current words
        GameState.words.push(GameState.passedWords.shift());
        elements.wordDisplay.textContent = GameState.words[GameState.currentWordIndex];
    } else {
        // All words processed
        endGame();
    }
}

// Handle correct button click
function handleCorrect() {
    if (!GameState.isGameActive) return;
    
    // Remove the current word
    GameState.words.splice(GameState.currentWordIndex, 1);
    
    // Update words remaining count
    elements.wordsRemaining.textContent = GameState.words.length + GameState.passedWords.length;
    
    // If all words are done, end the game
    if (GameState.words.length === 0 && GameState.passedWords.length === 0) {
        endGame();
        return;
    }
    
    // If we removed the last word, reset the index to 0
    if (GameState.currentWordIndex >= GameState.words.length) {
        GameState.currentWordIndex = 0;
    }
    
    // Update the display
    updateWordDisplay();
}

// Handle pass button click
function handlePass() {
    if (!GameState.isGameActive) return;
    
    // Move current word to passed words
    const passedWord = GameState.words.splice(GameState.currentWordIndex, 1)[0];
    GameState.passedWords.push(passedWord);
    
    // If we removed the last word, reset the index to 0
    if (GameState.currentWordIndex >= GameState.words.length) {
        GameState.currentWordIndex = 0;
    }
    
    // Update the display
    updateWordDisplay();
}

// Handle fault button click
function handleFault() {
    if (!GameState.isGameActive) return;
    
    // End the game immediately due to fault
    GameState.isGameActive = false;
    clearInterval(GameState.timerInterval);
    
    // Update final time display
    elements.finalTime.textContent = `00:00`;
    
    // Show fault message
    document.getElementById('game-result').textContent = 'Game Over! You made a fault and cannot continue.';
    document.getElementById('game-result').style.color = '#e74c3c';
    
    // Show end screen
    showScreen('end');
}

// End the game
function endGame() {
    GameState.isGameActive = false;
    clearInterval(GameState.timerInterval);
    
    // Update final time display - show remaining time instead of elapsed time
    const minutes = Math.floor(GameState.remainingTime / 60).toString().padStart(2, '0');
    const seconds = (GameState.remainingTime % 60).toString().padStart(2, '0');
    elements.finalTime.textContent = `${minutes}:${seconds}`;
    
    // Show success message
    document.getElementById('game-result').textContent = 'All words completed!';
    document.getElementById('game-result').style.color = '#2ecc71';
    
    // Celebrate with confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    // Show end screen
    showScreen('end');
}

// Go back to home screen
function goToHome() {
    GameState.isGameActive = false;
    clearInterval(GameState.timerInterval);
    showScreen('home');
}

// Show a specific screen
function showScreen(screenName) {
    Object.keys(elements.screens).forEach(key => {
        elements.screens[key].classList.remove('active');
    });
    elements.screens[screenName].classList.add('active');
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);