import prisma from '../prisma/client'
import { CadastrarDocumentoDTO } from '../dtos/documento.dto'

export class DocumentoService {

  async listarDocumentosCliente(clienteId: number) {
    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } })
    if (!cliente) throw new Error('Cliente não encontrado')

    return prisma.documento.findMany({ where: { clienteId } })
  }

  async cadastrarDocumento(clienteId: number, dto: CadastrarDocumentoDTO) {
    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } })
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

  async excluirDocumento(id: number) {
    const existe = await prisma.documento.findUnique({ where: { id } })
    if (!existe) throw new Error('Documento não encontrado')
    await prisma.documento.delete({ where: { id } })
  }
}
