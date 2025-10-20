import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "../NotFound";

describe("NotFound Page", () => {
  it("should render the error code 404", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("should render the error message", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });

  it("should render the return to home link", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const link = screen.getByRole("link", { name: /Return to Home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("should have the link with correct styles", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const link = screen.getByRole("link", { name: /Return to Home/i });
    expect(link.className).toContain("text-blue-500");
    expect(link.className).toContain("underline");
  });

  it("should register error in console", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("404 Error"),
      expect.any(String)
    );

    consoleErrorSpy.mockRestore();
  });
});
