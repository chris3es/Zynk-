const videos = [
  {
    id: 1,
    creator: "@Zynk",
    caption: "Welcome to Zynk!",
    track: "♬ Neon Dreams – Echoheart",
    likes: 12800,
    comments: 0,
    shares: 0
  },
];

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});

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
