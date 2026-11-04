const ROUTE_DATA = [
  {
    badge: "革命摇篮",
    name: "井冈山精神寻访之旅",
    desc: '踏访中国革命摇篮，感悟"星星之火可以燎原"的初心力量',
    tags: ["党性教育", "山岳景观"],
    // 行程节点：第一个自动当起点，最后一个自动当终点
    stops: ["井冈山革命博物馆", "茨坪毛泽东旧居", "黄洋界哨口", "龙江书院", "五指峰"],
    days: "3",
    stay: "天2晚",
    audience: "党支部 / 研学团体",
    short: "井冈山",
  },
  {
    badge: "革命圣地",
    name: "延安精神溯源之旅",
    desc: "走进陕北黄土高原，重温党中央在延安十三年的峥嵘岁月",
    tags: ["党性教育", "窑洞体验"],
    stops: ["枣园革命旧址", "杨家岭旧址", "延安革命纪念馆", "宝塔山", "南泥湾"],
    days: "4",
    stay: "天3晚",
    audience: "党员干部 / 培训学员",
    short: "延安",
  },
  {
    badge: "伟大转折",
    name: "遵义会议感悟之旅",
    desc: "在黔北重镇体会中国革命历史上生死攸关的伟大转折点",
    tags: ["历史研学", "黔北风情"],
    stops: ["遵义会议会址", "红军山烈士陵园", "娄山关战斗遗址", "土城四渡赤水纪念馆"],
    days: "2",
    stay: "天1晚",
    audience: "周末短途 / 家庭研学",
    short: "遵义",
  },
  {
    badge: "赶考出发",
    name: "西柏坡初心之旅",
    desc: '在革命圣地最后一个农村指挥所，读懂"两个务必"的深刻内涵',
    tags: ["党性教育", "京津冀周边"],
    stops: ["西柏坡纪念馆", "中共中央旧址", "七届二中全会旧址", "滹沱河畔观景"],
    days: "2",
    stay: "天1晚",
    audience: "京津冀周边 / 团建",
    short: "西柏坡",
  },
];

/* 一条路线 -> 一段 HTML 字符串 */
const buildRouteItem = (route) => {
  // 标签
  const tags = route.tags.map((tag) => `<span class="route-tag">${tag}</span>`).join("");

  // 行程节点：首尾拼接 start / end 类名
  const stops = route.stops
    .map((stop, index) => {
      const pos =
        index === 0 ? " start" : index === route.stops.length - 1 ? " end" : "";
      return `<div class="path-node"><div class="node-dot${pos}"></div><div class="node-label">${stop}</div></div>`;
    })
    .join("");

  return `<div class="route-item">
        <div class="route-info">
          <span class="route-badge">${route.badge}</span>
          <div class="route-name">${route.name}</div>
          <div class="route-desc">${route.desc}</div>
          <div class="route-tags">${tags}</div>
        </div>
        <div class="route-path">
          <div class="path-line"></div>
          <div class="path-nodes">${stops}</div>
        </div>
        <div class="route-action">
          <div class="route-meta">
            <div class="route-days">${route.days}<span>${route.stay}</span></div>
            <div class="route-audience">适合：${route.audience}</div>
          </div>
          <button class="route-btn" type="button" data-short="${route.short}">查看详情</button>
        </div>
      </div>`;
};

/* 把拼接好的字符串一次性写进 .route-list */
const renderRouteList = () => {
  const list = document.querySelector(".route-list");
  if (!list) return;

  list.innerHTML = ROUTE_DATA.map(buildRouteItem).join("\n");

  // 事件委托：不用给每个按钮单独绑事件
  list.addEventListener("click", (event) => {
    const btn = event.target.closest(".route-btn");
    if (!btn) return;
    if (typeof window.showToast === "function") {
      window.showToast(`查看${btn.dataset.short}路线详情`);
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderRouteList);
} else {
  renderRouteList();
}
