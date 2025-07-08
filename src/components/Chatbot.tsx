
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好！我是碳管理智慧助手。我可以幫助您解答碳費計算、減碳策略等相關問題。請問有什麼可以協助您的嗎？',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // 碳费相关问题
    if (message.includes('碳费') || message.includes('碳價') || message.includes('价格')) {
      return '台灣預計於2024年開始實施碳費制度，初期費率約為每公噸CO2當量300元台幣。碳費計算方式為：碳排放量(公噸CO2當量) × 碳費費率。您可以使用我們的碳費模擬功能來計算具體費用。';
    }

    // 减碳相关问题
    if (message.includes('減碳') || message.includes('減排') || message.includes('節能')) {
      return '常見的減碳策略包括：1) 提高能源效率 2) 使用再生能源 3) 改善製程技術 4) 循環經濟應用。您可以查看我們的減碳路徑功能，獲得個人化的減碳建議。';
    }

    // 排放源相关问题
    if (message.includes('排放源') || message.includes('碳排放') || message.includes('溫室氣體')) {
      return '主要的碳排放源包括：電力使用、化石燃料燃燒(汽油、柴油、天然氣)、工業製程、廢棄物處理等。建議先進行碳盤查，識別主要排放源後再制定減碳策略。';
    }

    // 如何使用平台
    if (message.includes('怎麼用') || message.includes('如何使用') || message.includes('功能')) {
      return '我們平台提供三大功能：1) 碳費模擬 - 計算您的碳排放費用 2) 減碳路徑 - 探索減碳策略 3) 減碳行動 - 追蹤減碳成效。建議從碳費模擬開始，了解您的碳排放現況。';
    }

    // 净零目标
    if (message.includes('淨零') || message.includes('net zero') || message.includes('2050')) {
      return '台灣已宣示2050年達成淨零排放目標。實現淨零需要系統性轉型，包括能源轉型、產業轉型、生活轉型和社會轉型。建議制定階段性減碳目標，逐步邁向淨零。';
    }

    // 默认回复
    return '感謝您的提問！我主要可以協助您了解碳費計算、減碳策略、排放源識別等議題。如果您有具體問題，請告訴我，我會盡力提供相關資訊。您也可以直接使用我們的各項功能來獲得更詳細的分析。';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 模拟机器人思考时间
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 bg-white border-emerald-200">
      <CardHeader className="bg-emerald-600 text-white rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">碳管理助手</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-emerald-700 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.sender === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div>{message.text}</div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入您的問題..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
