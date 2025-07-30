import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Copy, 
  Download, 
  FileText, 
  Code, 
  Palette, 
  Save 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export function CodeEditor({ code, onCodeChange }: CodeEditorProps) {
  const { theme } = useTheme();
  const [activeFile, setActiveFile] = useState("html");
  const [files, setFiles] = useState({
    html: code,
    css: `/* Add your custom styles here */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}`,
    js: `// Add your JavaScript here
console.log('Welcome to JoyousApp!');

// Example: Add interactivity
document.addEventListener('DOMContentLoaded', function() {
  // Your code here
});`
  });

  const updateFile = (fileType: string, content: string) => {
    const newFiles = { ...files, [fileType]: content };
    setFiles(newFiles);
    
    if (fileType === "html") {
      onCodeChange(content);
    }
  };

  const copyCode = () => {
    const currentCode = files[activeFile as keyof typeof files];
    navigator.clipboard.writeText(currentCode);
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
    });
  };

  const downloadCode = () => {
    const currentCode = files[activeFile as keyof typeof files];
    const extensions = { html: "html", css: "css", js: "js" };
    const extension = extensions[activeFile as keyof typeof extensions];
    
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code downloaded",
      description: `File saved as code.${extension}`,
    });
  };

  const getLanguageExtension = () => {
    switch (activeFile) {
      case "html": return html();
      case "css": return css();
      case "js": return javascript();
      default: return html();
    }
  };

  const fileIcons = {
    html: FileText,
    css: Palette,
    js: Code,
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Code Editor</h2>
            <Badge variant="outline" className="text-xs">
              {activeFile.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={copyCode}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            
            <Button variant="ghost" size="sm" onClick={downloadCode}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button variant="ghost" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* File Tabs and Editor */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeFile} onValueChange={setActiveFile} className="flex-1 flex flex-col">
          <div className="border-b border-border px-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              {Object.keys(files).map((fileType) => {
                const Icon = fileIcons[fileType as keyof typeof fileIcons];
                return (
                  <TabsTrigger key={fileType} value={fileType} className="gap-2">
                    <Icon className="w-4 h-4" />
                    {fileType.toUpperCase()}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          
          {Object.entries(files).map(([fileType, content]) => (
            <TabsContent key={fileType} value={fileType} className="flex-1 m-0">
              <div className="h-full">
                <CodeMirror
                  value={content}
                  onChange={(value) => updateFile(fileType, value)}
                  extensions={[getLanguageExtension()]}
                  theme={theme === "dark" ? oneDark : undefined}
                  className="h-full"
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    highlightSelectionMatches: true,
                  }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Footer */}
      <div className="border-t border-border px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Lines: {files[activeFile as keyof typeof files].split('\n').length}</span>
          <span>Characters: {files[activeFile as keyof typeof files].length}</span>
        </div>
      </div>
    </div>
  );
}