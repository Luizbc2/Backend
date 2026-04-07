import {
  CreateProfessionalRequestDto,
  ListProfessionalsQueryDto,
  ProfessionalDto,
  UpdateProfessionalRequestDto,
} from "../dtos/professional.dto";

export type ListProfessionalsRepositoryResult = {
  professionals: ProfessionalDto[];
  totalItems: number;
};

export interface ProfessionalRepository {
  findById(id: number): Promise<ProfessionalDto | null>;
  list(query: Required<ListProfessionalsQueryDto> & { limit: number }): Promise<ListProfessionalsRepositoryResult>;
  create(input: CreateProfessionalRequestDto): Promise<ProfessionalDto>;
  update(id: number, input: UpdateProfessionalRequestDto): Promise<ProfessionalDto | null>;
  delete(id: number): Promise<boolean>;
}
