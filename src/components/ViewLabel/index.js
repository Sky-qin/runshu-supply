import React from "react";

const ViewLabel = (props) => {
  const { children } = props;
  return <div>{children}</div>;
};

const ViewLabelItem = (props) => {
  const { title, children } = props;
  return (
    <div
      style={{
        display: "inline-block",
        width: "210px",
        marginRight: "20px",
        lineHeight: "36px",
      }}
    >
      <div style={{ display: "flex" }}>
        <div>{title}</div>
        <div style={{ paddingTop: "8px", flex: 1, lineHeight: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export { ViewLabel, ViewLabelItem };
