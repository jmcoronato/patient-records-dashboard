import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "../Avatar";

describe("Avatar", () => {
  it("debería renderizar el contenedor del avatar", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("debería aplicar className personalizado", () => {
    render(<Avatar data-testid="avatar" className="custom-avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar.className).toContain("custom-avatar");
  });

  it("debería aplicar estilos base", () => {
    render(<Avatar data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar.className).toContain("rounded-full");
    expect(avatar.className).toContain("h-10");
    expect(avatar.className).toContain("w-10");
  });
});

describe("AvatarImage", () => {
  it("debería renderizar la imagen con src", () => {
    render(
      <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("alt", "User avatar");
  });

  it("no debería renderizar si no hay src", () => {
    const { container } = render(<AvatarImage src="" alt="User avatar" />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("debería manejar error de carga de imagen", () => {
    const { container } = render(
      <AvatarImage src="invalid-url" alt="User avatar" />
    );
    const img = container.querySelector("img");

    if (img) {
      // Simular error de carga
      img.dispatchEvent(new Event("error"));
    }
  });

  it("debería aplicar className personalizado", () => {
    render(
      <AvatarImage
        src="https://example.com/avatar.jpg"
        alt="User avatar"
        className="custom-image"
      />
    );
    const img = screen.getByRole("img");
    expect(img.className).toContain("custom-image");
  });

  it("debería aplicar estilos de aspect-square", () => {
    render(
      <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
    );
    const img = screen.getByRole("img");
    expect(img.className).toContain("aspect-square");
    expect(img.className).toContain("object-cover");
  });
});

describe("AvatarFallback", () => {
  it("debería renderizar el contenido fallback", () => {
    render(<AvatarFallback>JD</AvatarFallback>);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("debería aplicar className personalizado", () => {
    render(<AvatarFallback className="custom-fallback">JD</AvatarFallback>);
    const fallback = screen.getByText("JD");
    expect(fallback.className).toContain("custom-fallback");
  });

  it("debería aplicar estilos base", () => {
    render(<AvatarFallback>JD</AvatarFallback>);
    const fallback = screen.getByText("JD");
    expect(fallback.className).toContain("rounded-full");
    expect(fallback.className).toContain("bg-muted");
    expect(fallback.className).toContain("h-full");
    expect(fallback.className).toContain("w-full");
  });
});

describe("Avatar composition", () => {
  it("debería funcionar con imagen y fallback juntos", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("debería mostrar solo fallback si no hay imagen", () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
