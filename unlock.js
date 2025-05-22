// unlock.js - 网页去除水印 + 解锁右键、复制、选中等限制

(function() {
    // 1. 去除水印
    function removeWatermarks() {
        // 通过id匹配
        document.querySelectorAll('[id^="mask_div"], [id*="watermark"], [id*="shuiyin"]').forEach(el => {
            el.remove();
        });
        // 通过class匹配
        document.querySelectorAll('.watermark, .shuiyin, .v-water-mark').forEach(el => {
            el.remove();
        });
        // 通过样式匹配（透明度低、层级高、禁止事件等）
        document.querySelectorAll('*').forEach(el => {
            const st = getComputedStyle(el);
            if (
                st.opacity < 0.15 && 
                (st.position === "absolute" || st.position === "fixed") &&
                (parseInt(st.zIndex) > 99 || st.zIndex === "auto") &&
                st.pointerEvents === "none" &&
                el.innerText.length < 50 && el.offsetHeight < 50
            ) {
                el.remove();
            }
        });
    }

    // 2. 解锁右键和复制
    function unlockPage() {
        // 解除常见的事件
        ['contextmenu','selectstart','copy','cut','dragstart','mousedown','mouseup','keydown','keypress','keyup'].forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, true);
        });

        // 解锁全局和所有节点的事件处理器
        function clearNodeEvents(node) {
            node.oncontextmenu = null;
            node.onselectstart = null;
            node.oncopy = null;
            node.oncut = null;
            node.ondragstart = null;
            node.onmousedown = null;
            node.onmouseup = null;
            node.onkeydown = null;
            node.onkeypress = null;
            node.onkeyup = null;
        }
        clearNodeEvents(document);
        clearNodeEvents(document.body);
        document.querySelectorAll('*').forEach(clearNodeEvents);

        // 解锁样式
        const style = document.createElement('style');
        style.innerHTML = `
            * { -webkit-user-select: text !important; user-select: text !important; }
            * { -webkit-touch-callout: default !important; }
        `;
        document.head.appendChild(style);
    }

    // 3. 自动运行、定时重复以应对动态加载
    function main() {
        removeWatermarks();
        unlockPage();
    }
    main();
    setTimeout(main, 1200);
    setTimeout(main, 3000);
    setInterval(removeWatermarks, 2000);

    // 部分网站可能在动态注入，增加MutationObserver
    new MutationObserver(main).observe(document.body, {childList:true, subtree:true});
})();