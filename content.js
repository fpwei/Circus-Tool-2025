// content.js
(function () {
  const TARGET_SELECTOR = ".game_page .board";
  let target = null;
  // 若已存在浮窗，避免重複插入
  if (document.getElementById("section-viewer")) return;

  // === 創建懸浮窗容器 ===
  const container = document.createElement("div");
  container.id = "section-viewer";
  container.innerHTML = `
    <div class="sv-content">載入中...</div>
    <button class="sv-complete-btn">直接完成</button>
  `;
  document.body.appendChild(container);

  const contentBox = container.querySelector(".sv-content");
  const completeBtn = container.querySelector(".sv-complete-btn");

  // === 按鈕事件 ===
  completeBtn.addEventListener("click", () => {
    // 取得所有 card 元素
    const cards = document.querySelectorAll('.card');

    // 建立一個 Map，以 img src 為 key
    const map = new Map();

    cards.forEach(card => {
      const img = card.querySelector('.back img');
      if (!img) return;

      const src = img.src;
      if (!map.has(src)) {
        map.set(src, []);
      }
      map.get(src).push(card);
    });

    // 依序點擊相同 src 的卡片
    (async () => {
      for (const [src, group] of map.entries()) {
        console.log(`點擊同圖卡組: ${src}`);
        for (const card of group) {
          card.click();
        }
      }
    })();
  });

  const app = document.querySelector("#app");
  updateContent();
  const observer = new MutationObserver(() => {
    const newTarget = document.querySelector(TARGET_SELECTOR);

    // 若 target 改變（例如舊的被刪掉、新的出現）
    if (newTarget !== target) {
      updateContent();
    }
  });

  observer.observe(app, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // === 更新浮窗內容 ===
  function updateContent() {
    const board = document.querySelector(TARGET_SELECTOR);
    target = board;
    if (board) {
      contentBox.innerHTML = board.outerHTML;
      container.classList.remove("sv-hide");
    } else {
      container.classList.add("sv-hide");
    }
  }
})();
