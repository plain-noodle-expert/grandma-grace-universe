import OpenAI from 'openai';

// OpenRouter configuration
const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true, // Required for frontend usage
  defaultHeaders: {
    'HTTP-Referer': window.location.origin, // Required for OpenRouter
    'X-Title': 'Grandma Grace Universe', // Optional, for tracking
  },
});

export interface AIResponse {
  content: string;
  model: string;
}

export interface TaskSuggestion {
  steps: string[];
  motivation: string;
  priority: 'high' | 'medium' | 'low';
}

export class AIService {
  private static model = import.meta.env.VITE_OPENROUTER_MODEL || 'microsoft/phi-3-mini-128k-instruct:free';
  
  // Backup models to try if the primary fails
  private static backupModels = [
    'microsoft/mai-ds-r1:free',
    'google/gemma-2-9b-it:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'mistralai/mistral-7b-instruct:free'
  ];

  /**
   * Try API call with backup models if primary fails
   */
  private static async tryWithBackupModels<T>(apiCall: (model: string) => Promise<T>): Promise<T> {
    const modelsToTry = [this.model, ...this.backupModels.filter(m => m !== this.model)];
    
    let lastError: Error | null = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying AI model: ${model}`);
        return await apiCall(model);
      } catch (error: any) {
        console.warn(`Model ${model} failed:`, error.message);
        lastError = error;
        
        // If it's a permission/auth error, try next model
        if (error.message?.includes('permission') || 
            error.message?.includes('access') ||
            error.message?.includes('denied') ||
            error.message?.includes('401') ||
            error.message?.includes('403')) {
          continue;
        }
        
        // For other errors, also try backup models
        continue;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('All AI models failed');
  }

  /**
   * Generate task breakdown suggestions using AI
   */
  static async generateTaskBreakdown(taskTitle: string, importance: string): Promise<TaskSuggestion> {
    try {
      return await this.tryWithBackupModels(async (model) => {
        const prompt = `You are Grandma Grace, a wise and caring productivity coach who helps people with ADHD break down tasks into manageable steps.

Task: "${taskTitle}"
Importance Level: ${importance}

Please provide:
1. 3-5 specific, actionable steps to complete this task
2. A gentle, encouraging message from Grandma Grace
3. Priority level based on importance

IMPORTANT: Respond with ONLY a valid JSON object. Do not use markdown code blocks or any other formatting. Just return the raw JSON.

{
  "steps": ["step1", "step2", "step3"],
  "motivation": "encouraging message from Grandma Grace",
  "priority": "high/medium/low"
}`;

        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are Grandma Grace, a wise and caring AI assistant who helps people with ADHD manage their tasks. IMPORTANT: ALWAYS respond ONLY with valid JSON format, no markdown, no code blocks, no extra text. Just pure JSON starting with { and ending with }.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
          throw new Error('No response from AI');
        }

        // Clean up the response - remove markdown code blocks if present
        let cleanContent = responseContent.trim();
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }

        let parsed;
        try {
          parsed = JSON.parse(cleanContent);
        } catch (parseError) {
          console.warn('JSON parse failed, trying to extract JSON from response:', parseError);
          // Try to find JSON object in the response
          const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Could not extract valid JSON from AI response');
          }
        }

        return {
          steps: parsed.steps || [],
          motivation: parsed.motivation || "You've got this, dear! Take it one step at a time. 💖",
          priority: parsed.priority || 'medium'
        };
      });
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback response
      return {
        steps: [
          'Break this task into smaller parts',
          'Set a timer for focused work',
          'Take breaks when needed',
          'Celebrate small progress'
        ],
        motivation: "Don't worry, dear! Even when AI is taking a break, I believe in you! 🌟",
        priority: 'medium'
      };
    }
  }

  /**
   * Generate personalized productivity tips
   */
  static async generateProductivityTip(taskHistory: string[], timeOfDay: string): Promise<string> {
    try {
      return await this.tryWithBackupModels(async (model) => {
        const prompt = `You are Grandma Grace. Based on the user's recent tasks: [${taskHistory.join(', ')}] and it's currently ${timeOfDay}, provide a gentle productivity tip or suggestion.

Keep it short (1-2 sentences), practical, and encouraging. Consider ADHD-friendly strategies.`;

        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are Grandma Grace, providing ADHD-friendly productivity advice with warmth and understanding.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        });

        return completion.choices[0]?.message?.content || "Remember to take breaks, dear! Your mind needs rest to bloom like a beautiful flower. 🌺";
      });
    } catch (error) {
      console.error('AI Tip Error:', error);
      return "Take things one planet at a time, child. The universe isn't going anywhere! 🌟";
    }
  }

  /**
   * Check if AI service is properly configured
   */
  static isConfigured(): boolean {
    return !!import.meta.env.VITE_OPENROUTER_API_KEY;
  }

  /**
   * Get available models from OpenRouter
   */
  static async getAvailableModels(): Promise<string[]> {
    try {
      return this.backupModels;
    } catch (error) {
      console.error('Error fetching models:', error);
      return ['microsoft/phi-3-mini-128k-instruct:free'];
    }
  }
}