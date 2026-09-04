import React from "react";

const FormGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="divide-y divide-border bg-card rounded-lg [&>*]:mx-4">
      {children}
    </div>
  );
};

export default FormGroup;
