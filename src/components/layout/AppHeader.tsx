import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  Save, 
  Download, 
  Share, 
  FolderOpen,
  Plus,
  ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const [projectName, setProjectName] = useState("Untitled Project");

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-full flex items-center justify-between px-4">
        {/* Left Side - Logo and Project */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JoyousApp
            </span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <span className="max-w-[200px] truncate">{projectName}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center - Status */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Ready
          </Badge>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}