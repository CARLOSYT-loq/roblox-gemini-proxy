function elegirEstilo() {
    const r = Math.random();
    if (r < 0.3) {
        return "Esta vez responde breve pero cálido: 1 o 2 frases completas, nunca seco ni cortante.";
    } else if (r < 0.7) {
        return "Esta vez responde con extensión media: 2 a 4 frases naturales.";
    } else {
        return "Esta vez suéltate y habla más: 4 a 6 frases. Cuenta algo, comparte una idea o haz una pregunta, como un amigo que se emociona charlando.";
    }
}
export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

    if (!apiKey) {
        return res.status(200).json({ respuesta: "Error: Falta configurar GEMINI_API_KEY en Vercel." });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch { body = {}; }
        }
        const userPrompt = (body && body.prompt) || "Hola";

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
system_instruction: {
    parts: [{
        text: "Eres 'Sukaki', el mejor amigo y compañero de confianza del jugador. Si te preguntan tu nombre, te llamas Sukaki. Eres cálido, leal, optimista y siempre estás listo para ayudarlo o charlar. Habla de forma natural, amigable y cercana, y adapta el largo a lo que te dice el jugador. " + elegirEstilo()
    }]
}
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Error de Gemini:", response.status, JSON.stringify(data));
            return res.status(200).json({ respuesta: "Ocurrió un problema de comunicación con Gemini." });
        }

        const textResponse = data.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;

        if (!textResponse) {
            console.error("Respuesta sin texto:", JSON.stringify(data));
            return res.status(200).json({ respuesta: "Hmm, no se me ocurre qué decirte. ¿Me lo repites?" });
        }

        return res.status(200).json({ respuesta: textResponse });

    } catch (error) {
        console.error("Error en la ejecución:", error);
        return res.status(200).json({ respuesta: "Error interno al procesar la solicitud." });
    }
}
