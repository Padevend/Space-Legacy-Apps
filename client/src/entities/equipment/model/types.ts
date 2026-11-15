export interface EquipmentSummary {
  equipmentId: string;
  name: string;
  slug: string;
  equipmentType: string;
  celestialBodyName: string;
  physicalStatus: string;
  operationalStatus: string;
  mainImageUrl?: string;
  hook?: string;
}

export const getEquipmentStatusLabel = (status: string): string => {
  return status.replace(/_/g, ' ');
};
