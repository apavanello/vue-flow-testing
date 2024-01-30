<script setup lang="ts">
import {defineProps, PropType} from 'vue'
import {closeModal, confirmModal} from '@kolirt/vue-modal'
import {type Node} from '@vue-flow/core'

const props = defineProps({
  text: {
    type: String,
    default: 'Hello World!',
  },
})
</script>

<template>
  <SimpleModal  class="relative bg-white rounded-lg shadow dark:bg-gray-700 text-xl font-semibold text-gray-900" title="Terms of Service" size="sm">
      <template #header class="">
      </template>
      <pre class="text-base leading-relaxed text-gray-700">{{ props.text }}</pre>
      <template #footer>
        <button @click="confirmModal({value: 'some values'})"  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Confirm
        </button>
        <button @click="closeModal()"  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Close
        </button>
      </template>
  </SimpleModal>
</template>

<style>
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>