/**
 * Convert link syntax [[zz]] to true links on javascript and css pages
 * (Workaround for [[bugzilla:10410]] - see [[w:en:Wikipedia:Village pump (technical)/Archive 84#Script for wikilinks in CSS/JS pages]])
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/LinksOnJSPages.js]] ([[File:User:Helder.wiki/Tools/LinksOnJSPages.js]])
 */
/*jslint browser: true, white: true, plusplus: true, regexp: true */
/*global jQuery, mediaWiki */
( function ( $, mw /* , undefined */ ) {
'use strict';
var	regexes,
	path = mw.config.get('wgArticlePath'),
	catNS = mw.config.get('wgFormattedNamespaces')['14'];
regexes = [
	[ // [[Links like this]]
		/\[\[\s*([^\|\]]+?)\s*\]\]/ig,
		'[[<a href="' + path + '">$1</a>]]'
	],
	[ // [[Links like this|with an alternative text]]
		/\[\[\s*([^\|\]]+?)\s*\|\s*([^\]]+?)\s*\]\]/ig,
		'[[<a href="' + path + '">$2</a>]]'
	],
	[ // [[Category:Links|with an index for sorting]]
		new RegExp('\\[\\[<a href="' + path.replace('$1', '(?:Category|' + catNS + '):([^"]+)') + '">([^<]+)</a>\\]\\]', 'gi'),
		'[[<a href="' + path.replace('$1', 'Category:$1') + '">' + catNS + ':$1</a>|$2]]'
	],
	[ // Links to MediaWiki site (Workaround for [[bugzilla:22407]])
		/href="\/wiki\/mw:/ig,
		'href="' + '//www.mediawiki.org/wiki/'
	]
];

function createLinks(t) {
	var i;
	for (i=0; i< regexes.length; i++) {
		t = t.replace(regexes[i][0], regexes[i][1]);
	}
	return t;
}

if ($.inArray(mw.config.get('wgNamespaceNumber'), [2, 8]) !== -1 && mw.config.get('wgPageName').match(/\.(js|css)$/) && $.inArray(mw.config.get('wgAction'), ['view', 'purge']) !== -1) {
	$('#bodyContent pre')
		.first().find('span.coMULTI, span.co1') //FIXME: "span.st0" makes this too slow =(
		.each(function () {
			$(this).html(createLinks($(this).html()));
		});
}

}( jQuery, mediaWiki ) );