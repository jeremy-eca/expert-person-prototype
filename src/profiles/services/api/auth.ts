// HMAC-SHA256 Authentication for Expert Persons API
// Matches the Postman pre-request script logic exactly

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

export interface AuthHeaders {
  'x-client-id': string;
  'x-signature': string;
  'x-timestamp': string;
  'x-tenant-id': string;
}

export class BrowserHMACAuth {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async generateAuthHeaders(
    method: string,
    path: string,
    body?: any
  ): Promise<AuthHeaders> {
    const timestamp = Date.now().toString();
    const signature = await this.generateSignature(method, path, timestamp, body);

    return {
      'x-client-id': this.config.clientId,
      'x-signature': signature,
      'x-timestamp': timestamp,
      'x-tenant-id': this.config.tenantId,
    };
  }

  private async generateSignature(
    method: string,
    path: string,
    timestamp: string,
    body?: any
  ): Promise<string> {
    let stringToSign: string;
    const lowerMethod = method.toLowerCase();

    if (['post', 'put', 'patch', 'delete'].includes(lowerMethod) && body) {
      // For POST/PUT/PATCH/DELETE with body: use body + timestamp
      const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
      stringToSign = bodyString + timestamp;
      console.log('HMAC check via body');
    } else {
      // For GET or requests without body: use path + timestamp
      // CRITICAL: Server strips /api prefix
      let processedPath = path;
      if (processedPath.startsWith('/api/')) {
        processedPath = processedPath.substring(4); // Remove '/api' prefix
      }
      stringToSign = processedPath.toLowerCase() + timestamp;
      console.log('HMAC check via path (server strips /api):', processedPath);
    }

    console.log('String to sign:', stringToSign);

    // Use Web Crypto API for browser
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.config.clientSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(stringToSign)
    );

    // Convert to Base64 (matching Postman script)
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    console.log('Generated signature:', base64Signature);
    console.log('HMAC headers:', {
      'x-client-id': this.config.clientId,
      'x-timestamp': timestamp,
      'x-tenant-id': this.config.tenantId,
      'method': method,
      'stringToSign': stringToSign
    });

    return base64Signature;
  }
}

// For Node.js environments (if needed for testing)
export class NodeHMACAuth {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  generateAuthHeaders(
    method: string,
    path: string,
    body?: any
  ): AuthHeaders {
    const timestamp = Date.now().toString();
    const signature = this.generateSignature(method, path, timestamp, body);

    return {
      'x-client-id': this.config.clientId,
      'x-signature': signature,
      'x-timestamp': timestamp,
      'x-tenant-id': this.config.tenantId,
    };
  }

  private generateSignature(
    method: string,
    path: string,
    timestamp: string,
    body?: any
  ): string {
    const crypto = require('crypto');
    let stringToSign: string;
    const lowerMethod = method.toLowerCase();

    if (['post', 'put', 'patch', 'delete'].includes(lowerMethod) && body) {
      // For POST/PUT/PATCH/DELETE with body: use body + timestamp
      const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
      stringToSign = bodyString + timestamp;
    } else {
      // For GET or requests without body: use path + timestamp
      // CRITICAL: Server strips /api prefix
      let processedPath = path;
      if (processedPath.startsWith('/api/')) {
        processedPath = processedPath.substring(4); // Remove '/api' prefix
      }
      stringToSign = processedPath.toLowerCase() + timestamp;
    }

    // Generate HMAC-SHA256 signature in Base64
    const hmac = crypto.createHmac('sha256', this.config.clientSecret);
    hmac.update(stringToSign);
    return hmac.digest('base64');
  }
}