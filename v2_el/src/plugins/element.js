import Vue from 'vue'
import {
    Aside,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Checkbox,
    Col,
    Container,
    DatePicker,
    Dialog,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Footer,
    Form,
    FormItem,
    Header,
    Input,
    InputNumber,
    Main,
    Menu,
    MenuItem,
    Option,
    Pagination,
    RadioGroup,
    Radio,
    Row,
    Select,
    Table,
    TableColumn,
    Tabs,
    TabPane,
    Upload,
    Loading,
    MessageBox,
    Message
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

Vue.use(Aside)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Button)
Vue.use(Card)
Vue.use(Checkbox)
Vue.use(Col)
Vue.use(Container)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Footer)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Loading)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Row)
Vue.use(Select)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Upload)

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;