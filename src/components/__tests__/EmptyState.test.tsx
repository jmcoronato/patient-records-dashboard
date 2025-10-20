import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "../EmptyState";
import { Users } from "lucide-react";

describe("EmptyState", () => {
  it("should render with title and description", () => {
    render(
      <EmptyState
        icon={Users}
        title="No data found"
        description="There is no data to display"
      />
    );

    expect(screen.getByText("No data found")).toBeInTheDocument();
    expect(screen.getByText("There is no data to display")).toBeInTheDocument();
  });

  it("should render the icon", () => {
    const { container } = render(
      <EmptyState icon={Users} title="No data" description="No description" />
    );

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should not render action button if not provided", () => {
    render(
      <EmptyState icon={Users} title="No data" description="No description" />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render action button when provided", () => {
    render(
      <EmptyState
        icon={Users}
        title="No data"
        description="No description"
        action={{ label: "Add new", onClick: () => {} }}
      />
    );

    expect(screen.getByRole("button", { name: "Add new" })).toBeInTheDocument();
  });

  it("should execute onClick when action button is clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <EmptyState
        icon={Users}
        title="No data"
        description="No description"
        action={{ label: "Add new", onClick: handleClick }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Add new" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply custom className to the icon (wrapper)", () => {
    const { container } = render(
      <EmptyState
        icon={Users}
        title="No data"
        description="No description"
        iconClassName="custom-icon-class"
      />
    );

    const wrapper = container.querySelector(".custom-icon-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("should use default className for the icon (wrapper)", () => {
    const { container } = render(
      <EmptyState icon={Users} title="No data" description="No description" />
    );

    const wrapper = container.querySelector(".text-muted-foreground");
    expect(wrapper).toBeInTheDocument();
  });

  it("should have the correct size for the icon (wrapper)", () => {
    const { container } = render(
      <EmptyState icon={Users} title="No data" description="No description" />
    );

    const wrapper = container.querySelector(".h-16.w-16");
    expect(wrapper).toBeInTheDocument();
  });
});
