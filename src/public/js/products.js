const productsTable = document.getElementById('table');

productsTable.addEventListener('click', async (e) => {
  e.preventDefault();
  const element = e.target;
  if (element.className === 'add-to-cart') {
    const cartId = productsTable.getAttribute('data-cart-id');
    const productId = element.getAttribute('data-id');

    try {
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Product added to the cart successfully');
      } else {
        alert('Error adding product to the cart');
      }
    } catch (error) {
      console.error(error);
    }
  }
});
