import { ValidationError } from "sequelize";

import { CreateServiceRequestDto, ServiceDto } from "../dtos/service.dto";
import { ServiceRepository } from "../repositories/service.repository";

type CreateServiceResponseDto = {
  message: string;
  service: ServiceDto;
};

type CreateServiceServiceResult =
  | {
      success: true;
      data: CreateServiceResponseDto;
    }
  | {
      success: false;
      message: string;
      statusCode: number;
    };

export class CreateServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  public async execute(input: CreateServiceRequestDto): Promise<CreateServiceServiceResult> {
    const name = input.name.trim();
    const category = input.category.trim();
    const description = input.description.trim();
    const durationMinutes = Number(input.durationMinutes);
    const price = Number(input.price);

    if (!name || !category || !description || !durationMinutes || Number.isNaN(price)) {
      return {
        success: false,
        message: "Nome, categoria, duracao, preco e descricao sao obrigatorios.",
        statusCode: 400,
      };
    }

    if (durationMinutes <= 0) {
      return {
        success: false,
        message: "A duracao do servico deve ser maior que zero.",
        statusCode: 400,
      };
    }

    if (price < 0) {
      return {
        success: false,
        message: "O preco do servico nao pode ser negativo.",
        statusCode: 400,
      };
    }

    try {
      const createdService = await this.serviceRepository.create({
        name,
        category,
        durationMinutes,
        price,
        description,
      });

      return {
        success: true,
        data: {
          message: "Servico cadastrado com sucesso.",
          service: createdService,
        },
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          message: "Dados do servico sao invalidos.",
          statusCode: 400,
        };
      }

      throw error;
    }
  }
}
