import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAI } from "@/hooks/useAI";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isGenerating?: boolean;
  error?: boolean;
}

interface ChatPanelProps {
  onCodeGenerated: (code: string) => void;
}

export function ChatPanel({ onCodeGenerated }: ChatPanelProps) {
  const { generateCode, isLoading, error } = useAI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm JoyousApp AI, your coding assistant. I can help you build websites, components, and applications using simple prompts. Just describe what you want to create and I'll generate the complete HTML, CSS, and JavaScript code for you!\n\nWhat would you like to build today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const currentInput = input.trim();
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: "assistant",
      content: "",
      timestamp: new Date(),
      isGenerating: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages
        .filter(msg => !msg.isGenerating && !msg.error)
        .map(msg => ({
          role: msg.type === "user" ? "user" as const : "assistant" as const,
          content: msg.content
        }));

      const result = await generateCode(currentInput, conversationHistory);
      
      // Update the assistant message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              content: result.content, 
              isGenerating: false 
            }
          : msg
      ));

      // Extract code from the response
      const codeMatch = result.content.match(/```html\n([\s\S]*?)\n```/);
      if (codeMatch) {
        onCodeGenerated(codeMatch[1]);
        toast({
          title: "Code generated!",
          description: "Your code has been updated in the preview panel.",
        });
      }

    } catch (error) {
      console.error('Error generating code:', error);
      
      // Update message to show error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              content: `Sorry, I encountered an error while generating your code: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
              isGenerating: false,
              error: true
            }
          : msg
      ));

      toast({
        title: "Generation failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                  message.error 
                    ? "bg-destructive" 
                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                }`}>
                  {message.error ? (
                    <AlertCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              
              <Card className={`max-w-[80%] p-3 ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : message.error
                  ? "bg-destructive/10 border-destructive/20"
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
            disabled={isLoading || isGenerating}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {input.length}/2000
              </Badge>
              {(isLoading || isGenerating) && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  AI is generating...
                </Badge>
              )}
            </div>
            
            <Button type="submit" disabled={!input.trim() || isLoading || isGenerating} size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}