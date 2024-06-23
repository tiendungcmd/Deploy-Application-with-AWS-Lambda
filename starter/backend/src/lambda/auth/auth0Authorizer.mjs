import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import pkg from 'jsonwebtoken'
const { verify, decode } = pkg;
const logger = createLogger('auth')

const jwksUrl = 'https://dev-xmi8k76teej7yptk.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = decode(token, {complete: true });
  const jwtKid = jwt.header.kid;
  let cert;
  try{
    const jwks = await Axios.get(jwksUrl);
    const signingKey = jwks.data.keys.filter(k => k.kid === jwtKid)[0];

    if (!signingKey) {
      throw new Error(`Key not matches ' ${jwtKid}'`);
    }
    cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJeuTitXYfY5BQMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi14bWk4azc2dGVlajd5cHRrLnVzLmF1dGgwLmNvbTAeFw0yNDA2MjIwMzE3MDRaFw0zODAzMDEwMzE3MDRaMCwxKjAoBgNVBAMTIWRldi14bWk4azc2dGVlajd5cHRrLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJbcOBgX+IE8H1SGal2PDhynQwvq9FzYhBzDZ2PpVGcyfQQ0M3+2z5jKJ9nJ77V2PMPAFtkeaH//5/uKkE/yB1OfjRuxK/5Aompls+2vXs28wh7+wA+wXDbNODa4BtSc2/M0Js+bwJLy6mK5vfXBe5t+BZL8/0IUWdl7rPG7fFDEE1IYQDxz99caiPVpr5xaN2yOdDvjlk3xlDTLzYxiuaakO/LaYEP0tuyaZmWrXUij5pN7UqKXyRoY04wYMDFefdj9R3EwgiOaRjfCh46DgnVjnMQ/lmOArckkOR6PKeJrQNsetCDfkUNS3vh+XpXYaeu/qCMrG0gEHR1eJMzREm0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU9kF8FfNAtMwgTn/Zvngh7CEcvxwwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQBlcrTIyZomAvxZiYuAkzfkRwMuMN/86jtL8CpvO2xlFT3WMjIcWaU3L2C97A5j4fmPrEfYg1rvfm6YQrufW+7YW5CXJWLXmN0TkcANZcJqU4al7tfkM2FcycXFjkqb04Fr0ZNGSwLOI6Uvvz4SFUIAfi/BeCtZYa1QrqZFxDUffiT4VDWOrem7hGUhaW7/QEw+AXIf9IidiykObkQmXwAPoHXKQRrbdXpK/+xtOoxPKgJT77L7ZZqUNyAvSLWLR+zmYwLfLvFPMMW0o9Hhqn+QNSReURZTOX/I25hcwvwsFPWnY1NvgvlbP2v0xJ3tfk1Rw0gM8J98AJLk7gyPomKk
-----END CERTIFICATE-----`;
  } catch(error) {
    console.log('Getting certificate  fail: ' , error);
  }

   return verify(token, cert, { algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
