<template>
  <div class="home">
    <div class="index-container">
      <div class="index-title px-4">
        <v-img
          :src="require('../assets/img/media/logo_text.svg')"
          class="my-3"
          contain
          height="200"
        />
      </div>
      <div class="index-purpose text-left px-4">
        <p class="mb-12">Endless Farming is a Tool dedicated to make your live easier while playing the game Endless Frontier.
        We provide a priority system for farming Spirit Highlands (SH)
        pets that will maximize growth based on your current Knightage Level
        (KL) and available tickets, a priority system for using Unit Selection Tickets
        to maximize useful buffs, a method for tracking the number of units you
        currently have to help keep track of the buffs they provide and 
        decide which units you can afford to sacrifice when transcending artifacts, 
        and a meta page with the latest team progression guide.
        </p>
        <p>Please note that the site will save your data on this
        device, but will need to be manually entered on another device.
        Alternatively, you can export and import data to make transfering data
        easier.
        This application was created and is maintained by Crypto.
        A huge shoutout to
        <a
          href="https://www.endlessfrontierdata.com/index"
        >Endless Frontier Data</a>
        for their unit and pet images as well as data, to HarroweD for writing
        an awesome
        <a
          href="http://bit.ly/HarroweD"
        >pet guide</a>, CheezyBob
        for thinking up the original unit selection list and CryBenihime and
        SxeSpanky for keeping the meta progression up-to-date.
        Feel free to give feedback on
        <a
          href="https://www.reddit.com/r/EndlessFrontier/comments/f4j323/endless_farming_update/"
        >Reddit</a>, by mail
        <b>endlessfarmingtracker@gmail.com</b>, or directly via
        Discord at
        <b>Crypto2557#1163</b> or
        <b>HarroweD#0666</b>.
        The source code is available at
        <a
          href="https://github.com/Crypto2557/Crypto2557.github.io"
        >GitHub</a>!
        If you like this tool and want to support this project, feel free to
        <a
          href="https://paypal.me/crypto2557"
        >donate</a>! Thanks and Happy Farming!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped>
.index-container {
  display: grid;
  height: calc(100% - 60px - 4em);
  grid-gap: 5px;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto auto;
  grid-template-areas: "title" "purpose";
  padding-top: 10px;
}
/* Define grid areas */
.index-title {
  grid-area: title;
  display: grid;
  justify-content: center;
  align-content: center;
}
.index-purpose {
  grid-area: purpose;
  padding: 1%;
  font-size: 16px;
  max-width: 612px;
  justify-self: center;
}
</style>
