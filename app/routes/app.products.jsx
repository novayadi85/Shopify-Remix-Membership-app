import {
	Box,
	Layout,
	Page,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import ResourceItemExample from "../components/ProductsTable";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const EXTERNAL_API = process.env.SHOPAPP_API

export const loader = async ({ request }) => {
  /// const { session } = await authenticate.admin(request);

  try {
    const response = await fetch(`${EXTERNAL_API}/test.php`,  {
      method: 'POST',  // Adjust based on your API needs
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: "https://another-test-store-again.myshopify.com", method: "POST", params : {}}),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return json(data);

  } catch (error) {
    console.error("Error in shopAdjustClient:", error);
    throw error;
  }

}

export default function ProductsPage() {
  const products = useLoaderData();
  console.log('products', products)
  return (
    <Page>
      <TitleBar title="Products page" />
      <Layout>
        <Layout.Section>
        {products.error && <Box color="red">{products.error}</Box>} {/* Display error message if exists */}
          {products.items ? ( // Check if items exist
            <ResourceItemExample items={products.items} /> // Use data from loader
          ) : (
            <Box>Loading...</Box> // Optional: Loading state
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
