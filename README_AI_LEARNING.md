# AI Learning Platform

A comprehensive 90-day AI learning platform that generates personalized content from YouTube videos using Google's Gemini API.

## Features

- **90-Day Learning Plan**: Structured learning with 1 hour on weekdays, 3 hours on weekends
- **YouTube Integration**: Embedded video players for seamless learning
- **AI-Generated Content**: 
  - 2-paragraph summaries for each day
  - 10-15 key learning points
  - 5-question quizzes with explanations
- **Progress Tracking**: Visual progress indicators and completion tracking
- **Beautiful UI**: Modern Bootstrap-based interface
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @google/genai bootstrap react-bootstrap bootstrap-icons
```

### 2. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for use in the application

### 3. Prepare Your Learning Plan
Create your learning plan in this format:

```javascript
const aiLearningPlan = {
  day1: [
    {title: "Introduction to AI", link: "https://youtube.com/watch?v=VIDEO_ID"},
    {title: "Machine Learning Basics", link: "https://youtube.com/watch?v=VIDEO_ID"}
  ],
  day2: [
    {title: "Neural Networks", link: "https://youtube.com/watch?v=VIDEO_ID"}
  ],
  // ... continue for all 90 days
}
```

### 4. Run the Application
```bash
npm run dev
```

## Usage

1. **Setup**: Enter your Gemini API key when prompted
2. **Daily Learning**: 
   - View today's videos
   - Read AI-generated summaries
   - Review key learning points
   - Take the quiz (60% required to pass)
3. **Progress Tracking**: Monitor your completion across 90 days
4. **Weekly View**: See your weekly progress and plan ahead

## Learning Schedule

- **Weekdays (Monday-Friday)**: 1 hour per day
- **Weekends (Saturday-Sunday)**: 3 hours per day
- **Total Duration**: 90 days (13 weeks)
- **Total Hours**: ~180 hours of structured learning

## Key Components

### Dashboard
- Overview of progress and current day
- Quick navigation to different sections
- Progress statistics and completion tracking

### Daily Viewer
- Embedded YouTube videos
- AI-generated summaries and key points
- Interactive quizzes with immediate feedback

### Weekly Overview
- Week-by-week progress visualization
- Easy navigation between days
- Time allocation tracking

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **UI Framework**: Bootstrap 5 + React Bootstrap
- **AI Integration**: Google Gemini API (@google/genai)
- **Build Tool**: Vite
- **Styling**: Bootstrap CSS + Custom CSS

## API Integration

The platform uses Google's Gemini API to generate:
- Comprehensive summaries from video titles
- Key learning points (10-15 per day)
- Quiz questions with multiple choice answers
- Explanations for correct answers

## File Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard
│   ├── DayViewer.tsx         # Individual day content
│   ├── VideoPlayer.tsx       # YouTube video player
│   ├── QuizComponent.tsx     # Interactive quiz
│   └── WeeklyOverview.tsx    # Weekly progress view
├── services/
│   └── geminiService.ts      # Gemini API integration
├── utils/
│   └── learningPlanGenerator.ts # Learning plan utilities
├── types.ts                  # TypeScript type definitions
└── App.tsx                   # Main application component
```

## Customization

### Adding More Days
Update the `sampleAiLearningPlan` in `learningPlanGenerator.ts` with your video content for all 90 days.

### Modifying Quiz Requirements
Change the passing score in `QuizComponent.tsx` (currently set to 60%).

### Adjusting Time Allocations
Modify the time allocation logic in `LearningPlanGenerator.generateDayStructure()`.

## Troubleshooting

### Common Issues

1. **API Key Issues**: Ensure your Gemini API key is valid and has proper permissions
2. **Video Loading**: Check that YouTube URLs are accessible and properly formatted
3. **Build Errors**: Run `npm install` to ensure all dependencies are installed

### Development Mode
The app includes fallback content when the Gemini API is unavailable, allowing you to test the interface without an API key.

## Contributing

Feel free to extend this platform with additional features:
- Progress export/import
- Social learning features
- Advanced analytics
- Custom learning paths
- Integration with other video platforms

## License

This project is open source and available under the MIT License.
