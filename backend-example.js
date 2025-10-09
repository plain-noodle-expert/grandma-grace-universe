// backend/server.js (示例后端服务)
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY, // 服务器端环境变量
  defaultHeaders: {
    'HTTP-Referer': 'https://your-domain.com',
    'X-Title': 'Grandma Grace Universe',
  },
});

app.post('/api/generate-task-breakdown', async (req, res) => {
  try {
    const { taskTitle, importance } = req.body;
    
    // 这里调用OpenRouter API
    const response = await openai.chat.completions.create({
      model: 'microsoft/mai-ds-r1:free',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful task breakdown assistant...'
        },
        {
          role: 'user',
          content: `Break down this task: ${taskTitle}`
        }
      ]
    });
    
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});