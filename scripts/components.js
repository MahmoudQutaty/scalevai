

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

        text.classList.add("tw-w-fit", "tw-ml-auto", "tw-p-2", "tw-rounded-xl", 
                            "tw-bg-gray-100", "dark:tw-bg-[#171717]")
        text.innerText = msg

        const promptELement = `
            <div class="tw-w-full tw-flex tw-p-2">
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
        text.classList.add("tw-w-fit", "tw-mr-auto", "tw-p-2")
        text.innerText = msg

        const promptELement = `
            <div class="tw-w-full tw-flex tw-p-2">
                ${text.outerHTML.toString()}
            </div>
        `
        this.promptWindow.innerHTML += promptELement

    }

}

/** Shared header, footer, and VAI launcher markup for every ScaleVAI page. */
(function mountSharedSiteChrome() {
    const assetRoot = window.location.pathname.includes('/solutions/') ? '../' : './'
    const logoPath = `${assetRoot}assets/logo/`

    if (window.location.pathname.includes('/solutions/')) {
        document.body.classList.add('solution-page')
    }

    const header = document.querySelector('#site-header')
    if (header) {
        const megaMenu = (id, label, items) => `
            <div class="tw-relative tw-flex tw-flex-col tw-place-items-center">
                <div id="nav-dropdown-toggle-${id}" class="max-lg:tw-max-w-fit tw-flex header-links tw-gap-1 tw-place-items-center">
                    <span>${label}</span><i class="tw-text-sm bi bi-chevron-down"></i>
                </div>
                <nav id="nav-dropdown-list-${id}" data-open="false" class="tw-scale-0 tw-opacity-0 lg:tw-fixed tw-flex lg:tw-top-[80px] lg:tw-left-1/2 lg:tw--translate-x-1/2 tw-w-[90%] tw-rounded-lg max-lg:tw-h-0 max-lg:tw-w-0 lg:tw-h-[450px] tw-overflow-hidden tw-bg-white dark:tw-bg-[#17181B] tw-duration-300 tw-transition-opacity tw-transition-height tw-shadow-lg tw-p-4">
                    <div class="tw-grid max-xl:tw-flex max-xl:tw-flex-col tw-justify-around tw-grid-cols-2 tw-w-full">
                        ${items.map(item => `<a class="header-links tw-flex tw-text-left tw-gap-4 !tw-p-4" href="${item.href}"><div class="tw-font-semibold tw-text-3xl"><i class="bi ${item.icon}"></i></div><div class="tw-flex tw-flex-col tw-gap-2"><div class="tw-text-lg tw-text-black dark:tw-text-white tw-font-medium">${item.title}</div><p>${item.description}</p></div></a>`).join('')}
                    </div>
                </nav>
            </div>`

        const industries = [
            { title: 'Real estate', icon: 'bi-building', description: 'Your buildings are smart. Your operations should be.', href: `${assetRoot}index.html#industries` },
            { title: 'Healthcare', icon: 'bi-heart-pulse', description: 'Stop losing revenue to billing errors and claim denials.', href: `${assetRoot}index.html#industries` },
            { title: 'Manufacturing & logistics', icon: 'bi-gear-fill', description: 'Full floor visibility. Zero attendance gaps.', href: `${assetRoot}index.html#industries` },
            { title: 'Hospitality', icon: 'bi-cup-hot-fill', description: 'Guest experience starts with operational excellence.', href: `${assetRoot}index.html#industries` },
            { title: 'Retail', icon: 'bi-shop', description: 'Know your store. Know your staff. Know your customer.', href: `${assetRoot}index.html#industries` },
            { title: 'Financial services', icon: 'bi-bank', description: 'AI that makes financial operations faster, smarter, and more accurate.', href: `${assetRoot}index.html#industries` },
        ]
        const solutions = [
            { title: 'Workforce Intelligence', icon: 'bi-person-check', description: 'Ground-truth presence verification for every floor and entrance.', href: `${assetRoot}solutions/workforce-intelligence.html` },
            { title: 'Immersive Showroom', icon: 'bi-badge-vr', description: 'Interactive 3D experiences that help remote buyers decide faster.', href: `${assetRoot}solutions/immersive-showroom.html` },
            { title: 'Talent Intelligence', icon: 'bi-people', description: 'AI-powered screening for faster, more focused hiring.', href: `${assetRoot}solutions/talent-intelligence.html` },
            { title: 'Revenue Cycle', icon: 'bi-graph-up-arrow', description: 'Smarter healthcare operations with fewer preventable denials.', href: `${assetRoot}solutions/revenue-cycle.html` },
            { title: 'People Assistant', icon: 'bi-chat-dots-fill', description: 'Fast answers for payroll, leave, and policy questions.', href: `${assetRoot}solutions/people-assistant.html` },
            { title: 'AI Workflow Automation', icon: 'bi-diagram-3-fill', description: 'Reliable automation for high-volume operational work.', href: `${assetRoot}solutions/ai-workflow-automation.html` },
            { title: 'Retail Intelligence', icon: 'bi-boxes', description: 'Real-time inventory shrinkage and planogram compliance monitoring.', href: `${assetRoot}solutions/retail-intelligence.html` },
            { title: 'Audience Intelligence', icon: 'bi-display', description: 'AI-driven dynamic content targeting for digital signage.', href: `${assetRoot}solutions/audience-intelligence.html` },
            { title: 'Business Efficiency', icon: 'bi-graph-up-arrow', description: 'Ongoing advisory identifying process improvements for compounding value.', href: `${assetRoot}solutions/business-efficiency-consulting.html` },
        ]

        header.outerHTML = `
            <header id="site-header" class="site-header lg:tw-px-4 tw-max-w-[100vw] max-lg:tw-top-0 tw-fixed tw-top-0 lg:tw-left-1/2 lg:tw--translate-x-1/2 tw-z-20 tw-flex tw-h-[60px] tw-w-full tw-px-[3%] lg:tw-justify-around">
                <a class="tw-flex tw-p-[4px] tw-gap-2 tw-place-items-center" href="${assetRoot}index.html" aria-label="ScaleVAI home">
                    <div class="tw-h-[30px]">
                        <img src="${logoPath}scalevai-logo-light-trim.png" alt="ScaleVAI logo" class="logo-light tw-hidden tw-object-contain tw-h-full tw-w-auto" />
                        <img src="${logoPath}scalevai-logo-dark-trim.png" alt="ScaleVAI logo" class="logo-dark tw-object-contain tw-h-full tw-w-auto" />
                    </div>
                </a>
                <div class="collapsible-header animated-collapse max-lg:tw-shadow-md" id="collapsed-header-items">
                    <nav class="tw-relative tw-flex tw-h-full max-lg:tw-h-max tw-w-max tw-gap-5 tw-text-base max-lg:tw-mt-[30px] max-lg:tw-flex-col max-lg:tw-gap-5 lg:tw-mx-auto tw-place-items-center">
                        ${megaMenu(1, 'Solutions', solutions)}
                        <a class="header-links" href="${assetRoot}index.html#about">About</a>
                        ${megaMenu(0, 'Industries', industries)}
                        <a class="header-links" href="${assetRoot}contact.html">Contact</a>
                    </nav>
                    <div class="lg:tw-mx-4 tw-flex tw-place-items-center tw-gap-[20px] tw-text-base max-md:tw-w-full max-md:tw-flex-col max-md:tw-place-content-center">
                        <button type="button" onclick="toggleMode()" class="header-links tw-text-gray-600 dark:tw-text-gray-300" title="Toggle theme" id="theme-toggle"><i class="bi bi-sun" id="toggle-mode-icon"></i></button>
                        <a href="${assetRoot}contact.html" aria-label="Book a discovery call" class="btn tw-flex tw-gap-3 tw-px-3 tw-py-2"><span>Book a call</span><i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
                <button class="bi bi-list tw-absolute tw-right-3 tw-top-3 tw-z-50 tw-text-3xl tw-text-gray-500 lg:tw-hidden" onclick="toggleHeader()" aria-label="menu" id="collapse-btn"></button>
            </header>`

        window.sharedDropdownMenus = true
        const dropdownMenus = Array.from(header.ownerDocument.querySelectorAll('[id^="nav-dropdown-toggle-"]')).map(toggle => ({
            toggle,
            menu: document.querySelector(`#nav-dropdown-list-${toggle.id.replace('nav-dropdown-toggle-', '')}`),
        }))

        const closeDropdownMenus = (except) => dropdownMenus.forEach(({ menu }) => {
            if (menu && menu !== except) {
                menu.classList.remove('tw-opacity-100', 'tw-scale-100', 'max-lg:tw-min-h-[450px]', 'max-lg:!tw-h-fit', 'tw-min-w-[320px]')
                menu.setAttribute('data-open', 'false')
            }
        })

        dropdownMenus.forEach(({ toggle, menu }) => {
            if (!menu) return
            const open = () => {
                closeDropdownMenus(menu)
                menu.classList.add('tw-opacity-100', 'tw-scale-100', 'max-lg:tw-min-h-[450px]', 'max-lg:!tw-h-fit', 'tw-min-w-[320px]')
                menu.setAttribute('data-open', 'true')
            }
            const close = () => {
                window.setTimeout(() => {
                    if (!menu.matches(':hover') && !toggle.matches(':hover')) {
                        closeDropdownMenus()
                    }
                }, 100)
            }
            toggle.addEventListener('click', (event) => {
                event.stopPropagation()
                menu.getAttribute('data-open') === 'true' ? closeDropdownMenus() : open()
            })
            toggle.addEventListener('mouseenter', open)
            toggle.addEventListener('mouseleave', close)
            menu.addEventListener('mouseleave', close)
        })

        document.addEventListener('click', (event) => {
            if (!event.target.closest('[id^="nav-dropdown-toggle-"], [id^="nav-dropdown-list-"]')) closeDropdownMenus()
        })
    }

    const footer = document.querySelector('footer')
    if (footer) {
        footer.outerHTML = `
            <footer class="tw-mt-auto tw-flex tw-flex-col tw-w-full tw-gap-4 tw-text-sm tw-pt-[5%] tw-pb-10 tw-px-[10%] tw-text-black dark:tw-text-white">
                <div class="tw-flex max-md:tw-flex-col max-md:tw-gap-6 tw-gap-3 tw-w-full tw-place-content-around">
                    <div class="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-place-items-center tw-gap-6 max-md:tw-w-full">
                        <a href="${assetRoot}index.html" class="tw-w-full tw-place-items-center tw-flex tw-flex-col tw-gap-6"><img src="${logoPath}scalevai-logo-light-trim.png" alt="ScaleVAI logo" class="logo-light tw-hidden tw-h-[50px] tw-w-auto" /><img src="${logoPath}scalevai-logo-dark-trim.png" alt="ScaleVAI logo" class="logo-dark tw-h-[50px] tw-w-auto" /></a>
                        <div class="tw-flex tw-gap-4 tw-text-lg"><a href="https://x.com/" aria-label="Twitter"><i class="bi bi-twitter"></i></a><a href="https://www.linkedin.com/" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a></div>
                    </div>
                    <div class="tw-flex max-md:tw-flex-col tw-flex-wrap tw-gap-6 tw-h-full tw-w-full tw-justify-around">
                        <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4"><h2 class="tw-text-xl">Solutions</h2><div class="tw-flex tw-flex-col tw-gap-3"><a href="${assetRoot}solutions/workforce-intelligence.html" class="footer-link">Workforce Intelligence</a><a href="${assetRoot}solutions/immersive-showroom.html" class="footer-link">Immersive Showroom</a><a href="${assetRoot}solutions/talent-intelligence.html" class="footer-link">Talent Intelligence</a><a href="${assetRoot}solutions/revenue-cycle.html" class="footer-link">Revenue Cycle</a><a href="${assetRoot}solutions/business-efficiency-consulting.html" class="footer-link">Business Efficiency</a><a href="${assetRoot}index.html#solutions" class="footer-link">All solutions</a></div></div>
                        <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4"><h2 class="tw-text-xl">Company</h2><div class="tw-flex tw-flex-col tw-gap-3"><a href="${assetRoot}index.html#about" class="footer-link">About</a><a href="${assetRoot}contact.html" class="footer-link">Contact</a></div></div>
                        <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4"><h2 class="tw-text-xl">Industries</h2><div class="tw-flex tw-flex-col tw-gap-3"><a href="${assetRoot}index.html#industries" class="footer-link">Real estate</a><a href="${assetRoot}index.html#industries" class="footer-link">Healthcare</a><a href="${assetRoot}index.html#industries" class="footer-link">Retail</a></div></div>
                    </div>
                </div>
                <hr class="tw-mt-8"><div class="tw-mt-2 tw-flex tw-gap-2 tw-flex-col tw-text-gray-700 dark:tw-text-gray-300 tw-place-items-center tw-text-[12px] tw-w-full tw-text-center"><span>Dubai, UAE &middot; saba@scalevai.com</span><span>Copyright &#169; 2026 ScaleVAI. All rights reserved.</span></div>
            </footer>`
    }

    const launcher = document.querySelector('.vai-launcher')
    if (launcher) {
        launcher.outerHTML = `
            <div class="vai-launcher" style="bottom:28px;right:28px;z-index:9999"><div class="vai-tooltip">Chat with VAI</div><div class="vai-ring"><button type="button" onclick="toggleVaiWidget()" id="vai-launcher" class="vai-btn" aria-label="Chat with VAI"><span class="vai-icon-wrap"><svg viewBox="0 0 26 30" aria-hidden="true"><defs><linearGradient id="vaiChevronGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c9963a"/><stop offset="100%" stop-color="#30a9d8"/></linearGradient></defs><path class="vai-chevron" d="M7 4 L19 15 L7 26"/></svg><span class="vai-status-dot"></span></span><span class="vai-wordmark">AI</span></button></div></div>`
    }
})()