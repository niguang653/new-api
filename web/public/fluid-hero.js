/* ============================================================
 * 灵珑AI 首页「鼠标拖尾流体特效」
 * 来源：https://linlongs.com/ 首页生产代码
 *   /_next/static/chunks/app/(site)/page-6ed0db24f60e6cfb.js
 *   → webpack module 1275（原站 React 组件，此处仅去掉 React 依赖）
 * 说明：下面是原站代码原样提取（只做了 prettier 格式化，变量名未改动）。
 *       仅在最外层加了一个最小适配层，把 useRef/useEffect 换成直接挂载。
 * 用法：<script src="fluid-hero.js"></script> 然后 mountFluid();
 * ============================================================ */
(function (global) {
  "use strict";

  /* ---------- 最小适配层：替代 React 的 useRef / useEffect 与 jsx 运行时 ---------- */
  var canvas = null;
  var jsxRuntime = {
    jsx: function (type, props) { return { type: type, props: props }; },
    jsxs: function (type, props) { return { type: type, props: props }; },
    Fragment: "Fragment",
  };
  var ReactShim = {
    useRef: function () {
      return {
        get current() { return canvas; },
        set current(v) { /* 原站组件只读不写 */ },
      };
    },
    useEffect: function (fn) {
      // 原站组件在 useEffect 里初始化整个 WebGL 管线，这里直接执行
      try { var cleanup = fn(); if (typeof cleanup === "function") window.__fluidCleanup = cleanup; }
      catch (err) { console.error("[fluid-hero] 初始化失败:", err); }
    },
  };
  function requireShim(id) {
    if (id === 12907) return ReactShim;   // react
    if (id === 19899) return jsxRuntime;  // react/jsx-runtime
    throw new Error("[fluid-hero] 未预期的模块依赖: " + id);
  }
  requireShim.d = function (obj, defs) {
    Object.keys(defs).forEach(function (k) {
      Object.defineProperty(obj, k, { get: defs[k], enumerable: true, configurable: true });
    });
  };

  /* ---------- 原站 module 1275 源码 ---------- */
const __fluidModule = (e, t, r) => {
  "use strict";
  r.d(t, { default: () => a });
  var n = r(19899),
    i = r(12907);
  function a(e) {
    let {
        SIM_RESOLUTION: t = 128,
        DYE_RESOLUTION: r = 1440,
        DENSITY_DISSIPATION: a = 3.5,
        VELOCITY_DISSIPATION: s = 2,
        PRESSURE: o = 0.1,
        PRESSURE_ITERATIONS: l = 20,
        CURL: c = 3,
        SPLAT_RADIUS: d = 0.2,
        SPLAT_FORCE: u = 6e3,
        SHADING: m = !0,
        COLOR_UPDATE_SPEED: x = 10,
        HUE_RANGE: h = [0.55, 0.95],
        className: f,
      } = e,
      p = (0, i.useRef)(null);
    return (
      (0, i.useEffect)(() => {
        var e, n;
        let i,
          f,
          g,
          w,
          b,
          y = p.current;
        if (
          !y ||
          (null === (e = (n = window).matchMedia) || void 0 === e
            ? void 0
            : e.call(n, "(prefers-reduced-motion: reduce)").matches)
        )
          return;
        let j = {
            SIM_RESOLUTION: t,
            DYE_RESOLUTION: r,
            DENSITY_DISSIPATION: a,
            VELOCITY_DISSIPATION: s,
            PRESSURE: o,
            PRESSURE_ITERATIONS: l,
            CURL: c,
            SPLAT_RADIUS: d,
            SPLAT_FORCE: u,
            SHADING: m,
            COLOR_UPDATE_SPEED: x,
          },
          E = {
            id: -1,
            texcoordX: 0,
            texcoordY: 0,
            prevTexcoordX: 0,
            prevTexcoordY: 0,
            deltaX: 0,
            deltaY: 0,
            down: !1,
            moved: !1,
            color: { r: 0, g: 0, b: 0 },
          },
          T = y.getContext("webgl2", {
            alpha: !0,
            depth: !1,
            stencil: !1,
            antialias: !1,
            preserveDrawingBuffer: !1,
          });
        if (!T) return;
        T.getExtension("EXT_color_buffer_float");
        let N = !!T.getExtension("OES_texture_float_linear");
        T.clearColor(0, 0, 0, 0);
        let C = T.HALF_FLOAT;
        function _(e, t, r) {
          if (
            !(function (e, t, r) {
              let n = T.createTexture();
              (T.bindTexture(T.TEXTURE_2D, n),
                T.texParameteri(T.TEXTURE_2D, T.TEXTURE_MIN_FILTER, T.NEAREST),
                T.texParameteri(T.TEXTURE_2D, T.TEXTURE_MAG_FILTER, T.NEAREST),
                T.texParameteri(T.TEXTURE_2D, T.TEXTURE_WRAP_S, T.CLAMP_TO_EDGE),
                T.texParameteri(T.TEXTURE_2D, T.TEXTURE_WRAP_T, T.CLAMP_TO_EDGE),
                T.texImage2D(T.TEXTURE_2D, 0, e, 4, 4, 0, t, r, null));
              let i = T.createFramebuffer();
              (T.bindFramebuffer(T.FRAMEBUFFER, i),
                T.framebufferTexture2D(T.FRAMEBUFFER, T.COLOR_ATTACHMENT0, T.TEXTURE_2D, n, 0));
              let a = T.checkFramebufferStatus(T.FRAMEBUFFER) === T.FRAMEBUFFER_COMPLETE;
              return (T.deleteTexture(n), T.deleteFramebuffer(i), a);
            })(e, t, r)
          )
            switch (e) {
              case T.R16F:
                return _(T.RG16F, T.RG, r);
              case T.RG16F:
                return _(T.RGBA16F, T.RGBA, r);
              default:
                return null;
            }
          return { internalFormat: e, format: t };
        }
        let R = _(T.RGBA16F, T.RGBA, C),
          F = _(T.RG16F, T.RG, C),
          S = _(T.R16F, T.RED, C);
        if (!R || !F || !S) return;
        function L(e, t, r) {
          r && (t = r.map((e) => "#define ".concat(e, "\n")).join("") + t);
          let n = T.createShader(e);
          return (
            T.shaderSource(n, t),
            T.compileShader(n),
            T.getShaderParameter(n, T.COMPILE_STATUS) ||
              console.warn("[SplashCursor]", T.getShaderInfoLog(n)),
            n
          );
        }
        N || (j.SHADING = !1);
        class D {
          bind() {
            T.useProgram(this.program);
          }
          constructor(e, t) {
            ((this.program = (function (e, t) {
              let r = T.createProgram();
              return (
                T.attachShader(r, e),
                T.attachShader(r, t),
                T.linkProgram(r),
                T.getProgramParameter(r, T.LINK_STATUS) ||
                  console.warn("[SplashCursor]", T.getProgramInfoLog(r)),
                r
              );
            })(e, t)),
              (this.uniforms = (function (e) {
                let t = {},
                  r = T.getProgramParameter(e, T.ACTIVE_UNIFORMS);
                for (let n = 0; n < r; n++) {
                  let r = T.getActiveUniform(e, n).name;
                  t[r] = T.getUniformLocation(e, r);
                }
                return t;
              })(this.program)));
          }
        }
        let A = L(
            T.VERTEX_SHADER,
            "\n      precision highp float;\n      attribute vec2 aPosition;\n      varying vec2 vUv;\n      varying vec2 vL;\n      varying vec2 vR;\n      varying vec2 vT;\n      varying vec2 vB;\n      uniform vec2 texelSize;\n      void main () {\n        vUv = aPosition * 0.5 + 0.5;\n        vL = vUv - vec2(texelSize.x, 0.0);\n        vR = vUv + vec2(texelSize.x, 0.0);\n        vT = vUv + vec2(0.0, texelSize.y);\n        vB = vUv - vec2(0.0, texelSize.y);\n        gl_Position = vec4(aPosition, 0.0, 1.0);\n      }",
          ),
          k = L(
            T.FRAGMENT_SHADER,
            "\n      precision mediump float;\n      precision mediump sampler2D;\n      varying highp vec2 vUv;\n      uniform sampler2D uTexture;\n      void main () { gl_FragColor = texture2D(uTexture, vUv); }",
          ),
          B = L(
            T.FRAGMENT_SHADER,
            "\n      precision mediump float;\n      precision mediump sampler2D;\n      varying highp vec2 vUv;\n      uniform sampler2D uTexture;\n      uniform float value;\n      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }",
          ),
          M = L(
            T.FRAGMENT_SHADER,
            "\n      precision highp float;\n      precision highp sampler2D;\n      varying vec2 vUv;\n      uniform sampler2D uTarget;\n      uniform float aspectRatio;\n      uniform vec3 color;\n      uniform vec2 point;\n      uniform float radius;\n      void main () {\n        vec2 p = vUv - point.xy;\n        p.x *= aspectRatio;\n        vec3 splat = exp(-dot(p, p) / radius) * color;\n        vec3 base = texture2D(uTarget, vUv).xyz;\n        gl_FragColor = vec4(base + splat, 1.0);\n      }",
          ),
          U = L(
            T.FRAGMENT_SHADER,
            "\n      precision highp float;\n      precision highp sampler2D;\n      varying vec2 vUv;\n      uniform sampler2D uVelocity;\n      uniform sampler2D uSource;\n      uniform vec2 texelSize;\n      uniform vec2 dyeTexelSize;\n      uniform float dt;\n      uniform float dissipation;\n      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n        vec2 st = uv / tsize - 0.5;\n        vec2 iuv = floor(st);\n        vec2 fuv = fract(st);\n        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n      }\n      void main () {\n        #ifdef MANUAL_FILTERING\n          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n          vec4 result = bilerp(uSource, coord, dyeTexelSize);\n        #else\n          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n          vec4 result = texture2D(uSource, coord);\n        #endif\n        float decay = 1.0 + dissipation * dt;\n        gl_FragColor = result / decay;\n      }",
            N ? void 0 : ["MANUAL_FILTERING"],
          ),
          I = L(
            T.FRAGMENT_SHADER,
            "\n      precision mediump float;\n      precision mediump sampler2D;\n      varying highp vec2 vUv;\n      varying highp vec2 vL;\n      varying highp vec2 vR;\n      varying highp vec2 vT;\n      varying highp vec2 vB;\n      uniform sampler2D uVelocity;\n      void main () {\n        float L = texture2D(uVelocity, vL).x;\n        float R = texture2D(uVelocity, vR).x;\n        float T = texture2D(uVelocity, vT).y;\n        float B = texture2D(uVelocity, vB).y;\n        vec2 C = texture2D(uVelocity, vUv).xy;\n        if (vL.x < 0.0) { L = -C.x; }\n        if (vR.x > 1.0) { R = -C.x; }\n        if (vT.y > 1.0) { T = -C.y; }\n        if (vB.y < 0.0) { B = -C.y; }\n        float div = 0.5 * (R - L + T - B);\n        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n      }",
          ),
          z = L(
            T.FRAGMENT_SHADER,
            "\n      precision mediump float;\n      precision mediump sampler2D;\n      varying highp vec2 vUv;\n      varying highp vec2 vL;\n      varying highp vec2 vR;\n      varying highp vec2 vT;\n      varying highp vec2 vB;\n      uniform sampler2D uVelocity;\n      void main () {\n        float L = texture2D(uVelocity, vL).y;\n        float R = texture2D(uVelocity, vR).y;\n        float T = texture2D(uVelocity, vT).x;\n        float B = texture2D(uVelocity, vB).x;\n        float vorticity = R - L - T + B;\n        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n      }",
          ),
          P = L(
            T.FRAGMENT_SHADER,
            "\n      precision highp float;\n      precision highp sampler2D;\n      varying vec2 vUv;\n      varying vec2 vL;\n      varying vec2 vR;\n      varying vec2 vT;\n      varying vec2 vB;\n      uniform sampler2D uVelocity;\n      uniform sampler2D uCurl;\n      uniform float curl;\n      uniform float dt;\n      void main () {\n        float L = texture2D(uCurl, vL).x;\n        float R = texture2D(uCurl, vR).x;\n        float T = texture2D(uCurl, vT).x;\n        float B = texture2D(uCurl, vB).x;\n        float C = texture2D(uCurl, vUv).x;\n        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n        force /= length(force) + 0.0001;\n        force *= curl * C;\n        force.y *= -1.0;\n        vec2 velocity = texture2D(uVelocity, vUv).xy;\n        velocity += force * dt;\n        velocity = min(max(velocity, -1000.0), 1000.0);\n        gl_FragColor = vec4(velocity, 0.0, 1.0);\n      }",
          ),
          X = L(
            T.FRAGMENT_SHADER,
            "\n      precision mediump float;\n      precision mediump sampler2D;\n      varying highp vec2 vUv;\n      varying highp vec2 vL;\n      varying highp vec2 vR;\n      varying highp vec2 vT;\n      varying highp vec2 vB;\n      uniform sampler2D uPressure;\n      uniform sampler2D uDivergence;\n      void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        float divergence = texture2D(uDivergence, vUv).x;\n        float pressure = (L + R + B + T - divergence) * 0.25;\n        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n      }",
          ),
          O = L(
            T.FRAGMENT_SHADER,
            "\n      precision mediump float;\n      precision mediump sampler2D;\n      varying highp vec2 vUv;\n      varying highp vec2 vL;\n      varying highp vec2 vR;\n      varying highp vec2 vT;\n      varying highp vec2 vB;\n      uniform sampler2D uPressure;\n      uniform sampler2D uVelocity;\n      void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        vec2 velocity = texture2D(uVelocity, vUv).xy;\n        velocity.xy -= vec2(R - L, T - B);\n        gl_FragColor = vec4(velocity, 0.0, 1.0);\n      }",
          ),
          Y = T.createBuffer();
        (T.bindBuffer(T.ARRAY_BUFFER, Y),
          T.bufferData(
            T.ARRAY_BUFFER,
            new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
            T.STATIC_DRAW,
          ));
        let H = T.createBuffer();
        function V(e) {
          let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          (null == e
            ? (T.viewport(0, 0, T.drawingBufferWidth, T.drawingBufferHeight),
              T.bindFramebuffer(T.FRAMEBUFFER, null))
            : (T.viewport(0, 0, e.width, e.height), T.bindFramebuffer(T.FRAMEBUFFER, e.fbo)),
            t && (T.clearColor(0, 0, 0, 0), T.clear(T.COLOR_BUFFER_BIT)),
            T.drawElements(T.TRIANGLES, 6, T.UNSIGNED_SHORT, 0));
        }
        function G(e, t, r, n, i, a) {
          T.activeTexture(T.TEXTURE0);
          let s = T.createTexture();
          (T.bindTexture(T.TEXTURE_2D, s),
            T.texParameteri(T.TEXTURE_2D, T.TEXTURE_MIN_FILTER, a),
            T.texParameteri(T.TEXTURE_2D, T.TEXTURE_MAG_FILTER, a),
            T.texParameteri(T.TEXTURE_2D, T.TEXTURE_WRAP_S, T.CLAMP_TO_EDGE),
            T.texParameteri(T.TEXTURE_2D, T.TEXTURE_WRAP_T, T.CLAMP_TO_EDGE),
            T.texImage2D(T.TEXTURE_2D, 0, r, e, t, 0, n, i, null));
          let o = T.createFramebuffer();
          return (
            T.bindFramebuffer(T.FRAMEBUFFER, o),
            T.framebufferTexture2D(T.FRAMEBUFFER, T.COLOR_ATTACHMENT0, T.TEXTURE_2D, s, 0),
            T.viewport(0, 0, e, t),
            T.clear(T.COLOR_BUFFER_BIT),
            {
              texture: s,
              fbo: o,
              width: e,
              height: t,
              texelSizeX: 1 / e,
              texelSizeY: 1 / t,
              attach: (e) => (T.activeTexture(T.TEXTURE0 + e), T.bindTexture(T.TEXTURE_2D, s), e),
            }
          );
        }
        function Z(e, t, r, n, i, a) {
          let s = G(e, t, r, n, i, a),
            o = G(e, t, r, n, i, a);
          return {
            width: e,
            height: t,
            texelSizeX: s.texelSizeX,
            texelSizeY: s.texelSizeY,
            get read() {
              return s;
            },
            set read(v) {
              s = v;
            },
            get write() {
              return o;
            },
            set write(v) {
              o = v;
            },
            swap() {
              let e = s;
              ((s = o), (o = e));
            },
          };
        }
        function W(e, t, r, n, i, a, s) {
          return (
            (e.width === t && e.height === r) ||
              ((e.read = (function (e, t, r, n, i, a, s) {
                let o = G(t, r, n, i, a, s);
                return (K.bind(), T.uniform1i(K.uniforms.uTexture, e.attach(0)), V(o), o);
              })(e.read, t, r, n, i, a, s)),
              (e.write = G(t, r, n, i, a, s)),
              (e.width = t),
              (e.height = r),
              (e.texelSizeX = 1 / t),
              (e.texelSizeY = 1 / r)),
            e
          );
        }
        (T.bindBuffer(T.ELEMENT_ARRAY_BUFFER, H),
          T.bufferData(T.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), T.STATIC_DRAW),
          T.vertexAttribPointer(0, 2, T.FLOAT, !1, 0, 0),
          T.enableVertexAttribArray(0));
        let K = new D(A, k),
          J = new D(A, B),
          q = new D(A, M),
          $ = new D(A, U),
          Q = new D(A, I),
          ee = new D(A, z),
          et = new D(A, P),
          er = new D(A, X),
          en = new D(A, O),
          ei = new D(
            A,
            L(
              T.FRAGMENT_SHADER,
              "\n      precision highp float;\n      precision highp sampler2D;\n      varying vec2 vUv;\n      varying vec2 vL;\n      varying vec2 vR;\n      varying vec2 vT;\n      varying vec2 vB;\n      uniform sampler2D uTexture;\n      uniform vec2 texelSize;\n      void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n        #ifdef SHADING\n          vec3 lc = texture2D(uTexture, vL).rgb;\n          vec3 rc = texture2D(uTexture, vR).rgb;\n          vec3 tc = texture2D(uTexture, vT).rgb;\n          vec3 bc = texture2D(uTexture, vB).rgb;\n          float dx = length(rc) - length(lc);\n          float dy = length(tc) - length(bc);\n          vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n          vec3 l = vec3(0.0, 0.0, 1.0);\n          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n          c *= diffuse;\n        #endif\n        float a = max(c.r, max(c.g, c.b));\n        gl_FragColor = vec4(c, a);\n      }",
              j.SHADING ? ["SHADING"] : void 0,
            ),
          );
        function ea(e) {
          let t = T.drawingBufferWidth / T.drawingBufferHeight;
          t < 1 && (t = 1 / t);
          let r = Math.round(e),
            n = Math.round(e * t);
          return T.drawingBufferWidth > T.drawingBufferHeight
            ? { width: n, height: r }
            : { width: r, height: n };
        }
        function es() {
          let e = ea(j.SIM_RESOLUTION),
            t = ea(j.DYE_RESOLUTION),
            r = N ? T.LINEAR : T.NEAREST;
          (T.disable(T.BLEND),
            (i = i
              ? W(i, t.width, t.height, R.internalFormat, R.format, C, r)
              : Z(t.width, t.height, R.internalFormat, R.format, C, r)),
            (f = f
              ? W(f, e.width, e.height, F.internalFormat, F.format, C, r)
              : Z(e.width, e.height, F.internalFormat, F.format, C, r)),
            (g = G(e.width, e.height, S.internalFormat, S.format, C, T.NEAREST)),
            (w = G(e.width, e.height, S.internalFormat, S.format, C, T.NEAREST)),
            (b = Z(e.width, e.height, S.internalFormat, S.format, C, T.NEAREST)));
        }
        function eo() {
          let [e, t] = h,
            r = (function (e, t, r) {
              let n = Math.floor(6 * e),
                i = 6 * e - n,
                a = +(1 - +i),
                s = r * (1 - (1 - i) * t),
                o = [
                  [r, s, 0],
                  [a, r, 0],
                  [0, r, s],
                  [0, a, r],
                  [s, 0, r],
                  [r, 0, a],
                ][n % 6];
              return { r: o[0], g: o[1], b: o[2] };
            })(e + Math.random() * (t - e), 1, 1);
          return ((r.r *= 0.15), (r.g *= 0.15), (r.b *= 0.15), r);
        }
        function el(e) {
          return Math.floor(e * (window.devicePixelRatio || 1));
        }
        function ec() {
          let e = el(y.clientWidth),
            t = el(y.clientHeight);
          return (y.width !== e || y.height !== t) && ((y.width = e), (y.height = t), !0);
        }
        function ed(e, t, r, n, a) {
          (q.bind(),
            T.uniform1i(q.uniforms.uTarget, f.read.attach(0)),
            T.uniform1f(q.uniforms.aspectRatio, y.width / y.height),
            T.uniform2f(q.uniforms.point, e, t),
            T.uniform3f(q.uniforms.color, r, n, 0),
            T.uniform1f(
              q.uniforms.radius,
              (function (e) {
                let t = y.width / y.height;
                return (t > 1 && (e *= t), e);
              })(j.SPLAT_RADIUS / 100),
            ),
            V(f.write),
            f.swap(),
            T.uniform1i(q.uniforms.uTarget, i.read.attach(0)),
            T.uniform3f(q.uniforms.color, a.r, a.g, a.b),
            V(i.write),
            i.swap());
        }
        let eu = Date.now(),
          em = 0,
          ex = 0;
        function ev(e, t, r) {
          ((E.id = e),
            (E.down = !0),
            (E.moved = !1),
            (E.texcoordX = t / y.width),
            (E.texcoordY = 1 - r / y.height),
            (E.prevTexcoordX = E.texcoordX),
            (E.prevTexcoordY = E.texcoordY),
            (E.deltaX = 0),
            (E.deltaY = 0),
            (E.color = eo()));
        }
        function eh(e, t, r) {
          ((E.prevTexcoordX = E.texcoordX),
            (E.prevTexcoordY = E.texcoordY),
            (E.texcoordX = e / y.width),
            (E.texcoordY = 1 - t / y.height),
            (E.deltaX = (function (e) {
              let t = y.width / y.height;
              return (t < 1 && (e *= t), e);
            })(E.texcoordX - E.prevTexcoordX)),
            (E.deltaY = (function (e) {
              let t = y.width / y.height;
              return (t > 1 && (e /= t), e);
            })(E.texcoordY - E.prevTexcoordY)),
            (E.moved = Math.abs(E.deltaX) > 0 || Math.abs(E.deltaY) > 0),
            (E.color = r));
        }
        let ef = !1,
          ep = (e) => {
            ev(-1, el(e.clientX), el(e.clientY));
            let t = eo();
            ((t.r *= 10),
              (t.g *= 10),
              (t.b *= 10),
              ed(
                E.texcoordX,
                E.texcoordY,
                10 * (Math.random() - 0.5),
                30 * (Math.random() - 0.5),
                t,
              ));
          },
          eg = (e) => {
            let t = el(e.clientX),
              r = el(e.clientY);
            if (!ef) {
              ((ef = !0), ev(-1, t, r));
              return;
            }
            eh(t, r, E.color);
          },
          ew = (e) => {
            let t = e.targetTouches[0];
            t && ((ef = !0), ev(t.identifier, el(t.clientX), el(t.clientY)));
          },
          eb = (e) => {
            let t = e.targetTouches[0];
            t && eh(el(t.clientX), el(t.clientY), E.color);
          },
          ey = () => {
            E.down = !1;
          };
        return (
          ec(),
          es(),
          (function e() {
            let t = Date.now(),
              r = Math.min((t - eu) / 1e3, 0.016666);
            if (
              ((eu = t),
              ec() && es(),
              (em += r * j.COLOR_UPDATE_SPEED) >= 1 && ((em %= 1), (E.color = eo())),
              E.moved)
            )
              ((E.moved = !1),
                ed(
                  E.texcoordX,
                  E.texcoordY,
                  E.deltaX * j.SPLAT_FORCE,
                  E.deltaY * j.SPLAT_FORCE,
                  E.color,
                ));
            (T.disable(T.BLEND),
              ee.bind(),
              T.uniform2f(ee.uniforms.texelSize, f.texelSizeX, f.texelSizeY),
              T.uniform1i(ee.uniforms.uVelocity, f.read.attach(0)),
              V(w),
              et.bind(),
              T.uniform2f(et.uniforms.texelSize, f.texelSizeX, f.texelSizeY),
              T.uniform1i(et.uniforms.uVelocity, f.read.attach(0)),
              T.uniform1i(et.uniforms.uCurl, w.attach(1)),
              T.uniform1f(et.uniforms.curl, j.CURL),
              T.uniform1f(et.uniforms.dt, r),
              V(f.write),
              f.swap(),
              Q.bind(),
              T.uniform2f(Q.uniforms.texelSize, f.texelSizeX, f.texelSizeY),
              T.uniform1i(Q.uniforms.uVelocity, f.read.attach(0)),
              V(g),
              J.bind(),
              T.uniform1i(J.uniforms.uTexture, b.read.attach(0)),
              T.uniform1f(J.uniforms.value, j.PRESSURE),
              V(b.write),
              b.swap(),
              er.bind(),
              T.uniform2f(er.uniforms.texelSize, f.texelSizeX, f.texelSizeY),
              T.uniform1i(er.uniforms.uDivergence, g.attach(0)));
            for (let e = 0; e < j.PRESSURE_ITERATIONS; e++)
              (T.uniform1i(er.uniforms.uPressure, b.read.attach(1)), V(b.write), b.swap());
            (en.bind(),
              T.uniform2f(en.uniforms.texelSize, f.texelSizeX, f.texelSizeY),
              T.uniform1i(en.uniforms.uPressure, b.read.attach(0)),
              T.uniform1i(en.uniforms.uVelocity, f.read.attach(1)),
              V(f.write),
              f.swap(),
              $.bind(),
              T.uniform2f($.uniforms.texelSize, f.texelSizeX, f.texelSizeY),
              N || T.uniform2f($.uniforms.dyeTexelSize, f.texelSizeX, f.texelSizeY));
            let n = f.read.attach(0);
            (T.uniform1i($.uniforms.uVelocity, n),
              T.uniform1i($.uniforms.uSource, n),
              T.uniform1f($.uniforms.dt, r),
              T.uniform1f($.uniforms.dissipation, j.VELOCITY_DISSIPATION),
              V(f.write),
              f.swap(),
              N || T.uniform2f($.uniforms.dyeTexelSize, i.texelSizeX, i.texelSizeY),
              T.uniform1i($.uniforms.uVelocity, f.read.attach(0)),
              T.uniform1i($.uniforms.uSource, i.read.attach(1)),
              T.uniform1f($.uniforms.dissipation, j.DENSITY_DISSIPATION),
              V(i.write),
              i.swap(),
              T.blendFunc(T.ONE, T.ONE_MINUS_SRC_ALPHA),
              T.enable(T.BLEND),
              ei.bind(),
              j.SHADING &&
                T.uniform2f(
                  ei.uniforms.texelSize,
                  1 / T.drawingBufferWidth,
                  1 / T.drawingBufferHeight,
                ),
              T.uniform1i(ei.uniforms.uTexture, i.read.attach(0)),
              V(null, !0),
              (ex = requestAnimationFrame(e)));
          })(),
          window.addEventListener("mousedown", ep),
          window.addEventListener("mousemove", eg),
          window.addEventListener("touchstart", ew, { passive: !0 }),
          window.addEventListener("touchmove", eb, { passive: !0 }),
          window.addEventListener("touchend", ey),
          () => {
            (cancelAnimationFrame(ex),
              window.removeEventListener("mousedown", ep),
              window.removeEventListener("mousemove", eg),
              window.removeEventListener("touchstart", ew),
              window.removeEventListener("touchmove", eb),
              window.removeEventListener("touchend", ey));
          }
        );
      }, []),
      (0, n.jsx)("div", {
        className: null != f ? f : "pointer-events-none fixed inset-0 z-50",
        "aria-hidden": "true",
        children: (0, n.jsx)("canvas", { ref: p, className: "block h-full w-full" }),
      })
    );
  }
};


  /* ---------- 挂载 ---------- */
  function mountFluid(options) {
    options = options || {};
    var host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText =
      options.hostStyle ||
      "position:fixed;inset:0;z-index:" + (options.zIndex == null ? 50 : options.zIndex) + ";pointer-events:none;";
    canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%;";
    host.appendChild(canvas);
    (options.container || document.body).appendChild(host);

    var exportsObj = {};
    __fluidModule({}, exportsObj, requireShim);
    var Comp = exportsObj.default;
    Comp(options); // 触发组件函数 -> 适配层立即执行 useEffect
    return { host: host, canvas: canvas, destroy: function () { if (window.__fluidCleanup) window.__fluidCleanup(); host.remove(); } };
  }

  global.mountFluid = mountFluid;
})(window);