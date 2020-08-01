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

/**
 * Type for tokens produced by the lexer.
 */
export default class Token implements Source {
	/**
	 * The column the Token begins at.
	 */
	readonly column: number

	/**
	 * The line the Token begins at.
	 */
	readonly line: number

	/**
	 * The position in the file the Token begins at.
	 */
	readonly position: number

	/**
	 *	The name of the file the Token comes from.
	 */
	readonly file: string

	/**
	 * The text the Token consists of.
	 */
	readonly content: string

	/**
	 * Stores the tags that currently apply to the token.
	 */
	private readonly t = new Set<string>()

	/**
	 * Constructs a Token.
	 * @param s The source information for the Token.
	 * @param x The content of the Token.
	 * @param t The initial tags for the Token.
	 */
	public constructor(s: Source, x: string, t: string[]) {
		this.column = s.column
		this.line = s.line
		this.position = s.position
		this.file = s.file
		this.content = x
		for (const value of t) {
			this.t.add(value)
		}
	}

	/**
	 * Checks if the Token has a specific tag.
	 * @param tag The tag to check for.
	 * @returns this
	 */
	public has(tag: string): boolean {
		return this.t.has(tag)
	}

	/**
	 * Adds a tag to the Token.
	 * @param tag The tag to add.
	 * @returns this
	 */
	public add(tag: string): Token {
		this.t.add(tag)
		return this
	}

	/**
	 * Removes a tag from the Token.
	 * @param tag The tag to remove.
	 * @returns this
	 */
	public delete(tag: string): Token {
		this.t.delete(tag)
		return this
	}

	/**
	 * Removes all tags from the Token.
	 * @returns this
	 */
	public clear(): Token {
		this.t.clear()
		return this
	}
}
