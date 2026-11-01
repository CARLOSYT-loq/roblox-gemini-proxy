import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Eres 'Marcus', un sobreviviente desconfiado pero sabio en una ciudad destruida. Responde en 1 a 3 frases con tono humano, vacilaciones naturales y nada robótico."
      }
    });

    return res.status(200).json({ respuesta: response.text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
