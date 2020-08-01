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

import MatchInfo from './match_info'

/**
 * Represents a successful Token match.
 */
interface MatchToken extends MatchInfo {
	/**
	 * Used to differentiate from a failure.
	 * @see MatchResult
	 */
	readonly success: true

	/**
	 * Optional Token tags. If undefined no Token will be generate.
	 */
	readonly tags?: string[]
}

/**
 * Contains information about an error that caused a match to fail.
 * @see MatchFailure
 * @todo It would be good to have numeric error codes.
 */
interface MatchError {
	/**
	 * The offset from the initial match position to where the error occured.
	 */
	readonly offset: number

	/**
	 * The number of characters to highlight as the source of the error.
	 */
	readonly highlight: number

	/**
	 * The error message.
	 */
	readonly message: string
}

interface MatchFailure extends MatchInfo {
	/**
	 * Used to differentiate from a successful token match.
	 * @see MatchResult
	 */
	readonly success: false

	/**
	 * The errors responsible for the failure.
	 */
	readonly errors: MatchError[]
}

/**
 * Union of MatchToken and MatchFailure, identified by the success member.
 * @see MatchToken
 * @see MatchFailure
 */
export type MatchResult = MatchToken | MatchFailure

/**
 * Helper function to construct TokenMatch objects.
 * @param length The length of the match.
 * @param tags Optional Token tags.
 * @param multiline Optional indication that the match may include new lines.
 * Defaults to `false`.
 * @param tabs Optional indication that the match may include tabs.
 * Defaults to `false`.
 * @see MatchToken
 */
export function match_found({
	length,
	tags,
	multiline,
	tabs,
}: {
	length: number
	tags?: string[]
	multiline?: boolean
	tabs?: boolean
}): MatchToken {
	return {
		success: true,
		length,
		multiline: multiline == true,
		tabs: tabs == true,
		tags,
	}
}

/**
 * Helper function to construct TokenFailure objects.
 * @param length The length of the match.
 * @param offset The offset from the initial match position to where the error occured.
 * @param message The error message.
 * @param highlight Optional highlight length for the error. Defaults to `1`.
 * @param multiline Optional indication that the match may include new lines.
 * Defaults to `false`.
 * @param tabs Optional indication that the match may include tabs.
 * Defaults to `false`.
 * @see MatchFailure
 */
export function match_fail({
	length,
	offset,
	message,
	highlight,
	multiline,
	tabs,
}: {
	length: number
	offset: number
	message: string
	highlight?: number
	multiline?: boolean
	tabs?: boolean
}): MatchFailure {
	return {
		success: false,
		length: length,
		multiline: multiline == true,
		tabs: tabs == true,
		errors: [{ offset, message, highlight: highlight || 0 }],
	}
}

/**
 * The MatchResult for a generic failure.
 */
export const no_match: MatchResult = {
	success: false,
	length: 0,
	multiline: false,
	tabs: false,
	errors: [],
}

/**
 * Interface for a Matcher.
 */
export interface Matcher {
	/**
	 * The ID of the Matcher.
	 * @todo Currently is not used.
	 * The plan is to filter Matches by ID at some point.
	 */
	readonly id: string

	/**
	 * The function that checks for a match.
	 * @param text The text to check for a match from the start of.
	 */
	match(text: string): MatchResult
}
