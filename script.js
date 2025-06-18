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
  const closeModal = document.querySelector(".close-modals");

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
// Back to Top Button Functionality
document.addEventListener("DOMContentLoaded", function () {
  const backToTopButton = document.querySelector(".back-to-top");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("active");
    } else {
      backToTopButton.classList.remove("active");
    }
  });

  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
// Modal functionality
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("giftModal");
  const closeBtn = document.querySelector(".gift-modal-close");
  const giftItems = document.querySelectorAll(".gift-item");

  // Close modal when clicking X
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Open modal when clicking on gift image
  giftItems.forEach((item) => {
    const image = item.querySelector(".gift-image img");
    const title = item.querySelector(".gift-title").textContent;
    const description = item.querySelector(".gift-description").textContent;
    const price = item.querySelector(".gift-price").textContent;

    image.addEventListener("click", function () {
      document.getElementById("modalGiftImage").src = this.src;
      document.getElementById("modalGiftTitle").textContent = title;
      document.getElementById("modalGiftDescription").textContent = description;
      document.getElementById("modalGiftPrice").textContent = price;
      modal.style.display = "block";
    });
  });

  // Quantity controls
  const quantityInput = document.getElementById("quantity");
  quantityInput.addEventListener("change", function () {
    if (this.value < 1) this.value = 1;
  });
});
const menuOpener = document.querySelector(".qodef-mobile-header-opener");
const mobileNav = document.querySelector(".qodef-mobile-header-navigation");
const blurOverlay = document.getElementById("blur-overlay");

let menuOpen = false;

menuOpener.addEventListener("click", (e) => {
  e.preventDefault();
  menuOpen = !menuOpen;
  toggleBlurOverlay(menuOpen);
});

// Update the blur overlay click handler to also close the mobile menu
blurOverlay.addEventListener("click", () => {
  menuOpen = false;
  // Close all dropdown menus
  document.querySelectorAll(".menu-item-has-children").forEach((item) => {
    item.classList.remove("active");
  });
  // Close the mobile navigation
  mobileNav.style.display = "none";
  toggleBlurOverlay(false);
});

// Add this to your existing code - it will close the menu when clicking outside
document.addEventListener("click", function (e) {
  if (menuOpen && !e.target.closest("#qodef-page-mobile-header-inner")) {
    menuOpen = false;
    mobileNav.style.display = "none";
    toggleBlurOverlay(false);
    // Close all dropdown menus
    document.querySelectorAll(".menu-item-has-children").forEach((item) => {
      item.classList.remove("active");
    });
  }
});
function toggleBlurOverlay(show) {
  if (show) {
    blurOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
  } else {
    blurOverlay.style.display = "none";
    document.body.style.overflow = "";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // Add toggle buttons to each dropdown parent
  const dropdownParents = document.querySelectorAll(
    ".qodef-mobile-header-navigation .menu-item-has-children"
  );

  dropdownParents.forEach((parent) => {
    // Find the clickable element (either <a> or .mobile-menu-toggle)
    const menuLink =
      parent.querySelector("a") ||
      parent.querySelector(".mobile-menu-toggle span");

    // Create toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "mobile-menu-toggle-btn";
    toggleBtn.innerHTML =
      '<i class="fas fa-chevron-down dropdown-arrow toggle-drop"></i>';

    // Insert the toggle button after the menu text
    if (menuLink) {
      menuLink.appendChild(toggleBtn);
    }

    // Add click event to the toggle button only
    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Toggle the active state
      parent.classList.toggle("active");

      // Close other dropdowns at the same level
      const siblings = Array.from(parent.parentNode.children).filter(
        (sibling) => sibling !== parent
      );

      siblings.forEach((sibling) => {
        sibling.classList.remove("active");
      });
    });
  });

  // Allow regular link clicks to work
  document
    .querySelectorAll(".qodef-mobile-header-navigation a[href]")
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        if (this.getAttribute("href") !== "#") {
          // Close all dropdowns when navigating
          dropdownParents.forEach((item) => {
            item.classList.remove("active");
          });
        }
      });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced search functionality with autosuggest
    const searchInputs = document.querySelectorAll('.search-input');
    const searchResultsContainers = document.querySelectorAll('.search-results');
    
    // Honey product data
    const honeyProducts = [
        { name: 'Multiflora Honey', url: 'raw-honey.html?type=multiflora' },
        { name: 'Jamun Honey', url: 'raw-honey.html?type=jamun' },
        { name: 'Ajwain Honey', url: 'raw-honey.html?type=ajwain' },
        { name: 'Tulsi Honey', url: 'raw-honey.html?type=tulsi' },
        { name: 'Honey Gift Pack', url: 'gifting.html' }
    ];
    
    // Add event listeners to each search input
    searchInputs.forEach((input, index) => {
        const resultsContainer = searchResultsContainers[index];
        
        input.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length === 0) {
                resultsContainer.style.display = 'none';
                return;
            }
            
            // Filter products that match the query
            const results = honeyProducts.filter(product => 
                product.name.toLowerCase().includes(query)
            );
            
            displayResults(results, resultsContainer);
        });
        
        input.addEventListener('focus', function() {
            const query = this.value.trim().toLowerCase();
            if (query.length > 0) {
                const results = honeyProducts.filter(product => 
                    product.name.toLowerCase().includes(query)
                );
                displayResults(results, resultsContainer);
            }
        });

    });
    
    // Search button functionality
    document.querySelectorAll('.search-button').forEach(button => {
        button.addEventListener('click', function() {
            const searchContainer = this.closest('.search-container');
            const input = searchContainer.querySelector('.search-input');
            performSearch(input.value.trim());
        });
    });
    
    // Press Enter to search
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value.trim());
            }
        });
    });
    
    // Display search results
    function displayResults(results, container) {
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">No honey products found</div>';
            container.style.display = 'block';
            return;
        }
        
        const ul = document.createElement('ul');
        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result.name;
            li.addEventListener('click', function() {
                window.location.href = result.url;
            });
            ul.appendChild(li);
        });
        
        container.appendChild(ul);
        container.style.display = 'block';
    }
    
    // Perform the search
    function performSearch(query) {
        if (query.length === 0) return;
        
        const results = honeyProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length === 1) {
            window.location.href = results[0].url;
        } else if (results.length > 1) {
            // You could implement a search results page here
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        } else {
            alert('No honey products found matching your search.');
        }
    }
});
// Enhanced search functionality with autosuggest
document.addEventListener('DOMContentLoaded', function() {
    // Honey product data
    const honeyProducts = [
        { name: 'Multiflora Honey', url: 'raw-honey.html?type=multiflora' },
        { name: 'Jamun Honey', url: 'raw-honey.html?type=jamun' },
        { name: 'Ajwain Honey', url: 'raw-honey.html?type=ajwain' },
        { name: 'Tulsi Honey', url: 'raw-honey.html?type=tulsi' },
        { name: 'Honey Gift Pack', url: 'gifting.html' }
    ];

    // Desktop search functionality
    const desktopSearchInput = document.querySelector('.header-search .search-input');
    const desktopSearchResults = document.querySelector('.header-search .search-results');
    
    if (desktopSearchInput) {
        desktopSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            updateSearchResults(query, desktopSearchResults);
        });
        
        desktopSearchInput.addEventListener('focus', function() {
            const query = this.value.trim().toLowerCase();
            if (query.length > 0) {
                updateSearchResults(query, desktopSearchResults);
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.header-search')) {
                desktopSearchResults.style.display = 'none';
            }
        });
    }

    // Mobile search functionality
    const mobileSearchContainer = document.querySelector('.mobile-search');
    if (mobileSearchContainer) {
        const mobileSearchInput = mobileSearchContainer.querySelector('.search-input');
        const mobileSearchButton = mobileSearchContainer.querySelector('.search-button');
        const mobileSearchResults = document.createElement('div');
        mobileSearchResults.className = 'search-results';
        mobileSearchContainer.appendChild(mobileSearchResults);
        
        // Toggle search input on button click
        mobileSearchButton.addEventListener('click', function(e) {
            if (mobileSearchContainer.classList.contains('active')) {
                const query = mobileSearchInput.value.trim();
                if (query.length > 0) {
                    performSearch(query);
                }
            } else {
                mobileSearchContainer.classList.add('active');
                mobileSearchInput.focus();
                e.stopPropagation();
            }
        });
        
        mobileSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            updateSearchResults(query, mobileSearchResults);
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.mobile-search')) {
                mobileSearchContainer.classList.remove('active');
                mobileSearchResults.style.display = 'none';
            }
        });
    }

    // Common function to update search results
    function updateSearchResults(query, container) {
        container.innerHTML = '';
        
        if (query.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        const results = honeyProducts.filter(product => 
            product.name.toLowerCase().includes(query)
        );
        
        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">No honey products found</div>';
            container.style.display = 'block';
            return;
        }
        
        const ul = document.createElement('ul');
        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result.name;
            li.addEventListener('click', function() {
                window.location.href = result.url;
                container.style.display = 'none';
            });
            ul.appendChild(li);
        });
        
        container.appendChild(ul);
        container.style.display = 'block';
    }

    // Perform the search
    function performSearch(query) {
        if (query.length === 0) return;
        
        const results = honeyProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length === 1) {
            window.location.href = results[0].url;
        } else if (results.length > 1) {
            // You could implement a search results page here
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        } else {
            alert('No honey products found matching your search.');
        }
    }
});