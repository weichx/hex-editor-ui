Node.prototype.insertChild = function (child, index) {
    if (index < 0) index = 0;
    if (index >= this.children.length) {
        this.appendChild(child)
    }
    else {
        this.insertBefore(child, this.children[index])
    }
};


const DocumentHead = document.head || document.getElementsByTagName('head')[0];

window.createStyleSheet = function (css) {

  css = css.replace('<style>', "").replace("</style>", "");
  const styleTag = document.createElement('style');
  styleTag.type = 'text/css';
  if (styleTag.styleSheet) {
    styleTag.styleSheet.cssText = css;
  } else {
    styleTag.appendChild(document.createTextNode(css));
  }

  DocumentHead.appendChild(styleTag);
  return styleTag;
};