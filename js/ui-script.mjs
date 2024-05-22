document.addEventListener("DOMContentLoaded", function () {
  const hashtagSelector = document.getElementById("hashtag");
  const blogContainer = document.getElementById("blog-posts-container");

  if (hashtagSelector) {
    hashtagSelector.addEventListener("change", function () {
      filterCards(this.value);
    });
  } else {
    console.warn('Element with id "hashtag" not found.');
  }

  function filterCards(selectedHashtag) {
    const normalizedSelectedHashtag = selectedHashtag
      .replace("#", "")
      .toLowerCase();
    const cards = blogContainer.querySelectorAll(".card");
    cards.forEach((card) => {
      const hashtags = card.dataset.hashtags
        .split(" ")
        .map((tag) => tag.toLowerCase());
      console.log(
        "Card hashtags:",
        hashtags,
        "Selected hashtag:",
        normalizedSelectedHashtag
      );
      card.style.display =
        normalizedSelectedHashtag === "all" ||
        hashtags.includes(normalizedSelectedHashtag)
          ? "block"
          : "none";
    });
  }
});
