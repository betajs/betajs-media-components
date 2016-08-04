/*!
betajs-dynamics - v0.0.61 - 2016-07-24
Copyright (c) Victor Lingenthal,Oliver Friedmann
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.Dynamics');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('browser', 'global:BetaJS.Browser');
Scoped.binding('jquery', 'global:jQuery');
Scoped.define("module:", function () {
	return {
    "guid": "d71ebf84-e555-4e9b-b18a-11d74fdcefe2",
    "version": "259.1469413006683"
};
});
Scoped.assumeVersion('base:version', 502);
Scoped.assumeVersion('browser:version', 78);
Scoped.define("module:Data.Mesh", [
	    "base:Class",
	    "base:Events.EventsMixin",
	    "base:Properties.Properties",
	    "base:Objs",
	    "base:Types",
	    "base:Strings",
	    "base:Ids",
	    "base:Functions"
	], function (Class, EventsMixin, Properties, Objs, Types, Strings, Ids, Functions, scoped) {
	return Class.extend({scoped: scoped}, [EventsMixin, function (inherited) {
		return {

			constructor: function (environment, context, defaults) {
				inherited.constructor.call(this);
				this.__environment = environment;
				this.__defaults = defaults;
				this.__context = context;
				this.__watchers = {};
			},
			
			destroy: function () {
				Objs.iter(this.__watchers, function (watcher) {
					this.__destroyWatcher(watcher);
				}, this);
				inherited.destroy.call(this);
			},
			
			watch: function (expressions, callback, context) {
				Objs.iter(expressions, function (expression) {
					var watcher = this.__createWatcher(expression);
					watcher.cbs[Ids.objectId(context)] = {
						callback: callback,
						context: context
					};
				}, this);
			},
			
			unwatch: function (expressions, context) {
				Objs.iter(expressions, function (expression) {
					var watcher = this.__createWatcher(expression, true);
					if (watcher) {
						delete watcher.cbs[Ids.objectId(context)];
						this.__destroyWatcher(watcher, true);
					}
				}, this);
			},						
			
			__destroyWatcher: function (watcher, weak) {
				if (Types.is_string(watcher))
					watcher = this.__watchers[watcher];
				if (!watcher || (weak && !(Types.is_empty(watcher.cbs) && Types.is_empty(watcher.children))))
					return;
				Objs.iter(watcher.children, this.__destroyWatcher, this);
				this.__unbindWatcher(watcher);
				if (watcher.parent)
					delete watcher.parent.children[watcher.key];
				delete this.__watchers[watcher.expression];
				if (watcher.parent && Types.is_empty(watcher.parent.cbs) && Types.is_empty(watcher.parent.children))
					this.__destroyWatcher(watcher.parent);
			},
			
			__createWatcher: function (expression, weak) {
				var watcher = this.__watchers[expression];
				if (watcher || weak)
					return watcher;
				var split = Strings.splitLast(expression, ".");
				var parent = split.head ? this.__createWatcher(split.head) : null;
				watcher = {
					cbs: {},
					parent: parent,
					key: split.tail,
					expression: expression,
					children: {},
					properties: null,
					propertiesPrefix: null
				};
				if (parent)
					parent.children[split.tail] = watcher;
				this.__watchers[expression] = watcher;
				this.__bindWatcher(watcher);
				return watcher;
			},
			
			__unbindWatcher: function (watcher) {
				if (watcher.properties)
					watcher.properties.off(null, null, watcher);
				Objs.iter(watcher.children, this.__unbindWatcher, this);
			},
			
			__bindWatcher: function (watcher) {
				var n = null;
				for (var i = this.__environment.length - 1; i >= 0; --i) {
					var scope = this.__environment[i];
					n = this._navigate(scope, watcher.expression);
					if (n.properties && !n.tail)
						break;
					n = null;
				}
				if (n === null) {
					var defScope = this.__defaults.watch || this.__environment[0];
					n = this._navigate(defScope, watcher.expression);
					if (!n.properties && Properties.is_instance_of(defScope))
						n.properties = defScope;
					if (!n.properties)
						n = null;
				}
				if (n === null)
					return;
				watcher.properties = n.properties;
				var exp = n.head + (n.head && n.tail ? "." : "") + n.tail;
				watcher.propertiesPrefix = exp;
				watcher.properties.on("change:" + watcher.propertiesPrefix, function (value, oldValue, force) {
					Objs.iter(watcher.children, this.__unbindWatcher, this);
					Objs.iter(watcher.children, this.__bindWatcher, this);
					if (watcher.value != value || force) {
						watcher.value = value;
						Objs.iter(watcher.cbs, function (cb) {
							cb.callback.apply(cb.context);
						}, this);
					}
				}, this);
				var value = watcher.properties.get(exp);
				if (value != watcher.value) {
					watcher.value = value;
					Objs.iter(watcher.cbs, function (cb) {
						cb.callback.apply(cb.context);
					}, this);
				}
				Objs.iter(watcher.children, this.__bindWatcher, this);
			},
			
			read: function (expression) {
				for (var i = this.__environment.length - 1; i >=0; --i) {
					var ret = this._read(this.__environment[i], expression);
					if (ret) {
						if (Types.is_function(ret.value))
							return Functions.as_method(ret.value, ret.context);
						return ret.value;
					}
				}
				return null;
			},
			
			write: function (expression, value) {
				for (var i = this.__environment.length - 1; i >= 0; --i) {
					if (this._write(this.__environment[i], expression, value, false))
						return;
				}
				this._write(this.__defaults.write || this.__environment[0], expression, value, true);
			},
			
			call: function (expressions, callback, readonly) {
				var data = {};
				var exprs = [];
				Objs.iter(expressions, function (expression) {
					var value = this.read(expression);
					if (value !== null || !(Strings.splitFirst(expression, ".").head in window)) {
						exprs.push(expression);
						data[expression] = value; 
					}
				}, this);
				
				var expanded = this.__expand(data);

				var result = callback.call(this.__context, expanded);
				if (!readonly) {
					var collapsed = this.__collapse(expanded, exprs);
					for (var expression in collapsed) {
						if (!(expression in data) || data[expression] != collapsed[expression])
							this.write(expression, collapsed[expression]);
					}
				}
				return result;
			},
			
			_sub_navigate: function (properties, head, tail, parent, current) {
				var base = {
					properties: properties,
					head: head,
					tail: tail,
					parent: parent,
					current: current
				};
				if (!tail || !current || !Types.is_object(current))
					return base;
				var splt = Strings.splitFirst(tail, ".");
				var hd = head ? head + "." + splt.head : splt.head;
				if (Properties.is_instance_of(current)) {
					if (current.has(splt.head))
						return this._sub_navigate(current, splt.head, splt.tail, current, current.get(splt.head));
					else if (splt.head in current)
						return this._sub_navigate(properties, hd, splt.tail, current, current[splt.head]);
					else {
						return {
							properties: current,
							head: splt.head,
							tail: splt.tail,
							parent: current,
							current: null
						};
					}
				} else if (splt.head in current)
					return this._sub_navigate(properties, hd, splt.tail, current, current[splt.head]);
				else 
					return base;
			},
			
			_navigate: function (scope, expression) {
				return this._sub_navigate(null, "", expression, null, scope);
			},
			
			_read: function (scope, expression) {
				var n = this._navigate(scope, expression);
				if (n.tail)
					return null;
				return {
					value: n.current,
					context: n.parent == scope ? this.__context : n.parent
				};
			},
			
			_write: function (scope, expression, value, force) {
				var n = this._navigate(scope, expression);
				if (n.tail && !force)
					return false;
				var tail = n.tail.split(".");
				if (n.properties)
					n.properties.set(n.head + (n.head && n.tail ? "." : "") + n.tail, value);
				else {
					var current = n.current;
					for (var i = 0; i < tail.length - 1; ++i) {
						current[tail[i]] = {};
						current = current[tail[i]];
					}
					current[tail[tail.length - 1]] = value;
				}
				return true;
			},
			
			__expand: function (obj) {
				var result = {};
				Objs.iter(obj, function (value, key) {
					var current = result;
					var keys = key.split(".");
					for (var i = 0; i < keys.length - 1; ++i) {
						if (!(keys[i] in current) || !Types.is_object(current[keys[i]]) || current[keys[i]] === null)
							current[keys[i]] = {};
						current = current[keys[i]];
					}
					current[keys[keys.length - 1]] = value;
				});
				return result;
			},
			
			__collapse: function (obj, expressions) {
				var result = {};
				Objs.iter(expressions, function (expression) {
					var keys = expression.split(".");
					var current = obj;
					for (var i = 0; i < keys.length; ++i)
						current = current[keys[i]];
					result[expression] = current;
				});
				return result;
			}
			
		};
	}]);
});
Scoped.define("module:Parser", [
    "base:Types", "base:Objs", "base:JavaScript"
], function (Types, Objs, JavaScript) {
	return {
		
		__cache: {},		
		
		parseText: function (text) {
			if (!text)
				return null;
			var chunks = [];
			while (text) {
				var i = text.indexOf("{{");
				var dynamic = null;
				if (i === 0) {
					i = text.indexOf("}}");
					while (i + 2 < text.length && text.charAt(i+2) == "}")
						i++;
					if (i >= 0) {
						i += 2;
						dynamic = this.parseCode(text.substring(2, i - 2));
					} else
						i = text.length;
				} else if (i < 0)
					i = text.length;
				chunks.push(dynamic ? dynamic : text.substring(0, i));
				text = text.substring(i);
			}
			if (chunks.length == 1)
				return Types.is_string(chunks[0]) ? null : chunks[0];
			var dependencies = {};
			Objs.iter(chunks, function (chunk) {
				if (!Types.is_string(chunk)) {
					Objs.iter(chunk.dependencies, function (dep) {
						dependencies[dep] = true;
					});
				}
			});
			return {
				func: function (obj) {
					var s = null;
					Objs.iter(chunks, function (chunk) {
						var result = Types.is_string(chunk) ? chunk : chunk.func(obj);
						s = s === null ? result : (s + result);
					});
					return s;
				},
				dependencies: Object.keys(dependencies)
			};
		},
		
		parseCode: function (code) {
			var result = this.__cache[code];
			if (result)
				return result;
			var bidirectional = false;
			var c = code;
			if (c.charAt(0) == "=") {
				bidirectional = true;
				c = c.substring(1);
			}
			var i = c.indexOf("::");
			var args = null;
			if (i >= 0) {
				args = c.substring(0, i).trim();
				c = c.substring(i + 2);
			}
			result = {
				bidirectional: bidirectional,
				args: args,
				variable: bidirectional ? c : null,
				/*jslint evil: true */
				func: new Function ("obj", "with (obj) { return " + c + "; }"),
				dependencies: Object.keys(Objs.objectify(JavaScript.extractIdentifiers(c, true)))
			};
			this.__cache[code] = result;
			return result;
		}
	
	};
});

Scoped.define("module:Data.ScopeManager", [
	    "base:Class",
	    "base:Trees.TreeNavigator",
	    "base:Classes.ObjectIdScopeMixin",
	    "base:Trees.TreeQueryEngine"
	], function (Class, TreeNavigator, ObjectIdScopeMixin, TreeQueryEngine, scoped) {
	return Class.extend({scoped: scoped}, [TreeNavigator, ObjectIdScopeMixin, function (inherited) {
		return {

			constructor: function (root) {
				inherited.constructor.call(this);
				this.__root = root;
				this.__watchers = [];
				this.__query = this._auto_destroy(new TreeQueryEngine(this));
			},
			
			nodeRoot: function () {
				return this.__root;
			},
			
			nodeId: function (node) {
				return node.cid();
			},
			
			nodeParent: function (node) {
				return node.__parent;
			},
			
			nodeChildren: function (node) {
				return node.__children;
			},
			
			nodeData: function (node) {
				return node.data();
			},
			
			nodeWatch: function (node, func, context) {
				node.on("data", function () {
					func.call(context, "data");
				}, context);
				node.on("add", function (child) {
					func.call(context, "addChild", child);
				}, context);
				node.on("destroy", function () {
					func.call(context, "remove");
				}, context);
			},
			
			nodeUnwatch: function (node, func, context) {
				node.off(null, null, context);
			},
			
			query: function (scope, query) {
				return this.__query.query(scope, query);
			}
	
		};
	}]);
});

Scoped.define("module:Data.Scope", [
	    "base:Class",
	    "base:Events.EventsMixin",
	    "base:Events.ListenMixin",
	    "base:Classes.ObjectIdMixin",
	    "base:Functions",
	    "base:Types",
	    "base:Strings",
	    "base:Objs",
	    "base:Ids",
	    "base:Properties.Properties",
	    "base:Collections.Collection",
	    "base:Events.Events",
	    "module:Data.ScopeManager",
	    "module:Data.MultiScope"
	], function (Class, EventsMixin, ListenMixin, ObjectIdMixin, Functions, Types, Strings, Objs, Ids, Properties, Collection, Events, ScopeManager, MultiScope, scoped) {
	return Class.extend({scoped: scoped}, [EventsMixin, ListenMixin, ObjectIdMixin, function (inherited) {
		return {
				
			constructor: function (options) {
				options = Objs.extend({
					functions: {},
					data: {},
					parent: null,
					scopes: {},
					bind: {},
					attrs: {},
					extendables: [],
					collections: {},
					computed: {},
					events: {},
					channels: {},
					registerchannels: []
				}, options);
				if (options.bindings)
					options.bind = Objs.extend(options.bind, options.bindings);
				this._channels = {};
				this.__channelCache = {};				
				var parent = options.parent;
				this.__manager = parent ? parent.__manager : this._auto_destroy(new ScopeManager(this));
				inherited.constructor.call(this);
				this.__parent = parent;
				this.__root = parent ? parent.root() : this;
				this.__children = {};
				this.__extendables = Objs.objectify(options.extendables);
				this.__properties = options.properties || new Properties();
				this.__properties.increaseRef();
				this.__properties.on("change", function (key, value, oldValue) {
					this.trigger("change:" + key, value, oldValue);
				}, this);
				this.__functions = Objs.map(options.functions, function (value) {
					return Types.is_string(value) ? Functions.as_method(this[value], this) : value;
				}, this);
				this.__scopes = {};
				this.__data = options.data;
				Objs.iter(Types.is_function(options.attrs) ? options.attrs() : options.attrs, function (value, key) {
					if (!this.__properties.has(key))
						this.set(key, value);
				}, this);
				this.setAll();
				Objs.iter(options.collections, function (value, key) {
					if (!this.__properties.has(key)) {
						this.set(key, this.auto_destroy(new Collection({
							objects: value,
							release_references: true
						})));
					}
				}, this);
				if (parent)
					parent.__add(this);
				this.scopes = Objs.map(options.scopes, function (key) {
					return this.scope(key);
				}, this);
				Objs.iter(options.bind, function (value, key) {
					var i = value.indexOf(":");
					this.bind(this.scope(value.substring(0, i)), key, {secondKey: value.substring(i + 1)});
				}, this);
				Objs.iter(options.computed, function (value, key) {
					var splt = Strings.splitFirst(key, ":");
					this.__properties.compute(splt.head, value, splt.tail.split(","));
				}, this);
				Objs.iter(options.events, function (value, key) {
					this.on(key, value, this);
				}, this);
				Objs.iter(options.registerchannels, this.registerChannel, this);
				Objs.iter(options.channels, function (value, key) {
					var splt = Strings.splitFirst(key, ":");
					var channel = this.channel(splt.head);
					if (channel)
						this.listenOn(this.channel(splt.head), splt.tail, value, this);
				}, this);
			},
			
			destroy: function () {
				this.trigger("destroy");
				Objs.iter(this.__scopes, function (scope) {
					scope.destroy();
				});
				Objs.iter(this.__children, function (child) {
					child.destroy();
				});
				this.__properties.decreaseRef();
				if (this.__parent)
					this.__parent.__remove(this);
				inherited.destroy.call(this);
			},
			
			__object_id_scope: function () {
				return this.__manager;
			},
			
			__add: function (child) {
				this.__children[child.cid()] = child;
				this.trigger("add", child);
			},
			
			__remove: function (child) {
				this.trigger("remove", child);
				delete this.__children[child.cid()];
			},
			
			data: function (key, value) {
				if (arguments.length === 0)
					return this.__data;
				if (arguments.length === 1)
					return this.__data[key];
				this.__data[key] = value;
				this.trigger("data", key, value);
				return this;
			},
			
			set: function (key, value, force) {
				if (key in this.__extendables) 
					value = Objs.tree_extend(this.__properties.get(key) || {}, value);
				this.__properties.set(key, value, force);
				return this;
			},
			
			setAll: function (obj) {
				this.__properties.setAll(obj);
				return this;
			},
			
			get: function (key) {
				return this.__properties.get(key);
			},
			
			setProp: function (key, value) {
				this.__properties.setProp(key, value);
				return this;
			},
			
			getProp: function (key) {
				return this.__properties.getProp(key);
			},

			define: function (name, func, ctx) {
				this.__functions[name] = Functions.as_method(func, ctx || this);
				return this;
			},
			
			/* Deprecated */
			call: function (name) {
				return this.execute.apply(this, arguments);
			},
			
			execute: function (name) {
				var args = Functions.getArguments(arguments, 1);
				try {					
					if (Types.is_string(name))
						return this.__functions[name].apply(this, args);
					else
						return name.apply(this, args);
				} catch (e) {
					return this.handle_call_exception(name, args, e);
				}
			},
			
			handle_call_exception: function (name, args, e) {
				throw e;
			},
			
			parent: function () {
				return this.__parent;
			},
			
			_eventChain: function () {
				return this.parent();
			},
			
			registerChannel: function (s) {
				this._channels[s] = this.auto_destroy(new Events());
			},
			
			channel: function (s) {
				if (!(s in this.__channelCache)) {
					var result = null;
					if (this._channels[s])
						result = this._channels[s];
					else if (this.__parent)
						result = this.__parent.channel(s);
					this.__channelCache[s] = result;
				}
				return this.__channelCache[s];
			},
			
			root: function () {
				return this.__root;
			},
			
			children: function () {
				return this.scope(">");
			},
			
			properties: function () {
				return this.__properties;
			},
			
			compute: function (key, callback, dependencies) {
				this.properties().compute(key, callback, this, dependencies);
			},
			
			scope: function (base, query) {
				if (arguments.length < 2) {
					query = base;
					base = this;
				}
				if (!query)
					return base;
				if (base && base.instance_of(MultiScope))
					base = base.iterator().next();
				if (!base)
					return base;
				var ident = Ids.objectId(base) + "_" + query;
				if (!this.__scopes[ident])
					this.__scopes[ident] = new MultiScope(this, base, query);
				return this.__scopes[ident];
			},
			
			bind: function (scope, key, options) {
				if (scope.instance_of(MultiScope)) {
					var iter = scope.iterator();
					while (iter.hasNext())
						this.properties().bind(key, iter.next().properties(), options);
					scope.on("addscope", function (s) {
						this.properties().bind(key, s.properties(), options);
					}, this);
					scope.on("removescope", function (s) {
						this.properties().unbind(key, s.properties());
					}, this);
				} else
					this.properties().bind(key, scope.properties(), options);
			}	
	
		};
	}], {

		_extender: {
			functions: function (base, overwrite) {
				return Objs.extend(Objs.clone(base, 1), overwrite);
			}
		}
	
	});
});
		
		
Scoped.define("module:Data.MultiScope", [
	    "base:Class",
	    "base:Events.EventsMixin",
	    "base:Events.ListenMixin",
	    "base:Objs",
	    "base:Iterators.ArrayIterator"
	], function (Class, EventsMixin, ListenMixin, Objs, ArrayIterator, scoped) {
	return Class.extend({scoped: scoped}, [EventsMixin, ListenMixin, function (inherited) {
		return {
                            				
			constructor: function (owner, base, query) {
				inherited.constructor.call(this);
				this.__owner = owner;
				this.__base = base;
				this.__queryStr = query;
				this.__query = this.__owner.__manager.query(this.__owner, query);
				this.__query.on("add", function (scope) {
					this.delegateEvents(null, scope);
					this.trigger("addscope", scope);
				}, this);
				this.__query.on("remove", function (scope) {
					scope.off(null, null, this);
					this.trigger("removescope", scope);
				}, this);
				Objs.iter(this.__query.result(), function (scope) {
					this.delegateEvents(null, scope);
				}, this);
				this.__freeze = false;
			},
			
			destroy: function () {
				Objs.iter(this.__query.result(), function (scope) {
					scope.off(null, null, this);
				}, this);
				this.__query.destroy();
				inherited.destroy.call(this);
			},
			
			iterator: function () {
				return new ArrayIterator(this.__query.result());
			},
			
			set: function (key, value) {
				var iter = this.iterator();
				while (iter.hasNext())
					iter.next().set(key, value);
				return this;
			},
			
			get: function (key) {
				var iter = this.iterator();
				return iter.hasNext() ? iter.next().get(key) : null;
			},
			
			setProp: function (key, value) {
				var iter = this.iterator();
				while (iter.hasNext())
					iter.next().setProp(key, value);
				return this;
			},
			
			getProp: function (key) {
				var iter = this.iterator();
				return iter.hasNext() ? iter.next().getProp(key) : null;
			},

			define: function (name, func) {
				var iter = this.iterator();
				while (iter.hasNext())
					iter.next().define(name, func);
				return this;
			},
			
			call: function (name) {
				var iter = this.iterator();
				var result = null;
				while (iter.hasNext()) {
					var obj = iter.next();
					var local = obj.call.apply(obj, arguments);
					result = result || local;
				}
				return result;		
			},
			
			parent: function () {
				return this.__owner.scope(this.__base, this.__queryStr + "<");
			},
			
			root: function () {
				return this.__owner.root();
			},
			
			children: function () {
				return this.__owner.scope(this.__base, this.__queryStr + ">");
			},
			
			scope: function (base, query) {		
				if (arguments.length < 2) {
					query = this.__queryStr + base;
					base = this.__base;
				} 
				return this.__owner.scope(base, query);
			},
			
			materialize: function (returnFirst) {
				return returnFirst ? this.iterator().next() : this.iterator().asArray();
			},
			
			freeze: function () {
				this.__freeze = true;
				this.__query.off("add", null, this);
			}
	
		};
	}]);
});
Scoped.define("module:DomObserver", [
    "base:Class",
    "base:Objs",
    "browser:DomMutation.NodeInsertObserver",
    "module:Registries",
    "module:Dynamic",
    "jquery:"
], function (Class, Objs, NodeInsertObserver, Registries, Dynamic, $, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			constructor: function (options) {
				inherited.constructor.call(this);
				options = options || {};
				this.__root = options.root || document.body;
				this.__persistent_dynamics = !!options.persistent_dynamics;
				this.__allowed_dynamics = options.allowed_dynamics ? Objs.objectify(options.allowed_dynamics) : null;
				this.__forbidden_dynamics = options.forbidden_dynamics ? Objs.objectify(options.forbidden_dynamics) : null;
				this.__dynamics = {};
				if (!options.ignore_existing) {
					Objs.iter(Registries.handler.classes(), function (cls, key) {
						if (this.__forbidden_dynamics && this.__forbidden_dynamics[key])
							return;
						if (this.__allowed_dynamics && !this.__allowed_dynamics[key])
							return;
						var self = this;
						$(this.__root).find(key).each(function () {
							if (this.dynamicshandler)
								return;
							self.__nodeInserted(this);
						});
					}, this);
				}
				this.__observer = NodeInsertObserver.create({
					root: this.__root,
					filter: this.__observerFilter,
					context: this
				});
				this.__observer.on("node-inserted", this.__nodeInserted, this);
			},
			
			destroy: function () {
				this.__observer.destroy();
				Objs.iter(this.__dynamics, function (dynamic) {
					dynamic.off(null, null, this);
					if (!this.__persistent_dynamics)
						dynamic.weakDestroy();
				}, this);
				inherited.destroy.call(this);
			},
			
			__observerFilter: function (node) {
				if (node.dynamicshandler || !node.tagName)
					return false;
				var tag = node.tagName.toLowerCase();
				if (!Registries.handler.get(tag))
					return false;
				if (this.__forbidden_dynamics && this.__forbidden_dynamics[tag])
					return false;
				if (this.__allowed_dynamics && !this.__allowed_dynamics[tag])
					return false;
				return true;
			},
			
			__nodeInserted: function (node) {
				var dynamic = new Dynamic({
					element: node,
					remove_observe: true
				});
				this.__dynamics[dynamic.cid()] = dynamic;
				dynamic.on("destroy", function () {
					delete this.__dynamics[dynamic.cid()];
				}, this);
				dynamic.activate();
			}
			
		};
	}, {
		
		__singleton: null,
		
		activate: function (options) {
			if (!this.__singleton)
				this.__singleton = new this(options);
		}		
		
	});
});
Scoped.define("module:Dynamic", [
   	    "module:Data.Scope",
   	    "module:Handlers.HandlerMixin",
   	    "base:Objs",
   	    "base:Strings",
   	    "base:Types",
   	    "base:Functions",
   	    "base:Events.Events",
   	    "module:Registries",
   	    "jquery:"
   	], function (Scope, HandlerMixin, Objs, Strings, Types, Functions, Events, Registries, $, scoped) {
	var Cls;
	Cls = Scope.extend({scoped: scoped}, [HandlerMixin, function (inherited) {
   		return {
   			
   			supportsGc: true,

		   	_notifications: {
				_activate: "__createActivate"
			},
			
			constructor: function (options) {
				this.initial = this.initial || {};
				options = Objs.extend(Objs.clone(this.initial, 1), options);
				this.domevents = Objs.extend(this.domevents, options.domevents);
				this.windowevents = Objs.extend(this.windowevents, options.windowevents);
				Objs.iter(this.cls.__initialForward, function (key) {
					if (!(key in this))
						return;
					if (key in options) {
						if (Types.is_object(this[key]) && Types.is_object(options[key]))
							options[key] = Objs.extend(Objs.clone(this[key], 1), options[key]);
					} else
						options[key] = this[key];
				}, this);
				this.__dispose = options.dispose;
				Objs.iter(this.object_functions, function (key) {
					this[key] = function () {
						var args = Functions.getArguments(arguments);
						args.unshift(key);
						return this.execute.apply(this, args);
					};
				}, this);
				if (!options.parent && options.parentHandler) {
					var ph = options.parentHandler;
					while (ph && !options.parent) {
						options.parent = ph.instance_of(Cls) ? ph : null;
						ph = ph._parentHandler;
					}
				}
				inherited.constructor.call(this, options);
				this._channels.global = this.cls.__globalEvents;
				if (options.tagName) {
					this._tagName = options.tagName;
					this.data("tagname", this._tagName);
				}
				this.functions = this.__functions;
				this._handlerInitialize(options);
				this.__createActivate = options.create || function () {};
				this.__registered_dom_events = [];
				this.dom_events = {};
				this.window_events = {};
			},
			
			handle_call_exception: function (name, args, e) {
				Registries.warning("Dynamics Exception in '" + this.cls.classname + "' calling method '" + name + "' : " + e);
				return null;
			},
			
			_afterActivate: function (activeElement) {
				this.activeElement().off("." + this.cid() + "-domevents");
				$(window).off("." + this.cid() + "-windowevents");
				var self = this;
				Objs.iter(this.domevents, function (target, event) {
					var ev = event.split(" ");
					var source = ev.length === 1 ? this.activeElement() : this.activeElement().find(ev[1]);
					this.__registered_dom_events.push(source);
					source.on(ev[0] + "." + this.cid() + "-domevents", function (eventData) {
						self.call(target, eventData);
					});
				}, this);
				Objs.iter(this.windowevents, function (target, event) {
					$(window).on(event + "." + this.cid() + "-windowevents", function (eventData) {
						self.call(target, eventData);
					});
				}, this);
			},
			
			destroy: function () {
				Objs.iter(this.__dispose, function (attr) {
					var obj = this.get(attr);
					this.set(attr, null);
					if (obj && obj.weakDestroy)
						obj.weakDestroy();
				}, this);
				Objs.iter(this.__registered_dom_events, function (source) {
					source.off("." + this.cid() + "-domevents");
				}, this);
				$(window).off("." + this.cid() + "-windowevents");
				inherited.destroy.call(this);
			}
				
		};
	}], {
		
		__initialForward: [
		    "functions", "attrs", "extendables", "collections", "template", "create", "scopes", "bindings", "computed", "types", "events", "dispose", "channels", "registerchannels"
        ],
        
        __globalEvents: new Events(),
		
		canonicName: function () {
			return Strings.last_after(this.classname, ".").toLowerCase();
		},
		
		registeredName: function () {
			return this.__registeredName || ("ba-" + this.canonicName());
		},
		
		findByElement: function (element) {
			return $(element).get(0).dynamicshandler;
		},
		
		register: function (key, registry) {
			registry = registry || Registries.handler;
			this.__registeredName = key || this.registeredName();
			registry.register(this.__registeredName, this);
			return this;
		},
		
		activate: function (options) {
			var dyn = new this(options || {element: document.body, name_registry: true});
			dyn.activate();
			return dyn;
		},
		
		attachStringTable: function (stringTable) {
			this.__stringTable = stringTable;
			return this;
		},
		
		addStrings: function (strings) {
			this.__stringTable.register(strings, this.registeredName());
			return this;
		},
		
		string: function (key) {
			var result = this.__stringTable.get(key, this.registeredName());
			if (!result && this.parent.string)
				result = this.parent.string(key);
			return result;
		},
		
		_extender: {
			types: function (base, overwrite) {
				return Objs.extend(Objs.clone(base, 1), overwrite);
			},
			registerchannels: function (base, overwrite) {
				return Objs.extend(Objs.clone(base, 1), overwrite);
			},
			channels: function (base, overwrite) {
				return Objs.extend(Objs.clone(base, 1), overwrite);
			},
			attrs: function (base, overwrite) {
				return Objs.extend(Objs.clone(base, 1), overwrite);
			},
			dispose: function (first, second) {
				return (first || []).concat(second || []);
			}
		}
	
	});
	return Cls;
});
Scoped.define("module:Handlers.Attr", [
	    "base:Class",
	    "module:Parser",
	    "jquery:",
	    "base:Types",
	    "base:Objs",
	    "base:Strings",
	    "module:Registries",
	    "browser:Dom"
	], function (Class, Parser, $, Types, Objs, Strings, Registries, Dom, scoped) {
	var Cls;
	Cls = Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			constructor: function (node, attribute) {
				inherited.constructor.call(this);
				this._node = node;
				this._tagHandler = null;
				this._attrName = attribute.name;
				this._isEvent = this._attrName.indexOf("on") === 0;
				this._updatable = !this._isEvent;
				this._attrOriginalValue = attribute.value;
				this._attrValue = attribute.value;
				this._dyn = Parser.parseText(this._attrValue);
				if (this._dyn) {
					var self = this;
					node.mesh().watch(this._dyn.dependencies, function () {
						self.__updateAttr();
					}, this);
				}
				this.updateElement(node.element(), attribute);
			},
			
			destroy: function () {
				if (this._partial)
					this._partial.destroy();
				if (this._dyn)
					this._node.mesh().unwatch(this._dyn.dependencies, this);
				inherited.destroy.call(this);
			},
			
			__inputVal: function (el, value) {
				var valueKey = el.type === 'checkbox' || el.type === 'radio' ? 'checked' : 'value';
				if (arguments.length > 1) 
					el[valueKey] = value === null || value === undefined ? "" : value;
				return el[valueKey];
			},
			
			updateElement: function (element, attribute) {
				this._element = element;
				this._$element = $(element);
				attribute = attribute || element.attributes[this._attrName];
				this._attribute = attribute;
				this.__updateAttr();
				var splt = this._attrName.split(":");
				if (this._partial) {
					this._partial.destroy();
					this._partial = null;
				}
				if (Registries.partial.get(splt[0])) {
					this._partial = Registries.partial.create(splt[0], this._node, this._dyn ? this._dyn.args : {}, this._attrValue, splt[1]);
					if (this._partial.cls.meta.value_hidden)
						this._attribute.value = "";
				}
				if (this._dyn) {
					var self = this;
					if (this._dyn.bidirectional && this._attrName == "value") {
						this._$element.on("change keyup keypress keydown blur focus update", function () {
							self._node.mesh().write(self._dyn.variable, self.__inputVal(self._element));
						});
					}
					if (this._isEvent) {
						this._attribute.value = '';
						this._$element.on(this._attrName.substring(2), function () {
							// Ensures the domEvent does not continue to
							// overshadow another variable after the __executeDyn call ends.
							var oldDomEvent = self._node._locals.domEvent;
							self._node._locals.domEvent = arguments;
							self._node.__executeDyn(self._dyn);
							if (self._node && self._node._locals)
								self._node._locals.domEvent = oldDomEvent;
						});
					}
				}
			},
			
			__updateAttr: function () {
				if (!this._updatable)
					return;
				var value = this._dyn ? this._node.__executeDyn(this._dyn) : this._attrValue;
				if ((value != this._attrValue || Types.is_array(value)) && !(!value && !this._attrValue)) {
					var old = this._attrValue;
					this._attrValue = value;
					
					if (!this._partial || !this._partial.cls.meta.value_hidden) {
						var result = Dom.entitiesToUnicode(value);
						
						
						/*
						 *  Fixing a Safari bug. These three lines will cause Safari to crash: 
						 *     
						 *     <style> [class^="randomstring"] { background: white; } </style>
						 *	   <div class="" id="test"></div>
						 *	   <script> document.getElementById("test").attributes.class.value = null; </script>
                         *
						 */
						if (result === null && this._attrName === "class")
							result = "";
						
						
						this._attribute.value = result;
					}
					
					if (this._partial)
						this._partial.change(value, old);
					if (this._attrName === "value" && this._element.value !== value)
						this.__inputVal(this._element, value);
					if (this._tagHandler && this._dyn && !this._partial)
						this._tagHandler.properties().set(Strings.first_after(this._attrName, "-"), value);
				}
			},

			bindTagHandler: function (handler) {
				this.unbindTagHandler();
				this._tagHandler = handler;
				if (!this._partial && Registries.prefixes[Strings.splitFirst(this._attrName, "-").head]) {
					var innerKey = Strings.first_after(this._attrName, "-");					
					this._tagHandler.setArgumentAttr(innerKey, Class.is_pure_json(this._attrValue) ? Objs.clone(this._attrValue, 1) : this._attrValue);
					if (this._dyn && this._dyn.bidirectional) {
						if (Class.is_pure_json(this._attrValue)) {
							this._tagHandler.properties().bind(innerKey, this._node._handler.properties(), {
								deep: true,
								left: true,
								right: true,
								secondKey: this._dyn.variable
							});
						} else {
							this._tagHandler.properties().on("change:" + innerKey, function (value) {
								this._node.mesh().write(this._dyn.variable, value);
							}, this);							
						}
					}
				} else if (this._partial) {
					this._partial.bindTagHandler(handler);
				}
			},
			
			prepareTagHandler: function (createArguments) {
				if (this._partial)
					this._partial.prepareTagHandler(createArguments);
			},
			
			unbindTagHandler: function (handler) {
				if (this._partial) {
					this._partial.unbindTagHandler(handler);
				}
				if (this._tagHandler)
					this._tagHandler.properties().off(null, null, this);
				this._tagHandler = null;
			},
			
			activate: function () {
				if (this._partial) {
					if (this._partial.cls.meta.requires_tag_handler && !this._tagHandler) {
						Registries.warning(this._partial.cls.classname + " is expecting a tag handler, but no registered tag handler for " + this._node.tag() + " has been found.");
						return;
					}
					this._partial.activate();
				}
			},
			
			deactivate: function () {
				if (this._partial)
					this._partial.deactivate();
			}
			
		};
	});
	return Cls;
});

Scoped.define("module:Handlers.HandlerMixin", [
    "base:Objs",
    "base:Strings",
    "base:Functions",
	"base:Types",
    "jquery:",
    "browser:Loader",
    "module:Handlers.Node",
    "module:Registries",
    "module:Handlers.HandlerNameRegistry",
    "browser:DomMutation.NodeRemoveObserver"
], function (Objs, Strings, Functions, Types, $, Loader, Node, Registries, HandlerNameRegistry, NodeRemoveObserver) {
	return {		
		
		_notifications: {
			construct: "__handlerConstruct",
			destroy: "__handlerDestruct"
		},
		
		__handlerConstruct: function () {
			this.__activated = false;
			this._mesh_extend = {
				string: Functions.as_method(this.string, this)	
			};
		},
	
		__handlerDestruct: function () {
			Objs.iter(this.__rootNodes, function (node) {
				var $element = node.$element();
				node.destroy();
				if (this.remove_on_destroy)
					$element.html("");
			}, this);
		},
		
		template: null,
		templateUrl: null,
		
		string: function (key) {
			if (this.cls.string)
				return this.cls.string(key);
			if (this.parent())
				return this.parent().string(key);
			return key;
		},
		
		remove_on_destroy: false,
		
		_handlerInitialize: function (options) {
			options = options || {};
			if (options.name_registry)
				this.__nameRegistry = this.auto_destroy(new HandlerNameRegistry());
			this.__types = options.types || {};
			this._parentHandler = options.parentHandler || null;
			this._parentElement = options.parentElement;
			this._argumentAttrs = {};
			this.template = options.template || this.template;
			this.templateUrl = options.templateUrl || this.templateUrl;
			if (this.templateUrl)
				this.templateUrl = Strings.replaceAll(this.templateUrl, "%", Strings.last_after(this.cls.classname, ".").toLowerCase());
			this.__element = options.element ? $(options.element) : null;
			this.initialContent = this.__element ? this.__element.html() : $(this._parentElement).html();
			this.__activeElement = this.__element ? this.__element : $(this._parentElement);
			if (options.remove_observe) {
				this.__removeObserver = this.auto_destroy(NodeRemoveObserver.create(this.__activeElement.get(0)));
				this.__removeObserver.on("node-removed", function () {
					this.weakDestroy();
				}, this);
			}
			this.__activeElement.get(0).dynamicshandler = this;
			
			/*
			if (this.template)
				this._handlerInitializeTemplate(this.template, this._parentElement);
			else {
				if (this.templateUrl) {
					this.__deferActivate = true;
					if (this.__element)
						this.__element.html("");
					else if (this._parentElement)
						$(this._parentElement).html("");
					Loader.loadHtml(this.templateUrl, function (template) {
						this.__deferActivate = false;
						this._handlerInitializeTemplate(template, this._parentElement);
						if (this.__deferedActivate)
							this.activate();
					}, this);
				}
			}
			*/
		},
		
		_handlerInitializeTemplate: function (template, parentElement) {
			var compiled = Registries.templates.create(template);
			if (this.__element) {
				this.__activeElement = this.__element;
				this.__element.html("");
				this.__element.append(compiled);
			} else if (parentElement) {
				this.__activeElement = $(parentElement);
				this.__element = compiled;
				this.__activeElement.html("");
				this.__activeElement.append(compiled);
			} else {
				this.__element = compiled;
				this.__activeElement = this.__element.parent();
			}
		},
		
		nameRegistry: function () {
			return this.__nameRegistry || (this.parent() ? this.parent().nameRegistry() : null);
		},
		
		byName: function (name) {
			return this.nameRegistry().get(name);
		},
		
		__assocs: {},
		
		addAssoc: function (name, registeredName) {
			this.__assocs[name] = registeredName;
		},
		
		removeAssoc: function (name) {
			delete this.__assocs[name];
		},
		
		assoc: function (name) {
			return this.byName(this.__assocs[name] || name);
		},
		
		setArgumentAttr: function (key, value) {
			if (key in this.__extendables) 
				value = Objs.tree_extend(this.properties().get(key) || {}, value);
			if (this.__types[key])
				value = Types.parseType(value, this.__types[key]);
			this.properties().set(key, value);
			this._argumentAttrs[key] = true;
		},
		
		isArgumentAttr: function (key) {
			return !!this._argumentAttrs[key];
		},
		
		element: function () {
			return this.__element;
		},
		
		activeElement: function () {
			return this.__activeElement;
		},
		
		activate: function () {
			if (this.__activated)
				return;
			this.__activated = true;
			/*
			if (this.__deferActivate) {
				this.__deferedActivate = true;
				return;
			}
			*/
			if (this.template)
				this._handlerInitializeTemplate(this.template, this._parentElement);
			else {
				if (this.templateUrl) {
					Loader.loadHtml(this.templateUrl, function (template) {
						this.templateUrl = null;
						this.template = template;
						this.activate();
					}, this);
					return;
				}
			}
			
			this._notify("_activate");
			this.__rootNodes = [];
			var self = this;			
			this.__element.each(function () {
				self.__rootNodes.push(new Node(self, null, this));
			});
			this._afterActivate(this.__activeElement);
		},
		
		_afterActivate: function (activeElement) {}
					
	};
});


Scoped.define("module:Handlers.Handler", [
   	    "base:Class",
   	    "module:Handlers.HandlerMixin",
   	    "base:Properties.Properties",
   	    "module:Registries"
   	], function (Class, HandlerMixin, Properties, Registries, scoped) {
   	return Class.extend({scoped: scoped}, [HandlerMixin, function (inherited) {
   		return {
			
			constructor: function (options) {
				inherited.constructor.call(this);
				options = options || {};
				this._properties = options.properties ? options.properties : new Properties();
				this.functions = {};
				this._handlerInitialize(options);
			},
			
			properties: function () {
				return this._properties;
			}
			
		};
   	}], {
			
		register: function (key, registry) {
			registry = registry || Registries.handler;
			registry.register(key, this);
		}
		
   	});
});


Scoped.define("module:Handlers.Partial", [
 	    "base:Class",
 	    "module:Parser",
 	    "module:Registries"
 	], function (Class, Parser, Registries, scoped) {
 	return Class.extend({scoped: scoped}, function (inherited) {
 		return {
			
			constructor: function (node, args, value, postfix) {
				inherited.constructor.call(this);
				this._node = node;
				this._args = args;
				this._value = value;
				this._active = false;
				this._postfix = postfix;
			},
			
			change: function (value, oldValue) {
				this._value = value;
				this._change(value, oldValue);
				this._apply(value, oldValue);
			},
			
			activate: function () {
				if (this._active)
					return;
				this._active = true;
				this._activate();
				this._apply(this._value, null);
			},
			
			deactivate: function () {
				if (!this._active)
					return;
				this._active = false;
				this._deactivate();
			},
			
			bindTagHandler: function (handler) {},
			
			unbindTagHandler: function (handler) {},
			
			prepareTagHandler: function (createArguments) {},
			
			_change: function (value, oldValue) {},
			
			_activate: function () {},
			
			_deactivate: function () {},
			
			_apply: function (value, oldValue) {},
			
			_execute: function (code) {
				var dyn = Parser.parseCode(code || this._value);
				this._node.__executeDyn(dyn);
			}
			
			
		};
 	}, {
		
 		meta: {
 			// value_hidden: false
 			// requires_tag_handler: false
 		},
 		
		register: function (key, registry) {
			registry = registry || Registries.partial;
			registry.register(key, this);
		}
		
	});
});



Scoped.define("module:Handlers.HandlerNameRegistry", [
    "base:Class", "base:Objs"                                    
], function (Class, Objs, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {

			__handlers: {},
			
			destroy: function () {
				Objs.iter(this.__handlers, function (value, name) {
					this.unregister(name);
				}, this);
				inherited.destroy.call(this);
			},
			
			register: function (handler, name) {
				this.unregister(name);
				this.__handlers[name] = handler;
				handler.on("destroy", function () {
					this.unregister(name);
				}, this);
			},
			
			unregister: function (name) {
				if (name in this.__handlers) {
					var handler = this.__handlers[name];
					delete this.__handlers[name];
					if (!handler.destroyed())
						handler.off(null, null, this);
				}
			},
			
			get: function (name) {
				return this.__handlers[name];
			}
		
		};
			
	});
});

Scoped.define("module:Handlers.Node", [
	    "base:Class",
	    "base:Events.EventsMixin",
	    "base:Ids",
	    "browser:Dom",
	    "browser:Info",
	    "module:Parser",
	    "jquery:",
	    "module:Data.Mesh",
	    "base:Objs",
	    "base:Types",
	    "module:Registries",
	    "module:Handlers.Attr"
	], function (Class, EventsMixin, Ids, Dom, Info, Parser, $, Mesh, Objs, Types, Registries, Attr, scoped) {
	var Cls;
	Cls = Class.extend({scoped: scoped}, [EventsMixin, function (inherited) {
		return {
			
			constructor: function (handler, parent, element, locals) {
				inherited.constructor.call(this);
				this._handler = handler;
				this._parent = parent;
				if (parent)
					parent._children[Ids.objectId(this)] = this;
				this._element = element;
				
				this._tag = element.tagName ? element.tagName.toLowerCase() : "";
				if (this._tag.indexOf(":") >= 0)
					this._tag = this._tag.substring(this._tag.indexOf(":") + 1);
				this._dynTag = Parser.parseText(this._tag);
				this._tagHandler = null;
				
				this._$element = $(element);
				this._template = Dom.outerHTML(element);
				this._innerTemplate = element.innerHTML;
				this._locals = locals || {};
				this._active = true;
				this._dyn = null;
				this._children = {};
				this._locked = true;
				this._attrs = {};
				this._expandChildren = true;
				this._touchedInner = false;
				
				this._mesh = new Mesh([window, this.properties(), this._locals, this._handler.functions, this._handler._mesh_extend], this._handler, {
					read: this.properties(),
					write: this.properties(),
					watch: this.properties()
				});
				
				if (this._element.attributes) {
					// Copy attributes first before registering it, preventing a bug when partials add attributes during initialization
					var attrs = [];
					for (var i = 0; i < this._element.attributes.length; ++i)
						attrs.push(this._element.attributes[i]);
					Objs.iter(attrs, this._registerAttr, this);
				}

				this._locked = false;
				this._active = !this._active;
				if (this._active)
					this.deactivate();
				else
					this.activate();
			},
			
			destroy: function () {
				Objs.iter(this._attrs, function (attr) {
					attr.destroy();
				});
				this._removeChildren();
				if (this._tagHandler && !this._tagHandler.destroyed()) {
					if (this._tagHandler.cacheable && this._tagHandler.cls.cacheable)
						Registries.handlerCache.suspend(this._tagHandler, this._$element);
					else
						this._tagHandler.weakDestroy();
				}
				if (this._dyn)
					this.properties().off(null, null, this._dyn);
				if (this._parent)
					delete this._parent._children[Ids.objectId(this)];
				this._mesh.destroy();
				inherited.destroy.call(this);
			},
			
			_registerAttr: function (attribute) {
				if (attribute.name in this._attrs)
					this._attrs[attribute.name].updateAttribute(attribute);
				else
					this._attrs[attribute.name] = new Attr(this, attribute);
			},
			
			tag: function () {
				return this._tag;
			},
			
			element: function () {
				return this._element;
			},
			
			$element: function () {
				return this._$element;
			},
		
			__dynOff: function (dyn) {
				this._mesh.unwatch(dyn.dependencies, dyn);
			},
			
			__dynOn: function (dyn, cb) {
				var self = this;
				this._mesh.watch(dyn.dependencies, function () {
					cb.apply(self);
				}, dyn);
			},
			
			mesh: function () {
				return this._mesh;
			},
			
			__executeDyn: function (dyn) {
				return Types.is_object(dyn) ? this._mesh.call(dyn.dependencies, dyn.func) : dyn;
			},
			
			__tagValue: function () {
				if (!this._dynTag)
					return this._tag;
				return this.__executeDyn(this._dynTag);
			},
			
			__unregisterTagHandler: function () {
				if (this._tagHandler) {
					Objs.iter(this._attrs, function (attr) {
						attr.unbindTagHandler(this._tagHandler);
					}, this);
					this.off(null, null, this._tagHandler);
					if (this._tagHandler.cacheable && this._tagHandler.cls.cacheable)
						Registries.handlerCache.suspend(this._tagHandler, this._$element);
					else
						this._tagHandler.weakDestroy();
					this._tagHandler = null;
				}
			},
			
			__registerTagHandler: function () {
				this.__unregisterTagHandler();
				var tagv = this.__tagValue();
				if (!tagv)
					return;
				if (this._dynTag && this._$element.get(0).tagName.toLowerCase() != tagv.toLowerCase()) {
					this._$element = $(Dom.changeTag(this._$element.get(0), tagv));
					this._element = this._$element.get(0);
					Objs.iter(this._attrs, function (attr) {
						attr.updateElement(this._element);
					}, this);
				}
				if (!Registries.handler.get(tagv))
					return false;
				if (Info.isInternetExplorer() && Info.internetExplorerVersion() < 9) {
					this._$element = $(Dom.changeTag(this._$element.get(0), tagv));
					this._element = this._$element.get(0);
					Objs.iter(this._attrs, function (attr) {
						attr.updateElement(this._element);
					}, this);
				}
				var createArguments = {
					parentElement: this._$element.get(0),
					parentHandler: this._handler,
					autobind: false,
					cacheable: false,
					tagName: tagv					
				};
				Objs.iter(this._attrs, function (attr) {
					attr.prepareTagHandler(createArguments);
				}, this);
				if (createArguments.ignoreTagHandler)
					return;
				if (createArguments.cacheable)
					this._tagHandler = Registries.handlerCache.resume(tagv, this._$element, this._handler);
				if (!this._tagHandler)
					this._tagHandler = Registries.handler.create(tagv, createArguments);
				//this._$element.append(this._tagHandler.element());
				Objs.iter(this._attrs, function (attr) {
					attr.bindTagHandler(this._tagHandler);
				}, this);
				this._tagHandler.activate();
				return true;
			},
			
			activate: function () {
				if (this._locked || this._active)
					return;
				this._locked = true;
				this._active = true;
				if (this._dynTag) {
					this.__dynOn(this._dynTag, function () {
						this.__registerTagHandler();
					});
				}
				var registered = this.__registerTagHandler();
		        if (!registered && this._expandChildren) {
		        	if (this._restoreInnerTemplate)
		        		this._$element.html(this._innerTemplate);
		        	this._touchedInner = true;
		        	if (this._element.nodeType == 3) {
		        		this._dyn = Parser.parseText(this._$element.text());
						if (this._dyn) {
							this.__dynOn(this._dyn, function () {
								this.__updateDyn();
							});
						}
					}
					this.__updateDyn(true);
					for (var i = 0; i < this._element.childNodes.length; ++i)
						if (!this._element.childNodes[i]["ba-handled"])
							this._registerChild(this._element.childNodes[i]);
				}
				// this._$element.css("display", "");
				Objs.iter(this._attrs, function (attr) {
					attr.activate();
				});
				this._locked = false;
			},
			
			__updateDyn: function (force) {
				if (!this._dyn)
					return;
				var value = this.__executeDyn(this._dyn);
				if (force || value != this._dyn.value) {
					this._dyn.value = value;
					if ("textContent" in this._element)
						this._element.textContent = Dom.entitiesToUnicode(value);
					else if (Info.isInternetExplorer() && Info.internetExplorerVersion() < 9 && ("data" in this._element))
						this._element.data = Dom.entitiesToUnicode(value === null ? "" : value);
					else {
						// OF: Not clear if this is ever executed and whether it actually does something meaningful.
						this._$element.replaceWith(value);
					}
				}
			},
				
			_registerChild: function (element, locals) {
				return new Cls(this._handler, this, element, Objs.extend(Objs.clone(this._locals, 1), locals));
			}, 
			
			_removeChildren: function () {
				Objs.iter(this._children, function (child) {
					child.destroy();
				});
			},
			
			deactivate: function () {
				if (!this._active)
					return;
				this._active = false;
				if (this._locked)
					return;
				this._locked = true;
				Objs.iter(this._attrs, function (attr) {
					attr.deactivate();
				});
				this._removeChildren();
				if (this._dynTag)
					this.__dynOff(this._dynTag);
				this.__unregisterTagHandler();
				if (this._dyn) {
					this.__dynOff(this._dyn);
					this._dyn = null;
				}
				if (this._touchedInner)
					this._$element.html("");
				this._restoreInnerTemplate = true;
				this._locked = false;
			},	
				
			properties: function () {
				return this._handler.properties();
			}
			
		};
	}]);
	return Cls;
});
Scoped.define("module:Registries", ["base:Classes.ClassRegistry", "jquery:"], function (ClassRegistry, $) {
	return {		
		
		handler: new ClassRegistry({}, true),
		partial: new ClassRegistry({}, true),
		prefixes: {"ba": true},
		
		templates: {

			cache: {},
			
			create: function (template) {
				template = template.trim();
				var cached = this.cache[template];
				if (cached)
					return cached.clone();
				var compiled;
				try {
					compiled = $(template);
				} catch (e) {
					compiled = $(document.createTextNode(template));
				}
				this.cache[template] = compiled;
				return compiled.clone();
			}
			
		},
		
		warning: function (s) {
			try {
				console.log(s);
			} catch (e) {}
		},
		
		handlerCache: {
			
			cache: {},
			cacheDom: null,
			
			suspend: function (handler, element) {
				if (!this.cacheDom)
					this.cacheDom = $("<div ba-ignore style='display:none'></div>").appendTo(document.body);
				var cacheDom = this.cacheDom;
				var name = handler.data("tagname");
				this.cache[name] = this.cache[name] || [];
				this.cache[name].push({
					handler: handler,
					elements: element.children()
				});
				element.children().each(function () {
					cacheDom.append(this);
				});
			},
			
			resume: function (name, element, parentHandler) {
				if (!this.cache[name] || this.cache[name].length === 0)
					return null;
				var record = this.cache[name].shift();
				element.html(record.elements);
				record.handler._handlerInitialize({
					parentHandler: parentHandler,
					parentElement: element
				});
				return record.handler;
			} 
			
		}
	
	};
});

Scoped.define("module:Partials.AssocPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value, postfix) {
 				inherited.constructor.apply(this, arguments);
 				this._node._handler.addAssoc(postfix, value); 
 			},
 			
 			destroy: function () {
 				this._node._handler.removeAssoc(this._postfix);
 				inherited.destroy.call(this);
 			}
 			
 		};
 	});
 	Cls.register("ba-assoc");
	return Cls;
});


Scoped.define("module:Partials.AttrsPartial", [
    "module:Handlers.Partial",
    "base:Objs",
    "base:Class"
], function (Partial, Objs, Class, scoped) {
  /**
   * @name ba-attrs
   *
   * @description
   * The ba-attrs partial allows the specification of an object that will
   * provide attributes accessible within the element containing the ba-attrs
   * html attribute.
   *
   * @param {object} baAttrs Object containing individual attributes.
   *
   * @example <div ba-attrs="{{{test: 'hi'}}}">{{test}}</div>
   * // Evaluates to <div ba-attrs="{{{test: 'hi'}}}">hi</div>
   */
 	var Cls = Partial.extend({scoped: scoped}, {
		
		_apply: function (value) {
			if (!this._active)
				return;
			var props = this._node._tagHandler ? this._node._tagHandler.properties() : this._node.properties();
			for (var key in value)
				props.set(key, value[key]);
		},
		
		bindTagHandler: function (handler) {
			for (var key in this._value)
				handler.setArgumentAttr(key, Class.is_pure_json(this._value[key]) ? Objs.clone(this._value[key], 1) : this._value[key]);
		}

 	});
 	Cls.register("ba-attrs");
	return Cls;
});


Scoped.define("module:Partials.CachePartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  	var Cls = Partial.extend({scoped: scoped},  {
  		
		bindTagHandler: function (handler) {
			handler.cacheable = true;
		},
		
		prepareTagHandler: function (createArguments) {
			createArguments.cacheable = true;
		}
	
 	}, {
 		
 		meta: {
 			requires_tag_handler: true
 		}
 		
 	});
 	Cls.register("ba-cache");
	return Cls;
});

Scoped.define("module:Partials.ClassPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  /**
   * @name ba-class
   *
   * @description
   * Dynamically set the HTML class of the given element based on the evaluation
   * of expressions.
   *
   * @param {object} baClass Object where keys are Html classes and values are
   * expressions. If the expression evaluates to true, the class is included on
   * the Html element. If the expression evaluates to false, the class is not
   * included.
   *
   * @example <div ba-class="{{{'first': true, 'second': 1 === 2}}}></div>"
   * // Evaluates to <div class="first"></div>
   */
 	var Cls = Partial.extend({scoped: scoped}, {
		
		_apply: function (value) {
			for (var key in value) {
				if (value[key])
					this._node._$element.addClass(key);
				else
					this._node._$element.removeClass(key);
			}
		}

 	});
 	Cls.register("ba-class");
	return Cls;
});

Scoped.define("module:Partials.ClickPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  /**
   * @name ba-click
   *
   * @description
   * The ba-click partial allows the specification of custom on clicked
   * behavior. By default, the click propagation is prevented. Should you want
   * the click to propagate, use the `onclick` Html tag.
   *
   * @param {expression} baClick Expression to evaluate upon click. If click is
   * within the scope of another directive, the Expression can be an exposed method of
   * the parent directive.
   *
   * @example <button ba-click="showing = !showing">
   * // Expression is evaluated (ex. showing now equals inverse) on click.
   *
   * @example <button ba-click="exposedMethod()">
   * // Calls parentDirective.call("exposedMethod") on click.
   *
   * @example <button ba-click="exposedMethod(arg)">
   * // Calls parentDirective.call("exposedMethod", arg) on click.
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				var self = this;
 				this._node._$element.on("click", function (e) {
 					e.stopPropagation();
 					self._execute();
 				});
 			}
 		
 		};
 	});
 	Cls.register("ba-click");
	return Cls;
});


Scoped.define("module:Partials.DataPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  	var Cls = Partial.extend({scoped: scoped},  {
  		
		_apply: function (value) {
			this._node._tagHandler.data(this._postfix, value);
		},
		
		bindTagHandler: function (handler) {
			this._apply(this._value);
		}
	
 	}, {
 		
 		meta: {
 			requires_tag_handler: true
 		}
 		
 	});
 	Cls.register("ba-data");
	return Cls;
});

Scoped.define("module:Partials.EventPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  	var Cls = Partial.extend({scoped: scoped}, {
			
		bindTagHandler: function (handler) {
			handler.on(this._postfix, function (arg1, arg2, arg3, arg4) {
				this._node._handler.call(this._value, arg1, arg2, arg3, arg4);
			}, this);
		}
 		
 	});
 	Cls.register("ba-event");
	return Cls;
});


Scoped.define("module:Partials.FunctionsPartial", ["module:Handlers.Partial", "browser:Info", "base:Objs"], function (Partial, Info, Objs, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			bindTagHandler: function (handler) { 				
 				Objs.extend(handler.__functions, this._value); 
 			}
 		
 		};
 	});
 	Cls.register("ba-functions");
	return Cls;
});

Scoped.define("module:Partials.GcPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			bindTagHandler: function (handler) {
 				if (this._value) 
 					handler.enableGc(this._value);
 			}
 		
 		};
 	});
 	Cls.register("ba-gc");
	return Cls;
});

Scoped.define("module:Partials.IfPartial", ["module:Partials.ShowPartial"], function (Partial, scoped) {
  /**
   * @name ba-if
   *
   * @description
   * The ba-if partial controls rendering of internal Html based on the truth
   * value of a given expression. It differs from ba-show in that ba-show
   * renders internal Html, but hides it, while ba-if will not render the
   * internal Html at all.
   *
   * @param {expression} baIf Expression to evaluate for truth. If true,
   * internal html will be rendered. If false, internal html will not be
   * rendered. Note, if the expression should be evaluted, it must be wrapped in
   * {{}}. See the examples below.
   *
   * @example <div ba-if="{{1 === 1}}"><h1>Hi</h1><div>
   * // Evaluated to <div><h1>Hi</h1></div>
   *
   * @example <div ba-if="{{1 === 2}}"></h1>Hi</h1></div>
   * // Evaluated to <div></div>
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				if (!value)
 					node.deactivate();
 			},
 			
 			_apply: function (value) {
 				inherited._apply.call(this, value);
 				if (value)
 					this._node.activate();
 				else
 					this._node.deactivate();
 			}
 		
 		};
 	});
 	Cls.register("ba-if");
	return Cls;
});

Scoped.define("module:Partials.IgnorePartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  /**
   * @name ba-ignore
   *
   * @description
   * The ba-ignore partial instructs the BetaJS Dynamics process to not process
   * anything of the inner Html within the given element implementing the
   * ba-ignore partial. The ba-ignore partial is often used to stop the
   * processing of an inline script tag.
   *
   * @example <div ba-attrs="{{{test: 'hi'}}}"><p ba-ignore>{{test}}</p></div>
   * // Renders <div ...><p ba-ignore>{{test}}</p></div>
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				node.deactivate();
 			}
 		
 		};
 	});
 	Cls.register("ba-ignore");
	return Cls;
});

Scoped.define("module:Partials.InnerTemplatePartial",
	["module:Handlers.Partial"], function (Partial, scoped) {

 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {		
 		return {

			constructor: function (node, args, value) {
				inherited.constructor.apply(this, arguments);
				node._$element.html(value);
			}

 		};
 	}, {
 		
 		meta: {
 			value_hidden: true
 		}
 		
 	});
 	Cls.register("ba-inner-template");
	return Cls;

});

Scoped.define("module:Partials.NoScopePartial", ["module:Handlers.Partial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			 			 			
 			prepareTagHandler: function (createArguments) {
 				createArguments.properties = this._node.properties();
 			}
 		
 		};
 	});
 	Cls.register("ba-noscope");
	return Cls;
});


Scoped.define("module:Partials.OnPartial", ["module:Handlers.Partial"], function (Partial, Strings, scoped) {
  /**
   * @name ba-on
   *
   * @description
   * The ba-on partial executes the given expression when triggered by the
   * specified Dom event on the given Html element. For a complete list of Dom
   * events, see {@link http://www.w3schools.com/jsref/dom_obj_event.asp}
   *
   * @postfix {event} event The event triggering the expression is specified as
   * a post fix of the ba-on directive. See the examples.
   *
   * @param {expression} baOn Expression to evaluate upon the occurence of the
   * event. If within the scope of another directive, the expression can be an
   * exposed method of the parent directive (see ba-click documentation for
   * greater detail).
   *
   * @example <button ba-on:mouseover="alert('Hi')">Hi</button>
   * // Will alert('Hi') when the mouseover event occurs on the button.
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value, postfix) {
 				inherited.constructor.apply(this, arguments);
 				var self = this;
 				this._node._$element.on(postfix + "." + this.cid(), function () {
 					self._execute(value.trim());
 				});
 			},
 			
 			destroy: function () {
 				this._node._$element.off(this._postfix + "." + this.cid());
 				inherited.destroy.call(this);
 			}
 		
 		};
 	});
 	Cls.register("ba-on");
	return Cls;
});


Scoped.define("module:Partials.RegisterPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			bindTagHandler: function (handler) {
 				handler.nameRegistry().register(handler, this._value);
 			},
 			
 			unbindTagHandler: function (handler) {
 				if (handler)
 					handler.nameRegistry().unregister(this._value);
 			}
 			
 		};
 	});
 	Cls.register("ba-register");
	return Cls;
});

Scoped.define("module:Partials.RepeatElementPartial", [
        "module:Partials.RepeatPartial",
        "base:Collections.Collection",
        "base:Collections.FilteredCollection",
        "base:Objs",
        "jquery:",
        "module:Parser",
        "base:Properties.Properties",
        "browser:Dom"
	], function (Partial, Collection, FilteredCollection, Objs, $, Parser, Properties, Dom, scoped) {
  /**
   * @name ba-repeat-element
   *
   * @description
   * Instantiate entire Html element (both element and the html is closes)
   * once for each instance in the collection.
   * Differs from ba-repeat, in that while ba-repeat instantiates just the
   * inner Html contents of the given element for each instance in the
   * collection, ba-repeat-element instantiates the Html element and the inner
   * Html contents. See examples.
   * 
   * @param {object} instance Object representing a single element in the
   * collection. Updated as collection is iterated through.
   *
   * @param {object} collection Object representing multiple elements, each of
   * which will be instantiated.
   *
   * @example <p ba-repeat-element="{{ i :: [1,2,3] }}">{{i}}</p>
   * // Evalues to <p>1</p><p>2</p><p>3</p>
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				this.__filteredTemplate = Dom.outerHTML($(node._template).removeAttr("ba-repeat-element").get(0));
 			},
 			
 			_activate: function () {
 				this._node._$element.hide();
 				inherited._activate.call(this);
 			},
 			
 			_iterateCollection: function (callback) {
 				var a = this._collection.iterator().asArray();
 				for (var i = a.length - 1; i >= 0; --i)
 					callback.call(this, a[i]);
 			},
 			
 			_newItemElements: function () {
 				var template = this.__filteredTemplate.trim();
				var element = $(template).get(0);
				this._node._$element.after(element);
 				element["ba-handled"] = true;
 				return $(element);
 			},
 			
 			prepareTagHandler: function (createArguments) {
 				createArguments.ignoreTagHandler = true;
 			}

 		};
 	});
 	Cls.register("ba-repeat-element");
	return Cls;
});

Scoped.define("module:Partials.RepeatPartial", [
        "module:Handlers.Partial",
        "base:Properties.Properties",
        "base:Collections.Collection",
        "base:Collections.FilteredCollection",
        "base:Objs",
        "jquery:",
        "module:Parser",
        "module:Registries"
	], function (Partial, Properties, Collection, FilteredCollection, Objs, $, Parser, Registries, scoped) {
	  /**
	   * @name ba-repeat
	   *
	   * @description
	   * Instantiate once for each instance in the collection. Render only the inner html
	   * of the element for each instance.
	   *
	   * @param {object} instance Object representing a single element in the
	   * collection. Updated as collection is iterated through.
	   *
	   * @param {object} collection Object representing multiple elements, each of
	   * which will be instantiated.
	   *
	   * @example <ul ba-repeat-element="{{ i :: [1,2] }}"><li>{{i}}</li></ul>
	   * // Evaluates to <ul><li>1</li><li>2</li></ul>
	   */

	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				this.__registered = false;
 				args = args.split("~");
 				this.__repeatArg = args[0].trim();
 				this._destroyCollection = false;
 				this._destroyValueCollection = false;
 				if (args.length > 1) {
 					this.__repeatFilter = Parser.parseCode(args[1].trim());
 					var self = this;
 					node.mesh().watch(this.__repeatFilter.dependencies, function () {
 						self.__filterChanged();
 					}, this.__repeatFilter);
 				}
 				node._expandChildren = false;
 				node._$element.html("");
 			},

 			destroy: function () {
 				this.__unregister();
 				if (this.__repeatFilter)
 					node.mesh().unwatch(this.__repeatFilter.dependencies, this.__repeatFilter);
 				inherited.destroy.call(this);
 			},
 			
 			_activate: function () {		
 				this.__register();
 			},
 			
 			_deactivate: function () {
 				this.__unregister();
 			},
 			
 			__filterChanged: function () {
 				if (!this._active)
 					return;
				this._collection.setFilter(this.__filterFunc, this);
 			},
 			
 			_change: function (value, oldValue) {
 				this.__register(value);
 			},
 			
 			__filterFunc: function (prop) {
				var filter = this.__repeatFilter;
				if (!filter)
					return true;
				var self = this;
 				return this._node.mesh().call(filter.dependencies, function (obj) {
 					obj[self.__repeatArg] = self._isArray ? prop.get("value") : prop.data();
					return filter.func.call(this, obj);
				}, true);
 			},
 			
 			_iterateCollection: function (callback) {
 				this._collection.iterate(callback, this);
 			},
 			
 			__register: function () {
 				this.__unregister();
 				this._isArray = !Collection.is_instance_of(this._value);
 				this._destroyValueCollection = !Collection.is_instance_of(this._value);
 				this._valueCollection = this._destroyValueCollection ? new Collection({
 					objects: Objs.map(this._value, function (val) {
 						return new Properties({value: val});
 					}),
 					release_references: true
 				}) : this._value;
 				this._destroyCollection = !!this.__repeatFilter;
				this._collection = this._destroyCollection ? new FilteredCollection(this._valueCollection, {
					filter: this.__filterFunc,
					context: this
				}) : this._valueCollection;
				this._collectionChildren = {};
				this._iterateCollection(this.__addItem);
				this._collection.on("add", this.__addItem, this);
				this._collection.on("remove", this.__removeItem, this);
				this._collection.on("reindexed", function (item) {
					if (this._collection.count() < 2)
						return;
					var idx = this._collection.getIndex(item);
					if (idx === 0)
						this._prependItem(this._collection.getByIndex(1), item);
					else
						this._appendItem(this._collection.getByIndex(idx - 1), item);
				}, this);
 			},
 			
 			__unregister: function () {
 				if (!this._collection)
 					return;
 				this._iterateCollection(this.__removeItem);
 				var $element = this._node._$element;
 				this._node._removeChildren();
 				$element.html("");
 				this._collection.off(null, null, this);
 				this._valueCollection.off(null, null, this);
 				if (this._destroyCollection)
 					this._collection.destroy();
 				if (this._destroyValueCollection)
 					this._valueCollection.destroy();
 				this._valueCollection = null;
 				this._collection = null;
 			},
 			
 			__addItem: function (item) {
 				if (this._collectionChildren[item.cid()])
 					return;
 				var locals = {};
 				if (this.__repeatArg)
 					locals[this.__repeatArg] = this._isArray ? item.get("value") : item;
 				var result = [];
 				var self = this;
 				var elements = this._newItemElements();
 				elements.each(function () {
 					result.push(self._node._registerChild(this, locals));
 				});
 				this._collectionChildren[item.cid()] = {
					item: item,
					nodes: result
				};
 				var idx = this._collection.getIndex(item);
 				if (idx < this._collection.count() - 1)
 					this._prependItem(this._collection.getByIndex(idx + 1), item);
 			},
 			
 			__removeItem: function (item) {
 				if (!this._collectionChildren[item.cid()])
 					return;
				Objs.iter(this._collectionChildren[item.cid()].nodes, function (node) {
					var ele = node.$element();
					node.destroy();
					ele.remove();
				}, this);
				delete this._collectionChildren[item.cid()];
 			},
 			
 			_itemData: function (item) {
 				return this._collectionChildren[item.cid()];
 			},
 			
 			_itemDataElements: function (item) {
 				var itemData = this._itemData(item);
 				if (!itemData)
 					return null;
 				var result = [];
 				Objs.iter(itemData.nodes, function (node) {
 					result.push(node.$element());
 				});
 				return result;
 			},
 			
 			_prependItem: function (base, item) {
 				var baseDataElements = this._itemDataElements(base);
 				var itemDataElements = this._itemDataElements(item);
 				if (!baseDataElements || !itemDataElements)
 					return;
 				Objs.iter(itemDataElements, function (element) {
 					element.insertBefore(baseDataElements[0]);
 				});
 			},
 			
 			_appendItem: function (base, item) {
 				var baseDataElements = this._itemDataElements(base);
 				var itemDataElements = this._itemDataElements(item);
 				if (!baseDataElements || !itemDataElements)
 					return;
 				var current = baseDataElements[baseDataElements.length - 1];
 				Objs.iter(itemDataElements, function (element) {
 					current.after(element);
 					current = element;
 				});
 			},
 			
 			_newItemElements: function () {
 				return Registries.templates.create(this._node._innerTemplate).appendTo(this._node._$element);
 			}
 			
 		};
 	});
 	Cls.register("ba-repeat");
	return Cls;
});

Scoped.define("module:Partials.ReturnPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  /**
   * @name ba-return
   *
   * @description
   * The ba-return partial allows the specification of custom behavior when the
   * `return` key is pressed.
   *
   * @param {expression} baReturn Expression to evaluate upon return key being
   * pressed. See ba-click for greater description as they are very similar.
   *
   * @example <input ba-return="processText()"></input>
   * // Calls parentDirective.processText() when return key is pressed within
   * the input field.
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				var self = this;
 				this._node._$element.on("keypress", function (event) {
 					if (event.which === 13)
 						self._execute();
 				});        
 			}
 		
 		};
 	});
 	Cls.register("ba-return");
	return Cls;
});

Scoped.define("module:Partials.ShareScopePartial", ["module:Handlers.Partial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			bindTagHandler: function (handler) {
 				handler.properties().bind("", this._value ? this._value : this._node.properties(), {deep: true});
 			}
 		
 		};
 	});
 	Cls.register("ba-sharescope");
	return Cls;
});

Scoped.define("module:Partials.ShowPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
  /**
   * @name ba-show
   *
   * @description
   * The ba-show partials controls showing the internal Html on the Dom based on
   * the truth value of the given expression.
   *
   * @param {expression} baShow Expression to evaluate for truth. If true,
   * internal html will be displayed. If false, internal html will not be
   * displayed. Expression must be wrapped in {{}} so it will be evaluated, as
   * seen below.
   *
   * @example <p ba-show="{{1 === 1}}">Hi</p>
   * // Evalues to <p>Hi</p>
   * @example <p ba-show="{{1 === 2}}">Hi</p>
   * // Evalues to <p style="display: none;">Hi</p>
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				this.__oldDisplay = undefined;
 				this.__readOldDisplay = false;
 				this.__hidden = false;
 				if (!value)
 					this.__hide();
 			},
 			
 			__hide: function () {
 				if (this.__hidden)
 					return;
 				this.__hidden = true;
 				if (!this.__readOldDisplay) {
 					this.__oldDisplay = this._node._$element.get(0).style.display;
 					this.__readOldDisplay = true;
 				}
 				this._node._$element.get(0).style.display = "none";
 			},
 			
 			__show: function () {
 				if (!this.__hidden)
 					return;
 				this.__hidden = false;
 				this._node._$element.get(0).style.display = this.__oldDisplay && this.__oldDisplay !== 'none' ? this.__oldDisplay : "";
 			},
 			
 			_apply: function (value) {
 				if (value)
 					this.__show();
 				else
 					this.__hide();
 			}
 		
 		};
 	});
 	Cls.register("ba-show");
	return Cls;
});

Scoped.define("module:Partials.StylesPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, {
		
		_apply: function (value) {
			for (var key in value)
				this._node._$element.css(key, value[key]);
		}

 	});
 	Cls.register("ba-styles");
	return Cls;
});


Scoped.define("module:Partials.TapPartial", ["module:Handlers.Partial", "browser:Info"], function (Partial, Info, scoped) {
  /**
   * @name ba-tap
   *
   * @description
   * The ba-tap partial allows the specification of custom on tap behavior. Tap
   * is particularly useful for handling mobile events.
   *
   * @param {expression} baTap Expression to evaluate upon tap. See ba-click
   * documentation for more details as they are very similar.
   *
   * @example <button ba-tap="someMethod()">Tap</button>
   * // Calls parentDirective.call("someMethod") on tap.
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				var self = this;
 				this._node._$element.on(Info.isMobile() ? "touchstart" : "click", function (e) {
 					e.stopPropagation();
 					self._execute();
 				});
 			}
 		
 		};
 	});
 	Cls.register("ba-tap");
	return Cls;
});

Scoped.define("module:Partials.TemplatePartial",
	["module:Handlers.Partial"], function (Partial, scoped) {

 	var Cls = Partial.extend({scoped: scoped}, {		

		bindTagHandler: function (handler) {
			if (this._value)
				handler.template = this._value;
		}
		
 	}, {
 		
 		meta: {
 			requires_tag_handler: true,
 			value_hidden: true
 		}
 		
 	});
 	Cls.register("ba-template");
	return Cls;

});


Scoped.define("module:Partials.TemplateUrlPartial",
	["module:Handlers.Partial", "browser:Loader"], function (Partial, Loader, scoped) {

  /**
   * @name ba-template-url
   *
   * @description
   * Specify the template url for internal html.
   *
   * @param {string} templateUrl The template url.
   *
   * @example <div ba-template-url="my-template.html"></div>
   * // Evaluates to <div ...>CONTENTS OF MY-TEMPLATE.HTML</div>
   */
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {		
 		return {

			constructor: function (node, args, value) {
				inherited.constructor.apply(this, arguments);
				node._expandChildren = false;
				node._$element.html("");
				Loader.loadHtml(value, function (template) {
					node._$element.html(template);
					node._$element.children().each(function () {
	 					node._registerChild(this);
	 				});
				}, this);
			}

 		};
 	});
 	Cls.register("ba-template-url");
	return Cls;

});

Scoped.define("module:Partials.WeakIfPartial", ["module:Partials.ShowPartial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, function (inherited) {
 		return {
			
 			constructor: function (node, args, value) {
 				inherited.constructor.apply(this, arguments);
 				if (!value)
 					node.deactivate();
 			},
 			
 			_apply: function (value) {
 				inherited._apply.call(this, value);
 				if (value)
 					this._node.activate();
 			}
 		
 		};
 	});
 	Cls.register("ba-weak-if");
	return Cls;
});

}).call(Scoped);