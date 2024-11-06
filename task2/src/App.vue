<script setup>
import { ref } from 'vue';
import initWS from './utils/ws.js';

const buttons = ref([]);
let queue = [];
let isRendered = false;
let processQueueTimeout;

const renderList = async (payload) => {
  if (isRendered) {
    clearTimeout(processQueueTimeout);

    if (payload) {
      queue.push(payload);
    }

    if (queue.length > 0) {
      // if we still have messages in queue, but no more ws messages expected
      // force trigger renderList with 'undefined' payload
      processQueueTimeout = setTimeout(renderList, 1000);
    }

    return;
  }

  isRendered = true;
  buttons.value = [...buttons.value, ...queue, ...(payload ? [payload] : [])];
  queue = [];

  // lets say we have some animation delay
  await new Promise((res) => setTimeout(res, 1000));

  isRendered = false;
};

// Call helper function to start websocket and trigger messages
initWS(renderList);
</script>

<template>
  <div>
    <!-- Number of buttons is limited to 12 to test scenario 
    of limited amount of updates during a period of time -->
    <button v-for="(button, index) in buttons" class="button button-23">
      {{ index }}: {{ button }}
    </button>
  </div>
</template>

<style scoped>
.button {
  display: block;
}
</style>
