import { render, screen } from "@testing-library/react";
import { CardAria } from "../components/CardAria";

describe("Test CardAria Component", () => {
  test("カードが正しくレンダリングされる", async () => {
    const cards = [
      { _id: "1", title: "Card 1", updatedAt: new Date() },
      { _id: "2", title: "Card 2", updatedAt: new Date() },
    ];
    const activeCardId = "1";

    render(
      <CardAria
        cards={cards}
        onClickCard={() => {}}
        activeCardId={activeCardId}
      />
    );

    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
    expect(screen.getByTestId("card-1")).toHaveClass("active");
    expect(screen.getByTestId("card-2")).not.toHaveClass("active");
  });
});
