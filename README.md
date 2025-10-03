# grandma-grace-universe

A plan coach for users having difficulty to proceed with their plans - ADHD Planet App Overview

This is a code bundle for ADHD Planet App Overview. The original project is available at https://www.figma.com/design/Pry7MhJoX7BgF1V3KAq7ip/ADHD-Planet-App-Overview.

## Setup

### 1. Install Dependencies
```bash
npm i
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# Get your API key from: https://openrouter.ai/keys
```

### 3. Start Development Server
```bash
npm run dev
```

## Features

- ✨ **Task Management**: Create and organize tasks as beautiful planets
- 🤖 **AI Task Breakdown**: Automatically generate step-by-step guides (requires OpenRouter API key)
- 👵 **Grandma Grace**: Encouraging companion with personalized messages
- 🌟 **Visual Universe**: Stunning cosmic interface with animations

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENROUTER_API_KEY` | Your OpenRouter API key for AI features | Optional |
| `VITE_OPENROUTER_BASE_URL` | OpenRouter API endpoint | Optional |
| `VITE_OPENROUTER_MODEL` | AI model to use | Optional |

**Note**: The app works without AI configuration, using default task breakdown templates.
