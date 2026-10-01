export type Patient = {
  id: string;
  medicalRecordNo: string;
  name: string;
  birthDate: string; // "YYYY-MM-DD"
  gender: "M" | "F";
  phone: string;
  address: string;
};