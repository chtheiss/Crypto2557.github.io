import idb from "@/api/idb";
export const actions = {
  async saveValue(context, value) {
    await idb.saveStat(value);
    context.commit("updateStat", value);
  },
  async getStat(context, stat) {
    await idb.getStat(stat.name);
  },
  async getStats(context) {
    console.log("loadStats");
    let stats = await idb.getStats();
    for (const s of stats) {
      context.state[s.name] = s.value;
    }
  }
};
