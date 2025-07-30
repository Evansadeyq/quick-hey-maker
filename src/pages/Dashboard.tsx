import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - in real app, this would come from Supabase
const mockProjects = [
  {
    id: "1",
    name: "Portfolio Website",
    description: "A modern portfolio website with animations and dark mode",
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    technology: ["HTML", "CSS", "JavaScript"],
    isPrivate: false,
  },
  {
    id: "2", 
    name: "E-commerce Store",
    description: "Full-featured online store with cart and checkout",
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    technology: ["React", "Tailwind", "Stripe"],
    isPrivate: true,
  },
  {
    id: "3",
    name: "Blog Platform",
    description: "Content management system for blogging",
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    technology: ["HTML", "CSS", "JavaScript"],
    isPrivate: false,
  },
  {
    id: "4",
    name: "Landing Page",
    description: "Marketing landing page with forms and CTAs",
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    technology: ["HTML", "CSS", "JavaScript"],
    isPrivate: false,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [projects] = useState(mockProjects);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewProject = () => {
    navigate("/");
  };

  const handleEditProject = (id: string) => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-1">
                Build, manage, and deploy your web applications
              </p>
            </div>
            
            <Button onClick={handleNewProject} className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Projects */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Projects ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Create your first project to get started"}
                </p>
                <Button onClick={handleNewProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                view === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={(id) => console.log("Delete", id)}
                    onDuplicate={(id) => console.log("Duplicate", id)}
                    onPreview={(id) => console.log("Preview", id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Recent projects will appear here
            </div>
          </TabsContent>
          
          <TabsContent value="shared" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Shared projects will appear here
            </div>
          </TabsContent>
          
          <TabsContent value="archived" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Archived projects will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}