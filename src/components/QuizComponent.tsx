import React, { useState } from 'react';
import { Card, Button, Form, Alert, Badge, ProgressBar } from 'react-bootstrap';
import type { QuizQuestion } from '../types';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  isCompleted: boolean;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete, isCompleted }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    onComplete(score);
  };

  const calculateScore = (): number => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScorePercentage = (): number => {
    return (calculateScore() / questions.length) * 100;
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setQuizStarted(true);
  };

  if (!quizStarted && !isCompleted) {
    return (
      <Card>
        <Card.Header>
          <h4 className="mb-0">Knowledge Check Quiz</h4>
        </Card.Header>
        <Card.Body className="text-center">
          <p className="lead">Test your understanding with {questions.length} questions</p>
          <p className="text-muted">
            You need to score at least 60% to complete this day's learning.
          </p>
          <Button variant="primary" size="lg" onClick={() => setQuizStarted(true)}>
            Start Quiz
          </Button>
        </Card.Body>
      </Card>
    );
  }

  if (showResults || isCompleted) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const passed = percentage >= 60;

    return (
      <Card>
        <Card.Header>
          <h4 className="mb-0">Quiz Results</h4>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className={`display-4 ${passed ? 'text-success' : 'text-warning'}`}>
              {score}/{questions.length}
            </h2>
            <p className="lead">
              {percentage.toFixed(0)}% - {passed ? 'Passed!' : 'Keep Learning!'}
            </p>
            <ProgressBar 
              now={percentage} 
              variant={passed ? 'success' : 'warning'}
              style={{ height: '10px' }}
              className="mb-3"
            />
          </div>

          {passed ? (
            <Alert variant="success">
              <strong>Congratulations!</strong> You've successfully completed today's learning objectives.
            </Alert>
          ) : (
            <Alert variant="warning">
              <strong>Good effort!</strong> Review the material and try again to improve your understanding.
            </Alert>
          )}

          <div className="mb-4">
            <h5>Review Your Answers:</h5>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">Question {index + 1}</h6>
                      <Badge bg={isCorrect ? 'success' : 'danger'}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                    <p className="mb-2">{question.question}</p>
                    
                    <div className="mb-2">
                      <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                    </div>
                    
                    {!isCorrect && (
                      <div className="mb-2">
                        <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="text-muted">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            {!passed && (
              <Button variant="primary" onClick={restartQuiz} className="me-2">
                Retake Quiz
              </Button>
            )}
            <Button variant="outline-secondary" onClick={() => window.location.reload()}>
              Back to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Question {currentQuestion + 1} of {questions.length}</h4>
          <Badge bg="primary">{progress.toFixed(0)}% Complete</Badge>
        </div>
        <ProgressBar now={progress} className="mt-2" style={{ height: '4px' }} />
      </Card.Header>
      <Card.Body>
        <h5 className="mb-4">{question.question}</h5>
        
        <Form>
          {question.options.map((option, index) => (
            <Form.Check
              key={index}
              type="radio"
              id={`option-${index}`}
              name="quiz-option"
              label={option}
              checked={selectedAnswers[currentQuestion] === index}
              onChange={() => handleAnswerSelect(index)}
              className="mb-3 p-3 border rounded"
              style={{ 
                backgroundColor: selectedAnswers[currentQuestion] === index ? '#e3f2fd' : 'transparent',
                cursor: 'pointer'
              }}
            />
          ))}
        </Form>

        <div className="d-flex justify-content-between mt-4">
          <Button 
            variant="outline-secondary" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === -1}
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next →'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuizComponent;
