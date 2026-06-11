export interface TelefoneDTO {
  ddd: string
  numero: string
}

export interface TelefoneEditDTO {
  indice: number
  ddd: string
  numero: string
}

export interface EnderecoDTO {
  rua: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  codigoPostal: string
}

export interface DocumentoDTO {
  numero: string
  tipo: 'CPF' | 'RG' | 'PASSAPORTE'
  dataExpedicao: string
}

export interface CadastrarTitularDTO {
  nome: string
  nomeSocial: string
  dataNascimento: string
  endereco?: EnderecoDTO
  telefones?: TelefoneDTO[]
  documentos: DocumentoDTO[]
}

export interface EditarClienteDTO {
  nome?: string
  nomeSocial?: string
  dataNascimento?: string
  endereco?: EnderecoDTO
  telefones?: TelefoneEditDTO[]
  documentos?: DocumentoDTO[]
}

export interface CadastrarDependenteDTO {
  nome: string
  nomeSocial: string
  dataNascimento: string
  endereco?: EnderecoDTO
  telefones?: TelefoneDTO[]
  documentos: DocumentoDTO[]
}
