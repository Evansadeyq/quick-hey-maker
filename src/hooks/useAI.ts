import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async (prompt: string, conversationHistory: Message[] = []) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('generate-code', {
        body: {
          prompt,
          conversationHistory: conversationHistory.slice(-6) // Keep last 6 messages for context
        }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return {
        content: data.content,
        usage: data.usage
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateCode,
    isLoading,
    error
  };
}