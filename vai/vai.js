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

function addChatBubble(text, role){
    if (chatMessages.dataset.cleared !== "true"){
        chatMessages.innerHTML = ""
        chatMessages.dataset.cleared = "true"
    }

    const bubble = document.createElement("div")
    bubble.classList.add("tw-w-fit", "tw-p-2", "tw-max-w-[80%]")
    if (role === "user"){
        bubble.classList.add("tw-ml-auto", "tw-rounded-xl", "tw-bg-gray-100", "dark:tw-bg-[#171717]")
    } else {
        bubble.classList.add("tw-mr-auto")
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
