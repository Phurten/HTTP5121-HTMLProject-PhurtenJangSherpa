var spriteStates = [false, false, false]; // keeping track of which sprites are on
let allActiveTimer = null;
let skySoundPlayed = false;
let spritesLocked = false;

var skyAudio = new Audio('assets/sounds/bloodredmoon.mp3'); // making new audio for sky

// getting all sprite sounds
var spriteAudios = [
    document.getElementById('tail-sound'),
    document.getElementById('legs-sound'),
    document.getElementById('ears-sound')
];

// getting sprite elements and their animation classes
var spriteElements = [
    { el: document.querySelector('.sprite'), anim: 'sprite-animate' },
    { el: document.querySelector('.sprite2'), anim: 'sprite2-animate' },
    { el: document.querySelector('.sprite4'), anim: 'sprite4-animate' }
];

// getting arrow elements
var arrowElements = [
    document.querySelector('.arrow-tail'),
    document.querySelector('.arrow-legs'),
    document.querySelector('.arrow-ears')
];

// getting instructions box and making new message for moon
var instructionsText = document.querySelector('.instructions-text');
var newMessage = `
    <div class="blood-red-moon-heading">
      <span class="blood">BLOOD</span> <span class="red">RED</span> <span class="moon">MOON</span>
    </div>
`;

function stopAllSpriteSounds() {
    // stopping all sprite sounds
    spriteAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.loop = false;
    });
}

function stopAllSpriteAnimations() {
    // removing animation from all sprites
    spriteElements.forEach(({ el, anim }) => {
        el.classList.remove(anim);
    });
}

function startAllSpriteAnimations() {
    // adding animation to all sprites
    spriteElements.forEach(({ el, anim }) => {
        el.classList.add(anim);
    });
}

function removeArrows() {
    // hiding all arrows
    arrowElements.forEach(arrow => {
        if (arrow) arrow.style.display = 'none';
    });
}

function showSkyBackground() {
    // adding class to fade in sky background
    document.body.classList.add('bg-fade-in');
}

function checkAllActive() {
    // checking if all three sprites are on
    if (spriteStates.every(Boolean)) {
        if (!allActiveTimer) {
            allActiveTimer = setTimeout(() => {
                // checking again after waiting
                if (spriteStates.every(Boolean)) {
                    // stopping all sounds and animations
                    stopAllSpriteSounds();
                    stopAllSpriteAnimations();
                    spritesLocked = true;
                    // hiding arrows
                    removeArrows();
                    // playing sky sound and showing background
                    if (!skySoundPlayed) {
                        skyAudio.currentTime = 0;
                        skyAudio.play();
                        skySoundPlayed = true;
                        showSkyBackground();
                        // changing instructions to moon text
                        if (instructionsText) instructionsText.innerHTML = newMessage;
                        // after 10 seconds, starting animations again but not sounds
                        setTimeout(() => {
                            startAllSpriteAnimations();
                        }, 17000);
                    }
                }
            }, 3000);
        }
    } else {
        // if not all sprites are on, resetting everything
        clearTimeout(allActiveTimer);
        allActiveTimer = null;
        skySoundPlayed = false;
        spritesLocked = false;
        document.body.style.transition = 'background-image 2s';
        document.body.style.backgroundImage = '';
        skyAudio.pause();
        skyAudio.currentTime = 0;
        // showing arrows again
        arrowElements.forEach(arrow => {
            if (arrow) arrow.style.display = '';
        });
        // can put back instructions here if needed
        // instructionsText.innerHTML = ...original instructions...
    }
}

function setupSpriteSoundAndAnimation(spriteSelector, audioId, animationClass, idx) {
    var sprite = document.querySelector(spriteSelector);
    var audio = document.getElementById(audioId);
    let isActive = false;

    sprite.addEventListener('mouseenter', () => {
        // playing sound for 0.5s when hovering, only if not locked or already on
        if (isActive || spritesLocked) return;
        audio.pause();
        audio.currentTime = 0;
        audio.loop = false;
        audio.play();
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 500);
    });

    sprite.addEventListener('click', () => {
        // turning sprite on/off when clicking, unless locked
        if (spritesLocked) return;
        isActive = !isActive;
        spriteStates[idx] = isActive;
        if (isActive) {
            sprite.classList.add(animationClass);
            audio.pause();
            audio.currentTime = 0;
            audio.loop = true;
            audio.play();
        } else {
            sprite.classList.remove(animationClass);
            audio.pause();
            audio.currentTime = 0;
            audio.loop = false;
        }
        checkAllActive();
    });

    document.addEventListener('visibilitychange', () => {
        // pausing sound if tab is hidden, playing again if back and not locked
        if (document.hidden && isActive && !spritesLocked) {
            audio.pause();
        } else if (!document.hidden && isActive && !spritesLocked) {
            audio.play();
        }
    });
}

// setting up tail, legs, and ears sprites
setupSpriteSoundAndAnimation('.sprite', 'tail-sound', 'sprite-animate', 0);
setupSpriteSoundAndAnimation('.sprite2', 'legs-sound', 'sprite2-animate', 1);
setupSpriteSoundAndAnimation('.sprite4', 'ears-sound', 'sprite4-animate', 2);