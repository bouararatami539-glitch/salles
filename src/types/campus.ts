export type CategoryType = 'Amphithéâtres' | 'Salles de TD' | 'Laboratoires' | 'Bâtiments';

export type BuildingType = 'Bâtiment Central' | 'Bâtiment Informatique' | 'Bâtiment Sciences';

export interface RouteStep {
  stepNumber: number;
  title: string;
  instruction: string;
  icon: 'entrance' | 'stairs' | 'elevator' | 'turn-left' | 'turn-right' | 'straight' | 'door';
  highlight?: string;
}

export interface PlanCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  category: CategoryType;
  building: BuildingType;
  floor: string;
  floorLevel: number; // -1 for basement, 0 for RDC, 1 for 1er, 2 for 2ème
  capacity: number;
  accessInstructions: string;
  estimatedWalkMinutes: number;
  steps: RouteStep[];
  equipment: string[];
  hasAccessibility: boolean;
  status: 'Disponible' | 'Cours en cours' | 'Réservé';
  planCoordinates: PlanCoordinates;
  tags: string[];
}

export interface BuildingInfo {
  id: BuildingType;
  name: string;
  code: string;
  color: string;
  floorsCount: string;
  description: string;
  primaryDepartments: string[];
  openingHours: string;
}
