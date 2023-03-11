import { createApp, defineAsyncComponent } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import VueSweetalert2 from 'vue-sweetalert2';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import L from 'leaflet';
// import store from './store';
import axios from 'axios';
import moment from 'moment';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import CodeHighlight from '@/components/CodeHighlight.vue';
import BlockViewer from '@/components/BlockViewer.vue';
moment.locale('th');
// import mixin from './mixin';
import i18n from './i18n';
import '@/assets/styles.scss';
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$L = L;
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.imagePath = '.';
// Icon.Default.mergeOptions({
//     iconRetinaUrl: () => require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: () => require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: () => require('leaflet/dist/images/marker-shadow.png')
// });


// app.mixin(mixin);
// app.use(store);
const Editor = defineAsyncComponent(() => import('@tinymce/tinymce-vue'));
const FullCalendar = defineAsyncComponent(() => import('@fullcalendar/vue3'));
const VirtualScroller = defineAsyncComponent(() => import('primevue/virtualscroller'));
const TriStateCheckbox = defineAsyncComponent(() => import('primevue/tristatecheckbox'));
const TreeTable = defineAsyncComponent(() => import('primevue/treetable'));
const TreeSelect = defineAsyncComponent(() => import('primevue/treeselect'));
const Tree = defineAsyncComponent(() => import('primevue/tree'));
const Tooltip = defineAsyncComponent(() => import('primevue/tooltip'));
const ToggleButton = defineAsyncComponent(() => import('primevue/togglebutton'));
const Timeline = defineAsyncComponent(() => import('primevue/timeline'));
const Terminal = defineAsyncComponent(() => import('primevue/terminal'));
const Dock = defineAsyncComponent(() => import('primevue/dock'));
const Dropdown = defineAsyncComponent(() => import('primevue/dropdown'));
const DynamicDialog = defineAsyncComponent(() => import('primevue/dynamicdialog'));
const Fieldset = defineAsyncComponent(() => import('primevue/fieldset'));
const FileUpload = defineAsyncComponent(() => import('primevue/fileupload'));
const Galleria = defineAsyncComponent(() => import('primevue/galleria'));
const Image = defineAsyncComponent(() => import('primevue/image'));
const InlineMessage = defineAsyncComponent(() => import('primevue/inlinemessage'));
const Inplace = defineAsyncComponent(() => import('primevue/inplace'));
const InputSwitch = defineAsyncComponent(() => import('primevue/inputswitch'));
const InputText = defineAsyncComponent(() => import('primevue/inputtext'));
const InputMask = defineAsyncComponent(() => import('primevue/inputmask'));
const InputNumber = defineAsyncComponent(() => import('primevue/inputnumber'));
const Knob = defineAsyncComponent(() => import('primevue/knob'));
const Listbox = defineAsyncComponent(() => import('primevue/listbox'));
const MegaMenu = defineAsyncComponent(() => import('primevue/megamenu'));
const Menu = defineAsyncComponent(() => import('primevue/menu'));
const Menubar = defineAsyncComponent(() => import('primevue/menubar'));
const Message = defineAsyncComponent(() => import('primevue/message'));
const MultiSelect = defineAsyncComponent(() => import('primevue/multiselect'));
const OrderList = defineAsyncComponent(() => import('primevue/orderlist'));
const OrganizationChart = defineAsyncComponent(() => import('primevue/organizationchart'));
const OverlayPanel = defineAsyncComponent(() => import('primevue/overlaypanel'));
const Paginator = defineAsyncComponent(() => import('primevue/paginator'));
const Panel = defineAsyncComponent(() => import('primevue/panel'));
const PanelMenu = defineAsyncComponent(() => import('primevue/panelmenu'));
const Password = defineAsyncComponent(() => import('primevue/password'));
const PickList = defineAsyncComponent(() => import('primevue/picklist'));
const ProgressBar = defineAsyncComponent(() => import('primevue/progressbar'));
const ProgressSpinner = defineAsyncComponent(() => import('primevue/progressspinner'));
const Rating = defineAsyncComponent(() => import('primevue/rating'));
const RadioButton = defineAsyncComponent(() => import('primevue/radiobutton'));
const Ripple = defineAsyncComponent(() => import('primevue/ripple'));
const Row = defineAsyncComponent(() => import('primevue/row'));
const SelectButton = defineAsyncComponent(() => import('primevue/selectbutton'));
const ScrollPanel = defineAsyncComponent(() => import('primevue/scrollpanel'));
const ScrollTop = defineAsyncComponent(() => import('primevue/scrolltop'));
const Skeleton = defineAsyncComponent(() => import('primevue/skeleton'));
const Slider = defineAsyncComponent(() => import('primevue/slider'));
const Sidebar = defineAsyncComponent(() => import('primevue/sidebar'));
const SpeedDial = defineAsyncComponent(() => import('primevue/speeddial'));
const SplitButton = defineAsyncComponent(() => import('primevue/splitbutton'));
const Splitter = defineAsyncComponent(() => import('primevue/splitter'));
const SplitterPanel = defineAsyncComponent(() => import('primevue/splitterpanel'));
const AutoComplete = defineAsyncComponent(() => import('primevue/autocomplete'));
const Accordion = defineAsyncComponent(() => import('primevue/accordion'));
const AccordionTab = defineAsyncComponent(() => import('primevue/accordiontab'));
const Avatar = defineAsyncComponent(() => import('primevue/avatar'));
const AvatarGroup = defineAsyncComponent(() => import('primevue/avatargroup'));
const Badge = defineAsyncComponent(() => import('primevue/badge'));
const BadgeDirective = defineAsyncComponent(() => import('primevue/badgedirective'));
const BlockUI = defineAsyncComponent(() => import('primevue/blockui'));
const Button = defineAsyncComponent(() => import('primevue/button'));
const Breadcrumb = defineAsyncComponent(() => import('primevue/breadcrumb'));
const Calendar = defineAsyncComponent(() => import('primevue/calendar'));
const Card = defineAsyncComponent(() => import('primevue/card'));
const Chart = defineAsyncComponent(() => import('primevue/chart'));
const CascadeSelect = defineAsyncComponent(() => import('primevue/cascadeselect'));
const Carousel = defineAsyncComponent(() => import('primevue/carousel'));
const Checkbox = defineAsyncComponent(() => import('primevue/checkbox'));
const Chip = defineAsyncComponent(() => import('primevue/chip'));
const Chips = defineAsyncComponent(() => import('primevue/chips'));
const ColorPicker = defineAsyncComponent(() => import('primevue/colorpicker'));
const ColumnGroup = defineAsyncComponent(() => import('primevue/columngroup'));
const ConfirmDialog = defineAsyncComponent(() => import('primevue/confirmdialog'));
const ConfirmPopup = defineAsyncComponent(() => import('primevue/confirmpopup'));
const ContextMenu = defineAsyncComponent(() => import('primevue/contextmenu'));
const DataView = defineAsyncComponent(() => import('primevue/dataview'));
const DataViewLayoutOptions = defineAsyncComponent(() => import('primevue/dataviewlayoutoptions'));
const DeferredContent = defineAsyncComponent(() => import('primevue/deferredcontent'));
const Dialog = defineAsyncComponent(() => import('primevue/dialog'));
const Divider = defineAsyncComponent(() => import('primevue/divider'));
const Steps = defineAsyncComponent(() => import('primevue/steps'));
const StyleClass = defineAsyncComponent(() => import('primevue/styleclass'));
const TabMenu = defineAsyncComponent(() => import('primevue/tabmenu'));
const TieredMenu = defineAsyncComponent(() => import('primevue/tieredmenu'));
const Textarea = defineAsyncComponent(() => import('primevue/textarea'));
const Toast = defineAsyncComponent(() => import('primevue/toast'));
const Toolbar = defineAsyncComponent(() => import('primevue/toolbar'));
const TabView = defineAsyncComponent(() => import('primevue/tabview'));
const TabPanel = defineAsyncComponent(() => import('primevue/tabpanel'));
const Tag = defineAsyncComponent(() => import('primevue/tag'));
app.use(i18n);
app.use(pinia);
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);
app.use(VueSweetalert2);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.component('CodeHighlight', CodeHighlight);
app.component('BlockViewer', BlockViewer);
app.component('Accordion', Accordion);
app.component('Editor', Editor);
app.component('FullCalendar', FullCalendar);
app.component('AccordionTab', AccordionTab);
app.component('AutoComplete', AutoComplete);
app.component('Avatar', Avatar);
app.component('AvatarGroup', AvatarGroup);
app.component('Badge', Badge);
app.component('BlockUI', BlockUI);
app.component('Breadcrumb', Breadcrumb);
app.component('Button', Button);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Chart', Chart);
app.component('Carousel', Carousel);
app.component('CascadeSelect', CascadeSelect);
app.component('Checkbox', Checkbox);
app.component('Chip', Chip);
app.component('Chips', Chips);
app.component('ColorPicker', ColorPicker);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('ContextMenu', ContextMenu);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('DeferredContent', DeferredContent);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dock', Dock);
app.component('Dropdown', Dropdown);
app.component('DynamicDialog', DynamicDialog);
app.component('Fieldset', Fieldset);
app.component('FileUpload', FileUpload);
app.component('Galleria', Galleria);
app.component('Image', Image);
app.component('InlineMessage', InlineMessage);
app.component('Inplace', Inplace);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Knob', Knob);
app.component('Listbox', Listbox);
app.component('MegaMenu', MegaMenu);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('MultiSelect', MultiSelect);
app.component('OrderList', OrderList);
app.component('OrganizationChart', OrganizationChart);
app.component('OverlayPanel', OverlayPanel);
app.component('Paginator', Paginator);
app.component('Panel', Panel);
app.component('PanelMenu', PanelMenu);
app.component('Password', Password);
app.component('PickList', PickList);
app.component('ProgressBar', ProgressBar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('Row', Row);
app.component('SelectButton', SelectButton);
app.component('ScrollPanel', ScrollPanel);
app.component('ScrollTop', ScrollTop);
app.component('Slider', Slider);
app.component('Sidebar', Sidebar);
app.component('Skeleton', Skeleton);
app.component('SpeedDial', SpeedDial);
app.component('SplitButton', SplitButton);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Steps', Steps);
app.component('TabMenu', TabMenu);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Tag', Tag);
app.component('Textarea', Textarea);
app.component('Terminal', Terminal);
app.component('TieredMenu', TieredMenu);
app.component('Timeline', Timeline);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);
app.component('ToggleButton', ToggleButton);
app.component('Tree', Tree);
app.component('TreeSelect', TreeSelect);
app.component('TreeTable', TreeTable);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('VirtualScroller', VirtualScroller);
app.mount('#app');
