import { Request, Response } from 'express'
import { EnderecoService } from '../services/endereco.service'

const service = new EnderecoService()

export const buscarEndereco = async (req: Request, res: Response) => {
  try {
    res.json(await service.buscarEndereco(Number(req.params.clienteId)))
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const salvarEndereco = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await service.salvarEndereco(Number(req.params.clienteId), req.body))
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}
