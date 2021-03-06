/* eslint-disable */
function e(e, t, n, r) {
  return new(n || (n = Promise))(function (s, i) {
    function o(e) {
      try {
        a(r.next(e))
      } catch (e) {
        i(e)
      }
    }

    function c(e) {
      try {
        a(r.throw(e))
      } catch (e) {
        i(e)
      }
    }

    function a(e) {
      e.done ? s(e.value) : new n(function (t) {
        t(e.value)
      }).then(o, c)
    }
    a((r = r.apply(e, t || [])).next())
  })
}

function t(e, t) {
  var n, r, s, i, o = {
    label: 0,
    sent: function () {
      if (1 & s[0]) throw s[1];
      return s[1]
    },
    trys: [],
    ops: []
  };
  return i = {
    next: c(0),
    throw: c(1),
    return: c(2)
  }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
    return this
  }), i;

  function c(i) {
    return function (c) {
      return function (i) {
        if (n) throw new TypeError("Generator is already executing.");
        for (; o;) try {
          if (n = 1, r && (s = 2 & i[0] ? r.return : i[0] ? r.throw || ((s = r.return) && s.call(r), 0) : r.next) && !(s = s.call(r, i[1])).done) return s;
          switch (r = 0, s && (i = [2 & i[0], s.value]), i[0]) {
            case 0:
            case 1:
              s = i;
              break;
            case 4:
              return o.label++, {
                value: i[1],
                done: !1
              };
            case 5:
              o.label++, r = i[1], i = [0];
              continue;
            case 7:
              i = o.ops.pop(), o.trys.pop();
              continue;
            default:
              if (!(s = (s = o.trys).length > 0 && s[s.length - 1]) && (6 === i[0] || 2 === i[0])) {
                o = 0;
                continue
              }
              if (3 === i[0] && (!s || i[1] > s[0] && i[1] < s[3])) {
                o.label = i[1];
                break
              }
              if (6 === i[0] && o.label < s[1]) {
                o.label = s[1], s = i;
                break
              }
              if (s && o.label < s[2]) {
                o.label = s[2], o.ops.push(i);
                break
              }
              s[2] && o.ops.pop(), o.trys.pop();
              continue
          }
          i = t.call(e, o)
        } catch (e) {
          i = [6, e], r = 0
        } finally {
          n = s = 0
        }
        if (5 & i[0]) throw i[1];
        return {
          value: i[0] ? i[1] : void 0,
          done: !0
        }
      }([i, c])
    }
  }
}
var n = 1,
  r = 2,
  s = 3,
  i = 4;
var o = "auth_invalid",
  c = "auth_ok";
var a = function () {
  function n(e, t) {
    this.options = t, this.commandId = 1, this.commands = {}, this.eventListeners = {}, this.closeRequested = !1, this._handleClose = this._handleClose.bind(this), this.setSocket(e)
  }
  return n.prototype.setSocket = function (e) {
    var t = this,
      n = this.socket;
    if (this.socket = e, e.addEventListener("message", function (e) {
        return t._handleMessage(e)
      }), e.addEventListener("close", this._handleClose), n) {
      var r = this.commands;
      this.commandId = 1, this.commands = {}, Object.keys(r).forEach(function (e) {
        var n = r[e];
        n.eventType && t.subscribeEvents(n.eventCallback, n.eventType).then(function (e) {
          n.unsubscribe = e
        })
      }), this.fireEvent("ready")
    }
  }, n.prototype.addEventListener = function (e, t) {
    var n = this.eventListeners[e];
    n || (n = this.eventListeners[e] = []), n.push(t)
  }, n.prototype.removeEventListener = function (e, t) {
    var n = this.eventListeners[e];
    if (n) {
      var r = n.indexOf(t); - 1 !== r && n.splice(r, 1)
    }
  }, n.prototype.fireEvent = function (e, t) {
    var n = this;
    (this.eventListeners[e] || []).forEach(function (e) {
      return e(n, t)
    })
  }, n.prototype.close = function () {
    this.closeRequested = !0, this.socket.close()
  }, n.prototype.subscribeEvents = function (n, r) {
    return e(this, void 0, void 0, function () {
      var s, i, o = this;
      return t(this, function (c) {
        switch (c.label) {
          case 0:
            return s = this._genCmdId(), [4, this.sendMessagePromise(function (e) {
              var t = {
                type: "subscribe_events"
              };
              return e && (t.event_type = e), t
            }(r), s)];
          case 1:
            return c.sent(), this.commands[s] = i = {
              eventCallback: n,
              eventType: r,
              unsubscribe: function () {
                return e(o, void 0, void 0, function () {
                  return t(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, this.sendMessagePromise((t = s, {
                          type: "unsubscribe_events",
                          subscription: t
                        }))];
                      case 1:
                        return e.sent(), delete this.commands[s], [2]
                    }
                    var t
                  })
                })
              }
            }, [2, function () {
              return i.unsubscribe()
            }]
        }
      })
    })
  }, n.prototype.ping = function () {
    return this.sendMessagePromise({
      type: "ping"
    })
  }, n.prototype.sendMessage = function (e, t) {
    t || (t = this._genCmdId()), e.id = t, this.socket.send(JSON.stringify(e))
  }, n.prototype.sendMessagePromise = function (e, t) {
    var n = this;
    return new Promise(function (r, s) {
      t || (t = n._genCmdId()), n.commands[t] = {
        resolve: r,
        reject: s
      }, n.sendMessage(e, t)
    })
  }, n.prototype._handleMessage = function (e) {
    var t = JSON.parse(e.data);
    switch (t.type) {
      case "event":
        this.commands[t.id].eventCallback(t.event);
        break;
      case "result":
        t.id in this.commands && (1 == t.success ? this.commands[t.id].resolve(t.result) : this.commands[t.id].reject(t.error), delete this.commands[t.id]);
        break;
      case "pong":
        this.commands[t.id].resolve(), delete this.commands[t.id]
    }
  }, n.prototype._handleClose = function () {
    var n = this;
    if (Object.keys(this.commands).forEach(function (e) {
        var t = n.commands[e].reject;
        t && t({
          type: "result",
          success: !1,
          error: {
            code: 3,
            message: "Connection lost"
          }
        })
      }), !this.closeRequested) {
      this.fireEvent("disconnected");
      var s = Object.assign({}, this.options, {
          setupRetry: 0
        }),
        i = function (o) {
          setTimeout(function () {
            return e(n, void 0, void 0, function () {
              var e, n;
              return t(this, function (t) {
                switch (t.label) {
                  case 0:
                    t.label = 1;
                  case 1:
                    return t.trys.push([1, 3, , 4]), [4, s.createSocket(s)];
                  case 2:
                    return e = t.sent(), this.setSocket(e), [3, 4];
                  case 3:
                    return (n = t.sent()) === r ? this.fireEvent("reconnect-error", n) : i(o + 1), [3, 4];
                  case 4:
                    return [2]
                }
              })
            })
          }, 1e3 * Math.min(o, 5))
        };
      i(0)
    }
  }, n.prototype._genCmdId = function () {
    return ++this.commandId
  }, n
}();

function u(e, t, n, r) {
  n += (n.includes("?") ? "&" : "?") + "auth_callback=1", document.location.href = function (e, t, n, r) {
    var s = e + "/auth/authorize?response_type=code&client_id=" + encodeURIComponent(t) + "&redirect_uri=" + encodeURIComponent(n);
    return r && (s += "&state=" + encodeURIComponent(r)), s
  }(e, t, n, r)
}

function h(n, s, i) {
  return e(this, void 0, void 0, function () {
    var e, o, c;
    return t(this, function (t) {
      switch (t.label) {
        case 0:
          return (e = new FormData).append("client_id", s), Object.keys(i).forEach(function (t) {
            e.append(t, i[t])
          }), [4, fetch(n + "/auth/token", {
            method: "POST",
            credentials: "same-origin",
            body: e
          })];
        case 1:
          if (!(o = t.sent()).ok) throw 400 === o.status || 403 === o.status ? r : new Error("Unable to fetch tokens");
          return [4, o.json()];
        case 2:
          return (c = t.sent()).hassUrl = n, c.clientId = s, c.expires = 1e3 * c.expires_in + Date.now(), [2, c]
      }
    })
  })
}
var d = function () {
  function n(e, t) {
    this.data = e, this._saveTokens = t
  }
  return Object.defineProperty(n.prototype, "wsUrl", {
    get: function () {
      return "ws" + this.data.hassUrl.substr(4) + "/api/websocket"
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(n.prototype, "accessToken", {
    get: function () {
      return this.data.access_token
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(n.prototype, "expired", {
    get: function () {
      return Date.now() > this.data.expires
    },
    enumerable: !0,
    configurable: !0
  }), n.prototype.refreshAccessToken = function () {
    return e(this, void 0, void 0, function () {
      var e;
      return t(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, h(this.data.hassUrl, this.data.clientId, {
              grant_type: "refresh_token",
              refresh_token: this.data.refresh_token
            })];
          case 1:
            return (e = t.sent()).refresh_token = this.data.refresh_token, this.data = e, this._saveTokens && this._saveTokens(e), [2]
        }
      })
    })
  }, n.prototype.revoke = function () {
    return e(this, void 0, void 0, function () {
      var e;
      return t(this, function (t) {
        switch (t.label) {
          case 0:
            return (e = new FormData).append("action", "revoke"), e.append("token", this.data.refresh_token), [4, fetch(this.data.hassUrl + "/auth/token", {
              method: "POST",
              credentials: "same-origin",
              body: e
            })];
          case 1:
            return t.sent(), this._saveTokens && this._saveTokens(null), [2]
        }
      })
    })
  }, n
}();

function l(n) {
  return void 0 === n && (n = {}), e(this, void 0, void 0, function () {
    var e, r, s, o, c, a, l;
    return t(this, function (t) {
      switch (t.label) {
        case 0:
          if (!("auth_callback" in (r = function (e) {
              for (var t = {}, n = e.split("&"), r = 0; r < n.length; r++) {
                var s = n[r].split("="),
                  i = decodeURIComponent(s[0]),
                  o = s.length > 1 ? decodeURIComponent(s[1]) : void 0;
                t[i] = o
              }
              return t
            }(location.search.substr(1))))) return [3, 4];
          s = JSON.parse(atob(r.state)), t.label = 1;
        case 1:
          return t.trys.push([1, 3, , 4]), [4, function (e, t, n) {
            return h(e, t, {
              code: n,
              grant_type: "authorization_code"
            })
          }(s.hassUrl, s.clientId, r.code)];
        case 2:
          return e = t.sent(), n.saveTokens && n.saveTokens(e), [3, 4];
        case 3:
          return o = t.sent(), console.log("Unable to fetch access token", o), [3, 4];
        case 4:
          return e || !n.loadTokens ? [3, 6] : [4, n.loadTokens()];
        case 5:
          e = t.sent(), t.label = 6;
        case 6:
          if (e) return [2, new d(e, n.saveTokens)];
          if (void 0 === (c = n.hassUrl)) throw i;
          return "/" === c[c.length - 1] && (c = c.substr(0, c.length - 1)), a = n.clientId || location.protocol + "//" + location.host + "/", l = n.redirectUrl || location.protocol + "//" + location.host + location.pathname + location.search, u(c, a, l, function (e) {
            return btoa(JSON.stringify(e))
          }({
            hassUrl: c,
            clientId: a
          })), [2, new Promise(function () {})]
      }
    })
  })
}
var f = function () {
  function e(e) {
    this._noSub = e, this.listeners = []
  }
  return e.prototype.action = function (e) {
    var t = this,
      n = function (e) {
        return t.setState(e, !1)
      };
    return function () {
      for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
      var i = e.apply(void 0, [t.state].concat(r));
      if (null != i) return "then" in i ? i.then(n) : n(i)
    }
  }, e.prototype.setState = function (e, t) {
    this.state = t ? e : Object.assign({}, this.state, e);
    for (var n = this.listeners, r = 0; r < n.length; r++) n[r](this.state)
  }, e.prototype.subscribe = function (e) {
    var t = this;
    return this.listeners.push(e), void 0 !== this.state && e(this.state),
      function () {
        t.unsubscribe(e)
      }
  }, e.prototype.unsubscribe = function (e) {
    for (var t = e, n = [], r = this.listeners, s = 0; s < r.length; s++) r[s] === t ? t = null : n.push(r[s]);
    this.listeners = n, 0 === n.length && this._noSub()
  }, e
}();

function v(n, r, s, i, o) {
  if (n in i) return i[n](o);
  var c, a = new f(function () {
    c && c.then(function (e) {
      return e()
    }), i.removeEventListener("ready", u), delete i[n]
  });

  function u() {
    return e(this, void 0, void 0, function () {
      var e, n;
      return t(this, function (t) {
        switch (t.label) {
          case 0:
            return n = (e = a).setState, [4, r(i)];
          case 1:
            return n.apply(e, [t.sent(), !0]), [2]
        }
      })
    })
  }
  return i[n] = function (e) {
    return a.subscribe(e)
  }, s && (c = s(i, a)), i.addEventListener("ready", u), u(), a.subscribe(o)
}
var p = function (e) {
    return e.sendMessagePromise({
      type: "get_states"
    })
  },
  b = function (e) {
    return e.sendMessagePromise({
      type: "get_services"
    })
  },
  m = function (e) {
    return e.sendMessagePromise({
      type: "get_config"
    })
  },
  y = function (e) {
    return e.sendMessagePromise({
      type: "auth/current_user"
    })
  },
  g = function (e, t, n, r) {
    return e.sendMessagePromise(function (e, t, n) {
      var r = {
        type: "call_service",
        domain: e,
        service: t
      };
      return n && (r.service_data = n), r
    }(t, n, r))
  };

function k(e, t) {
  return void 0 === e ? null : {
    components: e.components.concat(t.data.component)
  }
}
var _ = function (e) {
    return m(e)
  },
  w = function (e, t) {
    return e.subscribeEvents(t.action(k), "component_loaded")
  },
  E = function (e, t) {
    return v("_cnf", _, w, e, t)
  };

function S(e, t) {
  var n, r;
  if (void 0 === e) return null;
  var s = t.data,
    i = s.domain,
    o = Object.assign({}, e[i], ((n = {})[s.service] = {
      description: "",
      fields: {}
    }, n));
  return (r = {})[i] = o, r
}

function T(e, t) {
  var n;
  if (void 0 === e) return null;
  var r = t.data,
    s = r.domain,
    i = r.service,
    o = e[s];
  if (!(o && i in o)) return null;
  var c = {};
  return Object.keys(o).forEach(function (e) {
    e !== i && (c[e] = o[e])
  }), (n = {})[s] = c, n
}
var O = function (e) {
    return b(e)
  },
  L = function (e, t) {
    return Promise.all([e.subscribeEvents(t.action(S), "service_registered"), e.subscribeEvents(t.action(T), "service_removed")]).then(function (e) {
      return function () {
        return e.forEach(function (e) {
          return e()
        })
      }
    })
  },
  P = function (e, t) {
    return v("_srv", O, L, e, t)
  };

function C(n) {
  return e(this, void 0, void 0, function () {
    var e, r, s, i;
    return t(this, function (t) {
      switch (t.label) {
        case 0:
          return [4, p(n)];
        case 1:
          for (e = t.sent(), r = {}, s = 0; s < e.length; s++) r[(i = e[s]).entity_id] = i;
          return [2, r]
      }
    })
  })
}
var I = function (e, t) {
    return e.subscribeEvents(function (e) {
      return function (e, t) {
        var n, r = e.state;
        if (void 0 !== r) {
          var s = t.data,
            i = s.entity_id,
            o = s.new_state;
          if (o) e.setState(((n = {})[o.entity_id] = o, n));
          else {
            var c = Object.assign({}, r);
            delete c[i], e.setState(c, !0)
          }
        }
      }(t, e)
    }, "state_changed")
  },
  U = function (e, t) {
    return v("_ent", C, I, e, t)
  },
  j = {
    setupRetry: 0,
    createSocket: function (s) {
      if (!s.auth) throw i;
      var a = s.auth,
        u = a.wsUrl;
      return new Promise(function (i, h) {
        return function s(i, h, d) {
          var l = this,
            f = new WebSocket(u),
            v = !1,
            p = function () {
              if (f.removeEventListener("close", p), v) d(r);
              else if (0 !== i) {
                var e = -1 === i ? -1 : i - 1;
                setTimeout(function () {
                  return s(e, h, d)
                }, 1e3)
              } else d(n)
            },
            b = function (n) {
              return e(l, void 0, void 0, function () {
                var e;
                return t(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return t.trys.push([0, 3, , 4]), a.expired ? [4, a.refreshAccessToken()] : [3, 2];
                    case 1:
                      t.sent(), t.label = 2;
                    case 2:
                      return f.send(JSON.stringify({
                        type: "auth",
                        access_token: a.accessToken
                      })), [3, 4];
                    case 3:
                      return e = t.sent(), v = e === r, f.close(), [3, 4];
                    case 4:
                      return [2]
                  }
                })
              })
            },
            m = function (n) {
              return e(l, void 0, void 0, function () {
                return t(this, function (e) {
                  switch (JSON.parse(n.data).type) {
                    case o:
                      v = !0, f.close();
                      break;
                    case c:
                      f.removeEventListener("open", b), f.removeEventListener("message", m), f.removeEventListener("close", p), f.removeEventListener("error", p), h(f)
                  }
                  return [2]
                })
              })
            };
          f.addEventListener("open", b), f.addEventListener("message", m), f.addEventListener("close", p), f.addEventListener("error", p)
        }(s.setupRetry, i, h)
      })
    }
  };

function M(n) {
  return e(this, void 0, void 0, function () {
    var e, r;
    return t(this, function (t) {
      switch (t.label) {
        case 0:
          return [4, (e = Object.assign({}, j, n)).createSocket(e)];
        case 1:
          return r = t.sent(), [2, new a(r, e)]
      }
    })
  })
}
export {
  M as createConnection, d as Auth, l as getAuth, v as createCollection, a as Connection, E as subscribeConfig, P as subscribeServices, U as subscribeEntities, n as ERR_CANNOT_CONNECT, r as ERR_INVALID_AUTH, s as ERR_CONNECTION_LOST, i as ERR_HASS_HOST_REQUIRED, p as getStates, b as getServices, m as getConfig, y as getUser, g as callService
};
//# sourceMappingURL=haws.es.js.map
