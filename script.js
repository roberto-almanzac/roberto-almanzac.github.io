// Variables globales
let currentScreen = 'heartRain';
let hearts = [];
let animationFrameId;
let yorkiePosition = -200;
let yorkieAnimationComplete = false;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initHeartRain();
    setupEventListeners();
});

// Configurar listeners de eventos
function setupEventListeners() {
    // Tecla para comenzar
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleClick);
    
    // Botones
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    
    yesBtn.addEventListener('click', handleYesClick);
    
    // Detectar cuando el mouse se acerca al botón NO desde cualquier dirección
    noBtn.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        handleNoHover(e);
    });
    noBtn.addEventListener('mousemove', (e) => {
        e.stopPropagation();
        handleNoHover(e);
    });
    
    // Detectar movimiento del mouse cerca del botón (área más amplia)
    const questionContainer = document.querySelector('.question-container');
    questionContainer.addEventListener('mousemove', (e) => {
        // Solo procesar si no es el botón SÍ
        if (e.target.id === 'yesBtn' || e.target.closest('#yesBtn')) {
            return;
        }
        
        const noBtn = document.getElementById('noBtn');
        const rect = noBtn.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calcular distancia del mouse al centro del botón
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
            Math.pow(mouseX - btnCenterX, 2) + 
            Math.pow(mouseY - btnCenterY, 2)
        );
        
        // Si el mouse está a menos de 200px del botón, moverlo
        if (distance < 200) {
            handleNoHover(e);
        }
    });
    
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Intentar mover el botón cuando se hace click
        handleNoHover(e);
    });
}

// Manejar tecla presionada
function handleKeyPress(e) {
    if (currentScreen === 'heartRain') {
        transitionToYorkie();
    }
}

// Manejar click
function handleClick(e) {
    if (currentScreen === 'heartRain' && e.target.id !== 'yesBtn' && e.target.id !== 'noBtn') {
        transitionToYorkie();
    }
}

// Inicializar lluvia de corazones
function initHeartRain() {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Crear corazones
    const heartCount = 50;
    for (let i = 0; i < heartCount; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 20 + 10,
            speed: Math.random() * 3 + 1,
            color: getRandomHeartColor(),
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }
    
    // Animar corazones
    function animateHearts() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hearts.forEach(heart => {
            // Actualizar posición
            heart.y += heart.speed;
            heart.rotation += heart.rotationSpeed;
            
            // Reiniciar si sale de la pantalla
            if (heart.y > canvas.height) {
                heart.y = -heart.size;
                heart.x = Math.random() * canvas.width;
            }
            
            // Dibujar corazón
            drawHeart(ctx, heart.x, heart.y, heart.size, heart.color, heart.rotation);
        });
        
        if (currentScreen === 'heartRain') {
            animationFrameId = requestAnimationFrame(animateHearts);
        }
    }
    
    animateHearts();
}

// Dibujar corazón
function drawHeart(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.2, 0, size);
    ctx.bezierCurveTo(size, size * 0.2, size * 0.5, -size * 0.3, 0, size * 0.3);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
}

// Obtener color aleatorio de corazón
function getRandomHeartColor() {
    const colors = ['#ff6b9d', '#ff1744', '#e91e63', '#f06292', '#ec407a'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Transición a la escena del yorkie
function transitionToYorkie() {
    if (currentScreen !== 'heartRain') return;
    
    currentScreen = 'yorkieScene';
    switchScreen('heartRain', 'yorkieScene');
    
    // Animar yorkie corriendo
    animateYorkie();
}

// Animar yorkie
function animateYorkie() {
    const yorkie = document.getElementById('yorkie');
    const yorkieWrapper = document.querySelector('.yorkie-wrapper');
    
    function moveYorkie() {
        yorkiePosition += 5;
        yorkieWrapper.style.left = yorkiePosition + 'px';
        
        // Crear efecto de movimiento de patas
        const legs = yorkie.querySelectorAll('.leg');
        const frame = Math.floor(yorkiePosition / 8) % 4;
        
        legs.forEach((leg, index) => {
            if (frame === 0 || frame === 2) {
                if (index === 0 || index === 3) {
                    leg.style.transform = 'translateY(-8px)';
                } else {
                    leg.style.transform = 'translateY(0)';
                }
            } else {
                if (index === 1 || index === 2) {
                    leg.style.transform = 'translateY(-8px)';
                } else {
                    leg.style.transform = 'translateY(0)';
                }
            }
        });
        
        // Mover cola
        const tail = yorkie.querySelector('.tail');
        if (tail) {
            tail.style.transform = `rotate(${Math.sin(yorkiePosition / 20) * 15 - 10}deg)`;
        }
        
        // Cuando el yorkie llega al centro, continuar hasta salir
        if (yorkiePosition < window.innerWidth + 200) {
            requestAnimationFrame(moveYorkie);
        } else {
            // Transición a la pantalla de pregunta
            setTimeout(() => {
                transitionToQuestion();
            }, 500);
        }
    }
    
    moveYorkie();
}

// Transición a la pantalla de pregunta
function transitionToQuestion() {
    currentScreen = 'questionScreen';
    switchScreen('yorkieScene', 'questionScreen');
    createParticles();
    
    // Asegurar que los botones tengan posición inicial correcta
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    
    // Botón NO: posición relativa inicial
    noBtn.style.position = 'relative';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.transform = '';
    noBtn.classList.remove('absolute');
    
    // Eliminar placeholder si existe
    const placeholder = document.getElementById('noBtn-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    // Botón SÍ: siempre posición relativa (no se mueve)
    yesBtn.style.position = 'relative';
    yesBtn.style.left = '';
    yesBtn.style.top = '';
}

// Cambiar de pantalla
function switchScreen(from, to) {
    const fromScreen = document.getElementById(from);
    const toScreen = document.getElementById(to);
    
    // Efecto de fade out
    fromScreen.style.opacity = '0';
    fromScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        
        // Efecto de fade in
        setTimeout(() => {
            toScreen.style.opacity = '1';
            toScreen.style.transform = 'scale(1)';
        }, 50);
    }, 300);
}

// Manejar hover del botón NO
function handleNoHover(e) {
    // Asegurar que solo trabajamos con el botón NO
    const noBtn = document.getElementById('noBtn');
    if (!noBtn) return;
    const rect = noBtn.getBoundingClientRect();
    const buttonsContainer = document.querySelector('.buttons-container');
    const containerRect = buttonsContainer.getBoundingClientRect();
    const questionBox = document.querySelector('.question-box');
    const boxRect = questionBox.getBoundingClientRect();
    
    // Obtener posición del mouse relativa a la ventana
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calcular centro del botón
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    // Calcular distancia y dirección desde el mouse al botón
    const deltaX = btnCenterX - mouseX;
    const deltaY = btnCenterY - mouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Si el mouse está muy cerca (menos de 150px), mover el botón MUY lejos
    if (distance < 150) {
        // Calcular dirección opuesta al mouse (normalizada)
        const dirX = deltaX / distance;
        const dirY = deltaY / distance;
        
        // Mover MUY lejos en dirección opuesta (300-500px)
        const moveDistance = 300 + Math.random() * 200;
        let newX = btnCenterX + dirX * moveDistance - rect.width / 2;
        let newY = btnCenterY + dirY * moveDistance - rect.height / 2;
        
        // Si se sale del contenedor, moverlo al lado opuesto de la pantalla
        const questionBoxRect = questionBox.getBoundingClientRect();
        const padding = 50;
        
        // Si se sale por la izquierda, ponerlo a la derecha
        if (newX < questionBoxRect.left + padding) {
            newX = questionBoxRect.right - rect.width - padding;
        }
        // Si se sale por la derecha, ponerlo a la izquierda
        else if (newX > questionBoxRect.right - rect.width - padding) {
            newX = questionBoxRect.left + padding;
        }
        
        // Si se sale por arriba, ponerlo abajo
        if (newY < questionBoxRect.top + padding) {
            newY = questionBoxRect.bottom - rect.height - padding;
        }
        // Si se sale por abajo, ponerlo arriba
        else if (newY > questionBoxRect.bottom - rect.height - padding) {
            newY = questionBoxRect.top + padding;
        }
        
        // Asegurar que esté dentro de los límites del question-box
        newX = Math.max(questionBoxRect.left + padding, 
                       Math.min(newX, questionBoxRect.right - rect.width - padding));
        newY = Math.max(questionBoxRect.top + padding, 
                       Math.min(newY, questionBoxRect.bottom - rect.height - padding));
        
        // Convertir a posición relativa al contenedor de botones
        const relativeX = newX - containerRect.left;
        const relativeY = newY - containerRect.top;
        
        // Crear un placeholder invisible para mantener el espacio en el layout
        let placeholder = document.getElementById('noBtn-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('span');
            placeholder.id = 'noBtn-placeholder';
            placeholder.style.visibility = 'hidden';
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.display = 'inline-block';
            noBtn.parentNode.insertBefore(placeholder, noBtn);
        }
        
        // Aplicar transición rápida
        noBtn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        noBtn.classList.add('absolute');
        noBtn.style.position = 'absolute';
        noBtn.style.left = relativeX + 'px';
        noBtn.style.top = relativeY + 'px';
        
        // Efecto de rotación más pronunciado
        const rotation = (Math.random() - 0.5) * 30;
        noBtn.style.transform = `rotate(${rotation}deg) scale(0.9)`;
        
        // Efecto visual de "escape" más intenso
        noBtn.style.boxShadow = '0 15px 40px rgba(244, 67, 54, 0.7)';
        
        // Crear partículas de escape
        createEscapeParticles(btnCenterX, btnCenterY);
    } else if (distance < 200) {
        // Si el mouse está acercándose (200-150px), empezar a moverse
        const dirX = deltaX / distance;
        const dirY = deltaY / distance;
        const moveDistance = 150 + Math.random() * 100;
        
        let newX = btnCenterX + dirX * moveDistance - rect.width / 2;
        let newY = btnCenterY + dirY * moveDistance - rect.height / 2;
        
        const questionBoxRect = questionBox.getBoundingClientRect();
        const padding = 50;
        
        // Ajustar si se sale de los límites
        if (newX < questionBoxRect.left + padding) {
            newX = questionBoxRect.right - rect.width - padding;
        } else if (newX > questionBoxRect.right - rect.width - padding) {
            newX = questionBoxRect.left + padding;
        }
        
        if (newY < questionBoxRect.top + padding) {
            newY = questionBoxRect.bottom - rect.height - padding;
        } else if (newY > questionBoxRect.bottom - rect.height - padding) {
            newY = questionBoxRect.top + padding;
        }
        
        newX = Math.max(questionBoxRect.left + padding, 
                       Math.min(newX, questionBoxRect.right - rect.width - padding));
        newY = Math.max(questionBoxRect.top + padding, 
                       Math.min(newY, questionBoxRect.bottom - rect.height - padding));
        
        const relativeX = newX - containerRect.left;
        const relativeY = newY - containerRect.top;
        
        // Crear un placeholder invisible para mantener el espacio en el layout
        let placeholder = document.getElementById('noBtn-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('span');
            placeholder.id = 'noBtn-placeholder';
            placeholder.style.visibility = 'hidden';
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.display = 'inline-block';
            noBtn.parentNode.insertBefore(placeholder, noBtn);
        }
        
        noBtn.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        noBtn.classList.add('absolute');
        noBtn.style.position = 'absolute';
        noBtn.style.left = relativeX + 'px';
        noBtn.style.top = relativeY + 'px';
    }
    
    // Resetear transformación después de un momento (pero mantener posición)
    setTimeout(() => {
        noBtn.style.transform = 'rotate(0deg) scale(1)';
        noBtn.style.boxShadow = '0 8px 0 #000, 0 12px 20px rgba(0, 0, 0, 0.3)';
    }, 400);
}

// Manejar click en SÍ
function handleYesClick() {
    createSuccessParticles();
    setTimeout(() => {
        transitionToSuccess();
    }, 500);
}

// Crear partículas de celebración
function createSuccessParticles() {
    const yesBtn = document.getElementById('yesBtn');
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const emojis = ['💕', '💖', '💗', '💝', '💞', '❤️', '💓', '💘'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.animationDelay = (i * 0.05) + 's';
        particle.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 50;
        particle.style.setProperty('--end-x', (Math.cos(angle) * distance) + 'px');
        particle.style.setProperty('--end-y', (Math.sin(angle) * distance) + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

// Crear partículas al aparecer la pregunta
function createParticles() {
    const questionBox = document.querySelector('.question-box');
    const rect = questionBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const emojis = ['💕', '💖', '💗'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.animationDelay = '0s';
            particle.style.animationDuration = '2s';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            particle.style.setProperty('--end-x', (Math.cos(angle) * distance) + 'px');
            particle.style.setProperty('--end-y', (Math.sin(angle) * distance) + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }, i * 50);
    }
}

// Transición a la pantalla de éxito
function transitionToSuccess() {
    currentScreen = 'successScreen';
    switchScreen('questionScreen', 'successScreen');
    
    // Animación continua de corazones flotantes
    setInterval(() => {
        createFloatingHeart();
    }, 500);
}

// Crear corazón flotante
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'particle';
    heart.textContent = '💕';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Crear partículas de escape del botón NO
function createEscapeParticles(x, y) {
    const symbols = ['❌', '🚫', '😅'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = '1rem';
        particle.style.animationDuration = '1s';
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 30 + Math.random() * 20;
        particle.style.setProperty('--end-x', (Math.cos(angle) * distance) + 'px');
        particle.style.setProperty('--end-y', (Math.sin(angle) * distance) + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Mejorar animación de partículas con CSS custom
const style = document.createElement('style');
style.textContent = `
    .particle {
        --end-x: 0px;
        --end-y: -100px;
    }
    
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translate(var(--end-x), var(--end-y)) scale(1.5) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

