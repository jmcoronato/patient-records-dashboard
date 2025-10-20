import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PatientSkeleton } from "../PatientSkeleton";

describe("PatientSkeleton", () => {
  it("should render without errors", () => {
    const { container } = render(<PatientSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render multiple skeleton elements", () => {
    const { container } = render(<PatientSkeleton />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');

    // Should have several skeleton elements (avatar, name, description, etc.)
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render a circular skeleton for the avatar", () => {
    const { container } = render(<PatientSkeleton />);
    const avatarSkeleton = container.querySelector(".rounded-full");

    expect(avatarSkeleton).toBeInTheDocument();
  });

  it("should be wrapped in a Card", () => {
    const { container } = render(<PatientSkeleton />);
    const card = container.querySelector('[class*="overflow-hidden"]');

    expect(card).toBeInTheDocument();
  });

  it("should have the correct layout structure", () => {
    const { container } = render(<PatientSkeleton />);

    // Verify that there is a container with padding
    const paddingContainer = container.querySelector(".p-6");
    expect(paddingContainer).toBeInTheDocument();

    // Verify that there is a flex container
    const flexContainer = container.querySelector(".flex.items-start.gap-4");
    expect(flexContainer).toBeInTheDocument();
  });

  it("should render multiple independent instances", () => {
    const { container } = render(
      <>
        <PatientSkeleton />
        <PatientSkeleton />
        <PatientSkeleton />
      </>
    );

    const cards = container.querySelectorAll('[class*="overflow-hidden"]');
    expect(cards.length).toBe(3);
  });
});
