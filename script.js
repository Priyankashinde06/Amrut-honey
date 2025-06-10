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
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('giftModal');
        const closeBtn = document.querySelector('.gift-modal-close');
        const giftItems = document.querySelectorAll('.gift-item');
        
        // Close modal when clicking X
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Open modal when clicking on gift image
        giftItems.forEach(item => {
            const image = item.querySelector('.gift-image img');
            const title = item.querySelector('.gift-title').textContent;
            const description = item.querySelector('.gift-description').textContent;
            const price = item.querySelector('.gift-price').textContent;
            
            image.addEventListener('click', function() {
                document.getElementById('modalGiftImage').src = this.src;
                document.getElementById('modalGiftTitle').textContent = title;
                document.getElementById('modalGiftDescription').textContent = description;
                document.getElementById('modalGiftPrice').textContent = price;
                modal.style.display = 'block';
            });
        });
        
        // Quantity controls
        const quantityInput = document.getElementById('quantity');
        quantityInput.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
        });
    });