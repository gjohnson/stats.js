/*
 * stats.js
 * Garrett Johnson
 * Use at your own risk... I suck at math! Therefore this was simple for the fun of it!
 */

(function(window, undefined){
	
	if (Object.prototype.clone === undefined) {
		// How to clone objects - http://my.opera.com/GreyWyvern/blog/show.dml/1725165
		Object.prototype.clone = function() {
		  var newObj = (this instanceof Array) ? [] : {};
		  for (var i in this) {
		    if (this.hasOwnProperty(i)) {
					if (i === 'clone'){
						continue;
					} 
			    if (this[i] && typeof this[i] === 'object') {
			      newObj[i] = this[i].clone();
			    } 
					else {
						newObj[i] = this[i];
					}
				}
		  } 
				return newObj;
		};
	}
	
	window.Stats = {

			// constructor 
			init: function (data) {

				// private vars
				var rawSet = null, 
						sortedSet = null, 
						_window = window,
						_math = _window.Math;
				
				/*
					if an array of numbers is passed in, just assign it, otherwise....
					split the string into an array by looking for commas or a comma an a space
					loop through our new array and remove any whitespace that may have jumped in with the array elements
				*/
				
				if (typeof data === 'object') {
					rawSet = data;
				} 
				else {
					rawSet = (function(){
						// reduces lookups
						var pf = _window.parseFloat; 
						data = data.split(/,|,\w/);
						for (var k = 0; k < data.length; k++) {
							data[k] = pf(data[k]);
						}
						return data;
					})();
				}
			
				// sort the data numerically ascending
				sortedSet = data.clone(); 
				sortedSet = sortedSet.sort(function(a,b){ 
					return a - b; 
				});
				
				// public interface
				return {

					// simper getters for the sets
					rawSet: function () {
						return rawSet;
					},

					sortedSet: function () {
						return sortedSet;
					},

					// get the lowest number
					low: function () {
						return sortedSet[0];
					},

					// get the highest number
					high: function () {
						return sortedSet[sortedSet.length - 1];
					},
					
					// sum of all numbers
					total: function () {
						var sum = 0;
						for (var k = 0; k < sortedSet.length; k++) {
							sum += sortedSet[k];
						}
						return sum;
					},
					
					// mean of the numbers
					mean: function () {
						return this.total() / sortedSet.length;
					},
					
					// the xbar is just the mean
					xbar: function () {
						return this.mean.call(this);
					},
					
					// the mode is the most occuring element in the sample set
					// thanks: http://stackoverflow.com/questions/1053843/get-element-with-highest-occurrence-in-an-array
					mode: function () {
						var map = {},
								maxNum = sortedSet[0],
								maxCount = 1;
						
						for (var k = 0; k < sortedSet.length; k++) {
							var num = sortedSet[k];
							if(map[num] === undefined) {
								map[num] = 1;
							} 
							else {
								map[num]++;
							} 
							if(map[num] > maxCount){
								maxNum = num;
								maxCount = map[num];
							}
							 
						}
						
						return maxNum;
						
					},
					
					/*
					 if the sample set is odd, than return the middle number,
					 otherwise take the couple that make the middle number, add them, and divide them by 2
					*/
					median: function () {
						var even = (sortedSet.length % 2 === 0) ? true : false,
								midLow = null,
								midHigh = null;
								
						if (even) {
							midLow = (sortedSet.length / 2) - 1;
			        midHigh = (sortedSet.length / 2);
							return  (sortedSet[midLow] + sortedSet[midHigh]) / 2;
						}
						else {
							return sortedSet[_math.ceil(sortedSet.length / 2) - 1];
						}
					},
					
					/*
					 the range is the largest number in the set minus the smallest number in the set
					*/
					range: function () {
						return this.high() - this.low();
					},
					
					/*
					 the sigma WTF!
					*/
					sigma: function () {
						var result = null;
						for (var k = 0; k < sortedSet.length; k++) {
							var tmp = sortedSet[k] - this.mean.call(this);
							result += (tmp * tmp);
						}
						return result;
					},
					
					/*
					 the sample variance is the sigma divided by the size of the sample set minus 1
					*/
					sampleVariance: function () {
						return (this.sigma.call(this) / sortedSet.length) - 1;
					},
					
					/*
					 the standard deviation is the square root of the sample variance
					*/
					standardDeviation: function () {
						return _math.sqrt(this.sampleVariance.call(this));
					}

				};

			}

	};

	
	
})(window);