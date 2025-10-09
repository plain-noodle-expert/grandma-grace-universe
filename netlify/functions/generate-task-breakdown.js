// netlify/functions/generate-task-breakdown.js
const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY, // Netlify环境变量
  defaultHeaders: {
    'HTTP-Referer': 'https://your-netlify-site.netlify.app',
    'X-Title': 'Grandma Grace Universe',
  },
});

exports.handler = async (event, context) => {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { taskTitle, importance } = JSON.parse(event.body);
    
    const response = await openai.chat.completions.create({
      model: 'microsoft/mai-ds-r1:free',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful task breakdown assistant for ADHD users. Break down tasks into small, manageable steps.'
        },
        {
          role: 'user',
          content: `Break down this ${importance} priority task into 3-5 clear, actionable steps: "${taskTitle}"`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const steps = content.split('\n').filter(step => step.trim());

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        steps: steps,
        motivation: "You've got this! Take it one step at a time.",
        priority: importance
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};