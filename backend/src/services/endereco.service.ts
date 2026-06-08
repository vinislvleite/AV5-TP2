import prisma from '../prisma/clientPrisma'
import { EnderecoDTO } from '../dtos/endereco.dto'

export class EnderecoService {

  async buscarEndereco(clienteId: number) {
    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } })
    if (!cliente) throw new Error('Cliente não encontrado')

    const endereco = await prisma.endereco.findUnique({ where: { clienteId } })
    if (!endereco) throw new Error('Endereço não encontrado')

    return endereco
  }

  async salvarEndereco(clienteId: number, dto: EnderecoDTO) {
    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } })
    if (!cliente) throw new Error('Cliente não encontrado')

    // Upsert: cria se não existir, atualiza se já existir
    return prisma.endereco.upsert({
      where: { clienteId },
      update: dto,
      create: { ...dto, clienteId },
    })
  }
}
