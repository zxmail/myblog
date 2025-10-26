// worker.js (已修正图片逻辑，并集成所有功能)

/**
 * Welcome to cf-blog-plus
 * @license Apache-2.0
 * @website https://github.com/-A-RA/cf-blog-plus
 * @version 2.1.1
 * @modified_for_kv_optimization_and_image_fix
 */

// --- BEGIN: Mustache.js v4.1.0 ---
const mustache = (function () {
	'use strict';
	var objectToString = Object.prototype.toString;
	var isArray = Array.isArray || function isArrayPolyfill (object) { return objectToString.call(object) === '[object Array]'; };
	function isFunction (object) { return typeof object === 'function'; }
	function typeStr (obj) { return isArray(obj) ? 'array' : typeof obj; }
	function escapeRegExp (string) { return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'); }
	function hasProperty (obj, propName) { return obj != null && typeof obj === 'object' && (propName in obj); }
	function primitiveHasOwnProperty (primitive, propName) { return (primitive != null && typeof primitive !== 'object' && primitive.hasOwnProperty && primitive.hasOwnProperty(propName));}
	var regExpTest = RegExp.prototype.test;
	function testRegExp (re, string) { return regExpTest.call(re, string); }
	var nonSpaceRe = /\S/;
	function isWhitespace (string) { return !testRegExp(nonSpaceRe, string); }
	var entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' };
	function escapeHtml (string) { return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) { return entityMap[s]; }); }
	var whiteRe = /\s*/; var spaceRe = /\s+/; var equalsRe = /\s*=/; var curlyRe = /\s*\}/; var tagRe = /#|\^|\/|>|\{|&|=|!/;
	function parseTemplate (template, tags) { if (!template) return []; var lineHasNonSpace = false; var sections = []; var tokens = []; var spaces = []; var hasTag = false; var nonSpace = false; var indentation = ''; var tagIndex = 0; function stripSpace () { if (hasTag && !nonSpace) { while (spaces.length) delete tokens[spaces.pop()]; } else { spaces = []; } hasTag = false; nonSpace = false; } var openingTagRe, closingTagRe, closingCurlyRe; function compileTags (tagsToCompile) { if (typeof tagsToCompile === 'string') tagsToCompile = tagsToCompile.split(spaceRe, 2); if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) throw new Error('Invalid tags: ' + tagsToCompile); openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*'); closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1])); closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1])); } compileTags(tags || mustache.tags); var scanner = new Scanner(template); var start, type, value, chr, token, openSection; while (!scanner.eos()) { start = scanner.pos; value = scanner.scanUntil(openingTagRe); if (value) { for (var i = 0, valueLength = value.length; i < valueLength; ++i) { chr = value.charAt(i); if (isWhitespace(chr)) { spaces.push(tokens.length); indentation += chr; } else { nonSpace = true; lineHasNonSpace = true; indentation += ' '; } tokens.push([ 'text', chr, start, start + 1 ]); start += 1; if (chr === '\n') { stripSpace(); indentation = ''; tagIndex = 0; lineHasNonSpace = false; } } } if (!scanner.scan(openingTagRe)) break; hasTag = true; type = scanner.scan(tagRe) || 'name'; scanner.scan(whiteRe); if (type === '=') { value = scanner.scanUntil(equalsRe); scanner.scan(equalsRe); scanner.scanUntil(closingTagRe); } else if (type === '{') { value = scanner.scanUntil(closingCurlyRe); scanner.scan(curlyRe); scanner.scanUntil(closingTagRe); type = '&'; } else { value = scanner.scanUntil(closingTagRe); } if (!scanner.scan(closingTagRe)) throw new Error('Unclosed tag at ' + scanner.pos); if (type == '>') { token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ]; } else { token = [ type, value, start, scanner.pos ]; } tagIndex++; tokens.push(token); if (type === '#' || type === '^') { sections.push(token); } else if (type === '/') { openSection = sections.pop(); if (!openSection) throw new Error('Unopened section "' + value + '" at ' + start); if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start); } else if (type === 'name' || type === '{' || type === '&') { nonSpace = true; } else if (type === '=') { compileTags(value); } } stripSpace(); openSection = sections.pop(); if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos); return nestTokens(squashTokens(tokens)); } function squashTokens (tokens) { var squashedTokens = []; var token, lastToken; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { token = tokens[i]; if (token) { if (token[0] === 'text' && lastToken && lastToken[0] === 'text') { lastToken[1] += token[1]; lastToken[3] = token[3]; } else { squashedTokens.push(token); lastToken = token; } } } return squashedTokens; } function nestTokens (tokens) { var nestedTokens = []; var collector = nestedTokens; var sections = []; var token, section; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { token = tokens[i]; switch (token[0]) { case '#': case '^': collector.push(token); sections.push(token); collector = token[4] = []; break; case '/': section = sections.pop(); section[5] = token[2]; collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens; break; default: collector.push(token); } } return nestedTokens; } function Scanner (string) { this.string = string; this.tail = string; this.pos = 0; } Scanner.prototype.eos = function eos () { return this.tail === ''; }; Scanner.prototype.scan = function scan (re) { var match = this.tail.match(re); if (!match || match.index !== 0) return ''; var string = match[0]; this.tail = this.tail.substring(string.length); this.pos += string.length; return string; }; Scanner.prototype.scanUntil = function scanUntil (re) { var index = this.tail.search(re), match; switch (index) { case -1: match = this.tail; this.tail = ''; break; case 0: match = ''; break; default: match = this.tail.substring(0, index); this.tail = this.tail.substring(index); } this.pos += match.length; return match; }; function Context (view, parentContext) { this.view = view; this.cache = { '.': this.view }; this.parent = parentContext; } Context.prototype.push = function push (view) { return new Context(view, this); }; Context.prototype.lookup = function lookup (name) { var cache = this.cache; var value; if (cache.hasOwnProperty(name)) { value = cache[name]; } else { var context = this, intermediateValue, names, index, lookupHit = false; while (context) { if (name.indexOf('.') > 0) { intermediateValue = context.view; names = name.split('.'); index = 0; while (intermediateValue != null && index < names.length) { if (index === names.length - 1) lookupHit = (hasProperty(intermediateValue, names[index]) || primitiveHasOwnProperty(intermediateValue, names[index])); intermediateValue = intermediateValue[names[index++]]; } } else { intermediateValue = context.view[name]; lookupHit = hasProperty(context.view, name); } if (lookupHit) { value = intermediateValue; break; } context = context.parent; } cache[name] = value; } if (isFunction(value)) value = value.call(this.view); return value; }; function Writer () { this.templateCache = { _cache: {}, set: function set (key, value) { this._cache[key] = value; }, get: function get (key) { return this._cache[key]; }, clear: function clear () { this._cache = {}; } }; } Writer.prototype.clearCache = function clearCache () { if (typeof this.templateCache !== 'undefined') { this.templateCache.clear(); } }; Writer.prototype.parse = function parse (template, tags) { var cache = this.templateCache; var cacheKey = template + ':' + (tags || mustache.tags).join(':'); var isCacheEnabled = typeof cache !== 'undefined'; var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined; if (tokens == undefined) { tokens = parseTemplate(template, tags); isCacheEnabled && cache.set(cacheKey, tokens); } return tokens; }; Writer.prototype.render = function render (template, view, partials, config) { var tags = this.getConfigTags(config); var tokens = this.parse(template, tags); var context = (view instanceof Context) ? view : new Context(view, undefined); return this.renderTokens(tokens, context, partials, template, config); }; Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) { var buffer = ''; var token, symbol, value; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { value = undefined; token = tokens[i]; symbol = token[0]; if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config); else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config); else if (symbol === '>') value = this.renderPartial(token, context, partials, config); else if (symbol === '&') value = this.unescapedValue(token, context); else if (symbol === 'name') value = this.escapedValue(token, context, config); else if (symbol === 'text') value = this.rawValue(token); if (value !== undefined) buffer += value; } return buffer; }; Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate, config) { var self = this; var buffer = ''; var value = context.lookup(token[1]); function subRender (template) { return self.render(template, context, partials, config); } if (!value) return; if (isArray(value)) { for (var j = 0, valueLength = value.length; j < valueLength; ++j) { buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config); } } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') { buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config); } else if (isFunction(value)) { if (typeof originalTemplate !== 'string') throw new Error('Cannot use higher-order sections without the original template'); value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender); if (value != null) buffer += value; } else { buffer += this.renderTokens(token[4], context, partials, originalTemplate, config); } return buffer; }; Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate, config) { var value = context.lookup(token[1]); if (!value || (isArray(value) && value.length === 0)) return this.renderTokens(token[4], context, partials, originalTemplate, config); }; Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) { var filteredIndentation = indentation.replace(/[^ \t]/g, ''); var partialByNl = partial.split('\n'); for (var i = 0; i < partialByNl.length; i++) { if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) { partialByNl[i] = filteredIndentation + partialByNl[i]; } } return partialByNl.join('\n'); }; Writer.prototype.renderPartial = function renderPartial (token, context, partials, config) { if (!partials) return; var tags = this.getConfigTags(config); var value = isFunction(partials) ? partials(token[1]) : partials[token[1]]; if (value != null) { var lineHasNonSpace = token[6]; var tagIndex = token[5]; var indentation = token[4]; var indentedValue = value; if (tagIndex == 0 && indentation) { indentedValue = this.indentPartial(value, indentation, lineHasNonSpace); } var tokens = this.parse(indentedValue, tags); return this.renderTokens(tokens, context, partials, indentedValue, config); } }; Writer.prototype.unescapedValue = function unescapedValue (token, context) { var value = context.lookup(token[1]); if (value != null) return value; }; Writer.prototype.escapedValue = function escapedValue (token, context, config) { var escape = this.getConfigEscape(config) || mustache.escape; var value = context.lookup(token[1]); if (value != null) return (typeof value === 'number' && escape === mustache.escape) ? String(value) : escape(value); }; Writer.prototype.rawValue = function rawValue (token) { return token[1]; }; Writer.prototype.getConfigTags = function getConfigTags (config) { if (isArray(config)) { return config; } else if (config && typeof config === 'object') { return config.tags; } else { return undefined; } }; Writer.prototype.getConfigEscape = function getConfigEscape (config) { if (config && typeof config === 'object' && !isArray(config)) { return config.escape; } else { return undefined; } }; var mustache = { name: 'mustache.js', version: '4.1.0', tags: [ '{{', '}}' ], clearCache: undefined, escape: undefined, parse: undefined, render: undefined, Scanner: undefined, Context: undefined, Writer: undefined, set templateCache (cache) { defaultWriter.templateCache = cache; }, get templateCache () { return defaultWriter.templateCache; } }; var defaultWriter = new Writer(); mustache.clearCache = function clearCache () { return defaultWriter.clearCache(); }; mustache.parse = function parse (template, tags) { return defaultWriter.parse(template, tags); }; mustache.render = function render (template, view, partials, config) { if (typeof template !== 'string') { throw new TypeError('Invalid template! Template should be a "string" but "' + typeStr(template) + '" was given as the first argument for mustache#render(template, view, partials)'); } return defaultWriter.render(template, view, partials, config); }; mustache.escape = escapeHtml; mustache.Scanner = Scanner; mustache.Context = Context; mustache.Writer = Writer; return mustache;
}());
// --- END: Mustache.js v4.1.0 ---

function getFirstImageUrl(htmlContent) {
    if (!htmlContent) return '';
    const match = htmlContent.match(/<img.*?src=["'](.*?)["']/);
    return match ? match[1] : '';
}

const theme = "JustNews";
const cdn = "https://myblog-1dt.pages.dev/themes";

let site = {
	"title": "cf-blog", "logo": cdn + "/" + theme + "/files/logo.png", "siteName": "CF-BLOG", "siteDescription": "cf-blog", "copyRight": "Copyright © 2022", "siteKeywords": "cf-blog", "github": "-A-RA/cf-blog-plus", "theme_github_path": cdn + "/", "codeBeforHead": "", "codeBeforBody": "", "commentCode": "", "widgetOther": "",
};

export default {
	async fetch(request, env, ctx) {
		return handleRequest({ request, env, ctx });
	}
};

async function handleRequest({ request, env, ctx }) {
	const url = new URL(request.url);
	const { pathname } = url;

	try {
		if (pathname === "/" || pathname.startsWith("/page/")) {
			return await renderHTML(request, await getIndexData(request, env), theme + "/index.html", 200, env, ctx);
		}
		else if (pathname.startsWith("/article/")) {
			const parts = pathname.split('/');
            const id = parts[2];
			return await renderHTML(request, await getArticleData(request, id, env, ctx), theme + "/article.html", 200, env, ctx);
		}
		else if (pathname.startsWith("/category/")) {
			let key = pathname.substring(10, pathname.lastIndexOf('/'));
			let page = 1;
			if (pathname.substring(10, pathname.length).includes("page/")) {
				key = pathname.substring(10, pathname.lastIndexOf('/page/'));
				page = parseInt(pathname.substring(pathname.lastIndexOf('/page/') + 6, pathname.lastIndexOf('/'))) || 1;
			}
			return await renderHTML(request, await getCategoryOrTagsData(request, "category", key, page, env), theme + "/index.html", 200, env, ctx);
		}
		else if (pathname.startsWith("/tags/")) {
			let key = pathname.substring(6, pathname.lastIndexOf('/'));
			let page = 1;
			if (pathname.substring(6, pathname.length).includes("page/")) {
				key = pathname.substring(6, pathname.lastIndexOf('/page/'));
				page = parseInt(pathname.substring(pathname.lastIndexOf('/page/') + 6, pathname.lastIndexOf('/'))) || 1;
			}
			return await renderHTML(request, await getCategoryOrTagsData(request, "tags", key, page, env), theme + "/index.html", 200, env, ctx);
		}
		// --- START: 在这里添加搜索路由 ---
		else if (pathname.startsWith("/search/")) {
			let key = pathname.substring(8, pathname.lastIndexOf('/'));
			let page = 1;
			// 搜索页也支持分页 (可选, 但结构最好一致)
			if (pathname.substring(8, pathname.length).includes("page/")) {
				key = pathname.substring(8, pathname.lastIndexOf('/page/'));
				page = parseInt(pathname.substring(pathname.lastIndexOf('/page/') + 6, pathname.lastIndexOf('/'))) || 1;
			}
			// 我们需要一个新的函数来处理搜索逻辑, 类似于 getCategoryOrTagsData
			return await renderHTML(request, await getSearchData(request, key, page, env), theme + "/index.html", 200, env, ctx);
		}
		// --- END: 搜索路由 ---
		else if (pathname.startsWith("/admin")) {
			if (pathname === "/admin" || pathname === "/admin/" || pathname.endsWith("/admin/index.html")) {
				let data = {};
                data["widgetCategoryList"] = await env.XYRJ_CONFIG.get("WidgetCategory") || '[]';
                data["widgetMenuList"] = await env.XYRJ_CONFIG.get("WidgetMenu") || '[]';
                data["widgetLinkList"] = await env.XYRJ_CONFIG.get("WidgetLink") || '[]';
                data["footer_links"] = await env.XYRJ_CONFIG.get("footer_links") || '[]';
                data["site_footer_copyright"] = await env.XYRJ_CONFIG.get("site_footer_copyright") || '';
                data["site_description"] = await env.XYRJ_CONFIG.get("site_description") || '';
                data["site_keywords"] = await env.XYRJ_CONFIG.get("site_keywords") || '';
                data["siteName"] = await env.XYRJ_CONFIG.get("siteName") || '';
                data["logo"] = await env.XYRJ_CONFIG.get("logo") || '';
                const showSiteNameInHeader = await env.XYRJ_CONFIG.get("showSiteNameInHeader");
                
                if (showSiteNameInHeader === 'false') {
                    data["showSiteNameInHeader_false"] = true;
                } else {
                    data["showSiteNameInHeader_true"] = true;
                }
                
				return await renderHTML(request, data, theme + "/admin/index.html", 200, env, ctx);
			}
			// --- START: 新增的安全登录API路由 ---
			else if (pathname === "/admin/login" && request.method === "POST") {
				try {
					const { username, password } = await request.json();
					
					// 在这里安全地比较环境变量
					if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
						// 凭据正确
						return new Response(JSON.stringify({ status: "ok" }), { 
							status: 200, 
							headers: { 'Content-Type': 'application/json' }
						});
					} else {
						// 凭据错误
						return new Response(JSON.stringify({ status: "error", message: "Invalid credentials" }), { 
							status: 401, // 401 Unauthorized
							headers: { 'Content-Type': 'application/json' }
						});
					}
				} catch (e) {
					// 请求格式错误
					return new Response(JSON.stringify({ status: "error", message: "Bad request" }), { 
						status: 400, 
						headers: { 'Content-Type': 'application/json' }
					});
				}
			}
			// --- END: 新增的登录API路由 ---
			else if (checkPass(request, env)) {
				if (pathname.startsWith("/admin/saveAddNew/")) {
					let jsonA = await request.json();
					let article = {};
                    article['category[]'] = []; 
                    jsonA.forEach(function (item) {
                        if (item.name === 'category[]') {
                            article[item.name].push(item.value);
                        } else {
                            article[item.name] = item.value;
                        }
                    });
					
                    const id = Date.now().toString();
					article.id = id;

                    // ========== START: 新增字段类型转换 ==========
                    article.isPinned = article.isPinned === 'true'; // 转为布尔值
                    article.views = parseInt(article.views || 0); // 转为数字
					article.isHidden = article.isHidden === 'true'; // 转为布尔值
                    // article.password 保持为字符串
                    // ========== END: 新增字段类型转换 ==========

                    article.contentHtml = article.content;
                    delete article.content;

                    const articleMeta = {
                        id: article.id,
                        title: article.title,
                        link: article.link,
                        createDate: article.createDate,
                        'category[]': article['category[]'],
                        tags: article.tags,
                        contentText: (article.contentHtml || "").replace(/<[^>]+>/g, "").substring(0, 180),
                        firstImageUrl: article.img || getFirstImageUrl(article.contentHtml) || `${cdn}/${theme}/files/noimage.jpg`,
                        
                        // ========== START: 新增Meta字段 ==========
                        isPinned: article.isPinned, // 布尔值
                        hasPassword: !!article.password, // 布尔值
                        views: article.views, // 数字
						isHidden: article.isHidden // 布尔值
                        // ========== END: 新增Meta字段 ==========
                    };

					let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
					articleIndex.unshift(articleMeta);
					
                    await env.XYRJ_BLOG.put("article_index", JSON.stringify(articleIndex));
                    await env.XYRJ_BLOG.put(`article:${id}`, JSON.stringify(article));

					return new Response(JSON.stringify({ "id": id, "msg": "OK" }), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}
				else if (pathname.startsWith("/admin/saveEdit/")) {
					let jsonA = await request.json();
					let article = {};
                    article['category[]'] = [];
                    jsonA.forEach(function (item) {
                        if (item.name === 'category[]') {
                            article[item.name].push(item.value);
                        } else {
                            article[item.name] = item.value;
                        }
                    });

                    // ========== START: 新增字段类型转换 ==========
                    article.isPinned = article.isPinned === 'true'; // 转为布尔值
                    article.views = parseInt(article.views || 0); // 转为数字
					article.isHidden = article.isHidden === 'true'; // 转为布尔值
                    // article.password 保持为字符串
                    // ========== END: 新增字段类型转换 ==========

                    article.contentHtml = article.content;
                    delete article.content;

                    const id = article.id;
                    const articleMeta = {
                        id: article.id,
                        title: article.title,
                        link: article.link,
                        createDate: article.createDate,
                        'category[]': article['category[]'],
                        tags: article.tags,
                        contentText: (article.contentHtml || "").replace(/<[^>]+>/g, "").substring(0, 180),
                        firstImageUrl: article.img || getFirstImageUrl(article.contentHtml) || `${cdn}/${theme}/files/noimage.jpg`,

                        // ========== START: 新增Meta字段 ==========
                        isPinned: article.isPinned, // 布尔值
                        hasPassword: !!article.password, // 布尔值
                        views: article.views, // 数字
						isHidden: article.isHidden // 布尔值
                        // ========== END: 新增Meta字段 ==========
                    };

					let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
					const index = articleIndex.findIndex(item => item.id === id);
					if (index > -1) {
						articleIndex[index] = articleMeta;
					}

                    await env.XYRJ_BLOG.put("article_index", JSON.stringify(articleIndex));
					await env.XYRJ_BLOG.put(`article:${id}`, JSON.stringify(article));

					return new Response(JSON.stringify({ "id": id, "msg": "OK" }), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}
				else if (pathname.startsWith("/admin/get/")) {
					const parts = pathname.split('/');
					const id = parts[3]; 
					if (!id) {
						return new Response(JSON.stringify({ msg: "Article ID is missing." }), { status: 400, headers: { 'Content-Type': 'application/json' }});
					}
					const articleSingle = await env.XYRJ_BLOG.get(`article:${id}`, {type: "json"});
					if (articleSingle) {
                        articleSingle.createDate10 = articleSingle.createDate.substring(0, 10);
                        
                        // ========== START: 修复内容加载BUG ==========
                        // 将 contentHtml 转换回 content 以供 TinyMCE 编辑器使用
                        articleSingle.content = articleSingle.contentHtml || "";
                        delete articleSingle.contentHtml;
                        // ========== END: 修复内容加载BUG ==========

						return new Response(JSON.stringify(articleSingle), { status: 200, headers: { 'Content-Type': 'application/json' }});
					} else {
						return new Response(JSON.stringify({ msg: `Article with ID ${id} not found.` }), { status: 404, headers: { 'Content-Type': 'application/json' }});
					}
				}
				else if (pathname.startsWith("/admin/getList/")) {
					// (删除) 不再从路径获取页码
					// let page = pathname.substring(15, pathname.lastIndexOf('/')); 
					
					// (新增) 从URL查询参数获取分页信息
					const url = new URL(request.url);
					let page = parseInt(url.searchParams.get('page') || '1');
					let pageSize = parseInt(url.searchParams.get('size') || '10'); // (修改) 从查询参数获取 size
					if (pageSize < 1) pageSize = 10;
					if (page < 1) page = 1;

					let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
					
					let totalItems = articleIndex.length; // (新增) 获取总条目数

					// (删除) 不再需要 total_pages
					// let total_pages = Math.ceil(articleIndex.length / pageSize); 
					
					let result = articleIndex.slice((page - 1) * pageSize, page * pageSize);
					
					// (新增) 定义新的返回结构
					let responseData = {
						data: result,
						totalItems: totalItems
					};
					// (修改) 返回新的数据结构
					return new Response(JSON.stringify(responseData), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}
				else if (pathname.startsWith("/admin/delete/")) {
					const parts = pathname.split('/');
    				const id = parts[3];
					let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
					const index = articleIndex.findIndex(item => item.id === id);
					if (index > -1) {
						articleIndex.splice(index, 1);
                        await env.XYRJ_BLOG.delete(`article:${id}`);
						await env.XYRJ_BLOG.put("article_index", JSON.stringify(articleIndex));
						return new Response(JSON.stringify({ "msg": "OK" }), { status: 200, headers: { 'Content-Type': 'application/json' }});
					}
					return new Response(JSON.stringify({ "msg": "Article not found" }), { status: 404, headers: { 'Content-Type': 'application/json' }});
				}
				// --- START: 新增的后台文章搜索API ---
				else if (pathname.startsWith("/admin/api/search/articles")) {
					const url = new URL(request.url);
					// 从URL获取查询参数 'q'
					const query = (url.searchParams.get('q') || '').toLowerCase();
					
					if (!query) {
						// 如果查询为空，返回空数组
						return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' }});
					}

					let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
					
					// 在 article_index 中搜索
					const results = articleIndex.filter(item => {
						const title = (item.title || "").toLowerCase();
						const id = (item.id || "").toLowerCase();
						// 将分类数组转为字符串，以便搜索
						const categories = (item['category[]'] || []).join(' ').toLowerCase(); 
						
						// 检查 ID, 标题, 或 分类 是否包含搜索词
						return title.includes(query) || id.includes(query) || categories.includes(query);
					});

					// 搜索结果不需要分页，一次性返回所有匹配项
					return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}
				// --- END: 新增的后台文章搜索API ---
				else if (pathname.startsWith("/admin/saveConfig/")) {
					let receivedData = await request.json();
					for (const item of receivedData) {
						await env.XYRJ_CONFIG.put(item.name, item.value);
					}
					return new Response(JSON.stringify({ "msg": "OK" }), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}
				else if (pathname.startsWith("/admin/export/")) {
					const CONFIG_keys = await env.XYRJ_CONFIG.list();
					let CONFIG_json = {};
					for (const key of CONFIG_keys.keys) { CONFIG_json[key.name] = await env.XYRJ_CONFIG.get(key.name); }
					const BLOG_keys = await env.XYRJ_BLOG.list();
					let BLOG_json = {};
					for (const key of BLOG_keys.keys) { BLOG_json[key.name] = await env.XYRJ_BLOG.get(key.name); }
					return new Response(JSON.stringify({ "CONFIG": CONFIG_json, "BLOG": BLOG_json, }), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}
				else if (pathname.startsWith("/admin/import/")) {
					let jsonA = await request.json();
					let config = {};
					jsonA.forEach(function (item) { config[item.name] = item.value; });
					let data = JSON.parse(config.importJson);
					for (var key in data.CONFIG) { await env.XYRJ_CONFIG.put(key, data.CONFIG[key]); }
					for (var key in data.BLOG) { await env.XYRJ_BLOG.put(key, data.BLOG[key]); }
					return new Response(JSON.stringify({ "msg": "OK" }), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}
				else if (pathname.startsWith("/admin/publish/")) {
					const cache = caches.default;
        			await cache.delete(new Request(new URL("/", request.url).toString()));
					return new Response(JSON.stringify({ "msg": "OK" }), { status: 200, headers: { 'Content-Type': 'application/json' }});
				}

				// --- START: 在这里插入新路由 ---
				else if (pathname === '/admin/api/comments_full' && request.method === 'GET') {
					// 因为此路由在 checkPass(request) 内部，所以是安全的
					const allKeys = await env.XYRJ_COMMENTS_KV.list();
					let allComments = [];
					for (const key of allKeys.keys) {
						const comments = await env.XYRJ_COMMENTS_KV.get(key.name, { type: 'json' });
						if (comments) {
							comments.forEach(c => {
								// 直接推送原始评论 'c'，不进行任何打码
								allComments.push({ 
									...c, 
									id: crypto.randomUUID(), // 为后台生成临时ID
									articleSlug: key.name 
								});
							});
						}
					}
					allComments.sort((a, b) => b.timestamp - a.timestamp);
					// 返回未打码的完整数据
					return new Response(JSON.stringify(allComments), { headers: { 'Content-Type': 'application/json' } });
				}
				// --- END: 新路由结束 ---

			}
			else {
				return new Response("Unauthorized", { status: 401 });
			}
		}
		else if (pathname.startsWith("/sitemap.xml")) {
			let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
			let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
			for (const item of articleIndex) {
				xml += `<url><loc>${url.origin}/article/${item.id}/${item.link}</loc><lastmod>${new Date(item.createDate).toISOString()}</lastmod></url>`;
			}
			xml += `</urlset>`;
			return new Response(xml, { status: 200, headers: { 'Content-Type': 'application/xml;charset=UTF-8' }});
		}

		// --- START: [修改 1] 在这里插入新的安全GET接口 ---
		else if (pathname.startsWith('/api/comments/') && request.method === 'GET') {
			const articleSlug = pathname.split('/')[3]; 
			if (!articleSlug) {
				return new Response(JSON.stringify({ error: "Article slug is missing" }), { status: 400, headers: { 'Content-Type': 'application/json' }});
			}

			const comments = await env.XYRJ_COMMENTS_KV.get(articleSlug, { type: 'json' }) || [];

			// --- 这是关键的安全处理：在服务器端进行脱敏 ---
			const safeComments = comments.map(comment => {
				let processedComment = {...comment}; // 创建副本以避免修改原始数据（如果需要）
				if (processedComment.contact && processedComment.contact.value && processedComment.contact.value.length > 2) {
					// 在服务器上直接修改数据
					processedComment.contact.value = processedComment.contact.value.substring(0, 2) + '*'.repeat(processedComment.contact.value.length - 2);
				}
				// 为前端生成一个唯一的、可用于Cravatar的ID (如果您的前端需要)
                // 注意：您粘贴的 article.html 似乎不需要ID，我们现在不生成ID
				// processedComment.id = crypto.randomUUID(); 
				return processedComment;
			});
			// --- 安全处理结束 ---

			return new Response(JSON.stringify(safeComments), { 
				status: 200, 
				headers: { 'Content-Type': 'application/json' } 
			});
		}
		// --- END: 新接口结束 ---

		else if (pathname.startsWith('/api/comments/') && request.method === 'POST') {
			const articleSlug = pathname.split('/')[3];
			let newComment = await request.json();
			const comments = await env.XYRJ_COMMENTS_KV.get(articleSlug, { type: 'json' }) || [];
			// newComment.id = crypto.randomUUID(); // --- [修改 2] 已注释掉
			comments.push(newComment);
			await env.XYRJ_COMMENTS_KV.put(articleSlug, JSON.stringify(comments));
			// 返回保存的数据，而不是带有生成ID的数据
			return new Response(JSON.stringify(newComment), { status: 201, headers: { 'Content-Type': 'application/json' } });
		}
		else if (pathname.startsWith('/api/comments/') && request.method === 'DELETE') {
			// 后台删除接口保持不变，它依赖于 /api/comments_all 生成的临时ID
			const [_a, _b, _c, articleSlug, commentId] = pathname.split('/');
			let comments = await env.XYRJ_COMMENTS_KV.get(articleSlug, { type: 'json' }) || [];
			
            let commentsWithIds = comments.map(c => ({ ...c, id: crypto.randomUUID() }));
			const updatedComments = commentsWithIds.filter(c => c.id !== commentId);
			const commentsToSave = updatedComments.map(({ id, ...rest }) => rest);

			await env.XYRJ_COMMENTS_KV.put(articleSlug, JSON.stringify(commentsToSave));
			return new Response('Comment deleted', { status: 200 });
		}
		else if (pathname === '/api/comments_all' && request.method === 'GET') {
			// 这个接口主要供后台使用，但也可能被前端侧边栏调用
			const allKeys = await env.XYRJ_COMMENTS_KV.list();
			let allComments = [];
			for (const key of allKeys.keys) {
				const comments = await env.XYRJ_COMMENTS_KV.get(key.name, { type: 'json' });
				if (comments) {
					// --- [修改 3] 对 /api/comments_all (侧边栏和后台) 进行安全打码 ---
					comments.forEach(c => {
						let processedComment = {...c}; // 创建副本
						// --- START: 在此处添加服务器端打码 ---
						if (processedComment.contact && processedComment.contact.value && processedComment.contact.value.length > 2) {
							processedComment.contact.value = processedComment.contact.value.substring(0, 2) + '*'.repeat(processedComment.contact.value.length - 2);
						}
						// --- END: 打码结束 ---

						allComments.push({ 
                            ...processedComment, 
                            id: crypto.randomUUID(), // 为后台生成临时ID
                            articleSlug: key.name 
                        });
					});
				}
			}
			allComments.sort((a, b) => b.timestamp - a.timestamp);
			// 返回的数据已经是打码后的
			return new Response(JSON.stringify(allComments), { headers: { 'Content-Type': 'application/json' } });
		}
		else if (pathname === '/api/carousel' && request.method === 'GET') {
			const slides = await env.XYRJ_CAROUSEL_KV.get('slides', { type: 'json' }) || [];
			return new Response(JSON.stringify(slides), { headers: { 'Content-Type': 'application/json' } });
		}
		else if (pathname === '/api/carousel' && request.method === 'POST') {
			let slides = await env.XYRJ_CAROUSEL_KV.get('slides', { type: 'json' }) || [];
			let newSlide = await request.json();
			newSlide.id = crypto.randomUUID();
			slides.push(newSlide);
			await env.XYRJ_CAROUSEL_KV.put('slides', JSON.stringify(slides));
			return new Response(JSON.stringify(newSlide), { status: 201, headers: { 'Content-Type': 'application/json' } });
		}
		else if (pathname.startsWith('/api/carousel/') && request.method === 'DELETE') {
			const slideId = pathname.split('/').pop();
			let slides = await env.XYRJ_CAROUSEL_KV.get('slides', { type: 'json' }) || [];
			const updatedSlides = slides.filter(s => s.id !== slideId);
			await env.XYRJ_CAROUSEL_KV.put('slides', JSON.stringify(updatedSlides));
			return new Response('Carousel slide deleted', { status: 200 });
		}
		else {
			return await getStaticFile(request, env, ctx);
		}
	} catch (e) {
		return new Response(e.stack, { status: 500 });
	}
}

function checkPass(request, env) {
	const cookie = request.headers.get("cookie");
	if (!cookie) return false;
	const cookies = cookie.split(';').reduce((acc, c) => {
		const [key, v] = c.trim().split('=');
		// 添加一个检查，确保 key 不是 undefined
		if (key) {
			acc[key] = decodeURIComponent(v);
		}
		return acc;
	}, {});

	// 同时检查 Cookie 中的 username 和 password 
	// 是否与你在 Cloudflare 设置的 ADMIN_USERNAME 和 ADMIN_PASSWORD 一致
	return cookies["username"] === env.ADMIN_USERNAME && cookies["password"] === env.ADMIN_PASSWORD;
}

async function getStaticFile(request, env, ctx) {
	const url = new URL(request.url);
	const cache = caches.default;
	let response = await cache.match(request);
	if (!response) {
		const pagesUrl = url.toString().replace(url.origin, "https://myblog-1dt.pages.dev");
		response = await fetch(pagesUrl);
		if (response.ok) {
			ctx.waitUntil(cache.put(request, response.clone()));
		}
	}
	return response;
}

async function renderHTML(request, data, path, status, env) {
	const body = await render(data, path, env);
	return new Response(body, {
		status: status, headers: { "Content-Type": "text/html;charset=UTF-8" },
	});
}

async function render(data, template_path, env) {
    const templateUrl = cdn + "/" + template_path;
	let templateResponse = await fetch(templateUrl);
	let template = await templateResponse.text();
    
    const [
        logo,
        siteName,
        widgetMenuList_JSON, // 重命名变量以便清晰区分原始JSON和处理后的对象
        theme_github_path,
        site_description,
        site_keywords,
        site_footer_copyright,
        footer_links_json,
        showSiteNameInHeader
    ] = await Promise.all([
        env.XYRJ_CONFIG.get('logo'),
        env.XYRJ_CONFIG.get('siteName'),
        env.XYRJ_CONFIG.get('WidgetMenu'),
        env.XYRJ_CONFIG.get('theme_github_path'),
        env.XYRJ_CONFIG.get('site_description'),
        env.XYRJ_CONFIG.get('site_keywords'),
        env.XYRJ_CONFIG.get('site_footer_copyright'),
        env.XYRJ_CONFIG.get('footer_links'),
        env.XYRJ_CONFIG.get('showSiteNameInHeader')
    ]);

    site.logo = logo || "";
    site.siteName = siteName || "";
    site.theme_github_path = theme_github_path || site.theme_github_path;
    site.siteDescription = site_description || "";
    site.siteKeywords = site_keywords || "";
    site.showSiteNameInHeader = showSiteNameInHeader === 'true';

    // ===== 核心修改：在这里预处理菜单数据 =====
    try {
        let widgetMenuList = JSON.parse(widgetMenuList_JSON || "[]");

        // 创建一个递归函数，为每个菜单项明确添加 hasChildren 标记
        function processMenuItems(items) {
            if (!items || !Array.isArray(items)) {
                return;
            }
            items.forEach(item => {
                // 检查当前项是否有子菜单，并且子菜单不是一个空数组
                if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                    // 如果有，就明确地添加 hasChildren: true
                    item.hasChildren = true;
                    // 然后继续递归处理它的子菜单
                    processMenuItems(item.children);
                } else {
                    // 否则，就明确地设置为 false
                    item.hasChildren = false;
                }
            });
        }

        // 执行这个处理函数
        processMenuItems(widgetMenuList);
        // 将处理好的、带有明确标记的菜单列表赋值给 site 对象
        site.widgetMenuList = widgetMenuList;

    } catch (e) {
        site.widgetMenuList = [];
    }
    // ===== 修改结束 =====
    
	let renderData = { 
        ...data, 
        OPT: site,
    };

    if (!template_path.includes('admin')) {
        let footer_links_html = '';
        if (footer_links_json) {
            try {
                const links = JSON.parse(footer_links_json);
                if (Array.isArray(links)) {
                    links.forEach((link, index) => {
                        const icon_html = link.icon ? `<i class="${link.icon}"></i> ` : '';
                        footer_links_html += `<a href="${link.url}" target="_blank">${icon_html}${link.text}</a>`;
                        if (index < links.length - 1) {
                            footer_links_html += '<span class="split" style="margin: 0 3px;">|</span>';
                        }
                    });
                }
            } catch (e) { /* ignore */ }
        }
        renderData.footer_links = footer_links_html;
        renderData.site_footer_copyright = site_footer_copyright || '';
    }
    
	return mustache.render(template, renderData);
}

async function getIndexData(request, env) {
	let url = new URL(request.url);
	let page = 1;
	if (url.pathname.startsWith("/page/")) {
		page = parseInt(url.pathname.substring(6, url.pathname.lastIndexOf('/'))) || 1;
	}
	let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
	// 过滤掉隐藏的文章
	articleIndex = articleIndex.filter(item => !item.isHidden);
	
    // ========== START: 置顶排序 ==========
    articleIndex.sort((a, b) => {
        // (a.isPinned === true) 置于 (b.isPinned === false/undefined) 之前
        if (a.isPinned && !b.isPinned) return -1;
        // (a.isPinned === false/undefined) 置于 (b.isPinned === true) 之后
        if (!a.isPinned && b.isPinned) return 1;
        // 如果置顶状态相同，则按创建日期倒序
        return new Date(b.createDate) - new Date(a.createDate);
    });
    // ========== END: 置顶排序 ==========

	let pageSize = 10;
	let total_pages = Math.ceil(articleIndex.length / pageSize);
	let result = articleIndex.slice((page - 1) * pageSize, page * pageSize)
	for (const item of result) {
		item.url = `/article/${item.id}/${item.link}`;
		item.createDate10 = item.createDate.substring(0, 10);
        if (Array.isArray(item['category[]']) && item['category[]'].length > 0) {
            item.firstCategory = item['category[]'][0];
        }
		item.isPasswordProtected = item.hasPassword; // 修复密码图标
        // ========== START: 修复浏览量 ==========
        // 使用已保存的浏览量，如果不存在则默认为 0
        item.views = item.views || 0;
        // ========== END: 修复浏览量 ==========
	}
	let data = {};
	data["listTitle"] = "文章列表";
	data["articleList"] = result;
	data["page_html"] = generatePaginationHTML(page, total_pages, "/");
	data["widgetCategoryList"] = JSON.parse(await env.XYRJ_CONFIG.get("WidgetCategory") || "[]");
	data["widgetLinkList"] = JSON.parse(await env.XYRJ_CONFIG.get("WidgetLink") || "[]");
	
    try {
        data["carousel_slides"] = await env.XYRJ_CAROUSEL_KV.get("slides", { type: "json" }) || [];
    } catch(e) {
        console.error("Failed to get/parse carousel slides from KV:", e);
        data["carousel_slides"] = [];
    }

	let widgetRecentlyList = articleIndex.slice(0, 5); // 最近列表也将包含已排序的置顶文章
	for (const item of widgetRecentlyList) {
		item.url = `/article/${item.id}/${item.link}`;
		item.isPasswordProtected = item.hasPassword; // 修复密码图标
	}
	data["widgetRecentlyList"] = widgetRecentlyList;
	const allTags = new Set();
    articleIndex.forEach(article => {
        if (article.tags && typeof article.tags === 'string') {
            article.tags.split(',').forEach(tag => {
                const trimmedTag = tag.trim();
                if (trimmedTag) {
                    allTags.add(trimmedTag);
                }
            });
        }
    });

    // 将 Set 转换为 Mustache 需要的数组对象格式
    data["widgetTagList"] = Array.from(allTags).map(tag => {
        return { name: tag, url: `/tags/${encodeURIComponent(tag)}/` };
    });
    const siteName = await env.XYRJ_CONFIG.get('siteName') || 'cf-blog';
    data["title"] = siteName;
	return data;
}

async function getArticleData(request, id, env, ctx) {
	let data = {};
    const articleSingle = await env.XYRJ_BLOG.get(`article:${id}`, { type: "json" });
	if (!articleSingle) return new Response("Article not found", { status: 404 });

    // ========== START: 确保浏览量存在 ==========
	articleSingle.views = (articleSingle.views || 0) + 1;
    // ========== END: 确保浏览量存在 ==========
	// --- START: 异步更新浏览量到 KV ---
    // 3. 使用 ctx.waitUntil 异步执行保存，不阻塞响应
    const updateViews = async () => {
        try {
            // 3.1. 更新单个文章 KV
            await env.XYRJ_BLOG.put(`article:${id}`, JSON.stringify(articleSingle));

            // 3.2. 更新文章索引 KV
            let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
            const index = articleIndex.findIndex(item => item.id === id);
            if (index > -1) {
                // 确保 articleIndex 中的 meta 字段也更新
                articleIndex[index].views = articleSingle.views;
                await env.XYRJ_BLOG.put("article_index", JSON.stringify(articleIndex));
            }
        } catch (e) {
            console.error("Failed to update view count:", e);
        }
    };
    ctx.waitUntil(updateViews());
    // --- END: 异步更新浏览量到 KV ---
	// ========== START: PASSWORD CHECK LOGIC (THE FIX) ==========
    
    // 1. Check if the article itself has a password set
    const hasPassword = articleSingle.password && articleSingle.password.trim() !== "";
    let isEncrypted = false; // Default to not encrypted

    if (hasPassword) {
        // 2. If it has a password, assume it's encrypted until proven otherwise
        isEncrypted = true; 
        
        // 3. Check the cookies from the user's request
        const cookieHeader = request.headers.get("cookie") || "";
        const cookies = cookieHeader.split(';').reduce((acc, c) => {
            const [key, v] = c.trim().split('=');
            if (key) acc[key.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

        const cookieName = `article_pass_${id}`;
        const userPassword = cookies[cookieName];

        // 4. Compare cookie password with the article's actual password
        if (userPassword && userPassword === articleSingle.password) {
            // 5. If they match, the article is NOT encrypted for this user
            isEncrypted = false;
        }
    }

    // 6. Set the boolean for the template
    articleSingle.isEncrypted = isEncrypted;

    // 7. If it IS encrypted (i.e., password required but not provided or wrong),
    //    we MUST clear the content so the template doesn't render it.
    if (isEncrypted) {
        articleSingle.contentHtml = ""; // Clear the content
    }
    // ========== END: PASSWORD CHECK LOGIC (THE FIX) ==========

	if (articleSingle.tags && typeof articleSingle.tags === 'string') {
		// 按逗号分割，并移除可能的空字符串
		articleSingle.tags = articleSingle.tags.split(',').filter(tag => tag.trim() !== '');
	} else {
		articleSingle.tags = []; // 确保它总是一个数组
	}
	
	articleSingle.url = `/article/${articleSingle.id}/${articleSingle.link}`;
	articleSingle.content = articleSingle.contentHtml || "";
	articleSingle.createDate10 = articleSingle.createDate.substring(0, 10);

    const allCategoriesText = await env.XYRJ_CONFIG.get("WidgetCategory") || "[]";
    const allCategories = JSON.parse(allCategoriesText);
    const articleCategories = (articleSingle['category[]'] || []).map(catName => {
        const foundCat = allCategories.find(c => c.name === catName);
        return foundCat || { name: catName, icon: '' }; 
    });
    articleSingle.categories = articleCategories;

	data["articleSingle"] = articleSingle;
	
    // --- BEGIN MODIFICATION ---
    // 这是您要求修改的代码块
    let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
	// 过滤掉隐藏的文章
	articleIndex = articleIndex.filter(item => !item.isHidden);
	
    // ========== START: (BUGFIX) 置顶排序也应应用于文章页的 "上一篇/下一篇" ==========
    // 排序逻辑必须与 getIndexData 一致
    articleIndex.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createDate) - new Date(a.createDate);
    });
    // ========== END: (BUGFIX) ==========
    
    const index = articleIndex.findIndex(item => item.id === id)
	
	if (index > 0) {
		const newerArticle = articleIndex[index - 1];
		data["articleNewer"] = { 
			...newerArticle, 
			url: `/article/${newerArticle.id}/${newerArticle.link}`,
			img: newerArticle.firstImageUrl || '', // 将 firstImageUrl 别名为 img
			createDate10: newerArticle.createDate ? newerArticle.createDate.substring(0, 10) : '' // 添加 createDate10
		};
	}
	if (index < articleIndex.length - 1) {
		const olderArticle = articleIndex[index + 1];
		data["articleOlder"] = { 
			...olderArticle, 
			url: `/article/${olderArticle.id}/${olderArticle.link}`,
			img: olderArticle.firstImageUrl || '', // 将 firstImageUrl 别名为 img
			createDate10: olderArticle.createDate ? olderArticle.createDate.substring(0, 10) : '' // 添加 createDate10
		};
	}
    // --- END MODIFICATION ---

	const allTags = new Set();
articleIndex.forEach(article => {
    if (article.tags && typeof article.tags === 'string') {
        article.tags.split(',').forEach(tag => {
            const trimmedTag = tag.trim();
            if (trimmedTag) {
                allTags.add(trimmedTag);
            }
        });
    }
});

// 将 Set 转换为 Mustache 需要的数组对象格式
data["widgetTagList"] = Array.from(allTags).map(tag => {
    return { name: tag, url: `/tags/${encodeURIComponent(tag)}/` };
});

	let breadcrumb_html = `<a href="/"><i class="fas fa-home"></i> 主页</a>`;
	if (Array.isArray(articleSingle['category[]']) && articleSingle['category[]'].length > 0) {
		const firstCategoryName = articleSingle['category[]'][0];
		breadcrumb_html += ` / <a href="/category/${encodeURIComponent(firstCategoryName)}/">${firstCategoryName}</a>`;
	}
	data["articleBreadcrumb"] = breadcrumb_html;

	data["widgetCategoryList"] = allCategories;
	data["widgetLinkList"] = JSON.parse(await env.XYRJ_CONFIG.get("WidgetLink") || "[]");
	let widgetRecentlyList = articleIndex.slice(0, 5); // 同样会包含置顶
	for (const item of widgetRecentlyList) {
		item.url = `/article/${item.id}/${item.link}`;
		item.isPasswordProtected = item.hasPassword; // 修复密码图标
		item.createDate10 = item.createDate.substring(0, 10);
	}
	data["widgetRecentlyList"] = widgetRecentlyList;
    data["title"] = articleSingle.title;
	return data;
}

async function getCategoryOrTagsData(request, type, key, page, env) {
	let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
	// 过滤掉隐藏的文章
	articleIndex = articleIndex.filter(item => !item.isHidden);
	let result = [];
	const decodedKey = decodeURI(key);
	for (const item of articleIndex) {
		if (type === "category") {
			if (Array.isArray(item['category[]']) && item['category[]'].includes(decodedKey)) {
				result.push(item);
			}
		} else {
			if (item.tags && item.tags.includes(decodedKey)) {
				result.push(item);
			}
		}
	}

    // ========== START: 置顶排序 ==========
    // 在过滤后，分页前，对结果进行排序
    result.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createDate) - new Date(a.createDate);
    });
    // ========== END: 置顶排序 ==========

	let pageSize = 10;
	let total_pages = Math.ceil(result.length / pageSize);
	let resultPage = result.slice((page - 1) * pageSize, page * pageSize);
	for (const item of resultPage) {
		item.url = `/article/${item.id}/${item.link}`;
        if (Array.isArray(item['category[]']) && item['category[]'].length > 0) {
            item.firstCategory = item['category[]'][0];
        }
		item.isPasswordProtected = item.hasPassword; // 修复密码图标
        // ========== START: 修复浏览量 ==========
        item.views = item.views || 0;
        // ========== END: 修复浏览量 ==========
        item.createDate10 = item.createDate.substring(0, 10);
	}
	let data = {};
    data["listTitle"] = decodedKey;
	data["articleList"] = resultPage;
	data["page_html"] = generatePaginationHTML(page, total_pages, `/${type}/${key}`);

	data["widgetCategoryList"] = JSON.parse(await env.XYRJ_CONFIG.get("WidgetCategory") || "[]");
	data["widgetLinkList"] = JSON.parse(await env.XYRJ_CONFIG.get("WidgetLink") || "[]");
	
    // 注意：这里的 widgetRecentlyList 应该从完整的 articleIndex 获取，而不是从已过滤的 result 获取
    let fullArticleIndexForWidgets = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
	// 过滤掉隐藏的文章
	fullArticleIndexForWidgets = fullArticleIndexForWidgets.filter(item => !item.isHidden);
    fullArticleIndexForWidgets.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createDate) - new Date(a.createDate);
    });
    
    let widgetRecentlyList = fullArticleIndexForWidgets.slice(0, 5);
	for (const item of widgetRecentlyList) {
		item.url = `/article/${item.id}/${item.link}`;
		item.isPasswordProtected = item.hasPassword; // 修复密码图标
        item.createDate10 = item.createDate.substring(0, 10);
	}
	data["widgetRecentlyList"] = widgetRecentlyList;
	const allTags = new Set();
    articleIndex.forEach(article => {
        if (article.tags && typeof article.tags === 'string') {
            article.tags.split(',').forEach(tag => {
                const trimmedTag = tag.trim();
                if (trimmedTag) {
                    allTags.add(trimmedTag);
                }
            });
        }
    });

    // 将 Set 转换为 Mustache 需要的数组对象格式
    data["widgetTagList"] = Array.from(allTags).map(tag => {
        return { name: tag, url: `/tags/${encodeURIComponent(tag)}/` };
    });
    const siteName = await env.XYRJ_CONFIG.get('siteName') || 'cf-blog';
    data["title"] = `${decodedKey} - ${siteName}`;
	return data;
}
// --- START: 在这里添加新的 getSearchData 函数 ---
async function getSearchData(request, key, page, env) {
	let articleIndex = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
	// 过滤掉隐藏的文章
	articleIndex = articleIndex.filter(item => !item.isHidden);
	let result = [];
	const decodedKey = decodeURI(key).toLowerCase(); // 解码并转为小写以方便比较

	for (const item of articleIndex) {
		// 检查标题或内容摘要是否包含关键词
		const titleMatch = (item.title || "").toLowerCase().includes(decodedKey);
		const contentMatch = (item.contentText || "").toLowerCase().includes(decodedKey);
		
		if (titleMatch || contentMatch) {
			result.push(item);
		}
	}

    // 搜索结果同样需要排序
    result.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createDate) - new Date(a.createDate);
    });

	let pageSize = 10;
	let total_pages = Math.ceil(result.length / pageSize);
	let resultPage = result.slice((page - 1) * pageSize, page * pageSize);
	for (const item of resultPage) {
		item.url = `/article/${item.id}/${item.link}`;
        if (Array.isArray(item['category[]']) && item['category[]'].length > 0) {
            item.firstCategory = item['category[]'][0];
        }
		item.isPasswordProtected = item.hasPassword;
        item.views = item.views || 0;
        item.createDate10 = item.createDate.substring(0, 10);
	}

	let data = {};
    data["listTitle"] = `搜索: "${decodeURI(key)}"`; // 显示搜索的关键词
	data["articleList"] = resultPage;

	// 处理分页链接
	data["page_html"] = generatePaginationHTML(page, total_pages, `/search/${key}`);

	// --- 侧边栏小工具 (与 getCategoryOrTagsData 保持一致) ---
	data["widgetCategoryList"] = JSON.parse(await env.XYRJ_CONFIG.get("WidgetCategory") || "[]");
	data["widgetLinkList"] = JSON.parse(await env.XYRJ_CONFIG.get("WidgetLink") || "[]");
	
    let fullArticleIndexForWidgets = JSON.parse(await env.XYRJ_BLOG.get("article_index") || "[]");
	// 过滤掉隐藏的文章
	fullArticleIndexForWidgets = fullArticleIndexForWidgets.filter(item => !item.isHidden);
    fullArticleIndexForWidgets.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createDate) - new Date(a.createDate);
    });
    
    let widgetRecentlyList = fullArticleIndexForWidgets.slice(0, 5);
	for (const item of widgetRecentlyList) {
		item.url = `/article/${item.id}/${item.link}`;
		item.isPasswordProtected = item.hasPassword;
        item.createDate10 = item.createDate.substring(0, 10);
	}
	data["widgetRecentlyList"] = widgetRecentlyList;

	const allTags = new Set();
    articleIndex.forEach(article => {
        if (article.tags && typeof article.tags === 'string') {
            article.tags.split(',').forEach(tag => {
                const trimmedTag = tag.trim();
                if (trimmedTag) {
                    allTags.add(trimmedTag);
                }
            });
        }
    });
    data["widgetTagList"] = Array.from(allTags).map(tag => {
        return { name: tag, url: `/tags/${encodeURIComponent(tag)}/` };
    });
    
    const siteName = await env.XYRJ_CONFIG.get('siteName') || 'cf-blog';
    data["title"] = `搜索: "${decodeURI(key)}" - ${siteName}`;
	return data;
}
// --- END: 新的 getSearchData 函数 ---
// --- START: 新增的分页HTML生成函数 ---
function generatePaginationHTML(page, total_pages, page_base_url) {
	let page_html = "";
	if (total_pages > 1) {
	  let page_base = page_base_url === "/" ? "" : page_base_url; // 处理根路径
  
	  // 规范化URL，确保 page_base 不以 / 结尾
	  if (page_base.endsWith('/')) {
		page_base = page_base.slice(0, -1);
	  }
  
	  // 定义页面URL
	  // 首页URL
	  let first_page_url = page_base_url === "/" ? "/" : page_base + "/";
	  // 尾页URL
	  let last_page_url = `${page_base}/page/${total_pages}/`;
	  
	  // 上一页URL
	  let prev_page = Math.max(1, page - 1);
	  let prev_page_url = prev_page === 1 ? first_page_url : `${page_base}/page/${prev_page}/`;
	  
	  // 下一页URL
	  let next_page = Math.min(total_pages, page + 1);
	  let next_page_url = `${page_base}/page/${next_page}/`;
  
	  // --- 开始构建HTML ---
	  page_html = '<div class="pages">\n<div class="fenye">';
	  
	  // 首页
	  page_html += `<a href="${first_page_url}" class="extend" title="跳转到首页">首页</a>`;
	  
	  // 上一页 (仅在 page > 1 时显示)
	  if (page > 1) {
		page_html += `<a href="${prev_page_url}">上一页</a>`;
	  }
  
	  page_html += '&nbsp; &nbsp; <span class="pageobj-item">';
	  
	  // --- 页码逻辑 (5个数字) ---
	  let start_page = Math.max(1, page - 2);
	  let end_page = Math.min(total_pages, page + 2);
  
	  // 确保始终显示5个页码 (如果总页数足够)
	  if (page < 3) {
		  end_page = Math.min(total_pages, 5);
	  }
	  if (page > total_pages - 2) {
		  start_page = Math.max(1, total_pages - 4);
	  }
	  
	  // 循环生成页码
	  for (let i = start_page; i <= end_page; i++) {
		let i_page_url = i === 1 ? first_page_url : `${page_base}/page/${i}/`;
		if (i === page) {
		  page_html += `<a href="${i_page_url}" class="current">${i}</a>`;
		} else {
		  page_html += `<a href="${i_page_url}">${i}</a>`;
		}
	  }
	  // --- 页码逻辑结束 ---
  
	  page_html += '&nbsp; &nbsp; </span>\n';
	  
	  // 下一页 (仅在 page < total_pages 时显示)
	  if (page < total_pages) {
		page_html += `<a href="${next_page_url}">下一页</a>`;
	  }
	  
	  // 尾页
	  page_html += `<a href="${last_page_url}" class="extend" title="跳转到最后一页">尾页</a>`;
	  
	  // 页面计数
	  page_html += `<span class="page-count pagedbox">${page}/${total_pages}</span>`;
	  
	  page_html += '</div>\n</div>';
	}
	return page_html;
  }
  // --- END: 新增的分页HTML生成函数 ---
