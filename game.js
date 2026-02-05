// --- GLOBAL CONSTANTS ---
const ADMIN_PASS = "admin123";
const FIXED_ADMIN_USER = "admin";
const FIXED_ADMIN_EMAIL = "rear43304@gmail.com";

const DEMO_LEVEL_CONFIG = {
    id: -1, name: "DEMO", fee: 0, color: "demo",
    rounds: [
        { time: 90, reward: 0, diff: 20, buy15: 1, buy30: 3, buy60: 6 },
        { time: 75, reward: 0, diff: 30, buy15: 1, buy30: 3, buy60: 6 },
        { time: 60, reward: 40, diff: 40, buy15: 1, buy30: 3, buy60: 6 }
    ]
};

const LEVEL_DATA = [
    {
        id: 0, name: "SILVER", fee: 10, color: "silver",
        rounds: [
            { time: 90, reward: 10, diff: 30, buy15: 1, buy30: 3, buy60: 6 },
            { time: 75, reward: 20, diff: 70, buy15: 1, buy30: 3, buy60: 6 },
            { time: 60, reward: 40, diff: 90, buy15: 1, buy30: 3, buy60: 6 }
        ]
    },
    {
        id: 1, name: "GOLD", fee: 40, color: "gold",
        rounds: [
            { time: 90, reward: 40, diff: 40, buy15: 4, buy30: 12, buy60: 24 },
            { time: 75, reward: 80, diff: 80, buy15: 4, buy30: 12, buy60: 24 },
            { time: 60, reward: 160, diff: 95, buy15: 4, buy30: 12, buy60: 24 }
        ]
    },
    {
        id: 2, name: "PLATINUM", fee: 160, color: "platinum",
        rounds: [
            { time: 90, reward: 160, diff: 40, buy15: 16, buy30: 48, buy60: 96 },
            { time: 75, reward: 320, diff: 80, buy15: 16, buy30: 48, buy60: 96 },
            { time: 60, reward: 640, diff: 95, buy15: 16, buy30: 48, buy60: 96 }
        ]
    },
    {
        id: 3, name: "DIAMOND", fee: 640, color: "diamond",
        rounds: [
            { time: 90, reward: 640, diff: 40, buy15: 64, buy30: 192, buy60: 384 },
            { time: 75, reward: 1280, diff: 80, buy15: 64, buy30: 192, buy60: 384 },
            { time: 60, reward: 2560, diff: 95, buy15: 64, buy30: 192, buy60: 384 }
        ]
    },
    {
        id: 4, name: "ESMERALD", fee: 2500, color: "emerald",
        rounds: [
            { time: 90, reward: 2500, diff: 40, buy15: 250, buy30: 750, buy60: 1500 },
            { time: 75, reward: 5000, diff: 80, buy15: 250, buy30: 750, buy60: 1500 },
            { time: 60, reward: 10000, diff: 95, buy15: 250, buy30: 750, buy60: 1500 }
        ]
    },
    {
        id: 5, name: "RUBY", fee: 10000, color: "ruby",
        rounds: [
            { time: 90, reward: 10000, diff: 40, buy15: 1000, buy30: 3000, buy60: 6000 },
            { time: 75, reward: 20000, diff: 80, buy15: 1000, buy30: 3000, buy60: 6000 },
            { time: 60, reward: 40000, diff: 95, buy15: 1000, buy30: 3000, buy60: 6000 }
        ]
    },
    {
        id: 6, name: "LEGEND", fee: 40000, color: "legendary",
        rounds: [
            { time: 90, reward: 40000, diff: 40, buy15: 4000, buy30: 12000, buy60: 24000 },
            { time: 75, reward: 80000, diff: 80, buy15: 4000, buy30: 12000, buy60: 24000 },
            { time: 60, reward: 160000, diff: 95, buy15: 4000, buy30: 12000, buy60: 24000 }
        ]
    }
];

// --- DUPLICATE FUNCTIONS REMOVED ---


// --- DOM ELEMENTS ---
const homeScreen = document.getElementById('home-screen');
const levelScreen = document.getElementById('level-select-screen');
const paymentScreen = document.getElementById('payment-screen');
const gameScreen = document.getElementById('game-screen');

// Login & Dashboard
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

// Navigation
const playBtn = document.getElementById('play-btn');
const backHomeBtn = document.getElementById('back-home-btn');
const backLevelsBtn = document.getElementById('back-levels-btn');
const quitBtn = document.getElementById('quit-btn');


// Displays
const globalWalletDisplay = document.getElementById('global-wallet');
const levelWalletDisplay = document.getElementById('level-wallet');
const levelsContainer = document.getElementById('levels-container');

// Payment Form
const regNickname = document.getElementById('reg-nickname');
const regEmail = document.getElementById('reg-email');
const regHash = document.getElementById('reg-hash');
const submitPaymentBtn = document.getElementById('submit-payment-btn');
const levelChecksContainer = document.getElementById('level-checks-container');

// Game UI
const gridEl = document.getElementById('grid');
const width = 8; // Default Width for 8x8 Grid
const levelNameDisplay = document.getElementById('current-level-name');
const roundDisplay = document.getElementById('level-display');
const targetDisplay = document.getElementById('target-display');
const scoreDisplay = document.getElementById('game-score');
const timeDisplay = document.getElementById('time-display');

// Modals
const modal = document.getElementById('modal');
const roundModal = document.getElementById('round-modal');
const buyTimeModal = document.getElementById('buy-time-modal');

const airdropForm = document.getElementById('airdrop-form');
const registerBtn = document.getElementById('register-btn');

// --- GAME STATE ---

const fruits = ['🍎', '🍌', '🍇', '🍊', '🍓', '🥝'];
let grid = [];
let wallet = 0;

// DEMO State
let isDemoMode = false;
let demoWallet = 40;

let currentLevelIdx = 0;
let currentRoundIdx = 0;
let score = 0;
let targetScore = 0;
let moves = 999;
let timeLeft = 0;

let gameInterval = null;
let timerInterval = null;
let selectedCell = null;
let ingameBalance = 0; // New Variable for Level Balance

// --- INITIALIZATION ---
init();

function init() {
    ensureAdminUser(); // Auto-restore Admin User

    // Load Wallet
    const savedWallet = localStorage.getItem('fruitWallet');
    wallet = savedWallet ? parseInt(savedWallet) : 0;
    updateWalletUI();

    // 1. CAPTURE REFERRAL FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) {
        localStorage.setItem('pendingReferrer', refParam);
        console.log("Referrer captured:", refParam);
        // Optional: Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    updateReferralUI();

    // Listeners
    if (playBtn) playBtn.addEventListener('click', showLevelSelect);

    // NEW PLAY BUTTON (Home) - REMOVED as per instruction to restore original playBtn
    // const playBtnHome = document.getElementById('btn-play-home');
    // if (playBtnHome) playBtnHome.addEventListener('click', showLevelSelect);

    // NEW WITHDRAW BUTTON (Home) - REMOVED as per instruction to restore original withdraw-btn
    // const btnWithdrawHome = document.getElementById('btn-withdraw-home');
    // if (btnWithdrawHome) {
    //     btnWithdrawHome.addEventListener('click', () => {
    //         const myNickname = localStorage.getItem('fruitNickname');
    //         const requests = getRequests();
    //         // Priority: Won Request (Fixed Reward) 
    //         const activeReq = requests.find(r => r.nickname === myNickname && r.status === 'level_won');

    //         if (activeReq && activeReq.currentBalance > 0) {
    //             // ACTIVE MODE: Pre-fill and Enable
    //             currentLevelIdx = activeReq.levelId;
    //             openWithdrawModal(activeReq.currentBalance, false); // false = not informative
    //         } else {
    //             // INFORMATIVE MODE: Show empty/readonly
    //             openWithdrawModal(0, true); // true = informative
    //         }
    //     });
    // }

    // NEW COPY BUTTON (Home) - REMOVED as per instruction to restore original logic
    // const btnCopyHome = document.getElementById('home-copy-btn');
    // if (btnCopyHome) {
    //     btnCopyHome.addEventListener('click', () => {
    //         const input = document.getElementById('home-referral-link');
    //         if (input && input.value) {
    //             navigator.clipboard.writeText(input.value);
    //             alert("Link copiado: " + input.value);
    //         }
    //     });
    // }

    // NAV BUTTONS
    const navLevels = document.getElementById('nav-levels-btn');
    if (navLevels) navLevels.addEventListener('click', showLevelSelect);

    if (backHomeBtn) backHomeBtn.addEventListener('click', () => {
        levelScreen.classList.remove('active');
        homeScreen.classList.add('active');
    });
}

// quitBtn removed (legacy)



if (submitPaymentBtn) submitPaymentBtn.addEventListener('click', submitPaymentRequest);

// Buy Time
const btn15 = document.getElementById('buy-15s-btn');
if (btn15) btn15.addEventListener('click', () => buyTime(15));

const btn30 = document.getElementById('buy-30s-btn');
if (btn30) btn30.addEventListener('click', () => buyTime(30));

const btn60 = document.getElementById('buy-60s-btn');
if (btn60) btn60.addEventListener('click', () => buyTime(60));

const btnGiveUp = document.getElementById('give-up-btn');
if (btnGiveUp) btnGiveUp.addEventListener('click', quitGame);

const btnCancelBuy = document.getElementById('cancel-buy-btn');
if (btnCancelBuy) btnCancelBuy.addEventListener('click', () => {
    buyTimeModal.classList.add('hidden');
    gameOver();
});

// Withdrawal Logic
const btnCancelWith = document.getElementById('cancel-withdraw-btn');
if (btnCancelWith) btnCancelWith.addEventListener('click', () => {
    document.getElementById('withdraw-modal').classList.add('hidden');
});

const btnSubmitWith = document.getElementById('submit-withdraw-btn');
if (btnSubmitWith) btnSubmitWith.addEventListener('click', submitWithdrawal);

// PROMO LOGIC
const btnPromo = document.getElementById('submit-promo-btn');
if (btnPromo) btnPromo.addEventListener('click', submitPromo);

// PROMO BUTTON IN MAIN SCREEN
const btnPromoMain = document.getElementById('promo-btn-main');
if (btnPromoMain) btnPromoMain.addEventListener('click', () => {
    document.getElementById('promo-modal').classList.remove('hidden');
});

// MAIN SCREEN WITHDRAW BUTTON (Fixing missing listener)
const mainWithdrawBtn = document.getElementById('withdraw-btn');
if (mainWithdrawBtn) {
    mainWithdrawBtn.addEventListener('click', () => {
        const myNickname = localStorage.getItem('fruitNickname');
        const requests = getRequests();
        // Priority: Won Request (Fixed Reward) ONLY. 'approved' (Entry Fee) is NOT withdrawable.
        const activeReq = requests.find(r => r.nickname === myNickname && r.status === 'level_won');



        // Determine Amount
        let amountToWithdraw = 0;
        if (activeReq && activeReq.status === 'level_won') {
            amountToWithdraw = activeReq.currentBalance || 0;
        } else if (activeReq) {
            amountToWithdraw = activeReq.initialBalance !== undefined ? activeReq.initialBalance : activeReq.netMonto;
        }

        // Set Global Context for Withdrawal Modal (if exists)
        if (activeReq) {
            currentLevelIdx = activeReq.levelId;
        }

        // CORRECTED: Always open modal (shows 0 if no balance, or available balance)
        openWithdrawModal();
    });
}

// Modals
const nextRound = document.getElementById('next-round-btn');
if (nextRound) nextRound.addEventListener('click', startNextRound);

/* REMOVED restart-btn listener - Handled dynamically */

if (registerBtn) registerBtn.addEventListener('click', () => {
    alert("Registro no necesario en esta version.");
});

// setupAdmin(); (Called below)

// --- ECONOMY & REQUESTS ---
function updateWalletUI() {
    // 1. CALCULATE WON BALANCE (Global/Withdrawable)
    // Rule: "Saldo ganado... acumulable... reflejarse en pantalla principal".
    // Does NOT include "Entry Fees" (approved requests).
    const myNickname = localStorage.getItem('fruitNickname');
    const requests = getRequests();

    // Sum ALL 'level_won' requests
    const winningReqs = requests.filter(r => r.nickname === myNickname && r.status === 'level_won');
    const totalWon = winningReqs.reduce((sum, r) => sum + (r.currentBalance || 0), 0);

    // 2. DEMO BALANCE
    let currentDemoBalance = 0;
    if (typeof demoWallet !== 'undefined') currentDemoBalance = demoWallet;

    // UPDATE UI ELEMENTS
    // Main Screen & Level Select -> Show WON Balance (Retirable)
    const globalWalletDisplay = document.getElementById('global-wallet');
    if (globalWalletDisplay) globalWalletDisplay.innerText = totalWon.toLocaleString();

    const demoDisplay = document.getElementById('demo-wallet');
    if (demoDisplay) demoDisplay.innerText = currentDemoBalance.toLocaleString();

    // Level Select Wallet (Menu)
    const levelWalletDisplay = document.getElementById('level-wallet');
    if (levelWalletDisplay) {
        levelWalletDisplay.innerText = totalWon.toLocaleString();
    }

    // Update In-Game UI
    const ingameWalletUI = document.getElementById('ingame-wallet');
    if (ingameWalletUI && document.getElementById('game-screen').classList.contains('active')) {
        ingameWalletUI.innerText = ingameBalance;
    }

    // Update PROMO button visibility
    updatePromoButtonVisibility();
}

// In-Game Wallet (New Element check)
// If we want to show balance INSIDE the game grid screen
const ingameWalletElement = document.getElementById('ingame-wallet');
if (ingameWalletElement) {
    if (isDemoMode) {
        ingameWalletElement.innerText = ingameBalance.toLocaleString();
    } else {
        ingameWalletElement.innerText = ingameBalance.toLocaleString();
    }
}


function addFunds(amount) {
    if (isDemoMode) {
        demoWallet += amount;
        updateWalletUI();
        return;
    }

    wallet += amount;
    updateWalletUI();
    if (gameScreen.classList.contains('active')) {
        updateRequestEconomy(amount);
    }
}

function updateRequestEconomy(amount) {
    if (isDemoMode) return;

    const requests = getRequests();
    const activeReqIndex = requests.findIndex(r => r.levelId === currentLevelIdx && r.status === 'approved');

    if (activeReqIndex !== -1) {
        if (!requests[activeReqIndex].netMonto) requests[activeReqIndex].netMonto = 0;
        requests[activeReqIndex].netMonto += amount;
        localStorage.setItem('fruitRequests', JSON.stringify(requests));
    }
}

function getRequests() {
    const raw = localStorage.getItem('fruitRequests');
    return raw ? JSON.parse(raw) : [];
}

// --- LEVEL SELECT ---
function showLevelSelect() {
    homeScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    paymentScreen.classList.remove('active');
    levelScreen.classList.add('active');
    isDemoMode = false;
    updateWalletUI();
    renderLevels();
}

function renderLevels() {
    levelsContainer.innerHTML = '';
    const requests = getRequests();

    // 1. RENDER DEMO CARD FIRST
    const demoCard = document.createElement('div');
    demoCard.className = `level-card demo`;
    demoCard.innerHTML = `
            <div class="level-info">
                <h3>DEMO</h3>
                <p>3 Rondas<br>Gana: 0 (Práctica)</p>
            </div>
            <button class="btn-demo-play">JUGAR</button>
        `;
    demoCard.addEventListener('click', () => {
        startDemoGame();
    });
    levelsContainer.appendChild(demoCard);


    // 2. RENDER REAL LEVELS
    LEVEL_DATA.forEach(level => {
        const reqsForLevel = requests.filter(r => r.levelId === level.id);
        const isApproved = reqsForLevel.some(r => r.status === 'approved');
        const isPending = reqsForLevel.some(r => r.status === 'pending');

        const card = document.createElement('div');
        card.className = `level-card ${level.color.toLowerCase()} ${!isApproved && !isPending && level.id !== 0 ? 'locked' : ''}`;

        let statusClass = 'status-locked';
        let statusIcon = '🔒';
        let statusText = `ENTRADA: ${level.fee}`;

        if (isApproved) {
            statusClass = 'status-unlocked';
            statusIcon = '▶';
            statusText = 'JUGAR';
        } else if (isPending) {
            statusClass = 'status-pending';
            statusIcon = '⏳';
            statusText = 'PENDIENTE';
        }

        card.innerHTML = `
                <div class="level-info">
                    <h3>${level.id + 1}. ${level.name}</h3>
                    <p>3 Rondas<br>Gana: ${level.rounds[2].reward.toLocaleString()}</p>
                </div>
                <div class="level-status-badge ${statusClass}">
                    ${statusIcon} ${statusText}
                </div>
            `;

        card.addEventListener('click', () => {
            if (isApproved) {
                currentLevelIdx = level.id;
                currentRoundIdx = 0;
                startGame(false);
            } else if (isPending) {
                alert("Tu solicitud está en revisión. Espera al Administrador.");
            } else {
                goToPaymentForm(level);
            }
        });
        levelsContainer.appendChild(card);
    });
}

// --- PAYMENT FORM ---
function goToPaymentForm(selectedLevel) {
    levelScreen.classList.remove('active');
    paymentScreen.classList.add('active');

    // Navigation: Back to Levels
    if (backLevelsBtn) {
        backLevelsBtn.onclick = () => {
            paymentScreen.classList.remove('active');
            levelScreen.classList.add('active');
        };
    }

    // Copy Wallet Address Logic
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.onclick = () => {
            const input = document.getElementById('wallet-text-input');
            if (input) {
                navigator.clipboard.writeText(input.value).then(() => {
                    alert('¡Dirección copiada!');
                }).catch(err => {
                    console.error('Error al copiar', err);
                });
            }
        };
    }

    // Populate Read-Only Level Info
    const paramName = document.getElementById('payment-level-name');
    const paramFee = document.getElementById('payment-level-fee');
    const hiddenInput = document.getElementById('selected-level-id');

    if (paramName) paramName.innerText = `${selectedLevel.id + 1} ${selectedLevel.name}`;
    if (paramFee) paramFee.innerText = `ENVÍA ${selectedLevel.fee} USDT`;
    if (hiddenInput) hiddenInput.value = selectedLevel.id;

    // 3. AUTO-FILL LOGIC (User Database)
    const myNick = localStorage.getItem('fruitNickname');
    const myEmail = localStorage.getItem('fruitEmail');
    const termsCheckbox = document.getElementById('terms-checkbox');

    // Reset Checkbox Default
    if (termsCheckbox) {
        termsCheckbox.checked = false;
        termsCheckbox.disabled = false;
    }

    if (myNick) {
        // Returning User: Lock ID fields
        if (regNickname) {
            regNickname.value = myNick;
            regNickname.disabled = true;
            regNickname.classList.add('input-light');
            regNickname.style.backgroundColor = "#e8f0fe";
        }
        if (regEmail) {
            regEmail.value = myEmail;
            regEmail.disabled = true;
            regEmail.classList.add('input-light');
            regEmail.style.backgroundColor = "#e8f0fe";
        }

        // Check Terms Status
        const users = getUsers();
        const me = users.find(u => u.nickname === myNick);
        if (me && me.termsAccepted) {
            if (termsCheckbox) {
                termsCheckbox.checked = true;
                termsCheckbox.disabled = true; // Prevent unchecking
            }
        }

    } else {
        // New User: Unlock
        if (regNickname) {
            regNickname.value = '';
            regNickname.disabled = false;
            regNickname.classList.add('input-light');
            regNickname.style.backgroundColor = "#f1f2f6";
        }
        if (regEmail) {
            regEmail.value = '';
            regEmail.disabled = false;
            regEmail.classList.add('input-light');
            regEmail.style.backgroundColor = "#f1f2f6";
        }
    }

    const pendingRef = localStorage.getItem('pendingReferrer');
    if (pendingRef) {
        const refInput = document.getElementById('reg-referrer');
        if (refInput) refInput.value = pendingRef;
    }

} // End of goToPaymentForm

function submitPaymentRequest() {
    const nickname = regNickname.value.trim();
    const email = regEmail.value.trim();
    const hash = regHash.value.trim();
    const selectedLevelId = document.getElementById('selected-level-id').value;
    const referrerCode = document.getElementById('reg-referrer').value.trim();
    const userWallet = document.getElementById('reg-user-wallet').value.trim(); // Capture User Wallet
    const termsAccepted = document.getElementById('terms-checkbox').checked;

    if (!nickname || !email || !hash || selectedLevelId === "") {
        alert("Por favor completa todos los campos.");
        return;
    }

    if (!termsAccepted) {
        alert("Debes aceptar los Términos y Condiciones para continuar.");
        return;
    }

    // 1. DATABASE VALIDATION
    const users = getUsers();
    const existingNick = users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase());
    const existingEmail = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    // Wallet Validation
    const existingWallet = users.find(u => u.wallet && u.wallet.toLowerCase() === userWallet.toLowerCase());

    // Check if I am the owner of this session
    const storedNick = localStorage.getItem('fruitNickname');

    // Logic:
    // If I have no stored session (New Device/User):
    //   - If Nick or Email taken -> ERROR "Ya existe".
    //   - If Wallet taken -> ERROR "Wallet ya registrada".
    // If I have stored session (Returning):
    //   - If Valid Nick matches stored -> OK.
    //   - If I try to change Nick to another existing one -> ERROR.

    if (!storedNick) {
        // ADMIN RESTORATION EXCEPTION: If is admin user trying to login, allow it.
        const isAdminLogin = (nickname.toLowerCase() === FIXED_ADMIN_USER && existingNick);

        if (!isAdminLogin) {
            if (existingNick) {
                alert("⛔ EL NICKNAME YA EXISTE. Por favor elige otro.");
                return;
            }
            if (existingEmail) {
                alert("⛔ EL CORREO YA ESTA REGISTRADO. Por favor usa otro.");
                return;
            }
            if (existingWallet) {
                alert("⛔ ESTA WALLET YA ESTA REGISTRADA. Una wallet solo puede pertenecer a un usuario.");
                return;
            }
        } else {
            // If Admin, verify email match for security (optional but good practice)
            if (email.toLowerCase() !== FIXED_ADMIN_EMAIL.toLowerCase()) {
                alert("⛔ Correo incorrecto para el usuario Admin.");
                return;
            }
        }
    } else {
        // Ensuring consistency
        if (nickname !== storedNick) {
            alert("⛔ NO PUEDES CAMBIAR TU NICKNAME. Usa el registrado: " + storedNick);
            return;
        }
    }

    // 2. CREATE REQUEST
    const newReq = {
        id: Date.now(),
        nickname,
        email,
        levelId: parseInt(selectedLevelId),
        hash,
        date: new Date().toISOString(),
        status: 'pending',
        netMonto: 0,
        manualWallet: userWallet,
        adminPaymentHash: "",
        adminPaymentDate: "",
        adminName: "",
        referrer: referrerCode
    };

    const requests = getRequests();
    requests.push(newReq);
    localStorage.setItem('fruitRequests', JSON.stringify(requests));

    // 3. REGISTER USER (First Time) OR ADMIN LOGIN
    const isAdminLogin = (nickname.toLowerCase() === FIXED_ADMIN_USER && existingNick);

    if ((!existingNick && !storedNick) || (isAdminLogin && !storedNick)) {

        if (isAdminLogin) {
            alert("✅ ¡Bienvenido Admin! Sesión Restaurada.");
            localStorage.setItem('fruitNickname', nickname);
            localStorage.setItem('fruitEmail', email);
            // Ensure visibility is correct immediately
            if (typeof updateAdminVisibility === 'function') updateAdminVisibility();
        } else {
            // STRICT RULE: Automatic Invite Link for Everyone (Organic or Referred)
            const inviteLink = `${window.location.href.split('?')[0]}?ref=${nickname}`;

            // Determine Origin
            const origin = referrerCode ? `Referido por: ${referrerCode}` : "Directo (Orgánico)";

            users.push({
                id: Date.now(),
                nickname: nickname,
                email: email,
                wallet: userWallet,
                date: new Date().toISOString(),
                inviteLink: inviteLink,
                origin: origin,
                referredBy: referrerCode || null,
                termsAccepted: termsAccepted // Save status
            });
            localStorage.setItem('fruitUsers', JSON.stringify(users));
        }

    } else if (storedNick) {
        // Existing User: Update Terms if not set
        const currentUserIndex = users.findIndex(u => u.nickname === storedNick);
        if (currentUserIndex !== -1) {
            users[currentUserIndex].termsAccepted = true;
            localStorage.setItem('fruitUsers', JSON.stringify(users));
        }
    }

    alert("¡Solicitud Enviada! El Administrador verificará tu pago.");
    localStorage.setItem('fruitNickname', nickname);
    localStorage.setItem('fruitEmail', email);

    regNickname.value = '';
    regHash.value = '';
    document.getElementById('reg-user-wallet').value = '';
    paymentScreen.classList.remove('active');
    levelScreen.classList.add('active');
    renderLevels();
    updateReferralUI();

    // Update Admin Link Visibility (Make me admin if I am the first one)
    if (typeof updateAdminVisibility === 'function') updateAdminVisibility();
}

let isLuckySession = false; // Status for 1/10 Rule

// --- GAME ENGINE ---
function startDemoGame() {
    isDemoMode = true;
    isLuckySession = false; // No lucky mode for demo
    demoWallet = 40;
    ingameBalance = 40;
    currentLevelIdx = -1;
    currentRoundIdx = 0;
    updateWalletUI();
    startGame(true);
}

function checkLuckyMode(levelId) {
    // Applies to ALL levels (Silver, Gold, Platinum, Diamond)
    // if (levelId !== 0 && levelId !== 1) { ... } REMOVED


    // Get Counters
    let counters = JSON.parse(localStorage.getItem('fruitLevelCounters') || '{}');
    if (!counters[levelId]) counters[levelId] = 0;

    // Increment (count attempt)
    counters[levelId]++;
    localStorage.setItem('fruitLevelCounters', JSON.stringify(counters));

    // Check Rule: 10th player (10, 20, 30...)
    if (counters[levelId] % 10 === 0) {
        isLuckySession = true;
        console.log(`🍀 LUCKY MODE ACTIVATED for Level ${levelId}! (Player #${counters[levelId]})`);
    } else {
        isLuckySession = false;
    }
}

function startGame(isDemo) {
    levelScreen.classList.remove('active');
    gameScreen.classList.add('active');

    // Initialize Level Balance (Saldo de Entrada)
    if (!isDemoMode && currentLevelIdx >= 0) {
        const lvl = LEVEL_DATA[currentLevelIdx];

        // Check for Transferred Balance
        const myNickname = localStorage.getItem('fruitNickname');
        const requests = getRequests();
        const accessReq = requests.find(r => r.levelId === currentLevelIdx && r.status === 'approved' && r.nickname === myNickname);

        if (accessReq && accessReq.initialBalance !== undefined) {
            ingameBalance = accessReq.initialBalance;
        } else {
            ingameBalance = lvl.fee;
        }

        // Check Lucky Mode (hidden)
        checkLuckyMode(currentLevelIdx);
    }

    startRound();
}

function startRound() {
    let levelConfig;
    let roundConfig;
    let diffPct;

    if (isDemoMode) {
        levelConfig = DEMO_LEVEL_CONFIG;
        roundConfig = DEMO_LEVEL_CONFIG.rounds[currentRoundIdx];
        diffPct = roundConfig.diff;
    } else {
        levelConfig = LEVEL_DATA[currentLevelIdx];
        roundConfig = levelConfig.rounds[currentRoundIdx];
        diffPct = roundConfig.diff;

        // OVERRIDE: Lucky Mode Rule (Silver/Gold only)
        if (isLuckySession) {
            // R1: 20%, R2: 30%, R3: 40% (Increased by 10% as requested)
            const luckyDiffs = [20, 30, 40];
            diffPct = luckyDiffs[currentRoundIdx] || diffPct;
        }
    }

    levelNameDisplay.innerText = levelConfig.name;
    roundDisplay.innerText = `${currentRoundIdx + 1}/3`;

    const baseSpeed = 15;
    // Apply diffPct instead of roundConfig.diff
    targetScore = Math.floor(roundConfig.time * baseSpeed * (diffPct / 100));
    targetDisplay.innerText = targetScore;

    score = 0;
    timeLeft = roundConfig.time;

    // CHECK REFERRAL BONUS
    if (!isDemoMode && currentRoundIdx === 0) {
        const textNick = localStorage.getItem('fruitNickname');
        if (textNick) {
            let timeWallets = JSON.parse(localStorage.getItem('fruitTimeWallets') || '{}');
            if (timeWallets[textNick] && timeWallets[textNick][currentLevelIdx] > 0) {
                const bonus = timeWallets[textNick][currentLevelIdx];
                timeLeft += bonus;
                alert(`¡Bono de Referido Activado! +${bonus} segundos añadidos.`);

                // Consume
                timeWallets[textNick][currentLevelIdx] = 0;
                localStorage.setItem('fruitTimeWallets', JSON.stringify(timeWallets));
            }
        }
    }

    updateGameUI();
    createBoard();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(gameTimerTick, 1000);

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        checkMatches();
        moveDown();
    }, 100);
}

function gameTimerTick() {
    timeLeft--;
    updateGameUI();
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        clearInterval(gameInterval);

        // CRITICAL FIX: If balance is 0, lock game immediately (can't buy more time)
        // Only show modal if user has balance to purchase time
        const balance = isDemoMode ? demoWallet : ingameBalance;

        if (!isDemoMode && balance <= 0) {
            // No balance left, game over
            gameOver();
        } else {
            // Has balance, offer to buy more time
            showBuyTimeModal();
        }
    }
}

function showBuyTimeModal() {
    let levelConfig;
    let roundConfig;
    if (isDemoMode) {
        levelConfig = DEMO_LEVEL_CONFIG;
        roundConfig = DEMO_LEVEL_CONFIG.rounds[currentRoundIdx];
    } else {
        levelConfig = LEVEL_DATA[currentLevelIdx];
        roundConfig = levelConfig.rounds[currentRoundIdx];
    }

    document.getElementById('cost-15s').innerText = `(${roundConfig.buy15} Ficha${roundConfig.buy15 > 1 ? 's' : ''})`;
    document.getElementById('cost-30s').innerText = `(${roundConfig.buy30} Ficha${roundConfig.buy30 > 1 ? 's' : ''})`;
    document.getElementById('cost-60s').innerText = `(${roundConfig.buy60} Ficha${roundConfig.buy60 > 1 ? 's' : ''})`;

    // Enable/Disable buttons based on available balance
    const balance = isDemoMode ? demoWallet : ingameBalance;

    const btn15 = document.getElementById('btn-15s');
    const btn30 = document.getElementById('btn-30s');
    const btn60 = document.getElementById('btn-60s');

    // CRITICAL FIX: Use >= instead of > to allow purchase when balance equals cost
    if (btn15) btn15.disabled = balance < roundConfig.buy15;
    if (btn30) btn30.disabled = balance < roundConfig.buy30;
    if (btn60) btn60.disabled = balance < roundConfig.buy60;

    buyTimeModal.classList.remove('hidden');
}

function buyTime(seconds) {
    let levelConfig;
    let roundConfig;
    if (isDemoMode) {
        levelConfig = DEMO_LEVEL_CONFIG;
        roundConfig = DEMO_LEVEL_CONFIG.rounds[currentRoundIdx];
        levelConfig = DEMO_LEVEL_CONFIG;
        roundConfig = DEMO_LEVEL_CONFIG.rounds[currentRoundIdx];
    } else {
        levelConfig = LEVEL_DATA[currentLevelIdx];
        roundConfig = levelConfig.rounds[currentRoundIdx];
    }

    let cost;
    if (seconds === 15) cost = roundConfig.buy15;
    if (seconds === 30) cost = roundConfig.buy30;
    if (seconds === 60) cost = roundConfig.buy60;

    let balance = isDemoMode ? demoWallet : ingameBalance; // Use ingameBalance for Paid

    if (balance >= cost) {
        if (isDemoMode) {
            // demoWallet -= cost; // Unlimited per request? "No se bloquea". Let's deduct but ignore 0.
            ingameBalance -= cost;
            updateWalletUI();
        } else {
            ingameBalance -= cost;
            // wallet -= cost; // DISABLED: User implies 'Saldo' (Entry Fee) is the budget. Global Wallet untouched?
            // If we touch global wallet, then 'Saldo' isn't just Entry Fee. 
            // "El SALDO se irá descontando...".
            // I will update the UI below.
        }

        buyTimeModal.classList.add('hidden');
        timeLeft += seconds;
        updateGameUI(); // Update immediately to show new balance

        // CORRECTED: Don't lock immediately after buying time
        // The game will lock naturally when time runs out (gameTimerTick checks this)
        // This allows users to use their purchased seconds even if balance is now 0

        timerInterval = setInterval(gameTimerTick, 1000);
        gameInterval = setInterval(() => {
            checkMatches();
            moveDown();
        }, 100);
    } else {
        alert("Saldo insuficiente para comprar tiempo.");
    }
}

function updateGameUI() {
    // Score
    const scoreEl = document.getElementById('game-score');
    if (scoreEl) scoreEl.innerText = score;

    // Time
    const timeEl = document.getElementById('time-display');
    if (timeEl) timeEl.innerText = timeLeft;

    // Round
    const roundEl = document.getElementById('level-display');
    if (roundEl) roundEl.innerText = `${currentRoundIdx + 1}/3`;

    // Meta (Target) -> "Score / Target"
    const targetEl = document.getElementById('target-display');
    if (targetEl) targetEl.innerText = `${score}/${targetScore}`;

    // Saldo (Dynamic from Wallet)
    const walletEl = document.getElementById('ingame-wallet');
    if (walletEl) {
        walletEl.innerText = isDemoMode ? "∞" : ingameBalance; // Show ingameBalance (or Infinite for Demo)
    }
}

function createBoard() {
    gridEl.innerHTML = '';
    grid = [];
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.id = i;
        square.classList.add('cell');
        square.innerHTML = fruits[Math.floor(Math.random() * fruits.length)];
        gridEl.appendChild(square);
        grid.push(square);
        square.addEventListener('click', clickMove);
    }
}

function clickMove() {
    if (!selectedCell) {
        selectedCell = this;
        this.classList.add('selected');
    } else {
        const currentId = parseInt(this.id);
        const prevId = parseInt(selectedCell.id);
        selectedCell.classList.remove('selected');
        selectedCell = null;

        if (currentId === prevId) return;

        const validMoves = [prevId - 1, prevId + 1, prevId - width, prevId + width];
        if (validMoves.includes(currentId)) {
            swapFruits(grid[prevId], grid[currentId]);
            setTimeout(() => {
                const match = checkMatches();
                if (!match) {
                    swapFruits(grid[prevId], grid[currentId]);
                } else {
                    score += 10;
                    checkWinCondition();
                }
            }, 150);
        }
    }
}

function swapFruits(a, b) {
    const temp = a.innerHTML;
    a.innerHTML = b.innerHTML;
    b.innerHTML = temp;
}

function checkMatches() {
    let matchFound = false;
    // Simplified match logic
    for (let i = 0; i < 64; i++) {
        if (i % width > width - 3) continue;
        const row = [i, i + 1, i + 2];
        const fruit = grid[i].innerHTML;
        if (fruit === '') continue;
        if (row.every(idx => grid[idx].innerHTML === fruit)) {
            matchFound = true;
            score += 10;
            row.forEach(idx => {
                grid[idx].innerHTML = '';
                grid[idx].classList.add('match-anim');
                setTimeout(() => grid[idx].classList.remove('match-anim'), 200);
            });
        }
    }
    for (let i = 0; i < 47; i++) {
        const col = [i, i + width, i + width * 2];
        const fruit = grid[i].innerHTML;
        if (fruit === '') continue;
        if (col.every(idx => grid[idx].innerHTML === fruit)) {
            matchFound = true;
            score += 10;
            col.forEach(idx => {
                grid[idx].innerHTML = '';
                grid[idx].classList.add('match-anim');
                setTimeout(() => grid[idx].classList.remove('match-anim'), 200);
            });
        }
    }

    if (matchFound) {
        playMatchSound();
        updateGameUI();
        checkWinCondition();
    }
    return matchFound;
}

function moveDown() {
    for (let i = 0; i < 56; i++) {
        if (grid[i + width].innerHTML === '') {
            grid[i + width].innerHTML = grid[i].innerHTML;
            grid[i].innerHTML = '';
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            if (firstRow.includes(i) && grid[i].innerHTML === '') {
                grid[i].innerHTML = fruits[Math.floor(Math.random() * fruits.length)];
            }
        }
    }
    for (let i = 0; i < width; i++) {
        if (grid[i].innerHTML === '') {
            grid[i].innerHTML = fruits[Math.floor(Math.random() * fruits.length)];
        }
    }
}

function checkWinCondition() {
    if (score >= targetScore) {
        clearInterval(timerInterval);
        clearInterval(gameInterval);

        let reward;
        if (isDemoMode) reward = DEMO_LEVEL_CONFIG.rounds[currentRoundIdx].reward;
        else reward = LEVEL_DATA[currentLevelIdx].rounds[currentRoundIdx].reward;

        // Visual only for intermediate rounds
        document.getElementById('round-reward').innerText = `+${reward} Fichas`;

        // LOGIC FIX: Do not accumulate balance yet. 
        // Only set FINAL balance on Level Win.
        // But for intermediate rounds? "Ganancia fija del nivel".
        // Example: Silver R1(10), R2(20), R3(40).
        // If I win R1, do I get 10? User says "No acumula".
        // But "Saldo disponible: 40" is for the FULL level.
        // So intermediate winnings are likely just visual progress or consumed by buying time?
        // Let's add funds for now to keep game playable, BUT on final win we RESET it.
        addFunds(reward);

        roundModal.classList.remove('hidden');
    }
}

function startNextRound() {
    roundModal.classList.add('hidden');
    currentRoundIdx++;
    if (currentRoundIdx >= 3) {
        showLevelWin();
    } else {
        startRound();
    }
}

function showLevelWin() {
    let levelConfig;
    if (isDemoMode) levelConfig = DEMO_LEVEL_CONFIG;
    else levelConfig = LEVEL_DATA[currentLevelIdx];

    // FIX: Set Balance to exact Level Reward (Ignore previous accumulations)
    // Example: Silver = 40.
    const finalReward = levelConfig.rounds[2].reward;

    if (!isDemoMode) {
        ingameBalance = finalReward; // FORCE SET
        wallet = finalReward; // Sync Global Wallet (optional but safe)
        updateWalletUI();

        // Update Request Status to 'level_completed' (Pending Decision)
        // Rule: Not visible in Wallet until "Withdraw" is clicked.
        const myNickname = localStorage.getItem('fruitNickname');
        const requests = getRequests();
        const activeReq = requests.find(r => r.levelId === currentLevelIdx && r.status === 'approved' && r.nickname === myNickname);
        if (activeReq) {
            activeReq.status = 'level_completed';
            activeReq.currentBalance = finalReward;
            localStorage.setItem('fruitRequests', JSON.stringify(requests));
        }
    }

    document.getElementById('modal-title').innerText = isDemoMode ? `¡MODO DEMO COMPLETADO!` : `¡${levelConfig.name} SUPERADO!`;
    document.getElementById('final-score').innerText = isDemoMode ? `Ganaste ${finalReward} Fichas (Virtual)` : `Ganaste ${finalReward} Fichas`;

    const actionContainer = document.getElementById('win-actions');
    actionContainer.innerHTML = ''; // Clear previous

    if (isDemoMode) {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary';
        btn.innerText = 'VOLVER A NIVELES';
        btn.onclick = () => {
            modal.classList.add('hidden');
            showLevelSelect();
        };
        actionContainer.appendChild(btn);
    } else {
        // PAID MODE ACTIONS
        const nextLevelId = currentLevelIdx + 1;
        const hasNextLevel = LEVEL_DATA.find(l => l.id === nextLevelId);

        // 1. WITHDRAW BUTTON (Option A - Makes Funds Retrievable)
        const btnWithdraw = document.createElement('button');
        btnWithdraw.className = 'btn-green';
        btnWithdraw.innerText = 'RETIRAR GANANCIAS';
        btnWithdraw.style.backgroundColor = '#2ecc71';
        btnWithdraw.style.color = 'white';
        btnWithdraw.style.marginBottom = '10px';
        btnWithdraw.onclick = () => {
            // DECISION: User chose to Withdraw.
            // Promote status from 'level_completed' to 'level_won' (Accumulable/Withdrawable)
            const myNickname = localStorage.getItem('fruitNickname');
            const requests = getRequests();
            const completedReq = requests.find(r => r.levelId === currentLevelIdx && r.status === 'level_completed' && r.nickname === myNickname);

            if (completedReq) {
                completedReq.status = 'level_won'; // NOW it becomes visible in global wallet
                localStorage.setItem('fruitRequests', JSON.stringify(requests));
                updateWalletUI(); // Refresh UI to show new balance
            }

            openWithdrawModal(finalReward);
        };
        actionContainer.appendChild(btnWithdraw);

        // 2. NEXT LEVEL BUTTON (Option B - "Reinvest/Cancel Withdrawal")
        if (hasNextLevel) {
            const btnNext = document.createElement('button');
            btnNext.className = 'btn-red';
            btnNext.innerText = 'CANCELAR (IR A SIGUIENTE NIVEL)'; // "CANCELAR" text as requested, with clarification
            btnNext.style.backgroundColor = '#e74c3c';
            btnNext.style.color = 'white';
            btnNext.onclick = () => handleNextLevel(finalReward, nextLevelId);
            actionContainer.appendChild(btnNext);
        }
    }

    // Force Close Level Logic: Clear Grid and Variables
    ingameBalance = 0; // Visual reset, real balance is in request
    gridEl.innerHTML = ''; // Clear Board
    if (timerInterval) clearInterval(timerInterval);
    if (gameInterval) clearInterval(gameInterval);

    modal.classList.remove('hidden');
    if (airdropForm) airdropForm.classList.add('hidden');

    // AUTO-OPEN PROMO MODAL ON LEVEL WIN
    // Check if user is eligible (promoEligible) AND has NO active link
    if (!isDemoMode) {
        const myNickname = localStorage.getItem('fruitNickname');
        const users = getUsers();
        const currentUser = users.find(u => u.nickname === myNickname);

        if (currentUser && currentUser.promoEligible === true) {
            const hasActiveLink = currentUser.tikTokLink && currentUser.tikTokLink.length > 0;
            if (!hasActiveLink) {
                setTimeout(() => {
                    document.getElementById('promo-modal').classList.remove('hidden');
                }, 1000); // 1 sec delay
            }
        }
    }
}

function openWithdrawModal(amountConfig) {
    // amountConfig can be a number (won amount) or null (manual click)
    const users = getUsers();
    const myNickname = localStorage.getItem('fruitNickname');
    const currentUser = users.find(u => u.nickname === myNickname);

    // DOM Elements
    const walletInput = document.getElementById('with-wallet');
    const balanceLabel = document.getElementById('with-balance');
    const availableText = document.getElementById('label-available');
    const amountInput = document.getElementById('with-amount');
    const submitBtn = document.getElementById('submit-withdraw-btn');
    const modal = document.getElementById('withdraw-modal');

    // 1. Determine State
    const hasWallet = currentUser && currentUser.wallet;

    // Check if there is a pending WON level request (Strictly 'level_won')
    // "Saldo" is ONLY what is won in a level.
    const requests = getRequests();

    let wonBalance = 0;

    if (typeof amountConfig === 'number') {
        // Strict Accumulation Rule: Ignore single reward, always recalc TOTAL available from "level_won" pool.
        // We calculate below.
    }

    // Search for ALL 'level_won' status which indicates funds available to withdraw
    // REGLA: ACUMULACION
    const winningReqs = requests.filter(r => r.nickname === myNickname && r.status === 'level_won');

    // Sum all available balances
    wonBalance = winningReqs.reduce((sum, r) => sum + (r.currentBalance || 0), 0);

    // 2. Setup UI
    if (hasWallet) {
        walletInput.value = currentUser.wallet;
        // walletInput.placeholder = ""; 
    } else {
        walletInput.value = "";
        walletInput.placeholder = "Usuario no registrado";
    }

    // 3. Balance & Input Logic
    if (wonBalance > 0) {
        balanceLabel.innerText = `${wonBalance} USDT`;
        availableText.classList.remove('hidden');

        amountInput.disabled = false;
        amountInput.max = wonBalance;
        amountInput.dataset.max = wonBalance;
        // Do NOT enable submit yet, wait for input
    } else {
        balanceLabel.innerText = "0.00 USDT";
        availableText.classList.remove('hidden'); // Show 0.00 to be clear

        amountInput.value = "";
        amountInput.disabled = true;
        amountInput.placeholder = "Sin saldo retirable";
        amountInput.dataset.max = 0;
        submitBtn.disabled = true;
    }

    // 4. Real-time Listeners
    amountInput.oninput = function () {
        if (!wonBalance || wonBalance <= 0) {
            this.value = "";
            submitBtn.disabled = true;
            return;
        }

        // REAL-TIME VALIDATION: Prevent typing > Max
        let val = parseFloat(this.value);
        const max = parseFloat(this.dataset.max);

        if (val > max) {
            this.value = max; // Clamp
            alert(`El saldo máximo a retirar es ${max}`);
            val = max;
        }
        if (val < 0) this.value = 0;

        // Enable button only if Valid
        if (val > 0 && val <= max) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    };
    // 5. Open Modal
    if (modal) {
        modal.classList.remove('hidden');

        // FIX: Force Exit to Levels on Cancel/Close to prevent "frozen game" state
        document.getElementById('close-withdraw-modal').onclick = () => {
            modal.classList.add('hidden');
            if (document.getElementById('game-screen').classList.contains('active')) {
                showLevelSelect();
            }
        };
        document.getElementById('cancel-withdraw-btn').onclick = () => {
            modal.classList.add('hidden');
            if (document.getElementById('game-screen').classList.contains('active')) {
                showLevelSelect();
            }
        };
    }

    document.getElementById('withdraw-modal').classList.remove('hidden');
    // Hide Win Modal if open
    if (document.getElementById('modal')) document.getElementById('modal').classList.add('hidden');
}

function submitWithdrawal() {
    const inputAmount = document.getElementById('with-amount').value;
    const maxAmount = parseFloat(document.getElementById('with-amount').dataset.max);
    const amount = parseFloat(inputAmount);

    if (isNaN(amount) || amount <= 0) {
        alert("Por favor ingresa un monto válido mayor a 0.");
        return;
    }

    // FIX: Strict Validation
    if (amount > maxAmount) {
        alert(`No puedes retirar un monto mayor al saldo disponible (${maxAmount} USDT).`);
        return;
    }

    if (!confirm(`¿Confirmas retirar ${amount} USDT a la wallet indicada?`)) return;

    // EXECUTE WITHDRAWAL (POOL DEDUCTION)
    const myNickname = localStorage.getItem('fruitNickname') || "User";
    const requests = getRequests();
    const userWallet = document.getElementById('with-wallet').value;

    // Find all contributors (level_won)
    const winningReqs = requests.filter(r => r.nickname === myNickname && r.status === 'level_won');

    // Deduct logic
    let remainingToDeduct = amount;

    for (let req of winningReqs) {
        if (remainingToDeduct <= 0) break;

        let availableInReq = req.currentBalance || 0;

        if (availableInReq > 0) {
            if (availableInReq >= remainingToDeduct) {
                // This request covers the rest
                req.currentBalance -= remainingToDeduct;
                remainingToDeduct = 0;
            } else {
                // Take all from this request
                remainingToDeduct -= availableInReq;
                req.currentBalance = 0;
            }

            // Note: We keep status 'level_won' even if balance is 0 for history, 
            // or mark as finished if we want to clean up. 
            // User requirement: "Conservar saldo pendiente". Implies keeping record.
            // If balance is 0, it won't be summed next time.
        }
    }

    const newReq = {
        id: Date.now(),
        nickname: myNickname,
        email: "",
        levelId: currentLevelIdx,
        hash: "RETIRO SOLICITADO",
        date: new Date().toISOString(),
        status: 'pending_withdrawal',
        netMonto: 0,
        withdrawalAmount: amount,
        maxBalance: maxAmount,
        manualWallet: userWallet,
        adminPaymentHash: "",
        adminPaymentDate: "",
        adminName: "",
        type: 'WITHDRAWAL'
    };

    requests.push(newReq);

    ingameBalance = 0; // Reset Local
    localStorage.setItem('fruitRequests', JSON.stringify(requests));

    updateWalletUI();

    if (maxAmount - amount > 0) {
        alert(`✅ Solicitud Enviada. Restante: ${(maxAmount - amount).toFixed(2)} USDT`);
        showLevelSelect();
    } else {
        alert("✅ Solicitud de Retiro Total Enviada.");
        showLevelSelect();
    }

    document.getElementById('withdraw-modal').classList.add('hidden');

    // PROMO ACTIVATION: Mark user as eligible
    const users = getUsers();
    const userIndex = users.findIndex(u => u.nickname === myNickname);
    if (userIndex !== -1) {
        users[userIndex].promoEligible = true; // Mark as eligible for PROMO
        users[userIndex].firstWithdrawalDate = users[userIndex].firstWithdrawalDate || new Date().toISOString();
        localStorage.setItem('fruitUsers', JSON.stringify(users));

        // Show PROMO modal immediately after withdrawal ONLY IF no active link
        const hasActiveLink = users[userIndex].tikTokLink && users[userIndex].tikTokLink.length > 0;

        if (!hasActiveLink) {
            setTimeout(() => {
                document.getElementById('promo-modal').classList.remove('hidden');
            }, 500);
        }

        updatePromoButtonVisibility(); // Update button visibility
    }
}


function submitPromo() {
    const linkInput = document.getElementById('promo-link');
    const link = linkInput.value.trim();

    if (!link) {
        alert("Por favor pega el enlace de tu video de TikTok.");
        return;
    }

    if (!link.toLowerCase().includes('tiktok.com')) {
        if (!confirm("El enlace no parece de TikTok. ¿Enviar de todas formas?")) return;
    }

    // Save to current User
    const myNick = localStorage.getItem('fruitNickname');
    const users = getUsers();
    const userIndex = users.findIndex(u => u.nickname === myNick);

    if (userIndex !== -1) {
        users[userIndex].tikTokLink = link;
        users[userIndex].promoDate = new Date().toISOString();
        users[userIndex].promoLevelId = currentLevelIdx; // Context
        localStorage.setItem('fruitUsers', JSON.stringify(users));

        alert("¡Participación Enviada con Éxito! Buena suerte.");
        document.getElementById('promo-modal').classList.add('hidden');
        document.getElementById('promo-modal').style.display = 'none';
    } else {
        alert("Error: Usuario no encontrado.");
    }
}

// Update PROMO button visibility based on user eligibility
function updatePromoButtonVisibility() {
    const myNickname = localStorage.getItem('fruitNickname');
    if (!myNickname) return;

    const users = getUsers();
    const currentUser = users.find(u => u.nickname === myNickname);
    const promoBtn = document.getElementById('promo-btn-main');

    if (!promoBtn) return;

    // STRICT RULES: Show PROMO button only if:
    // 1. User has won at least one level (NOT demo)
    // 2. User has made at least one withdrawal (promoEligible flag)
    // 3. NEW: User DOES NOT have an active TikTok link
    const hasActiveLink = currentUser.tikTokLink && currentUser.tikTokLink.length > 0;

    if (currentUser && currentUser.promoEligible === true && !hasActiveLink) {
        promoBtn.classList.remove('hidden');
    } else {
        promoBtn.classList.add('hidden');
    }
}


function handleNextLevel(amount, nextLevelId) {
    if (!confirm(`¿Usar tus ${amount} fichas para solicitar acceso al siguiente nivel?`)) return;


    // 1. Create Access Request (Ingreso Interno)
    const myNickname = localStorage.getItem('fruitNickname') || "User";
    const users = getUsers();
    const currentUser = users.find(u => u.nickname === myNickname);
    const requests = getRequests();

    const newReq = {
        id: Date.now(),
        nickname: myNickname,
        email: currentUser ? currentUser.email : "", // Auto-fill Email
        levelId: nextLevelId,
        hash: "compra de nivel", // Fixed Hash logic as requested
        date: new Date().toISOString(),
        status: 'pending',
        netMonto: amount,
        manualWallet: currentUser ? currentUser.wallet : "", // Auto-fill Wallet
        adminPaymentHash: "",
        adminPaymentDate: "",
        adminName: "",
        referrer: "",
        initialBalance: amount
    };
    requests.push(newReq);

    // 2. Lock OLD Level
    const oldReq = requests.find(r => r.levelId === currentLevelIdx && (r.status === 'approved' || r.status === 'level_won' || r.status === 'level_completed') && r.nickname === myNickname);
    if (oldReq) {
        oldReq.status = 'finished'; // Consumed
        oldReq.currentBalance = 0;
    }
    ingameBalance = 0;

    localStorage.setItem('fruitRequests', JSON.stringify(requests));

    // Deduct from Global Wallet (Visual consistency)
    addFunds(-amount);

    alert("¡Solicitud para Siguiente Nivel Enviada! Espera aprobación del Administrador.");
    modal.classList.add('hidden');
    showLevelSelect();
}

function gameOver() {
    buyTimeModal.classList.add('hidden');
    gameScreen.classList.remove('active');

    // Logic: Lock Level on Loss
    if (!isDemoMode && currentLevelIdx !== null) {
        // Rule: "El SALDO se establece automáticamente en 0"
        ingameBalance = 0;

        const myNickname = localStorage.getItem('fruitNickname');
        const requests = getRequests();
        const activeReqIndex = requests.findIndex(r => r.levelId === currentLevelIdx && r.status === 'approved' && r.nickname === myNickname);

        if (activeReqIndex !== -1) {
            // Lock it (change status so it requires new request)
            requests[activeReqIndex].status = 'failed';
            localStorage.setItem('fruitRequests', JSON.stringify(requests));
            alert("Has perdido la ronda. Tu saldo es 0 y el nivel se ha cerrado.");
        }
    }

    levelScreen.classList.add('active');
    renderLevels();
}

function quitGame() {
    if (confirm("¿Seguro que quieres rendirte? El nivel se bloqueará.")) {
        clearInterval(timerInterval);
        clearInterval(gameInterval);
        gameOver(); // Trigger Lock Logic
    }
}

function getUsers() {
    const raw = localStorage.getItem('fruitUsers');
    return raw ? JSON.parse(raw) : [];
}

/* --- GAME LOOP (Timer, Logic, etc) --- */
function playMatchSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) { }
}

// --- ADMIN LOGIC ---
// --- ADMIN LOGIC ---


function ensureAdminUser() {
    let users = getUsers();
    const adminIndex = users.findIndex(u => u.nickname.toLowerCase() === FIXED_ADMIN_USER);

    if (adminIndex === -1) {
        // Create Admin if not exists
        const adminUser = {
            id: Date.now(), // or fixed ID
            nickname: FIXED_ADMIN_USER,
            email: FIXED_ADMIN_EMAIL,
            wallet: "ADMIN_WALLET",
            date: new Date().toISOString(),
            inviteLink: `${window.location.href.split('?')[0]}?ref=${FIXED_ADMIN_USER}`,
            origin: "SYSTEM",
            referredBy: null,
            termsAccepted: true
        };
        // Add to beginning of array
        users.unshift(adminUser);
        localStorage.setItem('fruitUsers', JSON.stringify(users));
        console.log("Admin User Auto-Created/Restored");
    }
}

function updateAdminVisibility() {
    const link = document.getElementById('admin-link');
    const myNick = localStorage.getItem('fruitNickname');

    if (!link) return;

    // STRICT VISIBILITY RULE: Only visible for the defined Admin User
    if (myNick && myNick.toLowerCase() === FIXED_ADMIN_USER) {
        link.style.display = 'inline-block';
    } else {
        link.style.display = 'none';
        // Ensure panel is closed if not admin (security)
        const dashboard = document.getElementById('dashboard-screen');
        if (dashboard && dashboard.classList.contains('active') && myNick !== FIXED_ADMIN_USER) {
            dashboard.classList.remove('active');
            dashboard.style.display = 'none';
        }
    }
}

function setupAdmin() {
    // Initial Check
    updateAdminVisibility();

    const link = document.getElementById('admin-link');
    const homeScreen = document.getElementById('home-screen');
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');

    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Don't close other screens, just open modal
            if (loginScreen) {
                loginScreen.classList.remove('hidden');
                // Ensure field is focused
                setTimeout(() => document.getElementById('admin-pass').focus(), 100);
            }
        });
    }

    const lBtn = document.getElementById('login-btn');
    if (lBtn) {
        lBtn.addEventListener('click', () => {
            const pass = document.getElementById('admin-pass').value;
            // Ensure ADMIN_PASS is available or hardcoded check
            if (pass === ADMIN_PASS) {
                if (loginScreen) {
                    loginScreen.classList.add('hidden'); // Close modal
                }
                if (homeScreen) homeScreen.classList.remove('active'); // Close underlying
                // Open Dashboard
                if (dashboardScreen) {
                    dashboardScreen.classList.add('active');
                    dashboardScreen.style.display = 'flex';
                }
                loadAdminTab('access');
            } else {
                const err = document.getElementById('login-error');
                if (err) err.classList.remove('hidden');
            }
        });
    }

    // --- RETIRAR BUTTON (HOME SCREEN) ---
    // Fix: Connect Home Screen Withdraw Button to New Logic
    const homeWithdrawBtn = document.getElementById('withdraw-btn');
    if (homeWithdrawBtn) {
        homeWithdrawBtn.addEventListener('click', () => {
            // Pass null to indicate manual withdrawal (not from level win)
            openWithdrawModal(null);
        });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const targetTab = document.getElementById(`tab-${tabId}`);
            if (targetTab) targetTab.classList.add('active');
            loadAdminTab(tabId);
        });
    });

    const backBtn = document.getElementById('back-to-home-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (loginScreen) {
                loginScreen.classList.add('hidden'); // Close modal
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            updateReferralUI();
            if (dashboardScreen) {
                dashboardScreen.classList.remove('active');
                dashboardScreen.style.display = 'none';
            }
            if (homeScreen) homeScreen.classList.add('active');
        });
    }

    // DELEGATED LISTENER for Admin Access Table (ON/OFF)
    const accessBody = document.getElementById('access-body');
    if (accessBody) {
        accessBody.addEventListener('click', (e) => {
            // Handle clicks on the button or its children (text)
            const btn = e.target.closest('.status-btn');
            if (btn) {
                toggleReqStatus(btn.dataset.id);
            }
        });
    }

    const resetBtn = document.getElementById('reset-data-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllData);
    }
}

function resetAllData() {
    if (confirm("⚠️ ¿ESTÁS SEGURO? \n\nEsto borrará TODAS las solicitudes, registros de usuarios, referidos y datos guardados. \n\nEsta acción NO se puede deshacer.")) {
        // Clear specific keys
        localStorage.removeItem('fruitRequests');
        localStorage.removeItem('fruitTimeWallets');
        localStorage.removeItem('pendingReferrer');
        // localStorage.removeItem('fruitNickname'); // Optional: keep own session? User said "all records of users". Let's wipe everything related to "records".
        // If we want a full clean slate:
        localStorage.clear();

        alert("✅ Todos los datos han sido eliminados.");
        location.reload(); // Reload to reset state fully
    }
}

function updateReferralUI() {
    const myNickname = localStorage.getItem('fruitNickname');
    if (myNickname) {
        const requests = getRequests();
        const isApproved = requests.some(r => r.nickname === myNickname && r.status === 'approved');

        const refSec = document.getElementById('referral-section');
        if (isApproved) {
            if (refSec) {
                refSec.classList.remove('hidden');

                // Generate Full Link
                const baseUrl = window.location.href.split('?')[0]; // Remove existing params
                const fullLink = `${baseUrl}?ref=${myNickname}`;

                // Update Input Value (Old and New)
                const input = document.getElementById('my-referral-input');
                if (input) input.value = fullLink;

                const homeRefInput = document.getElementById('home-referral-link');
                if (homeRefInput) homeRefInput.value = fullLink;

                // Remove old listener to avoid dupes? or just clone
                const oldBtn = document.getElementById('copy-ref-btn');
                const newBtn = oldBtn.cloneNode(true);
                oldBtn.parentNode.replaceChild(newBtn, oldBtn);

                newBtn.addEventListener('click', () => {
                    if (input) {
                        input.select();
                        input.setSelectionRange(0, 99999); // Mobile
                    }
                    navigator.clipboard.writeText(fullLink);
                    alert("Enlace copiado: " + fullLink);
                });
            }
        } else {
            if (refSec) refSec.classList.add('hidden');
        }
    }
}

function loadAdminTab(tab) {
    if (tab === 'access') renderAccessTable();
    if (tab === 'payments') renderPaymentsTable();
    if (tab === 'users') renderUsersTable();
}

// --- RENDER USERS TABLE (Now with TikTok) ---
function renderUsersTable() {
    const tbody = document.getElementById('users-body');
    const users = getUsers();

    if (users.length === 0) {
        document.getElementById('no-data-users').classList.remove('hidden');
    } else {
        document.getElementById('no-data-users').classList.add('hidden');
    }

    tbody.innerHTML = '';

    users.forEach(u => {
        const row = document.createElement('tr');

        // Format Date
        const d = new Date(u.date);
        const dateStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;

        // TikTok Link Logic
        let tiktokDisplay = "-";
        if (u.tikTokLink) {
            tiktokDisplay = `
                <div style="display:flex; align-items:center; gap:5px;">
                    <a href="${u.tikTokLink}" target="_blank" style="color: #00a8ff; text-decoration: underline;">Ver Video</a>
                    <button class="btn-delete-tiktok" data-nick="${u.nickname}" style="background:none; border:none; cursor:pointer;" title="Eliminar Enlace">❌</button>
                </div>
            `;
        }

        row.innerHTML = `
                <td>${dateStr}</td>
                <td>${u.nickname}</td>
                <td>${u.email}</td>
                <td>${u.wallet}</td> 
                <td class="hash-cell" title="${u.inviteLink}">${u.inviteLink}</td>
                <td>${tiktokDisplay}</td>
            `;
        tbody.appendChild(row);
    });

    // Add listeners for Delete Buttons
    document.querySelectorAll('.btn-delete-tiktok').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nick = e.target.getAttribute('data-nick');
            deleteTikTokLink(nick);
        });
    });
}

function deleteTikTokLink(nickname) {
    if (!confirm(`¿Borrar el enlace TikTok de ${nickname}? El usuario podrá enviar uno nuevo.`)) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.nickname === nickname);

    if (userIndex !== -1) {
        // Clear stored link
        users[userIndex].tikTokLink = "";
        // Keep promoEligible = true so they can submit again
        // Optionally clear promoDate if we want to reset that metadata
        users[userIndex].promoDate = "";

        localStorage.setItem('fruitUsers', JSON.stringify(users));
        renderUsersTable(); // Refresh UI
        alert("Enlace eliminado correctamente.");
    }
}

function renderAccessTable() {
    const tbody = document.getElementById('access-body');
    const allRequests = getRequests();
    // Filter: Show only Access Requests (NOT Withdrawals)
    const requests = allRequests.filter(r => r.type !== 'WITHDRAWAL');

    requests.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (requests.length === 0) {
        document.getElementById('no-data-access').classList.remove('hidden');
    } else {
        document.getElementById('no-data-access').classList.add('hidden');
    }

    tbody.innerHTML = ''; // FIX: Clear table before re-rendering to prevent duplication

    requests.forEach((req, index) => {
        const row = document.createElement('tr');
        // If Level ID is not found (e.g. legacy/deleted), handle safe
        const lvlObj = LEVEL_DATA.find(l => l.id === req.levelId);
        const lvlName = lvlObj ? lvlObj.name : "UNKNOWN";
        const lvlFee = lvlObj ? lvlObj.fee : 0; // FIX: Show Entry Fee
        // FIX: Treat ANY status that is NOT 'pending' as Approved/Processed (Blue Color)
        const isApproved = req.status !== 'pending';

        if (isApproved) {
            row.classList.add('approved-row');
        }

        const d = new Date(req.date);
        const refDate = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;

        // const montoDisplay = req.netMonto ? req.netMonto : 0; // REPLACED by Fee

        row.innerHTML = `
                <td>${index + 1}</td>
                <td>${req.nickname}</td>
                <td><input class="admin-input manual-wallet" data-id="${req.id}" value="${req.manualWallet || ''}" placeholder="Pegar Wallet"></td>
                <td class="hash-cell" title="${req.hash}">${req.hash}</td>
                <td>${refDate}</td>
                <td>${lvlFee}</td> 
                <td>${lvlName}</td>
                <td>
                    <button class="status-btn ${isApproved ? 'on' : 'off'}" data-id="${req.id}">
                        ${isApproved ? 'ON' : 'OFF'}
                    </button>
                </td>
            `;
        tbody.appendChild(row);
    });

    // Listeners for manual wallet inputs
    document.querySelectorAll('.manual-wallet').forEach(input => {
        input.addEventListener('change', (e) => {
            updateRequestField(e.target.dataset.id, 'manualWallet', e.target.value);
        });
    });
}

function renderPaymentsTable() {
    const tbody = document.getElementById('payments-body');
    const allRequests = getRequests();
    const requests = allRequests.filter(r => r.type === 'WITHDRAWAL');

    requests.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (requests.length === 0) {
        document.getElementById('no-data-payments').classList.remove('hidden');
    } else {
        document.getElementById('no-data-payments').classList.add('hidden');
    }

    tbody.innerHTML = '';

    requests.forEach((req) => {
        const row = document.createElement('tr');
        const d = new Date(req.date);
        const dateStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`; // Date & Time

        // "SALDO": Max Balance available at time of request.
        // "MONTO SOLICITADO": withdrawalAmount
        const saldo = parseFloat(req.maxBalance || 0);
        const requested = parseFloat(req.withdrawalAmount || req.netMonto || 0);
        const disponible = saldo - requested;

        row.innerHTML = `
                <td>${req.nickname}</td>
                <td class="hash-cell" title="${req.manualWallet}">
                    ${req.manualWallet}
                    <button class="copy-wallet-btn" data-wallet="${req.manualWallet}" style="margin-left:5px; cursor:pointer; background:none; border:none;">📋</button>
                </td>
                <td>${saldo}</td>
                <td>${requested}</td>
                <td style="font-weight:bold;">${disponible}</td>
                <td><input class="admin-input input-hash2" data-id="${req.id}" value="${req.adminPaymentHash || ''}" placeholder="Hash Pago"></td>
                <td><input class="admin-input input-date2" data-id="${req.id}" value="${req.adminPaymentDate || ''}" placeholder="Fecha"></td>
                <td><input class="admin-input input-admin" data-id="${req.id}" value="${req.adminName || ''}" placeholder="Admin"></td>
            `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.input-hash2').forEach(i => i.addEventListener('change', (e) => updateRequestField(e.target.dataset.id, 'adminPaymentHash', e.target.value)));
    document.querySelectorAll('.input-date2').forEach(i => i.addEventListener('change', (e) => updateRequestField(e.target.dataset.id, 'adminPaymentDate', e.target.value)));
    document.querySelectorAll('.input-admin').forEach(i => i.addEventListener('change', (e) => updateRequestField(e.target.dataset.id, 'adminName', e.target.value)));

    // Copy Wallet Listener
    document.querySelectorAll('.copy-wallet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const wallet = e.target.getAttribute('data-wallet');
            if (wallet) {
                navigator.clipboard.writeText(wallet).then(() => {
                    // Visual Feedback (Tooltip or simple Alert as per existing style)
                    e.target.innerText = "✅";
                    setTimeout(() => e.target.innerText = "📋", 1000);
                }).catch(err => console.error('Copy failed', err));
            }
        });
    });
}

function updateRequestField(id, field, value) {
    const requests = getRequests();
    const reqIndex = requests.findIndex(r => r.id == id);
    if (reqIndex !== -1) {
        requests[reqIndex][field] = value;
        localStorage.setItem('fruitRequests', JSON.stringify(requests));
    }
}

function toggleReqStatus(id) {
    const requests = getRequests();
    const reqIndex = requests.findIndex(r => r.id == id);
    if (reqIndex !== -1) {
        const req = requests[reqIndex];
        const oldStatus = req.status;
        const newStatus = oldStatus === 'approved' ? 'pending' : 'approved';

        req.status = newStatus;

        // Credit Referral Bonus if BECOMING Approved
        if (newStatus === 'approved' && oldStatus !== 'approved' && req.referrer) {
            creditReferralBonus(req.referrer, req.levelId);
        }

        localStorage.setItem('fruitRequests', JSON.stringify(requests));
        renderAccessTable();
    }
}

function creditReferralBonus(referrerName, levelId) {
    let timeWallets = JSON.parse(localStorage.getItem('fruitTimeWallets') || '{}');
    if (!timeWallets[referrerName]) timeWallets[referrerName] = {};
    if (!timeWallets[referrerName][levelId]) timeWallets[referrerName][levelId] = 0;

    timeWallets[referrerName][levelId] += 15;
    localStorage.setItem('fruitTimeWallets', JSON.stringify(timeWallets));
    console.log(`Credited 15s to ${referrerName} for Level ${levelId}`);
}





// START ADMIN
setupAdmin();