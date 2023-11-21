import React from "react";

export const TextAria = (props) => {
  const { text, onChangeText } = props;
  return (
    <div id="text-aria" key={text}>
      <input
        value={text.title}
        onChange={(e) => onChangeText(e.target.value, "title")}
        id="textTitle"
      ></input>
      {/* <br /> */}
      <textarea
        value={text.content}
        onChange={(e) => onChangeText(e.target.value, "content")}
        id="textContent"
      ></textarea>
    </div>
  );
};
