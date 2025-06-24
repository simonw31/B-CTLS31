export type TimeEntry = {
  id: string;
  employeeId: string;
  heureEntree: string;
  heureSortie: string;
  date: string;
};

export type Employee = {
  id: string;
  prenom: string;
  nom: string;
};
