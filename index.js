const elephants = document.querySelectorAll('.elephant');
let targetDot = null;
let isMouseDown = false;
let targetX = null;
let targetY = null;

document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    targetX = e.clientX;
    targetY = e.clientY;

    if (!targetDot) {
        targetDot = document.createElement('div');
        targetDot.style.position = 'absolute';
        targetDot.style.width = '20px';
        targetDot.style.height = '20px';
        targetDot.style.borderRadius = '50%';
        targetDot.style.backgroundColor = 'blue';
        targetDot.style.pointerEvents = 'none';
        targetDot.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(targetDot);
    }

    targetDot.style.left = `${targetX}px`;
    targetDot.style.top = `${targetY}px`;
});

document.addEventListener('mousemove', (e) => {
    if (isMouseDown && targetDot) {
        targetX = e.clientX;
        targetY = e.clientY;
        targetDot.style.left = `${targetX}px`;
        targetDot.style.top = `${targetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
    if (targetDot) {
        targetDot.remove();
        targetDot = null;
    }
    targetX = null;
    targetY = null;
});

document.addEventListener('touchstart', (e) => {
    isMouseDown = true;
    targetX = e.touches[0].clientX;
    targetY = e.touches[0].clientY;

    if (!targetDot) {
        targetDot = document.createElement('div');
        targetDot.style.position = 'absolute';
        targetDot.style.width = '20px';
        targetDot.style.height = '20px';
        targetDot.style.borderRadius = '50%';
        targetDot.style.backgroundColor = 'blue';
        targetDot.style.pointerEvents = 'none';
        targetDot.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(targetDot);
    }

    targetDot.style.left = `${targetX}px`;
    targetDot.style.top = `${targetY}px`;
});

document.addEventListener('touchmove', (e) => {
    if (isMouseDown && targetDot) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        targetDot.style.left = `${targetX}px`;
        targetDot.style.top = `${targetY}px`;
    }
});

document.addEventListener('touchend', () => {
    isMouseDown = false;
    if (targetDot) {
        targetDot.remove();
        targetDot = null;
    }
    targetX = null;
    targetY = null;
});

elephants.forEach((elephant, index) => {
    let currentX = Math.random() * (window.innerWidth - 100);
    let currentY = Math.random() * (window.innerHeight - 100);
    let angle = (index / elephants.length) * Math.PI * 2;
    let currentMode = 'random';
    let animationId = null;

    const clampPosition = () => {
        currentX = Math.max(0, Math.min(currentX, window.innerWidth - 100));
        currentY = Math.max(0, Math.min(currentY, window.innerHeight - 100));
        elephant.style.left = `${currentX}px`;
        elephant.style.top = `${currentY}px`;
    };

    clampPosition();

    const updateDirection = (dx) => {
        if (dx < 0) {
            elephant.style.transform = 'scaleX(1)';
        } else if (dx > 0) {
            elephant.style.transform = 'scaleX(-1)';
        }
    };

    const moveToRandomPosition = () => {
        if (currentMode !== 'random') return;

        const destX = Math.random() * (window.innerWidth - 100);
        const destY = Math.random() * (window.innerHeight - 100);

        const deltaX = destX - currentX;
        const deltaY = destY - currentY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = distance * 5;

        updateDirection(deltaX);
        elephant.classList.add('walking');

        const startTime = Date.now();
        const startX = currentX;
        const startY = currentY;

        const animate = () => {
            if (currentMode !== 'random') {
                elephant.classList.remove('walking');
                return;
            }

            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            currentX = startX + deltaX * progress;
            currentY = startY + deltaY * progress;

            elephant.style.left = `${currentX}px`;
            elephant.style.top = `${currentY}px`;

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                elephant.classList.remove('walking');
                const waitTime = Math.random() * 2000 + 1000;
                setTimeout(moveToRandomPosition, waitTime);
            }
        };

        animationId = requestAnimationFrame(animate);
    };

    const walkToTarget = () => {
        if (!isMouseDown || targetX === null || targetY === null) {
            currentMode = 'random';
            elephant.classList.remove('walking');
            const waitTime = Math.random() * 2000 + 1000;
            setTimeout(moveToRandomPosition, waitTime);
            return;
        }

        const radius = 100;
        const centerX = targetX - 50;
        const centerY = targetY - 50;

        const circleX = centerX + Math.cos(angle) * radius;
        const circleY = centerY + Math.sin(angle) * radius;

        const deltaX = circleX - currentX;
        const deltaY = circleY - currentY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 5) {
            currentMode = 'circling';
            circleAroundTarget();
            return;
        }

        const duration = distance * 5;

        updateDirection(deltaX);
        elephant.classList.add('walking');

        const startTime = Date.now();
        const startX = currentX;
        const startY = currentY;

        const animate = () => {
            if (!isMouseDown || targetX === null || targetY === null) {
                currentMode = 'random';
                elephant.classList.remove('walking');
                const waitTime = Math.random() * 2000 + 1000;
                setTimeout(moveToRandomPosition, waitTime);
                return;
            }

            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            currentX = startX + deltaX * progress;
            currentY = startY + deltaY * progress;

            elephant.style.left = `${currentX}px`;
            elephant.style.top = `${currentY}px`;

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                currentMode = 'circling';
                circleAroundTarget();
            }
        };

        animationId = requestAnimationFrame(animate);
    };

    const circleAroundTarget = () => {
        if (!isMouseDown || targetX === null || targetY === null) {
            currentMode = 'random';
            elephant.classList.remove('walking');
            const waitTime = Math.random() * 2000 + 1000;
            setTimeout(moveToRandomPosition, waitTime);
            return;
        }

        const radius = 100;
        const centerX = targetX - 50;
        const centerY = targetY - 50;

        angle += 0.03;

        const circleX = centerX + Math.cos(angle) * radius;
        const circleY = centerY + Math.sin(angle) * radius;

        const dx = circleX - currentX;
        updateDirection(dx);

        currentX = circleX;
        currentY = circleY;

        elephant.classList.add('walking');
        elephant.style.left = `${currentX}px`;
        elephant.style.top = `${currentY}px`;

        animationId = requestAnimationFrame(circleAroundTarget);
    };

    const checkMode = () => {
        if (isMouseDown && targetX !== null && targetY !== null && currentMode === 'random') {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            currentMode = 'walking_to_target';
            walkToTarget();
        }
    };

    setInterval(checkMode, 100);

    window.addEventListener('resize', clampPosition);

    const initialWait = Math.random() * 2000;
    setTimeout(moveToRandomPosition, initialWait);
});
