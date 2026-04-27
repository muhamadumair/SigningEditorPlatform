import { createContext } from "react";
import { SignSetState } from "../../../../models/views/signset.model";

export interface SignsetInitialDbContextProps {
  signsetDetailsFromDB: Record<string, SignSetState[]>;
}

export const SignsetInitialDbContext =
  createContext<SignsetInitialDbContextProps>(
    {} as SignsetInitialDbContextProps
  );
