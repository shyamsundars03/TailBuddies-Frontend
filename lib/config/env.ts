
interface EnvConfig {
  apiUrl: string;
  googleClientId: string;
}

class EnvValidator {
  private config: Partial<EnvConfig> = {};
  private errors: string[] = [];

  constructor() {
    this.config = {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    };
  }

  validate(): EnvConfig {
    // Check existence
    Object.entries(this.config).forEach(([key, value]) => {
      if (!value) {
        this.errors.push(`Missing: NEXT_PUBLIC_${key.toUpperCase()}`);
      }
    });

    // Specific validations
    this.validateApiUrl();
    this.validateGoogleClientId();

    if (this.errors.length > 0) {
      throw new Error(
        'Environment validation failed:\n' + 
        this.errors.map(e => `  • ${e}`).join('\n')
      );
    }

    return this.config as EnvConfig;
  }

  private validateApiUrl() {
    const url = this.config.apiUrl;
    if (!url) return;

    try {
      new URL(url); // This will throw if invalid URL
    } catch {
      this.errors.push('NEXT_PUBLIC_API_URL must be a valid URL');
    }

    // Check if it ends with /api (common pattern)
    if (!url.endsWith('/api')) {
      this.errors.push('NEXT_PUBLIC_API_URL should end with /api');
    }
  }

  private validateGoogleClientId() {
    const id = this.config.googleClientId;
    if (!id) return;

    // Google Client IDs are typically long strings
    if (id.length < 20) {
      this.errors.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID seems too short');
    }

    // Check if it has common Google Client ID pattern
    if (!id.includes('.apps.googleusercontent.com') && id.length < 30) {
      this.errors.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID looks invalid');
    }
  }
}

export const env = new EnvValidator().validate();