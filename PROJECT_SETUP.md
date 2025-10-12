# AI Learning Platform - Setup Guide

## Overview
A comprehensive 90-day AI learning platform with curated YouTube videos, AI-generated summaries, quizzes, and progress tracking. Users spend 1 hour/day on weekdays and 3 hours on weekends.

## Features
- ✅ User registration with localStorage persistence
- ✅ 90-day structured learning plan starting from Monday
- ✅ Curated YouTube video content
- ✅ AI-generated summaries (2 paragraphs) using Google Gemini
- ✅ Key learning points (10-15 points per day)
- ✅ Interactive quizzes (5 questions per day)
- ✅ Progress tracking and completion status
- ✅ Beautiful Bootstrap UI with gradient design
- ✅ Weekly overview and daily breakdowns
- ✅ Time allocation (1hr weekdays, 3hrs weekends)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Get your API key from:** https://makersuite.google.com/app/apikey

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or next available port).

## Project Structure

```
src/
├── App.tsx                 # Main app with user registration
├── App.css                 # Custom styling
├── types.ts                # TypeScript interfaces
├── components/
│   ├── Dashboard.tsx       # Main dashboard with stats
│   ├── DayViewer.tsx       # Daily learning view
│   ├── QuizComponent.tsx   # Interactive quiz
│   ├── VideoPlayer.tsx     # YouTube video embed
│   └── WeeklyOverview.tsx  # Week summary
├── services/
│   └── geminiService.ts    # Google Gemini AI integration
└── utils/
    └── learningPlanGenerator.ts  # 90-day curriculum data
```

## How It Works

### User Registration
1. Users enter their name on first visit
2. User data stored in localStorage as JSON:
```json
[
  {
    "name": "John Doe",
    "enrolledDate": "2025-01-01T00:00:00.000Z"
  }
]
```

### Learning Flow
1. **Dashboard** - View progress, current day, completed hours
2. **Daily Learning**:
   - Watch curated YouTube videos
   - AI generates summary and key points
   - Take quiz (60% pass rate required)
3. **Weekly Overview** - Track week progress and review days
4. **Progress Tracking** - Days completed, hours learned, percentage complete

### Time Allocation
- **Weekdays (Mon-Fri)**: 1 hour per day
- **Weekends (Sat-Sun)**: 3 hours per day
- **Total**: 11 hours per week, ~132 hours over 90 days

## API Integration

### Gemini AI (`@google/genai`)
Used to generate:
- **Summary**: 2-paragraph overview of day's videos
- **Key Points**: 10-15 bullet points of main concepts
- **Quiz**: 5 multiple-choice questions with explanations

Example API call:
```typescript
const geminiService = new GeminiService(apiKey);
const content = await geminiService.generateContentFromVideos(videos);
// Returns: { summary, keyPoints, quiz }
```

## Data Format

### Learning Plan Structure
```typescript
const aiLearningPlan = {
  day1: [
    {
      title: "Video Title",
      link: "https://youtube.com/watch?v=xxxxx"
    }
  ],
  day2: [...],
  // ... up to day90
}
```

### User Data Storage
```typescript
interface UserData {
  name: string;
  enrolledDate: string;
}
```

Stored in `localStorage.aiLearningUsers` as JSON array.

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Bootstrap 5** - UI components
- **React Bootstrap** - React components
- **Bootstrap Icons** - Icon library
- **@google/genai** - Gemini AI integration
- **Vite** - Build tool

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Environment Variables
- `VITE_GEMINI_API_KEY` - Your Google Gemini API key

## Customization

### Update Video Content
Edit `src/utils/learningPlanGenerator.ts` and update the `sampleAiLearningPlan` object with your video links.

### Modify Time Allocation
Change in `learningPlanGenerator.ts`:
```typescript
timeAllocation: isWeekend ? 3 : 1  // Modify hours here
```

### Change Theme Colors
Update `src/App.css` gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Set environment variable: `VITE_GEMINI_API_KEY`
2. Connect your Git repository
3. Deploy with default Vite settings

## Troubleshooting

### API Key Issues
- Ensure `.env` file exists with `VITE_GEMINI_API_KEY`
- Restart dev server after adding API key
- Check console for API errors

### YouTube Videos Not Loading
- Check video links are valid
- Ensure videos allow embedding
- Some videos may be region-restricted

### LocalStorage Issues
- Check browser allows localStorage
- Clear browser cache if data corrupted
- Use browser DevTools → Application → Local Storage

## License
MIT License - Free to use and modify

## Support
For issues or questions, please check the documentation or create an issue in the repository.

