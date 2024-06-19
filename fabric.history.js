// 历史记录
export const createHistory = ({
  canvas,
  historyEvent = [],
  maxlength = 20,
}) => {
  // 初始状态
  canvas._initialState = { ...canvas.toJSON() };
  canvas._stack = [canvas._initialState];
  canvas._historyIndex = 0;
  canvas._historyMaxLength = maxlength;
  canvas.undo = undo;
  canvas.redo = redo;
  canvas.reset = reset;
  canvas.record = record;
  for (let event of historyEvent) {
    canvas.on(event, () => record.call(canvas));
  }
};

// 载入历史状态
const _handleLoadState = function (state, action) {
  // 更新canvas JSON记录
  this.loadFromJSON(state, () => {
    this.forEachObject(function (object) {
      object.set("selectable", false);
    });
    this.renderAll();
  });
  this.fire("history:change", action);
};

// 撤销
function undo() {
  const canvas = this;
  const { _historyIndex: index, _stack: stack } = canvas;
  if (index === 0) return;
  _handleLoadState.call(canvas, stack[--canvas._historyIndex], "undo");
}
// 重做
function redo() {
  const canvas = this;
  const { _historyIndex: index, _stack: stack } = canvas;
  if (index >= stack.length - 1) return;
  _handleLoadState.call(canvas, stack[++canvas._historyIndex], "redo");
}
// 重置
function reset() {
  const canvas = this;
  const { _initialState: initialState } = canvas;
  canvas._historyIndex = 0;
  canvas._stack = [initialState];
  _handleLoadState.call(canvas, initialState, "reset");
}
// 记录
function record() {
  const canvas = this;
  const {
    _historyIndex: index,
    _stack: stack,
    _historyMaxLength: maxlength,
  } = canvas;
  while (stack.length - 1 > index) {
    stack.pop();
  }
  if (stack.length === maxlength) {
    stack.shift();
    canvas._historyIndex -= 1;
  }
  stack.push(canvas.toJSON());
  canvas._historyIndex += 1;
  canvas.fire("history:change", "record");
}
