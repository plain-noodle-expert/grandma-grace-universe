# AI Integration with OpenRouter - Auto Task Breakdown

This project now includes **automatic AI-powered task breakdown** using OpenRouter LLM service platform. When you create a new task, Grandma Grace automatically breaks it down into manageable steps!

## 🌟 Key Features

### 🤖 **Automatic Task Breakdown** (Default Behavior)
- **No manual action required** - AI automatically activates when creating tasks
- Simply enter your task title and importance level
- AI intelligently generates 3-5 actionable subtasks
- Receives encouraging messages from Grandma Grace
- Falls back gracefully if AI is unavailable

### 💝 Enhanced User Experience
- Smart button text changes based on AI availability
- Visual loading states with AI indicators
- Seamless integration with existing task management
- ADHD-friendly step generation

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Get your API key from the dashboard

### 2. Configure Environment Variables
1. Copy the `.env` file in the project root
2. Replace `your_openrouter_api_key_here` with your actual API key:
   ```
   VITE_OPENROUTER_API_KEY=your_actual_api_key_here
   ```

### 3. Choose Your Model (Optional)
The default model is `meta-llama/llama-3.1-8b-instruct:free` (free tier).
You can change it in the `.env` file:
```
VITE_OPENROUTER_MODEL=microsoft/phi-3-mini-128k-instruct:free
```

## How Auto Task Breakdown Works

### ✨ **Creating a New Task (AI-Powered)**
1. **Click the "+" button** to create a new planet
2. **Enter your task** (e.g., "Write research paper")
3. **Choose importance level** (Small/Medium/Large Planet)
4. **Click "Create with AI"** - The button automatically detects AI availability
5. **AI processes your task** and generates specific steps
6. **Your planet is created** with AI-generated subtasks ready to go!

### 🎯 **Example AI Breakdown**
Input: "Write research paper"
AI Output:
- Choose topic and create thesis statement
- Research and gather credible sources
- Create detailed outline with main points
- Write introduction and conclusion
- Draft body paragraphs with evidence

### 🔄 **Fallback Behavior**
- If AI is unavailable: Uses built-in task breakdown logic
- If API key missing: Shows "Plant Star" instead of "Create with AI"
- Error handling: Gracefully falls back to manual mode

## Additional AI Features

### 💝 Manual AI Assistance (Optional)
- **AI Panel**: Click the purple bot icon (top-right) for additional help
- **Get Encouragement**: Request motivational messages
- **Advanced Tips**: Receive ADHD-friendly productivity suggestions

### 💡 Smart Context Awareness
- AI understands ADHD challenges
- Generates appropriate step sizes
- Provides gentle, encouraging language
- Considers task importance for breakdown complexity

## Privacy & Security

- API keys are stored locally in environment variables
- All AI requests are made directly to OpenRouter
- No personal data is stored on external servers
- The `.env` file is excluded from git for security

## Fallback Behavior

If the AI service is unavailable:
- The app continues to work normally
- Fallback messages from Grandma Grace are used
- Manual task breakdown still available

## Cost Information

- Free tier models are available with usage limits
- Paid models offer higher quality and faster responses
- Check OpenRouter pricing for current rates

Enjoy your AI-powered productivity companion! 🌟✨