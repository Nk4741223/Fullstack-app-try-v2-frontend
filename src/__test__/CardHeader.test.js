import { render, screen } from "@testing-library/react";
import { CardHeader } from "../components/CardHeader";

describe("Test CardHeader Component", () => {
  test("render form with 1 button", async () => {
    render(<CardHeader />);
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(1);
  });
});
