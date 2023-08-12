const socketClient = io();

const addProduct = document.getElementById('addProduct');
const inputTitle = document.getElementById('pTitle');
const inputDescription = document.getElementById('pDescription');
const inputCategory = document.getElementById('pCategory');
const inputPrice = document.getElementById('pPrice');
const inputCode = document.getElementById('pCode');
const inputStock = document.getElementById('pStock');

addProduct.addEventListener('click', async (e) => {
  e.preventDefault();
  const newProduct = {
    title: inputTitle.value,
    description: inputDescription.value,
    category: inputCategory.value,
    price: inputPrice.value,
    thumbnail: [],
    code: inputCode.value,
    stock: inputStock.value,
    status: true,
  };
  await fetch('/api/products/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });
  document.location.reload();
});

const deleteProduct = document.getElementById('productsTable');
deleteProduct.addEventListener('click', async (e) => {
  e.preventDefault();
  const element = e.target;
  const productId = element.getAttribute('data-id');
  if (element.className === 'delete') {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      document.location.reload();
    } catch (error) {
      console.error(error);
    }
  }
});

const deleteUser = document.getElementById('usersTable');
deleteUser.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('HELLO');
  // const element = e.target;
  // const userId = element.getAttribute('data-id');
  // if (element.className === 'delete') {
  //   try {
  //     await fetch(`/api/users/${userId}`, {
  //       method: 'DELETE',
  //     });
  //     document.location.reload();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
});

const ToggleUserToPremium = document.getElementById('usersTable');
ToggleUserToPremium.addEventListener('click', async (e) => {
  e.preventDefault();
  const element = e.target;
  const userRole = element.getAttribute('data-role');
  if (element.className === 'toggleUser') {
    try {
      await fetch(`/api/users/premium/${userRole}`, {
        method: 'POST',
      });
      document.location.reload();
    } catch (error) {
      console.error(error);
    }
  }
});
