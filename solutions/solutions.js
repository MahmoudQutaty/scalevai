// initialization (mirrors index.js header/theme behavior, scoped to solution detail pages)

const RESPONSIVE_WIDTH = 1024

let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")

const navToggle = document.querySelector("#nav-dropdown-toggle-0")
const navDropdown = document.querySelector("#nav-dropdown-list-0")


function onHeaderClickOutside(e) {
    if (!collapseHeaderItems.contains(e.target)) {
    toggleHeader()
    }
}

function toggleHeader() {
    if (isHeaderCollapsed) {
        collapseHeaderItems.classList.add("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "90vh"
        collapseBtn.classList.remove("bi-list")
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed")
        isHeaderCollapsed = false

        document.body.classList.add("modal-open")
        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)
    } else {
        collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "0vh"

        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed")
        collapseBtn.classList.add("bi-list")
        document.body.classList.remove("modal-open")

        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)
    }
}

function responsive() {
    if (window.innerWidth >= RESPONSIVE_WIDTH) {
        isHeaderCollapsed = false
        collapseHeaderItems.style.height = ""
        collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        document.body.classList.remove("modal-open")
    } else if (!isHeaderCollapsed) {
        toggleHeader()
    }

    if (!navToggle) return

    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.height = ""
        if (window.sharedDropdownMenus) return
        navToggle.addEventListener("mouseenter", openNavDropdown)
        navToggle.addEventListener("mouseleave", navMouseLeave)
    } else {
        isHeaderCollapsed = true
        navToggle.removeEventListener("mouseenter", openNavDropdown)
        navToggle.removeEventListener("mouseleave", navMouseLeave)
    }
}
responsive()
window.addEventListener("resize", responsive)

/** Header starts transparent + full-width, animates to the solid pill on scroll */
const siteHeader = document.getElementById("site-header")
function handleHeaderScroll() {
    const el = siteHeader || document.getElementById("site-header")
    if (el) el.classList.toggle("is-scrolled", window.scrollY > 220)
}
handleHeaderScroll()
window.addEventListener("scroll", handleHeaderScroll, { passive: true })

/** Dark and light theme */
if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark')
    updateToggleModeBtn()
} else {
    document.documentElement.classList.remove('tw-dark')
    updateToggleModeBtn()
}

function toggleMode() {
    document.documentElement.classList.toggle("tw-dark")
    updateToggleModeBtn()
}

function updateToggleModeBtn() {
    const toggleIcon = document.querySelector("#toggle-mode-icon")
    const isDark = document.documentElement.classList.contains("tw-dark")

    // the compiled stylesheet has no dark: variants for hidden/block, so toggle logos manually
    document.querySelectorAll(".logo-light").forEach(img => img.classList.toggle("tw-hidden", isDark))
    document.querySelectorAll(".logo-dark").forEach(img => img.classList.toggle("tw-hidden", !isDark))

    if (toggleIcon) {
        if (isDark) {
            toggleIcon.classList.remove("bi-sun")
            toggleIcon.classList.add("bi-moon")
        } else {
            toggleIcon.classList.add("bi-sun")
            toggleIcon.classList.remove("bi-moon")
        }
    }
    localStorage.setItem("color-mode", isDark ? "dark" : "light")
}

if (!window.sharedDropdownMenus && navToggle && navDropdown) {
    navToggle.addEventListener("click", toggleNavDropdown)
    navDropdown.addEventListener("mouseleave", closeNavDropdown)
}

function toggleNavDropdown() {
    if (navDropdown.getAttribute("data-open") === "true") {
        closeNavDropdown()
    } else {
        openNavDropdown()
    }
}

function navMouseLeave() {
    setTimeout(closeNavDropdown, 100)
}

function openNavDropdown() {
    navDropdown.classList.add("tw-opacity-100", "tw-scale-100",
        "max-lg:tw-min-h-[450px]", "max-lg:!tw-h-fit", "tw-min-w-[320px]")
    navDropdown.setAttribute("data-open", true)
}

function closeNavDropdown() {
    if (navDropdown.matches(":hover")) {
        return
    }
    navDropdown.classList.remove("tw-opacity-100", "tw-scale-100",
        "max-lg:tw-min-h-[450px]", "tw-min-w-[320px]", "max-lg:!tw-h-fit")
    navDropdown.setAttribute("data-open", false)
}

/**
 * FAQ accordion
 */
const faqAccordion = document.querySelectorAll('.faq-accordion')

faqAccordion.forEach(function (btn) {
    btn.addEventListener('click', function () {
        let content = this.nextElementSibling
        let icon = this.querySelector(".bi-plus")
        let parentFaq = this.closest('.faq')
        let isOpen = content.style.maxHeight && content.style.maxHeight !== '0px'

        if (isOpen) {
            this.classList.remove('active')
            if (parentFaq) parentFaq.classList.remove('active')
            content.style.maxHeight = '0px'
            content.style.padding = '0px 22px'
            if (icon) icon.style.transform = "rotate(0deg)"
        } else {
            this.classList.add('active')
            if (parentFaq) parentFaq.classList.add('active')
            content.style.maxHeight = (content.scrollHeight + 35) + 'px'
            content.style.padding = '0px 22px 20px 22px'
            if (icon) icon.style.transform = "rotate(45deg)"
        }
    })
})

/** Key capabilities slider */
const capabilitySlider = document.querySelector("[data-capability-slider]")

if (capabilitySlider) {
    const capabilitySlides = Array.from(capabilitySlider.querySelectorAll("[data-capability-slide]"))
    const previousCapability = capabilitySlider.querySelector("[data-capability-prev]")
    const nextCapability = capabilitySlider.querySelector("[data-capability-next]")
    const capabilityCounter = capabilitySlider.querySelector("[data-capability-counter]")
    let capabilityIndex = 0
    let capabilityTimer

    function showCapability(index) {
        capabilityIndex = (index + capabilitySlides.length) % capabilitySlides.length

        capabilitySlides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === capabilityIndex)
        })

        if (capabilityCounter) {
            capabilityCounter.textContent = `${String(capabilityIndex + 1).padStart(2, "0")} / ${String(capabilitySlides.length).padStart(2, "0")}`
        }
    }

    previousCapability?.addEventListener("click", () => showCapability(capabilityIndex - 1))
    nextCapability?.addEventListener("click", () => showCapability(capabilityIndex + 1))

    function startCapabilityTimer() {
        clearInterval(capabilityTimer)
        capabilityTimer = window.setInterval(() => showCapability(capabilityIndex + 1), 5500)
    }

    function stopCapabilityTimer() {
        clearInterval(capabilityTimer)
    }

    capabilitySlider.addEventListener("mouseenter", stopCapabilityTimer)
    capabilitySlider.addEventListener("mouseleave", startCapabilityTimer)
    capabilitySlider.addEventListener("focusin", stopCapabilityTimer)
    capabilitySlider.addEventListener("focusout", (event) => {
        if (!capabilitySlider.contains(event.relatedTarget)) startCapabilityTimer()
    })
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopCapabilityTimer()
        else startCapabilityTimer()
    })

    showCapability(capabilityIndex)
    startCapabilityTimer()
}

/**
 * Scroll reveal + cinematic hero animations
 */
if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger)
    }

    const revealTargets = document.querySelectorAll(
        ".reveal-up:not(.solution-particle-cta *):not(.solution-particle-heading):not(.solution-particle-subtext)"
    )

    gsap.set(revealTargets, {
        opacity: 0,
        y: 28,
    })

    const sections = gsap.utils.toArray("section:not(.solution-particle-cta)")

    sections.forEach((sec) => {
        const targets = sec.querySelectorAll(
            ".reveal-up:not(.solution-particle-cta *):not(.solution-particle-heading):not(.solution-particle-subtext)"
        )
        if (!targets.length) return

        const revealUptimeline = gsap.timeline({
            scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                toggleActions: "play none none none",
            }
        })

        revealUptimeline.to(targets, {
            opacity: 1,
            duration: 0.8,
            y: 0,
            stagger: 0.15,
        })
    })
}

const shrinkingHero = document.querySelector(".solution-shrinking-hero")
const shrinkingHeroSpacer = document.querySelector(".solution-shrinking-hero-spacer")

function resolveHeroLength(value, fallback) {
    const probe = document.createElement("div")
    probe.style.height = value
    document.body.appendChild(probe)
    const resolved = probe.offsetHeight || fallback
    probe.remove()
    return resolved
}

function updateSolutionHero() {
    if (!shrinkingHero || !shrinkingHeroSpacer) return

    const maxHeight = resolveHeroLength("80vh", window.innerHeight * 0.8)
    const minHeight = resolveHeroLength("90px", 90)
    const rect = shrinkingHeroSpacer.getBoundingClientRect()
    const scrollRange = Math.max(1, shrinkingHeroSpacer.offsetHeight - minHeight)
    const progress = Math.min(Math.max(-rect.top / scrollRange, 0), 1)

    shrinkingHero.style.height = `${maxHeight - (maxHeight - minHeight) * progress}px`
}

updateSolutionHero()
window.addEventListener("scroll", updateSolutionHero, { passive: true })
window.addEventListener("resize", updateSolutionHero)


