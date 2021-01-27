var main = {
	init: function() {
		main.initMap()
		main.rem(750,750)
	},
	initMap: function() {
		//设置中心点坐标
		var center = new TMap.LatLng(26.870355,100.239704);
		//初始化地图
		var map = new TMap.Map('container', {
		    center: center,
		    zoom: 15,
		    maxZoom:16
		});
		// 移除
			map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM)
			map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)
		
		//初始化imageTileLayer
		var imageTileLayer = new TMap.ImageTileLayer({
		    getTileUrl: function (x, y, z) {
		        //拼接瓦片URL
		        var url='https://3gimg.qq.com/visual/lbs_gl_demo/image_tiles_layers/' + z + '/' + x + '_' + y +'.png' ;
		        return url;
		    },
		    tileSize: 256,  //瓦片像素尺寸
		    minZoom: 14,    //显示自定义瓦片的最小级别
		    maxZoom: 16,    //显示自定义瓦片的最大级别
		    visible: true,  //是否可见
		    zIndex: 5000,   //层级高度（z轴）
		    opacity: 1,   //图层透明度：1不透明，0为全透明
		    map: map,       //设置图层显示到哪个地图实例中
		});
		
	},
	rem: function(designWidth, maxWidth) {
		var doc = document,
			win = window,
			docEl = doc.documentElement,
			remStyle = document.createElement("style"),
			tid;

		function refreshRem() {
			var width = docEl.getBoundingClientRect().width;
			maxWidth = maxWidth || 540;
			width > maxWidth && (width = maxWidth);
			var rem = width * 100 / designWidth;
			remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
		}

		if (docEl.firstElementChild) {
			docEl.firstElementChild.appendChild(remStyle);
		} else {
			var wrap = doc.createElement("div");
			wrap.appendChild(remStyle);
			doc.write(wrap.innerHTML);
			wrap = null;
		}
		//要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
		refreshRem();

		win.addEventListener("resize", function() {
			clearTimeout(tid); //防止执行两次
			tid = setTimeout(refreshRem, 300);
		}, false);

		win.addEventListener("pageshow", function(e) {
			if (e.persisted) { // 浏览器后退的时候重新计算
				clearTimeout(tid);
				tid = setTimeout(refreshRem, 300);
			}
		}, false);

		/* if (doc.readyState === "complete") {
			doc.body.style.fontSize = "16px";
		} else {
			doc.addEventListener("DOMContentLoaded", function(e) {
				doc.body.style.fontSize = "16px";
			}, false);
		} */
	}

}

window.appInit = main.init
