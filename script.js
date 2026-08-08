/* =========================================================
   拾味小馆展示站 · 交互脚本（优化版）
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      // 防止背景滚动
      document.body.style.overflow = open ? "hidden" : "";
    });

    // 点击菜单项后自动收起
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- 导航滚动阴影 + 进度条 ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("navProgress");

  function onScroll() {
    if (!nav) return;
    var y = window.scrollY;

    // 导航栏阴影
    nav.classList.toggle("is-scrolled", y > 8);

    // 滚动进度条
    if (progress) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? Math.min((y / docHeight) * 100, 100) : 0;
      progress.style.width = pct + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动揭示动画（带交错延迟） ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // 同级元素交错出现
            var siblings = entry.target.parentElement.querySelectorAll(".reveal");
            var idx = Array.prototype.indexOf.call(siblings, entry.target);
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, idx * 80);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 页脚年份 ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 平滑锚点滚动（兼容性） ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // 更新 URL hash 但不触发跳转
      history.pushState(null, null, targetId);
    });
  });
})();
