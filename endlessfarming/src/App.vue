<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <v-navigation-drawer v-model="drawer" app clipped color="primary">
      <v-list>
        <div v-for="(item, i) in items" :key="i">
          <v-list-item-group v-if="!item.subItems">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  class="text-center"
                  v-text="item.text"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-group v-else no-action sub-group value="true">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  class="text-center"
                  v-text="item.text"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(subItem, i) in item.subItems"
              :key="i"
              link
              class="pl-8"
            >
              <v-list-item-content>
                <v-list-item-title v-text="subItem.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Endless Farming</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn rounded outlined color="action" dark>Donate</v-btn>
      <v-btn rounded outlined color="action" dark>Discord</v-btn
      ><v-btn rounded outlined color="action" dark>Pet Guide</v-btn
      ><v-btn rounded outlined color="action" dark>{{ version }}</v-btn
      ><v-btn rounded outlined color="action" dark>My Stats</v-btn>
    </v-app-bar>

    <v-content class="overflow-y-auto"> <router-view /></v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    items: [
      {
        text: "Home"
      },
      {
        text: "Pets",
        subItems: [{ text: "Normal" }, { text: "Hard" }, { text: "Others" }]
      },
      {
        text: "Units"
      },
      {
        text: "Tickets"
      },
      {
        text: "Meta"
      },
      {
        text: "Data Transfer",
        subItems: [
          { text: "Import" },
          { text: "Export" },
          { text: "Delete All Data" }
        ]
      }
    ],
    version: "v1.6"
  }),
  created() {}
};
</script>

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                 supported by Chrome and Opera */
}
.bordered {
  border: 2px solid #999;
  border-radius: 5px;
}
body,
html {
  background-color: #26292f;
  font-family: Arial, Helvetica, sans-serif;
  color: #d3d4d5;
  font-size: 16px;
  margin: 0;
}
</style>
