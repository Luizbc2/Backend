import { ServiceRepository } from "../repositories/service.repository";

type DeleteServiceResponseDto = {
  message: string;
};

type DeleteServiceServiceResult =
  | {
      success: true;
      data: DeleteServiceResponseDto;
    }
  | {
      success: false;
      message: string;
      statusCode: number;
    };

export class DeleteServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  public async execute(id: number): Promise<DeleteServiceServiceResult> {
    if (!id) {
      return {
        success: false,
        message: "Id do servico e obrigatorio.",
        statusCode: 400,
      };
    }

    const deleted = await this.serviceRepository.delete(id);

    if (!deleted) {
      return {
        success: false,
        message: "Servico nao encontrado.",
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: {
        message: "Servico excluido com sucesso.",
      },
    };
  }
}
