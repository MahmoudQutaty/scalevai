/* Central Calendly booking configuration. Replace this URL with your public Calendly event URL. */
window.SCALEVAI_CALENDLY_URL = "https://calendly.com/your-account/discovery-call";

;(function () {
    const calendlyUrl = window.SCALEVAI_CALENDLY_URL
    if (!calendlyUrl || calendlyUrl.includes("your-account")) return

    function loadCalendly() {
        if (window.Calendly) return Promise.resolve()
        return new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://assets.calendly.com/assets/external/widget.js"
            script.async = true
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
        })
    }

    function openCalendly(event) {
        event.preventDefault()
        loadCalendly().then(() => {
            window.Calendly.initPopupWidget({ url: calendlyUrl })
        }).catch(() => {
            window.location.href = calendlyUrl
        })
    }

    document.querySelectorAll("a[href$=\"contact.html\"], a[href$=\"#contact\"]").forEach((link) => {
        const label = link.textContent.toLowerCase()
        if (/call|consult|discov|schedule|architecture|diagnostic|audit/.test(label) || link.getAttribute("aria-label")?.toLowerCase().includes("call")) {
            link.addEventListener("click", openCalendly)
            link.setAttribute("data-calendly-booking", "true")
        }
    })
})()
