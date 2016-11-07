{ 
	var dtemp1, dtemp2, dtemp3; 

 	var mStrA=null;		// 入力文字列Ａ 
 	var mStrB=null;		// 入力文字列Ｂ 

	var mZurePenalty = 1;	// １文字ずれたことへのペナルティ 
	var mAwazuPenalty = 5;	// １文字不一致へのペナルティ 
  
	var mDistance = 0; // ２つの文字列の不一致度 
  
	var mLengthA=0;	//Ａの長さ 
	var mLengthB=0;	//Ｂの長さ 

	var mMissMatch=null;	//一致結果バッファ
	var mCost=null;		//各経路点の到達コスト 
    var mFrom=null;		//最短経路はどこから来たか 0:斜め、1:ｉ増え,２：ｊ増え 

	var mResultA=null; 
	var mResultB=null; 
	var mLenAB=null; 
	var mMaxValue=null;


function setString( cStrA, cStrB )
{
	if(cStrA.length==0) return;
	if(cStrB.length==0) return;

	mStrA = cStrA;
	mStrB = cStrB;

	mLengthA = cStrA.length;
	mLengthB = cStrB.length;

	mMissMatch = new Array(mLengthA);
	mCost = new Array(mLengthA);
	mFrom = new Array(mLengthA);

	for(var i=0; i<mLengthA; i++){
		mMissMatch[i] = new Array(mLengthB);
		mCost[i] = new Array(mLengthB);
		mFrom[i] = new Array(mLengthB);
	}

	//マッチング結果 
	mResultA = new Array(mLengthA+mLengthB+1);
	mResultB = new Array(mLengthA+mLengthB+1);

	mMaxValue = Math.max(mLengthA, mLengthB)*10 + Math.abs(mLengthA, mLengthB);

	console.log(mStrA[1]);
 	console.log(mLengthA);
}

function dpmCalc()
{
	if(mLengthA==0) return;
	if(mLengthB==0) return;

	/////////////// 総当たりで一致の確認 
	for(var i = 0; i < mLengthA; i++) { 
		log.innerHTML += "<br>";
		log.innerHTML += i+1;
		log.innerHTML += " ";
		for(var j = 0; j < mLengthB; j++) { 
			if(mStrA[i] == mStrB[j]) { 
				mMissMatch[i][j] = 0;
				log.innerHTML += "O"; 
			} else { 
				mMissMatch[i][j] = 1; 
				log.innerHTML += ".";
			} 
		} 
	} 
	log.innerHTML += "<br>";
	log.innerHTML += "<br>";

	//////////　コスト計算 
	mCost[0][0] = mMissMatch[0][0] * mAwazuPenalty;
	mFrom[0][0] = 0; 

	//// i側の縁 
	for(var i = 1; i < mLengthA; i++) { 
		mCost[i][0] = mCost[i-1][0] + mZurePenalty + mMissMatch[i][0] * mAwazuPenalty; 
		mFrom[i][0] = 1; 
	} 
	//// ｊ側の縁 
	for(var j = 1; j < mLengthB; j++) { 
		mCost[0][j] = mCost[0][j-1] + mZurePenalty + mMissMatch[0][j] * mAwazuPenalty; 
		mFrom[0][j] = 2; 
	} 

	//// 中間部 
	for(var i = 1; i < mLengthA; i++) { 
		for(var j = 1; j < mLengthB; j++) { 
			dtemp1 = mCost[i-1][j-1] + mMissMatch[i][j] * mAwazuPenalty; //斜めで来た場合のコスト 
			dtemp2 = mCost[i-1][j  ] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //i増えで来た場合のコスト 
			dtemp3 = mCost[i  ][j-1] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //j増えで来た場合のコスト 

			if(dtemp1 <= dtemp2 && dtemp1 <= dtemp3) { 
				mCost[i][j] = dtemp1; mFrom[i][j] = 0; 
			} 
			else if(dtemp2 <= dtemp3) { 
				mCost[i][j] = dtemp2; mFrom[i][j] = 1; 
			} 
			else { 
				mCost[i][j] = dtemp3; mFrom[i][j] = 2; 
			} 
		} 
	} 

	///DPマッチングの不一致度はこれ。以降は結果観察のための整形手続きです 
	mDistance = mCost[mLengthA -1][mLengthB-1];	
  
	//////ゴールからスタートへ逆に辿る 
    mLenAB = mLengthA + mLengthB; 

	{
		var k; 
		var i = mLengthA -1
		var j = mLengthB -1;

		for(k = mLenAB; i >= 0 && j >= 0; k--) { 
				mResultA[k] = mStrA[i]; 
				mResultB[k] = mStrB[j]; 

				switch(mFrom[i][j]) { 
					case 0: 
						i--; j--;
						break; 
					case 1: 
						i--;
						break; 
					case 2: 
						j--;
						break; 
					default: 
						log.innerHTML += "Error";
						log.innerHTML += "<br>";
						break; 
				} 
		} 

		mLenAB -= k; //マッチ結果の文字列の長さ 

		for(var i = 0; i < mLenAB; i++) { 
			mResultA[i] = mResultA[i+k+1]; 
			mResultB[i] = mResultB[i+k+1]; 
		} 
		for( var i=mLenAB; i<=mLengthA + mLengthB; i++)
			mResultA[i] = mResultB[i] = '\0'; 
  	}

	log.innerHTML += "=== Matching Result ==="; 
	log.innerHTML += "<br>";
	log.innerHTML += "Difference = "; 
	log.innerHTML += mDistance; 
	log.innerHTML += "<br>";

	for(var i = 0; i < mLengthA; i++) { 
		log.innerHTML += "<br>";
		log.innerHTML +=i+1; 
		log.innerHTML += " ";
		for(var j = 0; j < mLengthB; j++) { 
			switch(mFrom[i][j]) { 
				case 0: 
					log.innerHTML +="\\";
					break; 
				case 1:
					log.innerHTML +="|";
					break; 
				case 2:
					log.innerHTML +="-";
					break; 
			} 
		} 
	} 

	log.innerHTML += "<br>";
	log.innerHTML += "<br>";
	log.innerHTML +="A: ";
	log.innerHTML +=mResultA; 
	log.innerHTML += "<br>";
	log.innerHTML +="B: ";
	log.innerHTML +=mResultB; 
}


function dpmCalc2()
{
	if(mLengthA==0) return;
	if(mLengthB==0) return;

	mAwazuPenalty = 10;	// １文字不一致へのペナルティ  
	var mm=0;

//	for(var i=0; i<mLengthB; i++) mStrB[i]=0;

	/////////////// 総当たりで一致の確認 
	for(var i = 0; i < mLengthA; i++) { 
		for(var j = 0; j < mLengthB; j++) { 
			if(mStrA[i]-20<=mStrB[j] && mStrB[j]<=mStrA[i]+20) { 
				mMissMatch[i][j] = 0;
				mm++;
			} else if(mStrA[i]-40<=mStrB[j] && mStrB[j]<=mStrA[i]+40) { 
				mMissMatch[i][j] = 0.2;
				mm+=0.5;
			} else if(mStrA[i]-80<=mStrB[j] && mStrB[j]<=mStrA[i]+80) { 
				mMissMatch[i][j] = 0.4;
				mm+=0.25;
			} else { 
				mMissMatch[i][j] = 1; 
			} 
		} 
	} 

//	if(mm<mLengthA/2) return 1000;

	//////////　コスト計算 
	mCost[0][0] = mMissMatch[0][0] * mAwazuPenalty;
	mFrom[0][0] = 0; 

	//// i側の縁 
	for(var i = 1; i < mLengthA; i++) { 
		mCost[i][0] = mCost[i-1][0] + mZurePenalty + mMissMatch[i][0] * mAwazuPenalty; 
		mFrom[i][0] = 1; 
	} 
	//// ｊ側の縁 
	for(var j = 1; j < mLengthB; j++) { 
		mCost[0][j] = mCost[0][j-1] + mZurePenalty + mMissMatch[0][j] * mAwazuPenalty; 
		mFrom[0][j] = 2; 
	} 

	//// 中間部 
	for(var i = 1; i < mLengthA; i++) { 
		for(var j = 1; j < mLengthB; j++) { 
			dtemp1 = mCost[i-1][j-1] + mMissMatch[i][j] * mAwazuPenalty; //斜めで来た場合のコスト 
			dtemp2 = mCost[i-1][j  ] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //i増えで来た場合のコスト 
			dtemp3 = mCost[i  ][j-1] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //j増えで来た場合のコスト 

			if(dtemp1 <= dtemp2 && dtemp1 <= dtemp3) { 
				mCost[i][j] = dtemp1; mFrom[i][j] = 0; 
			} 
			else if(dtemp2 <= dtemp3) { 
				mCost[i][j] = dtemp2; mFrom[i][j] = 1; 
			} 
			else { 
				mCost[i][j] = dtemp3; mFrom[i][j] = 2; 
			} 
		} 
	} 

	///DPマッチングの不一致度はこれ。以降は結果観察のための整形手続きです 
	mDistance = mCost[mLengthA -1][mLengthB-1];	
 
	log.innerText = "Difference = "; 
	log.innerText += mm; 
	log.innerText += " "; 
	log.innerText += mDistance; 
	log.innerText += "\n";

	return mDistance;
}


function dpmCalc3()
{
	if(mLengthA==0) return;
	if(mLengthB==0) return;

	mAwazuPenalty = 10;	// １文字不一致へのペナルティ  
	var mm=0;

	/////////////// 総当たりで一致の確認 
	for(var i = 0; i < mLengthA; i++) { 
		for(var j = 0; j < mLengthB; j++) { 
			if(mStrA[i]-4<=mStrB[j] && mStrB[j]<=mStrA[i]+4) { 
				mMissMatch[i][j] = 0;
				mm++;
			} else { 
				mMissMatch[i][j] = 1; 
			} 
		} 
	} 

	//////////　コスト計算 
	mCost[0][0] = mMissMatch[0][0] * mAwazuPenalty;
	mFrom[0][0] = 0; 

	//// i側の縁 
	for(var i = 1; i < mLengthA; i++) { 
		mCost[i][0] = mCost[i-1][0] + mZurePenalty + mMissMatch[i][0] * mAwazuPenalty; 
		mFrom[i][0] = 1; 
	} 
	//// ｊ側の縁 
	for(var j = 1; j < mLengthB; j++) { 
		mCost[0][j] = mCost[0][j-1] + mZurePenalty + mMissMatch[0][j] * mAwazuPenalty; 
		mFrom[0][j] = 2; 
	} 

	//// 中間部 
	for(var i = 1; i < mLengthA; i++) { 
		for(var j = 1; j < mLengthB; j++) { 
			dtemp1 = mCost[i-1][j-1] + mMissMatch[i][j] * mAwazuPenalty; //斜めで来た場合のコスト 
			dtemp2 = mCost[i-1][j  ] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //i増えで来た場合のコスト 
			dtemp3 = mCost[i  ][j-1] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //j増えで来た場合のコスト 

			if(dtemp1 <= dtemp2 && dtemp1 <= dtemp3) { 
				mCost[i][j] = dtemp1; mFrom[i][j] = 0; 
			} 
			else if(dtemp2 <= dtemp3) { 
				mCost[i][j] = dtemp2; mFrom[i][j] = 1; 
			} 
			else { 
				mCost[i][j] = dtemp3; mFrom[i][j] = 2; 
			} 
		} 
	} 

	///DPマッチングの不一致度はこれ。以降は結果観察のための整形手続きです 
	mDistance = mCost[mLengthA -1][mLengthB-1];	
 
	log.innerText += " "; 
	log.innerText += mm; 
	log.innerText += " "; 
	log.innerText += mDistance; 
	log.innerText += "\n";

	return mDistance;
}

// setString("abdc", "ksakkdhjsklfhdjs" );

/*
              int MissMatch[64][64]; //一致結果バッファ 
              double Cost[64][64]; //各経路点の到達コスト 
              int From[64][64]; //最短経路はどこから来たか 0:斜め、1:ｉ増え,２：ｊ増え 
              double dtemp1, dtemp2, dtemp3; 
  
              //マッチング結果 
              char ResultA[128]; 
              char ResultB[128]; 
              long LenAB; 
  
              printf("\n ============== DP Matching ================\n\n"); 
              printf("Input String A >> "); 
			scanf("%s",StrA); //scanfはスペースで読み込みを打ち切るので注意。 
             //C++系の関数 (getline(cin, StrA); など)を用いた方が何かと安全である。 
  
              printf("Input String B >> "); 
              scanf("%s",StrB); 
  
              LengthA = strlen(StrA); 
              LengthB = strlen(StrB); 
  
              
              /////////////// 総当たりで一致の確認 
              for(i = 0; i < LengthA; i++) { 
                            printf("\n%3d: ",i+1); 
  
                            for(j = 0; j < LengthB; j++) { 
                                          if(StrA[i] == StrB[j]) { 
                                                        MissMatch[i][j] = 0; 
                                                        printf("O"); 
                                          } 
                                          else { 
                                                        MissMatch[i][j] = 1; 
                                                        printf("."); 
                                          } 
                            } 
              } 
              printf("\n"); 
  
              //////////　コスト計算 
              Cost[0][0] = MissMatch[0][0] * AwazuPenalty; 
              From[0][0] = 0; 
  
              //// i側の縁 
              for(i = 1; i < LengthA; i++) { 
                            Cost[i][0] = Cost[i-1][0] + ZurePenalty + MissMatch[i][0] * AwazuPenalty; 
                            From[i][0] = 1; 
              } 
              //// ｊ側の縁 
              for(j = 1; j < LengthB; j++) { 
                            Cost[0][j] = Cost[0][j-1] + ZurePenalty + MissMatch[0][j] * AwazuPenalty; 
                            From[0][j] = 2; 
              } 
  
              //// 中間部 
              for(i = 1; i < LengthA; i++) { 
                            for(j = 1; j < LengthB; j++) { 
                                          dtemp1 = Cost[i-1][j-1] + MissMatch[i][j] * AwazuPenalty; //斜めで来た場合のコスト 
                                          dtemp2 = Cost[i-1][j  ] + MissMatch[i][j] * AwazuPenalty + ZurePenalty; //i増えで来た場合のコスト 
                                          dtemp3 = Cost[i  ][j-1] + MissMatch[i][j] * AwazuPenalty + ZurePenalty; //j増えで来た場合のコスト 
  
                                          if(dtemp1 <= dtemp2 && dtemp1 <= dtemp3) { 
                                                        Cost[i][j] = dtemp1; 
                                                        From[i][j] = 0; 
                                          } 
                                          else if(dtemp2 <= dtemp3) { 
                                                        Cost[i][j] = dtemp2; 
                                                        From[i][j] = 1; 
                                          } 
                                          else { 
                                                        Cost[i][j] = dtemp3; 
                                                        From[i][j] = 2; 
                                          } 
                            } 
              } 
  
              Distance = Cost[LengthA -1][LengthB-1];///DPマッチングの不一致度はこれ。以降は結果観察のための整形手続きです 
  
              //////ゴールからスタートへ逆に辿る 
              LenAB = LengthA + LengthB; 
              i = LengthA -1; 
              j = LengthB -1; 
  
              for(k = LenAB; i >= 0 && j >= 0; k--) { 
                            ResultA[k] = StrA[i]; 
                            ResultB[k] = StrB[j]; 
  
                            //printf("%c %c  ", ResultA[k], ResultB[k]); 
  
                            switch(From[i][j]) { 
                            case 0: 
                                          i--; 
                                          j--; 
                                          break; 
                            case 1: 
                                          i--; 
                                          break; 
                            case 2: 
                                          j--; 
                                          break; 
                            default: 
                                          printf("Error\n"); 
                                          break; 
                            } 
  
              } 
              LenAB -= k; //マッチ結果の文字列の長さ 
  
              for(i = 0; i < LenAB; i++) { 
                            ResultA[i] = ResultA[i+k+1]; 
                            ResultB[i] = ResultB[i+k+1]; 
              } 
              ResultA[LenAB] = ResultB[LenAB] = '\0'; 
  
              printf("\n === Matching Result ===\n"); 
              printf("\nDifference = %6.1f\n",Distance); 
  
              for(i = 0; i < LengthA; i++) { 
                            printf("\n%3d: ",i+1); 
                            for(j = 0; j < LengthB; j++) { 
//                                        printf("%1d",From[i][j]); 
                                          switch(From[i][j]) { 
                                          case 0: printf("\\"); break; 
                                          case 1: printf("|"); break; 
                                          case 2: printf("-"); break; 
                                          default: break; 
                                          } 
                            } 
              } 
  
              printf("\n"); 
              printf("A:  %s\n",ResultA); 
              printf("B:  %s\n",ResultB); 
  
              return 0; 
  
*/
}
