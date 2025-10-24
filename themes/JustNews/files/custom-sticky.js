/*
 * 基于 Blog-ab72de5.../main.js 的自定义脚本
 * 已适配 'myblog' (JustNews) 主题的 #desktop-sidebar-wrapper 和 .sidebar-inner-wrapper 结构
 */
class StickySidebar {
    constructor(selector, topSpacing = 0) {
        // 这是我们的目标, 即 <div class="right-column" id="desktop-sidebar-wrapper">
        this.sidebar = document.querySelector(selector);
        if (!this.sidebar) {
            console.error("StickySidebar: 未找到目标元素 " + selector);
            return;
        }
        
        // 这是 'myblog' 主题中真正需要移动的内容
        this.sidebarInner = this.sidebar.querySelector('.sidebar-inner-wrapper');
        if (!this.sidebarInner) {
            console.error("StickySidebar: 未找到内部包装器 (.sidebar-inner-wrapper)。");
            return;
        }
        
        // 'myblog' 的容器是 <div class="main-layout">
        // .parentElement 会找到 .main-layout
        this.container = this.sidebar.parentElement; 
        if (!this.container) {
            console.error("StickySidebar: 未找到容器 (父元素 .main-layout)。");
            return;
        }

        this.topSpacing = topSpacing;
        this.init();
    }

    init() {
        this.scrollHandler = this.scrollHandler.bind(this);
        window.addEventListener('scroll', this.scrollHandler);
        // 存储侧边栏的原始宽度
        this.sidebarWidth = this.sidebar.offsetWidth + 'px';
        
        window.addEventListener('resize', () => {
             // 仅在非固定状态下更新宽度
            if (this.sidebarInner.style.position === 'relative' || this.sidebarInner.style.position === '') {
                 this.sidebarWidth = this.sidebar.offsetWidth + 'px';
            }
        });
    }

    scrollHandler() {
        // 使用内部包装器的高度
        const sidebarHeight = this.sidebarInner.offsetHeight;
        const containerHeight = this.container.offsetHeight;
        const containerTop = this.container.offsetTop;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 何时开始固定
        if (scrollTop + this.topSpacing > containerTop) {
            // 检查是否滚动到底部
            // 增加 20px 间距，防止贴得太近
            if (scrollTop + this.topSpacing + sidebarHeight + 20 > containerTop + containerHeight) {
                // 智能切换：粘在容器底部 (Absolute)
                this.sidebarInner.style.position = 'absolute';
                this.sidebarInner.style.top = 'auto';
                this.sidebarInner.style.bottom = '0';
                this.sidebarInner.style.width = this.sidebarWidth;
            } else {
                // 粘在顶部 (Fixed)
                this.sidebarInner.style.position = 'fixed';
                this.sidebarInner.style.top = this.topSpacing + 'px';
                this.sidebarInner.style.bottom = 'auto';
                this.sidebarInner.style.width = this.sidebarWidth;
            }
        } else {
            // 恢复正常
            this.sidebarInner.style.position = 'relative';
            this.sidebarInner.style.top = '0';
            this.sidebarInner.style.width = 'auto'; // 重置宽度
        }
    }

    destroy() {
        window.removeEventListener('scroll', this.scrollHandler);
        this.sidebarInner.style.position = 'relative';
        this.sidebarInner.style.top = '0';
        this.sidebarInner.style.width = 'auto';
    }
}
