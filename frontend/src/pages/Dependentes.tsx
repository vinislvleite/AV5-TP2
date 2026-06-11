import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  FileText
} from 'lucide-react'
import { api } from '../services/api'
import type { Cliente } from '../types/index'
import {
  PageHeader, Button, Card, Modal, Input, Select,
  FormGrid, Divider, Badge, EmptyState, Toast,
} from '../components/ui'

const emptyForm = {
  titularId: '',
  nome: '',
  nomeSocial: '',
  dataNascimento: '',
  rua: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
  codigoPostal: '',
  ddd: '',
  numero: '',
  documentos: [
    {
      tipo: 'CPF',
      numero: '',
      dataExpedicao: '',
    },
  ],
}

export default function Dependentes() {
  const [titulares, setTitulares] = useState<Cliente[]>([])
  const [dependentes, setDependentes] = useState<Cliente[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandido, setExpandido] = useState<number | null>(null)

  const carregar = async () => {
    try {
      const t = await api.titulares.listar() as Cliente[]
      setTitulares(t)
      setDependentes(t.flatMap(x => (x.dependentes || []).map(d => ({ ...d, titular: x }))))
    } catch {}
  }

  useEffect(() => { carregar() }, [])

  const abrirCriar = () => {
    setEditando(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const abrirEditar = (d: Cliente) => {
  setEditando(d)

  setForm({
    titularId: String(d.titularId || ''),
    nome: d.nome,
    nomeSocial: d.nomeSocial,
    dataNascimento: d.dataNascimento?.slice(0, 10) || '',
    rua: d.endereco?.rua || '',
    bairro: d.endereco?.bairro || '',
    cidade: d.endereco?.cidade || '',
    estado: d.endereco?.estado || '',
    pais: d.endereco?.pais || 'Brasil',
    codigoPostal: d.endereco?.codigoPostal || '',
    ddd: d.telefones?.[0]?.ddd || '',
    numero: d.telefones?.[0]?.numero || '',

    documentos:
      d.documentos?.length
        ? d.documentos.map(doc => ({
            tipo: doc.tipo,
            numero: doc.numero,
            dataExpedicao: doc.dataExpedicao?.slice(0, 10) || '',
          }))
        : [
            {
              tipo: 'CPF',
              numero: '',
              dataExpedicao: '',
            },
          ],
  })

  setShowModal(true)
}

  const salvar = async () => {
    if (form.documentos.length === 0) {
    return setToast({
      msg: 'É obrigatório possuir ao menos um documento',
      type: 'error',
    })
  }

  if (form.documentos.some(d => !d.numero.trim())) {
    return setToast({
      msg: 'Preencha todos os documentos',
      type: 'error',
    })
  }
    setLoading(true)
    try {
      const payload = {
        nome: form.nome,
        nomeSocial: form.nomeSocial,
        dataNascimento: form.dataNascimento,

        endereco: form.rua
          ? {
              rua: form.rua,
              bairro: form.bairro,
              cidade: form.cidade,
              estado: form.estado,
              pais: form.pais,
              codigoPostal: form.codigoPostal,
            }
          : undefined,

        telefones:
          form.ddd && form.numero
            ? [
                {
                  ddd: form.ddd,
                  numero: form.numero,
                },
              ]
            : undefined,

        documentos: form.documentos,
      }
            if (editando) {
        await api.dependentes.editar(
          Number(form.titularId),
          editando.id,
          payload
        )

        setToast({
          msg: 'Dependente atualizado!',
          type: 'success',
        })
      } else {
        await api.dependentes.criar(
          Number(form.titularId),
          payload
        )

        setToast({
          msg: 'Dependente cadastrado!',
          type: 'success',
        })
      }

      setShowModal(false)
      setEditando(null)
      setForm(emptyForm)

      carregar()
    } catch (e: any) {
      setToast({
        msg: e?.message || 'Erro ao salvar dependente',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const excluir = async (d: Cliente) => {
    if (!confirm(`Excluir "${d.nome}"?`)) return
    try {
      await api.dependentes.excluir(d.titularId!, d.id)
      setToast({ msg: 'Dependente excluído!', type: 'success' })
      carregar()
    } catch (e: any) {
      setToast({ msg: e.message, type: 'error' })
    }
  }

  const f = (k: keyof typeof emptyForm) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  const titularOptions = titulares.map(t => ({ value: String(t.id), label: t.nome }))

  const adicionarDocumento = () => {
  setForm(prev => ({
    ...prev,
    documentos: [
      ...prev.documentos,
      {
        tipo: 'CPF',
        numero: '',
        dataExpedicao: '',
      },
    ],
  }))
}

const removerDocumento = (index: number) => {
  if (form.documentos.length === 1) return

  setForm(prev => ({
    ...prev,
    documentos: prev.documentos.filter((_, i) => i !== index),
  }))
}

const alterarDocumento = (
  index: number,
  campo: 'tipo' | 'numero' | 'dataExpedicao',
  valor: string
) => {
  setForm(prev => ({
    ...prev,
    documentos: prev.documentos.map((doc, i) =>
      i === index
        ? { ...doc, [campo]: valor }
        : doc
    ),
  }))
}

  return (
    <div>
      <PageHeader
        title="Dependentes"
        subtitle={`${dependentes.length} dependente(s) cadastrado(s)`}
        action={<Button onClick={abrirCriar}><Plus size={14} /> Novo Dependente</Button>}
      />

      {dependentes.length === 0 ? (
        <Card><EmptyState message="Nenhum dependente cadastrado ainda" /></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dependentes.map(d => (
            <Card key={d.id} style={{ padding: 0 }}>
              <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandido(expandido === d.id ? null : d.id)}
                >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'rgba(139,146,165,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text2)', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14,
                  }}>
                    {d.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d.nome}</div>
                    <div style={{ color: 'var(--text3)', fontSize: 12 }}>
                      Titular: {d.titular?.nome}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {d.acomodacaoId
                    ? <Badge label="Acomodado" color="success" />
                    : <Badge label="Disponível" color="neutral" />
                  }
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      abrirEditar(d)
                    }}
                  >
                    <Pencil size={12} />
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      excluir(d)
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                  {expandido === d.id
                    ? <ChevronUp size={16} color="var(--text3)" />
                    : <ChevronDown size={16} color="var(--text3)" />
                  }
                </div>
              </div>
              {expandido === d.id && (
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  padding: '16px 20px',
                  display: 'flex',
                  gap: 24,
                }}
              >
                {d.endereco && (
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--accent)',
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      <MapPin size={13} />
                      ENDEREÇO
                    </div>

                    <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.8 }}>
                      <div>{d.endereco.rua}</div>
                      <div>
                        {d.endereco.bairro} – {d.endereco.cidade}/{d.endereco.estado}
                      </div>
                      <div>
                        {d.endereco.codigoPostal} · {d.endereco.pais}
                      </div>
                    </div>
                  </div>
                )}

                {(d.telefones?.length || 0) > 0 && (
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--accent)',
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      <Phone size={13} />
                      TELEFONES
                    </div>

                    {d.telefones?.map((tel, i) => (
                      <div
                        key={i}
                        style={{
                          color: 'var(--text2)',
                          fontSize: 13,
                        }}
                      >
                        ({tel.ddd}) {tel.numero}
                      </div>
                    ))}
                  </div>
                )}

                {(d.documentos?.length || 0) > 0 && (
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--accent)',
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      <FileText size={13} />
                      DOCUMENTOS
                    </div>

                    {d.documentos?.map((doc, i) => (
                      <div
                        key={doc.id || i}
                        style={{
                          color: 'var(--text2)',
                          fontSize: 13,
                        }}
                      >
                        {doc.tipo}: {doc.numero}
                      </div>
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
        <Modal title={editando ? 'Editar Dependente' : 'Novo Dependente'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Select label="Titular" value={form.titularId} onChange={f('titularId')} options={titularOptions} required />
            <FormGrid>
              <Input label="Nome" value={form.nome} onChange={f('nome')} required />
              <Input label="Nome Social" value={form.nomeSocial} onChange={f('nomeSocial')} required />
            </FormGrid>
            <Input label="Data de Nascimento" value={form.dataNascimento} onChange={f('dataNascimento')} type="date" required />
            <Divider label="DOCUMENTOS" />
            {form.documentos.map((doc, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <FormGrid>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13 }}>
                      Tipo
                    </label>

                    <select
                      value={doc.tipo}
                      onChange={(e) =>
                        alterarDocumento(index, 'tipo', e.target.value)
                      }
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '9px 12px',
                        color: 'var(--text)',
                        fontSize: 14,
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="CPF">CPF</option>
                      <option value="RG">RG</option>
                      <option value="PASSAPORTE">PASSAPORTE</option>
                    </select>
                  </div>

                  <Input
                    label="Número"
                    value={doc.numero}
                    onChange={(v) =>
                      alterarDocumento(index, 'numero', v)
                    }
                  />
                </FormGrid>

                <Input
                  label="Data de Expedição"
                  type="date"
                  value={doc.dataExpedicao}
                  onChange={(v) =>
                    alterarDocumento(index, 'dataExpedicao', v)
                  }
                />

                <Button
                  variant="danger"
                  disabled={form.documentos.length === 1}
                  onClick={() => removerDocumento(index)}
                >
                  <Trash2 size={12} />
                  Remover Documento
                </Button>
              </div>
            ))}

            <Button
              variant="secondary"
              onClick={adicionarDocumento}
            >
              <Plus size={12} />
              Adicionar Documento
            </Button>
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
