var main = {
	init: function() {
		main.initMap()
		main.rem(950, 950)
		main.fw()
		main.pc()
	},
	fw: function() {
		var myChart = echarts.init(document.getElementById('fw'));

		// 指定图表的配置项和数据
		var option = {
			title: {

			},
			tooltip: {},
			grid: {
				left: '0%',
				right: '0%',
				bottom: '3%',
				top: "0%"
			},

			xAxis: {
				show: false,
				type: 'value',
				splitLine: {
					show: false
				},
				nameLocation: "center",
				boundaryGap: [0, 0.01]
			},
			yAxis: {
				show: false,
				nameLocation: "start",
				type: 'category',
				splitLine: {
					show: false
				},
				data: ['开发区', '保税区', '高新区', '东僵报税港区', '生态城']
			},
			series: [{
				name: '2011年',
				type: 'bar',
				label: {
					show: true,
					position: [0, 25],
					formatter: '{b0}:  {c0}',
					color: "#44A1F3",
					fontSize: 14
				},
				itemStyle: {
					borderRadius: 5,
					color: "#44A1F3"
				},
				barWidth: 20,
				showBackground: true,
				backgroundStyle: {
					color: "#F0F2F5",
					borderRadius: 5
				},
				data: [18203, 23489, 29034, 104970, 131744, 630230]
			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	pc: function() {
		var myChart = echarts.init(document.getElementById('pc'));
		var e = 80;
		// 指定图表的配置项和数据
		var option = {
			"color": [{
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0.4,
				y2: 1,
				colorStops: [{
					offset: 0,
					color: '#20C5D8' // 0% 处的颜色
				}, {
					offset: 1,
					color: '#6BA5E8' // 100% 处的颜色
				}],
				globalCoord: false // 缺省为 false
			},"#DDDDDD" ],
			
			series: {
				name: '',
				type: 'pie',
				radius: ['65%', '85%'],
				avoidLabelOverlap: true,
				hoverAnimation: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
						value: e,
						name: ''
					},
					{
						value: 100 - e,
						name: ''
					}
				]
			}

		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	initMap: function() {
		//设置中心点坐标
		var center = new TMap.LatLng(26.870355, 100.239704);
		//初始化地图
		var map = new TMap.Map('container', {
			center: center,
			zoom: 15,
			maxZoom: 16
		});
		// 移除
		map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM)
		map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)

		//初始化imageTileLayer
		var imageTileLayer = new TMap.ImageTileLayer({
			getTileUrl: function(x, y, z) {
				//拼接瓦片URL
				var url = 'https://3gimg.qq.com/visual/lbs_gl_demo/image_tiles_layers/' + z + '/' + x + '_' + y + '.png';
				return url;
			},
			tileSize: 256, //瓦片像素尺寸
			minZoom: 14, //显示自定义瓦片的最小级别
			maxZoom: 16, //显示自定义瓦片的最大级别
			visible: true, //是否可见
			zIndex: 5000, //层级高度（z轴）
			opacity: 1, //图层透明度：1不透明，0为全透明
			map: map, //设置图层显示到哪个地图实例中
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
