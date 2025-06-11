document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const elements = {
        startScreen: document.getElementById('start-screen'),
        songSelectionScreen: document.getElementById('song-selection-screen'),
        gameContainer: document.getElementById('game-container'),
        startBtn: document.getElementById('start-btn'),
        songChoiceBtns: document.querySelectorAll('.song-choice'),
        audioUploadInput: document.getElementById('audio-upload'),
        gameBoard: document.getElementById('game-board'),
        scoreDisplay: document.getElementById('score-display'),
        comboDisplay: document.getElementById('combo-display'),
        nowPlayingDisplay: document.getElementById('now-playing'),
        exitBtn: document.getElementById('exit-btn'),
        audio: document.getElementById('game-audio'),
    };

    // --- Game State ---
    let state = {};

    // --- Game Configuration ---
    const config = {
        FALL_SPEED_SECONDS: 2.5,
        HIT_TOLERANCE_PX: 120,
        MIN_BEAT_INTERVAL_MS: 180,
        ENERGY_THRESHOLD: 1.4,
    };

    // --- Predefined Song Data ---
    const songData = {
        'song1': { src: 'songs/Udne_Laga.mp3', name: "Udne Laga Mashup" },
    };

    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
    }
    
    function resetGameState() {
        state = {
            isPlaying: false,
            audioContext: null,
            analyzer: null,
            sourceNode: null,
            score: 0, combo: 0, maxCombo: 0,
            lastBeatTime: 0, tileColorIndex: 0,
        };
        elements.gameBoard.querySelectorAll('.tile, .blast').forEach(el => el.remove());
        updateUI();
    }
    
    // **CRITICAL FIX:** A robust, dedicated function to tear down the audio pipeline.
    async function cleanupAudio() {
        if (state.analyzer) {
            state.analyzer.stop();
        }
        if (state.audioContext && state.audioContext.state !== 'closed') {
            await state.audioContext.close();
        }
        elements.audio.pause();
        elements.audio.src = ""; // Important to prevent memory leaks
        
        // Reset state variables related to audio
        state.analyzer = null;
        state.audioContext = null;
        state.sourceNode = null;
    }

    async function startGame(audioSrc, songName) {
        state.isPlaying = false; // Set to false initially
        await cleanupAudio(); // Ensure a clean slate before starting
        resetGameState();

        elements.nowPlayingDisplay.textContent = songName;
        elements.audio.src = audioSrc;

        // The user MUST interact with the page for AudioContext to start.
        // This is a browser security feature. We handle it here.
        if (!state.audioContext) {
            try {
                state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                state.sourceNode = state.audioContext.createMediaElementSource(elements.audio);
                setupLiveAnalyzer(state.sourceNode);
            } catch (error) {
                console.error("Audio Context setup failed:", error);
                alert("Could not initialize audio engine. Please refresh the page.");
                return;
            }
        }
        
        try {
            await elements.audio.play();
            state.isPlaying = true;
            if(state.analyzer) state.analyzer.start();
            showScreen(elements.gameContainer);
        } catch(err) {
            console.error("Could not play audio:", err);
            await cleanupAudio();
        }
    }
    
    function setupLiveAnalyzer(source) {
        source.connect(state.audioContext.destination);
        state.analyzer = Meyda.createMeydaAnalyzer({
            audioContext: state.audioContext,
            source: source,
            bufferSize: 512,
            featureExtractors: ["energy"],
            callback: features => {
                if (!state.isPlaying || !features) return;
                const currentTime = performance.now();
                if (features.energy > config.ENERGY_THRESHOLD && (currentTime - state.lastBeatTime) > config.MIN_BEAT_INTERVAL_MS) {
                    state.lastBeatTime = currentTime;
                    spawnTile(Math.floor(Math.random() * 4) + 1, features.energy);
                }
            }
        });
    }

    function spawnTile(columnNumber, energy) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        state.tileColorIndex = (state.tileColorIndex + 1) % 4;
        tile.classList.add(`tile-color-${state.tileColorIndex + 1}`);
        const baseHeight = 100;
        const extraHeight = Math.min(energy * 15, 60);
        tile.style.height = `${baseHeight + extraHeight}px`;
        tile.style.animationDuration = `${config.FALL_SPEED_SECONDS}s`;
        const targetColumn = elements.gameBoard.querySelector(`.column[data-col="${columnNumber}"]`);
        if (targetColumn) targetColumn.appendChild(tile);
        setTimeout(() => {
            if (tile.parentElement) {
                tile.remove();
                resetCombo();
            }
        }, config.FALL_SPEED_SECONDS * 1000 + 200);
    }
    
    function handleHit(columnNumber) {
        if (!state.isPlaying) return;
        const targetColumn = elements.gameBoard.querySelector(`.column[data-col="${columnNumber}"]`);
        const hitZoneTop = elements.gameBoard.clientHeight * 0.8;
        const hitZoneBottom = hitZoneTop + config.HIT_TOLERANCE_PX;
        let tileHit = false;
        targetColumn.querySelectorAll('.tile:not(.hit)').forEach(tile => {
            const tileRect = tile.getBoundingClientRect();
            const boardRect = elements.gameBoard.getBoundingClientRect();
            const tileBottom = tileRect.bottom - boardRect.top;
            if (tileBottom > hitZoneTop && tileBottom < hitZoneBottom + 50) {
                tile.classList.add('hit');
                state.combo++; state.score += 10 + state.combo;
                if (state.combo > state.maxCombo) state.maxCombo = state.combo;
                const blast = document.createElement('div');
                blast.className = 'blast';
                targetColumn.appendChild(blast);
                setTimeout(() => blast.remove(), 400);
                setTimeout(() => tile.remove(), 200);
                tileHit = true;
            }
        });
        if(!tileHit) resetCombo();
        updateUI();
    }

    function resetCombo() { state.combo = 0; updateUI(); }
    function updateUI() {
        elements.scoreDisplay.textContent = `Score: ${state.score}`;
        elements.comboDisplay.textContent = state.combo > 1 ? `x${state.combo}` : '';
        elements.comboDisplay.classList.toggle('visible', state.combo > 1);
    }
    
    async function exitGame() {
        state.isPlaying = false;
        await cleanupAudio();
        showScreen(elements.songSelectionScreen);
    }

    function initialize() {
        resetGameState();
        showScreen(elements.startScreen);
        elements.startBtn.addEventListener('click', () => showScreen(elements.songSelectionScreen));
        elements.exitBtn.addEventListener('click', exitGame);
        elements.songChoiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const song = songData[btn.dataset.song];
                if (song) startGame(song.src, song.name);
            });
        });
        elements.audioUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const audioSrc = URL.createObjectURL(file);
            startGame(audioSrc, file.name.replace(/\.(mp3|wav|ogg)$/i, ''));
            event.target.value = null;
        });
        const keyMap = { 'd': 1, 'f': 2, 'j': 3, 'k': 4 };
        document.addEventListener('keydown', (e) => {
            if (!state.isPlaying) return;
            const colNum = keyMap[e.key.toLowerCase()];
            if (colNum) handleHit(colNum);
        });
        elements.gameBoard.querySelectorAll('.column').forEach(column => {
            column.addEventListener('click', () => handleHit(parseInt(column.dataset.col)));
        });
    }
    initialize();
});