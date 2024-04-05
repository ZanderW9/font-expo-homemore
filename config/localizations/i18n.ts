import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { store } from "@/config/state/store";

const resources = {
  en: {
    translation: {
      back: "Back",
      next: "Next",
      sign_in: "Sign In",
      sign_up: "Sign Up",
      sign_out: "Sign Out",
      dont_have_account: "Don't have an account?",
      create_listing: {
        save_and_exit: "Save & Exit",
        step_1_button: "Step 1",
        step_2_button: "Step 2",
        step_3_button: "Step 3",
        save_success: {
          title: "Listing Saved in Draft",
          description: "Your listing has been saved, but not yet published.",
          return_home: "Return Home",
        },
        step_1: {
          title: "Tell us about your place",
          subtitle:
            "In this step, we will ask you which type of property you have and if guests will book the entire place or just a room. The let us know the location and how many guests can stay.",
        },
        type_of_service: {
          title: "Which type of services are you looking to offer?",
          rent: "Rent",
          rent_description:
            "Weekly rent with an option for daily payment. Suited for long-term and short-term tenants.",
          travel: "Travel",
          travel_description:
            "Strictly daily payment. Ideal for short-term travelers.",
        },
        type_of_place: {
          title: "Which of the following best describes your place?",
          apartment: "Apartment",
          house: "House",
          unit: "Unit",
        },
        type_of_rent: {
          title: "What type of place will guests have?",
          an_entire_place: "An entire place",
          an_entire_place_description:
            "Guests will have the entire place to themselves.",
          a_room: "A room",
          a_room_description:
            "Guests will have their own room and share common areas.",
        },
      },
      explore: {
        map_button: "Map",
        search_placeholder: "Explore home from here~",
      },
      mainTab: {
        explore: "Explore",
        wishlist: "Wishlist",
        inbox: "Inbox",
        services: "Services",
        profile: "Profile",
      },
      post: {
        not_sign_in: {
          title: "It's time for you to post a listing!",
          description:
            "Any kind of property, house or apartment, short or long term......click below to get started~",
        },
        post_listing: {
          button: "Post Your Listing",
          title: "It's time for you to post a listing!",
          description:
            "Any kind of property, house or apartment, short or long term......click below to get started~",
        },
      },
      wishlist: {
        not_sign_in: {
          title: "Save your favorite listings!",
          description:
            "Click the heart button to add your favorite listings to your wishlist for easy access~",
        },
      },
      inbox: {
        not_sign_in: {
          title: "Sign in to view your messages!",
          description:
            "View and respond to messages from guests and hosts. Sign in to get started~",
        },
      },
      profile: {
        not_sign_in: {
          title: "Find your home from here!",
          description:
            "Sign in to publish or order a listing, or view your profile~",
        },
        member_since: "Joined on",
        create_listing_button: "Create Listing",
        manage_listing_button: "Manage Listing",
        my_order_button: "My Order",
        settings_button: "Settings",
        account_security_button: "Account Security",
        sign_out_button: "Sign Out",
        settings: {
          title: "Settings",
          about_button: "About the App",
          language_button: "Language Settings",
          language: {
            title: "Language Settings",
          },
          about: {
            title: "About the App",
            version: "Version",
            versionId: "Version ID",
            channel: "Channel",
            lastUpdate: "Last Update",
          },
        },
      },
    },
  },
  zh: {
    translation: {
      back: "返回",
      next: "下一步",
      sign_in: "登录",
      sign_up: "注册",
      sign_out: "退出登录",
      dont_have_account: "还没有账号？",
      create_listing: {
        save_and_exit: "保存并退出",
        step_1_button: "第一步",
        step_2_button: "第二步",
        step_3_button: "第三步",
        save_success: {
          title: "房源已保存为草稿",
          description: "您的房源已保存，但尚未发布。",
          return_home: "返回首页",
        },
        step_1: {
          title: "描述你的房源",
          subtitle:
            "在这一步中，我们将询问您的房产类型，客人是否会预订整个房源或只是一个房间。然后让我们知道位置和可以容纳多少客人。",
        },
        type_of_service: {
          title: "您希望提供哪种类型的服务？",
          rent: "出租",
          rent_description: "每周租金，可选择每日付款。适合长期和短期租客。",
          travel: "民宿",
          travel_description: "严格的日付款。适合短期旅行者。",
        },
        type_of_place: {
          title: "以下哪种最能描述您的房源？",
          apartment: "公寓",
          house: "房屋",
          unit: "单元",
        },
        type_of_rent: {
          title: "客人将拥有什么类型的房源？",
          an_entire_place: "整套房源",
          an_entire_place_description: "客人将整个房源独享。",
          a_room: "单间",
          a_room_description: "客人将拥有自己的房间并共享公共区域。",
        },
      },
      explore: {
        map_button: "地图",
        search_placeholder: "在这里搜索房源~",
      },
      mainTab: {
        explore: "探索",
        wishlist: "收藏",
        inbox: "消息",
        services: "服务",
        profile: "我的",
      },
      post: {
        not_sign_in: {
          title: "是时候发布你的房源了！",
          description:
            "任何类型的房产，房屋或公寓，短期或长期......点击下方开始～",
        },
        post_listing: {
          button: "发布你的房源",
          title: "是时候发布你的房源了！",
          description:
            "任何类型的房产，房屋或公寓，短期或长期......点击下方开始～",
        },
      },
      wishlist: {
        not_sign_in: {
          title: "收藏你喜欢的房源！",
          description: "点击收藏按钮，将你喜欢的房源添加到收藏夹，方便查看～",
        },
      },
      inbox: {
        not_sign_in: {
          title: "登录查看消息！",
          description: "查看并回复来自客人和房东的消息。点击下方开始～",
        },
      },
      profile: {
        not_sign_in: {
          title: "从这里找到你的家！",
          description: "登录以发布或预定房源，或是查看您的个人资料～",
        },
        member_since: "加入于",
        create_listing_button: "创建房源",
        manage_listing_button: "管理房源",
        my_order_button: "我的订单",
        settings_button: "设置",
        account_security_button: "账户安全",
        sign_out_button: "退出登录",
        settings: {
          title: "设置",
          about_button: "关于本应用",
          language_button: "语言设置",
          language: {
            title: "语言设置",
          },
          about: {
            title: "关于本应用",
            version: "版本",
            versionId: "版本 ID",
            channel: "渠道",
            lastUpdate: "最后更新时间",
          },
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: "v3",
  lng: store.getState().appMeta.locale || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

store.subscribe(() => {
  i18n.changeLanguage(store.getState().appMeta.locale);
});

export default i18n;
