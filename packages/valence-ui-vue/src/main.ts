import { createApp } from 'vue';
import App from './App.vue';
import { vTooltip } from './directives/vTooltip';

// Import core SCSS styles and Light Theme from the valence-ui library!
import '../../../projects/valence-ui/src/lib/styles/main.scss';
import '../../../projects/valence-ui/src/lib/themes/light/theme-light.scss';

const app = createApp(App);
app.directive('tooltip', vTooltip);
app.mount('#app');
