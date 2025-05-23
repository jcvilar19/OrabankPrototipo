import axios from 'axios';

const CHATBOT_API_URL = 'http://localhost:8082';

export interface ChatbotResponse {
  response: string;
  error?: string;
}

export const chatbotService = {
  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      const response = await axios.post(`${CHATBOT_API_URL}/chat`, {
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      return {
        response: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async clearHistory(): Promise<void> {
    try {
      await axios.post(`${CHATBOT_API_URL}/clear-history`);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }
}; 