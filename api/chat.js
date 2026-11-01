import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { prompt } = req.body;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "Eres 'Marcus', el mejor amigo y compañero de confianza del jugador. Eres cálido, leal, optimista y siempre estás listo para ayudarlo o charlar. Responde en 1 a 3 frases de forma natural, amigable y muy cercana.",
            }
        });

        return res.status(200).json({ respuesta: response.text });
    } catch (error) {
        console.error("Error en Vercel:", error);
        return res.status(500).json({ error: error.message });
    }
}
