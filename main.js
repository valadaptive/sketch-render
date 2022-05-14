(function () {
  'use strict';

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 3x3 Matrix
   * @module mat3
   */

  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */

  function create$5() {
    var out = new ARRAY_TYPE(9);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }

    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  /**
   * Copies the upper-left 3x3 values into the given mat3.
   *
   * @param {mat3} out the receiving 3x3 matrix
   * @param {ReadonlyMat4} a   the source 4x4 matrix
   * @returns {mat3} out
   */

  function fromMat4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
  }
  /**
   * Transpose the values of a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {ReadonlyMat3} a the source matrix
   * @returns {mat3} out
   */

  function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      var a01 = a[1],
          a02 = a[2],
          a12 = a[5];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a01;
      out[5] = a[7];
      out[6] = a02;
      out[7] = a12;
    } else {
      out[0] = a[0];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a[1];
      out[4] = a[4];
      out[5] = a[7];
      out[6] = a[2];
      out[7] = a[5];
      out[8] = a[8];
    }

    return out;
  }
  /**
   * Inverts a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {ReadonlyMat3} a the source matrix
   * @returns {mat3} out
   */

  function invert$1(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  /**
   * Calculates the determinant of a mat3
   *
   * @param {ReadonlyMat3} a the source matrix
   * @returns {Number} determinant of a
   */

  function determinant(a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }

  /**
   * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
   * @module mat4
   */

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */

  function create$4() {
    var out = new ARRAY_TYPE(16);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */

  function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  /**
   * Multiplies two mat4s
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the first operand
   * @param {ReadonlyMat4} b the second operand
   * @returns {mat4} out
   */

  function multiply(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15]; // Cache only the current line of the second matrix

    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     mat4.translate(dest, origin);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *     mat4.translate(dest, negativeOrigin);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat4} q Rotation quaternion
   * @param {ReadonlyVec3} v Translation vector
   * @param {ReadonlyVec3} s Scaling vector
   * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
   * @returns {mat4} out
   */

  function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {mat4} out
   */

  function perspectiveNO(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
  }
  /**
   * Alias for {@link mat4.perspectiveNO}
   * @function
   */

  var perspective = perspectiveNO;

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create$3() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Calculates the length of a vec3
   *
   * @param {ReadonlyVec3} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */

  function fromValues(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a vector to normalize
   * @returns {vec3} out
   */

  function normalize$2(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   *
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function cross(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Alias for {@link vec3.length}
   * @function
   */

  var len = length;
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  (function () {
    var vec = create$3();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  })();

  /**
   * 4 Dimensional Vector
   * @module vec4
   */

  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */

  function create$2() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }

    return out;
  }
  /**
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {ReadonlyVec4} a vector to normalize
   * @returns {vec4} out
   */

  function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len = x * x + y * y + z * z + w * w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }

    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  /**
   * Perform some operation over an array of vec4s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  (function () {
    var vec = create$2();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 4;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }

      return a;
    };
  })();

  /**
   * Quaternion
   * @module quat
   */

  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */

  function create$1() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    out[3] = 1;
    return out;
  }
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyVec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @returns {quat} out
   **/

  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a the first operand
   * @param {ReadonlyQuat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    var omega, cosom, sinom, scale0, scale1; // calc cosine

    cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    } // calculate coefficients


    if (1.0 - cosom > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    } // calculate final values


    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyMat3} m rotation matrix
   * @returns {quat} out
   * @function
   */

  function fromMat3(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w

      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)

      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      // |w| <= 1/2
      var i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }

    return out;
  }
  /**
   * Creates a quaternion from the given euler angle x, y, z.
   *
   * @param {quat} out the receiving quaternion
   * @param {x} Angle to rotate around X axis in degrees.
   * @param {y} Angle to rotate around Y axis in degrees.
   * @param {z} Angle to rotate around Z axis in degrees.
   * @returns {quat} out
   * @function
   */

  function fromEuler(out, x, y, z) {
    var halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    var sx = Math.sin(x);
    var cx = Math.cos(x);
    var sy = Math.sin(y);
    var cy = Math.cos(y);
    var sz = Math.sin(z);
    var cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }
  /**
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a quaternion to normalize
   * @returns {quat} out
   * @function
   */

  var normalize = normalize$1;
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {ReadonlyVec3} a the initial vector
   * @param {ReadonlyVec3} b the destination vector
   * @returns {quat} out
   */

  (function () {
    var tmpvec3 = create$3();
    var xUnitVec3 = fromValues(1, 0, 0);
    var yUnitVec3 = fromValues(0, 1, 0);
    return function (out, a, b) {
      var dot$1 = dot(a, b);

      if (dot$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
        normalize$2(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$1;
        return normalize(out, out);
      }
    };
  })();
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a the first operand
   * @param {ReadonlyQuat} b the second operand
   * @param {ReadonlyQuat} c the third operand
   * @param {ReadonlyQuat} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  (function () {
    var temp1 = create$1();
    var temp2 = create$1();
    return function (out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  })();
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {ReadonlyVec3} view  the vector representing the viewing direction
   * @param {ReadonlyVec3} right the vector representing the local "right" direction
   * @param {ReadonlyVec3} up    the vector representing the local "up" direction
   * @returns {quat} out
   */

  (function () {
    var matr = create$5();
    return function (out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize(out, fromMat3(out, matr));
    };
  })();

  /**
   * 2 Dimensional Vector
   * @module vec2
   */

  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */

  function create() {
    var out = new ARRAY_TYPE(2);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }

    return out;
  }
  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  (function () {
    var vec = create();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 2;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }

      return a;
    };
  })();

  var simplexNoise = "vec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+10.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+10.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; \n\n  return p;\n  }\n\t\t\t\t\t\t\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i); \n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }";

  const VERSION = '#version 300 es\n';
  const PRECISION = 'precision highp float;\n';

  class Shader {
  	constructor (gl, vertSource, fragSource) {
  		const vertShader = this._createShader(gl, VERSION + PRECISION + simplexNoise + vertSource, gl.VERTEX_SHADER);
  		const fragShader = this._createShader(gl, VERSION + PRECISION + simplexNoise + fragSource, gl.FRAGMENT_SHADER);

  		const program = gl.createProgram();
  		gl.attachShader(program, vertShader);
  		gl.attachShader(program, fragShader);
  		gl.linkProgram(program);

  		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  			const info = gl.getProgramInfoLog(program);
  			throw new Error('Could not compile WebGL program. \n' + info);
  		}

  		this.program = program;

  		this.attribLocations = {};
  		this.uniformLocations = {};

  		const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  		for (let i = 0; i < numAttribs; i++) {
  			const activeAttrib = gl.getActiveAttrib(program, i);
  			this.attribLocations[activeAttrib.name] = gl.getAttribLocation(program, activeAttrib.name);
  		}

  		const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  		for (let i = 0; i < numUniforms; i++) {
  			const activeUniform = gl.getActiveUniform(program, i);
  			this.uniformLocations[activeUniform.name] = gl.getUniformLocation(program, activeUniform.name);
  		}
  	}

  	_createShader (gl, source, type) {
  		const shader = gl.createShader(type);
  		gl.shaderSource(shader, source);
  		gl.compileShader(shader);

  		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  			const info = gl.getShaderInfoLog(shader);
  			throw new Error('Could not compile WebGL program. \n' + info);
  		}

  		return shader;
  	}
  }

  var outlineVertSource = "in vec2 a_position;\n\nout vec2 v_position;\n\nvoid main() {\n    gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);\n    v_position = a_position;\n}";

  var outlineFragSource = "uniform sampler2D u_texture;\nuniform highp usampler2D u_matIndex;\nuniform sampler2D u_normal;\n\nin vec2 v_position;\n\nout vec4 fragColor;\n\nconst int RADIUS = 4;\nconst int RADIUS_OFFSET = -RADIUS / 2;\n\nbool mat_diff(ivec2 coord) {\n    uint tl = texelFetch(u_matIndex, coord, 0).r;\n    uint tr = texelFetch(u_matIndex, coord + ivec2(1, 0), 0).r;\n    uint bl = texelFetch(u_matIndex, coord + ivec2(0, 1), 0).r;\n    uint br = texelFetch(u_matIndex, coord + ivec2(1, 1), 0).r;\n\n    return (tl != br) || (bl != tr);\n}\n\nbool z_diff(ivec2 coord) {\n    float tl = texelFetch(u_normal, coord, 0).r;\n    float tr = texelFetch(u_normal, coord + ivec2(1, 0), 0).r;\n    float bl = texelFetch(u_normal, coord + ivec2(0, 1), 0).r;\n    float br = texelFetch(u_normal, coord + ivec2(1, 1), 0).r;\n\n    return abs(tl - br) + abs(bl - tr) > 0.05;\n}\n\nbool norm_diff(ivec2 coord) {\n    vec3 tl = texelFetch(u_normal, coord, 0).xyz;\n    vec3 tr = texelFetch(u_normal, coord + ivec2(1, 0), 0).xyz;\n    vec3 bl = texelFetch(u_normal, coord + ivec2(0, 1), 0).xyz;\n    vec3 br = texelFetch(u_normal, coord + ivec2(1, 1), 0).xyz;\n\n    return max(\n        acos(dot(tl, br) / (length(tl) * length(br))),\n        acos(dot(tr, bl) / (length(tr) * length(bl)))\n    ) > 0.35;\n}\n\nvoid main() {\n    ivec2 tex_size = textureSize(u_texture, 0);\n    ivec2 coord = ivec2(v_position * vec2(tex_size));\n    fragColor = texelFetch(u_texture, coord, 0);\n    bool anyEdge;\n    for (int i = 0; i < RADIUS; i++) {\n        for (int j = 0; j < RADIUS; j++) {\n            anyEdge = anyEdge ||\n                mat_diff(coord + ivec2(i + RADIUS_OFFSET, j + RADIUS_OFFSET)) ||\n                norm_diff(coord + ivec2(i + RADIUS_OFFSET, j + RADIUS_OFFSET));\n        }\n    }\n    if (anyEdge) {\n        fragColor = vec4(0.0, 0.0, 0.0, 1.0);\n    }\n    //fragColor = vec4(texelFetch(u_normal, coord, 0).xyz, 1.0);\n    // fragColor = vec4(vec3(norm_diff(coord)), 1.0);\n\n    // fragColor = vec4(vec3(texelFetch(u_normal, coord, 0).r * 0.1), 1.0);\n}";

  const __viewMatrix = create$4();

  const createFramebuffer = (gl, attachmentDescs, renderbufferFormat) => {
  	const framebuffer = gl.createFramebuffer();
  	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  	const attachments = [];
  	for (const {attachment, format, internalFormat, type} of attachmentDescs) {
  		const fbTexture = gl.createTexture();
  		gl.bindTexture(gl.TEXTURE_2D, fbTexture);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  		gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, fbTexture, 0);
  		attachments.push({
  			attachment,
  			texture: fbTexture,
  			format,
  			internalFormat,
  			type
  		});
  	}
  	const renderbuffer = gl.createRenderbuffer();
  	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  	let attachment;
  	switch (renderbufferFormat) {
  		case gl.DEPTH_COMPONENT16:
  		case gl.DEPTH_COMPONENT24:
  		case gl.DEPTH_COMPONENT32F:
  			attachment = gl.DEPTH_ATTACHMENT;
  			break;
  		case gl.STENCIL_INDEX8:
  			attachment = gl.STENCIL_ATTACHMENT;
  			break;
  		case gl.DEPTH_STENCIL:
  		case gl.DEPTH24_STENCIL8:
  		case gl.DEPTH32F_STENCIL8:
  			attachment = gl.DEPTH_STENCIL_ATTACHMENT;
  			break;
  	}
  	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderbuffer);

  	return {
  		framebuffer,
  		attachments,
  		renderbuffer: {
  			renderbuffer,
  			format: renderbufferFormat
  		}
  	};
  };

  class Renderer {
  	constructor (canvas, width, height) {
  		this.canvas = canvas;

  		const gl = canvas.getContext('webgl2', {antialias: false, stencil: true, depth: true});
  		this.gl = gl;
  		this._camera = null;
  		this._viewProjectionMatrix = create$4();
  		this._time = 0;
  		gl.enable(gl.DEPTH_TEST);

  		this._interBuffer = createFramebuffer(gl, [
  			{
  				attachment: gl.COLOR_ATTACHMENT0,
  				format: gl.RGBA,
  				internalFormat: gl.RGBA,
  				type: gl.UNSIGNED_BYTE
  			},
  			{
  				attachment: gl.COLOR_ATTACHMENT1,
  				format: gl.RED_INTEGER,
  				internalFormat: gl.R32UI,
  				type: gl.UNSIGNED_INT
  			},
  			{
  				attachment: gl.COLOR_ATTACHMENT2,
  				format: gl.RGBA,
  				internalFormat: gl.RGBA,
  				type: gl.UNSIGNED_BYTE
  			}
  		], gl.DEPTH_STENCIL);
  		this._outlineShader = new Shader(gl, outlineVertSource, outlineFragSource);
  		const rectBuffer = gl.createBuffer();
  		gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
  		gl.bufferData(
  			gl.ARRAY_BUFFER,
  			new Float32Array([
  				0, 0,
  				0, 1,
  				1, 0,

  				1, 1,
  				0, 1,
  				1, 0
  			]),
  			gl.STATIC_DRAW
  		);
  		this._rectBuffer = rectBuffer;

  		this.resize(width, height);
  	}

  	resize (width, height) {
  		const {gl} = this;
  		// TODO set camera projection matrices dirty
  		this.canvas.width = width;
  		this.canvas.height = height;
  		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  		for (const {framebuffer, attachments, renderbuffer} of [this._interBuffer]) {
  			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  			for (const {texture, format, internalFormat, type} of attachments) {
  				gl.bindTexture(gl.TEXTURE_2D, texture);
  				gl.texImage2D(
  					gl.TEXTURE_2D,
  					0,
  					internalFormat,
  					gl.drawingBufferWidth,
  					gl.drawingBufferHeight,
  					0,
  					format,
  					type,
  					null
  				);
  			}
  			gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer.renderbuffer);
  			gl.renderbufferStorage(
  				gl.RENDERBUFFER,
  				renderbuffer.format,
  				gl.drawingBufferWidth,
  				gl.drawingBufferHeight
  			);
  		}
  	}

  	setCamera (camera) {
  		this._camera = camera;
  	}

  	render (rootItem) {
  		this._time = (Date.now() - 1652477321435) / 1000;
  		invert(__viewMatrix, this._camera.transformMatrix);
  		multiply(this._viewProjectionMatrix, this._camera.projectionMatrix, __viewMatrix);

  		const {gl} = this;
  		gl.bindFramebuffer(gl.FRAMEBUFFER, this._interBuffer.framebuffer);
  		gl.clearColor(0, 0, 0, 0);
  		gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
  		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  		gl.drawBuffers([
  			gl.COLOR_ATTACHMENT0,
  			gl.COLOR_ATTACHMENT1,
  			gl.COLOR_ATTACHMENT2
  		]);
  		gl.clearBufferuiv(gl.COLOR, 1, [0, 0, 0, 0]);
  		gl.clearBufferfv(gl.COLOR, 2, [0, 0, 0, 0]);
  		gl.activeTexture(gl.TEXTURE0);
  		gl.bindTexture(gl.TEXTURE_2D, null);

  		rootItem.draw();

  		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  		gl.useProgram(this._outlineShader.program);
  		gl.bindBuffer(gl.ARRAY_BUFFER, this._rectBuffer);
  		gl.vertexAttribPointer(
  			this._outlineShader.attribLocations.a_position,
  			2, //vec2
  			gl.FLOAT,
  			false,
  			0,
  			0
  		);

  		gl.activeTexture(gl.TEXTURE0);
  		gl.uniform1i(this._outlineShader.uniformLocations.u_texture, 0);
  		gl.bindTexture(gl.TEXTURE_2D, this._interBuffer.attachments[0].texture);

  		gl.activeTexture(gl.TEXTURE1);
  		gl.uniform1i(this._outlineShader.uniformLocations.u_matIndex, 1);
  		gl.bindTexture(gl.TEXTURE_2D, this._interBuffer.attachments[1].texture);

  		gl.activeTexture(gl.TEXTURE2);
  		gl.uniform1i(this._outlineShader.uniformLocations.u_normal, 2);
  		gl.bindTexture(gl.TEXTURE_2D, this._interBuffer.attachments[2].texture);

  		gl.drawArrays(gl.TRIANGLES, 0, 6);
  	}

  	rebindUniforms (item, shader) {
  		const {gl} = this;
  		gl.uniformMatrix4fv(shader.uniformLocations.u_projMatrix, false, this._viewProjectionMatrix);
  		gl.uniformMatrix4fv(shader.uniformLocations.u_objMatrix, false, item.transformMatrix);
  		gl.uniformMatrix3fv(shader.uniformLocations.u_normalMatrix, false, item.normalMatrix);
  		gl.uniform1i(shader.uniformLocations.u_flip, item._flipNormals);
  		gl.uniform1f(shader.uniformLocations.u_fcoef, 2 / (Math.log2(this._camera.zFar + 1.0)));
  		gl.uniform1f(shader.uniformLocations.u_time, this._time);
  	}
  }

  const vecGetterSetter = (obj, prop, numAxes) => {
  	const dimensions = ['x', 'y', 'z', 'w'];
  	const gs = {};


  	for (let i = 0; i < numAxes; i++) {
  		const dim = dimensions[i];

  		Object.defineProperty(gs, dim, {
  			configurable: true,
  			enumerable: true,
  			get () {
  				return obj[prop][i];
  			},
  			set (newValue) {
  				obj[prop][i] = newValue;
  				obj._setTransformDirty();
  			}
  		});
  	}

  	Object.defineProperty(gs, dimensions.slice(0, numAxes).join(''), {
  		configurable: true,
  		enumerable: true,
  		get () {
  			return obj[prop];
  		},
  		set (newValue) {
  			obj[prop] = new Float32Array(newValue);
  			obj._setTransformDirty();
  		}
  	});

  	return gs;
  };

  const __quat = create$1();

  class Item3D {
  	constructor (renderer) {
  		this._renderer = renderer;
  		this.gl = renderer.gl;

  		this._transformMatrix = create$4();
  		this._normalMatrix = create$5();
  		this._flipNormals = false;
  		this._center = create$3();
  		this._position = create$3();
  		this._useQuaternions = false;
  		this._rotationEuler = create$3();
  		this._rotationQuat = create$1();
  		this._scale = fromValues(1, 1, 1);

  		this.center = vecGetterSetter(this, '_center', 3);
  		this.position = vecGetterSetter(this, '_position', 3);
  		this.useQuaternions = false;
  		this.scale = vecGetterSetter(this, '_scale', 3);

  		this._transformDirty = true;

  		this._parent = null;
  		this._children = [];
  	}

  	get useQuaternions () {
  		return this._useQuaternions;
  	}

  	set useQuaternions (useQuaternions) {
  		if (useQuaternions) {
  			this.rotation = vecGetterSetter(this, '_rotationQuat', 4);
  		} else {
  			this.rotation = vecGetterSetter(this, '_rotationEuler', 3);
  		}
  		this._useQuaternions = useQuaternions;
  	}

  	get transformMatrix () {
  		if (this._transformDirty) {
  			this._calculateTransform();
  		}

  		return this._transformMatrix;
  	}

  	get normalMatrix () {
  		if (this._transformDirty) {
  			this._calculateTransform();
  		}

  		return this._normalMatrix;
  	}

  	_setTransformDirty () {
  		this._transformDirty = true;
  		for (const child of this._children) {
  			child._setTransformDirty();
  		}
  	}

  	_calculateTransform () {
  		fromRotationTranslationScaleOrigin(
  			this._transformMatrix,
  			this._useQuaternions ?
  				this._rotationQuat :
  				fromEuler(__quat, this._rotationEuler[0], this._rotationEuler[1], this._rotationEuler[2]),
  			this._position,
  			this._scale,
  			this._center
  		);

  		if (this._parent !== null) {
  			multiply(this._transformMatrix, this._parent.transformMatrix, this._transformMatrix);
  		}

  		fromMat4(this._normalMatrix, this._transformMatrix);
  		invert$1(this._normalMatrix, this._normalMatrix);
  		transpose(this._normalMatrix, this._normalMatrix);
  		// Correct for negative scale flipping normals
  		const det = determinant(this._normalMatrix);
  		this._flipNormals = det < 0;

  		this._transformDirty = false;
  	}

  	appendChild (child) {
  		this._children.push(child);

  		child._parent = this;
  		child._setTransformDirty();
  	}

  	removeChild (child) {
  		if (typeof child === 'number') {
  			if (child >= this._children.length) return;
  			this._children.splice(child, 1);
  			child = this._children[child];
  		} else {
  			const childIndex = this._children.indexOf(child);
  			if (childIndex === -1) return;
  			this._children.splice(child, 1);
  		}

  		child._parent = null;
  		child._setTransformDirty();
  	}

  	draw () {
  		for (const child of this._children) {
  			child.draw();
  		}
  	}
  }

  class Material {
  	constructor (shader, color, texture = null) {
  		this.shader = shader;
  		this.color = color;
  		this.texture = texture;
  	}
  }

  class MeshPrimitive {
  	constructor (renderer, attributes, indexBuffer, material) {
  		this.renderer = renderer;
  		this.attributes = attributes;
  		this.indexBuffer = indexBuffer;
  		this.material = material;
  		this.gl = renderer.gl;
  	}

  	drawAsItem (item) {
  		const gl = this.gl;

  		const shader = this.material.shader;
  		gl.useProgram(shader.program);
  		this.renderer.rebindUniforms(item, shader);
  		gl.uniform4fv(shader.uniformLocations.u_color, this.material.color);

  		if (this.material.texture) {
  			gl.uniform1i(shader.uniformLocations.u_texture, 0);
  			gl.activeTexture(gl.TEXTURE0);
  			gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
  		}

  		gl.uniform1i(shader.uniformLocations.u_useTexture, this.material.texture ? 1 : 0);

  		for (const attribute of this.attributes) {
  			const {buffer, location, numComponents, componentType, byteStride, byteOffset} = attribute;
  			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  			gl.enableVertexAttribArray(location);
  			gl.vertexAttribPointer(
  				location,
  				numComponents,
  				componentType,
  				false,
  				byteStride,
  				byteOffset
  			);
  		}

  		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.buffer);
  		gl.drawElements(
  			gl.TRIANGLES,
  			this.indexBuffer.count,
  			this.indexBuffer.componentType,
  			0
  		);
  	}
  }

  class Mesh extends Item3D {
  	constructor (renderer, primitives) {
  		super(renderer);

  		this._primitives = primitives;
  	}

  	draw () {
  		for (const primitive of this._primitives) {
  			primitive.drawAsItem(this);
  		}
  		super.draw();
  	}
  }

  class Camera extends Item3D {
  	constructor (renderer, fov, zNear = 0.01, zFar = 100) {
  		super(renderer);

  		this._fov = fov;
  		this._zNear = zNear;
  		this._zFar = zFar;
  		this._projectionMatrix = create$4();
  		this._projectionMatrixDirty = true;
  	}

  	get fov () {
  		return this._fov;
  	}

  	set fov (fov) {
  		this._fov = fov;
  		this._projectionMatrixDirty = true;
  	}

  	_setTransformDirty () {
  		super._setTransformDirty();
  		this._projectionMatrixDirty = true;
  	}

  	get projectionMatrix () {
  		if (this._projectionMatrixDirty) {
  			perspective(
  				this._projectionMatrix,
  				this._fov,
  				this.gl.drawingBufferWidth / this.gl.drawingBufferHeight,
  				this._zNear,
  				this._zFar
  			);
  			this._projectionMatrixDirty = false;
  		}

  		return this._projectionMatrix;
  	}
  }

  const uriToArrayBuffer = uri => {
  	const URI_REGEX = /^data:[a-z+-]+\/[a-z+-]+;base64,/;
  	const match = URI_REGEX.exec(uri);
  	if (!match) throw new Error('Unsupported URI');

  	const binaryString = window.atob(uri.slice(match[0].length));
  	const bytes = new Uint8Array(binaryString.length);
  	for (let i = 0; i < binaryString.length; i++) {
  		bytes[i] = binaryString.charCodeAt(i);
  	}
  	return bytes.buffer;
  };

  const componentsPerType = {
  	SCALAR: 1,
  	VEC2: 2,
  	VEC3: 3,
  	VEC4: 4,
  	MAT2: 4,
  	MAT3: 9,
  	MAT4: 16
  };

  class GLTFImporter {
  	constructor (renderer, file, shader) {
  		this.renderer = renderer;
  		this.gl = renderer.gl;
  		this.data = JSON.parse(file);

  		this._arrayBuffers = new Map();
  		this._buffers = new Map();
  		this._elementBuffers = new Map();
  		this._meshData = new Map();
  		this._materials = new Map();
  		this._images = new Map();
  		this._textures = new Map();
  		this._matShader = shader;
  	}

  	getArrayBuffer (index) {
  		if (!this._arrayBuffers.has(index)) {
  			const arrayBuffer = uriToArrayBuffer(this.data.buffers[index].uri);
  			this._arrayBuffers.set(index, arrayBuffer);
  		}
  		return this._arrayBuffers.get(index);
  	}

  	getBuffer (index) {
  		const buffers = this._buffers;
  		const gl = this.gl;
  		if (!buffers.has(index)) {
  			const arrayBuffer = this.getArrayBuffer(index);
  			const glBuffer = gl.createBuffer();
  			gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
  			gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);
  			buffers.set(index, {arrayBuffer, glBuffer});
  		}

  		return buffers.get(index);
  	}

  	getElementBuffer (bufferViewIndex) {
  		const elementBuffers = this._elementBuffers;
  		const gl = this.gl;
  		if (!elementBuffers.has(bufferViewIndex)) {
  			const bufferView = this.data.bufferViews[bufferViewIndex];
  			const {arrayBuffer} = this.getBuffer(bufferView.buffer);
  			const subData = new Uint8Array(arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
  			const glBuffer = gl.createBuffer();
  			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffer);
  			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, subData, gl.STATIC_DRAW);
  			elementBuffers.set(bufferViewIndex, glBuffer);
  		}

  		return elementBuffers.get(bufferViewIndex);
  	}

  	importScene (index) {
  		const scene = this.data.scenes[index];
  		const items = [];
  		for (let i = 0; i < scene.nodes.length; i++) {
  			items.push(this.importNode(scene.nodes[i]));
  		}

  		return items;
  	}

  	importNode (index) {
  		let item;
  		const gltfNode = this.data.nodes[index];
  		if ('mesh' in gltfNode) {
  			const primitives = this.importMeshData(gltfNode.mesh);
  			item = new Mesh(this.renderer, primitives);
  		} else if ('camera' in gltfNode) {
  			const cameraData = this.data.cameras[gltfNode.camera];
  			if (cameraData.type !== 'perspective') {
  				throw new Error('Non-perspective cameras not supported');
  			}
  			const {yfov, znear, zfar} = cameraData.perspective;
  			item = new Camera(this.renderer, yfov, znear, zfar);
  		} else {
  			item = new Item3D(this.renderer);
  		}

  		if ('children' in gltfNode) {
  			for (const child of gltfNode.children) {
  				item.appendChild(this.importNode(child));
  			}
  		}

  		item.name = gltfNode.name;

  		if (gltfNode.translation) item.position.xyz = gltfNode.translation;
  		if (gltfNode.scale) item.scale.xyz = gltfNode.scale;
  		if (gltfNode.rotation) {
  			item.useQuaternions = true;
  			item.rotation.xyzw = gltfNode.rotation;
  		}

  		return item;
  	}

  	importMeshData (index) {
  		if (this._meshData.has(index)) return this._meshData.get(index);

  		const mesh = this.data.meshes[index];
  		const primitives = [];
  		for (const primitive of mesh.primitives) {
  			const material = this.importMaterial(primitive.material);

  			if (typeof primitive.indices !== 'number') {
  				throw new Error('Non-indexed primitives not implemented');
  			}

  			const attributes = [];

  			for (const attributeName of Object.keys(primitive.attributes)) {
  				const accessor = this.data.accessors[primitive.attributes[attributeName]];

  				if (accessor.sparse) {
  					throw new Error('Sparse accessors not implemented');
  				}

  				const bufferView = this.data.bufferViews[accessor.bufferView];
  				const {glBuffer} = this.getBuffer(bufferView.buffer);

  				const attribLocation = this._matShader.attribLocations[attributeName];
  				if (typeof attribLocation !== 'number') {
  					// eslint-disable-next-line no-console
  					console.warn(`Shader for '${material}' missing attribute '${attributeName}'`);
  					continue;
  				}

  				attributes.push({
  					buffer: glBuffer,
  					name: attributeName,
  					location: attribLocation,
  					numComponents: componentsPerType[accessor.type],
  					componentType: accessor.componentType,
  					byteStride: bufferView.byteStride || 0,
  					byteOffset: bufferView.byteOffset
  				});
  			}

  			const elementAccessor = this.data.accessors[primitive.indices];
  			const elementBuffer = {
  				buffer: this.getElementBuffer(elementAccessor.bufferView),
  				count: elementAccessor.count,
  				componentType: elementAccessor.componentType
  			};

  			primitives.push(new MeshPrimitive(this.renderer, attributes, elementBuffer, material));
  		}

  		this._meshData.set(index, primitives);

  		return primitives;
  	}

  	importMaterial (index) {
  		if (this._materials.has(index)) return this._materials.get(index);

  		const materialData = this.data.materials[index];
  		let texture = null;
  		if (materialData.pbrMetallicRoughness?.baseColorTexture) {
  			texture = this.importTexture(materialData.pbrMetallicRoughness?.baseColorTexture.index);
  		}
  		const matColor = materialData.pbrMetallicRoughness?.baseColorFactor ?? [0.5, 0.5, 0.5, 1];
  		const material = new Material(this._matShader, matColor, texture);
  		this._materials.set(index, material);

  		return material;
  	}

  	importTexture (index) {
  		if (this._textures.has(index)) return this._textures.get(index);
  		const {gl} = this;
  		const textureData = this.data.textures[index];

  		const imagePromise = this.importImage(textureData.source);
  		const texture = gl.createTexture();

  		imagePromise.then(image => {
  			gl.bindTexture(gl.TEXTURE_2D, texture);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  			gl.texImage2D(
  				gl.TEXTURE_2D,
  				0,
  				gl.RGBA,
  				image.naturalWidth,
  				image.naturalHeight,
  				0,
  				gl.RGBA,
  				gl.UNSIGNED_BYTE,
  				image
  			);
  		});

  		this._textures.set(index, texture);
  		return texture;
  	}

  	importImage (index) {
  		if (this._images.has(index)) return this._images.get(index);
  		const image = this.data.images[index];
  		const bufferView = this.data.bufferViews[image.bufferView];
  		const buffer = this.getArrayBuffer(bufferView.buffer);

  		const arr = new Uint8Array(buffer, bufferView.byteOffset, bufferView.byteLength);
  		const blob = new Blob([arr], {type: image.mimeType});
  		const url = URL.createObjectURL(blob);
  		const img = document.createElement('img');
  		img.src = url;

  		const imagePromise = new Promise((resolve, reject) => {
  			img.onload = () => {
  				resolve(img);
  			};

  			img.onerror = err => {
  				reject(err);
  			};
  		});
  		this._images.set(index, imagePromise);
  		return imagePromise;
  	}
  }

  var fumoData = "{\n    \"asset\" : {\n        \"generator\" : \"Khronos glTF Blender I/O v1.8.19\",\n        \"version\" : \"2.0\"\n    },\n    \"extensionsUsed\" : [\n        \"KHR_materials_unlit\"\n    ],\n    \"scene\" : 0,\n    \"scenes\" : [\n        {\n            \"name\" : \"Scene\",\n            \"nodes\" : [\n                1,\n                2,\n                3,\n                4,\n                16\n            ]\n        }\n    ],\n    \"nodes\" : [\n        {\n            \"camera\" : 0,\n            \"name\" : \"Camera_Orientation\",\n            \"rotation\" : [\n                -0.7071067690849304,\n                0,\n                0,\n                0.7071067690849304\n            ]\n        },\n        {\n            \"children\" : [\n                0\n            ],\n            \"name\" : \"Camera\",\n            \"rotation\" : [\n                0.35692501068115234,\n                0.6353515982627869,\n                -0.5422513484954834,\n                0.41820618510246277\n            ],\n            \"translation\" : [\n                3.308891773223877,\n                1.0883090496063232,\n                -1.324209451675415\n            ]\n        },\n        {\n            \"mesh\" : 0,\n            \"name\" : \"Cube.010\",\n            \"rotation\" : [\n                0,\n                -0.2538171708583832,\n                0,\n                0.9672523140907288\n            ],\n            \"scale\" : [\n                0.10000002384185791,\n                0.10000002384185791,\n                0.10000002384185791\n            ],\n            \"translation\" : [\n                1.053764820098877,\n                0,\n                -0.6733447313308716\n            ]\n        },\n        {\n            \"mesh\" : 1,\n            \"name\" : \"Circle\",\n            \"rotation\" : [\n                0,\n                -0.8634263873100281,\n                0,\n                0.5044748187065125\n            ],\n            \"scale\" : [\n                0.10000002384185791,\n                0.10000002384185791,\n                0.10000002384185791\n            ],\n            \"translation\" : [\n                0.7924187183380127,\n                0,\n                -0.8206478357315063\n            ]\n        },\n        {\n            \"mesh\" : 2,\n            \"name\" : \"Circle.001\",\n            \"rotation\" : [\n                0,\n                -0.8634263873100281,\n                0,\n                0.5044748187065125\n            ],\n            \"scale\" : [\n                0.10000002384185791,\n                0.10000002384185791,\n                0.10000002384185791\n            ],\n            \"translation\" : [\n                0.5310726761817932,\n                0,\n                -0.9679509401321411\n            ]\n        },\n        {\n            \"mesh\" : 3,\n            \"name\" : \"Cube\",\n            \"rotation\" : [\n                0,\n                -0.07420509308576584,\n                0,\n                0.9972429871559143\n            ],\n            \"scale\" : [\n                0.31527960300445557,\n                0.10931006073951721,\n                0.10931006819009781\n            ],\n            \"translation\" : [\n                0.0535271018743515,\n                0.07400833070278168,\n                0.13706962764263153\n            ]\n        },\n        {\n            \"mesh\" : 4,\n            \"name\" : \"Cube.001\",\n            \"scale\" : [\n                0.11664372682571411,\n                0.2121562361717224,\n                0.17526009678840637\n            ],\n            \"translation\" : [\n                0,\n                0.3026660084724426,\n                0\n            ]\n        },\n        {\n            \"mesh\" : 5,\n            \"name\" : \"Cube.002\",\n            \"scale\" : [\n                0.32342329621315,\n                0.41528579592704773,\n                0.4406734108924866\n            ],\n            \"translation\" : [\n                0.004203103482723236,\n                0.8742529153823853,\n                -0.0008044758578762412\n            ]\n        },\n        {\n            \"mesh\" : 6,\n            \"name\" : \"Cube.003\",\n            \"rotation\" : [\n                0.2778019309043884,\n                -0.3956087529659271,\n                -0.11690653860569,\n                0.867555558681488\n            ],\n            \"scale\" : [\n                0.25009825825691223,\n                0.0748726949095726,\n                0.07354200631380081\n            ],\n            \"translation\" : [\n                -0.013870742172002792,\n                0.4894416928291321,\n                0.12607349455356598\n            ]\n        },\n        {\n            \"mesh\" : 7,\n            \"name\" : \"Cube.004\",\n            \"rotation\" : [\n                0,\n                0.07420508563518524,\n                0,\n                0.9972429871559143\n            ],\n            \"scale\" : [\n                0.31527960300445557,\n                0.10931006073951721,\n                0.10931006819009781\n            ],\n            \"translation\" : [\n                0.05352700129151344,\n                0.07400833070278168,\n                -0.13707000017166138\n            ]\n        },\n        {\n            \"mesh\" : 8,\n            \"name\" : \"Cube.005\",\n            \"rotation\" : [\n                0.12203418463468552,\n                0.30696043372154236,\n                -0.27558794617652893,\n                0.9027370810508728\n            ],\n            \"scale\" : [\n                0.25009825825691223,\n                0.0748726949095726,\n                0.07354200631380081\n            ],\n            \"translation\" : [\n                -0.013870742172002792,\n                0.4894416928291321,\n                -0.12607300281524658\n            ]\n        },\n        {\n            \"mesh\" : 9,\n            \"name\" : \"Cube.006\",\n            \"scale\" : [\n                0.32342329621315,\n                0.41528579592704773,\n                0.4406734108924866\n            ],\n            \"translation\" : [\n                0.0032655627001076937,\n                0.8701826333999634,\n                -0.021138986572623253\n            ]\n        },\n        {\n            \"mesh\" : 10,\n            \"name\" : \"Cube.007\",\n            \"scale\" : [\n                0.32342329621315,\n                0.41528579592704773,\n                0.4406734108924866\n            ],\n            \"translation\" : [\n                0.004203103482723236,\n                0.8742529153823853,\n                -0.0008044758578762412\n            ]\n        },\n        {\n            \"mesh\" : 11,\n            \"name\" : \"Cube.008\",\n            \"rotation\" : [\n                0.3395254909992218,\n                0.08279556035995483,\n                -0.13021771609783173,\n                0.9278527498245239\n            ],\n            \"scale\" : [\n                0.12437600642442703,\n                0.12437602132558823,\n                0.12437602132558823\n            ],\n            \"translation\" : [\n                0.03611840680241585,\n                1.0794756412506104,\n                0.20847634971141815\n            ]\n        },\n        {\n            \"mesh\" : 12,\n            \"name\" : \"Cube.009\",\n            \"rotation\" : [\n                -0.3487606346607208,\n                -0.02232879213988781,\n                -0.15268655121326447,\n                0.9244210720062256\n            ],\n            \"scale\" : [\n                0.12437600642442703,\n                0.12437602132558823,\n                0.12437602132558823\n            ],\n            \"translation\" : [\n                0.036118000745773315,\n                1.0794756412506104,\n                -0.2084760069847107\n            ]\n        },\n        {\n            \"mesh\" : 13,\n            \"name\" : \"Plane\"\n        },\n        {\n            \"children\" : [\n                5,\n                6,\n                7,\n                8,\n                9,\n                10,\n                11,\n                12,\n                13,\n                14,\n                15\n            ],\n            \"name\" : \"Empty\"\n        }\n    ],\n    \"cameras\" : [\n        {\n            \"name\" : \"Camera\",\n            \"perspective\" : {\n                \"aspectRatio\" : 1,\n                \"yfov\" : 0.6911112070083618,\n                \"zfar\" : 100,\n                \"znear\" : 0.10000000149011612\n            },\n            \"type\" : \"perspective\"\n        }\n    ],\n    \"materials\" : [\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"carton 1\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.6920710802078247,\n                    0.6920710802078247,\n                    0.6920710802078247,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"carton 2\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.12326046824455261,\n                    0.35473793745040894,\n                    0.6920710802078247,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"cup\",\n            \"pbrMetallicRoughness\" : {\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"pilk\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.38005632162094116,\n                    0.28709152340888977,\n                    0.1964336484670639,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"pepsi\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.08353514224290848,\n                    0.014232759363949299,\n                    0.009076564572751522,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"label\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.012790906243026257,\n                    0.033352069556713104,\n                    0.4919051229953766,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"skin\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    1,\n                    0.7304603457450867,\n                    0.6375970840454102,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"socks\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.015325205400586128,\n                    0.015325205400586128,\n                    0.015325205400586128,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"face\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorTexture\" : {\n                    \"index\" : 0\n                },\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"hair\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.0543556846678257,\n                    0.013397195376455784,\n                    0.15486764907836914,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"kity earms\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    0.5,\n                    0.19804523885250092,\n                    0.4652729034423828,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        },\n        {\n            \"doubleSided\" : true,\n            \"extensions\" : {\n                \"KHR_materials_unlit\" : {}\n            },\n            \"name\" : \"dress\",\n            \"pbrMetallicRoughness\" : {\n                \"baseColorFactor\" : [\n                    1,\n                    0,\n                    0.593324601650238,\n                    1\n                ],\n                \"metallicFactor\" : 0,\n                \"roughnessFactor\" : 0.9\n            }\n        }\n    ],\n    \"meshes\" : [\n        {\n            \"name\" : \"Cube.010\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 0,\n                        \"NORMAL\" : 1,\n                        \"TEXCOORD_0\" : 2\n                    },\n                    \"indices\" : 3,\n                    \"material\" : 0\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 4,\n                        \"NORMAL\" : 5,\n                        \"TEXCOORD_0\" : 6\n                    },\n                    \"indices\" : 7,\n                    \"material\" : 1\n                }\n            ]\n        },\n        {\n            \"name\" : \"Circle\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 8,\n                        \"NORMAL\" : 9,\n                        \"TEXCOORD_0\" : 10\n                    },\n                    \"indices\" : 11,\n                    \"material\" : 2\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 12,\n                        \"NORMAL\" : 13,\n                        \"TEXCOORD_0\" : 14\n                    },\n                    \"indices\" : 15,\n                    \"material\" : 3\n                }\n            ]\n        },\n        {\n            \"name\" : \"Circle.001\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 16,\n                        \"NORMAL\" : 17,\n                        \"TEXCOORD_0\" : 18\n                    },\n                    \"indices\" : 19,\n                    \"material\" : 4\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 20,\n                        \"NORMAL\" : 21,\n                        \"TEXCOORD_0\" : 22\n                    },\n                    \"indices\" : 23,\n                    \"material\" : 5\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 24,\n                        \"NORMAL\" : 25,\n                        \"TEXCOORD_0\" : 26\n                    },\n                    \"indices\" : 27,\n                    \"material\" : 2\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.005\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 28,\n                        \"NORMAL\" : 29,\n                        \"TEXCOORD_0\" : 30\n                    },\n                    \"indices\" : 31,\n                    \"material\" : 6\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 32,\n                        \"NORMAL\" : 33,\n                        \"TEXCOORD_0\" : 34\n                    },\n                    \"indices\" : 35,\n                    \"material\" : 7\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.002\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 36,\n                        \"NORMAL\" : 37,\n                        \"TEXCOORD_0\" : 38\n                    },\n                    \"indices\" : 39,\n                    \"material\" : 6\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.003\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 40,\n                        \"NORMAL\" : 41,\n                        \"TEXCOORD_0\" : 42\n                    },\n                    \"indices\" : 43,\n                    \"material\" : 8\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.006\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 44,\n                        \"NORMAL\" : 45,\n                        \"TEXCOORD_0\" : 46\n                    },\n                    \"indices\" : 47,\n                    \"material\" : 6\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.005\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 48,\n                        \"NORMAL\" : 49,\n                        \"TEXCOORD_0\" : 50\n                    },\n                    \"indices\" : 31,\n                    \"material\" : 6\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 51,\n                        \"NORMAL\" : 52,\n                        \"TEXCOORD_0\" : 53\n                    },\n                    \"indices\" : 35,\n                    \"material\" : 7\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.006\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 54,\n                        \"NORMAL\" : 55,\n                        \"TEXCOORD_0\" : 56\n                    },\n                    \"indices\" : 47,\n                    \"material\" : 6\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.007\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 57,\n                        \"NORMAL\" : 58,\n                        \"TEXCOORD_0\" : 59\n                    },\n                    \"indices\" : 60,\n                    \"material\" : 9\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.008\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 61,\n                        \"NORMAL\" : 62,\n                        \"TEXCOORD_0\" : 63\n                    },\n                    \"indices\" : 64,\n                    \"material\" : 9\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.009\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 65,\n                        \"NORMAL\" : 66,\n                        \"TEXCOORD_0\" : 67\n                    },\n                    \"indices\" : 68,\n                    \"material\" : 9\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 69,\n                        \"NORMAL\" : 70,\n                        \"TEXCOORD_0\" : 71\n                    },\n                    \"indices\" : 72,\n                    \"material\" : 10\n                }\n            ]\n        },\n        {\n            \"name\" : \"Cube.009\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 73,\n                        \"NORMAL\" : 74,\n                        \"TEXCOORD_0\" : 75\n                    },\n                    \"indices\" : 68,\n                    \"material\" : 9\n                },\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 76,\n                        \"NORMAL\" : 77,\n                        \"TEXCOORD_0\" : 78\n                    },\n                    \"indices\" : 72,\n                    \"material\" : 10\n                }\n            ]\n        },\n        {\n            \"name\" : \"Plane\",\n            \"primitives\" : [\n                {\n                    \"attributes\" : {\n                        \"POSITION\" : 79,\n                        \"NORMAL\" : 80,\n                        \"TEXCOORD_0\" : 81\n                    },\n                    \"indices\" : 82,\n                    \"material\" : 11\n                }\n            ]\n        }\n    ],\n    \"textures\" : [\n        {\n            \"sampler\" : 0,\n            \"source\" : 0\n        }\n    ],\n    \"images\" : [\n        {\n            \"bufferView\" : 44,\n            \"mimeType\" : \"image/png\",\n            \"name\" : \"fumoface\"\n        }\n    ],\n    \"accessors\" : [\n        {\n            \"bufferView\" : 0,\n            \"componentType\" : 5126,\n            \"count\" : 47,\n            \"max\" : [\n                1,\n                3.25,\n                1\n            ],\n            \"min\" : [\n                -1,\n                0.6005982756614685,\n                -1\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 1,\n            \"componentType\" : 5126,\n            \"count\" : 47,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 2,\n            \"componentType\" : 5126,\n            \"count\" : 47,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 3,\n            \"componentType\" : 5123,\n            \"count\" : 60,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 4,\n            \"componentType\" : 5126,\n            \"count\" : 36,\n            \"max\" : [\n                1,\n                2,\n                1\n            ],\n            \"min\" : [\n                -1,\n                0,\n                -1\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 5,\n            \"componentType\" : 5126,\n            \"count\" : 36,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 6,\n            \"componentType\" : 5126,\n            \"count\" : 36,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 7,\n            \"componentType\" : 5123,\n            \"count\" : 54,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 8,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"max\" : [\n                1.25,\n                4,\n                1.25\n            ],\n            \"min\" : [\n                -1.25,\n                2.732558250427246,\n                -1.25\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 9,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 10,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 11,\n            \"componentType\" : 5123,\n            \"count\" : 282,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 12,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"max\" : [\n                1.170784831047058,\n                2.732558250427246,\n                1.170784831047058\n            ],\n            \"min\" : [\n                -1.170784831047058,\n                0,\n                -1.170784831047058\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 13,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 14,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 15,\n            \"componentType\" : 5123,\n            \"count\" : 282,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 16,\n            \"componentType\" : 5126,\n            \"count\" : 177,\n            \"max\" : [\n                0.8733491897583008,\n                4.479413986206055,\n                0.8733491897583008\n            ],\n            \"min\" : [\n                -0.8733491897583008,\n                0,\n                -0.873349130153656\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 17,\n            \"componentType\" : 5126,\n            \"count\" : 177,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 18,\n            \"componentType\" : 5126,\n            \"count\" : 177,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 19,\n            \"componentType\" : 5123,\n            \"count\" : 816,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 20,\n            \"componentType\" : 5126,\n            \"count\" : 161,\n            \"max\" : [\n                0.7608017921447754,\n                5.298568248748779,\n                0.7608017921447754\n            ],\n            \"min\" : [\n                -0.7608017921447754,\n                1.515061616897583,\n                -0.7608017921447754\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 21,\n            \"componentType\" : 5126,\n            \"count\" : 161,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 22,\n            \"componentType\" : 5126,\n            \"count\" : 161,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 23,\n            \"componentType\" : 5123,\n            \"count\" : 624,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 24,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"max\" : [\n                0.5408757925033569,\n                4.968421936035156,\n                0.5408756732940674\n            ],\n            \"min\" : [\n                -0.5408757925033569,\n                4.479413986206055,\n                -0.5408758521080017\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 25,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 26,\n            \"componentType\" : 5126,\n            \"count\" : 96,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 27,\n            \"componentType\" : 5123,\n            \"count\" : 384,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 28,\n            \"componentType\" : 5126,\n            \"count\" : 66,\n            \"max\" : [\n                1.189948558807373,\n                0.9166667461395264,\n                0.9166669249534607\n            ],\n            \"min\" : [\n                -0.1928032636642456,\n                -0.9166666865348816,\n                -0.9166666865348816\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 29,\n            \"componentType\" : 5126,\n            \"count\" : 66,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 30,\n            \"componentType\" : 5126,\n            \"count\" : 66,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 31,\n            \"componentType\" : 5123,\n            \"count\" : 216,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 32,\n            \"componentType\" : 5126,\n            \"count\" : 33,\n            \"max\" : [\n                1.7313843965530396,\n                0.9166667461395264,\n                0.9166668653488159\n            ],\n            \"min\" : [\n                1.1899482011795044,\n                -0.9166666865348816,\n                -0.9166666865348816\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 33,\n            \"componentType\" : 5126,\n            \"count\" : 33,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 34,\n            \"componentType\" : 5126,\n            \"count\" : 33,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 35,\n            \"componentType\" : 5123,\n            \"count\" : 120,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 36,\n            \"componentType\" : 5126,\n            \"count\" : 90,\n            \"max\" : [\n                0.9194505214691162,\n                1.4056339263916016,\n                0.9073430895805359\n            ],\n            \"min\" : [\n                -0.8508420586585999,\n                -0.9868220686912537,\n                -0.9073430895805359\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 37,\n            \"componentType\" : 5126,\n            \"count\" : 90,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 38,\n            \"componentType\" : 5126,\n            \"count\" : 90,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 39,\n            \"componentType\" : 5123,\n            \"count\" : 384,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 40,\n            \"componentType\" : 5126,\n            \"count\" : 416,\n            \"max\" : [\n                0.8395062685012817,\n                0.8395062685012817,\n                0.8395062685012817\n            ],\n            \"min\" : [\n                -0.8395062685012817,\n                -0.8395062685012817,\n                -0.8395062685012817\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 41,\n            \"componentType\" : 5126,\n            \"count\" : 416,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 42,\n            \"componentType\" : 5126,\n            \"count\" : 416,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 43,\n            \"componentType\" : 5123,\n            \"count\" : 2304,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 45,\n            \"componentType\" : 5126,\n            \"count\" : 87,\n            \"max\" : [\n                1.7313843965530396,\n                0.9166667461395264,\n                0.9166666865348816\n            ],\n            \"min\" : [\n                -0.1928032636642456,\n                -0.9166667461395264,\n                -0.9166668653488159\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 46,\n            \"componentType\" : 5126,\n            \"count\" : 87,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 47,\n            \"componentType\" : 5126,\n            \"count\" : 87,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 48,\n            \"componentType\" : 5123,\n            \"count\" : 336,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 49,\n            \"componentType\" : 5126,\n            \"count\" : 66,\n            \"max\" : [\n                1.189948558807373,\n                0.9166667461395264,\n                0.9166669249534607\n            ],\n            \"min\" : [\n                -0.1928032636642456,\n                -0.9166666865348816,\n                -0.9166666865348816\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 50,\n            \"componentType\" : 5126,\n            \"count\" : 66,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 51,\n            \"componentType\" : 5126,\n            \"count\" : 66,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 52,\n            \"componentType\" : 5126,\n            \"count\" : 33,\n            \"max\" : [\n                1.7313843965530396,\n                0.9166667461395264,\n                0.9166668653488159\n            ],\n            \"min\" : [\n                1.1899482011795044,\n                -0.9166666865348816,\n                -0.9166666865348816\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 53,\n            \"componentType\" : 5126,\n            \"count\" : 33,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 54,\n            \"componentType\" : 5126,\n            \"count\" : 33,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 55,\n            \"componentType\" : 5126,\n            \"count\" : 87,\n            \"max\" : [\n                1.7313843965530396,\n                0.9166667461395264,\n                0.9166666865348816\n            ],\n            \"min\" : [\n                -0.1928032636642456,\n                -0.9166667461395264,\n                -0.9166668653488159\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 56,\n            \"componentType\" : 5126,\n            \"count\" : 87,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 57,\n            \"componentType\" : 5126,\n            \"count\" : 87,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 58,\n            \"componentType\" : 5126,\n            \"count\" : 260,\n            \"max\" : [\n                0.8691727519035339,\n                0.7800071239471436,\n                0.8638217449188232\n            ],\n            \"min\" : [\n                0.37183183431625366,\n                -0.6861307621002197,\n                -0.7218424081802368\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 59,\n            \"componentType\" : 5126,\n            \"count\" : 260,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 60,\n            \"componentType\" : 5126,\n            \"count\" : 260,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 61,\n            \"componentType\" : 5123,\n            \"count\" : 780,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 62,\n            \"componentType\" : 5126,\n            \"count\" : 514,\n            \"max\" : [\n                0.7006542682647705,\n                0.8650201559066772,\n                0.9318643808364868\n            ],\n            \"min\" : [\n                -0.9257753491401672,\n                -1.74318528175354,\n                -0.919565737247467\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 63,\n            \"componentType\" : 5126,\n            \"count\" : 514,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 64,\n            \"componentType\" : 5126,\n            \"count\" : 514,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 65,\n            \"componentType\" : 5123,\n            \"count\" : 1704,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 66,\n            \"componentType\" : 5126,\n            \"count\" : 222,\n            \"max\" : [\n                1.000000238418579,\n                1.9983043670654297,\n                1.3471773862838745\n            ],\n            \"min\" : [\n                -1.000000238418579,\n                -6.519145046013364e-08,\n                -1.3471773862838745\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 67,\n            \"componentType\" : 5126,\n            \"count\" : 222,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 68,\n            \"componentType\" : 5126,\n            \"count\" : 222,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 69,\n            \"componentType\" : 5123,\n            \"count\" : 960,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 70,\n            \"componentType\" : 5126,\n            \"count\" : 25,\n            \"max\" : [\n                0.918255090713501,\n                1.8358603715896606,\n                0.673305094242096\n            ],\n            \"min\" : [\n                0.5208129286766052,\n                0.26070526242256165,\n                -0.673305094242096\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 71,\n            \"componentType\" : 5126,\n            \"count\" : 25,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 72,\n            \"componentType\" : 5126,\n            \"count\" : 25,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 73,\n            \"componentType\" : 5123,\n            \"count\" : 96,\n            \"type\" : \"SCALAR\"\n        },\n        {\n            \"bufferView\" : 74,\n            \"componentType\" : 5126,\n            \"count\" : 222,\n            \"max\" : [\n                1.000000238418579,\n                1.9983043670654297,\n                1.3471773862838745\n            ],\n            \"min\" : [\n                -1.000000238418579,\n                -6.519145046013364e-08,\n                -1.3471773862838745\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 75,\n            \"componentType\" : 5126,\n            \"count\" : 222,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 76,\n            \"componentType\" : 5126,\n            \"count\" : 222,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 77,\n            \"componentType\" : 5126,\n            \"count\" : 25,\n            \"max\" : [\n                0.918255090713501,\n                1.8358603715896606,\n                0.673305094242096\n            ],\n            \"min\" : [\n                0.5208129286766052,\n                0.26070526242256165,\n                -0.673305094242096\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 78,\n            \"componentType\" : 5126,\n            \"count\" : 25,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 79,\n            \"componentType\" : 5126,\n            \"count\" : 25,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 80,\n            \"componentType\" : 5126,\n            \"count\" : 236,\n            \"max\" : [\n                0.4323027729988098,\n                0.5700029134750366,\n                0.3296939730644226\n            ],\n            \"min\" : [\n                -0.10648570954799652,\n                -0.030087364837527275,\n                -0.3296939730644226\n            ],\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 81,\n            \"componentType\" : 5126,\n            \"count\" : 236,\n            \"type\" : \"VEC3\"\n        },\n        {\n            \"bufferView\" : 82,\n            \"componentType\" : 5126,\n            \"count\" : 236,\n            \"type\" : \"VEC2\"\n        },\n        {\n            \"bufferView\" : 83,\n            \"componentType\" : 5123,\n            \"count\" : 1104,\n            \"type\" : \"SCALAR\"\n        }\n    ],\n    \"bufferViews\" : [\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 564,\n            \"byteOffset\" : 0\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 564,\n            \"byteOffset\" : 564\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 376,\n            \"byteOffset\" : 1128\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 120,\n            \"byteOffset\" : 1504\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 432,\n            \"byteOffset\" : 1624\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 432,\n            \"byteOffset\" : 2056\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 288,\n            \"byteOffset\" : 2488\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 108,\n            \"byteOffset\" : 2776\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1152,\n            \"byteOffset\" : 2884\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1152,\n            \"byteOffset\" : 4036\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 768,\n            \"byteOffset\" : 5188\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 564,\n            \"byteOffset\" : 5956\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1152,\n            \"byteOffset\" : 6520\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1152,\n            \"byteOffset\" : 7672\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 768,\n            \"byteOffset\" : 8824\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 564,\n            \"byteOffset\" : 9592\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2124,\n            \"byteOffset\" : 10156\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2124,\n            \"byteOffset\" : 12280\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1416,\n            \"byteOffset\" : 14404\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1632,\n            \"byteOffset\" : 15820\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1932,\n            \"byteOffset\" : 17452\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1932,\n            \"byteOffset\" : 19384\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1288,\n            \"byteOffset\" : 21316\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1248,\n            \"byteOffset\" : 22604\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1152,\n            \"byteOffset\" : 23852\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1152,\n            \"byteOffset\" : 25004\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 768,\n            \"byteOffset\" : 26156\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 768,\n            \"byteOffset\" : 26924\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 792,\n            \"byteOffset\" : 27692\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 792,\n            \"byteOffset\" : 28484\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 528,\n            \"byteOffset\" : 29276\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 432,\n            \"byteOffset\" : 29804\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 396,\n            \"byteOffset\" : 30236\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 396,\n            \"byteOffset\" : 30632\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 264,\n            \"byteOffset\" : 31028\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 240,\n            \"byteOffset\" : 31292\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1080,\n            \"byteOffset\" : 31532\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1080,\n            \"byteOffset\" : 32612\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 720,\n            \"byteOffset\" : 33692\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 768,\n            \"byteOffset\" : 34412\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 4992,\n            \"byteOffset\" : 35180\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 4992,\n            \"byteOffset\" : 40172\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 3328,\n            \"byteOffset\" : 45164\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 4608,\n            \"byteOffset\" : 48492\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1756,\n            \"byteOffset\" : 53100\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1044,\n            \"byteOffset\" : 54856\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1044,\n            \"byteOffset\" : 55900\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 696,\n            \"byteOffset\" : 56944\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 672,\n            \"byteOffset\" : 57640\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 792,\n            \"byteOffset\" : 58312\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 792,\n            \"byteOffset\" : 59104\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 528,\n            \"byteOffset\" : 59896\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 396,\n            \"byteOffset\" : 60424\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 396,\n            \"byteOffset\" : 60820\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 264,\n            \"byteOffset\" : 61216\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1044,\n            \"byteOffset\" : 61480\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1044,\n            \"byteOffset\" : 62524\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 696,\n            \"byteOffset\" : 63568\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 3120,\n            \"byteOffset\" : 64264\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 3120,\n            \"byteOffset\" : 67384\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2080,\n            \"byteOffset\" : 70504\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1560,\n            \"byteOffset\" : 72584\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 6168,\n            \"byteOffset\" : 74144\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 6168,\n            \"byteOffset\" : 80312\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 4112,\n            \"byteOffset\" : 86480\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 3408,\n            \"byteOffset\" : 90592\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2664,\n            \"byteOffset\" : 94000\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2664,\n            \"byteOffset\" : 96664\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1776,\n            \"byteOffset\" : 99328\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1920,\n            \"byteOffset\" : 101104\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 300,\n            \"byteOffset\" : 103024\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 300,\n            \"byteOffset\" : 103324\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 200,\n            \"byteOffset\" : 103624\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 192,\n            \"byteOffset\" : 103824\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2664,\n            \"byteOffset\" : 104016\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2664,\n            \"byteOffset\" : 106680\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1776,\n            \"byteOffset\" : 109344\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 300,\n            \"byteOffset\" : 111120\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 300,\n            \"byteOffset\" : 111420\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 200,\n            \"byteOffset\" : 111720\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2832,\n            \"byteOffset\" : 111920\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2832,\n            \"byteOffset\" : 114752\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 1888,\n            \"byteOffset\" : 117584\n        },\n        {\n            \"buffer\" : 0,\n            \"byteLength\" : 2208,\n            \"byteOffset\" : 119472\n        }\n    ],\n    \"samplers\" : [\n        {\n            \"magFilter\" : 9728,\n            \"minFilter\" : 9984\n        }\n    ],\n    \"buffers\" : [\n        {\n            \"byteLength\" : 121680,\n            \"uri\" : \"data:application/octet-stream;base64,AACAvwAAAEAAAIA/AACAvwAAAEAAAIA/AACAvwAAAEAAAIA/AACAvwAAAEAAAIC/AACAvwAAAEAAAIC/AACAPwAAAEAAAIA/AACAPwAAAEAAAIA/AACAPwAAAEAAAIA/AACAPwAAAEAAAIC/AACAPwAAAEAAAIC/AACAPwAAAEAAAIC/AAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAAAAAAAAQEAAAACAAACAvwAAQEAAAACAAACAvwAAQEAAAACAAACAvwAAQEAAAACAAACAPwAAQEAAAACAAACAPwAAQEAAAACAAACAPwAAQEAAAACAAAAAAAAAUEAAAACAAAAAAAAAUEAAAACAAACAvwAAUEAAAACAAACAPwAAUEAAAACAAACAv8/AGT8AAIA/AACAv8/AGT8AAIA/AACAv8/AGT8AAIC/AACAv8/AGT8AAIC/AACAP8/AGT8AAIC/AACAP8/AGT8AAIC/AACAP8/AGT8AAIA/AACAP8/AGT8AAIA/AACAvye7vT8AAIA/AACAvye7vT8AAIA/AACAvye7vT8AAIC/AACAvye7vT8AAIC/AACAPye7vT8AAIC/AACAPye7vT8AAIC/AACAPye7vT8AAIA/AACAPye7vT8AAIA/8wQ1v/MENT8AAACAAAAAAPMENT/zBDU/AAAAAPMENT/zBDU/8wQ1v/MENT8AAACAAAAAAPMENT/zBDW/AAAAAPMENb/zBDW/AAAAAPMENT/zBDU/8wQ1P/MENT8AAACAAAAAAPMENb/zBDU/AAAAAPMENT/zBDW/8wQ1P/MENT8AAACA8wQ1v/MENT8AAACAAAAAAPMENb/zBDW/AAAAAPMENb/zBDU/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIA/AAAAAPMENT/zBDW/AAAAAPMENT/zBDW/AAAAAPMENT/zBDU/AAAAAPMENT/zBDU/8wQ1P/MENT8AAACAAAAAAAAAAAAAAIA/AAAAAPMENT/zBDW/AAAAAPMENT/zBDU/AAAAAPMENb/zBDW/AAAAAPMENb/zBDU/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIC/AACAvwAAAAAAAACAAAAAAAAAAAAAAIA/AACAvwAAAAAAAACAAAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AACAPwAAAAAAAACAAAAAAAAAAAAAAIA/AACAPwAAAAAAAACAAACAvwAAAAAAAACAAAAAAAAAAAAAAIA/AACAvwAAAAAAAACAAAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AACAPwAAAAAAAACAAAAAAAAAAAAAAIA/AACAPwAAAAAAAACAAAAgPwAAgD8AACA/AAAAAAAAID8AAIA/AAAgPwAAQD8AACA/AABAPwAAID8AAIA+AAAgPwAAgD4AACA/AACAPgAAID8AAAA/AAAgPwAAAD8AACA/AAAAPwAAID8AAEA/AAAgPwAAAAAAACA/AAAAPwAAID8AAAA/AAAgPwAAQD8AACA/AAAAPwAAID8AAEA/AAAgPwAAAAAAACA/AABAPwAAID8AAIA+AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAgPwAAAD8AACA/AABAPwAAAAAAAIA/AAAAAAAAgD80cOY+AACAPzRw5j4AAAAANHDmPgAAQD80cOY+AABAPzRw5j4AAAA/NHDmPgAAAD80cOY+AACAPjRw5j4AAIA+lRgaPwAAgD+VGBo/AAAAAJUYGj8AAEA/lRgaPwAAQD+VGBo/AAAAP5UYGj8AAAA/lRgaPwAAgD6VGBo/AACAPgMAAAALAAEABgASAAkABAAQAAcACgAUAA0ACAAZAAUADAAYABEABAAWAAIAEwAXABUADwAcABUAHAAdABoADgAbABoAGwAeACUALQAoACUAKAAgACQALAAuACQALgAmACIAKgArACIAKwAjAB8AJwApAB8AKQAhAAAAgL8AAAAAAACAPwAAgL8AAAAAAACAPwAAgL8AAAAAAACAPwAAgL8AAABAAACAPwAAgL8AAABAAACAPwAAgL8AAAAAAACAvwAAgL8AAAAAAACAvwAAgL8AAAAAAACAvwAAgL8AAABAAACAvwAAgL8AAABAAACAvwAAgD8AAAAAAACAPwAAgD8AAAAAAACAPwAAgD8AAAAAAACAPwAAgD8AAABAAACAPwAAgD8AAABAAACAPwAAgD8AAAAAAACAvwAAgD8AAAAAAACAvwAAgD8AAAAAAACAvwAAgD8AAABAAACAvwAAgD8AAABAAACAvwAAgL/PwBk/AACAPwAAgL/PwBk/AACAPwAAgL/PwBk/AACAvwAAgL/PwBk/AACAvwAAgD/PwBk/AACAvwAAgD/PwBk/AACAvwAAgD/PwBk/AACAPwAAgD/PwBk/AACAPwAAgL8nu70/AACAPwAAgL8nu70/AACAPwAAgL8nu70/AACAvwAAgL8nu70/AACAvwAAgD8nu70/AACAvwAAgD8nu70/AACAvwAAgD8nu70/AACAPwAAgD8nu70/AACAPwAAgL8AAAAAAAAAgAAAAAAAAIC/AAAAgAAAAAAAAAAAAACAPwAAgL8AAAAAAAAAgAAAAAAAAAAAAACAPwAAgL8AAAAAAAAAgAAAAAAAAIC/AAAAgAAAAAAAAAAAAACAvwAAgL8AAAAAAAAAgAAAAAAAAAAAAACAvwAAAAAAAIC/AAAAgAAAAAAAAAAAAACAPwAAgD8AAAAAAAAAgAAAAAAAAAAAAACAPwAAgD8AAAAAAAAAgAAAAAAAAIC/AAAAgAAAAAAAAAAAAACAvwAAgD8AAAAAAAAAgAAAAAAAAAAAAACAvwAAgD8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAAAAAAAAAAACAPwAAgL8AAAAAAAAAgAAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAgD8AAAAAAAAAgAAAAAAAAAAAAACAPwAAgD8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAAAAAAAAAAACAPwAAgL8AAAAAAAAAgAAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAgD8AAAAAAAAAgAAAAAAAAAAAAACAPwAAgD8AAAAAAAAAgAAAwD4AAIA/AAAAPgAAgD4AAMA+AAAAAAAAID8AAIA/AAAgPwAAAAAAAMA+AABAPwAAAD4AAAA/AADAPgAAQD8AACA/AABAPwAAID8AAEA/AADAPgAAgD4AAMA+AACAPgAAwD4AAIA+AAAgPwAAgD4AACA/AACAPgAAwD4AAAA/AADAPgAAAD8AAMA+AAAAPwAAID8AAAA/AAAgPwAAAD80cOY+AACAPzRw5j4AAAAANHDmPgAAQD80cOY+AABAPzRw5j4AAAA/NHDmPgAAAD80cOY+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AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwUAAwABAAEAPgA8ADwAOgA4ADgANgA0ADQAMgAwADAALgAsACwAKgAoACgAJgAkACQAIgAgACAAHwAdAB0AGwAZABkAFwAVABUAEwARABEADwANAA0ACwAJAAkABwAFAAUAAQA8ADwAOAA0ADQAMAAsACwAKAAkACQAIAAdAB0AGQAVABUAEQANAA0ACQAFAAUAPAA0ADQALAAkACQAHQAVABUADQAFAAUANAAkACQAFQAFAAgACgBFAAgARQBfACMAJQBDACMAQwBeAD0APwBBAD0AQQBdAAYACABfAAYAXwBcACEAIwBeACEAXgBbADsAPQBdADsAXQBaAAQABgBcAAQAXABZAB4AIQBbAB4AWwBYADkAOwBaADkAWgBXAAIABABZAAIAWQBWABwAHgBYABwA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AAAAgAAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwoAQACQAAoAkABRAEAACQBQAEAAUACQAJAAUAAUAJAAFABMAFEAkABMAFEATAAVAAcAPQCRAAcAkQBTAD0ABQBSAD0AUgCRAJEAUgASAJEAEgBKAFMAkQBKAFMASgATAAMAOQCSAAMAkgBVADkAAABUADkAVACSAJIAVAAQAJIAEABIAFUAkgBIAFUASAARAAAARgCTAAAAkwBUAEYADgBWAEYAVgCTAJMAVgAXAJMAFwBPAFQAkwBPAFQATwAQAAwAQgCUAAwAlABXAEIACgBRAEIAUQCUAJQAUQAVAJQAFQBNAFcAlABNAFcATQAWAAkAPwCVAAkAlQBQAD8ABwBTAD8AUwCVAJUAUwATAJUAEwBLAFAAlQBLAFAASwAUAAUAOwCWAAUAlgBSADsAAwBVADsAVQCWAJYAVQARAJYAEQBJAFIAlgBJAFIASQASAA4ARACXAA4AlwBWAEQADABXAEQAVwCXAJcAVwAWAJcAFgBOAFYAlwBOAFYATgAXABAATwCYABAAmABhAE8AFwBgAE8AYACYAJgAYAAfAJgAHwBfAGEAmABfAGEAXwAYABYATQCZABYAmQBjAE0AFQBiAE0AYgCZAJkAYgAdAJkAHQBdAGMAmQBdAGMAXQAeABQASwCaABQAmgBlAEsAEwBkAEsAZACaAJoAZAAbAJoAGwBbAGUAmgBbAGUAWwAcABIASQCbABIAmwBnAEkAEQBmAEkAZgCbAJsAZgAZAJsAGQBZAGcAmwBZAGcAWQAaABcATgCcABcAnABgAE4AFgBjAE4AYwCcAJwAYwAeAJwAHgBeAGAAnABeAGAAXgAfABUATACdABUAnQBiAEwAFABlAEwAZQCdAJ0AZQAcAJ0AHABcAGIAnQBcAGIAXAAdABMASgCeABMAngBkAEoAEgBnAEoAZwCeAJ4AZwAaAJ4AGgBaAGQAngBaAGQAWgAbABEASACfABEAnwBmAEgAEABhAEgAYQCfAJ8AYQAYAJ8AGABYAGYAnwBYAGYAWAAZACcAbgCgACcAoAB5AG4AJgB4AG4AeACgAKAAeAAuAKAALgB2AHkAoAB2AHkAdgAvACUAbAChACUAoQB7AGwAJAB6AGwAegChAKEAegAsAKEALAB0AHsAoQB0AHsAdAAtACMAagCiACMAogB9AGoAIgB8AGoAfACiAKIAfAAqAKIAKgByAH0AogByAH0AcgArACEAaACjACEAowB/AGgAIAB+AGgAfgCjAKMAfgAoAKMAKABwAH8AowBwAH8AcAApACAAbwCkACAApAB+AG8AJwB5AG8AeQCkAKQAeQAvAKQALwB3AH4ApAB3AH4AdwAoACYAbQClACYApQB4AG0AJQB7AG0AewClAKUAewAtAKUALQB1AHgApQB1AHgAdQAuACQAawCmACQApgB6AGsAIwB9AGsAfQCmAKYAfQArAKYAKwBzAHoApgBzAHoAcwAsACIAaQCnACIApwB8AGkAIQB/AGkAfwCnAKcAfwApAKcAKQBxAHwApwBxAHwAcQAqACwAcwCoACwAqACJAHMAKwCIAHMAiACoAKgAiAAzAKgAMwCDAIkAqACDAIkAgwA0ACoAcQCpACoAqQCLAHEAKQCKAHEAigCpAKkAigAxAKkAMQCBAIsAqQCBAIsAgQAyAC8AdgCqAC8AqgCNAHYALgCMAHYAjACqAKoAjAA2AKoA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AACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/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EwBRABMAMwA7AFEAMwA7ADMAFQAEACMAUgAEAFIAPQAjAAMAPAAjADwAUgBSADwADgBSAA4ALgA9AFIALgA9AC4AEAACACEAUwACAFMAPwAhAAEAPgAhAD4AUwBTAD4ACgBTAAoAKgA/AFMAKgA/ACoADAAHACYAVAAHAFQAOAAmAAYAOwAmADsAVABUADsAFQBUABUANQA4AFQANQA4ADUAFwAFACQAVQAFAFUAOgAkAAQAPQAkAD0AVQBVAD0AEABVABAAMQA6AFUAMQA6ADEAEwADACIAVgADAFYAPAAiAAIAPwAiAD8AVgBWAD8ADABWAAwALAA8AFYALAA8ACwADgABACAAVwABAFcAPgAgAAAAOQAgADkAVwBXADkACQBXAAkAKAA+AFcAKAA+ACgACgASADAAWAASAFgASQAwABEASAAwAEgAWABYAEgAHABYABwARABJAFgARABJAEQAHQAPAC0AWQAPAFkASwAtAA0ASgAtAEoAWQBZAEoAGgBZABoAQgBLAFkAQgBLAEIAGwALACkAWgALAFoATQApAAgATAApAEwAWgBaAEwAGABaABgAQABNAFoAQABNAEAAGQAIADYAWwAIAFsATAA2ABYATgA2AE4AWwBbAE4AHwBbAB8ARwBMAFsARwBMAEcAGAAUADIAXAAUAFwATwAyABIASQAyAEkAXABcAEkAHQBcAB0ARQBPAFwARQBPAEUAHgARAC8AXQARAF0ASAAvAA8ASwAvAEsAXQBdAEsAGwBdABsAQwBIAF0AQwBIAEMAHAANACsAXgANAF4ASgArAAsATQArAE0AXgBeAE0AGQBeABkAQQBKAF4AQQBKAEEAGgAWADQAXwAWAF8ATgA0ABQATwA0AE8AXwBfAE8AHgBfAB4ARgBOAF8ARgBOAEYAHwCvLOu9////vgMAAD+vLOu9////vgMAAD+vLOu9////vgMAAD+tLOu9AgAAPwMAAD+tLOu9AgAAPwMAAD+tLOu9AgAAPwMAAD+wLOu9////vv///76wLOu9////vv///76wLOu9AQAAP////76wLOu9AQAAP////747UJg/qqoqv6uqKr87UJg/qqoqv6uqKr87UJg/q6oqP6qqKr87UJg/q6oqP6qqKr88UJg/qqoqv62qKj88UJg/qqoqv62qKj87UJg/q6oqP62qKj87UJg/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+P9/PgEAgD78/38+AQDAPvj//z0BACA/+P//PQEAQD/8/38+DEHWPgAAALQMQdY+AACAP0OcCz8AAIA+ynbyPvj//z3JdvI+/v+/Pi7s8T4AAGA/1GULPwAAYD9Hxgs/AADAPih3Cz/4//89Sa59PgAAwD4gT0A/AADAPlDu1j74//89c8XVPgIAwD6oy9Y+AABgP9RlCz8AAGA/SMYLPwAAwD4ndws/+P//PUqufT4AAMA+IE9APwAAwD5O7tY++P//PXPF1T7+/78+qsvWPgAAYD8PACEASgAPAEoANgAhAAQAIgAhACIASgBKACIACABKAAgAMQA2AEoAMQA2ADEAEAARADIASwARAEsANQAyAA0AKQAyACkASwBLACkACwBLAAsAMwA1AEsAMwA1ADMAEgASADMATAASAEwANAAzAAsALQAzAC0ATABMAC0AAwBMAAMAIAA0AEwAIAA0ACAADgAGACUATQAGAE0AHgAlAAwAKAAlACgATQBNACgACgBNAAoAKwAeAE0AKwAeACsAAAANACYATgANAE4AKQAmAAkAIwAmACMATgBOACMABQBOAAUALgApAE4ALgApAC4ACwAKACoATwAKAE8ALAAqABIANAAqADQATwBPADQADgBPAA4ALwAsAE8ALwAsAC8AAQAMACcAUAAMAFAAKAAnABEANQAnADUAUABQADUAEgBQABIAKgAoAFAAKgAoACoACgACADAAUQACAFEAHwAwAA8ANgAwADYAUQBRADYAEABRABAAJAAfAFEAJAAfACQABwAcAEkAUgAcAFIAOgBJABAAMQBJADEAUgBSADEACABSAAgAOwA6AFIAOwA6ADsAFwARAEgAUwARAFMAMgBIAB0ARgBIAEYAUwBTAEYAGgBTABoAPgAyAFMAPgAyAD4ADQAdAEcAVAAdAFQARgBHABsAOQBHADkAVABUADkAFgBUABYAQgBGAFQAQgBGAEIAGgAGADcAVQAGAFUAJQA3ABMAQAA3AEAAVQBVAEAAGQBVABkAPQAlAFUAPQAlAD0ADAANAD4AVgANAFYAJgA+ABoAQwA+AEMAVgBWAEMAGABWABgAPAAmAFYAPAAmADwACQAZAEEAVwAZAFcAPwBBABQARABBAEQAVwBXAEQAGwBXABsARwA/AFcARwA/AEcAHQAMAD0AWAAMAFgAJwA9ABkA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hACFAIwAhACMAIsAhQCGAI0AhQCNAIwAhgCHAI4AhgCOAI0AiACJAJAAiACQAI8AiQCKAJEAiQCRAJAAigCLAJIAigCSAJEAiwCMAJMAiwCTAJIAjACNAJQAjACUAJMAjQCOAJUAjQCVAJQAjwCQAJcAjwCXAJYAkACRAJgAkACYAJcAkQCSAJkAkQCZAJgAkgCTAJoAkgCaAJkAkwCUAJsAkwCbAJoAlACVAJwAlACcAJsAlgCXAJ4AlgCeAJ0AlwCYAJ8AlwCfAJ4AmACZAKAAmACgAJ8AmQCaAKEAmQChAKAAmgCbAKIAmgCiAKEAmwCcAKMAmwCjAKIAnQCeAKUAnQClAKQAngCfAKYAngCmAKUAnwCgAKcAnwCnAKYAoAChAKgAoACoAKcAoQCiAKkAoQCpAKgAogCjAKoAogCqAKkAAAAWAHoAAAB6ABUAFgAXAHsAFgB7AHoAFwAYAHwAFwB8AHsAGAAZAH0AGAB9AHwAGQAaAH4AGQB+AH0AGgAbAH8AGgB/AH4AGwAcAIAAGwCAAH8AHAACAB8AHAAfAIAAgAAfACAAgAAgAIcAhwAgACEAhwAhAI4AjgAhACIAjgAiAJUAlQAiACMAlQAjAJwAnAAjACUAnAAlAKMAowAlACcAowAnAKoAqgAnAAcAqgAHACgAqQCqACgAqQAoACoAqACpACoAqAAqACsApwCoACsApwArACwApgCnACwApgAsAC0ApQCmAC0ApQAtAC4ApAClAC4ApAAuAC8ADACkAC8ADAAvAAUADQCdAKQADQCkAAwADwCWAJ0ADwCdAA0AEQCPAJYAEQCWAA8AEgCIAI8AEgCPABEAEwCBAIgAEwCIABIAFQB6AIEAFQCBABMAqwCsALMAqwCzALIArACtALQArAC0ALMArQCuALUArQC1ALQArgCvALYArgC2ALUArwCwALcArwC3ALYAsACxALgAsAC4ALcAsgCzALoAsgC6ALkAswC0ALsAswC7ALoAtAC1ALwAtAC8ALsAtQC2AL0AtQC9ALwAtgC3AL4AtgC+AL0AtwC4AL8AtwC/AL4AuQC6AMEAuQDBAMAAugC7AMIAugDCAMEAuwC8AMMAuwDDAMIAvAC9AMQAvADEAMMAvQC+AMUAvQDFAMQAvgC/AMYAvgDGAMUAwADBAMgAwADIAMcAwQDCAMkAwQDJAMgAwgDDAMoAwgDKAMkAwwDEAMsAwwDLAMoAxADFAMwAxADMAMsAxQDGAM0AxQDNAMwAxwDIAM8AxwDPAM4AyADJANAAyADQAM8AyQDKANEAyQDRANAAygDLANIAygDSANEAywDMANMAywDTANIAzADNANQAzADUANMAzgDPANYAzgDWANUAzwDQANcAzwDXANYA0ADRANgA0ADYANcA0QDSANkA0QDZANgA0gDTANoA0gDaANkA0wDUANsA0wDbANoABAAvAKsABACrADkALwAuAKwALwCsAKsALgAtAK0ALgCtAKwALQAsAK4ALQCuAK0ALAArAK8ALACvAK4AKwAqALAAKwCwAK8AKgApALEAKgCxALAAKQAGADsAKQA7ALEAsQA7ADwAsQA8ALgAuAA8AD4AuAA+AL8AvwA+AEAAvwBAAMYAxgBAAEEAxgBBAM0AzQBBAEMAzQBDANQA1ABDAEQA1ABEANsA2wBEAAsA2wALAEYA2gDbAEYA2gBGAEcA2QDaAEcA2QBHAEgA2ADZAEgA2ABIAEkA1wDYAEkA1wBJAEoA1gDXAEoA1gBKAEsA1QDWAEsA1QBLAEwAMADVAEwAMABMAAoAMgDOANUAMgDVADAAMwDHAM4AMwDOADIANQDAAMcANQDHADMANwC5AMAANwDAADUAOACyALkAOAC5ADcAOQCrALIAOQCyADgA3ADdAOQA3ADkAOMA3QDeAOUA3QDlAOQA3gDfAOYA3gDmAOUA3wDgAOcA3wDnAOYA4ADhAOgA4ADoAOcA4QDiAOkA4QDpAOgA4wDkAOsA4wDrAOoA5ADlAOwA5ADsAOsA5QDmAO0A5QDtAOwA5gDnAO4A5gDuAO0A5wDoAO8A5wDvAO4A6ADpAPAA6ADwAO8A6gDrAPIA6gDyAPEA6wDsAPMA6wDzAPIA7ADtAPQA7AD0APMA7QDuAPUA7QD1APQA7gDvAPYA7gD2APUA7wDwAPcA7wD3APYA8QDyAPkA8QD5APgA8gDzAPoA8gD6APkA8wD0APsA8wD7APoA9AD1APwA9AD8APsA9QD2AP0A9QD9APwA9gD3AP4A9gD+AP0A+AD5AAAB+AAAAf8A+QD6AAEB+QABAQAB+gD7AAIB+gACAQEB+wD8AAMB+wADAQIB/AD9AAQB/AAEAQMB/QD+AAUB/QAFAQQB/wAAAQcB/wAHAQYBAAEBAQgBAAEIAQcBAQECAQkBAQEJAQgBAgEDAQoBAgEKAQkBAwEEAQsBAwELAQoBBAEFAQwBBAEMAQsBCgBMANwACgDcAFMATABLAN0ATADdANwASwBKAN4ASwDeAN0ASgBJAN8ASgDfAN4ASQBIAOAASQDgAN8ASABHAOEASADhAOAARwBGAOIARwDiAOEARgALAFQARgBUAOIA4gBUAFUA4gBVAOkA6QBVAFYA6QBWAPAA8ABWAFcA8ABXAPcA9wBXAFgA9wBYAP4A/gBYAFkA/gBZAAUBBQFZAFoABQFaAAwBDAFaAAkADAEJAFsACwEMAVsACwFbAFwACgELAVwACgFcAF0ACQEKAV0ACQFdAF4ACAEJAV4ACAFeAF8ABwEIAV8ABwFfAGAABgEHAWAABgFgAGEATQAGAWEATQBhAAgATgD/AAYBTgAGAU0ATwD4AP8ATwD/AE4AUADxAPgAUAD4AE8AUQDqAPEAUQDxAFAAUgDjAOoAUgDqAFEAUwDcAOMAUwDjAFIADQEOARUBDQEVARQBDgEPARYBDgEWARUBDwEQARcBDwEXARYBEAERARgBEAEYARcBEQESARkBEQEZARgBEgETARoBEgEaARkBFAEVARwBFAEcARsBFQEWAR0BFQEdARwBFgEXAR4BFgEeAR0BFwEYAR8BFwEfAR4BGAEZASABGAEgAR8BGQEaASEBGQEhASABGwEcASMBGwEjASIBHAEdASQBHAEkASMBHQEeASUBHQElASQBHgEfASYBHgEmASUBHwEgAScBHwEnASYBIAEhASgBIAEoAScBIgEjASoBIgEqASkBIwEkASsBIwErASoBJAElASwBJAEsASsBJQEmAS0BJQEtASwBJgEnAS4BJgEuAS0BJwEoAS8BJwEvAS4BKQEqATEBKQExATABKgErATIBKgEyATEBKwEsATMBKwEzATIBLAEtATQBLAE0ATMBLQEuATUBLQE1ATQBLgEvATYBLgE2ATUBMAExATgBMAE4ATcBMQEyATkBMQE5ATgBMgEzAToBMgE6ATkBMwE0ATsBMwE7AToBNAE1ATwBNAE8ATsBNQE2AT0BNQE9ATwBCABhAA0BCAANAWwAYQBgAA4BYQAOAQ0BYABfAA8BYAAPAQ4BXwBeABABXwAQAQ8BXgBdABEBXgARARABXQBcABIBXQASAREBXABbABMBXAATARIBWwAJAG8AWwBvABMBEwFvAHEAEwFxABoBGgFxAHIAGgFyACEBIQFyAHQAIQF0ACgBKAF0AHUAKAF1AC8BLwF1AHgALwF4ADYBNgF4AHkANgF5AD0BPQF5AAMAPQEDAB0APAE9AR0APAEdABsAOwE8ARsAOwEbABoAOgE7ARoAOgEaABkAOQE6ARkAOQEZABgAOAE5ARgAOAEYABcANwE4ARcANwEXABYAYgA3ARYAYgAWAAEAZQAwATcBZQA3AWIAZwApATABZwAwAWUAaAAiASkBaAApAWcAagAbASIBagAiAWgAawAUARsBawAbAWoAbAANARQBbAAUAWsAPgE/AUYBPgFGAUUBPwFAAUcBPwFHAUYBQAFBAUgBQAFIAUcBQQFCAUkBQQFJAUgBQgFDAUoBQgFKAUkBQwFEAUsBQwFLAUoBRQFGAU0BRQFNAUwBRgFHAU4BRgFOAU0BRwFIAU8BRwFPAU4BSAFJAVABSAFQAU8BSQFKAVEBSQFRAVABSgFLAVIBSgFSAVEBTAFNAVQBTAFUAVMBTQFOAVUBTQFVAVQBTgFPAVYBTgFWAVUBTwFQAVcBTwFXAVYBUAFRAVgBUAFYAVcBUQFSAVkBUQFZAVgBUwFUAVsBUwFbAVoBVAFVAVwBVAFcAVsBVQFWAV0BVQFdAVwBVgFXAV4BVgFeAV0BVwFYAV8BVwFfAV4BWAFZAWABWAFgAV8BWgFbAWIBWgFiAWEBWwFcAWMBWwFjAWIBXAFdAWQBXAFkAWMBXQFeAWUBXQFlAWQBXgFfAWYBXgFmAWUBXwFgAWcBXwFnAWYBYQFiAWkBYQFpAWgBYgFjAWoBYgFqAWkBYwFkAWsBYwFrAWoBZAFlAWwBZAFsAWsBZQFmAW0BZQFtAWwBZgFnAW4BZgFuAW0BBAA5AD4BBAA+AQwAOQA4AD8BOQA/AT4BOAA2AEABOABAAT8BNgA0AEEBNgBBAUABNAAzAEIBNABCAUEBMwAxAEMBMwBDAUIBMQAwAEQBMQBEAUMBMAAKAFMAMABTAEQBRAFTAFIARAFSAEsBSwFSAFEASwFRAFIBUgFRAFAAUgFQAFkBWQFQAE8AWQFPAGABYAFPAE4AYAFOAGcBZwFOAE0AZwFNAG4BbgFNAAgAbgEIAG0AbQFuAW0AbQFtAGsAbAFtAWsAbAFrAGoAawFsAWoAawFqAGkAagFrAWkAagFpAGYAaQFqAWYAaQFmAGQAaAFpAWQAaAFkAGMAFABoAWMAFABjAAEAEwBhAWgBEwBoARQAEgBaAWEBEgBhARMAEQBTAVoBEQBaARIAEABMAVMBEABTAREADgBFAUwBDgBMARAADAA+AUUBDABFAQ4AbwFwAXcBbwF3AXYBcAFxAXgBcAF4AXcBcQFyAXkBcQF5AXgBcgFzAXoBcgF6AXkBcwF0AXsBcwF7AXoBdAF1AXwBdAF8AXsBdgF3AX4BdgF+AX0BdwF4AX8BdwF/AX4BeAF5AYABeAGAAX8BeQF6AYEBeQGBAYABegF7AYIBegGCAYEBewF8AYMBewGDAYIBfQF+AYUBfQGFAYQBfgF/AYYBfgGGAYUBfwGAAYcBfwGHAYYBgAGBAYgBgAGIAYcBgQGCAYkBgQGJAYgBggGDAYoBggGKAYkBhAGFAYwBhAGMAYsBhQGGAY0BhQGNAYwBhgGHAY4BhgGOAY0BhwGIAY8BhwGPAY4BiAGJAZABiAGQAY8BiQGKAZEBiQGRAZABiwGMAZMBiwGTAZIBjAGNAZQBjAGUAZMBjQGOAZUBjQGVAZQBjgGPAZYBjgGWAZUBjwGQAZcBjwGXAZYBkAGRAZgBkAGYAZcBkgGTAZoBkgGaAZkBkwGUAZsBkwGbAZoBlAGVAZwBlAGcAZsBlQGWAZ0BlQGdAZwBlgGXAZ4BlgGeAZ0BlwGYAZ8BlwGfAZ4BCwBFAG8BCwBvAVQARQBCAHABRQBwAW8BQgBBAHEBQgBxAXABQQBAAHIBQQByAXEBQAA/AHMBQABzAXIBPwA9AHQBPwB0AXMBPQA6AHUBPQB1AXQBOgAGACcAOgAnAHUBdQEnACYAdQEmAHwBfAEmACQAfAEkAIMBgwEkACIAgwEiAIoBigEiACEAigEhAJEBkQEhACAAkQEgAJgBmAEgAB4AmAEeAJ8BnwEeAAMAnwEDAHkAngGfAXkAngF5AHcAnQGeAXcAnQF3AHYAnAGdAXYAnAF2AHQAmwGcAXQAmwF0AHMAmgGbAXMAmgFzAHAAmQGaAXAAmQFwAG4AWgCZAW4AWgBuAAkAWQCSAZkBWQCZAVoAWACLAZIBWACSAVkAVwCEAYsBVwCLAVgAVgB9AYQBVgCEAVcAVQB2AX0BVQB9AVYAVABvAXYBVAB2AVUA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YNaJPq0s670BAAA/YNaJPq0s670BAAA/YNaJPrAs670AAAC/ZNaJvrAs670AAAC/ZNaJvrAs670AAAA/ZNaJvrAs670AAAA/ZNaJvuYR0z8AAAC//v//PuYR0z8AAAA//v//PuYR0z8BAAC/AgAAv+YR0z8AAAA/AwAAvztQmD+rqiq/rKoqvztQmD+rqiq/rKoqvztQmD+rqio/rKoqvztQmD+rqio/rKoqvzxQmD+rqiq/q6oqPzxQmD+rqiq/q6oqPztQmD+rqio/q6oqPztQmD+rqio/q6oqP75wqD6sqiq/EvkWv75wqD6sqiq/EvkWv75wqD6rqio/EPkWP75wqD6rqio/EPkWP75wqD6sqio/EfkWv75wqD6sqio/EfkWv75wqD6rqiq/EPkWP75wqD6rqiq/EPkWP9daD76kDBy/AAA8s9daD76kDBy/AAA8s9haD74AAACxkeqbPthaD74AAACxkeqbPtdaD76kDBw/AABQs9daD76kDBw/AABQs9ZaD74AAACxlOqbvuO+3DypWyO/wovdvuO+3DypWyO/wovdvioNwD+oWyM/qlsjvyoNwD+oWyM/qlsjv0x51j8AAECxpgwcv0151j+lDBy/AADks0x51j+kDBw/AADks0551j8AAECxpAwcPysNwD+oWyO/p1sjPysNwD+oWyO/p1sjP+a+3DynWyM/vYvdPua+3DynWyM/vYvdPioNwD+nWyO/qlsjvyoNwD+nWyO/qlsjv48BQj+sqio/ejQov48BQj+sqio/ejQov44BQj+sqiq/dzQoP44BQj+sqiq/dzQoPygNwD+oWyM/qFsjPygNwD+oWyM/qFsjPztQmD+sqmo/AADgszpQmD+sqmq/AADgszlQmD8AAAAAq6pqPztQmD8AAAAArqpqv44BQj+sqiq/eTQov44BQj+sqiq/eTQov48BQj+sqio/dzQoP48BQj+sqio/dzQoP+S+3DyoWyM/wovdvuS+3DyoWyM/wovdvua+3DynWyO/vYvdPua+3DynWyO/vYvdPr5wqD4AAAAAeZZPv75wqD6sqmq/AADGs71wqD6sqmo/AADKs71wqD4AAAAAdJZPPzhuRb4AAAAAAAA0sxVjwD8AAIAwSMpgvwGe3T8AAMAxAAD8s/9ryDwAAECxBhwXPxVjwD9HymC/AADcs/9ryDxHymA/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AQAAP+ZnID8BAAA/GBI5P850Hj4AAMA+5WdAPwAAwD4BAAA/0MD8PQIAIQBJAAIASQAfACEABAAiACEAIgBJAEkAIgAIAEkACAAkAB8ASQAkAB8AJAAHAA8APABKAA8ASgAyADwAEAAnADwAJwBKAEoAJwANAEoADQApADIASgApADIAKQAMAAwAKQBLAAwASwAqACkADQArACkAKwBLAEsAKwALAEsACwAsACoASwAsACoALAAKAB0ASABMAB0ATABEAEgAGAAvAEgALwBMAEwALwADAEwAAwAgAEQATAAgAEQAIAABAA4AMQBNAA4ATQA6ADEADAAqADEAKgBNAE0AKgAKAE0ACgAtADoATQAtADoALQASABsAQgBOABsATgBHAEIACQAjAEIAIwBOAE4AIwAFAE4ABQAwAEcATgAwAEcAMAAZAA0AKABPAA0ATwArACgAEQA5ACgAOQBPAE8AOQAVAE8AFQA4ACsATwA4ACsAOAALABYAPQBQABYAUABGAD0ADgA6AD0AOgBQAFAAOgASAFAAEgA1AEYAUAA1AEYANQAcAAoALABRAAoAUQAuACwACwA3ACwANwBRAFEANwAUAFEAFAA7AC4AUQA7AC4AOwATABcARQBSABcAUgA+AEUAGgAzAEUAMwBSAFIAMwAQAFIAEAA8AD4AUgA8AD4APAAPAAcAJABTAAcAUwAmACQACABBACQAQQBTAFMAQQAaAFMAGgBFACYAUwBFACYARQAXAAYAJQBUAAYAVAAeACUAFgBGACUARgBUAFQARgAcAFQAHABDAB4AVABDAB4AQwAAABEANABVABEAVQA5ADQAGwBHADQARwBVAFUARwAZAFUAGQBAADkAVQBAADkAQAAVABMAOwBWABMAVgA2ADsAFAA/ADsAPwBWAFYAPwAYAFYAGABIADYAVgBIADYASAAdAK8s673///++AwAAP68s673///++AwAAP68s673///++AwAAP60s670CAAA/AwAAP60s670CAAA/AwAAP60s670CAAA/AwAAP7As673///++////vrAs673///++////vrAs670BAAA/////vrAs670BAAA/////vjtQmD+qqiq/q6oqvztQmD+qqiq/q6oqvztQmD+rqio/qqoqvztQmD+rqio/qqoqvzxQmD+qqiq/raoqPzxQmD+qqiq/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AACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8AAAAAAACAPwAAAAAAAIA/AAAAAAAAgD8KAAwACABEAEEARgBPAEwAUgAlACcAIgAdAB8AGgAaAB8AIgAaACIAGAATABUADwBGAEEATABGAEwASQBjAEwAQQBjAEEAYABmAFIATABmAEwAYwBnAFQAUgBnAFIAZgBoAFYAVABoAFQAZwBpAFgAVgBpAFYAaABqAFoAWABqAFgAaQBrAAIAWgBrAFoAagBsACcAAgBsAAIAawBtACIAJwBtACcAbABuABgAIgBuACIAbQBvABUAGABvABgAbgBwAA8AFQBwABUAbwBxAAwADwBxAA8AcABdAAgADABdAAwAcQB0AF0AcQB0AHEAgQCBAHEAcACBAHAAgACAAHAAbwCAAG8AfwB/AG8AbgB/AG4AfgB+AG4AbQB+AG0AfQB9AG0AbAB9AGwAfAB8AGwAawB8AGsAewB7AGsAagB7AGoAegB6AGoAaQB6AGkAeQB5AGkAaAB5AGgAeAB4AGgAZwB4AGcAdwB3AGcAZgB3AGYAdgA7AHcAdgA7AHYAPgA5AHgAdwA5AHcAOwA3AHkAeAA3AHgAOQA1AHoAeQA1AHkANwAzAHsAegAzAHoANQAxAHwAewAxAHsAMwAvAH0AfAAvAHwAMQAtAH4AfQAtAH0ALwArAH8AfgArAH4ALQApAIAAfwApAH8AKwAEAIEAgAAEAIAAKQAGAHQAgQAGAIEABACMAIoAjgDFAMcAwgDPANIAzAClAKIAqACdAJsAoACbAJgAogCbAKIAoACTAJAAlgDHAMoAzADHAMwAwgDjAOAAwgDjAMIAzADmAOMAzADmAMwA0gDpAOYA0gDpANIA1QDqAOkA1QDqANUA1wDrAOoA1wDrANcA2QDsAOsA2QDsANkA2wDtAOwA2wDtANsAggDuAO0AggDuAIIAqADvAO4AqADvAKgAogDwAO8AogDwAKIAmADxAPAAmADxAJgAlgDyAPEAlgDyAJYAkADzAPIAkADzAJAAjgDeAPMAjgDeAI4AigD1AAMB8wD1APMA3gADAQIB8gADAfIA8wACAQEB8QACAfEA8gABAQAB8AABAfAA8QAAAf8A7wAAAe8A8AD/AP4A7gD/AO4A7wD+AP0A7QD+AO0A7gD9APwA7AD9AOwA7QD8APsA6wD8AOsA7AD7APoA6gD7AOoA6wD6APkA6QD6AOkA6gD5APcA5gD5AOYA6QC9AL8A9wC9APcA+QC7AL0A+QC7APkA+gC5ALsA+gC5APoA+wC3ALkA+wC3APsA/AC1ALcA/AC1APwA/QCzALUA/QCzAP0A/gCxALMA/gCxAP4A/wCvALEA/wCvAP8AAAGtAK8AAAGtAAABAQGrAK0AAQGrAAEBAgGGAKsAAgGGAAIBAwGIAIYAAwGIAAMB9QAFAAMAhQAFAIUAhwAJAAcAiQAJAIkAiwAQAA0AjwAQAI8AkgAUABIAlQAUAJUAlwByAAUAhwByAIcA9AANAAsAjQANAI0AjwARAA4AkQARAJEAlAAXABQAlwAXAJcAmgAZABYAmQAZAJkAnAAbABkAnAAbAJwAngAeABwAnwAeAJ8AoQAhAB4AoQAhAKEApAAjACAAowAjAKMApgAmACQApwAmAKcAqQAAACYAqQAAAKkAgwADACgA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WACsAKwAWAACAKwAAgBIAGUArABIAGUASAAJABMAZgCtABMArQBWAGYAGgBlAGYAZQCtAK0AZQAJAK0ACQBGAFYArQBGAFYARgAAABEAVACuABEArgBsAFQABwBNAFQATQCuAK4ATQAMAK4ADABtAGwArgBtAGwAbQAfAB8AbQCvAB8ArwBuAG0ADABLAG0ASwCvAK8ASwAEAK8ABABZAG4ArwBZAG4AWQAWAPwA9gBxAPwAcQCwABMAVgDwABMA8ADxADgAoQAdADgAHQBzAPYA9wCyAPYAsgBxAPcA+gDpAPcA6QCyAP4A+AC0AP4AtAAiAPkA/QBvAPkAbwC1ACsAiAAgACsAIADjAKEAKwB3AKEAdwDeAFEAxgDcAFEA3ABpAP0A/ACwAP0AsABvAIgAEwB5AIgAeQAgAB4AbgC4AB4AuACFAG4AFgCEAG4AhAC4ALgAhAAuALgALgCCAIUAuACCAIUAggAxABEAawC5ABEAuQCHAGsAHgCFAGsAhQC5ALkAhQAxALkAMQCBAIcAuQCBAIcAgQApABkAZwC6ABkAugCJAGcAEwCIAGcAiAC6ALoAiAArALoAKwCAAIkAugCAAIkAgAAwABUAYwC7ABUAuwCDAGMAGQCJAGMAiQC7ALsAiQAwALsAMAB/AIMAuwB/AIMAfwAtABgAXwC8ABgAvACKAF8AEACGAF8AhgC8ALwAhgAoALwAKAB7AIoAvAB7AIoAewAvAMwAYQC9AMwAvQDKAGEAGACKAGEAigC9AL0AigAvAL0ALwB9AMoAvQB9AMoAfQDIAC8AewC+AC8AvgCcAHsAKACaAHsAmgC+AL4AmgA0AL4ANACOAJwAvgCOAJwAjgA+ADEAggC/ADEAvwCfAIIALgCeAIIAngC/AL8AngA7AL8AOwCYAJ8AvwCYAJ8AmABCADAAgADAADAAwACjAIAAKwChAIAAoQDAAMAAoQA4AMAAOACUAKMAwACUAKMAlABAACcAfQDBACcAwQClAH0ALwCcAH0AnADBAMEAnAA+AMEAPgCQAKUAwQCQAKUAkAAzACkAgQDCACkAwgCbAIEAMQCfAIEAnwDCAMIAnwBCAMIAQgCWAJsAwgCWAJsAlgA1AC0AfwDDAC0AwwCdAH8AMACjAH8AowDDAMMAowBAAMMAQACSAJ0AwwCSAJ0AkgA6AIwAygDIAIwAyADEAA8AzADKAA8AygCMAIwAxADQAIwA0ADPAM8A0ADTAA8AjADXAA8A1wDWANYA1wDaAHMAHQDhAN4AdwDnAGkA3ADsAPEA8AD0AEUACAD8AEUA/AD9AAEARQD9AAEA/QD5AFYAAAD4AFYA+AD+AAUAUQD6AAUA+gD3AEQABQD3AEQA9wD2AAgARAD2AAgA9gD8AAEBRwGoAQEBqAFJAUkBqAFcAUkBXAEKAagBXwEZAagBGQFcAUcBCAFfAUcBXwGoAQoBXAGpAQoBqQFLAUsBqQFMAUsBTAEDAakBXQELAakBCwFMAVwBGQFdAVwBXQGpARkBXgGqARkBqgFdAV0BqgFOAV0BTgELAaoBUAEGAaoBBgFOAV4BDQFQAV4BUAGqAQgBRgGrAQgBqwFfAV8BqwFeAV8BXgEZAasBUQENAasBDQFeAUYBBQFRAUYBUQGrAQUBUwGsAQUBrAFRAVEBrAFgAVEBYAENAawBYwEaAawBGgFgAVMByAFjAVMBYwGsAQ0BYAGtAQ0BrQFQAVABrQFVAVABVQEGAa0BYQEQAa0BEAFVAWABGgFhAWABYQGtARwBZwGuARwBrgFmAWYBrgFaAWYBWgEXAa4BSgECAa4BAgFaAWcBCQFKAWcBSgGuARUBWAGvARUBrwFoAWgBrwFnAWgBZwEcAa8BSAEJAa8BCQFnAVgBAAFIAVgBSAGvAREBbgGwAREBsAFWAVYBsAFPAVYBTwEHAbABbwEMAbABDAFPAW4BIQFvAW4BbwGwASEBcAGxASEBsQFvAW8BsQFNAW8BTQEMAbEBWwEEAbEBBAFNAXABGAFbAXABWwGxAf4BswF0Af4BdAH4ARUB8wHyARUB8gFYAToBdQEeAToBHgGjAfgBdAG1AfgBtQH5AfkBtQHsAfkB7AH8AQACJQG4AQACuAH6AfsBuQFyAfsBcgH/AS0B5QEiAS0BIgGKAaMB4AF5AaMBeQEtAVMBbAHeAVMB3gHIAf8BcgGzAf8BswH+AYoBIgF7AYoBewETASABhwG6ASABugFwAXABugGGAXABhgEYAboBhAEwAboBMAGGAYcBMwGEAYcBhAG6AREBiQG7AREBuwFtAW0BuwGHAW0BhwEgAbsBgwEzAbsBMwGHAYkBKwGDAYkBgwG7ARsBiwG8ARsBvAFpAWkBvAGKAWkBigEUAbwBggEtAbwBLQGKAYsBMgGCAYsBggG8ARcBhQG9ARcBvQFlAWUBvQGLAWUBiwEbAb0BgQEyAb0BMgGLAYUBLwGBAYUBgQG9ARoBjAG+ARoBvgFhAWEBvgGIAWEBiAEQAb4BfQEqAb4BKgGIAYwBMQF9AYwBfQG+Ac4BzAG/Ac4BvwFjAWMBvwGMAWMBjAEaAb8BfwExAb8BMQGMAcwBygF/AcwBfwG/ATEBngHAATEBwAF9AX0BwAGcAX0BnAEqAcABkAE2AcABNgGcAZ4BQAGQAZ4BkAHAATMBoQHBATMBwQGEAYQBwQGgAYQBoAEwAcEBmgE9AcEBPQGgAaEBRAGaAaEBmgHBATIBpQHCATIBwgGCAYIBwgGjAYIBowEtAcIBlgE6AcIBOgGjAaUBQgGWAaUBlgHCAScBpgHDAScBwwF/AX8BwwGeAX8BngExAcMBkgFAAcMBQAGeAaYBNAGSAaYBkgHDASsBnQHEASsBxAGDAYMBxAGhAYMBoQEzAcQBmAFEAcQBRAGhAZ0BNwGYAZ0BmAHEAS8BnwHFAS8BxQGBAYEBxQGlAYEBpQEyAcUBlAFCAcUBQgGlAZ8BPAGUAZ8BlAHFAY4BxgHKAY4BygHMAQ8BjgHMAQ8BzAHOAY4B0QHSAY4B0gHGAdEB1QHSAQ8B2AHZAQ8B2QGOAdgB3AHZAXUB4gEeAeAB6QF5AWwB7wHeAfMB9gHyAUcB/wH+AUcB/gEIAQEB+wH/AQEB/wFHAVgBAAL6AVgB+gEAAQUB+QH8AQUB/AFTAUYB+AH5AUYB+QEFAQgB/gH4AQgB+AFGAccAYgBkAccAZAHJAe8AVQBXAe8AVwHxASwA5QDnASwA5wEuAaIA3wDhAaIA4QGkAd0AxwDJAd0AyQHfAfsAUgBUAfsAVAH9ARQA8gD0ARQA9AEWAckAfgCAAckAgAHLAY8ANgA4AY8AOAGRAT8AjwCRAT8AkQFBATIAkQCTATIAkwE1AZEAPwBBAZEAQQGTATwAkwCVATwAlQE+AZMAQQBDAZMAQwGVAZUAOQA7AZUAOwGXAUEAlQCXAUEAlwFDATcAlwCZATcAmQE5AZcAQwBFAZcARQGZAZkAPQA/AZkAPwGbAUMAmQCbAUMAmwFFAaQAMgA1AaQANQGnASYApACnASYApwEpAeQAIQAjAeQAIwHmASEAegB8ASEAfAEjASMAtgC2ASMAtgEkAbMA6gDrAbMA6wG0AbcAcABxAbcAcQG3AXAAsQCyAXAAsgFxAbEAcgBzAbEAcwGyAXIAswC0AXIAtAFzAXwAJQAoAXwAKAF+AWAAywDNAWAAzQFiAcUAyQDLAcUAywHHAcsADgAOAcsADgHNAdEAxQDHAdEAxwHTAYsAzQDPAYsAzwGNAdgAjQCPAdgAjwHaAc4A0gDUAc4A1AHQAdQA0QDTAdQA0wHWAQ4A1QDXAQ4A1wEOAdUA2QDbAdUA2wHXAdsA2ADaAdsA2gHdATkAdQB3ATkAdwE7ARsAoACiARsAogEdAeAAHAAfAeAAHwHjAXYAKgAsAXYALAF4AXQA4gDkAXQA5AF2AeYAdgB4AeYAeAHoAVAAaABqAVAAagFSAd8A6ADqAd8A6gHhAWoA7QDuAWoA7gFrAe4A3QDfAe4A3wHwAVcA/wABAlcAAQJZAXgAEgASAXgAEgF6AfMA7wDxAfMA8QH1AfIA9QD3AfIA9wH0AesA+wD9AesA/QHtAf8AJAAmAf8AJgEBAq2qKr9h/4uzr9SiP62qKr9h/4uzr9SiP+x4mT6Ssv4/OObfPex4mT6Ssv4/OObfPex4mT6Ssv4/OObfPQIAgL8A+9+yAAAAgNhqkz62If8/AACgL9hqkz62If8/AACgL62qKj9qqUKzsNSiP+WUyj6Ssv4/OebfPQIAgD8HFIAxAAAAgHCwzT62If8/AADAL7t7F78me4U+/YWTP7t7F78me4U+/YWTP27LZL8qe4U+AABAscISaz8qe4U+AAAgMRDDHT8oe4U+/YWTPxDDHT8oe4U+/YWTP3F9kb73YJA/juM/P3F9kb73YJA/juM/P5T39r73YJA/AABAMO2g/z73YJA/jOM/PwIAgL+ppUqzU0A+Px29kz62If8/7kdqPR29kz62If8/7kdqPQIAgD9TS5WyVEA+P0QQzj62If8/8UdqPcQSaz8pe4U+uV0sP8QSaz8pe4U+uV0sP2/LZL8oe4U+uF0sP5N0MT/3YJA/4TPgPk+l9r73YJA/4DPgPnIOHD53/eo/O3eYPnIOHD53/eo/O3eYPlapiT13/eo/AABgMP9TBT93/eo/AABArwpS6T54/eo/O3eYPgpS6T54/eo/O3eYPqMTBj94/eo/BiQyPqMTBj94/eo/BiQyPqnNjj14/eo/BSQyPq2qKr9h/4uzr9Siv62qKr9h/4uzr9Siv+x4mT6Rsv4/OObfvex4mT6Rsv4/OObfvex4mT6Rsv4/OObfva2qKj9qqUKzsNSiv+WUyj6Rsv4/OObfvbx7F78me4U+/YWTv7x7F78me4U+/YWTvxHDHT8ne4U+/IWTvxHDHT8ne4U+/IWTv3B9kb73YJA/juM/v3B9kb73YJA/juM/v+yg/z72YJA/jOM/v+yg/z72YJA/jOM/vwIAgL+ppUqzU0A+vx29kz62If8/70dqvR29kz62If8/70dqvQIAgD9TS5WyVEA+v0QQzj62If8/8EdqvcQSaz8pe4U+uV0sv8QSaz8pe4U+uV0sv27LZL8oe4U+t10sv5R0MT/4YJA/4TPgvlCl9r72YJA/3zPgvnIOHD53/eo/O3eYvnIOHD53/eo/O3eYvglS6T54/eo/OneYvglS6T54/eo/OneYvqMTBj94/eo/BiQyvqrNjj14/eo/BCQyvllVdb/fKIGz4CaHP3MzhT5VQfs/s8MqPnMzhT5VQfs/s8MqPmt8kz62If8/EAfxPGt8kz62If8/EAfxPPi8eL/w5ow9AAAgMbA7sT5uyP8/AACALuKFeT/15ow9AADAsAIAgD8+GVWx4rrDPpHlzT6sDv8/mdaqPb16Jj/p5ow9HnaePwAAAAAIVXuzT3CsPyYPsj6j+/4/EbfTPSYPsj6j+/4/EbfTPdOxJb/l5ow9H3aeP9OxJb/l5ow9H3aePwhoOr/8yiY/AAAQsUViDj/8yiY/Mvd6P0ViDj/8yiY/Mvd6P4zqSDwme4U+YjqcP8xoYT8pe4U+meR0P8xoYT8pe4U+meR0P23LZL8pe4U+bFSxPkst8b75yiY/Mfd6P0st8b75yiY/Mfd6PwskQb6WAsY/AAAYsYfd8T6VAsY/O2QBP4fd8T6VAsY/O2QBP+jy3D34YJA/HDZLP3xyKz/5YJA/PEUfPwPm9r75YJA/tqhmPgIAgL+VUQ2z4LrDPmL0lD6sDv8/mtaqPWL0lD6sDv8/mtaqPVlVdT8Spwez4SaHPwHFzT62If8/EAfxPMQSaz8qe4U+blSxPnghW78ne4U+l+R0P16p6b73YJA/O0UfP+NiOr/8yiY/KJ0SP4sQUD/8yiY/Kp0SP/e8eL/r5ow9YyU5P+KFeT/v5ow9ZSU5P/NRsT5uyP8/iXg3PX//GD+VAsY/TC6XPv5KP76VAsY/TC6XPnUIUb2WAsY/O2QBP3UIUb2WAsY/O2QBPyl5Wj68T/s/AADgL2Sl6j69T/s/AAAAsOgf2j5VQfs/tMMqPt+46z68T/s/39fFPThSXD69T/s/39fFPfJmqT13/eo/7Rh9Pht9BT93/eo/SkW3PZBYnD55/eo/SXahPv2vBD93/eo/7hh9Pv2vBD93/eo/7hh9PoDCij15/eo/SUW3PVlVdb/fKIGz4CaHv3MzhT5WQfs/s8MqvnMzhT5WQfs/s8Mqvmp8kz62If8/DgfxvGp8kz62If8/DgfxvAIAgD8+GVWx4rrDvpHlzT6sDv8/mtaqvb16Jj/p5ow9HnaevwAAAAAIVXuzT3CsvygPsj6i+/4/EbfTvSgPsj6i+/4/EbfTvdOxJb/l5ow9Hnaev9OxJb/l5ow9Hnaev0ZiDj/7yiY/Mvd6v0ZiDj/7yiY/Mvd6v5jqSDwne4U+Yzqcv81oYT8oe4U+mOR0v27LZL8pe4U+a1Sxvkst8b75yiY/Mvd6v0st8b75yiY/Mvd6v4fd8T6VAsY/O2QBv4fd8T6VAsY/O2QBv+fy3D34YJA/HDZLv3tyKz/4YJA/PUUfvwLm9r74YJA/t6hmvgIAgL+VUQ2z4LrDvmL0lD6sDv8/mdaqvWL0lD6sDv8/mdaqvVlVdT8Spwez4SaHvwHFzT62If8/EAfxvMQSaz8re4U+bVSxvnghW78me4U+mOR0v1yp6b72YJA/PEUfv+RiOr/7yiY/KJ0Sv4oQUD/7yiY/Kp0Sv/a8eL/r5ow9YyU5v+KFeT/u5ow9ZiU5v/NRsT5uyP8/ing3vX//GD+VAsY/TC6Xvv5KP76VAsY/TC6XvnYIUb2VAsY/O2QBv3YIUb2VAsY/O2QBv+of2j5WQfs/tMMqvt646z69T/s/4dfFvTZSXD6+T/s/3tfFvfJmqT15/eo/7Bh9vht9BT95/eo/SkW3vY9YnD54/eo/SXahvv2vBD95/eo/7xh9vv2vBD95/eo/7xh9voHCij14/eo/SUW3vTbeWj68T/s/YopLPf+HLj35yiY/EOOEP0y46j4jTPs/7O4MPqghsD6JSPs/CaEzPl2BsT61rv8/kRmJPajqyDrm5ow9vM+nP3wkbz/r5ow9c4aDP/a8eL/t5ow9Tnq+PhDhRz/8yiY/Ek5QP+9mOr/6yiY/AtaWPu0jMr/6yiY/EU5QP5Jbbr/n5ow9coaDP+KFeT/y5ow9UHq+PnVAsT5wyP8/FcG8PH3g6j68T/s/ZIpLPSvrYz4iTPs/6+4MPtv1K76UAsY/JsvWPp+zWD6WAsY/vgYJP1qOFT+WAsY/JsvWPgG/QL6WAsY/0IgbPjXeWj69T/s/YYpLvQGILj35yiY/EOOEv0u46j4jTPs/7O4MvqghsD6JSPs/CaEzvl2BsT60rv8/kBmJvbDqyDrm5ow9vM+nv30kbz/s5ow9c4aDv/a8eL/u5ow9Tnq+vhHhRz/8yiY/Ek5Qv+9mOr/8yiY/A9aWvu0jMr/6yiY/Ek5Qv5Jbbr/n5ow9coaDv+KFeT/y5ow9UHq+vnVAsT5vyP8/FsG8vH3g6j69T/s/ZIpLvSvrYz4jTPs/6+4Mvtr1K76VAsY/JcvWvp+zWD6VAsY/vgYJv1qOFT+VAsY/J8vWvgC/QL6VAsY/0IgbvpuIp77UKfw+xnNOP5uIp77UKfw+xnNOPw780r20BHU/QaiKPg780r20BHU/QaiKPg780r20BHU/QaiKPhKsbL8fKsM+ZF0Bsgrwbb5B/ng/jOFFtArwbb5B/ng/jOFFtGSMpj5YYvY+DmNQPycbAz75N3Q/ataKPqdEcD+Dt7A+Z7QvsoQukT4VfnU/sqVatFGIpb7Owew+sVtTP1GIpb7Owew+sVtTPwd3bL+kKsQ+12SCs0pidj+aAos+tun4svn2qD5dCNs+/2pXP/n2qD5dCNs+/2pXP91xm75CNw0/UuFGP91xm75CNw0/UuFGP8YJW7/3gQQ/HRQNtPbGpT5uEe8+oahSP2c8ar/5fMs+xJWOPScNar4PJnk/RSPDPCcNar4PJnk/RSPDPFLpbT8ohLk+D1mRPf8jjz4LyXU/mYLnOxDFdD+qdpI+0TWBPRDFdD+qdpI+0TWBPSWZar/vlso+3mB3Pelxdz9HeH8+0I5xPc2KWL+Rsgc/DohzPYjnc74f1jk/xiwlP4jnc74f1jk/xiwlPwpWNL80szU/PEwxtJ0ecD/XhbE+hAuLND4DnT4GTSM/ydg0Pz4DnT4GTSM/ydg0P3j0bj96Mrc+lpTZPHj0bj96Mrc+lpTZPMQtML9t/jg/W3+EPZyIp77UKfw+xXNOv5yIp77UKfw+xXNOv9L70r21BHU/NaiKvtL70r21BHU/NaiKvtL70r21BHU/NaiKvmOMpj5TYvY+EGNQvy8bAz76N3Q/UNaKvlOIpb7Mwew+sFtTv1OIpb7Mwew+sFtTvwH3qD5bCNs+/2pXvwH3qD5bCNs+/2pXv9xxm75ENw0/UOFGv9xxm75ENw0/UOFGv/nGpT5sEe8+oahSv/nGpT5sEe8+oahSv2U8ar8Efcs+x5WOvaIMar4WJnk/jyPDvKIMar4WJnk/jyPDvFPpbT8jhLk+ElmRvZMjjz4byXU/p4bnuxHFdD+rdpI+xjWBvRHFdD+rdpI+xjWBvSWZar/tlso+3WB3velxdz9LeH8+F49xvcyKWL+Psgc/7odzvVHnc74a1jk/zywlv1Hnc74a1jk/zywlvxoDnT4GTSM/0tg0vxoDnT4GTSM/0tg0v3r0bj9xMrc+ApXZvM4tML9n/jg/zn6EvcyVPb+vRPg+2DHuPpz4Nr4ZEVw/phD1Ppz4Nr4ZEVw/phD1Pm4Pbr4O/Hg/XcZMO24Pbr4O/Hg/XcZMO+HvbL/t38E+inqKs4vA+jrh/38/uZObtfwQcz/WrqA+mltQs6dEcD+Et7A+AAAAgO7Cdj78S3c/cMO/PW5DpT75zeo+WvRTP3hxm7p7Ke4+J55iP3kEizqljHc/0HaCPnkEizqljHc/0HaCPsd6pL6yzfQ++0JRP8d6pL6yzfQ++0JRP1fFZ791bNk+w5mCMb1GqD5ScN0+7O9WP71GqD5ScN0+7O9WP6XBtrmtfdk+TsFnP8ibTD/t7sQ+AXDsPsibTD/t7sQ+AXDsPll2bL/qLcQ+E3ABONqXo77ttfg+/0dQP9qXo77ttfg+/0dQP7vqSL8/pR4/WSyttLE5pD5Z7gY/Y3ZJP7E5pD5Z7gY/Y3ZJPw+jw7qrPfs+IA9fP7JSTT+s6sI+L6HrPnb0Wr/1pAQ/dW3mOhCsbL8nKsM+AAAAgMwHRr7aink/TzDkPcwHRr7aink/TzDkPZTuPz+OUOs+4cLzPvkYkT6ggHU/N2WOu+didj84/oo+J6ceuKzlQ7/Cp+8+4UniPjznM79INhU/gd7QPtO/Zb8Nv98+e511PU0mdj8B7Ig+Ft2APXUBa7/dt8g+lP91PQg9cT/vYqg+bsF9PVBSrjpR+n8/96NWPGqPdz/qMIA+B3c+Pa2RRb+TByI/gGp8PcDUjL4xSSI/Bgs5P8DUjL4xSSI/Bgs5P6TEBb9MRVo/XujmNAx1Nz9UjDI/12geNeqFdz7nbVM/pWYCPyCpNj9/WjM/sfLsO683A78gc1s/40BKPct/Db/e2EI/2sOtPiVncD8x1K8+8hlrvDHWkzuCtys/8tw9P1fmRD8hDAQ//y7BPlfmRD8hDAQ//y7BPgYKNL/K+jU/u4YTPM+VPb+iRPg+4zHuvkL4Nr4bEVw/qBD1vkL4Nr4bEVw/qBD1vggPbr4T/Hg/H75MuwgPbr4T/Hg/H75Mu6dEcD+Et7A+dyTXsnnCdj4CTHc/CMS/vW5DpT74zeo+W/RTv6Fxm7qRKe4+Ip5ivzkEizqljHc/0XaCvjkEizqljHc/0XaCvsh6pL6zzfQ++UJRv8h6pL6zzfQ++UJRv79GqD5PcN0+6u9Wv79GqD5PcN0+6u9Wv5y6trmnfdk+TsFnv8qbTD/s7sQ+/G/svll2bL/oLcQ+CuYBuN6Xo77stfg+/kdQv96Xo77stfg+/kdQv6w5pD5W7gY/ZXZJv6w5pD5W7gY/ZXZJv3Whw7qvPfs+IA9fv7JSTT+r6sI+MqHrvnb0Wr/3pAQ/9Wzmug6sbL8pKsM+PsiqstIHRr7Yink/sjDkvdIHRr7Yink/sjDkvZPuPz+BUOs+6MLzvosYkT6wgHU/dmmOO+didj84/oo+BI0eOK3lQ7/Gp+8+4knivj3nM79JNhU/f97QvtK/Zb8Nv98+j511vU0mdj8D7Ig+H92AvXIBa7/ht8g+fv91vQk9cT/uYqg+Z8F9vXQ3rjpR+n8/oKJWvGuPdz/qMIA+AXc+vbGRRb+QByI/52l8vbnUjL4uSSI/CQs5v7nUjL4uSSI/CQs5v7+Fdz7vbVM/n2YCvw6pNj+QWjM/Tvrsu7g3A78cc1s/PkBKvcl/Db/g2EI/2sOtviRncD831K8+oRhrPMHUkzt+tys/99w9v1PmRD8mDAQ/Bi/BvlPmRD8mDAQ/Bi/BvggKNL/H+jU/AIYTvA6iBb/QV1o/mz4IPAXZjrrr/+A+tfRlP74YHT8GDEE/hKZvPk0JvDtED1Y/i2YMP0PHgDo3Tn8/x7yWPVS8WrpEqeQ+HQ1lP1KCSD9ZtNo+NUvnPuDvbL/w38E+AAAAgO5OTT/gGMA+EPztPva/Z79ig9k++YC8OXbLP79tWQA/9prdPtW7Q7+UIvI+dzTgPv0Qcz/UrqA+A7NMsylY6Drm/38/6uNsuP2qNz+3TDI/LFFXvDP82L51OF8/NgN7PnvQIb9dZC0/zb3APhYfRzovmBA/HUFTP10wTT946tA+z83fPgi4SL8L5B4/XjekOweiBb/WV1o/yTwIvJ7Wjrrr/+A+tfRlv7YYHT8NDEE/eKZvvnYIvDtJD1Y/g2YMvx+6gDo0Tn8/6L2Wvfi8WrpJqeQ+HQ1lv1OCSD9TtNo+M0vnvuDvbL/w38E+mMims+9OTT/hGMA+Dvztvva/Z79kg9k+Zn28uXTLP79tWQA/9prdvtS7Q7+SIvI+ejTgvv0Qcz/VrqA+5wMZM3lC6Drl/38/vGVsOOuqNz/MTDI/iFFXPC782L52OF8/LQN7vnzQIb9cZC0/yb3AvlMoRzovmBA/HkFTv1cwTT946tA+3s3fvgm4SL8L5B4/tzekuwIAwD4AAAC0AgDAPgAAgD8BACA/AAAAtAEAID8AAIA/AgBgP/j/fz4CAMA+AABAPwEAID8AAEA/AgBgP/7//z4AAMA+AACAPgAAID8AAIA+AgDAPv7//z4AACA/AAAAPx0uxj4AAAAAHS7GPgAAgD8eLsY+AABAPx4uxj4AAAA/2HHOPjgBaD7Ycc4+PAFoPpDy/T4AAIAzkvL9PgAAgD+U8v0+AABAP9wd/z44AWg+AADAPh/+Yz8AACA/H/5jPwAAYD/EA7g+AADAPsQDuD7mZCo/LK26Pthxzj4qrbo+2XHOPiytuj7Ycc4+aqliP90d/z4qrbo+2x3/PmqpYj9bXR4/AACAP1xdHj8AAAAAW10ePwAAQD9cXR4/AAAAP8lnGT88AWg+ymcZPzwBaD7KZxk/Lq26PstnGT8srbo+yWcZP2qpYj8CAMA+AAAAtAIAwD4AAIA/AQAgPwAAALQBACA/AACAPwIAYD/4/38+AADAPgAAgD4AACA/AACAPh0uxj4AAAAAHS7GPgAAgD/Xcc4+OAFoPthxzj48AWg+kPL9PgAAgDOS8v0+AACAP9sd/z44AWg+3R3/PjwBaD4AAMA+H/5jPwAAID8f/mM/AABgP8QDuD4AAMA+xAO4PuVkKj8srbo+2HHOPiytuj7Zcc4+LK26Ptlxzj5qqWI/3R3/Piqtuj7bHf8+aqliP1tdHj8AAIA/XF0ePwAAAADJZxk/QAFoPstnGT9AAWg+y2cZPyytuj7LZxk/aqliPwEAwD4Q/3E/ry4fPwAAALSvLh8/AACAPwEAID8P/1E/AgBgP+AB3D4QF8M+AABAPwIAQD/+//8+EBfDPv7//z4BAMA+4AHcPiiHKT8SF5w+hh/EPiABaj4BAMA++P//PQEAID/4//89AQBAP/z/fz4QF8M+AAAAtBAXwz4AAIA/WxDiPgAAQD87PuM+OAFoPjs+4z48AWg+h8HNPjgA+j3Ycc4+HteaPtlxzj4e15o+icHNPnjUUT9YEOI+AAAAtFoQ4j4AAIA/U6sOPwAAQD9VHw4/PAFoPlYfDj88AWg+6wT/PjgA+j3eHf8+INeaPusE/z541FE/AQDAPg//UT8BACA/D/9xPwIAYD/eAZw+AQDAPt4BnD4ohyk/DlfcPonBzT4MV9w+iMHNPnnUcT/rBP8+edRxPzk+4z5qqWI/Oz7jPiatuj6HH8Q+zsViP4gfxD5kdLo+nUxBP2R0uj5XHw4/Jq26PlUfDj9qqWI/U6sOPwAAALRTqw4/AACAP68uHz8AAEA/ry4fP/7//z5sxx4/JAFqPpncHz8urbo+/Y8eP87FYj+W0Rk/edRxP5bRGT8OV9w+l9EZP0AA+j3KZxk/INeaPspnGT8k15o+l9EZP3nUUT8BAMA+EP9xP68uHz8AAAC0ry4fPwAAgD8BACA/D/9RPwIAYD/gAdw+AQDAPuAB3D4nhyk/EhecPocfxD4kAWo+AQDAPvj//z0BACA/+P//PQEAQD/8/38+EBfDPgAAALQQF8M+AACAPzo+4z44AWg+Oz7jPjgBaD6Hwc0+OAD6Pdhxzj4g15o+icHNPnjUUT9YEOI+AAAAtFoQ4j4AAIA/Vh8OPzwBaD5XHw4/QAFoPuoE/z44APo93h3/PiDXmj7rBP8+eNRRPwEAwD4P/1E/AQAgPw//cT8CAGA/3gGcPgEAwD7eAZw+J4cpPw5X3D6Jwc0+DFfcPonBzT551HE/6wT/PnnUcT86PuM+aqliPzs+4z4orbo+iB/EPs7FYj+IH8Q+ZHS6Pp1MQT9idLo+Vx8OPyqtuj5VHw4/aqliP1OrDj8AAAC0U6sOPwAAgD9txx4/KAFqPprcHz8srbo++48eP87FYj+W0Rk/edRxP5fRGT8OV9w+l9EZP0AA+j3JZxk/JNeaPstnGT8i15o+ltEZP3jUUT9vqh4/kttRP+gL4z44APo9K6UfPyAXmz5wqh4/MAD7PS0VQT/aSJw+c/PDPjAA+z2HH8Q+7AibPnTzwz6S21E/OT7jPh7Xmj7qC+M+eNRRP+kL4z551HE/cvPDPpLbcT9z88M+3EjcPi4VQT/aSNw+nb8fPw5X3D5vqh4/kttxP6o2Dj951HE/qzYOPzgA+j1XHw4/HteaPqs2Dj941FE/b6oeP5LbUT/oC+M+QAD6PSulHz8gF5s+b6oePzAA+z0tFUE/3EicPnPzwz4wAPs9iB/EPuoImz5z88M+kttRPzo+4z4c15o+6gvjPnjUUT/pC+M+edRxP3Pzwz6S23E/dPPDPtxI3D4tFUE/2kjcPpy/Hz8OV9w+b6oeP5LbcT+qNg4/edRxP6o2Dj9AAPo9Vx8OPx7Xmj6rNg4/eNRRPygAfAC2ACgAtgCCAHwAFwBLAHwASwC2ALYASwAGALYABgB4AIIAtgB4AIIAeAAiABEAWQC3ABEAtwBbAFkAFQBkAFkAZAC3ALcAZAASALcAEgBfAFsAtwBfAFsAXwAMACcAewC4ACcAuACAAHsAGgBRAHsAUQC4ALgAUQAJALgACQB6AIAAuAB6AIAAegAlACUAegC5ACUAuQB/AHoACQBUAHoAVAC5ALkAVAACALkAAgBJAH8AuQBJAH8ASQAhABoAcwC6ABoAugBRAHMAGABpAHMAaQC6ALoAaQAEALoABABVAFEAugBVAFEAVQAJAAgAUgC7AAgAuwBTAFIAEQBbAFIAWwC7ALsAWwAMALsADABWAFMAuwBWAFMAVgAAABkAcgC8ABkAvABqAHIAHABcAHIAXAC8ALwAXAARALwAEQBSAGoAvABSAGoAUgAIABYAcQC9ABYAvQBnAHEAHQBeAHEAXgC9AL0AXgAOAL0ADgBNAGcAvQBNAGcATQAFABsAcAC+ABsAvgBdAHAAHgBlAHAAZQC+AL4AZQAVAL4AFQBaAF0AvgBaAF0AWgAQAB0AbwC/AB0AvwBeAG8AHwBmAG8AZgC/AL8AZgAUAL8AFABYAF4AvwBYAF4AWAAOAA0AYADAAA0AwABtAGAAEwBuAGAAbgDAAMAAbgAfAMAAHwBvAG0AwABvAG0AbwAdAAEAVwDBAAEAwQBIAFcADQBtAFcAbQDBAMEAbQAdAMEAHQBxAEgAwQBxAEgAcQAWAAoATwDCAAoAwgBQAE8ADwBsAE8AbADCAMIAbAAcAMIAHAByAFAAwgByAFAAcgAZAAsATgDDAAsAwwBrAE4ABwBMAE4ATADDAMMATAAYAMMAGABzAGsAwwBzAGsAcwAaACMAeQDEACMAxAB+AHkACwBrAHkAawDEAMQAawAaAMQAGgB7AH4AxAB7AH4AewAnACAASgDFACAAxQB9AEoAAwBoAEoAaADFAMUAaAAXAMUAFwB8AH0AxQB8AH0AfAAoABMAdwDGABMAxgBuAHcAIAB9AHcAfQDGAMYAfQAoAMYAKAB1AG4AxgB1AG4AdQAfABUAYwDHABUAxwBkAGMAJQB/AGMAfwDHAMcAfwAhAMcAIQB2AGQAxwB2AGQAdgASAB4AdADIAB4AyABlAHQAJgCBAHQAgQDIAMgAgQAkAMgAJABiAGUAyABiAGUAYgAVAB8AdQDJAB8AyQBmAHUAKACCAHUAggDJAMkAggAiAMkAIgBhAGYAyQBhAGYAYQAUAEcAtQDKAEcAygCvALUAIgB4ALUAeADKAMoAeAAGAMoABgCGAK8AygCGAK8AhgA5ADMAkgDLADMAywCQAJIAMACVAJIAlQDLAMsAlQA0AMsANACZAJAAywCZAJAAmQA3AEYAtADMAEYAzACuALQARQCtALQArQDMAMwArQAvAMwALwCJAK4AzACJAK4AiQA8AEUAsgDNAEUAzQCtALIAQwCEALIAhADNAM0AhAArAM0AKwCMAK0AzQCMAK0AjAAvADwAiQDOADwAzgCoAIkALwCNAIkAjQDOAM4AjQAtAM4ALQCeAKgAzgCeAKgAngA6AC4AiwDPAC4AzwCKAIsAKQCOAIsAjgDPAM8AjgAwAM8AMACSAIoAzwCSAIoAkgAzADsAnwDQADsA0ACnAJ8ALgCKAJ8AigDQANAAigAzANAAMwCTAKcA0ACTAKcAkwA+ADgAnADRADgA0QCmAJwABQBNAJwATQDRANEATQAOANEADgCUAKYA0QCUAKYAlAA/AD0AkwDSAD0A0gClAJMAMgCRAJMAkQDSANIAkQA2ANIANgCaAKUA0gCaAKUAmgBAAD8AlADTAD8A0wCkAJQADgBYAJQAWADTANMAWAAUANMAFACbAKQA0wCbAKQAmwBBADEAogDUADEA1ACWAKIAPwCkAKIApADUANQApABBANQAQQCjAJYA1ACjAJYAowA1ACoAgwDVACoA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XQDCAE8AXQBPABIAAABRAMMAAADDAFgAUQAIAFcAUQBXAMMAwwBXAA8AwwAPAFMAWADDAFMAWABTAA0AAwBaAMQAAwDEAFUAWgAQAF0AWgBdAMQAxABdABIAxAASAFwAVQDEAFwAVQBcAAsAEwBkAMUAEwDFAEgAZAAYAF4AZABeAMUAxQBeABEAxQARAFsASADFAFsASABbAAEAAABHAMYAAADGAF8ARwAQAGMARwBjAMYAxgBjABgAxgAYAGQAXwDGAGQAXwBkABMAAABfAMcAAADHAFEAXwATAGUAXwBlAMcAxwBlABYAxwAWAGEAUQDHAGEAUQBhAAcAGQBtAMgAGQDIAGkAbQAeAGYAbQBmAMgAyABmABcAyAAXAE4AaQDIAE4AaQBOAAYAEABZAMkAEADJAGMAWQACAEoAWQBKAMkAyQBKABQAyQAUAGcAYwDJAGcAYwBnABgACABhAMoACADKAEsAYQAVAGwAYQBsAMoAygBsAB8AygAfAG4ASwDKAG4ASwBuABsACABLAMsACADLAFcASwAaAG8ASwBvAMsAywBvAB0AywAdAFIAVwDLAFIAVwBSAA8AFgBMAMwAFgDMAGwATAAJAGoATABqAMwAzABqABwAzAAcAHAAbADMAHAAbABwAB4AEgBPAM0AEgDNAHYATwANAHcATwB3AM0AzQB3ACEAzQAhAHEAdgDNAHEAdgBxACQACwBcAM4ACwDOAHgAXAASAHYAXAB2AM4AzgB2ACQAzgAkAHQAeADOAHQAeAB0ACAAHQBrAM8AHQDPAHkAawAOAHoAawB6AM8AzwB6ACIAzwAiAHUAeQDPAHUAeQB1ACUADwBSANAADwDQAHsAUgAdAHkAUgB5ANAA0AB5ACUA0AAlAHIAewDQAHIAewByACMADQBTANEADQDRAHcAUwAPAHsAUwB7ANEA0QB7ACMA0QAjAHMAdwDRAHMAdwBzACEAIwByANIAIwDSAIAAcgAlAIEAcgCBANIA0gCBACkA0gApAH8AgADSAH8AgAB/ACcAJABxANMAJADTAIIAcQAhAIMAcQCDANMA0wCDACYA0wAmAHwAggDTAHwAggB8ACgAJgCFANQAJgDUAH0AhQAnAH4AhQB+ANQA1AB+ACkA1AApAIQAfQDUAIQAfQCEACgAOgCaANUAOgDVAKMAmgA1AIkAmgCJANUA1QCJAAQA1QAEAGAAowDVAGAAowBgABQAPgCiANYAPgDWAKoAogAXAGIAogBiANYA1gBiAAoA1gAKAIwAqgDWAIwAqgCMADwAOwCpANcAOwDXAKQAqQA9AKYAqQCmANcA1wCmAA4A1wAOAFYApADXAFYApABWAAYAOAChANgAOADYAIgAoQA5AIsAoQCLANgA2ACLAC8A2AAvAI4AiADYAI4AiACOAC0ANACZANkANADZAIYAmQA2AI0AmQCNANkA2QCNADEA2QAxAJQAhgDZAJQAhgCUACwAKgCUANoAKgDaAI8AlAAwAJIAlACSANoA2gCSADIA2gAyAJMAjwDaAJMAjwCTAC4AAwBUANsAAwDbAJYAVAAMAJgAVACYANsA2wCYADYA2wA2AJkAlgDbAJkAlgCZADMAOACIANwAOADcAJ8AiAAtAJcAiACXANwA3ACXADUA3AA1AJoAnwDcAJoAnwCaADoALACbAN0ALADdAIcAmwA3AKAAmwCgAN0A3QCgADoA3QA6AJ4AhwDdAJ4AhwCeADQAKwCQAN4AKwDeAJsAkAAuAJwAkACcAN4A3gCcADkA3gA5AKEAmwDeAKEAmwChADgAOwCkAN8AOwDfAKgApAAFAE4ApABOAN8A3wBOABcA3wAXAKIAqADfAKIAqACiAD4AMwCdAOAAMwDgAJUAnQA6AKMAnQCjAOAA4ACjABQA4AAUAEoAlQDgAEoAlQBKAAMALgCKAOEALgDhAJwAigA7AKgAigCoAOEA4QCoAD4A4QA+AKcAnADhAKcAnACnADkALgCTAOIALgDiAIoAkwAyAJEAkwCRAOIA4gCRAD0A4gA9AKkAigDiAKkAigCpADsAOQCnAOMAOQDjAIsApwA+AKoApwCqAOMA4wCqADwA4wA8AKUAiwDjAKUAiwClAC8ANgCwAOQANgDkAI0AsABBAKsAsACrAOQA5ACrAD8A5AA/ALEAjQDkALEAjQCxADAADAB4AOUADADlAJgAeAAgAK4AeACuAOUA5QCuAEEA5QBBALAAmADlALAAmACwADYAPQCyAOYAPQDmAKYAsgBCAK8AsgCvAOYA5gCvACIA5gAiAHoApgDmAHoApgB6AA4AMgCzAOcAMgDnAJEAswBAAKwAswCsAOcA5wCsAEIA5wBCALIAkQDnALIAkQCyAD0AMACxAOgAMADoAJIAsQA/AK0AsQCtAOgA6ACtAEAA6ABAALMAkgDoALMAkgCzADIAQAC4AOkAQADpAKwAuABEALcAuAC3AOkA6QC3AEYA6QBGALkArADpALkArAC5AEIAQQC6AOoAQQDqAKsAugBFALUAugC1AOoA6gC1AEMA6gBDALsAqwDqALsAqwC7AD8AQwC0AOsAQwDrAL0AtABFALwAtAC8AOsA6wC8AEYA6wBGALYAvQDrALYAvQC2AEQA\"\n        }\n    ]\n}\n";

  var vertShader = "in vec4 POSITION;\nin vec4 NORMAL;\nin vec2 TEXCOORD_0;\n\nuniform mat4 u_projMatrix;\nuniform mat4 u_objMatrix;\nuniform mat3 u_normalMatrix;\nuniform float u_fcoef;\nuniform float u_time;\nuniform vec4 u_color;\n\nout vec3 v_normal;\nout vec3 v_position;\nout vec2 v_texcoord;\n\nconst float NOISE_SCALE = 2.0;\nconst float NOISE_AMOUNT = 0.01;\nconst float TIME_ROUND = 0.25;\n\nfloat roundTo(float n, float increment) {\n    return floor(n / increment) * increment;\n}\n\nvoid main () {\n    v_normal = normalize(u_normalMatrix * NORMAL.xyz);\n    vec3 world_pos = (u_objMatrix * POSITION).xyz;\n    vec3 noise = vec3(\n        snoise(vec4(world_pos.xyz * NOISE_SCALE, 10.0 * roundTo(u_time, TIME_ROUND))) * NOISE_AMOUNT,\n        snoise(vec4(world_pos.xyz * NOISE_SCALE, 10.0 * roundTo(u_time + 10.0, TIME_ROUND))) * NOISE_AMOUNT,\n        snoise(vec4(world_pos.xyz * NOISE_SCALE, 10.0 * roundTo(u_time + 20.0, TIME_ROUND))) * NOISE_AMOUNT\n    );\n    vec3 noisy_pos = world_pos + noise;\n    gl_Position = u_projMatrix * vec4(noisy_pos, 1.0);\n    vec4 non_noisy_position = u_projMatrix * vec4(world_pos, 1.0);\n\n    //gl_Position.z = log2(max(1e-6, 1.0 + gl_Position.w)) * u_fcoef - 1.0;\n    // gl_Position.zw = non_noisy_position.zw;\n    v_position = world_pos;\n    v_texcoord = TEXCOORD_0;\n}";

  var fragShader = "uniform vec4 u_color;\nuniform bool u_flip;\nuniform bool u_useTexture;\nuniform sampler2D u_texture;\n\nin vec3 v_normal;\nin vec3 v_position;\nin vec2 v_texcoord;\n\nlayout(location=0) out vec4 fragColor;\nlayout(location=1) out uvec4 mat_index;\nlayout(location=2) out vec4 out_normal;\n\nconst float GAMMA = 2.2;\nconst float GAMMA_INV = 1.0 / GAMMA;\n\nvoid main () {\n    vec3 normal = (gl_FrontFacing ^^ u_flip) ? v_normal : v_normal * vec3(-1.0);\n    float lambert = dot(normal, normalize(vec3(1.0, 1.0, 1.0)));\n    float mul = lambert > 0.0 ? 1.0 : 0.75;\n\n    if (u_useTexture) {\n        fragColor = texture(u_texture, v_texcoord) * vec4(vec3(mul), 1.0);\n    } else {\n        vec4 gammaCorrected = vec4(\n            pow(u_color.x, GAMMA_INV),\n            pow(u_color.y, GAMMA_INV),\n            pow(u_color.z, GAMMA_INV),\n            u_color.w\n        );\n\n        fragColor = gammaCorrected * vec4(vec3(mul), 1.0);\n    }\n    mat_index.r = (uint(floor(u_color.x * 255.0)) << 16) + (uint(floor(u_color.y * 255.0)) << 8) + uint(floor(u_color.z * 255.0));\n    out_normal = vec4((normal * 0.5) + 0.5, 0.0);\n}";

  const mainCanvas = document.getElementById('main');

  const renderer = new Renderer(mainCanvas, 600, 600);

  const shader = new Shader(renderer.gl, vertShader, fragShader);

  const brainImporter = new GLTFImporter(renderer, fumoData, shader);
  const items = brainImporter.importScene(0);

  const root = new Item3D(renderer);
  for (const item of items) {
  	root.appendChild(item);
  }
  root.scale.xyz = [0.75, 0.75, 0.75];

  const fumo = items[4];
  fumo.rotation.y = 120;

  const camera = items[0]._children[0];
  renderer.setCamera(camera);
  const empty = new Item3D(renderer);
  empty.appendChild(items[0]);

  setInterval(() => {
  	renderer.render(root);
  	fumo.rotation.y -= 0.2;
  }, 1 / 60);

})();
//# sourceMappingURL=main.js.map
