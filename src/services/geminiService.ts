import { GoogleGenAI } from '@google/genai';
import type { GeneratedContent, VideoContent } from '../types';

class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateContentFromVideos(videos: VideoContent[]): Promise<GeneratedContent> {
    const videoTitles = videos.map(v => v.title).join(', ');
    
    const prompt = `
    Based on these AI/ML YouTube video titles: ${videoTitles}
    
    Please generate:
    1. A comprehensive 2-paragraph summary covering the main concepts
    2. 10-15 key learning points in bullet format
    3. 5 multiple-choice quiz questions with 4 options each
    
    Format your response as JSON with this structure:
    {
      "summary": "Two paragraph summary here...",
      "keyPoints": ["Point 1", "Point 2", ...],
      "quiz": [
        {
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Why this is correct..."
        }
      ]
    }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
      });
      
      const text = response.text || '';
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating content:', error);
      return this.getFallbackContent();
    }
  }

  private getFallbackContent(): GeneratedContent {
    return {
      summary: "This lesson covers fundamental AI concepts including machine learning algorithms, neural networks, and their practical applications. The content explores how artificial intelligence systems learn from data and make predictions or decisions based on patterns they discover.",
      keyPoints: [
        "Understanding machine learning fundamentals",
        "Neural network architecture basics",
        "Supervised vs unsupervised learning",
        "Deep learning concepts",
        "AI applications in real world",
        "Data preprocessing techniques",
        "Model training and validation",
        "Overfitting and underfitting",
        "Feature engineering importance",
        "AI ethics and bias considerations"
      ],
      quiz: [
        {
          question: "What is the main difference between supervised and unsupervised learning?",
          options: [
            "Supervised learning uses labeled data",
            "Unsupervised learning is faster",
            "Supervised learning doesn't need data",
            "There is no difference"
          ],
          correctAnswer: 0,
          explanation: "Supervised learning uses labeled training data to learn patterns."
        },
        {
          question: "What is a neural network?",
          options: [
            "A computer network",
            "A mathematical model inspired by biological neurons",
            "A type of database",
            "A programming language"
          ],
          correctAnswer: 1,
          explanation: "Neural networks are mathematical models inspired by how biological neurons work."
        }
      ]
    };
  }

  async recommendVideo(topic: string): Promise<string> {
    const prompt = `
    Imagine you are searching Google for: "${topic} tutorial youtube"
    
    What would be the TOP FIRST result from Google/YouTube search?
    
    Return the most popular, highly-viewed educational YouTube video for this topic.
    Think of videos that would appear first in a Google search.
    
    Important:
    - Return ONLY a valid YouTube URL (format: https://www.youtube.com/watch?v=VIDEO_ID)
    - No explanation, just the URL
    - Choose from well-known educational channels: 
      * freeCodeCamp, Traversy Media, Programming with Mosh
      * 3Blue1Brown, StatQuest, Simplilearn
      * edureka!, Great Learning, Coursera
      * Andrew Ng, Stanford, MIT OpenCourseWare
    
    Response format: https://www.youtube.com/watch?v=...
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
      });
      
      const text = response.text?.trim() || '';
      console.log('AI Video Recommendation Response:', text);
      
      // Extract YouTube URL (multiple formats)
      const urlPatterns = [
        /https?:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]{11})/,
        /https?:\/\/youtu\.be\/([\w-]{11})/,
        /youtube\.com\/watch\?v=([\w-]{11})/
      ];
      
      for (const pattern of urlPatterns) {
        const match = text.match(pattern);
        if (match) {
          const videoId = match[2] || match[1];
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      }
      
      // Fallback: Try to search for common topics
      return this.getFallbackVideoForTopic(topic);
    } catch (error) {
      console.error('Error recommending video:', error);
      return this.getFallbackVideoForTopic(topic);
    }
  }

  private getFallbackVideoForTopic(topic: string): string {
    const topicLower = topic.toLowerCase();
    
    // Common AI/ML topics with curated high-quality videos
    const fallbackVideos: { [key: string]: string } = {
      'artificial intelligence': 'https://www.youtube.com/watch?v=ad79nYk2keg',
      'ai': 'https://www.youtube.com/watch?v=JMUxmLyrhSk',
      'machine learning': 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
      'deep learning': 'https://www.youtube.com/watch?v=6M5VXKLf4D4',
      'neural network': 'https://www.youtube.com/watch?v=aircAruvnKk',
      'python': 'https://www.youtube.com/watch?v=rfscVS0vtbw',
      'cnn': 'https://www.youtube.com/watch?v=YRhxdVk_sIs',
      'rnn': 'https://www.youtube.com/watch?v=LHXXI4-IEns',
      'lstm': 'https://www.youtube.com/watch?v=8HyCNIVRbSU',
      'transformer': 'https://www.youtube.com/watch?v=4Bdc55j80l8',
      'gpt': 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
      'bert': 'https://www.youtube.com/watch?v=xI0HHN5XKDo',
      'nlp': 'https://www.youtube.com/watch?v=CMrHM8a3hqw',
      'computer vision': 'https://www.youtube.com/watch?v=WQeoO7MI0Bs',
      'gan': 'https://www.youtube.com/watch?v=8L11aMN5KY8',
      'reinforcement learning': 'https://www.youtube.com/watch?v=2pWv7GOvuf0',
      'supervised learning': 'https://www.youtube.com/watch?v=4qVRBYAdLAo',
      'unsupervised learning': 'https://www.youtube.com/watch?v=8dqdDEyzkFA',
      'tensorflow': 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
      'pytorch': 'https://www.youtube.com/watch?v=EMXfZB8FVUA',
      'numpy': 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
      'pandas': 'https://www.youtube.com/watch?v=vmEHCJofslg',
    };
    
    // Try to find matching topic
    for (const [key, url] of Object.entries(fallbackVideos)) {
      if (topicLower.includes(key)) {
        console.log(`Using fallback video for topic: ${key}`);
        return url;
      }
    }
    
    // Ultimate fallback: Popular AI introduction video
    console.log('Using default fallback video');
    return 'https://www.youtube.com/watch?v=JMUxmLyrhSk';
  }
}

export default GeminiService;
