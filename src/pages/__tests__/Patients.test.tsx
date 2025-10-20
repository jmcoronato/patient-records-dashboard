import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Patients from "../Patients";
import { PatientListProps } from "@/components/PatientList";
import { PatientPageLayoutProps } from "@/components/layouts/PatientPageLayout";

// Mock hooks
const mockUseInfinitePatientsQuery = vi.fn();
const mockUsePatientHandlers = vi.fn();
const mockUseScrollToTop = vi.fn();

vi.mock("@/hooks/use-infinite-patients-query", () => ({
  useInfinitePatientsQuery: () => mockUseInfinitePatientsQuery(),
}));

vi.mock("@/hooks/use-patient-handlers", () => ({
  usePatientHandlers: (props: unknown) => mockUsePatientHandlers(props),
}));

vi.mock("@/hooks/use-scroll-to-top", () => ({
  useScrollToTop: () => mockUseScrollToTop(),
}));

vi.mock("@/hooks/use-intersection-observer", () => ({
  useIntersectionObserver: () => ({ current: null }),
}));

// Mock components
vi.mock("@/components/PatientList", () => ({
  PatientList: ({
    state,
    favorites,
    onToggleFavorite,
    onEditPatient,
    onLoadMore,
    emptyMessage,
  }: PatientListProps) => (
    <div data-testid="patient-list">
      <div data-testid="patient-count">{state.patients.length}</div>
      <div data-testid="loading-state">
        {state.isLoading ? "Loading" : "Not Loading"}
      </div>
      <div data-testid="error-state">{state.error ? "Error" : "No Error"}</div>
      <div data-testid="has-more">{state.hasMore ? "Has More" : "No More"}</div>
      <div data-testid="empty-message">{emptyMessage}</div>
      <button onClick={onLoadMore} data-testid="load-more-btn">
        Load More
      </button>
    </div>
  ),
}));

vi.mock("@/components/layouts/PatientPageLayout", () => ({
  PatientPageLayout: ({
    title,
    subtitle,
    showAddButton,
    showFavoritesButton,
    onAddPatient,
    isModalOpen,
    onModalClose,
    onModalSave,
    editingPatient,
    showBackToTop,
    onScrollToTop,
    error,
    onRetryError,
    children,
  }: PatientPageLayoutProps) => (
    <div data-testid="patient-page-layout">
      <h1 data-testid="page-title">{title}</h1>
      <p data-testid="page-subtitle">{subtitle}</p>
      {showAddButton && (
        <button data-testid="add-button" onClick={onAddPatient}>
          Add Patient
        </button>
      )}
      {showFavoritesButton && (
        <button data-testid="favorites-button">Favorites</button>
      )}
      {showBackToTop && (
        <button data-testid="back-to-top" onClick={onScrollToTop}>
          Back to Top
        </button>
      )}
      {error && <div data-testid="error-message">Error: {error}</div>}
      {error && (
        <button data-testid="retry-button" onClick={onRetryError}>
          Retry
        </button>
      )}
      {isModalOpen && <div data-testid="modal">Modal Open</div>}
      {children}
    </div>
  ),
}));

describe("Patients Page", () => {
  const mockPatients = [
    {
      id: "1",
      name: "John Doe",
      description: "Test patient",
      website: "https://example.com",
      avatar: "https://example.com/avatar.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      description: "Another test patient",
      website: "https://jane.com",
      avatar: "https://jane.com/avatar.jpg",
      createdAt: "2024-01-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Set default mocks
    mockUseInfinitePatientsQuery.mockReturnValue({
      patients: mockPatients,
      currentPage: 1,
      hasMore: true,
      isLoading: false,
      error: null,
      loadMore: vi.fn(),
      reset: vi.fn(),
    });

    mockUsePatientHandlers.mockReturnValue({
      favorites: new Set(["1"]),
      isModalOpen: false,
      editingPatient: null,
      handleToggleFavorite: vi.fn(),
      handleAddPatient: vi.fn(),
      handleEditPatient: vi.fn(),
      handleSavePatient: vi.fn(),
      closeModal: vi.fn(),
    });

    mockUseScrollToTop.mockReturnValue({
      showBackToTop: false,
      scrollToTop: vi.fn(),
    });
  });

  it("should render the patients page correctly", () => {
    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );

    expect(screen.getByTestId("patient-page-layout")).toBeInTheDocument();
    expect(screen.getByTestId("page-title")).toHaveTextContent("All Patients");
    expect(screen.getByTestId("page-subtitle")).toHaveTextContent(
      "Manage and track information for all patients"
    );
    expect(screen.getByTestId("add-button")).toBeInTheDocument();
    expect(screen.getByTestId("favorites-button")).toBeInTheDocument();
  });

  it("should show the list of patients", () => {
    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );

    expect(screen.getByTestId("patient-list")).toBeInTheDocument();
    expect(screen.getByTestId("patient-count")).toHaveTextContent("2");
    expect(screen.getByTestId("loading-state")).toHaveTextContent(
      "Not Loading"
    );
    expect(screen.getByTestId("error-state")).toHaveTextContent("No Error");
    expect(screen.getByTestId("has-more")).toHaveTextContent("Has More");
  });

  it("should show loading state", () => {
    mockUseInfinitePatientsQuery.mockReturnValue({
      patients: [],
      currentPage: 1,
      hasMore: true,
      isLoading: true,
      error: null,
      loadMore: vi.fn(),
      reset: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );

    expect(screen.getByTestId("loading-state")).toHaveTextContent("Loading");
  });

  it("should show error when there is a problem", () => {
    mockUseInfinitePatientsQuery.mockReturnValue({
      patients: [],
      currentPage: 1,
      hasMore: false,
      isLoading: false,
      error: "Failed to load patients",
      loadMore: vi.fn(),
      reset: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Error: Failed to load patients"
    );
    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
  });

  it("should show back to top button when needed", () => {
    mockUseScrollToTop.mockReturnValue({
      showBackToTop: true,
      scrollToTop: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );

    expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
  });

  it("should show modal when it is open", () => {
    mockUsePatientHandlers.mockReturnValue({
      favorites: new Set(),
      isModalOpen: true,
      editingPatient: mockPatients[0],
      handleToggleFavorite: vi.fn(),
      handleAddPatient: vi.fn(),
      handleEditPatient: vi.fn(),
      handleSavePatient: vi.fn(),
      closeModal: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should pass the correct props to PatientList", () => {
    const mockLoadMore = vi.fn();
    mockUseInfinitePatientsQuery.mockReturnValue({
      patients: mockPatients,
      currentPage: 1,
      hasMore: true,
      isLoading: false,
      error: null,
      loadMore: mockLoadMore,
      reset: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );

    expect(screen.getByTestId("load-more-btn")).toBeInTheDocument();
    expect(screen.getByTestId("empty-message")).toHaveTextContent(
      "No patients registered yet"
    );
  });
});
