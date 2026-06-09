import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, ChevronDown, ChevronUp, Phone, MapPin, FileText } from 'lucide-react'
import { api } from '../services/api'
import type { Cliente } from '../types/index'
import {
  PageHeader, Button, Card, Modal, Input,
  FormGrid, Divider, Badge, EmptyState, Toast,
} from '../components/ui'

const emptyForm = {
  nome: '', nomeSocial: '', dataNascimento: '',
  rua: '', bairro: '', cidade: '', estado: '', pais: 'Brasil', codigoPostal: '',
  ddd: '', numero: '',
}

export default function Titulares() {
  const [titulares, setTitulares] = useState<Cliente[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [expandido, setExpandido] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)

  const carregar = () => {
    api.titulares.listar().then(d => setTitulares(d as Cliente[])).catch(() => {})
  }

  useEffect(() => { carregar() }, [])

  const abrirCriar = () => {
    setEditando(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const abrirEditar = (t: Cliente) => {
    setEditando(t)
    setForm({
      nome: t.nome, nomeSocial: t.nomeSocial,
      dataNascimento: t.dataNascimento?.slice(0, 10) || '',
      rua: t.endereco?.rua || '', bairro: t.endereco?.bairro || '',
      cidade: t.endereco?.cidade || '', estado: t.endereco?.estado || '',
      pais: t.endereco?.pais || 'Brasil', codigoPostal: t.endereco?.codigoPostal || '',
      ddd: t.telefones?.[0]?.ddd || '', numero: t.telefones?.[0]?.numero || '',
    })
    setShowModal(true)
  }

  const salvar = async () => {
    setLoading(true)
    try {
      const payload = {
        nome: form.nome,
        nomeSocial: form.nomeSocial,
        dataNascimento: form.dataNascimento,
        endereco: form.rua ? {
          rua: form.rua, bairro: form.bairro, cidade: form.cidade,
          estado: form.estado, pais: form.pais, codigoPostal: form.codigoPostal,
        } : undefined,
        telefones: form.ddd && form.numero ? [{ ddd: form.ddd, numero: form.numero }] : undefined,
      }
      if (editando) {
        await api.titulares.editar(editando.id, payload)
        setToast({ msg: 'Titular atualizado!', type: 'success' })
      } else {
        await api.titulares.criar(payload)
        setToast({ msg: 'Titular cadastrado!', type: 'success' })
      }
      setShowModal(false)
      carregar()
    } catch (e: any) {
      setToast({ msg: e.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const excluir = async (id: number, nome: string) => {
    if (!confirm(`Excluir "${nome}" e todos os seus dependentes?`)) return
    try {
      await api.titulares.excluir(id)
      setToast({ msg: 'Titular excluído!', type: 'success' })
      carregar()
    } catch (e: any) {
      setToast({ msg: e.message, type: 'error' })
    }
  }

  const f = (k: keyof typeof emptyForm) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div>
      <PageHeader
        title="Titulares"
        subtitle={`${titulares.length} titular(es) cadastrado(s)`}
        action={<Button onClick={abrirCriar}><Plus size={14} /> Novo Titular</Button>}
      />

      {titulares.length === 0 ? (
        <Card><EmptyState message="Nenhum titular cadastrado ainda" /></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {titulares.map(t => (
            <Card key={t.id} style={{ padding: 0 }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', cursor: 'pointer',
                }}
                onClick={() => setExpandido(expandido === t.id ? null : t.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'var(--accent-glow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15,
                  }}>
                    {t.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.nome}</div>
                    <div style={{ color: 'var(--text3)', fontSize: 12 }}>
                      {t.nomeSocial} · {(t.dependentes?.length || 0)} dependente(s)
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t.acomodacaoId
                    ? <Badge label="Acomodado" color="success" />
                    : <Badge label="Disponível" color="neutral" />
                  }
                  <Button size="sm" variant="secondary" onClick={() => abrirEditar(t)}>
                    <Pencil size={12} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => excluir(t.id, t.nome)}>
                    <Trash2 size={12} />
                  </Button>
                  {expandido === t.id
                    ? <ChevronUp size={16} color="var(--text3)" />
                    : <ChevronDown size={16} color="var(--text3)" />
                  }
                </div>
              </div>

              {expandido === t.id && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', display: 'flex', gap: 24 }}>
                  {t.endereco && (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                        <MapPin size={13} /> ENDEREÇO
                      </div>
                      <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.8 }}>
                        <div>{t.endereco.rua}</div>
                        <div>{t.endereco.bairro} – {t.endereco.cidade}/{t.endereco.estado}</div>
                        <div>{t.endereco.codigoPostal} · {t.endereco.pais}</div>
                      </div>
                    </div>
                  )}
                  {(t.telefones?.length || 0) > 0 && (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                        <Phone size={13} /> TELEFONES
                      </div>
                      {t.telefones?.map((tel, i) => (
                        <div key={i} style={{ color: 'var(--text2)', fontSize: 13 }}>
                          ({tel.ddd}) {tel.numero}
                        </div>
                      ))}
                    </div>
                  )}
                  {(t.documentos?.length || 0) > 0 && (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                        <FileText size={13} /> DOCUMENTOS
                      </div>
                      {t.documentos?.map(doc => (
                        <div key={doc.id} style={{ color: 'var(--text2)', fontSize: 13 }}>
                          {doc.tipo}: {doc.numero}
                        </div>
                      ))}
                    </div>
                  )}
                  {(t.dependentes?.length || 0) > 0 && (
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>DEPENDENTES</div>
                      {t.dependentes?.map(d => (
                        <div key={d.id} style={{ color: 'var(--text2)', fontSize: 13 }}>{d.nome}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editando ? 'Editar Titular' : 'Novo Titular'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormGrid>
              <Input label="Nome" value={form.nome} onChange={f('nome')} required />
              <Input label="Nome Social" value={form.nomeSocial} onChange={f('nomeSocial')} required />
            </FormGrid>
            <Input label="Data de Nascimento" value={form.dataNascimento} onChange={f('dataNascimento')} type="date" required />

            <Divider label="ENDEREÇO" />
            <FormGrid>
              <Input label="Rua" value={form.rua} onChange={f('rua')} />
              <Input label="Bairro" value={form.bairro} onChange={f('bairro')} />
            </FormGrid>
            <FormGrid>
              <Input label="Cidade" value={form.cidade} onChange={f('cidade')} />
              <Input label="Estado" value={form.estado} onChange={f('estado')} />
            </FormGrid>
            <FormGrid>
              <Input label="País" value={form.pais} onChange={f('pais')} />
              <Input label="CEP" value={form.codigoPostal} onChange={f('codigoPostal')} />
            </FormGrid>

            <Divider label="TELEFONE" />
            <FormGrid>
              <Input label="DDD" value={form.ddd} onChange={f('ddd')} placeholder="11" />
              <Input label="Número" value={form.numero} onChange={f('numero')} placeholder="99999-0000" />
            </FormGrid>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
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