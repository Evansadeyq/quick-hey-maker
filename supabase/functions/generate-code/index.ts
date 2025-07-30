import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const { prompt, conversationHistory = [] } = await req.json();

    console.log('Generating code for prompt:', prompt);

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are JoyousApp AI, an expert web developer that generates complete, functional HTML/CSS/JavaScript code based on user prompts. 

CRITICAL INSTRUCTIONS:
1. Always generate COMPLETE, FUNCTIONAL HTML code that includes:
   - DOCTYPE declaration
   - Full HTML structure with head and body
   - Embedded CSS styles in <style> tags
   - Embedded JavaScript in <script> tags if needed
   - Modern, responsive design using CSS Grid/Flexbox
   - Beautiful styling with gradients, shadows, and animations
   - Interactive elements when appropriate

2. Use modern web standards:
   - CSS custom properties (CSS variables)
   - CSS Grid and Flexbox for layouts
   - Modern JavaScript (ES6+)
   - Responsive design principles
   - Accessibility best practices

3. Style preferences:
   - Use beautiful color schemes and gradients
   - Include hover effects and smooth transitions
   - Add subtle animations and micro-interactions
   - Ensure good contrast and typography
   - Make it mobile-responsive

4. ALWAYS wrap your complete HTML code in triple backticks with "html" language identifier:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
...complete code here...
</html>
\`\`\`

5. Provide a brief explanation before the code about what you've built.

Remember: Generate COMPLETE, PRODUCTION-READY code that works immediately when saved as an HTML file.`
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
        model: 'gpt-4o-mini',
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
      usage: data.usage 
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