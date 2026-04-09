import { ForeignKeyConstraintError, ValidationError } from "sequelize";

import {
  AppointmentDto,
  AppointmentStatus,
  CreateAppointmentRequestDto,
} from "../dtos/appointment.dto";
import { AppointmentRepository } from "../repositories/appointment.repository";

type CreateAppointmentResponseDto = {
  appointment: AppointmentDto;
  message: string;
};

type CreateAppointmentServiceResult =
  | {
      success: true;
      data: CreateAppointmentResponseDto;
    }
  | {
      success: false;
      message: string;
      statusCode: number;
    };

const VALID_STATUSES: AppointmentStatus[] = ["confirmado", "pendente", "cancelado"];

export class CreateAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  public async execute(input: CreateAppointmentRequestDto): Promise<CreateAppointmentServiceResult> {
    const clientId = Number(input.clientId);
    const professionalId = Number(input.professionalId);
    const serviceId = Number(input.serviceId);
    const scheduledAt = input.scheduledAt?.trim();
    const status = input.status?.trim().toLowerCase() as AppointmentStatus;
    const notes = input.notes?.trim() ?? "";

    if (!clientId || !professionalId || !serviceId || !scheduledAt || !status) {
      return {
        success: false,
        message: "Cliente, profissional, servico, horario e status sao obrigatorios.",
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
      const appointment = await this.appointmentRepository.create({
        clientId,
        professionalId,
        serviceId,
        scheduledAt,
        status,
        notes,
      });

      return {
        success: true,
        data: {
          appointment,
          message: "Agendamento cadastrado com sucesso.",
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
