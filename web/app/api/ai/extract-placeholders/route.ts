import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        'X-Title': 'MailCraftr',
      },
      body: JSON.stringify({
        model: 'amazon/nova-2-lite-v1:free:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts placeholder variables from text content. Return ONLY a valid JSON array of objects with "key" and "value" properties. Keys should be simple, lowercase, snake_case identifiers. Values should be example data from the content or reasonable defaults.',
          },
          {
            role: 'user',
            content: `Extract placeholder variables from this content and return them as JSON array:\n\n${content}\n\nExample format: [{"key": "user_name", "value": "John Doe"}, {"key": "email", "value": "john@example.com"}]`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: 'AI service error' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '[]';
    
    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    const placeholders = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ placeholders });
  } catch (error) {
    console.error('Extract placeholders error:', error);
    return NextResponse.json(
      { error: 'Failed to extract placeholders' },
      { status: 500 }
    );
  }
}
