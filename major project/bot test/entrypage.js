const spans = document.querySelectorAll('h1 span');
const animations = [
    'animate 1.2s alternate-reverse infinite',
    'animate 1s ease infinite',
    'animate 1.5s ease-in infinite',

];
spans.forEach((span) => {
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    span.style.animation = randomAnimation;
});


