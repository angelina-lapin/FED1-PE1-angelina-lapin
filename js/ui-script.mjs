document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  const nextButton = document.querySelector(".next");
  const prevButton = document.querySelector(".prev");

  function displayCurrentSlide() {
    slides.forEach((slide) => (slide.style.display = "none")); // Скрывает все слайды
    slides[currentSlide].style.display = "block"; // Показать активный слайд
  }

  displayCurrentSlide(); // Инициализация первого слайда

  function changeSlide(n) {
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    displayCurrentSlide();
  }

  nextButton.addEventListener("click", () => changeSlide(1));
  prevButton.addEventListener("click", () => changeSlide(-1));

  // Фильтрация карточек по хэштегам
  const hashtagSelector = document.getElementById("hashtag");
  const cards = document.querySelectorAll(".card");

  function filterCards(hashtag) {
    cards.forEach((card) => {
      const hashtags = card.dataset.hashtags;
      card.style.display =
        hashtag === "all" || hashtags.includes(hashtag) ? "block" : "none";
    });
  }

  hashtagSelector.addEventListener("change", function () {
    filterCards(this.value);
  });
});
