const deleteUser = document.getElementById('table1');
const ToggleUserToPremium = document.getElementById('table1');

deleteUser.addEventListener('click', async (e) => {
  e.preventDefault();
  const element = e.target;
  if (element.className === 'delete') {
    const userId = element.getAttribute('data-id');

    try {
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      document.location.reload();
    } catch (error) {
      console.error(error);
    }
  }
});

ToggleUserToPremium.addEventListener('click', async (e) => {
  e.preventDefault();
  const element = e.target;

  console.log('Toggle button clicked');

  if (element.className === 'toggleUser') {
    const userId = element.getAttribute('data-id');
    try {
      await fetch(`/api/users/premium/${userId}`, {
        method: 'POST',
      });
      document.location.reload();
    } catch (error) {
      console.error(error);
    }
  }
});
