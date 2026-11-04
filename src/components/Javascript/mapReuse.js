(function (global) {
  'use strict';

  function initMapDemo(config) {
    var DEFAULT_CURSOR = 'pointer';
    // 标记点与初始视野中心
    var initialCenter = config.center;
    var ROUTE = config.route || [];

    var zoomEl = document.getElementById('map-zoom');
    var centerEl = document.getElementById('map-center');
    var statusEl = document.getElementById('dragStatus');
    var neEl = document.getElementById('bounds-ne');
    var swEl = document.getElementById('bounds-sw');

    if (typeof AMap === 'undefined') {
      centerEl.textContent = '地图脚本未加载，请检查 Key 与网络';
      zoomEl.textContent = '—';
      statusEl.textContent = '地图脚本未加载';
      neEl.textContent = swEl.textContent = '—';
      return;
    }

    var map = new AMap.Map('container', {
      zoom: config.zoom,
      center: initialCenter,
      resizeEnable: true,
      showLabel: false
    });

    /* ---------- 地图控件 ---------- */
    var scaleControl = new AMap.Scale({ position: { left: '12px', bottom: '190px' } });
    var toolBar = new AMap.ToolBar({ position: { top: '130px', right: '12px' } });
    var controlBar = new AMap.ControlBar({ position: { top: '210px', right: '12px' } });
    var hawkEye = new AMap.HawkEye({ position: { bottom: '170px', right: '12px' } });

    map.addControl(scaleControl);
    map.addControl(toolBar);
    map.addControl(controlBar);
    map.addControl(hawkEye);

    var controlMap = {
      scale: scaleControl,
      toolbar: toolBar,
      controlbar: controlBar,
      hawkeye: hawkEye
    };

    document.querySelectorAll('#controlPanel input[data-control]').forEach(function (input) {
      input.addEventListener('change', function () {
        var control = controlMap[this.getAttribute('data-control')];
        if (!control) {
          return;
        }
        if (this.checked) {
          control.show();
        } else {
          control.hide();
        }
      });
    });

    /* ---------- 鼠标样式 ---------- */
    map.setDefaultCursor(DEFAULT_CURSOR);

    var radios = document.querySelectorAll('input[name="cursor"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', function () {
        if (this.checked) {
          map.setDefaultCursor(this.value);
        }
      });
    }

    /* ---------- 地图级别与中心点 ---------- */
    function logMapinfo() {
      var center = map.getCenter();
      zoomEl.textContent = map.getZoom();
      centerEl.textContent = center.lng.toFixed(6) + ', ' + center.lat.toFixed(6);
    }

    map.on('moveend', logMapinfo);
    map.on('zoomend', logMapinfo);
    logMapinfo();

    /* ---------- 地图显示范围限制 ---------- */
    function formatLngLat(p) {
      return p.lng.toFixed(6) + ', ' + p.lat.toFixed(6);
    }

    function logBounds() {
      var bounds = map.getLimitBounds();
      if (bounds) {
        neEl.textContent = formatLngLat(bounds.northEast);
        swEl.textContent = formatLngLat(bounds.southWest);
      } else {
        neEl.textContent = swEl.textContent = '未限定';
      }
    }

    function lockBounds() {
      map.setLimitBounds(new AMap.Bounds(config.limitSW, config.limitNE));
      logBounds();
    }

    function unlockBounds() {
      map.clearLimitBounds();
      logBounds();
    }

    lockBounds();
    document.getElementById('lockBoundsBtn').onclick = lockBounds;
    document.getElementById('unlockBoundsBtn').onclick = unlockBounds;

    /* ---------- 地点路线 ---------- */
    var routeOverlays = null;
    var routeStatusEl = document.getElementById('routeStatus');

    function makeRouteLabel(p) {
      var options = {
        text: (p.date ? '<span style="color:#b71c1c;font-weight:600">' + p.date + '</span><br>' : '') + p.name,
        position: p.lnglat,
        zIndex: 140,
        style: {
          'background-color': 'rgba(255, 255, 255, 0.92)',
          'border': '1px solid #e6a8a8',
          'border-radius': '3px',
          'padding': '1px 5px',
          'color': '#333',
          'font-size': '10px',
          'line-height': '1.35',
          'text-align': 'center',
          'white-space': 'nowrap',
          'box-shadow': '0 1px 2px rgba(0, 0, 0, 0.12)'
        }
      };
      var offset = p.offset || [0, 4];
      options.offset = new AMap.Pixel(offset[0], offset[1]);
      return new AMap.Text(options);
    }

    function buildRoute() {
      var line = new AMap.Polyline({
        path: ROUTE.map(function (p) {
          return p.lnglat;
        }),
        strokeColor: '#d32f2f',
        strokeWeight: 4,
        strokeOpacity: 0.9,
        lineJoin: 'round',
        zIndex: 120
      });

      routeOverlays = [line];

      ROUTE.forEach(function (p) {
        routeOverlays.push(makeRouteLabel(p));
        routeOverlays.push(makeFlag(p));
      });
    }

    function showRoute() {
      if (!routeOverlays) {
        buildRoute();
      }
      map.add(routeOverlays);
      map.setFitView(routeOverlays, false, [160, 300, 400, 240]);
      routeStatusEl.textContent = '已显示' + config.name + '路线';
    }

    function hideRoute() {
      if (!routeOverlays) {
        return;
      }
      map.remove(routeOverlays);
      routeStatusEl.textContent = '路线已隐藏';
    }

    document.getElementById('showRouteBtn').onclick = showRoute;
    document.getElementById('hideRouteBtn').onclick = hideRoute;

    /* ---------- 节点红旗与打卡 ---------- */
    var infoWindow = null;
    var activeNode = null;

    function flagHtml(p) {
      return '<div class="lm-flag' + (p.checked ? ' checked' : '') + '">' +
        '<span class="lm-pole"></span><span class="lm-cloth"></span>' +
        '</div>';
    }

    function popupHtml(p) {
      return '<div class="route-popup">' +
        (p.date ? '<div class="rp-date">' + p.date + '</div>' : '') +
        '<div class="rp-name">' + p.name + '</div>' +
        (p.checked
          ? '<span class="rp-done">已打卡</span>'
          : '<button type="button" class="rp-btn">打卡</button>') +
        '</div>';
    }

    function closePopup() {
      if (infoWindow) {
        infoWindow.close();
      }
      activeNode = null;
    }

    function openPopup(p, flag) {
      if (!infoWindow) {
        infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -34)
        });
        // 点击红旗之外（且不在弹窗内）的区域时关闭弹窗
        document.addEventListener('click', function (e) {
          if (!activeNode) {
            return;
          }
          var target = e.target;
          if (target.closest('.route-popup') || target.closest('.amap-info')) {
            return;
          }
          var markerEl = target.closest('.amap-marker');
          if (markerEl && markerEl.querySelector('.lm-flag')) {
            return;
          }
          closePopup();
        });
      }

      activeNode = p;
      infoWindow.setContent(popupHtml(p));
      infoWindow.open(map, p.lnglat);

      var btn = document.querySelector('.route-popup .rp-btn');
      if (btn) {
        btn.addEventListener('click', function (evt) {
          evt.stopPropagation();
          p.checked = true;
          flag.setContent(flagHtml(p));
          infoWindow.setContent(popupHtml(p));
          infoWindow.open(map, p.lnglat);
        });
      }
    }

    function togglePopup(p, flag) {
      if (activeNode === p) {
        closePopup();
        return;
      }
      openPopup(p, flag);
    }

    function makeFlag(p) {
      var off = p.flagOffset || [-8, -28];
      var flag = new AMap.Marker({
        position: p.lnglat,
        content: flagHtml(p),
        offset: new AMap.Pixel(off[0], off[1]),
        zIndex: 150
      });
      flag.on('click', function () {
        togglePopup(p, flag);
      });
      return flag;
    }

    /* ---------- 标记点 ---------- */
    var marker = new AMap.Marker({
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      position: initialCenter,
      zIndex: 130
    });

    map.add(marker);

    /* ---------- 标记点拖拽（由本页接管鼠标事件） ---------- */
    // 独立的拖拽事件登记表：AMap 2.0 覆盖物的 emit 在自定义拖拽场景下不可靠，
    // 这里用同样语义的 on/off 维护监听，保证绑定、解绑行为与官方示例一致。
    var dragHandlers = [];

    function onDrag(fn) {
      dragHandlers.push(fn);
    }

    function offDrag(fn) {
      var index = dragHandlers.indexOf(fn);
      if (index > -1) {
        dragHandlers.splice(index, 1);
      }
    }

    function emitDrag(payload) {
      var list = dragHandlers.slice();
      for (var i = 0; i < list.length; i++) {
        list[i](payload);
      }
    }

    var container = document.getElementById('container');
    var dragTarget = null;   // 当前拖拽的标记点
    var dragStart = null;    // 按下时的地理坐标
    var dragBase = null;     // 标记点初始坐标

    function toPixel(evt) {
      var rect = container.getBoundingClientRect();
      return new AMap.Pixel(evt.clientX - rect.left, evt.clientY - rect.top);
    }

    function toLngLat(evt) {
      var px = toPixel(evt);
      var fn = map.containerToLngLat || map.pixelToLngLat;
      return fn.call(map, px);
    }

    // 命中判断：图标约 19×31，命中区覆盖图标本体（含上方少量余量）
    function hitTest(px) {
      var mp = map.lngLatToContainer(marker.getPosition());
      var dx = px.getX() - mp.getX();
      var dy = px.getY() - mp.getY();
      if (Math.abs(dx) <= 15 && dy >= -36 && dy <= 34) {
        return marker;
      }
      return null;
    }

    function onMouseDown(evt) {
      if (evt.button !== 0 || !container.contains(evt.target)) {
        return;
      }
      var px = toPixel(evt);
      var point = map.containerToLngLat ? map.containerToLngLat(px) : map.pixelToLngLat(px);
      var target = hitTest(px);
      if (!target) {
        return;
      }

      // 命中标记点时阻止地图平移，由本页完成拖拽
      evt.stopImmediatePropagation();
      evt.preventDefault();

      dragTarget = target;
      dragStart = { lng: point.lng, lat: point.lat };

      var mp = marker.getPosition();
      dragBase = { lng: mp.lng, lat: mp.lat };

      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('mouseup', onMouseUp, true);
    }

    function onMouseMove(evt) {
      if (!dragTarget) {
        return;
      }
      evt.preventDefault();

      var point = toLngLat(evt);
      var dLng = point.lng - dragStart.lng;
      var dLat = point.lat - dragStart.lat;

      marker.setPosition([dragBase.lng + dLng, dragBase.lat + dLat]);

      // 派发 dragging 事件，供绑定/解绑逻辑使用
      emitDrag({ type: 'dragging', target: marker, lnglat: point });
    }

    function onMouseUp(evt) {
      if (!dragTarget) {
        return;
      }
      // 拖拽结束：解除与本次拖拽相关的全局监听
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('mouseup', onMouseUp, true);
      dragTarget = null;
      dragBase = null;
      dragStart = null;
    }

    document.addEventListener('mousedown', onMouseDown, true);

    /* ---------- 拖拽事件的绑定与解绑 ---------- */
    function formatDragLngLat(e) {
      var p = e && e.lnglat ? e.lnglat : e;
      if (!p || typeof p.lng !== 'number' || typeof p.lat !== 'number') {
        return '';
      }
      return '（' + p.lng.toFixed(6) + ', ' + p.lat.toFixed(6) + '）';
    }

    function showInfoM(e) {
      statusEl.textContent = '您拖拽了标记点！' + formatDragLngLat(e);
    }

    var bound = false;

    function bindEvents() {
      if (bound) {
        statusEl.textContent = '拖拽事件已处于绑定状态';
        return;
      }
      onDrag(showInfoM);
      bound = true;
      statusEl.textContent = '已绑定拖拽事件，拖拽标记点试试';
    }

    function unbindEvents() {
      offDrag(showInfoM);
      bound = false;
      statusEl.textContent = '已解绑拖拽事件，拖拽不再提示';
    }

    document.getElementById('bindBtn').onclick = bindEvents;
    document.getElementById('unbindBtn').onclick = unbindEvents;

    bindEvents();
  }

  global.initMapDemo = initMapDemo;
})(window);
