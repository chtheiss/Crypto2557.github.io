/* global Vue, _, Sortable */
Vue.directive('sortable', {
  inserted(el, binding) {
    const sortable = new Sortable(el, binding.value || {});
  },
});

const originalData = {
  version: '0.3',
  petList: [
    { name: 'Crimson Hawk Rider', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "1",  caract1_6: "3", caract1_max: "60", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 20, img: 191, index: 0, defaultTier: 1 },
    { name: 'Musketress', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "150", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 183, index: 1, defaultTier: 2 },
    { name: 'Winged Knight', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "10",  caract1_6: "20", caract1_max: "600", caract2_name: "", caract2_5: "0.02", caract2_6: "0.04", caract2_max: "1.2", needed: 30, img: 175, index: 2, defaultTier: 3 },
    { name: 'Cleric', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "150", caract2_name: "", caract2_5: "1", caract2_6: "3", caract2_max: "50", needed: 17, img: 167, index: 3, defaultTier: 4 },
    { name: 'Flame Spirit', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "75",  caract1_6: "150", caract1_max: "4000", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 27, img: 159, index: 4, defaultTier: 5 },
    { name: 'Valkyrie', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "100", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 10, img: 143, index: 5, defaultTier: 6 },
    { name: 'Steam Punk', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "2",  caract1_6: "5", caract1_max: "75", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 135, index: 6, defaultTier: 7 },
    { name: 'Pilot', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "50", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 125, index: 7, defaultTier: 8 },
    { name: 'Hot-Blooded Xuanzang', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "0",  caract1_6: "1", caract1_max: "5", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 117, index: 8, defaultTier: 9 },
    { name: 'Griffin Rider', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 111, index: 9, defaultTier: 10 },
    { name: 'Aladdin', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "2",  caract1_6: "5", caract1_max: "90", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 18, img: 105, index: 10, defaultTier: 11 },
    { name: 'Priest', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "1",  caract1_6: "2.5", caract1_max: "30", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 12, img: 95, index: 11, defaultTier: 12 },
    { name: 'Gunner', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 18, index: 12, defaultTier: 13 },
    { name: 'Fire Mage', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 16, index: 13, defaultTier: 14 },
    { name: 'Golem', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 14, index: 14, defaultTier: 15 },
    { name: 'Astral Captain', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "1",  caract1_6: "2", caract1_max: "30", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 193, index: 15, defaultTier: 16 },
    { name: 'Elf Sage', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "150", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 185, index: 16, defaultTier: 17 },
    { name: 'Windwalker', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "10",  caract1_6: "20", caract1_max: "600", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 30, img: 177, index: 17, defaultTier: 18 },
    { name: 'Elementalist', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "150", caract2_name: "", caract2_5: "75", caract2_6: "150", caract2_max: "4000", needed: 27, img: 169, index: 18, defaultTier: 19 },
    { name: 'Hippogriff', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "1",  caract1_6: "2.5", caract1_max: "50", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 20, img: 161, index: 19, defaultTier: 20 },
    { name: 'Sword Dancer', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "100", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 10, img: 145, index: 20, defaultTier: 21 },
    { name: 'Sylphid', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "2",  caract1_6: "5", caract1_max: "75", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 137, index: 21, defaultTier: 22 },
    { name: 'Alchemist', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "5", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 127, index: 22, defaultTier: 23 },
    { name: 'Hoyden Goku', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "0",  caract1_6: "1", caract1_max: "5", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 119, index: 23, defaultTier: 24 },
    { name: 'Forest Guardian', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 113, index: 24, defaultTier: 25 },
    { name: 'Druid', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 107, index: 25, defaultTier: 26 },
    { name: 'Fairy', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "1",  caract1_6: "2.5", caract1_max: "30", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 14, img: 97, index: 26, defaultTier: 27 },
    { name: 'Unicorn Knight', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 38, index: 27, defaultTier: 28 },
    { name: 'Wolf Warrior', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 10, img: 36, index: 28, defaultTier: 29 },
    { name: 'Ent', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 34, index: 29, defaultTier: 30 },
    { name: 'Shadow Knight', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 12, img: 195, index: 30, defaultTier: 31 },
    { name: 'Crow Knight', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: 5,  caract1_6: 10, caract1_max: 150, caract2_name: "", caract2_5: "75", caract2_6: "150", caract2_max: "4000", needed: 27, img: 187, index: 31, defaultTier: 32 },
    { name: 'Abyss Mage', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "10",  caract1_6: "20", caract1_max: "600", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 30, img: 179, index: 32, defaultTier: 33 },
    { name: 'Dark Elf', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "150", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 171, index: 33, defaultTier: 34 },
    { name: 'Dark Spirit', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "0.3",  caract1_6: "0.7", caract1_max: "15", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 12, img: 163, index: 34, defaultTier: 35 },
    { name: 'Incubus', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "0.5",  caract1_6: "1", caract1_max: "10", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 10, img: 147, index: 35, defaultTier: 36 },
    { name: 'Medusa', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "2",  caract1_6: "5", caract1_max: "75", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 139, index: 36, defaultTier: 37 },
    { name: 'Lich', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "50", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 129, index: 37, defaultTier: 38 },
    { name: 'Dark Amiral', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "0",  caract1_6: "1", caract1_max: "5", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 121, index: 38, defaultTier: 39 },
    { name: 'Succubus', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 115, index: 39, defaultTier: 40 },
    { name: 'Dark Ninja', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 109, index: 40, defaultTier: 41 },
    { name: 'Dark Archer', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "1",  caract1_6: "2.5", caract1_max: "60", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 24, img: 99, index: 41, defaultTier: 42 },
    { name: 'Death Knight', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 58, index: 42, defaultTier: 43 },
    { name: 'Bomb Unit', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 56, index: 43, defaultTier: 44 },
    { name: 'Hands of Death', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 54, index: 44, defaultTier: 45 },
    { name: 'War Bear Rider', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "20",  caract1_6: "40", caract1_max: "1000", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 25, img: 197, index: 45, defaultTier: 46 },
    { name: 'Rangda', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: 5,  caract1_6: 10, caract1_max: 150, caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 189, index: 46, defaultTier: 47 },
    { name: 'Siren', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "10",  caract1_6: "20", caract1_max: "600", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 30, img: 181, index: 47, defaultTier: 48 },
    { name: 'Frost Demon', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "150", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 24, img: 173, index: 48, defaultTier: 49 },
    { name: 'Blade Master', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "0.3",  caract1_6: "0.7", caract1_max: "15", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 12, img: 165, index: 49, defaultTier: 50 },
    { name: 'Ice Spirit', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "100", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 10, img: 149, index: 50, defaultTier: 51 },
    { name: 'Naga', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "2",  caract1_6: "5", caract1_max: "75", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 15, img: 141, index: 51, defaultTier: 52 },
    { name: 'Wyvern Rider', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "5",  caract1_6: "10", caract1_max: "100", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 131, index: 52, defaultTier: 53 },
    { name: 'Raptor Rider', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "0",  caract1_6: "1", caract1_max: "5", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 5, img: 123, index: 53, defaultTier: 54 },
    { name: 'Sorcerer', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "15",  caract1_6: "30", caract1_max: "900", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 24, img: 101, index: 54, defaultTier: 55 },
    { name: 'Battle Drummer', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "10",  caract1_6: "20", caract1_max: "10000", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1000, img: 103, index: 55, defaultTier: 56 },
    { name: 'NO UNIT', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 0, index: 57, defaultTier: 56 },
    { name: 'Wolf Rider', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 78, index: 57, defaultTier: 58 },
    { name: 'Ice Wizard', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 76, index: 58, defaultTier: 59 },
    { name: 'Big Foot', fragments_n: 0, fragments: 0, caract1_name: "", caract1_5: "",  caract1_6: "", caract1_max: "", caract2_name: "", caract2_5: "", caract2_6: "", caract2_max: "", needed: 1, img: 74, index: 59, defaultTier: 60 },
  ],
};

// Load saved data if it exists
const savedData = JSON.parse(localStorage.getItem('data')) || false;
let data;
if (savedData) { 
  if (savedData.version === originalData.version) {
    data = _.cloneDeep(savedData);
  } else {
    data = _.cloneDeep(originalData);
  }
} else {
  data = _.cloneDeep(originalData);
}

const orderedPetList = _.orderBy(data.petList, 'index');

const vm = new Vue({
  el: '#app',
  data,
  watch: {
    petList: {
      handler(val) {
        this.updateFarmList();
      },
    }
  },
  computed: {
    orderedPetList() {
      return _.orderBy(data.petList, 'index');
    },
  },
  methods: {
    getPet(petName) {
      let pet = data.petList[0];
      for (let i = 1; i < data.petList.length; i++) {
        if (data.petList[i].name === petName) {
          pet = data.petList[i];
        }
      }
      return pet;
    },
    resetUnits(){
        localStorage.setItem('data', JSON.stringify(originalData));
        window.location.reload();
    },
    updateFarmList() {

      // Save data
      localStorage.setItem('data', JSON.stringify(data));

      }
  },
});
