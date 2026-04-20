import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import { useState } from 'react';
import './Pipeline.css';

const candidates = [
  {
    id: 1,
    name: 'Purni Sharma',
    role: 'Java Developer',
    stage: 'Applied',
    skills: 'SQL',
    lastActivity: 'Apr 04, 2024',
    score: 80,
  },
  {
    id: 2,
    name: 'Aman Patel',
    role: 'Frontend Developer',
    stage: 'Shortlisted',
    skills: 'React',
    lastActivity: 'Apr 27, 2024',
    score: 78,
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    role: 'Full Stack Developer',
    stage: 'Selected',
    skills: 'Node.js',
    lastActivity: 'Apr 04, 2024',
    score: 90,
  },
  {
    id: 4,
    name: 'Sakshi Verma',
    role: 'UI/UX Designer',
    stage: 'Shortlisted',
    skills: 'Figma',
    lastActivity: 'Apr 26, 2024',
    score: 75,
  },
  {
    id: 5,
    name: 'Vikram Singh',
    role: 'DevOps Engineer',
    stage: 'Selected',
    skills: 'AWS',
    lastActivity: 'Apr 25, 2024',
    score: 88,
  },
];

function Pipeline() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('All Jobs');
  const [stageFilter, setStageFilter] = useState('All Stages');

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // 🔍 FILTER LOGIC
  const filteredCandidates = candidates.filter((c) => {
    return (
      (jobFilter === 'All Jobs' || c.role === jobFilter) &&
      (stageFilter === 'All Stages' || c.stage === stageFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.skills.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // 📊 GROUP BY STAGE
  const grouped = {
    Applied: filteredCandidates.filter(c => c.stage === 'Applied'),
    Shortlisted: filteredCandidates.filter(c => c.stage === 'Shortlisted'),
    Selected: filteredCandidates.filter(c => c.stage === 'Selected'),
  };

  const renderColumn = (title, list) => (
    <div className="pipeline-column">
      <h3 className="column-title">{title}</h3>

      <div className="column-cards">
        {list.map((c) => (
          <div
            key={c.id}
            className="candidate-card"
            onClick={() => navigate(`/candidates/${c.id}`)}
          >
            <div className="card-avatar">
              {c.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="card-info">
              <h4>{c.name}</h4>
              <p>{c.role}</p>
            </div>

            <div className="card-score">{c.score}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div className={`app-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <TopBar toggleSidebar={toggleSidebar} />

        <main className="pipeline-main">
          <div className="pipeline-header">
            <h2 className="pipeline-title">Hiring Pipeline</h2>

            <div className="pipeline-header-right">
              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select onChange={(e) => setJobFilter(e.target.value)}>
                <option>All Jobs</option>
                <option>Java Developer</option>
                <option>Frontend Developer</option>
                <option>Full Stack Developer</option>
                <option>UI/UX Designer</option>
                <option>DevOps Engineer</option>
              </select>

              <select onChange={(e) => setStageFilter(e.target.value)}>
                <option>All Stages</option>
                <option>Applied</option>
                <option>Shortlisted</option>
                <option>Selected</option>
              </select>
            </div>
          </div>

          <div className="pipeline-container">
            {renderColumn('Applied', grouped.Applied)}
            {renderColumn('Shortlisted', grouped.Shortlisted)}
            {renderColumn('Selected', grouped.Selected)}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Pipeline;