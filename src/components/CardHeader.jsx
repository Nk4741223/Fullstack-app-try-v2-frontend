import React from "react";

export const CardHeader = (props) => {
  const { onChangeInput, onClick, serchInput } = props;
  return (
    <div id="card-header" className="headers">
      <input
        value={serchInput}
        id="serch"
        placeholder="serch"
        onChange={(e) => onChangeInput(e.target.value)}
      />
      <button onClick={onClick}>＋</button>
    </div>
  );
};
