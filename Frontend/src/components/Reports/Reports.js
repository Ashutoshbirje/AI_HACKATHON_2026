import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import './Reports.css';

function Reports() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`app-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <TopBar toggleSidebar={toggleSidebar} />

        <main className="reports-main">
          <h2>Reports Dashboard</h2>

          <div className="report-cards">
            <div className="report-card">
              <h3>Total Candidates</h3>
              <p>120</p>
            </div>

            <div className="report-card">
              <h3>Shortlisted</h3>
              <p>45</p>
            </div>

            <div className="report-card">
              <h3>Selected</h3>
              <p>20</p>
            </div>

            <div className="report-card">
              <h3>Rejected</h3>
              <p>30</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;