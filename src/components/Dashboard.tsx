import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import type { DayContent, LearningPlan, AuthUser, UserStats } from '../types';
import { LearningPlanGenerator } from '../utils/learningPlanGenerator';
import { ProgressService } from '../services/progressService';
import DayViewer from './DayViewer';
import WeeklyOverview from './WeeklyOverview';

interface DashboardProps {
  aiLearningPlan: LearningPlan;
  geminiApiKey: string;
  currentUser: AuthUser;
}

const Dashboard: React.FC<DashboardProps> = ({ aiLearningPlan, geminiApiKey, currentUser }) => {
  const [days, setDays] = useState<DayContent[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [view, setView] = useState<'dashboard' | 'day' | 'week'>('dashboard');

  useEffect(() => {
    const generatedDays = LearningPlanGenerator.generateDayStructure(aiLearningPlan);
    setDays(generatedDays);
  }, [aiLearningPlan]);

  // Load user progress and stats
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [completedDaysSet, stats] = await Promise.all([
          ProgressService.getCompletedDays(currentUser.id),
          ProgressService.getUserStats(currentUser.id)
        ]);

        setCompletedDays(completedDaysSet);
        setUserStats(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to load user data');
        console.error('Error loading user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id) {
      loadUserData();
    }
  }, [currentUser?.id]);

  const currentDayData = days.find(d => d.day === currentDay);
  const progressPercentage = (completedDays.size / 90) * 100;
  const currentWeek = LearningPlanGenerator.getWeekNumber(currentDay);

  const markDayComplete = async (day: number, timeSpent?: number, quizScore?: number, notes?: string) => {
    try {
      await ProgressService.markDayComplete(currentUser.id, day, timeSpent, quizScore, notes);
      setCompletedDays(prev => new Set([...prev, day]));

      // Refresh stats
      const stats = await ProgressService.getUserStats(currentUser.id);
      setUserStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to save progress');
      console.error('Error marking day complete:', err);
    }
  };

  const markDayIncomplete = async (day: number) => {
    try {
      await ProgressService.markDayIncomplete(currentUser.id, day);
      setCompletedDays(prev => {
        const newSet = new Set(prev);
        newSet.delete(day);
        return newSet;
      });

      // Refresh stats
      const stats = await ProgressService.getUserStats(currentUser.id);
      setUserStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to update progress');
      console.error('Error marking day incomplete:', err);
    }
  };

  const getTotalHoursCompleted = () => {
    return userStats?.total_hours_learned || 0;
  };

  if (isLoading) {
    return (
      <Container fluid className="py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading your progress...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  if (view === 'day' && currentDayData) {
    return (
      <DayViewer
        dayData={currentDayData}
        geminiApiKey={geminiApiKey}
        onComplete={(timeSpent?: number, quizScore?: number, notes?: string) =>
          markDayComplete(currentDay, timeSpent, quizScore, notes)
        }
        onBack={() => setView('dashboard')}
        isCompleted={completedDays.has(currentDay)}
      />
    );
  }

  if (view === 'week') {
    return (
      <WeeklyOverview
        days={days}
        currentWeek={currentWeek}
        completedDays={completedDays}
        onDaySelect={(day: number) => {
          setCurrentDay(day);
          setView('day');
        }}
        onBack={() => setView('dashboard')}
        onWeekChange={(week: number) => {
          // Calculate first day of the week
          const firstDayOfWeek = (week - 1) * 7 + 1;
          setCurrentDay(firstDayOfWeek);
        }}
      />
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h1 className="display-4 mb-0">AI Learning Journey</h1>
              <p className="lead mb-0">90-Day Comprehensive AI & Machine Learning Course</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-primary">{currentDay}</h2>
              <p className="mb-0">Current Day</p>
              <small className="text-muted">
                {LearningPlanGenerator.getDayOfWeekName(currentDay)}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-success">{userStats?.total_days_completed || 0}</h2>
              <p className="mb-0">Days Completed</p>
              <small className="text-muted">out of 90 days</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-info">{getTotalHoursCompleted()}</h2>
              <p className="mb-0">Hours Learned</p>
              <small className="text-muted">total study time</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-warning">{userStats?.current_streak || 0}</h2>
              <p className="mb-0">Current Streak</p>
              <small className="text-muted">days in a row</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Overall Progress</h5>
                <Badge bg="primary">{progressPercentage.toFixed(1)}%</Badge>
              </div>
              <ProgressBar
                now={progressPercentage}
                variant="success"
                style={{ height: '10px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Today's Learning</h5>
            </Card.Header>
            <Card.Body>
              {currentDayData ? (
                <>
                  <div className="mb-3">
                    <Badge bg={currentDayData.isWeekend ? 'info' : 'secondary'}>
                      {currentDayData.isWeekend ? 'Weekend' : 'Weekday'}
                    </Badge>
                    <Badge bg="outline-primary" className="ms-2">
                      {currentDayData.timeAllocation} hour{currentDayData.timeAllocation > 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <h6>Videos for Today:</h6>
                  {currentDayData.videos.length > 0 ? (
                    <ul className="list-unstyled">
                      {currentDayData.videos.map((video, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-play-circle me-2"></i>
                          {video.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No videos scheduled for today</p>
                  )}

                  <Button
                    variant="primary"
                    onClick={() => setView('day')}
                    disabled={currentDayData.videos.length === 0}
                    className="w-100"
                  >
                    Start Today's Learning
                  </Button>
                </>
              ) : (
                <p className="text-muted">Loading today's content...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => setView('week')}
                >
                  View This Week
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    const nextDay = Math.min(currentDay + 1, 90);
                    setCurrentDay(nextDay);
                  }}
                  disabled={currentDay >= 90}
                >
                  Skip to Next Day
                </Button>
                <Button
                  variant="outline-info"
                  onClick={() => {
                    const prevDay = Math.max(currentDay - 1, 1);
                    setCurrentDay(prevDay);
                  }}
                  disabled={currentDay <= 1}
                >
                  Go to Previous Day
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Progress</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {Array.from({ length: 7 }, (_, i) => {
                  const day = Math.max(1, currentDay - 6 + i);
                  const isCompleted = completedDays.has(day);
                  const isCurrent = day === currentDay;

                  return (
                    <Col key={day} className="text-center mb-2">
                      <div
                        className={`p-2 rounded ${isCurrent ? 'bg-primary text-white' :
                          isCompleted ? 'bg-success text-white' :
                            'bg-light'
                          }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCurrentDay(day as number)}
                      >
                        <small>Day {day}</small>
                        <br />
                        <small>{LearningPlanGenerator.getDayOfWeekName(day).slice(0, 3)}</small>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
