import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  preview: string;
  prompt: string;
}

const templates: Template[] = [
  {
    id: "ecommerce-electronics",
    name: "Electronics Store",
    description: "Modern e-commerce website for electronics with product grids, shopping cart, and checkout",
    category: "E-commerce",
    tags: ["shopping", "products", "modern", "responsive"],
    preview: "/api/placeholder/400/300",
    prompt: "Create a modern electronics e-commerce website with a hero section featuring the latest smartphones, a product grid showing laptops, phones, and accessories with prices, shopping cart functionality, user reviews, and a clean checkout process. Use a dark theme with blue accents and modern typography."
  },
  {
    id: "travel-booking",
    name: "Travel & Booking",
    description: "Beautiful travel website with destination galleries and booking system",
    category: "Travel",
    tags: ["travel", "booking", "gallery", "maps"],
    preview: "/api/placeholder/400/300",
    prompt: "Design a luxury travel and vacation rental website with stunning destination photography, interactive booking calendar, property galleries, guest reviews, and location maps. Use warm colors, elegant typography, and smooth animations."
  },
  {
    id: "saas-landing",
    name: "SaaS Landing Page",
    description: "Professional SaaS product landing page with features and pricing",
    category: "Business",
    tags: ["saas", "landing", "features", "pricing"],
    preview: "/api/placeholder/400/300",
    prompt: "Create a modern SaaS landing page for a productivity app with a compelling hero section, feature highlights with icons, customer testimonials, pricing table with toggle, and call-to-action buttons. Use gradients and clean design."
  },
  {
    id: "restaurant-menu",
    name: "Restaurant & Menu",
    description: "Elegant restaurant website with menu, reservations, and gallery",
    category: "Restaurant",
    tags: ["food", "menu", "reservations", "gallery"],
    preview: "/api/placeholder/400/300",
    prompt: "Design an elegant restaurant website with appetizing food photography, interactive menu with categories, online reservation system, chef's special section, and image gallery. Use warm earth tones and sophisticated typography."
  },
  {
    id: "portfolio-creative",
    name: "Creative Portfolio",
    description: "Modern portfolio website for designers and creatives",
    category: "Portfolio",
    tags: ["portfolio", "creative", "showcase", "personal"],
    preview: "/api/placeholder/400/300",
    prompt: "Create a stunning creative portfolio website with project showcase grid, about section with professional photo, skills display, contact form, and smooth animations. Use modern design with bold typography and creative layouts."
  },
  {
    id: "business-corporate",
    name: "Corporate Business",
    description: "Professional corporate website with team and services",
    category: "Business",
    tags: ["corporate", "professional", "team", "services"],
    preview: "/api/placeholder/400/300",
    prompt: "Build a professional corporate website with company overview, services section with icons, team member profiles, client testimonials, and contact information. Use blue and white color scheme with professional typography."
  }
];

interface TemplateLibraryProps {
  onTemplateSelect: (code: string) => void;
}

export function TemplateLibrary({ onTemplateSelect }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { generateCode } = useAI();

  const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = async (template: Template) => {
    setIsGenerating(template.id);
    try {
      const result = await generateCode(template.prompt);
      onTemplateSelect(result.content);
      toast.success(`Generated ${template.name} template successfully!`);
    } catch (error) {
      toast.error("Failed to generate template. Please try again.");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-sm text-muted-foreground">{template.name}</p>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleTemplateSelect(template)}
                disabled={isGenerating === template.id}
              >
                {isGenerating === template.id ? "Generating..." : "Use Template"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}