/*!
betajs-media-components - v0.0.49 - 2017-03-24
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/
/** @flow **//*!
betajs-scoped - v0.0.13 - 2017-01-15
Copyright (c) Oliver Friedmann
Apache-2.0 Software License.
*/
var Scoped = (function () {
var Globals = (function () {  
/** 
 * This helper module provides functions for reading and writing globally accessible namespaces, both in the browser and in NodeJS.
 * 
 * @module Globals
 * @access private
 */
return { 
		
	/**
	 * Returns the value of a global variable.
	 * 
	 * @param {string} key identifier of a global variable
	 * @return value of global variable or undefined if not existing
	 */
	get : function(key/* : string */) {
		if (typeof window !== "undefined")
			return window[key];
		if (typeof global !== "undefined")
			return global[key];
		if (typeof self !== "undefined")
			return self[key];
		return undefined;
	},

	
	/**
	 * Sets a global variable.
	 * 
	 * @param {string} key identifier of a global variable
	 * @param value value to be set
	 * @return value that has been set
	 */
	set : function(key/* : string */, value) {
		if (typeof window !== "undefined")
			window[key] = value;
		if (typeof global !== "undefined")
			global[key] = value;
		if (typeof self !== "undefined")
			self[key] = value;
		return value;
	},
	
	
	/**
	 * Returns the value of a global variable under a namespaced path.
	 * 
	 * @param {string} path namespaced path identifier of variable
	 * @return value of global variable or undefined if not existing
	 * 
	 * @example
	 * // returns window.foo.bar / global.foo.bar 
	 * Globals.getPath("foo.bar")
	 */
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
	},


	/**
	 * Sets a global variable under a namespaced path.
	 * 
	 * @param {string} path namespaced path identifier of variable
	 * @param value value to be set
	 * @return value that has been set
	 * 
	 * @example
	 * // sets window.foo.bar / global.foo.bar 
	 * Globals.setPath("foo.bar", 42);
	 */
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
	}
	
};}).call(this);
/*::
declare module Helper {
	declare function extend<A, B>(a: A, b: B): A & B;
}
*/

var Helper = (function () {  
/** 
 * This helper module provides auxiliary functions for the Scoped system.
 * 
 * @module Helper
 * @access private
 */
return { 
		
	/**
	 * Attached a context to a function.
	 * 
	 * @param {object} obj context for the function
	 * @param {function} func function
	 * 
	 * @return function with attached context
	 */
	method: function (obj, func) {
		return function () {
			return func.apply(obj, arguments);
		};
	},

	
	/**
	 * Extend a base object with all attributes of a second object.
	 * 
	 * @param {object} base base object
	 * @param {object} overwrite second object
	 * 
	 * @return {object} extended base object
	 */
	extend: function (base, overwrite) {
		base = base || {};
		overwrite = overwrite || {};
		for (var key in overwrite)
			base[key] = overwrite[key];
		return base;
	},
	
	
	/**
	 * Returns the type of an object, particulary returning 'array' for arrays.
	 * 
	 * @param obj object in question
	 * 
	 * @return {string} type of object
	 */
	typeOf: function (obj) {
		return Object.prototype.toString.call(obj) === '[object Array]' ? "array" : typeof obj;
	},
	
	
	/**
	 * Returns whether an object is null, undefined, an empty array or an empty object.
	 * 
	 * @param obj object in question
	 * 
	 * @return true if object is empty
	 */
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
	
	
    /**
     * Matches function arguments against some pattern.
     * 
     * @param {array} args function arguments
     * @param {object} pattern typed pattern
     * 
     * @return {object} matched arguments as associative array 
     */	
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
	
	
	/**
	 * Stringifies a value as JSON and functions to string representations.
	 * 
	 * @param value value to be stringified
	 * 
	 * @return stringified value
	 */
	stringify: function (value) {
		if (this.typeOf(value) == "function")
			return "" + value;
		return JSON.stringify(value);
	}	

	
};}).call(this);
var Attach = (function () {  
/** 
 * This module provides functionality to attach the Scoped system to the environment.
 * 
 * @module Attach
 * @access private
 */
return { 
		
	__namespace: "Scoped",
	__revert: null,
	
	
	/**
	 * Upgrades a pre-existing Scoped system to the newest version present. 
	 * 
	 * @param {string} namespace Optional namespace (default is 'Scoped')
	 * @return {object} the attached Scoped system
	 */
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


	/**
	 * Attaches the Scoped system to the environment. 
	 * 
	 * @param {string} namespace Optional namespace (default is 'Scoped')
	 * @return {object} the attached Scoped system
	 */
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
	

	/**
	 * Detaches the Scoped system from the environment. 
	 * 
	 * @param {boolean} forceDetach Overwrite any attached scoped system by null.
	 * @return {object} the detached Scoped system
	 */
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
	

	/**
	 * Exports an object as a module if possible. 
	 * 
	 * @param {object} mod a module object (optional, default is 'module')
	 * @param {object} object the object to be exported
	 * @param {boolean} forceExport overwrite potentially pre-existing exports
	 * @return {object} the Scoped system
	 */
	exports: function (mod, object, forceExport) {
		mod = mod || (typeof module != "undefined" ? module : null);
		if (typeof mod == "object" && mod && "exports" in mod && (forceExport || mod.exports == this || !mod.exports || Helper.isEmpty(mod.exports)))
			mod.exports = object || this;
		return this;
	}	

};}).call(this);

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
			try {
				if (self)
					nsRoot.data = self;
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

	/** 
	 * The namespace module manages a namespace in the Scoped system.
	 * 
	 * @module Namespace
	 * @access public
	 */
	return {
		
		/**
		 * Extend a node in the namespace by an object.
		 * 
		 * @param {string} path path to the node in the namespace
		 * @param {object} value object that should be used for extend the namespace node
		 */
		extend: function (path, value) {
			nodeSetData(nodeNavigate(path), value);
		},
		
		/**
		 * Set the object value of a node in the namespace.
		 * 
		 * @param {string} path path to the node in the namespace
		 * @param {object} value object that should be used as value for the namespace node
		 */
		set: function (path, value) {
			var node = nodeNavigate(path);
			if (node.data)
				nodeClearData(node);
			nodeSetData(node, value);
		},
		
		/**
		 * Read the object value of a node in the namespace.
		 * 
		 * @param {string} path path to the node in the namespace
		 * @return {object} object value of the node or null if undefined
		 */
		get: function (path) {
			var node = nodeNavigate(path);
			return node.ready ? node.data : null;
		},
		
		/**
		 * Lazily navigate to a node in the namespace.
		 * Will asynchronously call the callback as soon as the node is being touched.
		 *
		 * @param {string} path path to the node in the namespace
		 * @param {function} callback callback function accepting the node's object value
		 * @param {context} context optional callback context
		 */
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
		
		/**
		 * Digest a node path, checking whether it has been defined by an external system.
		 * 
		 * @param {string} path path to the node in the namespace
		 */
		digest: function (path) {
			nodeDigest(nodeNavigate(path));
		},
		
		/**
		 * Asynchronously access a node in the namespace.
		 * Will asynchronously call the callback as soon as the node is being defined.
		 *
		 * @param {string} path path to the node in the namespace
		 * @param {function} callback callback function accepting the node's object value
		 * @param {context} context optional callback context
		 */
		obtain: function (path, callback, context) {
			nodeAddWatcher(nodeNavigate(path), callback, context);
		},
		
		/**
		 * Returns all unresolved watchers under a certain path.
		 * 
		 * @param {string} path path to the node in the namespace
		 * @return {array} list of all unresolved watchers 
		 */
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
				if (this.options.dependencies) {
					this.dependencies[ns.path] = this.dependencies[ns.path] || {};
					if (args.dependencies) {
						args.dependencies.forEach(function (dep) {
							this.dependencies[ns.path][this.resolve(dep).path] = true;
						}, this);
					}
					if (args.hiddenDependencies) {
						args.hiddenDependencies.forEach(function (dep) {
							this.dependencies[ns.path][this.resolve(dep).path] = true;
						}, this);
					}
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
	
	/** 
	 * This module provides all functionality in a scope.
	 * 
	 * @module Scoped
	 * @access public
	 */
	return {
		
		getGlobal: Helper.method(Globals, Globals.getPath),
		setGlobal: Helper.method(Globals, Globals.setPath),
		
		options: {
			lazy: false,
			ident: "Scoped",
			compile: false,
			dependencies: false
		},
		
		compiled: "",
		
		dependencies: {},
		
		
		/**
		 * Returns a reference to the next scope that will be obtained by a subScope call.
		 * 
		 * @return {object} next scope
		 */
		nextScope: function () {
			if (!nextScope)
				nextScope = newScope(this, localNamespace, rootNamespace, globalNamespace);
			return nextScope;
		},
		
		/**
		 * Creates a sub scope of the current scope and returns it.
		 * 
		 * @return {object} sub scope
		 */
		subScope: function () {
			var sub = this.nextScope();
			childScopes.push(sub);
			nextScope = null;
			return sub;
		},
		
		/**
		 * Creates a binding within in the scope. 
		 * 
		 * @param {string} alias identifier of the new binding
		 * @param {string} namespaceLocator identifier of an existing namespace path
		 * @param {object} options options for the binding
		 * 
		 */
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
		
		
		/**
		 * Resolves a name space locator to a name space.
		 * 
		 * @param {string} namespaceLocator name space locator
		 * @return {object} resolved name space
		 * 
		 */
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

		
		/**
		 * Defines a new name space once a list of name space locators is available.
		 * 
		 * @param {string} namespaceLocator the name space that is to be defined
		 * @param {array} dependencies a list of name space locator dependencies (optional)
		 * @param {array} hiddenDependencies a list of hidden name space locators (optional)
		 * @param {function} callback a callback function accepting all dependencies as arguments and returning the new definition
		 * @param {object} context a callback context (optional)
		 * 
		 */
		define: function () {
			return custom.call(this, arguments, "define", function (ns, result) {
				if (ns.namespace.get(ns.path))
					throw ("Scoped namespace " + ns.path + " has already been defined. Use extend to extend an existing namespace instead");
				ns.namespace.set(ns.path, result);
			});
		},
		
		
		/**
		 * Assume a specific version of a module and fail if it is not met.
		 * 
		 * @param {string} assumption name space locator
		 * @param {string} version assumed version
		 * 
		 */
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
				var assumptionValue = argv[0].replace(/[^\d\.]/g, "");
				argv[0] = assumptionValue.split(".");
				for (var i = 0; i < argv[0].length; ++i)
					argv[0][i] = parseInt(argv[0][i], 10);
				if (Helper.typeOf(args.callback) === "function") {
					if (!args.callback.apply(args.context || this, args))
						throw ("Scoped Assumption '" + args.assumption + "' failed, value is " + assumptionValue + (args.error ? ", but assuming " + args.error : ""));
				} else {
					var version = (args.callback + "").replace(/[^\d\.]/g, "").split(".");
					for (var j = 0; j < Math.min(argv[0].length, version.length); ++j)
						if (parseInt(version[j], 10) > argv[0][j])
							throw ("Scoped Version Assumption '" + args.assumption + "' failed, value is " + assumptionValue + ", but assuming at least " + args.callback);
				}
			});
		},
		
		
		/**
		 * Extends a potentiall existing name space once a list of name space locators is available.
		 * 
		 * @param {string} namespaceLocator the name space that is to be defined
		 * @param {array} dependencies a list of name space locator dependencies (optional)
		 * @param {array} hiddenDependencies a list of hidden name space locators (optional)
		 * @param {function} callback a callback function accepting all dependencies as arguments and returning the new additional definitions.
		 * @param {object} context a callback context (optional)
		 * 
		 */
		extend: function () {
			return custom.call(this, arguments, "extend", function (ns, result) {
				ns.namespace.extend(ns.path, result);
			});
		},
				
		
		/**
		 * Requires a list of name space locators and calls a function once they are present.
		 * 
		 * @param {array} dependencies a list of name space locator dependencies (optional)
		 * @param {array} hiddenDependencies a list of hidden name space locators (optional)
		 * @param {function} callback a callback function accepting all dependencies as arguments
		 * @param {object} context a callback context (optional)
		 * 
		 */
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

		
		/**
		 * Digest a name space locator, checking whether it has been defined by an external system.
		 * 
		 * @param {string} namespaceLocator name space locator
		 */
		digest: function (namespaceLocator) {
			var ns = this.resolve(namespaceLocator);
			ns.namespace.digest(ns.path);
			return this;
		},
		
		
		/**
		 * Returns all unresolved definitions under a namespace locator
		 * 
		 * @param {string} namespaceLocator name space locator, e.g. "global:"
		 * @return {array} list of all unresolved definitions 
		 */
		unresolved: function (namespaceLocator) {
			var ns = this.resolve(namespaceLocator);
			return ns.namespace.unresolvedWatchers(ns.path);
		},
		
		/**
		 * Exports the scope.
		 * 
		 * @return {object} exported scope
		 */
		__export: function () {
			return {
				parentNamespace: parentNamespace.__export(),
				rootNamespace: rootNamespace.__export(),
				globalNamespace: globalNamespace.__export(),
				localNamespace: localNamespace.__export(),
				privateNamespace: privateNamespace.__export()
			};
		},
		
		/**
		 * Imports a scope from an exported scope.
		 * 
		 * @param {object} data exported scope to be imported
		 * 
		 */
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

var Public = Helper.extend(rootScope, (function () {  
/** 
 * This module includes all public functions of the Scoped system.
 * 
 * It includes all methods of the root scope and the Attach module.
 * 
 * @module Public
 * @access public
 */
return {
		
	guid: "4b6878ee-cb6a-46b3-94ac-27d91f58d666",
	version: '0.0.13',
		
	upgrade: Attach.upgrade,
	attach: Attach.attach,
	detach: Attach.detach,
	exports: Attach.exports,
	
	/**
	 * Exports all data contained in the Scoped system.
	 * 
	 * @return data of the Scoped system.
	 * @access private
	 */
	__exportScoped: function () {
		return {
			globalNamespace: globalNamespace.__export(),
			rootNamespace: rootNamespace.__export(),
			rootScope: rootScope.__export()
		};
	},
	
	/**
	 * Import data into the Scoped system.
	 * 
	 * @param data of the Scoped system.
	 * @access private
	 */
	__importScoped: function (data) {
		globalNamespace.__import(data.globalNamespace);
		rootNamespace.__import(data.rootNamespace);
		rootScope.__import(data.rootScope);
	}
	
};

}).call(this));

Public = Public.upgrade();
Public.exports();
	return Public;
}).call(this);
/*!
betajs-media-components - v0.0.49 - 2017-03-24
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.MediaComponents');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('browser', 'global:BetaJS.Browser');
Scoped.binding('flash', 'global:BetaJS.Flash');
Scoped.binding('media', 'global:BetaJS.Media');
Scoped.binding('dynamics', 'global:BetaJS.Dynamics');
Scoped.define("module:", function () {
	return {
    "guid": "7a20804e-be62-4982-91c6-98eb096d2e70",
    "version": "0.0.49"
};
});
Scoped.assumeVersion('base:version', '~1.0.96');
Scoped.assumeVersion('browser:version', '~1.0.65');
Scoped.assumeVersion('flash:version', '~0.0.18');
Scoped.assumeVersion('dynamics:version', '~0.0.83');
Scoped.assumeVersion('media:version', '~0.0.45');
Scoped.extend('module:Templates', function () {
return {"video_player_controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideonactivity ? (css + '-dashboard-hidden') : ''}}\">  <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar {{activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small')}}\"       onmousedown=\"{{startUpdatePosition(domEvent)}}\"       onmouseup=\"{{stopUpdatePosition(domEvent)}}\"       onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"       onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">    <div class=\"{{css}}-progressbar-button\"></div>   </div>  </div>  <div class=\"{{css}}-backbar\"></div>  <div class=\"{{css}}-controlbar\">         <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>         <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\"  ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>   <div data-selector=\"button-icon-play\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-play\"></i>    </div>   </div>   <div data-selector=\"button-icon-pause\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>   </div>   <div class=\"{{css}}-time-container\">    <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>    <div class=\"{{css}}-time-sep\">/</div>    <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>   </div>    <div data-selector=\"video-title-block\" class=\"{{css}}-video-title-container\" ba-if=\"{{title}}\">    <p class=\"{{css}}-video-title\">     {{title}}    </p>   </div>    <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-rightbutton-container\"     ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>    </div>   </div>    <div data-selector=\"button-stream-label\" class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">    <div class=\"{{css}}-button-inner\">     <span class=\"{{css}}-button-text\">{{currentstream_label}}</span>    </div>   </div>   <div class=\"{{css}}-volumebar\">    <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"         onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.min(100, Math.round(volume * 100)) + '%'}}}\">         <div class=\"{{css}}-volumebar-button\" title=\"{{string('volume-button')}}\"></div>     </div>    </div>   </div>   <div data-selector=\"button-icon-volume\" class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>    </div>   </div>  </div> </div> ","video_player_loader":" <div class=\"{{css}}-loader-container\">     <div data-selector=\"loader-block\" class=\"{{css}}-loader-loader\" title=\"{{string('tooltip')}}\">     </div> </div> ","video_player_message":" <div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div data-selector=\"message-block\" class='{{css}}-message-message'>         {{message}}     </div> </div> ","playbutton":" <div data-selector=\"play-button\" class=\"{{css}}-playbutton-container\" ba-click=\"play()\" title=\"{{string('tooltip')}}\">  <div class=\"{{css}}-playbutton-button\"></div> </div>  <div class=\"{{css}}-rerecord-bar\" ba-if=\"{{rerecordable || submittable}}\">  <div class=\"{{css}}-rerecord-backbar\"></div>  <div class=\"{{css}}-rerecord-frontbar\">         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{submittable}}\">             <div data-selector=\"player-submit-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{submit()}}\">                 {{string('submit-video')}}             </div>         </div>         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{rerecordable}}\">          <div data-selector=\"player-rerecord-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{rerecord()}}\">           {{string('rerecord')}}          </div>         </div>  </div> </div> ","player":"<div itemscope itemtype=\"http://schema.org/VideoObject\"     class=\"{{css}}-container {{css}}-size-{{csssize}} {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}} {{css}}-{{ fullscreened ? 'fullscreen' : 'normal' }}-view {{css}}-{{ firefox ? 'firefox' : 'common'}}-browser     {{css}}-{{themecolor}}-color\"     ba-on:mousemove=\"user_activity()\"     ba-on:mousedown=\"user_activity()\"     ba-on:touchstart=\"user_activity()\"     style=\"{{width ? 'width:' + width + ((width + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}{{height ? 'height:' + height + ((height + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}\" >     <video class=\"{{css}}-video\" data-video=\"video\" ba-toggle:playsinline=\"{{!playfullscreenonmobile}}\"></video>     <div class=\"{{css}}-overlay\" data-video=\"ad\" style=\"display:none\"></div>     <div class='{{css}}-overlay'>      <ba-{{dyncontrolbar}}       ba-css=\"{{csscontrolbar || css}}\"    ba-themecolor=\"{{themecolor}}\"       ba-template=\"{{tmplcontrolbar}}\"       ba-show=\"{{controlbar_active}}\"       ba-playing=\"{{playing}}\"       ba-event:rerecord=\"rerecord\"       ba-event:submit=\"submit\"       ba-event:play=\"play\"       ba-event:pause=\"pause\"       ba-event:position=\"seek\"       ba-event:volume=\"set_volume\"       ba-event:fullscreen=\"toggle_fullscreen\"       ba-volume=\"{{volume}}\"       ba-duration=\"{{duration}}\"       ba-cached=\"{{buffered}}\"       ba-title=\"{{title}}\"       ba-position=\"{{position}}\"       ba-activitydelta=\"{{activity_delta}}\"       ba-hideoninactivity=\"{{hideoninactivity}}\"       ba-rerecordable=\"{{rerecordable}}\"       ba-submittable=\"{{submittable}}\"       ba-streams=\"{{streams}}\"       ba-currentstream=\"{{=currentstream}}\"       ba-fullscreen=\"{{fullscreensupport && !nofullscreen}}\"             ba-fullscreened=\"{{fullscreened}}\"             ba-source=\"{{source}}\"   ></ba-{{dyncontrolbar}}>      <ba-{{dynplaybutton}}       ba-css=\"{{cssplaybutton || css}}\"    ba-theme-color=\"{{themecolor}}\"       ba-template=\"{{tmplplaybutton}}\"       ba-show=\"{{playbutton_active}}\"       ba-rerecordable=\"{{rerecordable}}\"       ba-submittable=\"{{submittable}}\"       ba-event:play=\"playbutton_click\"       ba-event:rerecord=\"rerecord\"       ba-event:submit=\"submit\"   ></ba-{{dynplaybutton}}>      <ba-{{dynloader}}       ba-css=\"{{cssloader || css}}\"    ba-theme-color=\"{{themecolor}}\"       ba-template=\"{{tmplloader}}\"       ba-show=\"{{loader_active}}\"   ></ba-{{dynloader}}>    <ba-{{dynshare}}    ba-css=\"{{cssshare || css}}\"    ba-theme-color=\"{{themecolor}}\"    ba-template=\"{{tmplshare}}\"          ba-show=\"{{sharevideourl && sharevideo.length > 0}}\"    ba-url=\"{{sharevideourl}}\"    ba-shares=\"{{sharevideo}}\"   ></ba-{{dynshare}}>      <ba-{{dynmessage}}       ba-css=\"{{cssmessage || css}}\"    ba-theme-color=\"{{themecolor}}\"       ba-template=\"{{tmplmessage}}\"       ba-show=\"{{message_active}}\"       ba-message=\"{{message}}\"       ba-event:click=\"message_click\"   ></ba-{{dynmessage}}>    <ba-{{dyntopmessage}}       ba-css=\"{{csstopmessage || css}}\"    ba-theme-color=\"{{themecolor}}\"       ba-template=\"{{tmpltopmessage}}\"       ba-show=\"{{topmessage}}\"       ba-topmessage=\"{{topmessage}}\"   ></ba-{{dyntopmessage}}>      <meta itemprop=\"caption\" content=\"{{title}}\" />   <meta itemprop=\"thumbnailUrl\" content=\"{{poster}}\"/>   <meta itemprop=\"contentUrl\" content=\"{{source}}\"/>     </div> </div> ","video_player_share":"<div class=\"{{css}}-share-action-container\">     <div class=\"{{css}}-toggle-share-container\">         <div class=\"{{css}}-button-inner\" onclick=\"{{toggleShare()}}\">             <i class=\"{{css}}-icon-share\"></i>         </div>     </div>     <div class=\"{{css}}-social-buttons-container\">         <ul class=\"{{css}}-socials-list\" ba-repeat=\"{{share :: shares}}\">             <li class=\"{{css}}-single-social\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-{{share}}\" onclick=\"{{shareMedia(share)}}\"></i>                 </div>             </li>         </ul>     </div> </div> ","video_player_topmessage":" <div class=\"{{css}}-topmessage-container\">     <div class='{{css}}-topmessage-background'>     </div>     <div data-selector=\"topmessage-message-block\" class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div> ","video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">   <div>    <div data-selector=\"chooser-primary-button\" class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>     <span>      {{primary_label}}     </span>    </div>   </div>   <div>    <div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>    </div>   </div>  </div> </div> ","video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">  <div class=\"{{css}}-backbar\"></div>  <div data-selector=\"recorder-settings\" class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">   <div class=\"{{css}}-settings-backbar\"></div>   <div data-selector=\"settings-list-front\" class=\"{{css}}-settings-front\">    <ul data-selector=\"camera-settings\" ba-repeat=\"{{camera :: cameras}}\">     <li>      <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />      <span></span>      <label onclick=\"{{selectCamera(camera.id)}}\">       {{camera.label}}      </label>      </li>    </ul>    <hr ba-show=\"{{!noaudio}}\"/>    <ul data-selector=\"microphone-settings\" ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{!noaudio}}\">     <li onclick=\"{{selectMicrophone(microphone.id)}}\">      <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />      <span></span>      <label>       {{microphone.label}}      </label>      </li>    </ul>   </div>  </div>  <div data-selector=\"controlbar\" class=\"{{css}}-controlbar\">         <div class=\"{{css}}-leftbutton-container\" ba-show=\"{{settingsvisible}}\">             <div data-selector=\"record-button-icon-cog\" class=\"{{css}}-button-inner {{css}}-button-{{settingsopen ? 'selected' : 'unselected'}}\"                  onclick=\"{{settingsopen=!settingsopen}}\"                  onmouseenter=\"{{hover(string('settings'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <i class=\"{{css}}-icon-cog\"></i>             </div>         </div>         <div class=\"{{css}}-lefticon-container\" ba-show=\"{{settingsvisible}}\">             <div data-selector=\"record-button-icon-videocam\" class=\"{{css}}-icon-inner\"                  onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{camerahealthy ? 'good' : 'bad' }}\"></i>             </div>         </div>         <div class=\"{{css}}-lefticon-container\" ba-show=\"{{settingsvisible && !noaudio}}\">             <div data-selector=\"record-button-icon-mic\" class=\"{{css}}-icon-inner\"                  onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>             </div>         </div>         <div class=\"{{css}}-lefticon-container\" ba-show=\"{{stopvisible && recordingindication}}\">             <div data-selector=\"recording-indicator\" class=\"{{css}}-recording-indication\">             </div>         </div>         <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">          <div data-selector=\"record-label-block\" class=\"{{css}}-label-label\">           {{controlbarlabel}}          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">          <div data-selector=\"record-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{record()}}\"                  onmouseenter=\"{{hover(string('record-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('record')}}          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">          <div data-selector=\"covershot-primary-button\" class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                  <input type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{uploadCovershot(domEvent)}}\"            accept=\"{{covershot_accept_string}}\" />                  <span>            {{string('upload-covershot')}}           </span>          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{rerecordvisible}}\">          <div data-selector=\"rerecord-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{rerecord()}}\"                  onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('rerecord')}}          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{stopvisible}}\">          <div data-selector=\"stop-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{stop()}}\"                  onmouseenter=\"{{hover(string('stop-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('stop')}}          </div>         </div>         <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">          <div data-selector=\"skip-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('skip')}}          </div>         </div>  </div> </div> ","video_recorder_imagegallery":"<div data-selector=\"slider-left-button\" class=\"{{css}}-imagegallery-leftbutton\">  <div data-selector=\"slider-left-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">   <i class=\"{{css}}-icon-left-open\"></i>  </div> </div>  <div data-selector=\"images-imagegallery-container\" ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>      <div class=\"{{css}}-imagegallery-image\"           ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"           onclick=\"{{select(image)}}\">      </div> </div>  <div data-selector=\"slider-right-button\" class=\"{{css}}-imagegallery-rightbutton\">  <div data-selector=\"slider-right-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">   <i class=\"{{css}}-icon-right-open\"></i>  </div> </div> ","video_recorder_loader":" <div class=\"{{css}}-loader-container\">     <div data-selector=\"recorder-loader-block\" class=\"{{css}}-loader-loader\" title=\"{{tooltip}}\">     </div> </div> <div data-selector=\"recorder-loader-label-container\" class=\"{{css}}-loader-label\" ba-show=\"{{label}}\">  {{label}} </div> ","video_recorder_message":" <div data-selector=\"recorder-message-container\" class=\"{{css}}-message-container\" ba-click=\"click()\">     <div data-selector=\"recorder-message-block\" class='{{css}}-message-message'>         {{message || \"\"}}     </div> </div> ","recorder":" <div data-selector=\"recorder-container\" ba-show=\"{{!player_active}}\"      class=\"{{css}}-container {{css}}-size-{{csssize}} {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}}       {{css}}-{{ fullscreened ? 'fullscreen' : 'normal' }}-view {{css}}-{{ firefox ? 'firefox' : 'common'}}-browser      {{css}}-{{themecolor}}-color\"      style=\"{{width ? 'width:' + width + ((width + '').match(/^\\d+$/g) ? 'px' : '') + ';' : 'width:100%;'}}{{height ? 'height:' + height + ((height + '').match(/^\\d+$/g) ? 'px' : '') + ';' : 'height:100%'}}\" >      <video data-selector=\"recorder-status\" class=\"{{css}}-video {{css}}-{{hasrecorder ? 'hasrecorder' : 'norecorder'}}\" data-video=\"video\"></video>     <div data-selector=\"recorder-overlay\" class='{{css}}-overlay' ba-show=\"{{!hideoverlay}}\" data-overlay=\"overlay\">   <ba-{{dynloader}}       ba-css=\"{{cssloader || css}}\"    ba-themecolor=\"{{themecolor}}\"       ba-template=\"{{tmplloader}}\"       ba-show=\"{{loader_active}}\"       ba-tooltip=\"{{loadertooltip}}\"    ba-hovermessage=\"{{=hovermessage}}\"       ba-label=\"{{loaderlabel}}\"   ></ba-{{dynloader}}>    <ba-{{dynmessage}}       ba-css=\"{{cssmessage || css}}\"    ba-themecolor=\"{{themecolor}}\"       ba-template=\"{{tmplmessage}}\"       ba-show=\"{{message_active}}\"       ba-message=\"{{message}}\"       ba-event:click=\"message_click\"   ></ba-{{dynmessage}}>    <ba-{{dyntopmessage}}       ba-css=\"{{csstopmessage || css}}\"    ba-themecolor=\"{{themecolor}}\"       ba-template=\"{{tmpltopmessage}}\"       ba-show=\"{{topmessage_active && (topmessage || hovermessage)}}\"       ba-topmessage=\"{{hovermessage || topmessage}}\"   ></ba-{{dyntopmessage}}>    <ba-{{dynchooser}}       ba-css=\"{{csschooser || css}}\"    ba-themecolor=\"{{themecolor}}\"       ba-template=\"{{tmplchooser}}\"       ba-show=\"{{chooser_active}}\"       ba-allowrecord=\"{{allowrecord}}\"       ba-allowupload=\"{{allowupload}}\"       ba-allowcustomupload=\"{{allowcustomupload}}\"       ba-allowedextensions=\"{{allowedextensions}}\"       ba-primaryrecord=\"{{primaryrecord}}\"       ba-timelimit=\"{{timelimit}}\"       ba-event:record=\"record_video\"       ba-event:upload=\"upload_video\"   ></ba-{{dynchooser}}>    <ba-{{dynimagegallery}}       ba-css=\"{{cssimagegallery || css}}\"    ba-themecolor=\"{{themecolor}}\"       ba-template=\"{{tmplimagegallery}}\"       ba-if=\"{{imagegallery_active}}\"       ba-imagecount=\"{{gallerysnapshots}}\"       ba-imagenativewidth=\"{{recordingwidth}}\"       ba-imagenativeheight=\"{{recordingheight}}\"       ba-event:image-selected=\"select_image\"   ></ba-{{dynimagegallery}}>    <ba-{{dyncontrolbar}}       ba-css=\"{{csscontrolbar || css}}\"    ba-themecolor=\"{{themecolor}}\"       ba-template=\"{{tmplcontrolbar}}\"       ba-show=\"{{controlbar_active}}\"       ba-cameras=\"{{cameras}}\"       ba-microphones=\"{{microphones}}\"       ba-noaudio=\"{{noaudio}}\"       ba-selectedcamera=\"{{selectedcamera || 0}}\"       ba-selectedmicrophone=\"{{selectedmicrophone || 0}}\"       ba-camerahealthy=\"{{camerahealthy}}\"       ba-microphonehealthy=\"{{microphonehealthy}}\"       ba-hovermessage=\"{{=hovermessage}}\"       ba-settingsvisible=\"{{settingsvisible}}\"       ba-recordvisible=\"{{recordvisible}}\"       ba-uploadcovershotvisible=\"{{uploadcovershotvisible}}\"       ba-rerecordvisible=\"{{rerecordvisible}}\"       ba-stopvisible=\"{{stopvisible}}\"       ba-skipvisible=\"{{skipvisible}}\"       ba-controlbarlabel=\"{{controlbarlabel}}\"       ba-event:select-camera=\"select_camera\"       ba-event:select-microphone=\"select_microphone\"       ba-event:invoke-record=\"record\"       ba-event:invoke-rerecord=\"rerecord\"       ba-event:invoke-stop=\"stop\"       ba-event:invoke-skip=\"invoke_skip\"       ba-event:upload-covershot=\"upload_covershot\"   ></ba-{{dyncontrolbar}}>     </div> </div>  <div data-selector=\"recorder-player\" ba-if=\"{{player_active}}\"      style=\"{{width ? 'width:' + width + ((width + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}{{height ? 'height:' + height + ((height + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}\" >  <ba-{{dynvideoplayer}} ba-theme=\"{{theme || 'default'}}\"         ba-themecolor=\"{{themecolor}}\"         ba-source=\"{{playbacksource}}\"         ba-poster=\"{{playbackposter}}\"         ba-hideoninactivity=\"{{false}}\"         ba-forceflash=\"{{forceflash}}\"         ba-noflash=\"{{noflash}}\"         ba-stretch=\"{{stretch}}\"         ba-attrs=\"{{playerattrs}}\"         ba-data:id=\"player\"         ba-width=\"{{width}}\"         ba-height=\"{{height}}\"         ba-totalduration=\"{{duration / 1000}}\"         ba-rerecordable=\"{{rerecordable && (recordings === null || recordings > 0)}}\"         ba-submittable=\"{{manualsubmit}}\"         ba-reloadonplay=\"{{true}}\"         ba-autoplay=\"{{autoplay}}\"         ba-nofullscreen=\"{{nofullscreen}}\"         ba-topmessage=\"{{playertopmessage}}\"         ba-event:rerecord=\"rerecord\"         ba-event:playing=\"playing\"         ba-event:paused=\"paused\"         ba-event:ended=\"ended\"         ba-event:submit=\"manual_submit\"         >  </ba-{{dynvideoplayer}}> </div> ","video_recorder_topmessage":" <div class=\"{{css}}-topmessage-container\">     <div class='{{css}}-topmessage-background'>     </div>     <div data-selector=\"recorder-topmessage-block\" class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div> ","cube-video_player_controlbar":" <div data-selector=\"video-title-block\" class=\"{{css}}-video-title-block\" ba-if=\"{{title}}\">     <p class=\"{{css}}-video-title\">         {{title}}     </p> </div>  <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class=\"{{css}}-left-block\">          <div data-selector=\"submit-video-button\" class=\"{{css}}-button-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>          <div data-selector=\"button-icon-ccw\" class=\"{{css}}-button-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>          <div data-selector=\"button-icon-play\" class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-play\"></i>             </div>         </div>          <div data-selector=\"button-icon-pause\" class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>         </div>     </div>      <div class=\"{{css}}-right-block\">          <div class=\"{{css}}-button-container {{css}}-timer-container\">             <div class=\"{{css}}-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>             </div>             <p> / </p>             <div class=\"{{css}}-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>             </div>         </div>          <div data-selector=\"button-icon-volume\" class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>             </div>         </div>          <div class=\"{{css}}-volumebar\">             <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"                  onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">                 <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>             </div>         </div>          <div data-selector=\"button-stream-label\" class=\"{{css}}-button-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">             <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                 <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>             </div>         </div>          <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-button-container\"              ba-if={{fullscreen}} ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\">             <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                 <i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>             </div>         </div>      </div>      <div class=\"{{css}}-progressbar\">         <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"              onmousedown=\"{{startUpdatePosition(domEvent)}}\"              onmouseup=\"{{stopUpdatePosition(domEvent)}}\"              onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"              onmousemove=\"{{progressUpdatePosition(domEvent)}}\">              <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>             <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\"></div>         </div>     </div>  </div> ","elevate-video_player_controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class=\"{{css}}-top-block\">          <div class=\"{{css}}-top-left-block\">             <div class=\"{{css}}-time-container {{css}}-left-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>             </div>         </div>          <div class=\"{{css}}-top-right-block\">              <div class=\"{{css}}-time-container {{css}}-right-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>             </div>          </div>          <div class=\"{{css}}-progressbar\">             <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"                  onmousedown=\"{{startUpdatePosition(domEvent)}}\"                  onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                  onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                  onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                  <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                 <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                     <div class=\"{{css}}-progressbar-button-description\" style=\"display: none\">                         <div class=\"{{css}}-current-stream-screen-shot\">                             <img src=\"\"/>                         </div>                         <div class=\"{{css}}-time-container\">                             <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>                         </div>                     </div>                     <div class=\"{{css}}-progressbar-button\"></div>                 </div>             </div>         </div>      </div>      <div class=\"{{css}}-bottom-block\">          <div class=\"{{css}}-left-block\">              <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">                 <div class=\"{{css}}-button-inner\">                     {{string('submit-video')}}                 </div>             </div>              <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-ccw\"></i>                 </div>             </div>              <div data-selector=\"button-icon-play\" class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-play\"></i>                 </div>             </div>              <div data-selector=\"button-icon-pause\" class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-pause\"></i>                 </div>             </div>              <div data-selector=\"button-icon-volume\" class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>                 </div>             </div>              <div class=\"{{css}}-volumebar\">                 <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"                      onmousedown=\"{{startUpdateVolume(domEvent)}}\"                      onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                      onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                      onmousemove=\"{{progressUpdateVolume(domEvent)}}\">                     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>                 </div>             </div>          </div>          <div class=\"{{css}}-center-block\">             <div data-selector=\"video-title-block\" class=\"{{css}}-video-title-block\" ba-if=\"{{title}}\">                 <p class=\"{{css}}-video-title\">                     {{title}}                 </p>             </div>         </div>          <div class=\"{{css}}-right-block\">              <div data-selector=\"button-stream-label\" class=\"{{css}}-button-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">                 <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                     <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>                 </div>             </div>              <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-button-container\"                   ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\">                 <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                     <i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>                 </div>             </div>          </div>      </div> </div> ","minimalist-video_player_controlbar":"<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class='{{css}}-controlbar-header'>         <div class=\"{{css}}-controlbar-header-icons-block\">              <div class=\"{{css}}-right-block\">                  <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-button-container\"                      ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\">                     <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                         <i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>                     </div>                 </div>                  <div data-selector=\"button-icon-volume\" class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">                     <div class=\"{{css}}-button-inner\">                         <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>                     </div>                 </div>                  <div class=\"{{css}}-volumebar\">                     <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"                          onmousedown=\"{{startUpdateVolume(domEvent)}}\"                          onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                          onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                          onmousemove=\"{{progressUpdateVolume(domEvent)}}\">                         <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>                     </div>                 </div>              </div>          </div>           <div class=\"{{css}}-controlbar-header-title-block\" ba-if=\"{{title}}\">             <div class=\"{{css}}-title\"><h4>{{title}}</h4></div>         </div>     </div>      <div class=\"{{css}}-controlbar-footer\">          <div class=\"{{css}}-controlbar-top-block\">              <div data-selector=\"submit-video-button\" class=\"{{css}}-button-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">                 <div class=\"{{css}}-button-inner\">                     {{string('submit-video')}}                 </div>             </div>              <div data-selector=\"button-icon-play\" class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-play\"></i>                 </div>             </div>              <div data-selector=\"button-icon-pause\" class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-pause\"></i>                 </div>             </div>          </div>         <div class=\"{{css}}-controlbar-middle-block\">              <div class=\"{{css}}-progressbar\">                 <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"                      onmousedown=\"{{startUpdatePosition(domEvent)}}\"                      onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                      onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                      onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                      <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                     <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                         <div class=\"{{css}}-progressbar-button\"></div>                     </div>                 </div>             </div>          </div>         <div class=\"{{css}}-controlbar-bottom-block\">              <div data-selector=\"button-icon-ccw\" class=\"{{css}}-button-container {{css}}-player-rerecord\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-ccw\"></i>                 </div>             </div>              <div class=\"{{css}}-button-container {{css}}-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>                 <p> / </p>                 <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>             </div>              <div data-selector=\"button-stream-label\" class=\"{{css}}-button-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">                 <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                     <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>                 </div>             </div>         </div>     </div>  </div> ","modern-video_player_controlbar":"<div data-selector=\"video-title-block\" class=\"{{css}}-video-title-container\" ba-if=\"{{title}}\">  <p class=\"{{css}}-video-title\">   {{title}}  </p> </div>  <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">         <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>        <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-ccw\"></i>            </div>        </div>  <div data-selector=\"button-icon-play\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-play\"></i>   </div>  </div>  <div data-selector=\"button-icon-pause\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-pause\"></i>   </div>  </div>  <div class=\"{{css}}-time-container\">   <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}/{{formatTime(duration || position)}}</div>  </div>   <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-rightbutton-container\"   ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\" >   <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">    <i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>   </div>  </div>    <div data-selector=\"button-stream-label\" class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">   <div class=\"{{css}}-button-inner\">    <span class=\"{{css}}-button-text\">{{currentstream_label}}</span>   </div>  </div>  <div class=\"{{css}}-volumebar\">   <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"           onmousedown=\"{{startUpdateVolume(domEvent)}}\"                 onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                 onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                 onmousemove=\"{{progressUpdateVolume(domEvent)}}\">    <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>   </div>  </div>  <div data-selector=\"button-icon-volume\" class=\"{{css}}-rightbutton-container {{css}}-volume-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>   </div>  </div>  <div class=\"{{css}}-progressbar\">   <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"        onmousedown=\"{{startUpdatePosition(domEvent)}}\"        onmouseup=\"{{stopUpdatePosition(domEvent)}}\"        onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"        onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\"></div>  </div> </div> ","space-video_player_controlbar":"<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">       <div class='{{css}}-controlbar-header'>         <div class=\"{{css}}-title\" ba-if=\"{{title}}\">             <p>{{title}}</p>         </div>          <div class=\"{{css}}-volumebar\">             <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"                  onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">                 <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>             </div>         </div>          <div data-selector=\"button-icon-volume\" class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>             </div>         </div>      </div>       <div class=\"{{css}}-controlbar-footer\">          <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">            <div class=\"{{css}}-button-inner\">                {{string('submit-video')}}            </div>         </div>          <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-ccw\"></i>            </div>         </div>          <div data-selector=\"button-icon-play\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-play\"></i>            </div>         </div>          <div data-selector=\"button-icon-pause\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-pause\"></i>            </div>         </div>          <div class=\"{{css}}-time-container\">            <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>         </div>          <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-rightbutton-container\"              ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\" >             <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                 <i class=\"{{css}}-icon-{{fullscreened ? 'resize-minimize' : 'full-screen'}}\"></i>             </div>         </div>          <div data-selector=\"button-stream-label\" class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">            <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>            </div>         </div>          <div class=\"{{css}}-time-container {{css}}-rightbutton-container {{css}}-right-time-container\">            <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>         </div>          <div class=\"{{css}}-progressbar\">            <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"                 onmousedown=\"{{startUpdatePosition(domEvent)}}\"                 onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                 onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                 onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                 <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                    <div class=\"{{css}}-progressbar-button\"></div>                </div>            </div>         </div>      </div>  </div> ","space-video_player_message":"<div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div data-selector=\"message-block\" class=\"{{css}}-first-inner-message-container\">         <div class=\"{{css}}-second-inner-message-container\">             <div class=\"{{css}}-third-inner-message-container\">                 <div class=\"{{css}}-fourth-inner-message-container\">                     <div class='{{css}}-message-message'>                         {{message || \"\"}}                     </div>                 </div>             </div>         </div>     </div> </div> ","space-video_player_playbutton":" <div data-selector=\"play-button\" class=\"{{css}}-playbutton-container\" ba-click=\"play()\" title=\"{{string('tooltip')}}\">  <div class=\"{{css}}-playbutton-button\"></div> </div>  <div class=\"{{css}}-rerecord-bar\" ba-if=\"{{rerecordable || submittable}}\">  <div class=\"{{css}}-rerecord-frontbar\">         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{submittable}}\">             <div data-selector=\"player-submit-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{submit()}}\">                 {{string('submit-video')}}             </div>         </div>         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{rerecordable}}\">          <div data-selector=\"player-rerecord-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{rerecord()}}\">           {{string('rerecord')}}          </div>         </div>  </div> </div> ","theatre-video_player_controlbar":"<div data-selector=\"video-title-block\" class=\"{{css}}-video-title-container\" ba-if=\"{{title}}\">     <p class=\"{{css}}-video-title\">         {{title}}     </p> </div> <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class=\"{{css}}-left-block\">          <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>          <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>          <div data-selector=\"button-icon-play\" class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-play\"></i>             </div>         </div>          <div data-selector=\"button-icon-pause\" class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>         </div>          <div class=\"{{css}}-volume-icon-container\">              <div data-selector=\"button-icon-volume\" class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>                 </div>             </div>              <div class=\"{{css}}-volumebar\">                 <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"                      onmousedown=\"{{startVerticallyUpdateVolume(domEvent)}}\"                      onmouseup=\"{{stopVerticallyUpdateVolume(domEvent)}}\"                      onmouseleave=\"{{stopVerticallyUpdateVolume(domEvent)}}\"                      onmousemove=\"{{progressVerticallyUpdateVolume(domEvent)}}\">                     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{height: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>                 </div>             </div>         </div>          <div class=\"{{css}}-time-container\">             <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>         </div>     </div>      <div class=\"{{css}}-right-block\">          <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-button-container {{css}}-fullscreen-icon-container\"             ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\" >             <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                 <i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>             </div>         </div>          <div data-selector=\"button-stream-label\" class=\"{{css}}-button-container {{css}}-stream-label-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">             <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                 <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>             </div>         </div>          <div class=\"{{css}}-time-container {{css}}-right-time-container\">             <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>         </div>      </div>      <div class=\"{{css}}-progressbar\">         <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"              onmousedown=\"{{startUpdatePosition(domEvent)}}\"              onmouseup=\"{{stopUpdatePosition(domEvent)}}\"              onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"              onmousemove=\"{{progressUpdatePosition(domEvent)}}\">              <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>             <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                 <div class=\"{{css}}-progressbar-button\"></div>             </div>         </div>     </div>  </div> ","cube-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">    <div>    <div data-selector=\"player-submit-button\" class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>     <i class=\"{{css}}-icon-{{primaryrecord ? 'record' : 'chooser-upload'}}\"></i>    </div>   </div>   <div>    <div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>     <i class=\"{{css}}-icon-chooser-upload\"></i>    </div>   </div>  </div> </div> ","cube-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <div class=\"{{css}}-settings-front\">    <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->   <div data-selector=\"recorder-settings\" class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">    <div data-selector=\"settings-list-front\" class=\"{{css}}-bubble-info\">     <ul data-selector=\"camera-settings\" ba-repeat=\"{{camera :: cameras}}\">      <li>       <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />       <span></span>       <label onclick=\"{{selectCamera(camera.id)}}\">        {{camera.label}}       </label>      </li>     </ul>     <ul data-selector=\"microphone-settings\" ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">      <li onclick=\"{{selectMicrophone(microphone.id)}}\">       <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />       <span></span>       <label>        {{microphone.label}}       </label>      </li>     </ul>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div data-selector=\"controlbar\" class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div data-selector=\"rerecord-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>    </div>    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">              <div class=\"{{css}}-button\" ba-show=\"{{settingsvisible}}\">      <div data-selector=\"record-button-icon-cog\" class=\"{{css}}-button-inner {{css}}-button-{{settingsopen ? 'selected' : 'unselected' }}\"       onclick=\"{{settingsopen=!settingsopen}}\"       onmouseenter=\"{{hover(string('settings'))}}\"       onmouseleave=\"{{unhover()}}\" >      <i class=\"{{css}}-icon-cog\"></i>     </div>     </div>     <div class=\"{{css}}-button\" ba-show=\"{{!noaudio}}\">     <div data-selector=\"record-button-icon-mic\" class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">      <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>     <div class=\"{{css}}-button\">     <div data-selector=\"record-button-icon-videocam\" class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">                     <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>   </div>    <div class=\"{{css}}-controlbar-right-section\">     <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">     <div data-selector=\"record-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-timer-container\">     <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">      <div data-selector=\"record-label-block\" class=\"{{css}}-label {{css}}-button-primary\">       {{controlbarlabel}}      </div>     </div>    </div>     <div class=\"{{css}}-stop-button-container\">     <div data-selector=\"stop-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div data-selector=\"skip-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div data-selector=\"covershot-primary-button\" class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","cube-video_recorder_imagegallery":"<div data-selector=\"image-gallery\" class=\"{{css}}-image-gallery-container\">   <div data-selector=\"slider-left-button\" class=\"{{css}}-imagegallery-leftbutton\">   <div data-selector=\"slider-left-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"{{css}}-icon-left-open\"></i>   </div>  </div>   <div data-selector=\"images-imagegallery-container\" ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div data-selector=\"slider-right-button\" class=\"{{css}}-imagegallery-rightbutton\">   <div data-selector=\"slider-right-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"{{css}}-icon-right-open\"></i>   </div>  </div>  </div> ","cube-video_recorder_message":"<div data-selector=\"recorder-message-container\" class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div data-selector=\"recorder-message-block\" class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> ","elevate-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">    <div>    <div data-selector=\"player-submit-button\" class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>     <i class=\"{{css}}-icon-{{primaryrecord ? 'record' : 'chooser-upload'}}\"></i>    </div>   </div>   <div>    <div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>     <i class=\"{{css}}-icon-chooser-upload\"></i>    </div>   </div>  </div> </div> ","elevate-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <!-- Sidebar Settings -->  <div class=\"{{css}}-settings-left-sidebar\">    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">     <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->    <div data-selector=\"recorder-settings\" class=\"{{css}}-settings {{css}}-settings-button-container\">      <div class=\"{{css}}-circle-button\" ba-show=\"{{settingsvisible}}\">       <div class=\"{{css}}-bubble-info\" ba-show=\"{{settingsopen}}\" >       <ul data-selector=\"camera-settings\" ba-repeat=\"{{camera :: cameras}}\">        <li>         <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />         <span></span>         <label onclick=\"{{selectCamera(camera.id)}}\">          {{camera.label}}         </label>        </li>       </ul>      </div>       <div data-selector=\"record-button-icon-cog\" class=\"{{css}}-button-inner {{css}}-button-circle-{{settingsopen ? 'selected' : 'unselected' }}\"        onclick=\"{{settingsopen=!settingsopen}}\"        onmouseenter=\"{{hover(string('settings'))}}\"        onmouseleave=\"{{unhover()}}\" >       <i class=\"{{css}}-icon-cog\"></i>      </div>      </div>                   <div class=\"{{css}}-circle-button\" ba-show=\"{{!noaudio}}\">                      <div class=\"{{css}}-bubble-info\" ba-show=\"{{settingsvisible && settingsopen && audio }}\">                         <ul data-selector=\"microphone-settings\" ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">                             <li onclick=\"{{selectMicrophone(microphone.id)}}\">                                 <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />                                 <span></span>                                 <label>                                     {{microphone.label}}                                 </label>                             </li>                         </ul>                     </div>                      <div data-selector=\"record-button-icon-mic\" class=\"{{css}}-button-inner\"                          onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"                          onmouseleave=\"{{unhover()}}\">                         <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>                     </div>                 </div>                  <div class=\"{{css}}-circle-button\">                     <div data-selector=\"record-button-icon-videocam\" class=\"{{css}}-button-inner\"                          onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"                          onmouseleave=\"{{unhover()}}\">                         <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>                     </div>                 </div>     </div>   </div>   </div>   <div class=\"{{css}}-controlbar-middle-section\">    <div class=\"{{css}}-timer-container\" ba-show=\"{{stopvisible}}\">    <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">     <div data-selector=\"record-label-block\" class=\"{{css}}-label {{css}}-button-primary\">      {{controlbarlabel}}     </div>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div data-selector=\"controlbar\" class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div data-selector=\"rerecord-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>     <div class=\"{{css}}-primary-button-container\" ba-show=\"{{recordvisible}}\">     <div data-selector=\"record-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-stop-button-container\">     <div data-selector=\"stop-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div data-selector=\"skip-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div data-selector=\"covershot-primary-button\" class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","elevate-video_recorder_imagegallery":"<div data-selector=\"image-gallery\" class=\"{{css}}-image-gallery-container\">   <div data-selector=\"slider-left-button\" class=\"{{css}}-imagegallery-leftbutton\">   <div data-selector=\"slider-left-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"{{css}}-icon-left-open\"></i>   </div>  </div>   <div data-selector=\"images-imagegallery-container\" ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div data-selector=\"slider-right-button\" class=\"{{css}}-imagegallery-rightbutton\">   <div data-selector=\"slider-right-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"{{css}}-icon-right-open\"></i>   </div>  </div>  </div> ","elevate-video_recorder_message":"<div data-selector=\"recorder-message-container\" class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div data-selector=\"recorder-message-block\" class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> ","elevate-video_recorder_topmessage":"<div class=\"{{css}}-topmessage-container\">     <div data-selector=\"recorder-topmessage-block\" class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div> ","minimalist-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">   <div>    <div data-selector=\"chooser-primary-button\" class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>     <i class=\"{{css}}-icon-{{primaryrecord ? 'record' : 'chooser-upload'}}\"></i><i class=\"{{css}}-shape-{{primaryrecord ? 'record' : 'upload'}}\"></i>    </div>   </div>   <div>    <div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>     <i class=\"{{css}}-icon-chooser-upload\"></i>    </div>   </div>  </div> </div> ","minimalist-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <!-- Sidebar Settings -->  <div class=\"{{css}}-settings-left-sidebar\">    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">     <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->    <div data-selector=\"recorder-settings\" class=\"{{css}}-settings {{css}}-settings-button-container\">      <div data-selector=\"settings-list-front\" class=\"{{css}}-circle-button\" ba-show=\"{{settingsvisible}}\">       <div class=\"{{css}}-bubble-info\" ba-show=\"{{settingsopen}}\" >       <ul data-selector=\"camera-settings\" ba-repeat=\"{{camera :: cameras}}\">        <li>         <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />         <span></span>         <label onclick=\"{{selectCamera(camera.id)}}\">          {{camera.label}}         </label>        </li>       </ul>      </div>       <div data-selector=\"record-button-icon-cog\" class=\"{{css}}-button-inner {{css}}-button-circle-{{settingsopen ? 'selected' : 'unselected' }}\"        onclick=\"{{settingsopen=!settingsopen}}\"        onmouseenter=\"{{hover(string('settings'))}}\"        onmouseleave=\"{{unhover()}}\" >       <i class=\"{{css}}-icon-cog\"></i>      </div>     </div>                   <div class=\"{{css}}-circle-button\" ba-show=\"{{!noaudio}}\">                      <div class=\"{{css}}-bubble-info\" ba-show=\"{{settingsvisible && settingsopen && audio }}\">                         <ul data-selector=\"microphone-settings\" ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">                             <li onclick=\"{{selectMicrophone(microphone.id)}}\">                                 <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />                                 <span></span>                                 <label>                                     {{microphone.label}}                                 </label>                             </li>                         </ul>                     </div>                      <div data-selector=\"record-button-icon-mic\" class=\"{{css}}-button-inner\"                          onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"                          onmouseleave=\"{{unhover()}}\">                         <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>                     </div>                 </div>                  <div class=\"{{css}}-circle-button\">                     <div data-selector=\"record-button-icon-videocam\" class=\"{{css}}-button-inner\"                          onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"                          onmouseleave=\"{{unhover()}}\">                         <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>                     </div>                 </div>     </div>   </div>   </div>   <div class=\"{{css}}-controlbar-middle-section\">    <div class=\"{{css}}-timer-container\" ba-show=\"{{stopvisible}}\">    <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">     <div data-selector=\"record-label-block\" class=\"{{css}}-label {{css}}-button-primary\">      {{controlbarlabel}}     </div>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div data-selector=\"controlbar\" class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div data-selector=\"rerecord-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>     <div class=\"{{css}}-primary-button-container\" ba-show=\"{{recordvisible}}\">     <div data-selector=\"record-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-stop-button-container\">     <div data-selector=\"stop-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div data-selector=\"skip-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div data-selector=\"covershot-primary-button\" class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","minimalist-video_recorder_imagegallery":"<div data-selector=\"image-gallery\" class=\"{{css}}-image-gallery-container\">   <div data-selector=\"slider-left-button\" class=\"{{css}}-imagegallery-leftbutton\">   <div data-selector=\"slider-left-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"{{css}}-icon-left-open\"></i>   </div>  </div>   <div data-selector=\"images-imagegallery-container\" ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div data-selector=\"slider-right-button\" class=\"{{css}}-imagegallery-rightbutton\">   <div data-selector=\"slider-right-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"{{css}}-icon-right-open\"></i>   </div>  </div>  </div> ","minimalist-video_recorder_message":"<div data-selector=\"recorder-message-container\" class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div data-selector=\"recorder-message-block\" class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> ","minimalist-video_recorder_topmessage":"<div data-selector=\"recorder-topmessage-block\" class=\"{{css}}-topmessage-container\">     <div class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div>","modern-video_recorder_chooser":"<div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">    <div class=\"{{css}}-chooser-icon-container\">    <i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>   </div>   <div>    <div data-selector=\"chooser-primary-button\" class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>    </div>   </div>   <div>    <div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>    </div>   </div>  </div> </div> ","space-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">   <div>    <div data-selector=\"chooser-primary-button\" class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>     <i class=\"{{css}}-icon-{{primaryrecord ? 'record' : 'chooser-upload'}}\"></i><i class=\"{{css}}-shape-{{primaryrecord ? 'record' : 'upload'}}\"></i>    </div>   </div>   <div>    <div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>     <i class=\"{{css}}-icon-chooser-upload\"></i>    </div>   </div>  </div> </div> ","space-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <div class=\"{{css}}-settings-front\">    <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->   <div data-selector=\"recorder-settings\" class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">    <div class=\"{{css}}-bubble-info\">     <ul data-selector=\"camera-settings\" ba-repeat=\"{{camera :: cameras}}\">      <li>       <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />       <span></span>       <label onclick=\"{{selectCamera(camera.id)}}\">        {{camera.label}}       </label>      </li>     </ul>     <ul data-selector=\"record-button-icon-cog\" ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">      <li onclick=\"{{selectMicrophone(microphone.id)}}\">       <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />       <span></span>       <label>        {{microphone.label}}       </label>      </li>     </ul>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div data-selector=\"controlbar\" class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div data-selector=\"rerecord-primary-button\" class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>    </div>    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">              <div class=\"{{css}}-circle-button\" ba-show=\"{{settingsvisible}}\">      <div data-selector=\"record-button-icon-cog\" class=\"{{css}}-button-inner {{css}}-button-circle-{{settingsopen ? 'selected' : 'unselected' }}\"       onclick=\"{{settingsopen=!settingsopen}}\"       onmouseenter=\"{{hover(string('settings'))}}\"       onmouseleave=\"{{unhover()}}\" >      <i class=\"{{css}}-icon-cog\"></i>     </div>     </div>     <div class=\"{{css}}-circle-button\" ba-show=\"{{!noaudio}}\">     <div data-selector=\"record-button-icon-mic\" class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">      <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>     <div class=\"{{css}}-circle-button\">     <div data-selector=\"record-button-icon-videocam\" class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">                     <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>   </div>    <div class=\"{{css}}-controlbar-right-section\">     <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">     <div data-selector=\"record-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-timer-container\">     <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">      <div data-selector=\"record-label-block\" class=\"{{css}}-label {{css}}-button-primary\">       {{controlbarlabel}}      </div>     </div>    </div>     <div class=\"{{css}}-stop-button-container\">     <div data-selector=\"stop-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div data-selector=\"skip-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </divi>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div data-selector=\"covershot-primary-button\" class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","space-video_recorder_imagegallery":"<div data-selector=\"image-gallery\" class=\"{{css}}-image-gallery-container\">   <div data-selector=\"slider-left-button\" class=\"{{css}}-imagegallery-leftbutton\">   <div data-selector=\"slider-left-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"{{css}}-icon-left-open\"></i>   </div>  </div>   <div data-selector=\"images-imagegallery-container\" ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div data-selector=\"slider-right-button\" class=\"{{css}}-imagegallery-rightbutton\">   <div data-selector=\"slider-right-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"{{css}}-icon-right-open\"></i>   </div>  </div>  </div> ","space-video_recorder_message":"<div data-selector=\"recorder-message-container\" class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div data-selector=\"recorder-message-block\" class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> ","space-video_recorder_topmessage":"<div class=\"{{css}}-topmessage-container\">     <div data-selector=\"recorder-topmessage-block\" class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div> ","theatre-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">   <div>    <div data-selector=\"chooser-primary-button\" class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>     <i class=\"{{css}}-icon-{{primaryrecord ? 'record' : 'chooser-upload'}}\"></i>    </div>   </div>   <div>    <div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>     <i class=\"{{css}}-icon-chooser-upload\"></i>    </div>   </div>  </div> </div> ","theatre-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <div class=\"{{css}}-settings-front\">    <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->   <div data-selector=\"recorder-settings\" class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">    <div class=\"{{css}}-bubble-info\">     <ul data-selector=\"camera-settings\" ba-repeat=\"{{camera :: cameras}}\">      <li>       <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />       <span></span>       <label onclick=\"{{selectCamera(camera.id)}}\">        {{camera.label}}       </label>      </li>     </ul>     <ul data-selector=\"microphone-settings\" ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">      <li onclick=\"{{selectMicrophone(microphone.id)}}\">       <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />       <span></span>       <label>        {{microphone.label}}       </label>      </li>     </ul>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div data-selector=\"controlbar\" class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div data-selector=\"rerecord-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>    </div>    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">              <div class=\"{{css}}-button\" ba-show=\"{{settingsvisible}}\">      <div data-selector=\"record-button-icon-cog\" class=\"{{css}}-button-inner {{css}}-button-{{settingsopen ? 'selected' : 'unselected' }}\"       onclick=\"{{settingsopen=!settingsopen}}\"       onmouseenter=\"{{hover(string('settings'))}}\"       onmouseleave=\"{{unhover()}}\" >      <i class=\"{{css}}-icon-cog\"></i>     </div>     </div>     <div class=\"{{css}}-button\" ba-show=\"{{!noaudio}}\">     <div data-selector=\"record-button-icon-mic\" class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">      <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>     <div class=\"{{css}}-button\">     <div data-selector=\"record-button-icon-videocam\" class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">                     <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>   </div>    <div class=\"{{css}}-controlbar-right-section\">     <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">     <div data-selector=\"record-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-timer-container\">     <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">      <div data-selector=\"record-label-block\" class=\"{{css}}-label {{css}}-button-primary\">       {{controlbarlabel}}      </div>     </div>    </div>     <div class=\"{{css}}-stop-button-container\">     <div data-selector=\"stop-primary-button\" class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div data-selector=\"skip-primary-button\" class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div data-selector=\"covershot-primary-button\" class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","theatre-video_recorder_imagegallery":"<div data-selector=\"image-gallery\" class=\"{{css}}-image-gallery-container\">   <div data-selector=\"slider-left-button\" class=\"{{css}}-imagegallery-leftbutton\">   <div data-selector=\"slider-left-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"{{css}}-icon-left-open\"></i>   </div>  </div>   <div data-selector=\"images-imagegallery-container\" ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div data-selector=\"slider-right-button\" class=\"{{css}}-imagegallery-rightbutton\">   <div data-selector=\"slider-right-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"{{css}}-icon-right-open\"></i>   </div>  </div>  </div> ","theatre-video_recorder_message":"<div data-selector=\"recorder-message-container\" class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div data-selector=\"recorder-message-block\" class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> "};
});
Scoped.extend("module:Assets", ["module:Assets"], function (Assets) {
    var languages = {"language:bg":{"ba-videoplayer-playbutton.tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x438;&#x433;&#x440;&#x430;&#x44F;&#x442; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;.","ba-videoplayer-playbutton.rerecord":"&#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C;","ba-videoplayer-playbutton.submit-video":"&#x41F;&#x43E;&#x442;&#x432;&#x44A;&#x440;&#x436;&#x434;&#x430;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-loader.tooltip":"&#x417;&#x430;&#x440;&#x435;&#x436;&#x434;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E; ...","ba-videoplayer-controlbar.change-resolution":"&#x41F;&#x440;&#x43E;&#x43C;&#x44F;&#x43D;&#x430; &#x43D;&#x430; &#x440;&#x430;&#x437;&#x434;&#x435;&#x43B;&#x438;&#x442;&#x435;&#x43B;&#x43D;&#x430;&#x442;&#x430; &#x441;&#x43F;&#x43E;&#x441;&#x43E;&#x431;&#x43D;&#x43E;&#x441;&#x442;","ba-videoplayer-controlbar.video-progress":"&#x43F;&#x440;&#x43E;&#x433;&#x440;&#x435;&#x441; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.rerecord-video":"&#x412;&#x44A;&#x437;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x44F;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videoplayer-controlbar.submit-video":"&#x41F;&#x43E;&#x442;&#x432;&#x44A;&#x440;&#x436;&#x434;&#x430;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.play-video":"&#x432;&#x44A;&#x437;&#x43F;&#x440;&#x43E;&#x438;&#x437;&#x432;&#x435;&#x436;&#x434;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.pause-video":"Pause &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.elapsed-time":"Elasped &#x432;&#x440;&#x435;&#x43C;&#x435;","ba-videoplayer-controlbar.total-time":"&#x41E;&#x431;&#x449;&#x430; &#x434;&#x44A;&#x43B;&#x436;&#x438;&#x43D;&#x430; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.fullscreen-video":"&#x412;&#x44A;&#x432;&#x435;&#x434;&#x435;&#x442;&#x435; &#x446;&#x44F;&#x43B; &#x435;&#x43A;&#x440;&#x430;&#x43D;","ba-videoplayer-controlbar.volume-button":"Set &#x43E;&#x431;&#x435;&#x43C;","ba-videoplayer-controlbar.volume-mute":"Mute &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer-controlbar.volume-unmute":"&#x438;&#x437;&#x43A;&#x43B;&#x44E;&#x447;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer.video-error":"&#x412;&#x44A;&#x437;&#x43D;&#x438;&#x43A;&#x43D;&#x430; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x430;. &#x41C;&#x43E;&#x43B;&#x44F;, &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x439;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E; &#x43F;&#x43E;-&#x43A;&#x44A;&#x441;&#x43D;&#x43E;. &#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder-chooser.record-video":"&#x417;&#x430;&#x43F;&#x438;&#x448;&#x435;&#x442;&#x435; &#x432;&#x430;&#x448;&#x438;&#x442;&#x435; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-chooser.upload-video":"&#x41A;&#x430;&#x447;&#x438; &#x412;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-controlbar.settings":"&#x41D;&#x430;&#x441;&#x442;&#x440;&#x43E;&#x439;&#x43A;&#x438;","ba-videorecorder-controlbar.camerahealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x43B;&#x435;&#x43D;&#x438;&#x435;&#x442;&#x43E; &#x435; &#x434;&#x43E;&#x431;&#x440;&#x43E;","ba-videorecorder-controlbar.cameraunhealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x43B;&#x435;&#x43D;&#x438;&#x435; &#x43D;&#x435; &#x435; &#x43E;&#x43F;&#x442;&#x438;&#x43C;&#x430;&#x43B;&#x43D;&#x43E;","ba-videorecorder-controlbar.microphonehealthy":"&#x417;&#x432;&#x443;&#x43A;&#x44A;&#x442; &#x435; &#x434;&#x43E;&#x431;&#x44A;&#x440;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x41D;&#x435; &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x432;&#x437;&#x435;&#x43C;&#x435;&#x442;&#x435; &#x432;&#x441;&#x435;&#x43A;&#x438; &#x437;&#x432;&#x443;&#x43A;","ba-videorecorder-controlbar.record":"&#x440;&#x435;&#x43A;&#x43E;&#x440;&#x434;","ba-videorecorder-controlbar.record-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x437;&#x430;&#x43F;&#x438;&#x448;&#x435;&#x442;&#x435;.","ba-videorecorder-controlbar.rerecord":"&#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C;.","ba-videorecorder-controlbar.upload-covershot":"&#x41A;&#x430;&#x447;&#x438;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43A;&#x430;&#x447;&#x438;&#x442;&#x435; &#x43F;&#x43E;&#x442;&#x440;&#x435;&#x431;&#x438;&#x442;&#x435;&#x43B;&#x441;&#x43A;&#x438; &#x43F;&#x43E;&#x43A;&#x440;&#x438;&#x442;&#x438;&#x435; &#x443;&#x434;&#x430;&#x440;","ba-videorecorder-controlbar.stop":"&#x421;&#x43F;&#x440;&#x438; &#x441;&#x435;","ba-videorecorder-controlbar.stop-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x441;&#x43F;&#x440;&#x435;.","ba-videorecorder-controlbar.skip":"&#x43F;&#x43E;&#x434;&#x441;&#x43A;&#x430;&#x447;&#x430;&#x43C;","ba-videorecorder-controlbar.skip-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x43D;&#x435;&#x442;&#x435;.","ba-videorecorder.recorder-error":"&#x412;&#x44A;&#x437;&#x43D;&#x438;&#x43A;&#x43D;&#x430; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x430;. &#x41C;&#x43E;&#x43B;&#x44F;, &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x439;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E; &#x43F;&#x43E;-&#x43A;&#x44A;&#x441;&#x43D;&#x43E;. &#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.attach-error":"&#x41D;&#x438;&#x435; &#x43D;&#x435; &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43B;&#x443;&#x447;&#x438;&#x442;&#x435; &#x434;&#x43E;&#x441;&#x442;&#x44A;&#x43F; &#x434;&#x43E; &#x438;&#x43D;&#x442;&#x435;&#x440;&#x444;&#x435;&#x439;&#x441;&#x430; &#x43D;&#x430; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x430;&#x442;&#x430;. &#x412; &#x437;&#x430;&#x432;&#x438;&#x441;&#x438;&#x43C;&#x43E;&#x441;&#x442; &#x43E;&#x442; &#x443;&#x441;&#x442;&#x440;&#x43E;&#x439;&#x441;&#x442;&#x432;&#x43E;&#x442;&#x43E; &#x438; &#x431;&#x440;&#x430;&#x443;&#x437;&#x44A;&#x440;&#x430;, &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x441;&#x435; &#x43D;&#x430;&#x43B;&#x43E;&#x436;&#x438; &#x434;&#x430; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x442;&#x435; Flash &#x438;&#x43B;&#x438; &#x434;&#x43E;&#x441;&#x442;&#x44A;&#x43F; &#x434;&#x43E; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x430;&#x442;&#x430; &#x447;&#x440;&#x435;&#x437; SSL.","ba-videorecorder.access-forbidden":"&#x414;&#x43E;&#x441;&#x442;&#x44A;&#x43F; &#x434;&#x43E; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x430;&#x442;&#x430; &#x435; &#x437;&#x430;&#x431;&#x440;&#x430;&#x43D;&#x435;&#x43D;&#x43E;. &#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.pick-covershot":"&#x418;&#x437;&#x431;&#x435;&#x440;&#x435;&#x442;&#x435; covershot.","ba-videorecorder.uploading":"&#x41A;&#x430;&#x447;&#x432;&#x430;&#x43D;&#x435;","ba-videorecorder.uploading-failed":"&#x41A;&#x430;&#x447;&#x432;&#x430; &#x441;&#x435; &#x43F;&#x440;&#x43E;&#x432;&#x430;&#x43B;&#x438; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.verifying":"&#x41F;&#x440;&#x43E;&#x432;&#x435;&#x440;&#x43A;&#x430;","ba-videorecorder.verifying-failed":"&#x423;&#x434;&#x43E;&#x441;&#x442;&#x43E;&#x432;&#x435;&#x440;&#x44F;&#x432;&#x430;&#x43D;&#x435;&#x442;&#x43E; &#x441;&#x435; &#x43F;&#x440;&#x43E;&#x432;&#x430;&#x43B;&#x438; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.rerecord-confirm":"&#x41D;&#x430;&#x438;&#x441;&#x442;&#x438;&#x43D;&#x430; &#x43B;&#x438; &#x438;&#x441;&#x43A;&#x430;&#x442;&#x435; &#x434;&#x430; &#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x441;&#x438;?","ba-videorecorder.video_file_too_large":"&#x412;&#x430;&#x448;&#x438;&#x44F;&#x442; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x444;&#x430;&#x439;&#x43B; &#x435; &#x442;&#x432;&#x44A;&#x440;&#x434;&#x435; &#x433;&#x43E;&#x43B;&#x44F;&#x43C; (%s) - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E; &#x441; &#x43F;&#x43E;-&#x43C;&#x430;&#x43B;&#x44A;&#x43A; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x444;&#x430;&#x439;&#x43B;.","ba-videorecorder.unsupported_video_type":"&#x41C;&#x43E;&#x43B;&#x44F;, &#x43A;&#x430;&#x447;&#x435;&#x442;&#x435;: %s - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;."},"language:cat":{"ba-videoplayer-playbutton.tooltip":"Feu clic per veure el v&#xED;deo.","ba-videoplayer-playbutton.rerecord":"refer","ba-videoplayer-playbutton.submit-video":"confirmar v&#xED;deo","ba-videoplayer-loader.tooltip":"Carregant v&#xED;deo ...","ba-videoplayer-controlbar.change-resolution":"Canviar la resoluci&#xF3;","ba-videoplayer-controlbar.video-progress":"el progr&#xE9;s de v&#xED;deo","ba-videoplayer-controlbar.rerecord-video":"Torneu a fer el v&#xED;deo?","ba-videoplayer-controlbar.submit-video":"confirmar v&#xED;deo","ba-videoplayer-controlbar.play-video":"reproducci&#xF3; de v&#xED;deo","ba-videoplayer-controlbar.pause-video":"pausa de v&#xED;deo","ba-videoplayer-controlbar.elapsed-time":"temps Elasped","ba-videoplayer-controlbar.total-time":"Durada total de v&#xED;deo","ba-videoplayer-controlbar.fullscreen-video":"Introdu&#xEF;u a pantalla completa","ba-videoplayer-controlbar.volume-button":"volum de s&#xE8;ries","ba-videoplayer-controlbar.volume-mute":"silenciar so","ba-videoplayer-controlbar.volume-unmute":"activar so","ba-videoplayer.video-error":"Hi ha hagut un error. Siusplau, torni a intentar-ho m&#xE9;s tard. Feu clic per tornar a intentar-ho.","ba-videorecorder-chooser.record-video":"Gravar el v&#xED;deo","ba-videorecorder-chooser.upload-video":"Pujar v&#xED;deo","ba-videorecorder-controlbar.settings":"ajustos","ba-videorecorder-controlbar.camerahealthy":"La il&#xB7;luminaci&#xF3; &#xE9;s bona","ba-videorecorder-controlbar.cameraunhealthy":"La il&#xB7;luminaci&#xF3; no &#xE9;s &#xF2;ptima","ba-videorecorder-controlbar.microphonehealthy":"El so &#xE9;s bo","ba-videorecorder-controlbar.microphoneunhealthy":"No es pot recollir qualsevol so","ba-videorecorder-controlbar.record":"registre","ba-videorecorder-controlbar.record-tooltip":"Feu clic aqu&#xED; per gravar.","ba-videorecorder-controlbar.rerecord":"refer","ba-videorecorder-controlbar.rerecord-tooltip":"Cliqueu aqu&#xED; per fer de nou.","ba-videorecorder-controlbar.upload-covershot":"Pujar","ba-videorecorder-controlbar.upload-covershot-tooltip":"Feu clic aqu&#xED; per pujar foto de portada personalitzada","ba-videorecorder-controlbar.stop":"aturar","ba-videorecorder-controlbar.stop-tooltip":"Feu clic aqu&#xED; per aturar.","ba-videorecorder-controlbar.skip":"Omet","ba-videorecorder-controlbar.skip-tooltip":"Feu clic aqu&#xED; per saltar.","ba-videorecorder.recorder-error":"Hi ha hagut un error. Siusplau, torni a intentar-ho m&#xE9;s tard. Feu clic per tornar a intentar-ho.","ba-videorecorder.attach-error":"No hem pogut accedir a la interf&#xED;cie de la c&#xE0;mera. En funci&#xF3; del dispositiu i del navegador, &#xE9;s possible que hagi de instal &#xB7; lar Flash o accedir a la p&#xE0;gina a trav&#xE9;s de SSL.","ba-videorecorder.access-forbidden":"Estava prohibit l&#x27;acc&#xE9;s a la c&#xE0;mera. Feu clic per tornar a intentar-ho.","ba-videorecorder.pick-covershot":"Tria una covershot.","ba-videorecorder.uploading":"pujant","ba-videorecorder.uploading-failed":"C&#xE0;rrega fallat - fer clic aqu&#xED; per tornar a intentar-ho.","ba-videorecorder.verifying":"verificant","ba-videorecorder.verifying-failed":"fallat la verificaci&#xF3; de - fer clic aqu&#xED; per tornar a intentar-ho.","ba-videorecorder.rerecord-confirm":"De veritat vol tornar a fer el v&#xED;deo?","ba-videorecorder.video_file_too_large":"L&#x27;arxiu de v&#xED;deo &#xE9;s massa gran (%s) - fer clic aqu&#xED; per tornar a intentar-ho amb un arxiu de v&#xED;deo m&#xE9;s petita.","ba-videorecorder.unsupported_video_type":"Si us plau, puja: %s - fer clic aqu&#xED; per tornar a intentar-ho."},"language:da":{"ba-videoplayer-playbutton.tooltip":"Klik for at afspille video.","ba-videoplayer-playbutton.rerecord":"redo","ba-videoplayer-playbutton.submit-video":"Bekr&#xE6;ft video","ba-videoplayer-loader.tooltip":"Indl&#xE6;ser video ...","ba-videoplayer-controlbar.change-resolution":"Skift opl&#xF8;sning","ba-videoplayer-controlbar.video-progress":"fremskridt Video","ba-videoplayer-controlbar.rerecord-video":"Redo video?","ba-videoplayer-controlbar.submit-video":"Bekr&#xE6;ft video","ba-videoplayer-controlbar.play-video":"Afspil video","ba-videoplayer-controlbar.pause-video":"Pause video","ba-videoplayer-controlbar.elapsed-time":"Elasped tid","ba-videoplayer-controlbar.total-time":"Samlet l&#xE6;ngde af video","ba-videoplayer-controlbar.fullscreen-video":"Indtast fullscreen","ba-videoplayer-controlbar.volume-button":"Indstil lydstyrke","ba-videoplayer-controlbar.volume-mute":"Sl&#xE5; lyden","ba-videoplayer-controlbar.volume-unmute":"Sl&#xE5; lyden til","ba-videoplayer.video-error":"Der opstod en fejl. Pr&#xF8;v venligst igen senere. Klik for at pr&#xF8;ve igen.","ba-videorecorder-chooser.record-video":"Optag din video","ba-videorecorder-chooser.upload-video":"Upload video","ba-videorecorder-controlbar.settings":"Indstillinger","ba-videorecorder-controlbar.camerahealthy":"Belysning er god","ba-videorecorder-controlbar.cameraunhealthy":"Belysning er ikke optimal","ba-videorecorder-controlbar.microphonehealthy":"Lyden er god","ba-videorecorder-controlbar.microphoneunhealthy":"Kan ikke afhente nogen lyd","ba-videorecorder-controlbar.record":"Optage","ba-videorecorder-controlbar.record-tooltip":"Klik her for at optage.","ba-videorecorder-controlbar.rerecord":"redo","ba-videorecorder-controlbar.rerecord-tooltip":"Klik her for at gentage.","ba-videorecorder-controlbar.upload-covershot":"Upload","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klik her for at uploade brugerdefinerede d&#xE6;kning shot","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Klik her for at stoppe.","ba-videorecorder-controlbar.skip":"Springe","ba-videorecorder-controlbar.skip-tooltip":"Klik her for at springe.","ba-videorecorder.recorder-error":"Der opstod en fejl. Pr&#xF8;v venligst igen senere. Klik for at pr&#xF8;ve igen.","ba-videorecorder.attach-error":"Vi kunne ikke f&#xE5; adgang til kameraet interface. Afh&#xE6;ngigt af enheden og browseren, skal du muligvis installere Flash eller adgang til siden via SSL.","ba-videorecorder.access-forbidden":"Adgang til kameraet var forbudt. Klik for at pr&#xF8;ve igen.","ba-videorecorder.pick-covershot":"V&#xE6;lg en covershot.","ba-videorecorder.uploading":"Upload","ba-videorecorder.uploading-failed":"Upload mislykkedes - klik her for at pr&#xF8;ve igen.","ba-videorecorder.verifying":"Bekr&#xE6;ftelse","ba-videorecorder.verifying-failed":"mislykkedes verificering - klik her for at pr&#xF8;ve igen.","ba-videorecorder.rerecord-confirm":"Vil du virkelig &#xF8;nsker at gentage din video?","ba-videorecorder.video_file_too_large":"Din video filen er for stor (%s) - klik her for at pr&#xF8;ve igen med et mindre videofil.","ba-videorecorder.unsupported_video_type":"upload venligst: %s - klik her for at pr&#xF8;ve igen."},"language:de":{"ba-videoplayer-playbutton.tooltip":"Hier clicken um Wiedergabe zu starten.","ba-videoplayer-playbutton.rerecord":"Video neu aufnehmen","ba-videoplayer-playbutton.submit-video":"Video akzeptieren","ba-videoplayer-loader.tooltip":"Video wird geladen...","ba-videoplayer-controlbar.change-resolution":"Aufl&#xF6;sung anpassen","ba-videoplayer-controlbar.video-progress":"Videofortschritt","ba-videoplayer-controlbar.rerecord-video":"Video erneut aufnehmen?","ba-videoplayer-controlbar.submit-video":"Video akzeptieren","ba-videoplayer-controlbar.play-video":"Video wiedergeben","ba-videoplayer-controlbar.pause-video":"Video pausieren","ba-videoplayer-controlbar.elapsed-time":"Vergangene Zeit","ba-videoplayer-controlbar.total-time":"L&#xE4;nge des Videos","ba-videoplayer-controlbar.fullscreen-video":"Vollbildmodus","ba-videoplayer-controlbar.volume-button":"Lautst&#xE4;rke regulieren","ba-videoplayer-controlbar.volume-mute":"Ton abstellen","ba-videoplayer-controlbar.volume-unmute":"Ton wieder einstellen","ba-videoplayer.video-error":"Es ist ein Fehler aufgetreten, bitte versuchen Sie es sp&#xE4;ter noch einmal. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder-chooser.record-video":"Video aufnehmen","ba-videorecorder-chooser.upload-video":"Video hochladen","ba-videorecorder-controlbar.settings":"Einstellungen","ba-videorecorder-controlbar.camerahealthy":"Gute Beleuchtung","ba-videorecorder-controlbar.cameraunhealthy":"Beleuchtung nicht optimal","ba-videorecorder-controlbar.microphonehealthy":"Soundqualit&#xE4;t einwandfrei","ba-videorecorder-controlbar.microphoneunhealthy":"Mikrofon bis jetzt stumm","ba-videorecorder-controlbar.record":"Video aufnehmen","ba-videorecorder-controlbar.record-tooltip":"Hier clicken um Aufnahme zu starten.","ba-videorecorder-controlbar.rerecord":"Video neu aufnehmen","ba-videorecorder-controlbar.rerecord-tooltip":"Hier clicken um Video erneut aufzunehmen.","ba-videorecorder-controlbar.upload-covershot":"Hochladen","ba-videorecorder-controlbar.upload-covershot-tooltip":"Hier clicken um einen Covershot hochzuladen.","ba-videorecorder-controlbar.stop":"Aufnahme stoppen","ba-videorecorder-controlbar.stop-tooltip":"Hier clicken um Aufnahme zu stoppen.","ba-videorecorder-controlbar.skip":"&#xDC;berspringen","ba-videorecorder-controlbar.skip-tooltip":"Hier clicken um zu &#xDC;berspringen.","ba-videorecorder.recorder-error":"Es ist ein Fehler aufgetreten, bitte versuchen Sie es sp&#xE4;ter noch einmal. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder.attach-error":"Wir konnten nicht auf die Kamera zugreifen. Je nach Browser und Ger&#xE4;t muss m&#xF6;glicherweise Flash installiert oder die Seite &#xFC;ber SSL geladen werden.","ba-videorecorder.access-forbidden":"Kamerazugriff wurde verweigert. Hier klick, um es noch einmal zu probieren.","ba-videorecorder.pick-covershot":"Bitte w&#xE4;hlen Sie einen Covershot aus.","ba-videorecorder.uploading":"Hochladen","ba-videorecorder.uploading-failed":"Hochladen fehlgeschlagen. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder.verifying":"Verifizieren","ba-videorecorder.verifying-failed":"Verifizierung fehlgeschlagen. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder.rerecord-confirm":"M&#xF6;chten Sie Ihr Video wirklich noch einmal aufnehmen?","ba-videorecorder.video_file_too_large":"Die angegebene Videodatei ist zu gro&#xDF; (%s). Hier klicken, um eine kleinere Videodatei hochzuladen.","ba-videorecorder.unsupported_video_type":"Bitte laden Sie Dateien des folgenden Typs hoch: %s. Hier klicken, um es noch einmal zu probieren."},"language:es":{"ba-videoplayer-playbutton.tooltip":"Haga clic para ver el video.","ba-videoplayer-playbutton.rerecord":"Regrabar","ba-videoplayer-playbutton.submit-video":"Confirmar v&#xED;deo","ba-videoplayer-loader.tooltip":"Cargando v&#xED;deo ...","ba-videoplayer-controlbar.change-resolution":"Cambiar la resoluci&#xF3;n","ba-videoplayer-controlbar.video-progress":"El progreso de v&#xED;deo","ba-videoplayer-controlbar.rerecord-video":"Regrab el v&#xED;deo?","ba-videoplayer-controlbar.submit-video":"Confirmar v&#xED;deo","ba-videoplayer-controlbar.play-video":"Reproduzca el video","ba-videoplayer-controlbar.pause-video":"Pausa de v&#xED;deo","ba-videoplayer-controlbar.elapsed-time":"Tiempo transcurrido","ba-videoplayer-controlbar.total-time":"Duraci&#xF3;n total de video","ba-videoplayer-controlbar.fullscreen-video":"Ingrese a pantalla completa","ba-videoplayer-controlbar.volume-button":"Boton de volumen","ba-videoplayer-controlbar.volume-mute":"Silenciar sonido","ba-videoplayer-controlbar.volume-unmute":"Activar sonido","ba-videoplayer.video-error":"Se produjo un error, por favor intente de nuevo m&#xE1;s tarde. Haga clic para volver a intentarlo.","ba-videorecorder-chooser.record-video":"Grabar el v&#xED;deo","ba-videorecorder-chooser.upload-video":"Subir v&#xED;deo","ba-videorecorder-controlbar.settings":"ajustes","ba-videorecorder-controlbar.camerahealthy":"La iluminaci&#xF3;n es buena","ba-videorecorder-controlbar.cameraunhealthy":"La iluminaci&#xF3;n no es &#xF3;ptima","ba-videorecorder-controlbar.microphonehealthy":"El sonido es bueno","ba-videorecorder-controlbar.microphoneunhealthy":"Problemas con sonido","ba-videorecorder-controlbar.record":"Grabar","ba-videorecorder-controlbar.record-tooltip":"Haga clic aqu&#xED; para grabar.","ba-videorecorder-controlbar.rerecord":"Rehacer","ba-videorecorder-controlbar.rerecord-tooltip":"Haga clic aqu&#xED; para grabar de nuevo.","ba-videorecorder-controlbar.upload-covershot":"Subir","ba-videorecorder-controlbar.upload-covershot-tooltip":"Haga clic aqu&#xED; para subir foto de portada personalizada","ba-videorecorder-controlbar.stop":"Detener","ba-videorecorder-controlbar.stop-tooltip":"Haga clic aqu&#xED; para detener.","ba-videorecorder-controlbar.skip":"Saltear","ba-videorecorder-controlbar.skip-tooltip":"Haga clic aqu&#xED; para saltear.","ba-videorecorder.recorder-error":"Se produjo un error, por favor intente de nuevo m&#xE1;s tarde. Haga clic para volver a intentarlo.","ba-videorecorder.attach-error":"No hemos podido acceder a la interfaz de la c&#xE1;mara. Dependiendo del dispositivo y del navegador, es posible que tenga que instalar Flash o acceder a la p&#xE1;gina a trav&#xE9;s de SSL.","ba-videorecorder.access-forbidden":"Acceso denegado a la c&#xE1;mara. Haga clic para volver a intentarlo.","ba-videorecorder.pick-covershot":"Elige una foto de cubierta.","ba-videorecorder.uploading":"Subiendo","ba-videorecorder.uploading-failed":"Carga fallada - hacer clic aqu&#xED; para volver a intentarlo.","ba-videorecorder.verifying":"verificando","ba-videorecorder.verifying-failed":"fal la verificaci&#xF3;n - hacer clic aqu&#xED; para volver a intentarlo.","ba-videorecorder.rerecord-confirm":"&#xBF;De verdad quiere volver a hacer el v&#xED;deo?","ba-videorecorder.video_file_too_large":"El archivo de v&#xED;deo es demasiado grande (%s) - hacer clic aqu&#xED; para volver a intentarlo con un archivo de v&#xED;deo m&#xE1;s peque&#xF1;o.","ba-videorecorder.unsupported_video_type":"Por favor, sube: %s - hacer clic aqu&#xED; para volver a intentarlo."},"language:fi":{"ba-videoplayer-playbutton.tooltip":"Toista video.","ba-videoplayer-playbutton.rerecord":"tehd&#xE4; uudelleen","ba-videoplayer-playbutton.submit-video":"vahvista video","ba-videoplayer-loader.tooltip":"Ladataan videota ...","ba-videoplayer-controlbar.change-resolution":"Muuta resoluutio","ba-videoplayer-controlbar.video-progress":"video edistyminen","ba-videoplayer-controlbar.rerecord-video":"Tee uudelleen video?","ba-videoplayer-controlbar.submit-video":"vahvista video","ba-videoplayer-controlbar.play-video":"Toista video","ba-videoplayer-controlbar.pause-video":"tauko video","ba-videoplayer-controlbar.elapsed-time":"Elasped aika","ba-videoplayer-controlbar.total-time":"Kokonaispituus video","ba-videoplayer-controlbar.fullscreen-video":"Anna koko n&#xE4;yt&#xF6;n","ba-videoplayer-controlbar.volume-button":"Set tilavuus","ba-videoplayer-controlbar.volume-mute":"&#xE4;&#xE4;nen mykistys","ba-videoplayer-controlbar.volume-unmute":"Poista mykistys","ba-videoplayer.video-error":"Tapahtui virhe, yrit&#xE4; my&#xF6;hemmin uudelleen. Yrit&#xE4; uudelleen klikkaamalla.","ba-videorecorder-chooser.record-video":"Tallenna videon","ba-videorecorder-chooser.upload-video":"Lataa video","ba-videorecorder-controlbar.settings":"Asetukset","ba-videorecorder-controlbar.camerahealthy":"Valaistus on hyv&#xE4;","ba-videorecorder-controlbar.cameraunhealthy":"Valaistus ei ole optimaalinen","ba-videorecorder-controlbar.microphonehealthy":"&#xC4;&#xE4;ni on hyv&#xE4;","ba-videorecorder-controlbar.microphoneunhealthy":"Voi poimia mit&#xE4;&#xE4;n &#xE4;&#xE4;nt&#xE4;","ba-videorecorder-controlbar.record":"Enn&#xE4;tys","ba-videorecorder-controlbar.record-tooltip":"T&#xE4;&#xE4;lt&#xE4; tallentaa.","ba-videorecorder-controlbar.rerecord":"tehd&#xE4; uudelleen","ba-videorecorder-controlbar.rerecord-tooltip":"T&#xE4;&#xE4;lt&#xE4; redo.","ba-videorecorder-controlbar.upload-covershot":"Lataa","ba-videorecorder-controlbar.upload-covershot-tooltip":"T&#xE4;&#xE4;lt&#xE4; ladata mukautettuja kansi ammuttu","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"T&#xE4;&#xE4;lt&#xE4; lopettaa.","ba-videorecorder-controlbar.skip":"hyppi&#xE4;","ba-videorecorder-controlbar.skip-tooltip":"T&#xE4;&#xE4;lt&#xE4; ohittaa.","ba-videorecorder.recorder-error":"Tapahtui virhe, yrit&#xE4; my&#xF6;hemmin uudelleen. Yrit&#xE4; uudelleen klikkaamalla.","ba-videorecorder.attach-error":"Emme voineet k&#xE4;ytt&#xE4;&#xE4; Kameraliit&#xE4;nn&#xE4;t. Laitteesta riippuen ja selainta, sinun on ehk&#xE4; asennettava Flash tai k&#xE4;ytt&#xE4;&#xE4; sivun kautta SSL.","ba-videorecorder.access-forbidden":"P&#xE4;&#xE4;sy kameraan oli kielletty. Yrit&#xE4; uudelleen klikkaamalla.","ba-videorecorder.pick-covershot":"Valitse covershot.","ba-videorecorder.uploading":"lataaminen","ba-videorecorder.uploading-failed":"Lataaminen ep&#xE4;onnistui - klikkaa t&#xE4;st&#xE4; yrit&#xE4; uudelleen.","ba-videorecorder.verifying":"Tarkistetaan","ba-videorecorder.verifying-failed":"Varmentaa ep&#xE4;onnistui - klikkaa t&#xE4;st&#xE4; yrit&#xE4; uudelleen.","ba-videorecorder.rerecord-confirm":"Haluatko todella redo videon?","ba-videorecorder.video_file_too_large":"Videotiedosto on liian suuri (%s) - klikkaa t&#xE4;st&#xE4; yritt&#xE4;&#xE4; uudelleen pienemm&#xE4;ll&#xE4; videotiedosto.","ba-videorecorder.unsupported_video_type":"Lataa: %s - klikkaa t&#xE4;st&#xE4; yrit&#xE4; uudelleen."},"language:fr":{"ba-videoplayer-playbutton.tooltip":"Cliquez ici pour voir la vid&#xE9;o.","ba-videoplayer-playbutton.rerecord":"Revoir","ba-videoplayer-playbutton.submit-video":"Confirmer vid&#xE9;o","ba-videoplayer-loader.tooltip":"T&#xE9;l&#xE9;chargez votre vid&#xE9;o...","ba-videoplayer-controlbar.change-resolution":"Modifiez la r&#xE9;solution d&#x2019;&#xE9;cran","ba-videoplayer-controlbar.video-progress":"Vid&#xE9;o en cours de chargement","ba-videoplayer-controlbar.rerecord-video":"Revoir la vid&#xE9;o?","ba-videoplayer-controlbar.submit-video":"Validez la vid&#xE9;o","ba-videoplayer-controlbar.play-video":"Lire la vid&#xE9;o","ba-videoplayer-controlbar.pause-video":"Pause vid&#xE9;o","ba-videoplayer-controlbar.elapsed-time":"Temps &#xE9;coul&#xE9; ou expir&#xE9;","ba-videoplayer-controlbar.total-time":"Dur&#xE9;e total de la vid&#xE9;o","ba-videoplayer-controlbar.fullscreen-video":"S&#xE9;lectionnez le mode plein &#xE9;cran","ba-videoplayer-controlbar.volume-button":"R&#xE9;glez ou ajustez le volume","ba-videoplayer-controlbar.volume-mute":"Silencieux","ba-videoplayer-controlbar.volume-unmute":"Silencieux d&#xE9;sactiv&#xE9;","ba-videoplayer.video-error":"Une s&#x2019;est produite, r&#xE9;essayez ult&#xE9;rieurement &#x2013; cliquez ici pour r&#xE9;essayer.","ba-videorecorder-chooser.record-video":"Enregistrez votre vid&#xE9;o","ba-videorecorder-chooser.upload-video":"T&#xE9;l&#xE9;chargez votre vid&#xE9;o","ba-videorecorder-controlbar.settings":"R&#xE9;glage ou mise &#xE0; jour","ba-videorecorder-controlbar.camerahealthy":"Bon &#xE9;clairage","ba-videorecorder-controlbar.cameraunhealthy":"L&#x2019;&#xE9;clairage n&#x2019;est pas ideal","ba-videorecorder-controlbar.microphonehealthy":"Bonne acoustique","ba-videorecorder-controlbar.microphoneunhealthy":"Acoustique n&#x27;est pas ideal","ba-videorecorder-controlbar.record":"Enregistrer","ba-videorecorder-controlbar.record-tooltip":"Cliquez ici pour enregistrez.","ba-videorecorder-controlbar.rerecord":"Revoir","ba-videorecorder-controlbar.rerecord-tooltip":"Cliquez ici pour recommencer.","ba-videorecorder-controlbar.upload-covershot":"T&#xE9;l&#xE9;chargez","ba-videorecorder-controlbar.upload-covershot-tooltip":"Cliquez ici pour t&#xE9;l&#xE9;charger une couverture personnalis&#xE9;e.","ba-videorecorder-controlbar.stop":"Arr&#xEA;ter","ba-videorecorder-controlbar.stop-tooltip":"Cliquez ici pour arr&#xEA;ter.","ba-videorecorder-controlbar.skip":"Sauter","ba-videorecorder-controlbar.skip-tooltip":"Cliquez ici pour sauter.","ba-videorecorder.recorder-error":"Une s&#x2019;est produite, r&#xE9;essayez ult&#xE9;rieurement &#x2013; cliquez ici pour r&#xE9;essayer.","ba-videorecorder.attach-error":"Nous ne pouvons pas acc&#xE9;der &#xE0; l&#x2019;interface de l&#x2019;appareil- cela d&#xE9;pend du syst&#xE8;me et de l&#x2019;explorateur. Cela peut n&#xE9;cessiter d&#x2019;installer flash ou une acc&#xE9;dez &#xE0; la page via SSL.","ba-videorecorder.access-forbidden":"L&#x2019;acc&#xE8;s &#xE0; l&#x2019;appareil est interdit. Cliquez pour recommencer.","ba-videorecorder.pick-covershot":"Choisissez une page de couverture.","ba-videorecorder.uploading":"T&#xE9;l&#xE9;chargez","ba-videorecorder.uploading-failed":"T&#xE9;l&#xE9;chargement &#xE9;chou&#xE9;- Cliquez ici pour recommencer ou r&#xE9;essayer.","ba-videorecorder.verifying":"V&#xE9;rification","ba-videorecorder.verifying-failed":"V&#xE9;rification &#xE9;chou&#xE9;e - Cliquez ici pour recommencer ou r&#xE9;essayer.","ba-videorecorder.rerecord-confirm":"Souhaitez vous r&#xE9;ellement recommencer la vid&#xE9;o?","ba-videorecorder.video_file_too_large":"La taille de votre fichier est trop grande (%s). Cliquez ici pour ajuster la taille.","ba-videorecorder.unsupported_video_type":"S&#x27;il vous pla&#xEE;t t&#xE9;l&#xE9;charger: %s - cliquez ici pour r&#xE9;essayer."},"language:hr":{"ba-videoplayer-playbutton.tooltip":"Kliknite za reprodukciju video zapisa.","ba-videoplayer-playbutton.rerecord":"preurediti","ba-videoplayer-playbutton.submit-video":"Potvrda videa","ba-videoplayer-loader.tooltip":"U&#x10D;itavanje videa ...","ba-videoplayer-controlbar.change-resolution":"Promjena razlu&#x10D;ivosti","ba-videoplayer-controlbar.video-progress":"napredak Video","ba-videoplayer-controlbar.rerecord-video":"Ponovi video?","ba-videoplayer-controlbar.submit-video":"Potvrda videa","ba-videoplayer-controlbar.play-video":"Reprodukcija videozapisa","ba-videoplayer-controlbar.pause-video":"Pauza Video","ba-videoplayer-controlbar.elapsed-time":"Elasped vrijeme","ba-videoplayer-controlbar.total-time":"Ukupna du&#x17E;ina videa","ba-videoplayer-controlbar.fullscreen-video":"Idi na puni zaslon","ba-videoplayer-controlbar.volume-button":"Set volumen","ba-videoplayer-controlbar.volume-mute":"Bez zvuka","ba-videoplayer-controlbar.volume-unmute":"Vrati zvuk","ba-videoplayer.video-error":"Do&#x161;lo je do pogre&#x161;ke. Molimo poku&#x161;ajte ponovno kasnije. Kliknite za ponovni poku&#x161;aj.","ba-videorecorder-chooser.record-video":"Snimanje videa","ba-videorecorder-chooser.upload-video":"Dodaj video","ba-videorecorder-controlbar.settings":"Postavke","ba-videorecorder-controlbar.camerahealthy":"Rasvjeta je dobra","ba-videorecorder-controlbar.cameraunhealthy":"Rasvjeta nije optimalno","ba-videorecorder-controlbar.microphonehealthy":"Zvuk je dobar","ba-videorecorder-controlbar.microphoneunhealthy":"ne mo&#x17E;e podi&#x107;i bilo koji zvuk","ba-videorecorder-controlbar.record":"Snimiti","ba-videorecorder-controlbar.record-tooltip":"Kliknite ovdje za snimanje.","ba-videorecorder-controlbar.rerecord":"preurediti","ba-videorecorder-controlbar.rerecord-tooltip":"Kliknite ovdje ponoviti.","ba-videorecorder-controlbar.upload-covershot":"Postavi","ba-videorecorder-controlbar.upload-covershot-tooltip":"Kliknite ovdje kako biste poslali prilago&#x111;ene cover metak","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Kliknite ovdje da se zaustavi.","ba-videorecorder-controlbar.skip":"Presko&#x10D;iti","ba-videorecorder-controlbar.skip-tooltip":"Kliknite ovdje presko&#x10D;iti.","ba-videorecorder.recorder-error":"Do&#x161;lo je do pogre&#x161;ke. Molimo poku&#x161;ajte ponovno kasnije. Kliknite za ponovni poku&#x161;aj.","ba-videorecorder.attach-error":"Nismo mogli pristupiti su&#x10D;elju fotoaparata. Ovisno o ure&#x111;aju i preglednika, mo&#x17E;da &#x107;ete morati instalirati Flash ili pristupiti stranici putem SSL-a.","ba-videorecorder.access-forbidden":"Pristup kameri je zabranjeno. Kliknite za ponovni poku&#x161;aj.","ba-videorecorder.pick-covershot":"Izaberite covershot.","ba-videorecorder.uploading":"Prijenos","ba-videorecorder.uploading-failed":"Prijenos nije uspio - kliknite ovdje za ponovni poku&#x161;aj.","ba-videorecorder.verifying":"Potvr&#x111;ivanje","ba-videorecorder.verifying-failed":"Potvr&#x111;ivanje nije uspjelo - kliknite ovdje za ponovni poku&#x161;aj.","ba-videorecorder.rerecord-confirm":"Da li zaista &#x17E;elite ponoviti svoj video?","ba-videorecorder.video_file_too_large":"Va&#x161; video datoteka je prevelika (%s) - kliknite ovdje kako bi poku&#x161;ali ponovno s manjim video datoteka.","ba-videorecorder.unsupported_video_type":"Prenesite: %s - kliknite ovdje za ponovni poku&#x161;aj."},"language:hu":{"ba-videoplayer-playbutton.tooltip":"Kattintson ide a vide&#xF3; lej&#xE1;tsz&#xE1;s&#xE1;hoz.","ba-videoplayer-playbutton.rerecord":"&#xDA;jra","ba-videoplayer-playbutton.submit-video":"Er&#x151;s&#xED;tse vide&#xF3;","ba-videoplayer-loader.tooltip":"Vide&#xF3; bet&#xF6;lt&#xE9;se ...","ba-videoplayer-controlbar.change-resolution":"a felbont&#xE1;s m&#xF3;dos&#xED;t&#xE1;sa","ba-videoplayer-controlbar.video-progress":"vide&#xF3; halad&#xE1;s","ba-videoplayer-controlbar.rerecord-video":"&#xDA;jra vide&#xF3;t?","ba-videoplayer-controlbar.submit-video":"Er&#x151;s&#xED;tse vide&#xF3;","ba-videoplayer-controlbar.play-video":"vide&#xF3; lej&#xE1;tsz&#xE1;sa","ba-videoplayer-controlbar.pause-video":"sz&#xFC;net vide&#xF3;","ba-videoplayer-controlbar.elapsed-time":"Eltelt id&#x151;","ba-videoplayer-controlbar.total-time":"Teljes hossza vide&#xF3;","ba-videoplayer-controlbar.fullscreen-video":"a teljes k&#xE9;perny&#x151;s","ba-videoplayer-controlbar.volume-button":"&#xC1;ll&#xED;tsa be a hanger&#x151;t","ba-videoplayer-controlbar.volume-mute":"hang eln&#xE9;m&#xED;t&#xE1;sa","ba-videoplayer-controlbar.volume-unmute":"Unmute hang","ba-videoplayer.video-error":"Hiba t&#xF6;rt&#xE9;nt. K&#xE9;rj&#xFC;k, pr&#xF3;b&#xE1;lkozzon k&#xE9;s&#x151;bb. Kattintson ide &#xFA;jra.","ba-videorecorder-chooser.record-video":"A vide&#xF3; r&#xF6;gz&#xED;t&#xE9;s&#xE9;nek","ba-videorecorder-chooser.upload-video":"Vide&#xF3; felt&#xF6;lt&#xE9;se","ba-videorecorder-controlbar.settings":"Be&#xE1;ll&#xED;t&#xE1;sok","ba-videorecorder-controlbar.camerahealthy":"Vil&#xE1;g&#xED;t&#xE1;s j&#xF3;","ba-videorecorder-controlbar.cameraunhealthy":"Vil&#xE1;g&#xED;t&#xE1;s nem optim&#xE1;lis","ba-videorecorder-controlbar.microphonehealthy":"Hang j&#xF3;","ba-videorecorder-controlbar.microphoneunhealthy":"Nem lehet felvenni minden hang","ba-videorecorder-controlbar.record":"Rekord","ba-videorecorder-controlbar.record-tooltip":"Kattintson ide, hogy r&#xF6;gz&#xED;ti.","ba-videorecorder-controlbar.rerecord":"&#xDA;jra","ba-videorecorder-controlbar.rerecord-tooltip":"Kattintson ide, hogy &#xFA;jra.","ba-videorecorder-controlbar.upload-covershot":"Felt&#xF6;lt&#xE9;s","ba-videorecorder-controlbar.upload-covershot-tooltip":"Kattintson ide felt&#xF6;lthet&#x151; egyedi fed&#xE9;l l&#xF6;v&#xE9;s","ba-videorecorder-controlbar.stop":"&#xC1;llj meg","ba-videorecorder-controlbar.stop-tooltip":"Kattintson ide, hogy hagyja abba.","ba-videorecorder-controlbar.skip":"Skip","ba-videorecorder-controlbar.skip-tooltip":"Kattintson ide, hogy kihagyja.","ba-videorecorder.recorder-error":"Hiba t&#xF6;rt&#xE9;nt. K&#xE9;rj&#xFC;k, pr&#xF3;b&#xE1;lkozzon k&#xE9;s&#x151;bb. Kattintson ide &#xFA;jra.","ba-videorecorder.attach-error":"Nem tudtuk el&#xE9;rni a kamera interface. Att&#xF3;l f&#xFC;gg&#x151;en, hogy a k&#xE9;sz&#xFC;l&#xE9;k &#xE9;s a b&#xF6;ng&#xE9;sz&#x151;ben, akkor telep&#xED;tenie kell a Flash vagy el&#xE9;rni az oldalt SSL.","ba-videorecorder.access-forbidden":"Hozz&#xE1;f&#xE9;r&#xE9;s a kamera tilos volt. Kattintson ide &#xFA;jra.","ba-videorecorder.pick-covershot":"V&#xE1;lassz egy covershot.","ba-videorecorder.uploading":"Felt&#xF6;lt&#xE9;s","ba-videorecorder.uploading-failed":"Felt&#xF6;lt&#xE9;s sikertelen - ide kattintva &#xFA;jra.","ba-videorecorder.verifying":"ellen&#x151;rz&#xE9;se","ba-videorecorder.verifying-failed":"Ellen&#x151;rz&#xE9;s&#xE9;&#xE9;rt sikertelen - ide kattintva &#xFA;jra.","ba-videorecorder.rerecord-confirm":"T&#xE9;nyleg azt akarja ism&#xE9;telni a vide&#xF3;?","ba-videorecorder.video_file_too_large":"A vide&#xF3; f&#xE1;jl t&#xFA;l nagy (%s) - ide kattintva pr&#xF3;b&#xE1;lkozzon &#xFA;jra egy kisebb video f&#xE1;jlt.","ba-videorecorder.unsupported_video_type":"K&#xE9;rj&#xFC;k, t&#xF6;lts&#xF6;n fel: %s - ide kattintva &#xFA;jra."},"language:it":{"ba-videoplayer-playbutton.tooltip":"Clicca per giocare video.","ba-videoplayer-playbutton.rerecord":"Rifare","ba-videoplayer-playbutton.submit-video":"confermare il video","ba-videoplayer-loader.tooltip":"Caricamento video...","ba-videoplayer-controlbar.change-resolution":"Cambiare la risoluzione","ba-videoplayer-controlbar.video-progress":"progresso Video","ba-videoplayer-controlbar.rerecord-video":"Ripeti video?","ba-videoplayer-controlbar.submit-video":"confermare il video","ba-videoplayer-controlbar.play-video":"Guarda il video","ba-videoplayer-controlbar.pause-video":"il video Pause","ba-videoplayer-controlbar.elapsed-time":"tempo Elasped","ba-videoplayer-controlbar.total-time":"La lunghezza totale di Video","ba-videoplayer-controlbar.fullscreen-video":"Vai a tutto schermo","ba-videoplayer-controlbar.volume-button":"Impostare il volume","ba-videoplayer-controlbar.volume-mute":"suono muto","ba-videoplayer-controlbar.volume-unmute":"disattivare l&#x27;audio","ba-videoplayer.video-error":"&#xC8; verificato un errore, riprova pi&#xF9; tardi. Fare clic per riprovare.","ba-videorecorder-chooser.record-video":"Registra il tuo video","ba-videorecorder-chooser.upload-video":"Carica video","ba-videorecorder-controlbar.settings":"impostazioni","ba-videorecorder-controlbar.camerahealthy":"L&#x27;illuminazione &#xE8; buona","ba-videorecorder-controlbar.cameraunhealthy":"L&#x27;illuminazione non &#xE8; ottimale","ba-videorecorder-controlbar.microphonehealthy":"Il suono &#xE8; buono","ba-videorecorder-controlbar.microphoneunhealthy":"Non &#xE8; possibile udire i suoni","ba-videorecorder-controlbar.record":"Disco","ba-videorecorder-controlbar.record-tooltip":"Clicca qui per registrare.","ba-videorecorder-controlbar.rerecord":"Rifare","ba-videorecorder-controlbar.rerecord-tooltip":"Clicca qui per rifare.","ba-videorecorder-controlbar.upload-covershot":"Caricare","ba-videorecorder-controlbar.upload-covershot-tooltip":"Clicca qui per caricare copertina personalizzata colpo","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Clicca qui per fermare.","ba-videorecorder-controlbar.skip":"Salta","ba-videorecorder-controlbar.skip-tooltip":"Clicca qui per saltare.","ba-videorecorder.recorder-error":"&#xC8; verificato un errore, riprova pi&#xF9; tardi. Fare clic per riprovare.","ba-videorecorder.attach-error":"Non abbiamo potuto accedere alla interfaccia della fotocamera. A seconda del dispositivo e del browser, potrebbe essere necessario installare Flash o accedere alla pagina tramite SSL.","ba-videorecorder.access-forbidden":"L&#x27;accesso alla telecamera era proibito. Fare clic per riprovare.","ba-videorecorder.pick-covershot":"Scegli una covershot.","ba-videorecorder.uploading":"Caricamento","ba-videorecorder.uploading-failed":"Caricamento fallito - clicca qui per riprovare.","ba-videorecorder.verifying":"verifica","ba-videorecorder.verifying-failed":"Verifica non riuscita - clicca qui per riprovare.","ba-videorecorder.rerecord-confirm":"Vuoi davvero di rifare il video?","ba-videorecorder.video_file_too_large":"Il file video &#xE8; troppo grande (%s) - clicca qui per provare di nuovo con un file video pi&#xF9; piccolo.","ba-videorecorder.unsupported_video_type":"Si prega di caricare: %s - clicca qui per riprovare."},"language:nl":{"ba-videoplayer-playbutton.tooltip":"Klik om video af te spelen.","ba-videoplayer-playbutton.rerecord":"opnieuw","ba-videoplayer-playbutton.submit-video":"Bevestig video","ba-videoplayer-loader.tooltip":"Loading video ...","ba-videoplayer-controlbar.change-resolution":"resolutie Change","ba-videoplayer-controlbar.video-progress":"video vooruitgang","ba-videoplayer-controlbar.rerecord-video":"Opnieuw video?","ba-videoplayer-controlbar.submit-video":"Bevestig video","ba-videoplayer-controlbar.play-video":"Video afspelen","ba-videoplayer-controlbar.pause-video":"pauze video","ba-videoplayer-controlbar.elapsed-time":"Verstreken tijd","ba-videoplayer-controlbar.total-time":"De totale lengte van de video","ba-videoplayer-controlbar.fullscreen-video":"Voer fullscreen","ba-videoplayer-controlbar.volume-button":"Volume instellen","ba-videoplayer-controlbar.volume-mute":"geluid uitschakelen","ba-videoplayer-controlbar.volume-unmute":"geluid vrijgeven","ba-videoplayer.video-error":"Er is een fout opgetreden, probeer het later opnieuw. Klik hier om opnieuw te proberen.","ba-videorecorder-chooser.record-video":"Neem uw video","ba-videorecorder-chooser.upload-video":"Upload Video","ba-videorecorder-controlbar.settings":"instellingen","ba-videorecorder-controlbar.camerahealthy":"Verlichting is goed","ba-videorecorder-controlbar.cameraunhealthy":"Verlichting is niet optimaal","ba-videorecorder-controlbar.microphonehealthy":"Het geluid is goed","ba-videorecorder-controlbar.microphoneunhealthy":"Kan niet pikken elk geluid","ba-videorecorder-controlbar.record":"Record","ba-videorecorder-controlbar.record-tooltip":"Klik hier om te registreren.","ba-videorecorder-controlbar.rerecord":"opnieuw","ba-videorecorder-controlbar.rerecord-tooltip":"Klik hier om opnieuw te doen.","ba-videorecorder-controlbar.upload-covershot":"Uploaden","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klik hier om te uploaden aangepaste hoes schot","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Klik hier om te stoppen.","ba-videorecorder-controlbar.skip":"Overspringen","ba-videorecorder-controlbar.skip-tooltip":"Klik hier om over te slaan.","ba-videorecorder.recorder-error":"Er is een fout opgetreden, probeer het later opnieuw. Klik hier om opnieuw te proberen.","ba-videorecorder.attach-error":"We konden geen toegang tot de camera-interface. Afhankelijk van het apparaat en de browser, moet u misschien Flash installeren of toegang tot de pagina via SSL.","ba-videorecorder.access-forbidden":"De toegang tot de camera was verboden. Klik hier om opnieuw te proberen.","ba-videorecorder.pick-covershot":"Kies een covershot.","ba-videorecorder.uploading":"uploaden","ba-videorecorder.uploading-failed":"Uploaden mislukt - klik hier om opnieuw te proberen.","ba-videorecorder.verifying":"Het verifi&#xEB;ren","ba-videorecorder.verifying-failed":"Verifying mislukt - klik hier om opnieuw te proberen.","ba-videorecorder.rerecord-confirm":"Wil je echt wilt uw video opnieuw te doen?","ba-videorecorder.video_file_too_large":"Uw video bestand is te groot (%s) - klik hier om opnieuw te proberen met een kleinere videobestand.","ba-videorecorder.unsupported_video_type":"Upload: %s - klik hier om opnieuw te proberen."},"language:no":{"ba-videoplayer-playbutton.tooltip":"Klikk for &#xE5; spille video.","ba-videoplayer-playbutton.rerecord":"Gj&#xF8;re om","ba-videoplayer-playbutton.submit-video":"bekreft video","ba-videoplayer-loader.tooltip":"Laster video ...","ba-videoplayer-controlbar.change-resolution":"Endre oppl&#xF8;sning","ba-videoplayer-controlbar.video-progress":"video fremgang","ba-videoplayer-controlbar.rerecord-video":"Gj&#xF8;r om videoen?","ba-videoplayer-controlbar.submit-video":"bekreft video","ba-videoplayer-controlbar.play-video":"spill video","ba-videoplayer-controlbar.pause-video":"pause video","ba-videoplayer-controlbar.elapsed-time":"Elasped tid","ba-videoplayer-controlbar.total-time":"Total lengde p&#xE5; video","ba-videoplayer-controlbar.fullscreen-video":"Skriv fullskjerm","ba-videoplayer-controlbar.volume-button":"Still inn volum","ba-videoplayer-controlbar.volume-mute":"lyd","ba-videoplayer-controlbar.volume-unmute":"lyd","ba-videoplayer.video-error":"En feil oppstod. Vennligst pr&#xF8;v igjen senere. Klikk for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder-chooser.record-video":"Spill av video","ba-videorecorder-chooser.upload-video":"Last opp video","ba-videorecorder-controlbar.settings":"innstillinger","ba-videorecorder-controlbar.camerahealthy":"Belysning er god","ba-videorecorder-controlbar.cameraunhealthy":"Belysning er ikke optimal","ba-videorecorder-controlbar.microphonehealthy":"Lyden er god","ba-videorecorder-controlbar.microphoneunhealthy":"Kan ikke plukke opp noen lyd","ba-videorecorder-controlbar.record":"Ta opp","ba-videorecorder-controlbar.record-tooltip":"Klikk her for &#xE5; spille inn.","ba-videorecorder-controlbar.rerecord":"Gj&#xF8;re om","ba-videorecorder-controlbar.rerecord-tooltip":"Klikk her for &#xE5; gj&#xF8;re om.","ba-videorecorder-controlbar.upload-covershot":"Laste opp","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klikk her for &#xE5; laste opp egendefinerte dekke skudd","ba-videorecorder-controlbar.stop":"Stoppe","ba-videorecorder-controlbar.stop-tooltip":"Klikk her for &#xE5; stoppe.","ba-videorecorder-controlbar.skip":"Hopp","ba-videorecorder-controlbar.skip-tooltip":"Klikk her for &#xE5; hoppe.","ba-videorecorder.recorder-error":"En feil oppstod. Vennligst pr&#xF8;v igjen senere. Klikk for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.attach-error":"Vi kunne ikke f&#xE5; tilgang til kameraet grensesnitt. Avhengig av enheten og nettleser, kan det hende du m&#xE5; installere Flash eller tilgang til siden via SSL.","ba-videorecorder.access-forbidden":"Tilgang til kameraet ble forbudt. Klikk for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.pick-covershot":"Plukk en covershot.","ba-videorecorder.uploading":"Laster opp","ba-videorecorder.uploading-failed":"Opplasting mislyktes - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.verifying":"Bekrefter","ba-videorecorder.verifying-failed":"Bekrefter mislyktes - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.rerecord-confirm":"Har du virkelig &#xF8;nsker &#xE5; gj&#xF8;re om videoen?","ba-videorecorder.video_file_too_large":"Videofilen er for stor (%s) - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt med en mindre videofil.","ba-videorecorder.unsupported_video_type":"Last opp: %s - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt."},"language:pl":{"ba-videoplayer-playbutton.tooltip":"Kliknij, aby odtworzy&#x107; film.","ba-videoplayer-playbutton.rerecord":"Przerobi&#x107;","ba-videoplayer-playbutton.submit-video":"Potwierd&#x17A; wideo","ba-videoplayer-loader.tooltip":"&#x141;adowanie wideo ...","ba-videoplayer-controlbar.change-resolution":"zmiana rozdzielczo&#x15B;ci","ba-videoplayer-controlbar.video-progress":"post&#x119;p wideo","ba-videoplayer-controlbar.rerecord-video":"Redo wideo?","ba-videoplayer-controlbar.submit-video":"Potwierd&#x17A; wideo","ba-videoplayer-controlbar.play-video":"play video","ba-videoplayer-controlbar.pause-video":"Pauza wideo","ba-videoplayer-controlbar.elapsed-time":"czas, jaki up&#x142;yn&#x105;&#x142;","ba-videoplayer-controlbar.total-time":"Ca&#x142;kowita d&#x142;ugo&#x15B;&#x107; wideo","ba-videoplayer-controlbar.fullscreen-video":"Otworzy&#x107; w trybie pe&#x142;noekranowym","ba-videoplayer-controlbar.volume-button":"Ustaw g&#x142;o&#x15B;no&#x15B;&#x107;","ba-videoplayer-controlbar.volume-mute":"Wycisz d&#x17A;wi&#x119;k","ba-videoplayer-controlbar.volume-unmute":"W&#x142;&#x105;cz d&#x17A;wi&#x119;k","ba-videoplayer.video-error":"Wyst&#x105;pi&#x142; b&#x142;&#x105;d. Prosz&#x119; spr&#xF3;bowa&#x107; p&#xF3;&#x17A;niej. Kliknij, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder-chooser.record-video":"Nagraj wideo","ba-videorecorder-chooser.upload-video":"Prze&#x15B;lij wideo","ba-videorecorder-controlbar.settings":"Ustawienia","ba-videorecorder-controlbar.camerahealthy":"O&#x15B;wietlenie jest dobre","ba-videorecorder-controlbar.cameraunhealthy":"O&#x15B;wietlenie nie jest optymalna","ba-videorecorder-controlbar.microphonehealthy":"D&#x17A;wi&#x119;k jest dobry","ba-videorecorder-controlbar.microphoneunhealthy":"Nie mog&#x119; odebra&#x107; &#x17C;adnego d&#x17A;wi&#x119;ku","ba-videorecorder-controlbar.record":"Rekord","ba-videorecorder-controlbar.record-tooltip":"Kliknij tutaj, aby nagra&#x107;.","ba-videorecorder-controlbar.rerecord":"Przerobi&#x107;","ba-videorecorder-controlbar.rerecord-tooltip":"Kliknij tutaj, aby ponowi&#x107;.","ba-videorecorder-controlbar.upload-covershot":"Przekaza&#x107; plik","ba-videorecorder-controlbar.upload-covershot-tooltip":"Kliknij tu aby przes&#x142;a&#x107; niestandardowy ok&#x142;adk&#x119; strza&#x142;","ba-videorecorder-controlbar.stop":"Zatrzymaj si&#x119;","ba-videorecorder-controlbar.stop-tooltip":"Kliknij tutaj, aby zatrzyma&#x107;.","ba-videorecorder-controlbar.skip":"Pomin&#x105;&#x107;","ba-videorecorder-controlbar.skip-tooltip":"Kliknij tutaj, aby przej&#x15B;&#x107;.","ba-videorecorder.recorder-error":"Wyst&#x105;pi&#x142; b&#x142;&#x105;d. Prosz&#x119; spr&#xF3;bowa&#x107; p&#xF3;&#x17A;niej. Kliknij, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.attach-error":"Nie mogli&#x15B;my uzyska&#x107; dost&#x119;p do interfejsu aparatu. W zale&#x17C;no&#x15B;ci od urz&#x105;dzenia i przegl&#x105;darki, mo&#x17C;e by&#x107; konieczne zainstalowanie Flash lub wej&#x15B;&#x107; na stron&#x119; za po&#x15B;rednictwem protoko&#x142;u SSL.","ba-videorecorder.access-forbidden":"Dost&#x119;p do kamery by&#x142;o zabronione. Kliknij, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.pick-covershot":"Wybierz covershot.","ba-videorecorder.uploading":"Przesy&#x142;anie","ba-videorecorder.uploading-failed":"Przesy&#x142;anie nie powiod&#x142;o si&#x119; - kliknij tutaj, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.verifying":"Weryfikacja","ba-videorecorder.verifying-failed":"Sprawdzanie poprawno&#x15B;ci nie powiod&#x142;o si&#x119; - kliknij tutaj, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.rerecord-confirm":"Czy na pewno chcesz przerobi&#x107; sw&#xF3;j film?","ba-videorecorder.video_file_too_large":"Plik wideo jest zbyt du&#x17C;a (%s) - kliknij tutaj, aby spr&#xF3;bowa&#x107; ponownie z mniejszym pliku wideo.","ba-videorecorder.unsupported_video_type":"Prosz&#x119; przes&#x142;a&#x107;: %s - kliknij tutaj, aby ponowi&#x107; pr&#xF3;b&#x119;."},"language:pt-br":{"ba-videoplayer-playbutton.tooltip":"Clique para reproduzir v&#xED;deo.","ba-videoplayer-playbutton.rerecord":"Refazer","ba-videoplayer-playbutton.submit-video":"confirmar v&#xED;deo","ba-videoplayer-loader.tooltip":"Carregando v&#xED;deo ...","ba-videoplayer-controlbar.change-resolution":"altera&#xE7;&#xE3;o de resolu&#xE7;&#xE3;o","ba-videoplayer-controlbar.video-progress":"o progresso de v&#xED;deo","ba-videoplayer-controlbar.rerecord-video":"Refazer v&#xED;deo?","ba-videoplayer-controlbar.submit-video":"confirmar v&#xED;deo","ba-videoplayer-controlbar.play-video":"reprodu&#xE7;&#xE3;o de v&#xED;deo","ba-videoplayer-controlbar.pause-video":"v&#xED;deo pausa","ba-videoplayer-controlbar.elapsed-time":"tempo elasped","ba-videoplayer-controlbar.total-time":"comprimento total de v&#xED;deo","ba-videoplayer-controlbar.fullscreen-video":"Entrar em tela cheia","ba-videoplayer-controlbar.volume-button":"volume definido","ba-videoplayer-controlbar.volume-mute":"som Mute","ba-videoplayer-controlbar.volume-unmute":"ativar o som","ba-videoplayer.video-error":"Ocorreu um erro. Por favor tente novamente mais tarde. Clique para tentar novamente.","ba-videorecorder-chooser.record-video":"Grave o seu v&#xED;deo","ba-videorecorder-chooser.upload-video":"Upload video","ba-videorecorder-controlbar.settings":"Configura&#xE7;&#xF5;es","ba-videorecorder-controlbar.camerahealthy":"A ilumina&#xE7;&#xE3;o &#xE9; boa","ba-videorecorder-controlbar.cameraunhealthy":"Ilumina&#xE7;&#xE3;o n&#xE3;o &#xE9; o ideal","ba-videorecorder-controlbar.microphonehealthy":"O som &#xE9; bom","ba-videorecorder-controlbar.microphoneunhealthy":"n&#xE3;o pode pegar qualquer som","ba-videorecorder-controlbar.record":"Registro","ba-videorecorder-controlbar.record-tooltip":"Clique aqui para registrar.","ba-videorecorder-controlbar.rerecord":"Refazer","ba-videorecorder-controlbar.rerecord-tooltip":"Clique aqui para refazer.","ba-videorecorder-controlbar.upload-covershot":"Envio","ba-videorecorder-controlbar.upload-covershot-tooltip":"Clique aqui para enviar capa personalizada tiro","ba-videorecorder-controlbar.stop":"Pare","ba-videorecorder-controlbar.stop-tooltip":"Clique aqui para parar.","ba-videorecorder-controlbar.skip":"Pular","ba-videorecorder-controlbar.skip-tooltip":"Clique aqui para pular.","ba-videorecorder.recorder-error":"Ocorreu um erro. Por favor tente novamente mais tarde. Clique para tentar novamente.","ba-videorecorder.attach-error":"N&#xF3;s n&#xE3;o poderia acessar a interface da c&#xE2;mera. Dependendo do dispositivo e navegador, pode ser necess&#xE1;rio instalar o Flash ou acessar a p&#xE1;gina atrav&#xE9;s de SSL.","ba-videorecorder.access-forbidden":"foi proibido o acesso &#xE0; c&#xE2;mera. Clique para tentar novamente.","ba-videorecorder.pick-covershot":"Escolha um covershot.","ba-videorecorder.uploading":"upload","ba-videorecorder.uploading-failed":"Upload falhou - clique aqui para tentar novamente.","ba-videorecorder.verifying":"Verificando","ba-videorecorder.verifying-failed":"Verificando falhou - clique aqui para tentar novamente.","ba-videorecorder.rerecord-confirm":"Voc&#xEA; realmente quer refazer seu v&#xED;deo?","ba-videorecorder.video_file_too_large":"O arquivo de v&#xED;deo &#xE9; muito grande (%s) - clique aqui para tentar novamente com um arquivo de v&#xED;deo menor.","ba-videorecorder.unsupported_video_type":"Fa&#xE7;a o upload: %s - clique aqui para tentar novamente."},"language:ro":{"ba-videoplayer-playbutton.tooltip":"Click aici pentru a reda video.","ba-videoplayer-playbutton.rerecord":"Reface","ba-videoplayer-playbutton.submit-video":"confirm&#x103; film","ba-videoplayer-loader.tooltip":"Se &#xEE;ncarc&#x103; videoclipul ...","ba-videoplayer-controlbar.change-resolution":"Schimba&#x21B;i rezolu&#x21B;ia","ba-videoplayer-controlbar.video-progress":"progresul video","ba-videoplayer-controlbar.rerecord-video":"Reface&#x21B;i video?","ba-videoplayer-controlbar.submit-video":"confirm&#x103; film","ba-videoplayer-controlbar.play-video":"Ruleaz&#x103; video","ba-videoplayer-controlbar.pause-video":"video de pauz&#x103;","ba-videoplayer-controlbar.elapsed-time":"timp scurs","ba-videoplayer-controlbar.total-time":"Lungimea total&#x103; a videoclipului","ba-videoplayer-controlbar.fullscreen-video":"intra pe tot ecranul","ba-videoplayer-controlbar.volume-button":"set de volum","ba-videoplayer-controlbar.volume-mute":"sunet mut","ba-videoplayer-controlbar.volume-unmute":"repornirea sunetului","ba-videoplayer.video-error":"A ap&#x103;rut o eroare, v&#x103; rug&#x103;m s&#x103; &#xEE;ncerca&#x21B;i din nou mai t&#xE2;rziu. Click aici pentru a &#xEE;ncerca din nou.","ba-videorecorder-chooser.record-video":"&#xCE;nregistrarea imaginilor video dvs.","ba-videorecorder-chooser.upload-video":"&#xCE;ncarc&#x103; film","ba-videorecorder-controlbar.settings":"set&#x103;rile","ba-videorecorder-controlbar.camerahealthy":"De iluminat este bun","ba-videorecorder-controlbar.cameraunhealthy":"De iluminat nu este optim","ba-videorecorder-controlbar.microphonehealthy":"Sunetul este bun","ba-videorecorder-controlbar.microphoneunhealthy":"Nu se poate ridica nici un sunet","ba-videorecorder-controlbar.record":"Record","ba-videorecorder-controlbar.record-tooltip":"Apasa aici pentru a &#xEE;nregistra.","ba-videorecorder-controlbar.rerecord":"Reface","ba-videorecorder-controlbar.rerecord-tooltip":"Apasa aici pentru a reface.","ba-videorecorder-controlbar.upload-covershot":"&#xCE;nc&#x103;rca&#x21B;i","ba-videorecorder-controlbar.upload-covershot-tooltip":"Apasa aici pentru a &#xEE;nc&#x103;rca capac personalizat lovitur&#x103;","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Apasa aici pentru a opri.","ba-videorecorder-controlbar.skip":"s&#x103;ri","ba-videorecorder-controlbar.skip-tooltip":"Apasa aici pentru a s&#x103;ri peste.","ba-videorecorder.recorder-error":"A ap&#x103;rut o eroare, v&#x103; rug&#x103;m s&#x103; &#xEE;ncerca&#x21B;i din nou mai t&#xE2;rziu. Click aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.attach-error":"Nu am putut accesa interfa&#x21B;a camerei. &#xCE;n func&#x21B;ie de dispozitiv &#x219;i browser-ul, poate fi necesar s&#x103; instala&#x21B;i Flash sau accesa pagina prin SSL.","ba-videorecorder.access-forbidden":"Accesul la camera a fost interzis&#x103;. Click aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.pick-covershot":"Alege un covershot.","ba-videorecorder.uploading":"Se &#xEE;ncarc&#x103;","ba-videorecorder.uploading-failed":"Se &#xEE;ncarc&#x103; nu a reu&#x219;it - clic aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.verifying":"Se verific&#x103;","ba-videorecorder.verifying-failed":"Care verific&#x103; dac&#x103; nu a reu&#x219;it - clic aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.rerecord-confirm":"Chiar vrei s&#x103; reface&#x21B;i videoclipul?","ba-videorecorder.video_file_too_large":"Fi&#x219;ierul dvs. video este prea mare (%s) - click aici pentru a &#xEE;ncerca din nou cu un fi&#x219;ier video mai mic.","ba-videorecorder.unsupported_video_type":"V&#x103; rug&#x103;m s&#x103; &#xEE;nc&#x103;rca&#x21B;i: %s - clic aici pentru a &#xEE;ncerca din nou."},"language:sr":{"ba-videoplayer-playbutton.tooltip":"&#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43B;&#x430;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;.","ba-videoplayer-playbutton.rerecord":"&#x43F;&#x440;&#x435;&#x43F;&#x440;&#x430;&#x432;&#x438;&#x442;&#x438;","ba-videoplayer-playbutton.submit-video":"&#x43F;&#x43E;&#x442;&#x432;&#x440;&#x434;&#x438;&#x442;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-loader.tooltip":"&#x41B;&#x43E;&#x430;&#x434;&#x438;&#x43D;&#x433; &#x432;&#x438;&#x434;&#x435;&#x43E; ...","ba-videoplayer-controlbar.change-resolution":"&#x41F;&#x440;&#x43E;&#x43C;&#x435;&#x43D;&#x430; &#x440;&#x435;&#x437;&#x43E;&#x43B;&#x443;&#x446;&#x438;&#x458;&#x435;","ba-videoplayer-controlbar.video-progress":"&#x432;&#x438;&#x434;&#x435;&#x43E; &#x43D;&#x430;&#x43F;&#x440;&#x435;&#x434;&#x430;&#x43A;","ba-videoplayer-controlbar.rerecord-video":"&#x420;&#x435;&#x434;&#x43E; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videoplayer-controlbar.submit-video":"&#x43F;&#x43E;&#x442;&#x432;&#x440;&#x434;&#x438;&#x442;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.play-video":"&#x43F;&#x43B;&#x430;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.pause-video":"&#x43F;&#x430;&#x443;&#x437;&#x430; video","ba-videoplayer-controlbar.elapsed-time":"&#x415;&#x43B;&#x430;&#x441;&#x43F;&#x435;&#x434; &#x432;&#x440;&#x435;&#x43C;&#x435;","ba-videoplayer-controlbar.total-time":"&#x423;&#x43A;&#x443;&#x43F;&#x43D;&#x430; &#x434;&#x443;&#x436;&#x438;&#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.fullscreen-video":"&#x415;&#x43D;&#x442;&#x435;&#x440; &#x444;&#x443;&#x43B;&#x43B;&#x441;&#x446;&#x440;&#x435;&#x435;&#x43D;","ba-videoplayer-controlbar.volume-button":"&#x41F;&#x43E;&#x434;&#x435;&#x448;&#x430;&#x432;&#x430;&#x45A;&#x435; &#x458;&#x430;&#x447;&#x438;&#x43D;&#x435; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer-controlbar.volume-mute":"&#x43C;&#x443;&#x442;&#x435; &#x441;&#x43E;&#x443;&#x43D;&#x434;","ba-videoplayer-controlbar.volume-unmute":"&#x423;&#x43A;&#x459;&#x443;&#x447;&#x438; &#x437;&#x432;&#x443;&#x43A; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer.video-error":"&#x414;&#x43E;&#x448;&#x43B;&#x43E; &#x458;&#x435; &#x434;&#x43E; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x435;. &#x41C;&#x43E;&#x43B;&#x438;&#x43C;&#x43E;, &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430;&#x458;&#x442;&#x435; &#x43A;&#x430;&#x441;&#x43D;&#x438;&#x458;&#x435;. &#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;.","ba-videorecorder-chooser.record-video":"&#x421;&#x43D;&#x438;&#x43C;&#x438;&#x442;&#x435; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-chooser.upload-video":"&#x414;&#x43E;&#x434;&#x430;&#x458; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-controlbar.settings":"&#x41F;&#x43E;&#x434;&#x435;&#x448;&#x430;&#x432;&#x430;&#x45A;&#x430;","ba-videorecorder-controlbar.camerahealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x459;&#x435;&#x45A;&#x435; &#x458;&#x435; &#x434;&#x43E;&#x431;&#x440;&#x43E;","ba-videorecorder-controlbar.cameraunhealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x459;&#x435;&#x45A;&#x435; &#x43D;&#x438;&#x458;&#x435; &#x43E;&#x43F;&#x442;&#x438;&#x43C;&#x430;&#x43B;&#x43D;&#x430;","ba-videorecorder-controlbar.microphonehealthy":"&#x417;&#x432;&#x443;&#x43A; &#x458;&#x435; &#x434;&#x43E;&#x431;&#x430;&#x440;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x41D;&#x435; &#x43C;&#x43E;&#x433;&#x443; &#x443;&#x437;&#x435;&#x442;&#x438; &#x431;&#x438;&#x43B;&#x43E; &#x43A;&#x43E;&#x458;&#x438; &#x437;&#x432;&#x443;&#x43A;","ba-videorecorder-controlbar.record":"&#x437;&#x430;&#x43F;&#x438;&#x441;","ba-videorecorder-controlbar.record-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x437;&#x430; &#x441;&#x43D;&#x438;&#x43C;&#x430;&#x45A;&#x435;.","ba-videorecorder-controlbar.rerecord":"&#x43F;&#x440;&#x435;&#x43F;&#x440;&#x430;&#x432;&#x438;&#x442;&#x438;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x437;&#x430; &#x43F;&#x43E;&#x43D;&#x430;&#x432;&#x459;&#x430;&#x45A;&#x435;.","ba-videorecorder-controlbar.upload-covershot":"&#x43E;&#x442;&#x43F;&#x440;&#x435;&#x43C;&#x430;&#x45A;&#x435;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x431;&#x438;&#x441;&#x442;&#x435; &#x43F;&#x440;&#x438;&#x43B;&#x430;&#x433;&#x43E;&#x452;&#x435;&#x43D;&#x443; &#x43D;&#x430;&#x441;&#x43B;&#x43E;&#x432;&#x43D;&#x443; &#x43C;&#x435;&#x442;&#x430;&#x43A;","ba-videorecorder-controlbar.stop":"&#x417;&#x430;&#x443;&#x441;&#x442;&#x430;&#x432;&#x438;&#x442;&#x438;","ba-videorecorder-controlbar.stop-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x441;&#x435; &#x437;&#x430;&#x443;&#x441;&#x442;&#x430;&#x432;&#x438;.","ba-videorecorder-controlbar.skip":"&#x43F;&#x440;&#x435;&#x441;&#x43A;&#x43E;&#x447;&#x438;&#x442;&#x438;","ba-videorecorder-controlbar.skip-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x440;&#x435;&#x441;&#x43A;&#x43E;&#x447;&#x438;&#x442;&#x435;.","ba-videorecorder.recorder-error":"&#x414;&#x43E;&#x448;&#x43B;&#x43E; &#x458;&#x435; &#x434;&#x43E; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x435;. &#x41C;&#x43E;&#x43B;&#x438;&#x43C;&#x43E;, &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430;&#x458;&#x442;&#x435; &#x43A;&#x430;&#x441;&#x43D;&#x438;&#x458;&#x435;. &#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;.","ba-videorecorder.attach-error":"&#x41C;&#x438; &#x43D;&#x435; &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x43F;&#x440;&#x438;&#x441;&#x442;&#x443;&#x43F;&#x438; &#x438;&#x43D;&#x442;&#x435;&#x440;&#x444;&#x435;&#x458;&#x441; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x435;. &#x423; &#x437;&#x430;&#x432;&#x438;&#x441;&#x43D;&#x43E;&#x441;&#x442;&#x438; &#x43E;&#x434; &#x443;&#x440;&#x435;&#x452;&#x430;&#x458;&#x430; &#x438; &#x43F;&#x440;&#x435;&#x442;&#x440;&#x430;&#x436;&#x438;&#x432;&#x430;&#x447;&#x430;, &#x43C;&#x43E;&#x436;&#x434;&#x430; &#x45B;&#x435;&#x442;&#x435; &#x43C;&#x43E;&#x440;&#x430;&#x442;&#x438; &#x434;&#x430; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x442;&#x435; &#x424;&#x43B;&#x430;&#x441;&#x445; &#x438;&#x43B;&#x438; &#x43F;&#x440;&#x438;&#x441;&#x442;&#x443;&#x43F;&#x438;&#x43B;&#x438; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x438; &#x43F;&#x440;&#x435;&#x43A;&#x43E; &#x421;&#x421;&#x41B;.","ba-videorecorder.access-forbidden":"&#x41F;&#x440;&#x438;&#x441;&#x442;&#x443;&#x43F; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x43E;&#x43C; &#x458;&#x435; &#x437;&#x430;&#x431;&#x440;&#x430;&#x45A;&#x435;&#x43D;&#x43E;. &#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;.","ba-videorecorder.pick-covershot":"&#x418;&#x437;&#x430;&#x431;&#x435;&#x440;&#x438;&#x442;&#x435; &#x446;&#x43E;&#x432;&#x435;&#x440;&#x441;&#x445;&#x43E;&#x442;.","ba-videorecorder.uploading":"&#x443;&#x43F;&#x43B;&#x43E;&#x430;&#x434;&#x438;&#x43D;&#x433;","ba-videorecorder.uploading-failed":"&#x423;&#x43F;&#x43B;&#x43E;&#x430;&#x434;&#x438;&#x43D;&#x433; &#x444;&#x430;&#x438;&#x43B;&#x435;&#x434; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.verifying":"&#x432;&#x435;&#x440;&#x438;&#x444;&#x438;&#x43A;&#x430;&#x446;&#x438;&#x458;&#x443;","ba-videorecorder.verifying-failed":"&#x41F;&#x440;&#x43E;&#x432;&#x435;&#x440;&#x430; &#x43D;&#x438;&#x458;&#x435; &#x443;&#x441;&#x43F;&#x435;&#x43B;&#x430; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.rerecord-confirm":"&#x414;&#x430; &#x43B;&#x438; &#x437;&#x430;&#x438;&#x441;&#x442;&#x430; &#x436;&#x435;&#x43B;&#x438;&#x442;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x435; &#x441;&#x432;&#x43E;&#x458; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videorecorder.video_file_too_large":"&#x412;&#x430;&#x448; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x434;&#x430;&#x442;&#x43E;&#x442;&#x435;&#x43A;&#x430; &#x458;&#x435; &#x43F;&#x440;&#x435;&#x432;&#x435;&#x43B;&#x438;&#x43A;&#x430; (%s) - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E; &#x441;&#x430; &#x43C;&#x430;&#x45A;&#x43E;&#x43C; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x444;&#x430;&#x458;&#x43B;.","ba-videorecorder.unsupported_video_type":"&#x41C;&#x43E;&#x43B;&#x438;&#x43C;&#x43E; &#x412;&#x430;&#x441; &#x434;&#x430; &#x443;&#x43F;&#x43B;&#x43E;&#x430;&#x434;: %&#x441; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E;."},"language:sv":{"ba-videoplayer-playbutton.tooltip":"Klicka f&#xF6;r att spela upp video.","ba-videoplayer-playbutton.rerecord":"G&#xF6;ra om","ba-videoplayer-playbutton.submit-video":"bekr&#xE4;fta video","ba-videoplayer-loader.tooltip":"Laddar video ...","ba-videoplayer-controlbar.change-resolution":"&#xE4;ndra uppl&#xF6;sning","ba-videoplayer-controlbar.video-progress":"video framsteg","ba-videoplayer-controlbar.rerecord-video":"G&#xF6;r video?","ba-videoplayer-controlbar.submit-video":"bekr&#xE4;fta video","ba-videoplayer-controlbar.play-video":"Spela video","ba-videoplayer-controlbar.pause-video":"pause video","ba-videoplayer-controlbar.elapsed-time":"f&#xF6;rfluten tid","ba-videoplayer-controlbar.total-time":"Totala l&#xE4;ngden av video","ba-videoplayer-controlbar.fullscreen-video":"Ange fullscreen","ba-videoplayer-controlbar.volume-button":"inst&#xE4;llda volymen","ba-videoplayer-controlbar.volume-mute":"st&#xE4;nga av ljudet","ba-videoplayer-controlbar.volume-unmute":"s&#xE4;tta p&#xE5; ljudet","ba-videoplayer.video-error":"Ett fel har intr&#xE4;ffat. V&#xE4;nligen f&#xF6;rs&#xF6;k igen senare. Klicka f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder-chooser.record-video":"Spela din video","ba-videorecorder-chooser.upload-video":"Ladda upp video","ba-videorecorder-controlbar.settings":"inst&#xE4;llningar","ba-videorecorder-controlbar.camerahealthy":"Belysning &#xE4;r bra","ba-videorecorder-controlbar.cameraunhealthy":"Belysning &#xE4;r inte optimal","ba-videorecorder-controlbar.microphonehealthy":"Ljudet &#xE4;r bra","ba-videorecorder-controlbar.microphoneunhealthy":"Det g&#xE5;r inte att plocka upp n&#xE5;got ljud","ba-videorecorder-controlbar.record":"Spela in","ba-videorecorder-controlbar.record-tooltip":"Klicka h&#xE4;r f&#xF6;r att spela in.","ba-videorecorder-controlbar.rerecord":"G&#xF6;ra om","ba-videorecorder-controlbar.rerecord-tooltip":"Klicka h&#xE4;r f&#xF6;r att g&#xF6;ra om.","ba-videorecorder-controlbar.upload-covershot":"Ladda upp","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klicka h&#xE4;r f&#xF6;r att ladda upp anpassade t&#xE4;cka skott","ba-videorecorder-controlbar.stop":"Sluta","ba-videorecorder-controlbar.stop-tooltip":"Klicka h&#xE4;r f&#xF6;r att stanna.","ba-videorecorder-controlbar.skip":"Hoppa","ba-videorecorder-controlbar.skip-tooltip":"Klicka h&#xE4;r f&#xF6;r att hoppa.","ba-videorecorder.recorder-error":"Ett fel har intr&#xE4;ffat. V&#xE4;nligen f&#xF6;rs&#xF6;k igen senare. Klicka f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.attach-error":"Vi kunde inte komma &#xE5;t kameragr&#xE4;nssnittet. Beroende p&#xE5; vilken enhet och webbl&#xE4;sare, kan du beh&#xF6;va installera Flash eller &#xF6;ppna sidan via SSL.","ba-videorecorder.access-forbidden":"&#xC5;tkomst till kameran var f&#xF6;rbjudet. Klicka f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.pick-covershot":"V&#xE4;lj en covershot.","ba-videorecorder.uploading":"uppladdning","ba-videorecorder.uploading-failed":"Uppladdning misslyckades - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.verifying":"verifiera","ba-videorecorder.verifying-failed":"Verifiera misslyckades - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.rerecord-confirm":"Vill du verkligen vill g&#xF6;ra om din video?","ba-videorecorder.video_file_too_large":"Videofilen &#xE4;r f&#xF6;r stor (%s) - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen med en mindre videofil.","ba-videorecorder.unsupported_video_type":"Ladda upp: %s - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen."},"language:tr":{"ba-videoplayer-playbutton.tooltip":"video oynatmak i&#xE7;in t&#x131;klay&#x131;n&#x131;z.","ba-videoplayer-playbutton.rerecord":"yeniden yapmak","ba-videoplayer-playbutton.submit-video":"videoyu onayla","ba-videoplayer-loader.tooltip":"Video y&#xFC;kleniyor ...","ba-videoplayer-controlbar.change-resolution":"De&#x11F;i&#x15F;im &#xE7;&#xF6;z&#xFC;n&#xFC;rl&#xFC;&#x11F;&#xFC;","ba-videoplayer-controlbar.video-progress":"Video ilerleme","ba-videoplayer-controlbar.rerecord-video":"Videoyu Redo?","ba-videoplayer-controlbar.submit-video":"videoyu onayla","ba-videoplayer-controlbar.play-video":"Video oynatmak","ba-videoplayer-controlbar.pause-video":"Pause Video","ba-videoplayer-controlbar.elapsed-time":"Ge&#xE7;en s&#xFC;re","ba-videoplayer-controlbar.total-time":"videonun toplam uzunlu&#x11F;u","ba-videoplayer-controlbar.fullscreen-video":"Tam ekran yap","ba-videoplayer-controlbar.volume-button":"Set hacmi","ba-videoplayer-controlbar.volume-mute":"sesi","ba-videoplayer-controlbar.volume-unmute":"sesi a&#xE7;","ba-videoplayer.video-error":"Bir hata, l&#xFC;tfen tekrar deneyiniz olu&#x15F;tu. Tekrar denemek i&#xE7;in t&#x131;klay&#x131;n.","ba-videorecorder-chooser.record-video":"Ki&#x15F;isel Video kay&#x131;t","ba-videorecorder-chooser.upload-video":"video","ba-videorecorder-controlbar.settings":"Ayarlar","ba-videorecorder-controlbar.camerahealthy":"Ayd&#x131;nlatma iyidir","ba-videorecorder-controlbar.cameraunhealthy":"Ayd&#x131;nlatma optimum de&#x11F;il","ba-videorecorder-controlbar.microphonehealthy":"Ses iyidir","ba-videorecorder-controlbar.microphoneunhealthy":"herhangi bir ses pick up olamaz","ba-videorecorder-controlbar.record":"Kay&#x131;t","ba-videorecorder-controlbar.record-tooltip":"kaydetmek i&#xE7;in buraya t&#x131;klay&#x131;n.","ba-videorecorder-controlbar.rerecord":"yeniden yapmak","ba-videorecorder-controlbar.rerecord-tooltip":"yinelemek i&#xE7;in buraya t&#x131;klay&#x131;n.","ba-videorecorder-controlbar.upload-covershot":"y&#xFC;kleme","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#xF6;zel kapak &#xE7;ekimi y&#xFC;klemek i&#xE7;in buraya t&#x131;klay&#x131;n","ba-videorecorder-controlbar.stop":"Dur","ba-videorecorder-controlbar.stop-tooltip":"durdurmak i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder-controlbar.skip":"atlamak","ba-videorecorder-controlbar.skip-tooltip":"atlamak i&#xE7;in buraya t&#x131;klay&#x131;n.","ba-videorecorder.recorder-error":"Bir hata, l&#xFC;tfen tekrar deneyiniz olu&#x15F;tu. Tekrar denemek i&#xE7;in t&#x131;klay&#x131;n.","ba-videorecorder.attach-error":"Biz kamera aray&#xFC;z&#xFC; eri&#x15F;emedi. cihaz ve taray&#x131;c&#x131;ya ba&#x11F;l&#x131; olarak, Flash y&#xFC;klemek veya SSL ile sayfaya eri&#x15F;mek i&#xE7;in gerekebilir.","ba-videorecorder.access-forbidden":"Kameraya eri&#x15F;im yasakland&#x131;. Tekrar denemek i&#xE7;in t&#x131;klay&#x131;n.","ba-videorecorder.pick-covershot":"Bir covershot se&#xE7;in.","ba-videorecorder.uploading":"Y&#xFC;kleme","ba-videorecorder.uploading-failed":"Y&#xFC;kleme ba&#x15F;ar&#x131;s&#x131;z - yeniden denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder.verifying":"Do&#x11F;rulama","ba-videorecorder.verifying-failed":"Ba&#x15F;ar&#x131;s&#x131;z kullan&#x131;ld&#x131;&#x11F;&#x131;n&#x131; do&#x11F;rulamak - yeniden denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder.rerecord-confirm":"E&#x11F;er ger&#xE7;ekten video yinelemek istiyor musunuz?","ba-videorecorder.video_file_too_large":"Videonuz dosyas&#x131; &#xE7;ok b&#xFC;y&#xFC;k (%s) - k&#xFC;&#xE7;&#xFC;k bir video dosyas&#x131; ile tekrar denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder.unsupported_video_type":"y&#xFC;kleyin: %s - yeniden denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n."}};
    for (var language in languages)
        Assets.strings.register(languages[language], [language]);
    return {};
});

Scoped.define("module:Ads.AdSenseVideoAdProvider", [
		"module:Ads.AbstractVideoAdProvider", "module:Ads.AdSensePrerollAd" ],
function(AbstractVideoAdProvider, AdSensePrerollAd, scoped) {
	return AbstractVideoAdProvider.extend({
		scoped : scoped
	}, {

		_newPrerollAd : function(options) {
			return new AdSensePrerollAd(this, options);
		}

	});
});


Scoped.define("module:Ads.AdSensePrerollAd", [
  	"module:Ads.AbstractPrerollAd"
  ], function (AbstractVideoPrerollAd, scoped) {
  	return AbstractVideoPrerollAd.extend({scoped: scoped}, function (inherited) {
  		return {
  				
  			constructor: function (provider, options) {
  				inherited.constructor.call(this, provider, options);
  				this._adDisplayContainer = new google.ima.AdDisplayContainer(this._options.adElement, this._options.videoElement);
  				// Must be done as the result of a user action on mobile
  				this._adDisplayContainer.initialize();
  				//Re-use this AdsLoader instance for the entire lifecycle of your page.
  				this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);
  	
  				var self = this;
  				this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function () {
  					self._adError();
  				}, false);
  				this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function () {
  					self._adLoaded.apply(self, arguments);
  				}, false);
  				
  				this._adsRequest = new google.ima.AdsRequest();
  				this._adsRequest.adTagUrl = this._provider.options().adTagUrl;
  			},
  			
  			_executeAd: function (options) {
  				// Specify the linear and nonlinear slot sizes. This helps the SDK to
  				// select the correct creative if multiple are returned.
  				this._adsRequest.linearAdSlotWidth = options.width;
  				this._adsRequest.linearAdSlotHeight = options.height;
  				// adsRequest.nonLinearAdSlotWidth = 640;
  				// adsRequest.nonLinearAdSlotHeight = 150;
  				
  				this._adsLoader.requestAds(this._adsRequest);
  			},
  			
  			_adError: function () {
  				if (this._adsManager)
  					this._adsManager.destroy();
  				this._adFinished();
  			},
  			
  			_adLoaded: function (adsManagerLoadedEvent) {
  				  // Get the ads manager.
  				  this._adsManager = adsManagerLoadedEvent.getAdsManager(this._options.videoElement);
  				  // See API reference for contentPlayback
  				
  				  try {
  					    // Initialize the ads manager. Ad rules playlist will start at this time.
  					  this._adsManager.init(this._adsRequest.linearAdSlotWidth, this._adsRequest.linearAdSlotHeight, google.ima.ViewMode.NORMAL);
  					    // Call start to show ads. Single video and overlay ads will
  					    // start at this time; this call will be ignored for ad rules, as ad rules
  					    // ads start when the adsManager is initialized.
  					  this._adsManager.start();
  					  } catch (adError) {
  					    // An error may be thrown if there was a problem with the VAST response.
  					  }
  	
  				  var self = this;
  				  // Add listeners to the required events.
  				  this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function () {
  				      self._adError();
  				  }, false);
  				
  				  //this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {});
  				  this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () {
  					  self._adFinished();
  				  });
  			}
  		
  		};	
  	});
  });

Scoped.define("module:Ads.AbstractVideoAdProvider", [ "base:Class" ], function(
		Class, scoped) {
	return Class.extend({
		scoped : scoped
	}, function(inherited) {
		return {

			constructor : function(options) {
				inherited.constructor.call(this);
				this._options = options;
			},

			options : function() {
				return this._options;
			},

			_newPrerollAd : function(options) {
			},

			newPrerollAd : function(options) {
				return this._newPrerollAd(options);
			},
			
			register: function (name) {
				this.cls.registry[name] = this;
			}

		};
	}, {
		
		registry: {}
		
	});
});


Scoped.define("module:Ads.AbstractPrerollAd", [ "base:Class", "base:Events.EventsMixin" ], function (Class, EventsMixin, scoped) {
	return Class.extend({ scoped : scoped }, [ EventsMixin, function(inherited) {
		return {

			constructor : function(provider, options) {
				inherited.constructor.call(this);
				this._provider = provider;
				this._options = options;
			},

			executeAd : function(options) {
				this._options.adElement.style.display = "";
				this._executeAd(options);
			},

			_adFinished : function() {
				this._options.adElement.style.display = "none";
				this.trigger("finished");
			}

		};
	} ]);
});

Scoped.define("module:Assets", [
    "base:Classes.LocaleTable",
    "browser:Info"
], function (LocaleTable, Info) {
	
	var strings = new LocaleTable();
	strings.setWeakLocale(Info.language());
	
	return {
		
		strings: strings,
		
		playerthemes: {},
		
		recorderthemes: {}
		
	};
});
Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Comparators",
    "module:Templates",
    "browser:Dom",
    "module:Assets",
    "browser:Info",
    "media:Player.Support"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
], function (Class, TimeFormat, Comparators, Templates, Dom, Assets, Info, PlayerSupport, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_controlbar,
			
			attrs: {
				"css": "ba-videoplayer",
				"duration": 0,
				"position": 0,
				"cached": 0,
				"volume": 1.0,
				"expandedprogress": true,
				"playing": false,
				"rerecordable": false,
				"submittable": false,
				"streams": [],
				"currentstream": null,
				"fullscreen": true,
				"fullscreened": false,
				"activitydelta": 0,
				"title": ""
			},
			
			computed: {
				"currentstream_label:currentstream": function () {
					var cs = this.get("currentstream");
					return cs ? (cs.label ? cs.label : PlayerSupport.resolutionToLabel(cs.width, cs.height)): "";
				}
			},
			
			functions: {
				
				formatTime: function (time) {
					time = Math.max(time || 0, 1);
					return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
				},
				
				startUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", true);
					this.call("progressUpdatePosition", event);
				},
				
				progressUpdatePosition: function (event) {
					var ev = event[0];
					ev.preventDefault();
					if (!this.get("_updatePosition"))
						return;
					var clientX = ev.clientX;
					var target = ev.currentTarget;
					var offset = Dom.elementOffset(target);
					var dimensions = Dom.elementDimensions(target);
					this.set("position", this.get("duration") * (clientX - offset.left) / (dimensions.width || 1));
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
					var ev = event[0];
					ev.preventDefault();
					if (!this.get("_updateVolume"))
						return;
					var clientX = ev.clientX;
					var target = ev.currentTarget;
					var offset = Dom.elementOffset(target);
					var dimensions = Dom.elementDimensions(target);
					this.set("volume", (clientX - offset.left) / (dimensions.width || 1));
					this.trigger("volume", this.get("volume"));
				},

				stopUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", false);
				},

				startVerticallyUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", true);
					this.call("progressVerticallyUpdateVolume", event);
				},

				progressVerticallyUpdateVolume: function (event) {
					var ev = event[0];
					ev.preventDefault();
					if (!this.get("_updateVolume"))
						return;
					var pageY = ev.pageY;
					var target = ev.currentTarget;
					var offset = Dom.elementOffset(target);
					var dimensions = Dom.elementDimensions(target);
					this.set("volume", 1 - (pageY - offset.top) / dimensions.height);
					this.trigger("volume", this.get("volume"));
				},

				stopVerticallyUpdateVolume: function (event) {
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
				},
				
				submit: function () {
					this.set("submittable", false);
					this.set("rerecordable", false);
					this.trigger("submit");
				},
				
				toggle_stream: function () {
					var streams = this.get("streams");
					var current = streams.length - 1;
					streams.forEach(function (stream, i) {
						if (Comparators.deepEqual(stream, this.get("currentstream")))
							current = i;
					}, this);
					this.set("currentstream", streams[(current + 1) % streams.length]);
				}

			},
			
			create: function () {
				this.set("ismobile", Info.isMobile());
			}
			
		};
	})
	.register("ba-videoplayer-controlbar")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"video-progress": "Video progress",
    	"rerecord-video": "Redo video?",
    	"submit-video": "Confirm video",
    	"play-video": "Play video",
    	"pause-video": "Pause video",
    	"elapsed-time": "Elasped time",
    	"total-time": "Total length of video",
    	"fullscreen-video": "Enter fullscreen",
    	"volume-button": "Set volume",
    	"volume-mute": "Mute sound",
    	"volume-unmute": "Unmute sound",
    	"change-resolution": "Change resolution",
    	"exit-fullscreen-video": "Exit fullscreen"
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_loader,
			
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
			
			template: Templates.video_player_message,
			
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
				"css": "ba-videoplayer",
				"rerecordable": false,
				"submittable": false
			},
			
			functions: {
				
				play: function () {
					this.trigger("play");
				},
				
				submit: function () {
					this.set("submittable", false);
					this.set("rerecordable", false);
					this.trigger("submit");
				},

				rerecord: function () {
					this.trigger("rerecord");
				}				
				
			}
			
		};
	})
	.register("ba-videoplayer-playbutton")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Click to play video.",
    	"rerecord": "Redo",
    	"submit-video": "Confirm video"    	
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Player", [
	"dynamics:Dynamic",
	"module:Templates",
	"module:Assets",
	"browser:Info",
	"browser:Dom",
	"media:Player.VideoPlayerWrapper",
	"base:Types",
	"base:Objs",
	"base:Strings",
	"base:Time",
	"base:Timers",
	"base:States.Host",
	"base:Classes.ClassRegistry",
	"module:VideoPlayer.Dynamics.PlayerStates.Initial",
	"module:VideoPlayer.Dynamics.PlayerStates",
	"module:Ads.AbstractVideoAdProvider"
], [
	"module:VideoPlayer.Dynamics.Playbutton",
	"module:VideoPlayer.Dynamics.Message",
	"module:VideoPlayer.Dynamics.Loader",
	"module:VideoPlayer.Dynamics.Share",
	"module:VideoPlayer.Dynamics.Controlbar",
	"dynamics:Partials.EventPartial",
	"dynamics:Partials.OnPartial",
	"dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, Dom, VideoPlayerWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, InitialState, PlayerStates, AdProvider, scoped) {
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
				"csstopmessage": "",
				"csscontrolbar": "",
				"width": "",
				"height": "",
				/* Themes */
				"theme": "",
				"csstheme": "",
				"themecolor": "",
				/* Dynamics */
				"dynplaybutton": "videoplayer-playbutton",
				"dynloader": "videoplayer-loader",
				"dynmessage": "videoplayer-message",
				"dyntopmessage": "videoplayer-topmessage",
				"dyncontrolbar": "videoplayer-controlbar",
				"dynshare": "videoplayer-share",
				/* Templates */
				"tmplplaybutton": "",
				"tmplloader": "",
				"tmplmessage": "",
				"tmplshare": "",
				"tmpltopmessage": "",
				"tmplcontrolbar": "",
				/* Attributes */
				"poster": "",
				"source": "",
				"sources": [],
				"sourcefilter": {},
				"streams": [],
				"currentstream": null,
				"playlist": null,
				"volume": 1.0,
				"title": "",
				"initialseek": null,
				"fullscreened": false,
				"sharevideo": [],
				"sharevideourl": "",

				/* Configuration */
				"forceflash": false,
				"noflash": false,
				"reloadonplay": false,
				/* Ads */
				"adprovider": null,
				"preroll": false,
				/* Options */
				"rerecordable": false,
				"submittable": false,
				"autoplay": false,
				"preload": false,
				"loop": false,
				"nofullscreen": false,
				"playfullscreenonmobile": false,
				"ready": true,
				"stretch": false,
				"hideoninactivity": true,
				"skipinitial": false,
				"topmessage": "",
				"totalduration": null,
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
				"ready": "boolean",
				"nofullscreen": "boolean",
				"stretch": "boolean",
				"preroll": "boolean",
				"hideoninactivity": "boolean",
				"skipinitial": "boolean",
				"volume": "float",
				"initialseek": "float",
				"fullscreened": "boolean",
				"sharevideo": "array",
				"sharevideourl": "string",
				"playfullscreenonmobile": "boolean",
				"themecolor": "string",
				"totalduration": "float"
			},

			extendables: ["states"],

			remove_on_destroy: true,

			create: function () {
				if (Info.isMobile()) {
					if (Info.isiOS() && Info.iOSversion().major >= 10) {
						if (this.get("autoplay"))
							this.set("volume", 0.0);
					} else {
						this.set("autoplay", false);
						this.set("loop", false);
					}
				}
				if (this.get("theme") in Assets.playerthemes) {
					Objs.iter(Assets.playerthemes[this.get("theme")], function (value, key) {
						if (!this.isArgumentAttr(key))
							this.set(key, value);
					}, this);
				}

				if(!this.get("themecolor"))
       			   this.set("themecolor", "default");

				if (this.get("adprovider")) {
					this._adProvider = this.get("adprovider");
					if (Types.is_string(this._adProvider))
						this._adProvider = AdProvider.registry[this._adProvider];
				}
				if (this.get("playlist")) {
					var pl0 = (this.get("playlist"))[0];
					this.set("poster", pl0.poster);
					this.set("source", pl0.source);
					this.set("sources", pl0.sources);
				}
				if (this.get("streams") && !this.get("currentstream"))
					this.set("currentstream", (this.get("streams"))[0]);

				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("firefox", Info.isFirefox());
				this.set("duration", this.get("totalduration") || 0.0);
				this.set("position", 0.0);
				this.set("buffered", 0.0);
				this.set("message", "");
				this.set("fullscreensupport", false);
				this.set("csssize", "normal");

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
				this.__currentStretch = null;

				this.on("change:stretch", function () {
					this._updateStretch();
				}, this);
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
				if (this._prerollAd)
					this._prerollAd.weakDestroy();
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
				var video = this.activeElement().querySelector("[data-video='video']");
				this._clearError();
				VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
					element: video,
					forceflash: !!this.get("forceflash"),
					noflash: !!this.get("noflash"),
					preload: !!this.get("preload"),
					loop: !!this.get("loop"),
					reloadonplay: !!this.get("reloadonplay")
				})).error(function (e) {
					if (this.destroyed())
						return;
					this._error("attach", e);
				}, this).success(function (instance) {
					if (this.destroyed())
						return;
					if (this._adProvider && this.get("preroll")) {
						this._prerollAd = this._adProvider.newPrerollAd({
							videoElement: this.activeElement().querySelector("[data-video='video']"),
							adElement: this.activeElement().querySelector("[data-video='ad']")
						});
					}
					this.player = instance;
					this.player.on("fullscreen-change", function (inFullscreen) {
						this.set("fullscreened", inFullscreen);
					}, this);
					this.player.on("postererror", function () {
						this._error("poster");
					}, this);
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
					this.trigger("attached", instance);
					this.player.once("loaded", function () {
						var volume = Math.min(1.0, this.get("volume"));
						this.player.setVolume(volume);
						this.player.setMuted(volume <= 0.0);
						this.trigger("loaded");
						if (this.get("totalduration") || this.player.duration() < Infinity)
							this.set("duration", this.get("totalduration") || this.player.duration());
						this.set("fullscreensupport", this.player.supportsFullscreen());
						this._updateStretch();
						if (this.get("initialseek"))
							this.player.setPosition(this.get("initialseek"));
					}, this);
					if (this.player.loaded())
						this.player.trigger("loaded");
					this._updateStretch();
				}, this);
			},
			
			_getSources: function () {
				var filter = this.get("currentstream") ? this.get("currentstream").filter : this.get("sourcefilter");
				var poster = this.get("poster");
				var source = this.get("source");
				var sources = filter ? Objs.filter(this.get("sources"), function (source) {
					return Objs.subset_of(filter, source);
				}, this) : this.get("sources");
				Objs.iter(sources, function (s) {
					if (s.poster)
						poster = s.poster;
				});
				return {
					poster: poster,
					source: source,
					sources: sources
				};
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

			object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume"],

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

				submit: function () {
					if (!this.get("submittable"))
						return;
					this.trigger("submit");
					this.set("submittable", false);
					this.set("rerecordable", false);
				},

				pause: function () {
					if (this.get("playing"))
						this.player.pause();
				},

				stop: function () {
					if (!this.videoLoaded())
						return;
					if (this.get("playing"))
						this.player.pause();
					this.player.setPosition(0);
					this.trigger("stopped");
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
					if (this.get("fullscreened"))
						this.player.exitFullscreen();
					else
						this.player.enterFullscreen();
					this.set("fullscreened", !this.get("fullscreened"));
				}
				
			},

			destroy: function () {
				this._detachVideo();
				inherited.destroy.call(this);
			},

			_timerFire: function () {
				if (this.destroyed())
					return;
				try {
					if (this.videoLoaded()) {
						this.set("activity_delta", Time.now() - this.get("last_activity"));
						var new_position = this.player.position();
						if (new_position != this.get("position") || this.get("last_position_change"))
							this.set("last_position_change", Time.now());
						this.set("last_position_change_delta", Time.now() - this.get("last_position_change"));
						this.set("position", new_position);
						this.set("buffered", this.player.buffered());
						var pld = this.player.duration();
						if (0.0 < pld && pld < Infinity)
							this.set("duration", this.player.duration());
						else
							this.set("duration", this.get("totalduration") || new_position);
						this.set("fullscreened", this.player.isFullscreen());
					}
				} catch (e) {}
				this._updateStretch();
				this._updateCSSSize();
			},

			_updateCSSSize: function () {
				var width = Dom.elementDimensions(this.activeElement()).width;
				this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
			},

			videoHeight: function () {
				return this.videoAttached() ? this.player.videoHeight() : NaN;
			},

			videoWidth: function () {
				return this.videoAttached() ? this.player.videoWidth() : NaN;
			},

			aspectRatio: function () {
				return this.videoWidth() / this.videoHeight();
			},

			parentWidth: function () {
				return Dom.elementDimensions(this.activeElement().parentElement).width;
			},

			parentHeight: function () {
				return Dom.elementDimensions(this.activeElement().parentElement).height;
			},

			parentAspectRatio: function () {
				return this.parentWidth() / this.parentHeight();
			},

			_updateStretch: function () {
				var newStretch = null;
				if (this.get("stretch")) {
					var ar = this.aspectRatio();
					if (isFinite(ar)) {
						var par = this.parentAspectRatio();
						if (isFinite(par)) {
							if (par > ar)
								newStretch = "height";
							if (par < ar)
								newStretch = "width";
						} else if (par === Infinity)
							newStretch = "height";
					}
				}
				if (this.__currentStretch !== newStretch) {
					if (this.__currentStretch)
						Dom.elementRemoveClass(this.activeElement(), this.get("css") + "-stretch-" + this.__currentStretch);
					if (newStretch)
						Dom.elementAddClass(this.activeElement(), this.get("css") + "-stretch-" + newStretch);
				}
				this.__currentStretch = newStretch;
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
			this._started();
		},
		
		_started: function () {},
		
		play: function () {
			this.dyn.set("autoplay", true);
		}
	
	}]);
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.FatalError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		_locals: ["message"],

		_started: function () {
			this.dyn.set("message", this._message || this.dyn.string("video-error"));
		}

	});
});






Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Initial", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader"],

		_started: function () {
			if (this.dyn.get("ready"))
				this.next("LoadPlayer");
			else {
				this.listenOn(this.dyn, "change:ready", function () {
					this.next("LoadPlayer");
				});
			}
		}
	});
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
			
		dynamics: ["loader"],

		_started: function () {
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
	
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],

		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next("LoadPlayer");
			}, this);
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["playbutton"],

		_started: function () {
			this.listenOn(this.dyn, "error:poster", function () {
				if (!this.dyn.get("states").poster_error.ignore)
					this.next("PosterError");
			}, this);
			if (this.dyn.get("autoplay") || this.dyn.get("skipinitial"))
				this.play();
		},
		
		play: function () {
			this.next("Preroll");
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Preroll", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: [],

		_started: function () {
			if (this.dyn._prerollAd) {
				this.dyn._prerollAd.once("finished", function () {
					this.next("LoadVideo");
				}, this);
				this.dyn._prerollAd.executeAd({
					width: this.dyn.videoWidth(),
					height: this.dyn.videoHeight()
				});
			} else
				this.next("LoadVideo");
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		
		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next(this.dyn.get("states").poster_error.click_play ? "LoadVideo" : "LoadPlayer");
			}, this);
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State",
	"base:Timers.Timer"
], function (State, Timer, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],

		_started: function () {
			this.listenOn(this.dyn, "error:video", function () {
				this.next("ErrorVideo");
			}, this);
			this.listenOn(this.dyn, "playing", function () {
				if (this.destroyed() || this.dyn.destroyed())
					return;
				if (this.dyn.get("autoseek"))
					this.dyn.execute("seek", this.dyn.get("autoseek"));
				this.next("PlayVideo");
			}, this);
			if (this.dyn.get("skipinitial") && !this.dyn.get("autoplay"))
				this.next("PlayVideo");
			else {
				this.auto_destroy(new Timer({
					context: this,
					fire: function () {
						if (!this.destroyed() && !this.dyn.destroyed() && this.dyn.player)
							this.dyn.player.play();
					},
					delay: 500,
					immediate: true
				}));
			}
		}
	
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],

		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next("LoadVideo");
			}, this);
		}
	
	});
});




Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["controlbar"],

		_started: function () {
			this.dyn.set("autoplay", false);
			this.listenOn(this.dyn, "change:currentstream", function () {
				this.dyn.set("autoplay", true);
				this.dyn.set("autoseek", this.dyn.player.position());
				this.dyn.reattachVideo();
				this.next("LoadPlayer");
			}, this);
			this.listenOn(this.dyn, "ended", function () {
				this.dyn.set("autoseek", null);
				this.next("NextVideo");
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

	});
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.NextVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {

		_started: function () {
			if (this.dyn.get("playlist")) {
				var list = this.dyn.get("playlist");
				var head = list.shift();
				if (this.dyn.get("loop"))
					list.push(head);
				this.dyn.set("playlist", list);
				if (list.length > 0) {
					var pl0 = list[0];
					this.dyn.set("poster", pl0.poster);
					this.dyn.set("source", pl0.source);
					this.dyn.set("sources", pl0.sources);
					this.dyn.reattachVideo();
					this.dyn.set("autoplay", true);
					this.next("LoadPlayer");
					return;
				}
			}
			this.next("PosterReady");
		}

	});
});


Scoped.define("module:VideoPlayer.Dynamics.Share", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {

    var SHARES = {
        facebook: 'https://facebook.com/sharer/sharer.php?u=',
        twitter: 'https://twitter.com/home?status=',
        gplus: 'https://plus.google.com/share?url='
    };

    return Class.extend({scoped: scoped}, function (inherited) {
        return {
            template: Templates.video_player_share,

            attrs: {
                css: "ba-videoplayer",
                url: "",
                shares: []
            },

            functions: {

                shareMedia: function (share) {
                    window.open(SHARES[share] + this.get("url"), 'pop', 'width=600 height=400');
                },

                toggleShare: function () {
                    /*
                    var container = this.activeElement().querySelector().firstElementChild;
                    container.style.right = container.style.right ? "" : "-45px";
                    */
                }

            }
        };
    }).register("ba-videoplayer-share")
    .attachStringTable(Assets.strings)
    .addStrings({
        "share": "Share video"
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
    "dynamics:Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_topmessage,
			
			attrs: {
				"css": "ba-videoplayer",
				"topmessage": ''
			}
			
		};
	}).register("ba-videoplayer-topmessage");
});

Scoped.define("module:VideoRecorder.Dynamics.Chooser", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.IfPartial"
], function (Class, Templates, Assets, Info, scoped) {
		
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_chooser,
			
			attrs: {
				"css": "ba-videorecorder",
				"allowrecord": true,
				"allowupload": true,
				"allowcustomupload": true,
				"allowedextensions": null,
				"primaryrecord": true
			},
			
			types: {
				"allowedextensions": "array"
			},
			
			create: function () {
				var custom_accept_string = "";
				if (this.get("allowedextensions") && this.get("allowedextensions").length > 0) {
					var browser_support = Info.isEdge() || Info.isChrome() || Info.isOpera() || (Info.isFirefox() && Info.firefoxVersion() >= 42) || (Info.isInternetExplorer() && Info.internetExplorerVersion() >= 10);
					if (browser_support)
						custom_accept_string = "." + this.get("allowedextensions").join(",.");
				} else if (!this.get("allowcustomupload")) {
					custom_accept_string = "video/*,video/mp4";
				}
				this.set("has_primary", true);
				this.set("enable_primary_select", false);
				this.set("primary_label", this.string(this.get("primaryrecord") && this.get("allowrecord") ? "record-video" : "upload-video"));
				this.set("secondary_label", this.string(this.get("primaryrecord") ? "upload-video" : "record-video"));
				if (!this.get("allowrecord") || !this.get("primaryrecord") || (Info.isMobile() && (!Info.isAndroid() || !Info.isCordova()))) {
					this.set("enable_primary_select", true);
					this.set("primary_select_capture", Info.isMobile() && this.get("allowrecord") && this.get("primaryrecord"));
					if (Info.isMobile())
						this.set("primary_accept_string", this.get("allowrecord") && this.get("primaryrecord") ? "video/*,video/mp4;capture=camcorder" : "video/*,video/mp4");
					else
						this.set("primary_accept_string", custom_accept_string);
				}
				this.set("has_secondary", this.get("allowrecord") && this.get("allowupload"));
				this.set("enable_secondary_select", false);
				if (this.get("primaryrecord") || (Info.isMobile() && (!Info.isAndroid() || !Info.isCordova()))) {
					this.set("enable_secondary_select", true);
					this.set("secondary_select_capture", Info.isMobile() && !this.get("primaryrecord"));
					if (Info.isMobile())
						this.set("secondary_accept_string", !this.get("primaryrecord") ? "video/*,video/mp4;capture=camcorder" : "video/*,video/mp4");
					else
						this.set("secondary_accept_string", custom_accept_string);
				}
			},
			
			__recordCordova: function () {
				var self = this;
				navigator.device.capture.captureVideo(function (mediaFiles) {
				    var mediaFile = mediaFiles[0];
				    self.trigger("upload", mediaFile);
				}, function (error) {}, {limit:1, duration: this.get("timelimit") });
			},
			
			functions: {
				primary: function () {
					if (this.get("enable_primary_select"))
						return;
					if (Info.isMobile() && Info.isAndroid() && Info.isCordova())
						this.__recordCordova();
					else
						this.trigger("record");
				},
				secondary: function () {
					if (this.get("enable_secondary_select"))
						return;
					if (Info.isMobile() && Info.isAndroid() && Info.isCordova())
						this.__recordCordova();
					else
						this.trigger("record");
				},
				primary_select: function (domEvent) {
					if (!this.get("enable_primary_select"))
						return;
					this.trigger("upload", domEvent[0].target);
				},
				secondary_select: function (domEvent) {
					if (!this.get("enable_secondary_select"))
						return;
					this.trigger("upload", domEvent[0].target);
				}
			}
			
		};
	}).register("ba-videorecorder-chooser")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"record-video": "Record Video",
    	"upload-video": "Upload Video"
    });
});

Scoped.define("module:VideoRecorder.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "base:Timers.Timer"
], [
	"dynamics:Partials.ShowPartial",
	"dynamics:Partials.RepeatPartial"	
], function (Class, Templates, Assets, Timer, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_controlbar,
			
			attrs: {
				"css": "ba-videorecorder",
				"hovermessage": "",
				"recordingindication": true,
				"covershot_accept_string":  "image/*,image/png,image/jpg,image/jpeg"
			},
			
			create: function () {
				this.auto_destroy(new Timer({
					context: this,
					fire: function () {
						this.set("recordingindication", !this.get("recordingindication"));
					},
					delay: 500
				}));
			},
			
			functions: {
				selectCamera: function (cameraId) {
					this.trigger("select-camera", cameraId);
				},
				selectMicrophone: function (microphoneId) {
					this.trigger("select-microphone", microphoneId);
				},
				hover: function (text) {
					this.set("hovermessage", text);
				},
				unhover: function () {
					this.set("hovermessage", "");
				},
				record: function () {
					this.trigger("invoke-record");
				},
				rerecord: function () {
					this.trigger("invoke-rerecord");
				},
				stop: function () {
					this.trigger("invoke-stop");
				},
				skip: function () {
					this.trigger("invoke-skip");
				},
				uploadCovershot: function (domEvent) {
					this.trigger("upload-covershot", domEvent[0].target);
				}
			}
			
		};
	})
	.register("ba-videorecorder-controlbar")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"settings": "Settings",
    	"camerahealthy": "Lighting is good",
    	"cameraunhealthy": "Lighting is not optimal",
    	"microphonehealthy": "Sound is good",
    	"microphoneunhealthy": "Cannot pick up any sound",
    	"record": "Record",
    	"record-tooltip": "Click here to record.",
    	"rerecord": "Redo",
    	"rerecord-tooltip": "Click here to redo.",
    	"upload-covershot": "Upload",
    	"upload-covershot-tooltip": "Click here to upload custom cover shot",
    	"stop": "Stop",
    	"stop-tooltip": "Click here to stop.",
    	"skip": "Skip",
    	"skip-tooltip": "Click here to skip."
    });
});
Scoped.define("module:VideoRecorder.Dynamics.Imagegallery", [
    "dynamics:Dynamic",
    "module:Templates",
    "base:Collections.Collection",
    "base:Properties.Properties",
    "base:Timers.Timer",
    "browser:Dom"
], [
    "dynamics:Partials.StylesPartial"
], function (Class, Templates, Collection, Properties, Timer, Dom, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_imagegallery,
			
			attrs: {
				"css": "ba-videorecorder",
				"imagecount": 3,
				"imagenativewidth": 0,
				"imagenativeheight": 0,
				"containerwidth": 0,
				"containerheight": 0,
				"containeroffset": 0,
				"deltafrac": 1/8
			},
			
			computed: {
				"imagewidth:imagecount,containerwidth,deltafrac": function () {
					if (this.get("imagecount") <= 0)
						return 0.0;
					return this.get("containerwidth") * (1 - this.get("deltafrac")) / this.get("imagecount");
				},
				"imagedelta:imagecount,containerwidth,deltafrac": function () {
					if (this.get("imagecount") <= 1)
						return 0.0;
					return this.get("containerwidth") * (this.get("deltafrac")) / (this.get("imagecount") - 1);
				},
				"imageheight:imagewidth,imagenativewidth,imagenativeheight": function () {
					return this.get("imagenativeheight") * this.get("imagewidth") / this.get("imagenativewidth");
				}
			},
			
			create: function () {
				var images = this.auto_destroy(new Collection());
				this.set("images", images);
				this.snapshotindex = 0;
				this._updateImageCount();
				this.on("change:imagecount", this._updateImageCount, this);
				this.on("change:imagewidth change:imageheight change:imagedelta", this._recomputeImageBoxes, this);
				this.auto_destroy(new Timer({
					context: this,
					delay: 1000,
					fire: function () {
						this.updateContainerSize();
					}
				}));
			},
			
			destroy: function () {
				this.get("images").iterate(function (image) {
					if (image.snapshotDisplay && this.parent().recorder)
						this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
				}, this);
				inherited.destroy.call(this);
			},
			
			_updateImageCount: function () {
				var images = this.get("images");
				var n = this.get("imagecount");
				while (images.count() < n) {
					var image = new Properties({index: images.count()});
					this._recomputeImageBox(image);
					images.add(image);
				}
				while (images.count() > n)
					images.remove(images.getByIndex(images.count() - 1));
			},
			
			_recomputeImageBoxes: function () {
				this.get("images").iterate(function (image) {
					this._recomputeImageBox(image);
				}, this);
			},
			
			_recomputeImageBox: function (image) {
				if (!this.parent().recorder)
					return;
				var i = image.get("index");
				var iw = this.get("imagewidth");
				var ih = this.get("imageheight");
				var id = this.get("imagedelta");
				var h = this.get("containerheight");
				image.set("left", 1+Math.round(i * (iw + id)));
				image.set("top", 1+Math.round((h - ih) / 2));
				image.set("width", 1+Math.round(iw));
				image.set("height", 1+Math.round(ih));
				if (image.snapshot && image.snapshotDisplay) {
					this.parent().recorder.updateSnapshotDisplay(
						image.snapshot,
						image.snapshotDisplay,
						image.get("left") + this.get("containeroffset"),
						image.get("top"),
						image.get("width"),
						image.get("height")
					);
				}
			},
			
			updateContainerSize: function () {
				var container = this.activeElement().querySelector("[data-gallery-container]");
				var offset = Dom.elementOffset(container);
				var dimensions = Dom.elementDimensions(container);
				this.set("containeroffset", offset.left);
				this.set("containerheight", dimensions.height);
				this.set("containerwidth", dimensions.width);
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.apply(this, arguments);
				this.updateContainerSize();
			},
			
			loadImageSnapshot: function (image, snapshotindex) {
				if (image.snapshotDisplay) {
					this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
					image.snapshotDisplay = null;
				}
				var snapshots = this.parent().snapshots;
				image.snapshot = snapshots[((snapshotindex % snapshots.length) + snapshots.length) % snapshots.length]; 
				image.snapshotDisplay = this.parent().recorder.createSnapshotDisplay(
					this.activeElement(),
					image.snapshot,
					image.get("left") + this.get("containeroffset"),
					image.get("top"),
					image.get("width"),
					image.get("height")
				);
			},
			
			loadSnapshots: function () {
				this.get("images").iterate(function (image) {
					this.loadImageSnapshot(image, this.snapshotindex + image.get("index"));
				}, this);
			},
			
			nextSnapshots: function () {
				this.snapshotindex += this.get("imagecount");
				this.loadSnapshots();
			},
			
			prevSnapshots: function () {
				this.snapshotindex -= this.get("imagecount");
				this.loadSnapshots();
			},
			
			functions: {
				left: function () {
					this.prevSnapshots();
				},
				right: function () {
					this.nextSnapshots();
				},
				select: function (image) {
					this.trigger("image-selected", image.snapshot);
				}
			}
			
		};
	}).register("ba-videorecorder-imagegallery");
});
Scoped.define("module:VideoRecorder.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates",
		"module:Assets"
], [
	"dynamics:Partials.ShowPartial"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_loader,
			
			attrs: {
				"css": "ba-videorecorder",
				"tooltip": "",
				"label": "",
				"message": "",
				"hovermessage": ""
			}
			
		};
	}).register("ba-videorecorder-loader")
    .attachStringTable(Assets.strings)
    .addStrings({
    });
});
Scoped.define("module:VideoRecorder.Dynamics.Message", [
    "dynamics:Dynamic",
    "module:Templates"
], [
    "dynamics:Partials.ClickPartial"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_message,
			
			attrs: {
				"css": "ba-videorecorder",
				"message": ''
			},
			
			functions: {
				
				click: function () {
					this.trigger("click");
				}
				
			}
			
		};
	}).register("ba-videorecorder-message");
});

Scoped.define("module:VideoRecorder.Dynamics.Recorder", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info",
    "browser:Dom",
    "browser:Upload.MultiUploader",
    "browser:Upload.FileUploader",
    "media:Recorder.VideoRecorderWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "base:Collections.Collection",
    "base:Promise",
    "module:VideoRecorder.Dynamics.RecorderStates.Initial",
    "module:VideoRecorder.Dynamics.RecorderStates"
], [
    "module:VideoRecorder.Dynamics.Imagegallery",
    "module:VideoRecorder.Dynamics.Loader",
    "module:VideoRecorder.Dynamics.Controlbar",
    "module:VideoRecorder.Dynamics.Message",
    "module:VideoRecorder.Dynamics.Topmessage",
    "module:VideoRecorder.Dynamics.Chooser",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.DataPartial",
    "dynamics:Partials.AttrsPartial",
    "dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, Dom, MultiUploader, FileUploader, VideoRecorderWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Collection, Promise, InitialState, RecorderStates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.recorder,
			
			attrs: {
				/* CSS */
				"css": "ba-videorecorder",
				"iecss": "ba-videorecorder",
				"cssimagegallery": "",
				"cssloader": "",
				"csscontrolbar": "",
				"cssmessage": "",
				"csstopmessage": "",
				"csschooser": "",
				"width": "",
				"height": "",
				"gallerysnapshots": 3,

				/* Themes */
				"theme": "",
        "themecolor": "",
				"csstheme": "",

				/* Dynamics */
				"dynimagegallery": "videorecorder-imagegallery",
				"dynloader": "videorecorder-loader",
				"dyncontrolbar": "videorecorder-controlbar",
				"dynmessage": "videorecorder-message",
				"dyntopmessage": "videorecorder-topmessage",
				"dynchooser": "videorecorder-chooser",
				"dynvideoplayer": "videoplayer",

				/* Templates */
				"tmplimagegallery": "",
				"tmplloader": "",
				"tmplcontrolbar": "",
				"tmplmessage": "",
				"tmpltopmessage": "",
				"tmplchooser": "",

				/* Attributes */
				"autorecord": false,
				"autoplay": false,
				"allowrecord": true,
				"allowupload": true,
				"allowcustomupload": true,
				"primaryrecord": true,
				"nofullscreen": false,
				"recordingwidth": 640,
				"recordingheight": 480,
				"countdown": 3,
				"snapshotmax": 15,
				"framerate": null,
				"audiobitrate": null,
				"videobitrate": null,
				"snapshottype": "jpg",
				"picksnapshots": true,
				"playbacksource": "",
				"playbackposter": "",
				"recordermode": true,
				"skipinitial": false,
				"timelimit": null,
				"timeminlimit": null,
				"rtmpstreamtype": "mp4",
				"rtmpmicrophonecodec": "speex",
				"webrtcstreaming": false,
				"microphone-volume": 1.0,
				"flip-camera": false,
				"early-rerecord": false,
				"custom-covershots": false,
				"manualsubmit": false,
				"allowedextensions": null,
				"filesizelimit": null,

				/* Configuration */
				"forceflash": false,
				"simulate": false,
				"noflash": false,
				"noaudio": false,
				"flashincognitosupport": false,
				"localplayback": false,
				"uploadoptions": {},
				"playerattrs": {},

				/* Options */
				"rerecordable": true,
				"recordings": null,
				"ready": true,
				"stretch": false
			},
			
			scopes: {
				player: ">[id='player']"
			},

			types: {
				"forceflash": "boolean",
				"noflash": "boolean",
				"rerecordable": "boolean",
				"ready": "boolean",
				"stretch": "boolean",
				"autorecord": "boolean",
				"autoplay": "boolean",
				"allowrecord": "boolean",
				"allowupload": "boolean",
				"allowcustomupload": "boolean",
				"primaryrecord": "boolean",
				"flashincognitosupport": "boolean",
				"recordermode": "boolean",
				"nofullscreen": "boolean",
				"picksnapshots": "boolean",
				"localplayback": "boolean",
				"noaudio": "boolean",
				"skipinitial": "boolean",
				"webrtcstreaming": "boolean",
				"microphone-volume": "float",
				"audiobitrate": "int",
				"videobitrate": "int",
				"flip-camera": "boolean",
				"early-rerecord": "boolean",
				"custom-covershots": "boolean",
				"manualsubmit": "boolean",
				"simulate": "boolean",
				"allowedextensions": "array",
        "themecolor": "string"
			},
			
			extendables: ["states"],
			
			remove_on_destroy: true,
			
			create: function () {
				
				if (this.get("theme") in Assets.recorderthemes) {
					Objs.iter(Assets.recorderthemes[this.get("theme")], function (value, key) {
						if (!this.isArgumentAttr(key))
							this.set(key, value);
					}, this);
				}
				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("hideoverlay", false);
				
				if (Info.isMobile())
					this.set("skipinitial", false);

        if(!this.get("themecolor"))
          this.set("themecolor", "default");

				this.__attachRequested = false;
				this.__activated = false;
				this._bound = false;
				this.__recording = false;
				this.__error = null;
				this.__currentStretch = null;
				
				this.on("change:stretch", function () {
					this._updateStretch();
				}, this);
				this.host = new Host({
					stateRegistry: new ClassRegistry(this.cls.recorderStates())
				});
				this.host.dynamic = this;
				this.host.initialize(InitialState);
				
				this._timer = new Timers.Timer({
					context: this,
					fire: this._timerFire,
					delay: 250,
					start: true
				});
				
				this.__cameraResponsive = true;
				this.__cameraSignal = true;
				
			},
			
			state: function () {
				return this.host.state();
			},
			
			recorderAttached: function () {
				return !!this.recorder;
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
			
			_detachRecorder: function () {
				if (this.recorder)
					this.recorder.weakDestroy();
				this.recorder = null;
				this.set("hasrecorder", false);
			},
			
			_attachRecorder: function () {
				if (this.recorderAttached())
					return;
				if (!this.__activated) {
					this.__attachRequested = true;
					return;
				}
				this.set("hasrecorder", true);
				this.snapshots = [];
				this.__attachRequested = false;
				var video = this.activeElement().querySelector("[data-video='video']");
				this._clearError();
				this.recorder = VideoRecorderWrapper.create({
					element: video,
					simulate: this.get("simulate"),
			    	forceflash: this.get("forceflash"),
			    	noflash: this.get("noflash"),
			    	recordVideo: true,
			    	recordAudio: !this.get("noaudio"),
			    	recordingWidth: this.get("recordingwidth"),
			    	recordingHeight: this.get("recordingheight"),
			    	audioBitrate: this.get("audiobitrate"),
			    	videoBitrate: this.get("videobitrate"),
			    	flashFullSecurityDialog: !this.get("flashincognitosupport"),
			    	rtmpStreamType: this.get("rtmpstreamtype"),
			    	rtmpMicrophoneCodec: this.get("rtmpmicrophonecodec"),
			    	webrtcStreaming: !!this.get("webrtcstreaming"),
			    	framerate: this.get("framerate"),
			    	flip: this.get("flip-camera")
			    });
				if (!this.recorder)
					this._error("attach");
			},
			
			_bindMedia: function () {
				if (this._bound || !this.recorderAttached() || !this.recorder)
					return;
				this.recorder.ready.success(function () {
					this.recorder.on("require_display", function () {
						this.set("hideoverlay", true);
					}, this);
					this.recorder.bindMedia().error(function (e) {
						this.trigger("access_forbidden", e);
						this.set("hideoverlay", false);
						this.off("require_display", null, this);
						this._error("bind", e);
					}, this).success(function () {
						this.trigger("access_granted");
						this.recorder.setVolumeGain(this.get("microphone-volume"));
						this.set("hideoverlay", false);
						this.off("require_display", null, this);
						this.recorder.enumerateDevices().success(function (devices) {
							var selected = this.recorder.currentDevices();
							this.set("selectedcamera", selected.video);
							this.set("selectedmicrophone", selected.audio);
							this.set("cameras", new Collection(Objs.values(devices.video)));
							this.set("microphones", new Collection(Objs.values(devices.audio)));
						}, this);
						if (!this.get("noaudio"))
							this.recorder.testSoundLevel(true);
						this.set("devicetesting", true);
						this._updateStretch();
						while (this.snapshots.length > 0) {
							var snapshot = this.snapshots.unshift();
							this.recorder.removeSnapshot(snapshot);
						}
						this._bound = true;
						this.trigger("bound");
					}, this);
				}, this);
			},
			
			isFlash: function () {
				return this.recorder && this.recorder.isFlash();
			},
			
			_initializeUploader: function () {
				if (this._dataUploader)
					this._dataUploader.weakDestroy();
				this._dataUploader = new MultiUploader();
			},
			
			_unbindMedia: function () {
				if (!this._bound)
					return;
				this.recorder.unbindMedia();
				this._bound = false;
			},
			
			_uploadCovershot: function (image) {
				if (this.get("simulate"))
					return;
				this.__lastCovershotUpload = image;
				var uploader = this.recorder.createSnapshotUploader(image, this.get("snapshottype"), this.get("uploadoptions").image);
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},
			
			_uploadCovershotFile: function (file) {
				if (this.get("simulate"))
					return;
				this.__lastCovershotUpload = file;
				var uploader = FileUploader.create(Objs.extend({ source: file }, this.get("uploadoptions").image));
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},

			_uploadVideoFile: function (file) {
				if (this.get("simulate"))
					return;
				var uploader = FileUploader.create(Objs.extend({ source: file }, this.get("uploadoptions").video));
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},
			
			_prepareRecording: function () {
				return Promise.create(true);
			},
			
			_startRecording: function () {
				if (this.__recording)
					return Promise.error(true);
				if (!this.get("noaudio"))
					this.recorder.testSoundLevel(false);
				this.set("devicetesting", false);
				return this.recorder.startRecord({
					rtmp: this.get("uploadoptions").rtmp,
					video: this.get("uploadoptions").video,
					audio: this.get("uploadoptions").audio,
					webrtcStreaming: this.get("uploadoptions").webrtcStreaming
				}).success(function () {
					this.__recording = true;
					this.__recording_start_time = Time.now();
				}, this);
			},
			
			_stopRecording: function () {
				if (!this.__recording)
					return Promise.error(true);
				return this.recorder.stopRecord({
					rtmp: this.get("uploadoptions").rtmp,
					video: this.get("uploadoptions").video,
					audio: this.get("uploadoptions").audio,
					webrtcStreaming: this.get("uploadoptions").webrtcStreaming
				}).success(function (uploader) {
					this.__recording = false;
					uploader.upload();
					this._dataUploader.addUploader(uploader);
				}, this);
			},
			
			_verifyRecording: function () {
				return Promise.create(true);
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.call(this, element);
				this.__activated = true;
				if (this.__attachRequested)
					this._attachRecorder();
			},
			
			_showBackgroundSnapshot: function () {
				this._hideBackgroundSnapshot();
				this.__backgroundSnapshot = this.recorder.createSnapshot(this.get("snapshottype"));
				var el = this.activeElement().querySelector("[data-video]");
				var dimensions = Dom.elementDimensions(el);
				this.__backgroundSnapshotDisplay = this.recorder.createSnapshotDisplay(el, this.__backgroundSnapshot, 0, 0, dimensions.width, dimensions.height);
			},
			
			_hideBackgroundSnapshot: function () {
				if (this.__backgroundSnapshotDisplay)
					this.recorder.removeSnapshotDisplay(this.__backgroundSnapshotDisplay);
				delete this.__backgroundSnapshotDisplay;
				if (this.__backgroundSnapshot)
					this.recorder.removeSnapshot(this.__backgroundSnapshot);
				delete this.__backgroundSnapshot;
			},
			
			object_functions: ["record", "rerecord", "stop", "play", "pause", "reset"],

			functions: {
				
				record: function () {
					this.host.state().record();
				},
				
				record_video: function () {
					this.host.state().selectRecord();
				},
				
				upload_video: function (file) {
					this.host.state().selectUpload(file);
				},
				
				upload_covershot: function (file) {
					this.host.state().uploadCovershot(file);
				},

				select_camera: function (camera_id) {
					if (this.recorder) {
						this.recorder.setCurrentDevices({video: camera_id});
						this.set("selectedcamera", camera_id);
					}
				},
				
				select_microphone: function (microphone_id) {
					if (this.recorder) {
						this.recorder.setCurrentDevices({audio: microphone_id});
						this.recorder.testSoundLevel(true);
						this.set("selectedmicrophone", microphone_id);
					}
					this.set("microphonehealthy", false);
				},
				
				invoke_skip: function () {
					this.trigger("invoke-skip");
				},
				
				select_image: function (image) {
					this.trigger("select-image", image);
				},
				
				rerecord: function () {
					if (confirm(this.string("rerecord-confirm")))
						this.host.state().rerecord();
				},

				stop: function () {
					this.host.state().stop();
				},
				
				play: function () {
					this.host.state().play();
				},

				pause: function () {
					this.host.state().pause();
				},
				
				message_click: function () {
					this.trigger("message-click");
				},
				
				playing: function () {
					this.trigger("playing");
				},
				
				paused: function () {
					this.trigger("paused");
				},
				
				ended: function () {
					this.trigger("ended");
				},
				
				reset: function () {
					this._stopRecording().callback(function () {
						this._detachRecorder();
						this.host.state().next("Initial");
					}, this);
				},
				
				manual_submit: function () {
					this.set("rerecordable", false);
					this.set("manualsubmit", false);
					this.trigger("manually_submitted");
				}
						
			},
			
			destroy: function () {				
				this._timer.destroy();
				this.host.destroy();
				this._detachRecorder();
				inherited.destroy.call(this);
			},
			
			deltaCoefficient: function () {
				return this.recorderAttached() ? this.recorder.deltaCoefficient() : null;
			},

			blankLevel: function () {
				return this.recorderAttached() ? this.recorder.blankLevel() : null;
			},

			lightLevel: function () {
				return this.recorderAttached() ? this.recorder.lightLevel() : null;
			},
			
			soundLevel: function () {
				return this.recorderAttached() ? this.recorder.soundLevel() : null;
			},
			
			_timerFire: function () {
				if (this.destroyed())
					return;
				try {
					if (this.recorderAttached() && this.get("devicetesting")) {
						var lightLevel = this.lightLevel();
						this.set("camerahealthy", lightLevel >= 100 && lightLevel <= 200);
						if (!this.get("noaudio") && !this.get("microphonehealthy") && this.soundLevel() >= 1.01) {
							this.set("microphonehealthy", true);
							this.recorder.testSoundLevel(false);
						}
					}
				} catch (e) {}
				
				if (this.__recording && this.__recording_start_time + 500 < Time.now()) {
					var p = this.snapshots.length < this.get("snapshotmax") ? 0.25 : 0.05;
					if (Math.random() <= p) {
						var snap = this.recorder.createSnapshot(this.get("snapshottype"));
						if (snap) {
							if (this.snapshots.length < this.get("snapshotmax")) {
								this.snapshots.push(snap);
							} else {
								var i = Math.floor(Math.random() * this.get("snapshotmax"));
								this.recorder.removeSnapshot(this.snapshots[i]);
								this.snapshots[i] = snap;
							}
						}
					}
				}
				
				try {
					if (this.recorderAttached() && this._timer.fire_count() % 20 === 0 && this._accessing_camera) {
						var signal = this.blankLevel() >= 0.01;
						if (signal !== this.__cameraSignal) {
							this.__cameraSignal = signal;
							this.trigger(signal ? "camera_signal" : "camera_nosignal");
						}
					}
					if (this.recorderAttached() && this._timer.fire_count() % 20 === 10 && this._accessing_camera) {
						var delta = this.recorder.deltaCoefficient(); 
						var responsive = delta === null || delta >= 0.5;
						if (responsive !== this.__cameraResponsive) {
							this.__cameraResponsive = responsive;
							this.trigger(responsive ? "camera_responsive" : "camera_unresponsive");
						}
					}
				} catch (e) {}
				
				this._updateStretch();
				this._updateCSSSize();
			},
			
			_updateCSSSize: function () {
				var width = Dom.elementDimensions(this.activeElement()).width;
				this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
			},
			
			videoHeight: function () {
				return this.recorderAttached() ? this.recorder.cameraHeight() : NaN;
			},
			
			videoWidth: function () {
				return this.recorderAttached() ? this.recorder.cameraWidth() : NaN;
			},
			
			aspectRatio: function () {
				return this.videoWidth() / this.videoHeight();
			},
			
			parentWidth: function () {
				return this.get("width") || Dom.elementDimensions(this.activeElement()).width;
			},
			
			parentHeight: function () {
				return this.get("height") || Dom.elementDimensions(this.activeElement()).height;
			},

			parentAspectRatio: function () {
				return this.parentWidth() / this.parentHeight();
			},
			
			averageFrameRate: function () {
				return this.recorderAttached() ? this.recorder.averageFrameRate() : null;
			},
			
			_updateStretch: function () {
				var newStretch = null;
				if (this.get("stretch")) {
					var ar = this.aspectRatio();
					if (isFinite(ar)) {
						var par = this.parentAspectRatio();
						if (isFinite(par)) {
							if (par > ar)
								newStretch = "height";
							if (par < ar)
								newStretch = "width";
						} else if (par === Infinity)
							newStretch = "height";
					}
				}
				if (this.__currentStretch !== newStretch) {
					if (this.__currentStretch)
						Dom.elementRemoveClass(this.activeElement(), this.get("css") + "-stretch-" + this.__currentStretch);
					if (newStretch)
						Dom.elementAddClass(this.activeElement(), this.get("css") + "-stretch-" + newStretch);
				}
				this.__currentStretch = newStretch;				
			}
			
		};
	}, {
		
		recorderStates: function () {
			return [RecorderStates];
		}
		
	}).register("ba-videorecorder")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"recorder-error": "An error occurred, please try again later. Click to retry.",
    	"attach-error": "We could not access the camera interface. Depending on the device and browser, you might need to install Flash or access the page via SSL.",
    	"access-forbidden": "Access to the camera was forbidden. Click to retry.",
    	"pick-covershot": "Pick a covershot.",
    	"uploading": "Uploading",
    	"uploading-failed": "Uploading failed - click here to retry.",
    	"verifying": "Verifying",
    	"verifying-failed": "Verifying failed - click here to retry.",
    	"rerecord-confirm": "Do you really want to redo your video?",
    	"video_file_too_large": "Your video file is too large (%s) - click here to try again with a smaller video file.",
    	"unsupported_video_type": "Please upload: %s - click here to retry."    		
    });
});
Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function (State, ListenMixin, Objs, scoped) {
	return State.extend({scoped: scoped}, [ListenMixin, {

		dynamics: [],
	
		_start: function () {
			this.dyn = this.host.dynamic;
			Objs.iter(Objs.extend({
				"message": false,
				"chooser": false,
				"topmessage": false,
				"controlbar": false,
				"loader": false,
				"imagegallery": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
			this.dyn.set("playertopmessage", "");
			this.dyn._accessing_camera = false;
			this._started();
		},
		
		_started: function () {},
		
		record: function () {
			this.dyn.set("autorecord", true);
		},
		
		stop: function () {
			this.dyn.scopes.player.execute('stop');
		},
		
		play: function () {
			this.dyn.scopes.player.execute('play');
		},
		
		pause: function () {
			this.dyn.scopes.player.execute('pause');
		},		
		
		rerecord: function () {},
		
		selectRecord: function () {},
		
		selectUpload: function (file) {},
		
		uploadCovershot: function (file) {}
	
	}]);
});



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.FatalError", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"browser:Info",
	"base:Timers.Timer"
], function (State, Info, Timer, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		_locals: ["message", "retry", "flashtest"],

		_started: function () {
			this.dyn.set("message", this._message || this.dyn.string("recorder-error"));
			this.listenOn(this.dyn, "message-click", function () {
				if (this._retry)
					this.next(this._retry);
			});
			if (this._flashtest && !Info.isMobile() && Info.flash().supported() && !Info.flash().installed()) {
				this.auto_destroy(new Timer({
					delay: 500,
					context: this,
					fire: function () {
						if (Info.flash(true).installed())
							this.next(this._retry);
					}
				}));
				if (Info.isSafari() && Info.safariVersion() >= 10)
					document.location.href = "//get.adobe.com/flashplayer";
			}
		}

	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Initial", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		_started: function () {
			this.dyn.set("player_active", false);
			this.dyn._initializeUploader();
			if (!this.dyn.get("recordermode"))
				this.next("Player");
			else if (this.dyn.get("autorecord") || this.dyn.get("skipinitial"))
				this.eventualNext("CameraAccess");
			else
				this.next("Chooser");
		}
	
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Player", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		rerecord: function () {
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		_started: function () {
			this.dyn.set("player_active", true);
		},
		
		_end: function () {
			this.dyn.set("player_active", false);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Chooser", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Strings",
	"browser:Info"
], function (State, Strings, Info, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["chooser"],
		
		record: function () {
			this.dyn.set("autorecord", true);
			this.selectRecord();
		},
		
		selectRecord: function () {
			this.next("CameraAccess");
		},
		
		selectUpload: function (file) {
			if (!(Info.isMobile() && Info.isAndroid() && Info.isCordova())) {
				if (this.dyn.get("allowedextensions")) {
					var filename = (file.files[0].name || "").toLowerCase();
					var found = false;
					this.dyn.get("allowedextensions").forEach(function (extension) {
						if (Strings.ends_with(filename, "." + extension.toLowerCase()))
							found = true;
					}, this);
					if (!found) {
						this.next("FatalError", {
							message: this.dyn.string("unsupported_video_type").replace("%s", this.dyn.get("allowedextensions").join(" / ")),
							retry: "Chooser"
						});
						return;
					}
				}
				if (this.dyn.get("filesizelimit") && file.files && file.files.length > 0 && file.files[0].size && file.files[0].size > this.dyn.get("filesizelimit")) {
					var fact = "KB";
					var size = Math.round(file.files[0].size / 1000);
					var limit = Math.round(this.dyn.get("filesizelimit") / 1000);
					if (size > 999) {
						fact = "MB";
						size = Math.round(size / 1000);
						limit = Math.round(limit / 1000);
					}
					this.next("FatalError", {
						message: this.dyn.string("video_file_too_large").replace("%s", size + fact + " / " + limit + fact),
						retry: "Chooser"
					});
					return;
				}
			}
			this._uploadFile(file);
		},
		
		_uploadFile: function (file) {
			this.dyn.set("creation-type", Info.isMobile() ? "mobile" : "upload");
			this.dyn._prepareRecording().success(function () {
				this.dyn.trigger("upload_selected", file);
				this.dyn._uploadVideoFile(file);
				this.next("Uploading");
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "Chooser" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraAccess", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer"
], function (State, Timer, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],
		
		_started: function () {
			this.dyn.set("settingsvisible", true);
			this.dyn.set("recordvisible", true);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
			this.listenOn(this.dyn, "bound", function () {
				this.dyn.set("creation-type", this.dyn.isFlash() ? "flash" : "webrtc");
				var timer = this.auto_destroy(new Timer({
					start: true,
					delay: 100,
					context: this,
					fire: function () {
						if (this.dyn.recorder.blankLevel() >= 0.01 && this.dyn.recorder.deltaCoefficient() >= 0.01) {
							timer.stop();
							this.next("CameraHasAccess");
						}
					}
				}));
			}, this);
			this.listenOn(this.dyn, "error", function (s) {
				this.next("FatalError", { message: this.dyn.string("attach-error"), retry: "Initial", flashtest: true });
			}, this);
			this.listenOn(this.dyn, "access_forbidden", function () {
				this.next("FatalError", { message: this.dyn.string("access-forbidden"), retry: "Initial" });
			}, this);
			this.dyn._attachRecorder();
			if (this.dyn)
				this.dyn._bindMedia();
		}
				
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraHasAccess", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["topmessage", "controlbar"],
		
		_started: function () {
			this.dyn.set("settingsvisible", true);
			this.dyn.set("recordvisible", true);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
			if (this.dyn.get("autorecord"))
				this.next("RecordPrepare");
		},
		
		record: function () {
			if (!this.dyn.get("autorecord"))
				this.next("RecordPrepare");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RecordPrepare", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer",
	"base:Time"
], function (State, Timer, Time, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],
		
		_started: function () {
			this.dyn._accessing_camera = true;
			this._promise = this.dyn._prepareRecording();
			this.dyn.set("message", "");
			if (this.dyn.get("countdown")) {
				this.dyn.set("loaderlabel", this.dyn.get("countdown"));
				var endTime = Time.now() + this.dyn.get("countdown") * 1000;
				var timer = new Timer({
					context: this,
					delay: 100,
					fire: function () {
						var time_left = Math.max(0, endTime - Time.now());
						this.dyn.set("loaderlabel", "" + Math.round(time_left / 1000));
						this.dyn.trigger("countdown", time_left);
						if (endTime <= Time.now()) {
							this.dyn.set("loaderlabel", "");
							timer.stop();
							this._startRecording();
						}
					}
				});				
				this.auto_destroy(timer);
			} else
				this._startRecording();
		},
		
		record: function () {
			this._startRecording();
		},

		_startRecording: function () {
			this._promise.success(function () {
				this.dyn._startRecording().success(function () {
					this.next("Recording");
				}, this).error(function (s) {
					this.next("FatalError", { message: s, retry: "CameraAccess" });
				}, this);
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "CameraAccess" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Recording", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer",
	"base:Time",
	"base:TimeFormat",
	"base:Async"
], function (State, Timer, Time, TimeFormat, Async, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["topmessage", "controlbar"],
		
		_started: function () {
			this.dyn._accessing_camera = true;
			this.dyn.trigger("recording");
			this.dyn.set("settingsvisible", false);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("recordvisible", false);
			this.dyn.set("stopvisible", true);
			this.dyn.set("skipvisible", false);
			this._startTime = Time.now();
			this._stopping = false;
			this._timer = this.auto_destroy(new Timer({
				immediate: true,
				delay: 10,
				context: this,
				fire: this._timerFire
			}));
		},
		
		_timerFire: function () {
			var limit = this.dyn.get("timelimit");
			var current = Time.now();
			var display = Math.max(0, limit ? (this._startTime + limit * 1000 - current) : (current - this._startTime));
			this.dyn.trigger("recording_progress", current - this._startTime);
			this.dyn.set("controlbarlabel", TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, display));
			if (limit && this._startTime + limit * 1000 <= current) {
				this._timer.stop();
				this.stop();
			}
		},
		
		stop: function () {
			var minlimit = this.dyn.get("timeminlimit");
			if (minlimit) {
				var delta = Time.now() - this._startTime;
				if (delta < minlimit) {
					var limit = this.dyn.get("timelimit");
					if (!limit || limit > delta)
						return;
				}
			}
			if (this._stopping)
				return;
			this.dyn.set("loader_active", true);
            this.dyn.set("controlbar_active", false);
            this.dyn.set("topmessage_active", false);
			this._stopping = true;
			Async.eventually(function () {
                this.dyn._stopRecording().success(function () {
                    this._hasStopped();
                    if (this.dyn.get("picksnapshots") && this.dyn.snapshots.length >= this.dyn.get("gallerysnapshots"))
                        this.next("CovershotSelection");
                    else
                        this.next("Uploading");
                }, this).error(function (s) {
                    this.next("FatalError", { message: s, retry: "CameraAccess" });
                }, this);
			}, this);
		},
		
		_hasStopped: function () {
			this.dyn.set("duration", Time.now() - this._startTime);
			this.dyn._showBackgroundSnapshot();
			this.dyn._unbindMedia();
			this.dyn.trigger("recording_stopped");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CovershotSelection", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["imagegallery", "topmessage", "controlbar"],
		
		_started: function () {
			this.dyn.set("settingsvisible", false);
			this.dyn.set("recordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", true);
			this.dyn.set("controlbarlabel", "");
			this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
			this.dyn.set("uploadcovershotvisible", this.dyn.get("custom-covershots"));
			this.dyn.set("topmessage", this.dyn.string('pick-covershot'));
			var imagegallery = this.dyn.scope(">[tagname='ba-videorecorder-imagegallery']").materialize(true);
			imagegallery.loadSnapshots();
			imagegallery.updateContainerSize();
			this.listenOn(this.dyn, "invoke-skip", function () {
				this._nextUploading(true);
			}, this);
			this.listenOn(this.dyn, "select-image", function (image) {
				this.dyn._uploadCovershot(image);
				this._nextUploading(false);
			}, this);
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		uploadCovershot: function (file) {
			this.dyn._uploadCovershotFile(file);
			this._nextUploading(false);
		},
		
		_nextUploading: function (skippedCovershot) {
			this.next("Uploading");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Uploading", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Time",
	"base:Async"
], function (State, Time, Async, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader", "message"],
		
		_started: function () {
			this.dyn.trigger("uploading");
			this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
			if (this.dyn.get("early-rerecord"))
				this.dyn.set("controlbar_active", true);
			this.dyn.set("topmessage", "");
			this.dyn.set("message", this.dyn.string("uploading"));
			this.dyn.set("playertopmessage", this.dyn.get("message"));
			var uploader = this.dyn._dataUploader;
			this.listenOn(uploader, "success", function () {
				Async.eventually(function () {
                    this._finished();
                    this.next("Verifying");
				}, this);
			});
			this.listenOn(uploader, "error", function () {
				this.dyn.set("player_active", false);
				this.next("FatalError", {
					message: this.dyn.string("uploading-failed"),
					retry: this.dyn.recorderAttached() ? "Uploading" : "Initial"
				});
			});
			this.listenOn(uploader, "progress", function (uploaded, total) {
				this.dyn.trigger("upload_progress", uploaded, total);
				if (total !== 0) {
					this.dyn.set("message", this.dyn.string("uploading") + ": " + Math.min(100, Math.round(uploaded / total * 100)) + "%");
					this.dyn.set("playertopmessage", this.dyn.get("message"));
				}
			});
			if (this.dyn.get("localplayback") && this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) {
				this.dyn.set("playbacksource", this.dyn.recorder.localPlaybackSource());
				if (this.dyn.__lastCovershotUpload)
					this.dyn.set("playbackposter", this.dyn.recorder.snapshotToLocalPoster(this.dyn.__lastCovershotUpload));
				this.dyn.set("loader_active", false);
				this.dyn.set("message_active", false);
				this.dyn._hideBackgroundSnapshot();
				this.dyn.set("player_active", true);
			}
			this.dyn.set("start-upload-time", Time.now());
			uploader.reset();
			uploader.upload();
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		_finished: function () {
			this.dyn.trigger("uploaded");
			this.dyn.set("end-upload-time", Time.now());			
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Verifying", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader", "message"],
		
		_started: function () {
			this.dyn.trigger("verifying");
			this.dyn.set("message", this.dyn.string("verifying") + "...");
			this.dyn.set("playertopmessage", this.dyn.get("message"));
			if (this.dyn.get("localplayback") && this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) {
				this.dyn.set("loader_active", false);
				this.dyn.set("message_active", false);
			} else {
				this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
				if (this.dyn.get("early-rerecord"))
					this.dyn.set("controlbar_active", true);
			}
			this.dyn._verifyRecording().success(function () {
				this.dyn.trigger("verified");
				this.dyn._hideBackgroundSnapshot();
				this.dyn._detachRecorder();
				if (this.dyn.get("recordings"))
					this.dyn.set("recordings", this.dyn.get("recordings") - 1);
                this.dyn.set("message", "");
                this.dyn.set("playertopmessage", "");
				this.next("Player");
			}, this).error(function () {
				this.dyn.set("player_active", false);
				this.next("FatalError", {
					message: this.dyn.string("verifying-failed"),
					retry: this.dyn.recorderAttached() ? "Verifying" : "Initial"
				});
			}, this);
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		}
		
	});
});
Scoped.define("module:VideoRecorder.Dynamics.Topmessage", [
    "dynamics:Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_topmessage,
			
			attrs: {
				"css": "ba-videorecorder",
				"topmessage": ''
			}
			
		};
	}).register("ba-videorecorder-topmessage");
});
}).call(Scoped);