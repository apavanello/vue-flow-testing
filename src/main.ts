import { createApp } from "vue";
import "./assets/index.css";
import App from "./App.vue";

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
// @ts-ignore
import { createModal } from '@kolirt/vue-modal'

createApp(App)
    .use(ContextMenu)
    .use(createModal({
        transitionTime: 200,
        animationType: 'slideDown',
        modalStyle: {
            padding: '5rem 2rem',
            align: 'center',
            'z-index': 201
        },
        overlayStyle: {
            'background-color': 'rgba(0, 0, 0, 0.4)',
            'z-index': 200
        }}))
    .mount('#app')
