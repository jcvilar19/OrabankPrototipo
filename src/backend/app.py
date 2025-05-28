from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080"]}})

# Configurar OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        user_message = data['message']
        
        # Crear el prompt con el contexto financiero
        prompt = f"""Eres un asistente financiero experto. Proporciona respuestas claras y concisas sobre finanzas personales, 
        productos financieros, y consejos de ahorro. Responde en español.
        
        Pregunta del usuario: {user_message}

        Respuesta:"""

        # Obtener respuesta de OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente financiero experto que proporciona consejos claros y concisos."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=500,
            temperature=0.7
        )

        # Extraer la respuesta
        bot_response = response.choices[0].message.content.strip()

        return jsonify({'response': bot_response})

    except Exception as e:
        print(f"Error en el endpoint /chat: {str(e)}")
        return jsonify({'error': 'Error processing request'}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8082, debug=True) 