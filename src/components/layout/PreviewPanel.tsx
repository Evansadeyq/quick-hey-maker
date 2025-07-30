import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw, 
  ExternalLink, 
  Maximize, 
  Minimize 
} from "lucide-react";

interface PreviewPanelProps {
  code: string;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportSizes = {
  desktop: { width: "100%", height: "100%", icon: Monitor },
  tablet: { width: "768px", height: "1024px", icon: Tablet },
  mobile: { width: "375px", height: "667px", icon: Smartphone },
};

export function PreviewPanel({ code }: PreviewPanelProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // Create blob URL for the HTML content
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [code]);

  const refreshPreview = () => {
    // Force iframe reload
    const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const openInNewTab = () => {
    window.open(previewUrl, "_blank");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const currentSize = viewportSizes[viewport];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Preview</h2>
            <Badge variant="secondary" className="text-xs">
              Live
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Viewport Controls */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              {Object.entries(viewportSizes).map(([size, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={size}
                    variant={viewport === size ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewport(size as ViewportSize)}
                    className="h-7 w-7 p-0"
                  >
                    <Icon className="w-3 h-3" />
                  </Button>
                );
              })}
            </div>
            
            <div className="h-4 w-px bg-border" />
            
            {/* Action Buttons */}
            <Button variant="ghost" size="sm" onClick={refreshPreview}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={openInNewTab}>
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {viewport !== "desktop" && (
          <div className="mt-2 text-xs text-muted-foreground">
            {currentSize.width} × {currentSize.height}
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4 bg-muted/30">
        <Card className={`h-full ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}>
          <div className="h-full flex items-center justify-center p-4">
            {viewport === "desktop" ? (
              <iframe
                id="preview-iframe"
                src={previewUrl}
                className="w-full h-full border-0 rounded-lg"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="relative">
                <div
                  className="mx-auto bg-background border border-border rounded-lg overflow-hidden shadow-xl"
                  style={{
                    width: currentSize.width,
                    height: currentSize.height,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  <iframe
                    id="preview-iframe"
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}