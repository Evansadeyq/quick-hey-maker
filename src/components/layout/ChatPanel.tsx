import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isGenerating?: boolean;
}

interface ChatPanelProps {
  onCodeGenerated: (code: string) => void;
}

export function ChatPanel({ onCodeGenerated }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your AI assistant. I can help you build websites, components, and applications using simple prompts. What would you like to create today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with typing effect
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "",
      timestamp: new Date(),
      isGenerating: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Simulate progressive response
    const responses = [
      "I'll help you create that! Let me generate the code...",
      "\n\nHere's what I've built for you:",
      "\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Generated App</title>\n    <script src=\"https://cdn.tailwindcss.com\"></script>\n</head>\n<body class=\"bg-gray-100 min-h-screen py-8\">\n    <div class=\"container mx-auto px-4\">\n        <h1 class=\"text-4xl font-bold text-center mb-8 text-gray-800\">Your Generated App</h1>\n        <div class=\"max-w-md mx-auto bg-white rounded-lg shadow-lg p-6\">\n            <h2 class=\"text-2xl font-semibold mb-4\">Welcome!</h2>\n            <p class=\"text-gray-600 mb-4\">This was generated based on your prompt:</p>\n            <blockquote class=\"border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4\">\n                \"" + input + "\"\n            </blockquote>\n            <button class=\"w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors\">\n                Click me!\n            </button>\n        </div>\n    </div>\n</body>\n</html>\n```",
      "\n\nI've created a responsive web page based on your request. The code is now visible in the preview panel!"
    ];

    let currentContent = "";
    for (let i = 0; i < responses.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      currentContent += responses[i];
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: currentContent }
          : msg
      ));
    }

    // Extract and apply the generated code
    const codeMatch = currentContent.match(/```html\n([\s\S]*?)\n```/);
    if (codeMatch) {
      onCodeGenerated(codeMatch[1]);
    }

    // Finish generation
    setMessages(prev => prev.map(msg => 
      msg.id === assistantMessage.id 
        ? { ...msg, isGenerating: false }
        : msg
    ));
    
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content copied successfully",
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Ready to help you build</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <Card className={`max-w-[80%] p-3 ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {message.content}
                    </pre>
                    {message.isGenerating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Sparkles className="w-3 h-3 animate-spin" />
                        <span className="text-xs text-muted-foreground">Generating...</span>
                      </div>
                    )}
                  </div>
                  
                  {!message.isGenerating && (
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      {message.type === "assistant" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Card>
              
              {message.type === "user" && (
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build... (Press Enter to send, Shift+Enter for new line)"
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {input.length}/2000
              </Badge>
              {isLoading && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  AI is thinking...
                </Badge>
              )}
            </div>
            
            <Button type="submit" disabled={!input.trim() || isLoading} size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}