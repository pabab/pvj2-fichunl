/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		// Created by Peter Atoria @ http://iAtoria.com
	
		var inits 	 =  'class interface function package enum';
	
		var keywords =	'Array Bool break case callback cast catch continue Date ' + 
						'default do Dynamic else ' + 
						'extends false Float for if import inline ' + 
						'Int internal native never new null ' + 
						'Null Number Dynamic override private protected public ' + 
						'return set static String super switch this throw true try typedef uint untyped using ' + 
						'Void while'
						;
	
		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },		// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },		// multiline comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },		// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// single quoted strings
			{ regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,				css: 'value' },			// numbers
			{ regex: new RegExp(this.getKeywords(inits), 'gm'),			css: 'color3' },		// initializations
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },		// keywords
			{ regex: new RegExp('var', 'gm'),							css: 'color3' },		// variable
			{ regex: new RegExp('trace', 'gm'),							css: 'color1' }			// trace
			];
	
		this.forHtmlScript(SyntaxHighlighter.regexLib.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['Haxe', 'haxe'];

	SyntaxHighlighter.brushes.Haxe = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
