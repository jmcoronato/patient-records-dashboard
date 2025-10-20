import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  it("debería renderizar correctamente", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("debería ejecutar onClick cuando se hace click", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText("Click me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debería aplicar variant default por defecto", () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-primary");
  });

  it("debería aplicar variant outline", () => {
    render(<Button variant="outline">Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border");
  });

  it("debería aplicar variant ghost", () => {
    render(<Button variant="ghost">Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("hover:bg-accent");
  });

  it("debería aplicar size default por defecto", () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-10");
  });

  it("debería aplicar size sm", () => {
    render(<Button size="sm">Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-8");
  });

  it("debería aplicar size lg", () => {
    render(<Button size="lg">Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-11");
  });

  it("debería estar deshabilitado cuando disabled es true", () => {
    render(<Button disabled>Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("no debería ejecutar onClick cuando está deshabilitado", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Button
      </Button>
    );

    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("debería aceptar className personalizado", () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  it("debería aplicar type submit", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("debería soportar ref", () => {
    const ref = { current: null };
    render(<Button ref={ref as any}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("debería combinar todas las variantes y tamaños", () => {
    const { rerender } = render(
      <Button variant="default" size="default">
        Button
      </Button>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <Button variant="outline" size="sm">
        Button
      </Button>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <Button variant="ghost" size="lg">
        Button
      </Button>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
