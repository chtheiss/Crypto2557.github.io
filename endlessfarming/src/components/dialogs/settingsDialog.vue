<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>fas fa-cog</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
        <template v-slot:extension>
          <v-tabs v-model="tab" align-with-title color="#fff">
            <v-tabs-slider color="#fff"></v-tabs-slider>
            <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item :key="items[0]">
          <v-card flat>
            <v-list subheader>
              <v-subheader>User</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Knightage Level</v-list-item-title>
                  <NumberInput value-name="KL" />
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Warp</v-list-item-title>
                  <NumberInput value-name="warp" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list subheader>
              <v-subheader>Data Transfer</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row>
                      <v-col cols="10">
                        <v-file-input
                          dense
                          filled
                          v-model="chosenFile"
                          hide-details
                          height="30px"
                          accept=".json"
                          label="Click here to select a .json file"
                        ></v-file-input>
                      </v-col>
                      <v-col cols="2" class="d-flex align-center">
                        <v-btn light id="reset-btn" @click="importJson">Import</v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row>
                      <v-col cols="6" class="d-flex justify-center">
                        <v-btn light id="reset-btn" @click="exportJson">Export</v-btn>
                      </v-col>
                      <v-col cols="6" class="d-flex justify-center">
                        <v-btn light id="reset-btn" @click="deleteDatabase">Delete All</v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="items[1]">
          <v-card flat>
            <v-list subheader>
              <v-subheader>General</v-subheader>
              <v-list-item>
                <v-list-item-action>
                  <v-checkbox color="blue" v-model="hide_five_star_pets"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Hide 5 Star Pets</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-checkbox color="blue" v-model="hide_unattainable_pets"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Hide Unattainable Pets</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-checkbox color="blue" v-model="edit_priorities"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Enable Editing Pet Priorities</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list subheader>
              <v-subheader>Spirit Highland Normal</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Tickets</v-list-item-title>
                  <NumberInput value-name="tickets" />
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Refills</v-list-item-title>
                  <NumberInput value-name="refills" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list subheader>
              <v-subheader>Spirit Highland Hard</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Tickets</v-list-item-title>
                  <NumberInput value-name="tickets_hard" />
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Refills</v-list-item-title>
                  <NumberInput value-name="refills_hard" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="items[2]">
          <v-card flat></v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import NumberInput from "../numberInput.vue";
export default {
  components: { NumberInput },
  name: "SettingsDialog",
  data() {
    return {
      dialog: false,
      tab: null,
      items: ["General", "Pets", "Artifacts"],
      chosenFile: null,
      fileData: null
    };
  },
  methods: {
    async importJson() {
      if (!this.chosenFile) {
        this.fileData = "No File Chosen";
      }
      var reader = new FileReader();
      reader.readAsText(this.chosenFile);
      reader.onload = async () => {
        this.fileData = reader.result;
        await this.$store.dispatch("transfer/loadDataFromJson", this.fileData);
        //this.$router.go();
      };
    },
    async exportJson() {
      await this.$store.dispatch("transfer/downloadJsonFile", null);
    },
    async deleteDatabase() {
      await this.$store.dispatch("transfer/clearDatabase");
      this.$router.go();
    }
  },
  computed: {
    hide_five_star_pets: {
      get() {
        return this.$store.state.stats.hide_five_star_pets;
      },
      async set(value) {
        value = value ? 1 : 0;
        let stat = { name: "hide_five_star_pets", value: value };
        await this.$store.dispatch("stats/saveValue", stat);
      }
    },
    hide_unattainable_pets: {
      get() {
        return this.$store.state.stats.hide_unattainable_pets;
      },
      async set(value) {
        value = value ? 1 : 0;
        let stat = { name: "hide_unattainable_pets", value: value };
        await this.$store.dispatch("stats/saveValue", stat);
      }
    },
    edit_priorities: {
      get() {
        return this.$store.state.stats.edit_priorities;
      },
      async set(value) {
        value = value ? 1 : 0;
        let stat = { name: "edit_priorities", value: value };
        await this.$store.dispatch("stats/saveValue", stat);
      }
    }
  }
};
</script>
<style scoped>
</style>