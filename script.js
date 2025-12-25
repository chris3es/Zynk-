const videos = [
  {
    id: 1,
    creator: "@chris",
    caption: "Insane crystal clutch in the void arena.",
    track: "♬ Neon Dreams – Echoheart",
    likes: 1280,
    comments: 94,
    shares: 31
  },
  {
    id: 2,
    creator: "@nova",
    caption: "0.01s parkour finish, no cuts.",
    track: "♬ Skyline Rush – Vanta",
    likes: 842,
    comments: 51,
    shares: 18
  },
  {
    id: 3,
    creator: "@neko",
    caption: "Building a cursed lobby in under 60 seconds.",
    track: "♬ Midnight Glitch – LUX",
    likes: 2310,
    comments: 201,
    shares: 77
  }
];

const feedEl = document.getElementById("feed");

function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function renderFeed() {
  feedEl.innerHTML = "";
  videos.forEach(video => {
    const card = document.createElement("section");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-shell" data-id="${video.id}">
        <div class="video-frame"></div>
        <div class="overlay-bottom">
          <div class="creator">${video.creator}</div>
          <div class="caption" title="${video.caption}">${video.caption}</div>
          <div class="track">${video.track}</div>
        </div>
        <div class="side-actions">
          <div class="action-btn like-btn" data-id="${video.id}">
            <div class="action-icon">❤</div>
            <span class="count">${formatCount(video.likes)}</span>
          </div>
          <div class="action-btn">
            <div class="action-icon">💬</div>
            <span class="count">${formatCount(video.comments)}</span>
          </div>
          <div class="action-btn">
            <div class="action-icon">↗</div>
            <span class="count">${formatCount(video.shares)}</span>
          </div>
        </div>
      </div>
    `;
    feedEl.appendChild(card);
  });
}

renderFeed();

feedEl.addEventListener("click", (e) => {
  const likeBtn = e.target.closest(".like-btn");
  if (!likeBtn) return;

  likeBtn.classList.toggle("liked");
  const id = Number(likeBtn.dataset.id);
  const video = videos.find(v => v.id === id);
  const countEl = likeBtn.querySelector(".count");
  const liked = likeBtn.classList.contains("liked");

  if (liked) {
    video.likes++;
  } else {
    video.likes = Math.max(0, video.likes - 1);
  }

  countEl.textContent = formatCount(video.likes);
});
