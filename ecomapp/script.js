document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const productList = document.getElementById('product-list');
    const shoppingCart = document.getElementById('shopping-cart');
    const accountOptions = document.querySelector('.account-options');
    let currentUser = 'User1032';

    const loadProducts = () => {
      const products = JSON.parse(localStorage.getItem('products')) || [];
      productList.innerHTML = products.map(product => `
        <div class="product-item">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          ${currentUser === 'Admin' ? `<button onclick="editProduct('${product.name}')">Edit</button>` : ''}
          <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        </div>
      `).join('');
    };

    addProductForm && addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (currentUser === 'Admin') {
        const productName = document.getElementById('product-name').value;
        const productPrice = document.getElementById('product-price').value;
        const newProduct = { name: productName, price: productPrice };
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        addProductForm.reset();
        alert('Product added successfully!');
      } else {
        alert('Only Admin can add products.');
      }
    });

    window.addToCart = (name, price) => {
      const product = { name, price };
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
    };

    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      shoppingCart.innerHTML = cart.map(product => `
        <p>${product.name} - $${product.price}</p>
      `).join('');
    };

    window.setUser = (user) => {
      currentUser = user;
      alert(`Logged in as ${user}`);
      accountOptions.style.display = 'none';
      loadProducts();
    };

    window.showAdminLogin = () => {
      const username = prompt('Enter Username:');
      const password = prompt('Enter Password:');
      if (username === 'adeola' && password === '$2ecomms01!') {
        setUser('Admin');
      } else {
        alert('Invalid credentials');
      }
    };

    const showAccountOptions = () => {
      accountOptions.style.display = accountOptions.style.display === 'block' ? 'none' : 'block';
    };

    loadProducts();
    loadCart();
});
