import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { openaiService } from "@/lib/services/openai";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
  options?: {
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
  products?: {
    name: string;
    description: string;
    match: number;
  }[];
}

interface ChatInterfaceProps {
  apiKey?: string;
}

const ChatInterface = ({ apiKey }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      text: "¡Hola! Soy Paco, tu asistente para ejecutivos de OraBank. Te ayudo a conocer mejor a tus clientes y a identificar oportunidades de ventas cruzadas. ¿Sobre qué cliente o situación quieres consultar?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: input
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      console.log("Enviando mensaje a OpenAI:", input);
      const response = await openaiService.sendMessage(input);

      console.log("Respuesta de OpenAI:", response);

      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        text: response
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al comunicarse con el asistente. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleProductSelect = (productName: string) => {
    toast({
      title: "Producto seleccionado",
      description: `Has seleccionado ${productName}. Un asesor se pondrá en contacto contigo pronto.`,
    });
  };

  const suggestedQuestions = [
    "¿El cliente es apto para un aumento de línea de crédito?",
    "¿Qué oportunidades de venta cruzada ves en este caso?",
    "¿Qué patrones de gasto identificas en este cliente?",
    "¿El cliente ha tenido cambios recientes en su uso de crédito o comportamiento financiero?"
  ];

  return (
    <div className="flex flex-col h-full max-h-[650px]">
      <ScrollArea className="flex-1 px-4 py-2 overflow-y-auto max-h-[500px]">
        <div className="space-y-6 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`flex items-start gap-3 max-w-[85%] ${
                  message.type === "user" 
                    ? "flex-row-reverse" 
                    : "flex-row"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {message.type === "bot" ? (
                    <Avatar className="h-8 w-12 bg-finance-blue-light">
                      <AvatarFallback className="text-[11px]">PACO</AvatarFallback>
                      <AvatarImage src="/bot-avatar.png" />
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8 bg-finance-blue text-white">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                <div
                  className={`rounded-2xl p-3 ${
                    message.type === "user" 
                      ? "bg-finance-blue text-white rounded-tr-none" 
                      : "bg-white border border-gray-200 shadow-sm text-finance-gray-dark rounded-tl-none"
                  }`}
                >
                  {message.type === "bot" ? (
                    <div className="text-sm whitespace-pre-wrap">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  )}
                  
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <Card key={index} className="border-finance-blue border-opacity-20">
                          <CardContent className="p-3">
                            <div className="flex gap-2">
                              <div className="mt-1 flex-shrink-0">
                                <option.icon className="h-4 w-4 text-finance-blue" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{option.title}</h4>
                                <p className="text-xs text-finance-gray-dark">{option.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {message.products && (
                    <div className="mt-3 space-y-3">
                      {message.products.map((product, index) => (
                        <Card key={index} className="bg-white">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium">{product.name}</h4>
                                <p className="text-xs text-finance-gray-dark">{product.description}</p>
                              </div>
                              <Badge className="bg-finance-blue-light text-finance-blue">{product.match}% match</Badge>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-8 text-finance-blue border-finance-blue hover:bg-finance-blue-light"
                                onClick={() => handleProductSelect(product.name)}
                              >
                                Más info
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-14 bg-finance-blue-light flex items-center justify-center">
                  <AvatarFallback className="text-[11px]">PACO</AvatarFallback>
                  <AvatarImage src="/bot-avatar.png" />
                </Avatar>
                
                <div className="bg-white border border-gray-200 shadow-sm text-finance-gray-dark rounded-2xl rounded-tl-none p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-finance-gray-dark animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-finance-gray-dark animate-bounce delay-100"></div>
                    <div className="h-2 w-2 rounded-full bg-finance-gray-dark animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {suggestedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs flex-shrink-0"
              onClick={() => {
                setInput(question);
              }}
            >
              {question}
            </Button>
          ))}
        </div>
        
        <form 
          className="flex gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1"
          />
          <Button type="submit" className="bg-finance-blue hover:bg-finance-blue-dark flex-shrink-0">
            <Send className="h-4 w-4 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
