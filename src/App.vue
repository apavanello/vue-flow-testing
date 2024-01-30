<script lang="ts" setup>
import {onBeforeMount,onMounted,onBeforeUpdate,onUpdated, ref, getCurrentInstance, defineAsyncComponent } from 'vue'
import {Background} from '@vue-flow/background'
import {Controls} from '@vue-flow/controls'
import {MiniMap} from '@vue-flow/minimap'
import {type Edge, MarkerType, type Node, NodeMouseEvent, Position, useVueFlow, VueFlow} from '@vue-flow/core'
import CustomNode from './CustomNode.vue'
import CustomEdge from './CustomEdge.vue'
import axios from "axios";
import {openModal} from '@kolirt/vue-modal'
import DetailsModal from "~/DetailsModal.vue";
import ContextMenu from '@imengyu/vue3-context-menu'


const { onConnect, addEdges, onNodeClick, onNodeContextMenu, onPaneContextMenu} = useVueFlow()



enum Status {
  STOP = 'stop',
  RUNNING = 'running',
  DONE = 'done',
}


const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

const getNodes = async () => {
  const response = await axios.get('http://localhost:8082/api/box/list');

  for (const node of response.data) {
    nodes.value.push(updateNodeDefaults(node));
  }
};

const getEdges = async () => {
  const response = await axios.get('http://localhost:8082/api/edge/list');

  for (const edge of response.data) {
    edges.value.push(updateEdgeDefaults(edge));
  }
};


onBeforeMount(() => {
  getNodes();
});

onMounted(() => {
    getEdges();
});

 onUpdated(() => {
   // getNodes();
   // getEdges();
 });

onConnect((params) => {
  addEdges([params])
})

onNodeClick((node) => {
  onContextMenu(node);
})

onNodeContextMenu((node) => {
  onContextMenu(node);
})

onPaneContextMenu((e) => {
  e.preventDefault()
  ContextMenu.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      {
        label: "Novo Node",
        onClick: () => {
          alert("You click in pane");
        }
      },
    ]
  });
})
function onContextMenu(e : NodeMouseEvent) {
  //prevent the browser's default menu
  e.event.preventDefault();
  //show your menu


  ContextMenu.showContextMenu({
    x: e.event.clientX,
    y: e.event.clientY,
    items: [
      {
        label: "Atualizar Node",
        children: [
          { label: "Parado", onClick: () => { updateNodeStatus(e.node, Status.STOP) } },
          { label: "Rodando", onClick: () => { updateNodeStatus(e.node, Status.RUNNING)} },
          { label: "Concluido", onClick: () => { updateNodeStatus(e.node, Status.DONE)} },
        ]
      },
      {
        label: "Detalhes",
        onClick: () => {
          runModal(e.node);
        }
      }
    ]
  });
}



function runModal(node: Node) {
  openModal(DetailsModal, {
    text: "Node ID: " + node.id + "\n" + "Node Status: " + node.extras.status + "\n" + "Node Type: " + node.extras.type + "\n" + "Node Name: " + node.extras.name
  })
      // runs when modal is closed via confirmModal
      .then((data) => {
        console.log('success', data)
      })
      // runs when modal is closed via closeModal or esc
      .catch(() => {
        console.log('catch')
      })
}

async function updateNodeStatus(node: Node, status: Status) {
  const response = await axios.post(
      'http://localhost:8082/api/box/update',
      {
        id: node.id,
        status: status
  },
      {
        headers: {
          'Content-Type': 'application/json',
          'Update-Type': 'status'
        }
      }
  );
  await getNodes()
  const instance = getCurrentInstance();
  instance?.proxy?.$forceUpdate();

}

function updateNodeDefaults(node: Node): typeof fullNode {

  type FullNode = typeof node & {
    extras: {
      status: string,
    }
  }

  const fullNode: FullNode = node as FullNode;



  fullNode.sourcePosition = Position.Right
  fullNode.targetPosition = Position.Left

  if (fullNode.extras.status == "")
    fullNode.extras.status = Status.STOP;

  if (fullNode.extras.status == Status.STOP)
    fullNode.style = { color : '#fff', background: '#e12c2c', borderRadius: 0, padding: '10px 20px'}
  else if (fullNode.extras.status == Status.RUNNING)
  fullNode.class = 'animated-gradient'
  else if (fullNode.extras.status == Status.DONE)
  fullNode.style = { color : '#fff', background: '#3268f5', borderRadius: 0, padding: '10px 20px'}

  fullNode.draggable = false


  return fullNode;
}


function updateEdgeDefaults(edge: Edge): Edge {
  //edge.type = 'smoothstep'
  edge.labelStyle = { fill: '#10b981', fontWeight: 700 }
  edge.style = { strokeWidth: 2 }
  edge.markerEnd = MarkerType.ArrowClosed
  return edge;
}

</script>

<template>
  <div style="height: 100vh">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"

      fit-view-on-init
      class="vue-flow-basic-example"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
    >
      <Background pattern-color="#aaa" :gap="8" />

      <MiniMap />

      <Controls />

      <ModalTarget/>



    </VueFlow>
  </div>
</template>

<style>


.animated-gradient {
  background: repeating-linear-gradient(to right, #01ddfc 0%, greenyellow 50%,#01ddfc);
  background-size: 200% auto;
  background-position: 0 100%;
  animation: gradient 2s infinite;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
}

@keyframes gradient {
  0%   { background-position: 0 0; }
  100% { background-position: -200% 0; }
}

.notifications {
  position: fixed;
  right: unset !important;
  left: 100vw;
  transform: translateX(-100%);
  margin-left: -15px;
}

</style>
