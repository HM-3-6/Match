const navs=document.querySelectorAll('.tab-item');
const cons=document.querySelectorAll('.tab-content>div');
navs.forEach(item=>{
  item.onclick=()=>{
    // 清空激活
    navs.forEach(n=>n.classList.remove('active'))
    cons.forEach(c=>c.classList.remove('show'))
    // 选中当前
    item.classList.add('active')
    cons[item.dataset.index].classList.add('show')
  }
});