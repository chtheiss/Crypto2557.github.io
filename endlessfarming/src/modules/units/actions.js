import _ from "lodash";
import axios from "axios";
import idb from "@/api/idb";

export const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  async saveValue(context, value) {
    let idbValue = {
      id: value._id,
      amount: value.amount
    };
    await idb.saveUnit(idbValue);
    context.commit("updateUnit", value);
  },
  async getUnitsData(context) {
    let unitsData = await axios.get(
      `https://endless-farming-backend.herokuapp.com/api/v1/units/`
    );
    let data = unitsData.data.data;

    let units = await idb.getUnits("units");
    let mergedList = _.map(data, function(item) {
      return _.extend(item, _.find(units, { id: item._id }));
    });
    let unitPromises = [];
    for (let unit of mergedList) {
      if (unit.amount == undefined) {
        unit.amount = 0;

        console.log({
          id: unit._id,
          amount: unit.amount
        });
        unitPromises.push(
          idb.saveUnit(
            {
              id: unit._id,
              amount: unit.amount
            },
            "units"
          )
        );
      }
    }
    console.log("Done");
    await Promise.all(unitPromises);
    console.log("units/getUnitsData");
    context.commit("setUnitsData", mergedList);
  },
  async getTickets(context) {
    let tickets = await axios.get(
      `https://endless-farming-backend.herokuapp.com/api/v1/tickets/`
    );
    tickets = tickets.data.data;
    console.log("units/getTickets");
    context.commit("setTickets", tickets);
  }
};
