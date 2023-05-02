import crypto from 'crypto'

// Générer une paire de clés RSA (privée et publique)
export function generateRSAKeyPair() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Taille de la clé en bits (2048 est recommandé pour une bonne sécurité)
  })

  return {
    privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
    publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
  }
}

function publicKeyEncrypt(data: Buffer, publicKey: string): string {
  const publicKeyBuffer = Buffer.from(publicKey, 'utf-8')
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKeyBuffer,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    data
  )

  return encryptedData.toString('base64')
}

// Générer une clé de chiffrement AES
export function generateAESKey() {
  const keySize = 32 // Taille de la clé en octets (32 octets pour AES-256)
  return crypto.randomBytes(keySize)
}

export type encryptData = {
  iv: string
  encryptedPassword: string
}

export function encryptPassword(password: string, aesKey: Buffer): encryptData {
  const algorithm = 'aes-256-cbc' // Utiliser AES-256 avec le mode CBC
  const ivLength = 16 // La taille d'un vecteur d'initialisation (IV) pour AES-256-CBC est de 16 octets
  const iv = crypto.randomBytes(ivLength) // Générer un IV aléatoire

  const cipher = crypto.createCipheriv(algorithm, aesKey, iv)
  let encrypted = cipher.update(password, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const encryptedData: encryptData = {
    iv: iv.toString('hex'),
    encryptedPassword: encrypted,
  }

  return encryptedData
}

export function decryptPassword(encryptedPasswordData: encryptData, aesKey: Buffer): string {
  const algorithm = 'aes-256-cbc'
  const iv = Buffer.from(encryptedPasswordData.iv, 'hex')

  const decipher = crypto.createDecipheriv(algorithm, aesKey, iv)
  let decrypted = decipher.update(encryptedPasswordData.encryptedPassword, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

// async function decryptPrivateKey(privateKeyBuffer: Buffer, derivedPassword: string): Promise<crypto.KeyObject> {
//   const privateKeyDecrypted = await crypto.webcrypto.subtle.decrypt(
//     {
//       name: 'RSA-OAEP',
//     },
//     derivedPassword,
//     privateKeyBuffer
//   )

//   return crypto.createPrivateKey({
//     key: privateKeyDecrypted,
//     format: 'der',
//     type: 'pkcs1',
//   })
// }
