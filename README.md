# fabricjs-history

<h3 align="center">
    fabric.js添加历史记录维护，支持撤销重做等操作；
    Maintain fabric history, support undo redo, etc.
</h3>

<br/>

![](https://kid-1912.github.io/img/FabricJS.jpg)

---

<p align="center">
  <a href="https://www.npmjs.com/package/fabricjs-history">
    <img
     alt="NPM URL"
     src="https://img.shields.io/badge/npm-fabricjsHistory?logo=npm">
  </a>
  <img
     alt="version"
     src="https://img.shields.io/badge/version-1.0.0-blue">
</p>

## Install

```shell
npm install fabricjs-history -S
```

## Usage

### Initialization

`createHistory()` 将初始化历史记录状态

```js
import { fabric } from "fabric";
import { createHistory } from "fabricjs-history";

const canvas = new fabric.Canvas($canvas, {
  width,
  height,
  selection: false,
  hoverCursor: "default",
  freeDrawingCursor: "none",
});
// ...
createHistory({ canvas });
```

### Operation

**record**：记录当前画布状态

```js
canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
canvas.record();

fabric.Image.fromURL(
  url,
  function (img) {
    canvas.setBackgroundImage(img);
    canvas.renderAll();
    canvas.record(); // 记录当前画布状态
  },
  { crossOrigin: "Anonymous" }
);
```

除了手动 `record` 历史记录，还可以监听画布事件，自动记录历史记录

```js
import { fabric } from "fabric";
import { createHistory } from "fabricjs-history";

const canvas = new fabric.Canvas($canvas, {
  width,
  height,
});

// ...

createHistory({
  canvas,
  maxHistoryLength: 20, //可选，最大历史记录长度，默认20
  historyEvent: ["path:created", "erasing:end", ...], // 可选，监听的画布事件自动记录，默认为[]
});
```

注：fabricjs 相关基础事件可见 http://fabricjs.com/events

**undo**：撤销操作

**redo**：重做操作

**reset**：重置历史记录

### Properties

`canvas._stack`：历史记录栈，查看历史记录条数 `canvas._stack.length`

`canvas._historyIndex`：当前历史记录索引

### Event

```js
canvas.on("history:change", function (action) {
  console.log(action); // undo | redo | reset | record
  console.log(canvas._historyIndex, canvas.canvas._stack);
});
```
