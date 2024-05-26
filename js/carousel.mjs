document.addEventListener("DOMContentLoaded", function () {
  const nextButton = document.querySelector(".next");
  const prevButton = document.querySelector(".prev");

  function updateSlides() {
    const slides = document.querySelectorAll(".carousel-inner .slide");
    let currentSlide = 0;

    function displayCurrentSlide() {
      slides.forEach((slide, index) => {
        slide.style.display = index === currentSlide ? "block" : "none";
      });
    }

    displayCurrentSlide();

    function changeSlide(n) {
      currentSlide = (currentSlide + n + slides.length) % slides.length;
      displayCurrentSlide();
    }

    nextButton.addEventListener("click", () => changeSlide(1));
    prevButton.addEventListener("click", () => changeSlide(-1));
  }

  updateSlides();

  const carouselObserver = new MutationObserver(updateSlides);
  const carouselInner = document.querySelector(".carousel-inner");
  carouselObserver.observe(carouselInner, { childList: true });
});
