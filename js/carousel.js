// --- Testimonial Carousel (auto-play, dynamic dots) ---
// FIXED: Proper calculation of carousel offset and wrapping

(function () {
  const wrapper  = document.querySelector(".carousel-wrapper");
  const track    = document.getElementById("carouselTrack");
  const cards    = track.querySelectorAll(".testimonial-card");
  const dotsBox  = document.getElementById("dots");
  const total    = cards.length;

  // Read CSS custom properties from wrapper
  const visible  = parseInt(getComputedStyle(wrapper).getPropertyValue("--visible")) || 1;
  const gapStr   = getComputedStyle(wrapper).getPropertyValue("--gap").trim();
  const gap      = parseInt(gapStr) || 20;

  // How many positions we can actually slide to (total - visible cards shown)
  const maxIndex = Math.max(0, total - visible);
  let current    = 0;
  let timer      = null;

  // ---------- BUILD DOTS (one per card, but only show first N) ----------
  cards.forEach(function (_, i) {
    // Only add dots for positions we can actually navigate to (maxIndex + 1 positions)
    if (i <= maxIndex) {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.dataset.index = i;
      dot.addEventListener("click", function () { 
        goTo(parseInt(this.dataset.index)); 
        resetTimer(); 
      });
      dotsBox.appendChild(dot);
    }
  });

  function getDots() { 
    return dotsBox.querySelectorAll(".dot"); 
  }

  // ---------- SLIDE TO INDEX ----------
  function goTo(index) {
    // clamp so we never go past the last visible group
    current = Math.max(0, Math.min(index, maxIndex));

    // Get actual card width (not just CSS, but rendered size)
    const cardWidth = cards[0].offsetWidth;
    
    // Calculate offset: current position * (card width + gap)
    const offset = current * (cardWidth + gap);

    track.style.transform = "translateX(-" + offset + "px)";

    // Update dots
    getDots().forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  // ---------- PREV / NEXT ----------
  document.getElementById("prevBtn").addEventListener("click", function () {
    // Go to previous, wrap to maxIndex if at start
    const nextIndex = current === 0 ? maxIndex : current - 1;
    goTo(nextIndex);
    resetTimer();
  });

  document.getElementById("nextBtn").addEventListener("click", function () {
    // Go to next, wrap to 0 if at end
    const nextIndex = current >= maxIndex ? 0 : current + 1;
    goTo(nextIndex);
    resetTimer();
  });

  // ---------- AUTO-PLAY (every 5 seconds) ----------
  function startTimer() {
    timer = setInterval(function () {
      const nextIndex = current >= maxIndex ? 0 : current + 1;
      goTo(nextIndex);
    }, 5000);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  // pause on hover, resume on leave
  wrapper.addEventListener("mouseenter", function () { 
    clearInterval(timer); 
  });
  wrapper.addEventListener("mouseleave", function () { 
    startTimer(); 
  });

  startTimer();   // kick it off

  // ---------- RECALC on window resize ----------
  window.addEventListener("resize", function () { 
    goTo(current); 
  });
})();
