/* ScaleVAI Calendly Integration */
window.SCALEVAI_CALENDLY_URL = "https://calendly.com/qutatym129/30min";

(function () {
    // 1. Ensure Calendly widget stylesheet is loaded
    if (!document.querySelector('link[href*="widget.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://assets.calendly.com/assets/external/widget.css";
        document.head.appendChild(link);
    }

    // 2. Fetch configured URL from server
    fetch('/api/calendly/config')
        .then((res) => res.json())
        .then((data) => {
            if (data && data.url && !data.url.includes("new-meeting")) {
                window.SCALEVAI_CALENDLY_URL = data.url;
            }
            updateInlineWidgets();
        })
        .catch(() => {
            // Fallback to default
        });

    // 3. Preload or dynamically load the Calendly script
    let calendlyLoadingPromise = null;
    function loadCalendlyScript() {
        if (window.Calendly) return Promise.resolve(window.Calendly);
        if (calendlyLoadingPromise) return calendlyLoadingPromise;

        calendlyLoadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.async = true;
            script.onload = () => {
                updateInlineWidgets();
                resolve(window.Calendly);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });

        return calendlyLoadingPromise;
    }

    function updateInlineWidgets() {
        const url = window.SCALEVAI_CALENDLY_URL;
        document.querySelectorAll('.calendly-inline-widget').forEach((el) => {
            if (!el.getAttribute('data-url') || el.getAttribute('data-url').includes('new-meeting')) {
                el.setAttribute('data-url', url);
            }
        });
    }

    // Preload script immediately so inline widgets and popups render with zero delay
    loadCalendlyScript();

    // 4. Open Calendly popup widget
    window.openScalevaiCalendly = function (event) {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }

        const url = window.SCALEVAI_CALENDLY_URL;

        // If no URL or placeholder, show prompt to provide link
        if (!url || url.includes("your-account") || url.includes("your-username")) {
            showCalendlySetupNotice();
            return;
        }

        loadCalendlyScript()
            .then((Calendly) => {
                Calendly.initPopupWidget({
                    url: url
                });
            })
            .catch(() => {
                // Fallback to direct redirect if widget fails
                window.location.href = url;
            });
    };

    function showCalendlySetupNotice() {
        // Remove existing notice if present
        const existing = document.getElementById("calendly-setup-modal");
        if (existing) existing.remove();

        const isDark = document.documentElement.classList.contains("tw-dark");
        const modal = document.createElement("div");
        modal.id = "calendly-setup-modal";
        modal.className = "tw-fixed tw-inset-0 tw-z-[999999] tw-flex tw-items-center tw-place-content-center tw-p-4";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        modal.style.backdropFilter = "blur(6px)";

        modal.innerHTML = `
            <div class="tw-relative tw-w-full tw-max-w-md tw-rounded-2xl tw-p-6 tw-shadow-2xl tw-transition-all"
                 style="background: ${isDark ? '#17181b' : '#ffffff'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}; color: ${isDark ? '#f3f4f6' : '#111827'};">
                <button type="button" id="close-calendly-notice" class="tw-absolute tw-right-4 tw-top-4 tw-text-xl tw-opacity-60 hover:tw-opacity-100">&times;</button>
                <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
                    <div class="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center" style="background: rgba(0, 48, 96, 0.1); color: #003060;">
                        <i class="bi bi-calendar-check tw-text-xl"></i>
                    </div>
                    <h3 class="tw-text-lg tw-font-semibold">Calendly Booking Ready</h3>
                </div>
                <p class="tw-text-sm tw-opacity-80 tw-mb-4 tw-leading-relaxed">
                    The booking popup is active! To connect your specific calendar, please provide your Calendly scheduling link (e.g. <code>https://calendly.com/your-name/discovery-call</code>).
                </p>
                <div class="tw-flex tw-justify-end tw-gap-2">
                    <button type="button" id="dismiss-calendly-notice" class="btn tw-px-4 tw-py-2 tw-text-sm tw-rounded-lg" style="background: #003060; color: #ffffff;">Got it</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = document.getElementById("close-calendly-notice");
        const dismissBtn = document.getElementById("dismiss-calendly-notice");
        const closeHandler = () => modal.remove();
        if (closeBtn) closeBtn.onclick = closeHandler;
        if (dismissBtn) dismissBtn.onclick = closeHandler;
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    // 5. Wire buttons across all pages via event delegation
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
            aria.includes("discovery call") ||
            aria.includes("book a call") ||
            text.includes("book a discovery call") ||
            (text.includes("book a call") && !text.includes("saba") && (target.closest(".hero-section, .catalog-hero, .solution-shrinking-hero, .site-header, header") || href.includes("#contact") || href.includes("contact.html")));

        if (isDiscoveryCall) {
            window.openScalevaiCalendly(event);
        }
    });
})();
