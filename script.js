// Détection du genre basé sur l'URL
const urlParams = new URLSearchParams(window.location.search);
let gender = urlParams.get('gender');

// Vérifier aussi le hash et le pathname pour plus de flexibilité
if (!gender) {
    const url = window.location.href.toLowerCase();
    if (url.includes('men') && !url.includes('women')) {
        gender = 'men';
    } else {
        gender = 'women';
    }
}


// Messages selon le genre
const messages = {
    women: {
        question: "Veux-tu être ma Valentine ? 💕",
        success: "🎉 Officiellement ma Valentine ! 🎉",
        successEmoji: "💕"
    },
    men: {
        question: "Veux-tu être mon Valentin ? 💕",
        success: "🎉 Officiellement mon Valentin ! 🎉",
        successEmoji: "💪"
    }
};

// Messages coquins/drôles pour le popup
const coquinMessages = [
    "Pourquoi tu essayes de fuir ? Accepte ! 😏",
    "Tu crois vraiment pouvoir m'échapper ? 💋",
    "Le destin nous a réunis... Dis oui ! 🔥",
    "Ce bouton est plus rapide que toi 😜",
    "Allez, arrête de jouer... Tu sais que tu veux dire oui ! 😘",
    "Mon cœur court après le tien... 💓",
    "Résistance futile ! L'amour gagne toujours 💝",
    "Tu me fais courir... littéralement ! 🏃‍♂️💨",
    "3 tentatives et tu fuis encore ? Coquin(e) ! 😈",
    "Le bouton Non a des jambes, mais ton cœur dit Oui ! 💖",
    "Arrête de jouer au chat et à la souris ! 🐱🐭",
    "Je vois ce petit sourire... Dis OUI ! 😊",
    "Tu veux vraiment me briser le cœur ? 🥺",
    "Mon amour est plus rapide que ta souris ! 💘"
];

// Messages qui apparaissent quand le bouton fuit
const fleeMessages = [
    "Raté ! 😜",
    "Trop lent ! 🏃",
    "Nope ! 😏",
    "Essay encore ! 👀",
    "Presque ! 🤭",
    "Haha ! 😂",
    "Tu peux pas m'avoir ! 💅",
    "*Whoosh* 💨",
    "Je suis là ! 👋",
    "🙈"
];

// Messages de taquinerie pour le bouton Oui
const yesButtonTexts = [
    "Oui 💖",
    "OUI OUI OUI 💕",
    "OUIII 🥰",
    "Dis Oui! 😍",
    "Clique ici 👇💖",
    "❤️ OUI ❤️",
    "Le bon choix →"
];

// Éléments DOM
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const mainContainer = document.getElementById('mainContainer');
const celebration = document.getElementById('celebration');
const popupOverlay = document.getElementById('popupOverlay');
const popupMessage = document.getElementById('popupMessage');
const popupYes = document.getElementById('popupYes');
const popupNo = document.getElementById('popupNo');
const questionEl = document.getElementById('question');
const successTitle = document.getElementById('successTitle');
const confettiContainer = document.getElementById('confettiContainer');

// Variables de suivi
let noAttempts = 0;
let popupNoAttempts = 0;
let isMoving = false;
let yesButtonScale = 1;
let totalAttempts = 0;

// Initialisation selon le genre
function initGender() {
    const config = messages[gender] || messages.women;
    questionEl.textContent = config.question;
    successTitle.textContent = config.success;
}

// Fonction pour obtenir les limites sûres de l'écran
function getSafeBounds() {
    const padding = 30;
    const btnWidth = 140;
    const btnHeight = 54;
    
    return {
        minX: padding,
        maxX: window.innerWidth - btnWidth - padding,
        minY: padding,
        maxY: window.innerHeight - btnHeight - padding
    };
}

// Fonction pour faire fuir le bouton Non (reste toujours visible)
function moveButton() {
    if (isMoving) return;
    isMoving = true;
    
    const bounds = getSafeBounds();
    
    // Position actuelle du bouton
    const currentRect = btnNo.getBoundingClientRect();
    let currentX = currentRect.left;
    let currentY = currentRect.top;
    
    // Générer une nouvelle position aléatoire mais visible
    let newX, newY;
    let attempts = 0;
    
    do {
        newX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
        newY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
        attempts++;
        
        // S'assurer que le bouton bouge d'au moins 100px
        const distance = Math.sqrt(Math.pow(newX - currentX, 2) + Math.pow(newY - currentY, 2));
        if (distance > 100 || attempts > 10) break;
    } while (attempts < 10);
    
    // Appliquer la nouvelle position
    btnNo.style.position = 'fixed';
    btnNo.style.left = newX + 'px';
    btnNo.style.top = newY + 'px';
    btnNo.style.zIndex = '50';
    btnNo.style.transition = 'left 0.25s ease-out, top 0.25s ease-out';
    
    // Afficher un message drôle
    showFleeMessage(currentX, currentY);
    
    // Grossir le bouton Oui à chaque tentative
    growYesButton();
    
    // Changer le texte du bouton Oui de temps en temps
    if (Math.random() > 0.5) {
        btnYes.textContent = yesButtonTexts[Math.floor(Math.random() * yesButtonTexts.length)];
    }
    
    // Réinitialiser le flag après l'animation
    setTimeout(() => {
        isMoving = false;
    }, 250);
}

// Fonction pour afficher un message quand le bouton fuit
function showFleeMessage(x, y) {
    const msg = document.createElement('div');
    msg.className = 'flee-message';
    msg.textContent = fleeMessages[Math.floor(Math.random() * fleeMessages.length)];
    msg.style.left = x + 'px';
    msg.style.top = y + 'px';
    document.body.appendChild(msg);
    
    // Mettre à jour le compteur
    updateCounter();
    
    // Afficher un emoji de réaction parfois
    if (Math.random() > 0.6) {
        showReactionEmoji(x, y);
    }
    
    setTimeout(() => msg.remove(), 1000);
}

// Fonction pour grossir le bouton Oui
function growYesButton() {
    totalAttempts++;
    yesButtonScale = 1 + (totalAttempts * 0.08); // Grossit de 8% à chaque fois
    
    // Limiter la taille max
    if (yesButtonScale > 2.5) yesButtonScale = 2.5;
    
    btnYes.style.transform = `scale(${yesButtonScale})`;
    btnYes.style.transition = 'transform 0.3s ease';
    
    // Ajouter un effet de pulsation quand il devient gros
    if (yesButtonScale > 1.5) {
        btnYes.style.animation = 'pulse-yes 0.5s ease infinite';
    }
}

// Fonction pour obtenir un message aléatoire
function getRandomMessage() {
    return coquinMessages[Math.floor(Math.random() * coquinMessages.length)];
}

// Fonction pour afficher le popup
function showPopup() {
    popupMessage.textContent = getRandomMessage();
    popupOverlay.classList.remove('hidden');
    popupNo.style.display = 'flex';
    popupNo.style.transform = 'none';
}

// Fonction pour créer les confettis
function createConfetti() {
    const emojis = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '🎉', '✨', '🌹', '💐', '🥰', '😍'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
            confettiContainer.appendChild(confetti);
            
            // Supprimer après l'animation
            setTimeout(() => confetti.remove(), 5000);
        }, i * 100);
    }
}

// Fonction de célébration
function celebrate() {
    mainContainer.style.display = 'none';
    popupOverlay.classList.add('hidden');
    celebration.classList.remove('hidden');
    
    // Explosion de confettis initiale
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createConfetti(), i * 200);
    }
    
    // Faire vibrer l'écran (effet fun)
    document.body.style.animation = 'shake 0.5s ease';
    
    // Jouer un son de célébration (si supporté)
    playSound('celebrate');
    
    // Continuer les confettis
    setInterval(createConfetti, 3000);
    
    // Ajouter des feux d'artifice
    setInterval(createFirework, 1500);
}

// Fonction pour créer des feux d'artifice
function createFirework() {
    const colors = ['#ff6b95', '#ff8a80', '#e91e63', '#f44336', '#ffeb3b', '#4caf50'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight / 2);
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty('--angle', (i * 30) + 'deg');
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Fonction pour jouer des sons
function playSound(type) {
    // Créer un contexte audio simple
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'celebrate') {
            // Mélodie joyeuse
            const notes = [523, 659, 784, 1047]; // Do Mi Sol Do
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                }, i * 150);
            });
        }
    } catch (e) {
        // Audio non supporté, pas grave
    }
}

// Fonction pour gérer une tentative sur le bouton Non
function handleNoAttempt() {
    noAttempts++;
    
    // Afficher le popup après 3 tentatives
    if (noAttempts >= 3) {
        noAttempts = 0;
        showPopup();
        return true; // Popup affiché
    }
    return false; // Pas encore de popup
}

// Événement mouseenter pour le bouton Non (compte comme tentative)
btnNo.addEventListener('mouseenter', () => {
    if (!handleNoAttempt()) {
        moveButton();
    }
});

// Événement click pour le bouton Non
btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    if (!handleNoAttempt()) {
        moveButton();
    }
});

// Événement touch pour mobile
btnNo.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!handleNoAttempt()) {
        moveButton();
    }
}, { passive: false });

// Événement pour le bouton Oui principal
btnYes.addEventListener('click', celebrate);

// Événement pour le bouton Oui du popup
popupYes.addEventListener('click', celebrate);

// Messages progressifs pour le popup (de plus en plus insistants)
const popupProgressiveMessages = [
    { message: "Sérieusement ? Allez, dis oui ! 🥺", emoji: "🥺" },
    { message: "Tu me brises le cœur là... 💔", emoji: "😢" },
    { message: "Je vais pleurer si tu continues... 😭", emoji: "😭" },
    { message: "Dernière chance... Dis OUI ! 🙏", emoji: "🙏" },
    { message: "Non n'est plus une option ! 😈💕", emoji: "😈" }
];

// Événement pour le bouton Non du popup
popupNo.addEventListener('click', (e) => {
    e.preventDefault();
    popupNoAttempts++;
    
    // Récupérer le message progressif selon le nombre de tentatives
    const msgIndex = Math.min(popupNoAttempts - 1, popupProgressiveMessages.length - 1);
    const progressiveMsg = popupProgressiveMessages[msgIndex];
    
    // Mettre à jour le message et l'emoji
    popupMessage.textContent = progressiveMsg.message;
    document.querySelector('.popup-emoji').textContent = progressiveMsg.emoji;
    
    // Grossir le bouton "D'accord, Oui !" à chaque refus
    const currentScale = 1 + (popupNoAttempts * 0.15);
    popupYes.style.transform = `scale(${Math.min(currentScale, 1.8)})`;
    popupYes.style.transition = 'transform 0.3s ease';
    
    if (popupNoAttempts >= 5) {
        // Forcer à accepter après 5 tentatives dans le popup
        popupNo.style.display = 'none';
        popupYes.textContent = "💖 DIS OUI 💖";
        popupYes.style.animation = 'pulse-yes 0.5s ease infinite';
    } else {
        // Faire fuir le bouton agressivement sur tout l'écran
        movePopupNoButton();
    }
});

// Textes qui rétrécissent pour le bouton Non du popup
const shrinkingNoTexts = [
    "Non quand même 😤",
    "Non... 😤",
    "Non 😤",
    "😤",
    "."
];

// Fonction pour faire fuir le bouton Non du popup sur tout l'écran
function movePopupNoButton() {
    const padding = 20;
    
    // Réduire le texte du bouton à chaque fuite
    const textIndex = Math.min(popupNoAttempts, shrinkingNoTexts.length - 1);
    popupNo.textContent = shrinkingNoTexts[textIndex];
    
    // Réduire aussi la taille du bouton
    const shrinkScale = Math.max(0.6, 1 - (popupNoAttempts * 0.1));
    popupNo.style.fontSize = `${shrinkScale}rem`;
    popupNo.style.padding = `${10 * shrinkScale}px ${15 * shrinkScale}px`;
    
    const btnWidth = popupNo.offsetWidth || 80;
    const btnHeight = popupNo.offsetHeight || 40;
    
    // Position aléatoire sur tout l'écran
    const newX = padding + Math.random() * (window.innerWidth - btnWidth - padding * 2);
    const newY = padding + Math.random() * (window.innerHeight - btnHeight - padding * 2);
    
    // Sortir du popup et aller n'importe où sur l'écran
    popupNo.style.position = 'fixed';
    popupNo.style.left = newX + 'px';
    popupNo.style.top = newY + 'px';
    popupNo.style.zIndex = '300';
    popupNo.style.transition = 'all 0.2s ease-out';
    popupNo.style.transform = 'none';
    popupNo.style.width = 'auto';
    popupNo.style.minWidth = 'auto';
    
    // Afficher un message de fuite
    showFleeMessage(newX, newY);
}

// Bouton Non du popup fuit aussi au survol - très agressif !
popupNo.addEventListener('mouseenter', () => {
    movePopupNoButton();
});

// Touch sur mobile pour le bouton popup
popupNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    movePopupNoButton();
}, { passive: false });

// Initialisation
initGender();
// createAttemptCounter();

// Créer le compteur de tentatives
function createAttemptCounter() {
    const counter = document.createElement('div');
    counter.className = 'attempt-counter';
    counter.id = 'attemptCounter';
    counter.innerHTML = '💔 Tentatives de fuite: <span id="attemptNumber">0</span>';
    document.body.appendChild(counter);
}

// Mettre à jour le compteur
function updateCounter() {
    const counterNum = document.getElementById('attemptNumber');
    if (counterNum) {
        counterNum.textContent = totalAttempts;
        
        // Ajouter un effet visuel
        const counter = document.getElementById('attemptCounter');
        counter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 200);
    }
}

// Ajouter la mise à jour du compteur dans moveButton
const originalMoveButton = moveButton;

// Ajouter des emojis de réaction aléatoires
function showReactionEmoji(x, y) {
    const emojis = ['😜', '🤣', '😂', '🏃', '💨', '😏', '🙈', '👀', '🤭', '😅'];
    const emoji = document.createElement('div');
    emoji.className = 'reaction-emoji';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = (x + Math.random() * 100 - 50) + 'px';
    emoji.style.top = (y + Math.random() * 100 - 50) + 'px';
    document.body.appendChild(emoji);
    
    setTimeout(() => emoji.remove(), 1500);
}

// Easter egg: Konami code pour célébrer directement
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        celebrate();
    }
});

// Easter egg: taper "love" ou "oui" au clavier
let typedKeys = '';
document.addEventListener('keydown', (e) => {
    typedKeys += e.key.toLowerCase();
    typedKeys = typedKeys.slice(-4);
    
    if (typedKeys === 'love' || typedKeys === 'ouii') {
        celebrate();
    }
});

// Si l'utilisateur attend trop longtemps, taquiner
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        // Après 10 secondes d'inactivité
        const taunts = [
            "Tu réfléchis encore ? 🤔",
            "Le bouton Oui t'attend... 💚",
            "Je peux attendre toute la journée 😏",
            "Pssst... clique sur Oui ! 🤫"
        ];
        
        // Faire clignoter le bouton Oui
        btnYes.style.animation = 'pulse-yes 0.3s ease 5';
        
        // Afficher un indice subtil
        if (questionEl && Math.random() > 0.5) {
            const originalText = questionEl.textContent;
            questionEl.textContent = taunts[Math.floor(Math.random() * taunts.length)];
            setTimeout(() => {
                questionEl.textContent = originalText;
            }, 2000);
        }
    }, 10000);
}

// Reset le timer à chaque mouvement de souris
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);
resetIdleTimer();

// Créer des cœurs flottants en arrière-plan (plus subtils)
function createFloatingHeart() {
    const hearts = ['💕', '💖', '💗', '💓', '💞', '💝'];
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.fontSize = (Math.random() * 12 + 14) + 'px';
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 10000);
}

// Créer des cœurs régulièrement (moins fréquent pour un look plus pro)
setInterval(createFloatingHeart, 1000);

// ============================================
// COMPTEUR DE VISITES AVEC UPSTASH REDIS
// ============================================

function initVisitCounter() {
    const countElement = document.getElementById('visitCount');
    if (!countElement) return;
    
    // Détecter si on est en local ou sur Vercel
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:';
    
    if (isLocal) {
        // En local: utiliser un compteur simulé
        console.log('Mode local détecté - compteur simulé');
        let visits = parseInt(localStorage.getItem('valentine_visits') || '0');
        visits++;
        localStorage.setItem('valentine_visits', visits);
        animateCounter(countElement, visits);
        return;
    }
    
    // Sur Vercel: appeler l'API pour le vrai compteur global
    fetch('/api/counter')
        .then(response => response.json())
        .then(data => {
            if (data.count) {
                // Animation du compteur avec le vrai nombre
                animateCounter(countElement, data.count);
                
                // Stocker localement pour détecter les revisites
                let localVisits = parseInt(localStorage.getItem('valentine_visits') || '0');
                localVisits++;
                localStorage.setItem('valentine_visits', localVisits);
                
                // Message spécial si c'est une revisite
                if (localVisits > 1) {
                    setTimeout(() => {
                        const counter = document.getElementById('visitCounter');
                        if (counter) {
                            counter.innerHTML = `<span class="counter-icon">💕</span> <strong>${data.count}</strong> visites `;
                        }
                    }, 2500);
                }
            }
        })
        .catch(error => {
            console.log('Compteur API non disponible, fallback local');
            // Fallback: compteur local
            let visits = parseInt(localStorage.getItem('valentine_visits') || '0');
            visits++;
            localStorage.setItem('valentine_visits', visits);
            countElement.textContent = '💕';
        });
}

// Animation du compteur qui monte progressivement
function animateCounter(element, target) {
    let current = 0;
    const duration = 1500; // 1.5 secondes
    const steps = 30;
    const increment = target / steps;
    const stepTime = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}


// Initialiser le compteur au chargement
initVisitCounter();

// Ajuster la position du bouton lors du redimensionnement
window.addEventListener('resize', () => {
    if (btnNo.style.position === 'fixed') {
        const bounds = getSafeBounds();
        const rect = btnNo.getBoundingClientRect();
        
        // Vérifier si le bouton est hors limites
        let newX = Math.min(Math.max(rect.left, bounds.minX), bounds.maxX);
        let newY = Math.min(Math.max(rect.top, bounds.minY), bounds.maxY);
        
        btnNo.style.left = newX + 'px';
        btnNo.style.top = newY + 'px';
    }
});
