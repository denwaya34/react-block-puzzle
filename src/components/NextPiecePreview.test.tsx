import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NextPiecePreview } from "./NextPiecePreview";
import { TETRIMINOS } from "@/types/tetrimino";

describe("NextPiecePreview", () => {
  it("should render preview container", () => {
    const { container } = render(<NextPiecePreview nextTetrimino={null} />);

    const previewContainer = container.querySelector(".nextPiecePreview");
    expect(previewContainer).toBeTruthy();
  });

  it("should display empty state when no next piece", () => {
    const { container } = render(<NextPiecePreview nextTetrimino={null} />);

    const cells = container.querySelectorAll(".cell");
    cells.forEach((cell) => {
      expect(cell.classList.contains("empty")).toBe(true);
    });
  });

  it("should display I tetrimino correctly", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.I} />,
    );

    const filledCells = container.querySelectorAll(".cell.filled");
    expect(filledCells.length).toBe(4); // I piece has 4 blocks

    // Check color
    filledCells.forEach((cell) => {
      expect(cell.getAttribute("style")).toContain("rgb(0, 240, 240)");
    });
  });

  it("should display O tetrimino correctly", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.O} />,
    );

    const filledCells = container.querySelectorAll(".cell.filled");
    expect(filledCells.length).toBe(4); // O piece has 4 blocks
  });

  it("should display T tetrimino correctly", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.T} />,
    );

    const filledCells = container.querySelectorAll(".cell.filled");
    expect(filledCells.length).toBe(4); // T piece has 4 blocks
  });

  it("should display S tetrimino correctly", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.S} />,
    );

    const filledCells = container.querySelectorAll(".cell.filled");
    expect(filledCells.length).toBe(4); // S piece has 4 blocks
  });

  it("should display Z tetrimino correctly", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.Z} />,
    );

    const filledCells = container.querySelectorAll(".cell.filled");
    expect(filledCells.length).toBe(4); // Z piece has 4 blocks
  });

  it("should display J tetrimino correctly", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.J} />,
    );

    const filledCells = container.querySelectorAll(".cell.filled");
    expect(filledCells.length).toBe(4); // J piece has 4 blocks
  });

  it("should display L tetrimino correctly", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.L} />,
    );

    const filledCells = container.querySelectorAll(".cell.filled");
    expect(filledCells.length).toBe(4); // L piece has 4 blocks
  });

  it("should use a 4x4 grid for preview", () => {
    const { container } = render(<NextPiecePreview nextTetrimino={null} />);

    const rows = container.querySelectorAll(".row");
    expect(rows.length).toBe(4);

    rows.forEach((row) => {
      const cells = row.querySelectorAll(".cell");
      expect(cells.length).toBe(4);
    });
  });

  it("should center tetriminos in preview grid", () => {
    const { container } = render(
      <NextPiecePreview nextTetrimino={TETRIMINOS.I} />,
    );

    // I piece should be centered in the 4x4 grid
    const rows = container.querySelectorAll(".row");
    const row1 = rows[1]; // I piece is on second row when horizontal
    const cells = row1.querySelectorAll(".cell.filled");
    expect(cells.length).toBe(4);
  });
});
