export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ respuesta: "Falta la clave GEMINI_API_KEY en Vercel." });
    }

    try {
        const { prompt } = req.body;
        const userPrompt = prompt || "Hola";

        // Llamada REST directa a Gemini con la propiedad correcta: system_instruction
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: userPrompt }]
                        }
                    ],
                    system_instruction: {
                        parts: [
                            {
                                text: "Eres 'Marcus', el mejor amigo y compañero de confianza del jugador. Eres cálido, leal, optimista y siempre estás listo para ayudarlo o charlar. Responde en 1 a 3 frases de forma natural, amigable y cercana."
                            }
                        ]
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Error de Gemini API:", data);
            return res.status(500).json({ respuesta: "Ocurrió un problema con la conexión de la IA." });
        }

        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Hola! Estoy listo para acompañarte.";

        return res.status(200).json({ respuesta: textResponse });

    } catch (error) {
        console.error("Error interno:", error);
        return res.status(500).json({ respuesta: "Error al procesar la solicitud." });
    }
}
