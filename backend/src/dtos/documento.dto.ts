export interface CadastrarDocumentoDTO {
  numero: string
  tipo: 'CPF' | 'RG' | 'PASSAPORTE'
  dataExpedicao: string
}
