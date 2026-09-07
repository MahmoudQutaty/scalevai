// initialization

const RESPONSIVE_WIDTH = 1024

let headerWhiteBg = false
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
        // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
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
    if (!isHeaderCollapsed){
        toggleHeader()
    }

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
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 40)
}
handleHeaderScroll()
window.addEventListener("scroll", handleHeaderScroll, { passive: true })

const shrinkingHero = document.querySelector(".homepage-shrinking-hero")
const shrinkingHeroSpacer = document.querySelector(".homepage-hero-spacer")

function resolveHeroLength(value, fallback) {
    const probe = document.createElement("div")
    probe.style.height = value
    document.body.appendChild(probe)
    const resolved = probe.offsetHeight || fallback
    probe.remove()
    return resolved
}

function updateHomepageHero() {
    if (!shrinkingHero || !shrinkingHeroSpacer) return

    const maxHeight = resolveHeroLength("100svh", window.innerHeight)
    const minHeight = resolveHeroLength("90px", 90)
    const rect = shrinkingHeroSpacer.getBoundingClientRect()
    const scrollRange = Math.max(180, window.innerHeight * 0.7)
    const progress = Math.min(Math.max((-rect.top) / scrollRange, 0), 1)
    const easedProgress = 1 - Math.pow(1 - progress, 2)

    shrinkingHero.style.height = `${maxHeight - (maxHeight - minHeight) * easedProgress}px`
    const heroText = shrinkingHero.querySelector("h2")
    if (heroText) heroText.style.opacity = `${Math.max(0, 1 - easedProgress * 1.3)}`
}

updateHomepageHero()
window.addEventListener("scroll", updateHomepageHero, { passive: true })
window.addEventListener("resize", updateHomepageHero)

/** Dark and light theme */
if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark')
    updateToggleModeBtn()
} else {
    document.documentElement.classList.remove('tw-dark')
    updateToggleModeBtn()
}

function toggleMode(){
    //toggle between dark and light mode
    document.documentElement.classList.toggle("tw-dark")
    updateToggleModeBtn()
    
}

function updateToggleModeBtn(){

    const toggleIcon = document.querySelector("#toggle-mode-icon")
    const isDark = document.documentElement.classList.contains("tw-dark")

    // the compiled stylesheet has no dark: variants for hidden/block, so toggle logos manually
    document.querySelectorAll(".logo-light").forEach(img => img.classList.toggle("tw-hidden", isDark))
    document.querySelectorAll(".logo-dark").forEach(img => img.classList.toggle("tw-hidden", !isDark))

    if (isDark){
        // dark mode
        toggleIcon.classList.remove("bi-sun")
        toggleIcon.classList.add("bi-moon")
        localStorage.setItem("color-mode", "dark")
        
    }else{
        toggleIcon.classList.add("bi-sun")
        toggleIcon.classList.remove("bi-moon")
        localStorage.setItem("color-mode", "light")
    }

}


if (!window.sharedDropdownMenus) {
    navToggle.addEventListener("click", toggleNavDropdown)
    navDropdown.addEventListener("mouseleave", closeNavDropdown)
}

function toggleNavDropdown(){

    if (navDropdown.getAttribute("data-open") === "true"){
        closeNavDropdown()
    }else{
        openNavDropdown()
    }
}

function navMouseLeave(){
    setTimeout(closeNavDropdown, 100)
}

function openNavDropdown(event){

    navDropdown.classList.add("tw-opacity-100", "tw-scale-100", 
                            "max-lg:tw-min-h-[450px]", "max-lg:!tw-h-fit", "tw-min-w-[320px]")
    
    navDropdown.setAttribute("data-open", true)

}

function closeNavDropdown(event){

    // console.log("event target: ", event.target, event.target.contains(navDropdown))
    
    if (navDropdown.matches(":hover")){
        return
    }

    navDropdown.classList.remove("tw-opacity-100", "tw-scale-100", 
        "max-lg:tw-min-h-[450px]", "tw-min-w-[320px]", "max-lg:!tw-h-fit",)

    navDropdown.setAttribute("data-open", false)

}


/**
 * Animations
 */

const typed = new Typed('#prompts-sample', {
    strings: ["Workforce Intelligence.",
                "Immersive Showroom.",
                "Talent Intelligence.",
                "AI Workflow Automation."],
    typeSpeed: 80,
    smartBackspace: true, 
    loop: true,
    backDelay: 2000,
})

// VAI chat widget logic lives in ./vai-widget.js (shared across every page)

gsap.registerPlugin(ScrollTrigger)


gsap.to(".reveal-up", {
    opacity: 0,
    y: "100%",
})


const faqAccordion = document.querySelectorAll('.faq-accordion')

faqAccordion.forEach(function (btn) {
    btn.addEventListener('click', function () {
        this.classList.toggle('active')

        // Toggle 'rotate' class to rotate the arrow
        let content = this.nextElementSibling
        let icon = this.querySelector(".bi-plus")

        // content.classList.toggle('!tw-hidden')
        if (content.style.maxHeight === '240px') {
            content.style.maxHeight = '0px'
            content.style.padding = '0px 18px'
            icon.style.transform = "rotate(0deg)"
            
        } else {
            content.style.maxHeight = '240px'
            content.style.padding = '20px 18px'
            icon.style.transform = "rotate(45deg)"
        }
    })
})



// ------------- reveal section animations ---------------

const sections = gsap.utils.toArray("section")

sections.forEach((sec) => {

    const revealUptimeline = gsap.timeline({paused: true, 
                                            scrollTrigger: {
                                                            trigger: sec,
                                                            start: "10% 80%", // top of trigger hits the top of viewport
                                                            end: "20% 90%",
                                                            // markers: true,
                                                            // scrub: 1,
                                                        }})

    revealUptimeline.to(sec.querySelectorAll(".reveal-up"), {
        opacity: 1,
        duration: 0.8,
        y: "0%",
        stagger: 0.2,
    })


})
