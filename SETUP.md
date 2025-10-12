# AI Learning Platform - Quick Setup

## Setup in 3 Steps

### 1. Add your Gemini API Key
Edit the `.env` file and add your API key:
```
VITE_GEMINI_API_KEY=your_api_key_here
```
Get your key from: https://makersuite.google.com/app/apikey

### 2. Start the app
```bash
npm run dev
```

### 3. Open in browser
Navigate to: http://localhost:5173

## That's it! 🎉

### Features:
- ✅ Full-width, clean UI
- ✅ 90-day AI learning curriculum
- ✅ Video lessons + AI summaries + Quizzes
- ✅ 1 hour/day weekdays, 3 hours weekends
- ✅ Progress tracking
- ✅ User registration stored in localStorage

### Your Data:
- User names stored in: `localStorage.aiLearningUsers`
- Progress tracked automatically
- No backend needed!

### Customize Videos:
Edit `src/utils/learningPlanGenerator.ts` to change video links.

