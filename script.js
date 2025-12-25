// ----- MOCK DATA -----
const creatorAvatars = {
  "@Zynk": "profile-Zynk.png",
};

let videos = [
  {
    id: 1,
    creator: "@Zynk",
    caption: "Insane crystal clutch in the void arena.",
    track: "♬ Neon Dreams – Echoheart",
    likes: 128000,
    comments: 0,
    shares: 0,
    banned: false,
  },
];

// ----- ELEMENTS -----
const feedEl = document.getElementById("feed");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebarClose");
const bottomNavButtons = document.querySelectorAll(".bottom-nav-btn");
const sidebarButtons = document.querySelectorAll(".sidebar-btn[data-panel]");
const themeToggle = document.getElementById("themeToggle");
const settingsThemeToggle = document.getElementById("settingsThemeToggle");
const authModalBackdrop = document.getElementById("authModalBackdrop");
const authClose = document.getElementById("authClose");
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const openAuthBtn = document.getElementById("openAuth");
const settingsOpenAuth = document.getElementById("settingsOpenAuth");
const logoutBtn = document.getElementById("logoutBtn");
const profileInfo = document.getElementById("profileInfo");
const profileMainImage = document.getElementById("profileMainImage");
const profileExtra = document.getElementById("profileExtra");
const headerProfileImage = document.getElementById("headerProfileImage");
const profileButton = document.getElementById("profileButton");

// ----- THEME -----
function applyTheme(theme) {
  document.body.classList.remove("theme-dark", "theme-light");
  document.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
  localStorage.setItem("zynk_theme", theme);
  themeToggle.textContent = theme === "light" ? "☀" : "☾";
}

const storedTheme = localStorage.getItem("zynk_theme") || "dark";
applyTheme(storedTheme);

themeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("theme-dark")
    ? "light"
    : "dark";
  applyTheme(newTheme);
});

settingsThemeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("theme-dark")
    ? "light"
    : "dark";
  applyTheme(newTheme);
});

// ----- SIDEBAR -----
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

sidebarClose.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});

// ----- PANELS -----
function showPanel(panelName) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("panel-active"));
  const active = document.getElementById(`panel-${panelName}`);
  if (active) active.classList.add("panel-active");
}

bottomNavButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.getAttribute("data-panel");
    showPanel(panel);
  });
});

sidebarButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.getAttribute("data-panel");
    showPanel(panel);
    sidebar.classList.remove("open");
  });
});

profileButton.addEventListener("click", () => {
  showPanel("profile");
});

// ----- AUTH (DEMO ONLY) -----
let currentUser = null;

function setSession(username) {
  currentUser = { username };
  localStorage.setItem("zynk_user", username);
  document.cookie = `zynk_session=${encodeURIComponent(
    username
  )}; path=/; max-age=604800; SameSite=Lax`;

  updateProfileUI();
  renderFeed();
}

function clearSession() {
  currentUser = null;
  localStorage.removeItem("zynk_user");
  document.cookie =
    "zynk_session=; path=/; max-age=0; SameSite=Lax; Secure=false";
  updateProfileUI();
  renderFeed();
}

function loadSession() {
  const storedUser = localStorage.getItem("zynk_user");
  if (storedUser) {
    currentUser = { username: storedUser };
  }
  updateProfileUI();
}

function updateProfileUI() {
  if (!currentUser) {
    profileInfo.textContent = "Not logged in.";
    profileExtra.textContent = "";
    headerProfileImage.src = "profile-default.png";
    profileMainImage.src = "profile-default.png";
    return;
  }

  profileInfo.textContent = `Logged in as ${currentUser.username}`;
  profileExtra.textContent =
    currentUser.username === "Zynk"
      ? "You have moderator powers: delete posts and ban accounts."
      : "";

  headerProfileImage.src = "profile-default.png";
  profileMainImage.src = "profile-default.png";
}

loadSession();

// Auth modal
function openAuthModal() {
  authModalBackdrop.classList.add("open");
}

function closeAuthModal() {
  authModalBackdrop.classList.remove("open");
}

openAuthBtn.addEventListener("click", openAuthModal);
settingsOpenAuth.addEventListener("click", openAuthModal);
authClose.addEventListener("click", closeAuthModal);
authModalBackdrop.addEventListener("click", (e) => {
  if (e.target === authModalBackdrop) closeAuthModal();
});

// Tabs
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("modal-tab-active");
  tabSignup.classList.remove("modal-tab-active");
  loginForm.classList.add("auth-form-active");
  signupForm.classList.remove("auth-form-active");
});

tabSignup.addEventListener("click", () => {
  tabSignup.classList.add("modal-tab-active");
  tabLogin.classList.remove("modal-tab-active");
  signupForm.classList.add("auth-form-active");
  loginForm.classList.remove("auth-form-active");
});

// Demo login/signup
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) return;
  setSession(username);
  closeAuthModal();
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!username || !password) return;
  setSession(username);
  closeAuthModal();
});

logoutBtn.addEventListener("click", () => {
  clearSession();
});

// ----- FEED RENDERING -----
function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function getCreatorAvatar(creator) {
  return creatorAvatars[creator] || "profile-default.png";
}

function renderFeed() {
  feedEl.innerHTML = "";
  const visibleVideos = videos.filter((v) => !v.banned);

  visibleVideos.forEach((video) => {
    const card = document.createElement("section");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-shell" data-id="${video.id}">
        ${
          currentUser && currentUser.username === "Zynk"
            ? `
          <div class="moderation-actions">
            <button class="mod-btn mod-delete" data-id="${video.id}">Delete Post</button>
            <button class="mod-btn mod-btn-ban" data-id="${video.id}">Ban Account</button>
          </div>
        `
            : ""
        }

        <div class="video-frame"></div>

        <div class="overlay-bottom">
          <div class="creator-row">
            <div class="creator-avatar">
              <img src="${getCreatorAvatar(video.creator)}" alt="${video.creator}" />
            </div>
            <div class="creator-name">${video.creator}</div>
          </div>
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

// Like toggle
feedEl.addEventListener("click", (e) => {
  const likeBtn = e.target.closest(".like-btn");
  if (likeBtn) {
    likeBtn.classList.toggle("liked");
    const id = Number(likeBtn.dataset.id);
    const video = videos.find((v) => v.id === id);
    const countEl = likeBtn.querySelector(".count");
    const liked = likeBtn.classList.contains("liked");
    if (liked) {
      video.likes++;
    } else {
      video.likes = Math.max(0, video.likes - 1);
    }
    countEl.textContent = formatCount(video.likes);
  }

  // Delete post (Zynk only)
  const deleteBtn = e.target.closest(".mod-delete");
  if (deleteBtn && currentUser && currentUser.username === "Zynk") {
    const id = Number(deleteBtn.dataset.id);
    videos = videos.filter((v) => v.id !== id);
    renderFeed();
  }

  // Ban account (Zynk only)
  const banBtn = e.target.closest(".mod-btn-ban");
  if (banBtn && currentUser && currentUser.username === "Zynk") {
    const id = Number(banBtn.dataset.id);
    const video = videos.find((v) => v.id === id);
    if (video) {
      const creator = video.creator;
      videos = videos.filter((v) => v.creator !== creator);
      renderFeed();
    }
  }
});
