console.log('products.js loaded');
const productToken = localStorage.getItem('token');

const productList = document.getElementById('product-list');


// LOAD PRODUCTS
async function loadProducts() {

    console.log('Loading products...');

    try {

        const response = await fetch('/api/products', {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const products = await response.json();

        console.log(products);

        productList.innerHTML = '';

        products.forEach(product => {

            productList.innerHTML += `

                <tr class="border-b dark:border-gray-700">

                    <td class="p-4">
                        ${product.sku}
                    </td>

                    <td class="p-4">
                        ${product.name_en}
                    </td>

                    <td class="p-4">
                        ${product.quantity}
                    </td>

                    <td class="p-4">
                        ฿${product.price}
                    </td>

                    <td class="p-4 flex gap-2">

                        <button
                            onclick="deleteProduct(${product.id})"
                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


// DELETE PRODUCT
async function deleteProduct(id) {

    const confirmDelete = confirm(
        'Delete this product?'
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(

            `/api/products/${id}`,

            {

                method: 'DELETE',

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }

        );

        const data = await response.json();

        console.log(data);

        loadProducts();

    } catch (error) {

        console.error(error);

    }

}


// INITIAL LOAD
loadProducts();

// TEMP MODAL FUNCTION
function openModal() {

    alert('Add Product Modal coming soon');

}