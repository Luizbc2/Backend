export type ProfessionalDto = {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: string;
};

export type CreateProfessionalRequestDto = {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: string;
};

export type UpdateProfessionalRequestDto = {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: string;
};

export type ListProfessionalsQueryDto = {
  limit?: number;
  page?: number;
  search?: string;
};
