import prisma from '../prisma/clientPrisma'
import { VincularAcomodacaoDTO, CancelarAcomodacaoDTO } from '../dtos/acomodacao.dto'
import { NomeAcomodacao } from '@prisma/client'

const ACOMODACAO_SPECS: Record<NomeAcomodacao, {
  camaSolteiro: number
  camaCasal: number
  suite: number
  climatizacao: boolean
  garagem: number
}> = {
  CASAL_SIMPLES:    { camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
  FAMILIA_SIMPLES:  { camaSolteiro: 2, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
  FAMILIA_MAIS:     { camaSolteiro: 5, camaCasal: 1, suite: 2, climatizacao: true, garagem: 2 },
  FAMILIA_SUPER:    { camaSolteiro: 6, camaCasal: 2, suite: 3, climatizacao: true, garagem: 2 },
  SOLTEIRO_SIMPLES: { camaSolteiro: 1, camaCasal: 0, suite: 1, climatizacao: true, garagem: 0 },
  SOLTEIRO_MAIS:    { camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
}

export class AcomodacaoService {

  async listarAcomodacoes() {
    return prisma.acomodacao.findMany({
      include: { clientes: true },
    })
  }

  async buscarAcomodacao(id: number) {
    const acomodacao = await prisma.acomodacao.findUnique({
      where: { id },
      include: { clientes: true },
    })
    if (!acomodacao) throw new Error('Acomodação não encontrada')
    return acomodacao
  }

  async criarAcomodacao(nome: NomeAcomodacao) {
    const specs = ACOMODACAO_SPECS[nome]
    if (!specs) throw new Error('Tipo de acomodação inválido')

    return prisma.acomodacao.create({
      data: { nome, ...specs },
    })
  }

  async vincularAcomodacao(dto: VincularAcomodacaoDTO) {
    const titular = await prisma.cliente.findFirst({
      where: { nome: dto.nomeTitular, titularId: null },
      include: { dependentes: true },
    })
    if (!titular) throw new Error('Titular não encontrado')

    const acomodacao = await prisma.acomodacao.findUnique({ where: { id: dto.acomodacaoId } })
    if (!acomodacao) throw new Error('Acomodação não encontrada')

    if (dto.titularFicara) {
      await prisma.cliente.update({
        where: { id: titular.id },
        data: { acomodacaoId: dto.acomodacaoId },
      })
    }

    const naoEncontrados: string[] = []
    if (dto.nomesDependentes?.length) {
      for (const nomeDep of dto.nomesDependentes) {
        const dep = titular.dependentes.find(
          d => d.nome.toLowerCase() === nomeDep.toLowerCase()
        )
        if (!dep) { naoEncontrados.push(nomeDep); continue }
        await prisma.cliente.update({
          where: { id: dep.id },
          data: { acomodacaoId: dto.acomodacaoId },
        })
      }
    }

    const resultado = await prisma.cliente.findUnique({
      where: { id: titular.id },
      include: { acomodacao: true, dependentes: { include: { acomodacao: true } } },
    })

    return { resultado, naoEncontrados }
  }

  async cancelarAcomodacao(dto: CancelarAcomodacaoDTO) {
    const titular = await prisma.cliente.findFirst({
      where: { nome: dto.nomeTitular, titularId: null },
      include: { dependentes: true },
    })
    if (!titular) throw new Error('Titular não encontrado')

    const temAcomodacao =
      titular.acomodacaoId !== null ||
      titular.dependentes.some(d => d.acomodacaoId !== null)

    if (!temAcomodacao) throw new Error('Nenhuma acomodação vinculada a esse titular ou seus dependentes')

    await prisma.cliente.update({ where: { id: titular.id }, data: { acomodacaoId: null } })

    const depIds = titular.dependentes.map(d => d.id)
    if (depIds.length) {
      await prisma.cliente.updateMany({ where: { id: { in: depIds } }, data: { acomodacaoId: null } })
    }
  }

  async excluirAcomodacao(id: number) {
    const existe = await prisma.acomodacao.findUnique({ where: { id } })
    if (!existe) throw new Error('Acomodação não encontrada')
    await prisma.acomodacao.delete({ where: { id } })
  }
}