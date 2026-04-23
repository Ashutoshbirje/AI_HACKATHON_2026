// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// For CRA use:
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getCandidates = async () => {
  const res = await fetch(`${BASE_URL}/candidates`);
  return res.json();
};

export const getCandidatesPaginated = async (page = 0, size = 5) => {
  const res = await fetch(`${BASE_URL}/candidates?page=${page}&size=${size}&sort=id,asc`);
  return res.json();
};

export const getCandidateById = async (id) => {
  const res = await fetch(`${BASE_URL}/candidates/${id}`);
  return res.json();
};

export const searchCandidates = async (name) => {
  const res = await fetch(`${BASE_URL}/candidates/search?name=${name}`);
  return res.json();
};

export const createCandidate = async (candidate) => {
  const res = await fetch(`${BASE_URL}/candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(candidate),
  });
  return res.json();
};

export const updateCandidate = async (candidate) => {
  const res = await fetch(`${BASE_URL}/candidates`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(candidate),
  });
  return res.json();
};

export const updateStage = async (id, stage) => {
  const res = await fetch(`${BASE_URL}/candidates/${id}/stage?stage=${stage}`, {
    method: 'PATCH',
  });
  return res.json();
};

export const deleteCandidate = async (id) => {
  await fetch(`${BASE_URL}/candidates/${id}`, {
    method: 'DELETE',
  });
};