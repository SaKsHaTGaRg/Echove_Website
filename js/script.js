// =========================================================
// Echove Media – script.js (clean + responsive behaviors)
// Copy-paste this whole file into: js/script.js
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    // ----------------- Footer year -----------------
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ----------------- Mobile nav toggle -----------------
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    const setExpanded = (val) => {
        if (!toggle) return;
        toggle.setAttribute("aria-expanded", String(val));
    };

    if (toggle && links) {
        toggle.addEventListener("click", () => {
            links.classList.toggle("open");
            setExpanded(links.classList.contains("open"));
        });

        // Close menu on link click (mobile)
        links.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                links.classList.remove("open");
                setExpanded(false);
            });
        });
    }

    // Close menu if user clicks outside (mobile)
    document.addEventListener("click", (e) => {
        if (!toggle || !links) return;
        if (!links.classList.contains("open")) return;

        const clickedInsideNav = e.target.closest(".navbar");
        if (!clickedInsideNav) {
            links.classList.remove("open");
            setExpanded(false);
        }
    });

    // ----------------- Counters (stats + hero proof) -----------------
    const counters = document.querySelectorAll(".counter[data-target]");

    function formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    function runCounter(counter) {
        const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
        const duration = 900; // ms
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = formatNumber(value);
            if (progress < 1) requestAnimationFrame(tick);
            else counter.textContent = formatNumber(target);
        }

        requestAnimationFrame(tick);
    }

    if (counters.length) {
        const observed = new WeakSet();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !observed.has(entry.target)) {
                        observed.add(entry.target);
                        runCounter(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((c) => observer.observe(c));
    }

    // ----------------- Fade-up animations -----------------
    const animatedEls = document.querySelectorAll(".animate-fade-up");
    if (animatedEls.length) {
        const observerFade = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("visible");
                });
            },
            { threshold: 0.15 }
        );

        animatedEls.forEach((el) => observerFade.observe(el));
    }

    // ----------------- Campaign videos (tap to play; pause others) -----------------
    const videoBoxes = document.querySelectorAll("#campaigns .video-box");
    const allVideos = document.querySelectorAll("#campaigns video");

    function pauseOthers(activeVideo) {
        allVideos.forEach((v) => {
            if (v !== activeVideo) {
                v.pause();
                const vb = v.closest(".video-box");
                if (vb) vb.classList.remove("playing");
            }
        });
    }

    videoBoxes.forEach((box) => {
        const video = box.querySelector("video");
        if (!video) return;

        // Allow inline play on mobile
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        box.addEventListener("click", () => {
            pauseOthers(video);

            if (video.paused) {
                video.play().catch(() => {});
                box.classList.add("playing");
            } else {
                video.pause();
                box.classList.remove("playing");
            }
        });

        video.addEventListener("ended", () => {
            box.classList.remove("playing");
        });
    });

    // ----------------- Testimonials carousel (auto-center middle) -----------------
    const track = document.querySelector(".carousel-track");
    if (track) {
        const updateCarousel = () => {
            const items = Array.from(track.children);
            const total = items.length;
            if (total === 0) return;

            items.forEach((item) => item.classList.remove("active"));

            // Rotate: move first to end
            track.appendChild(items[0]);

            const fresh = Array.from(track.children);
            const middle = Math.floor(fresh.length / 2);

            fresh[middle].classList.add("active");

            const isMobile = window.matchMedia("(max-width: 980px)").matches;
            const offset = isMobile ? 0 : -middle * (100 / 3);
            track.style.transform = `translateX(${offset}%)`;
        };

        updateCarousel();
        setInterval(updateCarousel, 4000);
    }
});
