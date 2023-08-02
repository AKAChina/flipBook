<template>
    
    <div 
         id="page" 
         :class="{ 'has-mouse': hasMouse }" 
         @touchstart="hasMouse = false">
         <img src="" alt="">
    <flipbook 
            class="flipbook" 
            :pages="pages" 
            :pagesHiRes="pagesHiRes" 
            :startPage="pageNum" 
            v-slot="flipbook"
            ref="flipbook" 
            
            @flip-left-start="onFlipLeftStart" @flip-left-end="onFlipLeftEnd" @flip-right-start="onFlipRightStart"
            @flip-right-end="onFlipRightEnd" @zoom-start="onZoomStart" @zoom-end="onZoomEnd">
        <!-- 页面上方按钮开始******************************************************* -->
            <div class="action-bar">
            <left-icon
              class="btn left"
              :class="{ disabled: !flipbook.canFlipLeft }"
              @click="flipbook.flipLeft"
            />
            <plus-icon
              class="btn plus"
              :class="{ disabled: !flipbook.canZoomIn }"
              @click="flipbook.zoomIn"
            />
            <span class="page-num">
              页数 {{ flipbook.page }} / {{ flipbook.numPages }}
            </span>
            <minus-icon
              class="btn minus"
              :class="{ disabled: !flipbook.canZoomOut }"
              @click="flipbook.zoomOut"
            />
            <right-icon
              class="btn right"
              :class="{ disabled: !flipbook.canFlipRight }"
              @click="flipbook.flipRight"
            />
            </div>
         <!-- 页面上方按钮结束******************************************************* -->   
           
    </flipbook>
    <!-- 页面下方的按钮，和页面上方按钮不同，flipbook对象无法直接获取，只能通过函数间接实现相应功能 -->
            <div class="action-bar">
            <left-icon
              class="btn left"
              @click="clickLeft"
              :class="{ disabled: !Book.canLeft }"
            />
            <plus-icon
              class="btn plus"
              @click="clickZoomIn"
              :class="{ disabled: !Book.canZoomIn }"
            />
            <span class="page-num">
                页数 {{Book.CRpage }} / {{Book.CRnumPages }}
            </span>
            <minus-icon
              class="btn minus"
              @click="clickZoomOut"
              :class="{ disabled: !Book.canZoomOut }"
            />
            <right-icon
              class="btn right"
              @click="clickRight"
              :class="{ disabled: !Book.canRight }"
            />
            </div>
    <!-- 如果只需要上方按钮的话可以把以上代码注释掉 -->
    </div>
</template>
<script src="https://unpkg.com/flipbook-vue"></script>
<script>
import Flipbook from 'flipbook-vue/vue2'
import 'vue-material-design-icons/styles.css'
import LeftIcon from 'vue-material-design-icons/ChevronLeftCircle'
import RightIcon from 'vue-material-design-icons/ChevronRightCircle'
import PlusIcon from 'vue-material-design-icons/PlusCircle'
import MinusIcon from 'vue-material-design-icons/MinusCircle'
import axios from 'axios';
// 注册组件
export default {
    components: { Flipbook,LeftIcon, RightIcon, PlusIcon, MinusIcon},
    props:{
        
    },
    data() {
        return {
            pages: [],
            pagesHiRes: [],
            hasMouse: true,
            pageNum: null,
            Book:{
                CRpage:0,
            CRnumPages:0,
            canLeft:false,
            canRight:false,
            canZoomIn:false,
            canZoomOut:false
            },
        }
    },
    methods: {
        getPage(){
        const flipbook = this.$refs.flipbook
        this.Book.CRpage=flipbook.page
        this.Book.CRnumPages=flipbook.numPages
        this.Book.canLeft=flipbook.canFlipLeft
        this.Book.canRight=flipbook.canFlipRight
        this.Book.canZoomIn=flipbook.canZoomIn
        this.Book.canZoomOut=flipbook.canZoomOut
        },
        onFlipLeftStart(page) { 
            //console.log('flip-left-start', page) 
            setTimeout(()=>{this.getPage()},1)
        },
        onFlipLeftEnd(page) {
            //console.log('flip-left-end', page)
            window.location.hash = '#' + page
            setTimeout(()=>{this.getPage()},1)
        },
        onFlipRightStart(page) { 
            //console.log('flip-right-start', page) 
            setTimeout(()=>{this.getPage()},1)
        },
        onFlipRightEnd(page) {
            //console.log('flip-right-end', page)
            window.location.hash = '#' + page
            setTimeout(()=>{this.getPage()},1)
        },
        onZoomStart(zoom) {
            //console.log('zoom-start', zoom)
            setTimeout(()=>{this.getPage()},1)
        },
        onZoomEnd(zoom) {
            //console.log('zoom-end', zoom)
            setTimeout(()=>{this.getPage()},1)
        },
        setPageFromHash() {
            const n = parseInt(window.location.hash.slice(1), 10)
            if (isFinite(n)) this.pageNum = n
        },
        //下面的代码用来实现翻页缩放效果
        
        clickLeft(){
            this.$refs.flipbook.flipLeft()
        },
        clickRight(){
            this.$refs.flipbook.flipRight()
            
        },
        clickZoomIn(){
            this.$refs.flipbook.zoomIn()
        },
        clickZoomOut(){
            this.$refs.flipbook.zoomOut() 
        },
        //每次页面更新时获取当前页数和总页数
        
        
    },
    mounted() {
        const images = require.context('../assets/images', false, /\.jpg$/);
        const imagesLarge = require.context('../assets/images-large', false, /\.jpg$/);

        const imageFiles = images.keys().map(images);
        const imageLargeFiles = imagesLarge.keys().map(imagesLarge);
        //require.context()函数是一个webpack提供的API，可以用来在运行时动态地获取模块信息。
        //该函数接收三个参数：要搜索的目录、是否搜索子目录、以及匹配文件的正则表达式。
        window.addEventListener('keydown', (ev) => {
          const flipbook = this.$refs.flipbook
          if (!flipbook) return
          if (ev.keyCode == 37 && flipbook.canFlipLeft) flipbook.flipLeft()
          if (ev.keyCode == 39 && flipbook.canFlipRight) flipbook.flipRight()
        })  

       
        setTimeout(() => {
            this.pages=[null,...imageFiles]
            this.pagesHiRes=[null,...imageLargeFiles]//动态导入图片
        }, 1)
        window.addEventListener('hashchange', this.setPageFromHash)
        this.setPageFromHash()
    },
    computed:{
        // flipbookPage() {
        // return this.Book.CRpage
        // },
        // flipbookNumPages() {
        // return this.Book.CRnumPages
        // },
    },
    beforeUpdate(){
         setTimeout(()=>{this.getPage()},1)
    }
}
</script>


<style>
html,
body {
    margin: 0;
    padding: 0;
}
.images{
    min-width: 100%;
    min-height: 100%;
}
#page {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #333;
    color: #ccc;
    overflow: hidden;
}

a {
    color: inherit;
}

.action-bar {
    width: 100%;
    height: 30px;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.action-bar .btn {
    font-size: 30px;
    color: #999;
}

.action-bar .btn svg {
    bottom: 0;
}

.action-bar .btn:not(:first-child) {
    margin-left: 10px;
}

.has-mouse .action-bar .btn:hover {
    color: #ccc;
    filter: drop-shadow(1px 1px 5px #000);
    cursor: pointer;
}

.action-bar .btn:active {
    filter: none !important;
}

.action-bar .btn.disabled {
    color: #666;
    pointer-events: none;
}

.action-bar .page-num {
    font-size: 12px;
    margin-left: 10px;
}

.flipbook .viewport {
    width: 90vw !important;
    height: calc(100vh - 50px - 40px) !important;
}

.flipbook .bounding-box {
    box-shadow: 0 0 20px #000;
}

.credit {
    font-size: 12px;
    line-height: 20px;
    margin: 10px;
}
</style>
