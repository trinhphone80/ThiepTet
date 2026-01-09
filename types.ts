
export enum DesignConcept {
  THAN_TAI = 'THAN_TAI',
  MA_DAO = 'MA_DAO'
}

export interface ConceptDetails {
  id: DesignConcept;
  name: string;
  tagline: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  prompt: string;
}

export interface SelectionOption {
  id: string;
  label: string;
  promptSnippet: string;
}
