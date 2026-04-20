import { useState } from 'react';
import './AddCandidateModal.css';

function AddCandidateModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    jobTitle: '',
    skills: '',
    resume: null,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setForm({ ...form, resume: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCandidate = {
      id: Date.now(),
      initials: form.name.charAt(0),
      name: form.name,
      email: form.email,
      jobTitle: form.jobTitle,
      stage: 'Applied',
      stageColor: '#e0e7ff',
      stageTextColor: '#4338ca',
      skills: form.skills,
      lastActivity: new Date().toISOString().split('T')[0],
    };

    onAdd(newCandidate);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Candidate</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="jobTitle"
            placeholder="Job Role"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            onChange={handleChange}
          />

          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCandidateModal;