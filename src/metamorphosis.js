var metamorphosis = function(str) {
	var EOS = 5;
	var __metamorphosis_token;
	
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
		__metamorphosis_token = new Array();
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
				__metamorphosis_token.push({ type : lookupCodes[lookupTable[state][currentRead]], value : token});
				state = 0;
				token = "";				
			} else {
				continue;
			}
			if (buffered == true) {
				i--;
			}
		}
		__metamorphosis_token.push({ type : lookupCodes[lookupTable[state][EOS]], value : token});
		
		var started = false;
		var closed = true;
		
		for (i = 0; i < __metamorphosis_token.length; i++) {
			var type = __metamorphosis_token[i].type;
			if (type == "!accept") {
				throw "Token not accepted: " + __metamorphosis_token[i].value;
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
	
	var render = function(__metamorphosis_data) {
		if (__metamorphosis_data instanceof Array) {
			eval("var values = __metamorphosis_data");
		} else if (__metamorphosis_data instanceof Object) {
			for (var __metamorphosis_field in __metamorphosis_data) {
				eval("var " + __metamorphosis_field + " = __metamorphosis_data[__metamorphosis_field]");
			}
		} else {
			eval("var value = __metamorphosis_data");
		}
		var __metamorphosis_position = "inString";
		
		var __metamorphosis_str = "(function(__metamorphosis_data) { var __metamorphosis_str = ''; ";
		for (var __metamorphosis_i = 0; __metamorphosis_i < __metamorphosis_token.length; __metamorphosis_i++) {
			var __metamorphosis_type = __metamorphosis_token[__metamorphosis_i].type;
			if (__metamorphosis_type == "startCode") {
				__metamorphosis_position = "inCode";
			} else if (__metamorphosis_type == "startExpression") {
				__metamorphosis_position = "inExpression";
			} else if (__metamorphosis_type == "endCode") {
				__metamorphosis_position = "inString";
			}
			if (__metamorphosis_position == "inString" && __metamorphosis_type == "text") {
				__metamorphosis_str += " __metamorphosis_str += '" + __metamorphosis_token[__metamorphosis_i].value.replace(/'/g, "\\\'").replace(/\r?\n|\r/g, "'+\n'")  + "';";
			} else if (__metamorphosis_position == "inExpression" && __metamorphosis_type == "text") {
				__metamorphosis_str += " __metamorphosis_str += " + __metamorphosis_token[__metamorphosis_i].value + ";";
			} else if (__metamorphosis_position == "inCode" && __metamorphosis_type == "text") {
				__metamorphosis_str += __metamorphosis_token[__metamorphosis_i].value;
			}
		}
		__metamorphosis_str += " return __metamorphosis_str;}(__metamorphosis_data))";
		return eval(__metamorphosis_str);
	}
	
	_init(str);
	
	return {
		render : render
	}; 
}