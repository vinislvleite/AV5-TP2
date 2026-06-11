import prisma from '../prisma/clientPrisma'
import {
  CadastrarDocumentoDTO,
  EditarDocumentoDTO,
} from '../dtos/documento.dto'

export class DocumentoService {

  async listarDocumentosCliente(clienteId: number) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    })

    if (!cliente) throw new Error('Cliente não encontrado')

    return prisma.documento.findMany({
      where: { clienteId }
    })
  }

  async cadastrarDocumento(
    clienteId: number,
    dto: CadastrarDocumentoDTO
  ) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    })

    if (!cliente) throw new Error('Cliente não encontrado')

    return prisma.documento.create({
      data: {
        numero: dto.numero,
        tipo: dto.tipo,
        dataExpedicao: new Date(dto.dataExpedicao),
        clienteId,
      },
    })
  }

  async editarDocumento(
    id: number,
    dto: EditarDocumentoDTO
  ) {
    const documento = await prisma.documento.findUnique({
      where: { id }
    })

    if (!documento) {
      throw new Error('Documento não encontrado')
    }

    return prisma.documento.update({
      where: { id },
      data: {
        numero: dto.numero,
        tipo: dto.tipo,
        dataExpedicao: dto.dataExpedicao
          ? new Date(dto.dataExpedicao)
          : undefined,
      },
    })
  }

  async excluirDocumento(id: number) {
    const documento = await prisma.documento.findUnique({
      where: { id }
    })

    if (!documento) {
      throw new Error('Documento não encontrado')
    }

    const quantidadeDocumentos = await prisma.documento.count({
      where: {
        clienteId: documento.clienteId,
      },
    })

    if (quantidadeDocumentos <= 1) {
      throw new Error(
        'O cliente deve possuir ao menos um documento'
      )
    }

    await prisma.documento.delete({
      where: { id }
    })
  }
}