import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import './Jobs.css';

function Jobs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [jobs, setJobs] = useState([]);

  const [title, setTitle] = useState('');
  const [manager, setManager] = useState('');
  const [file, setFile] = useState(null);

  const [activeMenuId, setActiveMenuId] = useState(null);

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

  // ✅ Add Job
  const handleAddJob = () => {
    if (!title || !manager || !file) {
      alert('All fields required');
      return;
    }

    const newJob = {
      id: Date.now(),
      title,
      manager,
      fileName: file.name,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setJobs(prev => [...prev, newJob]);

    setTitle('');
    setManager('');
    setFile(null);
  };

  // ✅ Delete
  const handleDelete = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setActiveMenuId(null);
  };

  // ✅ Placeholder actions
  const handleView = (job) => {
    console.log('View:', job);
  };

  const handleEdit = (job) => {
    console.log('Edit:', job);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div className={`app-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <TopBar toggleSidebar={toggleSidebar} />

        <main className="jobs-main">
          {/* HEADER */}
          <div className="jobs-header">
            <h2>Jobs</h2>
          </div>

          {/* FORM */}
          <div className="job-form">
            <input
              type="text"
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Hiring Manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            />

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleAddJob}>Create Job</button>
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
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.manager}</td>
                    <td>{job.lastUpdated}</td>

                    {/* PDF DISPLAY */}
                    <td>
                      <span className="pdf-link">
                        📄 {job.fileName}
                      </span>
                    </td>

                    {/* MENU */}
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

                          <div
                            className="dropdown-item"
                            onClick={() => handleView(job)}
                          >
                            👁 View
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={() => handleEdit(job)}
                          >
                            ✏ Edit
                          </div>

                          <div
                            className="dropdown-item delete"
                            onClick={() => handleDelete(job.id)}
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
          {jobs.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              No jobs created
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Jobs;