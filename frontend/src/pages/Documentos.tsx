import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { api } from '../services/api'
import type { Cliente, Documento } from '../types'
import {
  PageHeader, Button, Card, Modal, Input, Select,
  FormGrid, Badge, EmptyState, Toast,
} from '../components/ui'

const tipoOptions = [
  { value: 'CPF', label: 'CPF' },
  { value: 'RG', label: 'RG' },
  { value: 'PASSAPORTE', label: 'Passaporte' },
]

const tipoColor: Record<string, 'accent' | 'success' | 'warning'> = {
  CPF: 'accent', RG: 'success', PASSAPORTE: 'warning',
}

const emptyForm = { clienteId: '', tipo: '', numero: '', dataExpedicao: '' }

export default function Documentos() {
  const [titulares, setTitulares] = useState<Cliente[]>([])
  const [todos, setTodos] = useState<{ cliente: Cliente; doc: Documento }[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)

  const carregar = async () => {
    try {
      const t = await api.titulares.listar() as Cliente[]
      setTitulares(t)
      const lista: { cliente: Cliente; doc: Documento }[] = []
      for (const tit of t) {
        const clientes = [tit, ...(tit.dependentes || [])]
        for (const c of clientes) {
          const docs = c.documentos || []
          docs.forEach(doc => lista.push({ cliente: c, doc }))
        }
      }
      setTodos(lista)
    } catch {}
  }

  useEffect(() => { carregar() }, [])

  const salvar = async () => {
    if (!form.clienteId || !form.tipo || !form.numero) {
      return setToast({ msg: 'Preencha todos os campos obrigatórios', type: 'error' })
    }
    setLoading(true)
    try {
      await api.documentos.criar(Number(form.clienteId), {
        tipo: form.tipo, numero: form.numero, dataExpedicao: form.dataExpedicao,
      })
      setToast({ msg: 'Documento cadastrado!', type: 'success' })
      setShowModal(false)
      setForm(emptyForm)
      carregar()
    } catch (e: any) {
      setToast({ msg: e.message, type: 'error' })
    } finally { setLoading(false) }
  }

  const excluir = async (id: number) => {
    if (!confirm('Excluir este documento?')) return
    try {
      await api.documentos.excluir(id)
      setToast({ msg: 'Documento excluído!', type: 'success' })
      carregar()
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }

  const f = (k: keyof typeof emptyForm) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  // Monta lista de todos clientes (titulares + dependentes) para o select
  const clienteOptions = titulares.flatMap(t => [
    { value: String(t.id), label: t.nome },
    ...(t.dependentes || []).map(d => ({ value: String(d.id), label: `${d.nome} (dep. de ${t.nome})` })),
  ])

  return (
    <div>
      <PageHeader
        title="Documentos"
        subtitle={`${todos.length} documento(s) cadastrado(s)`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={14} /> Novo Documento</Button>}
      />

      {todos.length === 0 ? (
        <Card><EmptyState message="Nenhum documento cadastrado ainda" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {todos.map(({ cliente, doc }) => (
            <Card key={doc.id} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Badge label={doc.tipo} color={tipoColor[doc.tipo] || 'neutral'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.numero}</div>
                    <div style={{ color: 'var(--text3)', fontSize: 11, marginTop: 2 }}>
                      {cliente.nome} · {new Date(doc.dataExpedicao).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="danger" onClick={() => excluir(doc.id)}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Novo Documento" onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Select label="Cliente" value={form.clienteId} onChange={f('clienteId')} options={clienteOptions} required />
            <FormGrid>
              <Select label="Tipo" value={form.tipo} onChange={f('tipo')} options={tipoOptions} required />
              <Input label="Número" value={form.numero} onChange={f('numero')} required />
            </FormGrid>
            <Input label="Data de Expedição" value={form.dataExpedicao} onChange={f('dataExpedicao')} type="date" />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={salvar} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
