
/* =========================
   PROFILE SAMPLE 自動スクロール
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".sample-track");

  // TOPページ以外では実行しない
  if (!track) return;

  const originals = Array.from(
    track.querySelectorAll(".sample-card:not(.sample-clone)")
  );

  if (originals.length === 0) return;

  // カードを複製して無限ループにする
  originals.forEach((card) => {
    const copy = card.cloneNode(true);

    copy.setAttribute("aria-hidden", "true");
    copy.classList.add("sample-clone");

    track.appendChild(copy);
  });

  // 自動スクロール用のCSSを適用
  track.classList.add("sample-auto-scroll");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // 自動スクロールの速さ（数字を大きくすると速くなる）
  const SPEED = 30;

  let lastTime = null;
  let pausedUntil = 0;
  let pausedByFocus = false;

  // 複製したカードまでの距離
  function getLoopWidth() {
    return (
      track.children[originals.length].offsetLeft -
      track.children[0].offsetLeft
    );
  }

  // 最後まで進んだら自然に先頭へ戻す
  function normalizeScroll() {
    const width = getLoopWidth();

    if (width <= 0) return;

    if (track.scrollLeft >= width) {
      track.scrollLeft -= width;
    }
  }

  // 少しずつ横に動かす
  function animate(time) {

    if (lastTime !== null) {
      const elapsed = Math.min(
        (time - lastTime) / 1000,
        0.1
      );

      const isHovered = track.matches(":hover");

      const isPaused =
        isHovered ||
        pausedByFocus ||
        document.hidden ||
        time < pausedUntil;

      if (!isPaused && !reducedMotion.matches) {
        track.scrollLeft += SPEED * elapsed;
        normalizeScroll();
      }
    }

    lastTime = time;
    requestAnimationFrame(animate);
  }

  // キーボード操作中は一時停止
  track.addEventListener("focusin", () => {
    pausedByFocus = true;
  });

  track.addEventListener("focusout", (event) => {
    if (!track.contains(event.relatedTarget)) {
      pausedByFocus = false;
    }
  });

  // タッチ操作後は少し停止
  track.addEventListener(
    "touchstart",
    () => {
      pausedUntil = performance.now() + 2500;
    },
    { passive: true }
  );

  // ホイール操作後も少し停止
  track.addEventListener(
    "wheel",
    () => {
      pausedUntil = performance.now() + 1800;
    },
    { passive: true }
  );

  window.addEventListener("resize", normalizeScroll);

  // 自動スクロール開始
  requestAnimationFrame(animate);

});



// =========================
// プロフィール検索機能
// =========================

document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.querySelector(
    "#profile-search-input"
  );

  const profileCards = document.querySelectorAll(
    ".profile-card"
  );

  const noResults = document.querySelector(
    ".no-results"
  );

  // 一覧ページ以外では実行しない
  if (!searchInput) return;

  // 入力された文字で検索
  searchInput.addEventListener("input", () => {

    const keyword = searchInput.value
      .trim()
      .toLowerCase();

    let matchCount = 0;

    profileCards.forEach((card) => {

      const name = (card.dataset.name || "")
        .toLowerCase();

      const isMatch = name.includes(keyword);

      // 一致したカードだけ表示
      card.hidden = !isMatch;

      if (isMatch) {
        matchCount++;
      }

    });

    // 一致する人がいない場合
    if (noResults) {
      noResults.hidden = matchCount !== 0;
    }

  });

});



/* =========================
   個人プロフィールの切り替え
========================= */

document.addEventListener("DOMContentLoaded", () => {

  // プロフィールデータ
  const profiles = [
    {
      id: "01",
      name: "花子",
      image: "images/profile-hanako.png"
    },
    {
      id: "02",
      name: "太郎",
      image: "images/profile-taro.png"
    },
{
      id: "03",
      name: "みう",
      image: "images/profile-miu.png"
    },
    { id: "04", name: "NAME 04", image: null },
    { id: "05", name: "NAME 05", image: null },
    { id: "06", name: "NAME 06", image: null },
    { id: "07", name: "NAME 07", image: null },
    { id: "08", name: "NAME 08", image: null },
    { id: "09", name: "NAME 09", image: null }
  ];

  const profileImage = document.querySelector(
    ".detail-profile-image"
  );

  const placeholder = document.querySelector(
    ".detail-placeholder"
  );

  const profileTitle = document.querySelector(
    ".detail-placeholder-title"
  );

  const profileText = document.querySelector(
    ".detail-placeholder-text"
  );

  const prevButton = document.querySelector(
    ".detail-prev"
  );

  const nextButton = document.querySelector(
    ".detail-next"
  );

  // 個人ページ以外では実行しない
  if (
    !profileImage ||
    !placeholder ||
    !profileTitle ||
    !profileText ||
    !prevButton ||
    !nextButton
  ) return;

  // URLからIDを取得
  const params = new URLSearchParams(
    window.location.search
  );

  const id = params.get("id") || "01";

  let currentIndex = profiles.findIndex(
    (profile) => profile.id === id
  );

  if (currentIndex === -1) {
    currentIndex = 0;
  }

  const currentProfile = profiles[currentIndex];

  // 画像がある場合は画像を表示
  if (currentProfile.image) {

    profileImage.src = currentProfile.image;
    profileImage.alt =
      currentProfile.name + "のプロフィール帳";

    profileImage.style.display = "block";
    placeholder.style.display = "none";

  } else {

    // 画像がない場合は仮表示
    profileImage.style.display = "none";
    placeholder.style.display = "flex";

    profileTitle.textContent =
      "PROFILE " + currentProfile.id;

    profileText.textContent =
      currentProfile.name + " のプロフィール帳が入ります";

  }

  // 前後のプロフィール
  const prevIndex =
    (currentIndex - 1 + profiles.length) % profiles.length;

  const nextIndex =
    (currentIndex + 1) % profiles.length;

  const prevProfile = profiles[prevIndex];
  const nextProfile = profiles[nextIndex];

  // 前へ・次へボタンのリンク先
  prevButton.href =
    "profile.html?id=" + prevProfile.id;

  nextButton.href =
    "profile.html?id=" + nextProfile.id;

  prevButton.setAttribute(
    "aria-label",
    prevProfile.name + " のプロフィールへ"
  );

  nextButton.setAttribute(
    "aria-label",
    nextProfile.name + " のプロフィールへ"
  );

});
