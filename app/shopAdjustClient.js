export async function shopAdjustClient(shop, method, params = {}) {
  try {
    const response = await fetch("/api/shop-adjust", {
      method: 'POST',  // Adjust based on your API needs
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop, method, params }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in shopAdjustClient:", error);
    throw error;
  }
}
