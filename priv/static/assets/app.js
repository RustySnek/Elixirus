var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// vendor/topbar.js
var require_topbar = __commonJS((exports, module) => {
  (function(window2, document2) {
    (function() {
      var lastTime = 0;
      var vendors = ["ms", "moz", "webkit", "o"];
      for (var x = 0;x < vendors.length && !window2.requestAnimationFrame; ++x) {
        window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
        window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
      }
      if (!window2.requestAnimationFrame)
        window2.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window2.setTimeout(function() {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      if (!window2.cancelAnimationFrame)
        window2.cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
    })();
    var canvas, currentProgress, showing, progressTimerId = null, fadeTimerId = null, delayTimerId = null, addEvent = function(elem, type, handler) {
      if (elem.addEventListener)
        elem.addEventListener(type, handler, false);
      else if (elem.attachEvent)
        elem.attachEvent("on" + type, handler);
      else
        elem["on" + type] = handler;
    }, options = {
      autoRun: true,
      barThickness: 3,
      barColors: {
        0: "rgba(26,  188, 156, .9)",
        ".25": "rgba(52,  152, 219, .9)",
        ".50": "rgba(241, 196, 15,  .9)",
        ".75": "rgba(230, 126, 34,  .9)",
        "1.0": "rgba(211, 84,  0,   .9)"
      },
      shadowBlur: 10,
      shadowColor: "rgba(0,   0,   0,   .6)",
      className: null
    }, repaint = function() {
      canvas.width = window2.innerWidth;
      canvas.height = options.barThickness * 5;
      var ctx = canvas.getContext("2d");
      ctx.shadowBlur = options.shadowBlur;
      ctx.shadowColor = options.shadowColor;
      var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      for (var stop in options.barColors)
        lineGradient.addColorStop(stop, options.barColors[stop]);
      ctx.lineWidth = options.barThickness;
      ctx.beginPath();
      ctx.moveTo(0, options.barThickness / 2);
      ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
      ctx.strokeStyle = lineGradient;
      ctx.stroke();
    }, createCanvas = function() {
      canvas = document2.createElement("canvas");
      var style = canvas.style;
      style.position = "fixed";
      style.top = style.left = style.right = style.margin = style.padding = 0;
      style.zIndex = 100001;
      style.display = "none";
      if (options.className)
        canvas.classList.add(options.className);
      document2.body.appendChild(canvas);
      addEvent(window2, "resize", repaint);
    }, topbar = {
      config: function(opts) {
        for (var key in opts)
          if (options.hasOwnProperty(key))
            options[key] = opts[key];
      },
      show: function(delay) {
        if (showing)
          return;
        if (delay) {
          if (delayTimerId)
            return;
          delayTimerId = setTimeout(() => topbar.show(), delay);
        } else {
          showing = true;
          if (fadeTimerId !== null)
            window2.cancelAnimationFrame(fadeTimerId);
          if (!canvas)
            createCanvas();
          canvas.style.opacity = 1;
          canvas.style.display = "block";
          topbar.progress(0);
          if (options.autoRun) {
            (function loop() {
              progressTimerId = window2.requestAnimationFrame(loop);
              topbar.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
            })();
          }
        }
      },
      progress: function(to) {
        if (typeof to === "undefined")
          return currentProgress;
        if (typeof to === "string") {
          to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
        }
        currentProgress = to > 1 ? 1 : to;
        repaint();
        return currentProgress;
      },
      hide: function() {
        clearTimeout(delayTimerId);
        delayTimerId = null;
        if (!showing)
          return;
        showing = false;
        if (progressTimerId != null) {
          window2.cancelAnimationFrame(progressTimerId);
          progressTimerId = null;
        }
        (function loop() {
          if (topbar.progress("+.1") >= 1) {
            canvas.style.opacity -= 0.05;
            if (canvas.style.opacity <= 0.05) {
              canvas.style.display = "none";
              fadeTimerId = null;
              return;
            }
          }
          fadeTimerId = window2.requestAnimationFrame(loop);
        })();
      }
    };
    if (typeof module === "object" && typeof exports === "object") {
      module.exports = topbar;
    } else if (typeof define === "function" && define.amd) {
      define(function() {
        return topbar;
      });
    } else {
      this.topbar = topbar;
    }
  }).call(exports, window, document);
});

// /home/poro/Projects/Elixir/elixirus/node_modules/phoenix_html/priv/static/phoenix_html.js
(function() {
  var PolyfillEvent = eventConstructor();
  function eventConstructor() {
    if (typeof window.CustomEvent === "function")
      return window.CustomEvent;
    function CustomEvent2(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent2.prototype = window.Event.prototype;
    return CustomEvent2;
  }
  function buildHiddenInput(name, value) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }
  function handleClick(element, targetModifierKey) {
    var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
    form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
    form.action = to;
    form.style.display = "none";
    if (target)
      form.target = target;
    else if (targetModifierKey)
      form.target = "_blank";
    form.appendChild(csrf);
    form.appendChild(method);
    document.body.appendChild(form);
    submit.type = "submit";
    form.appendChild(submit);
    submit.click();
  }
  window.addEventListener("click", function(e) {
    var element = e.target;
    if (e.defaultPrevented)
      return;
    while (element && element.getAttribute) {
      var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
        bubbles: true,
        cancelable: true
      });
      if (!element.dispatchEvent(phoenixLinkEvent)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
      if (element.getAttribute("data-method")) {
        handleClick(element, e.metaKey || e.shiftKey);
        e.preventDefault();
        return false;
      } else {
        element = element.parentNode;
      }
    }
  }, false);
  window.addEventListener("phoenix.link.click", function(e) {
    var message = e.target.getAttribute("data-confirm");
    if (message && !window.confirm(message)) {
      e.preventDefault();
    }
  }, false);
})();

// /home/poro/Projects/Elixir/elixirus/node_modules/phoenix/priv/static/phoenix.mjs
var closure = (value) => {
  if (typeof value === "function") {
    return value;
  } else {
    let closure2 = function() {
      return value;
    };
    return closure2;
  }
};
var globalSelf = typeof self !== "undefined" ? self : null;
var phxWindow = typeof window !== "undefined" ? window : null;
var global = globalSelf || phxWindow || global;
var DEFAULT_VSN = "2.0.0";
var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
var DEFAULT_TIMEOUT = 1e4;
var WS_CLOSE_NORMAL = 1000;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining",
  leaving: "leaving"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
var TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};
var XHR_STATES = {
  complete: 4
};
var Push = class {
  constructor(channel, event, payload, timeout) {
    this.channel = channel;
    this.event = event;
    this.payload = payload || function() {
      return {};
    };
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }
  resend(timeout) {
    this.timeout = timeout;
    this.reset();
    this.send();
  }
  send() {
    if (this.hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload(),
      ref: this.ref,
      join_ref: this.channel.joinRef()
    });
  }
  receive(status, callback) {
    if (this.hasReceived(status)) {
      callback(this.receivedResp.response);
    }
    this.recHooks.push({ status, callback });
    return this;
  }
  reset() {
    this.cancelRefEvent();
    this.ref = null;
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
  }
  matchReceive({ status, response, _ref }) {
    this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
  }
  cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel.off(this.refEvent);
  }
  cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = null;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      this.cancelTimeout();
    }
    this.ref = this.channel.socket.makeRef();
    this.refEvent = this.channel.replyEventName(this.ref);
    this.channel.on(this.refEvent, (payload) => {
      this.cancelRefEvent();
      this.cancelTimeout();
      this.receivedResp = payload;
      this.matchReceive(payload);
    });
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
  trigger(status, response) {
    this.channel.trigger(this.refEvent, { status, response });
  }
};
var Timer = class {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
};
var Channel = class {
  constructor(topic, params, socket) {
    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = closure(params || {});
    this.socket = socket;
    this.bindings = [];
    this.bindingRef = 0;
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.stateChangeRefs = [];
    this.rejoinTimer = new Timer(() => {
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }, this.socket.rejoinAfterMs);
    this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
    this.stateChangeRefs.push(this.socket.onOpen(() => {
      this.rejoinTimer.reset();
      if (this.isErrored()) {
        this.rejoin();
      }
    }));
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach((pushEvent) => pushEvent.send());
      this.pushBuffer = [];
    });
    this.joinPush.receive("error", () => {
      this.state = CHANNEL_STATES.errored;
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.onClose(() => {
      this.rejoinTimer.reset();
      if (this.socket.hasLogger())
        this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
      this.state = CHANNEL_STATES.closed;
      this.socket.remove(this);
    });
    this.onError((reason) => {
      if (this.socket.hasLogger())
        this.socket.log("channel", `error ${this.topic}`, reason);
      if (this.isJoining()) {
        this.joinPush.reset();
      }
      this.state = CHANNEL_STATES.errored;
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.joinPush.receive("timeout", () => {
      if (this.socket.hasLogger())
        this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
      leavePush.send();
      this.state = CHANNEL_STATES.errored;
      this.joinPush.reset();
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload);
    });
  }
  join(timeout = this.timeout) {
    if (this.joinedOnce) {
      throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
    } else {
      this.timeout = timeout;
      this.joinedOnce = true;
      this.rejoin();
      return this.joinPush;
    }
  }
  onClose(callback) {
    this.on(CHANNEL_EVENTS.close, callback);
  }
  onError(callback) {
    return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
  }
  on(event, callback) {
    let ref = this.bindingRef++;
    this.bindings.push({ event, ref, callback });
    return ref;
  }
  off(event, ref) {
    this.bindings = this.bindings.filter((bind) => {
      return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
    });
  }
  canPush() {
    return this.socket.isConnected() && this.isJoined();
  }
  push(event, payload, timeout = this.timeout) {
    payload = payload || {};
    if (!this.joinedOnce) {
      throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
    }
    let pushEvent = new Push(this, event, function() {
      return payload;
    }, timeout);
    if (this.canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }
    return pushEvent;
  }
  leave(timeout = this.timeout) {
    this.rejoinTimer.reset();
    this.joinPush.cancelTimeout();
    this.state = CHANNEL_STATES.leaving;
    let onClose = () => {
      if (this.socket.hasLogger())
        this.socket.log("channel", `leave ${this.topic}`);
      this.trigger(CHANNEL_EVENTS.close, "leave");
    };
    let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
    leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
    leavePush.send();
    if (!this.canPush()) {
      leavePush.trigger("ok", {});
    }
    return leavePush;
  }
  onMessage(_event, payload, _ref) {
    return payload;
  }
  isMember(topic, event, payload, joinRef) {
    if (this.topic !== topic) {
      return false;
    }
    if (joinRef && joinRef !== this.joinRef()) {
      if (this.socket.hasLogger())
        this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
      return false;
    } else {
      return true;
    }
  }
  joinRef() {
    return this.joinPush.ref;
  }
  rejoin(timeout = this.timeout) {
    if (this.isLeaving()) {
      return;
    }
    this.socket.leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }
  trigger(event, payload, ref, joinRef) {
    let handledPayload = this.onMessage(event, payload, ref, joinRef);
    if (payload && !handledPayload) {
      throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
    }
    let eventBindings = this.bindings.filter((bind) => bind.event === event);
    for (let i = 0;i < eventBindings.length; i++) {
      let bind = eventBindings[i];
      bind.callback(handledPayload, ref, joinRef || this.joinRef());
    }
  }
  replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }
  isErrored() {
    return this.state === CHANNEL_STATES.errored;
  }
  isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }
  isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }
  isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }
};
var Ajax = class {
  static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
    if (global.XDomainRequest) {
      let req = new global.XDomainRequest;
      return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
    } else {
      let req = new global.XMLHttpRequest;
      return this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
    }
  }
  static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
    req.timeout = timeout;
    req.open(method, endPoint);
    req.onload = () => {
      let response = this.parseJSON(req.responseText);
      callback && callback(response);
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }
    req.onprogress = () => {
    };
    req.send(body);
    return req;
  }
  static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
    req.open(method, endPoint, true);
    req.timeout = timeout;
    req.setRequestHeader("Content-Type", accept);
    req.onerror = () => callback && callback(null);
    req.onreadystatechange = () => {
      if (req.readyState === XHR_STATES.complete && callback) {
        let response = this.parseJSON(req.responseText);
        callback(response);
      }
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }
    req.send(body);
    return req;
  }
  static parseJSON(resp) {
    if (!resp || resp === "") {
      return null;
    }
    try {
      return JSON.parse(resp);
    } catch (e) {
      console && console.log("failed to parse JSON response", resp);
      return null;
    }
  }
  static serialize(obj, parentKey) {
    let queryStr = [];
    for (var key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        continue;
      }
      let paramKey = parentKey ? `${parentKey}[${key}]` : key;
      let paramVal = obj[key];
      if (typeof paramVal === "object") {
        queryStr.push(this.serialize(paramVal, paramKey));
      } else {
        queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
      }
    }
    return queryStr.join("&");
  }
  static appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    let prefix = url.match(/\?/) ? "&" : "?";
    return `${url}${prefix}${this.serialize(params)}`;
  }
};
var arrayBufferToBase64 = (buffer) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0;i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
var LongPoll = class {
  constructor(endPoint) {
    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.reqs = new Set;
    this.awaitingBatchAck = false;
    this.currentBatch = null;
    this.currentBatchTimer = null;
    this.batchBuffer = [];
    this.onopen = function() {
    };
    this.onerror = function() {
    };
    this.onmessage = function() {
    };
    this.onclose = function() {
    };
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;
    this.poll();
  }
  normalizeEndpoint(endPoint) {
    return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
  }
  endpointURL() {
    return Ajax.appendParams(this.pollEndpoint, { token: this.token });
  }
  closeAndRetry(code, reason, wasClean) {
    this.close(code, reason, wasClean);
    this.readyState = SOCKET_STATES.connecting;
  }
  ontimeout() {
    this.onerror("timeout");
    this.closeAndRetry(1005, "timeout", false);
  }
  isActive() {
    return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
  }
  poll() {
    this.ajax("GET", "application/json", null, () => this.ontimeout(), (resp) => {
      if (resp) {
        var { status, token, messages } = resp;
        this.token = token;
      } else {
        status = 0;
      }
      switch (status) {
        case 200:
          messages.forEach((msg) => {
            setTimeout(() => this.onmessage({ data: msg }), 0);
          });
          this.poll();
          break;
        case 204:
          this.poll();
          break;
        case 410:
          this.readyState = SOCKET_STATES.open;
          this.onopen({});
          this.poll();
          break;
        case 403:
          this.onerror(403);
          this.close(1008, "forbidden", false);
          break;
        case 0:
        case 500:
          this.onerror(500);
          this.closeAndRetry(1011, "internal server error", 500);
          break;
        default:
          throw new Error(`unhandled poll status ${status}`);
      }
    });
  }
  send(body) {
    if (typeof body !== "string") {
      body = arrayBufferToBase64(body);
    }
    if (this.currentBatch) {
      this.currentBatch.push(body);
    } else if (this.awaitingBatchAck) {
      this.batchBuffer.push(body);
    } else {
      this.currentBatch = [body];
      this.currentBatchTimer = setTimeout(() => {
        this.batchSend(this.currentBatch);
        this.currentBatch = null;
      }, 0);
    }
  }
  batchSend(messages) {
    this.awaitingBatchAck = true;
    this.ajax("POST", "application/x-ndjson", messages.join("\n"), () => this.onerror("timeout"), (resp) => {
      this.awaitingBatchAck = false;
      if (!resp || resp.status !== 200) {
        this.onerror(resp && resp.status);
        this.closeAndRetry(1011, "internal server error", false);
      } else if (this.batchBuffer.length > 0) {
        this.batchSend(this.batchBuffer);
        this.batchBuffer = [];
      }
    });
  }
  close(code, reason, wasClean) {
    for (let req of this.reqs) {
      req.abort();
    }
    this.readyState = SOCKET_STATES.closed;
    let opts = Object.assign({ code: 1000, reason: undefined, wasClean: true }, { code, reason, wasClean });
    this.batchBuffer = [];
    clearTimeout(this.currentBatchTimer);
    this.currentBatchTimer = null;
    if (typeof CloseEvent !== "undefined") {
      this.onclose(new CloseEvent("close", opts));
    } else {
      this.onclose(opts);
    }
  }
  ajax(method, contentType, body, onCallerTimeout, callback) {
    let req;
    let ontimeout = () => {
      this.reqs.delete(req);
      onCallerTimeout();
    };
    req = Ajax.request(method, this.endpointURL(), contentType, body, this.timeout, ontimeout, (resp) => {
      this.reqs.delete(req);
      if (this.isActive()) {
        callback(resp);
      }
    });
    this.reqs.add(req);
  }
};
var serializer_default = {
  HEADER_LENGTH: 1,
  META_LENGTH: 4,
  KINDS: { push: 0, reply: 1, broadcast: 2 },
  encode(msg, callback) {
    if (msg.payload.constructor === ArrayBuffer) {
      return callback(this.binaryEncode(msg));
    } else {
      let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
      return callback(JSON.stringify(payload));
    }
  },
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this.binaryDecode(rawPayload));
    } else {
      let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
      return callback({ join_ref, ref, topic, event, payload });
    }
  },
  binaryEncode(message) {
    let { join_ref, ref, event, topic, payload } = message;
    let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
    let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
    let view = new DataView(header);
    let offset = 0;
    view.setUint8(offset++, this.KINDS.push);
    view.setUint8(offset++, join_ref.length);
    view.setUint8(offset++, ref.length);
    view.setUint8(offset++, topic.length);
    view.setUint8(offset++, event.length);
    Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
    var combined = new Uint8Array(header.byteLength + payload.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(payload), header.byteLength);
    return combined.buffer;
  },
  binaryDecode(buffer) {
    let view = new DataView(buffer);
    let kind = view.getUint8(0);
    let decoder = new TextDecoder;
    switch (kind) {
      case this.KINDS.push:
        return this.decodePush(buffer, view, decoder);
      case this.KINDS.reply:
        return this.decodeReply(buffer, view, decoder);
      case this.KINDS.broadcast:
        return this.decodeBroadcast(buffer, view, decoder);
    }
  },
  decodePush(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let topicSize = view.getUint8(2);
    let eventSize = view.getUint8(3);
    let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return { join_ref: joinRef, ref: null, topic, event, payload: data };
  },
  decodeReply(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let refSize = view.getUint8(2);
    let topicSize = view.getUint8(3);
    let eventSize = view.getUint8(4);
    let offset = this.HEADER_LENGTH + this.META_LENGTH;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let ref = decoder.decode(buffer.slice(offset, offset + refSize));
    offset = offset + refSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    let payload = { status: event, response: data };
    return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
  },
  decodeBroadcast(buffer, view, decoder) {
    let topicSize = view.getUint8(1);
    let eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return { join_ref: null, ref: null, topic, event, payload: data };
  }
};
var Socket = class {
  constructor(endPoint, opts = {}) {
    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || global.WebSocket || LongPoll;
    this.establishedConnections = 0;
    this.defaultEncoder = serializer_default.encode.bind(serializer_default);
    this.defaultDecoder = serializer_default.decode.bind(serializer_default);
    this.closeWasClean = false;
    this.binaryType = opts.binaryType || "arraybuffer";
    this.connectClock = 1;
    if (this.transport !== LongPoll) {
      this.encode = opts.encode || this.defaultEncoder;
      this.decode = opts.decode || this.defaultDecoder;
    } else {
      this.encode = this.defaultEncoder;
      this.decode = this.defaultDecoder;
    }
    let awaitingConnectionOnPageShow = null;
    if (phxWindow && phxWindow.addEventListener) {
      phxWindow.addEventListener("pagehide", (_e) => {
        if (this.conn) {
          this.disconnect();
          awaitingConnectionOnPageShow = this.connectClock;
        }
      });
      phxWindow.addEventListener("pageshow", (_e) => {
        if (awaitingConnectionOnPageShow === this.connectClock) {
          awaitingConnectionOnPageShow = null;
          this.connect();
        }
      });
    }
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
    this.rejoinAfterMs = (tries) => {
      if (opts.rejoinAfterMs) {
        return opts.rejoinAfterMs(tries);
      } else {
        return [1000, 2000, 5000][tries - 1] || 1e4;
      }
    };
    this.reconnectAfterMs = (tries) => {
      if (opts.reconnectAfterMs) {
        return opts.reconnectAfterMs(tries);
      } else {
        return [10, 50, 100, 150, 200, 250, 500, 1000, 2000][tries - 1] || 5000;
      }
    };
    this.logger = opts.logger || null;
    this.longpollerTimeout = opts.longpollerTimeout || 20000;
    this.params = closure(opts.params || {});
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    this.vsn = opts.vsn || DEFAULT_VSN;
    this.heartbeatTimeoutTimer = null;
    this.heartbeatTimer = null;
    this.pendingHeartbeatRef = null;
    this.reconnectTimer = new Timer(() => {
      this.teardown(() => this.connect());
    }, this.reconnectAfterMs);
  }
  getLongPollTransport() {
    return LongPoll;
  }
  replaceTransport(newTransport) {
    this.connectClock++;
    this.closeWasClean = true;
    this.reconnectTimer.reset();
    this.sendBuffer = [];
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
    this.transport = newTransport;
  }
  protocol() {
    return location.protocol.match(/^https/) ? "wss" : "ws";
  }
  endPointURL() {
    let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
    if (uri.charAt(0) !== "/") {
      return uri;
    }
    if (uri.charAt(1) === "/") {
      return `${this.protocol()}:${uri}`;
    }
    return `${this.protocol()}://${location.host}${uri}`;
  }
  disconnect(callback, code, reason) {
    this.connectClock++;
    this.closeWasClean = true;
    this.reconnectTimer.reset();
    this.teardown(callback, code, reason);
  }
  connect(params) {
    if (params) {
      console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
      this.params = closure(params);
    }
    if (this.conn) {
      return;
    }
    this.connectClock++;
    this.closeWasClean = false;
    this.conn = new this.transport(this.endPointURL());
    this.conn.binaryType = this.binaryType;
    this.conn.timeout = this.longpollerTimeout;
    this.conn.onopen = () => this.onConnOpen();
    this.conn.onerror = (error) => this.onConnError(error);
    this.conn.onmessage = (event) => this.onConnMessage(event);
    this.conn.onclose = (event) => this.onConnClose(event);
  }
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  hasLogger() {
    return this.logger !== null;
  }
  onOpen(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.open.push([ref, callback]);
    return ref;
  }
  onClose(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.close.push([ref, callback]);
    return ref;
  }
  onError(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.error.push([ref, callback]);
    return ref;
  }
  onMessage(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.message.push([ref, callback]);
    return ref;
  }
  ping(callback) {
    if (!this.isConnected()) {
      return false;
    }
    let ref = this.makeRef();
    let startTime = Date.now();
    this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
    let onMsgRef = this.onMessage((msg) => {
      if (msg.ref === ref) {
        this.off([onMsgRef]);
        callback(Date.now() - startTime);
      }
    });
    return true;
  }
  clearHeartbeats() {
    clearTimeout(this.heartbeatTimer);
    clearTimeout(this.heartbeatTimeoutTimer);
  }
  onConnOpen() {
    if (this.hasLogger())
      this.log("transport", `connected to ${this.endPointURL()}`);
    this.closeWasClean = false;
    this.establishedConnections++;
    this.flushSendBuffer();
    this.reconnectTimer.reset();
    this.resetHeartbeat();
    this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
  }
  heartbeatTimeout() {
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      if (this.hasLogger()) {
        this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      }
      this.triggerChanError();
      this.closeWasClean = false;
      this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
    }
  }
  resetHeartbeat() {
    if (this.conn && this.conn.skipHeartbeat) {
      return;
    }
    this.pendingHeartbeatRef = null;
    this.clearHeartbeats();
    this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
  }
  teardown(callback, code, reason) {
    if (!this.conn) {
      return callback && callback();
    }
    this.waitForBufferDone(() => {
      if (this.conn) {
        if (code) {
          this.conn.close(code, reason || "");
        } else {
          this.conn.close();
        }
      }
      this.waitForSocketClosed(() => {
        if (this.conn) {
          this.conn.onopen = function() {
          };
          this.conn.onerror = function() {
          };
          this.conn.onmessage = function() {
          };
          this.conn.onclose = function() {
          };
          this.conn = null;
        }
        callback && callback();
      });
    });
  }
  waitForBufferDone(callback, tries = 1) {
    if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
      callback();
      return;
    }
    setTimeout(() => {
      this.waitForBufferDone(callback, tries + 1);
    }, 150 * tries);
  }
  waitForSocketClosed(callback, tries = 1) {
    if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
      callback();
      return;
    }
    setTimeout(() => {
      this.waitForSocketClosed(callback, tries + 1);
    }, 150 * tries);
  }
  onConnClose(event) {
    let closeCode = event && event.code;
    if (this.hasLogger())
      this.log("transport", "close", event);
    this.triggerChanError();
    this.clearHeartbeats();
    if (!this.closeWasClean && closeCode !== 1000) {
      this.reconnectTimer.scheduleTimeout();
    }
    this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
  }
  onConnError(error) {
    if (this.hasLogger())
      this.log("transport", error);
    let transportBefore = this.transport;
    let establishedBefore = this.establishedConnections;
    this.stateChangeCallbacks.error.forEach(([, callback]) => {
      callback(error, transportBefore, establishedBefore);
    });
    if (transportBefore === this.transport || establishedBefore > 0) {
      this.triggerChanError();
    }
  }
  triggerChanError() {
    this.channels.forEach((channel) => {
      if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
        channel.trigger(CHANNEL_EVENTS.error);
      }
    });
  }
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return "connecting";
      case SOCKET_STATES.open:
        return "open";
      case SOCKET_STATES.closing:
        return "closing";
      default:
        return "closed";
    }
  }
  isConnected() {
    return this.connectionState() === "open";
  }
  remove(channel) {
    this.off(channel.stateChangeRefs);
    this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
  }
  off(refs) {
    for (let key in this.stateChangeCallbacks) {
      this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
        return refs.indexOf(ref) === -1;
      });
    }
  }
  channel(topic, chanParams = {}) {
    let chan = new Channel(topic, chanParams, this);
    this.channels.push(chan);
    return chan;
  }
  push(data) {
    if (this.hasLogger()) {
      let { topic, event, payload, ref, join_ref } = data;
      this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
    }
    if (this.isConnected()) {
      this.encode(data, (result) => this.conn.send(result));
    } else {
      this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
    }
  }
  makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  sendHeartbeat() {
    if (this.pendingHeartbeatRef && !this.isConnected()) {
      return;
    }
    this.pendingHeartbeatRef = this.makeRef();
    this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
    this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
  }
  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback());
      this.sendBuffer = [];
    }
  }
  onConnMessage(rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      let { topic, event, payload, ref, join_ref } = msg;
      if (ref && ref === this.pendingHeartbeatRef) {
        this.clearHeartbeats();
        this.pendingHeartbeatRef = null;
        this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
      }
      if (this.hasLogger())
        this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
      for (let i = 0;i < this.channels.length; i++) {
        const channel = this.channels[i];
        if (!channel.isMember(topic, event, payload, join_ref)) {
          continue;
        }
        channel.trigger(event, payload, ref, join_ref);
      }
      for (let i = 0;i < this.stateChangeCallbacks.message.length; i++) {
        let [, callback] = this.stateChangeCallbacks.message[i];
        callback(msg);
      }
    });
  }
  leaveOpenTopic(topic) {
    let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
    if (dupChannel) {
      if (this.hasLogger())
        this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.leave();
    }
  }
};

// /home/poro/Projects/Elixir/elixirus/node_modules/phoenix_live_view/priv/static/phoenix_live_view.esm.js
var detectDuplicateIds = function() {
  let ids = new Set;
  let elems = document.querySelectorAll("*[id]");
  for (let i = 0, len = elems.length;i < len; i++) {
    if (ids.has(elems[i].id)) {
      console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
    } else {
      ids.add(elems[i].id);
    }
  }
};
var morphAttrs = function(fromNode, toNode) {
  var toNodeAttrs = toNode.attributes;
  var attr;
  var attrName;
  var attrNamespaceURI;
  var attrValue;
  var fromValue;
  if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
    return;
  }
  for (var i = toNodeAttrs.length - 1;i >= 0; i--) {
    attr = toNodeAttrs[i];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    attrValue = attr.value;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
      if (fromValue !== attrValue) {
        if (attr.prefix === "xmlns") {
          attrName = attr.name;
        }
        fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
      }
    } else {
      fromValue = fromNode.getAttribute(attrName);
      if (fromValue !== attrValue) {
        fromNode.setAttribute(attrName, attrValue);
      }
    }
  }
  var fromNodeAttrs = fromNode.attributes;
  for (var d = fromNodeAttrs.length - 1;d >= 0; d--) {
    attr = fromNodeAttrs[d];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
        fromNode.removeAttributeNS(attrNamespaceURI, attrName);
      }
    } else {
      if (!toNode.hasAttribute(attrName)) {
        fromNode.removeAttribute(attrName);
      }
    }
  }
};
var createFragmentFromTemplate = function(str) {
  var template = doc.createElement("template");
  template.innerHTML = str;
  return template.content.childNodes[0];
};
var createFragmentFromRange = function(str) {
  if (!range) {
    range = doc.createRange();
    range.selectNode(doc.body);
  }
  var fragment = range.createContextualFragment(str);
  return fragment.childNodes[0];
};
var createFragmentFromWrap = function(str) {
  var fragment = doc.createElement("body");
  fragment.innerHTML = str;
  return fragment.childNodes[0];
};
var toElement = function(str) {
  str = str.trim();
  if (HAS_TEMPLATE_SUPPORT) {
    return createFragmentFromTemplate(str);
  } else if (HAS_RANGE_SUPPORT) {
    return createFragmentFromRange(str);
  }
  return createFragmentFromWrap(str);
};
var compareNodeNames = function(fromEl, toEl) {
  var fromNodeName = fromEl.nodeName;
  var toNodeName = toEl.nodeName;
  var fromCodeStart, toCodeStart;
  if (fromNodeName === toNodeName) {
    return true;
  }
  fromCodeStart = fromNodeName.charCodeAt(0);
  toCodeStart = toNodeName.charCodeAt(0);
  if (fromCodeStart <= 90 && toCodeStart >= 97) {
    return fromNodeName === toNodeName.toUpperCase();
  } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
    return toNodeName === fromNodeName.toUpperCase();
  } else {
    return false;
  }
};
var createElementNS = function(name, namespaceURI) {
  return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
};
var moveChildren = function(fromEl, toEl) {
  var curChild = fromEl.firstChild;
  while (curChild) {
    var nextChild = curChild.nextSibling;
    toEl.appendChild(curChild);
    curChild = nextChild;
  }
  return toEl;
};
var syncBooleanAttrProp = function(fromEl, toEl, name) {
  if (fromEl[name] !== toEl[name]) {
    fromEl[name] = toEl[name];
    if (fromEl[name]) {
      fromEl.setAttribute(name, "");
    } else {
      fromEl.removeAttribute(name);
    }
  }
};
var noop = function() {
};
var defaultGetNodeKey = function(node) {
  if (node) {
    return node.getAttribute && node.getAttribute("id") || node.id;
  }
};
var morphdomFactory = function(morphAttrs2) {
  return function morphdom2(fromNode, toNode, options) {
    if (!options) {
      options = {};
    }
    if (typeof toNode === "string") {
      if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
        var toNodeHtml = toNode;
        toNode = doc.createElement("html");
        toNode.innerHTML = toNodeHtml;
      } else {
        toNode = toElement(toNode);
      }
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
      toNode = toNode.firstElementChild;
    }
    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
    var skipFromChildren = options.skipFromChildren || noop;
    var addChild = options.addChild || function(parent, child) {
      return parent.appendChild(child);
    };
    var childrenOnly = options.childrenOnly === true;
    var fromNodesLookup = Object.create(null);
    var keyedRemovalList = [];
    function addKeyedRemoval(key) {
      keyedRemovalList.push(key);
    }
    function walkDiscardedChildNodes(node, skipKeyedNodes) {
      if (node.nodeType === ELEMENT_NODE) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = undefined;
          if (skipKeyedNodes && (key = getNodeKey(curChild))) {
            addKeyedRemoval(key);
          } else {
            onNodeDiscarded(curChild);
            if (curChild.firstChild) {
              walkDiscardedChildNodes(curChild, skipKeyedNodes);
            }
          }
          curChild = curChild.nextSibling;
        }
      }
    }
    function removeNode(node, parentNode, skipKeyedNodes) {
      if (onBeforeNodeDiscarded(node) === false) {
        return;
      }
      if (parentNode) {
        parentNode.removeChild(node);
      }
      onNodeDiscarded(node);
      walkDiscardedChildNodes(node, skipKeyedNodes);
    }
    function indexTree(node) {
      if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = getNodeKey(curChild);
          if (key) {
            fromNodesLookup[key] = curChild;
          }
          indexTree(curChild);
          curChild = curChild.nextSibling;
        }
      }
    }
    indexTree(fromNode);
    function handleNodeAdded(el) {
      onNodeAdded(el);
      var curChild = el.firstChild;
      while (curChild) {
        var nextSibling = curChild.nextSibling;
        var key = getNodeKey(curChild);
        if (key) {
          var unmatchedFromEl = fromNodesLookup[key];
          if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
            morphEl(unmatchedFromEl, curChild);
          } else {
            handleNodeAdded(curChild);
          }
        } else {
          handleNodeAdded(curChild);
        }
        curChild = nextSibling;
      }
    }
    function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
      while (curFromNodeChild) {
        var fromNextSibling = curFromNodeChild.nextSibling;
        if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
          addKeyedRemoval(curFromNodeKey);
        } else {
          removeNode(curFromNodeChild, fromEl, true);
        }
        curFromNodeChild = fromNextSibling;
      }
    }
    function morphEl(fromEl, toEl, childrenOnly2) {
      var toElKey = getNodeKey(toEl);
      if (toElKey) {
        delete fromNodesLookup[toElKey];
      }
      if (!childrenOnly2) {
        if (onBeforeElUpdated(fromEl, toEl) === false) {
          return;
        }
        morphAttrs2(fromEl, toEl);
        onElUpdated(fromEl);
        if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
          return;
        }
      }
      if (fromEl.nodeName !== "TEXTAREA") {
        morphChildren(fromEl, toEl);
      } else {
        specialElHandlers.TEXTAREA(fromEl, toEl);
      }
    }
    function morphChildren(fromEl, toEl) {
      var skipFrom = skipFromChildren(fromEl);
      var curToNodeChild = toEl.firstChild;
      var curFromNodeChild = fromEl.firstChild;
      var curToNodeKey;
      var curFromNodeKey;
      var fromNextSibling;
      var toNextSibling;
      var matchingFromEl;
      outer:
        while (curToNodeChild) {
          toNextSibling = curToNodeChild.nextSibling;
          curToNodeKey = getNodeKey(curToNodeChild);
          while (!skipFrom && curFromNodeChild) {
            fromNextSibling = curFromNodeChild.nextSibling;
            if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }
            curFromNodeKey = getNodeKey(curFromNodeChild);
            var curFromNodeType = curFromNodeChild.nodeType;
            var isCompatible = undefined;
            if (curFromNodeType === curToNodeChild.nodeType) {
              if (curFromNodeType === ELEMENT_NODE) {
                if (curToNodeKey) {
                  if (curToNodeKey !== curFromNodeKey) {
                    if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                      if (fromNextSibling === matchingFromEl) {
                        isCompatible = false;
                      } else {
                        fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                        if (curFromNodeKey) {
                          addKeyedRemoval(curFromNodeKey);
                        } else {
                          removeNode(curFromNodeChild, fromEl, true);
                        }
                        curFromNodeChild = matchingFromEl;
                      }
                    } else {
                      isCompatible = false;
                    }
                  }
                } else if (curFromNodeKey) {
                  isCompatible = false;
                }
                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                if (isCompatible) {
                  morphEl(curFromNodeChild, curToNodeChild);
                }
              } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                isCompatible = true;
                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                  curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                }
              }
            }
            if (isCompatible) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }
            if (curFromNodeKey) {
              addKeyedRemoval(curFromNodeKey);
            } else {
              removeNode(curFromNodeChild, fromEl, true);
            }
            curFromNodeChild = fromNextSibling;
          }
          if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
            if (!skipFrom) {
              addChild(fromEl, matchingFromEl);
            }
            morphEl(matchingFromEl, curToNodeChild);
          } else {
            var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
            if (onBeforeNodeAddedResult !== false) {
              if (onBeforeNodeAddedResult) {
                curToNodeChild = onBeforeNodeAddedResult;
              }
              if (curToNodeChild.actualize) {
                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
              }
              addChild(fromEl, curToNodeChild);
              handleNodeAdded(curToNodeChild);
            }
          }
          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;
        }
      cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
      var specialElHandler = specialElHandlers[fromEl.nodeName];
      if (specialElHandler) {
        specialElHandler(fromEl, toEl);
      }
    }
    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;
    if (!childrenOnly) {
      if (morphedNodeType === ELEMENT_NODE) {
        if (toNodeType === ELEMENT_NODE) {
          if (!compareNodeNames(fromNode, toNode)) {
            onNodeDiscarded(fromNode);
            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
          }
        } else {
          morphedNode = toNode;
        }
      } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
        if (toNodeType === morphedNodeType) {
          if (morphedNode.nodeValue !== toNode.nodeValue) {
            morphedNode.nodeValue = toNode.nodeValue;
          }
          return morphedNode;
        } else {
          morphedNode = toNode;
        }
      }
    }
    if (morphedNode === toNode) {
      onNodeDiscarded(fromNode);
    } else {
      if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
        return;
      }
      morphEl(morphedNode, toNode, childrenOnly);
      if (keyedRemovalList) {
        for (var i = 0, len = keyedRemovalList.length;i < len; i++) {
          var elToRemove = fromNodesLookup[keyedRemovalList[i]];
          if (elToRemove) {
            removeNode(elToRemove, elToRemove.parentNode, false);
          }
        }
      }
    }
    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
      if (morphedNode.actualize) {
        morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
      }
      fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }
    return morphedNode;
  };
};
var CONSECUTIVE_RELOADS = "consecutive-reloads";
var MAX_RELOADS = 10;
var RELOAD_JITTER_MIN = 5000;
var RELOAD_JITTER_MAX = 1e4;
var FAILSAFE_JITTER = 30000;
var PHX_EVENT_CLASSES = [
  "phx-click-loading",
  "phx-change-loading",
  "phx-submit-loading",
  "phx-keydown-loading",
  "phx-keyup-loading",
  "phx-blur-loading",
  "phx-focus-loading"
];
var PHX_COMPONENT = "data-phx-component";
var PHX_LIVE_LINK = "data-phx-link";
var PHX_TRACK_STATIC = "track-static";
var PHX_LINK_STATE = "data-phx-link-state";
var PHX_REF = "data-phx-ref";
var PHX_REF_SRC = "data-phx-ref-src";
var PHX_TRACK_UPLOADS = "track-uploads";
var PHX_UPLOAD_REF = "data-phx-upload-ref";
var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
var PHX_DONE_REFS = "data-phx-done-refs";
var PHX_DROP_TARGET = "drop-target";
var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
var PHX_SKIP = "data-phx-skip";
var PHX_PRUNE = "data-phx-prune";
var PHX_PAGE_LOADING = "page-loading";
var PHX_CONNECTED_CLASS = "phx-connected";
var PHX_LOADING_CLASS = "phx-loading";
var PHX_NO_FEEDBACK_CLASS = "phx-no-feedback";
var PHX_ERROR_CLASS = "phx-error";
var PHX_CLIENT_ERROR_CLASS = "phx-client-error";
var PHX_SERVER_ERROR_CLASS = "phx-server-error";
var PHX_PARENT_ID = "data-phx-parent-id";
var PHX_MAIN = "data-phx-main";
var PHX_ROOT_ID = "data-phx-root-id";
var PHX_VIEWPORT_TOP = "viewport-top";
var PHX_VIEWPORT_BOTTOM = "viewport-bottom";
var PHX_TRIGGER_ACTION = "trigger-action";
var PHX_FEEDBACK_FOR = "feedback-for";
var PHX_HAS_FOCUSED = "phx-has-focused";
var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
var CHECKABLE_INPUTS = ["checkbox", "radio"];
var PHX_HAS_SUBMITTED = "phx-has-submitted";
var PHX_SESSION = "data-phx-session";
var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
var PHX_STICKY = "data-phx-sticky";
var PHX_STATIC = "data-phx-static";
var PHX_READONLY = "data-phx-readonly";
var PHX_DISABLED = "data-phx-disabled";
var PHX_DISABLE_WITH = "disable-with";
var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
var PHX_HOOK = "hook";
var PHX_DEBOUNCE = "debounce";
var PHX_THROTTLE = "throttle";
var PHX_UPDATE = "update";
var PHX_STREAM = "stream";
var PHX_STREAM_REF = "data-phx-stream";
var PHX_KEY = "key";
var PHX_PRIVATE = "phxPrivate";
var PHX_AUTO_RECOVER = "auto-recover";
var PHX_LV_DEBUG = "phx:live-socket:debug";
var PHX_LV_PROFILE = "phx:live-socket:profiling";
var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
var PHX_PROGRESS = "progress";
var PHX_MOUNTED = "mounted";
var LOADER_TIMEOUT = 1;
var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
var BINDING_PREFIX = "phx-";
var PUSH_TIMEOUT = 30000;
var DEBOUNCE_TRIGGER = "debounce-trigger";
var THROTTLED = "throttled";
var DEBOUNCE_PREV_KEY = "debounce-prev-key";
var DEFAULTS = {
  debounce: 300,
  throttle: 300
};
var DYNAMICS = "d";
var STATIC = "s";
var COMPONENTS = "c";
var EVENTS = "e";
var REPLY = "r";
var TITLE = "t";
var TEMPLATES = "p";
var STREAM = "stream";
var EntryUploader = class {
  constructor(entry, chunkSize, liveSocket) {
    this.liveSocket = liveSocket;
    this.entry = entry;
    this.offset = 0;
    this.chunkSize = chunkSize;
    this.chunkTimer = null;
    this.errored = false;
    this.uploadChannel = liveSocket.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
  }
  error(reason) {
    if (this.errored) {
      return;
    }
    this.errored = true;
    clearTimeout(this.chunkTimer);
    this.entry.error(reason);
  }
  upload() {
    this.uploadChannel.onError((reason) => this.error(reason));
    this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
  }
  isDone() {
    return this.offset >= this.entry.file.size;
  }
  readNextChunk() {
    let reader = new window.FileReader;
    let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
    reader.onload = (e) => {
      if (e.target.error === null) {
        this.offset += e.target.result.byteLength;
        this.pushChunk(e.target.result);
      } else {
        return logError("Read error: " + e.target.error);
      }
    };
    reader.readAsArrayBuffer(blob);
  }
  pushChunk(chunk) {
    if (!this.uploadChannel.isJoined()) {
      return;
    }
    this.uploadChannel.push("chunk", chunk).receive("ok", () => {
      this.entry.progress(this.offset / this.entry.file.size * 100);
      if (!this.isDone()) {
        this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
      }
    }).receive("error", ({ reason }) => this.error(reason));
  }
};
var logError = (msg, obj) => console.error && console.error(msg, obj);
var isCid = (cid) => {
  let type = typeof cid;
  return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
};
var debug = (view, kind, msg, obj) => {
  if (view.liveSocket.isDebugEnabled()) {
    console.log(`${view.id} ${kind}: ${msg} - `, obj);
  }
};
var closure2 = (val) => typeof val === "function" ? val : function() {
  return val;
};
var clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
var closestPhxBinding = (el, binding, borderEl) => {
  do {
    if (el.matches(`[${binding}]`) && !el.disabled) {
      return el;
    }
    el = el.parentElement || el.parentNode;
  } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
  return null;
};
var isObject = (obj) => {
  return obj !== null && typeof obj === "object" && !(obj instanceof Array);
};
var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
var isEmpty = (obj) => {
  for (let x in obj) {
    return false;
  }
  return true;
};
var maybe = (el, callback) => el && callback(el);
var channelUploader = function(entries, onError, resp, liveSocket) {
  entries.forEach((entry) => {
    let entryUploader = new EntryUploader(entry, resp.config.chunk_size, liveSocket);
    entryUploader.upload();
  });
};
var Browser = {
  canPushState() {
    return typeof history.pushState !== "undefined";
  },
  dropLocal(localStorage, namespace, subkey) {
    return localStorage.removeItem(this.localKey(namespace, subkey));
  },
  updateLocal(localStorage, namespace, subkey, initial, func) {
    let current = this.getLocal(localStorage, namespace, subkey);
    let key = this.localKey(namespace, subkey);
    let newVal = current === null ? initial : func(current);
    localStorage.setItem(key, JSON.stringify(newVal));
    return newVal;
  },
  getLocal(localStorage, namespace, subkey) {
    return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
  },
  updateCurrentState(callback) {
    if (!this.canPushState()) {
      return;
    }
    history.replaceState(callback(history.state || {}), "", window.location.href);
  },
  pushState(kind, meta, to) {
    if (this.canPushState()) {
      if (to !== window.location.href) {
        if (meta.type == "redirect" && meta.scroll) {
          let currentState = history.state || {};
          currentState.scroll = meta.scroll;
          history.replaceState(currentState, "", window.location.href);
        }
        delete meta.scroll;
        history[kind + "State"](meta, "", to || null);
        let hashEl = this.getHashTargetEl(window.location.hash);
        if (hashEl) {
          hashEl.scrollIntoView();
        } else if (meta.type === "redirect") {
          window.scroll(0, 0);
        }
      }
    } else {
      this.redirect(to);
    }
  },
  setCookie(name, value) {
    document.cookie = `${name}=${value}`;
  },
  getCookie(name) {
    return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*\$)|^.*\$`), "$1");
  },
  redirect(toURL, flash) {
    if (flash) {
      Browser.setCookie("__phoenix_flash__", flash + "; max-age=60000; path=/");
    }
    window.location = toURL;
  },
  localKey(namespace, subkey) {
    return `${namespace}-${subkey}`;
  },
  getHashTargetEl(maybeHash) {
    let hash = maybeHash.toString().substring(1);
    if (hash === "") {
      return;
    }
    return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
  }
};
var browser_default = Browser;
var DOM = {
  byId(id) {
    return document.getElementById(id) || logError(`no id found for ${id}`);
  },
  removeClass(el, className) {
    el.classList.remove(className);
    if (el.classList.length === 0) {
      el.removeAttribute("class");
    }
  },
  all(node, query, callback) {
    if (!node) {
      return [];
    }
    let array = Array.from(node.querySelectorAll(query));
    return callback ? array.forEach(callback) : array;
  },
  childNodeLength(html) {
    let template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childElementCount;
  },
  isUploadInput(el) {
    return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
  },
  isAutoUpload(inputEl) {
    return inputEl.hasAttribute("data-phx-auto-upload");
  },
  findUploadInputs(node) {
    return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`);
  },
  findComponentNodeList(node, cid) {
    return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
  },
  isPhxDestroyed(node) {
    return node.id && DOM.private(node, "destroyed") ? true : false;
  },
  wantsNewTab(e) {
    let wantsNewTab = e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button === 1;
    let isDownload = e.target instanceof HTMLAnchorElement && e.target.hasAttribute("download");
    let isTargetBlank = e.target.hasAttribute("target") && e.target.getAttribute("target").toLowerCase() === "_blank";
    return wantsNewTab || isTargetBlank || isDownload;
  },
  isUnloadableFormSubmit(e) {
    let isDialogSubmit = e.target && e.target.getAttribute("method") === "dialog" || e.submitter && e.submitter.getAttribute("formmethod") === "dialog";
    if (isDialogSubmit) {
      return false;
    } else {
      return !e.defaultPrevented && !this.wantsNewTab(e);
    }
  },
  isNewPageClick(e, currentLocation) {
    let href = e.target instanceof HTMLAnchorElement ? e.target.getAttribute("href") : null;
    let url;
    if (e.defaultPrevented || href === null || this.wantsNewTab(e)) {
      return false;
    }
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return false;
    }
    if (e.target.isContentEditable) {
      return false;
    }
    try {
      url = new URL(href);
    } catch (e2) {
      try {
        url = new URL(href, currentLocation);
      } catch (e3) {
        return true;
      }
    }
    if (url.host === currentLocation.host && url.protocol === currentLocation.protocol) {
      if (url.pathname === currentLocation.pathname && url.search === currentLocation.search) {
        return url.hash === "" && !url.href.endsWith("#");
      }
    }
    return url.protocol.startsWith("http");
  },
  markPhxChildDestroyed(el) {
    if (this.isPhxChild(el)) {
      el.setAttribute(PHX_SESSION, "");
    }
    this.putPrivate(el, "destroyed", true);
  },
  findPhxChildrenInFragment(html, parentId) {
    let template = document.createElement("template");
    template.innerHTML = html;
    return this.findPhxChildren(template.content, parentId);
  },
  isIgnored(el, phxUpdate) {
    return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
  },
  isPhxUpdate(el, phxUpdate, updateTypes) {
    return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
  },
  findPhxSticky(el) {
    return this.all(el, `[${PHX_STICKY}]`);
  },
  findPhxChildren(el, parentId) {
    return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
  },
  findParentCIDs(node, cids) {
    let initial = new Set(cids);
    let parentCids = cids.reduce((acc, cid) => {
      let selector = `[${PHX_COMPONENT}="${cid}"] [${PHX_COMPONENT}]`;
      this.filterWithinSameLiveView(this.all(node, selector), node).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => acc.delete(childCID));
      return acc;
    }, initial);
    return parentCids.size === 0 ? new Set(cids) : parentCids;
  },
  filterWithinSameLiveView(nodes, parent) {
    if (parent.querySelector(PHX_VIEW_SELECTOR)) {
      return nodes.filter((el) => this.withinSameLiveView(el, parent));
    } else {
      return nodes;
    }
  },
  withinSameLiveView(node, parent) {
    while (node = node.parentNode) {
      if (node.isSameNode(parent)) {
        return true;
      }
      if (node.getAttribute(PHX_SESSION) !== null) {
        return false;
      }
    }
  },
  private(el, key) {
    return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
  },
  deletePrivate(el, key) {
    el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
  },
  putPrivate(el, key, value) {
    if (!el[PHX_PRIVATE]) {
      el[PHX_PRIVATE] = {};
    }
    el[PHX_PRIVATE][key] = value;
  },
  updatePrivate(el, key, defaultVal, updateFunc) {
    let existing = this.private(el, key);
    if (existing === undefined) {
      this.putPrivate(el, key, updateFunc(defaultVal));
    } else {
      this.putPrivate(el, key, updateFunc(existing));
    }
  },
  copyPrivates(target, source) {
    if (source[PHX_PRIVATE]) {
      target[PHX_PRIVATE] = source[PHX_PRIVATE];
    }
  },
  putTitle(str) {
    let titleEl = document.querySelector("title");
    if (titleEl) {
      let { prefix, suffix } = titleEl.dataset;
      document.title = `${prefix || ""}${str}${suffix || ""}`;
    } else {
      document.title = str;
    }
  },
  debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
    let debounce = el.getAttribute(phxDebounce);
    let throttle = el.getAttribute(phxThrottle);
    if (debounce === "") {
      debounce = defaultDebounce;
    }
    if (throttle === "") {
      throttle = defaultThrottle;
    }
    let value = debounce || throttle;
    switch (value) {
      case null:
        return callback();
      case "blur":
        if (this.once(el, "debounce-blur")) {
          el.addEventListener("blur", () => callback());
        }
        return;
      default:
        let timeout = parseInt(value);
        let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
        let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
        if (isNaN(timeout)) {
          return logError(`invalid throttle/debounce value: ${value}`);
        }
        if (throttle) {
          let newKeyDown = false;
          if (event.type === "keydown") {
            let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
            this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
            newKeyDown = prevKey !== event.key;
          }
          if (!newKeyDown && this.private(el, THROTTLED)) {
            return false;
          } else {
            callback();
            this.putPrivate(el, THROTTLED, true);
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER);
              }
            }, timeout);
          }
        } else {
          setTimeout(() => {
            if (asyncFilter()) {
              this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
            }
          }, timeout);
        }
        let form = el.form;
        if (form && this.once(form, "bind-debounce")) {
          form.addEventListener("submit", () => {
            Array.from(new FormData(form).entries(), ([name]) => {
              let input = form.querySelector(`[name="${name}"]`);
              this.incCycle(input, DEBOUNCE_TRIGGER);
              this.deletePrivate(input, THROTTLED);
            });
          });
        }
        if (this.once(el, "bind-debounce")) {
          el.addEventListener("blur", () => this.triggerCycle(el, DEBOUNCE_TRIGGER));
        }
    }
  },
  triggerCycle(el, key, currentCycle) {
    let [cycle, trigger] = this.private(el, key);
    if (!currentCycle) {
      currentCycle = cycle;
    }
    if (currentCycle === cycle) {
      this.incCycle(el, key);
      trigger();
    }
  },
  once(el, key) {
    if (this.private(el, key) === true) {
      return false;
    }
    this.putPrivate(el, key, true);
    return true;
  },
  incCycle(el, key, trigger = function() {
  }) {
    let [currentCycle] = this.private(el, key) || [0, trigger];
    currentCycle++;
    this.putPrivate(el, key, [currentCycle, trigger]);
    return currentCycle;
  },
  maybeAddPrivateHooks(el, phxViewportTop, phxViewportBottom) {
    if (el.hasAttribute && (el.hasAttribute(phxViewportTop) || el.hasAttribute(phxViewportBottom))) {
      el.setAttribute("data-phx-hook", "Phoenix.InfiniteScroll");
    }
  },
  maybeHideFeedback(container, input, phxFeedbackFor) {
    if (!(this.private(input, PHX_HAS_FOCUSED) || this.private(input, PHX_HAS_SUBMITTED))) {
      let feedbacks = [input.name];
      if (input.name.endsWith("[]")) {
        feedbacks.push(input.name.slice(0, -2));
      }
      let selector = feedbacks.map((f) => `[${phxFeedbackFor}="${f}"]`).join(", ");
      DOM.all(container, selector, (el) => el.classList.add(PHX_NO_FEEDBACK_CLASS));
    }
  },
  resetForm(form, phxFeedbackFor) {
    Array.from(form.elements).forEach((input) => {
      let query = `[${phxFeedbackFor}="${input.id}"],
                   [${phxFeedbackFor}="${input.name}"],
                   [${phxFeedbackFor}="${input.name.replace(/\[\]$/, "")}"]`;
      this.deletePrivate(input, PHX_HAS_FOCUSED);
      this.deletePrivate(input, PHX_HAS_SUBMITTED);
      this.all(document, query, (feedbackEl) => {
        feedbackEl.classList.add(PHX_NO_FEEDBACK_CLASS);
      });
    });
  },
  showError(inputEl, phxFeedbackFor) {
    if (inputEl.id || inputEl.name) {
      this.all(inputEl.form, `[${phxFeedbackFor}="${inputEl.id}"], [${phxFeedbackFor}="${inputEl.name}"]`, (el) => {
        this.removeClass(el, PHX_NO_FEEDBACK_CLASS);
      });
    }
  },
  isPhxChild(node) {
    return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
  },
  isPhxSticky(node) {
    return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
  },
  firstPhxChild(el) {
    return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
  },
  dispatchEvent(target, name, opts = {}) {
    let bubbles = opts.bubbles === undefined ? true : !!opts.bubbles;
    let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
    let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
    target.dispatchEvent(event);
  },
  cloneNode(node, html) {
    if (typeof html === "undefined") {
      return node.cloneNode(true);
    } else {
      let cloned = node.cloneNode(false);
      cloned.innerHTML = html;
      return cloned;
    }
  },
  mergeAttrs(target, source, opts = {}) {
    let exclude = opts.exclude || [];
    let isIgnored = opts.isIgnored;
    let sourceAttrs = source.attributes;
    for (let i = sourceAttrs.length - 1;i >= 0; i--) {
      let name = sourceAttrs[i].name;
      if (exclude.indexOf(name) < 0) {
        target.setAttribute(name, source.getAttribute(name));
      }
    }
    let targetAttrs = target.attributes;
    for (let i = targetAttrs.length - 1;i >= 0; i--) {
      let name = targetAttrs[i].name;
      if (isIgnored) {
        if (name.startsWith("data-") && !source.hasAttribute(name)) {
          target.removeAttribute(name);
        }
      } else {
        if (!source.hasAttribute(name)) {
          target.removeAttribute(name);
        }
      }
    }
  },
  mergeFocusedInput(target, source) {
    if (!(target instanceof HTMLSelectElement)) {
      DOM.mergeAttrs(target, source, { exclude: ["value"] });
    }
    if (source.readOnly) {
      target.setAttribute("readonly", true);
    } else {
      target.removeAttribute("readonly");
    }
  },
  hasSelectionRange(el) {
    return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
  },
  restoreFocus(focused, selectionStart, selectionEnd) {
    if (!DOM.isTextualInput(focused)) {
      return;
    }
    let wasFocused = focused.matches(":focus");
    if (focused.readOnly) {
      focused.blur();
    }
    if (!wasFocused) {
      focused.focus();
    }
    if (this.hasSelectionRange(focused)) {
      focused.setSelectionRange(selectionStart, selectionEnd);
    }
  },
  isFormInput(el) {
    return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
  },
  syncAttrsToProps(el) {
    if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
      el.checked = el.getAttribute("checked") !== null;
    }
  },
  isTextualInput(el) {
    return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
  },
  isNowTriggerFormExternal(el, phxTriggerExternal) {
    return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null;
  },
  syncPendingRef(fromEl, toEl, disableWith) {
    let ref = fromEl.getAttribute(PHX_REF);
    if (ref === null) {
      return true;
    }
    let refSrc = fromEl.getAttribute(PHX_REF_SRC);
    if (DOM.isFormInput(fromEl) || fromEl.getAttribute(disableWith) !== null) {
      if (DOM.isUploadInput(fromEl)) {
        DOM.mergeAttrs(fromEl, toEl, { isIgnored: true });
      }
      DOM.putPrivate(fromEl, PHX_REF, toEl);
      return false;
    } else {
      PHX_EVENT_CLASSES.forEach((className) => {
        fromEl.classList.contains(className) && toEl.classList.add(className);
      });
      toEl.setAttribute(PHX_REF, ref);
      toEl.setAttribute(PHX_REF_SRC, refSrc);
      return true;
    }
  },
  cleanChildNodes(container, phxUpdate) {
    if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
      let toRemove = [];
      container.childNodes.forEach((childNode) => {
        if (!childNode.id) {
          let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
          if (!isEmptyTextNode) {
            logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
          }
          toRemove.push(childNode);
        }
      });
      toRemove.forEach((childNode) => childNode.remove());
    }
  },
  replaceRootContainer(container, tagName, attrs) {
    let retainedAttrs = new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
    if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
      Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
      Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
      return container;
    } else {
      let newContainer = document.createElement(tagName);
      Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
      retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
      newContainer.innerHTML = container.innerHTML;
      container.replaceWith(newContainer);
      return newContainer;
    }
  },
  getSticky(el, name, defaultVal) {
    let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
    if (op) {
      let [_name, _op, stashedResult] = op;
      return stashedResult;
    } else {
      return typeof defaultVal === "function" ? defaultVal() : defaultVal;
    }
  },
  deleteSticky(el, name) {
    this.updatePrivate(el, "sticky", [], (ops) => {
      return ops.filter(([existingName, _]) => existingName !== name);
    });
  },
  putSticky(el, name, op) {
    let stashedResult = op(el);
    this.updatePrivate(el, "sticky", [], (ops) => {
      let existingIndex = ops.findIndex(([existingName]) => name === existingName);
      if (existingIndex >= 0) {
        ops[existingIndex] = [name, op, stashedResult];
      } else {
        ops.push([name, op, stashedResult]);
      }
      return ops;
    });
  },
  applyStickyOperations(el) {
    let ops = DOM.private(el, "sticky");
    if (!ops) {
      return;
    }
    ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
  }
};
var dom_default = DOM;
var UploadEntry = class {
  static isActive(fileEl, file) {
    let isNew = file._phxRef === undefined;
    let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
    let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
    return file.size > 0 && (isNew || isActive);
  }
  static isPreflighted(fileEl, file) {
    let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
    let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
    return isPreflighted && this.isActive(fileEl, file);
  }
  constructor(fileEl, file, view) {
    this.ref = LiveUploader.genFileRef(file);
    this.fileEl = fileEl;
    this.file = file;
    this.view = view;
    this.meta = null;
    this._isCancelled = false;
    this._isDone = false;
    this._progress = 0;
    this._lastProgressSent = -1;
    this._onDone = function() {
    };
    this._onElUpdated = this.onElUpdated.bind(this);
    this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
  }
  metadata() {
    return this.meta;
  }
  progress(progress) {
    this._progress = Math.floor(progress);
    if (this._progress > this._lastProgressSent) {
      if (this._progress >= 100) {
        this._progress = 100;
        this._lastProgressSent = 100;
        this._isDone = true;
        this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
          LiveUploader.untrackFile(this.fileEl, this.file);
          this._onDone();
        });
      } else {
        this._lastProgressSent = this._progress;
        this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
      }
    }
  }
  cancel() {
    this._isCancelled = true;
    this._isDone = true;
    this._onDone();
  }
  isDone() {
    return this._isDone;
  }
  error(reason = "failed") {
    this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
    if (!dom_default.isAutoUpload(this.fileEl)) {
      LiveUploader.clearFiles(this.fileEl);
    }
  }
  onDone(callback) {
    this._onDone = () => {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      callback();
    };
  }
  onElUpdated() {
    let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
    if (activeRefs.indexOf(this.ref) === -1) {
      this.cancel();
    }
  }
  toPreflightPayload() {
    return {
      last_modified: this.file.lastModified,
      name: this.file.name,
      relative_path: this.file.webkitRelativePath,
      size: this.file.size,
      type: this.file.type,
      ref: this.ref,
      meta: typeof this.file.meta === "function" ? this.file.meta() : undefined
    };
  }
  uploader(uploaders) {
    if (this.meta.uploader) {
      let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
      return { name: this.meta.uploader, callback };
    } else {
      return { name: "channel", callback: channelUploader };
    }
  }
  zipPostFlight(resp) {
    this.meta = resp.entries[this.ref];
    if (!this.meta) {
      logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
    }
  }
};
var liveUploaderFileRef = 0;
var LiveUploader = class {
  static genFileRef(file) {
    let ref = file._phxRef;
    if (ref !== undefined) {
      return ref;
    } else {
      file._phxRef = (liveUploaderFileRef++).toString();
      return file._phxRef;
    }
  }
  static getEntryDataURL(inputEl, ref, callback) {
    let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
    callback(URL.createObjectURL(file));
  }
  static hasUploadsInProgress(formEl) {
    let active = 0;
    dom_default.findUploadInputs(formEl).forEach((input) => {
      if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
        active++;
      }
    });
    return active > 0;
  }
  static serializeUploads(inputEl) {
    let files = this.activeFiles(inputEl);
    let fileData = {};
    files.forEach((file) => {
      let entry = { path: inputEl.name };
      let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
      fileData[uploadRef] = fileData[uploadRef] || [];
      entry.ref = this.genFileRef(file);
      entry.last_modified = file.lastModified;
      entry.name = file.name || entry.ref;
      entry.relative_path = file.webkitRelativePath;
      entry.type = file.type;
      entry.size = file.size;
      if (typeof file.meta === "function") {
        entry.meta = file.meta();
      }
      fileData[uploadRef].push(entry);
    });
    return fileData;
  }
  static clearFiles(inputEl) {
    inputEl.value = null;
    inputEl.removeAttribute(PHX_UPLOAD_REF);
    dom_default.putPrivate(inputEl, "files", []);
  }
  static untrackFile(inputEl, file) {
    dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
  }
  static trackFiles(inputEl, files, dataTransfer) {
    if (inputEl.getAttribute("multiple") !== null) {
      let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
      dom_default.putPrivate(inputEl, "files", this.activeFiles(inputEl).concat(newFiles));
      inputEl.value = null;
    } else {
      if (dataTransfer && dataTransfer.files.length > 0) {
        inputEl.files = dataTransfer.files;
      }
      dom_default.putPrivate(inputEl, "files", files);
    }
  }
  static activeFileInputs(formEl) {
    let fileInputs = dom_default.findUploadInputs(formEl);
    return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
  }
  static activeFiles(input) {
    return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
  }
  static inputsAwaitingPreflight(formEl) {
    let fileInputs = dom_default.findUploadInputs(formEl);
    return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
  }
  static filesAwaitingPreflight(input) {
    return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f));
  }
  constructor(inputEl, view, onComplete) {
    this.view = view;
    this.onComplete = onComplete;
    this._entries = Array.from(LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view));
    this.numEntriesInProgress = this._entries.length;
  }
  entries() {
    return this._entries;
  }
  initAdapterUpload(resp, onError, liveSocket) {
    this._entries = this._entries.map((entry) => {
      entry.zipPostFlight(resp);
      entry.onDone(() => {
        this.numEntriesInProgress--;
        if (this.numEntriesInProgress === 0) {
          this.onComplete();
        }
      });
      return entry;
    });
    let groupedEntries = this._entries.reduce((acc, entry) => {
      if (!entry.meta) {
        return acc;
      }
      let { name, callback } = entry.uploader(liveSocket.uploaders);
      acc[name] = acc[name] || { callback, entries: [] };
      acc[name].entries.push(entry);
      return acc;
    }, {});
    for (let name in groupedEntries) {
      let { callback, entries } = groupedEntries[name];
      callback(entries, onError, resp, liveSocket);
    }
  }
};
var ARIA = {
  focusMain() {
    let target = document.querySelector("main h1, main, h1");
    if (target) {
      let origTabIndex = target.tabIndex;
      target.tabIndex = -1;
      target.focus();
      target.tabIndex = origTabIndex;
    }
  },
  anyOf(instance, classes) {
    return classes.find((name) => instance instanceof name);
  },
  isFocusable(el, interactiveOnly) {
    return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== undefined || !el.disabled && this.anyOf(el, [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement]) || el instanceof HTMLIFrameElement || (el.tabIndex > 0 || !interactiveOnly && el.tabIndex === 0 && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true");
  },
  attemptFocus(el, interactiveOnly) {
    if (this.isFocusable(el, interactiveOnly)) {
      try {
        el.focus();
      } catch (e) {
      }
    }
    return !!document.activeElement && document.activeElement.isSameNode(el);
  },
  focusFirstInteractive(el) {
    let child = el.firstElementChild;
    while (child) {
      if (this.attemptFocus(child, true) || this.focusFirstInteractive(child, true)) {
        return true;
      }
      child = child.nextElementSibling;
    }
  },
  focusFirst(el) {
    let child = el.firstElementChild;
    while (child) {
      if (this.attemptFocus(child) || this.focusFirst(child)) {
        return true;
      }
      child = child.nextElementSibling;
    }
  },
  focusLast(el) {
    let child = el.lastElementChild;
    while (child) {
      if (this.attemptFocus(child) || this.focusLast(child)) {
        return true;
      }
      child = child.previousElementSibling;
    }
  }
};
var aria_default = ARIA;
var Hooks = {
  LiveFileUpload: {
    activeRefs() {
      return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
    },
    preflightedRefs() {
      return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
    },
    mounted() {
      this.preflightedWas = this.preflightedRefs();
    },
    updated() {
      let newPreflights = this.preflightedRefs();
      if (this.preflightedWas !== newPreflights) {
        this.preflightedWas = newPreflights;
        if (newPreflights === "") {
          this.__view.cancelSubmit(this.el.form);
        }
      }
      if (this.activeRefs() === "") {
        this.el.value = null;
      }
      this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
    }
  },
  LiveImgPreview: {
    mounted() {
      this.ref = this.el.getAttribute("data-phx-entry-ref");
      this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
      LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
        this.url = url;
        this.el.src = url;
      });
    },
    destroyed() {
      URL.revokeObjectURL(this.url);
    }
  },
  FocusWrap: {
    mounted() {
      this.focusStart = this.el.firstElementChild;
      this.focusEnd = this.el.lastElementChild;
      this.focusStart.addEventListener("focus", () => aria_default.focusLast(this.el));
      this.focusEnd.addEventListener("focus", () => aria_default.focusFirst(this.el));
      this.el.addEventListener("phx:show-end", () => this.el.focus());
      if (window.getComputedStyle(this.el).display !== "none") {
        aria_default.focusFirst(this.el);
      }
    }
  }
};
var scrollTop = () => document.documentElement.scrollTop || document.body.scrollTop;
var winHeight = () => window.innerHeight || document.documentElement.clientHeight;
var isAtViewportTop = (el) => {
  let rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.top <= winHeight();
};
var isAtViewportBottom = (el) => {
  let rect = el.getBoundingClientRect();
  return rect.right >= 0 && rect.left >= 0 && rect.bottom <= winHeight();
};
var isWithinViewport = (el) => {
  let rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.top <= winHeight();
};
Hooks.InfiniteScroll = {
  mounted() {
    let scrollBefore = scrollTop();
    let topOverran = false;
    let throttleInterval = 500;
    let pendingOp = null;
    let onTopOverrun = this.throttle(throttleInterval, (topEvent, firstChild) => {
      pendingOp = () => true;
      this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id, _overran: true }, () => {
        pendingOp = null;
      });
    });
    let onFirstChildAtTop = this.throttle(throttleInterval, (topEvent, firstChild) => {
      pendingOp = () => firstChild.scrollIntoView({ block: "start" });
      this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id }, () => {
        pendingOp = null;
        if (!isWithinViewport(firstChild)) {
          firstChild.scrollIntoView({ block: "start" });
        }
      });
    });
    let onLastChildAtBottom = this.throttle(throttleInterval, (bottomEvent, lastChild) => {
      pendingOp = () => lastChild.scrollIntoView({ block: "end" });
      this.liveSocket.execJSHookPush(this.el, bottomEvent, { id: lastChild.id }, () => {
        pendingOp = null;
        if (!isWithinViewport(lastChild)) {
          lastChild.scrollIntoView({ block: "end" });
        }
      });
    });
    this.onScroll = (e) => {
      let scrollNow = scrollTop();
      if (pendingOp) {
        scrollBefore = scrollNow;
        return pendingOp();
      }
      let rect = this.el.getBoundingClientRect();
      let topEvent = this.el.getAttribute(this.liveSocket.binding("viewport-top"));
      let bottomEvent = this.el.getAttribute(this.liveSocket.binding("viewport-bottom"));
      let lastChild = this.el.lastElementChild;
      let firstChild = this.el.firstElementChild;
      let isScrollingUp = scrollNow < scrollBefore;
      let isScrollingDown = scrollNow > scrollBefore;
      if (isScrollingUp && topEvent && !topOverran && rect.top >= 0) {
        topOverran = true;
        onTopOverrun(topEvent, firstChild);
      } else if (isScrollingDown && topOverran && rect.top <= 0) {
        topOverran = false;
      }
      if (topEvent && isScrollingUp && isAtViewportTop(firstChild)) {
        onFirstChildAtTop(topEvent, firstChild);
      } else if (bottomEvent && isScrollingDown && isAtViewportBottom(lastChild)) {
        onLastChildAtBottom(bottomEvent, lastChild);
      }
      scrollBefore = scrollNow;
    };
    window.addEventListener("scroll", this.onScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
  throttle(interval, callback) {
    let lastCallAt = 0;
    let timer;
    return (...args) => {
      let now = Date.now();
      let remainingTime = interval - (now - lastCallAt);
      if (remainingTime <= 0 || remainingTime > interval) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        lastCallAt = now;
        callback(...args);
      } else if (!timer) {
        timer = setTimeout(() => {
          lastCallAt = Date.now();
          timer = null;
          callback(...args);
        }, remainingTime);
      }
    };
  }
};
var hooks_default = Hooks;
var DOMPostMorphRestorer = class {
  constructor(containerBefore, containerAfter, updateType) {
    let idsBefore = new Set;
    let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
    let elementsToModify = [];
    Array.from(containerBefore.children).forEach((child) => {
      if (child.id) {
        idsBefore.add(child.id);
        if (idsAfter.has(child.id)) {
          let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
          elementsToModify.push({ elementId: child.id, previousElementId });
        }
      }
    });
    this.containerId = containerAfter.id;
    this.updateType = updateType;
    this.elementsToModify = elementsToModify;
    this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
  }
  perform() {
    let container = dom_default.byId(this.containerId);
    this.elementsToModify.forEach((elementToModify) => {
      if (elementToModify.previousElementId) {
        maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
            if (!isInRightPlace) {
              previousElem.insertAdjacentElement("afterend", elem);
            }
          });
        });
      } else {
        maybe(document.getElementById(elementToModify.elementId), (elem) => {
          let isInRightPlace = elem.previousElementSibling == null;
          if (!isInRightPlace) {
            container.insertAdjacentElement("afterbegin", elem);
          }
        });
      }
    });
    if (this.updateType == "prepend") {
      this.elementIdsToAdd.reverse().forEach((elemId) => {
        maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
      });
    }
  }
};
var DOCUMENT_FRAGMENT_NODE = 11;
var range;
var NS_XHTML = "http://www.w3.org/1999/xhtml";
var doc = typeof document === "undefined" ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && ("content" in doc.createElement("template"));
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && ("createContextualFragment" in doc.createRange());
var specialElHandlers = {
  OPTION: function(fromEl, toEl) {
    var parentNode = fromEl.parentNode;
    if (parentNode) {
      var parentName = parentNode.nodeName.toUpperCase();
      if (parentName === "OPTGROUP") {
        parentNode = parentNode.parentNode;
        parentName = parentNode && parentNode.nodeName.toUpperCase();
      }
      if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
        if (fromEl.hasAttribute("selected") && !toEl.selected) {
          fromEl.setAttribute("selected", "selected");
          fromEl.removeAttribute("selected");
        }
        parentNode.selectedIndex = -1;
      }
    }
    syncBooleanAttrProp(fromEl, toEl, "selected");
  },
  INPUT: function(fromEl, toEl) {
    syncBooleanAttrProp(fromEl, toEl, "checked");
    syncBooleanAttrProp(fromEl, toEl, "disabled");
    if (fromEl.value !== toEl.value) {
      fromEl.value = toEl.value;
    }
    if (!toEl.hasAttribute("value")) {
      fromEl.removeAttribute("value");
    }
  },
  TEXTAREA: function(fromEl, toEl) {
    var newValue = toEl.value;
    if (fromEl.value !== newValue) {
      fromEl.value = newValue;
    }
    var firstChild = fromEl.firstChild;
    if (firstChild) {
      var oldValue = firstChild.nodeValue;
      if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
        return;
      }
      firstChild.nodeValue = newValue;
    }
  },
  SELECT: function(fromEl, toEl) {
    if (!toEl.hasAttribute("multiple")) {
      var selectedIndex = -1;
      var i = 0;
      var curChild = fromEl.firstChild;
      var optgroup;
      var nodeName;
      while (curChild) {
        nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
        if (nodeName === "OPTGROUP") {
          optgroup = curChild;
          curChild = optgroup.firstChild;
        } else {
          if (nodeName === "OPTION") {
            if (curChild.hasAttribute("selected")) {
              selectedIndex = i;
              break;
            }
            i++;
          }
          curChild = curChild.nextSibling;
          if (!curChild && optgroup) {
            curChild = optgroup.nextSibling;
            optgroup = null;
          }
        }
      }
      fromEl.selectedIndex = selectedIndex;
    }
  }
};
var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var morphdom = morphdomFactory(morphAttrs);
var morphdom_esm_default = morphdom;
var DOMPatch = class {
  static patchEl(fromEl, toEl, activeElement) {
    morphdom_esm_default(fromEl, toEl, {
      childrenOnly: false,
      onBeforeElUpdated: (fromEl2, toEl2) => {
        if (activeElement && activeElement.isSameNode(fromEl2) && dom_default.isFormInput(fromEl2)) {
          dom_default.mergeFocusedInput(fromEl2, toEl2);
          return false;
        }
      }
    });
  }
  constructor(view, container, id, html, streams, targetCID) {
    this.view = view;
    this.liveSocket = view.liveSocket;
    this.container = container;
    this.id = id;
    this.rootID = view.root.id;
    this.html = html;
    this.streams = streams;
    this.streamInserts = {};
    this.targetCID = targetCID;
    this.cidPatch = isCid(this.targetCID);
    this.pendingRemoves = [];
    this.phxRemove = this.liveSocket.binding("remove");
    this.callbacks = {
      beforeadded: [],
      beforeupdated: [],
      beforephxChildAdded: [],
      afteradded: [],
      afterupdated: [],
      afterdiscarded: [],
      afterphxChildAdded: [],
      aftertransitionsDiscarded: []
    };
  }
  before(kind, callback) {
    this.callbacks[`before${kind}`].push(callback);
  }
  after(kind, callback) {
    this.callbacks[`after${kind}`].push(callback);
  }
  trackBefore(kind, ...args) {
    this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
  }
  trackAfter(kind, ...args) {
    this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
  }
  markPrunableContentForRemoval() {
    let phxUpdate = this.liveSocket.binding(PHX_UPDATE);
    dom_default.all(this.container, `[${phxUpdate}=${PHX_STREAM}]`, (el) => el.innerHTML = "");
    dom_default.all(this.container, `[${phxUpdate}=append] > *, [${phxUpdate}=prepend] > *`, (el) => {
      el.setAttribute(PHX_PRUNE, "");
    });
  }
  perform() {
    let { view, liveSocket, container, html } = this;
    let targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
    if (this.isCIDPatch() && !targetContainer) {
      return;
    }
    let focused = liveSocket.getActiveElement();
    let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
    let phxUpdate = liveSocket.binding(PHX_UPDATE);
    let phxFeedbackFor = liveSocket.binding(PHX_FEEDBACK_FOR);
    let disableWith = liveSocket.binding(PHX_DISABLE_WITH);
    let phxViewportTop = liveSocket.binding(PHX_VIEWPORT_TOP);
    let phxViewportBottom = liveSocket.binding(PHX_VIEWPORT_BOTTOM);
    let phxTriggerExternal = liveSocket.binding(PHX_TRIGGER_ACTION);
    let added = [];
    let trackedInputs = [];
    let updates = [];
    let appendPrependUpdates = [];
    let externalFormTriggered = null;
    let diffHTML = liveSocket.time("premorph container prep", () => {
      return this.buildDiffHTML(container, html, phxUpdate, targetContainer);
    });
    this.trackBefore("added", container);
    this.trackBefore("updated", container, container);
    liveSocket.time("morphdom", () => {
      this.streams.forEach(([ref, inserts, deleteIds, reset]) => {
        Object.entries(inserts).forEach(([key, [streamAt, limit]]) => {
          this.streamInserts[key] = { ref, streamAt, limit };
        });
        if (reset !== undefined) {
          dom_default.all(container, `[${PHX_STREAM_REF}="${ref}"]`, (child) => {
            if (!inserts[child.id]) {
              this.removeStreamChildElement(child);
            }
          });
        }
        deleteIds.forEach((id) => {
          let child = container.querySelector(`[id="${id}"]`);
          if (child) {
            this.removeStreamChildElement(child);
          }
        });
      });
      morphdom_esm_default(targetContainer, diffHTML, {
        childrenOnly: targetContainer.getAttribute(PHX_COMPONENT) === null,
        getNodeKey: (node) => {
          return dom_default.isPhxDestroyed(node) ? null : node.id;
        },
        skipFromChildren: (from) => {
          return from.getAttribute(phxUpdate) === PHX_STREAM;
        },
        addChild: (parent, child) => {
          let { ref, streamAt, limit } = this.getStreamInsert(child);
          if (ref === undefined) {
            return parent.appendChild(child);
          }
          dom_default.putSticky(child, PHX_STREAM_REF, (el) => el.setAttribute(PHX_STREAM_REF, ref));
          if (streamAt === 0) {
            parent.insertAdjacentElement("afterbegin", child);
          } else if (streamAt === -1) {
            parent.appendChild(child);
          } else if (streamAt > 0) {
            let sibling = Array.from(parent.children)[streamAt];
            parent.insertBefore(child, sibling);
          }
          let children = limit !== null && Array.from(parent.children);
          let childrenToRemove = [];
          if (limit && limit < 0 && children.length > limit * -1) {
            childrenToRemove = children.slice(0, children.length + limit);
          } else if (limit && limit >= 0 && children.length > limit) {
            childrenToRemove = children.slice(limit);
          }
          childrenToRemove.forEach((removeChild) => {
            if (!this.streamInserts[removeChild.id]) {
              this.removeStreamChildElement(removeChild);
            }
          });
        },
        onBeforeNodeAdded: (el) => {
          dom_default.maybeAddPrivateHooks(el, phxViewportTop, phxViewportBottom);
          this.trackBefore("added", el);
          return el;
        },
        onNodeAdded: (el) => {
          if (el.getAttribute) {
            this.maybeReOrderStream(el);
          }
          if (el instanceof HTMLImageElement && el.srcset) {
            el.srcset = el.srcset;
          } else if (el instanceof HTMLVideoElement && el.autoplay) {
            el.play();
          }
          if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
            externalFormTriggered = el;
          }
          if (el.getAttribute && el.getAttribute("name") && dom_default.isFormInput(el)) {
            trackedInputs.push(el);
          }
          if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
            this.trackAfter("phxChildAdded", el);
          }
          added.push(el);
        },
        onNodeDiscarded: (el) => this.onNodeDiscarded(el),
        onBeforeNodeDiscarded: (el) => {
          if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
            return true;
          }
          if (el.parentElement !== null && el.id && dom_default.isPhxUpdate(el.parentElement, phxUpdate, [PHX_STREAM, "append", "prepend"])) {
            return false;
          }
          if (this.maybePendingRemove(el)) {
            return false;
          }
          if (this.skipCIDSibling(el)) {
            return false;
          }
          return true;
        },
        onElUpdated: (el) => {
          if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
            externalFormTriggered = el;
          }
          updates.push(el);
          this.maybeReOrderStream(el);
        },
        onBeforeElUpdated: (fromEl, toEl) => {
          dom_default.maybeAddPrivateHooks(toEl, phxViewportTop, phxViewportBottom);
          dom_default.cleanChildNodes(toEl, phxUpdate);
          if (this.skipCIDSibling(toEl)) {
            return false;
          }
          if (dom_default.isPhxSticky(fromEl)) {
            return false;
          }
          if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
            this.trackBefore("updated", fromEl, toEl);
            dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
            updates.push(fromEl);
            dom_default.applyStickyOperations(fromEl);
            return false;
          }
          if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
            return false;
          }
          if (!dom_default.syncPendingRef(fromEl, toEl, disableWith)) {
            if (dom_default.isUploadInput(fromEl)) {
              this.trackBefore("updated", fromEl, toEl);
              updates.push(fromEl);
            }
            dom_default.applyStickyOperations(fromEl);
            return false;
          }
          if (dom_default.isPhxChild(toEl)) {
            let prevSession = fromEl.getAttribute(PHX_SESSION);
            dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
            if (prevSession !== "") {
              fromEl.setAttribute(PHX_SESSION, prevSession);
            }
            fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
            dom_default.applyStickyOperations(fromEl);
            return false;
          }
          dom_default.copyPrivates(toEl, fromEl);
          let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
          if (isFocusedFormEl && fromEl.type !== "hidden") {
            this.trackBefore("updated", fromEl, toEl);
            dom_default.mergeFocusedInput(fromEl, toEl);
            dom_default.syncAttrsToProps(fromEl);
            updates.push(fromEl);
            dom_default.applyStickyOperations(fromEl);
            trackedInputs.push(fromEl);
            return false;
          } else {
            if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
              appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
            }
            dom_default.syncAttrsToProps(toEl);
            dom_default.applyStickyOperations(toEl);
            if (toEl.getAttribute("name") && dom_default.isFormInput(toEl)) {
              trackedInputs.push(toEl);
            }
            this.trackBefore("updated", fromEl, toEl);
            return true;
          }
        }
      });
    });
    if (liveSocket.isDebugEnabled()) {
      detectDuplicateIds();
    }
    if (appendPrependUpdates.length > 0) {
      liveSocket.time("post-morph append/prepend restoration", () => {
        appendPrependUpdates.forEach((update) => update.perform());
      });
    }
    trackedInputs.forEach((input) => {
      dom_default.maybeHideFeedback(targetContainer, input, phxFeedbackFor);
    });
    liveSocket.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
    dom_default.dispatchEvent(document, "phx:update");
    added.forEach((el) => this.trackAfter("added", el));
    updates.forEach((el) => this.trackAfter("updated", el));
    this.transitionPendingRemoves();
    if (externalFormTriggered) {
      liveSocket.unload();
      Object.getPrototypeOf(externalFormTriggered).submit.call(externalFormTriggered);
    }
    return true;
  }
  onNodeDiscarded(el) {
    if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
      this.liveSocket.destroyViewByEl(el);
    }
    this.trackAfter("discarded", el);
  }
  maybePendingRemove(node) {
    if (node.getAttribute && node.getAttribute(this.phxRemove) !== null) {
      this.pendingRemoves.push(node);
      return true;
    } else {
      return false;
    }
  }
  removeStreamChildElement(child) {
    if (!this.maybePendingRemove(child)) {
      child.remove();
      this.onNodeDiscarded(child);
    }
  }
  getStreamInsert(el) {
    let insert = el.id ? this.streamInserts[el.id] : {};
    return insert || {};
  }
  maybeReOrderStream(el) {
    let { ref, streamAt, limit } = this.getStreamInsert(el);
    if (streamAt === undefined) {
      return;
    }
    dom_default.putSticky(el, PHX_STREAM_REF, (el2) => el2.setAttribute(PHX_STREAM_REF, ref));
    if (streamAt === 0) {
      el.parentElement.insertBefore(el, el.parentElement.firstElementChild);
    } else if (streamAt > 0) {
      let children = Array.from(el.parentElement.children);
      let oldIndex = children.indexOf(el);
      if (streamAt >= children.length - 1) {
        el.parentElement.appendChild(el);
      } else {
        let sibling = children[streamAt];
        if (oldIndex > streamAt) {
          el.parentElement.insertBefore(el, sibling);
        } else {
          el.parentElement.insertBefore(el, sibling.nextElementSibling);
        }
      }
    }
  }
  transitionPendingRemoves() {
    let { pendingRemoves, liveSocket } = this;
    if (pendingRemoves.length > 0) {
      liveSocket.transitionRemoves(pendingRemoves);
      liveSocket.requestDOMUpdate(() => {
        pendingRemoves.forEach((el) => {
          let child = dom_default.firstPhxChild(el);
          if (child) {
            liveSocket.destroyViewByEl(child);
          }
          el.remove();
        });
        this.trackAfter("transitionsDiscarded", pendingRemoves);
      });
    }
  }
  isCIDPatch() {
    return this.cidPatch;
  }
  skipCIDSibling(el) {
    return el.nodeType === Node.ELEMENT_NODE && el.getAttribute(PHX_SKIP) !== null;
  }
  targetCIDContainer(html) {
    if (!this.isCIDPatch()) {
      return;
    }
    let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
    if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
      return first;
    } else {
      return first && first.parentNode;
    }
  }
  buildDiffHTML(container, html, phxUpdate, targetContainer) {
    let isCIDPatch = this.isCIDPatch();
    let isCIDWithSingleRoot = isCIDPatch && targetContainer.getAttribute(PHX_COMPONENT) === this.targetCID.toString();
    if (!isCIDPatch || isCIDWithSingleRoot) {
      return html;
    } else {
      let diffContainer = null;
      let template = document.createElement("template");
      diffContainer = dom_default.cloneNode(targetContainer);
      let [firstComponent, ...rest] = dom_default.findComponentNodeList(diffContainer, this.targetCID);
      template.innerHTML = html;
      rest.forEach((el) => el.remove());
      Array.from(diffContainer.childNodes).forEach((child) => {
        if (child.id && child.nodeType === Node.ELEMENT_NODE && child.getAttribute(PHX_COMPONENT) !== this.targetCID.toString()) {
          child.setAttribute(PHX_SKIP, "");
          child.innerHTML = "";
        }
      });
      Array.from(template.content.childNodes).forEach((el) => diffContainer.insertBefore(el, firstComponent));
      firstComponent.remove();
      return diffContainer.outerHTML;
    }
  }
  indexOf(parent, child) {
    return Array.from(parent.children).indexOf(child);
  }
};
var Rendered = class {
  static extract(diff) {
    let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
    delete diff[REPLY];
    delete diff[EVENTS];
    delete diff[TITLE];
    return { diff, title, reply: reply || null, events: events || [] };
  }
  constructor(viewId, rendered) {
    this.viewId = viewId;
    this.rendered = {};
    this.mergeDiff(rendered);
  }
  parentViewId() {
    return this.viewId;
  }
  toString(onlyCids) {
    let [str, streams] = this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids);
    return [str, streams];
  }
  recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids) {
    onlyCids = onlyCids ? new Set(onlyCids) : null;
    let output = { buffer: "", components, onlyCids, streams: new Set };
    this.toOutputBuffer(rendered, null, output);
    return [output.buffer, output.streams];
  }
  componentCIDs(diff) {
    return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
  }
  isComponentOnlyDiff(diff) {
    if (!diff[COMPONENTS]) {
      return false;
    }
    return Object.keys(diff).length === 1;
  }
  getComponent(diff, cid) {
    return diff[COMPONENTS][cid];
  }
  mergeDiff(diff) {
    let newc = diff[COMPONENTS];
    let cache = {};
    delete diff[COMPONENTS];
    this.rendered = this.mutableMerge(this.rendered, diff);
    this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
    if (newc) {
      let oldc = this.rendered[COMPONENTS];
      for (let cid in newc) {
        newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
      }
      for (let cid in newc) {
        oldc[cid] = newc[cid];
      }
      diff[COMPONENTS] = newc;
    }
  }
  cachedFindComponent(cid, cdiff, oldc, newc, cache) {
    if (cache[cid]) {
      return cache[cid];
    } else {
      let ndiff, stat, scid = cdiff[STATIC];
      if (isCid(scid)) {
        let tdiff;
        if (scid > 0) {
          tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
        } else {
          tdiff = oldc[-scid];
        }
        stat = tdiff[STATIC];
        ndiff = this.cloneMerge(tdiff, cdiff);
        ndiff[STATIC] = stat;
      } else {
        ndiff = cdiff[STATIC] !== undefined ? cdiff : this.cloneMerge(oldc[cid] || {}, cdiff);
      }
      cache[cid] = ndiff;
      return ndiff;
    }
  }
  mutableMerge(target, source) {
    if (source[STATIC] !== undefined) {
      return source;
    } else {
      this.doMutableMerge(target, source);
      return target;
    }
  }
  doMutableMerge(target, source) {
    for (let key in source) {
      let val = source[key];
      let targetVal = target[key];
      let isObjVal = isObject(val);
      if (isObjVal && val[STATIC] === undefined && isObject(targetVal)) {
        this.doMutableMerge(targetVal, val);
      } else {
        target[key] = val;
      }
    }
  }
  cloneMerge(target, source) {
    let merged = { ...target, ...source };
    for (let key in merged) {
      let val = source[key];
      let targetVal = target[key];
      if (isObject(val) && val[STATIC] === undefined && isObject(targetVal)) {
        merged[key] = this.cloneMerge(targetVal, val);
      }
    }
    return merged;
  }
  componentToString(cid) {
    let [str, streams] = this.recursiveCIDToString(this.rendered[COMPONENTS], cid, null, false);
    return [str, streams];
  }
  pruneCIDs(cids) {
    cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
  }
  get() {
    return this.rendered;
  }
  isNewFingerprint(diff = {}) {
    return !!diff[STATIC];
  }
  templateStatic(part, templates) {
    if (typeof part === "number") {
      return templates[part];
    } else {
      return part;
    }
  }
  toOutputBuffer(rendered, templates, output) {
    if (rendered[DYNAMICS]) {
      return this.comprehensionToBuffer(rendered, templates, output);
    }
    let { [STATIC]: statics } = rendered;
    statics = this.templateStatic(statics, templates);
    output.buffer += statics[0];
    for (let i = 1;i < statics.length; i++) {
      this.dynamicToBuffer(rendered[i - 1], templates, output);
      output.buffer += statics[i];
    }
  }
  comprehensionToBuffer(rendered, templates, output) {
    let { [DYNAMICS]: dynamics, [STATIC]: statics, [STREAM]: stream } = rendered;
    let [_ref, _inserts, deleteIds, reset] = stream || [null, {}, [], null];
    statics = this.templateStatic(statics, templates);
    let compTemplates = templates || rendered[TEMPLATES];
    for (let d = 0;d < dynamics.length; d++) {
      let dynamic = dynamics[d];
      output.buffer += statics[0];
      for (let i = 1;i < statics.length; i++) {
        this.dynamicToBuffer(dynamic[i - 1], compTemplates, output);
        output.buffer += statics[i];
      }
    }
    if (stream !== undefined && (rendered[DYNAMICS].length > 0 || deleteIds.length > 0 || reset)) {
      delete rendered[STREAM];
      rendered[DYNAMICS] = [];
      output.streams.add(stream);
    }
  }
  dynamicToBuffer(rendered, templates, output) {
    if (typeof rendered === "number") {
      let [str, streams] = this.recursiveCIDToString(output.components, rendered, output.onlyCids);
      output.buffer += str;
      output.streams = new Set([...output.streams, ...streams]);
    } else if (isObject(rendered)) {
      this.toOutputBuffer(rendered, templates, output);
    } else {
      output.buffer += rendered;
    }
  }
  recursiveCIDToString(components, cid, onlyCids, allowRootComments = true) {
    let component = components[cid] || logError(`no component for CID ${cid}`, components);
    let template = document.createElement("template");
    let [html, streams] = this.recursiveToString(component, components, onlyCids);
    template.innerHTML = html;
    let container = template.content;
    let skip = onlyCids && !onlyCids.has(cid);
    let [hasChildNodes, hasChildComponents] = Array.from(container.childNodes).reduce(([hasNodes, hasComponents], child, i) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.getAttribute(PHX_COMPONENT)) {
          return [hasNodes, true];
        }
        child.setAttribute(PHX_COMPONENT, cid);
        if (!child.id) {
          child.id = `${this.parentViewId()}-${cid}-${i}`;
        }
        if (skip) {
          child.setAttribute(PHX_SKIP, "");
          child.innerHTML = "";
        }
        return [true, hasComponents];
      } else if (child.nodeType === Node.COMMENT_NODE) {
        if (!allowRootComments) {
          child.remove();
        }
        return [hasNodes, hasComponents];
      } else {
        if (child.nodeValue.trim() !== "") {
          logError(`only HTML element tags are allowed at the root of components.

got: "${child.nodeValue.trim()}"

within:
`, template.innerHTML.trim());
          child.replaceWith(this.createSpan(child.nodeValue, cid));
          return [true, hasComponents];
        } else {
          child.remove();
          return [hasNodes, hasComponents];
        }
      }
    }, [false, false]);
    if (!hasChildNodes && !hasChildComponents) {
      logError("expected at least one HTML element tag inside a component, but the component is empty:\n", template.innerHTML.trim());
      return [this.createSpan("", cid).outerHTML, streams];
    } else if (!hasChildNodes && hasChildComponents) {
      logError("expected at least one HTML element tag directly inside a component, but only subcomponents were found. A component must render at least one HTML tag directly inside itself.", template.innerHTML.trim());
      return [template.innerHTML, streams];
    } else {
      return [template.innerHTML, streams];
    }
  }
  createSpan(text, cid) {
    let span = document.createElement("span");
    span.innerText = text;
    span.setAttribute(PHX_COMPONENT, cid);
    return span;
  }
};
var viewHookID = 1;
var ViewHook = class {
  static makeID() {
    return viewHookID++;
  }
  static elementID(el) {
    return el.phxHookId;
  }
  constructor(view, el, callbacks) {
    this.__view = view;
    this.liveSocket = view.liveSocket;
    this.__callbacks = callbacks;
    this.__listeners = new Set;
    this.__isDisconnected = false;
    this.el = el;
    this.el.phxHookId = this.constructor.makeID();
    for (let key in this.__callbacks) {
      this[key] = this.__callbacks[key];
    }
  }
  __mounted() {
    this.mounted && this.mounted();
  }
  __updated() {
    this.updated && this.updated();
  }
  __beforeUpdate() {
    this.beforeUpdate && this.beforeUpdate();
  }
  __destroyed() {
    this.destroyed && this.destroyed();
  }
  __reconnected() {
    if (this.__isDisconnected) {
      this.__isDisconnected = false;
      this.reconnected && this.reconnected();
    }
  }
  __disconnected() {
    this.__isDisconnected = true;
    this.disconnected && this.disconnected();
  }
  pushEvent(event, payload = {}, onReply = function() {
  }) {
    return this.__view.pushHookEvent(this.el, null, event, payload, onReply);
  }
  pushEventTo(phxTarget, event, payload = {}, onReply = function() {
  }) {
    return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
      return view.pushHookEvent(this.el, targetCtx, event, payload, onReply);
    });
  }
  handleEvent(event, callback) {
    let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
    window.addEventListener(`phx:${event}`, callbackRef);
    this.__listeners.add(callbackRef);
    return callbackRef;
  }
  removeHandleEvent(callbackRef) {
    let event = callbackRef(null, true);
    window.removeEventListener(`phx:${event}`, callbackRef);
    this.__listeners.delete(callbackRef);
  }
  upload(name, files) {
    return this.__view.dispatchUploads(null, name, files);
  }
  uploadTo(phxTarget, name, files) {
    return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
      view.dispatchUploads(targetCtx, name, files);
    });
  }
  __cleanup__() {
    this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
  }
};
var focusStack = null;
var JS = {
  exec(eventType, phxEvent, view, sourceEl, defaults) {
    let [defaultKind, defaultArgs] = defaults || [null, { callback: defaults && defaults.callback }];
    let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
    commands.forEach(([kind, args]) => {
      if (kind === defaultKind && defaultArgs.data) {
        args.data = Object.assign(args.data || {}, defaultArgs.data);
        args.callback = args.callback || defaultArgs.callback;
      }
      this.filterToEls(sourceEl, args).forEach((el) => {
        this[`exec_${kind}`](eventType, phxEvent, view, sourceEl, el, args);
      });
    });
  },
  isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
  },
  exec_exec(eventType, phxEvent, view, sourceEl, el, [attr, to]) {
    let nodes = to ? dom_default.all(document, to) : [sourceEl];
    nodes.forEach((node) => {
      let encodedJS = node.getAttribute(attr);
      if (!encodedJS) {
        throw new Error(`expected ${attr} to contain JS command on "${to}"`);
      }
      view.liveSocket.execJS(node, encodedJS, eventType);
    });
  },
  exec_dispatch(eventType, phxEvent, view, sourceEl, el, { to, event, detail, bubbles }) {
    detail = detail || {};
    detail.dispatcher = sourceEl;
    dom_default.dispatchEvent(el, event, { detail, bubbles });
  },
  exec_push(eventType, phxEvent, view, sourceEl, el, args) {
    if (!view.isConnected()) {
      return;
    }
    let { event, data, target, page_loading, loading, value, dispatcher, callback } = args;
    let pushOpts = { loading, value, target, page_loading: !!page_loading };
    let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
    let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
    view.withinTargets(phxTarget, (targetView, targetCtx) => {
      if (eventType === "change") {
        let { newCid, _target } = args;
        _target = _target || (dom_default.isFormInput(sourceEl) ? sourceEl.name : undefined);
        if (_target) {
          pushOpts._target = _target;
        }
        targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
      } else if (eventType === "submit") {
        let { submitter } = args;
        targetView.submitForm(sourceEl, targetCtx, event || phxEvent, submitter, pushOpts, callback);
      } else {
        targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts, callback);
      }
    });
  },
  exec_navigate(eventType, phxEvent, view, sourceEl, el, { href, replace }) {
    view.liveSocket.historyRedirect(href, replace ? "replace" : "push");
  },
  exec_patch(eventType, phxEvent, view, sourceEl, el, { href, replace }) {
    view.liveSocket.pushHistoryPatch(href, replace ? "replace" : "push", sourceEl);
  },
  exec_focus(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => aria_default.attemptFocus(el));
  },
  exec_focus_first(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el));
  },
  exec_push_focus(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => focusStack = el || sourceEl);
  },
  exec_pop_focus(eventType, phxEvent, view, sourceEl, el) {
    window.requestAnimationFrame(() => {
      if (focusStack) {
        focusStack.focus();
      }
      focusStack = null;
    });
  },
  exec_add_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
    this.addOrRemoveClasses(el, names, [], transition, time, view);
  },
  exec_remove_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
    this.addOrRemoveClasses(el, [], names, transition, time, view);
  },
  exec_transition(eventType, phxEvent, view, sourceEl, el, { time, transition }) {
    this.addOrRemoveClasses(el, [], [], transition, time, view);
  },
  exec_toggle(eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time }) {
    this.toggle(eventType, view, el, display, ins, outs, time);
  },
  exec_show(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
    this.show(eventType, view, el, display, transition, time);
  },
  exec_hide(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
    this.hide(eventType, view, el, display, transition, time);
  },
  exec_set_attr(eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
    this.setOrRemoveAttrs(el, [[attr, val]], []);
  },
  exec_remove_attr(eventType, phxEvent, view, sourceEl, el, { attr }) {
    this.setOrRemoveAttrs(el, [], [attr]);
  },
  show(eventType, view, el, display, transition, time) {
    if (!this.isVisible(el)) {
      this.toggle(eventType, view, el, display, transition, null, time);
    }
  },
  hide(eventType, view, el, display, transition, time) {
    if (this.isVisible(el)) {
      this.toggle(eventType, view, el, display, null, transition, time);
    }
  },
  toggle(eventType, view, el, display, ins, outs, time) {
    let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
    let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
    if (inClasses.length > 0 || outClasses.length > 0) {
      if (this.isVisible(el)) {
        let onStart = () => {
          this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, outClasses, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
          });
        };
        el.dispatchEvent(new Event("phx:hide-start"));
        view.transition(time, onStart, () => {
          this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
          el.dispatchEvent(new Event("phx:hide-end"));
        });
      } else {
        if (eventType === "remove") {
          return;
        }
        let onStart = () => {
          this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
          let stickyDisplay = display || this.defaultDisplay(el);
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, inClasses, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, inEndClasses, inStartClasses));
          });
        };
        el.dispatchEvent(new Event("phx:show-start"));
        view.transition(time, onStart, () => {
          this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
          el.dispatchEvent(new Event("phx:show-end"));
        });
      }
    } else {
      if (this.isVisible(el)) {
        window.requestAnimationFrame(() => {
          el.dispatchEvent(new Event("phx:hide-start"));
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
          el.dispatchEvent(new Event("phx:hide-end"));
        });
      } else {
        window.requestAnimationFrame(() => {
          el.dispatchEvent(new Event("phx:show-start"));
          let stickyDisplay = display || this.defaultDisplay(el);
          dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
          el.dispatchEvent(new Event("phx:show-end"));
        });
      }
    }
  },
  addOrRemoveClasses(el, adds, removes, transition, time, view) {
    let [transitionRun, transitionStart, transitionEnd] = transition || [[], [], []];
    if (transitionRun.length > 0) {
      let onStart = () => {
        this.addOrRemoveClasses(el, transitionStart, [].concat(transitionRun).concat(transitionEnd));
        window.requestAnimationFrame(() => {
          this.addOrRemoveClasses(el, transitionRun, []);
          window.requestAnimationFrame(() => this.addOrRemoveClasses(el, transitionEnd, transitionStart));
        });
      };
      let onDone = () => this.addOrRemoveClasses(el, adds.concat(transitionEnd), removes.concat(transitionRun).concat(transitionStart));
      return view.transition(time, onStart, onDone);
    }
    window.requestAnimationFrame(() => {
      let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
      let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
      let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
      let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
      let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
      dom_default.putSticky(el, "classes", (currentEl) => {
        currentEl.classList.remove(...newRemoves);
        currentEl.classList.add(...newAdds);
        return [newAdds, newRemoves];
      });
    });
  },
  setOrRemoveAttrs(el, sets, removes) {
    let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
    let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
    let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
    let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
    dom_default.putSticky(el, "attrs", (currentEl) => {
      newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
      newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
      return [newSets, newRemoves];
    });
  },
  hasAllClasses(el, classes) {
    return classes.every((name) => el.classList.contains(name));
  },
  isToggledOut(el, outClasses) {
    return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
  },
  filterToEls(sourceEl, { to }) {
    return to ? dom_default.all(document, to) : [sourceEl];
  },
  defaultDisplay(el) {
    return { tr: "table-row", td: "table-cell" }[el.tagName.toLowerCase()] || "block";
  }
};
var js_default = JS;
var serializeForm = (form, metadata, onlyNames = []) => {
  let { submitter, ...meta } = metadata;
  let formData = new FormData(form);
  if (submitter && submitter.hasAttribute("name") && submitter.form && submitter.form === form) {
    formData.append(submitter.name, submitter.value);
  }
  let toRemove = [];
  formData.forEach((val, key, _index) => {
    if (val instanceof File) {
      toRemove.push(key);
    }
  });
  toRemove.forEach((key) => formData.delete(key));
  let params = new URLSearchParams;
  for (let [key, val] of formData.entries()) {
    if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
      params.append(key, val);
    }
  }
  for (let metaKey in meta) {
    params.append(metaKey, meta[metaKey]);
  }
  return params.toString();
};
var View = class {
  constructor(el, liveSocket, parentView, flash, liveReferer) {
    this.isDead = false;
    this.liveSocket = liveSocket;
    this.flash = flash;
    this.parent = parentView;
    this.root = parentView ? parentView.root : this;
    this.el = el;
    this.id = this.el.id;
    this.ref = 0;
    this.childJoins = 0;
    this.loaderTimer = null;
    this.pendingDiffs = [];
    this.pruningCIDs = [];
    this.redirect = false;
    this.href = null;
    this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
    this.joinPending = true;
    this.destroyed = false;
    this.joinCallback = function(onDone) {
      onDone && onDone();
    };
    this.stopCallback = function() {
    };
    this.pendingJoinOps = this.parent ? null : [];
    this.viewHooks = {};
    this.uploaders = {};
    this.formSubmits = [];
    this.children = this.parent ? null : {};
    this.root.children[this.id] = {};
    this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
      let url = this.href && this.expandURL(this.href);
      return {
        redirect: this.redirect ? url : undefined,
        url: this.redirect ? undefined : url || undefined,
        params: this.connectParams(liveReferer),
        session: this.getSession(),
        static: this.getStatic(),
        flash: this.flash
      };
    });
  }
  setHref(href) {
    this.href = href;
  }
  setRedirect(href) {
    this.redirect = true;
    this.href = href;
  }
  isMain() {
    return this.el.hasAttribute(PHX_MAIN);
  }
  connectParams(liveReferer) {
    let params = this.liveSocket.params(this.el);
    let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
    if (manifest.length > 0) {
      params["_track_static"] = manifest;
    }
    params["_mounts"] = this.joinCount;
    params["_live_referer"] = liveReferer;
    return params;
  }
  isConnected() {
    return this.channel.canPush();
  }
  getSession() {
    return this.el.getAttribute(PHX_SESSION);
  }
  getStatic() {
    let val = this.el.getAttribute(PHX_STATIC);
    return val === "" ? null : val;
  }
  destroy(callback = function() {
  }) {
    this.destroyAllChildren();
    this.destroyed = true;
    delete this.root.children[this.id];
    if (this.parent) {
      delete this.root.children[this.parent.id][this.id];
    }
    clearTimeout(this.loaderTimer);
    let onFinished = () => {
      callback();
      for (let id in this.viewHooks) {
        this.destroyHook(this.viewHooks[id]);
      }
    };
    dom_default.markPhxChildDestroyed(this.el);
    this.log("destroyed", () => ["the child has been removed from the parent"]);
    this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
  }
  setContainerClasses(...classes) {
    this.el.classList.remove(PHX_CONNECTED_CLASS, PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS, PHX_SERVER_ERROR_CLASS);
    this.el.classList.add(...classes);
  }
  showLoader(timeout) {
    clearTimeout(this.loaderTimer);
    if (timeout) {
      this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
    } else {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__disconnected();
      }
      this.setContainerClasses(PHX_LOADING_CLASS);
    }
  }
  execAll(binding) {
    dom_default.all(this.el, `[${binding}]`, (el) => this.liveSocket.execJS(el, el.getAttribute(binding)));
  }
  hideLoader() {
    clearTimeout(this.loaderTimer);
    this.setContainerClasses(PHX_CONNECTED_CLASS);
    this.execAll(this.binding("connected"));
  }
  triggerReconnected() {
    for (let id in this.viewHooks) {
      this.viewHooks[id].__reconnected();
    }
  }
  log(kind, msgCallback) {
    this.liveSocket.log(this, kind, msgCallback);
  }
  transition(time, onStart, onDone = function() {
  }) {
    this.liveSocket.transition(time, onStart, onDone);
  }
  withinTargets(phxTarget, callback) {
    if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
      return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
    }
    if (isCid(phxTarget)) {
      let targets = dom_default.findComponentNodeList(this.el, phxTarget);
      if (targets.length === 0) {
        logError(`no component found matching phx-target of ${phxTarget}`);
      } else {
        callback(this, parseInt(phxTarget));
      }
    } else {
      let targets = Array.from(document.querySelectorAll(phxTarget));
      if (targets.length === 0) {
        logError(`nothing found matching the phx-target selector "${phxTarget}"`);
      }
      targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
    }
  }
  applyDiff(type, rawDiff, callback) {
    this.log(type, () => ["", clone(rawDiff)]);
    let { diff, reply, events, title } = Rendered.extract(rawDiff);
    callback({ diff, reply, events });
    if (title) {
      window.requestAnimationFrame(() => dom_default.putTitle(title));
    }
  }
  onJoin(resp) {
    let { rendered, container } = resp;
    if (container) {
      let [tag, attrs] = container;
      this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
    }
    this.childJoins = 0;
    this.joinPending = true;
    this.flash = null;
    browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
    this.applyDiff("mount", rendered, ({ diff, events }) => {
      this.rendered = new Rendered(this.id, diff);
      let [html, streams] = this.renderContainer(null, "join");
      this.dropPendingRefs();
      let forms = this.formsForRecovery(html);
      this.joinCount++;
      if (forms.length > 0) {
        forms.forEach(([form, newForm, newCid], i) => {
          this.pushFormRecovery(form, newCid, (resp2) => {
            if (i === forms.length - 1) {
              this.onJoinComplete(resp2, html, streams, events);
            }
          });
        });
      } else {
        this.onJoinComplete(resp, html, streams, events);
      }
    });
  }
  dropPendingRefs() {
    dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}]`, (el) => {
      el.removeAttribute(PHX_REF);
      el.removeAttribute(PHX_REF_SRC);
    });
  }
  onJoinComplete({ live_patch }, html, streams, events) {
    if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
      return this.applyJoinPatch(live_patch, html, streams, events);
    }
    let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
      let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
      let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
      if (phxStatic) {
        toEl.setAttribute(PHX_STATIC, phxStatic);
      }
      return this.joinChild(toEl);
    });
    if (newChildren.length === 0) {
      if (this.parent) {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
        this.parent.ackJoin(this);
      } else {
        this.onAllChildJoinsComplete();
        this.applyJoinPatch(live_patch, html, streams, events);
      }
    } else {
      this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
    }
  }
  attachTrueDocEl() {
    this.el = dom_default.byId(this.id);
    this.el.setAttribute(PHX_ROOT_ID, this.root.id);
  }
  execNewMounted() {
    let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
    let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
    dom_default.all(this.el, `[${phxViewportTop}], [${phxViewportBottom}]`, (hookEl) => {
      dom_default.maybeAddPrivateHooks(hookEl, phxViewportTop, phxViewportBottom);
      this.maybeAddNewHook(hookEl);
    });
    dom_default.all(this.el, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
      this.maybeAddNewHook(hookEl);
    });
    dom_default.all(this.el, `[${this.binding(PHX_MOUNTED)}]`, (el) => this.maybeMounted(el));
  }
  applyJoinPatch(live_patch, html, streams, events) {
    this.attachTrueDocEl();
    let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
    patch.markPrunableContentForRemoval();
    this.performPatch(patch, false);
    this.joinNewChildren();
    this.execNewMounted();
    this.joinPending = false;
    this.liveSocket.dispatchEvents(events);
    this.applyPendingUpdates();
    if (live_patch) {
      let { kind, to } = live_patch;
      this.liveSocket.historyPatch(to, kind);
    }
    this.hideLoader();
    if (this.joinCount > 1) {
      this.triggerReconnected();
    }
    this.stopCallback();
  }
  triggerBeforeUpdateHook(fromEl, toEl) {
    this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
    let hook = this.getHook(fromEl);
    let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
    if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
      hook.__beforeUpdate();
      return hook;
    }
  }
  maybeMounted(el) {
    let phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
    let hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
    if (phxMounted && !hasBeenInvoked) {
      this.liveSocket.execJS(el, phxMounted);
      dom_default.putPrivate(el, "mounted", true);
    }
  }
  maybeAddNewHook(el, force) {
    let newHook = this.addHook(el);
    if (newHook) {
      newHook.__mounted();
    }
  }
  performPatch(patch, pruneCids) {
    let removedEls = [];
    let phxChildrenAdded = false;
    let updatedHookIds = new Set;
    patch.after("added", (el) => {
      this.liveSocket.triggerDOM("onNodeAdded", [el]);
      this.maybeAddNewHook(el);
      if (el.getAttribute) {
        this.maybeMounted(el);
      }
    });
    patch.after("phxChildAdded", (el) => {
      if (dom_default.isPhxSticky(el)) {
        this.liveSocket.joinRootViews();
      } else {
        phxChildrenAdded = true;
      }
    });
    patch.before("updated", (fromEl, toEl) => {
      let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
      if (hook) {
        updatedHookIds.add(fromEl.id);
      }
    });
    patch.after("updated", (el) => {
      if (updatedHookIds.has(el.id)) {
        this.getHook(el).__updated();
      }
    });
    patch.after("discarded", (el) => {
      if (el.nodeType === Node.ELEMENT_NODE) {
        removedEls.push(el);
      }
    });
    patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
    patch.perform();
    this.afterElementsRemoved(removedEls, pruneCids);
    return phxChildrenAdded;
  }
  afterElementsRemoved(elements, pruneCids) {
    let destroyedCIDs = [];
    elements.forEach((parent) => {
      let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
      let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}]`);
      components.concat(parent).forEach((el) => {
        let cid = this.componentID(el);
        if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
          destroyedCIDs.push(cid);
        }
      });
      hooks.concat(parent).forEach((hookEl) => {
        let hook = this.getHook(hookEl);
        hook && this.destroyHook(hook);
      });
    });
    if (pruneCids) {
      this.maybePushComponentsDestroyed(destroyedCIDs);
    }
  }
  joinNewChildren() {
    dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
  }
  getChildById(id) {
    return this.root.children[this.id][id];
  }
  getDescendentByEl(el) {
    if (el.id === this.id) {
      return this;
    } else {
      return this.children[el.getAttribute(PHX_PARENT_ID)][el.id];
    }
  }
  destroyDescendent(id) {
    for (let parentId in this.root.children) {
      for (let childId in this.root.children[parentId]) {
        if (childId === id) {
          return this.root.children[parentId][childId].destroy();
        }
      }
    }
  }
  joinChild(el) {
    let child = this.getChildById(el.id);
    if (!child) {
      let view = new View(el, this.liveSocket, this);
      this.root.children[this.id][view.id] = view;
      view.join();
      this.childJoins++;
      return true;
    }
  }
  isJoinPending() {
    return this.joinPending;
  }
  ackJoin(_child) {
    this.childJoins--;
    if (this.childJoins === 0) {
      if (this.parent) {
        this.parent.ackJoin(this);
      } else {
        this.onAllChildJoinsComplete();
      }
    }
  }
  onAllChildJoinsComplete() {
    this.joinCallback(() => {
      this.pendingJoinOps.forEach(([view, op]) => {
        if (!view.isDestroyed()) {
          op();
        }
      });
      this.pendingJoinOps = [];
    });
  }
  update(diff, events) {
    if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
      return this.pendingDiffs.push({ diff, events });
    }
    this.rendered.mergeDiff(diff);
    let phxChildrenAdded = false;
    if (this.rendered.isComponentOnlyDiff(diff)) {
      this.liveSocket.time("component patch complete", () => {
        let parentCids = dom_default.findParentCIDs(this.el, this.rendered.componentCIDs(diff));
        parentCids.forEach((parentCID) => {
          if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
            phxChildrenAdded = true;
          }
        });
      });
    } else if (!isEmpty(diff)) {
      this.liveSocket.time("full patch complete", () => {
        let [html, streams] = this.renderContainer(diff, "update");
        let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
        phxChildrenAdded = this.performPatch(patch, true);
      });
    }
    this.liveSocket.dispatchEvents(events);
    if (phxChildrenAdded) {
      this.joinNewChildren();
    }
  }
  renderContainer(diff, kind) {
    return this.liveSocket.time(`toString diff (${kind})`, () => {
      let tag = this.el.tagName;
      let cids = diff ? this.rendered.componentCIDs(diff).concat(this.pruningCIDs) : null;
      let [html, streams] = this.rendered.toString(cids);
      return [`<${tag}>${html}</${tag}>`, streams];
    });
  }
  componentPatch(diff, cid) {
    if (isEmpty(diff))
      return false;
    let [html, streams] = this.rendered.componentToString(cid);
    let patch = new DOMPatch(this, this.el, this.id, html, streams, cid);
    let childrenAdded = this.performPatch(patch, true);
    return childrenAdded;
  }
  getHook(el) {
    return this.viewHooks[ViewHook.elementID(el)];
  }
  addHook(el) {
    if (ViewHook.elementID(el) || !el.getAttribute) {
      return;
    }
    let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
    if (hookName && !this.ownsElement(el)) {
      return;
    }
    let callbacks = this.liveSocket.getHookCallbacks(hookName);
    if (callbacks) {
      if (!el.id) {
        logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
      }
      let hook = new ViewHook(this, el, callbacks);
      this.viewHooks[ViewHook.elementID(hook.el)] = hook;
      return hook;
    } else if (hookName !== null) {
      logError(`unknown hook found for "${hookName}"`, el);
    }
  }
  destroyHook(hook) {
    hook.__destroyed();
    hook.__cleanup__();
    delete this.viewHooks[ViewHook.elementID(hook.el)];
  }
  applyPendingUpdates() {
    this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
    this.pendingDiffs = [];
    this.eachChild((child) => child.applyPendingUpdates());
  }
  eachChild(callback) {
    let children = this.root.children[this.id] || {};
    for (let id in children) {
      callback(this.getChildById(id));
    }
  }
  onChannel(event, cb) {
    this.liveSocket.onChannel(this.channel, event, (resp) => {
      if (this.isJoinPending()) {
        this.root.pendingJoinOps.push([this, () => cb(resp)]);
      } else {
        this.liveSocket.requestDOMUpdate(() => cb(resp));
      }
    });
  }
  bindChannel() {
    this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
      this.liveSocket.requestDOMUpdate(() => {
        this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
      });
    });
    this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
    this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
    this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
    this.channel.onError((reason) => this.onError(reason));
    this.channel.onClose((reason) => this.onClose(reason));
  }
  destroyAllChildren() {
    this.eachChild((child) => child.destroy());
  }
  onLiveRedirect(redir) {
    let { to, kind, flash } = redir;
    let url = this.expandURL(to);
    this.liveSocket.historyRedirect(url, kind, flash);
  }
  onLivePatch(redir) {
    let { to, kind } = redir;
    this.href = this.expandURL(to);
    this.liveSocket.historyPatch(to, kind);
  }
  expandURL(to) {
    return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
  }
  onRedirect({ to, flash }) {
    this.liveSocket.redirect(to, flash);
  }
  isDestroyed() {
    return this.destroyed;
  }
  joinDead() {
    this.isDead = true;
  }
  join(callback) {
    this.showLoader(this.liveSocket.loaderTimeout);
    this.bindChannel();
    if (this.isMain()) {
      this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
    }
    this.joinCallback = (onDone) => {
      onDone = onDone || function() {
      };
      callback ? callback(this.joinCount, onDone) : onDone();
    };
    this.liveSocket.wrapPush(this, { timeout: false }, () => {
      return this.channel.join().receive("ok", (data) => {
        if (!this.isDestroyed()) {
          this.liveSocket.requestDOMUpdate(() => this.onJoin(data));
        }
      }).receive("error", (resp) => !this.isDestroyed() && this.onJoinError(resp)).receive("timeout", () => !this.isDestroyed() && this.onJoinError({ reason: "timeout" }));
    });
  }
  onJoinError(resp) {
    if (resp.reason === "reload") {
      this.log("error", () => [`failed mount with ${resp.status}. Falling back to page request`, resp]);
      if (this.isMain()) {
        this.onRedirect({ to: this.href });
      }
      return;
    } else if (resp.reason === "unauthorized" || resp.reason === "stale") {
      this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
      if (this.isMain()) {
        this.onRedirect({ to: this.href });
      }
      return;
    }
    if (resp.redirect || resp.live_redirect) {
      this.joinPending = false;
      this.channel.leave();
    }
    if (resp.redirect) {
      return this.onRedirect(resp.redirect);
    }
    if (resp.live_redirect) {
      return this.onLiveRedirect(resp.live_redirect);
    }
    this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
    this.log("error", () => ["unable to join", resp]);
    if (this.liveSocket.isConnected()) {
      this.liveSocket.reloadWithJitter(this);
    }
  }
  onClose(reason) {
    if (this.isDestroyed()) {
      return;
    }
    if (this.liveSocket.hasPendingLink() && reason !== "leave") {
      return this.liveSocket.reloadWithJitter(this);
    }
    this.destroyAllChildren();
    this.liveSocket.dropActiveElement(this);
    if (document.activeElement) {
      document.activeElement.blur();
    }
    if (this.liveSocket.isUnloaded()) {
      this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
    }
  }
  onError(reason) {
    this.onClose(reason);
    if (this.liveSocket.isConnected()) {
      this.log("error", () => ["view crashed", reason]);
    }
    if (!this.liveSocket.isUnloaded()) {
      if (this.liveSocket.isConnected()) {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
      } else {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS]);
      }
    }
  }
  displayError(classes) {
    if (this.isMain()) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
    }
    this.showLoader();
    this.setContainerClasses(...classes);
    this.execAll(this.binding("disconnected"));
  }
  pushWithReply(refGenerator, event, payload, onReply = function() {
  }) {
    if (!this.isConnected()) {
      return;
    }
    let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
    let onLoadingDone = function() {
    };
    if (opts.page_loading || el && el.getAttribute(this.binding(PHX_PAGE_LOADING)) !== null) {
      onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
    }
    if (typeof payload.cid !== "number") {
      delete payload.cid;
    }
    return this.liveSocket.wrapPush(this, { timeout: true }, () => {
      return this.channel.push(event, payload, PUSH_TIMEOUT).receive("ok", (resp) => {
        let finish = (hookReply) => {
          if (resp.redirect) {
            this.onRedirect(resp.redirect);
          }
          if (resp.live_patch) {
            this.onLivePatch(resp.live_patch);
          }
          if (resp.live_redirect) {
            this.onLiveRedirect(resp.live_redirect);
          }
          onLoadingDone();
          onReply(resp, hookReply);
        };
        if (resp.diff) {
          this.liveSocket.requestDOMUpdate(() => {
            this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
              if (ref !== null) {
                this.undoRefs(ref);
              }
              this.update(diff, events);
              finish(reply);
            });
          });
        } else {
          if (ref !== null) {
            this.undoRefs(ref);
          }
          finish(null);
        }
      });
    });
  }
  undoRefs(ref) {
    if (!this.isConnected()) {
      return;
    }
    dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}="${ref}"]`, (el) => {
      let disabledVal = el.getAttribute(PHX_DISABLED);
      el.removeAttribute(PHX_REF);
      el.removeAttribute(PHX_REF_SRC);
      if (el.getAttribute(PHX_READONLY) !== null) {
        el.readOnly = false;
        el.removeAttribute(PHX_READONLY);
      }
      if (disabledVal !== null) {
        el.disabled = disabledVal === "true" ? true : false;
        el.removeAttribute(PHX_DISABLED);
      }
      PHX_EVENT_CLASSES.forEach((className) => dom_default.removeClass(el, className));
      let disableRestore = el.getAttribute(PHX_DISABLE_WITH_RESTORE);
      if (disableRestore !== null) {
        el.innerText = disableRestore;
        el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
      }
      let toEl = dom_default.private(el, PHX_REF);
      if (toEl) {
        let hook = this.triggerBeforeUpdateHook(el, toEl);
        DOMPatch.patchEl(el, toEl, this.liveSocket.getActiveElement());
        if (hook) {
          hook.__updated();
        }
        dom_default.deletePrivate(el, PHX_REF);
      }
    });
  }
  putRef(elements, event, opts = {}) {
    let newRef = this.ref++;
    let disableWith = this.binding(PHX_DISABLE_WITH);
    if (opts.loading) {
      elements = elements.concat(dom_default.all(document, opts.loading));
    }
    elements.forEach((el) => {
      el.classList.add(`phx-${event}-loading`);
      el.setAttribute(PHX_REF, newRef);
      el.setAttribute(PHX_REF_SRC, this.el.id);
      let disableText = el.getAttribute(disableWith);
      if (disableText !== null) {
        if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
          el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
        }
        if (disableText !== "") {
          el.innerText = disableText;
        }
        el.setAttribute("disabled", "");
      }
    });
    return [newRef, elements, opts];
  }
  componentID(el) {
    let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
    return cid ? parseInt(cid) : null;
  }
  targetComponentID(target, targetCtx, opts = {}) {
    if (isCid(targetCtx)) {
      return targetCtx;
    }
    let cidOrSelector = target.getAttribute(this.binding("target"));
    if (isCid(cidOrSelector)) {
      return parseInt(cidOrSelector);
    } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
      return this.closestComponentID(targetCtx);
    } else {
      return null;
    }
  }
  closestComponentID(targetCtx) {
    if (isCid(targetCtx)) {
      return targetCtx;
    } else if (targetCtx) {
      return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
    } else {
      return null;
    }
  }
  pushHookEvent(el, targetCtx, event, payload, onReply) {
    if (!this.isConnected()) {
      this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
      return false;
    }
    let [ref, els, opts] = this.putRef([el], "hook");
    this.pushWithReply(() => [ref, els, opts], "event", {
      type: "hook",
      event,
      value: payload,
      cid: this.closestComponentID(targetCtx)
    }, (resp, reply) => onReply(reply, ref));
    return ref;
  }
  extractMeta(el, meta, value) {
    let prefix = this.binding("value-");
    for (let i = 0;i < el.attributes.length; i++) {
      if (!meta) {
        meta = {};
      }
      let name = el.attributes[i].name;
      if (name.startsWith(prefix)) {
        meta[name.replace(prefix, "")] = el.getAttribute(name);
      }
    }
    if (el.value !== undefined && !(el instanceof HTMLFormElement)) {
      if (!meta) {
        meta = {};
      }
      meta.value = el.value;
      if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
        delete meta.value;
      }
    }
    if (value) {
      if (!meta) {
        meta = {};
      }
      for (let key in value) {
        meta[key] = value[key];
      }
    }
    return meta;
  }
  pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}, onReply) {
    this.pushWithReply(() => this.putRef([el], type, opts), "event", {
      type,
      event: phxEvent,
      value: this.extractMeta(el, meta, opts.value),
      cid: this.targetComponentID(el, targetCtx, opts)
    }, (resp, reply) => onReply && onReply(reply));
  }
  pushFileProgress(fileEl, entryRef, progress, onReply = function() {
  }) {
    this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
      view.pushWithReply(null, "progress", {
        event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
        ref: fileEl.getAttribute(PHX_UPLOAD_REF),
        entry_ref: entryRef,
        progress,
        cid: view.targetComponentID(fileEl.form, targetCtx)
      }, onReply);
    });
  }
  pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
    let uploads;
    let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx);
    let refGenerator = () => this.putRef([inputEl, inputEl.form], "change", opts);
    let formData;
    let meta = this.extractMeta(inputEl.form);
    if (inputEl.getAttribute(this.binding("change"))) {
      formData = serializeForm(inputEl.form, { _target: opts._target, ...meta }, [inputEl.name]);
    } else {
      formData = serializeForm(inputEl.form, { _target: opts._target, ...meta });
    }
    if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
      LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
    }
    uploads = LiveUploader.serializeUploads(inputEl);
    let event = {
      type: "form",
      event: phxEvent,
      value: formData,
      uploads,
      cid
    };
    this.pushWithReply(refGenerator, "event", event, (resp) => {
      dom_default.showError(inputEl, this.liveSocket.binding(PHX_FEEDBACK_FOR));
      if (dom_default.isUploadInput(inputEl) && dom_default.isAutoUpload(inputEl)) {
        if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
          let [ref, _els] = refGenerator();
          this.uploadFiles(inputEl.form, targetCtx, ref, cid, (_uploads) => {
            callback && callback(resp);
            this.triggerAwaitingSubmit(inputEl.form);
          });
        }
      } else {
        callback && callback(resp);
      }
    });
  }
  triggerAwaitingSubmit(formEl) {
    let awaitingSubmit = this.getScheduledSubmit(formEl);
    if (awaitingSubmit) {
      let [_el, _ref, _opts, callback] = awaitingSubmit;
      this.cancelSubmit(formEl);
      callback();
    }
  }
  getScheduledSubmit(formEl) {
    return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
  }
  scheduleSubmit(formEl, ref, opts, callback) {
    if (this.getScheduledSubmit(formEl)) {
      return true;
    }
    this.formSubmits.push([formEl, ref, opts, callback]);
  }
  cancelSubmit(formEl) {
    this.formSubmits = this.formSubmits.filter(([el, ref, _callback]) => {
      if (el.isSameNode(formEl)) {
        this.undoRefs(ref);
        return false;
      } else {
        return true;
      }
    });
  }
  disableForm(formEl, opts = {}) {
    let filterIgnored = (el) => {
      let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
      return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
    };
    let filterDisables = (el) => {
      return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
    };
    let filterButton = (el) => el.tagName == "BUTTON";
    let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    let formElements = Array.from(formEl.elements);
    let disables = formElements.filter(filterDisables);
    let buttons = formElements.filter(filterButton).filter(filterIgnored);
    let inputs = formElements.filter(filterInput).filter(filterIgnored);
    buttons.forEach((button) => {
      button.setAttribute(PHX_DISABLED, button.disabled);
      button.disabled = true;
    });
    inputs.forEach((input) => {
      input.setAttribute(PHX_READONLY, input.readOnly);
      input.readOnly = true;
      if (input.files) {
        input.setAttribute(PHX_DISABLED, input.disabled);
        input.disabled = true;
      }
    });
    formEl.setAttribute(this.binding(PHX_PAGE_LOADING), "");
    return this.putRef([formEl].concat(disables).concat(buttons).concat(inputs), "submit", opts);
  }
  pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply) {
    let refGenerator = () => this.disableForm(formEl, opts);
    let cid = this.targetComponentID(formEl, targetCtx);
    if (LiveUploader.hasUploadsInProgress(formEl)) {
      let [ref, _els] = refGenerator();
      let push = () => this.pushFormSubmit(formEl, submitter, targetCtx, phxEvent, opts, onReply);
      return this.scheduleSubmit(formEl, ref, opts, push);
    } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
      let [ref, els] = refGenerator();
      let proxyRefGen = () => [ref, els, opts];
      this.uploadFiles(formEl, targetCtx, ref, cid, (_uploads) => {
        let meta = this.extractMeta(formEl);
        let formData = serializeForm(formEl, { submitter, ...meta });
        this.pushWithReply(proxyRefGen, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }, onReply);
      });
    } else if (!(formEl.hasAttribute(PHX_REF) && formEl.classList.contains("phx-submit-loading"))) {
      let meta = this.extractMeta(formEl);
      let formData = serializeForm(formEl, { submitter, ...meta });
      this.pushWithReply(refGenerator, "event", {
        type: "form",
        event: phxEvent,
        value: formData,
        cid
      }, onReply);
    }
  }
  uploadFiles(formEl, targetCtx, ref, cid, onComplete) {
    let joinCountAtUpload = this.joinCount;
    let inputEls = LiveUploader.activeFileInputs(formEl);
    let numFileInputsInProgress = inputEls.length;
    inputEls.forEach((inputEl) => {
      let uploader = new LiveUploader(inputEl, this, () => {
        numFileInputsInProgress--;
        if (numFileInputsInProgress === 0) {
          onComplete();
        }
      });
      this.uploaders[inputEl] = uploader;
      let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
      let payload = {
        ref: inputEl.getAttribute(PHX_UPLOAD_REF),
        entries,
        cid: this.targetComponentID(inputEl.form, targetCtx)
      };
      this.log("upload", () => ["sending preflight request", payload]);
      this.pushWithReply(null, "allow_upload", payload, (resp) => {
        this.log("upload", () => ["got preflight response", resp]);
        if (resp.error) {
          this.undoRefs(ref);
          let [entry_ref, reason] = resp.error;
          this.log("upload", () => [`error for entry ${entry_ref}`, reason]);
        } else {
          let onError = (callback) => {
            this.channel.onError(() => {
              if (this.joinCount === joinCountAtUpload) {
                callback();
              }
            });
          };
          uploader.initAdapterUpload(resp, onError, this.liveSocket);
        }
      });
    });
  }
  dispatchUploads(targetCtx, name, filesOrBlobs) {
    let targetElement = this.targetCtxElement(targetCtx) || this.el;
    let inputs = dom_default.findUploadInputs(targetElement).filter((el) => el.name === name);
    if (inputs.length === 0) {
      logError(`no live file inputs found matching the name "${name}"`);
    } else if (inputs.length > 1) {
      logError(`duplicate live file inputs found matching the name "${name}"`);
    } else {
      dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
    }
  }
  targetCtxElement(targetCtx) {
    if (isCid(targetCtx)) {
      let [target] = dom_default.findComponentNodeList(this.el, targetCtx);
      return target;
    } else if (targetCtx) {
      return targetCtx;
    } else {
      return null;
    }
  }
  pushFormRecovery(form, newCid, callback) {
    this.liveSocket.withinOwners(form, (view, targetCtx) => {
      let phxChange = this.binding("change");
      let inputs = Array.from(form.elements).filter((el) => dom_default.isFormInput(el) && el.name && !el.hasAttribute(phxChange));
      if (inputs.length === 0) {
        return;
      }
      inputs.forEach((input2) => input2.hasAttribute(PHX_UPLOAD_REF) && LiveUploader.clearFiles(input2));
      let input = inputs.find((el) => el.type !== "hidden") || inputs[0];
      let phxEvent = form.getAttribute(this.binding(PHX_AUTO_RECOVER)) || form.getAttribute(this.binding("change"));
      js_default.exec("change", phxEvent, view, input, ["push", { _target: input.name, newCid, callback }]);
    });
  }
  pushLinkPatch(href, targetEl, callback) {
    let linkRef = this.liveSocket.setPendingLink(href);
    let refGen = targetEl ? () => this.putRef([targetEl], "click") : null;
    let fallback = () => this.liveSocket.redirect(window.location.href);
    let url = href.startsWith("/") ? `${location.protocol}//${location.host}${href}` : href;
    let push = this.pushWithReply(refGen, "live_patch", { url }, (resp) => {
      this.liveSocket.requestDOMUpdate(() => {
        if (resp.link_redirect) {
          this.liveSocket.replaceMain(href, null, callback, linkRef);
        } else {
          if (this.liveSocket.commitPendingLink(linkRef)) {
            this.href = href;
          }
          this.applyPendingUpdates();
          callback && callback(linkRef);
        }
      });
    });
    if (push) {
      push.receive("timeout", fallback);
    } else {
      fallback();
    }
  }
  formsForRecovery(html) {
    if (this.joinCount === 0) {
      return [];
    }
    let phxChange = this.binding("change");
    let template = document.createElement("template");
    template.innerHTML = html;
    return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id && this.ownsElement(form)).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
      const phxChangeValue = form.getAttribute(phxChange).replaceAll(/([\[\]"])/g, "\\$1");
      let newForm = template.content.querySelector(`form[id="${form.id}"][${phxChange}="${phxChangeValue}"]`);
      if (newForm) {
        return [form, newForm, this.targetComponentID(newForm)];
      } else {
        return [form, form, this.targetComponentID(form)];
      }
    }).filter(([form, newForm, newCid]) => newForm);
  }
  maybePushComponentsDestroyed(destroyedCIDs) {
    let willDestroyCIDs = destroyedCIDs.filter((cid) => {
      return dom_default.findComponentNodeList(this.el, cid).length === 0;
    });
    if (willDestroyCIDs.length > 0) {
      this.pruningCIDs.push(...willDestroyCIDs);
      this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }, () => {
        this.pruningCIDs = this.pruningCIDs.filter((cid) => willDestroyCIDs.indexOf(cid) !== -1);
        let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
          return dom_default.findComponentNodeList(this.el, cid).length === 0;
        });
        if (completelyDestroyCIDs.length > 0) {
          this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }, (resp) => {
            this.rendered.pruneCIDs(resp.cids);
          });
        }
      });
    }
  }
  ownsElement(el) {
    let parentViewEl = el.closest(PHX_VIEW_SELECTOR);
    return el.getAttribute(PHX_PARENT_ID) === this.id || parentViewEl && parentViewEl.id === this.id || !parentViewEl && this.isDead;
  }
  submitForm(form, targetCtx, phxEvent, submitter, opts = {}) {
    dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
    let phxFeedback = this.liveSocket.binding(PHX_FEEDBACK_FOR);
    let inputs = Array.from(form.elements);
    inputs.forEach((input) => dom_default.putPrivate(input, PHX_HAS_SUBMITTED, true));
    this.liveSocket.blurActiveElement(this);
    this.pushFormSubmit(form, targetCtx, phxEvent, submitter, opts, () => {
      inputs.forEach((input) => dom_default.showError(input, phxFeedback));
      this.liveSocket.restorePreviouslyActiveFocus();
    });
  }
  binding(kind) {
    return this.liveSocket.binding(kind);
  }
};
var LiveSocket = class {
  constructor(url, phxSocket, opts = {}) {
    this.unloaded = false;
    if (!phxSocket || phxSocket.constructor.name === "Object") {
      throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
    }
    this.socket = new phxSocket(url, opts);
    this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
    this.opts = opts;
    this.params = closure2(opts.params || {});
    this.viewLogger = opts.viewLogger;
    this.metadataCallbacks = opts.metadata || {};
    this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
    this.activeElement = null;
    this.prevActive = null;
    this.silenced = false;
    this.main = null;
    this.outgoingMainEl = null;
    this.clickStartedAtTarget = null;
    this.linkRef = 1;
    this.roots = {};
    this.href = window.location.href;
    this.pendingLink = null;
    this.currentLocation = clone(window.location);
    this.hooks = opts.hooks || {};
    this.uploaders = opts.uploaders || {};
    this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
    this.reloadWithJitterTimer = null;
    this.maxReloads = opts.maxReloads || MAX_RELOADS;
    this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
    this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
    this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
    this.localStorage = opts.localStorage || window.localStorage;
    this.sessionStorage = opts.sessionStorage || window.sessionStorage;
    this.boundTopLevelEvents = false;
    this.domCallbacks = Object.assign({ onNodeAdded: closure2(), onBeforeElUpdated: closure2() }, opts.dom || {});
    this.transitions = new TransitionSet;
    window.addEventListener("pagehide", (_e) => {
      this.unloaded = true;
    });
    this.socket.onOpen(() => {
      if (this.isUnloaded()) {
        window.location.reload();
      }
    });
  }
  isProfileEnabled() {
    return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
  }
  isDebugEnabled() {
    return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
  }
  isDebugDisabled() {
    return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
  }
  enableDebug() {
    this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
  }
  enableProfiling() {
    this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
  }
  disableDebug() {
    this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
  }
  disableProfiling() {
    this.sessionStorage.removeItem(PHX_LV_PROFILE);
  }
  enableLatencySim(upperBoundMs) {
    this.enableDebug();
    console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
    this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
  }
  disableLatencySim() {
    this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
  }
  getLatencySim() {
    let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
    return str ? parseInt(str) : null;
  }
  getSocket() {
    return this.socket;
  }
  connect() {
    if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
      this.enableDebug();
    }
    let doConnect = () => {
      if (this.joinRootViews()) {
        this.bindTopLevelEvents();
        this.socket.connect();
      } else if (this.main) {
        this.socket.connect();
      } else {
        this.bindTopLevelEvents({ dead: true });
      }
      this.joinDeadView();
    };
    if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
      doConnect();
    } else {
      document.addEventListener("DOMContentLoaded", () => doConnect());
    }
  }
  disconnect(callback) {
    clearTimeout(this.reloadWithJitterTimer);
    this.socket.disconnect(callback);
  }
  replaceTransport(transport) {
    clearTimeout(this.reloadWithJitterTimer);
    this.socket.replaceTransport(transport);
    this.connect();
  }
  execJS(el, encodedJS, eventType = null) {
    this.owner(el, (view) => js_default.exec(eventType, encodedJS, view, el));
  }
  execJSHookPush(el, phxEvent, data, callback) {
    this.withinOwners(el, (view) => {
      js_default.exec("hook", phxEvent, view, el, ["push", { data, callback }]);
    });
  }
  unload() {
    if (this.unloaded) {
      return;
    }
    if (this.main && this.isConnected()) {
      this.log(this.main, "socket", () => ["disconnect for page nav"]);
    }
    this.unloaded = true;
    this.destroyAllViews();
    this.disconnect();
  }
  triggerDOM(kind, args) {
    this.domCallbacks[kind](...args);
  }
  time(name, func) {
    if (!this.isProfileEnabled() || !console.time) {
      return func();
    }
    console.time(name);
    let result = func();
    console.timeEnd(name);
    return result;
  }
  log(view, kind, msgCallback) {
    if (this.viewLogger) {
      let [msg, obj] = msgCallback();
      this.viewLogger(view, kind, msg, obj);
    } else if (this.isDebugEnabled()) {
      let [msg, obj] = msgCallback();
      debug(view, kind, msg, obj);
    }
  }
  requestDOMUpdate(callback) {
    this.transitions.after(callback);
  }
  transition(time, onStart, onDone = function() {
  }) {
    this.transitions.addTransition(time, onStart, onDone);
  }
  onChannel(channel, event, cb) {
    channel.on(event, (data) => {
      let latency = this.getLatencySim();
      if (!latency) {
        cb(data);
      } else {
        setTimeout(() => cb(data), latency);
      }
    });
  }
  wrapPush(view, opts, push) {
    let latency = this.getLatencySim();
    let oldJoinCount = view.joinCount;
    if (!latency) {
      if (this.isConnected() && opts.timeout) {
        return push().receive("timeout", () => {
          if (view.joinCount === oldJoinCount && !view.isDestroyed()) {
            this.reloadWithJitter(view, () => {
              this.log(view, "timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
            });
          }
        });
      } else {
        return push();
      }
    }
    let fakePush = {
      receives: [],
      receive(kind, cb) {
        this.receives.push([kind, cb]);
      }
    };
    setTimeout(() => {
      if (view.isDestroyed()) {
        return;
      }
      fakePush.receives.reduce((acc, [kind, cb]) => acc.receive(kind, cb), push());
    }, latency);
    return fakePush;
  }
  reloadWithJitter(view, log) {
    clearTimeout(this.reloadWithJitterTimer);
    this.disconnect();
    let minMs = this.reloadJitterMin;
    let maxMs = this.reloadJitterMax;
    let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
    if (tries > this.maxReloads) {
      afterMs = this.failsafeJitter;
    }
    this.reloadWithJitterTimer = setTimeout(() => {
      if (view.isDestroyed() || view.isConnected()) {
        return;
      }
      view.destroy();
      log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
      if (tries > this.maxReloads) {
        this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
      }
      if (this.hasPendingLink()) {
        window.location = this.pendingLink;
      } else {
        window.location.reload();
      }
    }, afterMs);
  }
  getHookCallbacks(name) {
    return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
  }
  isUnloaded() {
    return this.unloaded;
  }
  isConnected() {
    return this.socket.isConnected();
  }
  getBindingPrefix() {
    return this.bindingPrefix;
  }
  binding(kind) {
    return `${this.getBindingPrefix()}${kind}`;
  }
  channel(topic, params) {
    return this.socket.channel(topic, params);
  }
  joinDeadView() {
    let body = document.body;
    if (body && !this.isPhxView(body) && !this.isPhxView(document.firstElementChild)) {
      let view = this.newRootView(body);
      view.setHref(this.getHref());
      view.joinDead();
      if (!this.main) {
        this.main = view;
      }
      window.requestAnimationFrame(() => view.execNewMounted());
    }
  }
  joinRootViews() {
    let rootsFound = false;
    dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
      if (!this.getRootById(rootEl.id)) {
        let view = this.newRootView(rootEl);
        view.setHref(this.getHref());
        view.join();
        if (rootEl.hasAttribute(PHX_MAIN)) {
          this.main = view;
        }
      }
      rootsFound = true;
    });
    return rootsFound;
  }
  redirect(to, flash) {
    this.unload();
    browser_default.redirect(to, flash);
  }
  replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
    let liveReferer = this.currentLocation.href;
    this.outgoingMainEl = this.outgoingMainEl || this.main.el;
    let newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
    this.main.showLoader(this.loaderTimeout);
    this.main.destroy();
    this.main = this.newRootView(newMainEl, flash, liveReferer);
    this.main.setRedirect(href);
    this.transitionRemoves();
    this.main.join((joinCount, onDone) => {
      if (joinCount === 1 && this.commitPendingLink(linkRef)) {
        this.requestDOMUpdate(() => {
          dom_default.findPhxSticky(document).forEach((el) => newMainEl.appendChild(el));
          this.outgoingMainEl.replaceWith(newMainEl);
          this.outgoingMainEl = null;
          callback && requestAnimationFrame(() => callback(linkRef));
          onDone();
        });
      }
    });
  }
  transitionRemoves(elements) {
    let removeAttr = this.binding("remove");
    elements = elements || dom_default.all(document, `[${removeAttr}]`);
    elements.forEach((el) => {
      this.execJS(el, el.getAttribute(removeAttr), "remove");
    });
  }
  isPhxView(el) {
    return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
  }
  newRootView(el, flash, liveReferer) {
    let view = new View(el, this, null, flash, liveReferer);
    this.roots[view.id] = view;
    return view;
  }
  owner(childEl, callback) {
    let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
    if (view) {
      callback(view);
    }
  }
  withinOwners(childEl, callback) {
    this.owner(childEl, (view) => callback(view, childEl));
  }
  getViewByEl(el) {
    let rootId = el.getAttribute(PHX_ROOT_ID);
    return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
  }
  getRootById(id) {
    return this.roots[id];
  }
  destroyAllViews() {
    for (let id in this.roots) {
      this.roots[id].destroy();
      delete this.roots[id];
    }
    this.main = null;
  }
  destroyViewByEl(el) {
    let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
    if (root && root.id === el.id) {
      root.destroy();
      delete this.roots[root.id];
    } else if (root) {
      root.destroyDescendent(el.id);
    }
  }
  setActiveElement(target) {
    if (this.activeElement === target) {
      return;
    }
    this.activeElement = target;
    let cancel = () => {
      if (target === this.activeElement) {
        this.activeElement = null;
      }
      target.removeEventListener("mouseup", this);
      target.removeEventListener("touchend", this);
    };
    target.addEventListener("mouseup", cancel);
    target.addEventListener("touchend", cancel);
  }
  getActiveElement() {
    if (document.activeElement === document.body) {
      return this.activeElement || document.activeElement;
    } else {
      return document.activeElement || document.body;
    }
  }
  dropActiveElement(view) {
    if (this.prevActive && view.ownsElement(this.prevActive)) {
      this.prevActive = null;
    }
  }
  restorePreviouslyActiveFocus() {
    if (this.prevActive && this.prevActive !== document.body) {
      this.prevActive.focus();
    }
  }
  blurActiveElement() {
    this.prevActive = this.getActiveElement();
    if (this.prevActive !== document.body) {
      this.prevActive.blur();
    }
  }
  bindTopLevelEvents({ dead } = {}) {
    if (this.boundTopLevelEvents) {
      return;
    }
    this.boundTopLevelEvents = true;
    this.socket.onClose((event) => {
      if (event && event.code === 1000 && this.main) {
        return this.reloadWithJitter(this.main);
      }
    });
    document.body.addEventListener("click", function() {
    });
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) {
        this.getSocket().disconnect();
        this.withPageLoading({ to: window.location.href, kind: "redirect" });
        window.location.reload();
      }
    }, true);
    if (!dead) {
      this.bindNav();
    }
    this.bindClicks();
    if (!dead) {
      this.bindForms();
    }
    this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
      let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
      let pressedKey = e.key && e.key.toLowerCase();
      if (matchKey && matchKey.toLowerCase() !== pressedKey) {
        return;
      }
      let data = { key: e.key, ...this.eventMeta(type, e, targetEl) };
      js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
    });
    this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
      if (!eventTarget) {
        let data = { key: e.key, ...this.eventMeta(type, e, targetEl) };
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      }
    });
    this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, targetCtx, phxEvent, phxTarget) => {
      if (phxTarget === "window") {
        let data = this.eventMeta(type, e, targetEl);
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      }
    });
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => {
      e.preventDefault();
      let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
        return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
      });
      let dropTarget = dropTargetId && document.getElementById(dropTargetId);
      let files = Array.from(e.dataTransfer.files || []);
      if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
        return;
      }
      LiveUploader.trackFiles(dropTarget, files, e.dataTransfer);
      dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
    });
    this.on(PHX_TRACK_UPLOADS, (e) => {
      let uploadTarget = e.target;
      if (!dom_default.isUploadInput(uploadTarget)) {
        return;
      }
      let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
      LiveUploader.trackFiles(uploadTarget, files);
      uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  eventMeta(eventName, e, targetEl) {
    let callback = this.metadataCallbacks[eventName];
    return callback ? callback(e, targetEl) : {};
  }
  setPendingLink(href) {
    this.linkRef++;
    this.pendingLink = href;
    return this.linkRef;
  }
  commitPendingLink(linkRef) {
    if (this.linkRef !== linkRef) {
      return false;
    } else {
      this.href = this.pendingLink;
      this.pendingLink = null;
      return true;
    }
  }
  getHref() {
    return this.href;
  }
  hasPendingLink() {
    return !!this.pendingLink;
  }
  bind(events, callback) {
    for (let event in events) {
      let browserEventName = events[event];
      this.on(browserEventName, (e) => {
        let binding = this.binding(event);
        let windowBinding = this.binding(`window-${event}`);
        let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
        if (targetPhxEvent) {
          this.debounce(e.target, e, browserEventName, () => {
            this.withinOwners(e.target, (view) => {
              callback(e, event, view, e.target, targetPhxEvent, null);
            });
          });
        } else {
          dom_default.all(document, `[${windowBinding}]`, (el) => {
            let phxEvent = el.getAttribute(windowBinding);
            this.debounce(el, e, browserEventName, () => {
              this.withinOwners(el, (view) => {
                callback(e, event, view, el, phxEvent, "window");
              });
            });
          });
        }
      });
    }
  }
  bindClicks() {
    window.addEventListener("click", (e) => this.clickStartedAtTarget = e.target);
    this.bindClick("click", "click", false);
    this.bindClick("mousedown", "capture-click", true);
  }
  bindClick(eventName, bindingName, capture) {
    let click = this.binding(bindingName);
    window.addEventListener(eventName, (e) => {
      let target = null;
      if (capture) {
        target = e.target.matches(`[${click}]`) ? e.target : e.target.querySelector(`[${click}]`);
      } else {
        let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
        target = closestPhxBinding(clickStartedAtTarget, click);
        this.dispatchClickAway(e, clickStartedAtTarget);
        this.clickStartedAtTarget = null;
      }
      let phxEvent = target && target.getAttribute(click);
      if (!phxEvent) {
        if (!capture && dom_default.isNewPageClick(e, window.location)) {
          this.unload();
        }
        return;
      }
      if (target.getAttribute("href") === "#") {
        e.preventDefault();
      }
      if (target.hasAttribute(PHX_REF)) {
        return;
      }
      this.debounce(target, e, "click", () => {
        this.withinOwners(target, (view) => {
          js_default.exec("click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
        });
      });
    }, capture);
  }
  dispatchClickAway(e, clickStartedAt) {
    let phxClickAway = this.binding("click-away");
    dom_default.all(document, `[${phxClickAway}]`, (el) => {
      if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
        this.withinOwners(e.target, (view) => {
          let phxEvent = el.getAttribute(phxClickAway);
          if (js_default.isVisible(el)) {
            js_default.exec("click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
          }
        });
      }
    });
  }
  bindNav() {
    if (!browser_default.canPushState()) {
      return;
    }
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    let scrollTimer = null;
    window.addEventListener("scroll", (_e) => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
      }, 100);
    });
    window.addEventListener("popstate", (event) => {
      if (!this.registerNewLocation(window.location)) {
        return;
      }
      let { type, id, root, scroll } = event.state || {};
      let href = window.location.href;
      dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: type === "patch", pop: true } });
      this.requestDOMUpdate(() => {
        if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
          this.main.pushLinkPatch(href, null, () => {
            this.maybeScroll(scroll);
          });
        } else {
          this.replaceMain(href, null, () => {
            if (root) {
              this.replaceRootHistory();
            }
            this.maybeScroll(scroll);
          });
        }
      });
    }, false);
    window.addEventListener("click", (e) => {
      let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
      let type = target && target.getAttribute(PHX_LIVE_LINK);
      if (!type || !this.isConnected() || !this.main || dom_default.wantsNewTab(e)) {
        return;
      }
      let href = target.href;
      let linkState = target.getAttribute(PHX_LINK_STATE);
      e.preventDefault();
      e.stopImmediatePropagation();
      if (this.pendingLink === href) {
        return;
      }
      this.requestDOMUpdate(() => {
        if (type === "patch") {
          this.pushHistoryPatch(href, linkState, target);
        } else if (type === "redirect") {
          this.historyRedirect(href, linkState);
        } else {
          throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
        }
        let phxClick = target.getAttribute(this.binding("click"));
        if (phxClick) {
          this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
        }
      });
    }, false);
  }
  maybeScroll(scroll) {
    if (typeof scroll === "number") {
      requestAnimationFrame(() => {
        window.scrollTo(0, scroll);
      });
    }
  }
  dispatchEvent(event, payload = {}) {
    dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
  }
  dispatchEvents(events) {
    events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
  }
  withPageLoading(info, callback) {
    dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
    let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
    return callback ? callback(done) : done;
  }
  pushHistoryPatch(href, linkState, targetEl) {
    if (!this.isConnected()) {
      return browser_default.redirect(href);
    }
    this.withPageLoading({ to: href, kind: "patch" }, (done) => {
      this.main.pushLinkPatch(href, targetEl, (linkRef) => {
        this.historyPatch(href, linkState, linkRef);
        done();
      });
    });
  }
  historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
    if (!this.commitPendingLink(linkRef)) {
      return;
    }
    browser_default.pushState(linkState, { type: "patch", id: this.main.id }, href);
    dom_default.dispatchEvent(window, "phx:navigate", { detail: { patch: true, href, pop: false } });
    this.registerNewLocation(window.location);
  }
  historyRedirect(href, linkState, flash) {
    if (!this.isConnected()) {
      return browser_default.redirect(href, flash);
    }
    if (/^\/$|^\/[^\/]+.*$/.test(href)) {
      let { protocol, host } = window.location;
      href = `${protocol}//${host}${href}`;
    }
    let scroll = window.scrollY;
    this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
      this.replaceMain(href, flash, (linkRef) => {
        if (linkRef === this.linkRef) {
          browser_default.pushState(linkState, { type: "redirect", id: this.main.id, scroll }, href);
          dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: false, pop: false } });
          this.registerNewLocation(window.location);
        }
        done();
      });
    });
  }
  replaceRootHistory() {
    browser_default.pushState("replace", { root: true, type: "patch", id: this.main.id });
  }
  registerNewLocation(newLocation) {
    let { pathname, search } = this.currentLocation;
    if (pathname + search === newLocation.pathname + newLocation.search) {
      return false;
    } else {
      this.currentLocation = clone(newLocation);
      return true;
    }
  }
  bindForms() {
    let iterations = 0;
    let externalFormSubmitted = false;
    this.on("submit", (e) => {
      let phxSubmit = e.target.getAttribute(this.binding("submit"));
      let phxChange = e.target.getAttribute(this.binding("change"));
      if (!externalFormSubmitted && phxChange && !phxSubmit) {
        externalFormSubmitted = true;
        e.preventDefault();
        this.withinOwners(e.target, (view) => {
          view.disableForm(e.target);
          window.requestAnimationFrame(() => {
            if (dom_default.isUnloadableFormSubmit(e)) {
              this.unload();
            }
            e.target.submit();
          });
        });
      }
    }, true);
    this.on("submit", (e) => {
      let phxEvent = e.target.getAttribute(this.binding("submit"));
      if (!phxEvent) {
        if (dom_default.isUnloadableFormSubmit(e)) {
          this.unload();
        }
        return;
      }
      e.preventDefault();
      e.target.disabled = true;
      this.withinOwners(e.target, (view) => {
        js_default.exec("submit", phxEvent, view, e.target, ["push", { submitter: e.submitter }]);
      });
    }, false);
    for (let type of ["change", "input"]) {
      this.on(type, (e) => {
        let phxChange = this.binding("change");
        let input = e.target;
        let inputEvent = input.getAttribute(phxChange);
        let formEvent = input.form && input.form.getAttribute(phxChange);
        let phxEvent = inputEvent || formEvent;
        if (!phxEvent) {
          return;
        }
        if (input.type === "number" && input.validity && input.validity.badInput) {
          return;
        }
        let dispatcher = inputEvent ? input : input.form;
        let currentIterations = iterations;
        iterations++;
        let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
        if (at === currentIterations - 1 && type === "change" && lastType === "input") {
          return;
        }
        dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
        this.debounce(input, e, type, () => {
          this.withinOwners(dispatcher, (view) => {
            dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
            if (!dom_default.isTextualInput(input)) {
              this.setActiveElement(input);
            }
            js_default.exec("change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
          });
        });
      }, false);
    }
    this.on("reset", (e) => {
      let form = e.target;
      dom_default.resetForm(form, this.binding(PHX_FEEDBACK_FOR));
      let input = Array.from(form.elements).find((el) => el.type === "reset");
      window.requestAnimationFrame(() => {
        input.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
      });
    });
  }
  debounce(el, event, eventType, callback) {
    if (eventType === "blur" || eventType === "focusout") {
      return callback();
    }
    let phxDebounce = this.binding(PHX_DEBOUNCE);
    let phxThrottle = this.binding(PHX_THROTTLE);
    let defaultDebounce = this.defaults.debounce.toString();
    let defaultThrottle = this.defaults.throttle.toString();
    this.withinOwners(el, (view) => {
      let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
      dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
        callback();
      });
    });
  }
  silenceEvents(callback) {
    this.silenced = true;
    callback();
    this.silenced = false;
  }
  on(event, callback) {
    window.addEventListener(event, (e) => {
      if (!this.silenced) {
        callback(e);
      }
    });
  }
};
var TransitionSet = class {
  constructor() {
    this.transitions = new Set;
    this.pendingOps = [];
  }
  reset() {
    this.transitions.forEach((timer) => {
      clearTimeout(timer);
      this.transitions.delete(timer);
    });
    this.flushPendingOps();
  }
  after(callback) {
    if (this.size() === 0) {
      callback();
    } else {
      this.pushPendingOp(callback);
    }
  }
  addTransition(time, onStart, onDone) {
    onStart();
    let timer = setTimeout(() => {
      this.transitions.delete(timer);
      onDone();
      this.flushPendingOps();
    }, time);
    this.transitions.add(timer);
  }
  pushPendingOp(op) {
    this.pendingOps.push(op);
  }
  size() {
    return this.transitions.size;
  }
  flushPendingOps() {
    if (this.size() > 0) {
      return;
    }
    let op = this.pendingOps.shift();
    if (op) {
      op();
      this.flushPendingOps();
    }
  }
};

// js/app.js
var topbar = __toESM(require_topbar(), 1);
var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
var Hooks2 = {};
Hooks2.store_token = {
  updated() {
    fetch(`/set_token?token=${this.el.value}`);
    this.pushEvent("navigate_students");
  }
};
var liveSocket = new LiveSocket("/live", Socket, { hooks: Hooks2, params: { _csrf_token: csrfToken } });
topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.default.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.default.hide());
liveSocket.connect();
window.liveSocket = liveSocket;

//# debugId=E5D7960D7956285764756e2164756e21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9wcml2L3N0YXRpYy9waG9lbml4Lm1qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvcHJpdi9zdGF0aWMvcGhvZW5peC5tanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9wcml2L3N0YXRpYy9waG9lbml4X2xpdmVfdmlldy5lc20uanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2FwcC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogdG9wYmFyIDIuMC4wLCAyMDIzLTAyLTA0XG4gKiBodHRwczovL2J1dW5ndXllbi5naXRodWIuaW8vdG9wYmFyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgQnV1IE5ndXllblxuICovXG4oZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzFcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gW1wibXNcIiwgXCJtb3pcIiwgXCJ3ZWJraXRcIiwgXCJvXCJdO1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl0gfHxcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICB9XG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuICAgICAgICB9LCB0aW1lVG9DYWxsKTtcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH07XG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgIH07XG4gIH0pKCk7XG5cbiAgdmFyIGNhbnZhcyxcbiAgICBjdXJyZW50UHJvZ3Jlc3MsXG4gICAgc2hvd2luZyxcbiAgICBwcm9ncmVzc1RpbWVySWQgPSBudWxsLFxuICAgIGZhZGVUaW1lcklkID0gbnVsbCxcbiAgICBkZWxheVRpbWVySWQgPSBudWxsLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoZGVsYXkpIHtcbiAgICAgICAgaWYgKHNob3dpbmcpIHJldHVybjtcbiAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgaWYgKGRlbGF5VGltZXJJZCkgcmV0dXJuO1xuICAgICAgICAgIGRlbGF5VGltZXJJZCA9IHNldFRpbWVvdXQoKCkgPT4gdG9wYmFyLnNob3coKSwgZGVsYXkpO1xuICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICBzaG93aW5nID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgICAgaWYgKCFjYW52YXMpIGNyZWF0ZUNhbnZhcygpO1xuICAgICAgICAgIGNhbnZhcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICB0b3BiYXIucHJvZ3Jlc3MoMCk7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuYXV0b1J1bikge1xuICAgICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgICAgICAgIHRvcGJhci5wcm9ncmVzcyhcbiAgICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2dyZXNzOiBmdW5jdGlvbiAodG8pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0byA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgICAgaWYgKHR5cGVvZiB0byA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIHRvID1cbiAgICAgICAgICAgICh0by5pbmRleE9mKFwiK1wiKSA+PSAwIHx8IHRvLmluZGV4T2YoXCItXCIpID49IDBcbiAgICAgICAgICAgICAgPyBjdXJyZW50UHJvZ3Jlc3NcbiAgICAgICAgICAgICAgOiAwKSArIHBhcnNlRmxvYXQodG8pO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRQcm9ncmVzcyA9IHRvID4gMSA/IDEgOiB0bztcbiAgICAgICAgcmVwYWludCgpO1xuICAgICAgICByZXR1cm4gY3VycmVudFByb2dyZXNzO1xuICAgICAgfSxcbiAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGRlbGF5VGltZXJJZCk7XG4gICAgICAgIGRlbGF5VGltZXJJZCA9IG51bGw7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwKICAiXCJ1c2Ugc3RyaWN0XCI7XG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIFBvbHlmaWxsRXZlbnQgPSBldmVudENvbnN0cnVjdG9yKCk7XG5cbiAgZnVuY3Rpb24gZXZlbnRDb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gd2luZG93LkN1c3RvbUV2ZW50O1xuICAgIC8vIElFPD05IFN1cHBvcnRcbiAgICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge2J1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWR9O1xuICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgICAgIHJldHVybiBldnQ7XG4gICAgfVxuICAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gICAgcmV0dXJuIEN1c3RvbUV2ZW50O1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRIaWRkZW5JbnB1dChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIjtcbiAgICBpbnB1dC5uYW1lID0gbmFtZTtcbiAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGVsZW1lbnQsIHRhcmdldE1vZGlmaWVyS2V5KSB7XG4gICAgdmFyIHRvID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRvXCIpLFxuICAgICAgICBtZXRob2QgPSBidWlsZEhpZGRlbklucHV0KFwiX21ldGhvZFwiLCBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpKSxcbiAgICAgICAgY3NyZiA9IGJ1aWxkSGlkZGVuSW5wdXQoXCJfY3NyZl90b2tlblwiLCBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY3NyZlwiKSksXG4gICAgICAgIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKSxcbiAgICAgICAgc3VibWl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLFxuICAgICAgICB0YXJnZXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInRhcmdldFwiKTtcblxuICAgIGZvcm0ubWV0aG9kID0gKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikgPT09IFwiZ2V0XCIpID8gXCJnZXRcIiA6IFwicG9zdFwiO1xuICAgIGZvcm0uYWN0aW9uID0gdG87XG4gICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICBpZiAodGFyZ2V0KSBmb3JtLnRhcmdldCA9IHRhcmdldDtcbiAgICBlbHNlIGlmICh0YXJnZXRNb2RpZmllcktleSkgZm9ybS50YXJnZXQgPSBcIl9ibGFua1wiO1xuXG4gICAgZm9ybS5hcHBlbmRDaGlsZChjc3JmKTtcbiAgICBmb3JtLmFwcGVuZENoaWxkKG1ldGhvZCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcblxuICAgIC8vIEluc2VydCBhIGJ1dHRvbiBhbmQgY2xpY2sgaXQgaW5zdGVhZCBvZiB1c2luZyBgZm9ybS5zdWJtaXRgXG4gICAgLy8gYmVjYXVzZSB0aGUgYHN1Ym1pdGAgZnVuY3Rpb24gZG9lcyBub3QgZW1pdCBhIGBzdWJtaXRgIGV2ZW50LlxuICAgIHN1Ym1pdC50eXBlID0gXCJzdWJtaXRcIjtcbiAgICBmb3JtLmFwcGVuZENoaWxkKHN1Ym1pdCk7XG4gICAgc3VibWl0LmNsaWNrKCk7XG4gIH1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZWxlbWVudCA9IGUudGFyZ2V0O1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuICAgIHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKSB7XG4gICAgICB2YXIgcGhvZW5peExpbmtFdmVudCA9IG5ldyBQb2x5ZmlsbEV2ZW50KCdwaG9lbml4LmxpbmsuY2xpY2snLCB7XG4gICAgICAgIFwiYnViYmxlc1wiOiB0cnVlLCBcImNhbmNlbGFibGVcIjogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghZWxlbWVudC5kaXNwYXRjaEV2ZW50KHBob2VuaXhMaW5rRXZlbnQpKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSkge1xuICAgICAgICBoYW5kbGVDbGljayhlbGVtZW50LCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIGZhbHNlKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGhvZW5peC5saW5rLmNsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtY29uZmlybVwiKTtcbiAgICBpZihtZXNzYWdlICYmICF3aW5kb3cuY29uZmlybShtZXNzYWdlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xufSkoKTtcbiIsCiAgIi8vIGpzL3Bob2VuaXgvdXRpbHMuanNcbnZhciBjbG9zdXJlID0gKHZhbHVlKSA9PiB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgY2xvc3VyZTIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIHJldHVybiBjbG9zdXJlMjtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9jb25zdGFudHMuanNcbnZhciBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbDtcbnZhciBwaHhXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogbnVsbDtcbnZhciBnbG9iYWwgPSBnbG9iYWxTZWxmIHx8IHBoeFdpbmRvdyB8fCBnbG9iYWw7XG52YXIgREVGQVVMVF9WU04gPSBcIjIuMC4wXCI7XG52YXIgU09DS0VUX1NUQVRFUyA9IHsgY29ubmVjdGluZzogMCwgb3BlbjogMSwgY2xvc2luZzogMiwgY2xvc2VkOiAzIH07XG52YXIgREVGQVVMVF9USU1FT1VUID0gMWU0O1xudmFyIFdTX0NMT1NFX05PUk1BTCA9IDFlMztcbnZhciBDSEFOTkVMX1NUQVRFUyA9IHtcbiAgY2xvc2VkOiBcImNsb3NlZFwiLFxuICBlcnJvcmVkOiBcImVycm9yZWRcIixcbiAgam9pbmVkOiBcImpvaW5lZFwiLFxuICBqb2luaW5nOiBcImpvaW5pbmdcIixcbiAgbGVhdmluZzogXCJsZWF2aW5nXCJcbn07XG52YXIgQ0hBTk5FTF9FVkVOVFMgPSB7XG4gIGNsb3NlOiBcInBoeF9jbG9zZVwiLFxuICBlcnJvcjogXCJwaHhfZXJyb3JcIixcbiAgam9pbjogXCJwaHhfam9pblwiLFxuICByZXBseTogXCJwaHhfcmVwbHlcIixcbiAgbGVhdmU6IFwicGh4X2xlYXZlXCJcbn07XG52YXIgVFJBTlNQT1JUUyA9IHtcbiAgbG9uZ3BvbGw6IFwibG9uZ3BvbGxcIixcbiAgd2Vic29ja2V0OiBcIndlYnNvY2tldFwiXG59O1xudmFyIFhIUl9TVEFURVMgPSB7XG4gIGNvbXBsZXRlOiA0XG59O1xuXG4vLyBqcy9waG9lbml4L3B1c2guanNcbnZhciBQdXNoID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBldmVudCwgcGF5bG9hZCwgdGltZW91dCkge1xuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQgfHwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfTtcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGw7XG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dDtcbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IG51bGw7XG4gICAgdGhpcy5yZWNIb29rcyA9IFtdO1xuICAgIHRoaXMuc2VudCA9IGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dFxuICAgKi9cbiAgcmVzZW5kKHRpbWVvdXQpIHtcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnNlbmQoKTtcbiAgfVxuICAvKipcbiAgICpcbiAgICovXG4gIHNlbmQoKSB7XG4gICAgaWYgKHRoaXMuaGFzUmVjZWl2ZWQoXCJ0aW1lb3V0XCIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KCk7XG4gICAgdGhpcy5zZW50ID0gdHJ1ZTtcbiAgICB0aGlzLmNoYW5uZWwuc29ja2V0LnB1c2goe1xuICAgICAgdG9waWM6IHRoaXMuY2hhbm5lbC50b3BpYyxcbiAgICAgIGV2ZW50OiB0aGlzLmV2ZW50LFxuICAgICAgcGF5bG9hZDogdGhpcy5wYXlsb2FkKCksXG4gICAgICByZWY6IHRoaXMucmVmLFxuICAgICAgam9pbl9yZWY6IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSBzdGF0dXNcbiAgICogQHBhcmFtIHsqfSBjYWxsYmFja1xuICAgKi9cbiAgcmVjZWl2ZShzdGF0dXMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuaGFzUmVjZWl2ZWQoc3RhdHVzKSkge1xuICAgICAgY2FsbGJhY2sodGhpcy5yZWNlaXZlZFJlc3AucmVzcG9uc2UpO1xuICAgIH1cbiAgICB0aGlzLnJlY0hvb2tzLnB1c2goeyBzdGF0dXMsIGNhbGxiYWNrIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpO1xuICAgIHRoaXMucmVmID0gbnVsbDtcbiAgICB0aGlzLnJlZkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGw7XG4gICAgdGhpcy5zZW50ID0gZmFsc2U7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBtYXRjaFJlY2VpdmUoeyBzdGF0dXMsIHJlc3BvbnNlLCBfcmVmIH0pIHtcbiAgICB0aGlzLnJlY0hvb2tzLmZpbHRlcigoaCkgPT4gaC5zdGF0dXMgPT09IHN0YXR1cykuZm9yRWFjaCgoaCkgPT4gaC5jYWxsYmFjayhyZXNwb25zZSkpO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsUmVmRXZlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnJlZkV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY2hhbm5lbC5vZmYodGhpcy5yZWZFdmVudCk7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxUaW1lb3V0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRUaW1lcik7XG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnRUaW1lb3V0KCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXRUaW1lcikge1xuICAgICAgdGhpcy5jYW5jZWxUaW1lb3V0KCk7XG4gICAgfVxuICAgIHRoaXMucmVmID0gdGhpcy5jaGFubmVsLnNvY2tldC5tYWtlUmVmKCk7XG4gICAgdGhpcy5yZWZFdmVudCA9IHRoaXMuY2hhbm5lbC5yZXBseUV2ZW50TmFtZSh0aGlzLnJlZik7XG4gICAgdGhpcy5jaGFubmVsLm9uKHRoaXMucmVmRXZlbnQsIChwYXlsb2FkKSA9PiB7XG4gICAgICB0aGlzLmNhbmNlbFJlZkV2ZW50KCk7XG4gICAgICB0aGlzLmNhbmNlbFRpbWVvdXQoKTtcbiAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gcGF5bG9hZDtcbiAgICAgIHRoaXMubWF0Y2hSZWNlaXZlKHBheWxvYWQpO1xuICAgIH0pO1xuICAgIHRoaXMudGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoXCJ0aW1lb3V0XCIsIHt9KTtcbiAgICB9LCB0aGlzLnRpbWVvdXQpO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGFzUmVjZWl2ZWQoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVjZWl2ZWRSZXNwICYmIHRoaXMucmVjZWl2ZWRSZXNwLnN0YXR1cyA9PT0gc3RhdHVzO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihzdGF0dXMsIHJlc3BvbnNlKSB7XG4gICAgdGhpcy5jaGFubmVsLnRyaWdnZXIodGhpcy5yZWZFdmVudCwgeyBzdGF0dXMsIHJlc3BvbnNlIH0pO1xuICB9XG59O1xuXG4vLyBqcy9waG9lbml4L3RpbWVyLmpzXG52YXIgVGltZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCB0aW1lckNhbGMpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGhpcy50aW1lckNhbGMgPSB0aW1lckNhbGM7XG4gICAgdGhpcy50aW1lciA9IG51bGw7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICB9XG4gIC8qKlxuICAgKiBDYW5jZWxzIGFueSBwcmV2aW91cyBzY2hlZHVsZVRpbWVvdXQgYW5kIHNjaGVkdWxlcyBjYWxsYmFja1xuICAgKi9cbiAgc2NoZWR1bGVUaW1lb3V0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWVzID0gdGhpcy50cmllcyArIDE7XG4gICAgICB0aGlzLmNhbGxiYWNrKCk7XG4gICAgfSwgdGhpcy50aW1lckNhbGModGhpcy50cmllcyArIDEpKTtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9jaGFubmVsLmpzXG52YXIgQ2hhbm5lbCA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IodG9waWMsIHBhcmFtcywgc29ja2V0KSB7XG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZDtcbiAgICB0aGlzLnRvcGljID0gdG9waWM7XG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcyB8fCB7fSk7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgIHRoaXMuYmluZGluZ1JlZiA9IDA7XG4gICAgdGhpcy50aW1lb3V0ID0gdGhpcy5zb2NrZXQudGltZW91dDtcbiAgICB0aGlzLmpvaW5lZE9uY2UgPSBmYWxzZTtcbiAgICB0aGlzLmpvaW5QdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMuam9pbiwgdGhpcy5wYXJhbXMsIHRoaXMudGltZW91dCk7XG4gICAgdGhpcy5wdXNoQnVmZmVyID0gW107XG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMgPSBbXTtcbiAgICB0aGlzLnJlam9pblRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgIHRoaXMucmVqb2luKCk7XG4gICAgICB9XG4gICAgfSwgdGhpcy5zb2NrZXQucmVqb2luQWZ0ZXJNcyk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbkVycm9yKCgpID0+IHRoaXMucmVqb2luVGltZXIucmVzZXQoKSkpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzLnB1c2goXG4gICAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KCk7XG4gICAgICAgIGlmICh0aGlzLmlzRXJyb3JlZCgpKSB7XG4gICAgICAgICAgdGhpcy5yZWpvaW4oKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luZWQ7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KCk7XG4gICAgICB0aGlzLnB1c2hCdWZmZXIuZm9yRWFjaCgocHVzaEV2ZW50KSA9PiBwdXNoRXZlbnQuc2VuZCgpKTtcbiAgICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdO1xuICAgIH0pO1xuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcImVycm9yXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkO1xuICAgICAgaWYgKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgICAgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uQ2xvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpO1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBjbG9zZSAke3RoaXMudG9waWN9ICR7dGhpcy5qb2luUmVmKCl9YCk7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkO1xuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlKHRoaXMpO1xuICAgIH0pO1xuICAgIHRoaXMub25FcnJvcigocmVhc29uKSA9PiB7XG4gICAgICBpZiAodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpXG4gICAgICAgIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGVycm9yICR7dGhpcy50b3BpY31gLCByZWFzb24pO1xuICAgICAgaWYgKHRoaXMuaXNKb2luaW5nKCkpIHtcbiAgICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWQ7XG4gICAgICBpZiAodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgICB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGB0aW1lb3V0ICR7dGhpcy50b3BpY30gKCR7dGhpcy5qb2luUmVmKCl9KWAsIHRoaXMuam9pblB1c2gudGltZW91dCk7XG4gICAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aGlzLnRpbWVvdXQpO1xuICAgICAgbGVhdmVQdXNoLnNlbmQoKTtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkO1xuICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpO1xuICAgICAgaWYgKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgICAgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLnJlcGx5LCAocGF5bG9hZCwgcmVmKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIodGhpcy5yZXBseUV2ZW50TmFtZShyZWYpLCBwYXlsb2FkKTtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogSm9pbiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpIHtcbiAgICBpZiAodGhpcy5qb2luZWRPbmNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byBqb2luIG11bHRpcGxlIHRpbWVzLiAnam9pbicgY2FuIG9ubHkgYmUgY2FsbGVkIGEgc2luZ2xlIHRpbWUgcGVyIGNoYW5uZWwgaW5zdGFuY2VcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgICB0aGlzLmpvaW5lZE9uY2UgPSB0cnVlO1xuICAgICAgdGhpcy5yZWpvaW4oKTtcbiAgICAgIHJldHVybiB0aGlzLmpvaW5QdXNoO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgY2xvc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBjYWxsYmFjayk7XG4gIH1cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGVycm9yc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmVycm9yLCAocmVhc29uKSA9PiBjYWxsYmFjayhyZWFzb24pKTtcbiAgfVxuICAvKipcbiAgICogU3Vic2NyaWJlcyBvbiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBTdWJzY3JpcHRpb24gcmV0dXJucyBhIHJlZiBjb3VudGVyLCB3aGljaCBjYW4gYmUgdXNlZCBsYXRlciB0b1xuICAgKiB1bnN1YnNjcmliZSB0aGUgZXhhY3QgZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY29uc3QgcmVmMiA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19vdGhlcl9zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKiAvLyBTaW5jZSB1bnN1YnNjcmlwdGlvbiwgZG9fc3R1ZmYgd29uJ3QgZmlyZSxcbiAgICogLy8gd2hpbGUgZG9fb3RoZXJfc3R1ZmYgd2lsbCBrZWVwIGZpcmluZyBvbiB0aGUgXCJldmVudFwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICBsZXQgcmVmID0gdGhpcy5iaW5kaW5nUmVmKys7XG4gICAgdGhpcy5iaW5kaW5ncy5wdXNoKHsgZXZlbnQsIHJlZiwgY2FsbGJhY2sgfSk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIG9mZiBvZiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBVc2UgdGhlIHJlZiByZXR1cm5lZCBmcm9tIGEgY2hhbm5lbC5vbigpIHRvIHVuc3Vic2NyaWJlIG9uZVxuICAgKiBoYW5kbGVyLCBvciBwYXNzIG5vdGhpbmcgZm9yIHRoZSByZWYgdG8gdW5zdWJzY3JpYmUgYWxsXG4gICAqIGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gZXZlbnQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFVuc3Vic2NyaWJlIHRoZSBkb19zdHVmZiBoYW5kbGVyXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICpcbiAgICogLy8gVW5zdWJzY3JpYmUgYWxsIGhhbmRsZXJzIGZyb20gZXZlbnRcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiKVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9mZihldmVudCwgcmVmKSB7XG4gICAgdGhpcy5iaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuZmlsdGVyKChiaW5kKSA9PiB7XG4gICAgICByZXR1cm4gIShiaW5kLmV2ZW50ID09PSBldmVudCAmJiAodHlwZW9mIHJlZiA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZWYgPT09IGJpbmQucmVmKSk7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5QdXNoKCkge1xuICAgIHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNKb2luZWQoKTtcbiAgfVxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIGBldmVudGAgdG8gcGhvZW5peCB3aXRoIHRoZSBwYXlsb2FkIGBwYXlsb2FkYC5cbiAgICogUGhvZW5peCByZWNlaXZlcyB0aGlzIGluIHRoZSBgaGFuZGxlX2luKGV2ZW50LCBwYXlsb2FkLCBzb2NrZXQpYFxuICAgKiBmdW5jdGlvbi4gaWYgcGhvZW5peCByZXBsaWVzIG9yIGl0IHRpbWVzIG91dCAoZGVmYXVsdCAxMDAwMG1zKSxcbiAgICogdGhlbiBvcHRpb25hbGx5IHRoZSByZXBseSBjYW4gYmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwucHVzaChcImV2ZW50XCIpXG4gICAqICAgLnJlY2VpdmUoXCJva1wiLCBwYXlsb2FkID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCByZXBsaWVkOlwiLCBwYXlsb2FkKSlcbiAgICogICAucmVjZWl2ZShcImVycm9yXCIsIGVyciA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggZXJyb3JlZFwiLCBlcnIpKVxuICAgKiAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBjb25zb2xlLmxvZyhcInRpbWVkIG91dCBwdXNoaW5nXCIpKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIHB1c2goZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpIHtcbiAgICBwYXlsb2FkID0gcGF5bG9hZCB8fCB7fTtcbiAgICBpZiAoIXRoaXMuam9pbmVkT25jZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmllZCB0byBwdXNoICcke2V2ZW50fScgdG8gJyR7dGhpcy50b3BpY30nIGJlZm9yZSBqb2luaW5nLiBVc2UgY2hhbm5lbC5qb2luKCkgYmVmb3JlIHB1c2hpbmcgZXZlbnRzYCk7XG4gICAgfVxuICAgIGxldCBwdXNoRXZlbnQgPSBuZXcgUHVzaCh0aGlzLCBldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICBpZiAodGhpcy5jYW5QdXNoKCkpIHtcbiAgICAgIHB1c2hFdmVudC5zZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHB1c2hFdmVudC5zdGFydFRpbWVvdXQoKTtcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5wdXNoKHB1c2hFdmVudCk7XG4gICAgfVxuICAgIHJldHVybiBwdXNoRXZlbnQ7XG4gIH1cbiAgLyoqIExlYXZlcyB0aGUgY2hhbm5lbFxuICAgKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBzZXJ2ZXIgZXZlbnRzLCBhbmRcbiAgICogaW5zdHJ1Y3RzIGNoYW5uZWwgdG8gdGVybWluYXRlIG9uIHNlcnZlclxuICAgKlxuICAgKiBUcmlnZ2VycyBvbkNsb3NlKCkgaG9va3NcbiAgICpcbiAgICogVG8gcmVjZWl2ZSBsZWF2ZSBhY2tub3dsZWRnZW1lbnRzLCB1c2UgdGhlIGByZWNlaXZlYFxuICAgKiBob29rIHRvIGJpbmQgdG8gdGhlIHNlcnZlciBhY2ssIGllOlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLmxlYXZlKCkucmVjZWl2ZShcIm9rXCIsICgpID0+IGFsZXJ0KFwibGVmdCFcIikgKVxuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBsZWF2ZSh0aW1lb3V0ID0gdGhpcy50aW1lb3V0KSB7XG4gICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpO1xuICAgIHRoaXMuam9pblB1c2guY2FuY2VsVGltZW91dCgpO1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nO1xuICAgIGxldCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBsZWF2ZSAke3RoaXMudG9waWN9YCk7XG4gICAgICB0aGlzLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIFwibGVhdmVcIik7XG4gICAgfTtcbiAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aW1lb3V0KTtcbiAgICBsZWF2ZVB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IG9uQ2xvc2UoKSkucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gb25DbG9zZSgpKTtcbiAgICBsZWF2ZVB1c2guc2VuZCgpO1xuICAgIGlmICghdGhpcy5jYW5QdXNoKCkpIHtcbiAgICAgIGxlYXZlUHVzaC50cmlnZ2VyKFwib2tcIiwge30pO1xuICAgIH1cbiAgICByZXR1cm4gbGVhdmVQdXNoO1xuICB9XG4gIC8qKlxuICAgKiBPdmVycmlkYWJsZSBtZXNzYWdlIGhvb2tcbiAgICpcbiAgICogUmVjZWl2ZXMgYWxsIGV2ZW50cyBmb3Igc3BlY2lhbGl6ZWQgbWVzc2FnZSBoYW5kbGluZ1xuICAgKiBiZWZvcmUgZGlzcGF0Y2hpbmcgdG8gdGhlIGNoYW5uZWwgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBNdXN0IHJldHVybiB0aGUgcGF5bG9hZCwgbW9kaWZpZWQgb3IgdW5tb2RpZmllZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIG9uTWVzc2FnZShfZXZlbnQsIHBheWxvYWQsIF9yZWYpIHtcbiAgICByZXR1cm4gcGF5bG9hZDtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZikge1xuICAgIGlmICh0aGlzLnRvcGljICE9PSB0b3BpYykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoam9pblJlZiAmJiBqb2luUmVmICE9PSB0aGlzLmpvaW5SZWYoKSkge1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIFwiZHJvcHBpbmcgb3V0ZGF0ZWQgbWVzc2FnZVwiLCB7IHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZiB9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgam9pblJlZigpIHtcbiAgICByZXR1cm4gdGhpcy5qb2luUHVzaC5yZWY7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCkge1xuICAgIGlmICh0aGlzLmlzTGVhdmluZygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc29ja2V0LmxlYXZlT3BlblRvcGljKHRoaXMudG9waWMpO1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nO1xuICAgIHRoaXMuam9pblB1c2gucmVzZW5kKHRpbWVvdXQpO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKSB7XG4gICAgbGV0IGhhbmRsZWRQYXlsb2FkID0gdGhpcy5vbk1lc3NhZ2UoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pblJlZik7XG4gICAgaWYgKHBheWxvYWQgJiYgIWhhbmRsZWRQYXlsb2FkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjaGFubmVsIG9uTWVzc2FnZSBjYWxsYmFja3MgbXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcIik7XG4gICAgfVxuICAgIGxldCBldmVudEJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoKGJpbmQpID0+IGJpbmQuZXZlbnQgPT09IGV2ZW50KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50QmluZGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBiaW5kID0gZXZlbnRCaW5kaW5nc1tpXTtcbiAgICAgIGJpbmQuY2FsbGJhY2soaGFuZGxlZFBheWxvYWQsIHJlZiwgam9pblJlZiB8fCB0aGlzLmpvaW5SZWYoKSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVwbHlFdmVudE5hbWUocmVmKSB7XG4gICAgcmV0dXJuIGBjaGFuX3JlcGx5XyR7cmVmfWA7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Nsb3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNFcnJvcmVkKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5lZDtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmluZztcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTGVhdmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMubGVhdmluZztcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9hamF4LmpzXG52YXIgQWpheCA9IGNsYXNzIHtcbiAgc3RhdGljIHJlcXVlc3QobWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGdsb2JhbC5YRG9tYWluUmVxdWVzdCkge1xuICAgICAgbGV0IHJlcSA9IG5ldyBnbG9iYWwuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIHJldHVybiB0aGlzLnhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIHhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaykge1xuICAgIHJlcS50aW1lb3V0ID0gdGltZW91dDtcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50KTtcbiAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwb25zZSk7XG4gICAgfTtcbiAgICBpZiAob250aW1lb3V0KSB7XG4gICAgICByZXEub250aW1lb3V0ID0gb250aW1lb3V0O1xuICAgIH1cbiAgICByZXEub25wcm9ncmVzcyA9ICgpID0+IHtcbiAgICB9O1xuICAgIHJlcS5zZW5kKGJvZHkpO1xuICAgIHJldHVybiByZXE7XG4gIH1cbiAgc3RhdGljIHhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spIHtcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50LCB0cnVlKTtcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgYWNjZXB0KTtcbiAgICByZXEub25lcnJvciA9ICgpID0+IGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IFhIUl9TVEFURVMuY29tcGxldGUgJiYgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChvbnRpbWVvdXQpIHtcbiAgICAgIHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQ7XG4gICAgfVxuICAgIHJlcS5zZW5kKGJvZHkpO1xuICAgIHJldHVybiByZXE7XG4gIH1cbiAgc3RhdGljIHBhcnNlSlNPTihyZXNwKSB7XG4gICAgaWYgKCFyZXNwIHx8IHJlc3AgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcImZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlXCIsIHJlc3ApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBzZXJpYWxpemUob2JqLCBwYXJlbnRLZXkpIHtcbiAgICBsZXQgcXVlcnlTdHIgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBsZXQgcGFyYW1LZXkgPSBwYXJlbnRLZXkgPyBgJHtwYXJlbnRLZXl9WyR7a2V5fV1gIDoga2V5O1xuICAgICAgbGV0IHBhcmFtVmFsID0gb2JqW2tleV07XG4gICAgICBpZiAodHlwZW9mIHBhcmFtVmFsID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2godGhpcy5zZXJpYWxpemUocGFyYW1WYWwsIHBhcmFtS2V5KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeVN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwYXJhbUtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVZhbCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcXVlcnlTdHIuam9pbihcIiZcIik7XG4gIH1cbiAgc3RhdGljIGFwcGVuZFBhcmFtcyh1cmwsIHBhcmFtcykge1xuICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgbGV0IHByZWZpeCA9IHVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiO1xuICAgIHJldHVybiBgJHt1cmx9JHtwcmVmaXh9JHt0aGlzLnNlcmlhbGl6ZShwYXJhbXMpfWA7XG4gIH1cbn07XG5cbi8vIGpzL3Bob2VuaXgvbG9uZ3BvbGwuanNcbnZhciBhcnJheUJ1ZmZlclRvQmFzZTY0ID0gKGJ1ZmZlcikgPT4ge1xuICBsZXQgYmluYXJ5ID0gXCJcIjtcbiAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgbGV0IGxlbiA9IGJ5dGVzLmJ5dGVMZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIGJ0b2EoYmluYXJ5KTtcbn07XG52YXIgTG9uZ1BvbGwgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGVuZFBvaW50KSB7XG4gICAgdGhpcy5lbmRQb2ludCA9IG51bGw7XG4gICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgdGhpcy5za2lwSGVhcnRiZWF0ID0gdHJ1ZTtcbiAgICB0aGlzLnJlcXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudEJhdGNoID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRCYXRjaFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLmJhdGNoQnVmZmVyID0gW107XG4gICAgdGhpcy5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICB9O1xuICAgIHRoaXMub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgdGhpcy5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICB9O1xuICAgIHRoaXMub25jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgdGhpcy5wb2xsRW5kcG9pbnQgPSB0aGlzLm5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KTtcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc7XG4gICAgdGhpcy5wb2xsKCk7XG4gIH1cbiAgbm9ybWFsaXplRW5kcG9pbnQoZW5kUG9pbnQpIHtcbiAgICByZXR1cm4gZW5kUG9pbnQucmVwbGFjZShcIndzOi8vXCIsIFwiaHR0cDovL1wiKS5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIikucmVwbGFjZShuZXcgUmVnRXhwKFwiKC4qKS9cIiArIFRSQU5TUE9SVFMud2Vic29ja2V0KSwgXCIkMS9cIiArIFRSQU5TUE9SVFMubG9uZ3BvbGwpO1xuICB9XG4gIGVuZHBvaW50VVJMKCkge1xuICAgIHJldHVybiBBamF4LmFwcGVuZFBhcmFtcyh0aGlzLnBvbGxFbmRwb2ludCwgeyB0b2tlbjogdGhpcy50b2tlbiB9KTtcbiAgfVxuICBjbG9zZUFuZFJldHJ5KGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pIHtcbiAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pO1xuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZztcbiAgfVxuICBvbnRpbWVvdXQoKSB7XG4gICAgdGhpcy5vbmVycm9yKFwidGltZW91dFwiKTtcbiAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAwNSwgXCJ0aW1lb3V0XCIsIGZhbHNlKTtcbiAgfVxuICBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLm9wZW4gfHwgdGhpcy5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc7XG4gIH1cbiAgcG9sbCgpIHtcbiAgICB0aGlzLmFqYXgoXCJHRVRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIG51bGwsICgpID0+IHRoaXMub250aW1lb3V0KCksIChyZXNwKSA9PiB7XG4gICAgICBpZiAocmVzcCkge1xuICAgICAgICB2YXIgeyBzdGF0dXMsIHRva2VuLCBtZXNzYWdlcyB9ID0gcmVzcDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdHVzID0gMDtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgMjAwOlxuICAgICAgICAgIG1lc3NhZ2VzLmZvckVhY2goKG1zZykgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm9ubWVzc2FnZSh7IGRhdGE6IG1zZyB9KSwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5wb2xsKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjA0OlxuICAgICAgICAgIHRoaXMucG9sbCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQxMDpcbiAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLm9wZW47XG4gICAgICAgICAgdGhpcy5vbm9wZW4oe30pO1xuICAgICAgICAgIHRoaXMucG9sbCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNDAzKTtcbiAgICAgICAgICB0aGlzLmNsb3NlKDEwMDgsIFwiZm9yYmlkZGVuXCIsIGZhbHNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNTAwKTtcbiAgICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgNTAwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuaGFuZGxlZCBwb2xsIHN0YXR1cyAke3N0YXR1c31gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvLyB3ZSBjb2xsZWN0IGFsbCBwdXNoZXMgd2l0aGluIHRoZSBjdXJyZW50IGV2ZW50IGxvb3AgYnlcbiAgLy8gc2V0VGltZW91dCAwLCB3aGljaCBvcHRpbWl6ZXMgYmFjay10by1iYWNrIHByb2NlZHVyYWxcbiAgLy8gcHVzaGVzIGFnYWluc3QgYW4gZW1wdHkgYnVmZmVyXG4gIHNlbmQoYm9keSkge1xuICAgIGlmICh0eXBlb2YgYm9keSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgYm9keSA9IGFycmF5QnVmZmVyVG9CYXNlNjQoYm9keSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmN1cnJlbnRCYXRjaCkge1xuICAgICAgdGhpcy5jdXJyZW50QmF0Y2gucHVzaChib2R5KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXdhaXRpbmdCYXRjaEFjaykge1xuICAgICAgdGhpcy5iYXRjaEJ1ZmZlci5wdXNoKGJvZHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IFtib2R5XTtcbiAgICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5jdXJyZW50QmF0Y2gpO1xuICAgICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IG51bGw7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cbiAgYmF0Y2hTZW5kKG1lc3NhZ2VzKSB7XG4gICAgdGhpcy5hd2FpdGluZ0JhdGNoQWNrID0gdHJ1ZTtcbiAgICB0aGlzLmFqYXgoXCJQT1NUXCIsIFwiYXBwbGljYXRpb24veC1uZGpzb25cIiwgbWVzc2FnZXMuam9pbihcIlxcblwiKSwgKCkgPT4gdGhpcy5vbmVycm9yKFwidGltZW91dFwiKSwgKHJlc3ApID0+IHtcbiAgICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlO1xuICAgICAgaWYgKCFyZXNwIHx8IHJlc3Auc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgdGhpcy5vbmVycm9yKHJlc3AgJiYgcmVzcC5zdGF0dXMpO1xuICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmJhdGNoQnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5iYXRjaEJ1ZmZlcik7XG4gICAgICAgIHRoaXMuYmF0Y2hCdWZmZXIgPSBbXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjbG9zZShjb2RlLCByZWFzb24sIHdhc0NsZWFuKSB7XG4gICAgZm9yIChsZXQgcmVxIG9mIHRoaXMucmVxcykge1xuICAgICAgcmVxLmFib3J0KCk7XG4gICAgfVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY2xvc2VkO1xuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7IGNvZGU6IDFlMywgcmVhc29uOiB2b2lkIDAsIHdhc0NsZWFuOiB0cnVlIH0sIHsgY29kZSwgcmVhc29uLCB3YXNDbGVhbiB9KTtcbiAgICB0aGlzLmJhdGNoQnVmZmVyID0gW107XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY3VycmVudEJhdGNoVGltZXIpO1xuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsO1xuICAgIGlmICh0eXBlb2YgQ2xvc2VFdmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5vbmNsb3NlKG5ldyBDbG9zZUV2ZW50KFwiY2xvc2VcIiwgb3B0cykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uY2xvc2Uob3B0cyk7XG4gICAgfVxuICB9XG4gIGFqYXgobWV0aG9kLCBjb250ZW50VHlwZSwgYm9keSwgb25DYWxsZXJUaW1lb3V0LCBjYWxsYmFjaykge1xuICAgIGxldCByZXE7XG4gICAgbGV0IG9udGltZW91dCA9ICgpID0+IHtcbiAgICAgIHRoaXMucmVxcy5kZWxldGUocmVxKTtcbiAgICAgIG9uQ2FsbGVyVGltZW91dCgpO1xuICAgIH07XG4gICAgcmVxID0gQWpheC5yZXF1ZXN0KG1ldGhvZCwgdGhpcy5lbmRwb2ludFVSTCgpLCBjb250ZW50VHlwZSwgYm9keSwgdGhpcy50aW1lb3V0LCBvbnRpbWVvdXQsIChyZXNwKSA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSk7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc3ApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMucmVxcy5hZGQocmVxKTtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9wcmVzZW5jZS5qc1xudmFyIFByZXNlbmNlID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBvcHRzID0ge30pIHtcbiAgICBsZXQgZXZlbnRzID0gb3B0cy5ldmVudHMgfHwgeyBzdGF0ZTogXCJwcmVzZW5jZV9zdGF0ZVwiLCBkaWZmOiBcInByZXNlbmNlX2RpZmZcIiB9O1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdO1xuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgdGhpcy5qb2luUmVmID0gbnVsbDtcbiAgICB0aGlzLmNhbGxlciA9IHtcbiAgICAgIG9uSm9pbjogZnVuY3Rpb24oKSB7XG4gICAgICB9LFxuICAgICAgb25MZWF2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB9LFxuICAgICAgb25TeW5jOiBmdW5jdGlvbigpIHtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2hhbm5lbC5vbihldmVudHMuc3RhdGUsIChuZXdTdGF0ZSkgPT4ge1xuICAgICAgbGV0IHsgb25Kb2luLCBvbkxlYXZlLCBvblN5bmMgfSA9IHRoaXMuY2FsbGVyO1xuICAgICAgdGhpcy5qb2luUmVmID0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKTtcbiAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSk7XG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcy5mb3JFYWNoKChkaWZmKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdO1xuICAgICAgb25TeW5jKCk7XG4gICAgfSk7XG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5kaWZmLCAoZGlmZikgPT4ge1xuICAgICAgbGV0IHsgb25Kb2luLCBvbkxlYXZlLCBvblN5bmMgfSA9IHRoaXMuY2FsbGVyO1xuICAgICAgaWYgKHRoaXMuaW5QZW5kaW5nU3luY1N0YXRlKCkpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGlmZnMucHVzaChkaWZmKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpO1xuICAgICAgICBvblN5bmMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBvbkpvaW4oY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxlci5vbkpvaW4gPSBjYWxsYmFjaztcbiAgfVxuICBvbkxlYXZlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5jYWxsZXIub25MZWF2ZSA9IGNhbGxiYWNrO1xuICB9XG4gIG9uU3luYyhjYWxsYmFjaykge1xuICAgIHRoaXMuY2FsbGVyLm9uU3luYyA9IGNhbGxiYWNrO1xuICB9XG4gIGxpc3QoYnkpIHtcbiAgICByZXR1cm4gUHJlc2VuY2UubGlzdCh0aGlzLnN0YXRlLCBieSk7XG4gIH1cbiAgaW5QZW5kaW5nU3luY1N0YXRlKCkge1xuICAgIHJldHVybiAhdGhpcy5qb2luUmVmIHx8IHRoaXMuam9pblJlZiAhPT0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKTtcbiAgfVxuICAvLyBsb3dlci1sZXZlbCBwdWJsaWMgc3RhdGljIEFQSVxuICAvKipcbiAgICogVXNlZCB0byBzeW5jIHRoZSBsaXN0IG9mIHByZXNlbmNlcyBvbiB0aGUgc2VydmVyXG4gICAqIHdpdGggdGhlIGNsaWVudCdzIHN0YXRlLiBBbiBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrIGNhblxuICAgKiBiZSBwcm92aWRlZCB0byByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAqIGRpc2Nvbm5lY3RzIGFuZCByZWNvbm5lY3RzIHdpdGggdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLmNsb25lKGN1cnJlbnRTdGF0ZSk7XG4gICAgbGV0IGpvaW5zID0ge307XG4gICAgbGV0IGxlYXZlcyA9IHt9O1xuICAgIHRoaXMubWFwKHN0YXRlLCAoa2V5LCBwcmVzZW5jZSkgPT4ge1xuICAgICAgaWYgKCFuZXdTdGF0ZVtrZXldKSB7XG4gICAgICAgIGxlYXZlc1trZXldID0gcHJlc2VuY2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5tYXAobmV3U3RhdGUsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XTtcbiAgICAgIGlmIChjdXJyZW50UHJlc2VuY2UpIHtcbiAgICAgICAgbGV0IG5ld1JlZnMgPSBuZXdQcmVzZW5jZS5tZXRhcy5tYXAoKG0pID0+IG0ucGh4X3JlZik7XG4gICAgICAgIGxldCBjdXJSZWZzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLm1hcCgobSkgPT4gbS5waHhfcmVmKTtcbiAgICAgICAgbGV0IGpvaW5lZE1ldGFzID0gbmV3UHJlc2VuY2UubWV0YXMuZmlsdGVyKChtKSA9PiBjdXJSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApO1xuICAgICAgICBsZXQgbGVmdE1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcigobSkgPT4gbmV3UmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKTtcbiAgICAgICAgaWYgKGpvaW5lZE1ldGFzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2U7XG4gICAgICAgICAgam9pbnNba2V5XS5tZXRhcyA9IGpvaW5lZE1ldGFzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZWZ0TWV0YXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGxlYXZlc1trZXldID0gdGhpcy5jbG9uZShjdXJyZW50UHJlc2VuY2UpO1xuICAgICAgICAgIGxlYXZlc1trZXldLm1ldGFzID0gbGVmdE1ldGFzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3luY0RpZmYoc3RhdGUsIHsgam9pbnMsIGxlYXZlcyB9LCBvbkpvaW4sIG9uTGVhdmUpO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBVc2VkIHRvIHN5bmMgYSBkaWZmIG9mIHByZXNlbmNlIGpvaW4gYW5kIGxlYXZlXG4gICAqIGV2ZW50cyBmcm9tIHRoZSBzZXJ2ZXIsIGFzIHRoZXkgaGFwcGVuLiBMaWtlIGBzeW5jU3RhdGVgLCBgc3luY0RpZmZgXG4gICAqIGFjY2VwdHMgb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFja3MgdG8gcmVhY3QgdG8gYSB1c2VyXG4gICAqIGpvaW5pbmcgb3IgbGVhdmluZyBmcm9tIGEgZGV2aWNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgc3luY0RpZmYoc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSkge1xuICAgIGxldCB7IGpvaW5zLCBsZWF2ZXMgfSA9IHRoaXMuY2xvbmUoZGlmZik7XG4gICAgaWYgKCFvbkpvaW4pIHtcbiAgICAgIG9uSm9pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKCFvbkxlYXZlKSB7XG4gICAgICBvbkxlYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLm1hcChqb2lucywgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldO1xuICAgICAgc3RhdGVba2V5XSA9IHRoaXMuY2xvbmUobmV3UHJlc2VuY2UpO1xuICAgICAgaWYgKGN1cnJlbnRQcmVzZW5jZSkge1xuICAgICAgICBsZXQgam9pbmVkUmVmcyA9IHN0YXRlW2tleV0ubWV0YXMubWFwKChtKSA9PiBtLnBoeF9yZWYpO1xuICAgICAgICBsZXQgY3VyTWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKChtKSA9PiBqb2luZWRSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApO1xuICAgICAgICBzdGF0ZVtrZXldLm1ldGFzLnVuc2hpZnQoLi4uY3VyTWV0YXMpO1xuICAgICAgfVxuICAgICAgb25Kb2luKGtleSwgY3VycmVudFByZXNlbmNlLCBuZXdQcmVzZW5jZSk7XG4gICAgfSk7XG4gICAgdGhpcy5tYXAobGVhdmVzLCAoa2V5LCBsZWZ0UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldO1xuICAgICAgaWYgKCFjdXJyZW50UHJlc2VuY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IHJlZnNUb1JlbW92ZSA9IGxlZnRQcmVzZW5jZS5tZXRhcy5tYXAoKG0pID0+IG0ucGh4X3JlZik7XG4gICAgICBjdXJyZW50UHJlc2VuY2UubWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKChwKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzVG9SZW1vdmUuaW5kZXhPZihwLnBoeF9yZWYpIDwgMDtcbiAgICAgIH0pO1xuICAgICAgb25MZWF2ZShrZXksIGN1cnJlbnRQcmVzZW5jZSwgbGVmdFByZXNlbmNlKTtcbiAgICAgIGlmIChjdXJyZW50UHJlc2VuY2UubWV0YXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBzdGF0ZVtrZXldO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJlc2VuY2VzLCB3aXRoIHNlbGVjdGVkIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJlc2VuY2VzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNob29zZXJcbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIGxpc3QocHJlc2VuY2VzLCBjaG9vc2VyKSB7XG4gICAgaWYgKCFjaG9vc2VyKSB7XG4gICAgICBjaG9vc2VyID0gZnVuY3Rpb24oa2V5LCBwcmVzKSB7XG4gICAgICAgIHJldHVybiBwcmVzO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubWFwKHByZXNlbmNlcywgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIHJldHVybiBjaG9vc2VyKGtleSwgcHJlc2VuY2UpO1xuICAgIH0pO1xuICB9XG4gIC8vIHByaXZhdGVcbiAgc3RhdGljIG1hcChvYmosIGZ1bmMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5tYXAoKGtleSkgPT4gZnVuYyhrZXksIG9ialtrZXldKSk7XG4gIH1cbiAgc3RhdGljIGNsb25lKG9iaikge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9XG59O1xuXG4vLyBqcy9waG9lbml4L3NlcmlhbGl6ZXIuanNcbnZhciBzZXJpYWxpemVyX2RlZmF1bHQgPSB7XG4gIEhFQURFUl9MRU5HVEg6IDEsXG4gIE1FVEFfTEVOR1RIOiA0LFxuICBLSU5EUzogeyBwdXNoOiAwLCByZXBseTogMSwgYnJvYWRjYXN0OiAyIH0sXG4gIGVuY29kZShtc2csIGNhbGxiYWNrKSB7XG4gICAgaWYgKG1zZy5wYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RW5jb2RlKG1zZykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcGF5bG9hZCA9IFttc2cuam9pbl9yZWYsIG1zZy5yZWYsIG1zZy50b3BpYywgbXNnLmV2ZW50LCBtc2cucGF5bG9hZF07XG4gICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgIH1cbiAgfSxcbiAgZGVjb2RlKHJhd1BheWxvYWQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHJhd1BheWxvYWQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlEZWNvZGUocmF3UGF5bG9hZCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgW2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZF0gPSBKU09OLnBhcnNlKHJhd1BheWxvYWQpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHsgam9pbl9yZWYsIHJlZiwgdG9waWMsIGV2ZW50LCBwYXlsb2FkIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gcHJpdmF0ZVxuICBiaW5hcnlFbmNvZGUobWVzc2FnZSkge1xuICAgIGxldCB7IGpvaW5fcmVmLCByZWYsIGV2ZW50LCB0b3BpYywgcGF5bG9hZCB9ID0gbWVzc2FnZTtcbiAgICBsZXQgbWV0YUxlbmd0aCA9IHRoaXMuTUVUQV9MRU5HVEggKyBqb2luX3JlZi5sZW5ndGggKyByZWYubGVuZ3RoICsgdG9waWMubGVuZ3RoICsgZXZlbnQubGVuZ3RoO1xuICAgIGxldCBoZWFkZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5IRUFERVJfTEVOR1RIICsgbWV0YUxlbmd0aCk7XG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoaGVhZGVyKTtcbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0aGlzLktJTkRTLnB1c2gpO1xuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGpvaW5fcmVmLmxlbmd0aCk7XG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgcmVmLmxlbmd0aCk7XG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdG9waWMubGVuZ3RoKTtcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBldmVudC5sZW5ndGgpO1xuICAgIEFycmF5LmZyb20oam9pbl9yZWYsIChjaGFyKSA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKTtcbiAgICBBcnJheS5mcm9tKHJlZiwgKGNoYXIpID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpO1xuICAgIEFycmF5LmZyb20odG9waWMsIChjaGFyKSA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKTtcbiAgICBBcnJheS5mcm9tKGV2ZW50LCAoY2hhcikgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSk7XG4gICAgdmFyIGNvbWJpbmVkID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyLmJ5dGVMZW5ndGggKyBwYXlsb2FkLmJ5dGVMZW5ndGgpO1xuICAgIGNvbWJpbmVkLnNldChuZXcgVWludDhBcnJheShoZWFkZXIpLCAwKTtcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkocGF5bG9hZCksIGhlYWRlci5ieXRlTGVuZ3RoKTtcbiAgICByZXR1cm4gY29tYmluZWQuYnVmZmVyO1xuICB9LFxuICBiaW5hcnlEZWNvZGUoYnVmZmVyKSB7XG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgICBsZXQga2luZCA9IHZpZXcuZ2V0VWludDgoMCk7XG4gICAgbGV0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5wdXNoOlxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2Rlcik7XG4gICAgICBjYXNlIHRoaXMuS0lORFMucmVwbHk6XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcik7XG4gICAgICBjYXNlIHRoaXMuS0lORFMuYnJvYWRjYXN0OlxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKTtcbiAgICB9XG4gIH0sXG4gIGRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKSB7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKTtcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgyKTtcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgzKTtcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSCAtIDE7XG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplO1xuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZTtcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemU7XG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aCk7XG4gICAgcmV0dXJuIHsgam9pbl9yZWY6IGpvaW5SZWYsIHJlZjogbnVsbCwgdG9waWMsIGV2ZW50LCBwYXlsb2FkOiBkYXRhIH07XG4gIH0sXG4gIGRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcikge1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSk7XG4gICAgbGV0IHJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDIpO1xuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDMpO1xuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDQpO1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyB0aGlzLk1FVEFfTEVOR1RIO1xuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBqb2luUmVmU2l6ZTtcbiAgICBsZXQgcmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgcmVmU2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIHJlZlNpemU7XG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSk7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplO1xuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZTtcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgICBsZXQgcGF5bG9hZCA9IHsgc3RhdHVzOiBldmVudCwgcmVzcG9uc2U6IGRhdGEgfTtcbiAgICByZXR1cm4geyBqb2luX3JlZjogam9pblJlZiwgcmVmLCB0b3BpYywgZXZlbnQ6IENIQU5ORUxfRVZFTlRTLnJlcGx5LCBwYXlsb2FkIH07XG4gIH0sXG4gIGRlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpIHtcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgxKTtcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgyKTtcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgMjtcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemU7XG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSk7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplO1xuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpO1xuICAgIHJldHVybiB7IGpvaW5fcmVmOiBudWxsLCByZWY6IG51bGwsIHRvcGljLCBldmVudCwgcGF5bG9hZDogZGF0YSB9O1xuICB9XG59O1xuXG4vLyBqcy9waG9lbml4L3NvY2tldC5qc1xudmFyIFNvY2tldCA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoZW5kUG9pbnQsIG9wdHMgPSB7fSkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MgPSB7IG9wZW46IFtdLCBjbG9zZTogW10sIGVycm9yOiBbXSwgbWVzc2FnZTogW10gfTtcbiAgICB0aGlzLmNoYW5uZWxzID0gW107XG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW107XG4gICAgdGhpcy5yZWYgPSAwO1xuICAgIHRoaXMudGltZW91dCA9IG9wdHMudGltZW91dCB8fCBERUZBVUxUX1RJTUVPVVQ7XG4gICAgdGhpcy50cmFuc3BvcnQgPSBvcHRzLnRyYW5zcG9ydCB8fCBnbG9iYWwuV2ViU29ja2V0IHx8IExvbmdQb2xsO1xuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucyA9IDA7XG4gICAgdGhpcy5kZWZhdWx0RW5jb2RlciA9IHNlcmlhbGl6ZXJfZGVmYXVsdC5lbmNvZGUuYmluZChzZXJpYWxpemVyX2RlZmF1bHQpO1xuICAgIHRoaXMuZGVmYXVsdERlY29kZXIgPSBzZXJpYWxpemVyX2RlZmF1bHQuZGVjb2RlLmJpbmQoc2VyaWFsaXplcl9kZWZhdWx0KTtcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZTtcbiAgICB0aGlzLmJpbmFyeVR5cGUgPSBvcHRzLmJpbmFyeVR5cGUgfHwgXCJhcnJheWJ1ZmZlclwiO1xuICAgIHRoaXMuY29ubmVjdENsb2NrID0gMTtcbiAgICBpZiAodGhpcy50cmFuc3BvcnQgIT09IExvbmdQb2xsKSB7XG4gICAgICB0aGlzLmVuY29kZSA9IG9wdHMuZW5jb2RlIHx8IHRoaXMuZGVmYXVsdEVuY29kZXI7XG4gICAgICB0aGlzLmRlY29kZSA9IG9wdHMuZGVjb2RlIHx8IHRoaXMuZGVmYXVsdERlY29kZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5jb2RlID0gdGhpcy5kZWZhdWx0RW5jb2RlcjtcbiAgICAgIHRoaXMuZGVjb2RlID0gdGhpcy5kZWZhdWx0RGVjb2RlcjtcbiAgICB9XG4gICAgbGV0IGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsO1xuICAgIGlmIChwaHhXaW5kb3cgJiYgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgKF9lKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbm4pIHtcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gdGhpcy5jb25uZWN0Q2xvY2s7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCAoX2UpID0+IHtcbiAgICAgICAgaWYgKGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPT09IHRoaXMuY29ubmVjdENsb2NrKSB7XG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMgPSBvcHRzLmhlYXJ0YmVhdEludGVydmFsTXMgfHwgM2U0O1xuICAgIHRoaXMucmVqb2luQWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYgKG9wdHMucmVqb2luQWZ0ZXJNcykge1xuICAgICAgICByZXR1cm4gb3B0cy5yZWpvaW5BZnRlck1zKHRyaWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMWUzLCAyZTMsIDVlM11bdHJpZXMgLSAxXSB8fCAxZTQ7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLnJlY29ubmVjdEFmdGVyTXMgPSAodHJpZXMpID0+IHtcbiAgICAgIGlmIChvcHRzLnJlY29ubmVjdEFmdGVyTXMpIHtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVjb25uZWN0QWZ0ZXJNcyh0cmllcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gWzEwLCA1MCwgMTAwLCAxNTAsIDIwMCwgMjUwLCA1MDAsIDFlMywgMmUzXVt0cmllcyAtIDFdIHx8IDVlMztcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXIgfHwgbnVsbDtcbiAgICB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0ID0gb3B0cy5sb25ncG9sbGVyVGltZW91dCB8fCAyZTQ7XG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KTtcbiAgICB0aGlzLmVuZFBvaW50ID0gYCR7ZW5kUG9pbnR9LyR7VFJBTlNQT1JUUy53ZWJzb2NrZXR9YDtcbiAgICB0aGlzLnZzbiA9IG9wdHMudnNuIHx8IERFRkFVTFRfVlNOO1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsO1xuICAgIHRoaXMucmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLmNvbm5lY3QoKSk7XG4gICAgfSwgdGhpcy5yZWNvbm5lY3RBZnRlck1zKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgTG9uZ1BvbGwgdHJhbnNwb3J0IHJlZmVyZW5jZVxuICAgKi9cbiAgZ2V0TG9uZ1BvbGxUcmFuc3BvcnQoKSB7XG4gICAgcmV0dXJuIExvbmdQb2xsO1xuICB9XG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBhbmQgcmVwbGFjZXMgdGhlIGFjdGl2ZSB0cmFuc3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3VHJhbnNwb3J0IC0gVGhlIG5ldyB0cmFuc3BvcnQgY2xhc3MgdG8gaW5zdGFudGlhdGVcbiAgICpcbiAgICovXG4gIHJlcGxhY2VUcmFuc3BvcnQobmV3VHJhbnNwb3J0KSB7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srKztcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlO1xuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKTtcbiAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXTtcbiAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICB0aGlzLmNvbm4uY2xvc2UoKTtcbiAgICAgIHRoaXMuY29ubiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMudHJhbnNwb3J0ID0gbmV3VHJhbnNwb3J0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzb2NrZXQgcHJvdG9jb2xcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHByb3RvY29sKCkge1xuICAgIHJldHVybiBsb2NhdGlvbi5wcm90b2NvbC5tYXRjaCgvXmh0dHBzLykgPyBcIndzc1wiIDogXCJ3c1wiO1xuICB9XG4gIC8qKlxuICAgKiBUaGUgZnVsbHkgcXVhbGlmaWVkIHNvY2tldCB1cmxcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGVuZFBvaW50VVJMKCkge1xuICAgIGxldCB1cmkgPSBBamF4LmFwcGVuZFBhcmFtcyhcbiAgICAgIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMuZW5kUG9pbnQsIHRoaXMucGFyYW1zKCkpLFxuICAgICAgeyB2c246IHRoaXMudnNuIH1cbiAgICApO1xuICAgIGlmICh1cmkuY2hhckF0KDApICE9PSBcIi9cIikge1xuICAgICAgcmV0dXJuIHVyaTtcbiAgICB9XG4gICAgaWYgKHVyaS5jaGFyQXQoMSkgPT09IFwiL1wiKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfToke3VyaX1gO1xuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfTovLyR7bG9jYXRpb24uaG9zdH0ke3VyaX1gO1xuICB9XG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyB0aGUgc29ja2V0XG4gICAqXG4gICAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2xvc2VFdmVudCNTdGF0dXNfY29kZXMgZm9yIHZhbGlkIHN0YXR1cyBjb2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgYWZ0ZXIgc29ja2V0IGlzIGRpc2Nvbm5lY3RlZC5cbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBjb2RlIC0gQSBzdGF0dXMgY29kZSBmb3IgZGlzY29ubmVjdGlvbiAoT3B0aW9uYWwpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVhc29uIC0gQSB0ZXh0dWFsIGRlc2NyaXB0aW9uIG9mIHRoZSByZWFzb24gdG8gZGlzY29ubmVjdC4gKE9wdGlvbmFsKVxuICAgKi9cbiAgZGlzY29ubmVjdChjYWxsYmFjaywgY29kZSwgcmVhc29uKSB7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srKztcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlO1xuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKTtcbiAgICB0aGlzLnRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtcyB0byBzZW5kIHdoZW4gY29ubmVjdGluZywgZm9yIGV4YW1wbGUgYHt1c2VyX2lkOiB1c2VyVG9rZW59YFxuICAgKlxuICAgKiBQYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQ7IHBhc3MgdGhlbSBpbiB0aGUgU29ja2V0IGNvbnN0cnVjdG9yIGluc3RlYWQ6XG4gICAqIGBuZXcgU29ja2V0KFwiL3NvY2tldFwiLCB7cGFyYW1zOiB7dXNlcl9pZDogdXNlclRva2VufX0pYC5cbiAgICovXG4gIGNvbm5lY3QocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcInBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCBwYXNzIDpwYXJhbXMgdG8gdGhlIFNvY2tldCBjb25zdHJ1Y3RvclwiKTtcbiAgICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdENsb2NrKys7XG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2U7XG4gICAgdGhpcy5jb25uID0gbmV3IHRoaXMudHJhbnNwb3J0KHRoaXMuZW5kUG9pbnRVUkwoKSk7XG4gICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSB0aGlzLmJpbmFyeVR5cGU7XG4gICAgdGhpcy5jb25uLnRpbWVvdXQgPSB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0O1xuICAgIHRoaXMuY29ubi5vbm9wZW4gPSAoKSA9PiB0aGlzLm9uQ29ubk9wZW4oKTtcbiAgICB0aGlzLmNvbm4ub25lcnJvciA9IChlcnJvcikgPT4gdGhpcy5vbkNvbm5FcnJvcihlcnJvcik7XG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IChldmVudCkgPT4gdGhpcy5vbkNvbm5NZXNzYWdlKGV2ZW50KTtcbiAgICB0aGlzLmNvbm4ub25jbG9zZSA9IChldmVudCkgPT4gdGhpcy5vbkNvbm5DbG9zZShldmVudCk7XG4gIH1cbiAgLyoqXG4gICAqIExvZ3MgdGhlIG1lc3NhZ2UuIE92ZXJyaWRlIGB0aGlzLmxvZ2dlcmAgZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcuIG5vb3BzIGJ5IGRlZmF1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtpbmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgbG9nKGtpbmQsIG1zZywgZGF0YSkge1xuICAgIHRoaXMubG9nZ2VyKGtpbmQsIG1zZywgZGF0YSk7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIGxvZ2dlciBoYXMgYmVlbiBzZXQgb24gdGhpcyBzb2NrZXQuXG4gICAqL1xuICBoYXNMb2dnZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9nZ2VyICE9PSBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIG9wZW4gZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbk9wZW4oZnVuY3Rpb24oKXsgY29uc29sZS5pbmZvKFwidGhlIHNvY2tldCB3YXMgb3BlbmVkXCIpIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbk9wZW4oY2FsbGJhY2spIHtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5vcGVuLnB1c2goW3JlZiwgY2FsbGJhY2tdKTtcbiAgICByZXR1cm4gcmVmO1xuICB9XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGNsb3NlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjaykge1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLnB1c2goW3JlZiwgY2FsbGJhY2tdKTtcbiAgICByZXR1cm4gcmVmO1xuICB9XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGVycm9yIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25FcnJvcihmdW5jdGlvbihlcnJvcil7IGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spIHtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5wdXNoKFtyZWYsIGNhbGxiYWNrXSk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBtZXNzYWdlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25NZXNzYWdlKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5wdXNoKFtyZWYsIGNhbGxiYWNrXSk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuICAvKipcbiAgICogUGluZ3MgdGhlIHNlcnZlciBhbmQgaW52b2tlcyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgUlRUIGluIG1pbGxpc2Vjb25kc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHBpbmcgd2FzIHB1c2hlZCBvciBmYWxzZSBpZiB1bmFibGUgdG8gYmUgcHVzaGVkLlxuICAgKi9cbiAgcGluZyhjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKTtcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnB1c2goeyB0b3BpYzogXCJwaG9lbml4XCIsIGV2ZW50OiBcImhlYXJ0YmVhdFwiLCBwYXlsb2FkOiB7fSwgcmVmIH0pO1xuICAgIGxldCBvbk1zZ1JlZiA9IHRoaXMub25NZXNzYWdlKChtc2cpID0+IHtcbiAgICAgIGlmIChtc2cucmVmID09PSByZWYpIHtcbiAgICAgICAgdGhpcy5vZmYoW29uTXNnUmVmXSk7XG4gICAgICAgIGNhbGxiYWNrKERhdGUubm93KCkgLSBzdGFydFRpbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2xlYXJIZWFydGJlYXRzKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpO1xuICB9XG4gIG9uQ29ubk9wZW4oKSB7XG4gICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApO1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlO1xuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucysrO1xuICAgIHRoaXMuZmx1c2hTZW5kQnVmZmVyKCk7XG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpO1xuICAgIHRoaXMucmVzZXRIZWFydGJlYXQoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4uZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjaygpKTtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhlYXJ0YmVhdFRpbWVvdXQoKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZikge1xuICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLmhhc0xvZ2dlcigpKSB7XG4gICAgICAgIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiaGVhcnRiZWF0IHRpbWVvdXQuIEF0dGVtcHRpbmcgdG8gcmUtZXN0YWJsaXNoIGNvbm5lY3Rpb25cIik7XG4gICAgICB9XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKTtcbiAgICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlO1xuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpLCBXU19DTE9TRV9OT1JNQUwsIFwiaGVhcnRiZWF0IHRpbWVvdXRcIik7XG4gICAgfVxuICB9XG4gIHJlc2V0SGVhcnRiZWF0KCkge1xuICAgIGlmICh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnNraXBIZWFydGJlYXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbDtcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpO1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpO1xuICB9XG4gIHRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pIHtcbiAgICBpZiAoIXRoaXMuY29ubikge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29ubikge1xuICAgICAgICBpZiAoY29kZSkge1xuICAgICAgICAgIHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24gfHwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25uLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbm4pIHtcbiAgICAgICAgICB0aGlzLmNvbm4ub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLmNvbm4ub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5jb25uLm9uY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuY29ubiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHdhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyA9IDEpIHtcbiAgICBpZiAodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCAhdGhpcy5jb25uLmJ1ZmZlcmVkQW1vdW50KSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzICsgMSk7XG4gICAgfSwgMTUwICogdHJpZXMpO1xuICB9XG4gIHdhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzID0gMSkge1xuICAgIGlmICh0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8IHRoaXMuY29ubi5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNsb3NlZCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzICsgMSk7XG4gICAgfSwgMTUwICogdHJpZXMpO1xuICB9XG4gIG9uQ29ubkNsb3NlKGV2ZW50KSB7XG4gICAgbGV0IGNsb3NlQ29kZSA9IGV2ZW50ICYmIGV2ZW50LmNvZGU7XG4gICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImNsb3NlXCIsIGV2ZW50KTtcbiAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKTtcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpO1xuICAgIGlmICghdGhpcy5jbG9zZVdhc0NsZWFuICYmIGNsb3NlQ29kZSAhPT0gMWUzKSB7XG4gICAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soZXZlbnQpKTtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubkVycm9yKGVycm9yKSB7XG4gICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBlcnJvcik7XG4gICAgbGV0IHRyYW5zcG9ydEJlZm9yZSA9IHRoaXMudHJhbnNwb3J0O1xuICAgIGxldCBlc3RhYmxpc2hlZEJlZm9yZSA9IHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucztcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4ge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIHRyYW5zcG9ydEJlZm9yZSwgZXN0YWJsaXNoZWRCZWZvcmUpO1xuICAgIH0pO1xuICAgIGlmICh0cmFuc3BvcnRCZWZvcmUgPT09IHRoaXMudHJhbnNwb3J0IHx8IGVzdGFibGlzaGVkQmVmb3JlID4gMCkge1xuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlckNoYW5FcnJvcigpIHtcbiAgICB0aGlzLmNoYW5uZWxzLmZvckVhY2goKGNoYW5uZWwpID0+IHtcbiAgICAgIGlmICghKGNoYW5uZWwuaXNFcnJvcmVkKCkgfHwgY2hhbm5lbC5pc0xlYXZpbmcoKSB8fCBjaGFubmVsLmlzQ2xvc2VkKCkpKSB7XG4gICAgICAgIGNoYW5uZWwudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5lcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBjb25uZWN0aW9uU3RhdGUoKSB7XG4gICAgc3dpdGNoICh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnJlYWR5U3RhdGUpIHtcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nOlxuICAgICAgICByZXR1cm4gXCJjb25uZWN0aW5nXCI7XG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMub3BlbjpcbiAgICAgICAgcmV0dXJuIFwib3BlblwiO1xuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNsb3Npbmc6XG4gICAgICAgIHJldHVybiBcImNsb3NpbmdcIjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBcImNsb3NlZFwiO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uU3RhdGUoKSA9PT0gXCJvcGVuXCI7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbm5lbH1cbiAgICovXG4gIHJlbW92ZShjaGFubmVsKSB7XG4gICAgdGhpcy5vZmYoY2hhbm5lbC5zdGF0ZUNoYW5nZVJlZnMpO1xuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzLmZpbHRlcigoYykgPT4gYy5qb2luUmVmKCkgIT09IGNoYW5uZWwuam9pblJlZigpKTtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlcyBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYCByZWdpc3RyYXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge3JlZnN9IC0gbGlzdCBvZiByZWZzIHJldHVybmVkIGJ5IGNhbGxzIHRvXG4gICAqICAgICAgICAgICAgICAgICBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYFxuICAgKi9cbiAgb2ZmKHJlZnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcykge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldID0gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldLmZpbHRlcigoW3JlZl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHJlZnMuaW5kZXhPZihyZWYpID09PSAtMTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogSW5pdGlhdGVzIGEgbmV3IGNoYW5uZWwgZm9yIHRoZSBnaXZlbiB0b3BpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAgICogQHBhcmFtIHtPYmplY3R9IGNoYW5QYXJhbXMgLSBQYXJhbWV0ZXJzIGZvciB0aGUgY2hhbm5lbFxuICAgKiBAcmV0dXJucyB7Q2hhbm5lbH1cbiAgICovXG4gIGNoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMgPSB7fSkge1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpO1xuICAgIHRoaXMuY2hhbm5lbHMucHVzaChjaGFuKTtcbiAgICByZXR1cm4gY2hhbjtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIHB1c2goZGF0YSkge1xuICAgIGlmICh0aGlzLmhhc0xvZ2dlcigpKSB7XG4gICAgICBsZXQgeyB0b3BpYywgZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWYgfSA9IGRhdGE7XG4gICAgICB0aGlzLmxvZyhcInB1c2hcIiwgYCR7dG9waWN9ICR7ZXZlbnR9ICgke2pvaW5fcmVmfSwgJHtyZWZ9KWAsIHBheWxvYWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmVuY29kZShkYXRhLCAocmVzdWx0KSA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLnB1c2goKCkgPT4gdGhpcy5lbmNvZGUoZGF0YSwgKHJlc3VsdCkgPT4gdGhpcy5jb25uLnNlbmQocmVzdWx0KSkpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKSB7XG4gICAgbGV0IG5ld1JlZiA9IHRoaXMucmVmICsgMTtcbiAgICBpZiAobmV3UmVmID09PSB0aGlzLnJlZikge1xuICAgICAgdGhpcy5yZWYgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZiA9IG5ld1JlZjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVmLnRvU3RyaW5nKCk7XG4gIH1cbiAgc2VuZEhlYXJ0YmVhdCgpIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmICYmICF0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gdGhpcy5tYWtlUmVmKCk7XG4gICAgdGhpcy5wdXNoKHsgdG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmIH0pO1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmhlYXJ0YmVhdFRpbWVvdXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKTtcbiAgfVxuICBmbHVzaFNlbmRCdWZmZXIoKSB7XG4gICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjaygpKTtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdO1xuICAgIH1cbiAgfVxuICBvbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2UpIHtcbiAgICB0aGlzLmRlY29kZShyYXdNZXNzYWdlLmRhdGEsIChtc2cpID0+IHtcbiAgICAgIGxldCB7IHRvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZiB9ID0gbXNnO1xuICAgICAgaWYgKHJlZiAmJiByZWYgPT09IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZikge1xuICAgICAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpO1xuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsO1xuICAgICAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLmxvZyhcInJlY2VpdmVcIiwgYCR7cGF5bG9hZC5zdGF0dXMgfHwgXCJcIn0gJHt0b3BpY30gJHtldmVudH0gJHtyZWYgJiYgXCIoXCIgKyByZWYgKyBcIilcIiB8fCBcIlwifWAsIHBheWxvYWQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoYW5uZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2ldO1xuICAgICAgICBpZiAoIWNoYW5uZWwuaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luX3JlZikpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLnRyaWdnZXIoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWYpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IFssIGNhbGxiYWNrXSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZVtpXTtcbiAgICAgICAgY2FsbGJhY2sobXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBsZWF2ZU9wZW5Ub3BpYyh0b3BpYykge1xuICAgIGxldCBkdXBDaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKChjKSA9PiBjLnRvcGljID09PSB0b3BpYyAmJiAoYy5pc0pvaW5lZCgpIHx8IGMuaXNKb2luaW5nKCkpKTtcbiAgICBpZiAoZHVwQ2hhbm5lbCkge1xuICAgICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICAgIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBsZWF2aW5nIGR1cGxpY2F0ZSB0b3BpYyBcIiR7dG9waWN9XCJgKTtcbiAgICAgIGR1cENoYW5uZWwubGVhdmUoKTtcbiAgICB9XG4gIH1cbn07XG5leHBvcnQge1xuICBDaGFubmVsLFxuICBMb25nUG9sbCxcbiAgUHJlc2VuY2UsXG4gIHNlcmlhbGl6ZXJfZGVmYXVsdCBhcyBTZXJpYWxpemVyLFxuICBTb2NrZXRcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waG9lbml4Lm1qcy5tYXBcbiIsCiAgIi8vIGpzL3Bob2VuaXgvdXRpbHMuanNcbnZhciBjbG9zdXJlID0gKHZhbHVlKSA9PiB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgY2xvc3VyZTIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIHJldHVybiBjbG9zdXJlMjtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9jb25zdGFudHMuanNcbnZhciBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbDtcbnZhciBwaHhXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogbnVsbDtcbnZhciBnbG9iYWwgPSBnbG9iYWxTZWxmIHx8IHBoeFdpbmRvdyB8fCBnbG9iYWw7XG52YXIgREVGQVVMVF9WU04gPSBcIjIuMC4wXCI7XG52YXIgU09DS0VUX1NUQVRFUyA9IHsgY29ubmVjdGluZzogMCwgb3BlbjogMSwgY2xvc2luZzogMiwgY2xvc2VkOiAzIH07XG52YXIgREVGQVVMVF9USU1FT1VUID0gMWU0O1xudmFyIFdTX0NMT1NFX05PUk1BTCA9IDFlMztcbnZhciBDSEFOTkVMX1NUQVRFUyA9IHtcbiAgY2xvc2VkOiBcImNsb3NlZFwiLFxuICBlcnJvcmVkOiBcImVycm9yZWRcIixcbiAgam9pbmVkOiBcImpvaW5lZFwiLFxuICBqb2luaW5nOiBcImpvaW5pbmdcIixcbiAgbGVhdmluZzogXCJsZWF2aW5nXCJcbn07XG52YXIgQ0hBTk5FTF9FVkVOVFMgPSB7XG4gIGNsb3NlOiBcInBoeF9jbG9zZVwiLFxuICBlcnJvcjogXCJwaHhfZXJyb3JcIixcbiAgam9pbjogXCJwaHhfam9pblwiLFxuICByZXBseTogXCJwaHhfcmVwbHlcIixcbiAgbGVhdmU6IFwicGh4X2xlYXZlXCJcbn07XG52YXIgVFJBTlNQT1JUUyA9IHtcbiAgbG9uZ3BvbGw6IFwibG9uZ3BvbGxcIixcbiAgd2Vic29ja2V0OiBcIndlYnNvY2tldFwiXG59O1xudmFyIFhIUl9TVEFURVMgPSB7XG4gIGNvbXBsZXRlOiA0XG59O1xuXG4vLyBqcy9waG9lbml4L3B1c2guanNcbnZhciBQdXNoID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBldmVudCwgcGF5bG9hZCwgdGltZW91dCkge1xuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQgfHwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfTtcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGw7XG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dDtcbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IG51bGw7XG4gICAgdGhpcy5yZWNIb29rcyA9IFtdO1xuICAgIHRoaXMuc2VudCA9IGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dFxuICAgKi9cbiAgcmVzZW5kKHRpbWVvdXQpIHtcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnNlbmQoKTtcbiAgfVxuICAvKipcbiAgICpcbiAgICovXG4gIHNlbmQoKSB7XG4gICAgaWYgKHRoaXMuaGFzUmVjZWl2ZWQoXCJ0aW1lb3V0XCIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KCk7XG4gICAgdGhpcy5zZW50ID0gdHJ1ZTtcbiAgICB0aGlzLmNoYW5uZWwuc29ja2V0LnB1c2goe1xuICAgICAgdG9waWM6IHRoaXMuY2hhbm5lbC50b3BpYyxcbiAgICAgIGV2ZW50OiB0aGlzLmV2ZW50LFxuICAgICAgcGF5bG9hZDogdGhpcy5wYXlsb2FkKCksXG4gICAgICByZWY6IHRoaXMucmVmLFxuICAgICAgam9pbl9yZWY6IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSBzdGF0dXNcbiAgICogQHBhcmFtIHsqfSBjYWxsYmFja1xuICAgKi9cbiAgcmVjZWl2ZShzdGF0dXMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuaGFzUmVjZWl2ZWQoc3RhdHVzKSkge1xuICAgICAgY2FsbGJhY2sodGhpcy5yZWNlaXZlZFJlc3AucmVzcG9uc2UpO1xuICAgIH1cbiAgICB0aGlzLnJlY0hvb2tzLnB1c2goeyBzdGF0dXMsIGNhbGxiYWNrIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpO1xuICAgIHRoaXMucmVmID0gbnVsbDtcbiAgICB0aGlzLnJlZkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGw7XG4gICAgdGhpcy5zZW50ID0gZmFsc2U7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBtYXRjaFJlY2VpdmUoeyBzdGF0dXMsIHJlc3BvbnNlLCBfcmVmIH0pIHtcbiAgICB0aGlzLnJlY0hvb2tzLmZpbHRlcigoaCkgPT4gaC5zdGF0dXMgPT09IHN0YXR1cykuZm9yRWFjaCgoaCkgPT4gaC5jYWxsYmFjayhyZXNwb25zZSkpO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsUmVmRXZlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnJlZkV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY2hhbm5lbC5vZmYodGhpcy5yZWZFdmVudCk7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxUaW1lb3V0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRUaW1lcik7XG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnRUaW1lb3V0KCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXRUaW1lcikge1xuICAgICAgdGhpcy5jYW5jZWxUaW1lb3V0KCk7XG4gICAgfVxuICAgIHRoaXMucmVmID0gdGhpcy5jaGFubmVsLnNvY2tldC5tYWtlUmVmKCk7XG4gICAgdGhpcy5yZWZFdmVudCA9IHRoaXMuY2hhbm5lbC5yZXBseUV2ZW50TmFtZSh0aGlzLnJlZik7XG4gICAgdGhpcy5jaGFubmVsLm9uKHRoaXMucmVmRXZlbnQsIChwYXlsb2FkKSA9PiB7XG4gICAgICB0aGlzLmNhbmNlbFJlZkV2ZW50KCk7XG4gICAgICB0aGlzLmNhbmNlbFRpbWVvdXQoKTtcbiAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gcGF5bG9hZDtcbiAgICAgIHRoaXMubWF0Y2hSZWNlaXZlKHBheWxvYWQpO1xuICAgIH0pO1xuICAgIHRoaXMudGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoXCJ0aW1lb3V0XCIsIHt9KTtcbiAgICB9LCB0aGlzLnRpbWVvdXQpO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGFzUmVjZWl2ZWQoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVjZWl2ZWRSZXNwICYmIHRoaXMucmVjZWl2ZWRSZXNwLnN0YXR1cyA9PT0gc3RhdHVzO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihzdGF0dXMsIHJlc3BvbnNlKSB7XG4gICAgdGhpcy5jaGFubmVsLnRyaWdnZXIodGhpcy5yZWZFdmVudCwgeyBzdGF0dXMsIHJlc3BvbnNlIH0pO1xuICB9XG59O1xuXG4vLyBqcy9waG9lbml4L3RpbWVyLmpzXG52YXIgVGltZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCB0aW1lckNhbGMpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGhpcy50aW1lckNhbGMgPSB0aW1lckNhbGM7XG4gICAgdGhpcy50aW1lciA9IG51bGw7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICB9XG4gIC8qKlxuICAgKiBDYW5jZWxzIGFueSBwcmV2aW91cyBzY2hlZHVsZVRpbWVvdXQgYW5kIHNjaGVkdWxlcyBjYWxsYmFja1xuICAgKi9cbiAgc2NoZWR1bGVUaW1lb3V0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWVzID0gdGhpcy50cmllcyArIDE7XG4gICAgICB0aGlzLmNhbGxiYWNrKCk7XG4gICAgfSwgdGhpcy50aW1lckNhbGModGhpcy50cmllcyArIDEpKTtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9jaGFubmVsLmpzXG52YXIgQ2hhbm5lbCA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IodG9waWMsIHBhcmFtcywgc29ja2V0KSB7XG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZDtcbiAgICB0aGlzLnRvcGljID0gdG9waWM7XG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcyB8fCB7fSk7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgIHRoaXMuYmluZGluZ1JlZiA9IDA7XG4gICAgdGhpcy50aW1lb3V0ID0gdGhpcy5zb2NrZXQudGltZW91dDtcbiAgICB0aGlzLmpvaW5lZE9uY2UgPSBmYWxzZTtcbiAgICB0aGlzLmpvaW5QdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMuam9pbiwgdGhpcy5wYXJhbXMsIHRoaXMudGltZW91dCk7XG4gICAgdGhpcy5wdXNoQnVmZmVyID0gW107XG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMgPSBbXTtcbiAgICB0aGlzLnJlam9pblRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgIHRoaXMucmVqb2luKCk7XG4gICAgICB9XG4gICAgfSwgdGhpcy5zb2NrZXQucmVqb2luQWZ0ZXJNcyk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbkVycm9yKCgpID0+IHRoaXMucmVqb2luVGltZXIucmVzZXQoKSkpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzLnB1c2goXG4gICAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KCk7XG4gICAgICAgIGlmICh0aGlzLmlzRXJyb3JlZCgpKSB7XG4gICAgICAgICAgdGhpcy5yZWpvaW4oKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luZWQ7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KCk7XG4gICAgICB0aGlzLnB1c2hCdWZmZXIuZm9yRWFjaCgocHVzaEV2ZW50KSA9PiBwdXNoRXZlbnQuc2VuZCgpKTtcbiAgICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdO1xuICAgIH0pO1xuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcImVycm9yXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkO1xuICAgICAgaWYgKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgICAgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uQ2xvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpO1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBjbG9zZSAke3RoaXMudG9waWN9ICR7dGhpcy5qb2luUmVmKCl9YCk7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkO1xuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlKHRoaXMpO1xuICAgIH0pO1xuICAgIHRoaXMub25FcnJvcigocmVhc29uKSA9PiB7XG4gICAgICBpZiAodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpXG4gICAgICAgIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGVycm9yICR7dGhpcy50b3BpY31gLCByZWFzb24pO1xuICAgICAgaWYgKHRoaXMuaXNKb2luaW5nKCkpIHtcbiAgICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWQ7XG4gICAgICBpZiAodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgICB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGB0aW1lb3V0ICR7dGhpcy50b3BpY30gKCR7dGhpcy5qb2luUmVmKCl9KWAsIHRoaXMuam9pblB1c2gudGltZW91dCk7XG4gICAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aGlzLnRpbWVvdXQpO1xuICAgICAgbGVhdmVQdXNoLnNlbmQoKTtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkO1xuICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpO1xuICAgICAgaWYgKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgICAgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLnJlcGx5LCAocGF5bG9hZCwgcmVmKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIodGhpcy5yZXBseUV2ZW50TmFtZShyZWYpLCBwYXlsb2FkKTtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogSm9pbiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpIHtcbiAgICBpZiAodGhpcy5qb2luZWRPbmNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byBqb2luIG11bHRpcGxlIHRpbWVzLiAnam9pbicgY2FuIG9ubHkgYmUgY2FsbGVkIGEgc2luZ2xlIHRpbWUgcGVyIGNoYW5uZWwgaW5zdGFuY2VcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgICB0aGlzLmpvaW5lZE9uY2UgPSB0cnVlO1xuICAgICAgdGhpcy5yZWpvaW4oKTtcbiAgICAgIHJldHVybiB0aGlzLmpvaW5QdXNoO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgY2xvc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBjYWxsYmFjayk7XG4gIH1cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGVycm9yc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmVycm9yLCAocmVhc29uKSA9PiBjYWxsYmFjayhyZWFzb24pKTtcbiAgfVxuICAvKipcbiAgICogU3Vic2NyaWJlcyBvbiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBTdWJzY3JpcHRpb24gcmV0dXJucyBhIHJlZiBjb3VudGVyLCB3aGljaCBjYW4gYmUgdXNlZCBsYXRlciB0b1xuICAgKiB1bnN1YnNjcmliZSB0aGUgZXhhY3QgZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY29uc3QgcmVmMiA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19vdGhlcl9zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKiAvLyBTaW5jZSB1bnN1YnNjcmlwdGlvbiwgZG9fc3R1ZmYgd29uJ3QgZmlyZSxcbiAgICogLy8gd2hpbGUgZG9fb3RoZXJfc3R1ZmYgd2lsbCBrZWVwIGZpcmluZyBvbiB0aGUgXCJldmVudFwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICBsZXQgcmVmID0gdGhpcy5iaW5kaW5nUmVmKys7XG4gICAgdGhpcy5iaW5kaW5ncy5wdXNoKHsgZXZlbnQsIHJlZiwgY2FsbGJhY2sgfSk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIG9mZiBvZiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBVc2UgdGhlIHJlZiByZXR1cm5lZCBmcm9tIGEgY2hhbm5lbC5vbigpIHRvIHVuc3Vic2NyaWJlIG9uZVxuICAgKiBoYW5kbGVyLCBvciBwYXNzIG5vdGhpbmcgZm9yIHRoZSByZWYgdG8gdW5zdWJzY3JpYmUgYWxsXG4gICAqIGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gZXZlbnQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFVuc3Vic2NyaWJlIHRoZSBkb19zdHVmZiBoYW5kbGVyXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICpcbiAgICogLy8gVW5zdWJzY3JpYmUgYWxsIGhhbmRsZXJzIGZyb20gZXZlbnRcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiKVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9mZihldmVudCwgcmVmKSB7XG4gICAgdGhpcy5iaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuZmlsdGVyKChiaW5kKSA9PiB7XG4gICAgICByZXR1cm4gIShiaW5kLmV2ZW50ID09PSBldmVudCAmJiAodHlwZW9mIHJlZiA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZWYgPT09IGJpbmQucmVmKSk7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5QdXNoKCkge1xuICAgIHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNKb2luZWQoKTtcbiAgfVxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIGBldmVudGAgdG8gcGhvZW5peCB3aXRoIHRoZSBwYXlsb2FkIGBwYXlsb2FkYC5cbiAgICogUGhvZW5peCByZWNlaXZlcyB0aGlzIGluIHRoZSBgaGFuZGxlX2luKGV2ZW50LCBwYXlsb2FkLCBzb2NrZXQpYFxuICAgKiBmdW5jdGlvbi4gaWYgcGhvZW5peCByZXBsaWVzIG9yIGl0IHRpbWVzIG91dCAoZGVmYXVsdCAxMDAwMG1zKSxcbiAgICogdGhlbiBvcHRpb25hbGx5IHRoZSByZXBseSBjYW4gYmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwucHVzaChcImV2ZW50XCIpXG4gICAqICAgLnJlY2VpdmUoXCJva1wiLCBwYXlsb2FkID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCByZXBsaWVkOlwiLCBwYXlsb2FkKSlcbiAgICogICAucmVjZWl2ZShcImVycm9yXCIsIGVyciA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggZXJyb3JlZFwiLCBlcnIpKVxuICAgKiAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBjb25zb2xlLmxvZyhcInRpbWVkIG91dCBwdXNoaW5nXCIpKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIHB1c2goZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpIHtcbiAgICBwYXlsb2FkID0gcGF5bG9hZCB8fCB7fTtcbiAgICBpZiAoIXRoaXMuam9pbmVkT25jZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmllZCB0byBwdXNoICcke2V2ZW50fScgdG8gJyR7dGhpcy50b3BpY30nIGJlZm9yZSBqb2luaW5nLiBVc2UgY2hhbm5lbC5qb2luKCkgYmVmb3JlIHB1c2hpbmcgZXZlbnRzYCk7XG4gICAgfVxuICAgIGxldCBwdXNoRXZlbnQgPSBuZXcgUHVzaCh0aGlzLCBldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICBpZiAodGhpcy5jYW5QdXNoKCkpIHtcbiAgICAgIHB1c2hFdmVudC5zZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHB1c2hFdmVudC5zdGFydFRpbWVvdXQoKTtcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5wdXNoKHB1c2hFdmVudCk7XG4gICAgfVxuICAgIHJldHVybiBwdXNoRXZlbnQ7XG4gIH1cbiAgLyoqIExlYXZlcyB0aGUgY2hhbm5lbFxuICAgKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBzZXJ2ZXIgZXZlbnRzLCBhbmRcbiAgICogaW5zdHJ1Y3RzIGNoYW5uZWwgdG8gdGVybWluYXRlIG9uIHNlcnZlclxuICAgKlxuICAgKiBUcmlnZ2VycyBvbkNsb3NlKCkgaG9va3NcbiAgICpcbiAgICogVG8gcmVjZWl2ZSBsZWF2ZSBhY2tub3dsZWRnZW1lbnRzLCB1c2UgdGhlIGByZWNlaXZlYFxuICAgKiBob29rIHRvIGJpbmQgdG8gdGhlIHNlcnZlciBhY2ssIGllOlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLmxlYXZlKCkucmVjZWl2ZShcIm9rXCIsICgpID0+IGFsZXJ0KFwibGVmdCFcIikgKVxuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBsZWF2ZSh0aW1lb3V0ID0gdGhpcy50aW1lb3V0KSB7XG4gICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpO1xuICAgIHRoaXMuam9pblB1c2guY2FuY2VsVGltZW91dCgpO1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nO1xuICAgIGxldCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBsZWF2ZSAke3RoaXMudG9waWN9YCk7XG4gICAgICB0aGlzLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIFwibGVhdmVcIik7XG4gICAgfTtcbiAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aW1lb3V0KTtcbiAgICBsZWF2ZVB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IG9uQ2xvc2UoKSkucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gb25DbG9zZSgpKTtcbiAgICBsZWF2ZVB1c2guc2VuZCgpO1xuICAgIGlmICghdGhpcy5jYW5QdXNoKCkpIHtcbiAgICAgIGxlYXZlUHVzaC50cmlnZ2VyKFwib2tcIiwge30pO1xuICAgIH1cbiAgICByZXR1cm4gbGVhdmVQdXNoO1xuICB9XG4gIC8qKlxuICAgKiBPdmVycmlkYWJsZSBtZXNzYWdlIGhvb2tcbiAgICpcbiAgICogUmVjZWl2ZXMgYWxsIGV2ZW50cyBmb3Igc3BlY2lhbGl6ZWQgbWVzc2FnZSBoYW5kbGluZ1xuICAgKiBiZWZvcmUgZGlzcGF0Y2hpbmcgdG8gdGhlIGNoYW5uZWwgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBNdXN0IHJldHVybiB0aGUgcGF5bG9hZCwgbW9kaWZpZWQgb3IgdW5tb2RpZmllZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIG9uTWVzc2FnZShfZXZlbnQsIHBheWxvYWQsIF9yZWYpIHtcbiAgICByZXR1cm4gcGF5bG9hZDtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZikge1xuICAgIGlmICh0aGlzLnRvcGljICE9PSB0b3BpYykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoam9pblJlZiAmJiBqb2luUmVmICE9PSB0aGlzLmpvaW5SZWYoKSkge1xuICAgICAgaWYgKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIFwiZHJvcHBpbmcgb3V0ZGF0ZWQgbWVzc2FnZVwiLCB7IHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZiB9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgam9pblJlZigpIHtcbiAgICByZXR1cm4gdGhpcy5qb2luUHVzaC5yZWY7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCkge1xuICAgIGlmICh0aGlzLmlzTGVhdmluZygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc29ja2V0LmxlYXZlT3BlblRvcGljKHRoaXMudG9waWMpO1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nO1xuICAgIHRoaXMuam9pblB1c2gucmVzZW5kKHRpbWVvdXQpO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKSB7XG4gICAgbGV0IGhhbmRsZWRQYXlsb2FkID0gdGhpcy5vbk1lc3NhZ2UoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pblJlZik7XG4gICAgaWYgKHBheWxvYWQgJiYgIWhhbmRsZWRQYXlsb2FkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjaGFubmVsIG9uTWVzc2FnZSBjYWxsYmFja3MgbXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcIik7XG4gICAgfVxuICAgIGxldCBldmVudEJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoKGJpbmQpID0+IGJpbmQuZXZlbnQgPT09IGV2ZW50KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50QmluZGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBiaW5kID0gZXZlbnRCaW5kaW5nc1tpXTtcbiAgICAgIGJpbmQuY2FsbGJhY2soaGFuZGxlZFBheWxvYWQsIHJlZiwgam9pblJlZiB8fCB0aGlzLmpvaW5SZWYoKSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVwbHlFdmVudE5hbWUocmVmKSB7XG4gICAgcmV0dXJuIGBjaGFuX3JlcGx5XyR7cmVmfWA7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Nsb3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNFcnJvcmVkKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5lZDtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmluZztcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTGVhdmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMubGVhdmluZztcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9hamF4LmpzXG52YXIgQWpheCA9IGNsYXNzIHtcbiAgc3RhdGljIHJlcXVlc3QobWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGdsb2JhbC5YRG9tYWluUmVxdWVzdCkge1xuICAgICAgbGV0IHJlcSA9IG5ldyBnbG9iYWwuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIHJldHVybiB0aGlzLnhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIHhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaykge1xuICAgIHJlcS50aW1lb3V0ID0gdGltZW91dDtcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50KTtcbiAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwb25zZSk7XG4gICAgfTtcbiAgICBpZiAob250aW1lb3V0KSB7XG4gICAgICByZXEub250aW1lb3V0ID0gb250aW1lb3V0O1xuICAgIH1cbiAgICByZXEub25wcm9ncmVzcyA9ICgpID0+IHtcbiAgICB9O1xuICAgIHJlcS5zZW5kKGJvZHkpO1xuICAgIHJldHVybiByZXE7XG4gIH1cbiAgc3RhdGljIHhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spIHtcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50LCB0cnVlKTtcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgYWNjZXB0KTtcbiAgICByZXEub25lcnJvciA9ICgpID0+IGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IFhIUl9TVEFURVMuY29tcGxldGUgJiYgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChvbnRpbWVvdXQpIHtcbiAgICAgIHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQ7XG4gICAgfVxuICAgIHJlcS5zZW5kKGJvZHkpO1xuICAgIHJldHVybiByZXE7XG4gIH1cbiAgc3RhdGljIHBhcnNlSlNPTihyZXNwKSB7XG4gICAgaWYgKCFyZXNwIHx8IHJlc3AgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcImZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlXCIsIHJlc3ApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBzZXJpYWxpemUob2JqLCBwYXJlbnRLZXkpIHtcbiAgICBsZXQgcXVlcnlTdHIgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBsZXQgcGFyYW1LZXkgPSBwYXJlbnRLZXkgPyBgJHtwYXJlbnRLZXl9WyR7a2V5fV1gIDoga2V5O1xuICAgICAgbGV0IHBhcmFtVmFsID0gb2JqW2tleV07XG4gICAgICBpZiAodHlwZW9mIHBhcmFtVmFsID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2godGhpcy5zZXJpYWxpemUocGFyYW1WYWwsIHBhcmFtS2V5KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeVN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwYXJhbUtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVZhbCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcXVlcnlTdHIuam9pbihcIiZcIik7XG4gIH1cbiAgc3RhdGljIGFwcGVuZFBhcmFtcyh1cmwsIHBhcmFtcykge1xuICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgbGV0IHByZWZpeCA9IHVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiO1xuICAgIHJldHVybiBgJHt1cmx9JHtwcmVmaXh9JHt0aGlzLnNlcmlhbGl6ZShwYXJhbXMpfWA7XG4gIH1cbn07XG5cbi8vIGpzL3Bob2VuaXgvbG9uZ3BvbGwuanNcbnZhciBhcnJheUJ1ZmZlclRvQmFzZTY0ID0gKGJ1ZmZlcikgPT4ge1xuICBsZXQgYmluYXJ5ID0gXCJcIjtcbiAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgbGV0IGxlbiA9IGJ5dGVzLmJ5dGVMZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIGJ0b2EoYmluYXJ5KTtcbn07XG52YXIgTG9uZ1BvbGwgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGVuZFBvaW50KSB7XG4gICAgdGhpcy5lbmRQb2ludCA9IG51bGw7XG4gICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgdGhpcy5za2lwSGVhcnRiZWF0ID0gdHJ1ZTtcbiAgICB0aGlzLnJlcXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudEJhdGNoID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRCYXRjaFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLmJhdGNoQnVmZmVyID0gW107XG4gICAgdGhpcy5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICB9O1xuICAgIHRoaXMub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgdGhpcy5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICB9O1xuICAgIHRoaXMub25jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgdGhpcy5wb2xsRW5kcG9pbnQgPSB0aGlzLm5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KTtcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc7XG4gICAgdGhpcy5wb2xsKCk7XG4gIH1cbiAgbm9ybWFsaXplRW5kcG9pbnQoZW5kUG9pbnQpIHtcbiAgICByZXR1cm4gZW5kUG9pbnQucmVwbGFjZShcIndzOi8vXCIsIFwiaHR0cDovL1wiKS5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIikucmVwbGFjZShuZXcgUmVnRXhwKFwiKC4qKS9cIiArIFRSQU5TUE9SVFMud2Vic29ja2V0KSwgXCIkMS9cIiArIFRSQU5TUE9SVFMubG9uZ3BvbGwpO1xuICB9XG4gIGVuZHBvaW50VVJMKCkge1xuICAgIHJldHVybiBBamF4LmFwcGVuZFBhcmFtcyh0aGlzLnBvbGxFbmRwb2ludCwgeyB0b2tlbjogdGhpcy50b2tlbiB9KTtcbiAgfVxuICBjbG9zZUFuZFJldHJ5KGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pIHtcbiAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pO1xuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZztcbiAgfVxuICBvbnRpbWVvdXQoKSB7XG4gICAgdGhpcy5vbmVycm9yKFwidGltZW91dFwiKTtcbiAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAwNSwgXCJ0aW1lb3V0XCIsIGZhbHNlKTtcbiAgfVxuICBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLm9wZW4gfHwgdGhpcy5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc7XG4gIH1cbiAgcG9sbCgpIHtcbiAgICB0aGlzLmFqYXgoXCJHRVRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIG51bGwsICgpID0+IHRoaXMub250aW1lb3V0KCksIChyZXNwKSA9PiB7XG4gICAgICBpZiAocmVzcCkge1xuICAgICAgICB2YXIgeyBzdGF0dXMsIHRva2VuLCBtZXNzYWdlcyB9ID0gcmVzcDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdHVzID0gMDtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgMjAwOlxuICAgICAgICAgIG1lc3NhZ2VzLmZvckVhY2goKG1zZykgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm9ubWVzc2FnZSh7IGRhdGE6IG1zZyB9KSwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5wb2xsKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjA0OlxuICAgICAgICAgIHRoaXMucG9sbCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQxMDpcbiAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLm9wZW47XG4gICAgICAgICAgdGhpcy5vbm9wZW4oe30pO1xuICAgICAgICAgIHRoaXMucG9sbCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNDAzKTtcbiAgICAgICAgICB0aGlzLmNsb3NlKDEwMDgsIFwiZm9yYmlkZGVuXCIsIGZhbHNlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNTAwKTtcbiAgICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgNTAwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuaGFuZGxlZCBwb2xsIHN0YXR1cyAke3N0YXR1c31gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvLyB3ZSBjb2xsZWN0IGFsbCBwdXNoZXMgd2l0aGluIHRoZSBjdXJyZW50IGV2ZW50IGxvb3AgYnlcbiAgLy8gc2V0VGltZW91dCAwLCB3aGljaCBvcHRpbWl6ZXMgYmFjay10by1iYWNrIHByb2NlZHVyYWxcbiAgLy8gcHVzaGVzIGFnYWluc3QgYW4gZW1wdHkgYnVmZmVyXG4gIHNlbmQoYm9keSkge1xuICAgIGlmICh0eXBlb2YgYm9keSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgYm9keSA9IGFycmF5QnVmZmVyVG9CYXNlNjQoYm9keSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmN1cnJlbnRCYXRjaCkge1xuICAgICAgdGhpcy5jdXJyZW50QmF0Y2gucHVzaChib2R5KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXdhaXRpbmdCYXRjaEFjaykge1xuICAgICAgdGhpcy5iYXRjaEJ1ZmZlci5wdXNoKGJvZHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IFtib2R5XTtcbiAgICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5jdXJyZW50QmF0Y2gpO1xuICAgICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IG51bGw7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cbiAgYmF0Y2hTZW5kKG1lc3NhZ2VzKSB7XG4gICAgdGhpcy5hd2FpdGluZ0JhdGNoQWNrID0gdHJ1ZTtcbiAgICB0aGlzLmFqYXgoXCJQT1NUXCIsIFwiYXBwbGljYXRpb24veC1uZGpzb25cIiwgbWVzc2FnZXMuam9pbihcIlxcblwiKSwgKCkgPT4gdGhpcy5vbmVycm9yKFwidGltZW91dFwiKSwgKHJlc3ApID0+IHtcbiAgICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlO1xuICAgICAgaWYgKCFyZXNwIHx8IHJlc3Auc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgdGhpcy5vbmVycm9yKHJlc3AgJiYgcmVzcC5zdGF0dXMpO1xuICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmJhdGNoQnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5iYXRjaEJ1ZmZlcik7XG4gICAgICAgIHRoaXMuYmF0Y2hCdWZmZXIgPSBbXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjbG9zZShjb2RlLCByZWFzb24sIHdhc0NsZWFuKSB7XG4gICAgZm9yIChsZXQgcmVxIG9mIHRoaXMucmVxcykge1xuICAgICAgcmVxLmFib3J0KCk7XG4gICAgfVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY2xvc2VkO1xuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7IGNvZGU6IDFlMywgcmVhc29uOiB2b2lkIDAsIHdhc0NsZWFuOiB0cnVlIH0sIHsgY29kZSwgcmVhc29uLCB3YXNDbGVhbiB9KTtcbiAgICB0aGlzLmJhdGNoQnVmZmVyID0gW107XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY3VycmVudEJhdGNoVGltZXIpO1xuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsO1xuICAgIGlmICh0eXBlb2YgQ2xvc2VFdmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5vbmNsb3NlKG5ldyBDbG9zZUV2ZW50KFwiY2xvc2VcIiwgb3B0cykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uY2xvc2Uob3B0cyk7XG4gICAgfVxuICB9XG4gIGFqYXgobWV0aG9kLCBjb250ZW50VHlwZSwgYm9keSwgb25DYWxsZXJUaW1lb3V0LCBjYWxsYmFjaykge1xuICAgIGxldCByZXE7XG4gICAgbGV0IG9udGltZW91dCA9ICgpID0+IHtcbiAgICAgIHRoaXMucmVxcy5kZWxldGUocmVxKTtcbiAgICAgIG9uQ2FsbGVyVGltZW91dCgpO1xuICAgIH07XG4gICAgcmVxID0gQWpheC5yZXF1ZXN0KG1ldGhvZCwgdGhpcy5lbmRwb2ludFVSTCgpLCBjb250ZW50VHlwZSwgYm9keSwgdGhpcy50aW1lb3V0LCBvbnRpbWVvdXQsIChyZXNwKSA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSk7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc3ApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMucmVxcy5hZGQocmVxKTtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peC9wcmVzZW5jZS5qc1xudmFyIFByZXNlbmNlID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBvcHRzID0ge30pIHtcbiAgICBsZXQgZXZlbnRzID0gb3B0cy5ldmVudHMgfHwgeyBzdGF0ZTogXCJwcmVzZW5jZV9zdGF0ZVwiLCBkaWZmOiBcInByZXNlbmNlX2RpZmZcIiB9O1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdO1xuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgdGhpcy5qb2luUmVmID0gbnVsbDtcbiAgICB0aGlzLmNhbGxlciA9IHtcbiAgICAgIG9uSm9pbjogZnVuY3Rpb24oKSB7XG4gICAgICB9LFxuICAgICAgb25MZWF2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB9LFxuICAgICAgb25TeW5jOiBmdW5jdGlvbigpIHtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2hhbm5lbC5vbihldmVudHMuc3RhdGUsIChuZXdTdGF0ZSkgPT4ge1xuICAgICAgbGV0IHsgb25Kb2luLCBvbkxlYXZlLCBvblN5bmMgfSA9IHRoaXMuY2FsbGVyO1xuICAgICAgdGhpcy5qb2luUmVmID0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKTtcbiAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSk7XG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcy5mb3JFYWNoKChkaWZmKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdO1xuICAgICAgb25TeW5jKCk7XG4gICAgfSk7XG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5kaWZmLCAoZGlmZikgPT4ge1xuICAgICAgbGV0IHsgb25Kb2luLCBvbkxlYXZlLCBvblN5bmMgfSA9IHRoaXMuY2FsbGVyO1xuICAgICAgaWYgKHRoaXMuaW5QZW5kaW5nU3luY1N0YXRlKCkpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGlmZnMucHVzaChkaWZmKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpO1xuICAgICAgICBvblN5bmMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBvbkpvaW4oY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxlci5vbkpvaW4gPSBjYWxsYmFjaztcbiAgfVxuICBvbkxlYXZlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5jYWxsZXIub25MZWF2ZSA9IGNhbGxiYWNrO1xuICB9XG4gIG9uU3luYyhjYWxsYmFjaykge1xuICAgIHRoaXMuY2FsbGVyLm9uU3luYyA9IGNhbGxiYWNrO1xuICB9XG4gIGxpc3QoYnkpIHtcbiAgICByZXR1cm4gUHJlc2VuY2UubGlzdCh0aGlzLnN0YXRlLCBieSk7XG4gIH1cbiAgaW5QZW5kaW5nU3luY1N0YXRlKCkge1xuICAgIHJldHVybiAhdGhpcy5qb2luUmVmIHx8IHRoaXMuam9pblJlZiAhPT0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKTtcbiAgfVxuICAvLyBsb3dlci1sZXZlbCBwdWJsaWMgc3RhdGljIEFQSVxuICAvKipcbiAgICogVXNlZCB0byBzeW5jIHRoZSBsaXN0IG9mIHByZXNlbmNlcyBvbiB0aGUgc2VydmVyXG4gICAqIHdpdGggdGhlIGNsaWVudCdzIHN0YXRlLiBBbiBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrIGNhblxuICAgKiBiZSBwcm92aWRlZCB0byByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAqIGRpc2Nvbm5lY3RzIGFuZCByZWNvbm5lY3RzIHdpdGggdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLmNsb25lKGN1cnJlbnRTdGF0ZSk7XG4gICAgbGV0IGpvaW5zID0ge307XG4gICAgbGV0IGxlYXZlcyA9IHt9O1xuICAgIHRoaXMubWFwKHN0YXRlLCAoa2V5LCBwcmVzZW5jZSkgPT4ge1xuICAgICAgaWYgKCFuZXdTdGF0ZVtrZXldKSB7XG4gICAgICAgIGxlYXZlc1trZXldID0gcHJlc2VuY2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5tYXAobmV3U3RhdGUsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XTtcbiAgICAgIGlmIChjdXJyZW50UHJlc2VuY2UpIHtcbiAgICAgICAgbGV0IG5ld1JlZnMgPSBuZXdQcmVzZW5jZS5tZXRhcy5tYXAoKG0pID0+IG0ucGh4X3JlZik7XG4gICAgICAgIGxldCBjdXJSZWZzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLm1hcCgobSkgPT4gbS5waHhfcmVmKTtcbiAgICAgICAgbGV0IGpvaW5lZE1ldGFzID0gbmV3UHJlc2VuY2UubWV0YXMuZmlsdGVyKChtKSA9PiBjdXJSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApO1xuICAgICAgICBsZXQgbGVmdE1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcigobSkgPT4gbmV3UmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKTtcbiAgICAgICAgaWYgKGpvaW5lZE1ldGFzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2U7XG4gICAgICAgICAgam9pbnNba2V5XS5tZXRhcyA9IGpvaW5lZE1ldGFzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZWZ0TWV0YXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGxlYXZlc1trZXldID0gdGhpcy5jbG9uZShjdXJyZW50UHJlc2VuY2UpO1xuICAgICAgICAgIGxlYXZlc1trZXldLm1ldGFzID0gbGVmdE1ldGFzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3luY0RpZmYoc3RhdGUsIHsgam9pbnMsIGxlYXZlcyB9LCBvbkpvaW4sIG9uTGVhdmUpO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBVc2VkIHRvIHN5bmMgYSBkaWZmIG9mIHByZXNlbmNlIGpvaW4gYW5kIGxlYXZlXG4gICAqIGV2ZW50cyBmcm9tIHRoZSBzZXJ2ZXIsIGFzIHRoZXkgaGFwcGVuLiBMaWtlIGBzeW5jU3RhdGVgLCBgc3luY0RpZmZgXG4gICAqIGFjY2VwdHMgb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFja3MgdG8gcmVhY3QgdG8gYSB1c2VyXG4gICAqIGpvaW5pbmcgb3IgbGVhdmluZyBmcm9tIGEgZGV2aWNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgc3luY0RpZmYoc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSkge1xuICAgIGxldCB7IGpvaW5zLCBsZWF2ZXMgfSA9IHRoaXMuY2xvbmUoZGlmZik7XG4gICAgaWYgKCFvbkpvaW4pIHtcbiAgICAgIG9uSm9pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKCFvbkxlYXZlKSB7XG4gICAgICBvbkxlYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLm1hcChqb2lucywgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldO1xuICAgICAgc3RhdGVba2V5XSA9IHRoaXMuY2xvbmUobmV3UHJlc2VuY2UpO1xuICAgICAgaWYgKGN1cnJlbnRQcmVzZW5jZSkge1xuICAgICAgICBsZXQgam9pbmVkUmVmcyA9IHN0YXRlW2tleV0ubWV0YXMubWFwKChtKSA9PiBtLnBoeF9yZWYpO1xuICAgICAgICBsZXQgY3VyTWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKChtKSA9PiBqb2luZWRSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApO1xuICAgICAgICBzdGF0ZVtrZXldLm1ldGFzLnVuc2hpZnQoLi4uY3VyTWV0YXMpO1xuICAgICAgfVxuICAgICAgb25Kb2luKGtleSwgY3VycmVudFByZXNlbmNlLCBuZXdQcmVzZW5jZSk7XG4gICAgfSk7XG4gICAgdGhpcy5tYXAobGVhdmVzLCAoa2V5LCBsZWZ0UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldO1xuICAgICAgaWYgKCFjdXJyZW50UHJlc2VuY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IHJlZnNUb1JlbW92ZSA9IGxlZnRQcmVzZW5jZS5tZXRhcy5tYXAoKG0pID0+IG0ucGh4X3JlZik7XG4gICAgICBjdXJyZW50UHJlc2VuY2UubWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKChwKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzVG9SZW1vdmUuaW5kZXhPZihwLnBoeF9yZWYpIDwgMDtcbiAgICAgIH0pO1xuICAgICAgb25MZWF2ZShrZXksIGN1cnJlbnRQcmVzZW5jZSwgbGVmdFByZXNlbmNlKTtcbiAgICAgIGlmIChjdXJyZW50UHJlc2VuY2UubWV0YXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBzdGF0ZVtrZXldO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJlc2VuY2VzLCB3aXRoIHNlbGVjdGVkIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJlc2VuY2VzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNob29zZXJcbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIGxpc3QocHJlc2VuY2VzLCBjaG9vc2VyKSB7XG4gICAgaWYgKCFjaG9vc2VyKSB7XG4gICAgICBjaG9vc2VyID0gZnVuY3Rpb24oa2V5LCBwcmVzKSB7XG4gICAgICAgIHJldHVybiBwcmVzO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubWFwKHByZXNlbmNlcywgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIHJldHVybiBjaG9vc2VyKGtleSwgcHJlc2VuY2UpO1xuICAgIH0pO1xuICB9XG4gIC8vIHByaXZhdGVcbiAgc3RhdGljIG1hcChvYmosIGZ1bmMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5tYXAoKGtleSkgPT4gZnVuYyhrZXksIG9ialtrZXldKSk7XG4gIH1cbiAgc3RhdGljIGNsb25lKG9iaikge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9XG59O1xuXG4vLyBqcy9waG9lbml4L3NlcmlhbGl6ZXIuanNcbnZhciBzZXJpYWxpemVyX2RlZmF1bHQgPSB7XG4gIEhFQURFUl9MRU5HVEg6IDEsXG4gIE1FVEFfTEVOR1RIOiA0LFxuICBLSU5EUzogeyBwdXNoOiAwLCByZXBseTogMSwgYnJvYWRjYXN0OiAyIH0sXG4gIGVuY29kZShtc2csIGNhbGxiYWNrKSB7XG4gICAgaWYgKG1zZy5wYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RW5jb2RlKG1zZykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcGF5bG9hZCA9IFttc2cuam9pbl9yZWYsIG1zZy5yZWYsIG1zZy50b3BpYywgbXNnLmV2ZW50LCBtc2cucGF5bG9hZF07XG4gICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgIH1cbiAgfSxcbiAgZGVjb2RlKHJhd1BheWxvYWQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHJhd1BheWxvYWQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlEZWNvZGUocmF3UGF5bG9hZCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgW2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZF0gPSBKU09OLnBhcnNlKHJhd1BheWxvYWQpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHsgam9pbl9yZWYsIHJlZiwgdG9waWMsIGV2ZW50LCBwYXlsb2FkIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gcHJpdmF0ZVxuICBiaW5hcnlFbmNvZGUobWVzc2FnZSkge1xuICAgIGxldCB7IGpvaW5fcmVmLCByZWYsIGV2ZW50LCB0b3BpYywgcGF5bG9hZCB9ID0gbWVzc2FnZTtcbiAgICBsZXQgbWV0YUxlbmd0aCA9IHRoaXMuTUVUQV9MRU5HVEggKyBqb2luX3JlZi5sZW5ndGggKyByZWYubGVuZ3RoICsgdG9waWMubGVuZ3RoICsgZXZlbnQubGVuZ3RoO1xuICAgIGxldCBoZWFkZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5IRUFERVJfTEVOR1RIICsgbWV0YUxlbmd0aCk7XG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoaGVhZGVyKTtcbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0aGlzLktJTkRTLnB1c2gpO1xuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGpvaW5fcmVmLmxlbmd0aCk7XG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgcmVmLmxlbmd0aCk7XG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdG9waWMubGVuZ3RoKTtcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBldmVudC5sZW5ndGgpO1xuICAgIEFycmF5LmZyb20oam9pbl9yZWYsIChjaGFyKSA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKTtcbiAgICBBcnJheS5mcm9tKHJlZiwgKGNoYXIpID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpO1xuICAgIEFycmF5LmZyb20odG9waWMsIChjaGFyKSA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKTtcbiAgICBBcnJheS5mcm9tKGV2ZW50LCAoY2hhcikgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSk7XG4gICAgdmFyIGNvbWJpbmVkID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyLmJ5dGVMZW5ndGggKyBwYXlsb2FkLmJ5dGVMZW5ndGgpO1xuICAgIGNvbWJpbmVkLnNldChuZXcgVWludDhBcnJheShoZWFkZXIpLCAwKTtcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkocGF5bG9hZCksIGhlYWRlci5ieXRlTGVuZ3RoKTtcbiAgICByZXR1cm4gY29tYmluZWQuYnVmZmVyO1xuICB9LFxuICBiaW5hcnlEZWNvZGUoYnVmZmVyKSB7XG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgICBsZXQga2luZCA9IHZpZXcuZ2V0VWludDgoMCk7XG4gICAgbGV0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5wdXNoOlxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2Rlcik7XG4gICAgICBjYXNlIHRoaXMuS0lORFMucmVwbHk6XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcik7XG4gICAgICBjYXNlIHRoaXMuS0lORFMuYnJvYWRjYXN0OlxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKTtcbiAgICB9XG4gIH0sXG4gIGRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKSB7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKTtcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgyKTtcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgzKTtcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSCAtIDE7XG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplO1xuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZTtcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemU7XG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aCk7XG4gICAgcmV0dXJuIHsgam9pbl9yZWY6IGpvaW5SZWYsIHJlZjogbnVsbCwgdG9waWMsIGV2ZW50LCBwYXlsb2FkOiBkYXRhIH07XG4gIH0sXG4gIGRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcikge1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSk7XG4gICAgbGV0IHJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDIpO1xuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDMpO1xuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDQpO1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyB0aGlzLk1FVEFfTEVOR1RIO1xuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBqb2luUmVmU2l6ZTtcbiAgICBsZXQgcmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgcmVmU2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIHJlZlNpemU7XG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSk7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplO1xuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpO1xuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZTtcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgICBsZXQgcGF5bG9hZCA9IHsgc3RhdHVzOiBldmVudCwgcmVzcG9uc2U6IGRhdGEgfTtcbiAgICByZXR1cm4geyBqb2luX3JlZjogam9pblJlZiwgcmVmLCB0b3BpYywgZXZlbnQ6IENIQU5ORUxfRVZFTlRTLnJlcGx5LCBwYXlsb2FkIH07XG4gIH0sXG4gIGRlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpIHtcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgxKTtcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgyKTtcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgMjtcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemU7XG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSk7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplO1xuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpO1xuICAgIHJldHVybiB7IGpvaW5fcmVmOiBudWxsLCByZWY6IG51bGwsIHRvcGljLCBldmVudCwgcGF5bG9hZDogZGF0YSB9O1xuICB9XG59O1xuXG4vLyBqcy9waG9lbml4L3NvY2tldC5qc1xudmFyIFNvY2tldCA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoZW5kUG9pbnQsIG9wdHMgPSB7fSkge1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MgPSB7IG9wZW46IFtdLCBjbG9zZTogW10sIGVycm9yOiBbXSwgbWVzc2FnZTogW10gfTtcbiAgICB0aGlzLmNoYW5uZWxzID0gW107XG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW107XG4gICAgdGhpcy5yZWYgPSAwO1xuICAgIHRoaXMudGltZW91dCA9IG9wdHMudGltZW91dCB8fCBERUZBVUxUX1RJTUVPVVQ7XG4gICAgdGhpcy50cmFuc3BvcnQgPSBvcHRzLnRyYW5zcG9ydCB8fCBnbG9iYWwuV2ViU29ja2V0IHx8IExvbmdQb2xsO1xuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucyA9IDA7XG4gICAgdGhpcy5kZWZhdWx0RW5jb2RlciA9IHNlcmlhbGl6ZXJfZGVmYXVsdC5lbmNvZGUuYmluZChzZXJpYWxpemVyX2RlZmF1bHQpO1xuICAgIHRoaXMuZGVmYXVsdERlY29kZXIgPSBzZXJpYWxpemVyX2RlZmF1bHQuZGVjb2RlLmJpbmQoc2VyaWFsaXplcl9kZWZhdWx0KTtcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZTtcbiAgICB0aGlzLmJpbmFyeVR5cGUgPSBvcHRzLmJpbmFyeVR5cGUgfHwgXCJhcnJheWJ1ZmZlclwiO1xuICAgIHRoaXMuY29ubmVjdENsb2NrID0gMTtcbiAgICBpZiAodGhpcy50cmFuc3BvcnQgIT09IExvbmdQb2xsKSB7XG4gICAgICB0aGlzLmVuY29kZSA9IG9wdHMuZW5jb2RlIHx8IHRoaXMuZGVmYXVsdEVuY29kZXI7XG4gICAgICB0aGlzLmRlY29kZSA9IG9wdHMuZGVjb2RlIHx8IHRoaXMuZGVmYXVsdERlY29kZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5jb2RlID0gdGhpcy5kZWZhdWx0RW5jb2RlcjtcbiAgICAgIHRoaXMuZGVjb2RlID0gdGhpcy5kZWZhdWx0RGVjb2RlcjtcbiAgICB9XG4gICAgbGV0IGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsO1xuICAgIGlmIChwaHhXaW5kb3cgJiYgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgKF9lKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbm4pIHtcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gdGhpcy5jb25uZWN0Q2xvY2s7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCAoX2UpID0+IHtcbiAgICAgICAgaWYgKGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPT09IHRoaXMuY29ubmVjdENsb2NrKSB7XG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMgPSBvcHRzLmhlYXJ0YmVhdEludGVydmFsTXMgfHwgM2U0O1xuICAgIHRoaXMucmVqb2luQWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYgKG9wdHMucmVqb2luQWZ0ZXJNcykge1xuICAgICAgICByZXR1cm4gb3B0cy5yZWpvaW5BZnRlck1zKHRyaWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMWUzLCAyZTMsIDVlM11bdHJpZXMgLSAxXSB8fCAxZTQ7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLnJlY29ubmVjdEFmdGVyTXMgPSAodHJpZXMpID0+IHtcbiAgICAgIGlmIChvcHRzLnJlY29ubmVjdEFmdGVyTXMpIHtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVjb25uZWN0QWZ0ZXJNcyh0cmllcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gWzEwLCA1MCwgMTAwLCAxNTAsIDIwMCwgMjUwLCA1MDAsIDFlMywgMmUzXVt0cmllcyAtIDFdIHx8IDVlMztcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXIgfHwgbnVsbDtcbiAgICB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0ID0gb3B0cy5sb25ncG9sbGVyVGltZW91dCB8fCAyZTQ7XG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KTtcbiAgICB0aGlzLmVuZFBvaW50ID0gYCR7ZW5kUG9pbnR9LyR7VFJBTlNQT1JUUy53ZWJzb2NrZXR9YDtcbiAgICB0aGlzLnZzbiA9IG9wdHMudnNuIHx8IERFRkFVTFRfVlNOO1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsO1xuICAgIHRoaXMucmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLmNvbm5lY3QoKSk7XG4gICAgfSwgdGhpcy5yZWNvbm5lY3RBZnRlck1zKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgTG9uZ1BvbGwgdHJhbnNwb3J0IHJlZmVyZW5jZVxuICAgKi9cbiAgZ2V0TG9uZ1BvbGxUcmFuc3BvcnQoKSB7XG4gICAgcmV0dXJuIExvbmdQb2xsO1xuICB9XG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBhbmQgcmVwbGFjZXMgdGhlIGFjdGl2ZSB0cmFuc3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3VHJhbnNwb3J0IC0gVGhlIG5ldyB0cmFuc3BvcnQgY2xhc3MgdG8gaW5zdGFudGlhdGVcbiAgICpcbiAgICovXG4gIHJlcGxhY2VUcmFuc3BvcnQobmV3VHJhbnNwb3J0KSB7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srKztcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlO1xuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKTtcbiAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXTtcbiAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICB0aGlzLmNvbm4uY2xvc2UoKTtcbiAgICAgIHRoaXMuY29ubiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMudHJhbnNwb3J0ID0gbmV3VHJhbnNwb3J0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzb2NrZXQgcHJvdG9jb2xcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHByb3RvY29sKCkge1xuICAgIHJldHVybiBsb2NhdGlvbi5wcm90b2NvbC5tYXRjaCgvXmh0dHBzLykgPyBcIndzc1wiIDogXCJ3c1wiO1xuICB9XG4gIC8qKlxuICAgKiBUaGUgZnVsbHkgcXVhbGlmaWVkIHNvY2tldCB1cmxcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGVuZFBvaW50VVJMKCkge1xuICAgIGxldCB1cmkgPSBBamF4LmFwcGVuZFBhcmFtcyhcbiAgICAgIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMuZW5kUG9pbnQsIHRoaXMucGFyYW1zKCkpLFxuICAgICAgeyB2c246IHRoaXMudnNuIH1cbiAgICApO1xuICAgIGlmICh1cmkuY2hhckF0KDApICE9PSBcIi9cIikge1xuICAgICAgcmV0dXJuIHVyaTtcbiAgICB9XG4gICAgaWYgKHVyaS5jaGFyQXQoMSkgPT09IFwiL1wiKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfToke3VyaX1gO1xuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfTovLyR7bG9jYXRpb24uaG9zdH0ke3VyaX1gO1xuICB9XG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyB0aGUgc29ja2V0XG4gICAqXG4gICAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2xvc2VFdmVudCNTdGF0dXNfY29kZXMgZm9yIHZhbGlkIHN0YXR1cyBjb2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgYWZ0ZXIgc29ja2V0IGlzIGRpc2Nvbm5lY3RlZC5cbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBjb2RlIC0gQSBzdGF0dXMgY29kZSBmb3IgZGlzY29ubmVjdGlvbiAoT3B0aW9uYWwpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVhc29uIC0gQSB0ZXh0dWFsIGRlc2NyaXB0aW9uIG9mIHRoZSByZWFzb24gdG8gZGlzY29ubmVjdC4gKE9wdGlvbmFsKVxuICAgKi9cbiAgZGlzY29ubmVjdChjYWxsYmFjaywgY29kZSwgcmVhc29uKSB7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srKztcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlO1xuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKTtcbiAgICB0aGlzLnRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtcyB0byBzZW5kIHdoZW4gY29ubmVjdGluZywgZm9yIGV4YW1wbGUgYHt1c2VyX2lkOiB1c2VyVG9rZW59YFxuICAgKlxuICAgKiBQYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQ7IHBhc3MgdGhlbSBpbiB0aGUgU29ja2V0IGNvbnN0cnVjdG9yIGluc3RlYWQ6XG4gICAqIGBuZXcgU29ja2V0KFwiL3NvY2tldFwiLCB7cGFyYW1zOiB7dXNlcl9pZDogdXNlclRva2VufX0pYC5cbiAgICovXG4gIGNvbm5lY3QocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcInBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCBwYXNzIDpwYXJhbXMgdG8gdGhlIFNvY2tldCBjb25zdHJ1Y3RvclwiKTtcbiAgICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb25uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdENsb2NrKys7XG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2U7XG4gICAgdGhpcy5jb25uID0gbmV3IHRoaXMudHJhbnNwb3J0KHRoaXMuZW5kUG9pbnRVUkwoKSk7XG4gICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSB0aGlzLmJpbmFyeVR5cGU7XG4gICAgdGhpcy5jb25uLnRpbWVvdXQgPSB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0O1xuICAgIHRoaXMuY29ubi5vbm9wZW4gPSAoKSA9PiB0aGlzLm9uQ29ubk9wZW4oKTtcbiAgICB0aGlzLmNvbm4ub25lcnJvciA9IChlcnJvcikgPT4gdGhpcy5vbkNvbm5FcnJvcihlcnJvcik7XG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IChldmVudCkgPT4gdGhpcy5vbkNvbm5NZXNzYWdlKGV2ZW50KTtcbiAgICB0aGlzLmNvbm4ub25jbG9zZSA9IChldmVudCkgPT4gdGhpcy5vbkNvbm5DbG9zZShldmVudCk7XG4gIH1cbiAgLyoqXG4gICAqIExvZ3MgdGhlIG1lc3NhZ2UuIE92ZXJyaWRlIGB0aGlzLmxvZ2dlcmAgZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcuIG5vb3BzIGJ5IGRlZmF1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtpbmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgbG9nKGtpbmQsIG1zZywgZGF0YSkge1xuICAgIHRoaXMubG9nZ2VyKGtpbmQsIG1zZywgZGF0YSk7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIGxvZ2dlciBoYXMgYmVlbiBzZXQgb24gdGhpcyBzb2NrZXQuXG4gICAqL1xuICBoYXNMb2dnZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9nZ2VyICE9PSBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIG9wZW4gZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbk9wZW4oZnVuY3Rpb24oKXsgY29uc29sZS5pbmZvKFwidGhlIHNvY2tldCB3YXMgb3BlbmVkXCIpIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbk9wZW4oY2FsbGJhY2spIHtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5vcGVuLnB1c2goW3JlZiwgY2FsbGJhY2tdKTtcbiAgICByZXR1cm4gcmVmO1xuICB9XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGNsb3NlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjaykge1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLnB1c2goW3JlZiwgY2FsbGJhY2tdKTtcbiAgICByZXR1cm4gcmVmO1xuICB9XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGVycm9yIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25FcnJvcihmdW5jdGlvbihlcnJvcil7IGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spIHtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5wdXNoKFtyZWYsIGNhbGxiYWNrXSk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBtZXNzYWdlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25NZXNzYWdlKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5wdXNoKFtyZWYsIGNhbGxiYWNrXSk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuICAvKipcbiAgICogUGluZ3MgdGhlIHNlcnZlciBhbmQgaW52b2tlcyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgUlRUIGluIG1pbGxpc2Vjb25kc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHBpbmcgd2FzIHB1c2hlZCBvciBmYWxzZSBpZiB1bmFibGUgdG8gYmUgcHVzaGVkLlxuICAgKi9cbiAgcGluZyhjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKTtcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnB1c2goeyB0b3BpYzogXCJwaG9lbml4XCIsIGV2ZW50OiBcImhlYXJ0YmVhdFwiLCBwYXlsb2FkOiB7fSwgcmVmIH0pO1xuICAgIGxldCBvbk1zZ1JlZiA9IHRoaXMub25NZXNzYWdlKChtc2cpID0+IHtcbiAgICAgIGlmIChtc2cucmVmID09PSByZWYpIHtcbiAgICAgICAgdGhpcy5vZmYoW29uTXNnUmVmXSk7XG4gICAgICAgIGNhbGxiYWNrKERhdGUubm93KCkgLSBzdGFydFRpbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2xlYXJIZWFydGJlYXRzKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpO1xuICB9XG4gIG9uQ29ubk9wZW4oKSB7XG4gICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApO1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlO1xuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucysrO1xuICAgIHRoaXMuZmx1c2hTZW5kQnVmZmVyKCk7XG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpO1xuICAgIHRoaXMucmVzZXRIZWFydGJlYXQoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4uZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjaygpKTtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhlYXJ0YmVhdFRpbWVvdXQoKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZikge1xuICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLmhhc0xvZ2dlcigpKSB7XG4gICAgICAgIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiaGVhcnRiZWF0IHRpbWVvdXQuIEF0dGVtcHRpbmcgdG8gcmUtZXN0YWJsaXNoIGNvbm5lY3Rpb25cIik7XG4gICAgICB9XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKTtcbiAgICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlO1xuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpLCBXU19DTE9TRV9OT1JNQUwsIFwiaGVhcnRiZWF0IHRpbWVvdXRcIik7XG4gICAgfVxuICB9XG4gIHJlc2V0SGVhcnRiZWF0KCkge1xuICAgIGlmICh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnNraXBIZWFydGJlYXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbDtcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpO1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpO1xuICB9XG4gIHRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pIHtcbiAgICBpZiAoIXRoaXMuY29ubikge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29ubikge1xuICAgICAgICBpZiAoY29kZSkge1xuICAgICAgICAgIHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24gfHwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25uLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbm4pIHtcbiAgICAgICAgICB0aGlzLmNvbm4ub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLmNvbm4ub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5jb25uLm9uY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuY29ubiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHdhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyA9IDEpIHtcbiAgICBpZiAodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCAhdGhpcy5jb25uLmJ1ZmZlcmVkQW1vdW50KSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzICsgMSk7XG4gICAgfSwgMTUwICogdHJpZXMpO1xuICB9XG4gIHdhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzID0gMSkge1xuICAgIGlmICh0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8IHRoaXMuY29ubi5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNsb3NlZCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzICsgMSk7XG4gICAgfSwgMTUwICogdHJpZXMpO1xuICB9XG4gIG9uQ29ubkNsb3NlKGV2ZW50KSB7XG4gICAgbGV0IGNsb3NlQ29kZSA9IGV2ZW50ICYmIGV2ZW50LmNvZGU7XG4gICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImNsb3NlXCIsIGV2ZW50KTtcbiAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKTtcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpO1xuICAgIGlmICghdGhpcy5jbG9zZVdhc0NsZWFuICYmIGNsb3NlQ29kZSAhPT0gMWUzKSB7XG4gICAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soZXZlbnQpKTtcbiAgfVxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubkVycm9yKGVycm9yKSB7XG4gICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBlcnJvcik7XG4gICAgbGV0IHRyYW5zcG9ydEJlZm9yZSA9IHRoaXMudHJhbnNwb3J0O1xuICAgIGxldCBlc3RhYmxpc2hlZEJlZm9yZSA9IHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucztcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4ge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIHRyYW5zcG9ydEJlZm9yZSwgZXN0YWJsaXNoZWRCZWZvcmUpO1xuICAgIH0pO1xuICAgIGlmICh0cmFuc3BvcnRCZWZvcmUgPT09IHRoaXMudHJhbnNwb3J0IHx8IGVzdGFibGlzaGVkQmVmb3JlID4gMCkge1xuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlckNoYW5FcnJvcigpIHtcbiAgICB0aGlzLmNoYW5uZWxzLmZvckVhY2goKGNoYW5uZWwpID0+IHtcbiAgICAgIGlmICghKGNoYW5uZWwuaXNFcnJvcmVkKCkgfHwgY2hhbm5lbC5pc0xlYXZpbmcoKSB8fCBjaGFubmVsLmlzQ2xvc2VkKCkpKSB7XG4gICAgICAgIGNoYW5uZWwudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5lcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBjb25uZWN0aW9uU3RhdGUoKSB7XG4gICAgc3dpdGNoICh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnJlYWR5U3RhdGUpIHtcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nOlxuICAgICAgICByZXR1cm4gXCJjb25uZWN0aW5nXCI7XG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMub3BlbjpcbiAgICAgICAgcmV0dXJuIFwib3BlblwiO1xuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNsb3Npbmc6XG4gICAgICAgIHJldHVybiBcImNsb3NpbmdcIjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBcImNsb3NlZFwiO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uU3RhdGUoKSA9PT0gXCJvcGVuXCI7XG4gIH1cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbm5lbH1cbiAgICovXG4gIHJlbW92ZShjaGFubmVsKSB7XG4gICAgdGhpcy5vZmYoY2hhbm5lbC5zdGF0ZUNoYW5nZVJlZnMpO1xuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzLmZpbHRlcigoYykgPT4gYy5qb2luUmVmKCkgIT09IGNoYW5uZWwuam9pblJlZigpKTtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlcyBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYCByZWdpc3RyYXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge3JlZnN9IC0gbGlzdCBvZiByZWZzIHJldHVybmVkIGJ5IGNhbGxzIHRvXG4gICAqICAgICAgICAgICAgICAgICBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYFxuICAgKi9cbiAgb2ZmKHJlZnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcykge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldID0gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldLmZpbHRlcigoW3JlZl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHJlZnMuaW5kZXhPZihyZWYpID09PSAtMTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogSW5pdGlhdGVzIGEgbmV3IGNoYW5uZWwgZm9yIHRoZSBnaXZlbiB0b3BpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAgICogQHBhcmFtIHtPYmplY3R9IGNoYW5QYXJhbXMgLSBQYXJhbWV0ZXJzIGZvciB0aGUgY2hhbm5lbFxuICAgKiBAcmV0dXJucyB7Q2hhbm5lbH1cbiAgICovXG4gIGNoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMgPSB7fSkge1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpO1xuICAgIHRoaXMuY2hhbm5lbHMucHVzaChjaGFuKTtcbiAgICByZXR1cm4gY2hhbjtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIHB1c2goZGF0YSkge1xuICAgIGlmICh0aGlzLmhhc0xvZ2dlcigpKSB7XG4gICAgICBsZXQgeyB0b3BpYywgZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWYgfSA9IGRhdGE7XG4gICAgICB0aGlzLmxvZyhcInB1c2hcIiwgYCR7dG9waWN9ICR7ZXZlbnR9ICgke2pvaW5fcmVmfSwgJHtyZWZ9KWAsIHBheWxvYWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmVuY29kZShkYXRhLCAocmVzdWx0KSA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLnB1c2goKCkgPT4gdGhpcy5lbmNvZGUoZGF0YSwgKHJlc3VsdCkgPT4gdGhpcy5jb25uLnNlbmQocmVzdWx0KSkpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKSB7XG4gICAgbGV0IG5ld1JlZiA9IHRoaXMucmVmICsgMTtcbiAgICBpZiAobmV3UmVmID09PSB0aGlzLnJlZikge1xuICAgICAgdGhpcy5yZWYgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZiA9IG5ld1JlZjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVmLnRvU3RyaW5nKCk7XG4gIH1cbiAgc2VuZEhlYXJ0YmVhdCgpIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmICYmICF0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gdGhpcy5tYWtlUmVmKCk7XG4gICAgdGhpcy5wdXNoKHsgdG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmIH0pO1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmhlYXJ0YmVhdFRpbWVvdXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKTtcbiAgfVxuICBmbHVzaFNlbmRCdWZmZXIoKSB7XG4gICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjaygpKTtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdO1xuICAgIH1cbiAgfVxuICBvbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2UpIHtcbiAgICB0aGlzLmRlY29kZShyYXdNZXNzYWdlLmRhdGEsIChtc2cpID0+IHtcbiAgICAgIGxldCB7IHRvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZiB9ID0gbXNnO1xuICAgICAgaWYgKHJlZiAmJiByZWYgPT09IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZikge1xuICAgICAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpO1xuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsO1xuICAgICAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmhhc0xvZ2dlcigpKVxuICAgICAgICB0aGlzLmxvZyhcInJlY2VpdmVcIiwgYCR7cGF5bG9hZC5zdGF0dXMgfHwgXCJcIn0gJHt0b3BpY30gJHtldmVudH0gJHtyZWYgJiYgXCIoXCIgKyByZWYgKyBcIilcIiB8fCBcIlwifWAsIHBheWxvYWQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoYW5uZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2ldO1xuICAgICAgICBpZiAoIWNoYW5uZWwuaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luX3JlZikpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLnRyaWdnZXIoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWYpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IFssIGNhbGxiYWNrXSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZVtpXTtcbiAgICAgICAgY2FsbGJhY2sobXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBsZWF2ZU9wZW5Ub3BpYyh0b3BpYykge1xuICAgIGxldCBkdXBDaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKChjKSA9PiBjLnRvcGljID09PSB0b3BpYyAmJiAoYy5pc0pvaW5lZCgpIHx8IGMuaXNKb2luaW5nKCkpKTtcbiAgICBpZiAoZHVwQ2hhbm5lbCkge1xuICAgICAgaWYgKHRoaXMuaGFzTG9nZ2VyKCkpXG4gICAgICAgIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBsZWF2aW5nIGR1cGxpY2F0ZSB0b3BpYyBcIiR7dG9waWN9XCJgKTtcbiAgICAgIGR1cENoYW5uZWwubGVhdmUoKTtcbiAgICB9XG4gIH1cbn07XG5leHBvcnQge1xuICBDaGFubmVsLFxuICBMb25nUG9sbCxcbiAgUHJlc2VuY2UsXG4gIHNlcmlhbGl6ZXJfZGVmYXVsdCBhcyBTZXJpYWxpemVyLFxuICBTb2NrZXRcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waG9lbml4Lm1qcy5tYXBcbiIsCiAgIi8vIGpzL3Bob2VuaXhfbGl2ZV92aWV3L2NvbnN0YW50cy5qc1xudmFyIENPTlNFQ1VUSVZFX1JFTE9BRFMgPSBcImNvbnNlY3V0aXZlLXJlbG9hZHNcIjtcbnZhciBNQVhfUkVMT0FEUyA9IDEwO1xudmFyIFJFTE9BRF9KSVRURVJfTUlOID0gNWUzO1xudmFyIFJFTE9BRF9KSVRURVJfTUFYID0gMWU0O1xudmFyIEZBSUxTQUZFX0pJVFRFUiA9IDNlNDtcbnZhciBQSFhfRVZFTlRfQ0xBU1NFUyA9IFtcbiAgXCJwaHgtY2xpY2stbG9hZGluZ1wiLFxuICBcInBoeC1jaGFuZ2UtbG9hZGluZ1wiLFxuICBcInBoeC1zdWJtaXQtbG9hZGluZ1wiLFxuICBcInBoeC1rZXlkb3duLWxvYWRpbmdcIixcbiAgXCJwaHgta2V5dXAtbG9hZGluZ1wiLFxuICBcInBoeC1ibHVyLWxvYWRpbmdcIixcbiAgXCJwaHgtZm9jdXMtbG9hZGluZ1wiXG5dO1xudmFyIFBIWF9DT01QT05FTlQgPSBcImRhdGEtcGh4LWNvbXBvbmVudFwiO1xudmFyIFBIWF9MSVZFX0xJTksgPSBcImRhdGEtcGh4LWxpbmtcIjtcbnZhciBQSFhfVFJBQ0tfU1RBVElDID0gXCJ0cmFjay1zdGF0aWNcIjtcbnZhciBQSFhfTElOS19TVEFURSA9IFwiZGF0YS1waHgtbGluay1zdGF0ZVwiO1xudmFyIFBIWF9SRUYgPSBcImRhdGEtcGh4LXJlZlwiO1xudmFyIFBIWF9SRUZfU1JDID0gXCJkYXRhLXBoeC1yZWYtc3JjXCI7XG52YXIgUEhYX1RSQUNLX1VQTE9BRFMgPSBcInRyYWNrLXVwbG9hZHNcIjtcbnZhciBQSFhfVVBMT0FEX1JFRiA9IFwiZGF0YS1waHgtdXBsb2FkLXJlZlwiO1xudmFyIFBIWF9QUkVGTElHSFRFRF9SRUZTID0gXCJkYXRhLXBoeC1wcmVmbGlnaHRlZC1yZWZzXCI7XG52YXIgUEhYX0RPTkVfUkVGUyA9IFwiZGF0YS1waHgtZG9uZS1yZWZzXCI7XG52YXIgUEhYX0RST1BfVEFSR0VUID0gXCJkcm9wLXRhcmdldFwiO1xudmFyIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyA9IFwiZGF0YS1waHgtYWN0aXZlLXJlZnNcIjtcbnZhciBQSFhfTElWRV9GSUxFX1VQREFURUQgPSBcInBoeDpsaXZlLWZpbGU6dXBkYXRlZFwiO1xudmFyIFBIWF9TS0lQID0gXCJkYXRhLXBoeC1za2lwXCI7XG52YXIgUEhYX1BSVU5FID0gXCJkYXRhLXBoeC1wcnVuZVwiO1xudmFyIFBIWF9QQUdFX0xPQURJTkcgPSBcInBhZ2UtbG9hZGluZ1wiO1xudmFyIFBIWF9DT05ORUNURURfQ0xBU1MgPSBcInBoeC1jb25uZWN0ZWRcIjtcbnZhciBQSFhfTE9BRElOR19DTEFTUyA9IFwicGh4LWxvYWRpbmdcIjtcbnZhciBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MgPSBcInBoeC1uby1mZWVkYmFja1wiO1xudmFyIFBIWF9FUlJPUl9DTEFTUyA9IFwicGh4LWVycm9yXCI7XG52YXIgUEhYX0NMSUVOVF9FUlJPUl9DTEFTUyA9IFwicGh4LWNsaWVudC1lcnJvclwiO1xudmFyIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1MgPSBcInBoeC1zZXJ2ZXItZXJyb3JcIjtcbnZhciBQSFhfUEFSRU5UX0lEID0gXCJkYXRhLXBoeC1wYXJlbnQtaWRcIjtcbnZhciBQSFhfTUFJTiA9IFwiZGF0YS1waHgtbWFpblwiO1xudmFyIFBIWF9ST09UX0lEID0gXCJkYXRhLXBoeC1yb290LWlkXCI7XG52YXIgUEhYX1ZJRVdQT1JUX1RPUCA9IFwidmlld3BvcnQtdG9wXCI7XG52YXIgUEhYX1ZJRVdQT1JUX0JPVFRPTSA9IFwidmlld3BvcnQtYm90dG9tXCI7XG52YXIgUEhYX1RSSUdHRVJfQUNUSU9OID0gXCJ0cmlnZ2VyLWFjdGlvblwiO1xudmFyIFBIWF9GRUVEQkFDS19GT1IgPSBcImZlZWRiYWNrLWZvclwiO1xudmFyIFBIWF9IQVNfRk9DVVNFRCA9IFwicGh4LWhhcy1mb2N1c2VkXCI7XG52YXIgRk9DVVNBQkxFX0lOUFVUUyA9IFtcInRleHRcIiwgXCJ0ZXh0YXJlYVwiLCBcIm51bWJlclwiLCBcImVtYWlsXCIsIFwicGFzc3dvcmRcIiwgXCJzZWFyY2hcIiwgXCJ0ZWxcIiwgXCJ1cmxcIiwgXCJkYXRlXCIsIFwidGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwiY29sb3JcIiwgXCJyYW5nZVwiXTtcbnZhciBDSEVDS0FCTEVfSU5QVVRTID0gW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXTtcbnZhciBQSFhfSEFTX1NVQk1JVFRFRCA9IFwicGh4LWhhcy1zdWJtaXR0ZWRcIjtcbnZhciBQSFhfU0VTU0lPTiA9IFwiZGF0YS1waHgtc2Vzc2lvblwiO1xudmFyIFBIWF9WSUVXX1NFTEVDVE9SID0gYFske1BIWF9TRVNTSU9OfV1gO1xudmFyIFBIWF9TVElDS1kgPSBcImRhdGEtcGh4LXN0aWNreVwiO1xudmFyIFBIWF9TVEFUSUMgPSBcImRhdGEtcGh4LXN0YXRpY1wiO1xudmFyIFBIWF9SRUFET05MWSA9IFwiZGF0YS1waHgtcmVhZG9ubHlcIjtcbnZhciBQSFhfRElTQUJMRUQgPSBcImRhdGEtcGh4LWRpc2FibGVkXCI7XG52YXIgUEhYX0RJU0FCTEVfV0lUSCA9IFwiZGlzYWJsZS13aXRoXCI7XG52YXIgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFID0gXCJkYXRhLXBoeC1kaXNhYmxlLXdpdGgtcmVzdG9yZVwiO1xudmFyIFBIWF9IT09LID0gXCJob29rXCI7XG52YXIgUEhYX0RFQk9VTkNFID0gXCJkZWJvdW5jZVwiO1xudmFyIFBIWF9USFJPVFRMRSA9IFwidGhyb3R0bGVcIjtcbnZhciBQSFhfVVBEQVRFID0gXCJ1cGRhdGVcIjtcbnZhciBQSFhfU1RSRUFNID0gXCJzdHJlYW1cIjtcbnZhciBQSFhfU1RSRUFNX1JFRiA9IFwiZGF0YS1waHgtc3RyZWFtXCI7XG52YXIgUEhYX0tFWSA9IFwia2V5XCI7XG52YXIgUEhYX1BSSVZBVEUgPSBcInBoeFByaXZhdGVcIjtcbnZhciBQSFhfQVVUT19SRUNPVkVSID0gXCJhdXRvLXJlY292ZXJcIjtcbnZhciBQSFhfTFZfREVCVUcgPSBcInBoeDpsaXZlLXNvY2tldDpkZWJ1Z1wiO1xudmFyIFBIWF9MVl9QUk9GSUxFID0gXCJwaHg6bGl2ZS1zb2NrZXQ6cHJvZmlsaW5nXCI7XG52YXIgUEhYX0xWX0xBVEVOQ1lfU0lNID0gXCJwaHg6bGl2ZS1zb2NrZXQ6bGF0ZW5jeS1zaW1cIjtcbnZhciBQSFhfUFJPR1JFU1MgPSBcInByb2dyZXNzXCI7XG52YXIgUEhYX01PVU5URUQgPSBcIm1vdW50ZWRcIjtcbnZhciBMT0FERVJfVElNRU9VVCA9IDE7XG52YXIgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCA9IDIwMDtcbnZhciBCSU5ESU5HX1BSRUZJWCA9IFwicGh4LVwiO1xudmFyIFBVU0hfVElNRU9VVCA9IDNlNDtcbnZhciBERUJPVU5DRV9UUklHR0VSID0gXCJkZWJvdW5jZS10cmlnZ2VyXCI7XG52YXIgVEhST1RUTEVEID0gXCJ0aHJvdHRsZWRcIjtcbnZhciBERUJPVU5DRV9QUkVWX0tFWSA9IFwiZGVib3VuY2UtcHJldi1rZXlcIjtcbnZhciBERUZBVUxUUyA9IHtcbiAgZGVib3VuY2U6IDMwMCxcbiAgdGhyb3R0bGU6IDMwMFxufTtcbnZhciBEWU5BTUlDUyA9IFwiZFwiO1xudmFyIFNUQVRJQyA9IFwic1wiO1xudmFyIENPTVBPTkVOVFMgPSBcImNcIjtcbnZhciBFVkVOVFMgPSBcImVcIjtcbnZhciBSRVBMWSA9IFwiclwiO1xudmFyIFRJVExFID0gXCJ0XCI7XG52YXIgVEVNUExBVEVTID0gXCJwXCI7XG52YXIgU1RSRUFNID0gXCJzdHJlYW1cIjtcblxuLy8ganMvcGhvZW5peF9saXZlX3ZpZXcvZW50cnlfdXBsb2FkZXIuanNcbnZhciBFbnRyeVVwbG9hZGVyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihlbnRyeSwgY2h1bmtTaXplLCBsaXZlU29ja2V0KSB7XG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldDtcbiAgICB0aGlzLmVudHJ5ID0gZW50cnk7XG4gICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgIHRoaXMuY2h1bmtTaXplID0gY2h1bmtTaXplO1xuICAgIHRoaXMuY2h1bmtUaW1lciA9IG51bGw7XG4gICAgdGhpcy5lcnJvcmVkID0gZmFsc2U7XG4gICAgdGhpcy51cGxvYWRDaGFubmVsID0gbGl2ZVNvY2tldC5jaGFubmVsKGBsdnU6JHtlbnRyeS5yZWZ9YCwgeyB0b2tlbjogZW50cnkubWV0YWRhdGEoKSB9KTtcbiAgfVxuICBlcnJvcihyZWFzb24pIHtcbiAgICBpZiAodGhpcy5lcnJvcmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZXJyb3JlZCA9IHRydWU7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2h1bmtUaW1lcik7XG4gICAgdGhpcy5lbnRyeS5lcnJvcihyZWFzb24pO1xuICB9XG4gIHVwbG9hZCgpIHtcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwub25FcnJvcigocmVhc29uKSA9PiB0aGlzLmVycm9yKHJlYXNvbikpO1xuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5qb2luKCkucmVjZWl2ZShcIm9rXCIsIChfZGF0YSkgPT4gdGhpcy5yZWFkTmV4dENodW5rKCkpLnJlY2VpdmUoXCJlcnJvclwiLCAocmVhc29uKSA9PiB0aGlzLmVycm9yKHJlYXNvbikpO1xuICB9XG4gIGlzRG9uZSgpIHtcbiAgICByZXR1cm4gdGhpcy5vZmZzZXQgPj0gdGhpcy5lbnRyeS5maWxlLnNpemU7XG4gIH1cbiAgcmVhZE5leHRDaHVuaygpIHtcbiAgICBsZXQgcmVhZGVyID0gbmV3IHdpbmRvdy5GaWxlUmVhZGVyKCk7XG4gICAgbGV0IGJsb2IgPSB0aGlzLmVudHJ5LmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIHRoaXMuY2h1bmtTaXplICsgdGhpcy5vZmZzZXQpO1xuICAgIHJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUudGFyZ2V0LmVycm9yID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IGUudGFyZ2V0LnJlc3VsdC5ieXRlTGVuZ3RoO1xuICAgICAgICB0aGlzLnB1c2hDaHVuayhlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxvZ0Vycm9yKFwiUmVhZCBlcnJvcjogXCIgKyBlLnRhcmdldC5lcnJvcik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XG4gIH1cbiAgcHVzaENodW5rKGNodW5rKSB7XG4gICAgaWYgKCF0aGlzLnVwbG9hZENoYW5uZWwuaXNKb2luZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnVwbG9hZENoYW5uZWwucHVzaChcImNodW5rXCIsIGNodW5rKS5yZWNlaXZlKFwib2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5lbnRyeS5wcm9ncmVzcyh0aGlzLm9mZnNldCAvIHRoaXMuZW50cnkuZmlsZS5zaXplICogMTAwKTtcbiAgICAgIGlmICghdGhpcy5pc0RvbmUoKSkge1xuICAgICAgICB0aGlzLmNodW5rVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVhZE5leHRDaHVuaygpLCB0aGlzLmxpdmVTb2NrZXQuZ2V0TGF0ZW5jeVNpbSgpIHx8IDApO1xuICAgICAgfVxuICAgIH0pLnJlY2VpdmUoXCJlcnJvclwiLCAoeyByZWFzb24gfSkgPT4gdGhpcy5lcnJvcihyZWFzb24pKTtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peF9saXZlX3ZpZXcvdXRpbHMuanNcbnZhciBsb2dFcnJvciA9IChtc2csIG9iaikgPT4gY29uc29sZS5lcnJvciAmJiBjb25zb2xlLmVycm9yKG1zZywgb2JqKTtcbnZhciBpc0NpZCA9IChjaWQpID0+IHtcbiAgbGV0IHR5cGUgPSB0eXBlb2YgY2lkO1xuICByZXR1cm4gdHlwZSA9PT0gXCJudW1iZXJcIiB8fCB0eXBlID09PSBcInN0cmluZ1wiICYmIC9eKDB8WzEtOV1cXGQqKSQvLnRlc3QoY2lkKTtcbn07XG5mdW5jdGlvbiBkZXRlY3REdXBsaWNhdGVJZHMoKSB7XG4gIGxldCBpZHMgPSBuZXcgU2V0KCk7XG4gIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2lkXVwiKTtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGlkcy5oYXMoZWxlbXNbaV0uaWQpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBNdWx0aXBsZSBJRHMgZGV0ZWN0ZWQ6ICR7ZWxlbXNbaV0uaWR9LiBFbnN1cmUgdW5pcXVlIGVsZW1lbnQgaWRzLmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZHMuYWRkKGVsZW1zW2ldLmlkKTtcbiAgICB9XG4gIH1cbn1cbnZhciBkZWJ1ZyA9ICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4ge1xuICBpZiAodmlldy5saXZlU29ja2V0LmlzRGVidWdFbmFibGVkKCkpIHtcbiAgICBjb25zb2xlLmxvZyhgJHt2aWV3LmlkfSAke2tpbmR9OiAke21zZ30gLSBgLCBvYmopO1xuICB9XG59O1xudmFyIGNsb3N1cmUgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIgPyB2YWwgOiBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHZhbDtcbn07XG52YXIgY2xvbmUgPSAob2JqKSA9PiB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcbnZhciBjbG9zZXN0UGh4QmluZGluZyA9IChlbCwgYmluZGluZywgYm9yZGVyRWwpID0+IHtcbiAgZG8ge1xuICAgIGlmIChlbC5tYXRjaGVzKGBbJHtiaW5kaW5nfV1gKSAmJiAhZWwuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGU7XG4gIH0gd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxICYmICEoYm9yZGVyRWwgJiYgYm9yZGVyRWwuaXNTYW1lTm9kZShlbCkgfHwgZWwubWF0Y2hlcyhQSFhfVklFV19TRUxFQ1RPUikpKTtcbiAgcmV0dXJuIG51bGw7XG59O1xudmFyIGlzT2JqZWN0ID0gKG9iaikgPT4ge1xuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgIShvYmogaW5zdGFuY2VvZiBBcnJheSk7XG59O1xudmFyIGlzRXF1YWxPYmogPSAob2JqMSwgb2JqMikgPT4gSlNPTi5zdHJpbmdpZnkob2JqMSkgPT09IEpTT04uc3RyaW5naWZ5KG9iajIpO1xudmFyIGlzRW1wdHkgPSAob2JqKSA9PiB7XG4gIGZvciAobGV0IHggaW4gb2JqKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBtYXliZSA9IChlbCwgY2FsbGJhY2spID0+IGVsICYmIGNhbGxiYWNrKGVsKTtcbnZhciBjaGFubmVsVXBsb2FkZXIgPSBmdW5jdGlvbihlbnRyaWVzLCBvbkVycm9yLCByZXNwLCBsaXZlU29ja2V0KSB7XG4gIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICBsZXQgZW50cnlVcGxvYWRlciA9IG5ldyBFbnRyeVVwbG9hZGVyKGVudHJ5LCByZXNwLmNvbmZpZy5jaHVua19zaXplLCBsaXZlU29ja2V0KTtcbiAgICBlbnRyeVVwbG9hZGVyLnVwbG9hZCgpO1xuICB9KTtcbn07XG5cbi8vIGpzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanNcbnZhciBCcm93c2VyID0ge1xuICBjYW5QdXNoU3RhdGUoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBoaXN0b3J5LnB1c2hTdGF0ZSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgfSxcbiAgZHJvcExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpO1xuICB9LFxuICB1cGRhdGVMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5LCBpbml0aWFsLCBmdW5jKSB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLmdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpO1xuICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KTtcbiAgICBsZXQgbmV3VmFsID0gY3VycmVudCA9PT0gbnVsbCA/IGluaXRpYWwgOiBmdW5jKGN1cnJlbnQpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkobmV3VmFsKSk7XG4gICAgcmV0dXJuIG5ld1ZhbDtcbiAgfSxcbiAgZ2V0TG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKSk7XG4gIH0sXG4gIHVwZGF0ZUN1cnJlbnRTdGF0ZShjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5jYW5QdXNoU3RhdGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjYWxsYmFjayhoaXN0b3J5LnN0YXRlIHx8IHt9KSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICB9LFxuICBwdXNoU3RhdGUoa2luZCwgbWV0YSwgdG8pIHtcbiAgICBpZiAodGhpcy5jYW5QdXNoU3RhdGUoKSkge1xuICAgICAgaWYgKHRvICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZikge1xuICAgICAgICBpZiAobWV0YS50eXBlID09IFwicmVkaXJlY3RcIiAmJiBtZXRhLnNjcm9sbCkge1xuICAgICAgICAgIGxldCBjdXJyZW50U3RhdGUgPSBoaXN0b3J5LnN0YXRlIHx8IHt9O1xuICAgICAgICAgIGN1cnJlbnRTdGF0ZS5zY3JvbGwgPSBtZXRhLnNjcm9sbDtcbiAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjdXJyZW50U3RhdGUsIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgbWV0YS5zY3JvbGw7XG4gICAgICAgIGhpc3Rvcnlba2luZCArIFwiU3RhdGVcIl0obWV0YSwgXCJcIiwgdG8gfHwgbnVsbCk7XG4gICAgICAgIGxldCBoYXNoRWwgPSB0aGlzLmdldEhhc2hUYXJnZXRFbCh3aW5kb3cubG9jYXRpb24uaGFzaCk7XG4gICAgICAgIGlmIChoYXNoRWwpIHtcbiAgICAgICAgICBoYXNoRWwuc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgfSBlbHNlIGlmIChtZXRhLnR5cGUgPT09IFwicmVkaXJlY3RcIikge1xuICAgICAgICAgIHdpbmRvdy5zY3JvbGwoMCwgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWRpcmVjdCh0byk7XG4gICAgfVxuICB9LFxuICBzZXRDb29raWUobmFtZSwgdmFsdWUpIHtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbHVlfWA7XG4gIH0sXG4gIGdldENvb2tpZShuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCg/Oig/Ol58Lio7cyopJHtuYW1lfXMqPXMqKFteO10qKS4qJCl8Xi4qJGApLCBcIiQxXCIpO1xuICB9LFxuICByZWRpcmVjdCh0b1VSTCwgZmxhc2gpIHtcbiAgICBpZiAoZmxhc2gpIHtcbiAgICAgIEJyb3dzZXIuc2V0Q29va2llKFwiX19waG9lbml4X2ZsYXNoX19cIiwgZmxhc2ggKyBcIjsgbWF4LWFnZT02MDAwMDsgcGF0aD0vXCIpO1xuICAgIH1cbiAgICB3aW5kb3cubG9jYXRpb24gPSB0b1VSTDtcbiAgfSxcbiAgbG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpIHtcbiAgICByZXR1cm4gYCR7bmFtZXNwYWNlfS0ke3N1YmtleX1gO1xuICB9LFxuICBnZXRIYXNoVGFyZ2V0RWwobWF5YmVIYXNoKSB7XG4gICAgbGV0IGhhc2ggPSBtYXliZUhhc2gudG9TdHJpbmcoKS5zdWJzdHJpbmcoMSk7XG4gICAgaWYgKGhhc2ggPT09IFwiXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2gpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbbmFtZT1cIiR7aGFzaH1cIl1gKTtcbiAgfVxufTtcbnZhciBicm93c2VyX2RlZmF1bHQgPSBCcm93c2VyO1xuXG4vLyBqcy9waG9lbml4X2xpdmVfdmlldy9kb20uanNcbnZhciBET00gPSB7XG4gIGJ5SWQoaWQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIHx8IGxvZ0Vycm9yKGBubyBpZCBmb3VuZCBmb3IgJHtpZH1gKTtcbiAgfSxcbiAgcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICBpZiAoZWwuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgfVxuICB9LFxuICBhbGwobm9kZSwgcXVlcnksIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGxldCBhcnJheSA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrID8gYXJyYXkuZm9yRWFjaChjYWxsYmFjaykgOiBhcnJheTtcbiAgfSxcbiAgY2hpbGROb2RlTGVuZ3RoKGh0bWwpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZEVsZW1lbnRDb3VudDtcbiAgfSxcbiAgaXNVcGxvYWRJbnB1dChlbCkge1xuICAgIHJldHVybiBlbC50eXBlID09PSBcImZpbGVcIiAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICE9PSBudWxsO1xuICB9LFxuICBpc0F1dG9VcGxvYWQoaW5wdXRFbCkge1xuICAgIHJldHVybiBpbnB1dEVsLmhhc0F0dHJpYnV0ZShcImRhdGEtcGh4LWF1dG8tdXBsb2FkXCIpO1xuICB9LFxuICBmaW5kVXBsb2FkSW5wdXRzKG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwobm9kZSwgYGlucHV0W3R5cGU9XCJmaWxlXCJdWyR7UEhYX1VQTE9BRF9SRUZ9XWApO1xuICB9LFxuICBmaW5kQ29tcG9uZW50Tm9kZUxpc3Qobm9kZSwgY2lkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KHRoaXMuYWxsKG5vZGUsIGBbJHtQSFhfQ09NUE9ORU5UfT1cIiR7Y2lkfVwiXWApLCBub2RlKTtcbiAgfSxcbiAgaXNQaHhEZXN0cm95ZWQobm9kZSkge1xuICAgIHJldHVybiBub2RlLmlkICYmIERPTS5wcml2YXRlKG5vZGUsIFwiZGVzdHJveWVkXCIpID8gdHJ1ZSA6IGZhbHNlO1xuICB9LFxuICB3YW50c05ld1RhYihlKSB7XG4gICAgbGV0IHdhbnRzTmV3VGFiID0gZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkgfHwgZS5tZXRhS2V5IHx8IGUuYnV0dG9uICYmIGUuYnV0dG9uID09PSAxO1xuICAgIGxldCBpc0Rvd25sb2FkID0gZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJkb3dubG9hZFwiKTtcbiAgICBsZXQgaXNUYXJnZXRCbGFuayA9IGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcInRhcmdldFwiKSAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJfYmxhbmtcIjtcbiAgICByZXR1cm4gd2FudHNOZXdUYWIgfHwgaXNUYXJnZXRCbGFuayB8fCBpc0Rvd25sb2FkO1xuICB9LFxuICBpc1VubG9hZGFibGVGb3JtU3VibWl0KGUpIHtcbiAgICBsZXQgaXNEaWFsb2dTdWJtaXQgPSBlLnRhcmdldCAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJtZXRob2RcIikgPT09IFwiZGlhbG9nXCIgfHwgZS5zdWJtaXR0ZXIgJiYgZS5zdWJtaXR0ZXIuZ2V0QXR0cmlidXRlKFwiZm9ybW1ldGhvZFwiKSA9PT0gXCJkaWFsb2dcIjtcbiAgICBpZiAoaXNEaWFsb2dTdWJtaXQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFlLmRlZmF1bHRQcmV2ZW50ZWQgJiYgIXRoaXMud2FudHNOZXdUYWIoZSk7XG4gICAgfVxuICB9LFxuICBpc05ld1BhZ2VDbGljayhlLCBjdXJyZW50TG9jYXRpb24pIHtcbiAgICBsZXQgaHJlZiA9IGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgPyBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpIDogbnVsbDtcbiAgICBsZXQgdXJsO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgaHJlZiA9PT0gbnVsbCB8fCB0aGlzLndhbnRzTmV3VGFiKGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChocmVmLnN0YXJ0c1dpdGgoXCJtYWlsdG86XCIpIHx8IGhyZWYuc3RhcnRzV2l0aChcInRlbDpcIikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGUudGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB1cmwgPSBuZXcgVVJMKGhyZWYpO1xuICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB1cmwgPSBuZXcgVVJMKGhyZWYsIGN1cnJlbnRMb2NhdGlvbik7XG4gICAgICB9IGNhdGNoIChlMykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHVybC5ob3N0ID09PSBjdXJyZW50TG9jYXRpb24uaG9zdCAmJiB1cmwucHJvdG9jb2wgPT09IGN1cnJlbnRMb2NhdGlvbi5wcm90b2NvbCkge1xuICAgICAgaWYgKHVybC5wYXRobmFtZSA9PT0gY3VycmVudExvY2F0aW9uLnBhdGhuYW1lICYmIHVybC5zZWFyY2ggPT09IGN1cnJlbnRMb2NhdGlvbi5zZWFyY2gpIHtcbiAgICAgICAgcmV0dXJuIHVybC5oYXNoID09PSBcIlwiICYmICF1cmwuaHJlZi5lbmRzV2l0aChcIiNcIik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1cmwucHJvdG9jb2wuc3RhcnRzV2l0aChcImh0dHBcIik7XG4gIH0sXG4gIG1hcmtQaHhDaGlsZERlc3Ryb3llZChlbCkge1xuICAgIGlmICh0aGlzLmlzUGh4Q2hpbGQoZWwpKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04sIFwiXCIpO1xuICAgIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFwiZGVzdHJveWVkXCIsIHRydWUpO1xuICB9LFxuICBmaW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHBhcmVudElkKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmV0dXJuIHRoaXMuZmluZFBoeENoaWxkcmVuKHRlbXBsYXRlLmNvbnRlbnQsIHBhcmVudElkKTtcbiAgfSxcbiAgaXNJZ25vcmVkKGVsLCBwaHhVcGRhdGUpIHtcbiAgICByZXR1cm4gKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpIHx8IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LXVwZGF0ZVwiKSkgPT09IFwiaWdub3JlXCI7XG4gIH0sXG4gIGlzUGh4VXBkYXRlKGVsLCBwaHhVcGRhdGUsIHVwZGF0ZVR5cGVzKSB7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiB1cGRhdGVUeXBlcy5pbmRleE9mKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpKSA+PSAwO1xuICB9LFxuICBmaW5kUGh4U3RpY2t5KGVsKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsKGVsLCBgWyR7UEhYX1NUSUNLWX1dYCk7XG4gIH0sXG4gIGZpbmRQaHhDaGlsZHJlbihlbCwgcGFyZW50SWQpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwoZWwsIGAke1BIWF9WSUVXX1NFTEVDVE9SfVske1BIWF9QQVJFTlRfSUR9PVwiJHtwYXJlbnRJZH1cIl1gKTtcbiAgfSxcbiAgZmluZFBhcmVudENJRHMobm9kZSwgY2lkcykge1xuICAgIGxldCBpbml0aWFsID0gbmV3IFNldChjaWRzKTtcbiAgICBsZXQgcGFyZW50Q2lkcyA9IGNpZHMucmVkdWNlKChhY2MsIGNpZCkgPT4ge1xuICAgICAgbGV0IHNlbGVjdG9yID0gYFske1BIWF9DT01QT05FTlR9PVwiJHtjaWR9XCJdIFske1BIWF9DT01QT05FTlR9XWA7XG4gICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBzZWxlY3RvciksIG5vZGUpLm1hcCgoZWwpID0+IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSkpLmZvckVhY2goKGNoaWxkQ0lEKSA9PiBhY2MuZGVsZXRlKGNoaWxkQ0lEKSk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIGluaXRpYWwpO1xuICAgIHJldHVybiBwYXJlbnRDaWRzLnNpemUgPT09IDAgPyBuZXcgU2V0KGNpZHMpIDogcGFyZW50Q2lkcztcbiAgfSxcbiAgZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KG5vZGVzLCBwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50LnF1ZXJ5U2VsZWN0b3IoUEhYX1ZJRVdfU0VMRUNUT1IpKSB7XG4gICAgICByZXR1cm4gbm9kZXMuZmlsdGVyKChlbCkgPT4gdGhpcy53aXRoaW5TYW1lTGl2ZVZpZXcoZWwsIHBhcmVudCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICB9LFxuICB3aXRoaW5TYW1lTGl2ZVZpZXcobm9kZSwgcGFyZW50KSB7XG4gICAgd2hpbGUgKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgIGlmIChub2RlLmlzU2FtZU5vZGUocGFyZW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHJpdmF0ZShlbCwga2V5KSB7XG4gICAgcmV0dXJuIGVsW1BIWF9QUklWQVRFXSAmJiBlbFtQSFhfUFJJVkFURV1ba2V5XTtcbiAgfSxcbiAgZGVsZXRlUHJpdmF0ZShlbCwga2V5KSB7XG4gICAgZWxbUEhYX1BSSVZBVEVdICYmIGRlbGV0ZSBlbFtQSFhfUFJJVkFURV1ba2V5XTtcbiAgfSxcbiAgcHV0UHJpdmF0ZShlbCwga2V5LCB2YWx1ZSkge1xuICAgIGlmICghZWxbUEhYX1BSSVZBVEVdKSB7XG4gICAgICBlbFtQSFhfUFJJVkFURV0gPSB7fTtcbiAgICB9XG4gICAgZWxbUEhYX1BSSVZBVEVdW2tleV0gPSB2YWx1ZTtcbiAgfSxcbiAgdXBkYXRlUHJpdmF0ZShlbCwga2V5LCBkZWZhdWx0VmFsLCB1cGRhdGVGdW5jKSB7XG4gICAgbGV0IGV4aXN0aW5nID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpO1xuICAgIGlmIChleGlzdGluZyA9PT0gdm9pZCAwKSB7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhkZWZhdWx0VmFsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGV4aXN0aW5nKSk7XG4gICAgfVxuICB9LFxuICBjb3B5UHJpdmF0ZXModGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlW1BIWF9QUklWQVRFXSkge1xuICAgICAgdGFyZ2V0W1BIWF9QUklWQVRFXSA9IHNvdXJjZVtQSFhfUFJJVkFURV07XG4gICAgfVxuICB9LFxuICBwdXRUaXRsZShzdHIpIHtcbiAgICBsZXQgdGl0bGVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0aXRsZVwiKTtcbiAgICBpZiAodGl0bGVFbCkge1xuICAgICAgbGV0IHsgcHJlZml4LCBzdWZmaXggfSA9IHRpdGxlRWwuZGF0YXNldDtcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gYCR7cHJlZml4IHx8IFwiXCJ9JHtzdHJ9JHtzdWZmaXggfHwgXCJcIn1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC50aXRsZSA9IHN0cjtcbiAgICB9XG4gIH0sXG4gIGRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgYXN5bmNGaWx0ZXIsIGNhbGxiYWNrKSB7XG4gICAgbGV0IGRlYm91bmNlID0gZWwuZ2V0QXR0cmlidXRlKHBoeERlYm91bmNlKTtcbiAgICBsZXQgdGhyb3R0bGUgPSBlbC5nZXRBdHRyaWJ1dGUocGh4VGhyb3R0bGUpO1xuICAgIGlmIChkZWJvdW5jZSA9PT0gXCJcIikge1xuICAgICAgZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2U7XG4gICAgfVxuICAgIGlmICh0aHJvdHRsZSA9PT0gXCJcIikge1xuICAgICAgdGhyb3R0bGUgPSBkZWZhdWx0VGhyb3R0bGU7XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IGRlYm91bmNlIHx8IHRocm90dGxlO1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgbnVsbDpcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICBjYXNlIFwiYmx1clwiOlxuICAgICAgICBpZiAodGhpcy5vbmNlKGVsLCBcImRlYm91bmNlLWJsdXJcIikpIHtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiBjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZXQgdGltZW91dCA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgbGV0IHRyaWdnZXIgPSAoKSA9PiB0aHJvdHRsZSA/IHRoaXMuZGVsZXRlUHJpdmF0ZShlbCwgVEhST1RUTEVEKSA6IGNhbGxiYWNrKCk7XG4gICAgICAgIGxldCBjdXJyZW50Q3ljbGUgPSB0aGlzLmluY0N5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSLCB0cmlnZ2VyKTtcbiAgICAgICAgaWYgKGlzTmFOKHRpbWVvdXQpKSB7XG4gICAgICAgICAgcmV0dXJuIGxvZ0Vycm9yKGBpbnZhbGlkIHRocm90dGxlL2RlYm91bmNlIHZhbHVlOiAke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aHJvdHRsZSkge1xuICAgICAgICAgIGxldCBuZXdLZXlEb3duID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IFwia2V5ZG93blwiKSB7XG4gICAgICAgICAgICBsZXQgcHJldktleSA9IHRoaXMucHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVkpO1xuICAgICAgICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBERUJPVU5DRV9QUkVWX0tFWSwgZXZlbnQua2V5KTtcbiAgICAgICAgICAgIG5ld0tleURvd24gPSBwcmV2S2V5ICE9PSBldmVudC5rZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbmV3S2V5RG93biAmJiB0aGlzLnByaXZhdGUoZWwsIFRIUk9UVExFRCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgVEhST1RUTEVELCB0cnVlKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoYXN5bmNGaWx0ZXIoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGFzeW5jRmlsdGVyKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIsIGN1cnJlbnRDeWNsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZvcm0gPSBlbC5mb3JtO1xuICAgICAgICBpZiAoZm9ybSAmJiB0aGlzLm9uY2UoZm9ybSwgXCJiaW5kLWRlYm91bmNlXCIpKSB7XG4gICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsICgpID0+IHtcbiAgICAgICAgICAgIEFycmF5LmZyb20obmV3IEZvcm1EYXRhKGZvcm0pLmVudHJpZXMoKSwgKFtuYW1lXSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuICAgICAgICAgICAgICB0aGlzLmluY0N5Y2xlKGlucHV0LCBERUJPVU5DRV9UUklHR0VSKTtcbiAgICAgICAgICAgICAgdGhpcy5kZWxldGVQcml2YXRlKGlucHV0LCBUSFJPVFRMRUQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub25jZShlbCwgXCJiaW5kLWRlYm91bmNlXCIpKSB7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdHJpZ2dlckN5Y2xlKGVsLCBrZXksIGN1cnJlbnRDeWNsZSkge1xuICAgIGxldCBbY3ljbGUsIHRyaWdnZXJdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpO1xuICAgIGlmICghY3VycmVudEN5Y2xlKSB7XG4gICAgICBjdXJyZW50Q3ljbGUgPSBjeWNsZTtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRDeWNsZSA9PT0gY3ljbGUpIHtcbiAgICAgIHRoaXMuaW5jQ3ljbGUoZWwsIGtleSk7XG4gICAgICB0cmlnZ2VyKCk7XG4gICAgfVxuICB9LFxuICBvbmNlKGVsLCBrZXkpIHtcbiAgICBpZiAodGhpcy5wcml2YXRlKGVsLCBrZXkpID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB0cnVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgaW5jQ3ljbGUoZWwsIGtleSwgdHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICB9KSB7XG4gICAgbGV0IFtjdXJyZW50Q3ljbGVdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpIHx8IFswLCB0cmlnZ2VyXTtcbiAgICBjdXJyZW50Q3ljbGUrKztcbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgW2N1cnJlbnRDeWNsZSwgdHJpZ2dlcl0pO1xuICAgIHJldHVybiBjdXJyZW50Q3ljbGU7XG4gIH0sXG4gIG1heWJlQWRkUHJpdmF0ZUhvb2tzKGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pIHtcbiAgICBpZiAoZWwuaGFzQXR0cmlidXRlICYmIChlbC5oYXNBdHRyaWJ1dGUocGh4Vmlld3BvcnRUb3ApIHx8IGVsLmhhc0F0dHJpYnV0ZShwaHhWaWV3cG9ydEJvdHRvbSkpKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1ob29rXCIsIFwiUGhvZW5peC5JbmZpbml0ZVNjcm9sbFwiKTtcbiAgICB9XG4gIH0sXG4gIG1heWJlSGlkZUZlZWRiYWNrKGNvbnRhaW5lciwgaW5wdXQsIHBoeEZlZWRiYWNrRm9yKSB7XG4gICAgaWYgKCEodGhpcy5wcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQpIHx8IHRoaXMucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpKSkge1xuICAgICAgbGV0IGZlZWRiYWNrcyA9IFtpbnB1dC5uYW1lXTtcbiAgICAgIGlmIChpbnB1dC5uYW1lLmVuZHNXaXRoKFwiW11cIikpIHtcbiAgICAgICAgZmVlZGJhY2tzLnB1c2goaW5wdXQubmFtZS5zbGljZSgwLCAtMikpO1xuICAgICAgfVxuICAgICAgbGV0IHNlbGVjdG9yID0gZmVlZGJhY2tzLm1hcCgoZikgPT4gYFske3BoeEZlZWRiYWNrRm9yfT1cIiR7Zn1cIl1gKS5qb2luKFwiLCBcIik7XG4gICAgICBET00uYWxsKGNvbnRhaW5lciwgc2VsZWN0b3IsIChlbCkgPT4gZWwuY2xhc3NMaXN0LmFkZChQSFhfTk9fRkVFREJBQ0tfQ0xBU1MpKTtcbiAgICB9XG4gIH0sXG4gIHJlc2V0Rm9ybShmb3JtLCBwaHhGZWVkYmFja0Zvcikge1xuICAgIEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgIGxldCBxdWVyeSA9IGBbJHtwaHhGZWVkYmFja0Zvcn09XCIke2lucHV0LmlkfVwiXSxcbiAgICAgICAgICAgICAgICAgICBbJHtwaHhGZWVkYmFja0Zvcn09XCIke2lucHV0Lm5hbWV9XCJdLFxuICAgICAgICAgICAgICAgICAgIFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXQubmFtZS5yZXBsYWNlKC9cXFtcXF0kLywgXCJcIil9XCJdYDtcbiAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKTtcbiAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpO1xuICAgICAgdGhpcy5hbGwoZG9jdW1lbnQsIHF1ZXJ5LCAoZmVlZGJhY2tFbCkgPT4ge1xuICAgICAgICBmZWVkYmFja0VsLmNsYXNzTGlzdC5hZGQoUEhYX05PX0ZFRURCQUNLX0NMQVNTKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBzaG93RXJyb3IoaW5wdXRFbCwgcGh4RmVlZGJhY2tGb3IpIHtcbiAgICBpZiAoaW5wdXRFbC5pZCB8fCBpbnB1dEVsLm5hbWUpIHtcbiAgICAgIHRoaXMuYWxsKGlucHV0RWwuZm9ybSwgYFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5pZH1cIl0sIFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5uYW1lfVwiXWAsIChlbCkgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKGVsLCBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBpc1BoeENoaWxkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoUEhYX1BBUkVOVF9JRCk7XG4gIH0sXG4gIGlzUGh4U3RpY2t5KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoUEhYX1NUSUNLWSkgIT09IG51bGw7XG4gIH0sXG4gIGZpcnN0UGh4Q2hpbGQoZWwpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BoeENoaWxkKGVsKSA/IGVsIDogdGhpcy5hbGwoZWwsIGBbJHtQSFhfUEFSRU5UX0lEfV1gKVswXTtcbiAgfSxcbiAgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIG5hbWUsIG9wdHMgPSB7fSkge1xuICAgIGxldCBidWJibGVzID0gb3B0cy5idWJibGVzID09PSB2b2lkIDAgPyB0cnVlIDogISFvcHRzLmJ1YmJsZXM7XG4gICAgbGV0IGV2ZW50T3B0cyA9IHsgYnViYmxlcywgY2FuY2VsYWJsZTogdHJ1ZSwgZGV0YWlsOiBvcHRzLmRldGFpbCB8fCB7fSB9O1xuICAgIGxldCBldmVudCA9IG5hbWUgPT09IFwiY2xpY2tcIiA/IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwgZXZlbnRPcHRzKSA6IG5ldyBDdXN0b21FdmVudChuYW1lLCBldmVudE9wdHMpO1xuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfSxcbiAgY2xvbmVOb2RlKG5vZGUsIGh0bWwpIHtcbiAgICBpZiAodHlwZW9mIGh0bWwgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiBub2RlLmNsb25lTm9kZSh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNsb25lZCA9IG5vZGUuY2xvbmVOb2RlKGZhbHNlKTtcbiAgICAgIGNsb25lZC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9XG4gIH0sXG4gIG1lcmdlQXR0cnModGFyZ2V0LCBzb3VyY2UsIG9wdHMgPSB7fSkge1xuICAgIGxldCBleGNsdWRlID0gb3B0cy5leGNsdWRlIHx8IFtdO1xuICAgIGxldCBpc0lnbm9yZWQgPSBvcHRzLmlzSWdub3JlZDtcbiAgICBsZXQgc291cmNlQXR0cnMgPSBzb3VyY2UuYXR0cmlidXRlcztcbiAgICBmb3IgKGxldCBpID0gc291cmNlQXR0cnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBuYW1lID0gc291cmNlQXR0cnNbaV0ubmFtZTtcbiAgICAgIGlmIChleGNsdWRlLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUobmFtZSwgc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCB0YXJnZXRBdHRycyA9IHRhcmdldC5hdHRyaWJ1dGVzO1xuICAgIGZvciAobGV0IGkgPSB0YXJnZXRBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IG5hbWUgPSB0YXJnZXRBdHRyc1tpXS5uYW1lO1xuICAgICAgaWYgKGlzSWdub3JlZCkge1xuICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKFwiZGF0YS1cIikgJiYgIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtZXJnZUZvY3VzZWRJbnB1dCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSkge1xuICAgICAgRE9NLm1lcmdlQXR0cnModGFyZ2V0LCBzb3VyY2UsIHsgZXhjbHVkZTogW1widmFsdWVcIl0gfSk7XG4gICAgfVxuICAgIGlmIChzb3VyY2UucmVhZE9ubHkpIHtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xuICAgIH1cbiAgfSxcbiAgaGFzU2VsZWN0aW9uUmFuZ2UoZWwpIHtcbiAgICByZXR1cm4gZWwuc2V0U2VsZWN0aW9uUmFuZ2UgJiYgKGVsLnR5cGUgPT09IFwidGV4dFwiIHx8IGVsLnR5cGUgPT09IFwidGV4dGFyZWFcIik7XG4gIH0sXG4gIHJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKSB7XG4gICAgaWYgKCFET00uaXNUZXh0dWFsSW5wdXQoZm9jdXNlZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHdhc0ZvY3VzZWQgPSBmb2N1c2VkLm1hdGNoZXMoXCI6Zm9jdXNcIik7XG4gICAgaWYgKGZvY3VzZWQucmVhZE9ubHkpIHtcbiAgICAgIGZvY3VzZWQuYmx1cigpO1xuICAgIH1cbiAgICBpZiAoIXdhc0ZvY3VzZWQpIHtcbiAgICAgIGZvY3VzZWQuZm9jdXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkpIHtcbiAgICAgIGZvY3VzZWQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCk7XG4gICAgfVxuICB9LFxuICBpc0Zvcm1JbnB1dChlbCkge1xuICAgIHJldHVybiAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYSkkL2kudGVzdChlbC50YWdOYW1lKSAmJiBlbC50eXBlICE9PSBcImJ1dHRvblwiO1xuICB9LFxuICBzeW5jQXR0cnNUb1Byb3BzKGVsKSB7XG4gICAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBDSEVDS0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+PSAwKSB7XG4gICAgICBlbC5jaGVja2VkID0gZWwuZ2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiKSAhPT0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIGlzVGV4dHVhbElucHV0KGVsKSB7XG4gICAgcmV0dXJuIEZPQ1VTQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwO1xuICB9LFxuICBpc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkge1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFRyaWdnZXJFeHRlcm5hbCkgIT09IG51bGw7XG4gIH0sXG4gIHN5bmNQZW5kaW5nUmVmKGZyb21FbCwgdG9FbCwgZGlzYWJsZVdpdGgpIHtcbiAgICBsZXQgcmVmID0gZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfUkVGKTtcbiAgICBpZiAocmVmID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IHJlZlNyYyA9IGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpO1xuICAgIGlmIChET00uaXNGb3JtSW5wdXQoZnJvbUVsKSB8fCBmcm9tRWwuZ2V0QXR0cmlidXRlKGRpc2FibGVXaXRoKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKERPTS5pc1VwbG9hZElucHV0KGZyb21FbCkpIHtcbiAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7IGlzSWdub3JlZDogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICAgIERPTS5wdXRQcml2YXRlKGZyb21FbCwgUEhYX1JFRiwgdG9FbCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIFBIWF9FVkVOVF9DTEFTU0VTLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICBmcm9tRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkgJiYgdG9FbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICB9KTtcbiAgICAgIHRvRWwuc2V0QXR0cmlidXRlKFBIWF9SRUYsIHJlZik7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShQSFhfUkVGX1NSQywgcmVmU3JjKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSxcbiAgY2xlYW5DaGlsZE5vZGVzKGNvbnRhaW5lciwgcGh4VXBkYXRlKSB7XG4gICAgaWYgKERPTS5pc1BoeFVwZGF0ZShjb250YWluZXIsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpIHtcbiAgICAgIGxldCB0b1JlbW92ZSA9IFtdO1xuICAgICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGROb2RlKSA9PiB7XG4gICAgICAgIGlmICghY2hpbGROb2RlLmlkKSB7XG4gICAgICAgICAgbGV0IGlzRW1wdHlUZXh0Tm9kZSA9IGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgY2hpbGROb2RlLm5vZGVWYWx1ZS50cmltKCkgPT09IFwiXCI7XG4gICAgICAgICAgaWYgKCFpc0VtcHR5VGV4dE5vZGUpIHtcbiAgICAgICAgICAgIGxvZ0Vycm9yKGBvbmx5IEhUTUwgZWxlbWVudCB0YWdzIHdpdGggYW4gaWQgYXJlIGFsbG93ZWQgaW5zaWRlIGNvbnRhaW5lcnMgd2l0aCBwaHgtdXBkYXRlLlxuXG5yZW1vdmluZyBpbGxlZ2FsIG5vZGU6IFwiJHsoY2hpbGROb2RlLm91dGVySFRNTCB8fCBjaGlsZE5vZGUubm9kZVZhbHVlKS50cmltKCl9XCJcblxuYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvUmVtb3ZlLnB1c2goY2hpbGROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0b1JlbW92ZS5mb3JFYWNoKChjaGlsZE5vZGUpID0+IGNoaWxkTm9kZS5yZW1vdmUoKSk7XG4gICAgfVxuICB9LFxuICByZXBsYWNlUm9vdENvbnRhaW5lcihjb250YWluZXIsIHRhZ05hbWUsIGF0dHJzKSB7XG4gICAgbGV0IHJldGFpbmVkQXR0cnMgPSBuZXcgU2V0KFtcImlkXCIsIFBIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfTUFJTiwgUEhYX1JPT1RfSURdKTtcbiAgICBpZiAoY29udGFpbmVyLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5hdHRyaWJ1dGVzKS5maWx0ZXIoKGF0dHIpID0+ICFyZXRhaW5lZEF0dHJzLmhhcyhhdHRyLm5hbWUudG9Mb3dlckNhc2UoKSkpLmZvckVhY2goKGF0dHIpID0+IGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKSk7XG4gICAgICBPYmplY3Qua2V5cyhhdHRycykuZmlsdGVyKChuYW1lKSA9PiAhcmV0YWluZWRBdHRycy5oYXMobmFtZS50b0xvd2VyQ2FzZSgpKSkuZm9yRWFjaCgoYXR0cikgPT4gY29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpO1xuICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5ld0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaCgoYXR0cikgPT4gbmV3Q29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpO1xuICAgICAgcmV0YWluZWRBdHRycy5mb3JFYWNoKChhdHRyKSA9PiBuZXdDb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoYXR0cikpKTtcbiAgICAgIG5ld0NvbnRhaW5lci5pbm5lckhUTUwgPSBjb250YWluZXIuaW5uZXJIVE1MO1xuICAgICAgY29udGFpbmVyLnJlcGxhY2VXaXRoKG5ld0NvbnRhaW5lcik7XG4gICAgICByZXR1cm4gbmV3Q29udGFpbmVyO1xuICAgIH1cbiAgfSxcbiAgZ2V0U3RpY2t5KGVsLCBuYW1lLCBkZWZhdWx0VmFsKSB7XG4gICAgbGV0IG9wID0gKERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKSB8fCBbXSkuZmluZCgoW2V4aXN0aW5nTmFtZV0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSk7XG4gICAgaWYgKG9wKSB7XG4gICAgICBsZXQgW19uYW1lLCBfb3AsIHN0YXNoZWRSZXN1bHRdID0gb3A7XG4gICAgICByZXR1cm4gc3Rhc2hlZFJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkZWZhdWx0VmFsID09PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0VmFsKCkgOiBkZWZhdWx0VmFsO1xuICAgIH1cbiAgfSxcbiAgZGVsZXRlU3RpY2t5KGVsLCBuYW1lKSB7XG4gICAgdGhpcy51cGRhdGVQcml2YXRlKGVsLCBcInN0aWNreVwiLCBbXSwgKG9wcykgPT4ge1xuICAgICAgcmV0dXJuIG9wcy5maWx0ZXIoKFtleGlzdGluZ05hbWUsIF9dKSA9PiBleGlzdGluZ05hbWUgIT09IG5hbWUpO1xuICAgIH0pO1xuICB9LFxuICBwdXRTdGlja3koZWwsIG5hbWUsIG9wKSB7XG4gICAgbGV0IHN0YXNoZWRSZXN1bHQgPSBvcChlbCk7XG4gICAgdGhpcy51cGRhdGVQcml2YXRlKGVsLCBcInN0aWNreVwiLCBbXSwgKG9wcykgPT4ge1xuICAgICAgbGV0IGV4aXN0aW5nSW5kZXggPSBvcHMuZmluZEluZGV4KChbZXhpc3RpbmdOYW1lXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKTtcbiAgICAgIGlmIChleGlzdGluZ0luZGV4ID49IDApIHtcbiAgICAgICAgb3BzW2V4aXN0aW5nSW5kZXhdID0gW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wcy5wdXNoKFtuYW1lLCBvcCwgc3Rhc2hlZFJlc3VsdF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wcztcbiAgICB9KTtcbiAgfSxcbiAgYXBwbHlTdGlja3lPcGVyYXRpb25zKGVsKSB7XG4gICAgbGV0IG9wcyA9IERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKTtcbiAgICBpZiAoIW9wcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvcHMuZm9yRWFjaCgoW25hbWUsIG9wLCBfc3Rhc2hlZF0pID0+IHRoaXMucHV0U3RpY2t5KGVsLCBuYW1lLCBvcCkpO1xuICB9XG59O1xudmFyIGRvbV9kZWZhdWx0ID0gRE9NO1xuXG4vLyBqcy9waG9lbml4X2xpdmVfdmlldy91cGxvYWRfZW50cnkuanNcbnZhciBVcGxvYWRFbnRyeSA9IGNsYXNzIHtcbiAgc3RhdGljIGlzQWN0aXZlKGZpbGVFbCwgZmlsZSkge1xuICAgIGxldCBpc05ldyA9IGZpbGUuX3BoeFJlZiA9PT0gdm9pZCAwO1xuICAgIGxldCBhY3RpdmVSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKTtcbiAgICBsZXQgaXNBY3RpdmUgPSBhY3RpdmVSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDA7XG4gICAgcmV0dXJuIGZpbGUuc2l6ZSA+IDAgJiYgKGlzTmV3IHx8IGlzQWN0aXZlKTtcbiAgfVxuICBzdGF0aWMgaXNQcmVmbGlnaHRlZChmaWxlRWwsIGZpbGUpIHtcbiAgICBsZXQgcHJlZmxpZ2h0ZWRSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykuc3BsaXQoXCIsXCIpO1xuICAgIGxldCBpc1ByZWZsaWdodGVkID0gcHJlZmxpZ2h0ZWRSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDA7XG4gICAgcmV0dXJuIGlzUHJlZmxpZ2h0ZWQgJiYgdGhpcy5pc0FjdGl2ZShmaWxlRWwsIGZpbGUpO1xuICB9XG4gIGNvbnN0cnVjdG9yKGZpbGVFbCwgZmlsZSwgdmlldykge1xuICAgIHRoaXMucmVmID0gTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSk7XG4gICAgdGhpcy5maWxlRWwgPSBmaWxlRWw7XG4gICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIHRoaXMubWV0YSA9IG51bGw7XG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZTtcbiAgICB0aGlzLl9wcm9ncmVzcyA9IDA7XG4gICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IC0xO1xuICAgIHRoaXMuX29uRG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgdGhpcy5fb25FbFVwZGF0ZWQgPSB0aGlzLm9uRWxVcGRhdGVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5maWxlRWwuYWRkRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKTtcbiAgfVxuICBtZXRhZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRhO1xuICB9XG4gIHByb2dyZXNzKHByb2dyZXNzKSB7XG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHByb2dyZXNzKTtcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3MgPiB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50KSB7XG4gICAgICBpZiAodGhpcy5fcHJvZ3Jlc3MgPj0gMTAwKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gMTAwO1xuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gMTAwO1xuICAgICAgICB0aGlzLl9pc0RvbmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIDEwMCwgKCkgPT4ge1xuICAgICAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKTtcbiAgICAgICAgICB0aGlzLl9vbkRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gdGhpcy5fcHJvZ3Jlc3M7XG4gICAgICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwgdGhpcy5fcHJvZ3Jlc3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYW5jZWwoKSB7XG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgIHRoaXMuX2lzRG9uZSA9IHRydWU7XG4gICAgdGhpcy5fb25Eb25lKCk7XG4gIH1cbiAgaXNEb25lKCkge1xuICAgIHJldHVybiB0aGlzLl9pc0RvbmU7XG4gIH1cbiAgZXJyb3IocmVhc29uID0gXCJmYWlsZWRcIikge1xuICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZCk7XG4gICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCB7IGVycm9yOiByZWFzb24gfSk7XG4gICAgaWYgKCFkb21fZGVmYXVsdC5pc0F1dG9VcGxvYWQodGhpcy5maWxlRWwpKSB7XG4gICAgICBMaXZlVXBsb2FkZXIuY2xlYXJGaWxlcyh0aGlzLmZpbGVFbCk7XG4gICAgfVxuICB9XG4gIG9uRG9uZShjYWxsYmFjaykge1xuICAgIHRoaXMuX29uRG9uZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZCk7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH07XG4gIH1cbiAgb25FbFVwZGF0ZWQoKSB7XG4gICAgbGV0IGFjdGl2ZVJlZnMgPSB0aGlzLmZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKS5zcGxpdChcIixcIik7XG4gICAgaWYgKGFjdGl2ZVJlZnMuaW5kZXhPZih0aGlzLnJlZikgPT09IC0xKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpO1xuICAgIH1cbiAgfVxuICB0b1ByZWZsaWdodFBheWxvYWQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhc3RfbW9kaWZpZWQ6IHRoaXMuZmlsZS5sYXN0TW9kaWZpZWQsXG4gICAgICBuYW1lOiB0aGlzLmZpbGUubmFtZSxcbiAgICAgIHJlbGF0aXZlX3BhdGg6IHRoaXMuZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGgsXG4gICAgICBzaXplOiB0aGlzLmZpbGUuc2l6ZSxcbiAgICAgIHR5cGU6IHRoaXMuZmlsZS50eXBlLFxuICAgICAgcmVmOiB0aGlzLnJlZixcbiAgICAgIG1ldGE6IHR5cGVvZiB0aGlzLmZpbGUubWV0YSA9PT0gXCJmdW5jdGlvblwiID8gdGhpcy5maWxlLm1ldGEoKSA6IHZvaWQgMFxuICAgIH07XG4gIH1cbiAgdXBsb2FkZXIodXBsb2FkZXJzKSB7XG4gICAgaWYgKHRoaXMubWV0YS51cGxvYWRlcikge1xuICAgICAgbGV0IGNhbGxiYWNrID0gdXBsb2FkZXJzW3RoaXMubWV0YS51cGxvYWRlcl0gfHwgbG9nRXJyb3IoYG5vIHVwbG9hZGVyIGNvbmZpZ3VyZWQgZm9yICR7dGhpcy5tZXRhLnVwbG9hZGVyfWApO1xuICAgICAgcmV0dXJuIHsgbmFtZTogdGhpcy5tZXRhLnVwbG9hZGVyLCBjYWxsYmFjayB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBuYW1lOiBcImNoYW5uZWxcIiwgY2FsbGJhY2s6IGNoYW5uZWxVcGxvYWRlciB9O1xuICAgIH1cbiAgfVxuICB6aXBQb3N0RmxpZ2h0KHJlc3ApIHtcbiAgICB0aGlzLm1ldGEgPSByZXNwLmVudHJpZXNbdGhpcy5yZWZdO1xuICAgIGlmICghdGhpcy5tZXRhKSB7XG4gICAgICBsb2dFcnJvcihgbm8gcHJlZmxpZ2h0IHVwbG9hZCByZXNwb25zZSByZXR1cm5lZCB3aXRoIHJlZiAke3RoaXMucmVmfWAsIHsgaW5wdXQ6IHRoaXMuZmlsZUVsLCByZXNwb25zZTogcmVzcCB9KTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGpzL3Bob2VuaXhfbGl2ZV92aWV3L2xpdmVfdXBsb2FkZXIuanNcbnZhciBsaXZlVXBsb2FkZXJGaWxlUmVmID0gMDtcbnZhciBMaXZlVXBsb2FkZXIgPSBjbGFzcyB7XG4gIHN0YXRpYyBnZW5GaWxlUmVmKGZpbGUpIHtcbiAgICBsZXQgcmVmID0gZmlsZS5fcGh4UmVmO1xuICAgIGlmIChyZWYgIT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIHJlZjtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZS5fcGh4UmVmID0gKGxpdmVVcGxvYWRlckZpbGVSZWYrKykudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBmaWxlLl9waHhSZWY7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXRFbnRyeURhdGFVUkwoaW5wdXRFbCwgcmVmLCBjYWxsYmFjaykge1xuICAgIGxldCBmaWxlID0gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKChmaWxlMikgPT4gdGhpcy5nZW5GaWxlUmVmKGZpbGUyKSA9PT0gcmVmKTtcbiAgICBjYWxsYmFjayhVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpKTtcbiAgfVxuICBzdGF0aWMgaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKSB7XG4gICAgbGV0IGFjdGl2ZSA9IDA7XG4gICAgZG9tX2RlZmF1bHQuZmluZFVwbG9hZElucHV0cyhmb3JtRWwpLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICBpZiAoaW5wdXQuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKSAhPT0gaW5wdXQuZ2V0QXR0cmlidXRlKFBIWF9ET05FX1JFRlMpKSB7XG4gICAgICAgIGFjdGl2ZSsrO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBhY3RpdmUgPiAwO1xuICB9XG4gIHN0YXRpYyBzZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpIHtcbiAgICBsZXQgZmlsZXMgPSB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpO1xuICAgIGxldCBmaWxlRGF0YSA9IHt9O1xuICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGxldCBlbnRyeSA9IHsgcGF0aDogaW5wdXRFbC5uYW1lIH07XG4gICAgICBsZXQgdXBsb2FkUmVmID0gaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpO1xuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXSA9IGZpbGVEYXRhW3VwbG9hZFJlZl0gfHwgW107XG4gICAgICBlbnRyeS5yZWYgPSB0aGlzLmdlbkZpbGVSZWYoZmlsZSk7XG4gICAgICBlbnRyeS5sYXN0X21vZGlmaWVkID0gZmlsZS5sYXN0TW9kaWZpZWQ7XG4gICAgICBlbnRyeS5uYW1lID0gZmlsZS5uYW1lIHx8IGVudHJ5LnJlZjtcbiAgICAgIGVudHJ5LnJlbGF0aXZlX3BhdGggPSBmaWxlLndlYmtpdFJlbGF0aXZlUGF0aDtcbiAgICAgIGVudHJ5LnR5cGUgPSBmaWxlLnR5cGU7XG4gICAgICBlbnRyeS5zaXplID0gZmlsZS5zaXplO1xuICAgICAgaWYgKHR5cGVvZiBmaWxlLm1ldGEgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlbnRyeS5tZXRhID0gZmlsZS5tZXRhKCk7XG4gICAgICB9XG4gICAgICBmaWxlRGF0YVt1cGxvYWRSZWZdLnB1c2goZW50cnkpO1xuICAgIH0pO1xuICAgIHJldHVybiBmaWxlRGF0YTtcbiAgfVxuICBzdGF0aWMgY2xlYXJGaWxlcyhpbnB1dEVsKSB7XG4gICAgaW5wdXRFbC52YWx1ZSA9IG51bGw7XG4gICAgaW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpO1xuICAgIGRvbV9kZWZhdWx0LnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBbXSk7XG4gIH1cbiAgc3RhdGljIHVudHJhY2tGaWxlKGlucHV0RWwsIGZpbGUpIHtcbiAgICBkb21fZGVmYXVsdC5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgZG9tX2RlZmF1bHQucHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIpLmZpbHRlcigoZikgPT4gIU9iamVjdC5pcyhmLCBmaWxlKSkpO1xuICB9XG4gIHN0YXRpYyB0cmFja0ZpbGVzKGlucHV0RWwsIGZpbGVzLCBkYXRhVHJhbnNmZXIpIHtcbiAgICBpZiAoaW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSAhPT0gbnVsbCkge1xuICAgICAgbGV0IG5ld0ZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiAhdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKChmKSA9PiBPYmplY3QuaXMoZiwgZmlsZSkpKTtcbiAgICAgIGRvbV9kZWZhdWx0LnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpLmNvbmNhdChuZXdGaWxlcykpO1xuICAgICAgaW5wdXRFbC52YWx1ZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkYXRhVHJhbnNmZXIgJiYgZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5wdXRFbC5maWxlcyA9IGRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgIH1cbiAgICAgIGRvbV9kZWZhdWx0LnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBmaWxlcyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBhY3RpdmVGaWxlSW5wdXRzKGZvcm1FbCkge1xuICAgIGxldCBmaWxlSW5wdXRzID0gZG9tX2RlZmF1bHQuZmluZFVwbG9hZElucHV0cyhmb3JtRWwpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dHMpLmZpbHRlcigoZWwpID0+IGVsLmZpbGVzICYmIHRoaXMuYWN0aXZlRmlsZXMoZWwpLmxlbmd0aCA+IDApO1xuICB9XG4gIHN0YXRpYyBhY3RpdmVGaWxlcyhpbnB1dCkge1xuICAgIHJldHVybiAoZG9tX2RlZmF1bHQucHJpdmF0ZShpbnB1dCwgXCJmaWxlc1wiKSB8fCBbXSkuZmlsdGVyKChmKSA9PiBVcGxvYWRFbnRyeS5pc0FjdGl2ZShpbnB1dCwgZikpO1xuICB9XG4gIHN0YXRpYyBpbnB1dHNBd2FpdGluZ1ByZWZsaWdodChmb3JtRWwpIHtcbiAgICBsZXQgZmlsZUlucHV0cyA9IGRvbV9kZWZhdWx0LmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoKGlucHV0KSA9PiB0aGlzLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXQpLmxlbmd0aCA+IDApO1xuICB9XG4gIHN0YXRpYyBmaWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlRmlsZXMoaW5wdXQpLmZpbHRlcigoZikgPT4gIVVwbG9hZEVudHJ5LmlzUHJlZmxpZ2h0ZWQoaW5wdXQsIGYpKTtcbiAgfVxuICBjb25zdHJ1Y3RvcihpbnB1dEVsLCB2aWV3LCBvbkNvbXBsZXRlKSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlO1xuICAgIHRoaXMuX2VudHJpZXMgPSBBcnJheS5mcm9tKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpIHx8IFtdKS5tYXAoKGZpbGUpID0+IG5ldyBVcGxvYWRFbnRyeShpbnB1dEVsLCBmaWxlLCB2aWV3KSk7XG4gICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9IHRoaXMuX2VudHJpZXMubGVuZ3RoO1xuICB9XG4gIGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudHJpZXM7XG4gIH1cbiAgaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgbGl2ZVNvY2tldCkge1xuICAgIHRoaXMuX2VudHJpZXMgPSB0aGlzLl9lbnRyaWVzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGVudHJ5LnppcFBvc3RGbGlnaHQocmVzcCk7XG4gICAgICBlbnRyeS5vbkRvbmUoKCkgPT4ge1xuICAgICAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzLS07XG4gICAgICAgIGlmICh0aGlzLm51bUVudHJpZXNJblByb2dyZXNzID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5vbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGVudHJ5O1xuICAgIH0pO1xuICAgIGxldCBncm91cGVkRW50cmllcyA9IHRoaXMuX2VudHJpZXMucmVkdWNlKChhY2MsIGVudHJ5KSA9PiB7XG4gICAgICBpZiAoIWVudHJ5Lm1ldGEpIHtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH1cbiAgICAgIGxldCB7IG5hbWUsIGNhbGxiYWNrIH0gPSBlbnRyeS51cGxvYWRlcihsaXZlU29ja2V0LnVwbG9hZGVycyk7XG4gICAgICBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gfHwgeyBjYWxsYmFjaywgZW50cmllczogW10gfTtcbiAgICAgIGFjY1tuYW1lXS5lbnRyaWVzLnB1c2goZW50cnkpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgZm9yIChsZXQgbmFtZSBpbiBncm91cGVkRW50cmllcykge1xuICAgICAgbGV0IHsgY2FsbGJhY2ssIGVudHJpZXMgfSA9IGdyb3VwZWRFbnRyaWVzW25hbWVdO1xuICAgICAgY2FsbGJhY2soZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldCk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBqcy9waG9lbml4X2xpdmVfdmlldy9hcmlhLmpzXG52YXIgQVJJQSA9IHtcbiAgZm9jdXNNYWluKCkge1xuICAgIGxldCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpbiBoMSwgbWFpbiwgaDFcIik7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgbGV0IG9yaWdUYWJJbmRleCA9IHRhcmdldC50YWJJbmRleDtcbiAgICAgIHRhcmdldC50YWJJbmRleCA9IC0xO1xuICAgICAgdGFyZ2V0LmZvY3VzKCk7XG4gICAgICB0YXJnZXQudGFiSW5kZXggPSBvcmlnVGFiSW5kZXg7XG4gICAgfVxuICB9LFxuICBhbnlPZihpbnN0YW5jZSwgY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzLmZpbmQoKG5hbWUpID0+IGluc3RhbmNlIGluc3RhbmNlb2YgbmFtZSk7XG4gIH0sXG4gIGlzRm9jdXNhYmxlKGVsLCBpbnRlcmFjdGl2ZU9ubHkpIHtcbiAgICByZXR1cm4gZWwgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBlbC5yZWwgIT09IFwiaWdub3JlXCIgfHwgZWwgaW5zdGFuY2VvZiBIVE1MQXJlYUVsZW1lbnQgJiYgZWwuaHJlZiAhPT0gdm9pZCAwIHx8ICFlbC5kaXNhYmxlZCAmJiB0aGlzLmFueU9mKGVsLCBbSFRNTElucHV0RWxlbWVudCwgSFRNTFNlbGVjdEVsZW1lbnQsIEhUTUxUZXh0QXJlYUVsZW1lbnQsIEhUTUxCdXR0b25FbGVtZW50XSkgfHwgZWwgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCB8fCAoZWwudGFiSW5kZXggPiAwIHx8ICFpbnRlcmFjdGl2ZU9ubHkgJiYgZWwudGFiSW5kZXggPT09IDAgJiYgZWwuZ2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIikgIT09IG51bGwgJiYgZWwuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgIT09IFwidHJ1ZVwiKTtcbiAgfSxcbiAgYXR0ZW1wdEZvY3VzKGVsLCBpbnRlcmFjdGl2ZU9ubHkpIHtcbiAgICBpZiAodGhpcy5pc0ZvY3VzYWJsZShlbCwgaW50ZXJhY3RpdmVPbmx5KSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICEhZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZWwpO1xuICB9LFxuICBmb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHtcbiAgICBsZXQgY2hpbGQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLmF0dGVtcHRGb2N1cyhjaGlsZCwgdHJ1ZSkgfHwgdGhpcy5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoY2hpbGQsIHRydWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgfVxuICB9LFxuICBmb2N1c0ZpcnN0KGVsKSB7XG4gICAgbGV0IGNoaWxkID0gZWwuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICBpZiAodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQpIHx8IHRoaXMuZm9jdXNGaXJzdChjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZztcbiAgICB9XG4gIH0sXG4gIGZvY3VzTGFzdChlbCkge1xuICAgIGxldCBjaGlsZCA9IGVsLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICBpZiAodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQpIHx8IHRoaXMuZm9jdXNMYXN0KGNoaWxkKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkID0gY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICB9XG4gIH1cbn07XG52YXIgYXJpYV9kZWZhdWx0ID0gQVJJQTtcblxuLy8ganMvcGhvZW5peF9saXZlX3ZpZXcvaG9va3MuanNcbnZhciBIb29rcyA9IHtcbiAgTGl2ZUZpbGVVcGxvYWQ6IHtcbiAgICBhY3RpdmVSZWZzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUyk7XG4gICAgfSxcbiAgICBwcmVmbGlnaHRlZFJlZnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpO1xuICAgIH0sXG4gICAgbW91bnRlZCgpIHtcbiAgICAgIHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSB0aGlzLnByZWZsaWdodGVkUmVmcygpO1xuICAgIH0sXG4gICAgdXBkYXRlZCgpIHtcbiAgICAgIGxldCBuZXdQcmVmbGlnaHRzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKTtcbiAgICAgIGlmICh0aGlzLnByZWZsaWdodGVkV2FzICE9PSBuZXdQcmVmbGlnaHRzKSB7XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSBuZXdQcmVmbGlnaHRzO1xuICAgICAgICBpZiAobmV3UHJlZmxpZ2h0cyA9PT0gXCJcIikge1xuICAgICAgICAgIHRoaXMuX192aWV3LmNhbmNlbFN1Ym1pdCh0aGlzLmVsLmZvcm0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hY3RpdmVSZWZzKCkgPT09IFwiXCIpIHtcbiAgICAgICAgdGhpcy5lbC52YWx1ZSA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCkpO1xuICAgIH1cbiAgfSxcbiAgTGl2ZUltZ1ByZXZpZXc6IHtcbiAgICBtb3VudGVkKCkge1xuICAgICAgdGhpcy5yZWYgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LWVudHJ5LXJlZlwiKTtcbiAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSk7XG4gICAgICBMaXZlVXBsb2FkZXIuZ2V0RW50cnlEYXRhVVJMKHRoaXMuaW5wdXRFbCwgdGhpcy5yZWYsICh1cmwpID0+IHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuZWwuc3JjID0gdXJsO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZXN0cm95ZWQoKSB7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHRoaXMudXJsKTtcbiAgICB9XG4gIH0sXG4gIEZvY3VzV3JhcDoge1xuICAgIG1vdW50ZWQoKSB7XG4gICAgICB0aGlzLmZvY3VzU3RhcnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgdGhpcy5mb2N1c0VuZCA9IHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZDtcbiAgICAgIHRoaXMuZm9jdXNTdGFydC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4gYXJpYV9kZWZhdWx0LmZvY3VzTGFzdCh0aGlzLmVsKSk7XG4gICAgICB0aGlzLmZvY3VzRW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiBhcmlhX2RlZmF1bHQuZm9jdXNGaXJzdCh0aGlzLmVsKSk7XG4gICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6c2hvdy1lbmRcIiwgKCkgPT4gdGhpcy5lbC5mb2N1cygpKTtcbiAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsKS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgICAgICBhcmlhX2RlZmF1bHQuZm9jdXNGaXJzdCh0aGlzLmVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG52YXIgc2Nyb2xsVG9wID0gKCkgPT4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbnZhciB3aW5IZWlnaHQgPSAoKSA9PiB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbnZhciBpc0F0Vmlld3BvcnRUb3AgPSAoZWwpID0+IHtcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcmV0dXJuIHJlY3QudG9wID49IDAgJiYgcmVjdC5sZWZ0ID49IDAgJiYgcmVjdC50b3AgPD0gd2luSGVpZ2h0KCk7XG59O1xudmFyIGlzQXRWaWV3cG9ydEJvdHRvbSA9IChlbCkgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4gcmVjdC5yaWdodCA+PSAwICYmIHJlY3QubGVmdCA+PSAwICYmIHJlY3QuYm90dG9tIDw9IHdpbkhlaWdodCgpO1xufTtcbnZhciBpc1dpdGhpblZpZXdwb3J0ID0gKGVsKSA9PiB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiByZWN0LnRvcCA+PSAwICYmIHJlY3QubGVmdCA+PSAwICYmIHJlY3QudG9wIDw9IHdpbkhlaWdodCgpO1xufTtcbkhvb2tzLkluZmluaXRlU2Nyb2xsID0ge1xuICBtb3VudGVkKCkge1xuICAgIGxldCBzY3JvbGxCZWZvcmUgPSBzY3JvbGxUb3AoKTtcbiAgICBsZXQgdG9wT3ZlcnJhbiA9IGZhbHNlO1xuICAgIGxldCB0aHJvdHRsZUludGVydmFsID0gNTAwO1xuICAgIGxldCBwZW5kaW5nT3AgPSBudWxsO1xuICAgIGxldCBvblRvcE92ZXJydW4gPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsICh0b3BFdmVudCwgZmlyc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gdHJ1ZTtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlNIb29rUHVzaCh0aGlzLmVsLCB0b3BFdmVudCwgeyBpZDogZmlyc3RDaGlsZC5pZCwgX292ZXJyYW46IHRydWUgfSwgKCkgPT4ge1xuICAgICAgICBwZW5kaW5nT3AgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgbGV0IG9uRmlyc3RDaGlsZEF0VG9wID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAodG9wRXZlbnQsIGZpcnN0Q2hpbGQpID0+IHtcbiAgICAgIHBlbmRpbmdPcCA9ICgpID0+IGZpcnN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogXCJzdGFydFwiIH0pO1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKU0hvb2tQdXNoKHRoaXMuZWwsIHRvcEV2ZW50LCB7IGlkOiBmaXJzdENoaWxkLmlkIH0sICgpID0+IHtcbiAgICAgICAgcGVuZGluZ09wID0gbnVsbDtcbiAgICAgICAgaWYgKCFpc1dpdGhpblZpZXdwb3J0KGZpcnN0Q2hpbGQpKSB7XG4gICAgICAgICAgZmlyc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiBcInN0YXJ0XCIgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGxldCBvbkxhc3RDaGlsZEF0Qm90dG9tID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAoYm90dG9tRXZlbnQsIGxhc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gbGFzdENoaWxkLnNjcm9sbEludG9WaWV3KHsgYmxvY2s6IFwiZW5kXCIgfSk7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTSG9va1B1c2godGhpcy5lbCwgYm90dG9tRXZlbnQsIHsgaWQ6IGxhc3RDaGlsZC5pZCB9LCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdPcCA9IG51bGw7XG4gICAgICAgIGlmICghaXNXaXRoaW5WaWV3cG9ydChsYXN0Q2hpbGQpKSB7XG4gICAgICAgICAgbGFzdENoaWxkLnNjcm9sbEludG9WaWV3KHsgYmxvY2s6IFwiZW5kXCIgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMub25TY3JvbGwgPSAoZSkgPT4ge1xuICAgICAgbGV0IHNjcm9sbE5vdyA9IHNjcm9sbFRvcCgpO1xuICAgICAgaWYgKHBlbmRpbmdPcCkge1xuICAgICAgICBzY3JvbGxCZWZvcmUgPSBzY3JvbGxOb3c7XG4gICAgICAgIHJldHVybiBwZW5kaW5nT3AoKTtcbiAgICAgIH1cbiAgICAgIGxldCByZWN0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCB0b3BFdmVudCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwidmlld3BvcnQtdG9wXCIpKTtcbiAgICAgIGxldCBib3R0b21FdmVudCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwidmlld3BvcnQtYm90dG9tXCIpKTtcbiAgICAgIGxldCBsYXN0Q2hpbGQgPSB0aGlzLmVsLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICBsZXQgZmlyc3RDaGlsZCA9IHRoaXMuZWwuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICBsZXQgaXNTY3JvbGxpbmdVcCA9IHNjcm9sbE5vdyA8IHNjcm9sbEJlZm9yZTtcbiAgICAgIGxldCBpc1Njcm9sbGluZ0Rvd24gPSBzY3JvbGxOb3cgPiBzY3JvbGxCZWZvcmU7XG4gICAgICBpZiAoaXNTY3JvbGxpbmdVcCAmJiB0b3BFdmVudCAmJiAhdG9wT3ZlcnJhbiAmJiByZWN0LnRvcCA+PSAwKSB7XG4gICAgICAgIHRvcE92ZXJyYW4gPSB0cnVlO1xuICAgICAgICBvblRvcE92ZXJydW4odG9wRXZlbnQsIGZpcnN0Q2hpbGQpO1xuICAgICAgfSBlbHNlIGlmIChpc1Njcm9sbGluZ0Rvd24gJiYgdG9wT3ZlcnJhbiAmJiByZWN0LnRvcCA8PSAwKSB7XG4gICAgICAgIHRvcE92ZXJyYW4gPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0b3BFdmVudCAmJiBpc1Njcm9sbGluZ1VwICYmIGlzQXRWaWV3cG9ydFRvcChmaXJzdENoaWxkKSkge1xuICAgICAgICBvbkZpcnN0Q2hpbGRBdFRvcCh0b3BFdmVudCwgZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbUV2ZW50ICYmIGlzU2Nyb2xsaW5nRG93biAmJiBpc0F0Vmlld3BvcnRCb3R0b20obGFzdENoaWxkKSkge1xuICAgICAgICBvbkxhc3RDaGlsZEF0Qm90dG9tKGJvdHRvbUV2ZW50LCBsYXN0Q2hpbGQpO1xuICAgICAgfVxuICAgICAgc2Nyb2xsQmVmb3JlID0gc2Nyb2xsTm93O1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbCk7XG4gIH0sXG4gIGRlc3Ryb3llZCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLm9uU2Nyb2xsKTtcbiAgfSxcbiAgdGhyb3R0bGUoaW50ZXJ2YWwsIGNhbGxiYWNrKSB7XG4gICAgbGV0IGxhc3RDYWxsQXQgPSAwO1xuICAgIGxldCB0aW1lcjtcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgbGV0IHJlbWFpbmluZ1RpbWUgPSBpbnRlcnZhbCAtIChub3cgLSBsYXN0Q2FsbEF0KTtcbiAgICAgIGlmIChyZW1haW5pbmdUaW1lIDw9IDAgfHwgcmVtYWluaW5nVGltZSA+IGludGVydmFsKSB7XG4gICAgICAgIGlmICh0aW1lcikge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RDYWxsQXQgPSBub3c7XG4gICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgfSBlbHNlIGlmICghdGltZXIpIHtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBsYXN0Q2FsbEF0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgIH0sIHJlbWFpbmluZ1RpbWUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG52YXIgaG9va3NfZGVmYXVsdCA9IEhvb2tzO1xuXG4vLyBqcy9waG9lbml4X2xpdmVfdmlldy9kb21fcG9zdF9tb3JwaF9yZXN0b3Jlci5qc1xudmFyIERPTVBvc3RNb3JwaFJlc3RvcmVyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXJCZWZvcmUsIGNvbnRhaW5lckFmdGVyLCB1cGRhdGVUeXBlKSB7XG4gICAgbGV0IGlkc0JlZm9yZSA9IG5ldyBTZXQoKTtcbiAgICBsZXQgaWRzQWZ0ZXIgPSBuZXcgU2V0KFsuLi5jb250YWluZXJBZnRlci5jaGlsZHJlbl0ubWFwKChjaGlsZCkgPT4gY2hpbGQuaWQpKTtcbiAgICBsZXQgZWxlbWVudHNUb01vZGlmeSA9IFtdO1xuICAgIEFycmF5LmZyb20oY29udGFpbmVyQmVmb3JlLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgaWYgKGNoaWxkLmlkKSB7XG4gICAgICAgIGlkc0JlZm9yZS5hZGQoY2hpbGQuaWQpO1xuICAgICAgICBpZiAoaWRzQWZ0ZXIuaGFzKGNoaWxkLmlkKSkge1xuICAgICAgICAgIGxldCBwcmV2aW91c0VsZW1lbnRJZCA9IGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZy5pZDtcbiAgICAgICAgICBlbGVtZW50c1RvTW9kaWZ5LnB1c2goeyBlbGVtZW50SWQ6IGNoaWxkLmlkLCBwcmV2aW91c0VsZW1lbnRJZCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuY29udGFpbmVySWQgPSBjb250YWluZXJBZnRlci5pZDtcbiAgICB0aGlzLnVwZGF0ZVR5cGUgPSB1cGRhdGVUeXBlO1xuICAgIHRoaXMuZWxlbWVudHNUb01vZGlmeSA9IGVsZW1lbnRzVG9Nb2RpZnk7XG4gICAgdGhpcy5lbGVtZW50SWRzVG9BZGQgPSBbLi4uaWRzQWZ0ZXJdLmZpbHRlcigoaWQpID0+ICFpZHNCZWZvcmUuaGFzKGlkKSk7XG4gIH1cbiAgcGVyZm9ybSgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gZG9tX2RlZmF1bHQuYnlJZCh0aGlzLmNvbnRhaW5lcklkKTtcbiAgICB0aGlzLmVsZW1lbnRzVG9Nb2RpZnkuZm9yRWFjaCgoZWxlbWVudFRvTW9kaWZ5KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKSB7XG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCksIChwcmV2aW91c0VsZW0pID0+IHtcbiAgICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgKGVsZW0pID0+IHtcbiAgICAgICAgICAgIGxldCBpc0luUmlnaHRQbGFjZSA9IGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZyAmJiBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaWQgPT0gcHJldmlvdXNFbGVtLmlkO1xuICAgICAgICAgICAgaWYgKCFpc0luUmlnaHRQbGFjZSkge1xuICAgICAgICAgICAgICBwcmV2aW91c0VsZW0uaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJlbmRcIiwgZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIChlbGVtKSA9PiB7XG4gICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09IG51bGw7XG4gICAgICAgICAgaWYgKCFpc0luUmlnaHRQbGFjZSkge1xuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgZWxlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGhpcy51cGRhdGVUeXBlID09IFwicHJlcGVuZFwiKSB7XG4gICAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZC5yZXZlcnNlKCkuZm9yRWFjaCgoZWxlbUlkKSA9PiB7XG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1JZCksIChlbGVtKSA9PiBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBlbGVtKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIG5vZGVfbW9kdWxlcy9tb3JwaGRvbS9kaXN0L21vcnBoZG9tLWVzbS5qc1xudmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgPSAxMTtcbmZ1bmN0aW9uIG1vcnBoQXR0cnMoZnJvbU5vZGUsIHRvTm9kZSkge1xuICB2YXIgdG9Ob2RlQXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgdmFyIGF0dHI7XG4gIHZhciBhdHRyTmFtZTtcbiAgdmFyIGF0dHJOYW1lc3BhY2VVUkk7XG4gIHZhciBhdHRyVmFsdWU7XG4gIHZhciBmcm9tVmFsdWU7XG4gIGlmICh0b05vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgfHwgZnJvbU5vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIgaSA9IHRvTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgYXR0ciA9IHRvTm9kZUF0dHJzW2ldO1xuICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICBhdHRyVmFsdWUgPSBhdHRyLnZhbHVlO1xuICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuICAgICAgZnJvbVZhbHVlID0gZnJvbU5vZGUuZ2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgIGlmIChhdHRyLnByZWZpeCA9PT0gXCJ4bWxuc1wiKSB7XG4gICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXIgZnJvbU5vZGVBdHRycyA9IGZyb21Ob2RlLmF0dHJpYnV0ZXM7XG4gIGZvciAodmFyIGQgPSBmcm9tTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGQgPj0gMDsgZC0tKSB7XG4gICAgYXR0ciA9IGZyb21Ob2RlQXR0cnNbZF07XG4gICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgYXR0ck5hbWVzcGFjZVVSSSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpKSB7XG4gICAgICAgIGZyb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlKGF0dHJOYW1lKSkge1xuICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxudmFyIHJhbmdlO1xudmFyIE5TX1hIVE1MID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG52YXIgZG9jID0gdHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiID8gdm9pZCAwIDogZG9jdW1lbnQ7XG52YXIgSEFTX1RFTVBMQVRFX1NVUFBPUlQgPSAhIWRvYyAmJiBcImNvbnRlbnRcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xudmFyIEhBU19SQU5HRV9TVVBQT1JUID0gISFkb2MgJiYgZG9jLmNyZWF0ZVJhbmdlICYmIFwiY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50XCIgaW4gZG9jLmNyZWF0ZVJhbmdlKCk7XG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpIHtcbiAgdmFyIHRlbXBsYXRlID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyO1xuICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzWzBdO1xufVxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tUmFuZ2Uoc3RyKSB7XG4gIGlmICghcmFuZ2UpIHtcbiAgICByYW5nZSA9IGRvYy5jcmVhdGVSYW5nZSgpO1xuICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICB9XG4gIHZhciBmcmFnbWVudCA9IHJhbmdlLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzdHIpO1xuICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVdyYXAoc3RyKSB7XG4gIHZhciBmcmFnbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KFwiYm9keVwiKTtcbiAgZnJhZ21lbnQuaW5uZXJIVE1MID0gc3RyO1xuICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cbmZ1bmN0aW9uIHRvRWxlbWVudChzdHIpIHtcbiAgc3RyID0gc3RyLnRyaW0oKTtcbiAgaWYgKEhBU19URU1QTEFURV9TVVBQT1JUKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cik7XG4gIH0gZWxzZSBpZiAoSEFTX1JBTkdFX1NVUFBPUlQpIHtcbiAgICByZXR1cm4gY3JlYXRlRnJhZ21lbnRGcm9tUmFuZ2Uoc3RyKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlRnJhZ21lbnRGcm9tV3JhcChzdHIpO1xufVxuZnVuY3Rpb24gY29tcGFyZU5vZGVOYW1lcyhmcm9tRWwsIHRvRWwpIHtcbiAgdmFyIGZyb21Ob2RlTmFtZSA9IGZyb21FbC5ub2RlTmFtZTtcbiAgdmFyIHRvTm9kZU5hbWUgPSB0b0VsLm5vZGVOYW1lO1xuICB2YXIgZnJvbUNvZGVTdGFydCwgdG9Db2RlU3RhcnQ7XG4gIGlmIChmcm9tTm9kZU5hbWUgPT09IHRvTm9kZU5hbWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmcm9tQ29kZVN0YXJ0ID0gZnJvbU5vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG4gIHRvQ29kZVN0YXJ0ID0gdG9Ob2RlTmFtZS5jaGFyQ29kZUF0KDApO1xuICBpZiAoZnJvbUNvZGVTdGFydCA8PSA5MCAmJiB0b0NvZGVTdGFydCA+PSA5Nykge1xuICAgIHJldHVybiBmcm9tTm9kZU5hbWUgPT09IHRvTm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0b0NvZGVTdGFydCA8PSA5MCAmJiBmcm9tQ29kZVN0YXJ0ID49IDk3KSB7XG4gICAgcmV0dXJuIHRvTm9kZU5hbWUgPT09IGZyb21Ob2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWUsIG5hbWVzcGFjZVVSSSkge1xuICByZXR1cm4gIW5hbWVzcGFjZVVSSSB8fCBuYW1lc3BhY2VVUkkgPT09IE5TX1hIVE1MID8gZG9jLmNyZWF0ZUVsZW1lbnQobmFtZSkgOiBkb2MuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgbmFtZSk7XG59XG5mdW5jdGlvbiBtb3ZlQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKSB7XG4gIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICB2YXIgbmV4dENoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgdG9FbC5hcHBlbmRDaGlsZChjdXJDaGlsZCk7XG4gICAgY3VyQ2hpbGQgPSBuZXh0Q2hpbGQ7XG4gIH1cbiAgcmV0dXJuIHRvRWw7XG59XG5mdW5jdGlvbiBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgbmFtZSkge1xuICBpZiAoZnJvbUVsW25hbWVdICE9PSB0b0VsW25hbWVdKSB7XG4gICAgZnJvbUVsW25hbWVdID0gdG9FbFtuYW1lXTtcbiAgICBpZiAoZnJvbUVsW25hbWVdKSB7XG4gICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKG5hbWUsIFwiXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIH1cbiAgfVxufVxudmFyIHNwZWNpYWxFbEhhbmRsZXJzID0ge1xuICBPUFRJT046IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBwYXJlbnROb2RlID0gZnJvbUVsLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgIHZhciBwYXJlbnROYW1lID0gcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgaWYgKHBhcmVudE5hbWUgPT09IFwiT1BUR1JPVVBcIikge1xuICAgICAgICBwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBwYXJlbnROYW1lID0gcGFyZW50Tm9kZSAmJiBwYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9XG4gICAgICBpZiAocGFyZW50TmFtZSA9PT0gXCJTRUxFQ1RcIiAmJiAhcGFyZW50Tm9kZS5oYXNBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSkge1xuICAgICAgICBpZiAoZnJvbUVsLmhhc0F0dHJpYnV0ZShcInNlbGVjdGVkXCIpICYmICF0b0VsLnNlbGVjdGVkKSB7XG4gICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShcInNlbGVjdGVkXCIsIFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgXCJzZWxlY3RlZFwiKTtcbiAgfSxcbiAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCBcImNoZWNrZWRcIik7XG4gICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsIFwiZGlzYWJsZWRcIik7XG4gICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gdG9FbC52YWx1ZSkge1xuICAgICAgZnJvbUVsLnZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICB9XG4gICAgaWYgKCF0b0VsLmhhc0F0dHJpYnV0ZShcInZhbHVlXCIpKSB7XG4gICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgfVxuICB9LFxuICBURVhUQVJFQTogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICBpZiAoZnJvbUVsLnZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgZnJvbUVsLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICAgIHZhciBmaXJzdENoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgaWYgKGZpcnN0Q2hpbGQpIHtcbiAgICAgIHZhciBvbGRWYWx1ZSA9IGZpcnN0Q2hpbGQubm9kZVZhbHVlO1xuICAgICAgaWYgKG9sZFZhbHVlID09IG5ld1ZhbHVlIHx8ICFuZXdWYWx1ZSAmJiBvbGRWYWx1ZSA9PSBmcm9tRWwucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZmlyc3RDaGlsZC5ub2RlVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH0sXG4gIFNFTEVDVDogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgaWYgKCF0b0VsLmhhc0F0dHJpYnV0ZShcIm11bHRpcGxlXCIpKSB7XG4gICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGN1ckNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgb3B0Z3JvdXA7XG4gICAgICB2YXIgbm9kZU5hbWU7XG4gICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZSAmJiBjdXJDaGlsZC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBpZiAobm9kZU5hbWUgPT09IFwiT1BUR1JPVVBcIikge1xuICAgICAgICAgIG9wdGdyb3VwID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5maXJzdENoaWxkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gXCJPUFRJT05cIikge1xuICAgICAgICAgICAgaWYgKGN1ckNoaWxkLmhhc0F0dHJpYnV0ZShcInNlbGVjdGVkXCIpKSB7XG4gICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnJvbUVsLnNlbGVjdGVkSW5kZXggPSBzZWxlY3RlZEluZGV4O1xuICAgIH1cbiAgfVxufTtcbnZhciBFTEVNRU5UX05PREUgPSAxO1xudmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUkMSA9IDExO1xudmFyIFRFWFRfTk9ERSA9IDM7XG52YXIgQ09NTUVOVF9OT0RFID0gODtcbmZ1bmN0aW9uIG5vb3AoKSB7XG59XG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFwiaWRcIikgfHwgbm9kZS5pZDtcbiAgfVxufVxuZnVuY3Rpb24gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMyKSB7XG4gIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbTIoZnJvbU5vZGUsIHRvTm9kZSwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRvTm9kZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKGZyb21Ob2RlLm5vZGVOYW1lID09PSBcIiNkb2N1bWVudFwiIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSBcIkhUTUxcIiB8fCBmcm9tTm9kZS5ub2RlTmFtZSA9PT0gXCJCT0RZXCIpIHtcbiAgICAgICAgdmFyIHRvTm9kZUh0bWwgPSB0b05vZGU7XG4gICAgICAgIHRvTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50KFwiaHRtbFwiKTtcbiAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICB0b05vZGUgPSB0b05vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuICAgIHZhciBnZXROb2RlS2V5ID0gb3B0aW9ucy5nZXROb2RlS2V5IHx8IGRlZmF1bHRHZXROb2RlS2V5O1xuICAgIHZhciBvbkJlZm9yZU5vZGVBZGRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25Ob2RlQWRkZWQgPSBvcHRpb25zLm9uTm9kZUFkZGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uQmVmb3JlRWxVcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBvbkVsVXBkYXRlZCA9IG9wdGlvbnMub25FbFVwZGF0ZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVOb2RlRGlzY2FyZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVEaXNjYXJkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25Ob2RlRGlzY2FyZGVkID0gb3B0aW9ucy5vbk5vZGVEaXNjYXJkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCA9IG9wdGlvbnMub25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBza2lwRnJvbUNoaWxkcmVuID0gb3B0aW9ucy5za2lwRnJvbUNoaWxkcmVuIHx8IG5vb3A7XG4gICAgdmFyIGFkZENoaWxkID0gb3B0aW9ucy5hZGRDaGlsZCB8fCBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKSB7XG4gICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9O1xuICAgIHZhciBjaGlsZHJlbk9ubHkgPSBvcHRpb25zLmNoaWxkcmVuT25seSA9PT0gdHJ1ZTtcbiAgICB2YXIgZnJvbU5vZGVzTG9va3VwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIga2V5ZWRSZW1vdmFsTGlzdCA9IFtdO1xuICAgIGZ1bmN0aW9uIGFkZEtleWVkUmVtb3ZhbChrZXkpIHtcbiAgICAgIGtleWVkUmVtb3ZhbExpc3QucHVzaChrZXkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICAgIHZhciBrZXkgPSB2b2lkIDA7XG4gICAgICAgICAgaWYgKHNraXBLZXllZE5vZGVzICYmIChrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKSkpIHtcbiAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChrZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgaWYgKGN1ckNoaWxkLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMoY3VyQ2hpbGQsIHNraXBLZXllZE5vZGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUsIHBhcmVudE5vZGUsIHNraXBLZXllZE5vZGVzKSB7XG4gICAgICBpZiAob25CZWZvcmVOb2RlRGlzY2FyZGVkKG5vZGUpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuICAgICAgb25Ob2RlRGlzY2FyZGVkKG5vZGUpO1xuICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSwgc2tpcEtleWVkTm9kZXMpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEpIHtcbiAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBjdXJDaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5kZXhUcmVlKGN1ckNoaWxkKTtcbiAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGluZGV4VHJlZShmcm9tTm9kZSk7XG4gICAgZnVuY3Rpb24gaGFuZGxlTm9kZUFkZGVkKGVsKSB7XG4gICAgICBvbk5vZGVBZGRlZChlbCk7XG4gICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICB2YXIgdW5tYXRjaGVkRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2tleV07XG4gICAgICAgICAgaWYgKHVubWF0Y2hlZEZyb21FbCAmJiBjb21wYXJlTm9kZU5hbWVzKGN1ckNoaWxkLCB1bm1hdGNoZWRGcm9tRWwpKSB7XG4gICAgICAgICAgICBjdXJDaGlsZC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgIG1vcnBoRWwodW5tYXRjaGVkRnJvbUVsLCBjdXJDaGlsZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkyKSB7XG4gICAgICB2YXIgdG9FbEtleSA9IGdldE5vZGVLZXkodG9FbCk7XG4gICAgICBpZiAodG9FbEtleSkge1xuICAgICAgICBkZWxldGUgZnJvbU5vZGVzTG9va3VwW3RvRWxLZXldO1xuICAgICAgfVxuICAgICAgaWYgKCFjaGlsZHJlbk9ubHkyKSB7XG4gICAgICAgIGlmIChvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3JwaEF0dHJzMihmcm9tRWwsIHRvRWwpO1xuICAgICAgICBvbkVsVXBkYXRlZChmcm9tRWwpO1xuICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZyb21FbC5ub2RlTmFtZSAhPT0gXCJURVhUQVJFQVwiKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXJzLlRFWFRBUkVBKGZyb21FbCwgdG9FbCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKSB7XG4gICAgICB2YXIgc2tpcEZyb20gPSBza2lwRnJvbUNoaWxkcmVuKGZyb21FbCk7XG4gICAgICB2YXIgY3VyVG9Ob2RlQ2hpbGQgPSB0b0VsLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgICAgdmFyIGN1clRvTm9kZUtleTtcbiAgICAgIHZhciBjdXJGcm9tTm9kZUtleTtcbiAgICAgIHZhciBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB2YXIgdG9OZXh0U2libGluZztcbiAgICAgIHZhciBtYXRjaGluZ0Zyb21FbDtcbiAgICAgIG91dGVyOlxuICAgICAgICB3aGlsZSAoY3VyVG9Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICB0b05leHRTaWJsaW5nID0gY3VyVG9Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgY3VyVG9Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgd2hpbGUgKCFza2lwRnJvbSAmJiBjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlVHlwZSA9IGN1ckZyb21Ob2RlQ2hpbGQubm9kZVR5cGU7XG4gICAgICAgICAgICB2YXIgaXNDb21wYXRpYmxlID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJvbU5leHRTaWJsaW5nID09PSBtYXRjaGluZ0Zyb21FbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb21FbC5pbnNlcnRCZWZvcmUobWF0Y2hpbmdGcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbWF0Y2hpbmdGcm9tRWw7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGlzQ29tcGF0aWJsZSAhPT0gZmFsc2UgJiYgY29tcGFyZU5vZGVOYW1lcyhjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgICAgbW9ycGhFbChjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IGN1ckZyb21Ob2RlVHlwZSA9PSBDT01NRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSA9IGN1clRvTm9kZUNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoY3VyRnJvbU5vZGVLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgICBpZiAoIXNraXBGcm9tKSB7XG4gICAgICAgICAgICAgIGFkZENoaWxkKGZyb21FbCwgbWF0Y2hpbmdGcm9tRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9ycGhFbChtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICBpZiAob25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmFjdHVhbGl6ZSkge1xuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gY3VyVG9Ob2RlQ2hpbGQuYWN0dWFsaXplKGZyb21FbC5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYWRkQ2hpbGQoZnJvbUVsLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICBjbGVhbnVwRnJvbUVsKGZyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgY3VyRnJvbU5vZGVLZXkpO1xuICAgICAgdmFyIHNwZWNpYWxFbEhhbmRsZXIgPSBzcGVjaWFsRWxIYW5kbGVyc1tmcm9tRWwubm9kZU5hbWVdO1xuICAgICAgaWYgKHNwZWNpYWxFbEhhbmRsZXIpIHtcbiAgICAgICAgc3BlY2lhbEVsSGFuZGxlcihmcm9tRWwsIHRvRWwpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG4gICAgaWYgKCFjaGlsZHJlbk9ubHkpIHtcbiAgICAgIGlmIChtb3JwaGVkTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgaWYgKCFjb21wYXJlTm9kZU5hbWVzKGZyb21Ob2RlLCB0b05vZGUpKSB7XG4gICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoZnJvbU5vZGUpO1xuICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSBtb3ZlQ2hpbGRyZW4oZnJvbU5vZGUsIGNyZWF0ZUVsZW1lbnROUyh0b05vZGUubm9kZU5hbWUsIHRvTm9kZS5uYW1lc3BhY2VVUkkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9ycGhlZE5vZGUgPSB0b05vZGU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobW9ycGhlZE5vZGVUeXBlID09PSBURVhUX05PREUgfHwgbW9ycGhlZE5vZGVUeXBlID09PSBDT01NRU5UX05PREUpIHtcbiAgICAgICAgaWYgKHRvTm9kZVR5cGUgPT09IG1vcnBoZWROb2RlVHlwZSkge1xuICAgICAgICAgIGlmIChtb3JwaGVkTm9kZS5ub2RlVmFsdWUgIT09IHRvTm9kZS5ub2RlVmFsdWUpIHtcbiAgICAgICAgICAgIG1vcnBoZWROb2RlLm5vZGVWYWx1ZSA9IHRvTm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobW9ycGhlZE5vZGUgPT09IHRvTm9kZSkge1xuICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBtb3JwaEVsKG1vcnBoZWROb2RlLCB0b05vZGUsIGNoaWxkcmVuT25seSk7XG4gICAgICBpZiAoa2V5ZWRSZW1vdmFsTGlzdCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHZhciBlbFRvUmVtb3ZlID0gZnJvbU5vZGVzTG9va3VwW2tleWVkUmVtb3ZhbExpc3RbaV1dO1xuICAgICAgICAgIGlmIChlbFRvUmVtb3ZlKSB7XG4gICAgICAgICAgICByZW1vdmVOb2RlKGVsVG9SZW1vdmUsIGVsVG9SZW1vdmUucGFyZW50Tm9kZSwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgaWYgKG1vcnBoZWROb2RlLmFjdHVhbGl6ZSkge1xuICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICB9XG4gICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gbW9ycGhlZE5vZGU7XG4gIH07XG59XG52YXIgbW9ycGhkb20gPSBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycyk7XG52YXIgbW9ycGhkb21fZXNtX2RlZmF1bHQgPSBtb3JwaGRvbTtcblxuLy8ganMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3BhdGNoLmpzXG52YXIgRE9NUGF0Y2ggPSBjbGFzcyB7XG4gIHN0YXRpYyBwYXRjaEVsKGZyb21FbCwgdG9FbCwgYWN0aXZlRWxlbWVudCkge1xuICAgIG1vcnBoZG9tX2VzbV9kZWZhdWx0KGZyb21FbCwgdG9FbCwge1xuICAgICAgY2hpbGRyZW5Pbmx5OiBmYWxzZSxcbiAgICAgIG9uQmVmb3JlRWxVcGRhdGVkOiAoZnJvbUVsMiwgdG9FbDIpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZUVsZW1lbnQgJiYgYWN0aXZlRWxlbWVudC5pc1NhbWVOb2RlKGZyb21FbDIpICYmIGRvbV9kZWZhdWx0LmlzRm9ybUlucHV0KGZyb21FbDIpKSB7XG4gICAgICAgICAgZG9tX2RlZmF1bHQubWVyZ2VGb2N1c2VkSW5wdXQoZnJvbUVsMiwgdG9FbDIpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNvbnN0cnVjdG9yKHZpZXcsIGNvbnRhaW5lciwgaWQsIGh0bWwsIHN0cmVhbXMsIHRhcmdldENJRCkge1xuICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0O1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnJvb3RJRCA9IHZpZXcucm9vdC5pZDtcbiAgICB0aGlzLmh0bWwgPSBodG1sO1xuICAgIHRoaXMuc3RyZWFtcyA9IHN0cmVhbXM7XG4gICAgdGhpcy5zdHJlYW1JbnNlcnRzID0ge307XG4gICAgdGhpcy50YXJnZXRDSUQgPSB0YXJnZXRDSUQ7XG4gICAgdGhpcy5jaWRQYXRjaCA9IGlzQ2lkKHRoaXMudGFyZ2V0Q0lEKTtcbiAgICB0aGlzLnBlbmRpbmdSZW1vdmVzID0gW107XG4gICAgdGhpcy5waHhSZW1vdmUgPSB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhcInJlbW92ZVwiKTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHtcbiAgICAgIGJlZm9yZWFkZGVkOiBbXSxcbiAgICAgIGJlZm9yZXVwZGF0ZWQ6IFtdLFxuICAgICAgYmVmb3JlcGh4Q2hpbGRBZGRlZDogW10sXG4gICAgICBhZnRlcmFkZGVkOiBbXSxcbiAgICAgIGFmdGVydXBkYXRlZDogW10sXG4gICAgICBhZnRlcmRpc2NhcmRlZDogW10sXG4gICAgICBhZnRlcnBoeENoaWxkQWRkZWQ6IFtdLFxuICAgICAgYWZ0ZXJ0cmFuc2l0aW9uc0Rpc2NhcmRlZDogW11cbiAgICB9O1xuICB9XG4gIGJlZm9yZShraW5kLCBjYWxsYmFjaykge1xuICAgIHRoaXMuY2FsbGJhY2tzW2BiZWZvcmUke2tpbmR9YF0ucHVzaChjYWxsYmFjayk7XG4gIH1cbiAgYWZ0ZXIoa2luZCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYWZ0ZXIke2tpbmR9YF0ucHVzaChjYWxsYmFjayk7XG4gIH1cbiAgdHJhY2tCZWZvcmUoa2luZCwgLi4uYXJncykge1xuICAgIHRoaXMuY2FsbGJhY2tzW2BiZWZvcmUke2tpbmR9YF0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKC4uLmFyZ3MpKTtcbiAgfVxuICB0cmFja0FmdGVyKGtpbmQsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYWZ0ZXIke2tpbmR9YF0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKC4uLmFyZ3MpKTtcbiAgfVxuICBtYXJrUHJ1bmFibGVDb250ZW50Rm9yUmVtb3ZhbCgpIHtcbiAgICBsZXQgcGh4VXBkYXRlID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSk7XG4gICAgZG9tX2RlZmF1bHQuYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT0ke1BIWF9TVFJFQU19XWAsIChlbCkgPT4gZWwuaW5uZXJIVE1MID0gXCJcIik7XG4gICAgZG9tX2RlZmF1bHQuYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT1hcHBlbmRdID4gKiwgWyR7cGh4VXBkYXRlfT1wcmVwZW5kXSA+ICpgLCAoZWwpID0+IHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUFJVTkUsIFwiXCIpO1xuICAgIH0pO1xuICB9XG4gIHBlcmZvcm0oKSB7XG4gICAgbGV0IHsgdmlldywgbGl2ZVNvY2tldCwgY29udGFpbmVyLCBodG1sIH0gPSB0aGlzO1xuICAgIGxldCB0YXJnZXRDb250YWluZXIgPSB0aGlzLmlzQ0lEUGF0Y2goKSA/IHRoaXMudGFyZ2V0Q0lEQ29udGFpbmVyKGh0bWwpIDogY29udGFpbmVyO1xuICAgIGlmICh0aGlzLmlzQ0lEUGF0Y2goKSAmJiAhdGFyZ2V0Q29udGFpbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBmb2N1c2VkID0gbGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KCk7XG4gICAgbGV0IHsgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCB9ID0gZm9jdXNlZCAmJiBkb21fZGVmYXVsdC5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSA/IGZvY3VzZWQgOiB7fTtcbiAgICBsZXQgcGh4VXBkYXRlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9VUERBVEUpO1xuICAgIGxldCBwaHhGZWVkYmFja0ZvciA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfRkVFREJBQ0tfRk9SKTtcbiAgICBsZXQgZGlzYWJsZVdpdGggPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSCk7XG4gICAgbGV0IHBoeFZpZXdwb3J0VG9wID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9WSUVXUE9SVF9UT1ApO1xuICAgIGxldCBwaHhWaWV3cG9ydEJvdHRvbSA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfVklFV1BPUlRfQk9UVE9NKTtcbiAgICBsZXQgcGh4VHJpZ2dlckV4dGVybmFsID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9UUklHR0VSX0FDVElPTik7XG4gICAgbGV0IGFkZGVkID0gW107XG4gICAgbGV0IHRyYWNrZWRJbnB1dHMgPSBbXTtcbiAgICBsZXQgdXBkYXRlcyA9IFtdO1xuICAgIGxldCBhcHBlbmRQcmVwZW5kVXBkYXRlcyA9IFtdO1xuICAgIGxldCBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBudWxsO1xuICAgIGxldCBkaWZmSFRNTCA9IGxpdmVTb2NrZXQudGltZShcInByZW1vcnBoIGNvbnRhaW5lciBwcmVwXCIsICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkRGlmZkhUTUwoY29udGFpbmVyLCBodG1sLCBwaHhVcGRhdGUsIHRhcmdldENvbnRhaW5lcik7XG4gICAgfSk7XG4gICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGNvbnRhaW5lcik7XG4gICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgY29udGFpbmVyLCBjb250YWluZXIpO1xuICAgIGxpdmVTb2NrZXQudGltZShcIm1vcnBoZG9tXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RyZWFtcy5mb3JFYWNoKChbcmVmLCBpbnNlcnRzLCBkZWxldGVJZHMsIHJlc2V0XSkgPT4ge1xuICAgICAgICBPYmplY3QuZW50cmllcyhpbnNlcnRzKS5mb3JFYWNoKChba2V5LCBbc3RyZWFtQXQsIGxpbWl0XV0pID0+IHtcbiAgICAgICAgICB0aGlzLnN0cmVhbUluc2VydHNba2V5XSA9IHsgcmVmLCBzdHJlYW1BdCwgbGltaXQgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXNldCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgZG9tX2RlZmF1bHQuYWxsKGNvbnRhaW5lciwgYFske1BIWF9TVFJFQU1fUkVGfT1cIiR7cmVmfVwiXWAsIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpbnNlcnRzW2NoaWxkLmlkXSkge1xuICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlSWRzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgICAgbGV0IGNoaWxkID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7aWR9XCJdYCk7XG4gICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgbW9ycGhkb21fZXNtX2RlZmF1bHQodGFyZ2V0Q29udGFpbmVyLCBkaWZmSFRNTCwge1xuICAgICAgICBjaGlsZHJlbk9ubHk6IHRhcmdldENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkgPT09IG51bGwsXG4gICAgICAgIGdldE5vZGVLZXk6IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvbV9kZWZhdWx0LmlzUGh4RGVzdHJveWVkKG5vZGUpID8gbnVsbCA6IG5vZGUuaWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNraXBGcm9tQ2hpbGRyZW46IChmcm9tKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGZyb20uZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkgPT09IFBIWF9TVFJFQU07XG4gICAgICAgIH0sXG4gICAgICAgIGFkZENoaWxkOiAocGFyZW50LCBjaGlsZCkgPT4ge1xuICAgICAgICAgIGxldCB7IHJlZiwgc3RyZWFtQXQsIGxpbWl0IH0gPSB0aGlzLmdldFN0cmVhbUluc2VydChjaGlsZCk7XG4gICAgICAgICAgaWYgKHJlZiA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9tX2RlZmF1bHQucHV0U3RpY2t5KGNoaWxkLCBQSFhfU1RSRUFNX1JFRiwgKGVsKSA9PiBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYsIHJlZikpO1xuICAgICAgICAgIGlmIChzdHJlYW1BdCA9PT0gMCkge1xuICAgICAgICAgICAgcGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgY2hpbGQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RyZWFtQXQgPT09IC0xKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RyZWFtQXQgPiAwKSB7XG4gICAgICAgICAgICBsZXQgc2libGluZyA9IEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKVtzdHJlYW1BdF07XG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBzaWJsaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGNoaWxkcmVuID0gbGltaXQgIT09IG51bGwgJiYgQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pO1xuICAgICAgICAgIGxldCBjaGlsZHJlblRvUmVtb3ZlID0gW107XG4gICAgICAgICAgaWYgKGxpbWl0ICYmIGxpbWl0IDwgMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCAqIC0xKSB7XG4gICAgICAgICAgICBjaGlsZHJlblRvUmVtb3ZlID0gY2hpbGRyZW4uc2xpY2UoMCwgY2hpbGRyZW4ubGVuZ3RoICsgbGltaXQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGltaXQgJiYgbGltaXQgPj0gMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCkge1xuICAgICAgICAgICAgY2hpbGRyZW5Ub1JlbW92ZSA9IGNoaWxkcmVuLnNsaWNlKGxpbWl0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hpbGRyZW5Ub1JlbW92ZS5mb3JFYWNoKChyZW1vdmVDaGlsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0cmVhbUluc2VydHNbcmVtb3ZlQ2hpbGQuaWRdKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KHJlbW92ZUNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVOb2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGRvbV9kZWZhdWx0Lm1heWJlQWRkUHJpdmF0ZUhvb2tzKGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pO1xuICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBlbCk7XG4gICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVBZGRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgaWYgKGVsLmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdGhpcy5tYXliZVJlT3JkZXJTdHJlYW0oZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50ICYmIGVsLnNyY3NldCkge1xuICAgICAgICAgICAgZWwuc3Jjc2V0ID0gZWwuc3Jjc2V0O1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50ICYmIGVsLmF1dG9wbGF5KSB7XG4gICAgICAgICAgICBlbC5wbGF5KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkb21fZGVmYXVsdC5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpIHtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgJiYgZG9tX2RlZmF1bHQuaXNGb3JtSW5wdXQoZWwpKSB7XG4gICAgICAgICAgICB0cmFja2VkSW5wdXRzLnB1c2goZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZG9tX2RlZmF1bHQuaXNQaHhDaGlsZChlbCkgJiYgdmlldy5vd25zRWxlbWVudChlbCkgfHwgZG9tX2RlZmF1bHQuaXNQaHhTdGlja3koZWwpICYmIHZpZXcub3duc0VsZW1lbnQoZWwucGFyZW50Tm9kZSkpIHtcbiAgICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcInBoeENoaWxkQWRkZWRcIiwgZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZGRlZC5wdXNoKGVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlRGlzY2FyZGVkOiAoZWwpID0+IHRoaXMub25Ob2RlRGlzY2FyZGVkKGVsKSxcbiAgICAgICAgb25CZWZvcmVOb2RlRGlzY2FyZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZiAoZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfUFJVTkUpICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGVsLnBhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgZWwuaWQgJiYgZG9tX2RlZmF1bHQuaXNQaHhVcGRhdGUoZWwucGFyZW50RWxlbWVudCwgcGh4VXBkYXRlLCBbUEhYX1NUUkVBTSwgXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5tYXliZVBlbmRpbmdSZW1vdmUoZWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnNraXBDSURTaWJsaW5nKGVsKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FbFVwZGF0ZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmIChkb21fZGVmYXVsdC5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpIHtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1cGRhdGVzLnB1c2goZWwpO1xuICAgICAgICAgIHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVFbFVwZGF0ZWQ6IChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgICAgICBkb21fZGVmYXVsdC5tYXliZUFkZFByaXZhdGVIb29rcyh0b0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pO1xuICAgICAgICAgIGRvbV9kZWZhdWx0LmNsZWFuQ2hpbGROb2Rlcyh0b0VsLCBwaHhVcGRhdGUpO1xuICAgICAgICAgIGlmICh0aGlzLnNraXBDSURTaWJsaW5nKHRvRWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkb21fZGVmYXVsdC5pc1BoeFN0aWNreShmcm9tRWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkb21fZGVmYXVsdC5pc0lnbm9yZWQoZnJvbUVsLCBwaHhVcGRhdGUpIHx8IGZyb21FbC5mb3JtICYmIGZyb21FbC5mb3JtLmlzU2FtZU5vZGUoZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkKSkge1xuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIGRvbV9kZWZhdWx0Lm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7IGlzSWdub3JlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpO1xuICAgICAgICAgICAgZG9tX2RlZmF1bHQuYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmcm9tRWwudHlwZSA9PT0gXCJudW1iZXJcIiAmJiAoZnJvbUVsLnZhbGlkaXR5ICYmIGZyb21FbC52YWxpZGl0eS5iYWRJbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFkb21fZGVmYXVsdC5zeW5jUGVuZGluZ1JlZihmcm9tRWwsIHRvRWwsIGRpc2FibGVXaXRoKSkge1xuICAgICAgICAgICAgaWYgKGRvbV9kZWZhdWx0LmlzVXBsb2FkSW5wdXQoZnJvbUVsKSkge1xuICAgICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbV9kZWZhdWx0LmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZG9tX2RlZmF1bHQuaXNQaHhDaGlsZCh0b0VsKSkge1xuICAgICAgICAgICAgbGV0IHByZXZTZXNzaW9uID0gZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTik7XG4gICAgICAgICAgICBkb21fZGVmYXVsdC5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwgeyBleGNsdWRlOiBbUEhYX1NUQVRJQ10gfSk7XG4gICAgICAgICAgICBpZiAocHJldlNlc3Npb24gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgcHJldlNlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290SUQpO1xuICAgICAgICAgICAgZG9tX2RlZmF1bHQuYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvbV9kZWZhdWx0LmNvcHlQcml2YXRlcyh0b0VsLCBmcm9tRWwpO1xuICAgICAgICAgIGxldCBpc0ZvY3VzZWRGb3JtRWwgPSBmb2N1c2VkICYmIGZyb21FbC5pc1NhbWVOb2RlKGZvY3VzZWQpICYmIGRvbV9kZWZhdWx0LmlzRm9ybUlucHV0KGZyb21FbCk7XG4gICAgICAgICAgaWYgKGlzRm9jdXNlZEZvcm1FbCAmJiBmcm9tRWwudHlwZSAhPT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIGRvbV9kZWZhdWx0Lm1lcmdlRm9jdXNlZElucHV0KGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICBkb21fZGVmYXVsdC5zeW5jQXR0cnNUb1Byb3BzKGZyb21FbCk7XG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKTtcbiAgICAgICAgICAgIGRvbV9kZWZhdWx0LmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpO1xuICAgICAgICAgICAgdHJhY2tlZElucHV0cy5wdXNoKGZyb21FbCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkb21fZGVmYXVsdC5pc1BoeFVwZGF0ZSh0b0VsLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pKSB7XG4gICAgICAgICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLnB1c2gobmV3IERPTVBvc3RNb3JwaFJlc3RvcmVyKGZyb21FbCwgdG9FbCwgdG9FbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9tX2RlZmF1bHQuc3luY0F0dHJzVG9Qcm9wcyh0b0VsKTtcbiAgICAgICAgICAgIGRvbV9kZWZhdWx0LmFwcGx5U3RpY2t5T3BlcmF0aW9ucyh0b0VsKTtcbiAgICAgICAgICAgIGlmICh0b0VsLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgJiYgZG9tX2RlZmF1bHQuaXNGb3JtSW5wdXQodG9FbCkpIHtcbiAgICAgICAgICAgICAgdHJhY2tlZElucHV0cy5wdXNoKHRvRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKGxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSkge1xuICAgICAgZGV0ZWN0RHVwbGljYXRlSWRzKCk7XG4gICAgfVxuICAgIGlmIChhcHBlbmRQcmVwZW5kVXBkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICBsaXZlU29ja2V0LnRpbWUoXCJwb3N0LW1vcnBoIGFwcGVuZC9wcmVwZW5kIHJlc3RvcmF0aW9uXCIsICgpID0+IHtcbiAgICAgICAgYXBwZW5kUHJlcGVuZFVwZGF0ZXMuZm9yRWFjaCgodXBkYXRlKSA9PiB1cGRhdGUucGVyZm9ybSgpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0cmFja2VkSW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICBkb21fZGVmYXVsdC5tYXliZUhpZGVGZWVkYmFjayh0YXJnZXRDb250YWluZXIsIGlucHV0LCBwaHhGZWVkYmFja0Zvcik7XG4gICAgfSk7XG4gICAgbGl2ZVNvY2tldC5zaWxlbmNlRXZlbnRzKCgpID0+IGRvbV9kZWZhdWx0LnJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKSk7XG4gICAgZG9tX2RlZmF1bHQuZGlzcGF0Y2hFdmVudChkb2N1bWVudCwgXCJwaHg6dXBkYXRlXCIpO1xuICAgIGFkZGVkLmZvckVhY2goKGVsKSA9PiB0aGlzLnRyYWNrQWZ0ZXIoXCJhZGRlZFwiLCBlbCkpO1xuICAgIHVwZGF0ZXMuZm9yRWFjaCgoZWwpID0+IHRoaXMudHJhY2tBZnRlcihcInVwZGF0ZWRcIiwgZWwpKTtcbiAgICB0aGlzLnRyYW5zaXRpb25QZW5kaW5nUmVtb3ZlcygpO1xuICAgIGlmIChleHRlcm5hbEZvcm1UcmlnZ2VyZWQpIHtcbiAgICAgIGxpdmVTb2NrZXQudW5sb2FkKCk7XG4gICAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkKS5zdWJtaXQuY2FsbChleHRlcm5hbEZvcm1UcmlnZ2VyZWQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBvbk5vZGVEaXNjYXJkZWQoZWwpIHtcbiAgICBpZiAoZG9tX2RlZmF1bHQuaXNQaHhDaGlsZChlbCkgfHwgZG9tX2RlZmF1bHQuaXNQaHhTdGlja3koZWwpKSB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGVsKTtcbiAgICB9XG4gICAgdGhpcy50cmFja0FmdGVyKFwiZGlzY2FyZGVkXCIsIGVsKTtcbiAgfVxuICBtYXliZVBlbmRpbmdSZW1vdmUobm9kZSkge1xuICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSh0aGlzLnBoeFJlbW92ZSkgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucGVuZGluZ1JlbW92ZXMucHVzaChub2RlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkge1xuICAgIGlmICghdGhpcy5tYXliZVBlbmRpbmdSZW1vdmUoY2hpbGQpKSB7XG4gICAgICBjaGlsZC5yZW1vdmUoKTtcbiAgICAgIHRoaXMub25Ob2RlRGlzY2FyZGVkKGNoaWxkKTtcbiAgICB9XG4gIH1cbiAgZ2V0U3RyZWFtSW5zZXJ0KGVsKSB7XG4gICAgbGV0IGluc2VydCA9IGVsLmlkID8gdGhpcy5zdHJlYW1JbnNlcnRzW2VsLmlkXSA6IHt9O1xuICAgIHJldHVybiBpbnNlcnQgfHwge307XG4gIH1cbiAgbWF5YmVSZU9yZGVyU3RyZWFtKGVsKSB7XG4gICAgbGV0IHsgcmVmLCBzdHJlYW1BdCwgbGltaXQgfSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGVsKTtcbiAgICBpZiAoc3RyZWFtQXQgPT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkb21fZGVmYXVsdC5wdXRTdGlja3koZWwsIFBIWF9TVFJFQU1fUkVGLCAoZWwyKSA9PiBlbDIuc2V0QXR0cmlidXRlKFBIWF9TVFJFQU1fUkVGLCByZWYpKTtcbiAgICBpZiAoc3RyZWFtQXQgPT09IDApIHtcbiAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBlbC5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICB9IGVsc2UgaWYgKHN0cmVhbUF0ID4gMCkge1xuICAgICAgbGV0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShlbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKTtcbiAgICAgIGxldCBvbGRJbmRleCA9IGNoaWxkcmVuLmluZGV4T2YoZWwpO1xuICAgICAgaWYgKHN0cmVhbUF0ID49IGNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgZWwucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgc2libGluZyA9IGNoaWxkcmVuW3N0cmVhbUF0XTtcbiAgICAgICAgaWYgKG9sZEluZGV4ID4gc3RyZWFtQXQpIHtcbiAgICAgICAgICBlbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbCwgc2libGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZWwsIHNpYmxpbmcubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB0cmFuc2l0aW9uUGVuZGluZ1JlbW92ZXMoKSB7XG4gICAgbGV0IHsgcGVuZGluZ1JlbW92ZXMsIGxpdmVTb2NrZXQgfSA9IHRoaXM7XG4gICAgaWYgKHBlbmRpbmdSZW1vdmVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxpdmVTb2NrZXQudHJhbnNpdGlvblJlbW92ZXMocGVuZGluZ1JlbW92ZXMpO1xuICAgICAgbGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgcGVuZGluZ1JlbW92ZXMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBsZXQgY2hpbGQgPSBkb21fZGVmYXVsdC5maXJzdFBoeENoaWxkKGVsKTtcbiAgICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWwucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBwZW5kaW5nUmVtb3Zlcyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaXNDSURQYXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5jaWRQYXRjaDtcbiAgfVxuICBza2lwQ0lEU2libGluZyhlbCkge1xuICAgIHJldHVybiBlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9TS0lQKSAhPT0gbnVsbDtcbiAgfVxuICB0YXJnZXRDSURDb250YWluZXIoaHRtbCkge1xuICAgIGlmICghdGhpcy5pc0NJRFBhdGNoKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IFtmaXJzdCwgLi4ucmVzdF0gPSBkb21fZGVmYXVsdC5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5jb250YWluZXIsIHRoaXMudGFyZ2V0Q0lEKTtcbiAgICBpZiAocmVzdC5sZW5ndGggPT09IDAgJiYgZG9tX2RlZmF1bHQuY2hpbGROb2RlTGVuZ3RoKGh0bWwpID09PSAxKSB7XG4gICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaXJzdCAmJiBmaXJzdC5wYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICBidWlsZERpZmZIVE1MKGNvbnRhaW5lciwgaHRtbCwgcGh4VXBkYXRlLCB0YXJnZXRDb250YWluZXIpIHtcbiAgICBsZXQgaXNDSURQYXRjaCA9IHRoaXMuaXNDSURQYXRjaCgpO1xuICAgIGxldCBpc0NJRFdpdGhTaW5nbGVSb290ID0gaXNDSURQYXRjaCAmJiB0YXJnZXRDb250YWluZXIuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpID09PSB0aGlzLnRhcmdldENJRC50b1N0cmluZygpO1xuICAgIGlmICghaXNDSURQYXRjaCB8fCBpc0NJRFdpdGhTaW5nbGVSb290KSB7XG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRpZmZDb250YWluZXIgPSBudWxsO1xuICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICAgICAgZGlmZkNvbnRhaW5lciA9IGRvbV9kZWZhdWx0LmNsb25lTm9kZSh0YXJnZXRDb250YWluZXIpO1xuICAgICAgbGV0IFtmaXJzdENvbXBvbmVudCwgLi4ucmVzdF0gPSBkb21fZGVmYXVsdC5maW5kQ29tcG9uZW50Tm9kZUxpc3QoZGlmZkNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgIHJlc3QuZm9yRWFjaCgoZWwpID0+IGVsLnJlbW92ZSgpKTtcbiAgICAgIEFycmF5LmZyb20oZGlmZkNvbnRhaW5lci5jaGlsZE5vZGVzKS5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICBpZiAoY2hpbGQuaWQgJiYgY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGNoaWxkLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSAhPT0gdGhpcy50YXJnZXRDSUQudG9TdHJpbmcoKSkge1xuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShQSFhfU0tJUCwgXCJcIik7XG4gICAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2RlcykuZm9yRWFjaCgoZWwpID0+IGRpZmZDb250YWluZXIuaW5zZXJ0QmVmb3JlKGVsLCBmaXJzdENvbXBvbmVudCkpO1xuICAgICAgZmlyc3RDb21wb25lbnQucmVtb3ZlKCk7XG4gICAgICByZXR1cm4gZGlmZkNvbnRhaW5lci5vdXRlckhUTUw7XG4gICAgfVxuICB9XG4gIGluZGV4T2YocGFyZW50LCBjaGlsZCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuaW5kZXhPZihjaGlsZCk7XG4gIH1cbn07XG5cbi8vIGpzL3Bob2VuaXhfbGl2ZV92aWV3L3JlbmRlcmVkLmpzXG52YXIgUmVuZGVyZWQgPSBjbGFzcyB7XG4gIHN0YXRpYyBleHRyYWN0KGRpZmYpIHtcbiAgICBsZXQgeyBbUkVQTFldOiByZXBseSwgW0VWRU5UU106IGV2ZW50cywgW1RJVExFXTogdGl0bGUgfSA9IGRpZmY7XG4gICAgZGVsZXRlIGRpZmZbUkVQTFldO1xuICAgIGRlbGV0ZSBkaWZmW0VWRU5UU107XG4gICAgZGVsZXRlIGRpZmZbVElUTEVdO1xuICAgIHJldHVybiB7IGRpZmYsIHRpdGxlLCByZXBseTogcmVwbHkgfHwgbnVsbCwgZXZlbnRzOiBldmVudHMgfHwgW10gfTtcbiAgfVxuICBjb25zdHJ1Y3Rvcih2aWV3SWQsIHJlbmRlcmVkKSB7XG4gICAgdGhpcy52aWV3SWQgPSB2aWV3SWQ7XG4gICAgdGhpcy5yZW5kZXJlZCA9IHt9O1xuICAgIHRoaXMubWVyZ2VEaWZmKHJlbmRlcmVkKTtcbiAgfVxuICBwYXJlbnRWaWV3SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlld0lkO1xuICB9XG4gIHRvU3RyaW5nKG9ubHlDaWRzKSB7XG4gICAgbGV0IFtzdHIsIHN0cmVhbXNdID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyh0aGlzLnJlbmRlcmVkLCB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdLCBvbmx5Q2lkcyk7XG4gICAgcmV0dXJuIFtzdHIsIHN0cmVhbXNdO1xuICB9XG4gIHJlY3Vyc2l2ZVRvU3RyaW5nKHJlbmRlcmVkLCBjb21wb25lbnRzID0gcmVuZGVyZWRbQ09NUE9ORU5UU10sIG9ubHlDaWRzKSB7XG4gICAgb25seUNpZHMgPSBvbmx5Q2lkcyA/IG5ldyBTZXQob25seUNpZHMpIDogbnVsbDtcbiAgICBsZXQgb3V0cHV0ID0geyBidWZmZXI6IFwiXCIsIGNvbXBvbmVudHMsIG9ubHlDaWRzLCBzdHJlYW1zOiBuZXcgU2V0KCkgfTtcbiAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCBudWxsLCBvdXRwdXQpO1xuICAgIHJldHVybiBbb3V0cHV0LmJ1ZmZlciwgb3V0cHV0LnN0cmVhbXNdO1xuICB9XG4gIGNvbXBvbmVudENJRHMoZGlmZikge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhkaWZmW0NPTVBPTkVOVFNdIHx8IHt9KS5tYXAoKGkpID0+IHBhcnNlSW50KGkpKTtcbiAgfVxuICBpc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpIHtcbiAgICBpZiAoIWRpZmZbQ09NUE9ORU5UU10pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRpZmYpLmxlbmd0aCA9PT0gMTtcbiAgfVxuICBnZXRDb21wb25lbnQoZGlmZiwgY2lkKSB7XG4gICAgcmV0dXJuIGRpZmZbQ09NUE9ORU5UU11bY2lkXTtcbiAgfVxuICBtZXJnZURpZmYoZGlmZikge1xuICAgIGxldCBuZXdjID0gZGlmZltDT01QT05FTlRTXTtcbiAgICBsZXQgY2FjaGUgPSB7fTtcbiAgICBkZWxldGUgZGlmZltDT01QT05FTlRTXTtcbiAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy5tdXRhYmxlTWVyZ2UodGhpcy5yZW5kZXJlZCwgZGlmZik7XG4gICAgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10gfHwge307XG4gICAgaWYgKG5ld2MpIHtcbiAgICAgIGxldCBvbGRjID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXTtcbiAgICAgIGZvciAobGV0IGNpZCBpbiBuZXdjKSB7XG4gICAgICAgIG5ld2NbY2lkXSA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChjaWQsIG5ld2NbY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgY2lkIGluIG5ld2MpIHtcbiAgICAgICAgb2xkY1tjaWRdID0gbmV3Y1tjaWRdO1xuICAgICAgfVxuICAgICAgZGlmZltDT01QT05FTlRTXSA9IG5ld2M7XG4gICAgfVxuICB9XG4gIGNhY2hlZEZpbmRDb21wb25lbnQoY2lkLCBjZGlmZiwgb2xkYywgbmV3YywgY2FjaGUpIHtcbiAgICBpZiAoY2FjaGVbY2lkXSkge1xuICAgICAgcmV0dXJuIGNhY2hlW2NpZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZGlmZiwgc3RhdCwgc2NpZCA9IGNkaWZmW1NUQVRJQ107XG4gICAgICBpZiAoaXNDaWQoc2NpZCkpIHtcbiAgICAgICAgbGV0IHRkaWZmO1xuICAgICAgICBpZiAoc2NpZCA+IDApIHtcbiAgICAgICAgICB0ZGlmZiA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChzY2lkLCBuZXdjW3NjaWRdLCBvbGRjLCBuZXdjLCBjYWNoZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGRpZmYgPSBvbGRjWy1zY2lkXTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ID0gdGRpZmZbU1RBVElDXTtcbiAgICAgICAgbmRpZmYgPSB0aGlzLmNsb25lTWVyZ2UodGRpZmYsIGNkaWZmKTtcbiAgICAgICAgbmRpZmZbU1RBVElDXSA9IHN0YXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZGlmZiA9IGNkaWZmW1NUQVRJQ10gIT09IHZvaWQgMCA/IGNkaWZmIDogdGhpcy5jbG9uZU1lcmdlKG9sZGNbY2lkXSB8fCB7fSwgY2RpZmYpO1xuICAgICAgfVxuICAgICAgY2FjaGVbY2lkXSA9IG5kaWZmO1xuICAgICAgcmV0dXJuIG5kaWZmO1xuICAgIH1cbiAgfVxuICBtdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlW1NUQVRJQ10gIT09IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgfVxuICBkb011dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XTtcbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XTtcbiAgICAgIGxldCBpc09ialZhbCA9IGlzT2JqZWN0KHZhbCk7XG4gICAgICBpZiAoaXNPYmpWYWwgJiYgdmFsW1NUQVRJQ10gPT09IHZvaWQgMCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKSB7XG4gICAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0VmFsLCB2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNsb25lTWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBsZXQgbWVyZ2VkID0geyAuLi50YXJnZXQsIC4uLnNvdXJjZSB9O1xuICAgIGZvciAobGV0IGtleSBpbiBtZXJnZWQpIHtcbiAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XTtcbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XTtcbiAgICAgIGlmIChpc09iamVjdCh2YWwpICYmIHZhbFtTVEFUSUNdID09PSB2b2lkIDAgJiYgaXNPYmplY3QodGFyZ2V0VmFsKSkge1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHZhbCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWQ7XG4gIH1cbiAgY29tcG9uZW50VG9TdHJpbmcoY2lkKSB7XG4gICAgbGV0IFtzdHIsIHN0cmVhbXNdID0gdGhpcy5yZWN1cnNpdmVDSURUb1N0cmluZyh0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdLCBjaWQsIG51bGwsIGZhbHNlKTtcbiAgICByZXR1cm4gW3N0ciwgc3RyZWFtc107XG4gIH1cbiAgcHJ1bmVDSURzKGNpZHMpIHtcbiAgICBjaWRzLmZvckVhY2goKGNpZCkgPT4gZGVsZXRlIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSk7XG4gIH1cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVkO1xuICB9XG4gIGlzTmV3RmluZ2VycHJpbnQoZGlmZiA9IHt9KSB7XG4gICAgcmV0dXJuICEhZGlmZltTVEFUSUNdO1xuICB9XG4gIHRlbXBsYXRlU3RhdGljKHBhcnQsIHRlbXBsYXRlcykge1xuICAgIGlmICh0eXBlb2YgcGFydCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlc1twYXJ0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgfVxuICB9XG4gIHRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCkge1xuICAgIGlmIChyZW5kZXJlZFtEWU5BTUlDU10pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbXByZWhlbnNpb25Ub0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpO1xuICAgIH1cbiAgICBsZXQgeyBbU1RBVElDXTogc3RhdGljcyB9ID0gcmVuZGVyZWQ7XG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKTtcbiAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzdGF0aWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZFtpIC0gMV0sIHRlbXBsYXRlcywgb3V0cHV0KTtcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXTtcbiAgICB9XG4gIH1cbiAgY29tcHJlaGVuc2lvblRvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCkge1xuICAgIGxldCB7IFtEWU5BTUlDU106IGR5bmFtaWNzLCBbU1RBVElDXTogc3RhdGljcywgW1NUUkVBTV06IHN0cmVhbSB9ID0gcmVuZGVyZWQ7XG4gICAgbGV0IFtfcmVmLCBfaW5zZXJ0cywgZGVsZXRlSWRzLCByZXNldF0gPSBzdHJlYW0gfHwgW251bGwsIHt9LCBbXSwgbnVsbF07XG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKTtcbiAgICBsZXQgY29tcFRlbXBsYXRlcyA9IHRlbXBsYXRlcyB8fCByZW5kZXJlZFtURU1QTEFURVNdO1xuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgZHluYW1pY3MubGVuZ3RoOyBkKyspIHtcbiAgICAgIGxldCBkeW5hbWljID0gZHluYW1pY3NbZF07XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF07XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5keW5hbWljVG9CdWZmZXIoZHluYW1pY1tpIC0gMV0sIGNvbXBUZW1wbGF0ZXMsIG91dHB1dCk7XG4gICAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN0cmVhbSAhPT0gdm9pZCAwICYmIChyZW5kZXJlZFtEWU5BTUlDU10ubGVuZ3RoID4gMCB8fCBkZWxldGVJZHMubGVuZ3RoID4gMCB8fCByZXNldCkpIHtcbiAgICAgIGRlbGV0ZSByZW5kZXJlZFtTVFJFQU1dO1xuICAgICAgcmVuZGVyZWRbRFlOQU1JQ1NdID0gW107XG4gICAgICBvdXRwdXQuc3RyZWFtcy5hZGQoc3RyZWFtKTtcbiAgICB9XG4gIH1cbiAgZHluYW1pY1RvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCkge1xuICAgIGlmICh0eXBlb2YgcmVuZGVyZWQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpO1xuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdHI7XG4gICAgICBvdXRwdXQuc3RyZWFtcyA9IG5ldyBTZXQoWy4uLm91dHB1dC5zdHJlYW1zLCAuLi5zdHJlYW1zXSk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChyZW5kZXJlZCkpIHtcbiAgICAgIHRoaXMudG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LmJ1ZmZlciArPSByZW5kZXJlZDtcbiAgICB9XG4gIH1cbiAgcmVjdXJzaXZlQ0lEVG9TdHJpbmcoY29tcG9uZW50cywgY2lkLCBvbmx5Q2lkcywgYWxsb3dSb290Q29tbWVudHMgPSB0cnVlKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY2lkXSB8fCBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvciBDSUQgJHtjaWR9YCwgY29tcG9uZW50cyk7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlY3Vyc2l2ZVRvU3RyaW5nKGNvbXBvbmVudCwgY29tcG9uZW50cywgb25seUNpZHMpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgbGV0IGNvbnRhaW5lciA9IHRlbXBsYXRlLmNvbnRlbnQ7XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZCk7XG4gICAgbGV0IFtoYXNDaGlsZE5vZGVzLCBoYXNDaGlsZENvbXBvbmVudHNdID0gQXJyYXkuZnJvbShjb250YWluZXIuY2hpbGROb2RlcykucmVkdWNlKChbaGFzTm9kZXMsIGhhc0NvbXBvbmVudHNdLCBjaGlsZCwgaSkgPT4ge1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICBpZiAoY2hpbGQuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKSB7XG4gICAgICAgICAgcmV0dXJuIFtoYXNOb2RlcywgdHJ1ZV07XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQsIGNpZCk7XG4gICAgICAgIGlmICghY2hpbGQuaWQpIHtcbiAgICAgICAgICBjaGlsZC5pZCA9IGAke3RoaXMucGFyZW50Vmlld0lkKCl9LSR7Y2lkfS0ke2l9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2tpcCkge1xuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShQSFhfU0tJUCwgXCJcIik7XG4gICAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RydWUsIGhhc0NvbXBvbmVudHNdO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5DT01NRU5UX05PREUpIHtcbiAgICAgICAgaWYgKCFhbGxvd1Jvb3RDb21tZW50cykge1xuICAgICAgICAgIGNoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbaGFzTm9kZXMsIGhhc0NvbXBvbmVudHNdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNoaWxkLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCIpIHtcbiAgICAgICAgICBsb2dFcnJvcihgb25seSBIVE1MIGVsZW1lbnQgdGFncyBhcmUgYWxsb3dlZCBhdCB0aGUgcm9vdCBvZiBjb21wb25lbnRzLlxuXG5nb3Q6IFwiJHtjaGlsZC5ub2RlVmFsdWUudHJpbSgpfVwiXG5cbndpdGhpbjpcbmAsIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpO1xuICAgICAgICAgIGNoaWxkLnJlcGxhY2VXaXRoKHRoaXMuY3JlYXRlU3BhbihjaGlsZC5ub2RlVmFsdWUsIGNpZCkpO1xuICAgICAgICAgIHJldHVybiBbdHJ1ZSwgaGFzQ29tcG9uZW50c107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGQucmVtb3ZlKCk7XG4gICAgICAgICAgcmV0dXJuIFtoYXNOb2RlcywgaGFzQ29tcG9uZW50c107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBbZmFsc2UsIGZhbHNlXSk7XG4gICAgaWYgKCFoYXNDaGlsZE5vZGVzICYmICFoYXNDaGlsZENvbXBvbmVudHMpIHtcbiAgICAgIGxvZ0Vycm9yKFwiZXhwZWN0ZWQgYXQgbGVhc3Qgb25lIEhUTUwgZWxlbWVudCB0YWcgaW5zaWRlIGEgY29tcG9uZW50LCBidXQgdGhlIGNvbXBvbmVudCBpcyBlbXB0eTpcXG5cIiwgdGVtcGxhdGUuaW5uZXJIVE1MLnRyaW0oKSk7XG4gICAgICByZXR1cm4gW3RoaXMuY3JlYXRlU3BhbihcIlwiLCBjaWQpLm91dGVySFRNTCwgc3RyZWFtc107XG4gICAgfSBlbHNlIGlmICghaGFzQ2hpbGROb2RlcyAmJiBoYXNDaGlsZENvbXBvbmVudHMpIHtcbiAgICAgIGxvZ0Vycm9yKFwiZXhwZWN0ZWQgYXQgbGVhc3Qgb25lIEhUTUwgZWxlbWVudCB0YWcgZGlyZWN0bHkgaW5zaWRlIGEgY29tcG9uZW50LCBidXQgb25seSBzdWJjb21wb25lbnRzIHdlcmUgZm91bmQuIEEgY29tcG9uZW50IG11c3QgcmVuZGVyIGF0IGxlYXN0IG9uZSBIVE1MIHRhZyBkaXJlY3RseSBpbnNpZGUgaXRzZWxmLlwiLCB0ZW1wbGF0ZS5pbm5lckhUTUwudHJpbSgpKTtcbiAgICAgIHJldHVybiBbdGVtcGxhdGUuaW5uZXJIVE1MLCBzdHJlYW1zXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFt0ZW1wbGF0ZS5pbm5lckhUTUwsIHN0cmVhbXNdO1xuICAgIH1cbiAgfVxuICBjcmVhdGVTcGFuKHRleHQsIGNpZCkge1xuICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgc3Bhbi5pbm5lclRleHQgPSB0ZXh0O1xuICAgIHNwYW4uc2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQsIGNpZCk7XG4gICAgcmV0dXJuIHNwYW47XG4gIH1cbn07XG5cbi8vIGpzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXdfaG9vay5qc1xudmFyIHZpZXdIb29rSUQgPSAxO1xudmFyIFZpZXdIb29rID0gY2xhc3Mge1xuICBzdGF0aWMgbWFrZUlEKCkge1xuICAgIHJldHVybiB2aWV3SG9va0lEKys7XG4gIH1cbiAgc3RhdGljIGVsZW1lbnRJRChlbCkge1xuICAgIHJldHVybiBlbC5waHhIb29rSWQ7XG4gIH1cbiAgY29uc3RydWN0b3IodmlldywgZWwsIGNhbGxiYWNrcykge1xuICAgIHRoaXMuX192aWV3ID0gdmlldztcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSB2aWV3LmxpdmVTb2NrZXQ7XG4gICAgdGhpcy5fX2NhbGxiYWNrcyA9IGNhbGxiYWNrcztcbiAgICB0aGlzLl9fbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLmVsLnBoeEhvb2tJZCA9IHRoaXMuY29uc3RydWN0b3IubWFrZUlEKCk7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX19jYWxsYmFja3MpIHtcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMuX19jYWxsYmFja3Nba2V5XTtcbiAgICB9XG4gIH1cbiAgX19tb3VudGVkKCkge1xuICAgIHRoaXMubW91bnRlZCAmJiB0aGlzLm1vdW50ZWQoKTtcbiAgfVxuICBfX3VwZGF0ZWQoKSB7XG4gICAgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpO1xuICB9XG4gIF9fYmVmb3JlVXBkYXRlKCkge1xuICAgIHRoaXMuYmVmb3JlVXBkYXRlICYmIHRoaXMuYmVmb3JlVXBkYXRlKCk7XG4gIH1cbiAgX19kZXN0cm95ZWQoKSB7XG4gICAgdGhpcy5kZXN0cm95ZWQgJiYgdGhpcy5kZXN0cm95ZWQoKTtcbiAgfVxuICBfX3JlY29ubmVjdGVkKCkge1xuICAgIGlmICh0aGlzLl9faXNEaXNjb25uZWN0ZWQpIHtcbiAgICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5yZWNvbm5lY3RlZCAmJiB0aGlzLnJlY29ubmVjdGVkKCk7XG4gICAgfVxuICB9XG4gIF9fZGlzY29ubmVjdGVkKCkge1xuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgJiYgdGhpcy5kaXNjb25uZWN0ZWQoKTtcbiAgfVxuICBwdXNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uKCkge1xuICB9KSB7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpO1xuICB9XG4gIHB1c2hFdmVudFRvKHBoeFRhcmdldCwgZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uKCkge1xuICB9KSB7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICByZXR1cm4gdmlldy5wdXNoSG9va0V2ZW50KHRoaXMuZWwsIHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpO1xuICAgIH0pO1xuICB9XG4gIGhhbmRsZUV2ZW50KGV2ZW50LCBjYWxsYmFjaykge1xuICAgIGxldCBjYWxsYmFja1JlZiA9IChjdXN0b21FdmVudCwgYnlwYXNzKSA9PiBieXBhc3MgPyBldmVudCA6IGNhbGxiYWNrKGN1c3RvbUV2ZW50LmRldGFpbCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKTtcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmFkZChjYWxsYmFja1JlZik7XG4gICAgcmV0dXJuIGNhbGxiYWNrUmVmO1xuICB9XG4gIHJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKSB7XG4gICAgbGV0IGV2ZW50ID0gY2FsbGJhY2tSZWYobnVsbCwgdHJ1ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKTtcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFja1JlZik7XG4gIH1cbiAgdXBsb2FkKG5hbWUsIGZpbGVzKSB7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LmRpc3BhdGNoVXBsb2FkcyhudWxsLCBuYW1lLCBmaWxlcyk7XG4gIH1cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcykge1xuICAgIHJldHVybiB0aGlzLl9fdmlldy53aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgKHZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgdmlldy5kaXNwYXRjaFVwbG9hZHModGFyZ2V0Q3R4LCBuYW1lLCBmaWxlcyk7XG4gICAgfSk7XG4gIH1cbiAgX19jbGVhbnVwX18oKSB7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFja1JlZikgPT4gdGhpcy5yZW1vdmVIYW5kbGVFdmVudChjYWxsYmFja1JlZikpO1xuICB9XG59O1xuXG4vLyBqcy9waG9lbml4X2xpdmVfdmlldy9qcy5qc1xudmFyIGZvY3VzU3RhY2sgPSBudWxsO1xudmFyIEpTID0ge1xuICBleGVjKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBkZWZhdWx0cykge1xuICAgIGxldCBbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXSA9IGRlZmF1bHRzIHx8IFtudWxsLCB7IGNhbGxiYWNrOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jYWxsYmFjayB9XTtcbiAgICBsZXQgY29tbWFuZHMgPSBwaHhFdmVudC5jaGFyQXQoMCkgPT09IFwiW1wiID8gSlNPTi5wYXJzZShwaHhFdmVudCkgOiBbW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc11dO1xuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYgKGtpbmQgPT09IGRlZmF1bHRLaW5kICYmIGRlZmF1bHRBcmdzLmRhdGEpIHtcbiAgICAgICAgYXJncy5kYXRhID0gT2JqZWN0LmFzc2lnbihhcmdzLmRhdGEgfHwge30sIGRlZmF1bHRBcmdzLmRhdGEpO1xuICAgICAgICBhcmdzLmNhbGxiYWNrID0gYXJncy5jYWxsYmFjayB8fCBkZWZhdWx0QXJncy5jYWxsYmFjaztcbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsdGVyVG9FbHMoc291cmNlRWwsIGFyZ3MpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIHRoaXNbYGV4ZWNfJHtraW5kfWBdKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgYXJncyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgaXNWaXNpYmxlKGVsKSB7XG4gICAgcmV0dXJuICEhKGVsLm9mZnNldFdpZHRoIHx8IGVsLm9mZnNldEhlaWdodCB8fCBlbC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA+IDApO1xuICB9LFxuICBleGVjX2V4ZWMoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBbYXR0ciwgdG9dKSB7XG4gICAgbGV0IG5vZGVzID0gdG8gPyBkb21fZGVmYXVsdC5hbGwoZG9jdW1lbnQsIHRvKSA6IFtzb3VyY2VFbF07XG4gICAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgbGV0IGVuY29kZWRKUyA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgaWYgKCFlbmNvZGVkSlMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCAke2F0dHJ9IHRvIGNvbnRhaW4gSlMgY29tbWFuZCBvbiBcIiR7dG99XCJgKTtcbiAgICAgIH1cbiAgICAgIHZpZXcubGl2ZVNvY2tldC5leGVjSlMobm9kZSwgZW5jb2RlZEpTLCBldmVudFR5cGUpO1xuICAgIH0pO1xuICB9LFxuICBleGVjX2Rpc3BhdGNoKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgeyB0bywgZXZlbnQsIGRldGFpbCwgYnViYmxlcyB9KSB7XG4gICAgZGV0YWlsID0gZGV0YWlsIHx8IHt9O1xuICAgIGRldGFpbC5kaXNwYXRjaGVyID0gc291cmNlRWw7XG4gICAgZG9tX2RlZmF1bHQuZGlzcGF0Y2hFdmVudChlbCwgZXZlbnQsIHsgZGV0YWlsLCBidWJibGVzIH0pO1xuICB9LFxuICBleGVjX3B1c2goZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKSB7XG4gICAgaWYgKCF2aWV3LmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHsgZXZlbnQsIGRhdGEsIHRhcmdldCwgcGFnZV9sb2FkaW5nLCBsb2FkaW5nLCB2YWx1ZSwgZGlzcGF0Y2hlciwgY2FsbGJhY2sgfSA9IGFyZ3M7XG4gICAgbGV0IHB1c2hPcHRzID0geyBsb2FkaW5nLCB2YWx1ZSwgdGFyZ2V0LCBwYWdlX2xvYWRpbmc6ICEhcGFnZV9sb2FkaW5nIH07XG4gICAgbGV0IHRhcmdldFNyYyA9IGV2ZW50VHlwZSA9PT0gXCJjaGFuZ2VcIiAmJiBkaXNwYXRjaGVyID8gZGlzcGF0Y2hlciA6IHNvdXJjZUVsO1xuICAgIGxldCBwaHhUYXJnZXQgPSB0YXJnZXQgfHwgdGFyZ2V0U3JjLmdldEF0dHJpYnV0ZSh2aWV3LmJpbmRpbmcoXCJ0YXJnZXRcIikpIHx8IHRhcmdldFNyYztcbiAgICB2aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodGFyZ2V0VmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBpZiAoZXZlbnRUeXBlID09PSBcImNoYW5nZVwiKSB7XG4gICAgICAgIGxldCB7IG5ld0NpZCwgX3RhcmdldCB9ID0gYXJncztcbiAgICAgICAgX3RhcmdldCA9IF90YXJnZXQgfHwgKGRvbV9kZWZhdWx0LmlzRm9ybUlucHV0KHNvdXJjZUVsKSA/IHNvdXJjZUVsLm5hbWUgOiB2b2lkIDApO1xuICAgICAgICBpZiAoX3RhcmdldCkge1xuICAgICAgICAgIHB1c2hPcHRzLl90YXJnZXQgPSBfdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldFZpZXcucHVzaElucHV0KHNvdXJjZUVsLCB0YXJnZXRDdHgsIG5ld0NpZCwgZXZlbnQgfHwgcGh4RXZlbnQsIHB1c2hPcHRzLCBjYWxsYmFjayk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50VHlwZSA9PT0gXCJzdWJtaXRcIikge1xuICAgICAgICBsZXQgeyBzdWJtaXR0ZXIgfSA9IGFyZ3M7XG4gICAgICAgIHRhcmdldFZpZXcuc3VibWl0Rm9ybShzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBldmVudCB8fCBwaHhFdmVudCwgc3VibWl0dGVyLCBwdXNoT3B0cywgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0Vmlldy5wdXNoRXZlbnQoZXZlbnRUeXBlLCBzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBldmVudCB8fCBwaHhFdmVudCwgZGF0YSwgcHVzaE9wdHMsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgZXhlY19uYXZpZ2F0ZShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHsgaHJlZiwgcmVwbGFjZSB9KSB7XG4gICAgdmlldy5saXZlU29ja2V0Lmhpc3RvcnlSZWRpcmVjdChocmVmLCByZXBsYWNlID8gXCJyZXBsYWNlXCIgOiBcInB1c2hcIik7XG4gIH0sXG4gIGV4ZWNfcGF0Y2goZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7IGhyZWYsIHJlcGxhY2UgfSkge1xuICAgIHZpZXcubGl2ZVNvY2tldC5wdXNoSGlzdG9yeVBhdGNoKGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiLCBzb3VyY2VFbCk7XG4gIH0sXG4gIGV4ZWNfZm9jdXMoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBhcmlhX2RlZmF1bHQuYXR0ZW1wdEZvY3VzKGVsKSk7XG4gIH0sXG4gIGV4ZWNfZm9jdXNfZmlyc3QoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBhcmlhX2RlZmF1bHQuZm9jdXNGaXJzdEludGVyYWN0aXZlKGVsKSB8fCBhcmlhX2RlZmF1bHQuZm9jdXNGaXJzdChlbCkpO1xuICB9LFxuICBleGVjX3B1c2hfZm9jdXMoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBmb2N1c1N0YWNrID0gZWwgfHwgc291cmNlRWwpO1xuICB9LFxuICBleGVjX3BvcF9mb2N1cyhldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChmb2N1c1N0YWNrKSB7XG4gICAgICAgIGZvY3VzU3RhY2suZm9jdXMoKTtcbiAgICAgIH1cbiAgICAgIGZvY3VzU3RhY2sgPSBudWxsO1xuICAgIH0pO1xuICB9LFxuICBleGVjX2FkZF9jbGFzcyhldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHsgbmFtZXMsIHRyYW5zaXRpb24sIHRpbWUgfSkge1xuICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBuYW1lcywgW10sIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpO1xuICB9LFxuICBleGVjX3JlbW92ZV9jbGFzcyhldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHsgbmFtZXMsIHRyYW5zaXRpb24sIHRpbWUgfSkge1xuICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgbmFtZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpO1xuICB9LFxuICBleGVjX3RyYW5zaXRpb24oZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7IHRpbWUsIHRyYW5zaXRpb24gfSkge1xuICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgW10sIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpO1xuICB9LFxuICBleGVjX3RvZ2dsZShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHsgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lIH0pIHtcbiAgICB0aGlzLnRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUpO1xuICB9LFxuICBleGVjX3Nob3coZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7IGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUgfSkge1xuICAgIHRoaXMuc2hvdyhldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKTtcbiAgfSxcbiAgZXhlY19oaWRlKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgeyBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lIH0pIHtcbiAgICB0aGlzLmhpZGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSk7XG4gIH0sXG4gIGV4ZWNfc2V0X2F0dHIoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7IGF0dHI6IFthdHRyLCB2YWxdIH0pIHtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKTtcbiAgfSxcbiAgZXhlY19yZW1vdmVfYXR0cihldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHsgYXR0ciB9KSB7XG4gICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbXSwgW2F0dHJdKTtcbiAgfSxcbiAgc2hvdyhldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzVmlzaWJsZShlbCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIG51bGwsIHRpbWUpO1xuICAgIH1cbiAgfSxcbiAgaGlkZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKGVsKSkge1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgbnVsbCwgdHJhbnNpdGlvbiwgdGltZSk7XG4gICAgfVxuICB9LFxuICB0b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lKSB7XG4gICAgbGV0IFtpbkNsYXNzZXMsIGluU3RhcnRDbGFzc2VzLCBpbkVuZENsYXNzZXNdID0gaW5zIHx8IFtbXSwgW10sIFtdXTtcbiAgICBsZXQgW291dENsYXNzZXMsIG91dFN0YXJ0Q2xhc3Nlcywgb3V0RW5kQ2xhc3Nlc10gPSBvdXRzIHx8IFtbXSwgW10sIFtdXTtcbiAgICBpZiAoaW5DbGFzc2VzLmxlbmd0aCA+IDAgfHwgb3V0Q2xhc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5pc1Zpc2libGUoZWwpKSB7XG4gICAgICAgIGxldCBvblN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRTdGFydENsYXNzZXMsIGluQ2xhc3Nlcy5jb25jYXQoaW5TdGFydENsYXNzZXMpLmNvbmNhdChpbkVuZENsYXNzZXMpKTtcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRDbGFzc2VzLCBbXSk7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRFbmRDbGFzc2VzLCBvdXRTdGFydENsYXNzZXMpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1zdGFydFwiKSk7XG4gICAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRFbmRDbGFzc2VzKSk7XG4gICAgICAgICAgZG9tX2RlZmF1bHQucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCAoY3VycmVudEVsKSA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKTtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLWVuZFwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGV2ZW50VHlwZSA9PT0gXCJyZW1vdmVcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5TdGFydENsYXNzZXMsIG91dENsYXNzZXMuY29uY2F0KG91dFN0YXJ0Q2xhc3NlcykuY29uY2F0KG91dEVuZENsYXNzZXMpKTtcbiAgICAgICAgICBsZXQgc3RpY2t5RGlzcGxheSA9IGRpc3BsYXkgfHwgdGhpcy5kZWZhdWx0RGlzcGxheShlbCk7XG4gICAgICAgICAgZG9tX2RlZmF1bHQucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCAoY3VycmVudEVsKSA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpO1xuICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluQ2xhc3NlcywgW10pO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5FbmRDbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcykpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKTtcbiAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIGluQ2xhc3Nlcy5jb25jYXQoaW5FbmRDbGFzc2VzKSk7XG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlKGVsKSkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKTtcbiAgICAgICAgICBkb21fZGVmYXVsdC5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIChjdXJyZW50RWwpID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpO1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtZW5kXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKTtcbiAgICAgICAgICBsZXQgc3RpY2t5RGlzcGxheSA9IGRpc3BsYXkgfHwgdGhpcy5kZWZhdWx0RGlzcGxheShlbCk7XG4gICAgICAgICAgZG9tX2RlZmF1bHQucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCAoY3VycmVudEVsKSA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpO1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctZW5kXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBhZGRPclJlbW92ZUNsYXNzZXMoZWwsIGFkZHMsIHJlbW92ZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpIHtcbiAgICBsZXQgW3RyYW5zaXRpb25SdW4sIHRyYW5zaXRpb25TdGFydCwgdHJhbnNpdGlvbkVuZF0gPSB0cmFuc2l0aW9uIHx8IFtbXSwgW10sIFtdXTtcbiAgICBpZiAodHJhbnNpdGlvblJ1bi5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIHRyYW5zaXRpb25TdGFydCwgW10uY29uY2F0KHRyYW5zaXRpb25SdW4pLmNvbmNhdCh0cmFuc2l0aW9uRW5kKSk7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uUnVuLCBbXSk7XG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvbkVuZCwgdHJhbnNpdGlvblN0YXJ0KSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBvbkRvbmUgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcy5jb25jYXQodHJhbnNpdGlvbkVuZCksIHJlbW92ZXMuY29uY2F0KHRyYW5zaXRpb25SdW4pLmNvbmNhdCh0cmFuc2l0aW9uU3RhcnQpKTtcbiAgICAgIHJldHVybiB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKTtcbiAgICB9XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBkb21fZGVmYXVsdC5nZXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBbW10sIFtdXSk7XG4gICAgICBsZXQga2VlcEFkZHMgPSBhZGRzLmZpbHRlcigobmFtZSkgPT4gcHJldkFkZHMuaW5kZXhPZihuYW1lKSA8IDAgJiYgIWVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSk7XG4gICAgICBsZXQga2VlcFJlbW92ZXMgPSByZW1vdmVzLmZpbHRlcigobmFtZSkgPT4gcHJldlJlbW92ZXMuaW5kZXhPZihuYW1lKSA8IDAgJiYgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKTtcbiAgICAgIGxldCBuZXdBZGRzID0gcHJldkFkZHMuZmlsdGVyKChuYW1lKSA9PiByZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcEFkZHMpO1xuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIoKG5hbWUpID0+IGFkZHMuaW5kZXhPZihuYW1lKSA8IDApLmNvbmNhdChrZWVwUmVtb3Zlcyk7XG4gICAgICBkb21fZGVmYXVsdC5wdXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCAoY3VycmVudEVsKSA9PiB7XG4gICAgICAgIGN1cnJlbnRFbC5jbGFzc0xpc3QucmVtb3ZlKC4uLm5ld1JlbW92ZXMpO1xuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LmFkZCguLi5uZXdBZGRzKTtcbiAgICAgICAgcmV0dXJuIFtuZXdBZGRzLCBuZXdSZW1vdmVzXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBzZXRPclJlbW92ZUF0dHJzKGVsLCBzZXRzLCByZW1vdmVzKSB7XG4gICAgbGV0IFtwcmV2U2V0cywgcHJldlJlbW92ZXNdID0gZG9tX2RlZmF1bHQuZ2V0U3RpY2t5KGVsLCBcImF0dHJzXCIsIFtbXSwgW11dKTtcbiAgICBsZXQgYWx0ZXJlZEF0dHJzID0gc2V0cy5tYXAoKFthdHRyLCBfdmFsXSkgPT4gYXR0cikuY29uY2F0KHJlbW92ZXMpO1xuICAgIGxldCBuZXdTZXRzID0gcHJldlNldHMuZmlsdGVyKChbYXR0ciwgX3ZhbF0pID0+ICFhbHRlcmVkQXR0cnMuaW5jbHVkZXMoYXR0cikpLmNvbmNhdChzZXRzKTtcbiAgICBsZXQgbmV3UmVtb3ZlcyA9IHByZXZSZW1vdmVzLmZpbHRlcigoYXR0cikgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHJlbW92ZXMpO1xuICAgIGRvbV9kZWZhdWx0LnB1dFN0aWNreShlbCwgXCJhdHRyc1wiLCAoY3VycmVudEVsKSA9PiB7XG4gICAgICBuZXdSZW1vdmVzLmZvckVhY2goKGF0dHIpID0+IGN1cnJlbnRFbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cikpO1xuICAgICAgbmV3U2V0cy5mb3JFYWNoKChbYXR0ciwgdmFsXSkgPT4gY3VycmVudEVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpKTtcbiAgICAgIHJldHVybiBbbmV3U2V0cywgbmV3UmVtb3Zlc107XG4gICAgfSk7XG4gIH0sXG4gIGhhc0FsbENsYXNzZXMoZWwsIGNsYXNzZXMpIHtcbiAgICByZXR1cm4gY2xhc3Nlcy5ldmVyeSgobmFtZSkgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKTtcbiAgfSxcbiAgaXNUb2dnbGVkT3V0KGVsLCBvdXRDbGFzc2VzKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzVmlzaWJsZShlbCkgfHwgdGhpcy5oYXNBbGxDbGFzc2VzKGVsLCBvdXRDbGFzc2VzKTtcbiAgfSxcbiAgZmlsdGVyVG9FbHMoc291cmNlRWwsIHsgdG8gfSkge1xuICAgIHJldHVybiB0byA/IGRvbV9kZWZhdWx0LmFsbChkb2N1bWVudCwgdG8pIDogW3NvdXJjZUVsXTtcbiAgfSxcbiAgZGVmYXVsdERpc3BsYXkoZWwpIHtcbiAgICByZXR1cm4geyB0cjogXCJ0YWJsZS1yb3dcIiwgdGQ6IFwidGFibGUtY2VsbFwiIH1bZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXSB8fCBcImJsb2NrXCI7XG4gIH1cbn07XG52YXIganNfZGVmYXVsdCA9IEpTO1xuXG4vLyBqcy9waG9lbml4X2xpdmVfdmlldy92aWV3LmpzXG52YXIgc2VyaWFsaXplRm9ybSA9IChmb3JtLCBtZXRhZGF0YSwgb25seU5hbWVzID0gW10pID0+IHtcbiAgbGV0IHsgc3VibWl0dGVyLCAuLi5tZXRhIH0gPSBtZXRhZGF0YTtcbiAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuICBpZiAoc3VibWl0dGVyICYmIHN1Ym1pdHRlci5oYXNBdHRyaWJ1dGUoXCJuYW1lXCIpICYmIHN1Ym1pdHRlci5mb3JtICYmIHN1Ym1pdHRlci5mb3JtID09PSBmb3JtKSB7XG4gICAgZm9ybURhdGEuYXBwZW5kKHN1Ym1pdHRlci5uYW1lLCBzdWJtaXR0ZXIudmFsdWUpO1xuICB9XG4gIGxldCB0b1JlbW92ZSA9IFtdO1xuICBmb3JtRGF0YS5mb3JFYWNoKCh2YWwsIGtleSwgX2luZGV4KSA9PiB7XG4gICAgaWYgKHZhbCBpbnN0YW5jZW9mIEZpbGUpIHtcbiAgICAgIHRvUmVtb3ZlLnB1c2goa2V5KTtcbiAgICB9XG4gIH0pO1xuICB0b1JlbW92ZS5mb3JFYWNoKChrZXkpID0+IGZvcm1EYXRhLmRlbGV0ZShrZXkpKTtcbiAgbGV0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgZm9yIChsZXQgW2tleSwgdmFsXSBvZiBmb3JtRGF0YS5lbnRyaWVzKCkpIHtcbiAgICBpZiAob25seU5hbWVzLmxlbmd0aCA9PT0gMCB8fCBvbmx5TmFtZXMuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuICBmb3IgKGxldCBtZXRhS2V5IGluIG1ldGEpIHtcbiAgICBwYXJhbXMuYXBwZW5kKG1ldGFLZXksIG1ldGFbbWV0YUtleV0pO1xuICB9XG4gIHJldHVybiBwYXJhbXMudG9TdHJpbmcoKTtcbn07XG52YXIgVmlldyA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoZWwsIGxpdmVTb2NrZXQsIHBhcmVudFZpZXcsIGZsYXNoLCBsaXZlUmVmZXJlcikge1xuICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldDtcbiAgICB0aGlzLmZsYXNoID0gZmxhc2g7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRWaWV3O1xuICAgIHRoaXMucm9vdCA9IHBhcmVudFZpZXcgPyBwYXJlbnRWaWV3LnJvb3QgOiB0aGlzO1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLmlkID0gdGhpcy5lbC5pZDtcbiAgICB0aGlzLnJlZiA9IDA7XG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMDtcbiAgICB0aGlzLmxvYWRlclRpbWVyID0gbnVsbDtcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdO1xuICAgIHRoaXMucHJ1bmluZ0NJRHMgPSBbXTtcbiAgICB0aGlzLnJlZGlyZWN0ID0gZmFsc2U7XG4gICAgdGhpcy5ocmVmID0gbnVsbDtcbiAgICB0aGlzLmpvaW5Db3VudCA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuam9pbkNvdW50IC0gMSA6IDA7XG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWU7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmpvaW5DYWxsYmFjayA9IGZ1bmN0aW9uKG9uRG9uZSkge1xuICAgICAgb25Eb25lICYmIG9uRG9uZSgpO1xuICAgIH07XG4gICAgdGhpcy5zdG9wQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICB9O1xuICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSB0aGlzLnBhcmVudCA/IG51bGwgOiBbXTtcbiAgICB0aGlzLnZpZXdIb29rcyA9IHt9O1xuICAgIHRoaXMudXBsb2FkZXJzID0ge307XG4gICAgdGhpcy5mb3JtU3VibWl0cyA9IFtdO1xuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLnBhcmVudCA/IG51bGwgOiB7fTtcbiAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0gPSB7fTtcbiAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmxpdmVTb2NrZXQuY2hhbm5lbChgbHY6JHt0aGlzLmlkfWAsICgpID0+IHtcbiAgICAgIGxldCB1cmwgPSB0aGlzLmhyZWYgJiYgdGhpcy5leHBhbmRVUkwodGhpcy5ocmVmKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0OiB0aGlzLnJlZGlyZWN0ID8gdXJsIDogdm9pZCAwLFxuICAgICAgICB1cmw6IHRoaXMucmVkaXJlY3QgPyB2b2lkIDAgOiB1cmwgfHwgdm9pZCAwLFxuICAgICAgICBwYXJhbXM6IHRoaXMuY29ubmVjdFBhcmFtcyhsaXZlUmVmZXJlciksXG4gICAgICAgIHNlc3Npb246IHRoaXMuZ2V0U2Vzc2lvbigpLFxuICAgICAgICBzdGF0aWM6IHRoaXMuZ2V0U3RhdGljKCksXG4gICAgICAgIGZsYXNoOiB0aGlzLmZsYXNoXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG4gIHNldEhyZWYoaHJlZikge1xuICAgIHRoaXMuaHJlZiA9IGhyZWY7XG4gIH1cbiAgc2V0UmVkaXJlY3QoaHJlZikge1xuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlO1xuICAgIHRoaXMuaHJlZiA9IGhyZWY7XG4gIH1cbiAgaXNNYWluKCkge1xuICAgIHJldHVybiB0aGlzLmVsLmhhc0F0dHJpYnV0ZShQSFhfTUFJTik7XG4gIH1cbiAgY29ubmVjdFBhcmFtcyhsaXZlUmVmZXJlcikge1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpO1xuICAgIGxldCBtYW5pZmVzdCA9IGRvbV9kZWZhdWx0LmFsbChkb2N1bWVudCwgYFske3RoaXMuYmluZGluZyhQSFhfVFJBQ0tfU1RBVElDKX1dYCkubWFwKChub2RlKSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcigodXJsKSA9PiB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiKTtcbiAgICBpZiAobWFuaWZlc3QubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zW1wiX3RyYWNrX3N0YXRpY1wiXSA9IG1hbmlmZXN0O1xuICAgIH1cbiAgICBwYXJhbXNbXCJfbW91bnRzXCJdID0gdGhpcy5qb2luQ291bnQ7XG4gICAgcGFyYW1zW1wiX2xpdmVfcmVmZXJlclwiXSA9IGxpdmVSZWZlcmVyO1xuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5jYW5QdXNoKCk7XG4gIH1cbiAgZ2V0U2Vzc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pO1xuICB9XG4gIGdldFN0YXRpYygpIHtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQyk7XG4gICAgcmV0dXJuIHZhbCA9PT0gXCJcIiA/IG51bGwgOiB2YWw7XG4gIH1cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB9KSB7XG4gICAgdGhpcy5kZXN0cm95QWxsQ2hpbGRyZW4oKTtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXTtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5wYXJlbnQuaWRdW3RoaXMuaWRdO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcik7XG4gICAgbGV0IG9uRmluaXNoZWQgPSAoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy52aWV3SG9va3MpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95SG9vayh0aGlzLnZpZXdIb29rc1tpZF0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZG9tX2RlZmF1bHQubWFya1BoeENoaWxkRGVzdHJveWVkKHRoaXMuZWwpO1xuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSk7XG4gICAgdGhpcy5jaGFubmVsLmxlYXZlKCkucmVjZWl2ZShcIm9rXCIsIG9uRmluaXNoZWQpLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKS5yZWNlaXZlKFwidGltZW91dFwiLCBvbkZpbmlzaGVkKTtcbiAgfVxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpIHtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoUEhYX0NPTk5FQ1RFRF9DTEFTUywgUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX0NMSUVOVF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTUyk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICB9XG4gIHNob3dMb2FkZXIodGltZW91dCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKTtcbiAgICBpZiAodGltZW91dCkge1xuICAgICAgdGhpcy5sb2FkZXJUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zaG93TG9hZGVyKCksIHRpbWVvdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcykge1xuICAgICAgICB0aGlzLnZpZXdIb29rc1tpZF0uX19kaXNjb25uZWN0ZWQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfTE9BRElOR19DTEFTUyk7XG4gICAgfVxuICB9XG4gIGV4ZWNBbGwoYmluZGluZykge1xuICAgIGRvbV9kZWZhdWx0LmFsbCh0aGlzLmVsLCBgWyR7YmluZGluZ31dYCwgKGVsKSA9PiB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTKGVsLCBlbC5nZXRBdHRyaWJ1dGUoYmluZGluZykpKTtcbiAgfVxuICBoaWRlTG9hZGVyKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKTtcbiAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoUEhYX0NPTk5FQ1RFRF9DTEFTUyk7XG4gICAgdGhpcy5leGVjQWxsKHRoaXMuYmluZGluZyhcImNvbm5lY3RlZFwiKSk7XG4gIH1cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCkge1xuICAgIGZvciAobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKSB7XG4gICAgICB0aGlzLnZpZXdIb29rc1tpZF0uX19yZWNvbm5lY3RlZCgpO1xuICAgIH1cbiAgfVxuICBsb2coa2luZCwgbXNnQ2FsbGJhY2spIHtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKTtcbiAgfVxuICB0cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSA9IGZ1bmN0aW9uKCkge1xuICB9KSB7XG4gICAgdGhpcy5saXZlU29ja2V0LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKTtcbiAgfVxuICB3aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgY2FsbGJhY2spIHtcbiAgICBpZiAocGh4VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcGh4VGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5vd25lcihwaHhUYXJnZXQsICh2aWV3KSA9PiBjYWxsYmFjayh2aWV3LCBwaHhUYXJnZXQpKTtcbiAgICB9XG4gICAgaWYgKGlzQ2lkKHBoeFRhcmdldCkpIHtcbiAgICAgIGxldCB0YXJnZXRzID0gZG9tX2RlZmF1bHQuZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIHBoeFRhcmdldCk7XG4gICAgICBpZiAodGFyZ2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3VuZCBtYXRjaGluZyBwaHgtdGFyZ2V0IG9mICR7cGh4VGFyZ2V0fWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sodGhpcywgcGFyc2VJbnQocGh4VGFyZ2V0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBoeFRhcmdldCkpO1xuICAgICAgaWYgKHRhcmdldHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxvZ0Vycm9yKGBub3RoaW5nIGZvdW5kIG1hdGNoaW5nIHRoZSBwaHgtdGFyZ2V0IHNlbGVjdG9yIFwiJHtwaHhUYXJnZXR9XCJgKTtcbiAgICAgIH1cbiAgICAgIHRhcmdldHMuZm9yRWFjaCgodGFyZ2V0KSA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCAodmlldykgPT4gY2FsbGJhY2sodmlldywgdGFyZ2V0KSkpO1xuICAgIH1cbiAgfVxuICBhcHBseURpZmYodHlwZSwgcmF3RGlmZiwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmxvZyh0eXBlLCAoKSA9PiBbXCJcIiwgY2xvbmUocmF3RGlmZildKTtcbiAgICBsZXQgeyBkaWZmLCByZXBseSwgZXZlbnRzLCB0aXRsZSB9ID0gUmVuZGVyZWQuZXh0cmFjdChyYXdEaWZmKTtcbiAgICBjYWxsYmFjayh7IGRpZmYsIHJlcGx5LCBldmVudHMgfSk7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGRvbV9kZWZhdWx0LnB1dFRpdGxlKHRpdGxlKSk7XG4gICAgfVxuICB9XG4gIG9uSm9pbihyZXNwKSB7XG4gICAgbGV0IHsgcmVuZGVyZWQsIGNvbnRhaW5lciB9ID0gcmVzcDtcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBsZXQgW3RhZywgYXR0cnNdID0gY29udGFpbmVyO1xuICAgICAgdGhpcy5lbCA9IGRvbV9kZWZhdWx0LnJlcGxhY2VSb290Q29udGFpbmVyKHRoaXMuZWwsIHRhZywgYXR0cnMpO1xuICAgIH1cbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwO1xuICAgIHRoaXMuam9pblBlbmRpbmcgPSB0cnVlO1xuICAgIHRoaXMuZmxhc2ggPSBudWxsO1xuICAgIGJyb3dzZXJfZGVmYXVsdC5kcm9wTG9jYWwodGhpcy5saXZlU29ja2V0LmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTKTtcbiAgICB0aGlzLmFwcGx5RGlmZihcIm1vdW50XCIsIHJlbmRlcmVkLCAoeyBkaWZmLCBldmVudHMgfSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IG5ldyBSZW5kZXJlZCh0aGlzLmlkLCBkaWZmKTtcbiAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlckNvbnRhaW5lcihudWxsLCBcImpvaW5cIik7XG4gICAgICB0aGlzLmRyb3BQZW5kaW5nUmVmcygpO1xuICAgICAgbGV0IGZvcm1zID0gdGhpcy5mb3Jtc0ZvclJlY292ZXJ5KGh0bWwpO1xuICAgICAgdGhpcy5qb2luQ291bnQrKztcbiAgICAgIGlmIChmb3Jtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvcm1zLmZvckVhY2goKFtmb3JtLCBuZXdGb3JtLCBuZXdDaWRdLCBpKSA9PiB7XG4gICAgICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KGZvcm0sIG5ld0NpZCwgKHJlc3AyKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gZm9ybXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICB0aGlzLm9uSm9pbkNvbXBsZXRlKHJlc3AyLCBodG1sLCBzdHJlYW1zLCBldmVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25Kb2luQ29tcGxldGUocmVzcCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBkcm9wUGVuZGluZ1JlZnMoKSB7XG4gICAgZG9tX2RlZmF1bHQuYWxsKGRvY3VtZW50LCBgWyR7UEhYX1JFRl9TUkN9PVwiJHt0aGlzLmlkfVwiXVske1BIWF9SRUZ9XWAsIChlbCkgPT4ge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUYpO1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfU1JDKTtcbiAgICB9KTtcbiAgfVxuICBvbkpvaW5Db21wbGV0ZSh7IGxpdmVfcGF0Y2ggfSwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKSB7XG4gICAgaWYgKHRoaXMuam9pbkNvdW50ID4gMSB8fCB0aGlzLnBhcmVudCAmJiAhdGhpcy5wYXJlbnQuaXNKb2luUGVuZGluZygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpO1xuICAgIH1cbiAgICBsZXQgbmV3Q2hpbGRyZW4gPSBkb21fZGVmYXVsdC5maW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHRoaXMuaWQpLmZpbHRlcigodG9FbCkgPT4ge1xuICAgICAgbGV0IGZyb21FbCA9IHRvRWwuaWQgJiYgdGhpcy5lbC5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke3RvRWwuaWR9XCJdYCk7XG4gICAgICBsZXQgcGh4U3RhdGljID0gZnJvbUVsICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQyk7XG4gICAgICBpZiAocGh4U3RhdGljKSB7XG4gICAgICAgIHRvRWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHBoeFN0YXRpYyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5qb2luQ2hpbGQodG9FbCk7XG4gICAgfSk7XG4gICAgaWYgKG5ld0NoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cyldKTtcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKTtcbiAgICAgICAgdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSk7XG4gICAgfVxuICB9XG4gIGF0dGFjaFRydWVEb2NFbCgpIHtcbiAgICB0aGlzLmVsID0gZG9tX2RlZmF1bHQuYnlJZCh0aGlzLmlkKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKTtcbiAgfVxuICBleGVjTmV3TW91bnRlZCgpIHtcbiAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUCk7XG4gICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gdGhpcy5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pO1xuICAgIGRvbV9kZWZhdWx0LmFsbCh0aGlzLmVsLCBgWyR7cGh4Vmlld3BvcnRUb3B9XSwgWyR7cGh4Vmlld3BvcnRCb3R0b219XWAsIChob29rRWwpID0+IHtcbiAgICAgIGRvbV9kZWZhdWx0Lm1heWJlQWRkUHJpdmF0ZUhvb2tzKGhvb2tFbCwgcGh4Vmlld3BvcnRUb3AsIHBoeFZpZXdwb3J0Qm90dG9tKTtcbiAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbCk7XG4gICAgfSk7XG4gICAgZG9tX2RlZmF1bHQuYWxsKHRoaXMuZWwsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV0sIFtkYXRhLXBoeC0ke1BIWF9IT09LfV1gLCAoaG9va0VsKSA9PiB7XG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhob29rRWwpO1xuICAgIH0pO1xuICAgIGRvbV9kZWZhdWx0LmFsbCh0aGlzLmVsLCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9NT1VOVEVEKX1dYCwgKGVsKSA9PiB0aGlzLm1heWJlTW91bnRlZChlbCkpO1xuICB9XG4gIGFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cykge1xuICAgIHRoaXMuYXR0YWNoVHJ1ZURvY0VsKCk7XG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIHN0cmVhbXMsIG51bGwpO1xuICAgIHBhdGNoLm1hcmtQcnVuYWJsZUNvbnRlbnRGb3JSZW1vdmFsKCk7XG4gICAgdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIGZhbHNlKTtcbiAgICB0aGlzLmpvaW5OZXdDaGlsZHJlbigpO1xuICAgIHRoaXMuZXhlY05ld01vdW50ZWQoKTtcbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2U7XG4gICAgdGhpcy5saXZlU29ja2V0LmRpc3BhdGNoRXZlbnRzKGV2ZW50cyk7XG4gICAgdGhpcy5hcHBseVBlbmRpbmdVcGRhdGVzKCk7XG4gICAgaWYgKGxpdmVfcGF0Y2gpIHtcbiAgICAgIGxldCB7IGtpbmQsIHRvIH0gPSBsaXZlX3BhdGNoO1xuICAgICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZCk7XG4gICAgfVxuICAgIHRoaXMuaGlkZUxvYWRlcigpO1xuICAgIGlmICh0aGlzLmpvaW5Db3VudCA+IDEpIHtcbiAgICAgIHRoaXMudHJpZ2dlclJlY29ubmVjdGVkKCk7XG4gICAgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrKCk7XG4gIH1cbiAgdHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKSB7XG4gICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvbkJlZm9yZUVsVXBkYXRlZFwiLCBbZnJvbUVsLCB0b0VsXSk7XG4gICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soZnJvbUVsKTtcbiAgICBsZXQgaXNJZ25vcmVkID0gaG9vayAmJiBkb21fZGVmYXVsdC5pc0lnbm9yZWQoZnJvbUVsLCB0aGlzLmJpbmRpbmcoUEhYX1VQREFURSkpO1xuICAgIGlmIChob29rICYmICFmcm9tRWwuaXNFcXVhbE5vZGUodG9FbCkgJiYgIShpc0lnbm9yZWQgJiYgaXNFcXVhbE9iaihmcm9tRWwuZGF0YXNldCwgdG9FbC5kYXRhc2V0KSkpIHtcbiAgICAgIGhvb2suX19iZWZvcmVVcGRhdGUoKTtcbiAgICAgIHJldHVybiBob29rO1xuICAgIH1cbiAgfVxuICBtYXliZU1vdW50ZWQoZWwpIHtcbiAgICBsZXQgcGh4TW91bnRlZCA9IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX01PVU5URUQpKTtcbiAgICBsZXQgaGFzQmVlbkludm9rZWQgPSBwaHhNb3VudGVkICYmIGRvbV9kZWZhdWx0LnByaXZhdGUoZWwsIFwibW91bnRlZFwiKTtcbiAgICBpZiAocGh4TW91bnRlZCAmJiAhaGFzQmVlbkludm9rZWQpIHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlMoZWwsIHBoeE1vdW50ZWQpO1xuICAgICAgZG9tX2RlZmF1bHQucHV0UHJpdmF0ZShlbCwgXCJtb3VudGVkXCIsIHRydWUpO1xuICAgIH1cbiAgfVxuICBtYXliZUFkZE5ld0hvb2soZWwsIGZvcmNlKSB7XG4gICAgbGV0IG5ld0hvb2sgPSB0aGlzLmFkZEhvb2soZWwpO1xuICAgIGlmIChuZXdIb29rKSB7XG4gICAgICBuZXdIb29rLl9fbW91bnRlZCgpO1xuICAgIH1cbiAgfVxuICBwZXJmb3JtUGF0Y2gocGF0Y2gsIHBydW5lQ2lkcykge1xuICAgIGxldCByZW1vdmVkRWxzID0gW107XG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZTtcbiAgICBsZXQgdXBkYXRlZEhvb2tJZHMgPSBuZXcgU2V0KCk7XG4gICAgcGF0Y2guYWZ0ZXIoXCJhZGRlZFwiLCAoZWwpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25Ob2RlQWRkZWRcIiwgW2VsXSk7XG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhlbCk7XG4gICAgICBpZiAoZWwuZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgIHRoaXMubWF5YmVNb3VudGVkKGVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwYXRjaC5hZnRlcihcInBoeENoaWxkQWRkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZiAoZG9tX2RlZmF1bHQuaXNQaHhTdGlja3koZWwpKSB7XG4gICAgICAgIHRoaXMubGl2ZVNvY2tldC5qb2luUm9vdFZpZXdzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaHhDaGlsZHJlbkFkZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwYXRjaC5iZWZvcmUoXCJ1cGRhdGVkXCIsIChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgIGxldCBob29rID0gdGhpcy50cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhmcm9tRWwsIHRvRWwpO1xuICAgICAgaWYgKGhvb2spIHtcbiAgICAgICAgdXBkYXRlZEhvb2tJZHMuYWRkKGZyb21FbC5pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIChlbCkgPT4ge1xuICAgICAgaWYgKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpIHtcbiAgICAgICAgdGhpcy5nZXRIb29rKGVsKS5fX3VwZGF0ZWQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwYXRjaC5hZnRlcihcImRpc2NhcmRlZFwiLCAoZWwpID0+IHtcbiAgICAgIGlmIChlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgcmVtb3ZlZEVscy5wdXNoKGVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwYXRjaC5hZnRlcihcInRyYW5zaXRpb25zRGlzY2FyZGVkXCIsIChlbHMpID0+IHRoaXMuYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxzLCBwcnVuZUNpZHMpKTtcbiAgICBwYXRjaC5wZXJmb3JtKCk7XG4gICAgdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChyZW1vdmVkRWxzLCBwcnVuZUNpZHMpO1xuICAgIHJldHVybiBwaHhDaGlsZHJlbkFkZGVkO1xuICB9XG4gIGFmdGVyRWxlbWVudHNSZW1vdmVkKGVsZW1lbnRzLCBwcnVuZUNpZHMpIHtcbiAgICBsZXQgZGVzdHJveWVkQ0lEcyA9IFtdO1xuICAgIGVsZW1lbnRzLmZvckVhY2goKHBhcmVudCkgPT4ge1xuICAgICAgbGV0IGNvbXBvbmVudHMgPSBkb21fZGVmYXVsdC5hbGwocGFyZW50LCBgWyR7UEhYX0NPTVBPTkVOVH1dYCk7XG4gICAgICBsZXQgaG9va3MgPSBkb21fZGVmYXVsdC5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dYCk7XG4gICAgICBjb21wb25lbnRzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGxldCBjaWQgPSB0aGlzLmNvbXBvbmVudElEKGVsKTtcbiAgICAgICAgaWYgKGlzQ2lkKGNpZCkgJiYgZGVzdHJveWVkQ0lEcy5pbmRleE9mKGNpZCkgPT09IC0xKSB7XG4gICAgICAgICAgZGVzdHJveWVkQ0lEcy5wdXNoKGNpZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaG9va3MuY29uY2F0KHBhcmVudCkuZm9yRWFjaCgoaG9va0VsKSA9PiB7XG4gICAgICAgIGxldCBob29rID0gdGhpcy5nZXRIb29rKGhvb2tFbCk7XG4gICAgICAgIGhvb2sgJiYgdGhpcy5kZXN0cm95SG9vayhob29rKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChwcnVuZUNpZHMpIHtcbiAgICAgIHRoaXMubWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKTtcbiAgICB9XG4gIH1cbiAgam9pbk5ld0NoaWxkcmVuKCkge1xuICAgIGRvbV9kZWZhdWx0LmZpbmRQaHhDaGlsZHJlbih0aGlzLmVsLCB0aGlzLmlkKS5mb3JFYWNoKChlbCkgPT4gdGhpcy5qb2luQ2hpbGQoZWwpKTtcbiAgfVxuICBnZXRDaGlsZEJ5SWQoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW2lkXTtcbiAgfVxuICBnZXREZXNjZW5kZW50QnlFbChlbCkge1xuICAgIGlmIChlbC5pZCA9PT0gdGhpcy5pZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2VsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKV1bZWwuaWRdO1xuICAgIH1cbiAgfVxuICBkZXN0cm95RGVzY2VuZGVudChpZCkge1xuICAgIGZvciAobGV0IHBhcmVudElkIGluIHRoaXMucm9vdC5jaGlsZHJlbikge1xuICAgICAgZm9yIChsZXQgY2hpbGRJZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdKSB7XG4gICAgICAgIGlmIChjaGlsZElkID09PSBpZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdW2NoaWxkSWRdLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBqb2luQ2hpbGQoZWwpIHtcbiAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkQnlJZChlbC5pZCk7XG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgbGV0IHZpZXcgPSBuZXcgVmlldyhlbCwgdGhpcy5saXZlU29ja2V0LCB0aGlzKTtcbiAgICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVt2aWV3LmlkXSA9IHZpZXc7XG4gICAgICB2aWV3LmpvaW4oKTtcbiAgICAgIHRoaXMuY2hpbGRKb2lucysrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIGlzSm9pblBlbmRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuam9pblBlbmRpbmc7XG4gIH1cbiAgYWNrSm9pbihfY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkSm9pbnMtLTtcbiAgICBpZiAodGhpcy5jaGlsZEpvaW5zID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgb25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKSB7XG4gICAgdGhpcy5qb2luQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcy5mb3JFYWNoKChbdmlldywgb3BdKSA9PiB7XG4gICAgICAgIGlmICghdmlldy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICAgICAgb3AoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnBlbmRpbmdKb2luT3BzID0gW107XG4gICAgfSk7XG4gIH1cbiAgdXBkYXRlKGRpZmYsIGV2ZW50cykge1xuICAgIGlmICh0aGlzLmlzSm9pblBlbmRpbmcoKSB8fCB0aGlzLmxpdmVTb2NrZXQuaGFzUGVuZGluZ0xpbmsoKSAmJiB0aGlzLnJvb3QuaXNNYWluKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdEaWZmcy5wdXNoKHsgZGlmZiwgZXZlbnRzIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVkLm1lcmdlRGlmZihkaWZmKTtcbiAgICBsZXQgcGh4Q2hpbGRyZW5BZGRlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnJlbmRlcmVkLmlzQ29tcG9uZW50T25seURpZmYoZGlmZikpIHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiY29tcG9uZW50IHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IHBhcmVudENpZHMgPSBkb21fZGVmYXVsdC5maW5kUGFyZW50Q0lEcyh0aGlzLmVsLCB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikpO1xuICAgICAgICBwYXJlbnRDaWRzLmZvckVhY2goKHBhcmVudENJRCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFBhdGNoKHRoaXMucmVuZGVyZWQuZ2V0Q29tcG9uZW50KGRpZmYsIHBhcmVudENJRCksIHBhcmVudENJRCkpIHtcbiAgICAgICAgICAgIHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFpc0VtcHR5KGRpZmYpKSB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQudGltZShcImZ1bGwgcGF0Y2ggY29tcGxldGVcIiwgKCkgPT4ge1xuICAgICAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZW5kZXJDb250YWluZXIoZGlmZiwgXCJ1cGRhdGVcIik7XG4gICAgICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCB0aGlzLmVsLCB0aGlzLmlkLCBodG1sLCBzdHJlYW1zLCBudWxsKTtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKTtcbiAgICBpZiAocGh4Q2hpbGRyZW5BZGRlZCkge1xuICAgICAgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKTtcbiAgICB9XG4gIH1cbiAgcmVuZGVyQ29udGFpbmVyKGRpZmYsIGtpbmQpIHtcbiAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnRpbWUoYHRvU3RyaW5nIGRpZmYgKCR7a2luZH0pYCwgKCkgPT4ge1xuICAgICAgbGV0IHRhZyA9IHRoaXMuZWwudGFnTmFtZTtcbiAgICAgIGxldCBjaWRzID0gZGlmZiA/IHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKS5jb25jYXQodGhpcy5wcnVuaW5nQ0lEcykgOiBudWxsO1xuICAgICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyZWQudG9TdHJpbmcoY2lkcyk7XG4gICAgICByZXR1cm4gW2A8JHt0YWd9PiR7aHRtbH08LyR7dGFnfT5gLCBzdHJlYW1zXTtcbiAgICB9KTtcbiAgfVxuICBjb21wb25lbnRQYXRjaChkaWZmLCBjaWQpIHtcbiAgICBpZiAoaXNFbXB0eShkaWZmKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRUb1N0cmluZyhjaWQpO1xuICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCB0aGlzLmVsLCB0aGlzLmlkLCBodG1sLCBzdHJlYW1zLCBjaWQpO1xuICAgIGxldCBjaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpO1xuICAgIHJldHVybiBjaGlsZHJlbkFkZGVkO1xuICB9XG4gIGdldEhvb2soZWwpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGVsKV07XG4gIH1cbiAgYWRkSG9vayhlbCkge1xuICAgIGlmIChWaWV3SG9vay5lbGVtZW50SUQoZWwpIHx8ICFlbC5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGhvb2tOYW1lID0gZWwuZ2V0QXR0cmlidXRlKGBkYXRhLXBoeC0ke1BIWF9IT09LfWApIHx8IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0hPT0spKTtcbiAgICBpZiAoaG9va05hbWUgJiYgIXRoaXMub3duc0VsZW1lbnQoZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLmxpdmVTb2NrZXQuZ2V0SG9va0NhbGxiYWNrcyhob29rTmFtZSk7XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgaWYgKCFlbC5pZCkge1xuICAgICAgICBsb2dFcnJvcihgbm8gRE9NIElEIGZvciBob29rIFwiJHtob29rTmFtZX1cIi4gSG9va3MgcmVxdWlyZSBhIHVuaXF1ZSBJRCBvbiBlYWNoIGVsZW1lbnQuYCwgZWwpO1xuICAgICAgfVxuICAgICAgbGV0IGhvb2sgPSBuZXcgVmlld0hvb2sodGhpcywgZWwsIGNhbGxiYWNrcyk7XG4gICAgICB0aGlzLnZpZXdIb29rc1tWaWV3SG9vay5lbGVtZW50SUQoaG9vay5lbCldID0gaG9vaztcbiAgICAgIHJldHVybiBob29rO1xuICAgIH0gZWxzZSBpZiAoaG9va05hbWUgIT09IG51bGwpIHtcbiAgICAgIGxvZ0Vycm9yKGB1bmtub3duIGhvb2sgZm91bmQgZm9yIFwiJHtob29rTmFtZX1cImAsIGVsKTtcbiAgICB9XG4gIH1cbiAgZGVzdHJveUhvb2soaG9vaykge1xuICAgIGhvb2suX19kZXN0cm95ZWQoKTtcbiAgICBob29rLl9fY2xlYW51cF9fKCk7XG4gICAgZGVsZXRlIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV07XG4gIH1cbiAgYXBwbHlQZW5kaW5nVXBkYXRlcygpIHtcbiAgICB0aGlzLnBlbmRpbmdEaWZmcy5mb3JFYWNoKCh7IGRpZmYsIGV2ZW50cyB9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKTtcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdO1xuICAgIHRoaXMuZWFjaENoaWxkKChjaGlsZCkgPT4gY2hpbGQuYXBwbHlQZW5kaW5nVXBkYXRlcygpKTtcbiAgfVxuICBlYWNoQ2hpbGQoY2FsbGJhY2spIHtcbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0gfHwge307XG4gICAgZm9yIChsZXQgaWQgaW4gY2hpbGRyZW4pIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMuZ2V0Q2hpbGRCeUlkKGlkKSk7XG4gICAgfVxuICB9XG4gIG9uQ2hhbm5lbChldmVudCwgY2IpIHtcbiAgICB0aGlzLmxpdmVTb2NrZXQub25DaGFubmVsKHRoaXMuY2hhbm5lbCwgZXZlbnQsIChyZXNwKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc0pvaW5QZW5kaW5nKCkpIHtcbiAgICAgICAgdGhpcy5yb290LnBlbmRpbmdKb2luT3BzLnB1c2goW3RoaXMsICgpID0+IGNiKHJlc3ApXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgYmluZENoYW5uZWwoKSB7XG4gICAgdGhpcy5saXZlU29ja2V0Lm9uQ2hhbm5lbCh0aGlzLmNoYW5uZWwsIFwiZGlmZlwiLCAocmF3RGlmZikgPT4ge1xuICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByYXdEaWZmLCAoeyBkaWZmLCBldmVudHMgfSkgPT4gdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLm9uQ2hhbm5lbChcInJlZGlyZWN0XCIsICh7IHRvLCBmbGFzaCB9KSA9PiB0aGlzLm9uUmVkaXJlY3QoeyB0bywgZmxhc2ggfSkpO1xuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKTtcbiAgICB0aGlzLm9uQ2hhbm5lbChcImxpdmVfcmVkaXJlY3RcIiwgKHJlZGlyKSA9PiB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlZGlyKSk7XG4gICAgdGhpcy5jaGFubmVsLm9uRXJyb3IoKHJlYXNvbikgPT4gdGhpcy5vbkVycm9yKHJlYXNvbikpO1xuICAgIHRoaXMuY2hhbm5lbC5vbkNsb3NlKChyZWFzb24pID0+IHRoaXMub25DbG9zZShyZWFzb24pKTtcbiAgfVxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKSB7XG4gICAgdGhpcy5lYWNoQ2hpbGQoKGNoaWxkKSA9PiBjaGlsZC5kZXN0cm95KCkpO1xuICB9XG4gIG9uTGl2ZVJlZGlyZWN0KHJlZGlyKSB7XG4gICAgbGV0IHsgdG8sIGtpbmQsIGZsYXNoIH0gPSByZWRpcjtcbiAgICBsZXQgdXJsID0gdGhpcy5leHBhbmRVUkwodG8pO1xuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QodXJsLCBraW5kLCBmbGFzaCk7XG4gIH1cbiAgb25MaXZlUGF0Y2gocmVkaXIpIHtcbiAgICBsZXQgeyB0bywga2luZCB9ID0gcmVkaXI7XG4gICAgdGhpcy5ocmVmID0gdGhpcy5leHBhbmRVUkwodG8pO1xuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UGF0Y2godG8sIGtpbmQpO1xuICB9XG4gIGV4cGFuZFVSTCh0bykge1xuICAgIHJldHVybiB0by5zdGFydHNXaXRoKFwiL1wiKSA/IGAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9JHt0b31gIDogdG87XG4gIH1cbiAgb25SZWRpcmVjdCh7IHRvLCBmbGFzaCB9KSB7XG4gICAgdGhpcy5saXZlU29ja2V0LnJlZGlyZWN0KHRvLCBmbGFzaCk7XG4gIH1cbiAgaXNEZXN0cm95ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzdHJveWVkO1xuICB9XG4gIGpvaW5EZWFkKCkge1xuICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcbiAgfVxuICBqb2luKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zaG93TG9hZGVyKHRoaXMubGl2ZVNvY2tldC5sb2FkZXJUaW1lb3V0KTtcbiAgICB0aGlzLmJpbmRDaGFubmVsKCk7XG4gICAgaWYgKHRoaXMuaXNNYWluKCkpIHtcbiAgICAgIHRoaXMuc3RvcENhbGxiYWNrID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7IHRvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiaW5pdGlhbFwiIH0pO1xuICAgIH1cbiAgICB0aGlzLmpvaW5DYWxsYmFjayA9IChvbkRvbmUpID0+IHtcbiAgICAgIG9uRG9uZSA9IG9uRG9uZSB8fCBmdW5jdGlvbigpIHtcbiAgICAgIH07XG4gICAgICBjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuam9pbkNvdW50LCBvbkRvbmUpIDogb25Eb25lKCk7XG4gICAgfTtcbiAgICB0aGlzLmxpdmVTb2NrZXQud3JhcFB1c2godGhpcywgeyB0aW1lb3V0OiBmYWxzZSB9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFubmVsLmpvaW4oKS5yZWNlaXZlKFwib2tcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB0aGlzLm9uSm9pbihkYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH0pLnJlY2VpdmUoXCJlcnJvclwiLCAocmVzcCkgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiB0aGlzLm9uSm9pbkVycm9yKHJlc3ApKS5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIHRoaXMub25Kb2luRXJyb3IoeyByZWFzb246IFwidGltZW91dFwiIH0pKTtcbiAgICB9KTtcbiAgfVxuICBvbkpvaW5FcnJvcihyZXNwKSB7XG4gICAgaWYgKHJlc3AucmVhc29uID09PSBcInJlbG9hZFwiKSB7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtgZmFpbGVkIG1vdW50IHdpdGggJHtyZXNwLnN0YXR1c30uIEZhbGxpbmcgYmFjayB0byBwYWdlIHJlcXVlc3RgLCByZXNwXSk7XG4gICAgICBpZiAodGhpcy5pc01haW4oKSkge1xuICAgICAgICB0aGlzLm9uUmVkaXJlY3QoeyB0bzogdGhpcy5ocmVmIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAocmVzcC5yZWFzb24gPT09IFwidW5hdXRob3JpemVkXCIgfHwgcmVzcC5yZWFzb24gPT09IFwic3RhbGVcIikge1xuICAgICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbXCJ1bmF1dGhvcml6ZWQgbGl2ZV9yZWRpcmVjdC4gRmFsbGluZyBiYWNrIHRvIHBhZ2UgcmVxdWVzdFwiLCByZXNwXSk7XG4gICAgICBpZiAodGhpcy5pc01haW4oKSkge1xuICAgICAgICB0aGlzLm9uUmVkaXJlY3QoeyB0bzogdGhpcy5ocmVmIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocmVzcC5yZWRpcmVjdCB8fCByZXNwLmxpdmVfcmVkaXJlY3QpIHtcbiAgICAgIHRoaXMuam9pblBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2hhbm5lbC5sZWF2ZSgpO1xuICAgIH1cbiAgICBpZiAocmVzcC5yZWRpcmVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMub25SZWRpcmVjdChyZXNwLnJlZGlyZWN0KTtcbiAgICB9XG4gICAgaWYgKHJlc3AubGl2ZV9yZWRpcmVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KTtcbiAgICB9XG4gICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKTtcbiAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYWJsZSB0byBqb2luXCIsIHJlc3BdKTtcbiAgICBpZiAodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMpO1xuICAgIH1cbiAgfVxuICBvbkNsb3NlKHJlYXNvbikge1xuICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHJlYXNvbiAhPT0gXCJsZWF2ZVwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcyk7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveUFsbENoaWxkcmVuKCk7XG4gICAgdGhpcy5saXZlU29ja2V0LmRyb3BBY3RpdmVFbGVtZW50KHRoaXMpO1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpIHtcbiAgICAgIHRoaXMuc2hvd0xvYWRlcihCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUKTtcbiAgICB9XG4gIH1cbiAgb25FcnJvcihyZWFzb24pIHtcbiAgICB0aGlzLm9uQ2xvc2UocmVhc29uKTtcbiAgICBpZiAodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widmlldyBjcmFzaGVkXCIsIHJlYXNvbl0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpIHtcbiAgICAgIGlmICh0aGlzLmxpdmVTb2NrZXQuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9DTElFTlRfRVJST1JfQ0xBU1NdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZGlzcGxheUVycm9yKGNsYXNzZXMpIHtcbiAgICBpZiAodGhpcy5pc01haW4oKSkge1xuICAgICAgZG9tX2RlZmF1bHQuZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7IGRldGFpbDogeyB0bzogdGhpcy5ocmVmLCBraW5kOiBcImVycm9yXCIgfSB9KTtcbiAgICB9XG4gICAgdGhpcy5zaG93TG9hZGVyKCk7XG4gICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpO1xuICAgIHRoaXMuZXhlY0FsbCh0aGlzLmJpbmRpbmcoXCJkaXNjb25uZWN0ZWRcIikpO1xuICB9XG4gIHB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBldmVudCwgcGF5bG9hZCwgb25SZXBseSA9IGZ1bmN0aW9uKCkge1xuICB9KSB7XG4gICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IFtyZWYsIFtlbF0sIG9wdHNdID0gcmVmR2VuZXJhdG9yID8gcmVmR2VuZXJhdG9yKCkgOiBbbnVsbCwgW10sIHt9XTtcbiAgICBsZXQgb25Mb2FkaW5nRG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgaWYgKG9wdHMucGFnZV9sb2FkaW5nIHx8IGVsICYmIGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX1BBR0VfTE9BRElORykpICE9PSBudWxsKSB7XG4gICAgICBvbkxvYWRpbmdEb25lID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7IGtpbmQ6IFwiZWxlbWVudFwiLCB0YXJnZXQ6IGVsIH0pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBheWxvYWQuY2lkICE9PSBcIm51bWJlclwiKSB7XG4gICAgICBkZWxldGUgcGF5bG9hZC5jaWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQud3JhcFB1c2godGhpcywgeyB0aW1lb3V0OiB0cnVlIH0sICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHVzaChldmVudCwgcGF5bG9hZCwgUFVTSF9USU1FT1VUKS5yZWNlaXZlKFwib2tcIiwgKHJlc3ApID0+IHtcbiAgICAgICAgbGV0IGZpbmlzaCA9IChob29rUmVwbHkpID0+IHtcbiAgICAgICAgICBpZiAocmVzcC5yZWRpcmVjdCkge1xuICAgICAgICAgICAgdGhpcy5vblJlZGlyZWN0KHJlc3AucmVkaXJlY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcC5saXZlX3BhdGNoKSB7XG4gICAgICAgICAgICB0aGlzLm9uTGl2ZVBhdGNoKHJlc3AubGl2ZV9wYXRjaCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwLmxpdmVfcmVkaXJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb25Mb2FkaW5nRG9uZSgpO1xuICAgICAgICAgIG9uUmVwbHkocmVzcCwgaG9va1JlcGx5KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc3AuZGlmZikge1xuICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlEaWZmKFwidXBkYXRlXCIsIHJlc3AuZGlmZiwgKHsgZGlmZiwgcmVwbHksIGV2ZW50cyB9KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChyZWYgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzKTtcbiAgICAgICAgICAgICAgZmluaXNoKHJlcGx5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyZWYgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmluaXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICB1bmRvUmVmcyhyZWYpIHtcbiAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkb21fZGVmYXVsdC5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMuaWR9XCJdWyR7UEhYX1JFRn09XCIke3JlZn1cIl1gLCAoZWwpID0+IHtcbiAgICAgIGxldCBkaXNhYmxlZFZhbCA9IGVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQpO1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUYpO1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfU1JDKTtcbiAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKSAhPT0gbnVsbCkge1xuICAgICAgICBlbC5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXNhYmxlZFZhbCAhPT0gbnVsbCkge1xuICAgICAgICBlbC5kaXNhYmxlZCA9IGRpc2FibGVkVmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9ESVNBQkxFRCk7XG4gICAgICB9XG4gICAgICBQSFhfRVZFTlRfQ0xBU1NFUy5mb3JFYWNoKChjbGFzc05hbWUpID0+IGRvbV9kZWZhdWx0LnJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpKTtcbiAgICAgIGxldCBkaXNhYmxlUmVzdG9yZSA9IGVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpO1xuICAgICAgaWYgKGRpc2FibGVSZXN0b3JlICE9PSBudWxsKSB7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IGRpc2FibGVSZXN0b3JlO1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKTtcbiAgICAgIH1cbiAgICAgIGxldCB0b0VsID0gZG9tX2RlZmF1bHQucHJpdmF0ZShlbCwgUEhYX1JFRik7XG4gICAgICBpZiAodG9FbCkge1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZWwsIHRvRWwpO1xuICAgICAgICBET01QYXRjaC5wYXRjaEVsKGVsLCB0b0VsLCB0aGlzLmxpdmVTb2NrZXQuZ2V0QWN0aXZlRWxlbWVudCgpKTtcbiAgICAgICAgaWYgKGhvb2spIHtcbiAgICAgICAgICBob29rLl9fdXBkYXRlZCgpO1xuICAgICAgICB9XG4gICAgICAgIGRvbV9kZWZhdWx0LmRlbGV0ZVByaXZhdGUoZWwsIFBIWF9SRUYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHB1dFJlZihlbGVtZW50cywgZXZlbnQsIG9wdHMgPSB7fSkge1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZisrO1xuICAgIGxldCBkaXNhYmxlV2l0aCA9IHRoaXMuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKTtcbiAgICBpZiAob3B0cy5sb2FkaW5nKSB7XG4gICAgICBlbGVtZW50cyA9IGVsZW1lbnRzLmNvbmNhdChkb21fZGVmYXVsdC5hbGwoZG9jdW1lbnQsIG9wdHMubG9hZGluZykpO1xuICAgIH1cbiAgICBlbGVtZW50cy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgcGh4LSR7ZXZlbnR9LWxvYWRpbmdgKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUkVGLCBuZXdSZWYpO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCB0aGlzLmVsLmlkKTtcbiAgICAgIGxldCBkaXNhYmxlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aCk7XG4gICAgICBpZiAoZGlzYWJsZVRleHQgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKCFlbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKSkge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUsIGVsLmlubmVyVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpc2FibGVUZXh0ICE9PSBcIlwiKSB7XG4gICAgICAgICAgZWwuaW5uZXJUZXh0ID0gZGlzYWJsZVRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFtuZXdSZWYsIGVsZW1lbnRzLCBvcHRzXTtcbiAgfVxuICBjb21wb25lbnRJRChlbCkge1xuICAgIGxldCBjaWQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpO1xuICAgIHJldHVybiBjaWQgPyBwYXJzZUludChjaWQpIDogbnVsbDtcbiAgfVxuICB0YXJnZXRDb21wb25lbnRJRCh0YXJnZXQsIHRhcmdldEN0eCwgb3B0cyA9IHt9KSB7XG4gICAgaWYgKGlzQ2lkKHRhcmdldEN0eCkpIHtcbiAgICAgIHJldHVybiB0YXJnZXRDdHg7XG4gICAgfVxuICAgIGxldCBjaWRPclNlbGVjdG9yID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJ0YXJnZXRcIikpO1xuICAgIGlmIChpc0NpZChjaWRPclNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGNpZE9yU2VsZWN0b3IpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0Q3R4ICYmIChjaWRPclNlbGVjdG9yICE9PSBudWxsIHx8IG9wdHMudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBjbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KSB7XG4gICAgaWYgKGlzQ2lkKHRhcmdldEN0eCkpIHtcbiAgICAgIHJldHVybiB0YXJnZXRDdHg7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRDdHgpIHtcbiAgICAgIHJldHVybiBtYXliZSh0YXJnZXRDdHguY2xvc2VzdChgWyR7UEhYX0NPTVBPTkVOVH1dYCksIChlbCkgPT4gdGhpcy5vd25zRWxlbWVudChlbCkgJiYgdGhpcy5jb21wb25lbnRJRChlbCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgcHVzaEhvb2tFdmVudChlbCwgdGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSkge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmxvZyhcImhvb2tcIiwgKCkgPT4gW1widW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiLCBldmVudCwgcGF5bG9hZF0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgW3JlZiwgZWxzLCBvcHRzXSA9IHRoaXMucHV0UmVmKFtlbF0sIFwiaG9va1wiKTtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gW3JlZiwgZWxzLCBvcHRzXSwgXCJldmVudFwiLCB7XG4gICAgICB0eXBlOiBcImhvb2tcIixcbiAgICAgIGV2ZW50LFxuICAgICAgdmFsdWU6IHBheWxvYWQsXG4gICAgICBjaWQ6IHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9LCAocmVzcCwgcmVwbHkpID0+IG9uUmVwbHkocmVwbHksIHJlZikpO1xuICAgIHJldHVybiByZWY7XG4gIH1cbiAgZXh0cmFjdE1ldGEoZWwsIG1ldGEsIHZhbHVlKSB7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghbWV0YSkge1xuICAgICAgICBtZXRhID0ge307XG4gICAgICB9XG4gICAgICBsZXQgbmFtZSA9IGVsLmF0dHJpYnV0ZXNbaV0ubmFtZTtcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuICAgICAgICBtZXRhW25hbWUucmVwbGFjZShwcmVmaXgsIFwiXCIpXSA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVsLnZhbHVlICE9PSB2b2lkIDAgJiYgIShlbCBpbnN0YW5jZW9mIEhUTUxGb3JtRWxlbWVudCkpIHtcbiAgICAgIGlmICghbWV0YSkge1xuICAgICAgICBtZXRhID0ge307XG4gICAgICB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWU7XG4gICAgICBpZiAoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKSB7XG4gICAgICAgIGRlbGV0ZSBtZXRhLnZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGlmICghbWV0YSkge1xuICAgICAgICBtZXRhID0ge307XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgbWV0YVtrZXldID0gdmFsdWVba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGE7XG4gIH1cbiAgcHVzaEV2ZW50KHR5cGUsIGVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBtZXRhLCBvcHRzID0ge30sIG9uUmVwbHkpIHtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW2VsXSwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIH0sIChyZXNwLCByZXBseSkgPT4gb25SZXBseSAmJiBvblJlcGx5KHJlcGx5KSk7XG4gIH1cbiAgcHVzaEZpbGVQcm9ncmVzcyhmaWxlRWwsIGVudHJ5UmVmLCBwcm9ncmVzcywgb25SZXBseSA9IGZ1bmN0aW9uKCkge1xuICB9KSB7XG4gICAgdGhpcy5saXZlU29ja2V0LndpdGhpbk93bmVycyhmaWxlRWwuZm9ybSwgKHZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgdmlldy5wdXNoV2l0aFJlcGx5KG51bGwsIFwicHJvZ3Jlc3NcIiwge1xuICAgICAgICBldmVudDogZmlsZUVsLmdldEF0dHJpYnV0ZSh2aWV3LmJpbmRpbmcoUEhYX1BST0dSRVNTKSksXG4gICAgICAgIHJlZjogZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRiksXG4gICAgICAgIGVudHJ5X3JlZjogZW50cnlSZWYsXG4gICAgICAgIHByb2dyZXNzLFxuICAgICAgICBjaWQ6IHZpZXcudGFyZ2V0Q29tcG9uZW50SUQoZmlsZUVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH0sIG9uUmVwbHkpO1xuICAgIH0pO1xuICB9XG4gIHB1c2hJbnB1dChpbnB1dEVsLCB0YXJnZXRDdHgsIGZvcmNlQ2lkLCBwaHhFdmVudCwgb3B0cywgY2FsbGJhY2spIHtcbiAgICBsZXQgdXBsb2FkcztcbiAgICBsZXQgY2lkID0gaXNDaWQoZm9yY2VDaWQpID8gZm9yY2VDaWQgOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4KTtcbiAgICBsZXQgcmVmR2VuZXJhdG9yID0gKCkgPT4gdGhpcy5wdXRSZWYoW2lucHV0RWwsIGlucHV0RWwuZm9ybV0sIFwiY2hhbmdlXCIsIG9wdHMpO1xuICAgIGxldCBmb3JtRGF0YTtcbiAgICBsZXQgbWV0YSA9IHRoaXMuZXh0cmFjdE1ldGEoaW5wdXRFbC5mb3JtKTtcbiAgICBpZiAoaW5wdXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKSkge1xuICAgICAgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwgeyBfdGFyZ2V0OiBvcHRzLl90YXJnZXQsIC4uLm1ldGEgfSwgW2lucHV0RWwubmFtZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCB7IF90YXJnZXQ6IG9wdHMuX3RhcmdldCwgLi4ubWV0YSB9KTtcbiAgICB9XG4gICAgaWYgKGRvbV9kZWZhdWx0LmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5maWxlcyAmJiBpbnB1dEVsLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKGlucHV0RWwsIEFycmF5LmZyb20oaW5wdXRFbC5maWxlcykpO1xuICAgIH1cbiAgICB1cGxvYWRzID0gTGl2ZVVwbG9hZGVyLnNlcmlhbGl6ZVVwbG9hZHMoaW5wdXRFbCk7XG4gICAgbGV0IGV2ZW50ID0ge1xuICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICB1cGxvYWRzLFxuICAgICAgY2lkXG4gICAgfTtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBcImV2ZW50XCIsIGV2ZW50LCAocmVzcCkgPT4ge1xuICAgICAgZG9tX2RlZmF1bHQuc2hvd0Vycm9yKGlucHV0RWwsIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9GRUVEQkFDS19GT1IpKTtcbiAgICAgIGlmIChkb21fZGVmYXVsdC5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIGRvbV9kZWZhdWx0LmlzQXV0b1VwbG9hZChpbnB1dEVsKSkge1xuICAgICAgICBpZiAoTGl2ZVVwbG9hZGVyLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXRFbCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGxldCBbcmVmLCBfZWxzXSA9IHJlZkdlbmVyYXRvcigpO1xuICAgICAgICAgIHRoaXMudXBsb2FkRmlsZXMoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3ApO1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXdhaXRpbmdTdWJtaXQoaW5wdXRFbC5mb3JtKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgdHJpZ2dlckF3YWl0aW5nU3VibWl0KGZvcm1FbCkge1xuICAgIGxldCBhd2FpdGluZ1N1Ym1pdCA9IHRoaXMuZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCk7XG4gICAgaWYgKGF3YWl0aW5nU3VibWl0KSB7XG4gICAgICBsZXQgW19lbCwgX3JlZiwgX29wdHMsIGNhbGxiYWNrXSA9IGF3YWl0aW5nU3VibWl0O1xuICAgICAgdGhpcy5jYW5jZWxTdWJtaXQoZm9ybUVsKTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG4gIGdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtU3VibWl0cy5maW5kKChbZWwsIF9yZWYsIF9vcHRzLCBfY2FsbGJhY2tdKSA9PiBlbC5pc1NhbWVOb2RlKGZvcm1FbCkpO1xuICB9XG4gIHNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5mb3JtU3VibWl0cy5wdXNoKFtmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2tdKTtcbiAgfVxuICBjYW5jZWxTdWJtaXQoZm9ybUVsKSB7XG4gICAgdGhpcy5mb3JtU3VibWl0cyA9IHRoaXMuZm9ybVN1Ym1pdHMuZmlsdGVyKChbZWwsIHJlZiwgX2NhbGxiYWNrXSkgPT4ge1xuICAgICAgaWYgKGVsLmlzU2FtZU5vZGUoZm9ybUVsKSkge1xuICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGRpc2FibGVGb3JtKGZvcm1FbCwgb3B0cyA9IHt9KSB7XG4gICAgbGV0IGZpbHRlcklnbm9yZWQgPSAoZWwpID0+IHtcbiAgICAgIGxldCB1c2VySWdub3JlZCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGVsLCBgJHt0aGlzLmJpbmRpbmcoUEhYX1VQREFURSl9PWlnbm9yZWAsIGVsLmZvcm0pO1xuICAgICAgcmV0dXJuICEodXNlcklnbm9yZWQgfHwgY2xvc2VzdFBoeEJpbmRpbmcoZWwsIFwiZGF0YS1waHgtdXBkYXRlPWlnbm9yZVwiLCBlbC5mb3JtKSk7XG4gICAgfTtcbiAgICBsZXQgZmlsdGVyRGlzYWJsZXMgPSAoZWwpID0+IHtcbiAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpKTtcbiAgICB9O1xuICAgIGxldCBmaWx0ZXJCdXR0b24gPSAoZWwpID0+IGVsLnRhZ05hbWUgPT0gXCJCVVRUT05cIjtcbiAgICBsZXQgZmlsdGVySW5wdXQgPSAoZWwpID0+IFtcIklOUFVUXCIsIFwiVEVYVEFSRUFcIiwgXCJTRUxFQ1RcIl0uaW5jbHVkZXMoZWwudGFnTmFtZSk7XG4gICAgbGV0IGZvcm1FbGVtZW50cyA9IEFycmF5LmZyb20oZm9ybUVsLmVsZW1lbnRzKTtcbiAgICBsZXQgZGlzYWJsZXMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckRpc2FibGVzKTtcbiAgICBsZXQgYnV0dG9ucyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVyQnV0dG9uKS5maWx0ZXIoZmlsdGVySWdub3JlZCk7XG4gICAgbGV0IGlucHV0cyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVySW5wdXQpLmZpbHRlcihmaWx0ZXJJZ25vcmVkKTtcbiAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGJ1dHRvbi5kaXNhYmxlZCk7XG4gICAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9SRUFET05MWSwgaW5wdXQucmVhZE9ubHkpO1xuICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgaWYgKGlucHV0LmZpbGVzKSB7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGlucHV0LmRpc2FibGVkKTtcbiAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGZvcm1FbC5zZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9QQUdFX0xPQURJTkcpLCBcIlwiKTtcbiAgICByZXR1cm4gdGhpcy5wdXRSZWYoW2Zvcm1FbF0uY29uY2F0KGRpc2FibGVzKS5jb25jYXQoYnV0dG9ucykuY29uY2F0KGlucHV0cyksIFwic3VibWl0XCIsIG9wdHMpO1xuICB9XG4gIHB1c2hGb3JtU3VibWl0KGZvcm1FbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgc3VibWl0dGVyLCBvcHRzLCBvblJlcGx5KSB7XG4gICAgbGV0IHJlZkdlbmVyYXRvciA9ICgpID0+IHRoaXMuZGlzYWJsZUZvcm0oZm9ybUVsLCBvcHRzKTtcbiAgICBsZXQgY2lkID0gdGhpcy50YXJnZXRDb21wb25lbnRJRChmb3JtRWwsIHRhcmdldEN0eCk7XG4gICAgaWYgKExpdmVVcGxvYWRlci5oYXNVcGxvYWRzSW5Qcm9ncmVzcyhmb3JtRWwpKSB7XG4gICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKTtcbiAgICAgIGxldCBwdXNoID0gKCkgPT4gdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHN1Ym1pdHRlciwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgb25SZXBseSk7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZVN1Ym1pdChmb3JtRWwsIHJlZiwgb3B0cywgcHVzaCk7XG4gICAgfSBlbHNlIGlmIChMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgW3JlZiwgZWxzXSA9IHJlZkdlbmVyYXRvcigpO1xuICAgICAgbGV0IHByb3h5UmVmR2VuID0gKCkgPT4gW3JlZiwgZWxzLCBvcHRzXTtcbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZm9ybUVsLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgbGV0IG1ldGEgPSB0aGlzLmV4dHJhY3RNZXRhKGZvcm1FbCk7XG4gICAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsLCB7IHN1Ym1pdHRlciwgLi4ubWV0YSB9KTtcbiAgICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHByb3h5UmVmR2VuLCBcImV2ZW50XCIsIHtcbiAgICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgICAgIGNpZFxuICAgICAgICB9LCBvblJlcGx5KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIShmb3JtRWwuaGFzQXR0cmlidXRlKFBIWF9SRUYpICYmIGZvcm1FbC5jbGFzc0xpc3QuY29udGFpbnMoXCJwaHgtc3VibWl0LWxvYWRpbmdcIikpKSB7XG4gICAgICBsZXQgbWV0YSA9IHRoaXMuZXh0cmFjdE1ldGEoZm9ybUVsKTtcbiAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsLCB7IHN1Ym1pdHRlciwgLi4ubWV0YSB9KTtcbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwge1xuICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgIGNpZFxuICAgICAgfSwgb25SZXBseSk7XG4gICAgfVxuICB9XG4gIHVwbG9hZEZpbGVzKGZvcm1FbCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgb25Db21wbGV0ZSkge1xuICAgIGxldCBqb2luQ291bnRBdFVwbG9hZCA9IHRoaXMuam9pbkNvdW50O1xuICAgIGxldCBpbnB1dEVscyA9IExpdmVVcGxvYWRlci5hY3RpdmVGaWxlSW5wdXRzKGZvcm1FbCk7XG4gICAgbGV0IG51bUZpbGVJbnB1dHNJblByb2dyZXNzID0gaW5wdXRFbHMubGVuZ3RoO1xuICAgIGlucHV0RWxzLmZvckVhY2goKGlucHV0RWwpID0+IHtcbiAgICAgIGxldCB1cGxvYWRlciA9IG5ldyBMaXZlVXBsb2FkZXIoaW5wdXRFbCwgdGhpcywgKCkgPT4ge1xuICAgICAgICBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcy0tO1xuICAgICAgICBpZiAobnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MgPT09IDApIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy51cGxvYWRlcnNbaW5wdXRFbF0gPSB1cGxvYWRlcjtcbiAgICAgIGxldCBlbnRyaWVzID0gdXBsb2FkZXIuZW50cmllcygpLm1hcCgoZW50cnkpID0+IGVudHJ5LnRvUHJlZmxpZ2h0UGF5bG9hZCgpKTtcbiAgICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgICByZWY6IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgICAgY2lkOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgfTtcbiAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcInNlbmRpbmcgcHJlZmxpZ2h0IHJlcXVlc3RcIiwgcGF5bG9hZF0pO1xuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KG51bGwsIFwiYWxsb3dfdXBsb2FkXCIsIHBheWxvYWQsIChyZXNwKSA9PiB7XG4gICAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcImdvdCBwcmVmbGlnaHQgcmVzcG9uc2VcIiwgcmVzcF0pO1xuICAgICAgICBpZiAocmVzcC5lcnJvcikge1xuICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmKTtcbiAgICAgICAgICBsZXQgW2VudHJ5X3JlZiwgcmVhc29uXSA9IHJlc3AuZXJyb3I7XG4gICAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW2BlcnJvciBmb3IgZW50cnkgJHtlbnRyeV9yZWZ9YCwgcmVhc29uXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG9uRXJyb3IgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuam9pbkNvdW50ID09PSBqb2luQ291bnRBdFVwbG9hZCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdXBsb2FkZXIuaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgdGhpcy5saXZlU29ja2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXNPckJsb2JzKSB7XG4gICAgbGV0IHRhcmdldEVsZW1lbnQgPSB0aGlzLnRhcmdldEN0eEVsZW1lbnQodGFyZ2V0Q3R4KSB8fCB0aGlzLmVsO1xuICAgIGxldCBpbnB1dHMgPSBkb21fZGVmYXVsdC5maW5kVXBsb2FkSW5wdXRzKHRhcmdldEVsZW1lbnQpLmZpbHRlcigoZWwpID0+IGVsLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChpbnB1dHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBsb2dFcnJvcihgbm8gbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGxvZ0Vycm9yKGBkdXBsaWNhdGUgbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb21fZGVmYXVsdC5kaXNwYXRjaEV2ZW50KGlucHV0c1swXSwgUEhYX1RSQUNLX1VQTE9BRFMsIHsgZGV0YWlsOiB7IGZpbGVzOiBmaWxlc09yQmxvYnMgfSB9KTtcbiAgICB9XG4gIH1cbiAgdGFyZ2V0Q3R4RWxlbWVudCh0YXJnZXRDdHgpIHtcbiAgICBpZiAoaXNDaWQodGFyZ2V0Q3R4KSkge1xuICAgICAgbGV0IFt0YXJnZXRdID0gZG9tX2RlZmF1bHQuZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIHRhcmdldEN0eCk7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0Q3R4KSB7XG4gICAgICByZXR1cm4gdGFyZ2V0Q3R4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgcHVzaEZvcm1SZWNvdmVyeShmb3JtLCBuZXdDaWQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5saXZlU29ja2V0LndpdGhpbk93bmVycyhmb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpO1xuICAgICAgbGV0IGlucHV0cyA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZmlsdGVyKChlbCkgPT4gZG9tX2RlZmF1bHQuaXNGb3JtSW5wdXQoZWwpICYmIGVsLm5hbWUgJiYgIWVsLmhhc0F0dHJpYnV0ZShwaHhDaGFuZ2UpKTtcbiAgICAgIGlmIChpbnB1dHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dDIpID0+IGlucHV0Mi5oYXNBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICYmIExpdmVVcGxvYWRlci5jbGVhckZpbGVzKGlucHV0MikpO1xuICAgICAgbGV0IGlucHV0ID0gaW5wdXRzLmZpbmQoKGVsKSA9PiBlbC50eXBlICE9PSBcImhpZGRlblwiKSB8fCBpbnB1dHNbMF07XG4gICAgICBsZXQgcGh4RXZlbnQgPSBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpIHx8IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSk7XG4gICAgICBqc19kZWZhdWx0LmV4ZWMoXCJjaGFuZ2VcIiwgcGh4RXZlbnQsIHZpZXcsIGlucHV0LCBbXCJwdXNoXCIsIHsgX3RhcmdldDogaW5wdXQubmFtZSwgbmV3Q2lkLCBjYWxsYmFjayB9XSk7XG4gICAgfSk7XG4gIH1cbiAgcHVzaExpbmtQYXRjaChocmVmLCB0YXJnZXRFbCwgY2FsbGJhY2spIHtcbiAgICBsZXQgbGlua1JlZiA9IHRoaXMubGl2ZVNvY2tldC5zZXRQZW5kaW5nTGluayhocmVmKTtcbiAgICBsZXQgcmVmR2VuID0gdGFyZ2V0RWwgPyAoKSA9PiB0aGlzLnB1dFJlZihbdGFyZ2V0RWxdLCBcImNsaWNrXCIpIDogbnVsbDtcbiAgICBsZXQgZmFsbGJhY2sgPSAoKSA9PiB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3Qod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgIGxldCB1cmwgPSBocmVmLnN0YXJ0c1dpdGgoXCIvXCIpID8gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9JHtocmVmfWAgOiBocmVmO1xuICAgIGxldCBwdXNoID0gdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbiwgXCJsaXZlX3BhdGNoXCIsIHsgdXJsIH0sIChyZXNwKSA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmIChyZXNwLmxpbmtfcmVkaXJlY3QpIHtcbiAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2ssIGxpbmtSZWYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLmxpdmVTb2NrZXQuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpIHtcbiAgICAgICAgICAgIHRoaXMuaHJlZiA9IGhyZWY7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpO1xuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKGxpbmtSZWYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocHVzaCkge1xuICAgICAgcHVzaC5yZWNlaXZlKFwidGltZW91dFwiLCBmYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZhbGxiYWNrKCk7XG4gICAgfVxuICB9XG4gIGZvcm1zRm9yUmVjb3ZlcnkoaHRtbCkge1xuICAgIGlmICh0aGlzLmpvaW5Db3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiBkb21fZGVmYXVsdC5hbGwodGhpcy5lbCwgYGZvcm1bJHtwaHhDaGFuZ2V9XWApLmZpbHRlcigoZm9ybSkgPT4gZm9ybS5pZCAmJiB0aGlzLm93bnNFbGVtZW50KGZvcm0pKS5maWx0ZXIoKGZvcm0pID0+IGZvcm0uZWxlbWVudHMubGVuZ3RoID4gMCkuZmlsdGVyKChmb3JtKSA9PiBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpICE9PSBcImlnbm9yZVwiKS5tYXAoKGZvcm0pID0+IHtcbiAgICAgIGNvbnN0IHBoeENoYW5nZVZhbHVlID0gZm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKS5yZXBsYWNlQWxsKC8oW1xcW1xcXVwiXSkvZywgXCJcXFxcJDFcIik7XG4gICAgICBsZXQgbmV3Rm9ybSA9IHRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvcihgZm9ybVtpZD1cIiR7Zm9ybS5pZH1cIl1bJHtwaHhDaGFuZ2V9PVwiJHtwaHhDaGFuZ2VWYWx1ZX1cIl1gKTtcbiAgICAgIGlmIChuZXdGb3JtKSB7XG4gICAgICAgIHJldHVybiBbZm9ybSwgbmV3Rm9ybSwgdGhpcy50YXJnZXRDb21wb25lbnRJRChuZXdGb3JtKV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW2Zvcm0sIGZvcm0sIHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoZm9ybSldO1xuICAgICAgfVxuICAgIH0pLmZpbHRlcigoW2Zvcm0sIG5ld0Zvcm0sIG5ld0NpZF0pID0+IG5ld0Zvcm0pO1xuICB9XG4gIG1heWJlUHVzaENvbXBvbmVudHNEZXN0cm95ZWQoZGVzdHJveWVkQ0lEcykge1xuICAgIGxldCB3aWxsRGVzdHJveUNJRHMgPSBkZXN0cm95ZWRDSURzLmZpbHRlcigoY2lkKSA9PiB7XG4gICAgICByZXR1cm4gZG9tX2RlZmF1bHQuZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwO1xuICAgIH0pO1xuICAgIGlmICh3aWxsRGVzdHJveUNJRHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wcnVuaW5nQ0lEcy5wdXNoKC4uLndpbGxEZXN0cm95Q0lEcyk7XG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX3dpbGxfZGVzdHJveVwiLCB7IGNpZHM6IHdpbGxEZXN0cm95Q0lEcyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMucHJ1bmluZ0NJRHMgPSB0aGlzLnBydW5pbmdDSURzLmZpbHRlcigoY2lkKSA9PiB3aWxsRGVzdHJveUNJRHMuaW5kZXhPZihjaWQpICE9PSAtMSk7XG4gICAgICAgIGxldCBjb21wbGV0ZWx5RGVzdHJveUNJRHMgPSB3aWxsRGVzdHJveUNJRHMuZmlsdGVyKChjaWQpID0+IHtcbiAgICAgICAgICByZXR1cm4gZG9tX2RlZmF1bHQuZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNvbXBsZXRlbHlEZXN0cm95Q0lEcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KG51bGwsIFwiY2lkc19kZXN0cm95ZWRcIiwgeyBjaWRzOiBjb21wbGV0ZWx5RGVzdHJveUNJRHMgfSwgKHJlc3ApID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWQucHJ1bmVDSURzKHJlc3AuY2lkcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBvd25zRWxlbWVudChlbCkge1xuICAgIGxldCBwYXJlbnRWaWV3RWwgPSBlbC5jbG9zZXN0KFBIWF9WSUVXX1NFTEVDVE9SKTtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpID09PSB0aGlzLmlkIHx8IHBhcmVudFZpZXdFbCAmJiBwYXJlbnRWaWV3RWwuaWQgPT09IHRoaXMuaWQgfHwgIXBhcmVudFZpZXdFbCAmJiB0aGlzLmlzRGVhZDtcbiAgfVxuICBzdWJtaXRGb3JtKGZvcm0sIHRhcmdldEN0eCwgcGh4RXZlbnQsIHN1Ym1pdHRlciwgb3B0cyA9IHt9KSB7XG4gICAgZG9tX2RlZmF1bHQucHV0UHJpdmF0ZShmb3JtLCBQSFhfSEFTX1NVQk1JVFRFRCwgdHJ1ZSk7XG4gICAgbGV0IHBoeEZlZWRiYWNrID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX0ZFRURCQUNLX0ZPUik7XG4gICAgbGV0IGlucHV0cyA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cyk7XG4gICAgaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiBkb21fZGVmYXVsdC5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRCwgdHJ1ZSkpO1xuICAgIHRoaXMubGl2ZVNvY2tldC5ibHVyQWN0aXZlRWxlbWVudCh0aGlzKTtcbiAgICB0aGlzLnB1c2hGb3JtU3VibWl0KGZvcm0sIHRhcmdldEN0eCwgcGh4RXZlbnQsIHN1Ym1pdHRlciwgb3B0cywgKCkgPT4ge1xuICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiBkb21fZGVmYXVsdC5zaG93RXJyb3IoaW5wdXQsIHBoeEZlZWRiYWNrKSk7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpO1xuICAgIH0pO1xuICB9XG4gIGJpbmRpbmcoa2luZCkge1xuICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhraW5kKTtcbiAgfVxufTtcblxuLy8ganMvcGhvZW5peF9saXZlX3ZpZXcvbGl2ZV9zb2NrZXQuanNcbnZhciBMaXZlU29ja2V0ID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcih1cmwsIHBoeFNvY2tldCwgb3B0cyA9IHt9KSB7XG4gICAgdGhpcy51bmxvYWRlZCA9IGZhbHNlO1xuICAgIGlmICghcGh4U29ja2V0IHx8IHBoeFNvY2tldC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgYSBwaG9lbml4IFNvY2tldCBtdXN0IGJlIHByb3ZpZGVkIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gdGhlIExpdmVTb2NrZXQgY29uc3RydWN0b3IuIEZvciBleGFtcGxlOlxuXG4gICAgICAgICAgaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbiAgICAgICAgICBpbXBvcnQge0xpdmVTb2NrZXR9IGZyb20gXCJwaG9lbml4X2xpdmVfdmlld1wiXG4gICAgICAgICAgbGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVNvY2tldChcIi9saXZlXCIsIFNvY2tldCwgey4uLn0pXG4gICAgICBgKTtcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgcGh4U29ja2V0KHVybCwgb3B0cyk7XG4gICAgdGhpcy5iaW5kaW5nUHJlZml4ID0gb3B0cy5iaW5kaW5nUHJlZml4IHx8IEJJTkRJTkdfUFJFRklYO1xuICAgIHRoaXMub3B0cyA9IG9wdHM7XG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KTtcbiAgICB0aGlzLnZpZXdMb2dnZXIgPSBvcHRzLnZpZXdMb2dnZXI7XG4gICAgdGhpcy5tZXRhZGF0YUNhbGxiYWNrcyA9IG9wdHMubWV0YWRhdGEgfHwge307XG4gICAgdGhpcy5kZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oY2xvbmUoREVGQVVMVFMpLCBvcHRzLmRlZmF1bHRzIHx8IHt9KTtcbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGw7XG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlO1xuICAgIHRoaXMubWFpbiA9IG51bGw7XG4gICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IG51bGw7XG4gICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGw7XG4gICAgdGhpcy5saW5rUmVmID0gMTtcbiAgICB0aGlzLnJvb3RzID0ge307XG4gICAgdGhpcy5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50TG9jYXRpb24gPSBjbG9uZSh3aW5kb3cubG9jYXRpb24pO1xuICAgIHRoaXMuaG9va3MgPSBvcHRzLmhvb2tzIHx8IHt9O1xuICAgIHRoaXMudXBsb2FkZXJzID0gb3B0cy51cGxvYWRlcnMgfHwge307XG4gICAgdGhpcy5sb2FkZXJUaW1lb3V0ID0gb3B0cy5sb2FkZXJUaW1lb3V0IHx8IExPQURFUl9USU1FT1VUO1xuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gbnVsbDtcbiAgICB0aGlzLm1heFJlbG9hZHMgPSBvcHRzLm1heFJlbG9hZHMgfHwgTUFYX1JFTE9BRFM7XG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNaW4gPSBvcHRzLnJlbG9hZEppdHRlck1pbiB8fCBSRUxPQURfSklUVEVSX01JTjtcbiAgICB0aGlzLnJlbG9hZEppdHRlck1heCA9IG9wdHMucmVsb2FkSml0dGVyTWF4IHx8IFJFTE9BRF9KSVRURVJfTUFYO1xuICAgIHRoaXMuZmFpbHNhZmVKaXR0ZXIgPSBvcHRzLmZhaWxzYWZlSml0dGVyIHx8IEZBSUxTQUZFX0pJVFRFUjtcbiAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IG9wdHMubG9jYWxTdG9yYWdlIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZSA9IG9wdHMuc2Vzc2lvblN0b3JhZ2UgfHwgd2luZG93LnNlc3Npb25TdG9yYWdlO1xuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IGZhbHNlO1xuICAgIHRoaXMuZG9tQ2FsbGJhY2tzID0gT2JqZWN0LmFzc2lnbih7IG9uTm9kZUFkZGVkOiBjbG9zdXJlKCksIG9uQmVmb3JlRWxVcGRhdGVkOiBjbG9zdXJlKCkgfSwgb3B0cy5kb20gfHwge30pO1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgVHJhbnNpdGlvblNldCgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgKF9lKSA9PiB7XG4gICAgICB0aGlzLnVubG9hZGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNVbmxvYWRlZCgpKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpc1Byb2ZpbGVFbmFibGVkKCkge1xuICAgIHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIjtcbiAgfVxuICBpc0RlYnVnRW5hYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9ERUJVRykgPT09IFwidHJ1ZVwiO1xuICB9XG4gIGlzRGVidWdEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9ERUJVRykgPT09IFwiZmFsc2VcIjtcbiAgfVxuICBlbmFibGVEZWJ1ZygpIHtcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcInRydWVcIik7XG4gIH1cbiAgZW5hYmxlUHJvZmlsaW5nKCkge1xuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfUFJPRklMRSwgXCJ0cnVlXCIpO1xuICB9XG4gIGRpc2FibGVEZWJ1ZygpIHtcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcImZhbHNlXCIpO1xuICB9XG4gIGRpc2FibGVQcm9maWxpbmcoKSB7XG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9QUk9GSUxFKTtcbiAgfVxuICBlbmFibGVMYXRlbmN5U2ltKHVwcGVyQm91bmRNcykge1xuICAgIHRoaXMuZW5hYmxlRGVidWcoKTtcbiAgICBjb25zb2xlLmxvZyhcImxhdGVuY3kgc2ltdWxhdG9yIGVuYWJsZWQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gQ2FsbCBkaXNhYmxlTGF0ZW5jeVNpbSgpIHRvIGRpc2FibGVcIik7XG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9MQVRFTkNZX1NJTSwgdXBwZXJCb3VuZE1zKTtcbiAgfVxuICBkaXNhYmxlTGF0ZW5jeVNpbSgpIHtcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNKTtcbiAgfVxuICBnZXRMYXRlbmN5U2ltKCkge1xuICAgIGxldCBzdHIgPSB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNKTtcbiAgICByZXR1cm4gc3RyID8gcGFyc2VJbnQoc3RyKSA6IG51bGw7XG4gIH1cbiAgZ2V0U29ja2V0KCkge1xuICAgIHJldHVybiB0aGlzLnNvY2tldDtcbiAgfVxuICBjb25uZWN0KCkge1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIgJiYgIXRoaXMuaXNEZWJ1Z0Rpc2FibGVkKCkpIHtcbiAgICAgIHRoaXMuZW5hYmxlRGVidWcoKTtcbiAgICB9XG4gICAgbGV0IGRvQ29ubmVjdCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmpvaW5Sb290Vmlld3MoKSkge1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cygpO1xuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubWFpbikge1xuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cyh7IGRlYWQ6IHRydWUgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmpvaW5EZWFkVmlldygpO1xuICAgIH07XG4gICAgaWYgKFtcImNvbXBsZXRlXCIsIFwibG9hZGVkXCIsIFwiaW50ZXJhY3RpdmVcIl0uaW5kZXhPZihkb2N1bWVudC5yZWFkeVN0YXRlKSA+PSAwKSB7XG4gICAgICBkb0Nvbm5lY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4gZG9Db25uZWN0KCkpO1xuICAgIH1cbiAgfVxuICBkaXNjb25uZWN0KGNhbGxiYWNrKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKTtcbiAgICB0aGlzLnNvY2tldC5kaXNjb25uZWN0KGNhbGxiYWNrKTtcbiAgfVxuICByZXBsYWNlVHJhbnNwb3J0KHRyYW5zcG9ydCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lcik7XG4gICAgdGhpcy5zb2NrZXQucmVwbGFjZVRyYW5zcG9ydCh0cmFuc3BvcnQpO1xuICAgIHRoaXMuY29ubmVjdCgpO1xuICB9XG4gIGV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUgPSBudWxsKSB7XG4gICAgdGhpcy5vd25lcihlbCwgKHZpZXcpID0+IGpzX2RlZmF1bHQuZXhlYyhldmVudFR5cGUsIGVuY29kZWRKUywgdmlldywgZWwpKTtcbiAgfVxuICBleGVjSlNIb29rUHVzaChlbCwgcGh4RXZlbnQsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsICh2aWV3KSA9PiB7XG4gICAgICBqc19kZWZhdWx0LmV4ZWMoXCJob29rXCIsIHBoeEV2ZW50LCB2aWV3LCBlbCwgW1wicHVzaFwiLCB7IGRhdGEsIGNhbGxiYWNrIH1dKTtcbiAgICB9KTtcbiAgfVxuICB1bmxvYWQoKSB7XG4gICAgaWYgKHRoaXMudW5sb2FkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubWFpbiAmJiB0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHRoaXMubG9nKHRoaXMubWFpbiwgXCJzb2NrZXRcIiwgKCkgPT4gW1wiZGlzY29ubmVjdCBmb3IgcGFnZSBuYXZcIl0pO1xuICAgIH1cbiAgICB0aGlzLnVubG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmRlc3Ryb3lBbGxWaWV3cygpO1xuICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICB9XG4gIHRyaWdnZXJET00oa2luZCwgYXJncykge1xuICAgIHRoaXMuZG9tQ2FsbGJhY2tzW2tpbmRdKC4uLmFyZ3MpO1xuICB9XG4gIHRpbWUobmFtZSwgZnVuYykge1xuICAgIGlmICghdGhpcy5pc1Byb2ZpbGVFbmFibGVkKCkgfHwgIWNvbnNvbGUudGltZSkge1xuICAgICAgcmV0dXJuIGZ1bmMoKTtcbiAgICB9XG4gICAgY29uc29sZS50aW1lKG5hbWUpO1xuICAgIGxldCByZXN1bHQgPSBmdW5jKCk7XG4gICAgY29uc29sZS50aW1lRW5kKG5hbWUpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbG9nKHZpZXcsIGtpbmQsIG1zZ0NhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMudmlld0xvZ2dlcikge1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpO1xuICAgICAgdGhpcy52aWV3TG9nZ2VyKHZpZXcsIGtpbmQsIG1zZywgb2JqKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZWJ1Z0VuYWJsZWQoKSkge1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpO1xuICAgICAgZGVidWcodmlldywga2luZCwgbXNnLCBvYmopO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RE9NVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZnRlcihjYWxsYmFjayk7XG4gIH1cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpIHtcbiAgfSkge1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpO1xuICB9XG4gIG9uQ2hhbm5lbChjaGFubmVsLCBldmVudCwgY2IpIHtcbiAgICBjaGFubmVsLm9uKGV2ZW50LCAoZGF0YSkgPT4ge1xuICAgICAgbGV0IGxhdGVuY3kgPSB0aGlzLmdldExhdGVuY3lTaW0oKTtcbiAgICAgIGlmICghbGF0ZW5jeSkge1xuICAgICAgICBjYihkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2IoZGF0YSksIGxhdGVuY3kpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHdyYXBQdXNoKHZpZXcsIG9wdHMsIHB1c2gpIHtcbiAgICBsZXQgbGF0ZW5jeSA9IHRoaXMuZ2V0TGF0ZW5jeVNpbSgpO1xuICAgIGxldCBvbGRKb2luQ291bnQgPSB2aWV3LmpvaW5Db3VudDtcbiAgICBpZiAoIWxhdGVuY3kpIHtcbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkgJiYgb3B0cy50aW1lb3V0KSB7XG4gICAgICAgIHJldHVybiBwdXNoKCkucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4ge1xuICAgICAgICAgIGlmICh2aWV3LmpvaW5Db3VudCA9PT0gb2xkSm9pbkNvdW50ICYmICF2aWV3LmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkV2l0aEppdHRlcih2aWV3LCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMubG9nKHZpZXcsIFwidGltZW91dFwiLCAoKSA9PiBbXCJyZWNlaXZlZCB0aW1lb3V0IHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBzZXJ2ZXIuIEZhbGxpbmcgYmFjayB0byBoYXJkIHJlZnJlc2ggZm9yIHJlY292ZXJ5XCJdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHVzaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgZmFrZVB1c2ggPSB7XG4gICAgICByZWNlaXZlczogW10sXG4gICAgICByZWNlaXZlKGtpbmQsIGNiKSB7XG4gICAgICAgIHRoaXMucmVjZWl2ZXMucHVzaChba2luZCwgY2JdKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHZpZXcuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmYWtlUHVzaC5yZWNlaXZlcy5yZWR1Y2UoKGFjYywgW2tpbmQsIGNiXSkgPT4gYWNjLnJlY2VpdmUoa2luZCwgY2IpLCBwdXNoKCkpO1xuICAgIH0sIGxhdGVuY3kpO1xuICAgIHJldHVybiBmYWtlUHVzaDtcbiAgfVxuICByZWxvYWRXaXRoSml0dGVyKHZpZXcsIGxvZykge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lcik7XG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgbGV0IG1pbk1zID0gdGhpcy5yZWxvYWRKaXR0ZXJNaW47XG4gICAgbGV0IG1heE1zID0gdGhpcy5yZWxvYWRKaXR0ZXJNYXg7XG4gICAgbGV0IGFmdGVyTXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4TXMgLSBtaW5NcyArIDEpKSArIG1pbk1zO1xuICAgIGxldCB0cmllcyA9IGJyb3dzZXJfZGVmYXVsdC51cGRhdGVMb2NhbCh0aGlzLmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTLCAwLCAoY291bnQpID0+IGNvdW50ICsgMSk7XG4gICAgaWYgKHRyaWVzID4gdGhpcy5tYXhSZWxvYWRzKSB7XG4gICAgICBhZnRlck1zID0gdGhpcy5mYWlsc2FmZUppdHRlcjtcbiAgICB9XG4gICAgdGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh2aWV3LmlzRGVzdHJveWVkKCkgfHwgdmlldy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZpZXcuZGVzdHJveSgpO1xuICAgICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pO1xuICAgICAgaWYgKHRyaWVzID4gdGhpcy5tYXhSZWxvYWRzKSB7XG4gICAgICAgIHRoaXMubG9nKHZpZXcsIFwiam9pblwiLCAoKSA9PiBbYGV4Y2VlZGVkICR7dGhpcy5tYXhSZWxvYWRzfSBjb25zZWN1dGl2ZSByZWxvYWRzLiBFbnRlcmluZyBmYWlsc2FmZSBtb2RlYF0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaGFzUGVuZGluZ0xpbmsoKSkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLnBlbmRpbmdMaW5rO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0sIGFmdGVyTXMpO1xuICB9XG4gIGdldEhvb2tDYWxsYmFja3MobmFtZSkge1xuICAgIHJldHVybiBuYW1lICYmIG5hbWUuc3RhcnRzV2l0aChcIlBob2VuaXguXCIpID8gaG9va3NfZGVmYXVsdFtuYW1lLnNwbGl0KFwiLlwiKVsxXV0gOiB0aGlzLmhvb2tzW25hbWVdO1xuICB9XG4gIGlzVW5sb2FkZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMudW5sb2FkZWQ7XG4gIH1cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCk7XG4gIH1cbiAgZ2V0QmluZGluZ1ByZWZpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5iaW5kaW5nUHJlZml4O1xuICB9XG4gIGJpbmRpbmcoa2luZCkge1xuICAgIHJldHVybiBgJHt0aGlzLmdldEJpbmRpbmdQcmVmaXgoKX0ke2tpbmR9YDtcbiAgfVxuICBjaGFubmVsKHRvcGljLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5zb2NrZXQuY2hhbm5lbCh0b3BpYywgcGFyYW1zKTtcbiAgfVxuICBqb2luRGVhZFZpZXcoKSB7XG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIGlmIChib2R5ICYmICF0aGlzLmlzUGh4Vmlldyhib2R5KSAmJiAhdGhpcy5pc1BoeFZpZXcoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpKSB7XG4gICAgICBsZXQgdmlldyA9IHRoaXMubmV3Um9vdFZpZXcoYm9keSk7XG4gICAgICB2aWV3LnNldEhyZWYodGhpcy5nZXRIcmVmKCkpO1xuICAgICAgdmlldy5qb2luRGVhZCgpO1xuICAgICAgaWYgKCF0aGlzLm1haW4pIHtcbiAgICAgICAgdGhpcy5tYWluID0gdmlldztcbiAgICAgIH1cbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdmlldy5leGVjTmV3TW91bnRlZCgpKTtcbiAgICB9XG4gIH1cbiAgam9pblJvb3RWaWV3cygpIHtcbiAgICBsZXQgcm9vdHNGb3VuZCA9IGZhbHNlO1xuICAgIGRvbV9kZWZhdWx0LmFsbChkb2N1bWVudCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9Om5vdChbJHtQSFhfUEFSRU5UX0lEfV0pYCwgKHJvb3RFbCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldFJvb3RCeUlkKHJvb3RFbC5pZCkpIHtcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLm5ld1Jvb3RWaWV3KHJvb3RFbCk7XG4gICAgICAgIHZpZXcuc2V0SHJlZih0aGlzLmdldEhyZWYoKSk7XG4gICAgICAgIHZpZXcuam9pbigpO1xuICAgICAgICBpZiAocm9vdEVsLmhhc0F0dHJpYnV0ZShQSFhfTUFJTikpIHtcbiAgICAgICAgICB0aGlzLm1haW4gPSB2aWV3O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByb290c0ZvdW5kID0gdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcm9vdHNGb3VuZDtcbiAgfVxuICByZWRpcmVjdCh0bywgZmxhc2gpIHtcbiAgICB0aGlzLnVubG9hZCgpO1xuICAgIGJyb3dzZXJfZGVmYXVsdC5yZWRpcmVjdCh0bywgZmxhc2gpO1xuICB9XG4gIHJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCBjYWxsYmFjayA9IG51bGwsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKSB7XG4gICAgbGV0IGxpdmVSZWZlcmVyID0gdGhpcy5jdXJyZW50TG9jYXRpb24uaHJlZjtcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gdGhpcy5vdXRnb2luZ01haW5FbCB8fCB0aGlzLm1haW4uZWw7XG4gICAgbGV0IG5ld01haW5FbCA9IGRvbV9kZWZhdWx0LmNsb25lTm9kZSh0aGlzLm91dGdvaW5nTWFpbkVsLCBcIlwiKTtcbiAgICB0aGlzLm1haW4uc2hvd0xvYWRlcih0aGlzLmxvYWRlclRpbWVvdXQpO1xuICAgIHRoaXMubWFpbi5kZXN0cm95KCk7XG4gICAgdGhpcy5tYWluID0gdGhpcy5uZXdSb290VmlldyhuZXdNYWluRWwsIGZsYXNoLCBsaXZlUmVmZXJlcik7XG4gICAgdGhpcy5tYWluLnNldFJlZGlyZWN0KGhyZWYpO1xuICAgIHRoaXMudHJhbnNpdGlvblJlbW92ZXMoKTtcbiAgICB0aGlzLm1haW4uam9pbigoam9pbkNvdW50LCBvbkRvbmUpID0+IHtcbiAgICAgIGlmIChqb2luQ291bnQgPT09IDEgJiYgdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSkge1xuICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIGRvbV9kZWZhdWx0LmZpbmRQaHhTdGlja3koZG9jdW1lbnQpLmZvckVhY2goKGVsKSA9PiBuZXdNYWluRWwuYXBwZW5kQ2hpbGQoZWwpKTtcbiAgICAgICAgICB0aGlzLm91dGdvaW5nTWFpbkVsLnJlcGxhY2VXaXRoKG5ld01haW5FbCk7XG4gICAgICAgICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IG51bGw7XG4gICAgICAgICAgY2FsbGJhY2sgJiYgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGNhbGxiYWNrKGxpbmtSZWYpKTtcbiAgICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgdHJhbnNpdGlvblJlbW92ZXMoZWxlbWVudHMpIHtcbiAgICBsZXQgcmVtb3ZlQXR0ciA9IHRoaXMuYmluZGluZyhcInJlbW92ZVwiKTtcbiAgICBlbGVtZW50cyA9IGVsZW1lbnRzIHx8IGRvbV9kZWZhdWx0LmFsbChkb2N1bWVudCwgYFske3JlbW92ZUF0dHJ9XWApO1xuICAgIGVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICB0aGlzLmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKHJlbW92ZUF0dHIpLCBcInJlbW92ZVwiKTtcbiAgICB9KTtcbiAgfVxuICBpc1BoeFZpZXcoZWwpIHtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgIT09IG51bGw7XG4gIH1cbiAgbmV3Um9vdFZpZXcoZWwsIGZsYXNoLCBsaXZlUmVmZXJlcikge1xuICAgIGxldCB2aWV3ID0gbmV3IFZpZXcoZWwsIHRoaXMsIG51bGwsIGZsYXNoLCBsaXZlUmVmZXJlcik7XG4gICAgdGhpcy5yb290c1t2aWV3LmlkXSA9IHZpZXc7XG4gICAgcmV0dXJuIHZpZXc7XG4gIH1cbiAgb3duZXIoY2hpbGRFbCwgY2FsbGJhY2spIHtcbiAgICBsZXQgdmlldyA9IG1heWJlKGNoaWxkRWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUiksIChlbCkgPT4gdGhpcy5nZXRWaWV3QnlFbChlbCkpIHx8IHRoaXMubWFpbjtcbiAgICBpZiAodmlldykge1xuICAgICAgY2FsbGJhY2sodmlldyk7XG4gICAgfVxuICB9XG4gIHdpdGhpbk93bmVycyhjaGlsZEVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMub3duZXIoY2hpbGRFbCwgKHZpZXcpID0+IGNhbGxiYWNrKHZpZXcsIGNoaWxkRWwpKTtcbiAgfVxuICBnZXRWaWV3QnlFbChlbCkge1xuICAgIGxldCByb290SWQgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQpO1xuICAgIHJldHVybiBtYXliZSh0aGlzLmdldFJvb3RCeUlkKHJvb3RJZCksIChyb290KSA9PiByb290LmdldERlc2NlbmRlbnRCeUVsKGVsKSk7XG4gIH1cbiAgZ2V0Um9vdEJ5SWQoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yb290c1tpZF07XG4gIH1cbiAgZGVzdHJveUFsbFZpZXdzKCkge1xuICAgIGZvciAobGV0IGlkIGluIHRoaXMucm9vdHMpIHtcbiAgICAgIHRoaXMucm9vdHNbaWRdLmRlc3Ryb3koKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnJvb3RzW2lkXTtcbiAgICB9XG4gICAgdGhpcy5tYWluID0gbnVsbDtcbiAgfVxuICBkZXN0cm95Vmlld0J5RWwoZWwpIHtcbiAgICBsZXQgcm9vdCA9IHRoaXMuZ2V0Um9vdEJ5SWQoZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKSk7XG4gICAgaWYgKHJvb3QgJiYgcm9vdC5pZCA9PT0gZWwuaWQpIHtcbiAgICAgIHJvb3QuZGVzdHJveSgpO1xuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbcm9vdC5pZF07XG4gICAgfSBlbHNlIGlmIChyb290KSB7XG4gICAgICByb290LmRlc3Ryb3lEZXNjZW5kZW50KGVsLmlkKTtcbiAgICB9XG4gIH1cbiAgc2V0QWN0aXZlRWxlbWVudCh0YXJnZXQpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVFbGVtZW50ID09PSB0YXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gdGFyZ2V0O1xuICAgIGxldCBjYW5jZWwgPSAoKSA9PiB7XG4gICAgICBpZiAodGFyZ2V0ID09PSB0aGlzLmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzKTtcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcyk7XG4gICAgfTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgY2FuY2VsKTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGNhbmNlbCk7XG4gIH1cbiAgZ2V0QWN0aXZlRWxlbWVudCgpIHtcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xuICAgIH1cbiAgfVxuICBkcm9wQWN0aXZlRWxlbWVudCh2aWV3KSB7XG4gICAgaWYgKHRoaXMucHJldkFjdGl2ZSAmJiB2aWV3Lm93bnNFbGVtZW50KHRoaXMucHJldkFjdGl2ZSkpIHtcbiAgICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJlc3RvcmVQcmV2aW91c2x5QWN0aXZlRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMucHJldkFjdGl2ZSAmJiB0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIHRoaXMucHJldkFjdGl2ZS5mb2N1cygpO1xuICAgIH1cbiAgfVxuICBibHVyQWN0aXZlRWxlbWVudCgpIHtcbiAgICB0aGlzLnByZXZBY3RpdmUgPSB0aGlzLmdldEFjdGl2ZUVsZW1lbnQoKTtcbiAgICBpZiAodGhpcy5wcmV2QWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICB0aGlzLnByZXZBY3RpdmUuYmx1cigpO1xuICAgIH1cbiAgfVxuICBiaW5kVG9wTGV2ZWxFdmVudHMoeyBkZWFkIH0gPSB7fSkge1xuICAgIGlmICh0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gdHJ1ZTtcbiAgICB0aGlzLnNvY2tldC5vbkNsb3NlKChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LmNvZGUgPT09IDFlMyAmJiB0aGlzLm1haW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsb2FkV2l0aEppdHRlcih0aGlzLm1haW4pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLnBlcnNpc3RlZCkge1xuICAgICAgICB0aGlzLmdldFNvY2tldCgpLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoeyB0bzogd2luZG93LmxvY2F0aW9uLmhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIiB9KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0sIHRydWUpO1xuICAgIGlmICghZGVhZCkge1xuICAgICAgdGhpcy5iaW5kTmF2KCk7XG4gICAgfVxuICAgIHRoaXMuYmluZENsaWNrcygpO1xuICAgIGlmICghZGVhZCkge1xuICAgICAgdGhpcy5iaW5kRm9ybXMoKTtcbiAgICB9XG4gICAgdGhpcy5iaW5kKHsga2V5dXA6IFwia2V5dXBcIiwga2V5ZG93bjogXCJrZXlkb3duXCIgfSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgZXZlbnRUYXJnZXQpID0+IHtcbiAgICAgIGxldCBtYXRjaEtleSA9IHRhcmdldEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0tFWSkpO1xuICAgICAgbGV0IHByZXNzZWRLZXkgPSBlLmtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKG1hdGNoS2V5ICYmIG1hdGNoS2V5LnRvTG93ZXJDYXNlKCkgIT09IHByZXNzZWRLZXkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGRhdGEgPSB7IGtleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKSB9O1xuICAgICAganNfZGVmYXVsdC5leGVjKHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7IGRhdGEgfV0pO1xuICAgIH0pO1xuICAgIHRoaXMuYmluZCh7IGJsdXI6IFwiZm9jdXNvdXRcIiwgZm9jdXM6IFwiZm9jdXNpblwiIH0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIGV2ZW50VGFyZ2V0KSA9PiB7XG4gICAgICBpZiAoIWV2ZW50VGFyZ2V0KSB7XG4gICAgICAgIGxldCBkYXRhID0geyBrZXk6IGUua2V5LCAuLi50aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbCkgfTtcbiAgICAgICAganNfZGVmYXVsdC5leGVjKHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7IGRhdGEgfV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuYmluZCh7IGJsdXI6IFwiYmx1clwiLCBmb2N1czogXCJmb2N1c1wiIH0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgcGh4VGFyZ2V0KSA9PiB7XG4gICAgICBpZiAocGh4VGFyZ2V0ID09PSBcIndpbmRvd1wiKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpO1xuICAgICAgICBqc19kZWZhdWx0LmV4ZWModHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHsgZGF0YSB9XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxldCBkcm9wVGFyZ2V0SWQgPSBtYXliZShjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgdGhpcy5iaW5kaW5nKFBIWF9EUk9QX1RBUkdFVCkpLCAodHJ1ZVRhcmdldCkgPT4ge1xuICAgICAgICByZXR1cm4gdHJ1ZVRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9EUk9QX1RBUkdFVCkpO1xuICAgICAgfSk7XG4gICAgICBsZXQgZHJvcFRhcmdldCA9IGRyb3BUYXJnZXRJZCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkcm9wVGFyZ2V0SWQpO1xuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRhdGFUcmFuc2Zlci5maWxlcyB8fCBbXSk7XG4gICAgICBpZiAoIWRyb3BUYXJnZXQgfHwgZHJvcFRhcmdldC5kaXNhYmxlZCB8fCBmaWxlcy5sZW5ndGggPT09IDAgfHwgIShkcm9wVGFyZ2V0LmZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKGRyb3BUYXJnZXQsIGZpbGVzLCBlLmRhdGFUcmFuc2Zlcik7XG4gICAgICBkcm9wVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uKFBIWF9UUkFDS19VUExPQURTLCAoZSkgPT4ge1xuICAgICAgbGV0IHVwbG9hZFRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgaWYgKCFkb21fZGVmYXVsdC5pc1VwbG9hZElucHV0KHVwbG9hZFRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRldGFpbC5maWxlcyB8fCBbXSkuZmlsdGVyKChmKSA9PiBmIGluc3RhbmNlb2YgRmlsZSB8fCBmIGluc3RhbmNlb2YgQmxvYik7XG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyh1cGxvYWRUYXJnZXQsIGZpbGVzKTtcbiAgICAgIHVwbG9hZFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgfSk7XG4gIH1cbiAgZXZlbnRNZXRhKGV2ZW50TmFtZSwgZSwgdGFyZ2V0RWwpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzW2V2ZW50TmFtZV07XG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZSwgdGFyZ2V0RWwpIDoge307XG4gIH1cbiAgc2V0UGVuZGluZ0xpbmsoaHJlZikge1xuICAgIHRoaXMubGlua1JlZisrO1xuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBocmVmO1xuICAgIHJldHVybiB0aGlzLmxpbmtSZWY7XG4gIH1cbiAgY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikge1xuICAgIGlmICh0aGlzLmxpbmtSZWYgIT09IGxpbmtSZWYpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ocmVmID0gdGhpcy5wZW5kaW5nTGluaztcbiAgICAgIHRoaXMucGVuZGluZ0xpbmsgPSBudWxsO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIGdldEhyZWYoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHJlZjtcbiAgfVxuICBoYXNQZW5kaW5nTGluaygpIHtcbiAgICByZXR1cm4gISF0aGlzLnBlbmRpbmdMaW5rO1xuICB9XG4gIGJpbmQoZXZlbnRzLCBjYWxsYmFjaykge1xuICAgIGZvciAobGV0IGV2ZW50IGluIGV2ZW50cykge1xuICAgICAgbGV0IGJyb3dzZXJFdmVudE5hbWUgPSBldmVudHNbZXZlbnRdO1xuICAgICAgdGhpcy5vbihicm93c2VyRXZlbnROYW1lLCAoZSkgPT4ge1xuICAgICAgICBsZXQgYmluZGluZyA9IHRoaXMuYmluZGluZyhldmVudCk7XG4gICAgICAgIGxldCB3aW5kb3dCaW5kaW5nID0gdGhpcy5iaW5kaW5nKGB3aW5kb3ctJHtldmVudH1gKTtcbiAgICAgICAgbGV0IHRhcmdldFBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShiaW5kaW5nKTtcbiAgICAgICAgaWYgKHRhcmdldFBoeEV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZShlLnRhcmdldCwgZSwgYnJvd3NlckV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsICh2aWV3KSA9PiB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlLnRhcmdldCwgdGFyZ2V0UGh4RXZlbnQsIG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9tX2RlZmF1bHQuYWxsKGRvY3VtZW50LCBgWyR7d2luZG93QmluZGluZ31dYCwgKGVsKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUod2luZG93QmluZGluZyk7XG4gICAgICAgICAgICB0aGlzLmRlYm91bmNlKGVsLCBlLCBicm93c2VyRXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCAodmlldykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlbCwgcGh4RXZlbnQsIFwid2luZG93XCIpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgYmluZENsaWNrcygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXQpO1xuICAgIHRoaXMuYmluZENsaWNrKFwiY2xpY2tcIiwgXCJjbGlja1wiLCBmYWxzZSk7XG4gICAgdGhpcy5iaW5kQ2xpY2soXCJtb3VzZWRvd25cIiwgXCJjYXB0dXJlLWNsaWNrXCIsIHRydWUpO1xuICB9XG4gIGJpbmRDbGljayhldmVudE5hbWUsIGJpbmRpbmdOYW1lLCBjYXB0dXJlKSB7XG4gICAgbGV0IGNsaWNrID0gdGhpcy5iaW5kaW5nKGJpbmRpbmdOYW1lKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChlKSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gbnVsbDtcbiAgICAgIGlmIChjYXB0dXJlKSB7XG4gICAgICAgIHRhcmdldCA9IGUudGFyZ2V0Lm1hdGNoZXMoYFske2NsaWNrfV1gKSA/IGUudGFyZ2V0IDogZS50YXJnZXQucXVlcnlTZWxlY3RvcihgWyR7Y2xpY2t9XWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCB8fCBlLnRhcmdldDtcbiAgICAgICAgdGFyZ2V0ID0gY2xvc2VzdFBoeEJpbmRpbmcoY2xpY2tTdGFydGVkQXRUYXJnZXQsIGNsaWNrKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdFRhcmdldCk7XG4gICAgICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgbGV0IHBoeEV2ZW50ID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoY2xpY2spO1xuICAgICAgaWYgKCFwaHhFdmVudCkge1xuICAgICAgICBpZiAoIWNhcHR1cmUgJiYgZG9tX2RlZmF1bHQuaXNOZXdQYWdlQ2xpY2soZSwgd2luZG93LmxvY2F0aW9uKSkge1xuICAgICAgICAgIHRoaXMudW5sb2FkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNcIikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZShQSFhfUkVGKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmRlYm91bmNlKHRhcmdldCwgZSwgXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKHRhcmdldCwgKHZpZXcpID0+IHtcbiAgICAgICAgICBqc19kZWZhdWx0LmV4ZWMoXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0LCBbXCJwdXNoXCIsIHsgZGF0YTogdGhpcy5ldmVudE1ldGEoXCJjbGlja1wiLCBlLCB0YXJnZXQpIH1dKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBjYXB0dXJlKTtcbiAgfVxuICBkaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdCkge1xuICAgIGxldCBwaHhDbGlja0F3YXkgPSB0aGlzLmJpbmRpbmcoXCJjbGljay1hd2F5XCIpO1xuICAgIGRvbV9kZWZhdWx0LmFsbChkb2N1bWVudCwgYFske3BoeENsaWNrQXdheX1dYCwgKGVsKSA9PiB7XG4gICAgICBpZiAoIShlbC5pc1NhbWVOb2RlKGNsaWNrU3RhcnRlZEF0KSB8fCBlbC5jb250YWlucyhjbGlja1N0YXJ0ZWRBdCkpKSB7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCAodmlldykgPT4ge1xuICAgICAgICAgIGxldCBwaHhFdmVudCA9IGVsLmdldEF0dHJpYnV0ZShwaHhDbGlja0F3YXkpO1xuICAgICAgICAgIGlmIChqc19kZWZhdWx0LmlzVmlzaWJsZShlbCkpIHtcbiAgICAgICAgICAgIGpzX2RlZmF1bHQuZXhlYyhcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCBlbCwgW1wicHVzaFwiLCB7IGRhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgZS50YXJnZXQpIH1dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGJpbmROYXYoKSB7XG4gICAgaWYgKCFicm93c2VyX2RlZmF1bHQuY2FuUHVzaFN0YXRlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24pIHtcbiAgICAgIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSBcIm1hbnVhbFwiO1xuICAgIH1cbiAgICBsZXQgc2Nyb2xsVGltZXIgPSBudWxsO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIChfZSkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVyKTtcbiAgICAgIHNjcm9sbFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGJyb3dzZXJfZGVmYXVsdC51cGRhdGVDdXJyZW50U3RhdGUoKHN0YXRlKSA9PiBPYmplY3QuYXNzaWduKHN0YXRlLCB7IHNjcm9sbDogd2luZG93LnNjcm9sbFkgfSkpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgeyB0eXBlLCBpZCwgcm9vdCwgc2Nyb2xsIH0gPSBldmVudC5zdGF0ZSB8fCB7fTtcbiAgICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICBkb21fZGVmYXVsdC5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6bmF2aWdhdGVcIiwgeyBkZXRhaWw6IHsgaHJlZiwgcGF0Y2g6IHR5cGUgPT09IFwicGF0Y2hcIiwgcG9wOiB0cnVlIH0gfSk7XG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5tYWluLmlzQ29ubmVjdGVkKCkgJiYgKHR5cGUgPT09IFwicGF0Y2hcIiAmJiBpZCA9PT0gdGhpcy5tYWluLmlkKSkge1xuICAgICAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGhyZWYsIG51bGwsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubWF5YmVTY3JvbGwoc2Nyb2xsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlcGxhY2VNYWluKGhyZWYsIG51bGwsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyb290KSB7XG4gICAgICAgICAgICAgIHRoaXMucmVwbGFjZVJvb3RIaXN0b3J5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1heWJlU2Nyb2xsKHNjcm9sbCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIFBIWF9MSVZFX0xJTkspO1xuICAgICAgbGV0IHR5cGUgPSB0YXJnZXQgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShQSFhfTElWRV9MSU5LKTtcbiAgICAgIGlmICghdHlwZSB8fCAhdGhpcy5pc0Nvbm5lY3RlZCgpIHx8ICF0aGlzLm1haW4gfHwgZG9tX2RlZmF1bHQud2FudHNOZXdUYWIoZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGhyZWYgPSB0YXJnZXQuaHJlZjtcbiAgICAgIGxldCBsaW5rU3RhdGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSU5LX1NUQVRFKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAodGhpcy5wZW5kaW5nTGluayA9PT0gaHJlZikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gXCJwYXRjaFwiKSB7XG4gICAgICAgICAgdGhpcy5wdXNoSGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgdGFyZ2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInJlZGlyZWN0XCIpIHtcbiAgICAgICAgICB0aGlzLmhpc3RvcnlSZWRpcmVjdChocmVmLCBsaW5rU3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZXhwZWN0ZWQgJHtQSFhfTElWRV9MSU5LfSB0byBiZSBcInBhdGNoXCIgb3IgXCJyZWRpcmVjdFwiLCBnb3Q6ICR7dHlwZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGh4Q2xpY2sgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNsaWNrXCIpKTtcbiAgICAgICAgaWYgKHBoeENsaWNrKSB7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHRoaXMuZXhlY0pTKHRhcmdldCwgcGh4Q2xpY2ssIFwiY2xpY2tcIikpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCBmYWxzZSk7XG4gIH1cbiAgbWF5YmVTY3JvbGwoc2Nyb2xsKSB7XG4gICAgaWYgKHR5cGVvZiBzY3JvbGwgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSkge1xuICAgIGRvbV9kZWZhdWx0LmRpc3BhdGNoRXZlbnQod2luZG93LCBgcGh4OiR7ZXZlbnR9YCwgeyBkZXRhaWw6IHBheWxvYWQgfSk7XG4gIH1cbiAgZGlzcGF0Y2hFdmVudHMoZXZlbnRzKSB7XG4gICAgZXZlbnRzLmZvckVhY2goKFtldmVudCwgcGF5bG9hZF0pID0+IHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCkpO1xuICB9XG4gIHdpdGhQYWdlTG9hZGluZyhpbmZvLCBjYWxsYmFjaykge1xuICAgIGRvbV9kZWZhdWx0LmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwgeyBkZXRhaWw6IGluZm8gfSk7XG4gICAgbGV0IGRvbmUgPSAoKSA9PiBkb21fZGVmYXVsdC5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgeyBkZXRhaWw6IGluZm8gfSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZG9uZSkgOiBkb25lO1xuICB9XG4gIHB1c2hIaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCB0YXJnZXRFbCkge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICByZXR1cm4gYnJvd3Nlcl9kZWZhdWx0LnJlZGlyZWN0KGhyZWYpO1xuICAgIH1cbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7IHRvOiBocmVmLCBraW5kOiBcInBhdGNoXCIgfSwgKGRvbmUpID0+IHtcbiAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGhyZWYsIHRhcmdldEVsLCAobGlua1JlZikgPT4ge1xuICAgICAgICB0aGlzLmhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBoaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmID0gdGhpcy5zZXRQZW5kaW5nTGluayhocmVmKSkge1xuICAgIGlmICghdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBicm93c2VyX2RlZmF1bHQucHVzaFN0YXRlKGxpbmtTdGF0ZSwgeyB0eXBlOiBcInBhdGNoXCIsIGlkOiB0aGlzLm1haW4uaWQgfSwgaHJlZik7XG4gICAgZG9tX2RlZmF1bHQuZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4Om5hdmlnYXRlXCIsIHsgZGV0YWlsOiB7IHBhdGNoOiB0cnVlLCBocmVmLCBwb3A6IGZhbHNlIH0gfSk7XG4gICAgdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbik7XG4gIH1cbiAgaGlzdG9yeVJlZGlyZWN0KGhyZWYsIGxpbmtTdGF0ZSwgZmxhc2gpIHtcbiAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgcmV0dXJuIGJyb3dzZXJfZGVmYXVsdC5yZWRpcmVjdChocmVmLCBmbGFzaCk7XG4gICAgfVxuICAgIGlmICgvXlxcLyR8XlxcL1teXFwvXSsuKiQvLnRlc3QoaHJlZikpIHtcbiAgICAgIGxldCB7IHByb3RvY29sLCBob3N0IH0gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICBocmVmID0gYCR7cHJvdG9jb2x9Ly8ke2hvc3R9JHtocmVmfWA7XG4gICAgfVxuICAgIGxldCBzY3JvbGwgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7IHRvOiBocmVmLCBraW5kOiBcInJlZGlyZWN0XCIgfSwgKGRvbmUpID0+IHtcbiAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgZmxhc2gsIChsaW5rUmVmKSA9PiB7XG4gICAgICAgIGlmIChsaW5rUmVmID09PSB0aGlzLmxpbmtSZWYpIHtcbiAgICAgICAgICBicm93c2VyX2RlZmF1bHQucHVzaFN0YXRlKGxpbmtTdGF0ZSwgeyB0eXBlOiBcInJlZGlyZWN0XCIsIGlkOiB0aGlzLm1haW4uaWQsIHNjcm9sbCB9LCBocmVmKTtcbiAgICAgICAgICBkb21fZGVmYXVsdC5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6bmF2aWdhdGVcIiwgeyBkZXRhaWw6IHsgaHJlZiwgcGF0Y2g6IGZhbHNlLCBwb3A6IGZhbHNlIH0gfSk7XG4gICAgICAgICAgdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmVwbGFjZVJvb3RIaXN0b3J5KCkge1xuICAgIGJyb3dzZXJfZGVmYXVsdC5wdXNoU3RhdGUoXCJyZXBsYWNlXCIsIHsgcm9vdDogdHJ1ZSwgdHlwZTogXCJwYXRjaFwiLCBpZDogdGhpcy5tYWluLmlkIH0pO1xuICB9XG4gIHJlZ2lzdGVyTmV3TG9jYXRpb24obmV3TG9jYXRpb24pIHtcbiAgICBsZXQgeyBwYXRobmFtZSwgc2VhcmNoIH0gPSB0aGlzLmN1cnJlbnRMb2NhdGlvbjtcbiAgICBpZiAocGF0aG5hbWUgKyBzZWFyY2ggPT09IG5ld0xvY2F0aW9uLnBhdGhuYW1lICsgbmV3TG9jYXRpb24uc2VhcmNoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudExvY2F0aW9uID0gY2xvbmUobmV3TG9jYXRpb24pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIGJpbmRGb3JtcygpIHtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgbGV0IGV4dGVybmFsRm9ybVN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgIHRoaXMub24oXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgIGxldCBwaHhTdWJtaXQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwic3VibWl0XCIpKTtcbiAgICAgIGxldCBwaHhDaGFuZ2UgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKTtcbiAgICAgIGlmICghZXh0ZXJuYWxGb3JtU3VibWl0dGVkICYmIHBoeENoYW5nZSAmJiAhcGh4U3VibWl0KSB7XG4gICAgICAgIGV4dGVybmFsRm9ybVN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsICh2aWV3KSA9PiB7XG4gICAgICAgICAgdmlldy5kaXNhYmxlRm9ybShlLnRhcmdldCk7XG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZG9tX2RlZmF1bHQuaXNVbmxvYWRhYmxlRm9ybVN1Ym1pdChlKSkge1xuICAgICAgICAgICAgICB0aGlzLnVubG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZS50YXJnZXQuc3VibWl0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHRydWUpO1xuICAgIHRoaXMub24oXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgIGxldCBwaHhFdmVudCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpO1xuICAgICAgaWYgKCFwaHhFdmVudCkge1xuICAgICAgICBpZiAoZG9tX2RlZmF1bHQuaXNVbmxvYWRhYmxlRm9ybVN1Ym1pdChlKSkge1xuICAgICAgICAgIHRoaXMudW5sb2FkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS50YXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsICh2aWV3KSA9PiB7XG4gICAgICAgIGpzX2RlZmF1bHQuZXhlYyhcInN1Ym1pdFwiLCBwaHhFdmVudCwgdmlldywgZS50YXJnZXQsIFtcInB1c2hcIiwgeyBzdWJtaXR0ZXI6IGUuc3VibWl0dGVyIH1dKTtcbiAgICAgIH0pO1xuICAgIH0sIGZhbHNlKTtcbiAgICBmb3IgKGxldCB0eXBlIG9mIFtcImNoYW5nZVwiLCBcImlucHV0XCJdKSB7XG4gICAgICB0aGlzLm9uKHR5cGUsIChlKSA9PiB7XG4gICAgICAgIGxldCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIik7XG4gICAgICAgIGxldCBpbnB1dCA9IGUudGFyZ2V0O1xuICAgICAgICBsZXQgaW5wdXRFdmVudCA9IGlucHV0LmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpO1xuICAgICAgICBsZXQgZm9ybUV2ZW50ID0gaW5wdXQuZm9ybSAmJiBpbnB1dC5mb3JtLmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpO1xuICAgICAgICBsZXQgcGh4RXZlbnQgPSBpbnB1dEV2ZW50IHx8IGZvcm1FdmVudDtcbiAgICAgICAgaWYgKCFwaHhFdmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dC52YWxpZGl0eSAmJiBpbnB1dC52YWxpZGl0eS5iYWRJbnB1dCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IGlucHV0RXZlbnQgPyBpbnB1dCA6IGlucHV0LmZvcm07XG4gICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnM7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgbGV0IHsgYXQsIHR5cGU6IGxhc3RUeXBlIH0gPSBkb21fZGVmYXVsdC5wcml2YXRlKGlucHV0LCBcInByZXYtaXRlcmF0aW9uXCIpIHx8IHt9O1xuICAgICAgICBpZiAoYXQgPT09IGN1cnJlbnRJdGVyYXRpb25zIC0gMSAmJiB0eXBlID09PSBcImNoYW5nZVwiICYmIGxhc3RUeXBlID09PSBcImlucHV0XCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZG9tX2RlZmF1bHQucHV0UHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiLCB7IGF0OiBjdXJyZW50SXRlcmF0aW9ucywgdHlwZSB9KTtcbiAgICAgICAgdGhpcy5kZWJvdW5jZShpbnB1dCwgZSwgdHlwZSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGRpc3BhdGNoZXIsICh2aWV3KSA9PiB7XG4gICAgICAgICAgICBkb21fZGVmYXVsdC5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQsIHRydWUpO1xuICAgICAgICAgICAgaWYgKCFkb21fZGVmYXVsdC5pc1RleHR1YWxJbnB1dChpbnB1dCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVFbGVtZW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpzX2RlZmF1bHQuZXhlYyhcImNoYW5nZVwiLCBwaHhFdmVudCwgdmlldywgaW5wdXQsIFtcInB1c2hcIiwgeyBfdGFyZ2V0OiBlLnRhcmdldC5uYW1lLCBkaXNwYXRjaGVyIH1dKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfVxuICAgIHRoaXMub24oXCJyZXNldFwiLCAoZSkgPT4ge1xuICAgICAgbGV0IGZvcm0gPSBlLnRhcmdldDtcbiAgICAgIGRvbV9kZWZhdWx0LnJlc2V0Rm9ybShmb3JtLCB0aGlzLmJpbmRpbmcoUEhYX0ZFRURCQUNLX0ZPUikpO1xuICAgICAgbGV0IGlucHV0ID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKS5maW5kKChlbCkgPT4gZWwudHlwZSA9PT0gXCJyZXNldFwiKTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2UgfSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgZGVib3VuY2UoZWwsIGV2ZW50LCBldmVudFR5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gXCJibHVyXCIgfHwgZXZlbnRUeXBlID09PSBcImZvY3Vzb3V0XCIpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgIH1cbiAgICBsZXQgcGh4RGVib3VuY2UgPSB0aGlzLmJpbmRpbmcoUEhYX0RFQk9VTkNFKTtcbiAgICBsZXQgcGh4VGhyb3R0bGUgPSB0aGlzLmJpbmRpbmcoUEhYX1RIUk9UVExFKTtcbiAgICBsZXQgZGVmYXVsdERlYm91bmNlID0gdGhpcy5kZWZhdWx0cy5kZWJvdW5jZS50b1N0cmluZygpO1xuICAgIGxldCBkZWZhdWx0VGhyb3R0bGUgPSB0aGlzLmRlZmF1bHRzLnRocm90dGxlLnRvU3RyaW5nKCk7XG4gICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsICh2aWV3KSA9PiB7XG4gICAgICBsZXQgYXN5bmNGaWx0ZXIgPSAoKSA9PiAhdmlldy5pc0Rlc3Ryb3llZCgpICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpO1xuICAgICAgZG9tX2RlZmF1bHQuZGVib3VuY2UoZWwsIGV2ZW50LCBwaHhEZWJvdW5jZSwgZGVmYXVsdERlYm91bmNlLCBwaHhUaHJvdHRsZSwgZGVmYXVsdFRocm90dGxlLCBhc3luY0ZpbHRlciwgKCkgPT4ge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgc2lsZW5jZUV2ZW50cyhjYWxsYmFjaykge1xuICAgIHRoaXMuc2lsZW5jZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKCk7XG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlO1xuICB9XG4gIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNpbGVuY2VkKSB7XG4gICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xudmFyIFRyYW5zaXRpb25TZXQgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5wZW5kaW5nT3BzID0gW107XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5mb3JFYWNoKCh0aW1lcikgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKTtcbiAgICB9KTtcbiAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpO1xuICB9XG4gIGFmdGVyKGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSgpID09PSAwKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hQZW5kaW5nT3AoY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuICBhZGRUcmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSkge1xuICAgIG9uU3RhcnQoKTtcbiAgICBsZXQgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKTtcbiAgICAgIG9uRG9uZSgpO1xuICAgICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKTtcbiAgICB9LCB0aW1lKTtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFkZCh0aW1lcik7XG4gIH1cbiAgcHVzaFBlbmRpbmdPcChvcCkge1xuICAgIHRoaXMucGVuZGluZ09wcy5wdXNoKG9wKTtcbiAgfVxuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25zLnNpemU7XG4gIH1cbiAgZmx1c2hQZW5kaW5nT3BzKCkge1xuICAgIGlmICh0aGlzLnNpemUoKSA+IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IG9wID0gdGhpcy5wZW5kaW5nT3BzLnNoaWZ0KCk7XG4gICAgaWYgKG9wKSB7XG4gICAgICBvcCgpO1xuICAgICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKTtcbiAgICB9XG4gIH1cbn07XG5leHBvcnQge1xuICBMaXZlU29ja2V0XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGhvZW5peF9saXZlX3ZpZXcuZXNtLmpzLm1hcFxuIiwKICAiLy8gSWYgeW91IHdhbnQgdG8gdXNlIFBob2VuaXggY2hhbm5lbHMsIHJ1biBgbWl4IGhlbHAgcGh4Lmdlbi5jaGFubmVsYFxuLy8gdG8gZ2V0IHN0YXJ0ZWQgYW5kIHRoZW4gdW5jb21tZW50IHRoZSBsaW5lIGJlbG93LlxuLy8gaW1wb3J0IFwiLi91c2VyX3NvY2tldC5qc1wiXG5cbi8vIFlvdSBjYW4gaW5jbHVkZSBkZXBlbmRlbmNpZXMgaW4gdHdvIHdheXMuXG4vL1xuLy8gVGhlIHNpbXBsZXN0IG9wdGlvbiBpcyB0byBwdXQgdGhlbSBpbiBhc3NldHMvdmVuZG9yIGFuZFxuLy8gaW1wb3J0IHRoZW0gdXNpbmcgcmVsYXRpdmUgcGF0aHM6XG4vL1xuLy8gICAgIGltcG9ydCBcIi4uL3ZlbmRvci9zb21lLXBhY2thZ2UuanNcIlxuLy9cbi8vIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gYG5wbSBpbnN0YWxsIHNvbWUtcGFja2FnZSAtLXByZWZpeCBhc3NldHNgIGFuZCBpbXBvcnRcbi8vIHRoZW0gdXNpbmcgYSBwYXRoIHN0YXJ0aW5nIHdpdGggdGhlIHBhY2thZ2UgbmFtZTpcbi8vXG4vLyAgICAgaW1wb3J0IFwic29tZS1wYWNrYWdlXCJcbi8vXG5cbi8vIEluY2x1ZGUgcGhvZW5peF9odG1sIHRvIGhhbmRsZSBtZXRob2Q9UFVUL0RFTEVURSBpbiBmb3JtcyBhbmQgYnV0dG9ucy5cbmltcG9ydCBcInBob2VuaXhfaHRtbFwiXG4vLyBFc3RhYmxpc2ggUGhvZW5peCBTb2NrZXQgYW5kIExpdmVWaWV3IGNvbmZpZ3VyYXRpb24uXG5pbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuaW1wb3J0IHRvcGJhciBmcm9tIFwiLi4vdmVuZG9yL3RvcGJhclwiXG5cbmxldCBjc3JmVG9rZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWV0YVtuYW1lPSdjc3JmLXRva2VuJ11cIikuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxubGV0IEhvb2tzID0ge31cbkhvb2tzLnN0b3JlX3Rva2VuID0ge1xuICB1cGRhdGVkKCkge1xuICAgIGZldGNoKGAvc2V0X3Rva2VuP3Rva2VuPSR7dGhpcy5lbC52YWx1ZX1gKVxuICAgIHRoaXMucHVzaEV2ZW50KFwibmF2aWdhdGVfc3R1ZGVudHNcIilcbiAgfVxufVxubGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVNvY2tldChcIi9saXZlXCIsIFNvY2tldCwge2hvb2tzOiBIb29rcyxwYXJhbXM6IHtfY3NyZl90b2tlbjogY3NyZlRva2VufX0pXG5cbi8vIFNob3cgcHJvZ3Jlc3MgYmFyIG9uIGxpdmUgbmF2aWdhdGlvbiBhbmQgZm9ybSBzdWJtaXRzXG50b3BiYXIuY29uZmlnKHtiYXJDb2xvcnM6IHswOiBcIiMyOWRcIn0sIHNoYWRvd0NvbG9yOiBcInJnYmEoMCwgMCwgMCwgLjMpXCJ9KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIF9pbmZvID0+IHRvcGJhci5zaG93KDMwMCkpXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCBfaW5mbyA9PiB0b3BiYXIuaGlkZSgpKVxuXG4vLyBjb25uZWN0IGlmIHRoZXJlIGFyZSBhbnkgTGl2ZVZpZXdzIG9uIHRoZSBwYWdlXG5saXZlU29ja2V0LmNvbm5lY3QoKVxuXG4vLyBleHBvc2UgbGl2ZVNvY2tldCBvbiB3aW5kb3cgZm9yIHdlYiBjb25zb2xlIGRlYnVnIGxvZ3MgYW5kIGxhdGVuY3kgc2ltdWxhdGlvbjpcbi8vID4+IGxpdmVTb2NrZXQuZW5hYmxlRGVidWcoKVxuLy8gPj4gbGl2ZVNvY2tldC5lbmFibGVMYXRlbmN5U2ltKDEwMDApICAvLyBlbmFibGVkIGZvciBkdXJhdGlvbiBvZiBicm93c2VyIHNlc3Npb25cbi8vID4+IGxpdmVTb2NrZXQuZGlzYWJsZUxhdGVuY3lTaW0oKVxud2luZG93LmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG5cbiIKICBdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsV0FBVSxDQUFDLFNBQVEsV0FBVTtBQUkzQixhQUFVLEdBQUc7QUFDWCxVQUFJLFdBQVc7QUFDZixVQUFJLFVBQVUsQ0FBQyxNQUFNLE9BQU8sVUFBVSxHQUFHO0FBQ3pDLGVBQVMsSUFBSSxFQUFHLElBQUksUUFBUSxXQUFXLFFBQU8seUJBQXlCLEdBQUc7QUFDeEUsZ0JBQU8sd0JBQ0wsUUFBTyxRQUFRLEtBQUs7QUFDdEIsZ0JBQU8sdUJBQ0wsUUFBTyxRQUFRLEtBQUssMkJBQ3BCLFFBQU8sUUFBUSxLQUFLO0FBQUEsTUFDeEI7QUFDQSxXQUFLLFFBQU87QUFDVixnQkFBTyxnQ0FBaUMsQ0FBQyxVQUFVLFNBQVM7QUFDMUQsY0FBSSxXQUFXLElBQUksS0FBSyxFQUFFLFFBQVE7QUFDbEMsY0FBSSxhQUFhLEtBQUssSUFBSSxHQUFHLE1BQU0sV0FBVyxTQUFTO0FBQ3ZELGNBQUksS0FBSyxRQUFPLG1CQUFvQixHQUFHO0FBQ3JDLHFCQUFTLFdBQVcsVUFBVTtBQUFBLGFBQzdCLFVBQVU7QUFDYixxQkFBVyxXQUFXO0FBQ3RCLGlCQUFPO0FBQUE7QUFFWCxXQUFLLFFBQU87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bEIsaUJBQVMsQ0FBQztBQUFBLE1BQ1o7QUFBQSxLQUNEO0FBQUE7QUFFTDtBQUNBLElBQUksZ0JBQWdCLE1BQU07QUFBQSxFQUN4QixXQUFXLEdBQUc7QUFDWixTQUFLLGNBQWMsSUFBSTtBQUN2QixTQUFLLGFBQWEsQ0FBQztBQUFBO0FBQUEsRUFFckIsS0FBSyxHQUFHO0FBQ04sU0FBSyxZQUFZLFFBQVEsQ0FBQyxVQUFVO0FBQ2xDLG1CQUFhLEtBQUs7QUFDbEIsV0FBSyxZQUFZLE9BQU8sS0FBSztBQUFBLEtBQzlCO0FBQ0QsU0FBSyxnQkFBZ0I7QUFBQTtBQUFBLEVBRXZCLEtBQUssQ0FBQyxVQUFVO0FBQ2QsUUFBSSxLQUFLLEtBQUssTUFBTSxHQUFHO0FBQ3JCLGVBQVM7QUFBQSxJQUNYLE9BQU87QUFDTCxXQUFLLGNBQWMsUUFBUTtBQUFBO0FBQUE7QUFBQSxFQUcvQixhQUFhLENBQUMsTUFBTSxTQUFTLFFBQVE7QUFDbkMsWUFBUTtBQUNSLFFBQUksUUFBUSxXQUFXLE1BQU07QUFDM0IsV0FBSyxZQUFZLE9BQU8sS0FBSztBQUM3QixhQUFPO0FBQ1AsV0FBSyxnQkFBZ0I7QUFBQSxPQUNwQixJQUFJO0FBQ1AsU0FBSyxZQUFZLElBQUksS0FBSztBQUFBO0FBQUEsRUFFNUIsYUFBYSxDQUFDLElBQUk7QUFDaEIsU0FBSyxXQUFXLEtBQUssRUFBRTtBQUFBO0FBQUEsRUFFekIsSUFBSSxHQUFHO0FBQ0wsV0FBTyxLQUFLLFlBQVk7QUFBQTtBQUFBLEVBRTFCLGVBQWUsR0FBRztBQUNoQixRQUFJLEtBQUssS0FBSyxJQUFJLEdBQUc7QUFDbkI7QUFBQSxJQUNGO0FBQ0EsUUFBSSxLQUFLLEtBQUssV0FBVyxNQUFNO0FBQy9CLFFBQUksSUFBSTtBQUNOLFNBQUc7QUFDSCxXQUFLLGdCQUFnQjtBQUFBLElBQ3ZCO0FBQUE7QUFFSjs7O0FDdDVJQTtBQUVBLElBQUksWUFBWSxTQUFTLGNBQWMseUJBQXlCLEVBQUUsYUFBYSxTQUFTO0FBQ3hGLElBQUksU0FBUSxDQUFDO0FBQ2IsT0FBTSxjQUFjO0FBQUEsRUFDbEIsT0FBTyxHQUFHO0FBQ1IsVUFBTSxvQkFBb0IsS0FBSyxHQUFHLE9BQU87QUFDekMsU0FBSyxVQUFVLG1CQUFtQjtBQUFBO0FBRXRDO0FBQ0EsSUFBSSxhQUFhLElBQUksV0FBVyxTQUFTLFFBQVEsRUFBQyxPQUFPLFFBQU0sUUFBUSxFQUFDLGFBQWEsVUFBUyxFQUFDLENBQUM7QUFHaEcsZUFBTyxPQUFPLEVBQUMsV0FBVyxFQUFDLEdBQUcsT0FBTSxHQUFHLGFBQWEsb0JBQW1CLENBQUM7QUFDeEUsT0FBTyxpQkFBaUIsMEJBQTBCLFdBQVMsZUFBTyxLQUFLLEdBQUcsQ0FBQztBQUMzRSxPQUFPLGlCQUFpQix5QkFBeUIsV0FBUyxlQUFPLEtBQUssQ0FBQztBQUd2RSxXQUFXLFFBQVE7QUFNbkIsT0FBTyxhQUFhOyIsCiAgImRlYnVnSWQiOiAiRTVENzk2MEQ3OTU2Mjg1NzY0NzU2ZTIxNjQ3NTZlMjEiLAogICJuYW1lcyI6IFtdCn0=
