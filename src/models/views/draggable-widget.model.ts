import { SignSet } from "./signset.model";

export interface DraggableWidget {
  key: string;
  signsets: SignSet[];
  signerId: string | number;
}
