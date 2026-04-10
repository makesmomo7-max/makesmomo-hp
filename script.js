function setupNavToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (!navToggle || !navList) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navList.addEventListener("click", (e) => {
    if (e.target instanceof HTMLAnchorElement) {
      navList.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("click", (e) => {
    if (
      navList.classList.contains("is-open") &&
      !navToggle.contains(e.target) &&
      !navList.contains(e.target)
    ) {
      navList.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

function setCurrentYear() {
  const yearSpan = document.getElementById("js-year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
}

/** ヒーロー背景動画：ゆったり再生（表示は CSS で常時可視） */
function setupHeroVideoPlaybackRate() {
  const video = document.querySelector(".hero-bg-video");
  if (!video) return;

  const rate = 0.5;

  const apply = () => {
    try {
      video.playbackRate = rate;
    } catch (_) {
      /* noop */
    }
  };

  apply();
  video.addEventListener("loadedmetadata", apply);
  video.addEventListener("play", apply);
}

/** 互換：動画は CSS で表示済み。クラス付与は任意（将来フェード用） */
function setupHeroVideoFadeIn() {
  const video = document.querySelector(".hero-bg-video");
  if (!video) return;
  video.classList.add("hero-bg-video--visible");
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavToggle();
  setCurrentYear();
  setupHeroVideoPlaybackRate();
  setupHeroVideoFadeIn();
});
