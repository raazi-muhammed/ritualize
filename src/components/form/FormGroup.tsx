import React from "react";

const FormGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="divide-y divide-input bg-input-background rounded-4xl">
      {children}
    </div>
  );
};

export default FormGroup;
