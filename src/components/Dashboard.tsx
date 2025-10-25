import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
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
  const [currentDay, setCurrentDay] = useState(14); // Start from day 14 since 1-13 are completed
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [view, setView] = useState<'dashboard' | 'day' | 'week'>('dashboard');
  const progressBarRef = useRef<HTMLDivElement>(null);

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

        // Ensure initial progress is set (first 13 days completed)
        await ProgressService.ensureInitialProgress(currentUser.id);

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

  // Update progress bar width
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progressPercentage}%`;
    }
  }, [progressPercentage]);

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


  const getTotalHoursCompleted = () => {
    return userStats?.total_hours_learned || 0;
  };

  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Ensure initial progress is set (first 13 days completed)
      await ProgressService.ensureInitialProgress(currentUser.id);

      const [completedDaysSet, stats] = await Promise.all([
        ProgressService.getCompletedDays(currentUser.id),
        ProgressService.getUserStats(currentUser.id)
      ]);

      setCompletedDays(completedDaysSet);
      setUserStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh user data');
      console.error('Error refreshing user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container fluid className="py-4">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-muted">Loading your progress...</p>
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
    <div className="content-wrapper">
      {/* Compact Stats Bar */}
      <div className="compact-stats-bar">
        <div className="stat-item-compact">
          <div className="stat-number-compact">{currentDay}</div>
          <div className="stat-label-compact">Current Day</div>
          <div className="stat-subtitle-compact">
            {LearningPlanGenerator.getDayOfWeekName(currentDay)}
          </div>
        </div>
        <div className="stat-item-compact">
          <div className="stat-number-compact">{userStats?.total_days_completed || 0}</div>
          <div className="stat-label-compact">Days Completed</div>
          <div className="stat-subtitle-compact">out of 90 days</div>
        </div>
        <div className="stat-item-compact">
          <div className="stat-number-compact">{getTotalHoursCompleted()}</div>
          <div className="stat-label-compact">Hours Learned</div>
          <div className="stat-subtitle-compact">total study time</div>
        </div>
        <div className="stat-item-compact">
          <div className="stat-number-compact">{userStats?.current_streak || 0}</div>
          <div className="stat-label-compact">Current Streak</div>
          <div className="stat-subtitle-compact">days in a row</div>
        </div>
      </div>

      {/* Day Tabs */}
      <Row className="mb-3">
        <Col>
          <div className="day-tabs-container">
            <div className="day-tabs">
              {Array.from({ length: 7 }, (_, i) => {
                const day = Math.max(1, currentDay - 3 + i);
                const isCompleted = completedDays.has(day);
                const isCurrent = day === currentDay;
                const dayName = LearningPlanGenerator.getDayOfWeekName(day);

                return (
                  <button
                    key={day}
                    className={`day-tab ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => setCurrentDay(day)}
                  >
                    <div className="day-tab-number">Day {day}</div>
                    <div className="day-tab-name">{dayName.slice(0, 3)}</div>
                    {isCompleted && <div className="day-tab-check">✓</div>}
                  </button>
                );
              })}
            </div>
            <div className="day-tabs-actions">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setView('week')}
                className="action-btn-small"
              >
                <i className="bi bi-calendar-week me-1"></i>
                This Week
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Compact Learning Content */}
      <Row className="mb-4">
        <Col lg={8} md={12} className="mb-3">
          <Card className="learning-card-compact">
            <Card.Header className="learning-card-header-compact">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Today's Videos ({currentDayData?.videos.length || 0})</h6>
                  <small className="text-muted">
                    {currentDayData?.isWeekend ? 'Weekend' : 'Weekday'} • {currentDayData?.timeAllocation || 0}h
                  </small>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setView('day')}
                  disabled={!currentDayData || currentDayData.videos.length === 0}
                  className="start-learning-btn-small"
                >
                  <i className="bi bi-play-fill me-1"></i>
                  Start Learning
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="learning-card-body-compact">
              {currentDayData ? (
                <>
                  {currentDayData.videos.length > 0 ? (
                    <div className="videos-list-compact">
                      {currentDayData.videos.slice(0, 3).map((video, index) => (
                        <div key={index} className="video-item-compact">
                          <i className="bi bi-play-circle video-icon-compact"></i>
                          <span className="video-title-compact">{video.title}</span>
                        </div>
                      ))}
                      {currentDayData.videos.length > 3 && (
                        <div className="more-videos-compact">
                          +{currentDayData.videos.length - 3} more videos
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-videos-compact">
                      <i className="bi bi-video-slash"></i>
                      <span>No videos scheduled</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="loading-content-compact">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading...
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="quick-actions-compact">
            <Card.Header className="quick-actions-header">
              <h6 className="mb-0">Quick Actions</h6>
            </Card.Header>
            <Card.Body className="quick-actions-body">
              <div className="quick-actions-grid">
                <button
                  className="quick-action-btn"
                  onClick={() => setView('week')}
                >
                  <i className="bi bi-calendar-week"></i>
                  <span>This Week</span>
                </button>
                <button
                  className="quick-action-btn"
                  onClick={refreshUserData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <i className="bi bi-arrow-clockwise"></i>
                  )}
                  <span>Refresh</span>
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => {
                    const nextDay = Math.min(currentDay + 1, 90);
                    setCurrentDay(nextDay);
                  }}
                  disabled={currentDay >= 90}
                >
                  <i className="bi bi-skip-forward"></i>
                  <span>Next Day</span>
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => {
                    const prevDay = Math.max(currentDay - 1, 1);
                    setCurrentDay(prevDay);
                  }}
                  disabled={currentDay <= 1}
                >
                  <i className="bi bi-skip-backward"></i>
                  <span>Prev Day</span>
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
