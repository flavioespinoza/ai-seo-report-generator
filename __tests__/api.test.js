import { generateSeoFeedback } from '@/lib/openai';

describe('OpenAI API Error Handling', () => {
  const originalApiKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalApiKey;
  });

  it('should throw error with invalid API key', async () => {
    process.env.OPENAI_API_KEY = 'invalid-api-key';

    const mockMetadata = {
      url: 'https://example.com',
      pageTitle: 'Test Page',
      metaDescription: 'Test description',
      metaKeywords: null,
      h1Tags: ['Heading 1'],
      imageCount: 5,
      hasFavicon: true,
      titleLength: 9,
      descriptionLength: 16,
    };

    await expect(generateSeoFeedback(mockMetadata)).rejects.toThrow(/OpenAI API error/);
  });

  it('should throw error with missing API key', async () => {
    delete process.env.OPENAI_API_KEY;

    const mockMetadata = {
      url: 'https://example.com',
      pageTitle: 'Test Page',
      metaDescription: 'Test description',
      metaKeywords: null,
      h1Tags: ['Heading 1'],
      imageCount: 5,
      hasFavicon: true,
      titleLength: 9,
      descriptionLength: 16,
    };

    await expect(generateSeoFeedback(mockMetadata)).rejects.toThrow();
  });
});
