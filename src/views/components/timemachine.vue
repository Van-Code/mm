
<template>
  <div class="tm-wrapper">
    <i
      class="material-icons tm"
      color="#FFC107"
      v-if="!showCalendar"
      @click="showCalendar=true"
    >mdi_calendar_today</i>
    <v-dialog width="290px" v-if="showCalendar" v-model="showCalendar">
      <v-date-picker
        v-model="date"
        @input="saveToStorage(date),showCalendar = false"
        :min="mindate"
        :max="maxdate"
      >
        <v-spacer></v-spacer>
        <v-btn @click="clearDate(),showCalendar=false">Reset</v-btn>
      </v-date-picker>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var today = new Date();
    return {
      date: this.getSessionDate() || today.toISOString().substr(0, 10),
      showCalendar: false,
      mindate: new Date(new Date().setDate(today.getDate() - 365))
        .toISOString()
        .substr(0, 10),
      maxdate: new Date(new Date().setDate(today.getDate() + 30))
        .toISOString()
        .substr(0, 10)
    };
  },
  methods: {
    getSessionDate: function() {
      let sessionDate = window.sessionStorage.getItem('timeMachineDate');
      if (sessionDate) {
        //change to date picker format
        let date =
          sessionDate.substring(4, 8) +
          '-' +
          sessionDate.substring(0, 2) +
          '-' +
          sessionDate.substring(2, 4);
        return date;
      } else {
        return null;
      }
    },
    saveToStorage: function(date) {
      if (!date) {
        const newDate = new Date().toISOString().substr(0, 10);
      } else {
        //convert to format required by backend
        const newDate =
          date.substring(5, 7) + date.substring(8) + date.substring(0, 4);
        window.sessionStorage.setItem('timeMachineDate', newDate);
      }
      location.reload();
    },
    clearDate: function() {
      this.date = null;
      //clear Time Machine Content
      window.sessionStorage.removeItem('timeMachineDate');
      location.reload();
    }
  }
};
</script>
<style scoped lang="scss">
.tm-wrapper {
  position: fixed;
  bottom: 1em;
  left: 1em;
  z-index: 201;
  .tm {
    color: #ffc107;
    cursor: pointer;
  }
}
</style>
