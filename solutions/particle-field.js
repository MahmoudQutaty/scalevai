// Interactive dot field for solution page CTA sections: a resting grid of low-opacity dots that
// wake up into ScaleVAI brand colors and get pushed away from the cursor as it passes nearby.
// Self-contained: no-ops if the target canvas isn't on the page.
(function () {
    const canvases = document.querySelectorAll("#solution-particle-canvas, .solution-particle-canvas")
    if (!canvases.length) return

    canvases.forEach((canvas) => {

    const ctx = canvas.getContext("2d")

    const DOT_COUNT = 220
    const BASE_RADIUS = 1.4
    const ACTIVE_RADIUS = 2.6
    const INTERACTION_RADIUS = 130
    const BASE_OPACITY = 0.22
    const ACTIVE_OPACITY = 1
    const FRICTION = 0.95
    const REPULSION_STRENGTH = 2.2
    const TRANSITION_SPEED = 0.08 // how fast color/size/opacity ease toward their target

    // ScaleVAI brand palette
    const NAVY = { r: 0x1a, g: 0x2b, b: 0x4a }
    const GOLD = { r: 0xc9, g: 0x96, b: 0x3a }
    const WHITE = { r: 0xff, g: 0xff, b: 0xff }
    const LIGHT_GRAY = { r: 0xe8, g: 0xee, b: 0xf5 }
    const DARK_GRAY = { r: 0x4a, g: 0x4a, b: 0x4a }

    // resting (base) dot color + the "activated" brand colors it wakes up to, per theme
    const LIGHT_MODE = { base: DARK_GRAY, brand: [NAVY, GOLD] }
    const DARK_MODE = { base: LIGHT_GRAY, brand: [GOLD, WHITE] }

    function isDarkMode() {
        return document.documentElement.classList.contains("tw-dark")
    }

    function theme() {
        return isDarkMode() ? DARK_MODE : LIGHT_MODE
    }

    function pickBrand() {
        const brands = theme().brand
        return brands[Math.floor(Math.random() * brands.length)]
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min
    }

    function lerp(a, b, t) {
        return a + (b - a) * t
    }

    let width = 0
    let height = 0
    let dpr = 1
    let dots = []
    const mouse = { x: -9999, y: -9999, active: false }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2)

        const parent = canvas.parentElement
        const parentRect = parent ? parent.getBoundingClientRect() : null
        const parentWidth = parentRect ? parentRect.width : (canvas.clientWidth || window.innerWidth)
        const parentHeight = parentRect ? parentRect.height : (canvas.clientHeight || 600)

        width = Math.max(1, parentWidth || canvas.clientWidth || window.innerWidth)
        height = Math.max(1, parentHeight || canvas.clientHeight || 600)

        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function makeDot() {
        return {
            x: rand(0, width),
            y: rand(0, height),
            driftX: rand(-0.3, 0.3),
            driftY: rand(-0.3, 0.3),
            vx: 0,
            vy: 0,
            mix: 0, // 0 = resting base color, 1 = fully activated brand color
            targetMix: 0,
            brand: pickBrand(),
        }
    }

    function handlePointerMove(clientX, clientY) {
        const rect = canvas.getBoundingClientRect()
        mouse.x = clientX - rect.left
        mouse.y = clientY - rect.top
        mouse.active = true
    }

    window.addEventListener("mousemove", (e) => handlePointerMove(e.clientX, e.clientY))
    window.addEventListener("mouseleave", () => {
        mouse.active = false
    })
    window.addEventListener(
        "touchmove",
        (e) => {
            if (e.touches && e.touches[0]) {
                handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
            }
        },
        { passive: true }
    )
    window.addEventListener("touchend", () => {
        mouse.active = false
    })
    window.addEventListener("resize", resize)

    // repick brand colors if the visitor toggles light/dark mode
    new MutationObserver(() => {
        dots.forEach((d) => {
            d.brand = pickBrand()
        })
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    function tick() {
        ctx.clearRect(0, 0, width, height)
        const base = theme().base

        dots.forEach((d) => {
            const dx = d.x - mouse.x
            const dy = d.y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const inRange = mouse.active && dist < INTERACTION_RADIUS && dist > 0.001

            if (inRange) {
                // repulsion impulse, stronger the closer the cursor is
                const force = (1 - dist / INTERACTION_RADIUS) * REPULSION_STRENGTH
                d.vx += (dx / dist) * force
                d.vy += (dy / dist) * force

                if (d.mix < 0.05) d.brand = pickBrand()
                d.targetMix = 1
            } else {
                d.targetMix = 0
            }

            d.mix = lerp(d.mix, d.targetMix, TRANSITION_SPEED)

            d.vx *= FRICTION
            d.vy *= FRICTION

            d.x += d.driftX + d.vx
            d.y += d.driftY + d.vy

            if (d.x < -10) d.x = width + 10
            if (d.x > width + 10) d.x = -10
            if (d.y < -10) d.y = height + 10
            if (d.y > height + 10) d.y = -10

            const size = lerp(BASE_RADIUS, ACTIVE_RADIUS, d.mix)
            const opacity = lerp(BASE_OPACITY, ACTIVE_OPACITY, d.mix)
            const r = Math.round(lerp(base.r, d.brand.r, d.mix))
            const g = Math.round(lerp(base.g, d.brand.g, d.mix))
            const b = Math.round(lerp(base.b, d.brand.b, d.mix))

            ctx.beginPath()
            ctx.fillStyle = `rgba(${r},${g},${b},${opacity.toFixed(3)})`
            ctx.arc(d.x, d.y, size, 0, Math.PI * 2)
            ctx.fill()
        })

        requestAnimationFrame(tick)
    }

    resize()
    dots = Array.from({ length: DOT_COUNT }, makeDot)
    requestAnimationFrame(tick)
    })
})()
