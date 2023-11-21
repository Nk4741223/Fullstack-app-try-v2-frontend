import React from "react";

export const CardAria = (props) => {
  const { cards, onClickCard, activeCardId } = props;
  return (
    <div id="card-aria">
      {cards.map((card, index) => {
        return (
          <div
            key={index}
            className={
              card._id === activeCardId ? "note-cards active" : "note-cards"
            }
            onClick={() => onClickCard(card._id)}
          >
            <h2>{card.title}</h2>
            <p>
              更新日時：
              {new Date(card.updatedAt).toLocaleDateString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
};
