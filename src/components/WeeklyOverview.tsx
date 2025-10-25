import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import type { DayContent } from '../types';
import { LearningPlanGenerator } from '../utils/learningPlanGenerator';

interface WeeklyOverviewProps {
  days: DayContent[];
  currentWeek: number;
  completedDays: Set<number>;
  onDaySelect: (day: number) => void;
  onBack: () => void;
  onWeekChange: (week: number) => void;
}

const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({
  days,
  currentWeek,
  completedDays,
  onDaySelect,
  onBack,
  onWeekChange
}) => {
  const getWeekDays = (weekNumber: number): DayContent[] => {
    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = Math.min(startDay + 6, 90);

    return days.filter(day => day.day >= startDay && day.day <= endDay);
  };

  const weekDays = getWeekDays(currentWeek);
  const completedThisWeek = weekDays.filter(day => completedDays.has(day.day)).length;
  const totalHoursThisWeek = weekDays.reduce((total, day) => total + day.timeAllocation, 0);
  const completedHoursThisWeek = weekDays
    .filter(day => completedDays.has(day.day))
    .reduce((total, day) => total + day.timeAllocation, 0);

  return (
    <Container fluid className="py-4">
      {/* Modern Header */}
      <Row className="mb-4">
        <Col>
          <Card className="week-header-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="week-title">Week {currentWeek}</h1>
                  <p className="week-subtitle">
                    Days {weekDays[0]?.day} - {weekDays[weekDays.length - 1]?.day}
                  </p>
                </div>
                <div className="week-stats">
                  <div className="week-stat-item">
                    <div className="week-stat-number">{completedThisWeek}</div>
                    <div className="week-stat-label">Days</div>
                    <div className="week-stat-subtitle">out of {weekDays.length}</div>
                  </div>
                  <div className="week-stat-item">
                    <div className="week-stat-number">{completedHoursThisWeek}</div>
                    <div className="week-stat-label">Hours</div>
                    <div className="week-stat-subtitle">out of {totalHoursThisWeek}</div>
                  </div>
                  <div className="week-stat-item">
                    <div className="week-stat-number">
                      {((completedThisWeek / weekDays.length) * 100).toFixed(0)}%
                    </div>
                    <div className="week-stat-label">Progress</div>
                    <div className="week-stat-subtitle">completion rate</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation */}
      <Row className="mb-4">
        <Col>
          <Card className="navigation-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="outline-secondary" onClick={onBack} className="back-btn">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Dashboard
                </Button>

                <div className="week-navigation">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      if (currentWeek > 1) {
                        onWeekChange(currentWeek - 1);
                      }
                    }}
                    disabled={currentWeek <= 1}
                    className="nav-btn"
                  >
                    <i className="bi bi-chevron-left me-1"></i>
                    Week {currentWeek - 1}
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      if (currentWeek < 13) {
                        onWeekChange(currentWeek + 1);
                      }
                    }}
                    disabled={currentWeek >= 13}
                    className="nav-btn"
                  >
                    Week {currentWeek + 1}
                    <i className="bi bi-chevron-right ms-1"></i>
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Daily Cards Grid */}
      <Row>
        {weekDays.map((day) => {
          const isCompleted = completedDays.has(day.day);
          const dayName = LearningPlanGenerator.getDayOfWeekName(day.day);

          return (
            <Col md={6} lg={4} key={day.day} className="mb-4">
              <Card
                className={`day-card-modern ${isCompleted ? 'completed' : ''}`}
                onClick={() => onDaySelect(day.day)}
              >
                <Card.Header className={`day-card-header ${isCompleted ? 'completed' : ''}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="day-number">Day {day.day}</h5>
                      <small className="day-name">{dayName}</small>
                    </div>
                    {isCompleted && (
                      <div className="completion-badge">
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                    )}
                  </div>
                </Card.Header>

                <Card.Body className="day-card-body">
                  <div className="day-meta mb-3">
                    <Badge className={`day-type-badge ${day.isWeekend ? 'weekend' : 'weekday'}`}>
                      <i className="bi bi-calendar me-1"></i>
                      {day.isWeekend ? 'Weekend' : 'Weekday'}
                    </Badge>
                    <Badge className="time-badge">
                      <i className="bi bi-clock me-1"></i>
                      {day.timeAllocation}h
                    </Badge>
                  </div>

                  <div className="videos-section">
                    <h6 className="videos-header">
                      <i className="bi bi-play-circle me-2"></i>
                      Videos ({day.videos.length})
                    </h6>
                    {day.videos.length > 0 ? (
                      <div className="videos-preview">
                        {day.videos.slice(0, 2).map((video, index) => (
                          <div key={index} className="video-preview-item">
                            <i className="bi bi-play-circle video-preview-icon"></i>
                            <span className="video-preview-title">
                              {video.title.length > 35
                                ? `${video.title.substring(0, 35)}...`
                                : video.title
                              }
                            </span>
                          </div>
                        ))}
                        {day.videos.length > 2 && (
                          <div className="more-videos-preview">
                            <i className="bi bi-three-dots me-1"></i>
                            +{day.videos.length - 2} more videos
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-videos-preview">
                        <i className="bi bi-video-slash"></i>
                        <span>No videos scheduled</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant={isCompleted ? 'outline-success' : 'primary'}
                    size="sm"
                    className={`day-action-btn ${isCompleted ? 'completed' : ''}`}
                    disabled={day.videos.length === 0}
                  >
                    <i className={`bi bi-${isCompleted ? 'arrow-clockwise' : 'play-fill'} me-2`}></i>
                    {isCompleted ? 'Review Day' : 'Start Learning'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Week Summary */}
      <Row className="mt-4">
        <Col>
          <Card className="week-summary-card">
            <Card.Header className="week-summary-header">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Week {currentWeek} Summary
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="summary-section">
                    <h6 className="summary-title">
                      <i className="bi bi-lightbulb me-2"></i>
                      Learning Focus
                    </h6>
                    <p className="summary-content">
                      This week covers fundamental AI concepts, machine learning basics,
                      and practical applications. Focus on understanding core principles
                      and building a strong foundation.
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="summary-section">
                    <h6 className="summary-title">
                      <i className="bi bi-clock me-2"></i>
                      Time Commitment
                    </h6>
                    <div className="time-commitment-list">
                      <div className="time-item">
                        <span className="time-label">Weekdays:</span>
                        <span className="time-value">1 hour per day (5 hours total)</span>
                      </div>
                      <div className="time-item">
                        <span className="time-label">Weekend:</span>
                        <span className="time-value">3 hours per day (6 hours total)</span>
                      </div>
                      <div className="time-item total">
                        <span className="time-label">Total:</span>
                        <span className="time-value">{totalHoursThisWeek} hours this week</span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WeeklyOverview;
