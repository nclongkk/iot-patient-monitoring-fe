import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import { Equipments, Home, Patients } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/equipments" element={<Equipments />} />
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
