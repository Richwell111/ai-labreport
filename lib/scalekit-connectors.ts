import { ScalekitClient } from "@scalekit-sdk/node";

const ENV_URL =
  process.env.SCALEKIT_ENVIRONMENT_URL ||
  process.env.SCALEKIT_ENV_URL ||
  "https://richwell.scalekit.dev";

const CLIENT_ID = process.env.SCALEKIT_CLIENT_ID;
const CLIENT_SECRET = process.env.SCALEKIT_CLIENT_SECRET;

// Singleton client
let client: ScalekitClient | null = null;

function getClient(): ScalekitClient {
  if (!client) {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error("ScaleKit credentials not configured");
    }
    client = new ScalekitClient(ENV_URL!, CLIENT_ID!, CLIENT_SECRET!);
  }
  return client;
}

/**
 * Get authorization URL for a connector
 */
export function getConnectorAuthUrl(options: {
  connectionId: string;
  redirectUri: string;
  userId?: string;
  state?: string;
}): string {
  const sc = getClient();
  return sc.getAuthorizationUrl(options.redirectUri, {
    connectionId: options.connectionId,
    ...(options.userId && { loginHint: options.userId }),
    ...(options.state && { state: options.state }),
  });
}

/**
 * Handle connector OAuth callback
 */
type AuthUser = {
  id?: string;
  userId?: string;
  email: string;
  name: string;
};

type AuthResult = {
  user: AuthUser;
  organizationId?: string;
  organization_id?: string;
};

export async function handleConnectorCallback(
  code: string,
  redirectUri: string
): Promise<{ user: { id: string; email: string; name: string }; organizationId?: string }> {
  const sc = getClient();
  const result = (await sc.authenticateWithCode(code, redirectUri)) as AuthResult;

  return {
    user: {
      id: result.user.id || result.user.userId || "",
      email: result.user.email,
      name: result.user.name,
    },
    organizationId:
      result.organizationId || result.organization_id,
  };
}

/**
 * Common connector IDs
 */
export const CONNECTOR_IDS = {
  GMAIL: process.env.SCALEKIT_GMAIL_CONNECTION_ID || "gmail",
  SLACK: process.env.SCALEKIT_SLACK_CONNECTION_ID || "slack",
} as const;
