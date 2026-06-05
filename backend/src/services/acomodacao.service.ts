import prisma from '../prisma/client'
import {
  CriarAcomodacaoDTO,
  VincularAcomodacaoDTO,
  CancelarAcomodacaoDTO,
} from '../dtos/acomodacao.dto'

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

  async criarAcomodacao(dto: CriarAcomodacaoDTO) {
    return prisma.acomodacao.create({ data: dto })
  }

  async vincularAcomodacao(dto: VincularAcomodacaoDTO) {
    // 1. Busca titular pelo nome
    const titular = await prisma.cliente.findFirst({
      where: { nome: dto.nomeTitular, titularId: null },
      include: { dependentes: true },
    })
    if (!titular) throw new Error('Titular não encontrado')

    // 2. Verifica se a acomodação existe
    const acomodacao = await prisma.acomodacao.findUnique({
      where: { id: dto.acomodacaoId },
    })
    if (!acomodacao) throw new Error('Acomodação não encontrada')

    // 3. Hospeda o titular se confirmado
    if (dto.titularFicara) {
      await prisma.cliente.update({
        where: { id: titular.id },
        data: { acomodacaoId: dto.acomodacaoId },
      })
    }

    // 4. Valida e hospeda dependentes pelo nome
    const naoEncontrados: string[] = []

    if (dto.nomesDependentes?.length) {
      for (const nomeDep of dto.nomesDependentes) {
        // Regra: verifica se é dependente DESSE titular
        const dep = titular.dependentes.find(
          d => d.nome.toLowerCase() === nomeDep.toLowerCase()
        )
        if (!dep) {
          naoEncontrados.push(nomeDep)
          continue
        }
        await prisma.cliente.update({
          where: { id: dep.id },
          data: { acomodacaoId: dto.acomodacaoId },
        })
      }
    }

    // 5. Retorna estado final com aviso de não encontrados
    const resultado = await prisma.cliente.findUnique({
      where: { id: titular.id },
      include: {
        acomodacao: true,
        dependentes: { include: { acomodacao: true } },
      },
    })

    return { resultado, naoEncontrados }
  }

  async cancelarAcomodacao(dto: CancelarAcomodacaoDTO) {
    // Busca titular pelo nome
    const titular = await prisma.cliente.findFirst({
      where: { nome: dto.nomeTitular, titularId: null },
      include: { dependentes: true },
    })
    if (!titular) throw new Error('Titular não encontrado')

    const temAcomodacao =
      titular.acomodacaoId !== null ||
      titular.dependentes.some(d => d.acomodacaoId !== null)

    if (!temAcomodacao) {
      throw new Error('Nenhuma acomodação vinculada a esse titular ou seus dependentes')
    }

    // Cancela titular
    await prisma.cliente.update({
      where: { id: titular.id },
      data: { acomodacaoId: null },
    })

    // Cancela todos os dependentes
    const depIds = titular.dependentes.map(d => d.id)
    if (depIds.length) {
      await prisma.cliente.updateMany({
        where: { id: { in: depIds } },
        data: { acomodacaoId: null },
      })
    }
  }

  async excluirAcomodacao(id: number) {
    const existe = await prisma.acomodacao.findUnique({ where: { id } })
    if (!existe) throw new Error('Acomodação não encontrada')
    await prisma.acomodacao.delete({ where: { id } })
  }
}
