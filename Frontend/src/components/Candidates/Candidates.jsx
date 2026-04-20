import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import AddCandidateModal from '../AddCandidateModal/AddCandidateModal';
import './Candidates.css';

const candidatesData = [
  {
    id: 1,
    initials: 'A',
    name: 'Purni Sharma',
    email: 'avg.e@rblog',
    jobTitle: 'Java Developer',
    stage: 'Applied',
    stageColor: '#e0e7ff',
    stageTextColor: '#4338ca',
    skills: 'Screening, SQL',
    lastActivity: '2024-04-04',
  },
  {
    id: 2,
    initials: 'P',
    name: 'Aman Patel',
    email: 'amit.alaman@anpr.be',
    jobTitle: 'Frontend Developer',
    stage: 'Shortlisted',
    stageColor: '#fef3c7',
    stageTextColor: '#d97706',
    skills: 'Python, SQL',
    lastActivity: '2024-04-27',
  },
  {
    id: 3,
    initials: 'R',
    name: 'Rohan Gupta',
    email: 'nsha.gngh@email.com',
    jobTitle: 'Full Stack Developer',
    stage: 'Selected',
    stageColor: '#dcfce7',
    stageTextColor: '#16a34a',
    skills: 'Node.js, Express, React',
    lastActivity: '2024-04-04',
  },
  {
    id: 4,
    initials: 'S',
    name: 'Sakshi Verma',
    email: 'sneha.vlngt@email.com',
    jobTitle: 'UI/UX Designer',
    stage: 'Shortlisted',
    stageColor: '#fef3c7',
    stageTextColor: '#d97706',
    skills: 'Figma, Adobe XD',
    lastActivity: '2024-04-26',
  },
  {
    id: 5,
    initials: 'V',
    name: 'Vikram Singh',
    email: 'vikramsingh@email.com',
    jobTitle: 'DevOps Engineer',
    stage: 'Selected',
    stageColor: '#dcfce7',
    stageTextColor: '#16a34a',
    skills: 'AWS, Docker, Python',
    lastActivity: '2024-04-25',
  },
];

function Candidates() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [candidates, setCandidates] = useState(candidatesData);

  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('All Jobs');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [sortBy, setSortBy] = useState('Latest');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // ✅ Close dropdown on outside click + ESC
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // ✅ Add Candidate
  const handleAddCandidate = (newCandidate) => {
    setCandidates(prev => [...prev, newCandidate]);
  };

  // ✅ Delete
  const handleDelete = (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    setActiveMenuId(null);
  };

  // ✅ View
  const handleView = (id) => {
    navigate(`/candidates/${id}`);
  };

  // ✅ Edit (placeholder)
  const handleEdit = (candidate) => {
    console.log('Edit:', candidate);
    setActiveMenuId(null);
  };

  // ✅ Filter + Search
  let filtered = candidates.filter((c) => {
    return (
      (jobFilter === 'All Jobs' || c.jobTitle === jobFilter) &&
      (stageFilter === 'All Stages' || c.stage === stageFilter) &&
      (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.skills.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  // ✅ Sort
  if (sortBy === 'Name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'Oldest') {
    filtered.sort((a, b) => new Date(a.lastActivity) - new Date(b.lastActivity));
  } else {
    filtered.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div className={`app-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <TopBar toggleSidebar={toggleSidebar} />

        <main className="candidates-main">
          {/* HEADER */}
          <div className="candidates-header">
            <h2 className="candidates-title">Candidates</h2>

            <div className="candidates-header-right">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="btn-add-candidate"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Candidate
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="candidates-filters">
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

            <select onChange={(e) => setSortBy(e.target.value)}>
              <option value="Latest">Sort: Latest</option>
              <option value="Oldest">Sort: Oldest</option>
              <option value="Name">Sort: Name</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="candidates-table-wrap">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Job Title</th>
                  <th>Stage</th>
                  <th>Skills</th>
                  <th>Last Activity</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="candidate-row">
                    <td onClick={() => navigate(`/candidates/${c.id}`)}>
                      <div className="candidate-name-cell">
                        <div className="candidate-avatar">{c.initials}</div>
                        <div>
                          <p className="candidate-name">{c.name}</p>
                          <p className="candidate-email">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    <td>{c.jobTitle}</td>

                    <td>
                      <span
                        className="stage-badge"
                        style={{
                          background: c.stageColor,
                          color: c.stageTextColor,
                        }}
                      >
                        {c.stage}
                      </span>
                    </td>

                    <td>{c.skills}</td>
                    <td>{c.lastActivity}</td>

                    {/* MENU */}
                    <td style={{ position: 'relative' }}>
                      <button
                        className="more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(prev =>
                            prev === c.id ? null : c.id
                          );
                        }}
                      >
                        ⋮
                      </button>

                      {activeMenuId === c.id && (
                        <div
                          className="dropdown-menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="dropdown-header">
                            <span>Actions</span>
                            <button
                              className="dropdown-close"
                              onClick={() => setActiveMenuId(null)}
                            >
                              ✖
                            </button>
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={() => handleView(c.id)}
                          >
                            👁 View
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={() => handleEdit(c)}
                          >
                            ✏ Edit
                          </div>

                          <div
                            className="dropdown-item delete"
                            onClick={() => handleDelete(c.id)}
                          >
                            🗑 Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY */}
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              No candidates found
            </p>
          )}
        </main>
      </div>

      {/* MODAL */}
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCandidate}
      />
    </div>
  );
}

export default Candidates;