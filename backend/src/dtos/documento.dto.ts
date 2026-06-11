export interface CadastrarDocumentoDTO {
  numero: string
  tipo: 'CPF' | 'RG' | 'PASSAPORTE'
  dataExpedicao: string
}

export interface EditarDocumentoDTO {
  numero: string
  tipo: 'CPF' | 'RG' | 'PASSAPORTE'
  dataExpedicao: string
}

