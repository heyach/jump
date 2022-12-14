/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ce58e6b1b187ce2e04ac"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(6)(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Timer {
    constructor(fn, interval, delay, delayFn) {
        this.interval = interval;
        this.fn = fn;
        this.initTime = 0;
        this.lastTime = 0;
        this.timer = null;
        this.delay = delay;
        this.delayFn = delayFn;
        this.loop(0);
    }
    loop(timestamp) {
        !this.initTime && (this.initTime = timestamp);
        this.timer = requestAnimationFrame(Timer.prototype.loop.bind(this));
        if (timestamp - this.lastTime > this.interval) {
            this.lastTime = timestamp;
            typeof this.fn == "function" && this.fn();
            if (this.delay && this.lastTime - this.initTime > this.delay) {
                this.delayFn();
                this.clear();
            }
        }
    }
    clear() {
        cancelAnimationFrame(this.timer);
        this.timer = null;
    }
}
exports.default = Timer;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AutoZindex_1 = __webpack_require__(2);
const guid_1 = __webpack_require__(3);
// ????????????
class BasicElement {
    constructor(option) {
        this.x = 0;
        this.y = 0;
        this.offsetX = option.offsetX;
        this.offsetY = option.offsetY;
        this.id = guid_1.default();
        this.zindex = option.zindex ? option.zindex : AutoZindex_1.default.getIndex();
        this.active = false;
        this.event = {};
        this.parent = null;
    }
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    addEvent(key, fn) {
        this.event[key] = this.event[key] || [];
        this.event[key].push(fn);
    }
    dispatchEvent(key) {
        this.event[key] && this.event[key].forEach((item) => item(this));
    }
}
exports.default = BasicElement;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// ?????????zindex?????????zindex???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
let AutoZindex = (function () {
    class Singleton {
        constructor() {
            this.zindex = 1000;
            this.nindex = 1000;
            this.hindex = 10000;
            if (Singleton.instance) {
                return Singleton.instance;
            }
            return Singleton.instance = this;
        }
        getIndex() {
            return ++this.zindex;
        }
        getNindex() {
            return --this.nindex;
        }
        getHindex() {
            return ++this.hindex;
        }
    }
    var sin = new Singleton();
    return sin;
})();
exports.default = AutoZindex;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.default = guid;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// ???????????????
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // ?????????????????????
    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    // ????????????
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    // ????????????
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    // ????????????
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    // ???????????????
    perp() {
        return new Vector(this.y, -this.x);
    }
    // ????????????
    unit() {
        let d = this.getLength();
        return d ? new Vector(this.x / d, this.y / d) : new Vector(0, 0);
    }
}
exports.default = Vector;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function flatArrayChildren(array) {
    let res = [];
    function h(arr) {
        arr.forEach((item) => {
            res.push(item);
            item.children && h(item.children);
            item.buildInChildren && h(item.buildInChildren);
        });
    }
    h(array);
    return res;
}
exports.default = flatArrayChildren;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Background_1 = __webpack_require__(7);
const Brick_1 = __webpack_require__(8);
const PlayerElm_1 = __webpack_require__(9);
const Stage_1 = __webpack_require__(17);
const Timer_1 = __webpack_require__(0);
let s2 = new Stage_1.default(document.getElementById("stage"));
let bg = new Background_1.default();
s2.add(bg);
let y = 0;
let shut = [[180, 430], [100, 320], [50, 220], [170, 120], [80, 20], [100, -120],
    [40, -220], [200, -320], [180, -430], [100, -500], [40, -620],
    [200, -720], [180, -800], [100, -920], [40, -1020], [200, -1120]];
let bs = [];
shut.forEach(item => {
    let b = new Brick_1.default({
        x: item[0],
        y: item[1],
        w: 50,
        h: 10
    });
    bs.push(b);
    s2.add(b);
});
let p = new PlayerElm_1.default({
    x: 32,
    y: 470,
    w: 30,
    h: 30,
});
s2.add(p.container);
let pressKey = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
};
document.getElementById("btn-begin").addEventListener("click", () => {
    document.body.removeChild(document.getElementById("btn-begin"));
    // ????????????????????????????????????donw????????????true???up????????????false????????????true?????????????????????????????????????????????????????????2???
    document.addEventListener("keydown", (e) => {
        switch (e.code) {
            case "ArrowRight":
                pressKey.right = true;
                break;
            case "ArrowLeft":
                pressKey.left = true;
                break;
            case "Space":
                pressKey.space = true;
                break;
            default:
                break;
        }
    });
    document.addEventListener("keyup", (e) => {
        switch (e.code) {
            case "ArrowRight":
                pressKey.right = false;
                break;
            case "ArrowLeft":
                pressKey.left = false;
                break;
            case "Space":
                pressKey.space = false;
                break;
            default:
                break;
        }
    });
});
let pressTimer = new Timer_1.default(() => {
    if (pressKey.right) {
        p.setDirection("right");
        p.move();
    }
    if (pressKey.left) {
        p.setDirection("left");
        p.move();
    }
}, 16);
let delta = 5;
let riseTimer;
let pressTimer2 = new Timer_1.default(() => {
    if (pressKey.space) {
        if (p.stand) {
            p.begin = true;
            riseTimer = new Timer_1.default(() => {
                y += delta;
                bg.rise(delta);
                bs.forEach(item => {
                    item.y += delta;
                });
            }, 16, 160, () => { });
        }
        p.jump(1);
        if (y > 1500) {
            pressTimer2.clear();
            riseTimer.clear();
            alert("????????????");
            location.reload();
        }
    }
}, 100);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = __webpack_require__(0);
class Background {
    constructor() {
        this.bgs = [
            "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/372c9e7aaacb448eb0c98f2981889b93~tplv-k3u1fbpfcp-watermark.image?",
            "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fea4c48c4f44e059e3adc02f4816f84~tplv-k3u1fbpfcp-watermark.image?",
            "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e24eaf658f148e197986a5b31b91c07~tplv-k3u1fbpfcp-watermark.image?"
        ];
        // this.bgs = ["./bg1.png", "./bg2.png", "./bg3.png"]
        this.bg1 = new Image();
        this.index = 0;
        this.bg1.src = this.bgs[0];
        this.w = 300;
        this.h = 500;
        this.bufcanvas = document.createElement("canvas");
        this.bufcanvas.width = this.w;
        this.bufcanvas.height = this.h;
        this.bufctx = this.bufcanvas.getContext("2d");
        this.y = 0;
        this.imgh = 600;
    }
    draw(ctx) {
        // ?????????y???0????????????bg1???0-500??????
        // y?????????50??????????????????bg1???50-550??????
        // y?????????200??????????????????bg1???200-600??????????????????????????????400????????????500?????????100????????????bg2???0-100???canvas???400-500??????
        // y?????????300??????????????????bg1???300-600??????????????????bg2???0-200?????????canvas???300-500??????
        // y?????????600??????????????????bg1????????????????????????bg2?????????bg1??????y?????????0????????????
        // y?????????????????????bg1???[0, y, w, h]???canvas??????[0, 0, w, h]??????
        this.bufctx.drawImage(this.bg1, 0, this.y, this.w, this.imgh, 0, 0, this.w, this.imgh);
        if (this.bg2 && this.bg2.src) {
            // ??????bg1??????????????????????????????bg2??????????????????
            this.bufctx.drawImage(this.bg2, 0, 0, this.w, this.h - (this.imgh - this.y), 0, this.imgh - this.y, this.w, this.h - (this.imgh - this.y));
        }
        ctx.drawImage(this.bufcanvas, 0, 0, this.w, this.h);
    }
    rise(n) {
        this.y += n;
        // ??????????????????????????????????????????????????????????????????????????????
        if (this.imgh - this.y < this.h) {
            this.bg2 = new Image();
            this.bg2.src = this.bgs[(this.index + 1) % this.bgs.length];
        }
        // ??????bg1?????????????????????????????????bg2??????bg1??????bg3??????bg2?????????????????????????????????
        if (this.y > this.imgh) {
            this.bg1.src = this.bgs[(this.index + 1) % this.bgs.length];
            this.y = 0;
            this.bg2 = null;
            this.index++;
        }
    }
    animate() {
        this.timer = new Timer_1.default(() => {
            this.y += 3;
            // ??????????????????????????????????????????????????????????????????????????????
            if (this.imgh - this.y < this.h) {
                this.bg2 = new Image();
                this.bg2.src = this.bgs[(this.index + 1) % this.bgs.length];
            }
            // ??????bg1?????????????????????????????????bg2??????bg1??????bg3??????bg2?????????????????????????????????
            if (this.y > this.imgh) {
                this.bg1.src = this.bgs[(this.index + 1) % this.bgs.length];
                this.y = 0;
                this.bg2 = null;
                this.index++;
            }
        }, 16);
    }
}
exports.default = Background;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(1);
const Timer_1 = __webpack_require__(0);
class Brick extends BasicElement_1.default {
    constructor(option) {
        super({});
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.type = "Brick";
        this.image = new Image();
        this.image.src = "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a173f1034e914476ad194cab26075c04~tplv-k3u1fbpfcp-watermark.image?";
        this.fps = 16;
        this.timer = null;
        this.animate();
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    gotShot() {
        this.destroy();
    }
    animate() {
        let x = this.x - this.w;
        let x2 = this.x + this.w;
        let f = Math.random() < 0.5 ? -1 : 1;
        this.timer = new Timer_1.default(() => {
            this.x += 1 * f;
            if (this.x > x2) {
                f = -1;
            }
            if (this.x < x) {
                f = 1;
            }
        }, this.fps);
    }
    destroy() {
        this.parent.remove(this);
    }
    pointInElement(x, y) {
        // ????????????close?????????20*20?????????????????????
        // ???????????????????????????offset???????????????????????????xy??????container???xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = Brick;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CheckCollision_1 = __webpack_require__(10);
const Container_1 = __webpack_require__(15);
const flatArrayChildren_1 = __webpack_require__(5);
const Player_1 = __webpack_require__(16);
const Timer_1 = __webpack_require__(0);
// 
class PersonElm {
    constructor(option) {
        this.container = new Container_1.default({
            name: "PlayerElm",
            x: option.x,
            y: option.y,
            w: option.w,
            h: option.h
        });
        this.direction = "right";
        this.container.type = "PersonElm";
        this.player = new Player_1.default({
            offsetX: 0,
            offsetY: 0,
            w: 30,
            h: 30,
        });
        this.player.play();
        this.container.add(this.player);
        this.jumpTimer = null;
        this.fallTimer = null;
        this.fps = 16;
        this.stand = false;
        this.begin = false;
        this.fall();
    }
    setDirection(d) {
        this.direction = d;
    }
    move() {
        switch (this.direction) {
            case "right":
                if (this.container.x < 300 - this.container.w - 3) {
                    this.container.x += 3;
                }
                break;
            case "left":
                if (this.container.x > 3) {
                    this.container.x -= 3;
                }
                break;
            default:
                break;
        }
    }
    stop() {
        this.player.stop();
    }
    fall() {
        this.fallTimer = new Timer_1.default(() => {
            this.container.y += 10;
            let elms = flatArrayChildren_1.default(this.container.parent.children);
            CheckCollision_1.default(elms, this.container, ["Brick"], (elm) => {
                if (this.container.y + this.container.h > elm.y) {
                    this.container.y = elm.y - this.container.h - 1;
                }
                else {
                    this.container.y -= 10;
                }
                this.stand = true;
            });
            if (this.container.y + this.container.h > 500) {
                this.container.y = 500 - this.container.h - 1;
                if (this.begin) {
                    this.fallTimer.clear();
                    this.fallTimer = null;
                    alert("GG");
                    location.reload();
                }
            }
        }, this.fps);
    }
    jumpFall(d) {
        let tmpY = this.container.y;
        this.container.y = d;
        let elms = flatArrayChildren_1.default(this.container.parent.children);
        CheckCollision_1.default(elms, this.container, ["Brick"], (elm) => {
            // ?????????????????????
            if (this.container.y + this.container.h > elm.y) {
                this.container.y = elm.y - this.container.h - 1;
            }
            else {
                this.container.y = tmpY;
            }
            this.stand = true;
            this.jumpTimer.clear();
            this.jumpTimer = null;
        });
    }
    // ??????????????????
    jump(f) {
        if (this.jumpTimer) {
            return;
        }
        this.stand = false;
        // sin?????????
        // Math.sin(d % 180 * Math.PI / 180)
        // ?????????????????????????????????????????????????????????????????????????????????x???x0??????x1?????????dx?????????????????????180???y???y0??????y1?????????y??????????????????sin(x)????????????????????????xy???????????????????????????????????????
        let y0 = this.container.y;
        let dx = 0;
        let dy = 0;
        this.jumpTimer = new Timer_1.default(() => {
            if (dx < 180 && dx > -180) {
                dx += 5 * f;
                dy = Math.floor(Math.sin(Math.abs(dx) % 180 * Math.PI / 180) * 70);
            }
            else {
                this.jumpTimer.clear();
                this.jumpTimer = null;
            }
            this.jumpFall(y0 - dy);
        }, this.fps);
    }
}
exports.default = PersonElm;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getElementPoints(element) {
    let t = [];
    t.push({
        x: element.x,
        y: element.y,
    });
    t.push({
        x: element.x + element.w,
        y: element.y,
    });
    t.push({
        x: element.x + element.w,
        y: element.y + element.h,
    });
    t.push({
        x: element.x,
        y: element.y + element.h,
    });
    return {
        points: t,
    };
}
const isCollision_1 = __webpack_require__(11);
function CheckCollision(elms, elm, type, cb) {
    // ???????????????????????????????????????????????????????????????????????????????????????elm????????????????????????????????????
    // ????????????????????????????????????????????????????????????????????????????????????????????????60???????????????????????????20??????????????????????????????100px?????????????????????????????????????????????
    // ??????2?????????????????????t2.x???????????????t1.x - 60 ???????????????????????????????????????????????????????????????
    // ?????????????????????????????????????????????
    let checkElms = elms.filter(item => {
        return type.includes(item.type) &&
            item.id != elm.id &&
            (item.x > elm.x - 200 && item.y > elm.y - 200 && item.x < elm.x + elm.w + 200 && item.y < elm.y + elm.h + 200);
    });
    // ???????????????????????????????????????????????????2-5???
    let p = false;
    for (let i = 0; i < checkElms.length; i++) {
        if (isCollision_1.default(getElementPoints(checkElms[i]), getElementPoints(elm))) {
            p = true;
            cb(checkElms[i]);
            break;
        }
    }
    return p;
}
exports.default = CheckCollision;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const getAxes_1 = __webpack_require__(12);
const getProjection_1 = __webpack_require__(13);
function isCollision(poly, poly2) {
    let axes1 = getAxes_1.default(poly.points);
    let axes2 = getAxes_1.default(poly2.points);
    let axes = [...axes1, ...axes2];
    for (let ax of axes) {
        let p1 = getProjection_1.default(ax, poly.points);
        let p2 = getProjection_1.default(ax, poly2.points);
        if (!p1.overlaps(p2)) {
            return false;
        }
    }
    return true;
}
exports.default = isCollision;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(4);
// ?????????????????????????????????
function getAxes(points) {
    let axes = [];
    for (let i = 0, j = points.length - 1; i < j; i++) {
        let v1 = new Vector_1.default(points[i].x, points[i].y);
        let v2 = new Vector_1.default(points[i + 1].x, points[i + 1].y);
        axes.push(v1.sub(v2).perp().unit());
    }
    let firstPoint = points[0];
    let lastPoint = points[points.length - 1];
    let v1 = new Vector_1.default(lastPoint.x, lastPoint.y);
    let v2 = new Vector_1.default(firstPoint.x, firstPoint.y);
    axes.push(v1.sub(v2).perp().unit());
    return axes;
}
exports.default = getAxes;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Projection_1 = __webpack_require__(14);
const Vector_1 = __webpack_require__(4);
// ??????????????????????????????????????????????????????
function getProjection(v, points) {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    points.forEach(point => {
        let p = new Vector_1.default(point.x, point.y);
        let dotProduct = p.dot(v);
        min = Math.min(min, dotProduct);
        max = Math.max(max, dotProduct);
    });
    return new Projection_1.default(min, max);
}
exports.default = getProjection;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// ??????
class Projection {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    // 2?????????????????????
    overlaps(p) {
        return this.max > p.min && this.min < p.max;
    }
}
exports.default = Projection;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AutoZindex_1 = __webpack_require__(2);
const guid_1 = __webpack_require__(3);
// ???????????? ??????????????????icon???????????????container???icon??????????????????container???active?????????
class Container {
    constructor(option) {
        this.name = option.name;
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.id = option.id ? option.id : guid_1.default();
        this.zindex = option.zindex ? option.zindex : AutoZindex_1.default.getIndex();
        this.active = false;
        this.children = [];
        this.buildInChildren = [];
        this.type = "container";
        this.parent = null;
    }
    add(child) {
        child.parent = this;
        this.children.push(child);
    }
    remove(child) {
        let index = this.parent.children.findIndex((item) => item.id == child.id);
        index != -1 && this.parent.children.splice(index, 1);
    }
    destory() {
        this.parent.remove(this);
    }
    draw(ctx) {
        // ?????????????????????????????????container???????????????container???(100, 100)????????????1???(20, 20)??????????????????1??????????????????(120, 120)
        this.children.forEach((item) => {
            item.updatePosition(this.x, this.y);
            item.draw(ctx);
        });
    }
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // ?????????????????????
    pointInElement(x, y) {
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = Container;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BasicElement_1 = __webpack_require__(1);
const Timer_1 = __webpack_require__(0);
// player
class Person extends BasicElement_1.default {
    constructor(option) {
        super(option);
        this.offsetX = option.offsetX;
        this.offsetY = option.offsetY;
        this.w = option.w;
        this.h = option.h;
        this.image = new Image();
        this.image.src = "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da9a108504204c22a7a9fb74c47a04ed~tplv-k3u1fbpfcp-watermark.image?";
        this.run = false;
        this.runIndex = 0;
        this.lastTime = 0;
        this.timer = null;
        this.fps = 100;
    }
    draw(ctx) {
        ctx.drawImage(this.image, 0 + this.runIndex % 8 * this.w, 0, this.w, this.h, this.x + this.offsetX, this.y + this.offsetY, this.w, this.h);
    }
    animate() {
        this.timer = new Timer_1.default(() => {
            this.runIndex++;
        }, this.fps);
    }
    play() {
        this.run = true;
        this.animate();
    }
    stop() {
        this.run = false;
        this.timer.clear();
    }
    pointInElement(x, y) {
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}
exports.default = Person;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const flatArrayChildren_1 = __webpack_require__(5);
// ?????????
class Stage {
    constructor(canvas) {
        // mouseDown?????????????????????this???????????????
        this.mouseDown = (e) => {
            let that = this;
            // ??????target?????????
            this.clickX = e.offsetX;
            this.clickY = e.offsetY;
            // ??????????????????????????????????????????????????????zindex????????????????????????
            // ???????????????rect
            // ???children???children???children????????????????????????????????????
            this.flatElements = flatArrayChildren_1.default(this.children);
            // ????????????????????????????????????
            let clickElements = this.flatElements.filter((item) => {
                return item.pointInElement && item.pointInElement(e.offsetX, e.offsetY, that.ctx);
            });
            // ?????????zindex???????????????
            let target = clickElements.find((item) => item.zindex == Math.max(...clickElements.map((item) => item.zindex)));
            // this.clearChildrenActive();
            // console.log(target)
            if (target) {
                // **?????????????????????taget????????????target????????????????????????????????????????????????????????????**
                this.target = target;
                this.target.active = true;
                // ????????????????????????????????????target??????????????????
                this.targetDx = this.clickX - target.x;
                this.targetDy = this.clickY - target.y;
                this.canvas.style.cursor = "all-scroll";
                this.target.dispatchEvent && this.target.dispatchEvent("click");
                this.canvas.addEventListener("mousemove", this.targetMove, false);
            }
        };
        this.targetMove = (e) => {
            let moveX = e.offsetX - this.clickX;
            let moveY = e.offsetY - this.clickY;
            if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
                this.isDrag = true;
            }
            this.target.dispatchEvent && this.target.dispatchEvent("move");
            // ???????????????????????????
            // ????????????????????????????????????????????????????????????????????????move??????
            // Stage.DragElement.indexOf(this.target.type) != -1
            //     ? this.target.updatePosition && this.target.updatePosition(this.clickX + moveX - this.targetDx, this.clickY + moveY - this.targetDy)
            //     : this.target.parent.updatePosition && this.target.parent.updatePosition(
            //           this.clickX + moveX - this.targetDx - this.target.offsetX,
            //           this.clickY + moveY - this.targetDy - this.target.offsetY
            //       );
        };
        // ?????????canvas
        this.canvas = typeof canvas == "string" ? document.getElementById(canvas) : canvas;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx = this.canvas.getContext("2d");
        this.children = [];
        this.flatElements = [];
        // ???????????????????????????
        this.target = null;
        // ??????????????????canvas???xy?????????
        this.clickX = null;
        this.clickY = null;
        // ???????????????????????????????????????????????????????????????????????????????????????
        this.targetDx = 0;
        this.targetDy = 0;
        // ???????????????????????????mousemove????????????????????????????????????
        this.isDrag = false;
        // ??????????????????????????????????????????????????????container???????????????container????????????????????????????????????container
        Stage.DragElement = ["container"];
        this.initEvent();
    }
    initEvent() {
        // ?????????down?????????????????????????????????move??????
        this.canvas.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("mouseup", () => {
            this.canvas.style.cursor = "";
            if (this.isDrag) {
                this.clearChildrenActive();
                this.isDrag = false;
                // this.target = null
            }
            this.target && this.target.dispatchEvent && this.target.dispatchEvent("mouseup");
            this.target = null;
            this.canvas.removeEventListener("mousemove", this.targetMove, false);
        });
    }
    clearChildrenActive() {
        // ?????????????????????????????????
        this.children.forEach((item) => item.setActive(false));
    }
    add(child) {
        this.children.push(child);
        child.parent = this;
        this.render();
    }
    remove(child) {
        let index = this.children.findIndex((item) => item.id == child.id);
        index != -1 && this.children.splice(index, 1);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
    }
    render() {
        requestAnimationFrame(Stage.prototype.render.bind(this));
        this.clear();
        this.children.sort((a, b) => {
            return a.zindex - b.zindex;
        });
        // ?????????????????????????????????zindex?????????????????????
        this.children.forEach((item) => item.draw(this.ctx));
    }
}
exports.default = Stage;


/***/ })
/******/ ]);
//# sourceMappingURL=main.ce58e6b1.js.map