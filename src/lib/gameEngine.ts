type Move = {
	row: number;
	col: number;
	symbol: 'X' | 'O';
};

export function buildBoard(moves: Move[], size: number): (string | null)[][] {
	const board = Array.from({ length: size }, () => Array(size).fill(null));

	for (const move of moves) {
		board[move.row][move.col] = move.symbol;
	}

	return board;
}

export function checkWinner(board: (string | null)[][], winLength = board.length): string | null {
	const n = board.length;

	const lines: (string | null)[][] = [];

	// rows & cols
	for (let i = 0; i < n; i++) {
		lines.push(board[i]);
		lines.push(board.map((r) => r[i]));
	}

	// diagonals
	lines.push(board.map((r, i) => r[i]));
	lines.push(board.map((r, i) => r[n - 1 - i]));

	for (const line of lines) {
		const first = line[0];
		if (first && line.every((cell) => cell === first)) {
			return first;
		}
	}

	return null;
}

export function isBoardFull(board: (string | null)[][]) {
	return board.every((row) => row.every((cell) => cell !== null));
}
