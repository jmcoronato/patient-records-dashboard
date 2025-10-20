import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../Input";

describe("Input", () => {
  it("debería renderizar correctamente", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("debería aceptar un valor", () => {
    render(<Input value="test value" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("test value");
  });

  it("debería ejecutar onChange cuando el usuario escribe", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "hello");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(5); // Una vez por cada letra
  });

  it("debería aplicar placeholder", () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("debería soportar diferentes tipos", () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");

    rerender(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

    rerender(<Input type="password" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it("debería estar deshabilitado cuando disabled es true", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("debería aplicar className personalizado", () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole("textbox").className).toContain("custom-input");
  });

  it("debería soportar ref", () => {
    const ref = { current: null };
    render(<Input ref={ref as any} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("debería aplicar estilos base", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("flex");
    expect(input.className).toContain("h-10");
    expect(input.className).toContain("w-full");
  });

  it("debería manejar atributos HTML estándar", () => {
    render(<Input name="username" id="user-input" required />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveAttribute("id", "user-input");
    expect(input).toBeRequired();
  });

  it("debería actualizar el valor controlado", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState("");
      return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
    };

    const React = await import("react");
    render(<TestComponent />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(input).toHaveValue("test");
  });
});
