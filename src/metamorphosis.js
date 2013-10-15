var metamorphosis = function(str) {
	var EOS = 5;
	var results;
	
	var _init = function(str) {
		var lookupCodes = ["!accept", "text", "startCode", "endCode", "startExpression"];
	
		var stateTable = 
		  [[  1,  2,  3,  4,  5, -1], // 0 ACCEPT
		   [ -1,  6, -1, -1, -1, -1], // 1 ACCEPT
		   [ -1, -1, -1,  7, -1, -1], // 2 ACCEPT
		   [ -1, -1, -1, -1, -1, -1], // 3 ACCEPT
		   [ -1, -1, -1, -1, -1, -1], // 4 ACCEPT
		   [ -1, -1, -1, -1,  5, -1], // 5 ACCEPT
		   [ -1, -1,  8, -1, -1, -1], // 6 ACCEPT
		   [ -1, -1, -1, -1, -1, -1], // 7 ACCEPT
		   [ -1, -1, -1, -1, -1, -1]]; // 8 ACCEPT
		   
		var actionTable = 
		  [[  1,  1,  1,  1,  1,  2], // 0 ACCEPT
		   [  2,  1,  2,  2,  2,  2], // 1 ACCEPT
		   [  2,  2,  2,  1,  2,  2], // 2 ACCEPT
		   [  2,  2,  2,  2,  2,  2], // 3 ACCEPT
		   [  2,  2,  2,  2,  2,  2], // 4 ACCEPT
		   [  2,  2,  2,  2,  1,  2], // 5 ACCEPT
		   [  2,  2,  1,  2,  2,  2], // 6 ACCEPT
		   [  2,  2,  2,  2,  2,  2], // 7 ACCEPT
		   [  2,  2,  2,  2,  2,  2]]; // 8 ACCEPT
		   
		var lookupTable = 
		   [[  0,  0,  0,  0,  0,  1], // 0 text
		   [  1,  0,  1,  1,  1,  1], // 1 text
		   [  1,  1,  1,  0,  1,  1], // 2 text
		   [  1,  1,  1,  1,  1,  1], // 3 text
		   [  1,  1,  1,  1,  1,  1], // 4 text
		   [  1,  1,  1,  1,  0,  1], // 5 text
		   [  2,  2,  0,  2,  2,  2], // 6 startCode
		   [  3,  3,  3,  3,  3,  3], // 7 endCode
		   [  4,  4,  4,  4,  4,  4]]; // 8 startExpression
	
		var state = 0;
		var buffered = false;
		results = new Array();
		var token = "";
		
		for (var i = 0; i < str.length; i++) {
			var ch = str[i];
			var currentRead = _decode(ch);
			
			if ((actionTable[state][currentRead] == 1) && stateTable[state][currentRead] != -1) {
				buffered = false;
				token += ch;
				state = stateTable[state][currentRead];
			} else if ((stateTable[state][currentRead] == -1) && (actionTable[state][currentRead] == 2)) {
				buffered = true;
				results.push({ type : lookupCodes[lookupTable[state][currentRead]], value : token});
				state = 0;
				token = "";				
			} else {
				continue;
			}
			if (buffered == true) {
				i--;
			}
		}
		results.push({ type : lookupCodes[lookupTable[state][EOS]], value : token});
		
		var started = false;
		var closed = true;
		
		for (i = 0; i < results.length; i++) {
			var type = results[i].type;
			if (type == "!accept") {
				throw "Token not accepted: " + results[i].value;
			} else if (type == "startCode" || type == "startExpression") {
				if (!closed) {
					throw "previous tag not closed";
				} 
				if (started) {
					throw "tag yet open";
				}
				started = true;
				closed = false;
			} else if (type == "endCode") {
				if (started == false) {
					throw "tag not yet opened";
				}
				if (closed) {
					throw "tag yet closed";
				}
				closed = true;
				started = false;
			}
		}
		
		if (started) {
			throw "tag not closed";
		}
	};
	   
	var _decode = function(ch) {
		var LT = 0;
		var PERCENT = 1;
		var OTHER = 4;
		var GT = 3;
		var EQ = 2;
		
		if (ch == "%") {
			return PERCENT;
		} else if (ch == ">") {
			return GT;
		} else if (ch == "<") {
			return LT;
		} else if (ch == "=") {
			return EQ;
		} else {
			return OTHER;
		}
	};
	
	var format = function(data) {
		eval(parameterName + " = data;");
	
		var position = "inString";
		
		str = "(function(data) { var str = ''; ";
		for (i = 0; i < results.length; i++) {
			var type = results[i].type;
			if (type == "startCode") {
				position = "inCode";
			} else if (type == "startExpression") {
				position = "inExpression";
			} else if (type == "endCode") {
				position = "inString";
			}
			if (position == "inString" && type == "text") {
				str += " str += '" + results[i].value.replace(/'/g, "\\\'").replace(/\n/g, "'+\n'")  + "';";
			} else if (position == "inExpression" && type == "text") {
				str += " str += " + results[i].value + ";";
			} else if (position == "inCode" && type == "text") {
				str += results[i].value;
			}
		}
		str += " return str;}(data))";
		return eval(str);
	}
	
	_init(str);
	
	return {
		format : format
	}; 
}