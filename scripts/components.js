

class Dropdown {
    constructor(selector, onChange) {
        this.dropdown = document.querySelector(selector)
        this.toggleButton = this.dropdown.querySelector('.dropdown-toggle')
        this.onChange = onChange

        this.defaultText = this.toggleButton.querySelector("span").innerText

        this.menu = this.dropdown.querySelector('.dropdown-menu')
        
        this.selectItem = this.selectItem.bind(this)
        this.toggleButton.addEventListener('click', this.toggleDropdown.bind(this))
        document.addEventListener('click', this.closeDropdown.bind(this))

        this.lists = this.dropdown.querySelectorAll('li')
        this.lists.forEach(e => {
            e.addEventListener("click", () => this.selectItem(e))}
        )

        this.value = ""

        this.dropDownInput = this.dropdown.querySelector(".dropdown-input")

    }
  
    toggleDropdown() {
        this.menu.style.display = (this.menu.style.display === 'block') ? 'none' : 'block'
    }

    selectItem(ele){

        const selectedInput = this.toggleButton.querySelector(".dropdown-select-text")
        const selectIcon =  this.toggleButton.querySelector(".dropdown-select-icon")

        this.value = ele.querySelector(".dropdown-text").innerText.trim()

        if (selectIcon && ele.querySelector(".dropdown-menu-icon")){
            selectIcon.style.visibility = ""
            selectIcon.setAttribute("src", ele.querySelector(".dropdown-menu-icon").src)
            selectIcon.setAttribute("alt", ele.innerText)
        }else{
            selectIcon.style.visibility = "hidden"
        }

        selectedInput.innerText = ele.querySelector(".dropdown-text").innerText.trim()
        
        if(this.dropDownInput)
            this.dropDownInput.value = this.value

        if (this.onChange){
            this.onChange(this.value)
        }

        this.closeDropdown()

    }

    closeDropdown(event) {
        if (event === undefined || !this.dropdown.contains(event.target)) {
            this.menu.style.display = 'none'
        }
        document.removeEventListener('click', this.closeDropdown.bind(this))
    }
}


class Prompt{

    constructor(target){
        this.playground = document.querySelector(target)

        this.promptWindow = this.playground.querySelector(".prompt-container")
        
        this.chatModel = "gpt 4o"

        this.promptList = []

        this.answer = this.answer.bind(this)
        this.addPrompt = this.addPrompt.bind(this)
        this.setAIModel = this.setAIModel.bind(this)

    }

    setAIModel(model){
        // console.log("model: ", model)
        this.chatModel = model.toLowerCase()
    }

    addPrompt(msg){

        if (this.promptList.length === 0)
            this.promptWindow.innerHTML = ""

        this.promptList.push(msg)

        const text = document.createElement("div")

        text.classList.add("tw-w-fit", "tw-ml-auto", "tw-p-2.5", "tw-px-3.5", "tw-rounded-xl", 
                            "tw-bg-[#6366f1]", "tw-text-white", "tw-text-sm", "tw-shadow-sm")
        text.innerText = msg

        const promptELement = `
            <div class="tw-w-full tw-flex tw-p-1">
                ${text.outerHTML.toString()}
            </div>
        `

        this.promptWindow.innerHTML += promptELement

        setTimeout(() => {
            this.promptWindow.scrollTop = this.promptWindow.scrollHeight
        }, 150)

        setTimeout(this.answer, 100)
    }

    answer(){

        let msg = {
            "gpt 4o": "Hello from Gpt 4o, add 3 prompts",
            "gemini": "Hello from Gemini, add 3 prompts",
            "llama 3": "Hello from Meta Llama 3, add 3 prompts",
            "claude": "Hello from Claude, add 3 prompts",
        }[this.chatModel]

        const text = document.createElement("div")
        text.classList.add("vai-chat-bubble-ai", "tw-w-fit", "tw-mr-auto", "tw-p-2.5", "tw-px-3.5", "tw-rounded-xl",
                           "tw-bg-gray-100", "dark:tw-bg-[#1c1f26]", "tw-border", "tw-border-gray-200/90", "dark:tw-border-[#2c303b]", "tw-text-gray-900", "dark:tw-text-gray-100", "tw-text-sm", "tw-shadow-sm")
        text.innerText = msg

        const promptELement = `
            <div class="tw-w-full tw-flex tw-p-1">
                ${text.outerHTML.toString()}
            </div>
        `
        this.promptWindow.innerHTML += promptELement

    }

}

/** Shared header, footer, and VAI launcher markup for every ScaleVAI page. */
(function mountSharedSiteChrome() {
    const isSubdir = window.location.pathname.includes('/solutions/') || window.location.pathname.includes('/industries/')
    const assetRoot = isSubdir ? '../' : './'
    const logoPath = `${assetRoot}assets/logo/`

    if (isSubdir) {
        document.body.classList.add('solution-page')
    }

    const header = document.querySelector('#site-header')
    if (header) {
        const industries = [
            { title: 'Real Estate & Development', icon: 'bi-building', description: 'Smart buildings, automated leasing operations, and 3D conversions.', href: `${assetRoot}industries/real-estate.html` },
            { title: 'Healthcare & Life Sciences', icon: 'bi-heart-pulse', description: 'Prevent claim denials, accelerate collections, and automate RCM.', href: `${assetRoot}industries/healthcare.html` },
            { title: 'Manufacturing & Logistics', icon: 'bi-gear-fill', description: 'Computer vision floor safety, shift reconciliation, and inventory tracking.', href: `${assetRoot}industries/manufacturing-logistics.html` },
            { title: 'Hospitality & Luxury Venues', icon: 'bi-cup-hot-fill', description: 'Direct 3D suite reservations and 24/7 multilingual guest AI.', href: `${assetRoot}industries/hospitality.html` },
            { title: 'Retail & Store Operations', icon: 'bi-shop', description: 'Shrinkage prevention, inventory stock-outs, and planogram grading.', href: `${assetRoot}industries/retail.html` },
            { title: 'Financial Services & Banking', icon: 'bi-bank', description: 'Automated KYC extraction, 3-way invoice matching, and compliance audits.', href: `${assetRoot}industries/financial-services.html` },
        ]

        const solutions = [
            { title: 'Workforce Intelligence', icon: 'bi-person-check', description: 'Ground-truth presence verification for every floor and entrance.', href: `${assetRoot}solutions/workforce-intelligence.html` },
            { title: 'Immersive Showroom', icon: 'bi-badge-vr', description: 'Interactive 3D experiences that help remote buyers decide faster.', href: `${assetRoot}solutions/immersive-showroom.html` },
            { title: 'Talent Intelligence', icon: 'bi-people', description: 'AI-powered screening for faster, more focused hiring.', href: `${assetRoot}solutions/talent-intelligence.html` },
            { title: 'Revenue Cycle', icon: 'bi-graph-up-arrow', description: 'Smarter healthcare operations with fewer preventable denials.', href: `${assetRoot}solutions/revenue-cycle.html` },
            { title: 'People Assistant', icon: 'bi-chat-dots-fill', description: 'Fast answers for payroll, leave, and enterprise policy questions.', href: `${assetRoot}solutions/people-assistant.html` },
            { title: 'AI Workflow Automation', icon: 'bi-diagram-3-fill', description: 'Reliable agentic automation for high-volume operational work.', href: `${assetRoot}solutions/ai-workflow-automation.html` },
            { title: 'Retail Intelligence', icon: 'bi-boxes', description: 'Real-time inventory shrinkage and planogram compliance monitoring.', href: `${assetRoot}solutions/retail-intelligence.html` },
            { title: 'Audience Intelligence', icon: 'bi-display', description: 'Edge AI dynamic content targeting for digital display networks.', href: `${assetRoot}solutions/audience-intelligence.html` },
            { title: 'Business Efficiency', icon: 'bi-briefcase', description: 'Ongoing advisory identifying process improvements for compounding value.', href: `${assetRoot}solutions/business-efficiency-consulting.html` },
            { title: 'Virtual Experience', icon: 'bi-compass', description: 'Browser-based 3D virtual tours for luxury hospitality and venues.', href: `${assetRoot}solutions/virtual-experience.html` },
        ]

        const desktopMegaMenu = (id, label, items, viewAllHref, viewAllLabel, badgeLabel, badgeIcon) => `
            <div class="nav-dropdown-wrapper tw-relative tw-flex tw-items-center" data-menu-id="${id}">
                <div class="tw-flex tw-items-center tw-gap-1">
                    <a href="${viewAllHref}" class="header-links tw-flex tw-items-center tw-gap-1.5 hover:tw-text-[#6366f1] tw-transition-colors tw-font-semibold tw-text-sm sm:tw-text-base tw-py-1.5 tw-px-2 tw-rounded-lg hover:tw-bg-black/5 dark:hover:tw-bg-white/5" aria-label="${label}">
                        <span>${label}</span>
                        <i class="bi bi-chevron-down tw-text-[11px] tw-text-gray-400 dark:tw-text-gray-500 tw-transition-transform tw-duration-200"></i>
                    </a>
                </div>
                <nav id="nav-dropdown-list-${id}" data-open="false" class="mega-menu-panel tw-w-[95vw] lg:tw-max-w-[1040px] tw-rounded-2xl tw-max-h-[calc(88vh-75px)] tw-overflow-y-auto tw-bg-white/98 dark:tw-bg-[#14161a]/98 tw-backdrop-blur-md tw-border tw-border-gray-200/90 dark:tw-border-[#272a32] tw-shadow-2xl tw-p-5 lg:tw-p-6">
                    <div class="tw-flex tw-flex-col tw-w-full">
                        <div class="tw-flex tw-items-center tw-justify-between tw-pb-3.5 tw-border-b tw-border-gray-100 dark:tw-border-[#252830]">
                            <div class="tw-flex tw-items-center tw-gap-2.5">
                                <span class="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-2.5 tw-py-1 tw-rounded-md tw-text-xs tw-font-semibold tw-bg-[#6366f1]/10 tw-text-[#6366f1]">
                                    <i class="bi ${badgeIcon}"></i>
                                    ${badgeLabel}
                                </span>
                                <span class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
                                    ${items.length} ${label} Available
                                </span>
                            </div>
                            <a href="${viewAllHref}" class="tw-inline-flex tw-items-center tw-gap-1.5 tw-text-xs tw-font-semibold tw-text-[#6366f1] hover:tw-underline">
                                <span>${viewAllLabel}</span>
                                <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-2.5 tw-pt-3.5">
                            ${items.map(item => `
                            <a class="tw-group tw-flex tw-items-start tw-gap-3 tw-p-2.5 tw-rounded-xl tw-border tw-border-transparent hover:tw-border-gray-200 dark:hover:tw-border-[#282b33] hover:tw-bg-gray-50 dark:hover:tw-bg-[#1a1c22] tw-transition-all" href="${item.href}">
                                <div class="tw-w-9 tw-h-9 tw-min-w-[36px] tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-bg-[#6366f1]/10 tw-text-[#6366f1] group-hover:tw-bg-[#6366f1] group-hover:tw-text-white tw-transition-colors tw-text-base">
                                    <i class="bi ${item.icon}"></i>
                                </div>
                                <div class="tw-flex tw-flex-col tw-min-w-0 tw-flex-1">
                                    <div class="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white group-hover:tw-text-[#6366f1] tw-transition-colors tw-flex tw-items-center tw-justify-between">
                                        <span class="tw-truncate">${item.title}</span>
                                        <i class="bi bi-chevron-right tw-text-[11px] tw-text-gray-400 tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-shrink-0 tw-ml-1"></i>
                                    </div>
                                    <p class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-line-clamp-1 tw-mt-0.5 tw-leading-tight">${item.description}</p>
                                </div>
                            </a>
                            `).join('')}
                        </div>
                        <div class="tw-mt-3.5 tw-pt-3 tw-border-t tw-border-gray-100 dark:tw-border-[#252830] tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
                            <span>${id === 1 ? 'Production-grade enterprise deployments across UAE &amp; GCC' : 'Custom architectural blueprints engineered for regional operations'}</span>
                            <a href="${viewAllHref}" class="tw-font-semibold tw-text-[#6366f1] hover:tw-underline tw-inline-flex tw-items-center tw-gap-1">
                                <span>${viewAllLabel}</span>
                                <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>`

        const desktopClassicMenu = (id, label, items, viewAllHref) => `
            <div class="nav-dropdown-wrapper tw-relative tw-flex tw-flex-col tw-items-center" data-menu-id="${id}">
                <a href="${viewAllHref}" class="header-links tw-flex tw-items-center tw-gap-1">
                    <span>${label}</span>
                    <i class="bi bi-chevron-down tw-text-sm"></i>
                </a>
                <nav id="nav-dropdown-list-${id}" data-open="false" class="classic-menu-panel">
                    <div class="classic-menu-grid">
                        ${items.map(item => `
                            <a class="classic-menu-item" href="${item.href}">
                                <i class="bi ${item.icon}"></i>
                                <span>
                                    <strong>${item.title}</strong>
                                    <small>${item.description}</small>
                                </span>
                            </a>
                        `).join('')}
                    </div>
                    <a class="classic-menu-directory" href="${viewAllHref}">View all ${label.toLowerCase()} <i class="bi bi-arrow-right"></i></a>
                </nav>
            </div>`

        header.outerHTML = `
            <header id="site-header" class="site-header lg:tw-px-4 tw-max-w-[100vw] max-lg:tw-top-0 tw-fixed tw-top-0 lg:tw-left-1/2 lg:tw--translate-x-1/2 tw-z-20 tw-flex tw-h-[60px] tw-w-full tw-px-[3%] lg:tw-justify-around">
                <a class="tw-flex tw-p-[4px] tw-gap-2 tw-place-items-center" href="${assetRoot}index.html" aria-label="ScaleVAI home">
                    <div class="tw-h-[30px]">
                        <img src="${logoPath}scalevai-logo-light-trim.png" alt="ScaleVAI logo" class="logo-light tw-hidden tw-object-contain tw-h-full tw-w-auto" />
                        <img src="${logoPath}scalevai-logo-dark-trim.png" alt="ScaleVAI logo" class="logo-dark tw-object-contain tw-h-full tw-w-auto" />
                    </div>
                </a>
                <div class="collapsible-header animated-collapse max-lg:tw-shadow-md" id="collapsed-header-items">
                    <!-- Desktop Navigation Bar -->
                    <nav class="site-primary-nav tw-relative tw-hidden tw-h-full tw-w-max tw-gap-5 tw-text-base lg:tw-mx-auto tw-place-items-center">
                        ${desktopClassicMenu(1, 'Solutions', solutions, `${assetRoot}solutions.html`)}
                        <a class="header-links" href="${assetRoot}index.html#about">About us</a>
                        ${desktopClassicMenu(0, 'Industries', industries, `${assetRoot}industries.html`)}
                        <a class="header-links" href="${assetRoot}contact.html">Contact us</a>
                    </nav>

                    <!-- Mobile Navigation Accordion (< 1024px) -->
                    <div class="lg:tw-hidden tw-w-full tw-max-w-md tw-flex tw-flex-col tw-gap-2.5 tw-pt-6 tw-pb-4 tw-px-2">
                        <!-- Mobile Solutions Accordion -->
                        <div class="tw-w-full tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-[#272a31] tw-bg-white dark:tw-bg-[#15171c] tw-overflow-hidden">
                            <div class="tw-flex tw-items-center tw-justify-between tw-p-3">
                                <a href="${assetRoot}solutions.html" class="tw-text-base tw-font-semibold tw-text-black dark:tw-text-white hover:tw-text-[#6366f1] tw-flex tw-items-center tw-gap-2">
                                    <span>Solutions</span>
                                    <span class="tw-text-xs tw-font-semibold tw-text-[#6366f1] tw-bg-[#6366f1]/10 tw-px-2 tw-py-0.5 tw-rounded-full">${solutions.length}</span>
                                </a>
                                <button type="button" class="mobile-sub-toggle tw-p-2 tw-text-gray-500 hover:tw-text-black dark:hover:tw-text-white tw-rounded-lg" data-target="mobile-solutions-drawer" aria-label="Toggle solutions list">
                                    <i class="bi bi-chevron-down tw-transition-transform tw-duration-200"></i>
                                </button>
                            </div>
                            <div id="mobile-solutions-drawer" class="tw-hidden tw-flex-col tw-border-t tw-border-gray-100 dark:tw-border-[#252830] tw-bg-gray-50/70 dark:tw-bg-[#121316] tw-p-2 tw-max-h-[280px] tw-overflow-y-auto">
                                <a href="${assetRoot}solutions.html" class="tw-flex tw-items-center tw-justify-between tw-p-2 tw-rounded-lg tw-text-xs tw-font-semibold tw-text-[#6366f1] hover:tw-bg-[#6366f1]/10 tw-mb-1">
                                    <span>Browse Full Solutions Directory</span>
                                    <i class="bi bi-arrow-right"></i>
                                </a>
                                ${solutions.map(s => `
                                <a href="${s.href}" class="tw-flex tw-items-center tw-gap-2.5 tw-p-2 tw-rounded-lg hover:tw-bg-gray-100 dark:hover:tw-bg-[#1d1f26] tw-text-xs tw-text-gray-800 dark:tw-text-gray-200">
                                    <i class="bi ${s.icon} tw-text-[#6366f1] tw-text-sm"></i>
                                    <span class="tw-truncate tw-font-medium">${s.title}</span>
                                </a>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Mobile Industries Accordion -->
                        <div class="tw-w-full tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-[#272a31] tw-bg-white dark:tw-bg-[#15171c] tw-overflow-hidden">
                            <div class="tw-flex tw-items-center tw-justify-between tw-p-3">
                                <a href="${assetRoot}industries.html" class="tw-text-base tw-font-semibold tw-text-black dark:tw-text-white hover:tw-text-[#6366f1] tw-flex tw-items-center tw-gap-2">
                                    <span>Industries</span>
                                    <span class="tw-text-xs tw-font-semibold tw-text-[#c9963a] tw-bg-[#c9963a]/10 tw-px-2 tw-py-0.5 tw-rounded-full">${industries.length}</span>
                                </a>
                                <button type="button" class="mobile-sub-toggle tw-p-2 tw-text-gray-500 hover:tw-text-black dark:hover:tw-text-white tw-rounded-lg" data-target="mobile-industries-drawer" aria-label="Toggle industries list">
                                    <i class="bi bi-chevron-down tw-transition-transform tw-duration-200"></i>
                                </button>
                            </div>
                            <div id="mobile-industries-drawer" class="tw-hidden tw-flex-col tw-border-t tw-border-gray-100 dark:tw-border-[#252830] tw-bg-gray-50/70 dark:tw-bg-[#121316] tw-p-2 tw-max-h-[280px] tw-overflow-y-auto">
                                <a href="${assetRoot}industries.html" class="tw-flex tw-items-center tw-justify-between tw-p-2 tw-rounded-lg tw-text-xs tw-font-semibold tw-text-[#6366f1] hover:tw-bg-[#6366f1]/10 tw-mb-1">
                                    <span>Browse All Industry Blueprints</span>
                                    <i class="bi bi-arrow-right"></i>
                                </a>
                                ${industries.map(ind => `
                                <a href="${ind.href}" class="tw-flex tw-items-center tw-gap-2.5 tw-p-2 tw-rounded-lg hover:tw-bg-gray-100 dark:hover:tw-bg-[#1d1f26] tw-text-xs tw-text-gray-800 dark:tw-text-gray-200">
                                    <i class="bi ${ind.icon} tw-text-[#c9963a] tw-text-sm"></i>
                                    <span class="tw-truncate tw-font-medium">${ind.title}</span>
                                </a>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Mobile About & Contact Links -->
                        <a href="${assetRoot}index.html#about" class="tw-p-2.5 tw-text-base tw-font-semibold tw-text-black dark:tw-text-white hover:tw-text-[#6366f1] tw-text-center tw-rounded-lg hover:tw-bg-gray-100 dark:hover:tw-bg-[#1d1f26]">About us</a>
                        <a href="${assetRoot}contact.html" class="tw-p-2.5 tw-text-base tw-font-semibold tw-text-black dark:tw-text-white hover:tw-text-[#6366f1] tw-text-center tw-rounded-lg hover:tw-bg-gray-100 dark:hover:tw-bg-[#1d1f26]">Contact us</a>
                    </div>

                    <div class="lg:tw-mx-4 tw-flex tw-place-items-center tw-gap-[20px] tw-text-base max-md:tw-w-full max-md:tw-flex-col max-md:tw-place-content-center">
                        <button type="button" onclick="toggleMode()" class="header-links tw-text-gray-600 dark:tw-text-gray-300" title="Toggle theme" id="theme-toggle"><i class="bi bi-sun" id="toggle-mode-icon"></i></button>
                        <a href="${assetRoot}contact.html" aria-label="Book a discovery call" class="btn tw-flex tw-gap-3 tw-px-3 tw-py-2"><span>Book a call</span><i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
                <button class="bi bi-list tw-absolute tw-right-3 tw-top-3 tw-z-50 tw-text-3xl tw-text-gray-500 lg:tw-hidden" onclick="toggleHeader()" aria-label="menu" id="collapse-btn"></button>
            </header>`

        window.sharedDropdownMenus = true

        // Desktop Mega Menu Logic
        const navDropdownWrappers = Array.from(document.querySelectorAll('.nav-dropdown-wrapper'))
        const dropdownItems = navDropdownWrappers.map(wrapper => {
            const id = wrapper.getAttribute('data-menu-id')
            return {
                wrapper,
                toggle: wrapper.querySelector(`#nav-dropdown-toggle-${id}`),
                menu: wrapper.querySelector(`#nav-dropdown-list-${id}`),
            }
        })

        const closeAllDesktopMenus = (except) => {
            dropdownItems.forEach(({ menu, toggle }) => {
                if (menu && menu !== except) {
                    menu.classList.remove('menu-open')
                    menu.setAttribute('data-open', 'false')
                    if (toggle) toggle.setAttribute('aria-expanded', 'false')
                }
            })
        }

        dropdownItems.forEach(({ wrapper, toggle, menu }) => {
            if (!menu || !wrapper) return
            let closeTimeout = null

            const openMenu = () => {
                if (closeTimeout) clearTimeout(closeTimeout)
                closeAllDesktopMenus(menu)
                menu.classList.add('menu-open')
                menu.setAttribute('data-open', 'true')
                if (toggle) toggle.setAttribute('aria-expanded', 'true')
            }

            const scheduleClose = () => {
                closeTimeout = setTimeout(() => {
                    if (!wrapper.matches(':hover') && !menu.matches(':hover')) {
                        menu.classList.remove('menu-open')
                        menu.setAttribute('data-open', 'false')
                        if (toggle) toggle.setAttribute('aria-expanded', 'false')
                    }
                }, 160)
            }

            // Desktop hover
            wrapper.addEventListener('mouseenter', openMenu)
            wrapper.addEventListener('mouseleave', scheduleClose)
            menu.addEventListener('mouseenter', () => { if (closeTimeout) clearTimeout(closeTimeout) })
            menu.addEventListener('mouseleave', scheduleClose)

            // Caret toggle click
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation()
                    const isOpen = menu.getAttribute('data-open') === 'true'
                    isOpen ? closeAllDesktopMenus() : openMenu()
                })
            }
        })

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-dropdown-wrapper')) {
                closeAllDesktopMenus()
            }
        })

        // Mobile Accordion Drawer Toggle Logic
        const mobileToggles = Array.from(document.querySelectorAll('.mobile-sub-toggle'))
        mobileToggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation()
                const targetId = btn.getAttribute('data-target')
                const targetEl = document.getElementById(targetId)
                const icon = btn.querySelector('i')
                if (!targetEl) return

                const isHidden = targetEl.classList.contains('tw-hidden')
                if (isHidden) {
                    targetEl.classList.remove('tw-hidden')
                    targetEl.classList.add('tw-flex')
                    if (icon) icon.style.transform = 'rotate(180deg)'
                } else {
                    targetEl.classList.add('tw-hidden')
                    targetEl.classList.remove('tw-flex')
                    if (icon) icon.style.transform = 'rotate(0deg)'
                }
            })
        })
    }

    const footer = document.querySelector('footer')
    if (footer) {
        footer.outerHTML = `
            <footer class="tw-mt-auto tw-flex tw-flex-col tw-w-full tw-gap-4 tw-text-sm tw-pt-[5%] tw-pb-10 tw-px-[10%] tw-text-black dark:tw-text-white tw-bg-[#f4f6fb] dark:tw-bg-[#0c1017] tw-border-t tw-border-gray-200 dark:tw-border-[#1a2233]">
                <div class="tw-flex max-md:tw-flex-col max-md:tw-gap-6 tw-gap-3 tw-w-full tw-place-content-around">
                    <div class="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-place-items-center tw-gap-6 max-md:tw-w-full">
                        <a href="${assetRoot}index.html" class="tw-w-full tw-place-items-center tw-flex tw-flex-col tw-gap-6"><img src="${logoPath}scalevai-logo-light-trim.png" alt="ScaleVAI logo" class="logo-light tw-hidden tw-h-[50px] tw-w-auto" /><img src="${logoPath}scalevai-logo-dark-trim.png" alt="ScaleVAI logo" class="logo-dark tw-h-[50px] tw-w-auto" /></a>
                        <div class="tw-flex tw-gap-4 tw-text-lg"><a href="https://x.com/" aria-label="Twitter"><i class="bi bi-twitter"></i></a><a href="https://www.linkedin.com/" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a></div>
                    </div>
                    <div class="tw-flex max-md:tw-flex-col tw-flex-wrap tw-gap-6 tw-h-full tw-w-full tw-justify-around">
                        <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4"><h2 class="tw-text-xl">Solutions</h2><div class="tw-flex tw-flex-col tw-gap-3"><a href="${assetRoot}solutions/workforce-intelligence.html" class="footer-link">Workforce Intelligence</a><a href="${assetRoot}solutions/immersive-showroom.html" class="footer-link">Immersive Showroom</a><a href="${assetRoot}solutions/talent-intelligence.html" class="footer-link">Talent Intelligence</a><a href="${assetRoot}solutions/revenue-cycle.html" class="footer-link">Revenue Cycle</a><a href="${assetRoot}solutions/business-efficiency-consulting.html" class="footer-link">Business Efficiency</a><a href="${assetRoot}solutions.html" class="footer-link tw-font-medium tw-text-[#6366f1] dark:tw-text-[#818cf8]">All solutions &rarr;</a></div></div>
                        <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4"><h2 class="tw-text-xl">Company</h2><div class="tw-flex tw-flex-col tw-gap-3"><a href="${assetRoot}index.html#about" class="footer-link">About us</a><a href="${assetRoot}contact.html" class="footer-link">Contact us</a></div></div>
                        <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4"><h2 class="tw-text-xl">Industries</h2><div class="tw-flex tw-flex-col tw-gap-3"><a href="${assetRoot}industries/real-estate.html" class="footer-link">Real Estate</a><a href="${assetRoot}industries/healthcare.html" class="footer-link">Healthcare</a><a href="${assetRoot}industries/manufacturing-logistics.html" class="footer-link">Manufacturing &amp; Logistics</a><a href="${assetRoot}industries/hospitality.html" class="footer-link">Hospitality</a><a href="${assetRoot}industries/retail.html" class="footer-link">Retail</a><a href="${assetRoot}industries/financial-services.html" class="footer-link">Financial Services</a><a href="${assetRoot}industries.html" class="footer-link tw-font-medium tw-text-[#6366f1] dark:tw-text-[#818cf8]">All industries &rarr;</a></div></div>
                    </div>
                </div>
                <hr class="tw-mt-8"><div class="tw-mt-2 tw-flex tw-gap-2 tw-flex-col tw-text-gray-700 dark:tw-text-gray-300 tw-place-items-center tw-text-[12px] tw-w-full tw-text-center"><span>Dubai, UAE &middot; scale@scalevai.com</span><span>Copyright &#169; 2026 ScaleVAI. All rights reserved.</span></div>
            </footer>`
    }

    const launcher = document.querySelector('.vai-launcher')
    if (launcher) {
        launcher.outerHTML = `
            <div class="vai-launcher" style="bottom:28px;right:28px;z-index:9999"><div class="vai-tooltip">Chat with VAI</div><div class="vai-ring"><button type="button" onclick="toggleVaiWidget()" id="vai-launcher" class="vai-btn" aria-label="Chat with VAI"><span class="vai-icon-wrap"><svg viewBox="0 0 26 30" aria-hidden="true"><defs><linearGradient id="vaiChevronGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c9963a"/><stop offset="100%" stop-color="#30a9d8"/></linearGradient></defs><path class="vai-chevron" d="M7 4 L19 15 L7 26"/></svg><span class="vai-status-dot"></span></span><span class="vai-wordmark">AI</span></button></div></div>`
    }

    // Keep legacy anchors from sending visitors back to homepage sections.
    document.querySelectorAll('a[href$="#solutions"], a[href$="#industries"]').forEach(link => {
        const target = link.getAttribute('href')
        const page = target.endsWith('#solutions') ? 'solutions.html' : 'industries.html'
        link.setAttribute('href', `${assetRoot}${page}`)
    })

    // Ensure any "Book a discovery call" / hero primary action button receives the dedicated discovery call styling
    document.querySelectorAll('a, button').forEach(el => {
        const text = (el.textContent || '').trim().toLowerCase()
        const aria = (el.getAttribute('aria-label') || '').toLowerCase()
        if (text.includes('discovery call') || aria.includes('discovery call') || text.includes('industry consultation') || (text.includes('book a call') && !text.includes('saba') && el.closest('.hero-section, .catalog-hero, .solution-shrinking-hero'))) {
            el.classList.add('btn-discovery-call')
            el.setAttribute('data-discovery-btn', 'true')
        }
    })

    // Ensure secondary hero action button has clear button shape outline and buttons are aligned
    document.querySelectorAll('.catalog-hero, .hero-section, .solution-shrinking-hero').forEach(hero => {
        const btnContainers = hero.querySelectorAll('.tw-flex.tw-gap-4, .tw-flex.tw-flex-wrap')
        btnContainers.forEach(container => {
            container.classList.add('tw-items-center')
        })
        hero.querySelectorAll('a[href^="#"]').forEach(secondaryBtn => {
            secondaryBtn.classList.add('btn-hero-outline')
        })
    })

    // Ensure initial greeting message inside #chat-messages is styled as an AI chat box
    document.querySelectorAll('#chat-messages .tw-mr-auto').forEach(el => {
        el.classList.add('vai-chat-bubble-ai')
    })

    // Ensure all FAQ section titles are capitalized
    document.querySelectorAll('h1, h2, h3, h4').forEach(h => {
        const text = (h.textContent || '').trim()
        if (/^faq$/i.test(text)) {
            h.textContent = 'FAQ'
            h.classList.add('faq-title')
        } else if (/\bfaq\b/i.test(text)) {
            h.innerHTML = h.innerHTML.replace(/\bFaq\b/g, 'FAQ').replace(/\bfaq\b/g, 'FAQ')
            h.classList.add('faq-title')
        }
    })

    // Ensure all question boxes have rounded corners class
    document.querySelectorAll('.faq').forEach(faq => {
        faq.classList.add('tw-rounded-xl', 'tw-overflow-hidden')
    })

    const calendlyScript = document.createElement('script')
    calendlyScript.src = `${assetRoot}scripts/calendly.js`
    calendlyScript.defer = true
    document.body.appendChild(calendlyScript)
})()