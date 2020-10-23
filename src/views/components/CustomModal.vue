<template>
  <v-layout row content-class="my-layout">
    <v-dialog v-model="winModal" @input="close_modal" content-class="win_modal">
      <div class="close_btn" @click="close_modal">
        <span>X</span>
      </div>
      <div class="win_wrap">
        <v-card-title>
          <h1>Good job!</h1>
        </v-card-title>
        <v-card-text>You unscramble all the words correctly!</v-card-text>
        <a class="recipeButton-purple scramble_again_btn" @click.prevent="playAgain">play again</a>
      </div>
    </v-dialog>

    <v-dialog v-model="winModalThanks" @input="close_modal" content-class="win_modal">
      <div class="close_btn" @click="close_modal">
        <span>X</span>
      </div>
      <div class="win_wrap">
        <v-card-title>
          <h1>Good job!</h1>
        </v-card-title>
        <v-card-text>You unscrambled all the words correctly!</v-card-text>
        <a
          class="recipeButton-orange scramble_again_btn"
          @click.prevent="playAgainThanks"
        >play again</a>
      </div>
    </v-dialog>

    <v-dialog v-model="answerModal" @input="close_modal" content-class="answer_modal">
      <div class="close_btn" @click="close_modal">
        <span>X</span>
      </div>
      <img class="star" :src="this.modal.star" alt />
      <div class="answer_wrap">
        <v-card-title>
          <h1>ANSWER KEY:</h1>
        </v-card-title>
        <v-card-text v-for="(val, key, i) in get_scramble_words('')" :key="key">{{i+1}}.{{val}}</v-card-text>
      </div>
    </v-dialog>

    <v-dialog v-model="cloverModal" @input="close_modal" content-class="clover_modal">
      <div class="close_btn" @click="close_modal">
        <span>X</span>
      </div>
      <div class="clover">
        <v-card-title v-if="cloverWin" class="clover_win_title">
          <h1>GOOD JOB!</h1>
        </v-card-title>
        <v-card-title v-else class="clover_lose_title">
          <h1>OOPS!</h1>
        </v-card-title>
        <v-card-text v-if="cloverWin" class="clover_win_copy">
          <p>You found all six four-leaf clovers.</p>
        </v-card-text>
        <v-card-text v-else class="clover_lose_copy">
          <p>That was not a four-leaf clover.</p>
          <p>Try again.</p>
        </v-card-text>
        <v-btn v-if="cloverWin" class="clover_again_btn" @click.native="resetGame">play again</v-btn>
      </div>
    </v-dialog>
  </v-layout>
</template>

<script>
import EventBus from 'shared/libs/eventbus.js';

export default {
  data() {
    return {
      answerModal: false,
      winModal: false,
      winModalThanks: false,
      cloverModal: false,
      cloverWin: false,
      modal: {}
    };
  },
  created: function() {
    var vm = this;
    EventBus.$on('triggerHint', function(opts) {
      vm.modal = opts;
      // Need to figure out how to pass temp from articledetail vue
      // vm.template = opts.template;
      vm.answerModal = true;
    });
    EventBus.$on('triggerSubmit', function(opts) {
      vm.modal = opts;
      // Need to figure out how to pass temp from articledetail vue
      // vm.template = opts.template;
      vm.winModal = true;
    });
    EventBus.$on('triggerSubmitThanks', function(opts) {
      vm.modal = opts;
      // Need to figure out how to pass temp from articledetail vue
      // vm.template = opts.template;
      vm.winModalThanks = true;
    });
    EventBus.$on('triggerClover', function(opts) {
      vm.cloverWin = opts.win;
      vm.cloverModal = true;
    });
  },
  computed: {},
  mounted: function() {},
  methods: {
    get_scramble_words: function(type) {
      if (type == 'array') {
        return [
          'DANRIEL',
          'NREUCELHPA',
          'GDOL',
          'HCRAM',
          'WIBONRA',
          'ELCORV',
          'RGNEE',
          'RMCOKHAS'
        ];
      } else {
        return {
          DANRIEL: 'IRELAND',
          NREUCELHPA: 'LEPRECHAUN',
          GDOL: 'GOLD',
          HCRAM: 'MARCH',
          WIBONRA: 'RAINBOW',
          ELCORV: 'CLOVER',
          RGNEE: 'GREEN',
          RMCOKHAS: 'SHAMROCK'
        };
      }
    },
    get_scramble_word: function(type) {
      if (type == 'array') {
        return [
          'BGOBEL',
          'HTNKAS',
          'YFWOMLEAR',
          'RNOC',
          'YTRKUE',
          'VEIG',
          'FSTFNIGU',
          'IPLIRGM'
        ];
      } else {
        return {
          BGOBEL: 'GOBBLE',
          HTNKAS: 'THANKS',
          YFWOMLEAR: 'MAYFLOWER',
          RNOC: 'CORN',
          YTRKUE: 'TURKEY',
          VEIG: 'GIVE',
          FSTFNIGU: 'STUFFING',
          IPLIRGM: 'PILGRIM'
        };
      }
    },
    playAgain: function() {
      this.winModal = false;
      var words = this.get_scramble_words();
      for (var key in words) {
        $(`span.result.${key}`).html('');
        $(`input.${key}`).val('');
      }
    },
    playAgainThanks: function() {
      this.winModalThanks = false;
      var words = this.get_scramble_word();
      for (var key in words) {
        $(`span.result.${key}`).html('');
        $(`input.${key}`).val('');
      }
    },
    close_modal: function() {
      this.winModal = false;
      this.winModalThanks = false;
      this.answerModal = false;
      this.cloverModal = false;
    },
    // Clover
    resetGame: function() {
      this.cloverModal = false;
      var correct = 0;
      $('body g')
        .removeAttr('picked')
        .find('path.st5')
        .attr('class', 'st0');
    }
  }
};
</script>

<style>
/*Clover Game*/
.clover_again_btn.v-btn.theme--light {
  font-family: "Poppins";
  width: auto;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  display: inline-block;
  color: #fff;
  background-color: #526331;
  float: left;
  border-radius: 6px;
  margin-top: 5px;
  transition: 0.5s ease-in;
}
.v-overlay.v-overlay--active {
  background-color: #ebebeb;
  opacity: 0.8;
}

.clover_win_copy {
}
.v-card__text.clover_lose_copy p {
  padding: 0;
  line-height: 1;
}
/*Scramble Words Game*/
.scramble-game {
  width: 100%;
  display: flex;
  /*justify-content: space-between;*/
}
.scramble-game div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.scramble-game div span {
  margin: 0.5em 0;
}
.scramble-game div input {
  border: 1px solid;
  margin: 0.5em 0;
}
.game-index,
.game-word,
.game-input {
  margin-right: 1em;
}
.game-input {
  width: 50%;
}
.game-buttons {
  text-align: center;
}
.v-dialog.v-dialog--active.win_modal,
.v-dialog.v-dialog--active.answer_modal,
.v-dialog.v-dialog--active.clover_modal {
  background: white;
  width: 30%;
  position: relative;
  border-radius: 0.7em;
  overflow: visible;
  box-shadow: none;
  padding: 2em;
}

.close_btn {
  width: 40px;
  height: 40px;
  line-height: 37px;
  border: 1px solid #000;
  border-radius: 100%;
  position: absolute;
  right: -20px;
  top: -12px;
  background: white;
  text-align: center;
  display: inherit;
  z-index: 300;
}
.close_btn:hover {
  cursor: pointer;
}
.game_title {
  display: flex;
  align-items: baseline;
}
.rainbow {
  margin-right: 1em;
}
.star {
  margin: 0;
  position: absolute;
  left: 10%;
  top: -2%;
}
.answers {
  display: flex;
  flex-direction: column;
}
.answer_wrap {
  padding: 3em 1em 1em 1em;
}
.win_wrap {
  padding: 1em;
}
.scramble_again_btn {
  margin-left: 16px;
}
@media screen and (max-width: 960px) {
  .v-dialog.v-dialog--active.win_modal,
  .v-dialog.v-dialog--active.answer_modal,
  .v-dialog.v-dialog--active.clover_modal {
    width: 60%;
  }
}
@media screen and (max-width: 767px) {
  .v-dialog.v-dialog--active.win_modal,
  .v-dialog.v-dialog--active.answer_modal,
  .v-dialog.v-dialog--active.clover_modal {
    width: 100%;
  }
}
</style>
