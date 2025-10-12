import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Dashboard from './components/Dashboard';
import type { LearningPlan } from './types';
import { sampleAiLearningPlan } from './utils/learningPlanGenerator';
import './App.css';

interface UserData {
  name: string;
  enrolledDate: string;
}

function App() {
  // Get API key from environment variable
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [aiLearningPlan] = useState<LearningPlan>(sampleAiLearningPlan);
  const [showRegistration, setShowRegistration] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // Check if user is already registered
  useEffect(() => {
    const storedUsers = localStorage.getItem('aiLearningUsers');
    if (storedUsers) {
      try {
        const users: UserData[] = JSON.parse(storedUsers);
        if (users.length > 0) {
          // Use the most recent user
          const user = users[users.length - 1];
          setCurrentUser(user);
          setShowRegistration(false);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const handleUserRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      const newUser: UserData = {
        name: userName.trim(),
        enrolledDate: new Date().toISOString(),
      };

      // Get existing users or create new array
      let users: UserData[] = [];
      const storedUsers = localStorage.getItem('aiLearningUsers');
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      // Add new user
      users.push(newUser);
      localStorage.setItem('aiLearningUsers', JSON.stringify(users));
      
      setCurrentUser(newUser);
      setShowRegistration(false);
    }
  };

  // Function to update learning plan from JSON
  // const handlePlanUpdate = (planText: string) => {
  //   try {
  //     const parsedPlan = JSON.parse(planText);
  //     setAiLearningPlan(parsedPlan);
  //   } catch (error) {
  //     console.error('Invalid JSON format for learning plan');
  //   }
  // };

  if (showRegistration) {
    return (
      <div className="registration-wrapper">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <Card className="shadow-lg border-0">
                <div className="card-header-gradient text-white text-center py-4">
                  <div className="mb-3">
                    <i className="bi bi-mortarboard-fill" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h1 className="display-5 mb-2">AI Learning Platform</h1>
                  <p className="lead mb-0">90-Day Comprehensive AI Course</p>
                </div>
                <Card.Body className="p-5">
                  <Alert variant="info" className="mb-4">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <strong>Welcome!</strong> Start your AI learning journey today. 
                    Complete this 90-day program with curated video content, quizzes, and AI-generated summaries.
                  </Alert>
                  
                  <Form onSubmit={handleUserRegistration}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">
                        <i className="bi bi-person-fill me-2"></i>Your Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        value={userName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                        required
                        className="form-control-lg"
                      />
                      <Form.Text className="text-muted">
                        We'll personalize your learning experience
                      </Form.Text>
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button variant="primary" type="submit" size="lg" className="py-3">
                        <i className="bi bi-rocket-takeoff-fill me-2"></i>
                        Start Learning Journey
                      </Button>
                    </div>
                  </Form>

                  <hr className="my-4" />
                  
                  <div>
                    <h5 className="mb-3">
                      <i className="bi bi-calendar-check me-2"></i>
                      What You'll Get:
                    </h5>
                    <ul className="feature-list">
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i>90 days of structured AI learning</li>
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i>1 hour/day on weekdays, 3 hours on weekends</li>
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i>Curated YouTube videos from top creators</li>
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i>AI-generated summaries & key points</li>
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i>Interactive quizzes to test knowledge</li>
                      <li><i className="bi bi-check-circle-fill text-success me-2"></i>Track your progress and achievements</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Welcome Header */}
      {currentUser && (
        <div className="welcome-banner">
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0 text-white">
                  <i className="bi bi-person-circle me-2"></i>
                  Welcome back, <strong>{currentUser.name}</strong>!
                </h5>
              </div>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    setShowRegistration(true);
                    setCurrentUser(null);
                  }
                }}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </Button>
            </div>
          </Container>
        </div>
      )}

      <Dashboard 
        aiLearningPlan={aiLearningPlan}
        geminiApiKey={geminiApiKey}
      />
    </div>
  );
}

export default App;
