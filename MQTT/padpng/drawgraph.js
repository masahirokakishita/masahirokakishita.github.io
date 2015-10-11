/* Draw Graph Constructor */

function DrawGraph(iWxs,iWxe,iWys,iWye){

	var i,j;
	this.cv=null;	//Canvas
	this.ctx=null; 	//Canvas Context

	//Window lefttop(Wxs,Wys) - Right Bottom(Wxe,Wye)
	//Normally Wye > Wys
	this.iWxs=iWxs;
	this.iWxe=iWxe;
	this.iWys=iWys;
	this.iWye=iWye;
	this.iWxw=iWxe-iWxs;
	this.iWyh=Math.abs(iWye-iWys);

	this.iVxs=0.0;
	this.iVxe=1024.0;
	this.iVys=-10.0;
	this.iVye=1.0;

	this.fAx = (this.iWxe-this.iWxs)/(this.iVxe-this.iVxs);
	this.fBx = this.iWxs-this.fAx*this.iVxs;
	this.fAy = (this.iWye-this.iWys)/(this.iVye-this.iVys);	/* This value is pulse */
	this.fBy = this.iWye-this.fAy*this.iVys;

	this.iPx=0;
	this.iPy=0;

	this.log=0;
	this.dxw = new Array();
	this.img = new Image();

	this.mcX = 0;	/* mouse axis */
	this.mcY = 0;	/* mouse axis */

	this.tmp=0;
}

DrawGraph.prototype={
	fSetCanvas : function(canvas) {
		this.cv=canvas;
		this.ctx = this.cv.getContext('2d');
		this.cv.addEventListener('click', this.fMouseClick.bind(this),false);
	},

	fCalcCoef: function(){
		this.fAx = (this.iWxe-this.iWxs)/(this.iVxe-this.iVxs);
		this.fBx = this.iWxs-this.fAx*this.iVxs;
		this.fAy = -(this.iWye-this.iWys)/(this.iVye-this.iVys);	/* ????????O??????? */
		this.fBy = this.iWye-this.fAy*this.iVys;
	},

	fSetViewPort: function(iVxs,iVxe,iVys,iVye){
		this.iVxs=iVxs;
		this.iVxe=iVxe;
		this.iVys=iVys;
		this.iVye=iVye;
		this.fCalcCoef();
	},

	fSetWindowXY: function(iWxs,iWxe,iWys,iWye){
		this.iWxs=iWxs;
		this.iWxe=iWxe;
		this.iWys=iWys;
		this.iWye=iWye;
		this.iWxw=iWxe-iWxs;
		this.iWyh=Math.abs(iWye-iWys);
		this.fCalcCoef();
	},

	fMouseClick: function(e){
		var mouseX,mouseY;
		if (!log) log = document.getElementById("log");
		var rect = e.target.getBoundingClientRect();
		mouseX = e.clientX-rect.left;
		mouseY = e.clientY-rect.top;
		mouseX*=this.cv.width/this.cv.clientWidth
		mouseY*=this.cv.height/this.cv.clientHeight;
		mouseX=Math.floor(mouseX);
		mouseY=Math.floor(mouseY);

		log.innerText = "x:"+mouseX+" y:"+mouseY;
		this.mcX = mouseX;
		this.mcY = mouseY;
		goAnimation();
	},

	fClearWindowInside: function(){
		this.ctx.clearRect(this.iWxs+1,Math.min(this.iWys,this.iWye)+1,this.iWxw-2,this.iWyh-2);
	},

	fDrawImage: function(d,x,y){
		this.ctx.drawImage(d,x,y);
	},

	fDrawImageW: function(d,x,y,w,h){
		this.ctx.drawImage(d,x,y,w,h);
	},
/*
	fWriteText: function(d,x,y,font){
		this.ctx.font = font;
		this.ctx.textAlign = "end";
		this.ctx.fillText(d, x, y);
	},
*/
	fWriteText: function(d,x,y){
		this.ctx.textAlign = "start";
		this.ctx.fillText(d, x, y);
	},

	fStrokeRect: function(){
		this.ctx.fillStyle = "rgb(200, 0, 0)";
		this.ctx.strokeRect(this.iWxs, this.iWys, this.iWxe-this.iWxs, this.iWye-this.iWys);
	},

	fLine: function(xs,ys,xe,ye){
		this.ctx.beginPath();
		this.ctx.moveTo(xs, ys);
		this.ctx.lineTo(xe, ye);
		this.ctx.stroke();
	},

	fFillColor: function(e){
		this.ctx.fillStyle = this.ctx.strokeStyle = e;
	},

	fResize: function(){
		this.cv.height = window.innerHeight;
		this.cv.width = window.innerWidth;
	},

//add 2015/8/22
	fSetViewPortX: function(iVxs,iVxe){
		this.iVxs=iVxs;
		this.iVxe=iVxe;
		this.fCalcCoef();
	},

	fConvPos: function(x,y){
		if(y<this.iVys) y=this.iVys;
		if(y>this.iVye) y=this.iVye;
		this.iPx = Math.floor(this.fAx*x+this.fBx);
		this.iPy = Math.floor(this.fAy*y+this.fBy);
	},

	fDrawLine: function(d){
		this.fSetViewPortX( 0, d.length);
		this.ctx.beginPath();
		this.fConvPos(0,d[0]);
		this.ctx.moveTo(this.iPx, this.iPy);
		for(var i=0; i<d.length; i++){
			this.fConvPos(i,d[i]);
			this.ctx.lineTo(this.iPx, this.iPy);
		}
		this.ctx.stroke();
	},

	fDrawLineSize: function(d,size){
		this.fSetViewPortX( 0, size);
		this.ctx.beginPath();
		this.fConvPos(0,d[0]);
		this.ctx.moveTo(this.iPx, this.iPy);
		for(var i=0; i<size; i++){
			this.fConvPos(i,d[i]);
			this.ctx.lineTo(this.iPx, this.iPy);
		}
		this.ctx.stroke();
	},

}
