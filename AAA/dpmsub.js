{ 
	var dtemp1, dtemp2, dtemp3; 

 	var mStrA=null;		// ���͕�����` 
 	var mStrB=null;		// ���͕�����a 

	var mZurePenalty = 1;	// �P�������ꂽ���Ƃւ̃y�i���e�B 
	var mAwazuPenalty = 5;	// �P�����s��v�ւ̃y�i���e�B 
  
	var mDistance = 0; // �Q�̕�����̕s��v�x 
  
	var mLengthA=0;	//�`�̒��� 
	var mLengthB=0;	//�a�̒��� 

	var mMissMatch=null;	//��v���ʃo�b�t�@
	var mCost=null;		//�e�o�H�_�̓��B�R�X�g 
    var mFrom=null;		//�ŒZ�o�H�͂ǂ����痈���� 0:�΂߁A1:������,�Q�F������ 

	var mResultA=null; 
	var mResultB=null; 
	var mLenAB=null; 


function setString( cStrA, cStrB )
{
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

	//�}�b�`���O���� 
	mResultA = new Array(mLengthA+mLengthB+1);
	mResultB = new Array(mLengthA+mLengthB+1);

	console.log(mStrA[1]);
 	console.log(mLengthA);
}

function dpmCalc()
{
	/////////////// ��������ň�v�̊m�F 
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

	//////////�@�R�X�g�v�Z 
	mCost[0][0] = mMissMatch[0][0] * mAwazuPenalty;
	mFrom[0][0] = 0; 

	//// i���̉� 
	for(var i = 1; i < mLengthA; i++) { 
		mCost[i][0] = mCost[i-1][0] + mZurePenalty + mMissMatch[i][0] * mAwazuPenalty; 
		mFrom[i][0] = 1; 
	} 
	//// �����̉� 
	for(var j = 1; j < mLengthB; j++) { 
		mCost[0][j] = mCost[0][j-1] + mZurePenalty + mMissMatch[0][j] * mAwazuPenalty; 
		mFrom[0][j] = 2; 
	} 

	//// ���ԕ� 
	for(var i = 1; i < mLengthA; i++) { 
		for(var j = 1; j < mLengthB; j++) { 
			dtemp1 = mCost[i-1][j-1] + mMissMatch[i][j] * mAwazuPenalty; //�΂߂ŗ����ꍇ�̃R�X�g 
			dtemp2 = mCost[i-1][j  ] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //i�����ŗ����ꍇ�̃R�X�g 
			dtemp3 = mCost[i  ][j-1] + mMissMatch[i][j] * mAwazuPenalty + mZurePenalty; //j�����ŗ����ꍇ�̃R�X�g 

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

	///DP�}�b�`���O�̕s��v�x�͂���B�ȍ~�͌��ʊώ@�̂��߂̐��`�葱���ł� 
	mDistance = mCost[mLengthA -1][mLengthB-1];	
  
	//////�S�[������X�^�[�g�֋t�ɒH�� 
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

		mLenAB -= k; //�}�b�`���ʂ̕�����̒��� 

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

setString("ksakkdhjsklfhdjs", "abdc");

/*
              int MissMatch[64][64]; //��v���ʃo�b�t�@ 
              double Cost[64][64]; //�e�o�H�_�̓��B�R�X�g 
              int From[64][64]; //�ŒZ�o�H�͂ǂ����痈���� 0:�΂߁A1:������,�Q�F������ 
              double dtemp1, dtemp2, dtemp3; 
  
              //�}�b�`���O���� 
              char ResultA[128]; 
              char ResultB[128]; 
              long LenAB; 
  
              printf("\n ============== DP Matching ================\n\n"); 
              printf("Input String A >> "); 
			scanf("%s",StrA); //scanf�̓X�y�[�X�œǂݍ��݂�ł��؂�̂Œ��ӁB 
             //C++�n�̊֐� (getline(cin, StrA); �Ȃ�)��p�������������ƈ��S�ł���B 
  
              printf("Input String B >> "); 
              scanf("%s",StrB); 
  
              LengthA = strlen(StrA); 
              LengthB = strlen(StrB); 
  
              
              /////////////// ��������ň�v�̊m�F 
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
  
              //////////�@�R�X�g�v�Z 
              Cost[0][0] = MissMatch[0][0] * AwazuPenalty; 
              From[0][0] = 0; 
  
              //// i���̉� 
              for(i = 1; i < LengthA; i++) { 
                            Cost[i][0] = Cost[i-1][0] + ZurePenalty + MissMatch[i][0] * AwazuPenalty; 
                            From[i][0] = 1; 
              } 
              //// �����̉� 
              for(j = 1; j < LengthB; j++) { 
                            Cost[0][j] = Cost[0][j-1] + ZurePenalty + MissMatch[0][j] * AwazuPenalty; 
                            From[0][j] = 2; 
              } 
  
              //// ���ԕ� 
              for(i = 1; i < LengthA; i++) { 
                            for(j = 1; j < LengthB; j++) { 
                                          dtemp1 = Cost[i-1][j-1] + MissMatch[i][j] * AwazuPenalty; //�΂߂ŗ����ꍇ�̃R�X�g 
                                          dtemp2 = Cost[i-1][j  ] + MissMatch[i][j] * AwazuPenalty + ZurePenalty; //i�����ŗ����ꍇ�̃R�X�g 
                                          dtemp3 = Cost[i  ][j-1] + MissMatch[i][j] * AwazuPenalty + ZurePenalty; //j�����ŗ����ꍇ�̃R�X�g 
  
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
  
              Distance = Cost[LengthA -1][LengthB-1];///DP�}�b�`���O�̕s��v�x�͂���B�ȍ~�͌��ʊώ@�̂��߂̐��`�葱���ł� 
  
              //////�S�[������X�^�[�g�֋t�ɒH�� 
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
              LenAB -= k; //�}�b�`���ʂ̕�����̒��� 
  
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
