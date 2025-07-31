import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const unsplashApiKey = Deno.env.get('UNSPLASH_ACCESS_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, conversationHistory = [], generateImages = true } = await req.json();

    console.log('Generating code for prompt:', prompt);

    // Generate images if requested
    let generatedImages = [];
    if (generateImages && unsplashApiKey) {
      try {
        generatedImages = await generateContextualImages(prompt, unsplashApiKey);
      } catch (error) {
        console.error('Image generation failed:', error);
      }
    }

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are JoyousApp AI, an expert web developer that creates stunning, modern websites like Lovable. Generate COMPLETE, PROFESSIONAL HTML/CSS/JavaScript code based on user prompts.

CRITICAL INSTRUCTIONS:
1. Always generate COMPLETE, MODERN WEBSITES that include:
   - DOCTYPE declaration and full HTML structure
   - Professional CSS with modern design patterns
   - Beautiful layouts using CSS Grid/Flexbox
   - Stunning visual design with gradients, shadows, animations
   - Responsive design for all screen sizes
   - Interactive elements and smooth animations
   - High-quality placeholder images or generated images

2. MODERN DESIGN REQUIREMENTS:
   - Use contemporary color palettes (gradients, modern colors)
   - Professional typography with Google Fonts
   - Clean, minimalist layouts with proper spacing
   - Modern UI components (cards, buttons, forms)
   - Smooth transitions and hover effects
   - CSS animations and micro-interactions
   - Mobile-first responsive design

3. WEBSITE TYPES & TEMPLATES:
   - E-commerce: Product grids, shopping carts, hero sections
   - Travel/Rental: Beautiful galleries, booking forms, maps
   - Business: Professional layouts, team sections, testimonials
   - Portfolio: Project showcases, skill displays, contact forms
   - SaaS: Feature sections, pricing tables, dashboards

4. IMAGE INTEGRATION:
   - Use high-quality placeholder images from Unsplash
   - Generate contextual images that match the website theme
   - Include hero banners, product images, team photos
   - Create consistent visual branding throughout

5. PROFESSIONAL FEATURES:
   - Navigation menus with smooth scrolling
   - Contact forms and interactive elements
   - Social media integration
   - SEO-optimized structure
   - Loading animations and transitions
   - Call-to-action buttons and conversion optimization

6. CODE STRUCTURE:
   - Organized CSS with custom properties
   - Modular JavaScript with ES6+ features
   - Semantic HTML5 structure
   - Accessibility best practices (ARIA, alt text)
   - Performance optimization

7. ALWAYS wrap your complete HTML code in triple backticks:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
...complete professional website code...
</html>
\`\`\`

8. Before the code, provide a brief description of the modern website you've created.

Remember: Create STUNNING, PROFESSIONAL websites that look like they were built by expert designers and developers. Every website should be beautiful, functional, and modern.${generatedImages.length > 0 ? `\n\nAVAILABLE IMAGES: ${generatedImages.map(img => `${img.description}: ${img.url}`).join(', ')}` : ''}`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Successfully generated content');

    return new Response(JSON.stringify({ 
      content: generatedContent,
      usage: data.usage,
      images: generatedImages
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate code'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Function to generate contextual images based on prompt
async function generateContextualImages(prompt: string, apiKey: string) {
  const images = [];
  
  try {
    // Analyze prompt to determine image needs
    const imageKeywords = extractImageKeywords(prompt);
    
    for (const keyword of imageKeywords.slice(0, 3)) { // Limit to 3 images
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`, {
        headers: {
          'Authorization': `Client-ID ${apiKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const photo = data.results[0];
          images.push({
            url: photo.urls.regular,
            description: keyword,
            alt: photo.alt_description || keyword,
            photographer: photo.user.name,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
  
  return images;
}

// Function to extract relevant keywords for image generation
function extractImageKeywords(prompt: string) {
  const keywords = [];
  const lowerPrompt = prompt.toLowerCase();
  
  // Website type keywords
  if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store')) {
    keywords.push('modern shopping', 'product display', 'retail technology');
  }
  if (lowerPrompt.includes('travel') || lowerPrompt.includes('hotel') || lowerPrompt.includes('rental')) {
    keywords.push('luxury travel', 'beautiful destination', 'modern hotel');
  }
  if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food')) {
    keywords.push('gourmet food', 'restaurant interior', 'culinary art');
  }
  if (lowerPrompt.includes('business') || lowerPrompt.includes('corporate')) {
    keywords.push('modern office', 'business team', 'professional workspace');
  }
  if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) {
    keywords.push('creative workspace', 'modern design', 'professional portrait');
  }
  if (lowerPrompt.includes('saas') || lowerPrompt.includes('app') || lowerPrompt.includes('software')) {
    keywords.push('technology innovation', 'modern workspace', 'digital transformation');
  }
  
  // Default keywords if no specific type detected
  if (keywords.length === 0) {
    keywords.push('modern architecture', 'professional business', 'creative design');
  }
  
  return keywords;
}