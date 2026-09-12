/* ScaleVAI Calendly Integration - High Performance Instant Loader */
window.SCALEVAI_CALENDLY_URL = "https://calendly.com/qutatym129/30min";

(function () {
    "use strict";

    if (window.__SCALEVAI_CALENDLY_INITIALIZED) {
        return;
    }
    window.__SCALEVAI_CALENDLY_INITIALIZED = true;

    function isDarkModeActive() {
        return (
            document.documentElement.classList.contains("tw-dark") ||
            document.documentElement.classList.contains("dark") ||
            localStorage.getItem("color-mode") === "dark" ||
            (!("color-mode" in localStorage) &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        );
    }

    function getThemedCalendlyUrl(isDark, embedType = "Inline") {
        const rawUrl = window.SCALEVAI_CALENDLY_URL || "https://calendly.com/qutatym129/30min";
        const baseUrl = rawUrl.split("?")[0];
        const params = new URLSearchParams();

        params.set("embed_domain", window.location.hostname || "scalevai.com");
        params.set("embed_type", embedType);

        if (isDark) {
            params.set("background_color", "000000");
            params.set("text_color", "ffffff");
            params.set("primary_color", "6366f1");
        } else {
            params.set("background_color", "fcfcfc");
            params.set("text_color", "111827");
            params.set("primary_color", "003060");
        }
        params.set("hide_gdpr_banner", "1");

        return `${baseUrl}?${params.toString()}`;
    }

    // 1. Fetch backend config silently (only updates if customized by admin)
    fetch('/api/calendly/config')
        .then((res) => res.json())
        .then((data) => {
            if (data && data.url && !data.url.includes("new-meeting") && !data.url.includes("your-account")) {
                if (data.url !== window.SCALEVAI_CALENDLY_URL) {
                    window.SCALEVAI_CALENDLY_URL = data.url;
                    syncAllCalendlyIframes(true);
                }
            }
        })
        .catch(() => {
            // Keep default URL
        });

    // 2. Synchronize all inline iframes to correct theme (only when necessary to avoid reloading)
    function syncAllCalendlyIframes(force = false) {
        const isDark = isDarkModeActive();
        const themedUrl = getThemedCalendlyUrl(isDark, "Inline");
        const targetBg = isDark ? 'background_color=000000' : 'background_color=fcfcfc';

        document.querySelectorAll('.calendly-iframe').forEach((iframe) => {
            try {
                const currentSrc = iframe.getAttribute('src') || '';
                // Only change src if it doesn't already match the current theme or if forced
                if (force || !currentSrc.includes(targetBg)) {
                    iframe.src = themedUrl;
                }
            } catch (e) {
                // Ignore URL parsing errors
            }
        });
    }

    // 3. Hide loading skeletons when iframes load or after a guaranteed fallback timeout
    function dismissAllSkeletons() {
        document.querySelectorAll('.calendly-skeleton').forEach((skeleton) => {
            skeleton.style.opacity = '0';
            setTimeout(() => {
                skeleton.style.display = 'none';
            }, 200);
        });
    }

    function initIframeListeners() {
        document.querySelectorAll('.calendly-iframe').forEach((iframe) => {
            iframe.addEventListener('load', () => {
                const skeleton = iframe.previousElementSibling;
                if (skeleton && skeleton.classList.contains('calendly-skeleton')) {
                    skeleton.style.opacity = '0';
                    setTimeout(() => {
                        skeleton.style.display = 'none';
                    }, 200);
                }
            });
        });

        // Guaranteed fallback: dismiss skeleton after 2.5s even if onload is blocked by browser cross-origin policy
        setTimeout(dismissAllSkeletons, 2500);
    }

    // 4. Dynamic height adjustment to eliminate scrollbars and fit perfectly
    window.addEventListener('message', function (e) {
        if (e.data && e.data.event === 'calendly.page_height' && e.data.payload) {
            const rawHeight = e.data.payload.height;
            const numHeight = typeof rawHeight === 'number' ? rawHeight : parseInt(rawHeight, 10);
            if (!isNaN(numHeight) && numHeight > 0) {
                const fitHeight = (numHeight + 6) + 'px';
                document.querySelectorAll('.calendly-card-box').forEach((box) => {
                    box.style.minHeight = fitHeight;
                    box.style.height = fitHeight;
                });
                document.querySelectorAll('.calendly-iframe').forEach((iframe) => {
                    iframe.style.height = fitHeight;
                    iframe.style.minHeight = fitHeight;
                    iframe.setAttribute('scrolling', 'no');
                });
            }
        }
    });

    // 5. Watch for theme changes (dark/light mode toggles)
    const themeObserver = new MutationObserver(() => {
        syncAllCalendlyIframes(false);
    });
    if (document.documentElement) {
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    // 6. Instant Booking Modal
    let modalElement = null;

    function createBookingModal() {
        if (modalElement) return modalElement;

        const isDark = isDarkModeActive();
        const themedUrl = getThemedCalendlyUrl(isDark, "PopupWidget");

        const modal = document.createElement("div");
        modal.id = "scalevai-booking-modal";
        modal.className = "scalevai-modal-overlay";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-label", "Book a discovery call");

        modal.innerHTML = `
            <div class="scalevai-modal-backdrop"></div>
            <div class="scalevai-modal-window">
                <div class="scalevai-modal-header">
                    <div class="scalevai-modal-title-group">
                        <div class="scalevai-modal-icon">
                            <i class="bi bi-calendar2-check"></i>
                        </div>
                        <div>
                            <h3 class="scalevai-modal-title">Book a 30-Minute Discovery Call</h3>
                            <p class="scalevai-modal-subtitle">Direct consultation with ScaleVAI AI implementation specialists.</p>
                        </div>
                    </div>
                    <button type="button" class="scalevai-modal-close" aria-label="Close booking modal">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="scalevai-modal-body">
                    <div class="scalevai-modal-spinner">
                        <div class="scalevai-spinner-ring"></div>
                        <span>Loading calendar...</span>
                    </div>
                    <iframe 
                        id="scalevai-modal-iframe" 
                        class="scalevai-modal-iframe" 
                        src="${themedUrl}" 
                        frameborder="0" 
                        scrolling="no" 
                        title="Book a Discovery Call - ScaleVAI"
                    ></iframe>
                </div>
                <div class="scalevai-modal-footer">
                    <span>Instant confirmation &amp; Google Meet invite sent automatically.</span>
                    <a href="${window.SCALEVAI_CALENDLY_URL}" target="_blank" rel="noopener noreferrer" class="scalevai-modal-ext-link">
                        Open direct link <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const iframe = modal.querySelector("#scalevai-modal-iframe");
        const spinner = modal.querySelector(".scalevai-modal-spinner");
        if (iframe && spinner) {
            iframe.addEventListener("load", () => {
                spinner.style.opacity = "0";
                setTimeout(() => {
                    spinner.style.display = "none";
                }, 200);
            });
            setTimeout(() => {
                spinner.style.opacity = "0";
                setTimeout(() => {
                    spinner.style.display = "none";
                }, 200);
            }, 3000);
        }

        const closeBtn = modal.querySelector(".scalevai-modal-close");
        const backdrop = modal.querySelector(".scalevai-modal-backdrop");
        if (closeBtn) closeBtn.onclick = closeBookingModal;
        if (backdrop) backdrop.onclick = closeBookingModal;

        modalElement = modal;
        return modal;
    }

    function openBookingModal() {
        const modal = createBookingModal();
        const isDark = isDarkModeActive();
        const themedUrl = getThemedCalendlyUrl(isDark, "PopupWidget");

        const iframe = modal.querySelector("#scalevai-modal-iframe");
        if (iframe) {
            const currentSrc = iframe.getAttribute("src") || "";
            const targetBg = isDark ? "background_color=0f1115" : "background_color=ffffff";
            if (!currentSrc.includes(targetBg)) {
                iframe.src = themedUrl;
            }
        }

        modal.classList.add("is-active");
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleModalEsc);
    }

    function closeBookingModal() {
        if (!modalElement) return;
        modalElement.classList.remove("is-active");
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleModalEsc);
    }

    function handleModalEsc(e) {
        if (e.key === "Escape") {
            closeBookingModal();
        }
    }

    // Expose functions globally
    window.openScalevaiCalendly = function (event) {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }
        openBookingModal();
    };

    window.closeScalevaiCalendly = closeBookingModal;

    // 7. Global click delegation for all "Book a discovery call" triggers
    document.addEventListener("click", function (event) {
        const target = event.target.closest("a, button");
        if (!target) return;

        const text = (target.textContent || "").trim().toLowerCase();
        const aria = (target.getAttribute("aria-label") || "").toLowerCase();
        const href = (target.getAttribute("href") || "").toLowerCase();

        const isDiscoveryCall =
            target.classList.contains("btn-discovery-call") ||
            target.hasAttribute("data-discovery-btn") ||
            target.hasAttribute("data-calendly-booking") ||
            target.hasAttribute("data-calendly-modal") ||
            aria.includes("discovery call") ||
            aria.includes("book a call") ||
            text.includes("book a discovery call") ||
            (text.includes("book a call") && !text.includes("saba") && (target.closest(".hero-section, .catalog-hero, .solution-shrinking-hero, .site-header, header, .solution-particle-cta, .contact-bottom-cta") || href.includes("#contact") || href.includes("contact.html")));

        if (!isDiscoveryCall) return;

        // If explicitly requesting modal dialog via attribute
        if (target.hasAttribute("data-calendly-modal")) {
            event.preventDefault();
            openBookingModal();
            return;
        }

        // Check if an embedded calendar or contact section is on the current page:
        const homeIframe = document.getElementById("home-calendly-iframe");
        const contactIframe = document.getElementById("contact-calendly-iframe");
        const contactSection = document.getElementById("contact") || document.querySelector(".contact-workspace");
        const embeddedTarget = homeIframe || contactIframe || contactSection;

        if (embeddedTarget) {
            event.preventDefault();
            embeddedTarget.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        // If on a page without an embedded calendar card (e.g., solution detail sub-pages)
        // and link points to contact.html or #contact: let standard link navigation proceed
        if (href.includes("contact.html") || href.includes("#contact")) {
            return;
        }

        // Otherwise open the instant booking modal
        event.preventDefault();
        openBookingModal();
    });

    // Run listeners
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initIframeListeners();
            syncAllCalendlyIframes(false);
        });
    } else {
        initIframeListeners();
        syncAllCalendlyIframes(false);
    }
})();
