import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;


// Define the shopAdjust function
export const shopAdjust = async (shop, method, params) => {
  try {
    // Load session for the shop to get the access token
    const session = await sessionStorage.loadSession(shop);
    console.warn('session', session)
    if (!session || !session.accessToken) {
      throw new Error('No session or token found for this shop');
    }

    const token = session.accessToken;
    const apiBaseUrl = process.env.API_BASE_URL;

    // Build the request URL and options
    const url = `${apiBaseUrl}/api/${shop}`;
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: method !== 'GET' ? JSON.stringify(params) : null,
    };

    // Make the API request
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    console.error('Error in shopAdjust API call:', error);
    throw error;
  }
};
