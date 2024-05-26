document.addEventListener("DOMContentLoaded", function () {
  const hashtagSelector = document.getElementById("hashtag");
  const sortSelector = document.getElementById("sort");
  const blogContainer = document.getElementById("blog-posts-container");

  if (hashtagSelector) {
    hashtagSelector.addEventListener("change", function () {
      filterAndSortCards(this.value, sortSelector.value);
    });
  } else {
    console.warn('Element with id "hashtag" not found.');
  }

  if (sortSelector) {
    sortSelector.addEventListener("change", function () {
      filterAndSortCards(hashtagSelector.value, this.value);
    });
  } else {
    console.warn('Element with id "sort" not found.');
  }

  function filterAndSortCards(selectedHashtag, sortOrder) {
    const normalizedSelectedHashtag = selectedHashtag
      .replace("#", "")
      .toLowerCase();
    const cards = Array.from(blogContainer.querySelectorAll(".card"));

    // Filter cards
    cards.forEach((card) => {
      const hashtags = card.dataset.hashtags
        .split(" ")
        .map((tag) => tag.toLowerCase());
      card.style.display =
        normalizedSelectedHashtag === "all" ||
        hashtags.includes(normalizedSelectedHashtag)
          ? "block"
          : "none";
    });

    // Sort cards
    cards.sort((a, b) => {
      if (sortOrder === "alphabet") {
        return a
          .querySelector("h3")
          .innerText.localeCompare(b.querySelector("h3").innerText);
      } else if (sortOrder === "date") {
        return new Date(b.dataset.date) - new Date(a.dataset.date);
      }
      return 0;
    });

    cards.forEach((card) => blogContainer.appendChild(card));
  }
});
