/*
ISC License (ISC)

Copyright 2020 James Adam Armstrong

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above copyright
notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*/

import Source from './source'
import MatchInfo from './match_info'

/**
 * Tracks the state of the tokinization process.
 */
export default class State implements Source {
	/**
	 * The line number for the next potential Token.
	 */
	private l = 1

	/**
	 * The column number for the next potential Token.
	 */
	private c = 1

	/**
	 * Calculates the new column number.
	 * @param x The text to calculate the update value from.
	 * @param c The initial column number.
	 * @returns The new column number.
	 */
	private readonly u: (x: string, c: number) => number

	/**
	 * The name of the file being tokenized.
	 */
	readonly file: string

	/**
	 * The consumed prefix of data.
	 */
	private offset = 0

	/**
	 * The remanining data to tokenize.
	 */
	private data: string

	/**
	 * Constructs a Lexer State.
	 * @param f The name of the file being tokenized.
	 * @param t The width in columns to count tabs as.
	 * @param x The data to tokenize.
	 */
	public constructor(f: string, t: number, x: string) {
		this.file = f
		if (t > 2) {
			const tab_size = t - 1
			this.u = (x: string, c: number): number => {
				const tabs = x.match(/\t/g)
				return c + x.length + (tabs ? tabs.length * tab_size : 0)
			}
		} else if (t == 2) {
			this.u = (x: string, c: number): number => {
				const tabs = x.match(/\t/g)
				return c + x.length + (tabs ? tabs.length : 0)
			}
		} else {
			this.u = (x: string, c: number): number => {
				return x.length + c
			}
		}
		this.data = x
	}

	/**
	 * Gets the line number the current token begins on.
	 */
	get line(): number {
		return this.l
	}

	/**
	 * Gets the column number the current token begins on.
	 */
	get column(): number {
		return this.c
	}

	/**
	 * Consumes the current token and updates the line and column number.
	 */
	consume({ length, multiline, tabs }: MatchInfo): void {
		const head = this.data.slice(this.offset, length)
		if (multiline) {
			const lines = head.split(/(\n\r)|(\r\n)|[\n\r]/)
			const n = lines.length - 1
			this.l += n
			this.c = tabs ? this.u(lines[n], 1) : lines[n].length
		} else if (tabs) {
			this.c = this.u(head, this.c)
		} else {
			this.c += length
		}
		this.offset += length
	}

	/**
	 * Gets the data that has not been consumed.
	 */
	get tail(): string {
		return this.data.slice(this.offset)
	}

	/**
	 * Gets the total number of characters that have been consumed.
	 */
	get position(): number {
		return this.offset
	}

	/**
	 * Checks if the End of Input (EoI) has been reached.
	 */
	get eoi(): boolean {
		return this.offset == this.data.length
	}
}
