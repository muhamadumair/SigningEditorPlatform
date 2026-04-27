import { render, screen } from "@testing-library/react";
import MSApp from "./App";

test("renders learn react link", () => {
  render(<MSApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
