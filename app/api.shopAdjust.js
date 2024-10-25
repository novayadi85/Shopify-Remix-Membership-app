import { shopAdjust } from "../../shopify.server";  // Keep the server-only shopAdjust logic here
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const { shop, method, params } = await request.json(); // Fetch the request data

  try {
    // Use your reusable server-side shopAdjust logic here
    const data = await shopAdjust(shop, method, params);
    return json(data);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
