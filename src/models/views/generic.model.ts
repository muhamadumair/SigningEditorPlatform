export interface Collapsable {
  collapsed: boolean;
}

export interface ActivatedWidget {
  isActive: boolean;
}

export interface Scalable {
  scale: number;
}

export interface GenericResponse {
  results: number;
  errorStr: string;
  object: any;
}

export type CssValueType = number | string;
