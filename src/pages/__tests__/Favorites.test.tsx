import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Favorites from "../Favorites";
import { UsePatientHandlersProps } from "@/hooks/use-patient-handlers";
import { PatientListProps } from "@/components/PatientList";
import { EmptyStateProps } from "@/components/EmptyState";
import { PatientPageLayoutProps } from "@/components/layouts/PatientPageLayout";

// Mock the hooks
const mockUseFavoritePatients = vi.fn();
const mockUsePatientHandlers = vi.fn();
const mockUseScrollToTop = vi.fn();

vi.mock("@/hooks/use-favorite-patients", () => ({
  useFavoritePatients: () => mockUseFavoritePatients(),
}));

vi.mock("@/hooks/use-patient-handlers", () => ({
  usePatientHandlers: (props: UsePatientHandlersProps) =>
    mockUsePatientHandlers(props),
}));

vi.mock("@/hooks/use-scroll-to-top", () => ({
  useScrollToTop: () => mockUseScrollToTop(),
}));

// Mock the components
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
      <div data-testid="has-more">{state.hasMore ? "Has More" : "No More"}</div>
      <div data-testid="empty-message">{emptyMessage}</div>
      <button onClick={onLoadMore} data-testid="load-more-btn">
        Load More
      </button>
    </div>
  ),
}));

vi.mock("@/components/EmptyState", () => ({
  EmptyState: ({
    icon: Icon,
    title,
    description,
    iconClassName,
  }: EmptyStateProps) => (
    <div data-testid="empty-state">
      <div data-testid="empty-icon" className={iconClassName}>
        <Icon />
      </div>
      <div data-testid="empty-title">{title}</div>
      <div data-testid="empty-description">{description}</div>
    </div>
  ),
}));

vi.mock("@/components/layouts/PatientPageLayout", () => ({
  PatientPageLayout: ({
    title,
    subtitle,
    showAddButton,
    showBackButton,
    onAddPatient,
    isModalOpen,
    onModalClose,
    onModalSave,
    editingPatient,
    showBackToTop,
    onScrollToTop,
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
      {showBackButton && <button data-testid="back-button">Back</button>}
      {showBackToTop && (
        <button data-testid="back-to-top" onClick={onScrollToTop}>
          Back to Top
        </button>
      )}
      {isModalOpen && <div data-testid="modal">Modal Open</div>}
      {children}
    </div>
  ),
}));

describe("Favorites Page", () => {
  const mockFavoritePatients = [
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
    mockUseFavoritePatients.mockReturnValue({
      patients: mockFavoritePatients,
      isLoading: false,
      updatePatientInList: vi.fn(),
      refreshFavorites: vi.fn(),
      removeFavorite: vi.fn(),
    });

    mockUsePatientHandlers.mockReturnValue({
      favorites: new Set(["1", "2"]),
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

  it("should render the favorites page correctly", () => {
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByTestId("patient-page-layout")).toBeInTheDocument();
    expect(screen.getByTestId("page-title")).toHaveTextContent(
      "Favorite Patients"
    );
    expect(screen.getByTestId("page-subtitle")).toHaveTextContent(
      "Quick access to your patients marked as favorites"
    );
    expect(screen.getByTestId("add-button")).toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("should show the list of favorite patients", () => {
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByTestId("patient-list")).toBeInTheDocument();
    expect(screen.getByTestId("patient-count")).toHaveTextContent("2");
    expect(screen.getByTestId("loading-state")).toHaveTextContent(
      "Not Loading"
    );
    expect(screen.getByTestId("has-more")).toHaveTextContent("No More");
  });

  it("should show loading state", () => {
    mockUseFavoritePatients.mockReturnValue({
      patients: [],
      isLoading: true,
      updatePatientInList: vi.fn(),
      refreshFavorites: vi.fn(),
      removeFavorite: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByTestId("patient-list")).toBeInTheDocument();
    expect(screen.getByTestId("loading-state")).toHaveTextContent("Loading");
  });

  it("should show empty state when there are no favorites", () => {
    mockUseFavoritePatients.mockReturnValue({
      patients: [],
      isLoading: false,
      updatePatientInList: vi.fn(),
      refreshFavorites: vi.fn(),
      removeFavorite: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "No favorite patients yet"
    );
    expect(screen.getByTestId("empty-description")).toHaveTextContent(
      "Click the star icon on any patient card to add it to favorites"
    );
    expect(screen.getByTestId("empty-icon")).toHaveClass("text-red-500");
  });

  it("should show back to top button when needed", () => {
    mockUseScrollToTop.mockReturnValue({
      showBackToTop: true,
      scrollToTop: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
  });

  it("should show modal when it is open", () => {
    mockUsePatientHandlers.mockReturnValue({
      favorites: new Set(),
      isModalOpen: true,
      editingPatient: mockFavoritePatients[0],
      handleToggleFavorite: vi.fn(),
      handleAddPatient: vi.fn(),
      handleEditPatient: vi.fn(),
      handleSavePatient: vi.fn(),
      closeModal: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should pass the correct props to PatientList", () => {
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByTestId("load-more-btn")).toBeInTheDocument();
    expect(screen.getByTestId("empty-message")).toHaveTextContent(
      "No favorite patients yet"
    );
  });

  it("should call the hooks with the correct parameters", () => {
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(mockUsePatientHandlers).toHaveBeenCalledWith({
      patients: mockFavoritePatients,
      onPatientUpdate: expect.any(Function),
      onPatientAdd: expect.any(Function),
      onFavoriteRemove: expect.any(Function),
    });
  });
});
