/*!
betajs-media-components - v0.0.11 - 2016-02-16
Copyright (c) Ziggeo,Oliver Friedmann
Apache 2.0 Software License.
*/
/** @flow **//*!
betajs-scoped - v0.0.7 - 2016-02-06
Copyright (c) Oliver Friedmann
Apache 2.0 Software License.
*/
var Scoped = (function () {
var Globals = {

	get : function(key/* : string */) {
		if (typeof window !== "undefined")
			return window[key];
		if (typeof global !== "undefined")
			return global[key];
		return null;
	},

	set : function(key/* : string */, value) {
		if (typeof window !== "undefined")
			window[key] = value;
		if (typeof global !== "undefined")
			global[key] = value;
		return value;
	},
	
	setPath: function (path/* : string */, value) {
		var args = path.split(".");
		if (args.length == 1)
			return this.set(path, value);		
		var current = this.get(args[0]) || this.set(args[0], {});
		for (var i = 1; i < args.length - 1; ++i) {
			if (!(args[i] in current))
				current[args[i]] = {};
			current = current[args[i]];
		}
		current[args[args.length - 1]] = value;
		return value;
	},
	
	getPath: function (path/* : string */) {
		var args = path.split(".");
		if (args.length == 1)
			return this.get(path);		
		var current = this.get(args[0]);
		for (var i = 1; i < args.length; ++i) {
			if (!current)
				return current;
			current = current[args[i]];
		}
		return current;
	}

};
/*::
declare module Helper {
	declare function extend<A, B>(a: A, b: B): A & B;
}
*/

var Helper = {
		
	method: function (obj, func) {
		return function () {
			return func.apply(obj, arguments);
		};
	},

	extend: function (base, overwrite) {
		base = base || {};
		overwrite = overwrite || {};
		for (var key in overwrite)
			base[key] = overwrite[key];
		return base;
	},
	
	typeOf: function (obj) {
		return Object.prototype.toString.call(obj) === '[object Array]' ? "array" : typeof obj;
	},
	
	isEmpty: function (obj) {
		if (obj === null || typeof obj === "undefined")
			return true;
		if (this.typeOf(obj) == "array")
			return obj.length === 0;
		if (typeof obj !== "object")
			return false;
		for (var key in obj)
			return false;
		return true;
	},
	
	matchArgs: function (args, pattern) {
		var i = 0;
		var result = {};
		for (var key in pattern) {
			if (pattern[key] === true || this.typeOf(args[i]) == pattern[key]) {
				result[key] = args[i];
				i++;
			} else if (this.typeOf(args[i]) == "undefined")
				i++;
		}
		return result;
	},
	
	stringify: function (value) {
		if (this.typeOf(value) == "function")
			return "" + value;
		return JSON.stringify(value);
	}	

};
var Attach = {
		
	__namespace: "Scoped",
	__revert: null,
	
	upgrade: function (namespace/* : ?string */) {
		var current = Globals.get(namespace || Attach.__namespace);
		if (current && Helper.typeOf(current) == "object" && current.guid == this.guid && Helper.typeOf(current.version) == "string") {
			var my_version = this.version.split(".");
			var current_version = current.version.split(".");
			var newer = false;
			for (var i = 0; i < Math.min(my_version.length, current_version.length); ++i) {
				newer = parseInt(my_version[i], 10) > parseInt(current_version[i], 10);
				if (my_version[i] != current_version[i]) 
					break;
			}
			return newer ? this.attach(namespace) : current;				
		} else
			return this.attach(namespace);		
	},

	attach : function(namespace/* : ?string */) {
		if (namespace)
			Attach.__namespace = namespace;
		var current = Globals.get(Attach.__namespace);
		if (current == this)
			return this;
		Attach.__revert = current;
		if (current) {
			try {
				var exported = current.__exportScoped();
				this.__exportBackup = this.__exportScoped();
				this.__importScoped(exported);
			} catch (e) {
				// We cannot upgrade the old version.
			}
		}
		Globals.set(Attach.__namespace, this);
		return this;
	},
	
	detach: function (forceDetach/* : ?boolean */) {
		if (forceDetach)
			Globals.set(Attach.__namespace, null);
		if (typeof Attach.__revert != "undefined")
			Globals.set(Attach.__namespace, Attach.__revert);
		delete Attach.__revert;
		if (Attach.__exportBackup)
			this.__importScoped(Attach.__exportBackup);
		return this;
	},
	
	exports: function (mod, object, forceExport) {
		mod = mod || (typeof module != "undefined" ? module : null);
		if (typeof mod == "object" && mod && "exports" in mod && (forceExport || mod.exports == this || !mod.exports || Helper.isEmpty(mod.exports)))
			mod.exports = object || this;
		return this;
	}	

};

function newNamespace (opts/* : {tree ?: boolean, global ?: boolean, root ?: Object} */) {

	var options/* : {
		tree: boolean,
	    global: boolean,
	    root: Object
	} */ = {
		tree: typeof opts.tree === "boolean" ? opts.tree : false,
		global: typeof opts.global === "boolean" ? opts.global : false,
		root: typeof opts.root === "object" ? opts.root : {}
	};

	/*::
	type Node = {
		route: ?string,
		parent: ?Node,
		children: any,
		watchers: any,
		data: any,
		ready: boolean,
		lazy: any
	};
	*/

	function initNode(options)/* : Node */ {
		return {
			route: typeof options.route === "string" ? options.route : null,
			parent: typeof options.parent === "object" ? options.parent : null,
			ready: typeof options.ready === "boolean" ? options.ready : false,
			children: {},
			watchers: [],
			data: {},
			lazy: []
		};
	}
	
	var nsRoot = initNode({ready: true});
	
	if (options.tree) {
		if (options.global) {
			try {
				if (window)
					nsRoot.data = window;
			} catch (e) { }
			try {
				if (global)
					nsRoot.data = global;
			} catch (e) { }
		} else
			nsRoot.data = options.root;
	}
	
	function nodeDigest(node/* : Node */) {
		if (node.ready)
			return;
		if (node.parent && !node.parent.ready) {
			nodeDigest(node.parent);
			return;
		}
		if (node.route && node.parent && (node.route in node.parent.data)) {
			node.data = node.parent.data[node.route];
			node.ready = true;
			for (var i = 0; i < node.watchers.length; ++i)
				node.watchers[i].callback.call(node.watchers[i].context || this, node.data);
			node.watchers = [];
			for (var key in node.children)
				nodeDigest(node.children[key]);
		}
	}
	
	function nodeEnforce(node/* : Node */) {
		if (node.ready)
			return;
		if (node.parent && !node.parent.ready)
			nodeEnforce(node.parent);
		node.ready = true;
		if (node.parent) {
			if (options.tree && typeof node.parent.data == "object")
				node.parent.data[node.route] = node.data;
		}
		for (var i = 0; i < node.watchers.length; ++i)
			node.watchers[i].callback.call(node.watchers[i].context || this, node.data);
		node.watchers = [];
	}
	
	function nodeSetData(node/* : Node */, value) {
		if (typeof value == "object" && node.ready) {
			for (var key in value)
				node.data[key] = value[key];
		} else
			node.data = value;
		if (typeof value == "object") {
			for (var ckey in value) {
				if (node.children[ckey])
					node.children[ckey].data = value[ckey];
			}
		}
		nodeEnforce(node);
		for (var k in node.children)
			nodeDigest(node.children[k]);
	}
	
	function nodeClearData(node/* : Node */) {
		if (node.ready && node.data) {
			for (var key in node.data)
				delete node.data[key];
		}
	}
	
	function nodeNavigate(path/* : ?String */) {
		if (!path)
			return nsRoot;
		var routes = path.split(".");
		var current = nsRoot;
		for (var i = 0; i < routes.length; ++i) {
			if (routes[i] in current.children)
				current = current.children[routes[i]];
			else {
				current.children[routes[i]] = initNode({
					parent: current,
					route: routes[i]
				});
				current = current.children[routes[i]];
				nodeDigest(current);
			}
		}
		return current;
	}
	
	function nodeAddWatcher(node/* : Node */, callback, context) {
		if (node.ready)
			callback.call(context || this, node.data);
		else {
			node.watchers.push({
				callback: callback,
				context: context
			});
			if (node.lazy.length > 0) {
				var f = function (node) {
					if (node.lazy.length > 0) {
						var lazy = node.lazy.shift();
						lazy.callback.call(lazy.context || this, node.data);
						f(node);
					}
				};
				f(node);
			}
		}
	}
	
	function nodeUnresolvedWatchers(node/* : Node */, base, result) {
		node = node || nsRoot;
		result = result || [];
		if (!node.ready)
			result.push(base);
		for (var k in node.children) {
			var c = node.children[k];
			var r = (base ? base + "." : "") + c.route;
			result = nodeUnresolvedWatchers(c, r, result);
		}
		return result;
	}

	return {
		
		extend: function (path, value) {
			nodeSetData(nodeNavigate(path), value);
		},
		
		set: function (path, value) {
			var node = nodeNavigate(path);
			if (node.data)
				nodeClearData(node);
			nodeSetData(node, value);
		},
		
		get: function (path) {
			var node = nodeNavigate(path);
			return node.ready ? node.data : null;
		},
		
		lazy: function (path, callback, context) {
			var node = nodeNavigate(path);
			if (node.ready)
				callback(context || this, node.data);
			else {
				node.lazy.push({
					callback: callback,
					context: context
				});
			}
		},
		
		digest: function (path) {
			nodeDigest(nodeNavigate(path));
		},
		
		obtain: function (path, callback, context) {
			nodeAddWatcher(nodeNavigate(path), callback, context);
		},
		
		unresolvedWatchers: function (path) {
			return nodeUnresolvedWatchers(nodeNavigate(path), path);
		},
		
		__export: function () {
			return {
				options: options,
				nsRoot: nsRoot
			};
		},
		
		__import: function (data) {
			options = data.options;
			nsRoot = data.nsRoot;
		}
		
	};
	
}
function newScope (parent, parentNS, rootNS, globalNS) {
	
	var self = this;
	var nextScope = null;
	var childScopes = [];
	var parentNamespace = parentNS;
	var rootNamespace = rootNS;
	var globalNamespace = globalNS;
	var localNamespace = newNamespace({tree: true});
	var privateNamespace = newNamespace({tree: false});
	
	var bindings = {
		"global": {
			namespace: globalNamespace
		}, "root": {
			namespace: rootNamespace
		}, "local": {
			namespace: localNamespace
		}, "default": {
			namespace: privateNamespace
		}, "parent": {
			namespace: parentNamespace
		}, "scope": {
			namespace: localNamespace,
			readonly: false
		}
	};
	
	var custom = function (argmts, name, callback) {
		var args = Helper.matchArgs(argmts, {
			options: "object",
			namespaceLocator: true,
			dependencies: "array",
			hiddenDependencies: "array",
			callback: true,
			context: "object"
		});
		
		var options = Helper.extend({
			lazy: this.options.lazy
		}, args.options || {});
		
		var ns = this.resolve(args.namespaceLocator);
		
		var execute = function () {
			this.require(args.dependencies, args.hiddenDependencies, function () {
				arguments[arguments.length - 1].ns = ns;
				if (this.options.compile) {
					var params = [];
					for (var i = 0; i < argmts.length; ++i)
						params.push(Helper.stringify(argmts[i]));
					this.compiled += this.options.ident + "." + name + "(" + params.join(", ") + ");\n\n";
				}
				var result = this.options.compile ? {} : args.callback.apply(args.context || this, arguments);
				callback.call(this, ns, result);
			}, this);
		};
		
		if (options.lazy)
			ns.namespace.lazy(ns.path, execute, this);
		else
			execute.apply(this);

		return this;
	};
	
	return {
		
		getGlobal: Helper.method(Globals, Globals.getPath),
		setGlobal: Helper.method(Globals, Globals.setPath),
		
		options: {
			lazy: false,
			ident: "Scoped",
			compile: false			
		},
		
		compiled: "",
		
		nextScope: function () {
			if (!nextScope)
				nextScope = newScope(this, localNamespace, rootNamespace, globalNamespace);
			return nextScope;
		},
		
		subScope: function () {
			var sub = this.nextScope();
			childScopes.push(sub);
			nextScope = null;
			return sub;
		},
		
		binding: function (alias, namespaceLocator, options) {
			if (!bindings[alias] || !bindings[alias].readonly) {
				var ns;
				if (Helper.typeOf(namespaceLocator) != "string") {
					ns = {
						namespace: newNamespace({
							tree: true,
							root: namespaceLocator
						}),
						path: null	
					};
				} else
					ns = this.resolve(namespaceLocator);
				bindings[alias] = Helper.extend(options, ns);
			}
			return this;
		},
		
		resolve: function (namespaceLocator) {
			var parts = namespaceLocator.split(":");
			if (parts.length == 1) {
				return {
					namespace: privateNamespace,
					path: parts[0]
				};
			} else {
				var binding = bindings[parts[0]];
				if (!binding)
					throw ("The namespace '" + parts[0] + "' has not been defined (yet).");
				return {
					namespace: binding.namespace,
					path : binding.path && parts[1] ? binding.path + "." + parts[1] : (binding.path || parts[1])
				};
			}
		},
		
		define: function () {
			return custom.call(this, arguments, "define", function (ns, result) {
				if (ns.namespace.get(ns.path))
					throw ("Scoped namespace " + ns.path + " has already been defined. Use extend to extend an existing namespace instead");
				ns.namespace.set(ns.path, result);
			});
		},
		
		assume: function () {
			var args = Helper.matchArgs(arguments, {
				assumption: true,
				dependencies: "array",
				callback: true,
				context: "object",
				error: "string"
			});
			var dependencies = args.dependencies || [];
			dependencies.unshift(args.assumption);
			this.require(dependencies, function (assumptionValue) {
				if (!args.callback.apply(args.context || this, arguments))
					throw ("Scoped Assumption '" + args.assumption + "' failed, value is " + assumptionValue + (args.error ? ", but assuming " + args.error : "")); 
			});
		},
		
		assumeVersion: function () {
			var args = Helper.matchArgs(arguments, {
				assumption: true,
				dependencies: "array",
				callback: true,
				context: "object",
				error: "string"
			});
			var dependencies = args.dependencies || [];
			dependencies.unshift(args.assumption);
			this.require(dependencies, function () {
				var argv = arguments;
				var assumptionValue = argv[0];
				argv[0] = assumptionValue.split(".");
				for (var i = 0; i < argv[0].length; ++i)
					argv[0][i] = parseInt(argv[0][i], 10);
				if (Helper.typeOf(args.callback) === "function") {
					if (!args.callback.apply(args.context || this, args))
						throw ("Scoped Assumption '" + args.assumption + "' failed, value is " + assumptionValue + (args.error ? ", but assuming " + args.error : ""));
				} else {
					var version = (args.callback + "").split(".");
					for (var j = 0; j < Math.min(argv[0].length, version.length); ++j)
						if (parseInt(version[j], 10) > argv[0][j])
							throw ("Scoped Version Assumption '" + args.assumption + "' failed, value is " + assumptionValue + ", but assuming at least " + args.callback);
				}
			});
		},
		
		extend: function () {
			return custom.call(this, arguments, "extend", function (ns, result) {
				ns.namespace.extend(ns.path, result);
			});
		},
		
		condition: function () {
			return custom.call(this, arguments, "condition", function (ns, result) {
				if (result)
					ns.namespace.set(ns.path, result);
			});
		},
		
		require: function () {
			var args = Helper.matchArgs(arguments, {
				dependencies: "array",
				hiddenDependencies: "array",
				callback: "function",
				context: "object"
			});
			args.callback = args.callback || function () {};
			var dependencies = args.dependencies || [];
			var allDependencies = dependencies.concat(args.hiddenDependencies || []);
			var count = allDependencies.length;
			var deps = [];
			var environment = {};
			if (count) {
				var f = function (value) {
					if (this.i < deps.length)
						deps[this.i] = value;
					count--;
					if (count === 0) {
						deps.push(environment);
						args.callback.apply(args.context || this.ctx, deps);
					}
				};
				for (var i = 0; i < allDependencies.length; ++i) {
					var ns = this.resolve(allDependencies[i]);
					if (i < dependencies.length)
						deps.push(null);
					ns.namespace.obtain(ns.path, f, {
						ctx: this,
						i: i
					});
				}
			} else {
				deps.push(environment);
				args.callback.apply(args.context || this, deps);
			}
			return this;
		},
		
		digest: function (namespaceLocator) {
			var ns = this.resolve(namespaceLocator);
			ns.namespace.digest(ns.path);
			return this;
		},
		
		unresolved: function (namespaceLocator) {
			var ns = this.resolve(namespaceLocator);
			return ns.namespace.unresolvedWatchers(ns.path);
		},
		
		__export: function () {
			return {
				parentNamespace: parentNamespace.__export(),
				rootNamespace: rootNamespace.__export(),
				globalNamespace: globalNamespace.__export(),
				localNamespace: localNamespace.__export(),
				privateNamespace: privateNamespace.__export()
			};
		},
		
		__import: function (data) {
			parentNamespace.__import(data.parentNamespace);
			rootNamespace.__import(data.rootNamespace);
			globalNamespace.__import(data.globalNamespace);
			localNamespace.__import(data.localNamespace);
			privateNamespace.__import(data.privateNamespace);
		}
		
	};
	
}
var globalNamespace = newNamespace({tree: true, global: true});
var rootNamespace = newNamespace({tree: true});
var rootScope = newScope(null, rootNamespace, rootNamespace, globalNamespace);

var Public = Helper.extend(rootScope, {
		
	guid: "4b6878ee-cb6a-46b3-94ac-27d91f58d666",
	version: '37.1454812115138',
		
	upgrade: Attach.upgrade,
	attach: Attach.attach,
	detach: Attach.detach,
	exports: Attach.exports,
	
	__exportScoped: function () {
		return {
			globalNamespace: globalNamespace.__export(),
			rootNamespace: rootNamespace.__export(),
			rootScope: rootScope.__export()
		};
	},
	
	__importScoped: function (data) {
		globalNamespace.__import(data.globalNamespace);
		rootNamespace.__import(data.rootNamespace);
		rootScope.__import(data.rootScope);
	}
	
});

Public = Public.upgrade();
Public.exports();
	return Public;
}).call(this);
(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.MediaComponents');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('browser', 'global:BetaJS.Browser');
Scoped.binding('flash', 'global:BetaJS.Flash');
Scoped.binding('media', 'global:BetaJS.Media');
Scoped.binding('dynamics', 'global:BetaJS.Dynamics');
Scoped.binding('jquery', 'global:jQuery');
Scoped.define("module:", function () {
	return {
    "guid": "7a20804e-be62-4982-91c6-98eb096d2e70",
    "version": "21.1455673271079"
};
});
Scoped.assumeVersion('base:version', 474);
Scoped.assumeVersion('browser:version', 70);
Scoped.assumeVersion('flash:version', 27);
Scoped.assumeVersion('dynamics:version', 219);
Scoped.assumeVersion('media:version', 42);
Scoped.extend('module:Templates', function () {
return {"controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 ? (css + '-dashboard-hidden') : ''}}\">  <div class=\"{{css}}-progressbar {{activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small')}}\"       onmousedown=\"{{startUpdatePosition(domEvent)}}\"       onmouseup=\"{{stopUpdatePosition(domEvent)}}\"       onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"       onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">    <div class=\"{{css}}-progressbar-button\"></div>   </div>  </div>  <div class=\"{{css}}-backbar\"></div>  <div class=\"{{css}}-controlbar\">         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\"  ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>   <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-play\"></i>    </div>   </div>   <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>   </div>   <div class=\"{{css}}-time-container\">    <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>    <div class=\"{{css}}-time-sep\">/</div>    <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{duration_formatted}}</div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-resize-full\"></i>    </div>   </div>   <div class=\"{{css}}-volumebar\">    <div class=\"{{css}}-volumebar-inner\"         onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.min(100, Math.round(volume * 100)) + '%'}}}\">         <div class=\"{{css}}-volumebar-button\" title=\"{{string('volume-button')}}\"></div>     </div>        </div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>    </div>   </div>  </div> </div> ","loader":" <div class=\"{{css}}-loader-container\">     <div class=\"{{css}}-loader-loader\" title=\"{{string('tooltip')}}\">     </div> </div>","message":" <div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class='{{css}}-message-message'>         {{message}}     </div> </div>","playbutton":" <div class=\"{{css}}-playbutton-container\" ba-click=\"play()\" title=\"{{string('tooltip')}}\">  <div class=\"{{css}}-playbutton-button\"></div> </div> ","player":" <div     class=\"{{css}}-container {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}}\"     ba-on:mousemove=\"user_activity()\"     ba-on:mousedown=\"user_activity()\"     ba-on:touchstart=\"user_activity()\" >     <video class=\"{{css}}-video\" data-video=\"video\"></video>     <div class='{{css}}-overlay'>              <ba-{{dyncontrolbar}}             ba-css=\"{{csscontrolbar || css}}\"             ba-template=\"{{tmplcontrolbar}}\"             ba-show=\"{{controlbar_active}}\"             ba-playing=\"{{playing}}\"             ba-event:rerecord=\"rerecord\"             ba-event:play=\"play\"             ba-event:pause=\"pause\"             ba-event:position=\"seek\"             ba-event:volume=\"set_volume\"             ba-event:fullscreen=\"toggle_fullscreen\"             ba-volume=\"{{volume}}\"             ba-duration=\"{{duration}}\"             ba-cached=\"{{buffered}}\"             ba-position=\"{{position}}\"             ba-activitydelta=\"{{activity_delta}}\"             ba-rerecordable=\"{{rerecordable}}\"             ba-fullscreen=\"{{fullscreensupport}}\"         ></ba-{{dyncontrolbar}}>                  <ba-{{dynplaybutton}}             ba-css=\"{{cssplaybutton || css}}\"             ba-template=\"{{tmplplaybutton}}\"             ba-show=\"{{playbutton_active}}\"             ba-event:play=\"playbutton_click\"         ></ba-{{dynplaybutton}}>                  <ba-{{dynloader}}             ba-css=\"{{cssloader || css}}\"             ba-template=\"{{tmplloader}}\"             ba-show=\"{{loader_active}}\"         ></ba-{{dynloader}}>                  <ba-{{dynmessage}}             ba-css=\"{{cssmessage || css}}\"             ba-template=\"{{tmplmessage}}\"             ba-show=\"{{message_active}}\"             ba-message=\"{{message}}\"             ba-event:click=\"message_click\"         ></ba-{{dynmessage}}>     </div> </div> ","modern-controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 ? (css + '-dashboard-hidden') : ''}}\">        <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-ccw\"></i>            </div>        </div>  <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-play\"></i>   </div>  </div>  <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">    <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-pause\"></i>   </div>  </div>  <div class=\"{{css}}-time-container\">   <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}/{{duration_formatted}}</div>  </div>  <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-resize-full\"></i>   </div>  </div>  <div class=\"{{css}}-volumebar\">   <div class=\"{{css}}-volumebar-inner\"           onmousedown=\"{{startUpdateVolume(domEvent)}}\"                 onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                 onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                 onmousemove=\"{{progressUpdateVolume(domEvent)}}\">    <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>       </div>  </div>  <div class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>   </div>  </div>  <div class=\"{{css}}-progressbar\">   <div class=\"{{css}}-progressbar-inner\"        onmousedown=\"{{startUpdatePosition(domEvent)}}\"        onmouseup=\"{{stopUpdatePosition(domEvent)}}\"        onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"        onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\"></div>  </div> </div> "};
});
Scoped.extend("module:Assets", ["module:Assets"], function (Assets) {
    var languages = {"language:de":{"ba-videoplayer-playbutton.tooltip":"Hier clicken um Wiedergabe zu starten.","ba-videoplayer-loader.tooltip":"Video wird geladen...","ba-videoplayer-controlbar.video-progress":"Videofortschritt","ba-videoplayer-controlbar.rerecord-video":"Video erneut aufnehmen?","ba-videoplayer-controlbar.play-video":"Video wiedergeben","ba-videoplayer-controlbar.pause-video":"Video pausieren","ba-videoplayer-controlbar.elapsed-time":"Vergangene Zeit","ba-videoplayer-controlbar.total-time":"L&#xE4;nge des Videos","ba-videoplayer-controlbar.fullscreen-video":"Vollbildmodus","ba-videoplayer-controlbar.volume-button":"Lautst&#xE4;rke regulieren","ba-videoplayer-controlbar.volume-mute":"Ton abstellen","ba-videoplayer-controlbar.volume-unmute":"Ton wieder einstellen","ba-videoplayer.video-error":"Es ist ein Fehler aufgetreten, bitte versuchen Sie es sp&#xE4;ter noch einmal. Hier klicken, um es noch einmal zu probieren."}};
    for (var language in languages)
        Assets.strings.register(languages[language], [language]);
    return {};
});

Scoped.define("module:Assets", [
    "base:Classes.LocaleTable",
    "browser:Info"
], function (LocaleTable, Info) {
	
	var strings = new LocaleTable();
	strings.setWeakLocale(Info.language());
	
	return {
		
		strings: strings,
		
		themes: {}
		
	};
});
Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:Time",
    "module:Templates",
    "jquery:",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
], function (Class, Time, Templates, $, Assets, Info, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.controlbar,
			
			attrs: {
				"css": "ba-videoplayer",
				"duration": 0,
				"position": 0,
				"cached": 0,
				"volume": 1.0,
				"expandedprogress": true,
				"playing": false,
				"rerecordable": false,
				"fullscreen": true,
				"activitydelta": 0
			},
			
			functions: {
				
				startUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", true);
					this.call("progressUpdatePosition", event);
				},
				
				progressUpdatePosition: function (event) {
					event[0].preventDefault();
					if (!this.get("_updatePosition"))
						return;
					this.set("position", this.get("duration") * (event[0].clientX - $(event[0].currentTarget).offset().left) / $(event[0].currentTarget).width());
					this.trigger("position", this.get("position"));
				},
				
				stopUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", false);
				},
				
				startUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", true);
					this.call("progressUpdateVolume", event);
				},
				
				progressUpdateVolume: function (event) {
					event[0].preventDefault();
					if (!this.get("_updateVolume"))
						return;
					this.set("volume", (event[0].clientX - $(event[0].currentTarget).offset().left) / $(event[0].currentTarget).width());
					this.trigger("volume", this.get("volume"));
				},
				
				stopUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", false);
				},

				play: function () {
					this.trigger("play");
				},
				
				pause: function () {
					this.trigger("pause");
				},
				
				toggle_volume: function () {
					if (this.get("volume") > 0) {
						this.__oldVolume = this.get("volume");
						this.set("volume", 0);
					} else 
						this.set("volume", this.__oldVolume || 1);
					this.trigger("volume", this.get("volume"));
				},
				
				toggle_fullscreen: function () {
					this.trigger("fullscreen");
				},
				
				rerecord: function () {
					this.trigger("rerecord");
				}
				
			},
			
			create: function () {
				this.properties().compute("position_formatted", function () {
					return Time.formatTime(this.get("position") * 1000, "mm:ss");
				}, ['position']);
				this.properties().compute("duration_formatted", function () {
					return Time.formatTime(this.get("duration") * 1000, "mm:ss");
				}, ['duration']);
				this.set("ismobile", Info.isMobile());
			}
			
		};
	})
	.register("ba-videoplayer-controlbar")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"video-progress": "Video progress",
    	"rerecord-video": "Re-record video?",
    	"play-video": "Play video",
    	"pause-video": "Pause video",
    	"elapsed-time": "Elasped time",
    	"total-time": "Total length of video",
    	"fullscreen-video": "Enter fullscreen",
    	"volume-button": "Set volume",
    	"volume-mute": "Mute sound",
    	"volume-unmute": "Unmute sound"
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.loader,
			
			attrs: {
				"css": "ba-videoplayer"
			}
			
		};
	})
	.register("ba-videoplayer-loader")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Loading video..."
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Message", [
    "dynamics:Dynamic",
    "module:Templates"
], [
    "dynamics:Partials.ClickPartial"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.message,
			
			attrs: {
				"css": "ba-videoplayer",
				"message": ''
			},
			
			functions: {
				
				click: function () {
					this.trigger("click");
				}
				
			}
			
		};
	}).register("ba-videoplayer-message");
});
Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.playbutton,
			
			attrs: {
				"css": "ba-videoplayer"
			},
			
			functions: {
				
				play: function () {
					this.trigger("play");
				}
				
			}
			
		};
	})
	.register("ba-videoplayer-playbutton")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Click to play video."
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info",
    "media:Player.VideoPlayerWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates"
], [
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, VideoPlayerWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, InitialState, PlayerStates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.player,
			
			attrs: {
				/* CSS */
				"css": "ba-videoplayer",
				"iecss": "ba-videoplayer",
				"cssplaybutton": "",
				"cssloader": "",
				"cssmessage": "",
				"csscontrolbar": "",
				/* Themes */
				"theme": "",
				"csstheme": "",
				/* Dynamics */
				"dynplaybutton": "videoplayer-playbutton",
				"dynloader": "videoplayer-loader",
				"dynmessage": "videoplayer-message",
				"dyncontrolbar": "videoplayer-controlbar",
				/* Templates */
				"tmplplaybutton": "",
				"tmplloader": "",
				"tmplmessage": "",
				"tmplcontrolbar": "",
				/* Attributes */
				"poster": "",
				"source": "",
				"sources": [],
				/* Configuration */
				"forceflash": false,
				"noflash": false,
				/* Options */
				"rerecordable": false,
				"autoplay": false,
				"preload": false,
				"loop": false,
				"ready": true,
				/* States */
				"states": {
					"poster_error": {
						"ignore": false,
						"click_play": true
					}
				}				
			},

			types: {
				"forceflash": "boolean",
				"noflash": "boolean",
				"rerecordable": "boolean",
				"loop": "boolean",
				"autoplay": "boolean",
				"preload": "boolean",
				"ready": "boolean"				
			},
			
			extendables: ["states"],
			
			create: function () {
				if (this.get("theme") in Assets.themes)
					this.setAll(Assets.themes[this.get("theme")]);

				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("duration", 0.0);
				this.set("position", 0.0);
				this.set("buffered", 0.0);
				this.set("volume", 1.0);
				this.set("message", "");
				this.set("fullscreensupport", false);
				
				this.set("loader_active", false);
				this.set("playbutton_active", false);
				this.set("controlbar_active", false);
				this.set("message_active", false);

				this.set("last_activity", Time.now());
				this.set("activity_delta", 0);
				
				this.set("playing", false);
				
				this.__attachRequested = false;
				this.__activated = false;
				this.__error = null;
				
				this.host = this.auto_destroy(new Host({
					stateRegistry: new ClassRegistry(this.cls.playerStates())
				}));
				this.host.dynamic = this;
				this.host.initialize(InitialState);
				
				this._timer = this.auto_destroy(new Timers.Timer({
					context: this,
					fire: this._timerFire,
					delay: 100,
					start: true
				}));
				
				this.properties().compute("buffering", function () {
					return this.get("playing") && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
				}, ["buffered", "position", "last_position_change_delta", "playing"]);
			},
			
			state: function () {
				return this.host.state();
			},
			
			videoAttached: function () {
				return !!this.player;
			},
			
			videoLoaded: function () {
				return this.videoAttached() && this.player.loaded();
			},
			
			videoError: function () {
				return this.__error;
			},
			
			_error: function (error_type, error_code) {
				this.__error = {
					error_type: error_type,
					error_code: error_code
				};
				this.trigger("error:" + error_type, error_code);
				this.trigger("error", error_type, error_code);
			},
			
			_clearError: function () {
				this.__error = null;
			},
			
			_detachVideo: function () {
				this.set("playing", false);
				if (this.player)
					this.player.weakDestroy();
				this.player = null;
			},
			
			_attachVideo: function () {
				if (this.videoAttached())
					return;
				if (!this.__activated) {
					this.__attachRequested = true;
					return;
				}
				this.__attachRequested = false;
				var video = this.element().find("[data-video='video']").get(0);
				this._clearError();
				VideoPlayerWrapper.create({
			    	element: video,
			    	poster: this.get("poster"),
			    	source: this.get("source"),
			    	sources: this.get("sources"),
			    	forceflash: !!this.get("forceflash"),
			    	noflash: !!this.get("noflash"),
			    	preload: !!this.get("preload"),
					loop: !!this.get("loop")
			    }).error(function (e) {
			    	this._error("attach", e);
			    }, this).success(function (instance) {
			    	this.player = instance;			    	
			    	this.trigger("attached", instance);
					this.player.on("postererror", function () {
				    	this._error("poster");
					}, this);					
					this.player.once("loaded", function () {
						this.set("duration", this.player.duration());
						this.set("fullscreensupport", this.player.supportsFullscreen());
						this.trigger("loaded");
					}, this);
					if (this.player.loaded())
						this.player.trigger("loaded");
					this.player.on("playing", function () {
						this.set("playing", true);
						this.trigger("playing");
					}, this);
					this.player.on("error", function (e) {
						this._error("video", e);
					}, this);
			        if (this.player.error())
			        	this.player.trigger("error", this.player.error());
			        this.player.on("paused", function () {
			        	this.set("playing", false);
			        	this.trigger("paused");
			        }, this);
					this.player.on("ended", function () {
						this.set("playing", false);
						this.trigger("ended");
					}, this);
			    }, this);
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.call(this, element);
				this.__activated = true;
				if (this.__attachRequested)
					this._attachVideo();
			},
			
			reattachVideo: function () {
				this._detachVideo();
				this._attachVideo();
			},

			object_functions: ["play", "rerecord", "pause", "seek", "set_volume"],
			
			functions: {
				
				user_activity: function () {
					this.set("last_activity", Time.now());
					this.set("activity_delta", 0);
				},
				
				message_click: function () {
					this.trigger("message:click");
				},
				
				playbutton_click: function () {
					this.host.state().play();
				},
				
				play: function () {
					this.host.state().play();
				},
				
				rerecord: function () {
					if (!this.get("rerecordable"))
						return;
					this.trigger("rerecord");
				},
				
				pause: function () {
					if (this.get("playing"))
						this.player.pause();
				},
				
				seek: function (position) {
					if (this.videoLoaded())
						this.player.setPosition(position);
					this.trigger("seek", position);
				},

				set_volume: function (volume) {
					volume = Math.min(1.0, volume);
					this.set("volume", volume);
					if (this.videoLoaded()) {
						this.player.setVolume(volume);
						this.player.setMuted(volume <= 0);
					}
				},
				
				toggle_fullscreen: function () {
					if (this.videoLoaded())
						this.player.enterFullscreen();
				} 
			
			},
			
			destroy: function () {
				this._detachVideo();
				inherited.destroy.call(this);
			},
			
			_timerFire: function () {
				try {
					if (this.videoLoaded()) {
						this.set("activity_delta", Time.now() - this.get("last_activity"));
						var new_position = this.player.position();
						if (new_position != this.get("position") || this.get("last_position_change"))
							this.set("last_position_change", Time.now());
						this.set("last_position_change_delta", Time.now() - this.get("last_position_change"));
						this.set("position", new_position);
						this.set("buffered", this.player.buffered());
						this.set("duration", this.player.duration());
					}
				} catch (e) {}
			}

		};
	}, {
		
		playerStates: function () {
			return [PlayerStates];
		}
		
	}).register("ba-videoplayer")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"video-error": "An error occurred, please try again later. Click to retry."
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function (State, ListenMixin, Objs, scoped) {
	return State.extend({scoped: scoped}, [ListenMixin, {

		dynamics: [],
	
		_start: function () {
			this.dyn = this.host.dynamic;
			Objs.iter(Objs.extend({
				"loader": false,
				"message": false,
				"playbutton": false,
				"controlbar": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
		},
		
		play: function () {
			this.dyn.set("autoplay", true);
		}
	
	}]);
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.FatalError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
			_locals: ["message"],
	
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this._message || this.dyn.string("video-error"));
			}
	
		};
	});
});






Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Initial", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["loader"],
	
			_start: function () {
				inherited._start.call(this);
				if (this.dyn.get("ready"))
					this.next("LoadPlayer");
				else {
					this.listenOn(this.dyn, "change:ready", function () {
						this.next("LoadPlayer");
					});
				}
			}
	
		};
	});
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["loader"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "error:attach", function () {
					this.next("LoadError");
				}, this);
				this.listenOn(this.dyn, "error:poster", function () {
					if (!this.dyn.get("states").poster_error.ignore)
						this.next("PosterError");
				}, this);
				this.listenOn(this.dyn, "attached", function () {
					this.next("PosterReady");
				}, this);
				this.dyn.reattachVideo();
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
	
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this.dyn.string("video-error"));
				this.listenOn(this.dyn, "message:click", function () {
					this.next("LoadPlayer");
				}, this);
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["playbutton"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "error:poster", function () {
					if (!this.dyn.get("states").poster_error.ignore)
						this.next("PosterError");
				}, this);
				if (this.dyn.get("autoplay"))
					this.next("LoadVideo");
			},
			
			play: function () {
				this.next("LoadVideo");
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
			
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this.dyn.string("video-error"));
				this.listenOn(this.dyn, "message:click", function () {
					this.next(this.dyn.get("states").poster_error.click_play ? "LoadVideo" : "LoadPlayer");
				}, this);
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State",
	"base:Async"
], function (State, Async, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["loader"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "error:video", function () {
					this.next("ErrorVideo");
				}, this);
				this.listenOn(this.dyn, "playing", function () {
					this.next("PlayVideo");
				}, this);
				Async.eventually(function () {
					this.dyn.player.play();
				}, this);				
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
	
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this.dyn.string("video-error"));
				this.listenOn(this.dyn, "message:click", function () {
					this.next("LoadVideo");
				}, this);
			}
	
		};
	});
});




Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["controlbar"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "ended", function () {
					this.next("PosterReady");
				}, this);
				this.listenOn(this.dyn, "change:buffering", function () {
					this.dyn.set("loader_active", this.dyn.get("buffering"));
				}, this);
				this.listenOn(this.dyn, "error:video", function () {
					this.next("ErrorVideo");
				}, this);
			},
			
			play: function () {
				if (!this.dyn.get("playing"))
					this.dyn.player.play();
			}
	
		};
	});
});


}).call(Scoped);