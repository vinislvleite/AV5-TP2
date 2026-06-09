import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Cliente } from '../types'
import { PageHeader, Card, Badge, EmptyState } from '../components/ui'

const nomeLabel: Record<string, string> = {
  CASAL_SIMPLES: 'Casal Simples', FAMILIA_MAIS: 'Família Mais',
  FAMILIA_SIMPLES: 'Família Simples', FAMILIA_SUPER: 'Família Super',
  SOLTEIRO_MAIS: 'Solteiro Mais', SOLTEIRO_SIMPLES: 'Solteiro Simples',
}

export default function Acomodados() {
  const [acomodados, setAcomodados] = useState<Cliente[]>([])

  useEffect(() => {
    api.acomodados.listar().then(d => setAcomodados(d as Cliente[])).catch(() => {})
  }, [])

  return (
    <div>
      <PageHeader title="Hóspedes" subtitle={`${acomodados.length} titular(es) acomodado(s)`} />

      {acomodados.length === 0 ? (
        <Card><EmptyState message="Nenhum hóspede acomodado no momento" /></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {acomodados.map(t => (
            <Card key={t.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: 'var(--accent-glow)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 17,
                    flexShrink: 0,
                  }}>
                    {t.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{t.nome}</div>
                    <div style={{ color: 'var(--text2)', fontSize: 12, marginTop: 2 }}>
                      Acomodação: <span style={{ color: 'var(--accent)' }}>
                        {t.acomodacao ? nomeLabel[t.acomodacao.nome] : '—'}
                      </span>
                    </div>

                    {(t.dependentes?.length || 0) > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>
                          DEPENDENTES HOSPEDADOS
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {t.dependentes?.map(d => (
                            <div key={d.id} style={{
                              background: 'var(--bg3)', border: '1px solid var(--border)',
                              borderRadius: 7, padding: '4px 12px', fontSize: 12, color: 'var(--text2)',
                            }}>
                              {d.nome}
                              {d.acomodacao && d.acomodacao.id !== t.acomodacaoId && (
                                <span style={{ color: 'var(--accent)', marginLeft: 6, fontSize: 10 }}>
                                  {nomeLabel[d.acomodacao.nome]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Badge label="Acomodado" color="success" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
