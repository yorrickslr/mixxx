/*******************************\
*  full feature set activation  *
*  for the Pioneer DJM-250MK2   *
\*******************************/


// interface
var PioneerDJM250MK2 = {};

let featureActivation = {};

featureActivation.normalize = data => {
  if(data.length % 2) {
    throw("data must have an even number of bytes");
  }
  let result = [];
  for(let i = 0; i < data.length / 2; ++i) {
    result.push((data[i * 2] & 0x0F) << 4 | (data[i * 2 + 1] & 0x0F));
  }
  return result;
}

featureActivation.denormalize = data => {
  let result = [];
  for(let i = 0; i < data.length; ++i) {
    result.push(data[i] >>> 4);
    result.push(data[i] & 0x0F);
  }
  return result;
}

// this function originally used BigInt
// which is currently not supported in QT Script:
/*
featureActivation.fnv32hash = buffer => {
  let hash = BigInt(0x811c9dc5);
  for (let b of buffer) {
    b = BigInt(b);
    hash = BigInt.asUintN(32, ((b^hash) * BigInt(0x1000193)));
  }
  return Number(hash);
}
*/
// using polyfill instead, download at:
// https://www.npmjs.com/package/big-integer

featureActivation.fnv32hash = buffer => {
  let hash = 0x811c9dc5;
  for(let b of buffer) {
    let v = bigInt(b);
    v = v.xor(hash);
    v = v.multiply(0x1000193);
    v = v.and(bigInt(0xffffffff));
    hash = v.toJSNumber();
  }
  return hash;
}

featureActivation.XOR = (a, b) => {
  if(a.length != b.length) {
    throw"XOR on different length arrays";
  }
  let result = [];
  for(let i = 0; i < a.length; i++) {
    result.push(a[i] ^ b[i]);
  }
  return result;
}

featureActivation.toBytes = value => {
  result = [];
  result.push(value >>> 24 & 0xFF);
  result.push(value >>> 16 & 0xFF);
  result.push(value >>> 8 & 0xFF);
  result.push(value >>> 0 & 0xFF);
  return result;
}

featureActivation.equals = (a, b) => {
  if(a === b) {
    return true;
  }
  if(a == null || b == null || a.length !== b.length) {
    return false;
  }
  for(let i = 0; i < a.length; ++i) {
    if(a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

featureActivation.sendGreeting = message => {
  midi.send([0xf0, 0x00, 0x40, 0x05, 0x00, 0x00, 0x00, 0x17, 0x00, 0x50, 0x01, 0xf7]);
}

featureActivation.handleGreeting = message => {
  // received greeting message, respond accordingly
  midi.send([0xf0, 0x00, 0x40, 0x05, 0x00, 0x00, 0x00, 0x17, 0x00, 0x12, 0x2a, 0x01, 0x0b, 0x50, 0x69, 0x6f, 0x6e, 0x65, 0x65, 0x72, 0x44, 0x4a, 0x02, 0x0b, 0x72, 0x65, 0x6b, 0x6f, 0x72, 0x64, 0x62, 0x6f, 0x78, 0x03, 0x12, 0x02, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x03, 0x04, 0x08, 0x00, 0x00, 0x00, 0x00, 0xf7]);
}

featureActivation.handleChallenge = data => {
  // received challenge message, respond accordingly
  let hash1 = data.slice(35, 35+8);
  let seed2 = data.slice(45, 45+8);
  hash1 = featureActivation.normalize(hash1);
  seed2 = featureActivation.normalize(seed2);

  let seed0 = [0x68, 0x01, 0x31, 0xFB];
  let seed1 = [0x29, 0x00, 0x00, 0x00, 0x23, 0x48, 0x00, 0x00];
  let challenge1 = seed1.concat(featureActivation.XOR(seed0, seed2));
  let result1 = featureActivation.fnv32hash(challenge1);
  let hash1check = featureActivation.toBytes(result1);

  if(featureActivation.equals(hash1, hash1check)) {
    let challenge2 = seed2.concat(featureActivation.XOR(seed0, seed2));
    let result2 = featureActivation.fnv32hash(challenge2);
    let hash2 = featureActivation.toBytes(result2);
    midi.send([0xf0, 0x00, 0x40, 0x05, 0x00, 0x00, 0x00, 0x17, 0x00, 0x14, 0x38, 0x01, 0x0b, 0x50, 0x69, 0x6f, 0x6e, 0x65, 0x65, 0x72, 0x44, 0x4a, 0x02, 0x0b, 0x72, 0x65, 0x6b, 0x6f, 0x72, 0x64, 0x62, 0x6f, 0x78, 0x04, 0x0a].concat(featureActivation.denormalize(hash2).concat([0x05, 0x16, 0x05, 0x09, 0x0b, 0x05, 0x04, 0x0b, 0x0f, 0x0e, 0x0e, 0x04, 0x04, 0x0a, 0x05, 0x0a, 0x0c, 0x08, 0x0e, 0x04, 0x0c, 0x05, 0xf7])));
  } else {
    throw("verification of hash1 failed");
  }
}

featureActivation.handleAcknowledge = message => {
  // received acknowledge message, all features should be enabled
  engine.beginTimer(200, () => {
    // send heartbeat to keep features enabled
    midi.send([0xf0, 0x00, 0x40, 0x05, 0x00, 0x00, 0x00, 0x17, 0x00, 0x50, 0x01, 0xf7]);
  });
}

PioneerDJM250MK2.init = function (id, debugging) {
  print("Initializing Pioneer DJM-250MK2");
  featureActivation.sendGreeting();
}

PioneerDJM250MK2.shutdown = function() {
  print("Shutting down Pioneer DJM-250MK2");
}

PioneerDJM250MK2.incomingData = function(data) {
  if(data.length == 12 && data[9] == 0x11) {
    featureActivation.handleGreeting(data);
  } else if (data.length == 54 && data[9] == 0x13 && data[33] == 0x04 && data[43] == 0x03) {
    featureActivation.handleChallenge(data);
  } else if (data.length == 12 && data[9] == 0x15) {
    featureActivation.handleAcknowledge(data);
  }
}
