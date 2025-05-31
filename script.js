document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const headerMenu = document.querySelector(".header-menu");

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    headerMenu.classList.toggle("active");
  });

  // Sticky header on scroll
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("sticky_head");
    } else {
      header.classList.remove("sticky_head");
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Handle dropdown menu for mobile
  const menuItems = document.querySelectorAll(".qodef-menu-item--narrow");

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    const subMenu = item.querySelector(".sub-menu");

    if (subMenu) {
      // Toggle submenu on click for mobile
      link.addEventListener("click", function (e) {
        if (window.innerWidth <= 1024) {
          // Only for mobile/tablet
          e.preventDefault();
          subMenu.style.display =
            subMenu.style.display === "block" ? "none" : "block";
        }
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".qodef-menu-item--narrow")) {
      document
        .querySelectorAll(".qodef-menu-item--narrow .sub-menu")
        .forEach((menu) => {
          menu.style.display = "none";
        });
    }
  });
});
// Improved cart functionality
document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.querySelector(".cart-count");

  // Update cart count display
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Initialize cart count
  updateCartCount();

  // Add to cart button click handler
  document.querySelectorAll(".add_to_cart_button").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const productId = this.getAttribute("data-product_id");
      const productElement = this.closest(".product");
      const productName = productElement.querySelector(
        ".woocommerce-loop-product__title"
      ).textContent;
      const productPrice = productElement.querySelector(".price").textContent;
      const productImage =
        productElement.querySelector(".et_shop_image img").src;

      // Check if product already in cart
      const existingItem = cart.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
        });
      }

      updateCartCount();

      // Visual feedback
      const buttonRect = this.getBoundingClientRect();
      const flyer = document.createElement("div");
      flyer.className = "cart-flyer";
      flyer.innerHTML = '<i class="fas fa-shopping-cart"></i>';
      flyer.style.position = "fixed";
      flyer.style.left = `${buttonRect.left}px`;
      flyer.style.top = `${buttonRect.top}px`;
      flyer.style.zIndex = "9999";
      flyer.style.color = "#d4a656";
      flyer.style.fontSize = "20px";
      flyer.style.pointerEvents = "none";
      document.body.appendChild(flyer);

      const cartIcon = document.querySelector(".cart-contents");
      const cartIconRect = cartIcon.getBoundingClientRect();

      const animation = flyer.animate(
        [
          {
            left: `${buttonRect.left}px`,
            top: `${buttonRect.top}px`,
            opacity: 1,
            transform: "scale(1)",
          },
          {
            left: `${cartIconRect.left}px`,
            top: `${cartIconRect.top}px`,
            opacity: 0,
            transform: "scale(0.5)",
          },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        }
      );

      animation.onfinish = () => flyer.remove();

      // Button feedback
      this.textContent = "Added!";
      setTimeout(() => {
        this.textContent = "Add to cart";
      }, 2000);
    });
  });

  // Cart icon click handler
  document
    .querySelector(".cart-contents")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showCartPopup();
    });

  // Function to show cart popup
  function showCartPopup() {
    const popup = document.createElement("div");
    popup.className = "cart-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 20px rgba(0,0,0,0.2)";
    popup.style.zIndex = "10000";
    popup.style.maxWidth = "500px";
    popup.style.width = "90%";

    if (cart.length === 0) {
      popup.innerHTML = `
                <h3>Your Cart</h3>
                <p>Your cart is empty</p>
                <button class="close-cart">Close</button>
            `;
    } else {
      let itemsHTML = "";
      let total = 0;

      cart.forEach((item) => {
        // Extract numeric price (simple example)
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        const itemTotal = price * item.quantity;
        total += itemTotal;

        itemsHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" width="50">
                        <div>
                            <h4>${item.name}</h4>
                            <p>${item.price} × ${
          item.quantity
        } = $${itemTotal.toFixed(2)}</p>
                            <button class="remove-item" data-id="${
                              item.id
                            }">Remove</button>
                        </div>
                    </div>
                `;
      });

      popup.innerHTML = `
                <h3>Your Cart (${cart.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )})</h3>
                ${itemsHTML}
                <div class="cart-total">
                    <strong>Total: $${total.toFixed(2)}</strong>
                </div>
                <div class="cart-actions">
                    <button class="close-cart">Continue Shopping</button>
                    <a href="#" class="checkout">Checkout</a>
                </div>
            `;
    }

    document.body.appendChild(popup);

    // Close button
    popup.querySelector(".close-cart").addEventListener("click", () => {
      document.body.removeChild(popup);
    });

    // Remove item buttons
    if (cart.length > 0) {
      popup.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", function () {
          const itemId = this.getAttribute("data-id");
          cart = cart.filter((item) => item.id !== itemId);
          updateCartCount();
          showCartPopup(); // Refresh the popup
        });
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let productsData = []; // This will store our product data

  // First, load the product data from JSON file
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productsData = data;
      initializeProductButtons();
      updateCartCount();
    })
    .catch((error) => {
      console.error("Error loading product data:", error);
      // Fallback: Initialize buttons even if JSON fails
      initializeProductButtons();
      updateCartCount();
    });

  function initializeProductButtons() {
    // Replace all product buttons with a single "Choose Option" button
    document.querySelectorAll(".product").forEach((product) => {
      const addToCartButton = product.querySelector(".add_to_cart_button");
      if (addToCartButton) {
        // Remove the existing buttons
        const buttonsContainer = addToCartButton.parentNode;
        buttonsContainer.innerHTML = "";

        // Create new "Choose Option" button
        const chooseOptionButton = document.createElement("a");
        chooseOptionButton.className = "choose-option-button";
        chooseOptionButton.innerHTML =
          '<i class="fas fa-list-ul"></i> Choose Option';
        chooseOptionButton.href = "#";

        // Add click handler
        chooseOptionButton.addEventListener("click", function (e) {
          e.preventDefault();
          const productId = addToCartButton.getAttribute("data-product_id");
          showProductModal(productId);
        });

        // Add the new button
        buttonsContainer.appendChild(chooseOptionButton);
      }
    });
  }

  function showProductModal(productId) {
    // Find the product in our data
    const product = productsData.find((p) => p.id === productId);
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    // Default to first variation
    const defaultVariation = product.variations[0];

    // Create product detail modal with unique design
    const modal = document.createElement("div");
    modal.className = "product-modal";
    modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="close-modal">&times;</button>
                    <div class="product-detail-container">
                        <div class="product-detail-image">
                            <img src="${defaultVariation.image}" alt="${
      product.name
    }" id="product-modal-image">
                            <div class="product-badge">${product.category}</div>
                        </div>
                        <div class="product-detail-info">
                            <h2>${product.name}</h2>
                            <div class="product-rating">
                                ${generateStars(product.rating || 4.5)}
                                <span class="review-count">(${
                                  product.reviews || "12"
                                } reviews)</span>
                            </div>
                            
                            <div class="product-detail-price" id="product-modal-price">
                                <span class="current-price">${defaultVariation.price.toFixed(
                                  2
                                )}</span>
                                ${
                                  product.originalPrice
                                    ? `<span class="original-price">$${product.originalPrice.toFixed(
                                        2
                                      )}</span>`
                                    : ""
                                }
                            </div>
                            
                            <div class="product-description">
                                <p>${product.description}</p>
                            </div>
                            
                            <div class="product-variations">
                                <label>Select Size:</label>
                                <div class="size-options">
                                    ${product.variations
                                      .map(
                                        (v) => `
                                        <div class="size-option ${
                                          v.size === defaultVariation.size
                                            ? "selected"
                                            : ""
                                        }" 
                                             data-price="${v.price}" 
                                             data-image="${v.image}">
                                            ${v.size}
                                        </div>
                                    `
                                      )
                                      .join("")}
                                </div>
                            </div>
                            
                            <div class="quantity-selector">
                                <label>Quantity:</label>
                                <div class="quantity-controls">
                                    <button class="quantity-minus"><i class="fas fa-minus"></i></button>
                                    <input type="number" id="quantity" value="1" min="1">
                                    <button class="quantity-plus"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                            
                            <div class="product-actions">
                                <button class="add-to-cart-detail" data-product-id="${
                                  product.id
                                }">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                                <a href="${productLink(
                                  productId
                                )}" class="view-full-details">
                                    <i class="fas fa-info-circle"></i> View Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    // Add modal to body
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    // Close modal handler
    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal.querySelector(".modal-overlay").addEventListener("click", closeModal);

    // Size option click handler
    modal.querySelectorAll(".size-option").forEach((option) => {
      option.addEventListener("click", function () {
        // Remove selected class from all options
        modal.querySelectorAll(".size-option").forEach((opt) => {
          opt.classList.remove("selected");
        });

        // Add selected class to clicked option
        this.classList.add("selected");

        // Update price and image
        const price = this.getAttribute("data-price");
        const image = this.getAttribute("data-image");

        document
          .getElementById("product-modal-price")
          .querySelector(".current-price").textContent = `${parseFloat(
          price
        ).toFixed(2)}`;
        document.getElementById("product-modal-image").src = image;
      });
    });

    // Quantity controls
    modal
      .querySelector(".quantity-minus")
      .addEventListener("click", function () {
        const quantityInput = modal.querySelector("#quantity");
        if (parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      });

    modal
      .querySelector(".quantity-plus")
      .addEventListener("click", function () {
        const quantityInput = modal.querySelector("#quantity");
        quantityInput.value = parseInt(quantityInput.value) + 1;
      });

    // Add to cart handler for modal
    modal
      .querySelector(".add-to-cart-detail")
      .addEventListener("click", function () {
        const quantity = parseInt(modal.querySelector("#quantity").value) || 1;
        const selectedOption = modal.querySelector(".size-option.selected");

        if (!selectedOption) {
          alert("Please select a size");
          return;
        }

        const size = selectedOption.textContent.trim();
        const price = selectedOption.getAttribute("data-price");
        const image = selectedOption.getAttribute("data-image");

        addToCart(productId, quantity, size, price, image);
        closeModal();
      });

    function closeModal() {
      document.body.removeChild(modal);
      document.body.style.overflow = "auto";
    }
  }

  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = "";

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars += '<i class="fas fa-star"></i>';
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }

    return stars;
  }

  function productLink(productId) {
    return `product/?id=${productId}`;
  }

  function addToCart(
    productId,
    quantity,
    size = null,
    price = null,
    image = null
  ) {
    // Get cart from localStorage or initialize
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Find the product in our data
    const product = productsData.find((p) => p.id === productId);
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    // If size/price/image not provided, use first variation
    if (!size || !price || !image) {
      const variation = product.variations[0];
      size = variation.size;
      price = variation.price;
      image = variation.image;
    }

    // Check if this product with this size already in cart
    const existingItem = cart.find(
      (item) => item.id === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: price,
        image: image,
        size: size,
        quantity: quantity,
      });
    }

    // Update cart
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Visual feedback
    showAddToCartFeedback();
  }

  function showAddToCartFeedback() {
    // Create feedback element
    const feedback = document.createElement("div");
    feedback.className = "cart-feedback";
    feedback.innerHTML = '<i class="fas fa-check"></i> Added to cart!';
    document.body.appendChild(feedback);

    // Animate
    setTimeout(() => {
      feedback.classList.add("show");
    }, 10);

    // Remove after animation
    setTimeout(() => {
      feedback.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(feedback);
      }, 300);
    }, 2000);
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".cart-count").textContent = total;
  }

  // Cart icon click handler
  document
    .querySelector(".cart-contents")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showCartPopup();
    });

  function showCartPopup() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const popup = document.createElement("div");
    popup.className = "cart-popup";

    if (cart.length === 0) {
      popup.innerHTML = `
                <h3>Your Cart</h3>
                <p>Your cart is empty</p>
                <button class="close-cart">Close</button>
            `;
    } else {
      let itemsHTML = "";
      let total = 0;

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        itemsHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" width="50">
                        <div>
                            <h4>${item.name}</h4>
                            <p>${item.size} - $${item.price.toFixed(2)} × ${
          item.quantity
        } = $${itemTotal.toFixed(2)}</p>
                            <button class="remove-item" data-id="${
                              item.id
                            }" data-size="${item.size}">Remove</button>
                        </div>
                    </div>
                `;
      });

      popup.innerHTML = `
                <h3>Your Cart (${cart.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )})</h3>
                <div class="cart-items-container">${itemsHTML}</div>
                <div class="cart-total">
                    <strong>Total: $${total.toFixed(2)}</strong>
                </div>
                <div class="cart-actions">
                    <button class="close-cart">Continue Shopping</button>
                    <a href="#" class="checkout">Proceed to Checkout</a>
                </div>
            `;
    }

    document.body.appendChild(popup);

    // Close button
    popup.querySelector(".close-cart").addEventListener("click", () => {
      document.body.removeChild(popup);
    });

    // Remove item buttons
    if (cart.length > 0) {
      popup.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", function () {
          const itemId = this.getAttribute("data-id");
          const itemSize = this.getAttribute("data-size");

          // Filter out this item
          const newCart = cart.filter(
            (item) => !(item.id === itemId && item.size === itemSize)
          );
          localStorage.setItem("cart", JSON.stringify(newCart));

          // Refresh the popup
          showCartPopup();
          updateCartCount();
        });
      });

      // Checkout button
      popup.querySelector(".checkout").addEventListener("click", function (e) {
        e.preventDefault();
        // Redirect to checkout page
        window.location.href = "checkout.html";
      });
    }
  }

  // Add CSS for all the new elements
  const style = document.createElement("style");
  style.textContent = `
            .add-to-cart-detail, .view-full-details {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                text-align: center;
                height: 45px;
            }

            .add-to-cart-detail {
                background-color: #d4a656;
                color: white;
            }

            .add-to-cart-detail:hover {
                background-color: #c0954e;
            }

            .view-full-details {
                background-color: #f5f5f5;
                color: #333;
                text-decoration: none;
            }

            .view-full-details:hover {
                background-color: #e0e0e0;
            }

            /* Change all price displays to use ₹ instead of $ */
            .product-detail-price .current-price:before,
            .cart-item p:before,
            .cart-total strong:before {
                content: '₹';
                margin-right: 2px;
            }

            /* Remove any $ signs that might be added by JavaScript */
            .product-detail-price .current-price,
            .cart-item p,
            .cart-total strong {
                font-family: Arial, sans-serif;
            }

            /* For the price in the modal */
            .product-detail-price .current-price {
                font-size: 24px;
                color: #d4a656;
                font-weight: bold;
            }
        .choose-option-button {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: #d4a656;
            color: white;
            border: none;
            border-radius: 4px;
            text-align: center;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
            font-size: 14px;
        }
        
        .choose-option-button:hover {
            background-color: #c0954e;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .choose-option-button i {
            margin-right: 8px;
        }
        
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            backdrop-filter: blur(3px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 12px;
            padding: 30px;
            z-index: 2;
            animation: modalFadeIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
            color: #777;
            transition: color 0.2s;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .close-modal:hover {
            color: #333;
            background-color: #f5f5f5;
        }
        
        .product-detail-container {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
        }
        
        .product-detail-image {
            flex: 1;
            min-width: 300px;
            position: relative;
        }
        .product-detail-image img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            max-height: 434px;
            object-fit: cover;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .product-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background-color: #d4a656;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .product-detail-info {
            flex: 1;
            min-width: 300px;
        }
        
        .product-detail-info h2 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
            font-weight: 700;
        }
        
        .product-rating {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .product-rating i {
            color: #ffc107;
            margin-right: 3px;
            font-size: 16px;
        }
        
        .review-count {
            margin-left: 8px;
            color: #777;
            font-size: 14px;
        }
        
        .product-detail-price {
            font-size: 24px;
            color: #d4a656;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        
        .current-price {
            margin-right: 10px;
        }
        
        .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 18px;
        }
        
        .product-description {
            margin: 20px 0;
            color: #555;
            line-height: 1.6;
            font-size: 15px;
        }
        
        .product-variations {
            margin: 25px 0;
        }
        
        .product-variations label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #444;
        }
        
        .size-options {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .size-option {
            padding: 8px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
        }
        
        .size-option:hover {
            border-color: #d4a656;
            color: #d4a656;
        }
        
        .size-option.selected {
            background-color: #d4a656;
            color: white;
            border-color: #d4a656;
        }
        
        .quantity-selector {
            margin: 25px 0;
        }
        
        .quantity-selector label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #444;
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .quantity-controls button {
            width: 35px;
            height: 35px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
            transition: all 0.2s;
        }
        
        .quantity-controls button:hover {
            background: #f5f5f5;
        }
        
        .quantity-controls input {
            width: 50px;
            height: 35px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .product-actions {
            display: flex;
            gap: 15px;
            // margin: 30px 0;
            align-items: baseline;
        }
        
        .view-full-details {
            flex: 1;
            padding: 12px;
            background-color: #f5f5f5;
            color: #333;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: background-color 0.3s;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .view-full-details:hover {
            background-color: #e0e0e0;
        }
        
        .product-features {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .product-features h4 {
            margin-bottom: 15px;
            color: #444;
            font-size: 18px;
        }
        
        .product-features ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .product-features li {
            margin-bottom: 10px;
            color: #555;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        
        .product-features i {
            color: #d4a656;
            margin-top: 3px;
            font-size: 14px;
        }
        
        .cart-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .cart-popup h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        
        .cart-items-container {
            max-height: 300px;
            overflow-y: auto;
            margin: 15px 0;
        }
        
        .cart-item {
            display: flex;
            gap: 15px;
            padding: 10px 0;
            border-bottom: 1px solid #f5f5f5;
        }
        
        .cart-item img {
            border-radius: 4px;
        }
        
        .cart-item h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
        }
        
        .cart-item p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: #e74c3c;
            cursor: pointer;
            font-size: 13px;
            padding: 0;
            margin-top: 5px;
        }
        
        .cart-total {
            text-align: right;
            font-size: 18px;
            margin: 15px 0;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .cart-actions {
            display: flex;
            gap: 10px;
        }
        
        .cart-actions button, .cart-actions a {
            flex: 1;
            padding: 12px;
            text-align: center;
            border-radius: 4px;
            font-size: 16px;
        }
        
        .close-cart {
            background: #f5f5f5;
            border: none;
            color: #333;
            cursor: pointer;
        }
        
        .checkout {
            background: #d4a656;
            color: white;
            text-decoration: none;
        }
        
        .cart-feedback {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
        }
        
        .cart-feedback.show {
            opacity: 1;
        }
        
        @media (max-width: 768px) {
            .product-detail-container {
                flex-direction: column;
            }
            
            .product-actions {
                flex-direction: column;
            }
            
            .cart-actions {
                flex-direction: column;
            }
            
            .modal-content {
                padding: 20px;
            }
            
            .product-detail-info h2 {
                font-size: 24px;
            }
        }
    `;
  document.head.appendChild(style);
});
var tpj = jQuery;

var revapi1;

if (window.RS_MODULES === undefined) window.RS_MODULES = {};
if (RS_MODULES.modules === undefined) RS_MODULES.modules = {};
RS_MODULES.modules["revslider11"] = {
  once:
    RS_MODULES.modules["revslider11"] !== undefined
      ? RS_MODULES.modules["revslider11"].once
      : undefined,
  init: function () {
    window.revapi1 =
      window.revapi1 === undefined ||
      window.revapi1 === null ||
      window.revapi1.length === 0
        ? document.getElementById("rev_slider_1_1")
        : window.revapi1;
    if (
      window.revapi1 === null ||
      window.revapi1 === undefined ||
      window.revapi1.length == 0
    ) {
      window.revapi1initTry =
        window.revapi1initTry === undefined ? 0 : window.revapi1initTry + 1;
      if (window.revapi1initTry < 20)
        requestAnimationFrame(function () {
          RS_MODULES.modules["revslider11"].init();
        });
      return;
    }
    window.revapi1 = jQuery(window.revapi1);
    if (window.revapi1.revolution == undefined) {
      revslider_showDoubleJqueryError("rev_slider_1_1");
      return;
    }
    revapi1.revolutionInit({
      revapi: "revapi1",
      sliderType: "hero",
      sliderLayout: "fullscreen",
      visibilityLevels: "1920,1710,1025,760",
      gridwidth: "1300,1100,768,300",
      gridheight: "900,640,700,560",
      lazyType: "smart",
      perspective: 600,
      perspectiveType: "local",
      editorheight: "900,640,700,560",
      responsiveLevels: "1920,1710,1025,760",
      progressBar: { disableProgressBar: true },
      navigation: {
        onHoverStop: false,
      },
      viewPort: {
        global: true,
        globalDist: "-200px",
        enable: false,
      },
      fallbacks: {
        allowHTML5AutoPlayOnAndroid: true,
      },
    });
  },
}; // End of RevInitScript
if (window.RS_MODULES.checkMinimal !== undefined) {
  window.RS_MODULES.checkMinimal();
}
document.addEventListener("DOMContentLoaded", function () {
  const playBtn = document.getElementById("play-video-btn");
  const modal = document.getElementById("honey-video-modal");
  const modalVideo = document.getElementById("modal-video");
  const closeModal = document.querySelector(".close-modal");

  // Open modal when play button is clicked
  playBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    modalVideo.play();
    document.body.style.overflow = "hidden"; // Prevent scrolling
  });

  // Close modal when X is clicked
  closeModal.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    modal.style.display = "none";
    modalVideo.pause();
    document.body.style.overflow = ""; // Restore scrolling
  });

  // Close modal when clicking outside the video
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modalVideo.pause();
      document.body.style.overflow = ""; // Restore scrolling
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "flex") {
      modal.style.display = "none";
      modalVideo.pause();
      document.body.style.overflow = ""; // Restore scrolling
    }
  });
});
