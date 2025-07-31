import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, User, Send, Copy, ThumbsUp, ThumbsDown, Loader2, Image, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAI } from "@/hooks/useAI";
import { ImageGenerator } from "./ImageGenerator";
import { TemplateLibrary } from "../templates/TemplateLibrary";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    const currentInput = input.trim();
    setMessages(prev => [...prev, userMessage]);
    setInput("");

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
        toast.success("Beautiful website generated successfully!");
      }

    } catch (error) {
      console.error('Error generating code:', error);
      
      // Update message to show error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              content: `Sorry, I encountered an error while generating your website: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
              isGenerating: false,
              error: true
            }
          : msg
      ));

      toast.error("Failed to generate website. Please try again.");
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
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          JoyousApp AI
          <Badge variant="secondary" className="ml-auto">
            Pro
          </Badge>
        </CardTitle>
      </CardHeader>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to JoyousApp AI</h3>
                  <p className="text-sm max-w-md mx-auto">
                    I'm your AI assistant for creating stunning, modern websites. 
                    Describe what you want to build and I'll generate beautiful, 
                    professional code with images and modern design.
                  </p>
                  <div className="mt-6 space-y-2 text-xs">
                    <p className="font-medium">Try these prompts:</p>
                    <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setInput("Create a modern e-commerce website for electronics")}
                      >
                        Electronics Store
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setInput("Build a luxury travel booking website")}
                      >
                        Travel Booking
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setInput("Design a SaaS landing page")}
                      >
                        SaaS Landing
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    {message.type === 'user' ? (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                        <Bot className="h-4 w-4 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {message.type === 'user' ? 'You' : 'JoyousApp AI'}
                      </span>
                      {message.isGenerating && (
                        <Badge variant="secondary" className="text-xs">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Generating...
                        </Badge>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                    {message.type === 'assistant' && !message.isGenerating && (
                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the website you want to create... (e.g., 'Create a modern e-commerce website for selling electronics with a dark theme')"
                className="min-h-[80px] resize-none"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    GPT-4.1 Turbo
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Modern Design
                  </Badge>
                </div>
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 flex flex-col m-0">
          <div className="flex-1 p-4">
            <TemplateLibrary onTemplateSelect={onCodeGenerated} />
          </div>
        </TabsContent>

        <TabsContent value="images" className="flex-1 flex flex-col m-0">
          <div className="flex-1 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Image Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGenerator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}