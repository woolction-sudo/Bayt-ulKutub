window.bookSlider = (id, itemWidth) => {
    const container = document.getElementById(id);
    if (!container) return;

    let isDown = false;
    let startX;
    let currentTranslate = 0;

    let currentIndex = 0;
    const maxIndex = Math.max(0, container.children.length - 1);

    container.addEventListener("mousedown", startDrag);
    container.addEventListener("touchstart", startDrag);

    container.addEventListener("mouseleave", endDrag);
    container.addEventListener("mouseup", endDrag);
    container.addEventListener("touchend", endDrag);

    container.addEventListener("mousemove", drag);
    container.addEventListener("touchmove", drag);

    function startDrag(e) {
        isDown = true;
        startX = getX(e);
        container.style.transition = "none";
    }

    function drag(e) {
        if (!isDown) return;

        const x = getX(e);
        const walk = (x - startX) * -1;

        container.style.transform = `translateX(${currentTranslate - walk}px)`;
    }

    function endDrag(e) {
        if (!isDown) return;
        isDown = false;

        const x = getX(e);
        const moved = (x - startX) * -1;
        currentTranslate -= moved;

        currentIndex = Math.round(Math.max(0, currentTranslate / itemWidth));
        currentIndex = Math.min(currentIndex, maxIndex - 4);

        currentTranslate = currentIndex * itemWidth;

        container.style.transition = "transform 0.5s ease";
        container.style.transform = `translateX(-${currentTranslate}px)`;
    }

    function getX(e) {
        return e.touches ? e.touches[0].pageX : e.pageX;
    }
};

window.getElementWidth = (id) => {
    const el = document.getElementById(id);

    if (!el) 
    {
        console.warn("el not found:", id);
        return 200;
    }

    return el.offsetWidth;
};

window.initBookSlider = (id, itemWidth, visibleCount) => {
    const container = document.getElementById(id);
    if (!container) {
        console.warn("Slider container not found:", id);
        return;
    }

    let isDown = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;
    let autoSlidePaused = false;

    const maxIndex = Math.max(0, container.children.length - visibleCount);

    container.addEventListener("mousedown", startDrag);
    container.addEventListener("touchstart", startDrag, { passive: true });

    container.addEventListener("mouseup", endDrag);
    container.addEventListener("mouseleave", endDrag);
    container.addEventListener("touchend", endDrag);

    container.addEventListener("mousemove", drag);
    container.addEventListener("touchmove", drag, { passive: true });

    function startDrag(e) {
        isDown = true;
        autoSlidePaused = true;
        startX = getX(e) - currentTranslate;
        container.style.transition = "none";
        cancelAnimationFrame(animationID);
    }

    function drag(e) {
        if (!isDown) return;
        const x = getX(e);
        currentTranslate = x - startX;
        setSliderPosition();
    }

    function endDrag() {
        if (!isDown) return;
        isDown = false;

        const movedBy = currentTranslate - prevTranslate;
        if (Math.abs(movedBy) > itemWidth / 3) {
            currentIndex -= Math.sign(movedBy);
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        }

        setPositionByIndex();
    }

    function setPositionByIndex() {
        currentTranslate = -currentIndex * itemWidth;
        prevTranslate = currentTranslate;
        container.style.transition = "transform 0.4s ease";
        setSliderPosition();
    }

    function setSliderPosition() {
        container.style.transform = `translateX(${currentTranslate}px)`;
    }

    function getX(e) {
        return e.touches ? e.touches[0].pageX : e.pageX;
    }

    return {
        updateFromDotNet: (index) => {
            currentIndex = index;
            setPositionByIndex();
        },
        resumeAutoSlide: () => { autoSlidePaused = false; },
        isPaused: () => autoSlidePaused
    };
};