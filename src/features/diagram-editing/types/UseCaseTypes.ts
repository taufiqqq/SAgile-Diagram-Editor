export interface UseCaseData {
  id: string;
  name: string;
  description: string;
  version: string;
  created: string;
  modified: string;
}

export type UseCaseTab = 'Details' | 'Specifications' | 'Others';

export interface UseCaseFormData extends UseCaseData {
  activeTab: UseCaseTab;
}

export const DEFAULT_USE_CASE: UseCaseData = {
  id: '',
  name: '',
  description: 'This use case is ...',
  version: '1.0',
  created: new Date().toLocaleString(),
  modified: new Date().toLocaleString(),
}; 