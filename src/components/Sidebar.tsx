import React, { useState } from 'react';
import type { AuthUser } from '../types';

interface SidebarProps {
    currentUser: AuthUser;
    activeView: string;
    onViewChange: (view: string) => void;
    onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, activeView, onViewChange, onSignOut }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'bi-house-fill',
            description: 'Overview & Progress'
        },
        {
            id: 'learning',
            label: 'Learning',
            icon: 'bi-book-fill',
            description: 'Study Materials'
        },
        {
            id: 'progress',
            label: 'Progress',
            icon: 'bi-graph-up',
            description: 'Track Your Journey'
        },
        {
            id: 'achievements',
            label: 'Achievements',
            icon: 'bi-trophy-fill',
            description: 'Badges & Rewards'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'bi-gear-fill',
            description: 'Account & Preferences'
        }
    ];

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const handleNavClick = (view: string) => {
        onViewChange(view);
        setIsMobileOpen(false); // Close mobile sidebar after selection
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="sidebar-toggle"
                onClick={toggleMobileSidebar}
                aria-label="Toggle sidebar"
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
                onClick={() => setIsMobileOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>
                    <div className="sidebar-title">AI Learning</div>
                    <div className="sidebar-subtitle">90-Day Journey</div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navigationItems.map((item) => (
                        <div key={item.id} className="nav-item">
                            <button
                                className={`nav-link ${activeView === item.id ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.id)}
                            >
                                <i className={item.icon}></i>
                                <div>
                                    <div>{item.label}</div>
                                    <small style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                                        {item.description}
                                    </small>
                                </div>
                            </button>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            <i className="bi bi-person-fill"></i>
                        </div>
                        <div className="user-details">
                            <h6>{currentUser.name}</h6>
                            <small>{currentUser.email}</small>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onSignOut}>
                        <i className="bi bi-box-arrow-right"></i>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
