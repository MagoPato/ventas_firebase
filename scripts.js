// scripts.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvxMcz-yoTsanHX88FpV51qEXTkJzcuxM",
  authDomain: "ventas-530e1.firebaseapp.com",
  databaseURL: "https://ventas-530e1-default-rtdb.firebaseio.com",
  projectId: "ventas-530e1",
  storageBucket: "ventas-530e1.firebasestorage.app",
  messagingSenderId: "59413498085",
  appId: "1:59413498085:web:f724372ad545d83763ac0c",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productsRef = ref(db, "products");

function loadProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  onValue(productsRef, (snapshot) => {
    const products = snapshot.val();
    if (products) {
      Object.entries(products).forEach(([id, product]) => {
        const productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card product-card">
                            <div class="card-body">
                                <h5 class="product-title">${product.name}</h5>
                                <p class="product-description">Descripción del producto</p>
                                <p class="product-price">Precio: $${product.price}</p>
                                <p class="product-quantity">Cantidad: ${product.quantity}</p>
                                <button class="btn btn-warning btn-sm update-btn" data-id="${id}"><i class="fas fa-edit"></i> Modificar</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${id}"><i class="fas fa-trash-alt"></i> Eliminar</button>
                            </div>
                        </div>
                    </div>
                `;
        productList.insertAdjacentHTML("beforeend", productCard);
      });
    }
  });
}

document.getElementById("saveProductBtn").addEventListener("click", () => {
  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const quantity = parseInt(document.getElementById("productQuantity").value);

  const newProduct = {
    name,
    price,
    quantity,
  };

  const newProductRef = ref(db, "products/" + Date.now());
  set(newProductRef, newProduct);

  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productQuantity").value = "";

  $("#addProductModal").modal("hide");
  loadProducts();
});

document.getElementById("confirmUpdateBtn").addEventListener("click", () => {
  const id = document
    .getElementById("updateProductName")
    .getAttribute("data-id");
  const updatedProduct = {
    name: document.getElementById("updateProductName").value,
    price: parseFloat(document.getElementById("updateProductPrice").value),
    quantity: parseInt(document.getElementById("updateProductQuantity").value),
  };

  update(ref(db, "products/" + id), updatedProduct);
  $("#updateModal").modal("hide");
  loadProducts();
});

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  const id = document
    .getElementById("confirmDeleteBtn")
    .getAttribute("data-id");
  remove(ref(db, "products/" + id));
  $("#deleteModal").modal("hide");
  loadProducts();
});

document.getElementById("productList").addEventListener("click", (e) => {
  if (e.target.classList.contains("update-btn")) {
    const id = e.target.getAttribute("data-id");
    const product = get(ref(db, "products/" + id));
    product.then((snapshot) => {
      const productData = snapshot.val();
      document.getElementById("updateProductName").value = productData.name;
      document.getElementById("updateProductPrice").value = productData.price;
      document.getElementById("updateProductQuantity").value =
        productData.quantity;
      document.getElementById("updateProductName").setAttribute("data-id", id);
      $("#updateModal").modal("show");
    });
  }

  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    document.getElementById("confirmDeleteBtn").setAttribute("data-id", id);
    $("#deleteModal").modal("show");
  }
});

function searchProduct() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const name = card.querySelector(".product-title").textContent.toLowerCase();
    if (name.includes(searchTerm)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}
