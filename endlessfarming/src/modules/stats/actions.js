import idb from "@/api/idb";
export const actions = {
  async saveStat(context, stat) {
    await idb.saveStat(stat);
    context.commit("updateStat", stat);
  },
  async getStat(context, stat) {
    await idb.getStat(stat.name);
  },
  async loadStats(context) {
    console.log("loadStats");
    let stats = await idb.getStats();
    for (const s of stats) {
      context.state[s.name] = s.value;
    }
    //stats.forEach((s) => {
    //  context.state.stats.push(s);
    //});
    //context.state.stats.push(stats);
  },
};
