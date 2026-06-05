import { Request, Response } from 'express'
import { AcomodacaoService } from '../services/acomodacao.service'

const service = new AcomodacaoService()

export const listarAcomodacoes = async (_req: Request, res: Response) => {
  try {
    res.json(await service.listarAcomodacoes())
  } catch (e: any) {
    res.status(500).json({ erro: e.message })
  }
}

export const buscarAcomodacao = async (req: Request, res: Response) => {
  try {
    res.json(await service.buscarAcomodacao(Number(req.params.id)))
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const criarAcomodacao = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await service.criarAcomodacao(req.body))
  } catch (e: any) {
    res.status(400).json({ erro: e.message })
  }
}

export const vincularAcomodacao = async (req: Request, res: Response) => {
  try {
    const { resultado, naoEncontrados } = await service.vincularAcomodacao(req.body)
    if (naoEncontrados.length) {
      return res.status(207).json({
        mensagem: 'Vinculação parcial: alguns dependentes não pertencem a esse titular',
        naoEncontrados,
        resultado,
      })
    }
    res.json({ mensagem: 'Acomodação vinculada com sucesso!', resultado })
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const cancelarAcomodacao = async (req: Request, res: Response) => {
  try {
    await service.cancelarAcomodacao(req.body)
    res.json({ mensagem: 'Acomodação cancelada com sucesso!' })
  } catch (e: any) {
    res.status(400).json({ erro: e.message })
  }
}

export const excluirAcomodacao = async (req: Request, res: Response) => {
  try {
    await service.excluirAcomodacao(Number(req.params.id))
    res.json({ mensagem: 'Acomodação excluída com sucesso' })
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}
