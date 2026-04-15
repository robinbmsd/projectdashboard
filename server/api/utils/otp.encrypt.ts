import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string
const IV_LENGTH = 16

export function encrypt(text: string) {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
        throw new Error ('ENCRYPTION_KEY in .env is empty or not 32 characters!')
    }

    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}