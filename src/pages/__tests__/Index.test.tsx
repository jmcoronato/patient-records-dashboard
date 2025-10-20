import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Index from "../Index";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Index Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should render the main title", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(screen.getByText("Patient Dashboard")).toBeInTheDocument();
  });

  it("should render the subtitle", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(
      screen.getByText(
        /Manage and track your patients' information efficiently/i
      )
    ).toBeInTheDocument();
  });

  it("should render the welcome message", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Welcome to the Patient Management System!")
    ).toBeInTheDocument();
  });

  it("should render the 'View Patients' button", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("button", { name: /View Patients/i })
    ).toBeInTheDocument();
  });

  it("should render the 'View Favorites' button", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("button", { name: /View Favorites/i })
    ).toBeInTheDocument();
  });

  it("should navigate to /patients when clicking on 'View Patients'", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    await user.click(screen.getByRole("button", { name: /View Patients/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/patients");
  });

  it("should navigate to /favorites when clicking on 'View Favorites'", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    await user.click(screen.getByRole("button", { name: /View Favorites/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/favorites");
  });

  it("should render the feature cards", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(screen.getByText("All Patients")).toBeInTheDocument();
    expect(screen.getByText("Favorite Patients")).toBeInTheDocument();
  });

  it("should render the main feature section", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    // Verify that the main cards are present
    expect(screen.getByText("All Patients")).toBeInTheDocument();
    expect(screen.getByText("Favorite Patients")).toBeInTheDocument();
    expect(
      screen.getByText("View and manage all patients registered in the system")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Quick access to your patients marked as favorites")
    ).toBeInTheDocument();
  });

  it("should have the correct icons", () => {
    const { container } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });
});
