
import { useState, useEffect } from 'react';
import './AddCandidateModal.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ⚠️ NEVER expose this in production (use backend instead)
const AFFINDA_API_KEY = process.env.REACT_APP_AFFINDA_API_KEY;

function AddCandidateModal({ isOpen, onClose, onAdd, editData }) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    jobTitle: '',
    skills: '',
    phone: '',
    location: '',
    yearsOfExperience: 0,
    department: '',
    currentCompany: '',
    currentCtc: '',
    education: '',
    currentStage: '',
    resume: null,
  });

  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  // ---------------- PREFILL ----------------
  useEffect(() => {
  if (editData) {
    setForm(prev => ({
      ...prev, // 🔥 keeps all existing fields intact

      name: `${editData.firstName || ''} ${editData.lastName || ''}`.trim(),
      email: editData.email || '',
      jobTitle: editData.department || '',

      // 👇 map additional fields safely
      phone: editData.phone || prev.phone,
      location: editData.location || prev.location,
      yearsOfExperience: editData.yearsOfExperience || prev.yearsOfExperience,
      department: editData.department || prev.department,
      currentCompany: editData.currentCompany || prev.currentCompany,
      currentCtc: editData.currentCtc || prev.currentCtc,
      education: editData.education || prev.education,
      currentStage: editData.currentStage || prev.currentStage,

      skills: editData.skills || prev.skills,
      resume: null, // keep as is
    }));

    setResumeUrl(editData.resumeUrl || '');
  }
}, [editData]);

  if (!isOpen) return null;

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'resume') {
      const file = files[0];
      setForm({ ...form, resume: file });

      // 🔥 Upload + Parse both
      handleFileUpload(file);
      parseResume(file);

    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ---------------- CLOUDINARY UPLOAD ----------------
  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await fetch(`${BASE_URL}/candidates/upload-resume`, {
        method: "POST",
        body: formData,
      });

      const url = await res.text();

      console.log("Cloudinary URL:", url);
      setResumeUrl(url);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------------- AFFINDA PARSE ----------------
const parseResume = async (file) => {
  try {
    setParsing(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.affinda.com/v2/resumes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AFFINDA_API_KEY}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Affinda Response:", data);

    const parsed = data?.data || {};

    // ---------------- BASIC INFO ----------------
    const name =
      parsed?.fullName ||
      parsed?.name?.raw ||
      `${parsed?.firstName || ""} ${parsed?.lastName || ""}`.trim();

    const email =
      parsed?.email ||
      (Array.isArray(parsed?.emails) ? parsed.emails[0] : "") ||
      "";

    const phone =
      parsed?.phone ||
      (Array.isArray(parsed?.phoneNumbers) ? parsed.phoneNumbers[0] : "") ||
      "";

    // ---------------- JOB ----------------
    const jobTitle =
      parsed?.currentJobTitle ||
      (Array.isArray(parsed?.experience) && parsed.experience[0]?.jobTitle) ||
      "";

    const currentCompany =
      parsed?.currentCompany ||
      (Array.isArray(parsed?.experience) && parsed.experience[0]?.companyName) ||
      "";

    // ---------------- EXPERIENCE ----------------
    const yearsOfExperience = parsed?.totalExperienceYears || 0;

    // ---------------- LOCATION ----------------
    const location =
      parsed?.city ||
      parsed?.state ||
      parsed?.country ||
      parsed?.addressFull ||
      "";

    // ---------------- EDUCATION ----------------
    const education =
      parsed?.highestEducation ||
      (Array.isArray(parsed?.education) &&
        parsed.education[0]?.degree + " " +
        (parsed.education[0]?.fieldOfStudy || "")) ||
      "";

    // ---------------- SKILLS ----------------
    const skills = Array.isArray(parsed?.skills)
      ? parsed.skills
          .filter(s => s && (s.skillName || s.name))
          .map(s => s.skillName || s.name)
          .join(", ")
      : parsed?.primarySkill || "";

    // ---------------- CTC (NOT AVAILABLE → KEEP EMPTY) ----------------
    const currentCtc = "";

    // ---------------- STAGE DEFAULT ----------------
    const currentStage = "APPLIED";

    // ---------------- UPDATE FORM ----------------
    setForm(prev => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
      jobTitle: jobTitle || prev.jobTitle,

      phone: phone || prev.phone,
      location: location || prev.location,
      yearsOfExperience: yearsOfExperience || prev.yearsOfExperience,
      department: jobTitle || prev.department,
      currentCompany: currentCompany || prev.currentCompany,
      currentCtc: currentCtc || prev.currentCtc,
      education: education || prev.education,
      currentStage: currentStage,

      skills: skills || prev.skills, // still stored but hidden in UI
    }));

  } catch (err) {
    console.error("Parsing failed:", err);
  } finally {
    setParsing(false);
  }
};

  // ---------------- NAME SPLIT ----------------
  const splitName = (fullName) => {
    const parts = fullName.trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    };
  };

  // ---------------- SUBMIT ----------------
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

        phone: form.phone,
        location: form.location,
        yearsOfExperience: 4,
        department: form.jobTitle,
        currentCompany: form.currentCompany,
        currentCtc: form.currentCtc,
        education: form.education,
        currentStage: "APPLIED",

        resumeUrl: resumeUrl
      };

      let url = `${BASE_URL}/candidates`;
      let method = 'POST';

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

      if (!response.ok) throw new Error("Save failed");

      onAdd();
      onClose();

      // reset
      setForm({
        name: '',
        email: '',
        jobTitle: '',
        skills: '',
    phone: '',
    location: '',
    yearsOfExperience: 0,
    department: '',
    currentCompany: '',
    currentCtc: '',
    education: '',
    currentStage: '',
        resume: null,
      });

      setResumeUrl('');

    } catch (err) {
      console.error(err);
      alert("Error saving candidate");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
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
            value={form.jobTitle}
            onChange={handleChange}
          />

          {/* <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={form.skills}
            onChange={handleChange}
          /> */}

          {/* FILE */}
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
          />

          {/* STATUS */}
          {uploading && <p style={{ color: 'blue' }}>Uploading resume...</p>}
          {parsing && <p style={{ color: 'green' }}>Parsing resume...</p>}

          {/* PREVIEW LINK */}
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              View Resume
            </a>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading || uploading || parsing}
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Add'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddCandidateModal;