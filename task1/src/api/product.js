const createProduct = async (eventData) => {
  const response = await fetch(`https://dummyjson.com/products/add`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
};

const fetchProduct = async () => {
  return await fetch(`https://dummyjson.com/products?limit=50`).then((res) =>
    res.json()
  );
};

export { createProduct, fetchProduct };
