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

function setupSelfCheckForm() {
  const form = document.getElementById("self-check-form");
  const result = document.getElementById("self-check-result");
  if (!(form instanceof HTMLFormElement) || !result) return;

  const getSum = (formData, names) =>
    names.reduce((sum, name) => sum + Number(formData.get(name)), 0);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const required = [
      "phq2_q1",
      "phq2_q2",
      "gad2_q1",
      "gad2_q2",
      "k6_q1",
      "k6_q2",
      "k6_q3",
      "k6_q4",
      "k6_q5",
      "k6_q6",
    ];
    const hasMissing = required.some((name) => !formData.get(name));
    if (hasMissing) {
      result.className = "self-check-result self-check-result--high";
      result.innerHTML = [
        '<p class="self-check-result-title">未回答の項目があります</p>',
        '<p class="self-check-result-message">すべての設問を選択してから結果を確認してください。</p>',
      ].join("");
      return;
    }

    const phq2 = getSum(formData, ["phq2_q1", "phq2_q2"]);
    const gad2 = getSum(formData, ["gad2_q1", "gad2_q2"]);
    const k6 = getSum(formData, ["k6_q1", "k6_q2", "k6_q3", "k6_q4", "k6_q5", "k6_q6"]);

    let level = "low";
    let message = "現在の負担は比較的低い範囲です。睡眠・食事・休息のリズムを維持し、定期的にセルフチェックを続けてください。";
    let advice = "小さな違和感が続く場合は、早めに相談先を確保しておくと安心です。";

    if (phq2 >= 3 || gad2 >= 3 || k6 >= 13) {
      level = "high";
      message = "こころの負担が高い可能性があります。ひとりで抱え込まず、早めに専門家へ相談することをおすすめします。";
      advice = "緊急性を感じる場合は、地域の医療機関・救急・公的相談窓口へ速やかに連絡してください。";
    } else if (phq2 >= 2 || gad2 >= 2 || k6 >= 8) {
      level = "middle";
      message = "負担のサインがみられます。生活リズムの調整とあわせて、相談できる人や窓口を確保しておきましょう。";
      advice = "1〜2週間で改善しない場合は、看護師・公認心理師への相談を検討してください。";
    }

    result.className = "self-check-result" + (level === "high" ? " self-check-result--high" : "");
    result.innerHTML = [
      `<p class="self-check-result-title">判定の目安：${level === "high" ? "要相談（優先）" : level === "middle" ? "注意" : "安定"}</p>`,
      `<p class="self-check-result-score">PHQ-2: ${phq2}/6 ・ GAD-2: ${gad2}/6 ・ K6: ${k6}/24</p>`,
      `<p class="self-check-result-message">${message}</p>`,
      `<p class="self-check-result-advice">${advice}</p>`,
    ].join("");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavToggle();
  setCurrentYear();
  setupHeroVideoPlaybackRate();
  setupHeroVideoFadeIn();
  setupSelfCheckForm();
});
