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
    <title>DreamStay - Luxury Rental Houses</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#237c82',
                        secondary: '#FFB26B'
                    }
                }
            }
        }
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .hero-bg { background: linear-gradient(135deg, rgba(35,124,130,0.9), rgba(255,178,107,0.8)), url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'); background-size: cover; background-position: center; }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div class="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">D</span>
                </div>
                <span class="font-bold text-xl text-primary">DreamStay</span>
            </div>
            <nav class="hidden md:flex gap-8 font-medium text-gray-700">
                <a href="#" class="hover:text-primary transition">Home</a>
                <a href="#" class="hover:text-primary transition">Listings</a>
                <a href="#" class="hover:text-primary transition">About</a>
                <a href="#" class="hover:text-primary transition">Contact</a>
            </nav>
            <div class="flex items-center gap-4">
                <button class="text-gray-700 hover:text-primary font-medium">Sign In</button>
                <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">Get Started</button>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-bg h-screen flex items-center justify-center text-white">
        <div class="text-center max-w-4xl mx-auto px-4">
            <h1 class="text-5xl md:text-7xl font-bold mb-6">Find Your Perfect<br><span class="text-secondary">Dream Stay</span></h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90">Discover luxury rental houses in the world's most beautiful destinations</p>
            
            <!-- Search Bar -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="relative">
                        <input type="text" placeholder="Where to?" class="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary">
                    </div>
                    <div class="relative">
                        <input type="date" class="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary">
                    </div>
                    <div class="relative">
                        <input type="date" class="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary">
                    </div>
                    <button class="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition">
                        Search
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Listings -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Featured Properties</h2>
                <p class="text-xl text-gray-600">Handpicked luxury stays for unforgettable experiences</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Property 1 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
                    <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Villa" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">Modern Villa with Ocean View</h3>
                        <p class="text-gray-600 mb-4">Malibu, California</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-primary">$450/night</span>
                            <div class="flex items-center gap-1">
                                <span class="text-yellow-400">★</span>
                                <span class="font-medium">4.9</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Property 2 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Cabin" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">Luxury Mountain Cabin</h3>
                        <p class="text-gray-600 mb-4">Aspen, Colorado</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-primary">$380/night</span>
                            <div class="flex items-center gap-1">
                                <span class="text-yellow-400">★</span>
                                <span class="font-medium">4.8</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Property 3 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Beachfront House" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">Beachfront Paradise House</h3>
                        <p class="text-gray-600 mb-4">Miami, Florida</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-primary">$520/night</span>
                            <div class="flex items-center gap-1">
                                <span class="text-yellow-400">★</span>
                                <span class="font-medium">5.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-12">
                <button class="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                    View All Properties
                </button>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 class="text-4xl font-bold text-gray-800 mb-6">Your Perfect Stay Awaits</h2>
                    <p class="text-lg text-gray-600 mb-6">
                        At DreamStay, we curate exceptional rental properties that combine luxury, comfort, and unforgettable experiences. 
                        From oceanfront villas to mountain retreats, each property is handpicked to ensure your stay exceeds expectations.
                    </p>
                    <div class="grid grid-cols-2 gap-6 mb-8">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-primary mb-2">500+</div>
                            <div class="text-gray-600">Premium Properties</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-primary mb-2">50k+</div>
                            <div class="text-gray-600">Happy Guests</div>
                        </div>
                    </div>
                    <button class="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition">
                        Learn More
                    </button>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Interior" class="rounded-2xl shadow-xl">
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">D</span>
                        </div>
                        <span class="font-bold text-xl">DreamStay</span>
                    </div>
                    <p class="text-gray-400">Experience luxury and comfort in the world's most beautiful destinations.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition">Home</a></li>
                        <li><a href="#" class="hover:text-white transition">Listings</a></li>
                        <li><a href="#" class="hover:text-white transition">About</a></li>
                        <li><a href="#" class="hover:text-white transition">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition">Help Center</a></li>
                        <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" class="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="#" class="hover:text-white transition">Cancellation</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Follow Us</h4>
                    <div class="flex gap-4">
                        <a href="#" class="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition">
                            <span class="text-sm">f</span>
                        </a>
                        <a href="#" class="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition">
                            <span class="text-sm">t</span>
                        </a>
                        <a href="#" class="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition">
                            <span class="text-sm">i</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                <p>&copy; 2024 DreamStay. All rights reserved.</p>
            </div>
        </div>
    </footer>
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