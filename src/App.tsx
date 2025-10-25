import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Dashboard from './components/Dashboard';
import type { LearningPlan, AuthUser } from './types';
import { sampleAiLearningPlan } from './utils/learningPlanGenerator';
import { AuthService } from './services/authService';
import './App.css';

function App() {
  // Get API key from environment variable
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [aiLearningPlan] = useState<LearningPlan>(sampleAiLearningPlan);
  const [showAuth, setShowAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string>('');

  // Auth form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Check authentication state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setShowAuth(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setCurrentUser(user);
      setShowAuth(!user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.signUp(email, password, name);
      setAuthError('');
      // User will be automatically signed in after email confirmation
    } catch (error: any) {
      setAuthError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      setIsLoading(true);
      await AuthService.signIn(email, password);
      setAuthError('');
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
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

                  {authError && (
                    <Alert variant="danger" className="mb-4">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {authError}
                    </Alert>
                  )}

                  <div className="mb-4">
                    <div className="btn-group w-100" role="group">
                      <Button
                        variant={authMode === 'signin' ? 'primary' : 'outline-primary'}
                        onClick={() => setAuthMode('signin')}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant={authMode === 'signup' ? 'primary' : 'outline-primary'}
                        onClick={() => setAuthMode('signup')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>

                  <Form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp}>
                    {authMode === 'signup' && (
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <i className="bi bi-person-fill me-2"></i>Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <i className="bi bi-envelope-fill me-2"></i>Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                        className="form-control-lg"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <i className="bi bi-lock-fill me-2"></i>Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                        className="form-control-lg"
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters
                      </Form.Text>
                    </Form.Group>

                    {authMode === 'signup' && (
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          <i className="bi bi-lock-fill me-2"></i>Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    )}

                    <div className="d-grid">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="py-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            {authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                          </>
                        ) : (
                          <>
                            <i className={`bi bi-${authMode === 'signin' ? 'box-arrow-in-right' : 'person-plus'}-fill me-2`}></i>
                            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                          </>
                        )}
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
                onClick={handleSignOut}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </Button>
            </div>
          </Container>
        </div>
      )}

      {currentUser && (
        <Dashboard
          aiLearningPlan={aiLearningPlan}
          geminiApiKey={geminiApiKey}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;
