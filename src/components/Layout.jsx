import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { fetchStats } from '../lib/api';
import { getUser } from '../lib/auth';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        const user = getUser();
        // Sidebar/topbar only need a small stitched view of user + headline stats.
        setStats({
          ...data,
          userName: user?.name || user?.businessName || 'New User',
          totalLeads: data?.totalLeads || 0,
          totalConversations: data?.totalConversations || 0,
        });
      } catch {
        // silently fail - stats are optional
      }
    }
    loadStats();
  }, []);

  return (
    <div className="app">
      <div 
        className={`sb-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={() => setIsMenuOpen(false)}
      />
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} stats={stats} />
      <main className="app-main">
        <Topbar toggleMenu={toggleMenu} isOpen={isMenuOpen} />
        <div>
          <Outlet context={{ toggleMenu, isMenuOpen, setIsMenuOpen }} />
        </div>
      </main>
    </div>
  );
}
