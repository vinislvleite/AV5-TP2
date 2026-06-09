export interface Telefone {
  id: number
  ddd: string
  numero: string
  clienteId: number
}

export interface Endereco {
  id: number
  rua: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  codigoPostal: string
  clienteId: number
}

export interface Documento {
  id: number
  numero: string
  tipo: 'CPF' | 'RG' | 'PASSAPORTE'
  dataExpedicao: string
  clienteId: number
}

export type NomeAcomodacao =
  | 'CASAL_SIMPLES'
  | 'FAMILIA_MAIS'
  | 'FAMILIA_SIMPLES'
  | 'FAMILIA_SUPER'
  | 'SOLTEIRO_MAIS'
  | 'SOLTEIRO_SIMPLES'

export interface Cliente {
  id: number
  nome: string
  nomeSocial: string
  dataNascimento: string
  dataCadastro: string
  titularId?: number
  titular?: Cliente
  dependentes?: Cliente[]
  telefones?: Telefone[]
  endereco?: Endereco
  documentos?: Documento[]
  acomodacao?: Acomodacao
  acomodacaoId?: number
}

export interface Acomodacao {
  id: number
  nome: NomeAcomodacao
  camaSolteiro: number
  camaCasal: number
  suite: number
  climatizacao: boolean
  garagem: number
  clientes?: Cliente[]
}