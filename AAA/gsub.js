function wavedraw(inbufL,procsize)
{
	waveshape.beginPath();
	var ix=iy=0;

	/* 描画領域のクリア */
	waveshape.clearRect(ixb,iyb,ixw,iyw);

	/* 波形の表示 */
	waveshape.strokeStyle ="#000000";
	waveshape.moveTo(ixb, iyb+iyw/2);
	for(var i=0;i<procsize; i+=8){
		iy=Math.floor(inbufL[i]*100+iyw/2+iyb);
		if(iy >= iyw+iyb ) iy=iyw+iyb;
		else if(iy<=iyb ) iy=iyb;

		ix=Math.floor(i+ixb);
		waveshape.lineTo(ix, iy);
	}
	waveshape.stroke();
}

function wavfft()
{
	for(i=0; i<WINDOW_SIZE; i++) mImage[i]=0;
	for(i=0; i<WINDOW_SIZE; i++){
		mReal[i]=mWin[i]*inbufL[i]*16;
	}
	transform(mReal, mImage);

	var pavr=0;
	for(i=1; i<WINDOW_HSIZE; i++){
		pw = mReal[i]*mReal[i]+mImage[i]*mImage[i];
		if(pw<=0) mPower[i]=0.;
		else mPower[i]=10.*Math.log(pw)/Math.log(10.);
		pavr+=mPower[i];
	}
	pavr/=WINDOW_HSIZE;

	var pp=0;
	var i=0;
	var pfreq;
	var cent;
	var tagpeak=[];
	var tagmag=[];

	while((pp=nextMaxPeak(mPower,WINDOW_MSIZE,pp))!=-1){
		if(mPower[pp]>pavr+30){
			pfreq = pp*sampleRate/WINDOW_SIZE;
			cent = 1200.*Math.log(pfreq)/Math.log(2.)
			tagpeak[i]= cent;
			i++;
		}
	}

	fdg1.fSetViewPort(0,WINDOW_HSIZE,0,1.0,0);

	if(i>=2 && recpeak1.length){
		setString(recpeak1,tagpeak);
		var cDist=dpmCalc2()/mMaxValue;
//		setString(recmag1,tagmag);
//		dpmCalc3();

		fdg1.fClearWindowInside();

		for(var i=0; i<=WINDOW_HSIZE-1; i++){ mDist[WINDOW_HSIZE-i] = mDist[WINDOW_HSIZE-1-i]; }
		
		dDist = 0.05* (cDist-dDist)+dDist;
		mDist[0]=dDist;
		if(dDist<0.5) fdg1.fFillColor("#ff00ff");
		else fdg1.fFillColor("#000000");
		fdg1.fDrawLine(mDist);

	}
}

