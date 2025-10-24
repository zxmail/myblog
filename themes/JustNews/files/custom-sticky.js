/*
 * 基于 Blog-ab72de5.../main.js 的自定义脚本
 * 已适配 'myblog' (JustNews) 主题的 .sidebar-inner-wrapper 结构
 */
class StickySidebar {
    constructor(selector, topSpacing = 0) {
        this.sidebar = document.querySelector(selector);
        if (!this.sidebar) {
            console.error("StickySidebar: 未找到目标元素 " + selector);
            return;
        }
        
        // --- 针对 'myblog' 主题的修改 ---
        this.sidebarInner = this.sidebar.querySelector('.sidebar-inner-wrapper');
        if (!this.sidebarInner) {
            console.error("StickySidebar: 未找到内部包装器 (.sidebar-inner-wrapper)。");
            return;
        }
        // 'myblog' 的容器是父元素 '.main-layout'
        this.container = this.sidebar.parentElement; 
        if (!this.container) {
            console.error("StickySidebar: 未找到容器 (父元素)。");
            return;
        }
        // --- 修改结束 ---

        this.topSpacing = topSpacing;
        this.init();
    }

    init() {
        this.scrollHandler = this.scrollHandler.bind(this);
        window.addEventListener('scroll', this.scrollHandler);
        // 存储侧边栏的原始宽度
        this.sidebarWidth = this.sidebar.offsetWidth + 'px';
        
        // 确保在调整窗口大小时重新计算宽度
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
            // 增加 20px 间距，与 article.html 的 bottomSpacing: 120 (100+20) 概念类似
            if (scrollTop + this.topSpacing + sidebarHeight + 20 > containerTop + containerHeight) {
                // 粘在容器底部
                this.sidebarInner.style.position = 'absolute';
                this.sidebarInner.style.top = 'auto';
                this.sidebarInner.style.bottom = '0';
                this.sidebarInner.style.width = this.sidebarWidth;
            } else {
                // 粘在顶部 (fixed)
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
