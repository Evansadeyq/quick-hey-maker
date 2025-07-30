import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AppHeader } from "./AppHeader";
import { ChatPanel } from "./ChatPanel";
import { PreviewPanel } from "./PreviewPanel";
import { CodeEditor } from "./CodeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AppLayout() {
  const [activeTab, setActiveTab] = useState("preview");
  const [currentCode, setCurrentCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to JoyousApp</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
    <div class="text-center text-white">
        <h1 class="text-6xl font-bold mb-4">Welcome to JoyousApp</h1>
        <p class="text-xl mb-8">Build anything with AI-powered prompts</p>
        <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Building
        </button>
    </div>
</body>
</html>`);

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />
      
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <ChatPanel onCodeGenerated={setCurrentCode} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Main Content Panel */}
          <ResizablePanel defaultSize={65} minSize={50}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b border-border px-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="flex-1 m-0">
                <PreviewPanel code={currentCode} />
              </TabsContent>
              
              <TabsContent value="code" className="flex-1 m-0">
                <CodeEditor code={currentCode} onCodeChange={setCurrentCode} />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}