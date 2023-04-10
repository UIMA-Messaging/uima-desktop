import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export function encrypt(plaintext: string, key: string): string {
    const cipher = createCipheriv('aes-256-cbc', key, randomBytes(32))
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex')
    return (ciphertext += cipher.final('hex'))
}

export function decrypt(ciphertext: string, key: string): string {
    const decipher = createDecipheriv('aes-256-cbc', key, randomBytes(32))
    let plaintext = decipher.update(ciphertext, 'hex', 'utf8')
    return (plaintext += decipher.final('utf8'))
}

export function kdf(input: any): string {
    return createHash('sha256').update(input).digest('hex')
}
