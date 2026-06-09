const BASE = '/api'

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ erro: 'Erro desconhecido' }))
    throw new Error(err.erro || 'Erro na requisição')
  }
  return res.json()
}

// ─── TITULARES ───────────────────────────────────────────────────────────────
export const api = {
  titulares: {
    listar: () => http('/clientes/titulares'),
    buscar: (id: number) => http(`/clientes/titulares/${id}`),
    criar: (data: unknown) => http('/clientes/titulares', { method: 'POST', body: JSON.stringify(data) }),
    editar: (id: number, data: unknown) => http(`/clientes/titulares/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    excluir: (id: number) => http(`/clientes/titulares/${id}`, { method: 'DELETE' }),
  },
  dependentes: {
    listarPorTitular: (titularId: number) => http(`/clientes/titulares/${titularId}/dependentes`),
    buscarTitular: (dependenteId: number) => http(`/clientes/dependentes/${dependenteId}/titular`),
    criar: (titularId: number, data: unknown) => http(`/clientes/titulares/${titularId}/dependentes`, { method: 'POST', body: JSON.stringify(data) }),
    editar: (titularId: number, dependenteId: number, data: unknown) => http(`/clientes/titulares/${titularId}/dependentes/${dependenteId}`, { method: 'PUT', body: JSON.stringify(data) }),
    excluir: (titularId: number, dependenteId: number) => http(`/clientes/titulares/${titularId}/dependentes/${dependenteId}`, { method: 'DELETE' }),
  },
  documentos: {
    listar: (clienteId: number) => http(`/clientes/${clienteId}/documentos`),
    criar: (clienteId: number, data: unknown) => http(`/clientes/${clienteId}/documentos`, { method: 'POST', body: JSON.stringify(data) }),
    excluir: (id: number) => http(`/documentos/${id}`, { method: 'DELETE' }),
  },
  endereco: {
    buscar: (clienteId: number) => http(`/clientes/${clienteId}/endereco`),
    salvar: (clienteId: number, data: unknown) => http(`/clientes/${clienteId}/endereco`, { method: 'POST', body: JSON.stringify(data) }),
  },
  telefones: {
    listar: (clienteId: number) => http(`/clientes/${clienteId}/telefones`),
    adicionar: (clienteId: number, data: unknown) => http(`/clientes/${clienteId}/telefones`, { method: 'POST', body: JSON.stringify(data) }),
    editar: (clienteId: number, data: unknown) => http(`/clientes/${clienteId}/telefones`, { method: 'PUT', body: JSON.stringify(data) }),
    excluir: (clienteId: number, indice: number) => http(`/clientes/${clienteId}/telefones/${indice}`, { method: 'DELETE' }),
  },
  acomodacoes: {
    listar: () => http('/acomodacoes'),
    criar: (data: unknown) => http('/acomodacoes', { method: 'POST', body: JSON.stringify(data) }),
    vincular: (data: unknown) => http('/acomodacoes/vincular', { method: 'PATCH', body: JSON.stringify(data) }),
    cancelar: (data: unknown) => http('/acomodacoes/cancelar', { method: 'PATCH', body: JSON.stringify(data) }),
    excluir: (id: number) => http(`/acomodacoes/${id}`, { method: 'DELETE' }),
  },
  acomodados: {
    listar: () => http('/clientes/acomodados'),
  },
}
