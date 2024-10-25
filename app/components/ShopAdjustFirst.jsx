import { json } from "@remix-run/node";
import shopAdjust from '../services/shopadjust';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }) => {
  const shop = 'another-test-store-again.myshopify.com'; // Use actual shop value from request/session
  const method = 'GET'; // Example method
  const params = {}; // Parameters to send in the API call

  try {
    const data = await shopAdjust(shop, method, params);
    return json({ data });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function ShopAdjustFirst() {
  const loaderData = useLoaderData();

  // Check if data or error exists before destructuring
  const data = loaderData?.data;
  const error = loaderData?.error;

  if (error) {
    return <p>Error: {error}</p>; // Display error message if present
  }

  if (!data) {
    return <p>No data available</p>; // Handle case when no data is returned
  }

  return (
    <div>
      <h1>Shopify API Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
