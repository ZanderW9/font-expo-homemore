<<<<<<< HEAD
# font-expo-homemore
=======
## 运行项目
```bash
# 使用 Node 20
nvm install 20
nvm use 20

yarn install

# 启动 expo
yarn start
```
启动之后，手机下载 Expo Go 软件，用手机自带扫码工具扫命令行出现的二维码，就会跳转到手机 App 界面

在命令行中按 w， 自动在浏览器中打开 web

```json
# 也可以单独启用 web 或者 ios 或者 Android，不过一般直接 start 就好了
"start": "expo start",
"android": "expo start --android",
"ios": "expo start --ios",
"web": "expo start --web",
```

## 初始化 & 配置项目
```bash
# 新建 expo 项目
npx create-expo-app mobile
npx create-expo-app@latest --template tabs@49

# 初始化 yarn，如果没有，npm install -g yarn
yarn

#初始化 typescript & eslint
npm init @eslint/config
tsc --init
```

## 安装依赖
```bash
# 有两种安装包的方式：yarn add & npx expo install
# npx expo install 自动安装适配 expo 版本的包
npx expo install react-dom react-native-web @expo/webpack-config
# yarn add 一般安装最新的包
yarn add react-native-safe-area-context react-native-screens

# 如果 yarn start 提示版本问题：
npx expo install --fix 
```

# BUILD
build 命令：eas build -p android --profile preview --local

.env 设置必须放在 eas.json 中，以 EXPO_PUBLIC_开头
或者用这个命令放进eas
```eas secret:push --scope project --env-file .env --force ```

安装java11: https://medium.com/@kirebyte/using-homebrew-to-install-java-jdk11-on-macos-2021-4a90aa276f1c

配置 android studio: 
```zsh
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

# 代码规范

## 样式设置
native 里没有 css 文件。可以和 react 里一样写行内 style，但如果要单独使用 style，得使用 native 的 StyleSheet
```js
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#397af8',
    width: '100%',
  }
})

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      .......
    </View>
  )
}
```

## UI 库
使用 react native elements ui

文档：https://reactnativeelements.com/docs

### Icons
icons 使用 expo 自带的，不然适配不了 web
```js
import { Ionicons } from '@expo/vector-icons';
const myIcons = <Ionicons name="menu-outline" size={24} color="white" />
```

Ionicons 只是其中一个库，还可以使用 AntDesign，FontAwesome 等 icon 库， 比如：
```js
import { AntDesign } from '@expo/vector-icons';
<AntDesign name="arrowleft" size={24} color="white" />
```
具体有哪些，可以查 expo-icons 库：https://icons.expo.fyi/Index
>>>>>>> 76e01c6 (setup expo)
