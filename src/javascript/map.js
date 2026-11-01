(function () {
        var DEFAULT_CURSOR = 'pointer';
        // 拖拽演示的中心点
        var CENTER = [114.596693, 37.999321];

        var zoomEl = document.getElementById('map-zoom');
        var centerEl = document.getElementById('map-center');
        var statusEl = document.getElementById('dragStatus');

        if (typeof AMap === 'undefined') {
          centerEl.textContent = '地图脚本未加载，请检查 Key 与网络';
          zoomEl.textContent = '—';
          statusEl.textContent = '地图脚本未加载';
          return;
        }

        var map = new AMap.Map('container', {
          zoom: 17,
          center: CENTER,
          resizeEnable: true
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

        /* ---------- 标记点 ---------- */
        var marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: CENTER,
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

        // 命中判断：标记点图标约 20×34，锚点在图标底部中心
        function hitTest(px) {
          var mp = map.lngLatToContainer(marker.getPosition());
          var dx = px.getX() - mp.getX();
          var dy = px.getY() - mp.getY();
          if (Math.abs(dx) <= 14 && dy >= -36 && dy <= 4) {
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
        function formatLngLat(e) {
          var p = e && e.lnglat ? e.lnglat : e;
          if (!p || typeof p.lng !== 'number' || typeof p.lat !== 'number') {
            return '';
          }
          return '（' + p.lng.toFixed(6) + ', ' + p.lat.toFixed(6) + '）';
        }

        function showInfoM(e) {
          statusEl.textContent = '您拖拽了标记点！' + formatLngLat(e);
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
      })();(function () {
        var DEFAULT_CURSOR = 'pointer';
        // 拖拽演示的中心点
        var CENTER = [114.596693, 37.999321];

        var zoomEl = document.getElementById('map-zoom');
        var centerEl = document.getElementById('map-center');
        var statusEl = document.getElementById('dragStatus');

        if (typeof AMap === 'undefined') {
          centerEl.textContent = '地图脚本未加载，请检查 Key 与网络';
          zoomEl.textContent = '—';
          statusEl.textContent = '地图脚本未加载';
          return;
        }

        var map = new AMap.Map('container', {
          zoom: 17,
          center: CENTER,
          resizeEnable: true
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

        /* ---------- 标记点 ---------- */
        var marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: CENTER,
          zIndex: 130
        });

        map.add(marker);

        /* ---------- 标记点拖拽（由本页接管鼠标事件） ---------- */
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

        // 命中判断：标记点图标约 20×34，锚点在图标底部中心
        function hitTest(px) {
          var mp = map.lngLatToContainer(marker.getPosition());
          var dx = px.getX() - mp.getX();
          var dy = px.getY() - mp.getY();
          if (Math.abs(dx) <= 14 && dy >= -36 && dy <= 4) {
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
        function formatLngLat(e) {
          var p = e && e.lnglat ? e.lnglat : e;
          if (!p || typeof p.lng !== 'number' || typeof p.lat !== 'number') {
            return '';
          }
          return '（' + p.lng.toFixed(6) + ', ' + p.lat.toFixed(6) + '）';
        }

        function showInfoM(e) {
          statusEl.textContent = '您拖拽了标记点！' + formatLngLat(e);
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
      })();