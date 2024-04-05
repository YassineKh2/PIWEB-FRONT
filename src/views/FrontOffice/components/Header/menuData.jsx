const menuData = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  /*
  {
    id: 33,
    title: "Our Sponsors",
    path: "/addsp",
    newTab: false,
  },
  {
    id: 3,
    title: "Reservation",
    path: "/addReservation",
    newTab: false,
  },
  */
  {
    id: 4,
    title: "Tournament",
    path: "/tournament/showAll",
    newTab: false,
  },
  {
    id: 5,
    title: "Teams",
    path: "/team/all",
    newTab: false,
  },
  {
    id: 6,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "About Page",
        path: "/about",
        newTab: false,
      },
      {
        id: 42,
        title: "Contact Page",
        path: "/contact",
        newTab: false,
      },
      {
        id: 43,
        title: "Blog Grid Page",
        path: "/blog",
        newTab: false,
      },
      {
        id: 44,
        title: "Blog Sidebar Page",
        path: "/blog-sidebar",
        newTab: false,
      },
      {
        id: 45,
        title: "Blog Details Page",
        path: "/blog-details",
        newTab: false,
      },
      {
        id: 46,
        title: "Sign In Page",
        path: "/signin",
        newTab: false,
      },
      {
        id: 47,
        title: "Sign Up Page",
        path: "/signup",
        newTab: false,
      },
      {
        id: 48,
        title: "Error Page",
        path: "/error",
        newTab: false,
      },
      {
        id: 49,
        title: "Profile",
        path: "/profile",
        newTab: false,
      },
    ],
  },
];


export default menuData;
