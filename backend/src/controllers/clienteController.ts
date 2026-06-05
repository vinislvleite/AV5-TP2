import { Request, Response } from 'express'
import { ClienteService } from '../services/cliente.service'

const service = new ClienteService()

// ─── TITULARES ────────────────────────────────────────────────────────────────

export const listarTitulares = async (_req: Request, res: Response) => {
  try {
    const data = await service.listarTitulares()
    res.json(data)
  } catch (e: any) {
    res.status(500).json({ erro: e.message })
  }
}

export const buscarTitular = async (req: Request, res: Response) => {
  try {
    const data = await service.buscarTitular(Number(req.params.id))
    res.json(data)
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const cadastrarTitular = async (req: Request, res: Response) => {
  try {
    const data = await service.cadastrarTitular(req.body)
    res.status(201).json(data)
  } catch (e: any) {
    res.status(409).json({ erro: e.message })
  }
}

export const editarTitular = async (req: Request, res: Response) => {
  try {
    const data = await service.editarTitular(Number(req.params.id), req.body)
    res.json(data)
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const excluirTitular = async (req: Request, res: Response) => {
  try {
    await service.excluirTitular(Number(req.params.id))
    res.json({ mensagem: 'Titular e dependentes excluídos com sucesso' })
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

// ─── DEPENDENTES ─────────────────────────────────────────────────────────────

export const listarTodosDependentes = async (_req: Request, res: Response) => {
  try {
    const data = await service.listarTodosDependentes()
    res.json(data)
  } catch (e: any) {
    res.status(500).json({ erro: e.message })
  }
}

export const listarDependentesPorTitular = async (req: Request, res: Response) => {
  try {
    const data = await service.listarDependentesPorTitular(Number(req.params.titularId))
    res.json(data)
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const buscarTitularPorDependente = async (req: Request, res: Response) => {
  try {
    const data = await service.buscarTitularPorDependente(Number(req.params.dependenteId))
    res.json(data)
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const cadastrarDependente = async (req: Request, res: Response) => {
  try {
    const data = await service.cadastrarDependente(Number(req.params.titularId), req.body)
    res.status(201).json(data)
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const editarDependente = async (req: Request, res: Response) => {
  try {
    const data = await service.editarDependente(
      Number(req.params.titularId),
      Number(req.params.dependenteId),
      req.body
    )
    res.json(data)
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

export const excluirDependente = async (req: Request, res: Response) => {
  try {
    await service.excluirDependente(
      Number(req.params.titularId),
      Number(req.params.dependenteId)
    )
    res.json({ mensagem: 'Dependente excluído com sucesso' })
  } catch (e: any) {
    res.status(404).json({ erro: e.message })
  }
}

// ─── ACOMODADOS ───────────────────────────────────────────────────────────────

export const listarAcomodados = async (_req: Request, res: Response) => {
  try {
    const data = await service.listarAcomodados()
    res.json(data)
  } catch (e: any) {
    res.status(500).json({ erro: e.message })
  }
}
