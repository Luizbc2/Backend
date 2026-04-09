import { ForeignKeyConstraintError, ValidationError } from "sequelize";

import {
  AppointmentDto,
  AppointmentStatus,
  UpdateAppointmentRequestDto,
} from "../dtos/appointment.dto";
import { AppointmentRepository } from "../repositories/appointment.repository";

type UpdateAppointmentResponseDto = {
  appointment: AppointmentDto;
  message: string;
};

type UpdateAppointmentServiceResult =
  | {
      success: true;
      data: UpdateAppointmentResponseDto;
    }
  | {
      success: false;
      message: string;
      statusCode: number;
    };

const VALID_STATUSES: AppointmentStatus[] = ["confirmado", "pendente", "cancelado"];

export class UpdateAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  public async execute(
    id: number,
    input: UpdateAppointmentRequestDto,
  ): Promise<UpdateAppointmentServiceResult> {
    const clientId = Number(input.clientId);
    const professionalId = Number(input.professionalId);
    const serviceId = Number(input.serviceId);
    const scheduledAt = input.scheduledAt?.trim();
    const status = input.status?.trim().toLowerCase() as AppointmentStatus;
    const notes = input.notes?.trim() ?? "";

    if (!id || !clientId || !professionalId || !serviceId || !scheduledAt || !status) {
      return {
        success: false,
        message: "Id, cliente, profissional, servico, horario e status sao obrigatorios.",
        statusCode: 400,
      };
    }

    if (!this.isValidStatus(status)) {
      return {
        success: false,
        message: "Status do agendamento invalido.",
        statusCode: 400,
      };
    }

    if (Number.isNaN(Date.parse(scheduledAt))) {
      return {
        success: false,
        message: "Horario do agendamento invalido.",
        statusCode: 400,
      };
    }

    try {
      const appointment = await this.appointmentRepository.update(id, {
        clientId,
        professionalId,
        serviceId,
        scheduledAt,
        status,
        notes,
      });

      if (!appointment) {
        return {
          success: false,
          message: "Agendamento nao encontrado.",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: {
          appointment,
          message: "Agendamento atualizado com sucesso.",
        },
      };
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return {
          success: false,
          message: "Cliente, profissional ou servico informado nao existe.",
          statusCode: 400,
        };
      }

      if (error instanceof ValidationError) {
        return {
          success: false,
          message: "Dados do agendamento sao invalidos.",
          statusCode: 400,
        };
      }

      throw error;
    }
  }

  private isValidStatus(status: AppointmentStatus): boolean {
    return VALID_STATUSES.includes(status);
  }
}
