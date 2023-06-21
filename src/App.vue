<script lang="ts" setup>
import { h, ref } from 'vue'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, Elements } from '@vue-flow/core'
import CustomNodeLabel from './NodeLabel.vue'
import CustomNode from './CustomNode.vue'

const { onConnect, addEdges } = useVueFlow()

const elements = ref<Elements>([
  { id: '1', type: 'input', label: () => h(CustomNodeLabel, { label: 'Input 1' }), position: { x: 250, y: 5 } },
  { id: '2', type: 'output', label: 'Node 2', position: { x: 100, y: 100 } },
  { id: '3', type: 'custom', label: 'Node 3', position: { x: 400, y: 100 } },
])

onConnect((params) => {
  addEdges([params])
})
</script>

<template>
  <div style="height: 100vh">
    <VueFlow v-model="elements" class="vue-flow-basic-example" :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4">
      <Background style="background-color: red" pattern-color="#aaa" :gap="8" />

      <MiniMap />

      <Controls />

      <template #node-custom>
        <CustomNode />
      </template>
    </VueFlow>
  </div>
</template>
