// =========================================================
// Echove Media – script.js
// - Count animations on page load
// - Mobile nav
// - Fade-in sections
// - Video play/pause behavior
// - Testimonial modal (click to zoom)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    // ----------------- Footer year -----------------
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ----------------- Mobile nav toggle -----------------
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    const setExpanded = (val) => toggle?.setAttribute("aria-expanded", String(val));

    if (toggle && links) {
        toggle.addEventListener("click", () => {
            links.classList.toggle("open");
            setExpanded(links.classList.contains("open"));
        });

        links.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                links.classList.remove("open");
                setExpanded(false);
            });
        });
    }

    document.addEventListener("click", (e) => {
        if (!toggle || !links) return;
        if (!links.classList.contains("open")) return;
        if (!e.target.closest(".navbar")) {
            links.classList.remove("open");
            setExpanded(false);
        }
    });

    // ----------------- Count animation (runs on load) -----------------
    const counters = document.querySelectorAll('.counter[data-target][data-animate="1"]');

    const formatValue = (value, opts) => {
        const { compact, decimals, prefix, suffix } = opts;

        let out = "";
        if (compact) {
            out = new Intl.NumberFormat("en", {
                notation: "compact",
                maximumFractionDigits: decimals,
            }).format(value);
        } else {
            out = new Intl.NumberFormat("en", {
                maximumFractionDigits: decimals,
                minimumFractionDigits: decimals,
            }).format(value);
        }

        return `${prefix}${out}${suffix}`;
    };

    const animateCounter = (el) => {
        const targetRaw = el.getAttribute("data-target");
        const target = Number(targetRaw);
        if (Number.isNaN(target)) return;

        let duration = Number(el.getAttribute("data-duration")) || 5000;

// big numbers feel too fast → give them more time
        if (target >= 100000) duration = Math.max(duration, 5000);
        if (target >= 1000000) duration = Math.max(duration, 5000);
        const decimals = Number(el.getAttribute("data-decimals")) || 0;
        const compact = el.getAttribute("data-compact") === "1";
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";

        const start = performance.now();
        const from = 0;

        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            // smooth-ish easing
            const eased = 1 - Math.pow(1 - t, 3);

            const current = from + (target - from) * eased;

            // keep decimals accurate
            const rounded = decimals > 0 ? Number(current.toFixed(decimals)) : Math.floor(current);

            el.textContent = formatValue(rounded, { compact, decimals, prefix, suffix });

            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = formatValue(target, { compact, decimals, prefix, suffix });
        };

        requestAnimationFrame(tick);
    };

    // Run all counters immediately on page load (as you asked)
    counters.forEach((el) => {
        // start from zero visually
        el.textContent = "0";
        animateCounter(el);
    });

    // ----------------- Fade-up animations -----------------
    const animatedEls = document.querySelectorAll(".animate-fade-up");
    if (animatedEls.length) {
        const observerFade = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("visible");
                });
            },
            { threshold: 0.12 }
        );
        animatedEls.forEach((el) => observerFade.observe(el));
    }

    // ----------------- Brands expand/collapse -----------------
    const brandsToggle = document.querySelector(".brands-toggle");
    const brandsMarquee = document.getElementById("brandsMarquee");
    const brandsGrid = document.getElementById("brandsGrid");

    if (brandsToggle && brandsMarquee && brandsGrid) {
        const setExpanded = (expanded) => {
            brandsToggle.setAttribute("aria-expanded", String(expanded));
            brandsToggle.textContent = expanded ? "Collapse" : "Expand me";

            if (expanded) {
                brandsMarquee.classList.add("paused");
                brandsGrid.hidden = false;
                brandsMarquee.hidden = true;
            } else {
                brandsGrid.hidden = true;
                brandsMarquee.hidden = false;
                brandsMarquee.classList.remove("paused");
            }
        };

        setExpanded(false);

        brandsToggle.addEventListener("click", () => {
            const expanded = brandsToggle.getAttribute("aria-expanded") === "true";
            setExpanded(!expanded);
        });
    }


    // ----------------- Campaign videos (tap to play; pause others) -----------------
    const videoBoxes = document.querySelectorAll("#campaigns .video-box");
    const allVideos = document.querySelectorAll("#campaigns video");

    const pauseOthers = (activeVideo) => {
        allVideos.forEach((v) => {
            if (v !== activeVideo) {
                v.pause();
                v.closest(".video-box")?.classList.remove("playing");
            }
        });
    };

    videoBoxes.forEach((box) => {
        const video = box.querySelector("video");
        if (!video) return;

        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        video.muted = true;
        video.setAttribute("muted", "");

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

        video.addEventListener("ended", () => box.classList.remove("playing"));
    });

    // // ----------------- Testimonials modal (click to zoom) -----------------
    // const modal = document.getElementById("imgModal");
    // const modalImg = document.getElementById("modalImg");
    // const tCards = document.querySelectorAll(".t-card");
    //
    // const openModal = (src) => {
    //     if (!modal || !modalImg) return;
    //     modalImg.src = src;
    //     modal.classList.add("open");
    //     modal.setAttribute("aria-hidden", "false");
    //     document.body.style.overflow = "hidden";
    // };
    //
    // const closeModal = () => {
    //     if (!modal || !modalImg) return;
    //     modal.classList.remove("open");
    //     modal.setAttribute("aria-hidden", "true");
    //     modalImg.src = "";
    //     document.body.style.overflow = "";
    // };
    //
    // tCards.forEach((btn) => {
    //     btn.addEventListener("click", () => {
    //         const full = btn.getAttribute("data-full");
    //         if (full) openModal(full);
    //     });
    // });
    //
    // modal?.addEventListener("click", (e) => {
    //     const close = e.target?.getAttribute?.("data-close");
    //     if (close === "true") closeModal();
    // });
    //
    // document.addEventListener("keydown", (e) => {
    //     if (e.key === "Escape") closeModal();
    // });

    // ===== Lead modal (show after 10s, Creator/Brand switch) =====
    // ===== Lead modal (show after 10s, Creator/Brand switch, Thank You hash) =====
    (() => {
        const modal = document.getElementById("leadModal");
        if (!modal) return;

        const closeEls = modal.querySelectorAll("[data-lead-close]");
        const tabs = modal.querySelectorAll("[data-lead-tab]");
        const creatorForm = modal.querySelector('[data-lead-form="creator"]');
        const brandForm = modal.querySelector('[data-lead-form="brand"]');

        const thankYouSection = document.getElementById("thank-you");
        const thankYouLine = document.getElementById("thankYouLine");

        const open = () => {
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.documentElement.style.overflow = "hidden";
        };

        const close = () => {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.documentElement.style.overflow = "";
        };

        const setTab = (key) => {
            tabs.forEach(t => {
                const active = t.dataset.leadTab === key;
                t.classList.toggle("is-active", active);
                t.setAttribute("aria-selected", active ? "true" : "false");
            });

            if (key === "creator") {
                creatorForm.classList.remove("is-hidden");
                brandForm.classList.add("is-hidden");
            } else {
                brandForm.classList.remove("is-hidden");
                creatorForm.classList.add("is-hidden");
            }
        };

        // If we landed here after submit, show Thank You section
        const showThankYouIfNeeded = () => {
            if (!thankYouSection) return;

            const hash = window.location.hash || "";
            if (!hash.startsWith("#thank-you")) return;

            // Make it visible
            thankYouSection.hidden = false;

            // Optional: customize line based on type query in hash
            // Example: #thank-you?type=creator
            const typeMatch = hash.match(/type=(creator|brand)/i);
            const type = typeMatch ? typeMatch[1].toLowerCase() : "";

            if (thankYouLine) {
                if (type === "creator") {
                    thankYouLine.textContent = "Creator form received. We’ll reach out soon with next steps.";
                } else if (type === "brand") {
                    thankYouLine.textContent = "Brand inquiry received. We’ll reach out within 24–48 hours.";
                } else {
                    thankYouLine.textContent = "Your details have been received. We’ll reach out shortly.";
                }
            }

            // Scroll into view smoothly
            thankYouSection.scrollIntoView({ behavior: "smooth", block: "start" });

            // Don't pop the modal if we're on thank-you
            return true;
        };

        const onThankYou = showThankYouIfNeeded();

        // Show after 10s (once per browser) unless we are on thank-you
        const hasShown = localStorage.getItem("echove_lead_modal_shown");
        if (!hasShown && !onThankYou) {
            window.setTimeout(() => {
                open();
                localStorage.setItem("echove_lead_modal_shown", "1");
            }, 5000);
        }

        closeEls.forEach(el => el.addEventListener("click", close));

        // ESC close
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("is-open")) close();
        });

        // hover = preview tab on desktop, click = lock
        tabs.forEach(tab => {
            tab.addEventListener("mouseenter", () => {
                if (window.matchMedia("(hover: hover)").matches) setTab(tab.dataset.leadTab);
            });
            tab.addEventListener("click", () => setTab(tab.dataset.leadTab));
        });

        // Manual reopen button (ignores localStorage)
        const manualOpenBtn = document.getElementById("openLeadModal");
        if (manualOpenBtn) {
            manualOpenBtn.addEventListener("click", () => {
                modal.classList.add("is-open");
                modal.setAttribute("aria-hidden", "false");
                document.documentElement.style.overflow = "hidden";
            });
        }


        // default tab
        setTab("creator");
    })();


});
