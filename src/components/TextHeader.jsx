import React from "react";

export const TextHeader = (props) => {
  const { savedFlag, onClick } = props;
  return (
    <div id="text-header" className="headers">
      <button onClick={onClick}>✕</button>
      <div>{savedFlag && "saved"}</div>
    </div>
  );
};
