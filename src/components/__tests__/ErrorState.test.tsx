import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "../ErrorState";

describe("ErrorState", () => {
  it("should render with error message", () => {
    render(<ErrorState message="Something went wrong" />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should use default title", () => {
    render(<ErrorState message="Error message" />);

    expect(screen.getByText("Error loading data")).toBeInTheDocument();
  });

  it("should use custom title", () => {
    render(<ErrorState title="Custom Error" message="Error message" />);

    expect(screen.getByText("Custom Error")).toBeInTheDocument();
  });

  it("should render the alert icon", () => {
    const { container } = render(<ErrorState message="Error message" />);

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should not render retry button if not provided", () => {
    render(<ErrorState message="Error message" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render retry button when provided", () => {
    render(<ErrorState message="Error message" onRetry={() => {}} />);

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("should use custom label for retry", () => {
    render(
      <ErrorState
        message="Error message"
        onRetry={() => {}}
        retryLabel="Try again"
      />
    );

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  it("should execute onRetry when retry button is clicked", async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorState message="Error message" onRetry={handleRetry} />);

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("should have error styles on the icon (wrapper)", () => {
    const { container } = render(<ErrorState message="Error message" />);

    const wrapper = container.querySelector(".text-destructive");
    expect(wrapper).toBeInTheDocument();
  });

  it("should show all elements together", () => {
    render(
      <ErrorState
        title="Custom Title"
        message="Custom Message"
        onRetry={() => {}}
        retryLabel="Try Again"
      />
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try Again" })
    ).toBeInTheDocument();
  });
});
