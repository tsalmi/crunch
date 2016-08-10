var calculatePearson = function(own, allData) {
	var pearsonVal = [];
	
	var ownTotal =  own.savuisuus + own.vaniljaisuus + own.kukkaisuus + own.mausteisuus + own.maltaisuus + own.makeus +own.miellyttavyys;
	var ownMean = ownTotal / 7;
	var ownDiff = {};
	ownDiff.savuisuus = own.savuisuus - ownMean;
	ownDiff.vaniljaisuus = own.vaniljaisuus - ownMean;
	ownDiff.kukkaisuus = own.kukkaisuus - ownMean;
	ownDiff.mausteisuus = own.mausteisuus - ownMean;
	ownDiff.maltaisuus = own.maltaisuus - ownMean;
	ownDiff.makeus = own.makeus - ownMean; 
	ownDiff.miellyttavyys = own.miellyttavyys - ownMean;
	
	var ownSumDiffSq = Math.pow(ownDiff.savuisuus,2) +  Math.pow(ownDiff.vaniljaisuus,2)  + Math.pow(ownDiff.kukkaisuus,2) + 
		Math.pow(ownDiff.mausteisuus, 2) + Math.pow(ownDiff.maltaisuus, 2) + Math.pow(ownDiff.makeus, 2) + Math.pow(ownDiff.miellyttavyys, 2); 
	
	for (i in allData) {
		var their = allData[i];
		if (their.login != own.login) {
			var theirTotal =  their.savuisuus +  their.vaniljaisuus + their.kukkaisuus + their.mausteisuus + their.maltaisuus + their.makeus + their.miellyttavyys;
			var theirMean = theirTotal / 7;
			var theirDiff = {};
			theirDiff.savuisuus = their.savuisuus - theirMean;
			theirDiff.vaniljaisuus = their.vaniljaisuus - theirMean;
			theirDiff.kukkaisuus = their.kukkaisuus - theirMean;
			theirDiff.mausteisuus = their.mausteisuus - theirMean;
			theirDiff.maltaisuus = their.maltaisuus - theirMean;
			theirDiff.makeus = their.makeus - theirMean; 
			theirDiff.miellyttavyys = their.miellyttavyys - theirMean;
			
			var theirSumDiffSq = Math.pow(theirDiff.savuisuus,2) +  Math.pow(theirDiff.vaniljaisuus,2)  + Math.pow(theirDiff.kukkaisuus,2) + 
				Math.pow(theirDiff.mausteisuus, 2) + Math.pow(theirDiff.maltaisuus, 2) + Math.pow(theirDiff.makeus, 2) + Math.pow(theirDiff.miellyttavyys, 2);
			
			var sumDiffMulti = ownDiff.savuisuus * theirDiff.savuisuus + 
				ownDiff.vaniljaisuus * theirDiff.vaniljaisuus + 
				ownDiff.kukkaisuus * theirDiff.kukkaisuus + 
				ownDiff.mausteisuus * theirDiff.mausteisuus + 
				ownDiff.maltaisuus * theirDiff.maltaisuus + 
				ownDiff.makeus * theirDiff.makeus + 
				ownDiff.miellyttavyys * theirDiff.miellyttavyys;
		
			var sumSq = Math.sqrt(ownSumDiffSq * theirSumDiffSq);	
			var pearson = sumDiffMulti / sumSq;
			pearsonVal.push({ 
				login : their.nickname,
				pearson : pearson
			});
			
		}
	}
	
	return pearsonVal;
}