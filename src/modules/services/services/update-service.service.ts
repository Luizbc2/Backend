import { ValidationError } from "sequelize";

import { ServiceDto, UpdateServiceRequestDto } from "../dtos/service.dto";
import { ServiceRepository } from "../repositories/service.repository";

type UpdateServiceResponseDto = {
  message: string;
  service: ServiceDto;
};

type UpdateServiceServiceResult =
  | {
      success: true;
      data: UpdateServiceResponseDto;
    }
  | {
      success: false;
      message: string;
      statusCode: number;
    };

export class UpdateServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  public async execute(id: number, input: UpdateServiceRequestDto): Promise<UpdateServiceServiceResult> {
    const name = input.name.trim();
    const category = input.category.trim();
    const description = input.description.trim();
    const durationMinutes = Number(input.durationMinutes);
    const price = Number(input.price);

    if (!id || !name || !category || !description || !durationMinutes || Number.isNaN(price)) {
      return {
        success: false,
        message: "Id, nome, categoria, duracao, preco e descricao sao obrigatorios.",
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
      const updatedService = await this.serviceRepository.update(id, {
        name,
        category,
        durationMinutes,
        price,
        description,
      });

      if (!updatedService) {
        return {
          success: false,
          message: "Servico nao encontrado.",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: {
          message: "Servico atualizado com sucesso.",
          service: updatedService,
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
