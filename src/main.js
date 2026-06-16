import "./style.css";

// --- Fondo WebGL: efecto de líneas neón RGB ---
// Implementado en WebGL puro (sin three.js) para reducir el peso del bundle.

const VERTEX_SRC = `
attribute vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float xScale;
uniform float yScale;
uniform float distortion;

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  float d = length(p) * distortion;

  float rx = p.x * (1.0 + d);
  float gx = p.x;
  float bx = p.x * (1.0 - d);

  float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
  float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
  float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error al compilar el shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error al enlazar el programa:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function initShader() {
  const canvas = document.getElementById("shader-bg");
  if (!canvas) return;

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    console.warn("WebGL no está disponible; se omite el fondo animado.");
    return;
  }

  const program = createProgram(gl);
  if (!program) return;
  gl.useProgram(program);

  // Quad a pantalla completa (dos triángulos).
  const positions = new Float32Array([
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

  const uniforms = {
    resolution: gl.getUniformLocation(program, "resolution"),
    time: gl.getUniformLocation(program, "time"),
    xScale: gl.getUniformLocation(program, "xScale"),
    yScale: gl.getUniformLocation(program, "yScale"),
    distortion: gl.getUniformLocation(program, "distortion"),
  };

  gl.uniform1f(uniforms.xScale, 1.0);
  gl.uniform1f(uniforms.yScale, 0.5);
  gl.uniform1f(uniforms.distortion, 0.05);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(window.innerWidth * dpr);
    const height = Math.floor(window.innerHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resize);
  resize();

  // Respeta la preferencia de movimiento reducido: render estático.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let time = 0;
  function render() {
    time += 0.01;
    gl.uniform1f(uniforms.time, time);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!reduceMotion) requestAnimationFrame(render);
  }
  render();
}

initShader();
