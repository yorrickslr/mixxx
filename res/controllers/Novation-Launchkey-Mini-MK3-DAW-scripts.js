/***************************************\
* controller interface implementation   *
* for the Launchkey Mini MK3 (DAW mode) *
\***************************************/


// interface
var NovationLaunchkeyMiniMK3DAW = {};

NovationLaunchkeyMiniMK3DAW.pad = {};
NovationLaunchkeyMiniMK3DAW.button = {};


// enums
let enums = {
  pads: {
    top: [0x60,0x61,0x62,0x63,0x64,0x65,0x66,0x67],
    bottom: [0x70,0x71,0x72,0x73,0x74,0x75,0x76,0x77],
    left: [0x60,0x61,0x62,0x63,0x70,0x71,0x72,0x73],
    right: [0x64,0x65,0x66,0x67,0x74,0x75,0x76,0x77],
    all: [0x60,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x70,0x71,0x72,0x73,0x74,0x75,0x76,0x77],
  },
  buttons: {
    up: 0x68,
    down: 0x69,
  },
  color: {
    off: 0,
    black: 0,
    white: 3,
    red: 5,
    orange: 9,
    yellow: 13,
    grass: 17,
    green: 21,
    lime: 25,
    turqoise: 29,
    cyan: 33,
    aqua: 37,
    sky: 41,
    blue: 45,
    purple: 49,
    pink: 53,
    rosa: 57,
  },
  rgb: {},
  level: {
    bright: -1,
    normal: 0,
    dim: 1,
    dark: 2,
  }
};
enums.rgb[12913160] = 5;
enums.rgb[3325508] = 21;
enums.rgb[4379892] = 37;
enums.rgb[16306688] = 13;
enums.rgb[17663] = 45;
enums.rgb[11469004] = 49;
enums.rgb[16557783] = 57;
enums.rgb[15921919] = 3;
enums.rgb[16744448] = 9;


// global variables
let colorBuffer = {};
colorBuffer[enums.pads.all[0]] = enums.color.off;
colorBuffer[enums.pads.all[1]] = enums.color.off;
colorBuffer[enums.pads.all[2]] = enums.color.off;
colorBuffer[enums.pads.all[3]] = enums.color.off;
colorBuffer[enums.pads.all[4]] = enums.color.off;
colorBuffer[enums.pads.all[5]] = enums.color.off;
colorBuffer[enums.pads.all[6]] = enums.color.off;
colorBuffer[enums.pads.all[7]] = enums.color.off;
colorBuffer[enums.pads.all[8]] = enums.color.off;
colorBuffer[enums.pads.all[9]] = enums.color.off;
colorBuffer[enums.pads.all[10]] = enums.color.off;
colorBuffer[enums.pads.all[11]] = enums.color.off;
colorBuffer[enums.pads.all[12]] = enums.color.off;
colorBuffer[enums.pads.all[13]] = enums.color.off;
colorBuffer[enums.pads.all[14]] = enums.color.off;
colorBuffer[enums.pads.all[15]] = enums.color.off;


// helper functions
function enterDAWMode() {
  print("Entering DAW mode on Novation Launchkey Mini MK3");
  // midi.sendSysexMsg([0xf0, 0x9f, 0x0c, 0x7f, 0xf7], 5);
  midi.sendShortMsg(0x9f, 0x0c, 0x7f);
}

function leaveDAWMode() {
  print("Leaving DAW mode on Novation Launchkey Mini MK3");
  midi.sendShortMsg(0x9f, 12, 0x0);
}

function setStaticColor(control, color, cache = false) {
  if(cache) {
    colorBuffer[control] = color;
  }
  midi.sendShortMsg(0x90, control, color);
}

function setBlinkColor(control, color) {
  midi.sendShortMsg(0x91, control, color);
}

function syncTestStatus(value, group) {
  print("got sync status: " + value);
}

function syncTestColor(value, group) {
  print("got sync color: " + value);
}

let padSyncs = [];
function enableHotcueInfoSync() {
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_1_status', () => dispHotcueInfo(0,0)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_2_status', () => dispHotcueInfo(0,1)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_3_status', () => dispHotcueInfo(0,2)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_4_status', () => dispHotcueInfo(0,3)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_5_status', () => dispHotcueInfo(0,4)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_6_status', () => dispHotcueInfo(0,5)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_7_status', () => dispHotcueInfo(0,6)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_8_status', () => dispHotcueInfo(0,7)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_1_status', () => dispHotcueInfo(1,0)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_2_status', () => dispHotcueInfo(1,1)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_3_status', () => dispHotcueInfo(1,2)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_4_status', () => dispHotcueInfo(1,3)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_5_status', () => dispHotcueInfo(1,4)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_6_status', () => dispHotcueInfo(1,5)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_7_status', () => dispHotcueInfo(1,6)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_8_status', () => dispHotcueInfo(1,7)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_1_color', () => dispHotcueInfo(0,0)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_2_color', () => dispHotcueInfo(0,1)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_3_color', () => dispHotcueInfo(0,2)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_4_color', () => dispHotcueInfo(0,3)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_5_color', () => dispHotcueInfo(0,4)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_6_color', () => dispHotcueInfo(0,5)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_7_color', () => dispHotcueInfo(0,6)));
  padSyncs.push(engine.makeConnection('[Channel1]', 'hotcue_8_color', () => dispHotcueInfo(0,7)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_1_color', () => dispHotcueInfo(1,0)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_2_color', () => dispHotcueInfo(1,1)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_3_color', () => dispHotcueInfo(1,2)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_4_color', () => dispHotcueInfo(1,3)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_5_color', () => dispHotcueInfo(1,4)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_6_color', () => dispHotcueInfo(1,5)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_7_color', () => dispHotcueInfo(1,6)));
  padSyncs.push(engine.makeConnection('[Channel2]', 'hotcue_8_color', () => dispHotcueInfo(1,7)));
}
function disableHotcueInfoSync() {
  for(sync of padSyncs) {
    sync.disconnect();
  }
}


// display functions
function dispDefault(pad) {
  if(pad != undefined) {
    setStaticColor(pad, colorBuffer[pad]);
    return;
  }
  for(let pad of enums.pads.all) {
    setStaticColor(pad, colorBuffer[pad]);
  }
}

function dispRainbow() {
  let colorCode = enums.color.red;
  for(let pad of enums.pads.all) {
    setStaticColor(pad, colorCode, true);
    colorCode += 4;
  }
}

function dispHotcue() {
  for(let pad of enums.pads.left) {
    setStaticColor(pad, enums.color.red + 2, true);
  }
  for(let pad of enums.pads.right) {
    setStaticColor(pad, enums.color.green + 2, true);
  }
}

function dispHotcueGrid() {
  for(let i = 0; i < 4; i += 2) {
    setStaticColor(enums.pads.left[i], enums.color.sky + enums.level.dim, true);
    setStaticColor(enums.pads.left[i+1], enums.color.aqua + enums.level.dim, true);
    setStaticColor(enums.pads.right[i], enums.color.lime + enums.level.dim, true);
    setStaticColor(enums.pads.right[i+1], enums.color.grass + enums.level.dim, true);
  }
  for(let i = 4; i < 8; i += 2) {
    setStaticColor(enums.pads.left[i], enums.color.aqua + enums.level.dim, true);
    setStaticColor(enums.pads.left[i+1], enums.color.sky + enums.level.dim, true);
    setStaticColor(enums.pads.right[i], enums.color.grass + enums.level.dim, true);
    setStaticColor(enums.pads.right[i+1], enums.color.lime + enums.level.dim, true);
  }
}

function dispHotcueInfo(channel, hotcue) {
  if(channel == undefined) {
    dispHotcueInfo(0);
    dispHotcueInfo(1);
    return;
  }
  if(hotcue == undefined) {
    for(let i = 0; i < 8; ++i) {
      dispHotcueInfo(channel, i);
    }
    return;
  }
  print("checking hotcue info for hotcue" + (hotcue + 1) + " on channel " + (channel + 1));
  let pad = enums.pads.left[hotcue];
  if(channel > 0) {
    pad = enums.pads.right[hotcue]
  }
  let channelStr = "[Channel" + (channel + 1) + "]";
  let hotcueStr = "hotcue_" + (hotcue + 1);
  let enabled = engine.getValue(channelStr, hotcueStr + "_enabled");
  if(enabled) {
    let rgbColor = engine.getValue(channelStr, hotcueStr + "_color");
    setStaticColor(pad, enums.rgb[rgbColor], true);
  } else {
    setStaticColor(pad, enums.color.off, true);
  }
}


// input handlers
function handleHotcue(control, value) {
  let channel = "[Channel1]";
  // let color = enums.color.blue;
  let hotcue_index = enums.pads.left.indexOf(control);
  if(hotcue_index < 0) {
    channel = "[Channel2]";
    // color = enums.color.green;
    hotcue_index = enums.pads.right.indexOf(control);
  }
  let command = "hotcue_" + (hotcue_index + 1) + "_activate";
  if(value > 0) {
    engine.setValue(channel, command, true);
    setStaticColor(control, colorBuffer[control] + enums.level.bright);
  } else {
    engine.setValue(channel, command, false);
    dispDefault(control); // top left pad off
    return;
  }
}

let upDownModes = [dispHotcue, dispHotcueGrid, dispHotcueInfo, dispRainbow];
let upDownModeId = 0;
function handleUpDown(value) {
  if(!value) {
    return;
  }
  upDownModeId = (upDownModeId + 1) % upDownModes.length;
  print("running mode " + upDownModeId);
  upDownModes[upDownModeId]();
}


// interface bindings
NovationLaunchkeyMiniMK3DAW.init = function (id, debugging) {
  print("Initializing Novation Launchkey Mini MK3 MIDI Interface 2")
  enterDAWMode();
  dispHotcueInfo();
  enableHotcueInfoSync();
}

NovationLaunchkeyMiniMK3DAW.shutdown = function() {
  print("Shutting down Novation Launchkey Mini MK3 MIDI Interface 2")
  leaveDAWMode();
}

NovationLaunchkeyMiniMK3DAW.pad.input = function(channel, control, value, status, group) {
  handleHotcue(control, value);
}

NovationLaunchkeyMiniMK3DAW.button.input = function (channel, control, value, status, group) {
  // handleUpDown(value);
}
