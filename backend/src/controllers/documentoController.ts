import { Request, Response } from 'express'
import { DocumentoService } from '../services/documento.service'

const service = new DocumentoService()

export const listarDocumentosCliente = async (req: Request, res: Response) => {
  try {
    res.json(await service.listarDocumentosCliente(Number(req.params.clienteId)))
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const cadastrarDocumento = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await service.cadastrarDocumento(Number(req.params.clienteId), req.body))
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const excluirDocumento = async (req: Request, res: Response) => {
  try {
    await service.excluirDocumento(Number(req.params.id))
    res.json({ mensagem: 'Documento excluído com sucesso' })
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}
