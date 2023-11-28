import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App";
import axios from "axios";

// jest.mock("axios");

describe("Test App", () => {
  test("renders Notes in the header", () => {
    render(<App />);
    const HeaderText = screen.getByText("Notes");
    expect(HeaderText).toBeInTheDocument();
  });

  // test("should call getCards", async () => {
  //   axios.get.mockResolvedValue({ data: [] });
  //   render(<App />);

  //   await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  // });
});
