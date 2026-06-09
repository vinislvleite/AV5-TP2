import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import Titulares from './pages/Titulares'
import Dependentes from './pages/Dependentes'
import Acomodacoes from './pages/Acomodacoes'
import Acomodados from './pages/Acomodados'
import Documentos from './pages/Documentos'

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        marginLeft: 'var(--sidebar-w)',
        flex: 1,
        padding: '36px 40px',
        maxWidth: 'calc(100vw - var(--sidebar-w))',
        overflowX: 'hidden',
      }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/titulares" element={<Titulares />} />
          <Route path="/dependentes" element={<Dependentes />} />
          <Route path="/acomodacoes" element={<Acomodacoes />} />
          <Route path="/acomodados" element={<Acomodados />} />
          <Route path="/documentos" element={<Documentos />} />
        </Routes>
      </main>
    </div>
  )
}
