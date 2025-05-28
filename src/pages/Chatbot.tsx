
import ChatInterface from "@/components/chatbot/ChatInterface";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  return (
    <div className="h-[calc(100vh-128px)] animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">Plataforma automtizada para control y optimización (PACO)</h1>
        <p className="text-finance-gray-dark">Asesoría de ventas inteligente</p>
      </div>
      
      <div className="h-[calc(100%-4rem)] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="bg-finance-blue px-6 py-4 text-white">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            <h2 className="font-medium">Plataforma automtizada para control y optimización (PACO)</h2>
          </div>
          <p className="text-xs opacity-80 mt-1">
          Asesoría de ventas inteligente
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
