import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function testOpenAIKey() {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente útil.' },
          { role: 'user', content: '¿Puedes responder sí o no?' }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Respuesta de OpenAI:', response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (e: any) {
    console.error('Error al verificar la API key de OpenAI:', e?.response?.data || e);
    return null;
  }
}

// Para probar manualmente, descomenta esto:
// testOpenAIKey(); 