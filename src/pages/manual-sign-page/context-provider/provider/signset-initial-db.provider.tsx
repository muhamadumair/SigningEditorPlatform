import React from "react";
import {
  SignsetInitialDbContext,
  SignsetInitialDbContextProps,
} from "../context/signset-initial-db.context";

export const SignsetInitialDbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const editorContextValue: SignsetInitialDbContextProps = {
    signsetDetailsFromDB: {},
  };

  return (
    <SignsetInitialDbContext.Provider value={editorContextValue}>
      {children}
    </SignsetInitialDbContext.Provider>
  );
};
