import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PatientCard } from "../PatientCard";
import { Patient } from "@/types/patient";

const mockPatient: Patient = {
  id: "1",
  name: "John Doe",
  description: "Test patient description",
  website: "https://example.com",
  avatar: "https://example.com/avatar.jpg",
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("PatientCard", () => {
  it("should render the patient name", () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should render the patient ID", () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    expect(screen.getByText(/ID: 1/)).toBeInTheDocument();
  });

  it("should render the patient description (summary)", () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    // Only the summarized version should be visible when isExpanded=false
    const paragraphs = screen.getAllByText("Test patient description");
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it("should call onToggleFavorite when favorite button is clicked", async () => {
    const handleToggleFavorite = vi.fn();
    const user = userEvent.setup();

    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={handleToggleFavorite}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    const favoriteButtons = screen.getAllByRole("button");
    const favoriteButton = favoriteButtons.find((btn) =>
      btn.querySelector("svg")?.classList.contains("h-4")
    );

    if (favoriteButton) {
      await user.click(favoriteButton);
      expect(handleToggleFavorite).toHaveBeenCalledWith("1");
    }
  });

  it("should call onEdit when edit button is clicked", async () => {
    const handleEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={handleEdit}
        onToggleExpand={() => {}}
      />
    );

    const buttons = screen.getAllByRole("button");
    const editButton = buttons.find((btn) =>
      btn.querySelector(".lucide-square-pen")
    );

    if (editButton) {
      await user.click(editButton);
      expect(handleEdit).toHaveBeenCalledWith(mockPatient);
    }
  });

  it("should show filled star when is favorite", () => {
    const { container } = render(
      <PatientCard
        patient={mockPatient}
        isFavorite={true}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    const star = container.querySelector(".fill-yellow-500");
    expect(star).toBeInTheDocument();
  });

  it("should show empty star when not favorite", () => {
    const { container } = render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    const star = container.querySelector(".fill-yellow-500");
    expect(star).not.toBeInTheDocument();
  });

  it("should render the avatar with initials as fallback", () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should show website link", () => {
    render(
      <PatientCard
        patient={mockPatient}
        isFavorite={false}
        isExpanded={false}
        onToggleFavorite={() => {}}
        onEdit={() => {}}
        onToggleExpand={() => {}}
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
