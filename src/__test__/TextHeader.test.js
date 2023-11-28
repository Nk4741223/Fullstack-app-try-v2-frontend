import { render, screen } from "@testing-library/react";
import { TextHeader } from "../components/TextHeader";

describe("Test TextHeader Component", () => {
  test("render form with 1 button", async () => {
    render(<TextHeader />);
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(1);
  });
});
