
var http = {
	url:'http://zxbb.zwb.tjbh.gov.cn/JCHnaccForm/Api/Public/',
	post:function(url,json,success){
		$.post(http.url+url,json,function(res){
			success(res)
		})
	}
}

var main = {
	init: function() {
		//main.initMap()
		main.rem(950, 950)
		main.fw()
		main.pc()
		main.fb()
		main.bw()
		main.bk()
		main.qs()
		main.lj()
		//http.post()
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
			color: [{
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
			}, "#DDDDDD"],
			grid: {
				left: '0%',
				right: '0%',
				bottom: '0%',
				top: "0%"
			},
			graphic: [{ //环形图中间添加文字
					type: 'text', //通过不同top值可以设置上下显示
					left: 'center',
					top: '40%',
					style: {
						text: '24777',
						textAlign: 'center',
						fill: '#666', //文字的颜色
						width: 30,
						height: 30,
						fontSize: 20,
						fontFamily: "Microsoft YaHei"
					}
				},
				{ //环形图中间添加文字
					type: 'line', //通过不同top值可以设置上下显示
					left: '',
					top: '60%',
					style: {
						lineWidth: 5,
						fill: "#20C5D8",
						stroke: "#20C5D8"
					}
				},
				{ //环形图中间添加文字
					type: 'text', //通过不同top值可以设置上下显示
					left: 'center',
					top: '55%',
					style: {
						text: '90.3%',
						textAlign: 'center',
						fill: '#666', //文字的颜色
						width: 30,
						height: 30,
						fontSize: 20,
						fontFamily: "Microsoft YaHei"
					}
				},
			],
			series: [{
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
				center:['50%','50%'],
				data: [{
						value: e,
						name: ''
					},
					{
						value: 100 - e,
						name: ''
					}
				]
			}, {
				name: '',
				type: 'pie',
				radius: ['55%', '57%'],
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
					value: 100,
					name: ''
				}]
			}]

		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	fb: function() {
		var myChart = echarts.init(document.getElementById('fb'));
		var option = {
			grid: {
				left: '5%',
				right: '5%',
				bottom: '5%',
				top: "5%"
			},
			legend: {
				bottom: '0%',
				right: '0%',
				itemWidth:16,
				itemHeight:16,
				borderRadius:'8px'
			},
			radar: {
				center: ['50%', '50%'],
				name: {

				},
				indicator: [{
						name: '部门A',
						max: 100
					},
					{
						name: '部门B',
						max: 100
					},
					{
						name: '部门C',
						max: 100
					},
					{
						name: '部门D',
						max: 100
					},
					{
						name: '部门E',
						max: 100
					},
					{
						name: '部门F',
						max: 100
					},
				],
				splitArea:{
					show:true,
					areaStyle:{
						color:"#F2F2F2"
					}
				}	
			},
			series: [{
				name: '',
				type: 'radar',
				tooltip: {
					trigger: 'item'
				},
				areaStyle: {},
				data: [{
					value: [60, 73, 85, 40, 51, 24]
				}],
			}]
		};
		myChart.setOption(option);
	},
	bw: function() {
		var myChart = echarts.init(document.getElementById('bw'));

		var option = {
			color:['#20C5D8','#FFCAA1'],
			tooltip: {
				trigger: 'item'
			},
			legend: {
				bottom: '0%',
				left: 'center',
				itemWidth:16,
				itemHeight:16,
				borderRadius:'8px'
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				//radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '40',
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				center:['50%','45%'],
				data: [{
						value: 1048,
						name: '搜索引擎'
					},
					{
						value: 735,
						name: '直接访问'
					}
				]
			}]
		};
		myChart.setOption(option);
	},
	bk: function() {
		var myChart = echarts.init(document.getElementById('bk'));
	
		var option = {
			color:['#3565B8','#44A1F3'],
			tooltip: {
				trigger: 'item'
			},
			legend: {
				bottom: '0%',
				left: 'center',
				itemWidth:16,
				itemHeight:16,
				borderRadius:'8px'
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				//radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '40',
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				center:['50%','45%'],
				data: [{
						value: 1048,
						name: '搜索引擎'
					},
					{
						value: 735,
						name: '直接访问'
					}
				]
			}]
		};
		myChart.setOption(option);
	},
	qs:function(){
		var myChart = echarts.init(document.getElementById('qs'));
		var option = {
				grid: {
					left: '0%',
					right: '3%',
					bottom: '15%',
					top: "3%"
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					//show:false,
					type: 'value',
					splitArea:{
						show:true,
						areaStyle:{
							color:"#ECF5FE"
						}
					}
				},
				series: [{
					data: [150, 230, 224, 218, 135, 147, 260],
					type: 'line'
				}]
			};	
			myChart.setOption(option);
	},
	lj:function(){
		var myChart = echarts.init(document.getElementById('lj'));
		var option = {
				grid: {
					left: '0%',
					right: '3%',
					bottom: '15%',
					top: "3%"
				},
				xAxis: {
					type: 'category',
					data: ['2017', '2018', '2019', '2020', '2021'],
					
				},
				yAxis: {
					//show:false,
					type: 'value',
					splitArea:{
						show:true,
						areaStyle:{
							color:"#ECF5FE"
						}
					}
				},
				series: [{
					data: [150, 230, 224, 218, 135],
					type: 'line'
				}]
			};	
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
