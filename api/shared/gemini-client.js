// Shared Gemini chat-completion caller for both local Express and Azure Functions.
async function callGemini({ apiKey, model, systemPrompt, messages }) {
    const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 0.4,
                    thinkingConfig: { thinkingBudget: 0 },
                },
            }),
        }
    );

    if (!res.ok) {
        const errText = await res.text();
        return { ok: false, status: res.status, errText };
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return { ok: true, reply: reply || "I'm sorry, I couldn't generate a response." };
}

module.exports = { callGemini };
