import { Chess, Move, PieceSymbol } from "chess.js";

export type DifficultyLevel = "easy" | "medium" | "hard";

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-square positional tables (from White's perspective, flipped for Black)
const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_PST = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_PST = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_PST = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_PST = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

function getPositionalBonus(type: PieceSymbol, row: number, col: number, color: "w" | "b"): number {
  const r = color === "w" ? row : 7 - row;
  switch (type) {
    case "p":
      return PAWN_PST[r][col];
    case "n":
      return KNIGHT_PST[r][col];
    case "b":
      return BISHOP_PST[r][col];
    case "r":
      return ROOK_PST[r][col];
    case "q":
      return QUEEN_PST[r][col];
    case "k":
      return KING_PST[r][col];
  }
}

// Positive score favors Black ('b', the AI engine)
function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === "b" ? -99999 : 99999;
  }
  if (game.isDraw()) {
    return 0;
  }

  const board = game.board();
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] + getPositionalBonus(piece.type, r, c, piece.color);
      if (piece.color === "b") {
        score += value;
      } else {
        score -= value;
      }
    }
  }

  return score;
}

function orderMoves(moves: Move[]): Move[] {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += 10 * PIECE_VALUES[a.captured] - PIECE_VALUES[a.piece];
    if (a.promotion) scoreA += PIECE_VALUES[a.promotion];
    if (a.san.includes("+")) scoreA += 50;

    if (b.captured) scoreB += 10 * PIECE_VALUES[b.captured] - PIECE_VALUES[b.piece];
    if (b.promotion) scoreB += PIECE_VALUES[b.promotion];
    if (b.san.includes("+")) scoreB += 50;

    return scoreB - scoreA;
  });
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = orderMoves(game.moves({ verbose: true }));

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      if (evaluation > maxEval) maxEval = evaluation;
      if (evaluation > alpha) alpha = evaluation;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      if (evaluation < minEval) minEval = evaluation;
      if (evaluation < beta) beta = evaluation;
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

class RedoxChessEngine {
  private currentFen = "";
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private _isReady = false;

  get isReady() {
    return this._isReady;
  }

  async init(): Promise<void> {
    this._isReady = true;
    return Promise.resolve();
  }

  setPosition(fen: string) {
    this.currentFen = fen;
  }

  getBestMove(onMove: (move: string) => void, level: DifficultyLevel = "medium") {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    // Natural thinking delay (1.1s – 1.8s) so opponent moves don't feel instant
    const thinkingDelayMs = 1100 + Math.floor(Math.random() * 700);

    this.timerId = setTimeout(() => {
      try {
        const game = new Chess(this.currentFen);
        const legalMoves = orderMoves(game.moves({ verbose: true }));
        if (legalMoves.length === 0) return;

        if (level === "easy") {
          // Easy: 45% random move, 55% 1-ply greedy capture/positional move
          if (Math.random() < 0.45 && legalMoves.length > 1) {
            const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            onMove(`${randomMove.from}${randomMove.to}${randomMove.promotion || ""}`);
            return;
          }
          let bestMove = legalMoves[0];
          let bestScore = -Infinity;
          for (const move of legalMoves) {
            game.move(move);
            const score = evaluateBoard(game) + (Math.random() * 40 - 20);
            game.undo();
            if (score > bestScore) {
              bestScore = score;
              bestMove = move;
            }
          }
          onMove(`${bestMove.from}${bestMove.to}${bestMove.promotion || ""}`);
          return;
        }

        const searchDepth = level === "medium" ? 2 : 3;
        let bestMove = legalMoves[0];
        let bestValue = -Infinity;
        let alpha = -Infinity;
        const beta = Infinity;

        for (const move of legalMoves) {
          game.move(move);
          const value = minimax(game, searchDepth, alpha, beta, false);
          game.undo();

          // Slight tie-breaker jitter on Medium
          const jitter = level === "medium" ? Math.random() * 12 - 6 : 0;
          if (value + jitter > bestValue) {
            bestValue = value + jitter;
            bestMove = move;
          }
          if (value > alpha) {
            alpha = value;
          }
        }

        onMove(`${bestMove.from}${bestMove.to}${bestMove.promotion || ""}`);
      } catch (err) {
        console.error("Chess engine error:", err);
      }
    }, thinkingDelayMs);
  }

  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  quit() {
    this.stop();
    this._isReady = false;
  }
}

export default RedoxChessEngine;
