
  <message-content _ngcontent-ng-c3446978459="" class="model-response-text ng-star-inserted has-thoughts contains-extensions-response" _nghost-ng-c1192761489="" id="message-content-id-r_d45805ab1d27f0ec" style="height: auto;">
   <div _ngcontent-ng-c1192761489="" inline-copy-host="" class="markdown markdown-main-panel enable-updated-hr-color" id="model-response-message-contentr_d45805ab1d27f0ec" dir="ltr" style="--animation-duration: 400ms; --fade-animation-function: linear;">
	<h1>Cloudflare Workers + Pages + KV 博客系统</h1>
    <p></p>
    <p>这是一个高性能、全无服务器（Serverless）的博客系统，完全构建在 Cloudflare 生态系统之上。它利用 Cloudflare Workers 处理动态请求和 API，Cloudflare Pages 托管静态主题文件，并使用 Cloudflare KV 作为数据库。</p>
    <p>该项目基于 <code>cf-blog-plus</code> (v2.1.1) 修改而来，并进行了功能增强和优化。</p>
    <p></p>
    <h2>主要功能</h2>
    <p></p>
    <ul>
     <li><p><b>文章管理 (CRUD):</b> 通过后台安全登录，创建、编辑、删除文章。</p></li>
     <li><p><b>后台管理面板:</b> 提供 <code>/admin</code> 路径，用于管理文章、配置、评论等。</p></li>
     <li><p><b>文章属性:</b></p>
      <ul>
       <li><p>置顶文章</p></li>
       <li><p>密码保护</p></li>
       <li><p>隐藏文章</p></li>
       <li><p>自定义浏览量</p></li>
      </ul></li>
     <li><p><b>动态渲染:</b></p>
      <ul>
       <li><p>首页、文章页、分类页、标签页、搜索页均由 Worker 动态生成。</p></li>
       <li><p>支持文章分页。</p></li>
      </ul></li>
     <li><p><b>站点配置:</b> 在后台动态配置网站标题、Logo、菜单、友情链接、页脚信息等。</p></li>
     <li><p><b>内容管理:</b></p>
      <ul>
       <li><p>分类和标签系统。</p></li>
       <li><p>独立评论系统（按文章存储）。</p></li>
       <li><p>首页轮播图管理。</p></li>
      </ul></li>
     <li><p><b>SEO 友好:</b> 自动生成 <code>/sitemap.xml</code>。</p></li>
     <li><p><b>数据管理:</b> 支持后台一键导入/导出所有博客数据（文章和配置）。</p></li>
    </ul>
    <p></p>
    <h2>技术架构</h2>
    <p></p>
    <p>本系统将动态逻辑和静态资源分离，以实现最佳性能：</p>
    <ol start="1">
     <li><p><b>Cloudflare Workers (<code>index_plus.js</code>):</b></p>
      <ul>
       <li><p><b>核心后端:</b> 作为唯一的入口点，处理所有 HTTP 请求。</p></li>
       <li><p><b>路由中心:</b> 解析 URL（如 <code>/</code>、<code>/article/...</code>、<code>/admin/...</code>）并分发到不同处理器。</p></li>
       <li><p><b>API 服务器:</b> 提供后台管理所需的所有 API 接口（登录、文章增删改查、配置保存等）。</p></li>
       <li><p><b>模板引擎:</b> 内置 Mustache.js，用于在服务端拉取 KV 数据并渲染 HTML 模板。</p></li>
       <li><p><b>数据中枢:</b> 负责与 Cloudflare KV 交互，存取所有动态数据。</p></li>
      </ul></li>
     <li><p><b>Cloudflare Pages:</b></p>
      <ul>
       <li><p><b>静态资源 CDN:</b> 托管所有的主题文件（HTML 模板、CSS、JavaScript、图片、字体等）。</p></li>
       <li><p><b>Worker 的资源库:</b> Worker 脚本通过 <code>fetch</code> 请求部署在 Pages 上的 <code>*.pages.dev</code> URL 来获取 HTML 模板和静态资源。</p></li>
      </ul></li>
     <li><p><b>Cloudflare KV (Key-Value Store):</b></p>
      <ul>
       <li><p><b>数据库:</b> 用作应用的持久化数据存储，分为多个命名空间：</p>
        <ul>
         <li><p><code>XYRJ_BLOG</code>: 存储文章索引 (<code>article_index</code>) 和单篇文章内容 (<code>article:&lt;id&gt;</code>)。</p></li>
         <li><p><code>XYRJ_CONFIG</code>: 存储网站配置项（如站点名称、菜单、分类、友链等）。</p></li>
         <li><p><code>XYRJ_COMMENTS_KV</code>: 存储每篇文章对应的评论列表。</p></li>
         <li><p><code>XYRJ_CAROUSEL_KV</code>: 存储首页轮播图数据。</p></li>
        </ul></li>
      </ul></li>
     <li><p><b>环境变量 (Environment Variables):</b></p>
      <ul>
       <li><p><code>ADMIN_USERNAME</code>: 用于后台登录的管理员用户名。</p></li>
       <li><p><code>ADMIN_PASSWORD</code>: 用于后台登录的管理员密码。</p></li>
      </ul></li>
    </ol>
    <p></p>
    <h2>部署指南</h2>
    <p></p>
    <p>请按照以下步骤部署您的博客：</p>
    <p></p>
    <h3>步骤 1: 部署静态主题到 Cloudflare Pages</h3>
    <p></p>
    <ol start="1">
     <li><p>将本项目中的 <code>themes</code> 文件夹（包含 <code>JustNews</code> 主题）上传到一个新的 <b>Cloudflare Pages</b> 项目。</p></li>
     <li><p>部署成功后，Cloudflare 会为您分配一个唯一的 <code>*.pages.dev</code> 域名（例如：<code>myblog-1dt.pages.dev</code>）。<b>请复制此域名</b>，下一步需要用到。</p></li>
    </ol>
    <p></p>
    <h3>步骤 2: 创建 Cloudflare KV 命名空间</h3>
    <p></p>
    <p>在您的 Cloudflare 账户仪表板中，转到 &quot;Workers 和 Pages&quot; -&gt; &quot;KV&quot;，创建以下四个命名空间：</p>
    <ol start="1">
     <li><p><code>XYRJ_BLOG</code></p></li>
     <li><p><code>XYRJ_CONFIG</code></p></li>
     <li><p><code>XYRJ_COMMENTS_KV</code></p></li>
     <li><p><code>XYRJ_CAROUSEL_KV</code></p></li>
    </ol>
    <p></p>
    <h3>步骤 3: 配置和部署 Cloudflare Worker</h3>
    <p></p>
    <ol start="1">
     <li><p>转到 &quot;Workers 和 Pages&quot;，创建一个新的 <b>Worker</b> 服务（例如：<code>myblog-worker</code>）。</p></li>
     <li><p>点击 &quot;快速编辑&quot; 或 &quot;部署&quot;，将 <code>index_plus.js</code> 文件中的所有代码复制并粘贴到 Worker 的编辑器中。</p></li>
     <li><p><b>【重要】</b> 在 Worker 代码的顶部，找到 <code>cdn</code> 变量，将其值修改为您在 <b>步骤 1</b> 中获得的 Cloudflare Pages 域名：</p>
      <response-element class="" ng-version="0.0.0-PLACEHOLDER">
       <!---->
       <!---->
       <!---->
       <!---->
       <code-block _nghost-ng-c3376969095="" class="ng-tns-c3376969095-94 ng-star-inserted" style="">
        <!---->
        <!---->
        <div _ngcontent-ng-c3376969095="" class="code-block ng-tns-c3376969095-94 ng-animate-disabled ng-trigger ng-trigger-codeBlockRevealAnimation" jslog="223238;track:impression,attention;BardVeMetadataKey:[[&quot;r_d45805ab1d27f0ec&quot;,&quot;c_4d4e0608f1243472&quot;,null,&quot;rc_1b1dbdb5adb8e63e&quot;,null,null,&quot;zh&quot;,null,1,null,null,1,0]]" data-hveid="0" decode-data-ved="1" data-ved="0CAAQhtANahgKEwiE5dmSnsKQAxUAAAAAHQAAAAAQrwM" style="display: block;">
         <div _ngcontent-ng-c3376969095="" class="code-block-decoration header-formatted gds-title-s ng-tns-c3376969095-94 ng-star-inserted" style="">
          <span _ngcontent-ng-c3376969095="" class="ng-tns-c3376969095-94">JavaScript</span>
          <div _ngcontent-ng-c3376969095="" class="buttons ng-tns-c3376969095-94 ng-star-inserted">
           <button _ngcontent-ng-c3376969095="" aria-label="Copy code" mat-icon-button="" mattooltip="Copy code" class="mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-tooltip-trigger copy-button ng-tns-c3376969095-94 mat-unthemed ng-star-inserted" mat-ripple-loader-uninitialized="" mat-ripple-loader-class-name="mat-mdc-button-ripple" mat-ripple-loader-centered="" jslog="179062;track:generic_click,impression;BardVeMetadataKey:[[&quot;r_d45805ab1d27f0ec&quot;,&quot;c_4d4e0608f1243472&quot;,null,&quot;rc_1b1dbdb5adb8e63e&quot;,null,null,&quot;zh&quot;,null,1,null,null,1,0]];mutable:true"><span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>
            <mat-icon _ngcontent-ng-c3376969095="" role="img" fonticon="content_copy" class="mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" data-mat-icon-name="content_copy"></mat-icon><span class="mat-focus-indicator"></span><span class="mat-mdc-button-touch-target"></span></button>
           <!---->
           <!---->
          </div>
          <!---->
         </div>
         <!---->
         <div _ngcontent-ng-c3376969095="" class="formatted-code-block-internal-container ng-tns-c3376969095-94">
          <div _ngcontent-ng-c3376969095="" class="animated-opacity ng-tns-c3376969095-94">
           <pre _ngcontent-ng-c3376969095="" class="ng-tns-c3376969095-94"><code _ngcontent-ng-c3376969095="" role="text" data-test-id="code-content" class="code-container formatted ng-tns-c3376969095-94"><span class="hljs-comment">// ...</span>
<span class="hljs-keyword">const</span> theme = <span class="hljs-string">&quot;JustNews&quot;</span>;
<span class="hljs-comment">// 将下面的 URL 替换为您自己的 Pages 域名</span>
<span class="hljs-keyword">const</span> cdn = <span class="hljs-string">&quot;https://xxx.xx/themes&quot;</span>; 
<span class="hljs-comment">// ...</span>
</code></pre>
           <!---->
          </div>
         </div>
        </div>
        <!---->
        <!---->
       </code-block>
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
       <!---->
      </response-element></li>
     <li><p>保存并部署 Worker。</p></li>
     <li><p>返回 Worker 的管理界面，转到 <b>&quot;设置&quot; -&gt; &quot;变量&quot;</b>:</p>
      <ul>
       <li><p><b>KV 命名空间绑定 (KV Namespace Bindings):</b> 点击 &quot;添加绑定&quot;，将您在 <b>步骤 2</b> 中创建的四个 KV 命名空间全部绑定到此 Worker。</p>
        <ul>
         <li><p>变量名称: <code>XYRJ_BLOG</code> -&gt; KV 命名空间: <code>XYRJ_BLOG</code></p></li>
         <li><p>变量名称: <code>XYRJ_CONFIG</code> -&gt; KV 命名空间: <code>XYRJ_CONFIG</code></p></li>
         <li><p>变量名称: <code>XYRJ_COMMENTS_KV</code> -&gt; KV 命名空间: <code>XYRJ_COMMENTS_KV</code></p></li>
         <li><p>变量名称: <code>XYRJ_CAROUSEL_KV</code> -&gt; KV 命名空间: <code>XYRJ_CAROUSEL_KV</code></p></li>
        </ul></li>
       <li><p><b>环境变量 (Environment Variables):</b> 点击 &quot;添加变量&quot;，设置您的后台登录凭据：</p>
        <ul>
         <li><p>变量名称: <code>ADMIN_USERNAME</code> -&gt; 值: <code>您想要的用户名</code></p></li>
         <li><p>变量名称: <code>ADMIN_PASSWORD</code> -&gt; 值: <code>您想要的密码</code></p></li>
        </ul></li>
      </ul></li>
     <li><p>保存并部署更改。</p></li>
    </ol>
    <p></p>
    <h3>步骤 4: 设置路由</h3>
    <p></p>
    <ol start="1">
     <li><p>在 Cloudflare 仪表板中，选择您的网站域名。</p></li>
     <li><p>转到 <b>&quot;Workers 路由&quot;</b> (或在 Worker 的 &quot;触发器&quot; 选项卡中添加路由)。</p></li>
     <li><p>添加一条路由，将您希望博客访问的路径指向刚刚创建的 Worker。</p>
      <ul>
       <li><p><b>路由:</b> <code>blog.yourdomain.com/*</code> (或 <code>yourdomain.com/*</code> 如果您想让它在根域生效)</p></li>
       <li><p><b>服务:</b> <code>myblog-worker</code> (您在步骤 3 中创建的 Worker 名称)</p></li>
       <li><p><b>环境:</b> <code>production</code></p></li>
      </ul></li>
    </ol>
    <p></p>
    <h3>步骤 5: 开始使用</h3>
    <p></p>
    <p>部署完成后，访问您在步骤 4 中设置的域名（例如 <code>blog.yourdomain.com</code>）即可看到博客首页。</p>
    <p>访问 <code>blog.yourdomain.com/admin</code>，使用您在步骤 3 中设置的用户名和密码登录后台，开始配置您的网站和发表文章。</p>
    <p><b>重要提示:</b> </p>
   </div>
   <!---->
  </message-content>
