import prisma from '../prisma/clientPrisma'
import {
  CadastrarTitularDTO,
  CadastrarDependenteDTO,
  EditarClienteDTO,
} from '../dtos/cliente.dto'

export class ClienteService {

  async listarTitulares() {
    return prisma.cliente.findMany({
      where: { titularId: null },
      include: {
        endereco: true,
        telefones: true,
        documentos: true,
        acomodacao: true,
        dependentes: {
          include: {
            endereco: true,
            telefones: true,
            documentos: true,
            acomodacao: true,
          },
        },
      },
    })
  }

  async buscarTitular(id: number) {
    const titular = await prisma.cliente.findFirst({
      where: { id, titularId: null },
      include: {
        endereco: true,
        telefones: true,
        documentos: true,
        acomodacao: true,
        dependentes: {
          include: {
            endereco: true,
            telefones: true,
            documentos: true,
            acomodacao: true,
          },
        },
      },
    })
    if (!titular) throw new Error('Titular não encontrado')
    return titular
  }

  async cadastrarTitular(dto: CadastrarTitularDTO) {
    const existe = await prisma.cliente.findFirst({
      where: { nome: dto.nome, titularId: null },
    })
    if (existe) throw new Error('Já existe um titular cadastrado com esse nome')

    return prisma.cliente.create({
    data: {
      nome: dto.nome,
      nomeSocial: dto.nomeSocial,
      dataNascimento: new Date(dto.dataNascimento),
      endereco: dto.endereco ? { create: dto.endereco } : undefined,
      telefones: dto.telefones?.length ? { create: dto.telefones } : undefined,
      documentos: dto.documentos?.length
        ? {
            create: dto.documentos.map(doc => ({
              numero: doc.numero,
              tipo: doc.tipo,
              dataExpedicao: new Date(doc.dataExpedicao),
            })),
          }
        : undefined,
    },
    include: {
      endereco: true,
      telefones: true,
      documentos: true,
    },
  })
  }

  async editarTitular(id: number, dto: EditarClienteDTO) {
    const existe = await prisma.cliente.findFirst({ where: { id, titularId: null } })
    if (!existe) throw new Error('Titular não encontrado')

    await prisma.cliente.update({
      where: { id },
      data: {
        ...(dto.nome && { nome: dto.nome }),
        ...(dto.nomeSocial && { nomeSocial: dto.nomeSocial }),
        ...(dto.dataNascimento && { dataNascimento: new Date(dto.dataNascimento) }),
      },
    })

    if (dto.endereco) {
      await prisma.endereco.upsert({
        where: { clienteId: id },
        update: dto.endereco,
        create: { ...dto.endereco, clienteId: id },
      })
    }

    if (dto.telefones?.length) {
      for (const t of dto.telefones) {
        const todos = await prisma.telefone.findMany({ where: { clienteId: id } })
        const alvo = todos[t.indice]
        if (alvo) {
          await prisma.telefone.update({
            where: { id: alvo.id },
            data: { ddd: t.ddd, numero: t.numero },
          })
        }
      }
    }

    if (dto.documentos) {
  await prisma.documento.deleteMany({
    where: { clienteId: id },
  })

    if (dto.documentos.length > 0) {
      await prisma.documento.createMany({
        data: dto.documentos.map(doc => ({
          clienteId: id,
          numero: doc.numero,
          tipo: doc.tipo,
          dataExpedicao: new Date(doc.dataExpedicao),
        })),
      })
    }
  }

    return prisma.cliente.findUnique({
      where: { id },
      include: { endereco: true, telefones: true, documentos: true },
    })
  }

  async excluirTitular(id: number) {
    const existe = await prisma.cliente.findFirst({ where: { id, titularId: null } })
    if (!existe) throw new Error('Titular não encontrado')
    await prisma.cliente.delete({ where: { id } })
  }

  async listarTodosDependentes() {
    return prisma.cliente.findMany({
      where: { titularId: { not: null } },
      include: {
        titular: true,
        endereco: true,
        telefones: true,
        documentos: true,
        acomodacao: true,
      },
    })
  }

  async listarDependentesPorTitular(titularId: number) {
    const titular = await prisma.cliente.findFirst({
      where: { id: titularId, titularId: null },
    })
    if (!titular) throw new Error('Titular não encontrado')

    return prisma.cliente.findMany({
      where: { titularId },
      include: {
        endereco: true,
        telefones: true,
        documentos: true,
        acomodacao: true,
      },
    })
  }

  async buscarTitularPorDependente(dependenteId: number) {
    const dependente = await prisma.cliente.findUnique({
      where: { id: dependenteId },
      include: {
        titular: {
          include: {
            endereco: true,
            telefones: true,
            documentos: true,
            acomodacao: true,
          },
        },
      },
    })
    if (!dependente) throw new Error('Dependente não encontrado')
    if (!dependente.titular) throw new Error('Esse cliente não possui titular')
    return dependente.titular
  }

  async cadastrarDependente(titularId: number, dto: CadastrarDependenteDTO) {
    const titular = await prisma.cliente.findFirst({
      where: { id: titularId, titularId: null },
    })
    if (!titular) throw new Error('Titular não encontrado')

    return prisma.cliente.create({
      data: {
        nome: dto.nome,
        nomeSocial: dto.nomeSocial,
        dataNascimento: new Date(dto.dataNascimento),
        titularId,
        endereco: dto.endereco ? { create: dto.endereco } : undefined,
        telefones: dto.telefones?.length ? { create: dto.telefones } : undefined,
        documentos: dto.documentos?.length
  ? {
      create: dto.documentos.map(doc => ({
        numero: doc.numero,
        tipo: doc.tipo,
        dataExpedicao: new Date(doc.dataExpedicao),
      })),
    }
  : undefined,
      },
      include: {
      endereco: true,
      telefones: true,
      documentos: true,
    },
    })
  }

  async editarDependente(titularId: number, dependenteId: number, dto: EditarClienteDTO) {
    const dependente = await prisma.cliente.findFirst({
      where: { id: dependenteId, titularId },
    })
    if (!dependente) throw new Error('Dependente não encontrado para esse titular')

    await prisma.cliente.update({
      where: { id: dependenteId },
      data: {
        ...(dto.nome && { nome: dto.nome }),
        ...(dto.nomeSocial && { nomeSocial: dto.nomeSocial }),
        ...(dto.dataNascimento && { dataNascimento: new Date(dto.dataNascimento) }),
      },
    })

    if (dto.endereco) {
      await prisma.endereco.upsert({
        where: { clienteId: dependenteId },
        update: dto.endereco,
        create: { ...dto.endereco, clienteId: dependenteId },
      })
    }

    if (dto.telefones?.length) {
      for (const t of dto.telefones) {
        const todos = await prisma.telefone.findMany({ where: { clienteId: dependenteId } })
        const alvo = todos[t.indice]
        if (alvo) {
          await prisma.telefone.update({
            where: { id: alvo.id },
            data: { ddd: t.ddd, numero: t.numero },
          })
        }
      }
    }
    if (dto.documentos) {
  await prisma.documento.deleteMany({
    where: { clienteId: dependenteId },
  })

  if (dto.documentos.length > 0) {
    await prisma.documento.createMany({
      data: dto.documentos.map(doc => ({
        clienteId: dependenteId,
        numero: doc.numero,
        tipo: doc.tipo,
        dataExpedicao: new Date(doc.dataExpedicao),
      })),
    })
  }
}

    return prisma.cliente.findUnique({
      where: { id: dependenteId },
      include: { endereco: true, telefones: true, documentos: true },
    })
  }

  async excluirDependente(titularId: number, dependenteId: number) {
    const titular = await prisma.cliente.findFirst({
      where: { id: titularId, titularId: null },
      include: { dependentes: true },
    })
    if (!titular) throw new Error('Titular não encontrado')

    if (titular.dependentes.length === 0) {
      throw new Error('Titular não possui dependentes')
    }

    const dependente = titular.dependentes.find(d => d.id === dependenteId)
    if (!dependente) throw new Error('Dependente não encontrado para esse titular')

    await prisma.cliente.delete({ where: { id: dependenteId } })
  }

  async listarAcomodados() {
    return prisma.cliente.findMany({
      where: {
        titularId: null,
        OR: [
          { acomodacaoId: { not: null } },
          { dependentes: { some: { acomodacaoId: { not: null } } } },
        ],
      },
      include: {
        acomodacao: true,
        dependentes: {
          include: { acomodacao: true },
        },
      },
    })
  }
}