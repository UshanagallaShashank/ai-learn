import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form, Modal } from 'react-bootstrap';
import type { DayContent, GeneratedContent } from '../types';
import { LearningPlanGenerator } from '../utils/learningPlanGenerator';
import GeminiService from '../services/geminiService';
import VideoPlayer from './VideoPlayer';
import QuizComponent from './QuizComponent';

interface DayViewerProps {
  dayData: DayContent;
  geminiApiKey: string;
  onComplete: (timeSpent?: number, quizScore?: number, notes?: string) => void;
  onBack: () => void;
  isCompleted: boolean;
}

const DayViewer: React.FC<DayViewerProps> = ({
  dayData,
  geminiApiKey,
  onComplete,
  onBack,
  isCompleted
}) => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'videos' | 'summary' | 'quiz'>('videos');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    if (dayData.videos.length > 0 && !generatedContent) {
      generateContent();
    }
  }, [dayData]);

  const generateContent = async () => {
    if (!geminiApiKey) {
      setError('Gemini API key is required. Please set your API key.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const geminiService = new GeminiService(geminiApiKey);
      const content = await geminiService.generateContentFromVideos(dayData.videos);
      setGeneratedContent(content);
    } catch (err) {
      setError('Failed to generate content. Using fallback content.');
      // Use fallback content
      const geminiService = new GeminiService('');
      const fallbackContent = await geminiService.generateContentFromVideos(dayData.videos);
      setGeneratedContent(fallbackContent);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizCompleted(true);
    setQuizScore(score);
    if (score >= 3) { // Pass with 60% or higher
      setShowCompletionModal(true);
    }
  };

  const handleCompleteDay = () => {
    onComplete(timeSpent, quizScore, notes);
    setShowCompletionModal(false);
  };

  const dayOfWeek = LearningPlanGenerator.getDayOfWeekName(dayData.day);

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-gradient-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="display-5 mb-1">Day {dayData.day}</h1>
                  <p className="lead mb-0">{dayOfWeek}</p>
                </div>
                <div className="text-end">
                  <Badge bg={dayData.isWeekend ? 'info' : 'light'} className="mb-2">
                    {dayData.isWeekend ? 'Weekend' : 'Weekday'}
                  </Badge>
                  <br />
                  <Badge bg="outline-light">
                    {dayData.timeAllocation} hour{dayData.timeAllocation > 1 ? 's' : ''}
                  </Badge>
                  {isCompleted && (
                    <>
                      <br />
                      <Badge bg="success" className="mt-2">
                        ✓ Completed
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="outline-secondary" onClick={onBack}>
                  ← Back to Dashboard
                </Button>

                <div className="btn-group" role="group">
                  <Button
                    variant={currentSection === 'videos' ? 'primary' : 'outline-primary'}
                    onClick={() => setCurrentSection('videos')}
                  >
                    Videos
                  </Button>
                  <Button
                    variant={currentSection === 'summary' ? 'primary' : 'outline-primary'}
                    onClick={() => setCurrentSection('summary')}
                    disabled={!generatedContent}
                  >
                    Summary & Key Points
                  </Button>
                  <Button
                    variant={currentSection === 'quiz' ? 'primary' : 'outline-primary'}
                    onClick={() => setCurrentSection('quiz')}
                    disabled={!generatedContent}
                  >
                    Quiz
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Content Sections */}
      {currentSection === 'videos' && (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4 className="mb-0">Today's Videos ({dayData.videos.length})</h4>
              </Card.Header>
              <Card.Body>
                {dayData.videos.length > 0 ? (
                  <Row>
                    {dayData.videos.map((video, index) => (
                      <Col md={6} key={index} className="mb-4">
                        <VideoPlayer video={video} geminiApiKey={geminiApiKey} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Alert variant="info">
                    No videos scheduled for this day.
                  </Alert>
                )}

                {dayData.videos.length > 0 && (
                  <div className="text-center mt-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => setCurrentSection('summary')}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Generating Content...
                        </>
                      ) : (
                        'Continue to Summary →'
                      )}
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {currentSection === 'summary' && generatedContent && (
        <Row>
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h4 className="mb-0">Summary</h4>
              </Card.Header>
              <Card.Body>
                <p className="lead">{generatedContent.summary}</p>
                <div className="text-center mt-4">
                  <Button
                    variant="primary"
                    onClick={() => setCurrentSection('quiz')}
                  >
                    Take Quiz →
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h4 className="mb-0">Key Learning Points</h4>
              </Card.Header>
              <Card.Body>
                <ul className="list-group list-group-flush">
                  {generatedContent.keyPoints.map((point, index) => (
                    <li key={index} className="list-group-item border-0 px-0">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {currentSection === 'quiz' && generatedContent && (
        <Row>
          <Col>
            <QuizComponent
              questions={generatedContent.quiz}
              onComplete={handleQuizComplete}
              isCompleted={quizCompleted}
            />
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mt-4">
          <Col>
            <Alert variant="warning">
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Completion Modal */}
      <Modal show={showCompletionModal} onHide={() => setShowCompletionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            Complete Day {dayData.day}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <i className="bi bi-trophy-fill me-2"></i>
            Congratulations! You've completed the quiz with a score of {quizScore}/5.
          </Alert>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-clock-fill me-2"></i>
                Time Spent (minutes)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter time spent in minutes"
                value={timeSpent}
                onChange={(e) => setTimeSpent(parseInt(e.target.value) || 0)}
                min="1"
                max="480"
              />
              <Form.Text className="text-muted">
                How long did you spend on today's learning?
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-journal-text me-2"></i>
                Notes (Optional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add any notes about what you learned today..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Form.Text className="text-muted">
                Share your thoughts, key takeaways, or questions.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCompletionModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCompleteDay}>
            <i className="bi bi-check-circle-fill me-2"></i>
            Complete Day
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DayViewer;
