export type NomeAcomodacao =
  | 'CASAL_SIMPLES'
  | 'FAMILIA_MAIS'
  | 'FAMILIA_SIMPLES'
  | 'FAMILIA_SUPER'
  | 'SOLTEIRO_MAIS'
  | 'SOLTEIRO_SIMPLES'

export interface CriarAcomodacaoDTO {
  nome: NomeAcomodacao
  camaSolteiro: number
  camaCasal: number
  suite: number
  climatizacao: boolean
  garagem: number
}

export interface VincularAcomodacaoDTO {
  nomeTitular: string
  acomodacaoId: number
  titularFicara: boolean
  nomesDependentes: string[]
}

export interface CancelarAcomodacaoDTO {
  nomeTitular: string
}
