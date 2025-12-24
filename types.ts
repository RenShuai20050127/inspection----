
export interface ColorInfo {
  id: string;
  name: string;
  pantoneName: string;
  hex: string;
  rgb: string;
  source: string; // Description of where this color came from
  category: 'Official' | 'Campus' | 'Nature' | 'Architecture';
}

export interface CampusImage {
  id: number;
  url: string;
  title: string;
}
