import { useEffect, useState } from 'react'
import { Users, UserPlus, Bed, BedDouble } from 'lucide-react'
import { api } from '../services/api'
import type { Cliente, Acomodacao } from '../types/index'
import { StatCard, Card, PageHeader } from '../components/ui'

export default function Dashboard() {
  const [titulares, setTitulares] = useState<Cliente[]>([])
  const [dependentes, setDependentes] = useState<Cliente[]>([])
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([])
  const [acomodados, setAcomodados] = useState<Cliente[]>([])

  useEffect(() => {
    Promise.all([
      api.titulares.listar() as Promise<Cliente[]>,
      api.acomodacoes.listar() as Promise<Acomodacao[]>,
      api.acomodados.listar() as Promise<Cliente[]>,
    ]).then(([t, ac, acd]) => {
      setTitulares(t)
      setDependentes(t.flatMap(x => x.dependentes || []))
      setAcomodacoes(ac)
      setAcomodados(acd)
    }).catch(() => {})
  }, [])

  const nomeLabel: Record<string, string> = {
    CASAL_SIMPLES: 'Casal Simples',
    FAMILIA_MAIS: 'Família Mais',
    FAMILIA_SIMPLES: 'Família Simples',
    FAMILIA_SUPER: 'Família Super',
    SOLTEIRO_MAIS: 'Solteiro Mais',
    SOLTEIRO_SIMPLES: 'Solteiro Simples',
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral do sistema Atlantis" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Titulares" value={titulares.length} icon={<Users size={28} />} />
        <StatCard label="Dependentes" value={dependentes.length} icon={<UserPlus size={28} />} />
        <StatCard label="Acomodações" value={acomodacoes.length} icon={<Bed size={28} />} />
        <StatCard label="Hóspedes" value={acomodados.length} icon={<BedDouble size={28} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Últimos titulares */}
        <Card>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Últimos Titulares
          </h2>
          {titulares.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>Nenhum titular cadastrado</p>
          ) : (
            titulares.slice(-5).reverse().map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{t.nome}</div>
                  <div style={{ color: 'var(--text3)', fontSize: 11 }}>
                    {(t.dependentes?.length || 0)} dependente(s)
                  </div>
                </div>
                <div style={{
                  fontSize: 11, color: t.acomodacaoId ? 'var(--success)' : 'var(--text3)',
                  background: t.acomodacaoId ? 'rgba(52,211,153,0.1)' : 'var(--bg3)',
                  padding: '2px 8px', borderRadius: 99,
                }}>
                  {t.acomodacaoId ? 'Acomodado' : 'Disponível'}
                </div>
              </div>
            ))
          )}
        </Card>

        {/* Acomodações */}
        <Card>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Acomodações Disponíveis
          </h2>
          {acomodacoes.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>Nenhuma acomodação cadastrada</p>
          ) : (
            acomodacoes.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{nomeLabel[a.nome]}</div>
                  <div style={{ color: 'var(--text3)', fontSize: 11 }}>
                    {a.climatizacao ? 'Climatizado' : 'Sem climatização'} · {a.garagem} vaga(s)
                  </div>
                </div>
                <div style={{
                  fontSize: 11,
                  color: (a.clientes?.length || 0) > 0 ? 'var(--warning)' : 'var(--accent)',
                  background: (a.clientes?.length || 0) > 0 ? 'rgba(251,191,36,0.1)' : 'var(--accent-glow)',
                  padding: '2px 8px', borderRadius: 99,
                }}>
                  {(a.clientes?.length || 0) > 0 ? 'Ocupada' : 'Livre'}
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  )
}
