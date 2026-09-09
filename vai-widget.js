// Floating VAI chat widget: launcher toggle + chat requests to /api/chat.
// Self-contained and reusable across every page (homepage, solution pages, ...).
// Defensive: no-ops if the widget markup isn't present on the page.
(function () {
    const vaiLauncher = document.querySelector("#vai-launcher, .vai-btn")
    const vaiLauncherIcon = document.querySelector("#vai-launcher-icon")
    const vaiWidget = document.querySelector("#vai-widget")
    const chatMessages = document.querySelector("#chat-messages")
    const chatForm = document.querySelector("#chat-form")
    const chatInput = document.querySelector("#chat-input")

    if (!vaiWidget || !chatMessages || !chatForm || !chatInput) return

    let vaiWidgetOpen = false

    if (vaiLauncher) {
        vaiLauncher.setAttribute("aria-expanded", String(vaiWidgetOpen))
    }

    const animateWidget = window.gsap
    if (animateWidget) {
        animateWidget.set(vaiWidget, { scale: 0.4, y: 40, opacity: 0, visibility: "hidden" })
    } else {
        vaiWidget.style.transform = "translateY(40px) scale(0.4)"
        vaiWidget.style.opacity = "0"
        vaiWidget.style.visibility = "hidden"
        vaiWidget.style.pointerEvents = "none"
    }

    window.toggleVaiWidget = function toggleVaiWidget() {
        if (animateWidget) animateWidget.killTweensOf(vaiWidget)
        vaiWidgetOpen = !vaiWidgetOpen

        if (vaiLauncher) {
            vaiLauncher.setAttribute("aria-expanded", String(vaiWidgetOpen))
        }

        if (vaiWidgetOpen) {
            vaiWidget.style.visibility = "visible"
            vaiWidget.style.pointerEvents = "auto"
            if (animateWidget) {
                animateWidget.to(vaiWidget, { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" })
            } else {
                vaiWidget.style.opacity = "1"
                vaiWidget.style.transform = "translateY(0) scale(1)"
            }
            chatInput.focus()
        } else {
            const hideWidget = () => {
                vaiWidget.style.visibility = "hidden"
                vaiWidget.style.pointerEvents = "none"
            }
            if (animateWidget) {
                animateWidget.to(vaiWidget, {
                    scale: 0.4, y: 40, opacity: 0, duration: 0.25, ease: "power2.in",
                    onComplete: hideWidget
                })
            } else {
                vaiWidget.style.opacity = "0"
                vaiWidget.style.transform = "translateY(40px) scale(0.4)"
                hideWidget()
            }
        }
    }

    let chatHistory = []

    // Ensure initial greeting message has the AI chat box styling
    chatMessages.querySelectorAll(".tw-mr-auto").forEach(el => {
        el.classList.add("vai-chat-bubble-ai")
    })

    function addChatBubble(text, role) {
        if (chatMessages.dataset.cleared !== "true") {
            chatMessages.innerHTML = ""
            chatMessages.dataset.cleared = "true"
        }

        const bubble = document.createElement("div")
        bubble.classList.add("tw-w-fit", "tw-max-w-[85%]", "tw-p-2.5", "tw-px-3.5", "tw-rounded-xl", "tw-text-sm", "tw-leading-relaxed", "tw-shadow-sm")
        if (role === "user") {
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
})()
