import { useEffect, useState } from 'react'
import { Plus, Trash2, Link, X } from 'lucide-react'
import { api } from '../services/api'
import type { Acomodacao, Cliente, NomeAcomodacao } from '../types'
import {
  PageHeader, Button, Card, Modal, Input, Select,
  FormGrid, Badge, EmptyState, Toast,
} from '../components/ui'

const nomeOptions = [
  { value: 'CASAL_SIMPLES', label: 'Casal Simples' },
  { value: 'FAMILIA_MAIS', label: 'Família Mais' },
  { value: 'FAMILIA_SIMPLES', label: 'Família Simples' },
  { value: 'FAMILIA_SUPER', label: 'Família Super' },
  { value: 'SOLTEIRO_MAIS', label: 'Solteiro Mais' },
  { value: 'SOLTEIRO_SIMPLES', label: 'Solteiro Simples' },
]

const nomeLabel: Record<string, string> = Object.fromEntries(nomeOptions.map(o => [o.value, o.label]))

const emptyForm = {
  nome: '' as NomeAcomodacao | '',
  camaSolteiro: '0', camaCasal: '0', suite: '0',
  climatizacao: 'false', garagem: '0',
}

const emptyVincular = {
  nomeTitular: '', acomodacaoId: 0, titularFicara: true, nomesDependentes: [] as string[], inputDep: '',
}

export default function Acomodacoes() {
  const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([])
  const [titulares, setTitulares] = useState<Cliente[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showVincular, setShowVincular] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [vincular, setVincular] = useState(emptyVincular)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)

  const carregar = () => {
    Promise.all([
      api.acomodacoes.listar() as Promise<Acomodacao[]>,
      api.titulares.listar() as Promise<Cliente[]>,
    ]).then(([a, t]) => { setAcomodacoes(a); setTitulares(t) }).catch(() => {})
  }

  useEffect(() => { carregar() }, [])

  const criarAcomodacao = async () => {
    if (!form.nome) return setToast({ msg: 'Selecione o tipo de acomodação', type: 'error' })
    setLoading(true)
    try {
      await api.acomodacoes.criar({
        nome: form.nome,
        camaSolteiro: Number(form.camaSolteiro),
        camaCasal: Number(form.camaCasal),
        suite: Number(form.suite),
        climatizacao: form.climatizacao === 'true',
        garagem: Number(form.garagem),
      })
      setToast({ msg: 'Acomodação criada!', type: 'success' })
      setShowModal(false)
      setForm(emptyForm)
      carregar()
    } catch (e: any) {
      setToast({ msg: e.message, type: 'error' })
    } finally { setLoading(false) }
  }

  const excluir = async (id: number) => {
    if (!confirm('Excluir esta acomodação?')) return
    try {
      await api.acomodacoes.excluir(id)
      setToast({ msg: 'Acomodação excluída!', type: 'success' })
      carregar()
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }

  const abrirVincular = (a: Acomodacao) => {
    setVincular({ ...emptyVincular, acomodacaoId: a.id })
    setShowVincular(true)
  }

  const salvarVincular = async () => {
    if (!vincular.nomeTitular) return setToast({ msg: 'Informe o nome do titular', type: 'error' })
    setLoading(true)
    try {
      await api.acomodacoes.vincular({
        nomeTitular: vincular.nomeTitular,
        acomodacaoId: vincular.acomodacaoId,
        titularFicara: vincular.titularFicara,
        nomesDependentes: vincular.nomesDependentes,
      })
      setToast({ msg: 'Acomodação vinculada!', type: 'success' })
      setShowVincular(false)
      carregar()
    } catch (e: any) {
      setToast({ msg: e.message, type: 'error' })
    } finally { setLoading(false) }
  }

  const cancelarAcomodacao = async (nomeTitular: string) => {
    if (!confirm(`Cancelar acomodação de "${nomeTitular}"?`)) return
    try {
      await api.acomodacoes.cancelar({ nomeTitular })
      setToast({ msg: 'Acomodação cancelada!', type: 'success' })
      carregar()
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }

  // Busca titular selecionado pelo nome para mostrar dependentes
  const titularSelecionado = titulares.find(
    t => t.nome.toLowerCase() === vincular.nomeTitular.toLowerCase()
  )

  const adicionarDep = (nome: string) => {
    if (!nome.trim()) return
    if (vincular.nomesDependentes.includes(nome)) return
    setVincular(p => ({ ...p, nomesDependentes: [...p.nomesDependentes, nome], inputDep: '' }))
  }

  const removerDep = (nome: string) => {
    setVincular(p => ({ ...p, nomesDependentes: p.nomesDependentes.filter(d => d !== nome) }))
  }

  const f = (k: keyof typeof emptyForm) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div>
      <PageHeader
        title="Acomodações"
        subtitle={`${acomodacoes.length} acomodação(ões) disponível(eis)`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={14} /> Nova Acomodação</Button>}
      />

      {acomodacoes.length === 0 ? (
        <Card><EmptyState message="Nenhuma acomodação cadastrada ainda" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {acomodacoes.map(a => {
            const ocupada = (a.clientes?.length || 0) > 0
            const titular = ocupada
              ? titulares.find(t => t.acomodacaoId === a.id || t.dependentes?.some(d => d.acomodacaoId === a.id))
              : null
            return (
              <Card key={a.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>
                      {nomeLabel[a.nome]}
                    </div>
                    <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 2 }}>#{a.id}</div>
                  </div>
                  <Badge label={ocupada ? 'Ocupada' : 'Livre'} color={ocupada ? 'warning' : 'success'} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Cama Solteiro', val: a.camaSolteiro },
                    { label: 'Cama Casal', val: a.camaCasal },
                    { label: 'Suíte', val: a.suite },
                    { label: 'Garagem', val: a.garagem },
                    { label: 'Climatização', val: a.climatizacao ? 'Sim' : 'Não' },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--accent)' }}>
                        {item.val}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>

                {ocupada && titular && (
                  <div style={{
                    background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px',
                    marginBottom: 12, fontSize: 12, color: 'var(--text2)',
                  }}>
                    Titular: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{titular.nome}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  {!ocupada ? (
                    <Button size="sm" onClick={() => abrirVincular(a)} style={{ flex: 1 }}>
                      <Link size={12} /> Vincular
                    </Button>
                  ) : titular ? (
                    <Button size="sm" variant="secondary" onClick={() => cancelarAcomodacao(titular.nome)} style={{ flex: 1 }}>
                      <X size={12} /> Cancelar
                    </Button>
                  ) : null}
                  <Button size="sm" variant="danger" onClick={() => excluir(a.id)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal criar acomodação */}
      {showModal && (
        <Modal title="Nova Acomodação" onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Select label="Tipo de Acomodação" value={form.nome} onChange={f('nome')} options={nomeOptions} required />
            <FormGrid>
              <Select label="Climatização" value={form.climatizacao} onChange={f('climatizacao')} options={[
                { value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' },
              ]} />
              <Input label="Garagem (vagas)" value={form.garagem} onChange={f('garagem')} type="number" />
            </FormGrid>
            <FormGrid cols={3}>
              <Input label="Camas Solteiro" value={form.camaSolteiro} onChange={f('camaSolteiro')} type="number" />
              <Input label="Camas Casal" value={form.camaCasal} onChange={f('camaCasal')} type="number" />
              <Input label="Suítes" value={form.suite} onChange={f('suite')} type="number" />
            </FormGrid>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={criarAcomodacao} disabled={loading}>
                {loading ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal vincular */}
      {showVincular && (
        <Modal title="Vincular Acomodação" onClose={() => setShowVincular(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Nome do Titular" value={vincular.nomeTitular}
              onChange={v => setVincular(p => ({ ...p, nomeTitular: v }))}
              placeholder="Digite o nome do titular" required />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                id="titularFicara"
                checked={vincular.titularFicara}
                onChange={e => setVincular(p => ({ ...p, titularFicara: e.target.checked }))}
                style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
              />
              <label htmlFor="titularFicara" style={{ fontSize: 13, color: 'var(--text2)', cursor: 'pointer' }}>
                Titular ficará hospedado
              </label>
            </div>

            {/* Dependentes do titular */}
            {titularSelecionado && (titularSelecionado.dependentes?.length || 0) > 0 && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, marginBottom: 8 }}>
                  DEPENDENTES DE {titularSelecionado.nome.toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {titularSelecionado.dependentes?.map(d => (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="checkbox"
                        id={`dep-${d.id}`}
                        checked={vincular.nomesDependentes.includes(d.nome)}
                        onChange={e => e.target.checked ? adicionarDep(d.nome) : removerDep(d.nome)}
                        style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                      />
                      <label htmlFor={`dep-${d.id}`} style={{ fontSize: 13, color: 'var(--text2)', cursor: 'pointer' }}>
                        {d.nome}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dependentes selecionados manualmente (se não encontrou o titular ainda) */}
            {!titularSelecionado && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, marginBottom: 8 }}>
                  ADICIONAR DEPENDENTES
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={vincular.inputDep}
                    onChange={e => setVincular(p => ({ ...p, inputDep: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && adicionarDep(vincular.inputDep)}
                    placeholder="Nome do dependente"
                    style={{
                      flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 14,
                    }}
                  />
                  <Button size="sm" onClick={() => adicionarDep(vincular.inputDep)}>
                    <Plus size={13} />
                  </Button>
                </div>
                {vincular.nomesDependentes.map(nome => (
                  <div key={nome} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--bg3)', borderRadius: 7, padding: '6px 12px', marginTop: 6,
                  }}>
                    <span style={{ fontSize: 13 }}>{nome}</span>
                    <button onClick={() => removerDep(nome)} style={{
                      background: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 16,
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowVincular(false)}>Cancelar</Button>
              <Button onClick={salvarVincular} disabled={loading}>
                {loading ? 'Vinculando...' : 'Vincular'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
