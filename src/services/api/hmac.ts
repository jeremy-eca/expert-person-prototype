// HMAC-SHA256 Signature Generation
// Matches the exact Postman script implementation

import CryptoJS from 'crypto-js';

export interface HMACConfig {
  clientId: string;
  secretKey: string;
  tenantId: string;
}

export interface HMACHeaders {
  'x-client-id': string;
  'x-signature': string;
  'x-timestamp': string;
  'x-tenant-id': string;
  'Content-Type': string;
}

export class HMACService {
  private config: HMACConfig;

  constructor(config: HMACConfig) {
    this.config = config;
  }

  /**
   * Generates HMAC headers matching the Postman script exactly
   */
  generateHeaders(method: string, url: string, body?: any): HMACHeaders {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    

    if (!this.config.clientId || !this.config.secretKey) {
      console.error('Missing clientId or secretKey in environment variables');
      throw new Error('Missing authentication credentials');
    }

    const lowerMethod = method.toLowerCase();
    let stringToSign: string;

    if (['post', 'put', 'patch', 'delete'].includes(lowerMethod) && body) {
      // For methods with body
      let bodyString: string;
      if (typeof body === 'string') {
        try {
          // Try to parse and re-stringify to ensure consistent formatting
          const bodyObj = JSON.parse(body);
          bodyString = JSON.stringify(bodyObj);
        } catch (e) {
          bodyString = body;
        }
      } else {
        bodyString = JSON.stringify(body);
      }
      stringToSign = bodyString + timestamp;
    } else {
      // For GET requests - extract path from URL
      const urlObj = new URL(url);
      let path = urlObj.pathname;
      
      // CRITICAL: Server strips /api prefix
      if (path.startsWith('/api/')) {
        path = path.substring(4); // Remove '/api' prefix
      }
      
      // IMPORTANT: Do NOT include query parameters in the signature
      // This matches the Postman script behavior
      
      stringToSign = path.toLowerCase() + timestamp;
    }

    // Generate HMAC-SHA256 signature in Base64 (matching Postman)
    const signature = CryptoJS.HmacSHA256(stringToSign, this.config.secretKey).toString(CryptoJS.enc.Base64);

    const headers: HMACHeaders = {
      'x-client-id': this.config.clientId,
      'x-signature': signature,
      'x-timestamp': timestamp,
      'x-tenant-id': this.config.tenantId,
      'Content-Type': 'application/json'
    };

    return headers;
  }
}

// Singleton instance
let hmacService: HMACService | null = null;

export function initializeHMACService(config: HMACConfig): void {
  hmacService = new HMACService(config);
}

export function getHMACService(): HMACService {
  if (!hmacService) {
    throw new Error('HMAC service not initialized. Call initializeHMACService first.');
  }
  return hmacService;
}