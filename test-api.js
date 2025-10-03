// Test OpenRouter API directly
import fetch from 'node-fetch';

async function testAPI() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'Grandma Grace Universe'
      },
      body: JSON.stringify({
        model: 'microsoft/phi-3-mini-128k-instruct:free',
        messages: [
          {
            role: 'user',
            content: 'Hello, just testing the API'
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    } else {
      const data = await response.json();
      console.log('Success:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();