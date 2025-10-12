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
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="display-5 mb-1">Week {currentWeek}</h1>
                  <p className="lead mb-0">
                    Days {weekDays[0]?.day} - {weekDays[weekDays.length - 1]?.day}
                  </p>
                </div>
                <div className="text-end">
                  <Badge bg="light" text="dark" className="mb-2">
                    {completedThisWeek}/{weekDays.length} Days
                  </Badge>
                  <br />
                  <Badge bg="outline-light">
                    {completedHoursThisWeek}/{totalHoursThisWeek} Hours
                  </Badge>
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
                    variant="outline-primary"
                    onClick={() => {
                      if (currentWeek > 1) {
                        onWeekChange(currentWeek - 1);
                      }
                    }}
                    disabled={currentWeek <= 1}
                  >
                    ← Week {currentWeek - 1}
                  </Button>
                  <Button 
                    variant="outline-primary"
                    onClick={() => {
                      if (currentWeek < 13) {
                        onWeekChange(currentWeek + 1);
                      }
                    }}
                    disabled={currentWeek >= 13}
                  >
                    Week {currentWeek + 1} →
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Week Progress */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{completedThisWeek}</h3>
              <p className="mb-0">Days Completed</p>
              <small className="text-muted">out of {weekDays.length} days</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{completedHoursThisWeek}</h3>
              <p className="mb-0">Hours Completed</p>
              <small className="text-muted">out of {totalHoursThisWeek} hours</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">
                {((completedThisWeek / weekDays.length) * 100).toFixed(0)}%
              </h3>
              <p className="mb-0">Week Progress</p>
              <small className="text-muted">completion rate</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Daily Cards */}
      <Row>
        {weekDays.map((day) => {
          const isCompleted = completedDays.has(day.day);
          const dayName = LearningPlanGenerator.getDayOfWeekName(day.day);
          
          return (
            <Col md={6} lg={4} key={day.day} className="mb-4">
              <Card 
                className={`h-100 ${isCompleted ? 'border-success' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onDaySelect(day.day)}
              >
                <Card.Header className={`${isCompleted ? 'bg-success text-white' : 'bg-light'}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Day {day.day}</h5>
                    {isCompleted && (
                      <Badge bg="light" text="success">
                        ✓ Complete
                      </Badge>
                    )}
                  </div>
                  <small className={isCompleted ? 'text-light' : 'text-muted'}>
                    {dayName}
                  </small>
                </Card.Header>
                
                <Card.Body>
                  <div className="mb-3">
                    <Badge bg={day.isWeekend ? 'info' : 'secondary'} className="me-2">
                      {day.isWeekend ? 'Weekend' : 'Weekday'}
                    </Badge>
                    <Badge bg="outline-primary">
                      {day.timeAllocation} hour{day.timeAllocation > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <h6 className="mb-2">Videos ({day.videos.length})</h6>
                  {day.videos.length > 0 ? (
                    <ul className="list-unstyled mb-3">
                      {day.videos.slice(0, 2).map((video, index) => (
                        <li key={index} className="mb-1">
                          <small className="text-muted">
                            <i className="bi bi-play-circle me-1"></i>
                            {video.title.length > 40 
                              ? `${video.title.substring(0, 40)}...` 
                              : video.title
                            }
                          </small>
                        </li>
                      ))}
                      {day.videos.length > 2 && (
                        <li>
                          <small className="text-muted">
                            +{day.videos.length - 2} more videos
                          </small>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted small mb-3">No videos scheduled</p>
                  )}
                  
                  <Button 
                    variant={isCompleted ? 'outline-success' : 'primary'}
                    size="sm"
                    className="w-100"
                    disabled={day.videos.length === 0}
                  >
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
          <Card>
            <Card.Header>
              <h5 className="mb-0">Week {currentWeek} Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Learning Focus</h6>
                  <p className="text-muted">
                    This week covers fundamental AI concepts, machine learning basics, 
                    and practical applications. Focus on understanding core principles 
                    and building a strong foundation.
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Time Commitment</h6>
                  <ul className="list-unstyled">
                    <li><strong>Weekdays:</strong> 1 hour per day (5 hours total)</li>
                    <li><strong>Weekend:</strong> 3 hours per day (6 hours total)</li>
                    <li><strong>Total:</strong> {totalHoursThisWeek} hours this week</li>
                  </ul>
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
