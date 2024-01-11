module.exports = {
  parse: (map, maxCPP, page) => {
    let cmds = [];
    map.forEach((v, k) => {
      cmds.push({name: k, description: v});
    })

    let res = "";

    for (i = maxCPP * (page - 1); i <= maxCPP*page-1; i++) {
      if (i > cmds.length - 1) break;

      res = res.concat(`\`${cmds[i].name}\` **${cmds[i].description}**\n`);
    }

    return res;
  }
}