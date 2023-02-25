var preLoaderParent = document.querySelector(".pre-loader")

for (var i = 0; i < 10; i++) {
	var d = document.createElement("div")
	d.setAttribute("class", "loader-childern")
	preLoaderParent.appendChild(d)
}
