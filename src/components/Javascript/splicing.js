// 红色故事数据：旧照、新照、时间、事件、词条链接
const redStories = [
    {
        oldImg: '南昌起义旧.jpg',
        newImg: '南昌起义新.jpg',
        date: '1927年8月1日',
        title: '南昌起义',
        link: 'nanchangUprising.html'
    },
    {
        oldImg: '井冈山茨坪旧.jpg',
        newImg: '井冈山茨坪新.jpg',
        date: '1927年10月—1929年',
        title: '井冈山革命根据地',
        link: 'jingGangShan.html'
    },
    {
        oldImg: '于都浮桥旧.jpeg',
        newImg: '于都新.jpg',
        date: '1934年10月',
        title: '红军长征出发地',
        link: 'Yudu.html'
    },
    {
        oldImg: '泸定桥旧.jpg',
        newImg: '泸定桥新.jpg',
        date: '1935年5月29日',
        title: '飞夺泸定桥',
        link: 'ludingBridge.html'
    },
    {
        oldImg: '遵义会议旧.jpg',
        newImg: '遵义会议新.jpg',
        date: '1935年1月',
        title: '遵义会议',
        link: 'zunyiConference.html'
    },
    {
        oldImg: '延安旧.webp',
        newImg: '延安新.png',
        date: '1935年10月—1948年3月',
        title: '延安',
        link: 'yanAn.html'
    }
];
// 用模板字符串拼接六张「新旧对比」卡片的 HTML
const redStoryHtml = redStories.map((story) => `
    <div class="slider-box">
        <div class="img-wrap">
            <img src="./static/image/${story.oldImg}" alt="${story.title}历史老照片">
            <img src="./static/image/${story.newImg}" alt="${story.title}今日实景" class="img-now">
            <div class="line"></div>
            <input type="range" min="0" max="100" value="50" class="slider-input"
                aria-label="${story.title}新旧照片对比">
        </div>
        <div class="info-bar">
            <a class="time" href="${story.link}" target="_blank" rel="noopener">${story.date}</a>
            <a class="event" href="${story.link}" target="_blank" rel="noopener">${story.title}</a>
        </div>
    </div>
`).join('');
document.getElementById('redStoryGrid').innerHTML = redStoryHtml;
// 初始化所有滑动对比条
document.querySelectorAll('.slider-box').forEach((box) => {
    const slider = box.querySelector('.slider-input');
    // 初始化一次，保证初始分割位置正确
    box.style.setProperty('--percent', slider.value + '%');
    // 监听拖动
    slider.addEventListener('input', (e) => {
        box.style.setProperty('--percent', e.target.value + '%');
    });
});