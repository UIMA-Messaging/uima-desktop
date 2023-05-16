import ColorHash from 'color-hash'

const colorHash = new ColorHash()

export function wordToHexColor(word: string): string {
	return word && colorHash.hex(word)
}
