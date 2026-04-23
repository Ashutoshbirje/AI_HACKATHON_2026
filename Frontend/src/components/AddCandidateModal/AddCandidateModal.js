import { useState, useEffect } from 'react';
import './AddCandidateModal.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AddCandidateModal({ isOpen, onClose, onAdd, editData }) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    jobTitle: '',
    skills: '',
    resume: null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Detect mode
  const isEdit = !!editData;

  // ✅ Prefill form in EDIT mode
  useEffect(() => {
    if (editData) {
      setForm({
        name: `${editData.firstName} ${editData.lastName}`,
        email: editData.email,
        jobTitle: editData.department,
        skills: editData.skills,
        resume: null,
      });
    }
  }, [editData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'resume') {
      setForm({ ...form, resume: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const splitName = (fullName) => {
    const parts = fullName.trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { firstName, lastName } = splitName(form.name);

      const payload = {
        firstName,
        lastName,
        email: form.email,
        skills: form.skills,

        phone: "8888888888",
        location: "Remote",
        yearsOfExperience: 4,
        department: form.jobTitle,
        currentCompany: "API Tester Inc",
        currentCtc: "12 LPA",
        education: "B.Tech CS",

        currentStage: "APPLIED",
      };

      let url = `${BASE_URL}/candidates`;
      let method = 'POST';

      // ✅ EDIT MODE
      if (isEdit) {
        url = `${BASE_URL}/candidates/${editData.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      onAdd();
      onClose();

      // reset
      setForm({
        name: '',
        email: '',
        jobTitle: '',
        skills: '',
        resume: null,
      });

    } catch (err) {
      console.error(err);
      alert('Error saving candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEdit ? 'Edit Candidate' : 'Add Candidate'}</h3>

        <form onSubmit={handleSubmit} className="modal-form">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="jobTitle"
            placeholder="Job Role"
            required
            value={form.jobTitle}
            onChange={handleChange}
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={form.skills}
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

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Add'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddCandidateModal;