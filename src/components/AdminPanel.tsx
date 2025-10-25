import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Form, Modal, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import type { AuthUser, LearningPlan } from '../types';
import { ProgressService } from '../services/progressService';
import { AuthService } from '../services/authService';
import { LearningPlanService, type LearningPlanDB } from '../services/learningPlanService';
import { ContentService, type DaySummary, type DayContent, type DayQuiz } from '../services/contentService';
import { AdminAIService, type AIGenerationRequest, type AIGenerationResult } from '../services/adminAIService';

interface AdminPanelProps {
    currentUser: AuthUser;
    onSignOut: () => void;
}

interface UserStats {
    totalUsers: number;
    activeUsers: number;
    completedUsers: number;
    averageProgress: number;
}

interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    lastActive: string;
    progress: number;
    daysCompleted: number;
    totalHours: number;
    status: 'active' | 'inactive' | 'suspended';
    quizScores?: number[];
    notes?: string[];
    timeSpent?: number[];
    completedDays?: number[];
}

interface UserProgress {
    user_id: string;
    day: number;
    completed: boolean;
    time_spent: number;
    quiz_score: number;
    notes: string;
    completed_at: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onSignOut }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'analytics' | 'content' | 'settings'>('dashboard');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [userStats, setUserStats] = useState<UserStats>({
        totalUsers: 0,
        activeUsers: 0,
        completedUsers: 0,
        averageProgress: 0
    });
    const [users, setUsers] = useState<User[]>([]);
    const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(true);
    const [learningPlans, setLearningPlans] = useState<LearningPlanDB[]>([]);
    const [showLearningPlanModal, setShowLearningPlanModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<LearningPlanDB | null>(null);
    const [editingPlan, setEditingPlan] = useState<any>(null);

    // Content management states
    const [daySummaries, setDaySummaries] = useState<DaySummary[]>([]);
    const [dayContent, setDayContent] = useState<DayContent[]>([]);
    const [dayQuizzes, setDayQuizzes] = useState<DayQuiz[]>([]);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [selectedSummary, setSelectedSummary] = useState<DaySummary | null>(null);
    const [selectedContent, setSelectedContent] = useState<DayContent | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<DayQuiz | null>(null);
    const [editingSummary, setEditingSummary] = useState<DaySummary | null>(null);
    const [editingContent, setEditingContent] = useState<DayContent | null>(null);
    const [editingQuiz, setEditingQuiz] = useState<DayQuiz | null>(null);

    // AI Generation states
    const [showAIGenerationModal, setShowAIGenerationModal] = useState(false);
    const [aiGenerationType, setAiGenerationType] = useState<'summary' | 'content' | 'quiz'>('summary');
    const [aiGenerationMode, setAiGenerationMode] = useState<'single' | 'range' | 'week'>('single');
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [startDay, setStartDay] = useState<number>(1);
    const [endDay, setEndDay] = useState<number>(7);
    const [selectedWeek, setSelectedWeek] = useState<number>(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState<number>(0);
    const [generationStatus, setGenerationStatus] = useState<string>('');

    // Check admin access
    useEffect(() => {
        const checkAdminAccess = () => {
            if (currentUser.email === 'admin1@gmail.com') {
                // Don't auto-login, require PIN verification
                setShowPasswordModal(true);
            } else {
                setError('Access denied. Admin access required.');
            }
        };

        checkAdminAccess();
    }, [currentUser]);

    // Fetch real-time data
    const fetchRealTimeData = async () => {
        setLoading(true);
        try {
            // Fetch all users and their progress
            const allUsers = await AuthService.getAllUsers() || [];
            const allProgress = await ProgressService.getAllUserProgress() || [];
            const plans = await LearningPlanService.getAllLearningPlans() || [];
            const summaries = await ContentService.getAllDaySummaries() || [];
            const content = await ContentService.getAllDayContent() || [];
            const quizzes = await ContentService.getAllDayQuizzes() || [];

            setLearningPlans(plans);
            setDaySummaries(summaries);
            setDayContent(content);
            setDayQuizzes(quizzes);

            setUserProgress(allProgress);

            // Calculate stats
            const totalUsers = allUsers.length;
            const activeUsers = allUsers.filter(user => {
                const userProgressData = allProgress.filter(p => p.user_id === user.id);
                const lastActivity = userProgressData.length > 0 ?
                    Math.max(...userProgressData.map(p => new Date(p.completed_at || new Date()).getTime())) : 0;
                const daysSinceLastActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
                return daysSinceLastActivity <= 7; // Active if last activity within 7 days
            }).length;

            const completedUsers = allUsers.filter(user => {
                const userProgressData = allProgress.filter(p => p.user_id === user.id && p.completed);
                return userProgressData.length >= 90; // Completed all 90 days
            }).length;

            const averageProgress = allUsers.length > 0 ?
                allUsers.reduce((acc, user) => {
                    const userProgressData = allProgress.filter(p => p.user_id === user.id && p.completed);
                    return acc + (userProgressData.length / 90) * 100;
                }, 0) / allUsers.length : 0;

            setUserStats({
                totalUsers,
                activeUsers,
                completedUsers,
                averageProgress
            });

            // Process users with their progress data
            const processedUsers: User[] = allUsers.map(user => {
                const userProgressData = allProgress.filter(p => p.user_id === user.id);
                const completedDays = userProgressData.filter(p => p.completed).length;
                const totalHours = userProgressData.reduce((acc, p) => acc + (p.time_spent || 0), 0);
                const quizScores = userProgressData.map(p => p.quiz_score).filter((score): score is number => score !== undefined && score > 0);
                const notes = userProgressData.map(p => p.notes).filter((note): note is string => note !== undefined && note.trim() !== '');
                const timeSpent = userProgressData.map(p => p.time_spent || 0);
                const lastActivity = userProgressData.length > 0 ?
                    new Date(Math.max(...userProgressData.map(p => new Date(p.completed_at || new Date()).getTime()))).toISOString().split('T')[0] :
                    new Date(user.created_at || new Date()).toISOString().split('T')[0];

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: new Date(user.created_at).toISOString().split('T')[0],
                    lastActive: lastActivity,
                    progress: (completedDays / 90) * 100,
                    daysCompleted: completedDays,
                    totalHours: Math.round(totalHours * 10) / 10,
                    status: completedDays >= 90 ? 'active' : completedDays > 0 ? 'active' : 'inactive',
                    quizScores,
                    notes,
                    timeSpent,
                    completedDays: userProgressData.filter(p => p.completed).map(p => p.day)
                };
            });

            setUsers(processedUsers);
        } catch (err) {
            console.error('Admin data fetch error:', err);
            // Fallback to current user data if admin functions fail
            const currentUserData = {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                createdAt: new Date().toISOString().split('T')[0],
                lastActive: new Date().toISOString().split('T')[0],
                progress: 0,
                daysCompleted: 0,
                totalHours: 0,
                status: 'active' as const,
                quizScores: [],
                notes: [],
                timeSpent: [],
                completedDays: []
            };

            setUsers([currentUserData]);
            setUserStats({
                totalUsers: 1,
                activeUsers: 1,
                completedUsers: 0,
                averageProgress: 0
            });
            setError('Using fallback data. Admin functions may not be fully configured.');
        } finally {
            setLoading(false);
        }
    };

    // Handle admin PIN verification
    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const envPin = import.meta.env.VITE_ADMIN_PIN || '13122002'; // Default PIN if not set

        if (adminPassword === envPin) {
            setIsAdmin(true);
            setShowPasswordModal(false);
            fetchRealTimeData();
        } else {
            setError('Invalid admin PIN');
        }
    };

    // Learning Plan Management Functions
    const handleCreateNewPlan = async () => {
        try {
            const { sampleAiLearningPlan } = await import('../utils/learningPlanGenerator');
            const newPlan = await LearningPlanService.createLearningPlan(sampleAiLearningPlan, 'New AI Learning Plan');
            if (newPlan) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to create new learning plan');
        }
    };

    const handleEditPlan = (plan: LearningPlanDB) => {
        setSelectedPlan(plan);
        setEditingPlan(plan.plan_data);
        setShowLearningPlanModal(true);
    };

    const handleSavePlan = async () => {
        if (!selectedPlan || !editingPlan) return;

        try {
            const updatedPlan = await LearningPlanService.updateLearningPlan(
                selectedPlan.id!,
                editingPlan,
                selectedPlan.plan_name
            );

            if (updatedPlan) {
                await fetchRealTimeData();
                setShowLearningPlanModal(false);
                setError('');
            }
        } catch (err) {
            setError('Failed to save learning plan');
        }
    };

    const handleSetActivePlan = async (planId: number) => {
        try {
            const success = await LearningPlanService.setActiveLearningPlan(planId);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to set active learning plan');
        }
    };

    // User Management Functions
    const handleCreateUser = async (userData: { email: string; name: string; password: string }) => {
        try {
            const newUser = await AuthService.createUser(userData);
            if (newUser) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to create user');
        }
    };

    const handleUpdateUser = async (userId: string, updates: { name?: string; email?: string; status?: string }) => {
        try {
            const updatedUser = await AuthService.updateUser(userId, updates);
            if (updatedUser) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const success = await AuthService.deleteUser(userId);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    // Summary Management Functions
    const handleCreateSummary = async (day: number) => {
        try {
            const defaultSummary = ContentService.generateDefaultSummary(day);
            const newSummary = await ContentService.createDaySummary({
                ...defaultSummary,
                created_by: currentUser.id
            });
            if (newSummary) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to create summary');
        }
    };

    const handleEditSummary = (summary: DaySummary) => {
        setSelectedSummary(summary);
        setEditingSummary({ ...summary });
        setShowSummaryModal(true);
    };

    const handleSaveSummary = async () => {
        if (!selectedSummary || !editingSummary) return;

        try {
            const updatedSummary = await ContentService.updateDaySummary(
                selectedSummary.id!,
                editingSummary
            );

            if (updatedSummary) {
                await fetchRealTimeData();
                setShowSummaryModal(false);
                setError('');
            }
        } catch (err) {
            setError('Failed to save summary');
        }
    };

    const handleDeleteSummary = async (id: number) => {
        try {
            const success = await ContentService.deleteDaySummary(id);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to delete summary');
        }
    };

    // Content Management Functions
    const handleCreateContent = async (day: number) => {
        try {
            const defaultContent = ContentService.generateDefaultContent(day);
            const newContent = await ContentService.createDayContent({
                ...defaultContent,
                created_by: currentUser.id
            });
            if (newContent) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to create content');
        }
    };

    const handleEditContent = (content: DayContent) => {
        setSelectedContent(content);
        setEditingContent({ ...content });
        setShowContentModal(true);
    };

    const handleSaveContent = async () => {
        if (!selectedContent || !editingContent) return;

        try {
            const updatedContent = await ContentService.updateDayContent(
                selectedContent.id!,
                editingContent
            );

            if (updatedContent) {
                await fetchRealTimeData();
                setShowContentModal(false);
                setError('');
            }
        } catch (err) {
            setError('Failed to save content');
        }
    };

    const handleDeleteContent = async (id: number) => {
        try {
            const success = await ContentService.deleteDayContent(id);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to delete content');
        }
    };

    // Quiz Management Functions
    const handleCreateQuiz = async (day: number) => {
        try {
            const defaultQuiz = ContentService.generateDefaultQuiz(day);
            const newQuiz = await ContentService.createDayQuiz({
                ...defaultQuiz,
                created_by: currentUser.id
            });
            if (newQuiz) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to create quiz');
        }
    };

    const handleEditQuiz = (quiz: DayQuiz) => {
        setSelectedQuiz(quiz);
        setEditingQuiz({ ...quiz });
        setShowQuizModal(true);
    };

    const handleSaveQuiz = async () => {
        if (!selectedQuiz || !editingQuiz) return;

        try {
            const updatedQuiz = await ContentService.updateDayQuiz(
                selectedQuiz.id!,
                editingQuiz
            );

            if (updatedQuiz) {
                await fetchRealTimeData();
                setShowQuizModal(false);
                setError('');
            }
        } catch (err) {
            setError('Failed to save quiz');
        }
    };

    const handleDeleteQuiz = async (id: number) => {
        try {
            const success = await ContentService.deleteDayQuiz(id);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to delete quiz');
        }
    };

    // Bulk operations
    const handleBulkCreateSummaries = async (startDay: number, endDay: number) => {
        try {
            const summaries = [];
            for (let day = startDay; day <= endDay; day++) {
                summaries.push({
                    ...ContentService.generateDefaultSummary(day),
                    created_by: currentUser.id
                });
            }
            const success = await ContentService.bulkCreateSummaries(summaries);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to bulk create summaries');
        }
    };

    const handleBulkCreateContent = async (startDay: number, endDay: number) => {
        try {
            const content = [];
            for (let day = startDay; day <= endDay; day++) {
                content.push({
                    ...ContentService.generateDefaultContent(day),
                    created_by: currentUser.id
                });
            }
            const success = await ContentService.bulkCreateContent(content);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to bulk create content');
        }
    };

    const handleBulkCreateQuizzes = async (startDay: number, endDay: number) => {
        try {
            const quizzes = [];
            for (let day = startDay; day <= endDay; day++) {
                quizzes.push({
                    ...ContentService.generateDefaultQuiz(day),
                    created_by: currentUser.id
                });
            }
            const success = await ContentService.bulkCreateQuizzes(quizzes);
            if (success) {
                await fetchRealTimeData();
                setError('');
            }
        } catch (err) {
            setError('Failed to bulk create quizzes');
        }
    };

    // AI Generation Functions
    const handleAIGeneration = async () => {
        setIsGenerating(true);
        setGenerationProgress(0);
        setGenerationStatus('Starting AI generation...');
        setError('');

        try {
            let request: AIGenerationRequest;

            // Prepare request based on mode
            switch (aiGenerationMode) {
                case 'single':
                    request = { type: aiGenerationType, day: selectedDay };
                    break;
                case 'range':
                    request = { type: aiGenerationType, startDay, endDay };
                    break;
                case 'week':
                    request = { type: aiGenerationType, weekNumber: selectedWeek };
                    break;
                default:
                    throw new Error('Invalid generation mode');
            }

            setGenerationStatus('Generating content with AI...');
            setGenerationProgress(25);

            // Generate content based on type
            let result: AIGenerationResult;
            switch (aiGenerationType) {
                case 'summary':
                    result = await AdminAIService.generateSummary(request);
                    break;
                case 'content':
                    result = await AdminAIService.generateContent(request);
                    break;
                case 'quiz':
                    result = await AdminAIService.generateQuiz(request);
                    break;
                default:
                    throw new Error('Invalid generation type');
            }

            setGenerationProgress(75);
            setGenerationStatus('Saving generated content...');

            if (!result.success) {
                throw new Error(result.error || 'Generation failed');
            }

            // Save generated content to database
            if (Array.isArray(result.data)) {
                // Multiple items (range or week)
                for (const item of result.data) {
                    switch (aiGenerationType) {
                        case 'summary':
                            await AdminAIService.saveGeneratedSummary(item.day, item.summary, item.key_points, currentUser.id);
                            break;
                        case 'content':
                            await AdminAIService.saveGeneratedContent(item.day, item.title, item.content, item.additional_notes, currentUser.id);
                            break;
                        case 'quiz':
                            await AdminAIService.saveGeneratedQuiz(item.day, item.questions, currentUser.id);
                            break;
                    }
                }
            } else {
                // Single item
                switch (aiGenerationType) {
                    case 'summary':
                        await AdminAIService.saveGeneratedSummary(result.data.day, result.data.summary, result.data.key_points, currentUser.id);
                        break;
                    case 'content':
                        await AdminAIService.saveGeneratedContent(result.data.day, result.data.title, result.data.content, result.data.additional_notes, currentUser.id);
                        break;
                    case 'quiz':
                        await AdminAIService.saveGeneratedQuiz(result.data.day, result.data.questions, currentUser.id);
                        break;
                }
            }

            setGenerationProgress(100);
            setGenerationStatus('Content generated and saved successfully!');

            // Refresh data and close modal
            await fetchRealTimeData();
            setTimeout(() => {
                setShowAIGenerationModal(false);
                setIsGenerating(false);
                setGenerationProgress(0);
                setGenerationStatus('');
            }, 2000);

        } catch (err) {
            setError(`AI Generation failed: ${(err as Error).message}`);
            setIsGenerating(false);
            setGenerationProgress(0);
            setGenerationStatus('');
        }
    };

    const handleRegenerateContent = async (type: 'summary' | 'content' | 'quiz', day: number) => {
        setIsGenerating(true);
        setGenerationStatus(`Regenerating ${type} for Day ${day}...`);
        setError('');

        try {
            const result = await AdminAIService.regenerateContent(type, day);

            if (!result.success) {
                throw new Error(result.error || 'Regeneration failed');
            }

            // Save regenerated content
            switch (type) {
                case 'summary':
                    await AdminAIService.saveGeneratedSummary(day, result.data.summary, result.data.key_points, currentUser.id);
                    break;
                case 'content':
                    await AdminAIService.saveGeneratedContent(day, result.data.title, result.data.content, result.data.additional_notes, currentUser.id);
                    break;
                case 'quiz':
                    await AdminAIService.saveGeneratedQuiz(day, result.data.questions, currentUser.id);
                    break;
            }

            await fetchRealTimeData();
            setGenerationStatus(`${type} regenerated successfully!`);
            setTimeout(() => {
                setIsGenerating(false);
                setGenerationStatus('');
            }, 2000);

        } catch (err) {
            setError(`Regeneration failed: ${(err as Error).message}`);
            setIsGenerating(false);
            setGenerationStatus('');
        }
    };

    const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete') => {
        setUsers(prev => prev.map(user => {
            if (user.id === userId) {
                switch (action) {
                    case 'suspend':
                        return { ...user, status: 'suspended' as const };
                    case 'activate':
                        return { ...user, status: 'active' as const };
                    case 'delete':
                        return user; // Don't actually delete, just mark for deletion
                    default:
                        return user;
                }
            }
            return user;
        }));
    };

    const renderDashboard = () => (
        <div>
            <Row className="mb-4">
                <Col lg={3} md={6} className="mb-3">
                    <Card className="admin-stat-card">
                        <Card.Body className="text-center">
                            <div className="admin-stat-icon">
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <h3 className="admin-stat-number">{userStats.totalUsers.toLocaleString()}</h3>
                            <p className="admin-stat-label">Total Users</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="admin-stat-card">
                        <Card.Body className="text-center">
                            <div className="admin-stat-icon active">
                                <i className="bi bi-person-check-fill"></i>
                            </div>
                            <h3 className="admin-stat-number">{userStats.activeUsers.toLocaleString()}</h3>
                            <p className="admin-stat-label">Active Users</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="admin-stat-card">
                        <Card.Body className="text-center">
                            <div className="admin-stat-icon completed">
                                <i className="bi bi-trophy-fill"></i>
                            </div>
                            <h3 className="admin-stat-number">{userStats.completedUsers.toLocaleString()}</h3>
                            <p className="admin-stat-label">Completed</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="admin-stat-card">
                        <Card.Body className="text-center">
                            <div className="admin-stat-icon progress">
                                <i className="bi bi-graph-up"></i>
                            </div>
                            <h3 className="admin-stat-number">{userStats.averageProgress.toFixed(1)}%</h3>
                            <p className="admin-stat-label">Avg Progress</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="admin-card">
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-graph-up me-2"></i>
                                Recent Activity
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="bi bi-person-plus"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">New user registered</div>
                                        <div className="activity-subtitle">Sarah Johnson joined the platform</div>
                                        <div className="activity-time">2 hours ago</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="bi bi-trophy"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">Course completed</div>
                                        <div className="activity-subtitle">Mike Chen finished Day 90</div>
                                        <div className="activity-time">4 hours ago</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="bi bi-video"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">Content updated</div>
                                        <div className="activity-subtitle">New videos added to Week 5</div>
                                        <div className="activity-time">1 day ago</div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="admin-card">
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-pie-chart me-2"></i>
                                User Progress
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="progress-stats">
                                <div className="progress-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Week 1-2</span>
                                        <span>85%</span>
                                    </div>
                                    <ProgressBar now={85} variant="success" className="mt-1" />
                                </div>
                                <div className="progress-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Week 3-4</span>
                                        <span>72%</span>
                                    </div>
                                    <ProgressBar now={72} variant="info" className="mt-1" />
                                </div>
                                <div className="progress-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Week 5-6</span>
                                        <span>58%</span>
                                    </div>
                                    <ProgressBar now={58} variant="warning" className="mt-1" />
                                </div>
                                <div className="progress-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Week 7+</span>
                                        <span>34%</span>
                                    </div>
                                    <ProgressBar now={34} variant="danger" className="mt-1" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    const renderUsers = () => (
        <div>
            <Card className="admin-card">
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <i className="bi bi-people me-2"></i>
                            User Management
                        </h5>
                        <Button variant="primary" size="sm" onClick={() => setShowUserModal(true)}>
                            <i className="bi bi-plus me-1"></i>
                            Add User
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Progress</th>
                                    <th>Days Completed</th>
                                    <th>Total Hours</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="progress-container">
                                                <ProgressBar now={user.progress} variant="primary" style={{ height: '8px' }} />
                                                <small className="text-muted">{user.progress}%</small>
                                            </div>
                                        </td>
                                        <td>{user.daysCompleted}/90</td>
                                        <td>{user.totalHours}h</td>
                                        <td>
                                            <Badge bg={user.status === 'active' ? 'success' : user.status === 'inactive' ? 'secondary' : 'danger'}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowUserModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    onClick={() => handleUpdateUser(user.id, { status: 'suspended' })}
                                                >
                                                    <i className="bi bi-pause"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );

    const renderAnalytics = () => (
        <div>
            <Row>
                <Col lg={6}>
                    <Card className="admin-card">
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-bar-chart me-2"></i>
                                Learning Progress
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="chart-placeholder">
                                <div className="chart-mock">
                                    <i className="bi bi-graph-up"></i>
                                    <p>Progress Chart</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="admin-card">
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-clock me-2"></i>
                                Engagement Metrics
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="metrics-grid">
                                <div className="metric-item">
                                    <div className="metric-value">2.4h</div>
                                    <div className="metric-label">Avg. Daily Time</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">78%</div>
                                    <div className="metric-label">Completion Rate</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">4.2</div>
                                    <div className="metric-label">Avg. Quiz Score</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">92%</div>
                                    <div className="metric-label">Satisfaction</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    const renderContent = () => (
        <div>
            <Row>
                <Col lg={12}>
                    <Card className="admin-card">
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="bi bi-book me-2"></i>
                                    Learning Plan Management
                                </h5>
                                <Button variant="primary" size="sm" onClick={handleCreateNewPlan}>
                                    <i className="bi bi-plus me-1"></i>
                                    Create New Plan
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Plan Name</th>
                                            <th>Total Days</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {learningPlans.map(plan => (
                                            <tr key={plan.id}>
                                                <td>
                                                    <div className="plan-name">{plan.plan_name}</div>
                                                    <small className="text-muted">ID: {plan.id}</small>
                                                </td>
                                                <td>{plan.total_days}</td>
                                                <td>
                                                    <Badge bg={plan.is_active ? 'success' : 'secondary'}>
                                                        {plan.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td>{new Date(plan.created_at!).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditPlan(plan)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Button>
                                                        {!plan.is_active && (
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => handleSetActivePlan(plan.id!)}
                                                            >
                                                                <i className="bi bi-check"></i>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {learningPlans.length === 0 && (
                                <div className="text-center py-4">
                                    <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
                                    <p className="text-muted mt-3">No learning plans found</p>
                                    <Button variant="primary" onClick={handleCreateNewPlan}>
                                        <i className="bi bi-plus me-2"></i>
                                        Create First Plan
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Day Summaries Management */}
            <Row className="mt-4">
                <Col lg={4}>
                    <Card className="admin-card">
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                    <i className="bi bi-file-text me-2"></i>
                                    Day Summaries
                                </h6>
                                <div className="d-flex gap-1">
                                    <Button variant="warning" size="sm" onClick={() => {
                                        setAiGenerationType('summary');
                                        setShowAIGenerationModal(true);
                                    }}>
                                        <i className="bi bi-robot"></i>
                                    </Button>
                                    <Button variant="success" size="sm" onClick={() => handleBulkCreateSummaries(1, 90)}>
                                        <i className="bi bi-plus-circle"></i>
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => handleCreateSummary(1)}>
                                        <i className="bi bi-plus"></i>
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Summary</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {daySummaries.slice(0, 5).map(summary => (
                                            <tr key={summary.id}>
                                                <td><Badge bg="primary">Day {summary.day}</Badge></td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                                        {summary.summary}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Button
                                                            variant="outline-warning"
                                                            size="sm"
                                                            onClick={() => handleRegenerateContent('summary', summary.day)}
                                                            disabled={isGenerating}
                                                        >
                                                            <i className="bi bi-arrow-clockwise"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditSummary(summary)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteSummary(summary.id!)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {daySummaries.length === 0 && (
                                <div className="text-center py-3">
                                    <i className="bi bi-file-text text-muted" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted mt-2">No summaries found</p>
                                    <Button variant="primary" size="sm" onClick={() => handleBulkCreateSummaries(1, 90)}>
                                        <i className="bi bi-plus-circle me-1"></i>
                                        Create All Summaries
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Day Content Management */}
                <Col lg={4}>
                    <Card className="admin-card">
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                    <i className="bi bi-journal-text me-2"></i>
                                    Day Content
                                </h6>
                                <div className="d-flex gap-1">
                                    <Button variant="warning" size="sm" onClick={() => {
                                        setAiGenerationType('content');
                                        setShowAIGenerationModal(true);
                                    }}>
                                        <i className="bi bi-robot"></i>
                                    </Button>
                                    <Button variant="success" size="sm" onClick={() => handleBulkCreateContent(1, 90)}>
                                        <i className="bi bi-plus-circle"></i>
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => handleCreateContent(1)}>
                                        <i className="bi bi-plus"></i>
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Title</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dayContent.slice(0, 5).map(content => (
                                            <tr key={content.id}>
                                                <td><Badge bg="info">Day {content.day}</Badge></td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                                        {content.title}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditContent(content)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteContent(content.id!)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {dayContent.length === 0 && (
                                <div className="text-center py-3">
                                    <i className="bi bi-journal-text text-muted" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted mt-2">No content found</p>
                                    <Button variant="primary" size="sm" onClick={() => handleBulkCreateContent(1, 90)}>
                                        <i className="bi bi-plus-circle me-1"></i>
                                        Create All Content
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Day Quizzes Management */}
                <Col lg={4}>
                    <Card className="admin-card">
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                    <i className="bi bi-question-circle me-2"></i>
                                    Day Quizzes
                                </h6>
                                <div className="d-flex gap-1">
                                    <Button variant="warning" size="sm" onClick={() => {
                                        setAiGenerationType('quiz');
                                        setShowAIGenerationModal(true);
                                    }}>
                                        <i className="bi bi-robot"></i>
                                    </Button>
                                    <Button variant="success" size="sm" onClick={() => handleBulkCreateQuizzes(1, 90)}>
                                        <i className="bi bi-plus-circle"></i>
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => handleCreateQuiz(1)}>
                                        <i className="bi bi-plus"></i>
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Questions</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dayQuizzes.slice(0, 5).map(quiz => (
                                            <tr key={quiz.id}>
                                                <td><Badge bg="warning">Day {quiz.day}</Badge></td>
                                                <td>{quiz.questions?.length || 0}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditQuiz(quiz)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteQuiz(quiz.id!)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {dayQuizzes.length === 0 && (
                                <div className="text-center py-3">
                                    <i className="bi bi-question-circle text-muted" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted mt-2">No quizzes found</p>
                                    <Button variant="primary" size="sm" onClick={() => handleBulkCreateQuizzes(1, 90)}>
                                        <i className="bi bi-plus-circle me-1"></i>
                                        Create All Quizzes
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    const renderSettings = () => (
        <div>
            <Row>
                <Col lg={8}>
                    <Card className="admin-card">
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-gear me-2"></i>
                                System Settings
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Platform Name</Form.Label>
                                    <Form.Control type="text" defaultValue="AI Learning Platform" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Default Course Duration</Form.Label>
                                    <Form.Control type="number" defaultValue="90" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Max Users</Form.Label>
                                    <Form.Control type="number" defaultValue="10000" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="email-notifications"
                                        label="Enable Email Notifications"
                                        defaultChecked
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="auto-progress"
                                        label="Auto Progress Tracking"
                                        defaultChecked
                                    />
                                </Form.Group>
                                <Button variant="primary">
                                    <i className="bi bi-save me-2"></i>
                                    Save Settings
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="admin-card">
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-shield me-2"></i>
                                Security
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="security-actions">
                                <Button variant="outline-warning" className="w-100 mb-2">
                                    <i className="bi bi-key me-2"></i>
                                    Reset API Keys
                                </Button>
                                <Button variant="outline-info" className="w-100 mb-2">
                                    <i className="bi bi-download me-2"></i>
                                    Export Data
                                </Button>
                                <Button variant="outline-danger" className="w-100">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Emergency Stop
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    // Show access denied if not admin
    if (!isAdmin && currentUser.email !== 'admin1@gmail.com') {
        return (
            <div className="admin-panel">
                <div className="admin-header">
                    <Container fluid>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="admin-title">
                                    <i className="bi bi-shield-check me-2"></i>
                                    Admin Panel
                                </h1>
                                <p className="admin-subtitle">Access Denied</p>
                            </div>
                        </div>
                    </Container>
                </div>
                <Container fluid className="admin-content">
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <Card className="admin-card">
                                <Card.Body className="text-center py-5">
                                    <i className="bi bi-shield-exclamation text-danger" style={{ fontSize: '4rem' }}></i>
                                    <h3 className="mt-3">Access Denied</h3>
                                    <p className="text-muted">You don't have permission to access the admin panel.</p>
                                    <Button variant="primary" onClick={onSignOut}>
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Back to Dashboard
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <Container fluid>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="admin-title">
                                <i className="bi bi-shield-check me-2"></i>
                                Admin Panel
                            </h1>
                            <p className="admin-subtitle">Manage your AI Learning Platform</p>
                        </div>
                        <div className="admin-user-info">
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={fetchRealTimeData}
                                className="me-2"
                                disabled={loading}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Refresh
                            </Button>
                            <span className="admin-user-name">{currentUser.name}</span>
                            <Button variant="outline-light" size="sm" onClick={onSignOut}>
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Logout
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="admin-nav">
                <Container fluid>
                    <div className="admin-nav-tabs">
                        <button
                            className={`admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <i className="bi bi-speedometer2 me-2"></i>
                            Dashboard
                        </button>
                        <button
                            className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <i className="bi bi-people me-2"></i>
                            Users
                        </button>
                        <button
                            className={`admin-nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            <i className="bi bi-graph-up me-2"></i>
                            Analytics
                        </button>
                        <button
                            className={`admin-nav-tab ${activeTab === 'content' ? 'active' : ''}`}
                            onClick={() => setActiveTab('content')}
                        >
                            <i className="bi bi-collection me-2"></i>
                            Content
                        </button>
                        <button
                            className={`admin-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <i className="bi bi-gear me-2"></i>
                            Settings
                        </button>
                    </div>
                </Container>
            </div>

            <Container fluid className="admin-content">
                {error && (
                    <Alert variant="danger" className="mb-4">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'analytics' && renderAnalytics()}
                        {activeTab === 'content' && renderContent()}
                        {activeTab === 'settings' && renderSettings()}
                    </>
                )}
            </Container>

            {/* Admin PIN Modal */}
            <Modal show={showPasswordModal} onHide={() => { }} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>
                        <i className="bi bi-shield-lock me-2"></i>
                        Admin PIN Verification
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAdminLogin}>
                        <Alert variant="info">
                            <i className="bi bi-info-circle me-2"></i>
                            Enter your admin PIN to access the admin panel.
                        </Alert>
                        <Form.Group className="mb-3">
                            <Form.Label>Admin PIN</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter admin PIN"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                                maxLength={10}
                            />
                            <Form.Text className="text-muted">
                                Enter the PIN from your environment variables (VITE_ADMIN_PIN)
                            </Form.Text>
                        </Form.Group>
                        {error && (
                            <Alert variant="danger">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {error}
                            </Alert>
                        )}
                        <Button variant="primary" type="submit" className="w-100">
                            <i className="bi bi-unlock me-2"></i>
                            Access Admin Panel
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* User Details Modal */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>User Details - {selectedUser?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <h6>Basic Information</h6>
                                    <p><strong>Name:</strong> {selectedUser.name}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Joined:</strong> {selectedUser.createdAt}</p>
                                    <p><strong>Last Active:</strong> {selectedUser.lastActive}</p>
                                </Col>
                                <Col md={6}>
                                    <h6>Learning Progress</h6>
                                    <p><strong>Progress:</strong> {selectedUser.progress.toFixed(1)}%</p>
                                    <p><strong>Days Completed:</strong> {selectedUser.daysCompleted}/90</p>
                                    <p><strong>Total Hours:</strong> {selectedUser.totalHours}h</p>
                                    <p><strong>Status:</strong>
                                        <Badge bg={selectedUser.status === 'active' ? 'success' : 'secondary'} className="ms-2">
                                            {selectedUser.status}
                                        </Badge>
                                    </p>
                                </Col>
                            </Row>

                            {selectedUser.quizScores && selectedUser.quizScores.length > 0 && (
                                <Row className="mt-3">
                                    <Col>
                                        <h6>Quiz Performance</h6>
                                        <div className="quiz-scores">
                                            <p><strong>Average Score:</strong> {(selectedUser.quizScores.reduce((a, b) => a + b, 0) / selectedUser.quizScores.length).toFixed(1)}/5</p>
                                            <p><strong>Total Quizzes:</strong> {selectedUser.quizScores.length}</p>
                                            <p><strong>Recent Scores:</strong> {selectedUser.quizScores.slice(-5).join(', ')}</p>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {selectedUser.notes && selectedUser.notes.length > 0 && (
                                <Row className="mt-3">
                                    <Col>
                                        <h6>User Notes ({selectedUser.notes.length})</h6>
                                        <div className="user-notes" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {selectedUser.notes.map((note, index) => (
                                                <div key={index} className="note-item mb-2 p-2 bg-light rounded">
                                                    <small className="text-muted">Note {index + 1}:</small>
                                                    <p className="mb-0">{note}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {selectedUser.completedDays && selectedUser.completedDays.length > 0 && (
                                <Row className="mt-3">
                                    <Col>
                                        <h6>Completed Days</h6>
                                        <div className="completed-days">
                                            <p><strong>Days Completed:</strong> {selectedUser.completedDays.join(', ')}</p>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => fetchRealTimeData()}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh Data
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Learning Plan Editor Modal */}
            <Modal show={showLearningPlanModal} onHide={() => setShowLearningPlanModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Learning Plan - {selectedPlan?.plan_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingPlan && (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Plan Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedPlan?.plan_name || ''}
                                            onChange={(e) => setSelectedPlan(prev => prev ? { ...prev, plan_name: e.target.value } : null)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Total Days</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editingPlan.totalDays}
                                            onChange={(e) => setEditingPlan(prev => prev ? { ...prev, totalDays: parseInt(e.target.value) } : null)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="learning-plan-editor">
                                <h6>Weeks Configuration</h6>
                                <div className="weeks-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {editingPlan.weeks.map((week, weekIndex) => (
                                        <Card key={weekIndex} className="mb-3">
                                            <Card.Header>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0">Week {week.weekNumber}</h6>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newWeeks = editingPlan.weeks.filter((_, i) => i !== weekIndex);
                                                            setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Week Focus</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={week.focus}
                                                                onChange={(e) => {
                                                                    const newWeeks = [...editingPlan.weeks];
                                                                    newWeeks[weekIndex].focus = e.target.value;
                                                                    setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Time Commitment</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={week.timeCommitment}
                                                                onChange={(e) => {
                                                                    const newWeeks = [...editingPlan.weeks];
                                                                    newWeeks[weekIndex].timeCommitment = e.target.value;
                                                                    setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <div className="days-list">
                                                    <h6>Days ({week.days.length})</h6>
                                                    {week.days.map((day, dayIndex) => (
                                                        <div key={dayIndex} className="day-item mb-2 p-2 border rounded">
                                                            <Row>
                                                                <Col md={3}>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Day"
                                                                        value={day.day}
                                                                        onChange={(e) => {
                                                                            const newWeeks = [...editingPlan.weeks];
                                                                            newWeeks[weekIndex].days[dayIndex].day = parseInt(e.target.value);
                                                                            setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                                        }}
                                                                    />
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Type"
                                                                        value={day.isWeekend ? 'Weekend' : 'Weekday'}
                                                                        readOnly
                                                                    />
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Hours"
                                                                        value={day.timeAllocation}
                                                                        onChange={(e) => {
                                                                            const newWeeks = [...editingPlan.weeks];
                                                                            newWeeks[weekIndex].days[dayIndex].timeAllocation = parseInt(e.target.value);
                                                                            setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                                        }}
                                                                    />
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const newWeeks = [...editingPlan.weeks];
                                                                            newWeeks[weekIndex].days = newWeeks[weekIndex].days.filter((_, i) => i !== dayIndex);
                                                                            setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            <div className="mt-2">
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={2}
                                                                    placeholder="Videos (one per line)"
                                                                    value={day.videos.map(v => v.title).join('\n')}
                                                                    onChange={(e) => {
                                                                        const videoTitles = e.target.value.split('\n').filter(title => title.trim());
                                                                        const videos = videoTitles.map(title => ({
                                                                            title: title.trim(),
                                                                            url: `https://youtube.com/watch?v=${Math.random().toString(36).substr(2, 9)}`,
                                                                            duration: '10:00'
                                                                        }));
                                                                        const newWeeks = [...editingPlan.weeks];
                                                                        newWeeks[weekIndex].days[dayIndex].videos = videos;
                                                                        setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newWeeks = [...editingPlan.weeks];
                                                            newWeeks[weekIndex].days.push({
                                                                day: newWeeks[weekIndex].days.length + 1,
                                                                isWeekend: false,
                                                                timeAllocation: 1,
                                                                videos: []
                                                            });
                                                            setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                                        }}
                                                    >
                                                        <i className="bi bi-plus me-1"></i>
                                                        Add Day
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>

                                <Button
                                    variant="outline-primary"
                                    className="mt-3"
                                    onClick={() => {
                                        const newWeeks = [...editingPlan.weeks];
                                        newWeeks.push({
                                            weekNumber: newWeeks.length + 1,
                                            focus: 'New Week Focus',
                                            timeCommitment: '1 hour per day',
                                            days: []
                                        });
                                        setEditingPlan(prev => prev ? { ...prev, weeks: newWeeks } : null);
                                    }}
                                >
                                    <i className="bi bi-plus me-1"></i>
                                    Add Week
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLearningPlanModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSavePlan}>
                        <i className="bi bi-save me-2"></i>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* AI Generation Modal */}
            <Modal show={showAIGenerationModal} onHide={() => setShowAIGenerationModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-robot me-2"></i>
                        AI Content Generation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Content Type</Form.Label>
                                    <Form.Select
                                        value={aiGenerationType}
                                        onChange={(e) => setAiGenerationType(e.target.value as 'summary' | 'content' | 'quiz')}
                                    >
                                        <option value="summary">Summary & Key Points</option>
                                        <option value="content">Detailed Content</option>
                                        <option value="quiz">Quiz Questions</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Generation Mode</Form.Label>
                                    <Form.Select
                                        value={aiGenerationMode}
                                        onChange={(e) => setAiGenerationMode(e.target.value as 'single' | 'range' | 'week')}
                                    >
                                        <option value="single">Single Day</option>
                                        <option value="range">Day Range</option>
                                        <option value="week">Entire Week</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {aiGenerationMode === 'single' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Select Day</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="90"
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                                />
                            </Form.Group>
                        )}

                        {aiGenerationMode === 'range' && (
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Day</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max="90"
                                            value={startDay}
                                            onChange={(e) => setStartDay(parseInt(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Day</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max="90"
                                            value={endDay}
                                            onChange={(e) => setEndDay(parseInt(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        {aiGenerationMode === 'week' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Select Week</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="13"
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                                />
                            </Form.Group>
                        )}

                        {isGenerating && (
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="text-muted">{generationStatus}</small>
                                    <small className="text-muted">{generationProgress}%</small>
                                </div>
                                <ProgressBar now={generationProgress} animated />
                            </div>
                        )}

                        {error && (
                            <Alert variant="danger">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {error}
                            </Alert>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAIGenerationModal(false)} disabled={isGenerating}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={handleAIGeneration} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-robot me-2"></i>
                                Generate with AI
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminPanel;
