import React, { useState, useEffect } from 'react';
import './App.css';
import MealCalendar from './components/MealCalendar';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import NutritionLookupModal from './components/NutritionLookupModal';
import Recommendations from './components/Recommendations';
import Button from './components/ui/Button';

/**
 * PUBLIC_INTERFACE
 * App - Main entry for Meal Planner frontend. Implements navigation, sidebar, responsive grid,
 * a calendar meal planner, and attractive modals for CRUD actions.
 * Features:
 * - Top navigation bar (brand, theme/toggle, minimal links)
 * - Collapsible side menu (quick links & actions)
 * - Responsive main content (calendar, meal list, recommendations)
 * - Stylish modal dialogs for CRUD using custom palette
 */
function App() {
  // Theme: supports toggling light/dark, defaults to light
  const [theme, setTheme] = useState('light');

  // State for sidebar collapse/expand
  const [sideOpen, setSideOpen] = useState(window.innerWidth > 900);

  // Modal/dialog states & active meal CRUD session
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  // Nutrition lookup modal
  const [lookupOpen, setLookupOpen] = useState(false);

  // Main meal data, recommendations (stubbed/demo for now)
  const [meals, setMeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Responsive side menu logic
  useEffect(() => {
    function handleResize() {
      setSideOpen(window.innerWidth > 900);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to set theme color
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  // CRUD dummy handlers
  const handleAddMeal = () => {
    setEditingMeal(null);
    setShowMealForm(true);
  };
  const handleEditMeal = meal => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };
  const handleDeleteMeal = meal => {
    // TODO: Delete logic
    setMeals(prev => prev.filter(m => m !== meal));
  };
  const handleFormSubmit = meal => {
    // TODO: Upsert meal logic
    setShowMealForm(false);
    setEditingMeal(null);
  };
  const handleFormCancel = () => {
    setShowMealForm(false);
    setEditingMeal(null);
  };

  // Navigation, sidebar, layout, dialogs
  return (
    <div className="App" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Top navigation bar */}
      <nav className="top-nav" style={{
        background: '#2D9CDB', color: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.3rem', letterSpacing: 1, display: 'flex', alignItems: 'center' }}>
          <span role="img" aria-label="meal" style={{ fontSize: 24, marginRight: 8 }}>🍽️</span>
          NutriMeal Planner
        </div>
        <div>
          <Button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={handleAddMeal}>+ Meal</Button>
          <Button style={{ marginLeft: 10 }} onClick={() => setLookupOpen(true)}>Lookup Nutrition</Button>
        </div>
      </nav>
      {/* Sidebar + main content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Collapse sidebar for mobile */}
        <aside
          className={`side-menu${sideOpen ? ' open' : ''}`}
          style={{
            width: sideOpen ? 230 : 0,
            background: '#27AE60',
            color: '#fff',
            transition: 'width 0.3s cubic-bezier(.25,.8,.25,1)',
            overflow: 'hidden',
            boxShadow: sideOpen ? '2px 0 8px rgba(34,197,94,0.08)' : 'none',
            zIndex: 2
          }}
        >
          <div style={{
            padding: '2rem 1rem 1rem 1.2rem', fontWeight: 600, fontSize: 18, borderBottom: '1px solid #219150'
          }}>
            Menu
            <Button className="close-btn"
              style={{
                background: 'transparent',
                color: 'white',
                border: 'none',
                fontSize: 21,
                float: 'right',
                marginRight: 2,
                marginTop: -4,
                cursor: 'pointer'
              }}
              onClick={() => setSideOpen(false)}
              aria-label="Close sidebar"
            >&times;</Button>
          </div>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: 15 }}>
            <li style={{ padding: '16px 12px', cursor: 'pointer' }}><span role="img" aria-label="calendar">📅</span> Calendar</li>
            <li style={{ padding: '16px 12px', cursor: 'pointer' }}>
              <span role="img" aria-label="rec">🥗</span> Recommendations
            </li>
            <li style={{ padding: '16px 12px', cursor: 'pointer' }}>
              <span role="img" aria-label="user">👤</span> Account
            </li>
            <li style={{ padding: '16px 12px', color: '#ffee99', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
              <span style={{ fontSize: 14 }}>Food data: <a style={{ color: '#FFEF98' }} href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer">USDA FoodData Central</a></span>
            </li>
          </ul>
        </aside>
        {/* Overlay for mobile menu open */}
        {!sideOpen && (
          <Button className="open-side-menu-btn"
            style={{
              position: 'absolute',
              left: 6,
              top: 72,
              background: '#27AE60',
              padding: 9,
              color: '#fff',
              fontWeight: 700,
              zIndex: 10,
              fontSize: 18,
              boxShadow: '2px 3px 10px rgba(0,0,0,0.07)'
            }}
            onClick={() => setSideOpen(true)}
          >☰</Button>
        )}
        {/* Main content grid */}
        <main
          className="main-content"
          style={{
            flex: 1,
            background: 'var(--bg-secondary)',
            borderLeft: sideOpen ? '1px solid #eaeaea' : 'none',
            padding: window.innerWidth < 900 ? 12 : 36,
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            transition: 'padding .2s'
          }}
        >
          {/* Calendar & meals in grid */}
          <div style={{ display: 'flex', flexDirection: window.innerWidth < 700 ? 'column' : 'row', gap: 40 }}>
            <div style={{ flex: 3 }}>
              <MealCalendar meals={meals} onSelectDay={()=>{}} />
              <MealList
                meals={meals}
                onEdit={handleEditMeal}
                onDelete={handleDeleteMeal}
                onView={() => {}} />
            </div>
            <div style={{ flex: 2, minWidth: 270 }}>
              <Recommendations recommendations={recommendations} onAddMeal={handleAddMeal} />
            </div>
          </div>
        </main>
      </div>
      {/* Modal dialogs */}
      {showMealForm && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <MealForm
              initialData={editingMeal}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
      <NutritionLookupModal
        isOpen={lookupOpen}
        onClose={() => setLookupOpen(false)}
        onSelect={() => setLookupOpen(false)}
      />
      {/* Style block for modal dialogs and other modern UI tweaks */}
      <style>{`
        .modal-overlay {
          position: fixed; z-index: 500;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(34, 50, 92, 0.17);
          display: flex; align-items: center; justify-content: center;
        }
        .modal-dialog {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 5px 34px -6px #2D9CDB40;
          padding: 2.2rem 2.9rem 2rem;
          min-width: 300px;
          max-width: 94vw;
          animation: modalUp 0.4s cubic-bezier(.5,-0.48,.28,1.45);
        }
        .modal-dialog button, .modal-dialog .btn {
          background: #F2994A;
          color: #fff;
          font-weight: 600;
          border-radius: 7px;
          border: none;
          margin: 7px 4px 0 0;
          padding: 11px 30px;
          font-size: 1.08rem;
          transition: background 0.2s;
          box-shadow: 0 3px 9px -7px #F2994A60;
        }
        .modal-dialog button:hover, .modal-dialog .btn:hover {
          background: #27AE60;
        }
        @keyframes modalUp {
          from { transform: translateY(80px) scale(.95); opacity: .2 }
          to { transform: translateY(0) scale(1); opacity: 1 }
        }
        .side-menu {
          min-height: 100vh;
        }
        .side-menu ul li:hover, .side-menu ul li:focus {
          background: rgba(0,0,0,0.10);
        }
        .close-btn {
          float: right;
          margin-top: -6px;
          font-size: 21px;
        }
        .main-content {
          min-height: 90vh;
        }
        @media (max-width:900px) {
          .side-menu {
            position: fixed;
            left: 0; top: 0;
            min-height: 100vh;
            z-index: 12;
          }
          .main-content {
            padding: 14px !important;
          }
        }
        @media (max-width:700px) {
          .main-content > div {
            flex-direction: column !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
