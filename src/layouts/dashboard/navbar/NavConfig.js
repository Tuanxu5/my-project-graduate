// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menu_item: getIcon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'TỔNG QUAN',
    items: [
      { title: 'Trang Quản Trị', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
      { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
      { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
    ],
  },
  {
    subheader: 'Quản Lí Nhân Sự',
    items: [
      {
        title: 'Quản Lí Phòng Ban',
        path: PATH_DASHBOARD?.departmentsManagement?.root,
        icon: ICONS.kanban,
        children: [
          { title: 'Danh Sách Phòng Ban', path: PATH_DASHBOARD?.departmentsManagement?.list },
          { title: 'Thêm Phòng Ban', path: PATH_DASHBOARD?.departmentsManagement?.create },
        ],
      },
      {
        title: 'Quản Lí Chức Vụ',
        path: PATH_DASHBOARD?.positionManagement?.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh Sách Chức Vụ', path: PATH_DASHBOARD?.positionManagement?.list },
          { title: 'Thêm Chức Vụ', path: PATH_DASHBOARD?.positionManagement?.create },
        ],
      },
      {
        title: 'Quản Lí Nhân Viên',
        path: PATH_DASHBOARD?.staffManagement?.root,
        icon: ICONS?.user,
        children: [
          { title: 'Danh Sách Nhân Viên', path: PATH_DASHBOARD?.staffManagement?.list },
          { title: 'Quản lí phép', path: PATH_DASHBOARD?.leaveManagement?.list },
          { title: 'Thêm Nhân Viên', path: PATH_DASHBOARD?.staffManagement?.create },
        ],
      },
      {
        title: 'Quản Lí Chấm Công',
        path: PATH_DASHBOARD?.TimeSheetsManagement?.root,
        icon: ICONS?.user,
        children: [
          { title: 'Bảng Công', path: PATH_DASHBOARD?.TimeSheetsManagement?.list },
          { title: 'Thêm Nhân Viên', path: PATH_DASHBOARD?.TimeSheetsManagement?.create },
        ],
      },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'profile', path: PATH_DASHBOARD.user.profile },
          { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'create', path: PATH_DASHBOARD.user.new },
          { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // E-COMMERCE
      {
        title: 'e-commerce',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
        ],
      },

      // INVOICE
      {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'list', path: PATH_DASHBOARD.invoice.list },
          { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
          { title: 'create', path: PATH_DASHBOARD.invoice.new },
          { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        ],
      },

      // BLOG
      {
        title: 'blog',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.demoView },
          { title: 'create', path: PATH_DASHBOARD.blog.new },
        ],
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      {
        title: 'mail',
        path: PATH_DASHBOARD.mail.root,
        icon: ICONS.mail,
        info: (
          <Label variant="outlined" color="error">
            +32
          </Label>
        ),
      },
      { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
      { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
    ],
  },
];

export default navConfig;
