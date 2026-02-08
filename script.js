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
    
    // Réinitialiser le flag après l'animation
    setTimeout(() => {
        isMoving = false;
    }, 250);
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
    createConfetti();
    
    // Continuer les confettis
    setInterval(createConfetti, 3000);
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

// Événement pour le bouton Non du popup
popupNo.addEventListener('click', (e) => {
    e.preventDefault();
    popupNoAttempts++;
    
    if (popupNoAttempts >= 2) {
        // Forcer à accepter après 2 tentatives dans le popup
        popupMessage.textContent = "Non n'est plus une option ! 😈💕";
        popupNo.style.display = 'none';
    } else {
        // Nouveau message coquin
        popupMessage.textContent = getRandomMessage();
        
        // Faire bouger le bouton Non du popup aussi
        const moveX = (Math.random() - 0.5) * 80;
        const moveY = (Math.random() - 0.5) * 40;
        popupNo.style.transition = 'transform 0.2s ease-out';
        popupNo.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Bouton Non du popup fuit aussi
popupNo.addEventListener('mouseenter', () => {
    const moveX = (Math.random() - 0.5) * 80;
    const moveY = (Math.random() - 0.5) * 40;
    popupNo.style.transition = 'transform 0.15s ease-out';
    popupNo.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Initialisation
initGender();

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
