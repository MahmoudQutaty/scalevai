/** Dark and light theme (kept in sync with the main site's logic) */
if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark')
    updateToggleModeBtn()
} else {
    document.documentElement.classList.remove('tw-dark')
    updateToggleModeBtn()
}

function toggleMode(){
    document.documentElement.classList.toggle("tw-dark")
    updateToggleModeBtn()
}

function updateToggleModeBtn(){
    const toggleIcon = document.querySelector("#toggle-mode-icon")
    const isDark = document.documentElement.classList.contains("tw-dark")

    document.querySelectorAll(".logo-light").forEach(img => img.classList.toggle("tw-hidden", isDark))
    document.querySelectorAll(".logo-dark").forEach(img => img.classList.toggle("tw-hidden", !isDark))

    if (isDark){
        toggleIcon.classList.remove("bi-sun")
        toggleIcon.classList.add("bi-moon")
        localStorage.setItem("color-mode", "dark")
    } else {
        toggleIcon.classList.add("bi-sun")
        toggleIcon.classList.remove("bi-moon")
        localStorage.setItem("color-mode", "light")
    }
}

/** Rotating example questions above the chat input */
new Typed('#prompts-sample-vai', {
    strings: [
        "What solutions does ScaleVAI offer?",
        "How much does the Professional plan cost?",
        "Do you work with real estate companies?",
        "How long does implementation take?",
    ],
    typeSpeed: 60,
    smartBackspace: true,
    loop: true,
    backDelay: 2000,
})

/** Chat wiring */
const chatMessages = document.querySelector("#chat-messages")
const chatForm = document.querySelector("#chat-form")
const chatInput = document.querySelector("#chat-input")

let chatHistory = []

if (chatMessages) {
    chatMessages.querySelectorAll(".tw-mr-auto").forEach(el => {
        el.classList.add("vai-chat-bubble-ai")
    })
}

function addChatBubble(text, role){
    if (chatMessages.dataset.cleared !== "true"){
        chatMessages.innerHTML = ""
        chatMessages.dataset.cleared = "true"
    }

    const bubble = document.createElement("div")
    bubble.classList.add("tw-w-fit", "tw-max-w-[85%]", "tw-p-2.5", "tw-px-3.5", "tw-rounded-xl", "tw-text-sm", "tw-leading-relaxed", "tw-shadow-sm")
    if (role === "user"){
        bubble.classList.add("vai-chat-bubble-user", "tw-ml-auto", "tw-bg-[#6366f1]", "tw-text-white")
    } else {
        bubble.classList.add("vai-chat-bubble-ai", "tw-mr-auto", "tw-bg-gray-100", "dark:tw-bg-[#1c1f26]", "tw-border", "tw-border-gray-200/90", "dark:tw-border-[#2c303b]", "tw-text-gray-900", "dark:tw-text-gray-100")
    }
    bubble.innerText = text
    chatMessages.appendChild(bubble)
    chatMessages.scrollTop = chatMessages.scrollHeight
    return bubble
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const message = chatInput.value.trim()
    if (!message) return false

    addChatBubble(message, "user")
    chatHistory.push({ role: "user", content: message })
    chatInput.value = ""
    chatInput.disabled = true

    const typingBubble = addChatBubble("VAI is typing...", "assistant")

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory }),
        })

        const data = await response.json()

        if (!response.ok) {
            typingBubble.innerText = data.error || "Something went wrong. Please try again."
        } else {
            typingBubble.innerText = data.reply
            chatHistory.push({ role: "assistant", content: data.reply })
        }
    } catch (err) {
        typingBubble.innerText = "Connection error. Please check your internet and try again."
    }

    chatInput.disabled = false
    chatInput.focus()
    return false
})
