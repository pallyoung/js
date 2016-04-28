define(function () {
  var string2buffer,
      buffer2string,
      encrypt,
      decipher;
  
  string2buffer = function(string) {
    var str = string;
    // borrowed from http://jsperf.com/uint8array-vs-array-encode-to-utf8/2
    var n = str.length,
      idx = 0,
      utf8 = new Uint8Array(new ArrayBuffer(n * 4)),
      i, j, c;

    //http://user1.matsumoto.ne.jp/~goma/js/utf.js
    for (i = 0; i < n; ++i) {
      c = str.charCodeAt(i);
      if (c <= 0x7F) {
        utf8[idx++] = c;
      } else if (c <= 0x7FF) {
        utf8[idx++] = 0xC0 | (c >>> 6);
        utf8[idx++] = 0x80 | (c & 0x3F);
      } else if (c <= 0xFFFF) {
        utf8[idx++] = 0xE0 | (c >>> 12);
        utf8[idx++] = 0x80 | ((c >>> 6) & 0x3F);
        utf8[idx++] = 0x80 | (c & 0x3F);
      } else {
        j = 4;
        while (c >> (6 * j)) j++;
        utf8[idx++] = ((0xFF00 >>> j) & 0xFF) | (c >>> (6 * --j));
        while (j--)
          utf8[idx++] = 0x80 | ((c >>> (6 * j)) & 0x3F);
      }
    }
    return utf8.subarray(0, idx).buffer;
  }
  
  buffer2string = function (buffer) {
    var view, 
        array = [];
    view = new DataView(buffer);
    for (var i = 0, l = view.byteLength; i < l; i++) {
      var byte = view.getUint8(i);
      array.push(byte);
    }
    
    //http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
  }
  
  encrypt = function(string) {
    var buffer, view;
    buffer = string2buffer(string);
    view = new DataView(buffer);
    for (var i = 0, l = view.byteLength; i < l; i++) {
      var byte = view.getUint8(i);
      byte ^= 1;
      view.setUint8(i, byte);
    }
    return buffer;
  };
  
  decipher = function(buffer) {
    var view, string;
    view = new DataView(buffer);
    for (var i = 0, l = view.byteLength; i < l; i++) {
      var byte = view.getUint8(i);
      byte ^= 1;
      view.setUint8(i, byte);
    }
    string = buffer2string(buffer);
    return string;
  };
  
  exports = {
    encrypt: encrypt,
    decipher: decipher
  };
  return exports;
});