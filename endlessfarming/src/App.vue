<template>
    <v-app :style="{background: $vuetify.theme.themes.dark.background}">
        >
        <v-navigation-drawer v-model="drawer" app clipped color="secondary">
            <v-list>
                <div v-for="(item, i) in items" :key="i">
                    <v-list-item-group v-if="!item.subItems" value="true">
                        <v-list-item router :to="item.route">
                            <v-list-item-content>
                                <v-list-item-title color="#fff" v-text="item.text"></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                    <v-list-group v-else value="true">
                        <template v-slot:activator>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </template>
                        <v-list-item
                                v-for="(subItem, i) in item.subItems"
                                :key="i"
                                class="pl-8"
                                router
                                :to="subItem.route"
                        >
                            <v-list-item-content>
                                <v-list-item-title v-text="subItem.text" class="secondary-font-size"></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                </div>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app clipped-left color="secondary">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <img id="logo-image" :src="require('./assets/img/media/logo.svg')" alt="Endless Farming"/>
            <v-toolbar-title></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon :href="paypalLink" target="_blank">
                <v-icon>fab fa-paypal</v-icon>
            </v-btn>
            <v-btn icon :href="discordLink" target="_blank">
                <v-icon>fab fa-discord</v-icon>
            </v-btn>
            <SettingsDialog/>
            <v-menu left bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="() => {}" :href="menuItems.guide.link" target="_blank">
                        <v-list-item-title>{{ menuItems.guide.name }}</v-list-item-title>
                    </v-list-item>
                    <VersionDialog v-bind:title="menuItems.version.name"/>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-content class="overflow-y-auto">
            <router-view/>
        </v-content>
    </v-app>
</template>

<script>
    import VersionDialog from "./components/dialogs/versionDialog.vue";
    import SettingsDialog from "./components/dialogs/settingsDialog.vue";

    export default {
        components: {
            VersionDialog,
            SettingsDialog
        },
        props: {
            source: String
        },
        data: () => ({
            drawer: null,
            menuItems: {
                guide: {name: "Pet Guide", link: "http://bit.ly/HarroweD"},
                version: {name: "v1.6.0"}
            },
            paypalLink: "https://www.paypal.me/crypto2557",
            discordLink: "https://discord.gg/U5sUGbc",
            items: [
                {
                    text: "Home",
                    route: "/"
                },
                {
                    text: "Pets",
                    route: "",
                    subItems: [
                        {text: "Normal", route: "/pets/normal"},
                        {text: "Hard", route: "/pets/hard"},
                        {text: "Others", route: "/pets/other"}
                    ]
                },
                {
                    text: "Units",
                    route: "/units"
                },
                {
                    text: "Tickets",
                    route: "/tickets"
                },
                {
                    text: "Meta",
                    route: "/meta"
                }
            ],
            version: "v1.6"
        }),
        created() {
            this.$store.dispatch("stats/getStats");
        }
    };
</script>

<style>
    :root {
        --header-font-size: 20px;
        --default-font-size: 16px;
        --secondary-font-size:14px;
        --tertiary-font-size: 12px;
    }

    .v-list .v-list-item--active {
        color: #fff;
    }

    .header-font-size, .v-toolbar__title, .version-header, h4, .pet-card-frags {
        font-size: var(--header-font-size) !important;
    }

    .default-font-size, .v-list-item__title, .v-btn, .v-tab, button, p, .index-purpose, html {
        font-size: var(--default-font-size) !important;
    }

    .secondary-font-size, .v-subheader, .modal-content > * {
        font-size: var(--secondary-font-size) !important;
    }

    .tertiary-font-size {
        font-size: var(--tertiary-font-size) !important;
    }

    .pet-card-input .v-input__append-outer,
    .unit-card-input .v-input__append-outer {
        margin-top: 7px !important;
        margin-left: 1px !important;
    }

    .pet-card-input .v-input__prepend-outer,
    .unit-card-input .v-input__prepend-outer {
        margin-top: 7px !important;
        margin-right: 1px !important;
    }

    .pet-card-input .v-input__slot,
    .pet-card-input .v-input__control,
    .unit-card-input .v-input__slot,
    .unit-card-input .v-input__control {
        min-height: 30px !important;
    }

    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;  /* Non-prefixed version, currently supported by Chrome and Opera */
    }

    .bordered {
        border: 2px solid #999;
        border-radius: 5px;
    }

    body,
    html {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
    }

    #logo-image {
        height: 48px;
    }
</style>
