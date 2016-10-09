function nextMaxPeak( cData, cSize, cStart )
{
	var lreturn=-1;

	for(var i=cStart+1; i<cSize-1; i++){
		if( cData[i]>cData[i-1] && cData[i]>cData[i+1]){
			lreturn=i; break;
		}
	}

	return lreturn;
}
