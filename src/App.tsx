import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import { Equipments, Home, Patients } from './pages';
import { useEffect } from 'react';
import axios, { setAuthToken } from './api/axiosService'; // Import the Axios service
import { Equipment } from './pages/equipment';

function App() {
  useEffect(() => {
    const login = async () => {
      const response = await axios.post(
        'http://14.225.207.82:3000/api/auth/login',
        {
          email: 'admin@gmail.com',
          password: '123123',
        }
      );
      // Handle successful login, e.g., store token in local storage, etc.
      localStorage.setItem('token', response.data.data.accessToken);
      setAuthToken(response.data.data.accessToken);
    };
    login();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/equipments" element={<Equipments />} />
        <Route path="/equipments/:id" element={<Equipment />} />
        <Route path="/patients" element={<Patients />} />

        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        {/* <Route path="*" element={<NoMatch />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
