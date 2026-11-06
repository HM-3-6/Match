/* 云打卡轮播图：左右切换按钮 */
(function () {
  var carousel = document.querySelector('.radio-carousel');
  if (!carousel) {
    return;
  }

  var radios = Array.prototype.slice.call(carousel.querySelectorAll('input[name="slider"]'));
  if (radios.length < 2) {
    return;
  }

  function currentIndex() {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return i;
      }
    }
    return 0;
  }

  function go(step) {
    var next = (currentIndex() + step + radios.length) % radios.length;
    radios[next].checked = true;
  }

  var prev = carousel.querySelector('.carousel-arrow.prev');
  var next = carousel.querySelector('.carousel-arrow.next');

  if (prev) {
    prev.addEventListener('click', function () {
      go(-1);
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      go(1);
    });
  }
})();
