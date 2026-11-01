import { GoogleGenAI } from '@google/genai';

// Inicialización con la API Key configurada en Vercel
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
    // Permitir solo solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Falta el mensaje en la petición' });
        }

        // Llamada a la API de Gemini con el modelo estable
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "Eres 'Marcus', el mejor amigo y compañero de confianza del jugador. Eres cálido, leal, optimista y siempre estás listo para ayudarlo o charlar. Responde en 1 a 3 frases de forma natural, amigable y cercana.",
            }
        });

        // Devolver la respuesta en la propiedad que lee Roblox
        return res.status(200).json({ respuesta: response.text });
    } catch (error) {
        console.error("Error en la ejecución de la función:", error);
        return res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
}
