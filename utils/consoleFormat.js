module.exports = {
  warning: text => {
    let date = new Date(Date.now());
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    console.log("\x1b[33m",`[WARN] ${h}:${m}:${s}`,text,"\x1b[0m");
  },

  info: text => {
    let date = new Date(Date.now());
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    console.log(` [INFO] ${h}:${m}:${s}`,text,"\x1b[0m");
  },

  error: text => {
    let date = new Date(Date.now());
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    console.log("\x1b[31m",`[ERR] ${h}:${m}:${s}`,text,"\x1b[0m");
  }
}