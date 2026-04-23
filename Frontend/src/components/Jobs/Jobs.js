import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import AddJobModal from '../AddJobModal/AddJobModal'; // ✅ import modal
import './Jobs.css';

function Jobs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState('');
  const [managerFilter, setManagerFilter] = useState('All Managers');
  const [sortBy, setSortBy] = useState('Latest');

  const [activeMenuId, setActiveMenuId] = useState(null);

  // ✅ NEW: modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // ✅ Close dropdown
  useEffect(() => {
    const close = () => setActiveMenuId(null);
    const esc = (e) => e.key === 'Escape' && setActiveMenuId(null);

    document.addEventListener('click', close);
    document.addEventListener('keydown', esc);

    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', esc);
    };
  }, []);

  // ✅ Add Job FROM MODAL
  const handleAddJob = (newJob) => {
    setJobs(prev => [...prev, newJob]);
  };

  // ✅ Delete
  const handleDelete = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setActiveMenuId(null);
  };

  const handleView = (job) => {
    console.log('View:', job);
  };

  const handleEdit = (job) => {
    console.log('Edit:', job);
  };

  // ✅ FILTER
  let filtered = jobs.filter((j) =>
    (managerFilter === 'All Managers' || j.manager === managerFilter) &&
    (
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.manager.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ✅ SORT
  if (sortBy === 'Name') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'Oldest') {
    filtered.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
  } else {
    filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div className={`app-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <TopBar toggleSidebar={toggleSidebar} />

        <main className="jobs-main">

          {/* HEADER */}
          <div className="jobs-header">
            <h2 className="jobs-title">Jobs</h2>

            <div className="jobs-header-right">

              {/* FILTERS */}
              <div className="jobs-filters">
                <select
                  className="filter-select"
                  onChange={(e) => setManagerFilter(e.target.value)}
                >
                  <option>All Managers</option>
                  <option>HR Manager</option>
                  <option>Tech Lead</option>
                </select>

                <select
                  className="filter-select"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Latest">Sort: Latest</option>
                  <option value="Oldest">Sort: Oldest</option>
                  <option value="Name">Sort: Name</option>
                </select>
              </div>

              {/* SEARCH */}
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* ✅ UPDATED BUTTON */}
              <button
                className="btn-add-job"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Job
              </button>

            </div>
          </div>

          {/* TABLE */}
          <div className="jobs-table-wrap">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Name</th>
                  <th>Manager</th>
                  <th>Last Updated</th>
                  <th>Job Description</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} className="job-row">
                    <td>{job.title}</td>
                    <td>{job.manager}</td>
                    <td>{job.lastUpdated}</td>

                    <td>
                      <span className="pdf-link">📄 {job.fileName}</span>
                    </td>

                    {/* ACTION MENU */}
                    <td style={{ position: 'relative' }}>
                      <button
                        className="more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(prev =>
                            prev === job.id ? null : job.id
                          );
                        }}
                      >
                         ⋮
                      </button>

                      {activeMenuId === job.id && (
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

                          <div className="dropdown-item" onClick={() => handleView(job)}>
                            👁 View
                          </div>

                          <div className="dropdown-item" onClick={() => handleEdit(job)}>
                            ✏ Edit
                          </div>

                          <div className="dropdown-item delete" onClick={() => handleDelete(job.id)}>
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
            <p className="no-data">No jobs found</p>
          )}

        </main>
      </div>

      {/* ✅ ADD JOB MODAL */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddJob}
      />

    </div>
  );
}

export default Jobs;