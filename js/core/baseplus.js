var Baseplus = {
	//获取用户当前坐标
	getCurrentPosition: function() {
		plus.geolocation.getCurrentPosition(MapPoint, function(e) {
			mui.toast("error:" + e.message);
		})
		function MapPoint(position) {
			var Lon = position.coords.longitude; //获取经度
			var Lat = position.coords.latitude; //获取纬度
			var address = "当前地址：" + position.address.province + "," + position.address.city + "," + position.address.district +
				"," + position.address.street + "," + position.address.streetNum;
			// alert(Lon + "," + Lat);
			// alert(address);
			localStorage.setItem('startlng',Lon+" "+Lat)
		}
	},
	getResolutionHeight:function(){
		return  plus.display.resolutionHeight;
	}
}
