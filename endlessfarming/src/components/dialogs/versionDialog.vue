<template>
  <v-dialog v-model="dialog" width="650px">
    <template v-slot:activator="{ on }" v-bind:title="title">
      <v-list-item v-on="on">
        <v-list-item-title>{{ title }}</v-list-item-title>
      </v-list-item>
    </template>
    <v-card color="background">
      <v-card-title>
        <span>Patch Notes</span>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid v-for="(version, i) in $options.versions" :key="i">
        <v-row justify="space-between" class="version-underline pt-5">
          <v-col class="version-header pl-8">{{version.version}}</v-col>
          <v-col class="version-header text-center">{{version.date}}</v-col>
        </v-row>
        <v-row class="pt-3">
          <ul v-for="(note, i) in version.notes" :key="i">
            <li>
              <b>{{note.type}}</b>
              <ul v-for="(change, i) in note.changes" :key="i">
                <li>{{change}}</li>
              </ul>
            </li>
          </ul>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import VERSIONS from "../../assets/json/versions.json";
export default {
  name: "VersionDialog",
  props: ["title"],
  versions: VERSIONS,
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style scoped>
.version-underline {
  border-bottom: 2px solid var(--v-secondary-lighten5);
}
.version-header {
  font-size: 18px;
  font-style: italic;
  font-weight: bold;
}
</style>