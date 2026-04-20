import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import './Settings.css';

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [name, setName] = useState('Rahul Kumar');
  const [email, setEmail] = useState('rahul@email.com');

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSave = () => {
    alert('Settings Saved');
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`app-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <TopBar toggleSidebar={toggleSidebar} />

        <main className="settings-main">
          <h2>Settings</h2>

          <div className="settings-form">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />

            <button onClick={handleSave}>Save Changes</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;