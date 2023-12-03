import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import { Equipments, Home, Patients } from './pages';
import { Equipment } from './pages/equipment';
import LoginPage from './pages/loginPage';
import NotFoundPage from './pages/notFoundPage';
import { EquipmentHistory } from './pages/equipmentHistory';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="equipments" element={<Equipments />} />
        <Route path="equipments/:id" element={<Equipment />} />
        <Route path="equipments/history/:id" element={<EquipmentHistory />} />
        <Route path="/patients" element={<Patients />} />
        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
            routes for. */}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
