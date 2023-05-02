import { createHash, createCipher, createDecipher } from 'crypto'

export function encrypt(plaintext: string, key: string): string {
	const cipher = createCipher('aes-256-cbc', key)
	let ciphertext = cipher.update(plaintext, 'utf8', 'hex')
	return (ciphertext += cipher.final('hex'))
}

export function decrypt(ciphertext: string, key: string): string {
	const decipher = createDecipher('aes-256-cbc', key)
	let plaintext = decipher.update(ciphertext, 'hex', 'utf8')
	return (plaintext += decipher.final('utf8'))
}

export function kdf(input: any): string {
	return createHash('sha256').update(input).digest('hex')
}

export function secretToReadable(sharedSecret: string) {
	return createHash('sha256')
		.update(sharedSecret)
		.digest('hex')
		.match(/.{1,4}/g)
		.map((h) => parseInt(h, 16))
		.map((n) => String(n).padStart(5, '0'))
}
