import { Op } from "sequelize";

import {
  CreateProfessionalRequestDto,
  ProfessionalDto,
  UpdateProfessionalRequestDto,
} from "../dtos/professional.dto";
import { ProfessionalModel } from "../models/professional.model";
import { ListProfessionalsRepositoryResult, ProfessionalRepository } from "./professional.repository";

type ListProfessionalsInput = {
  page: number;
  limit: number;
  search: string;
};

export class SequelizeProfessionalRepository implements ProfessionalRepository {
  public async findById(id: number): Promise<ProfessionalDto | null> {
    const professional = await ProfessionalModel.findByPk(id);

    if (!professional) {
      return null;
    }

    return this.toProfessionalDto(professional);
  }

  public async list(query: ListProfessionalsInput): Promise<ListProfessionalsRepositoryResult> {
    const page = Math.max(1, query.page);
    const limit = Math.max(1, query.limit);
    const search = query.search.trim().toLowerCase();

    const { rows, count } = await ProfessionalModel.findAndCountAll({
      where: search
        ? {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                email: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                phone: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                specialty: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                status: {
                  [Op.iLike]: `%${search}%`,
                },
              },
            ],
          }
        : undefined,
      limit,
      offset: (page - 1) * limit,
      order: [["createdAt", "DESC"]],
    });

    return {
      professionals: rows.map((professional) => this.toProfessionalDto(professional)),
      totalItems: count,
    };
  }

  public async create(input: CreateProfessionalRequestDto): Promise<ProfessionalDto> {
    const professional = await ProfessionalModel.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      specialty: input.specialty,
      status: input.status,
    });

    return this.toProfessionalDto(professional);
  }

  public async update(id: number, input: UpdateProfessionalRequestDto): Promise<ProfessionalDto | null> {
    const professional = await ProfessionalModel.findByPk(id);

    if (!professional) {
      return null;
    }

    professional.name = input.name;
    professional.email = input.email;
    professional.phone = input.phone;
    professional.specialty = input.specialty;
    professional.status = input.status;

    await professional.save();

    return this.toProfessionalDto(professional);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await ProfessionalModel.destroy({
      where: {
        id,
      },
    });

    return deletedCount > 0;
  }

  private toProfessionalDto(professional: ProfessionalModel): ProfessionalDto {
    return {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      specialty: professional.specialty,
      status: professional.status,
    };
  }
}
