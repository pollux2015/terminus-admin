<template>
  <div>
    <div :class="{'theme-a': showimg}" :style="{width: picsize[0], height: picsize[1]}">
      <Upload :on-progress="onprogress" :action="docUrl" :data="uploadData" :before-upload="beforeupload" :on-success="imageuploaded" :max-size="maxSize" :on-exceeded-size="exceededsize" :on-error="onerror" :accept="accept" :type="multiple ? 'drag' : 'select'" :multiple="multiple" :show-upload-list="showUploadList && !showimg">
        <div v-if="multiple" style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <span class="info">
          <slot>文件:2M以内</slot>
        </span>
        </div>
        <template v-if="!multiple">
          <div v-if="resultUrl && showimg" class="resulturl">
            <div class="result-innter">
              <div class="cell">
                <p class="show-btn">上传</p>
              </div>
            </div>
            <img :src="resultUrl ">
          </div>
          <div class="nomal-outer" v-if="!resultUrl || !showimg">
            <div class="nomal-inner">
            <Button shape="circle" v-if="!multiple" icon="ios-cloud-upload-outline">上传文件</Button>
            </div>
          </div>
        </template>
      </Upload>
      <!-- <div v-if="showUploadList && showimg" v-for="file in fileList">
      <div>{{file.name}}</div>
      <Progress :percent="file.percentage"></Progress>
    </div> -->
    </div>
    <span class="info">
    <slot>文件：2M以内</slot>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    defaultimg: {
      default: ''
    },
    picsize: {
      type: Array,
      default () {
        return ['auto', 'auto']
      }
    },
    uploadType: {
      type: String,
      default: 'common'
    },
    showimg: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 2048 // KB
    },
    showUploadList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      docUrl: this.$store.getters.docUrl,
      uploadData: {
        type: this.uploadType
      },
      resultUrl: this.defaultimg
    }
  },
  watch: {
    defaultimg (){
      this.resultUrl = this.defaultimg
    }
  },
  methods: {
    isAvalidFileName(fileName) {
      var fname = fileName.replace(/(.*\/)*([^.]+).*/ig, "$2");
      // var regEx = new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]", "i");
      var regEx = /[\~\!\/\#\$\%\^\*\=\+\\\|\[\{\}\]\;\:\'\"\<\>\/\?]+/ig;
      return !regEx.test(fname);
    },
    beforeupload(file) {
      var isAvalidFileName = this.isAvalidFileName(file.name);
      if (!isAvalidFileName) {
        this.$Message.warning('文件名不能包含特殊字符');
      }
      return isAvalidFileName;
    },
    onprogress(event, file, fileList) {
      this.fileList = fileList;
    },
    onerror(error, file, fileList) {
      console.log(error)
    },
    exceededsize(file, fileList) {
      this.$Message.warning('文件大小' + this.maxSize / 1024 + 'M以内')
    },
    imageuploaded(res) {
      if (res.code == 1) {
        this.resultUrl = res.data.url;
        this.$emit('uploaded', res.data.url);
      } else {
        this.$Message.warning(res.msg || '上传失败!');
      }
    }
  }
}

</script>
<style>
.theme-a {
  position: relative;
  border: 1px dashed #ddd;
  text-align: center;
  border-radius: 6px;
  overflow: hidden;
}

.theme-a .ivu-upload {
  width: 100%;
  height: 100%;
}

.theme-a .info {
  display: block;
}


.resulturl,
.resulturl:after,
.result-innter {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.resulturl {
  cursor: pointer;
  text-align: center;
  background-color: #000;
}

.resulturl:after {
  opacity: 0;
  z-index: 1;
  content: '';
  background-color: #000;
}

.resulturl img {
  width: 100%;
  border: none;
}

.result-innter {
  z-index: 2;
  display: table;
  color: #fff;
}

.result-innter .cell {
  transition: all 0.4s;
  opacity: 0;
  display: table-cell;
  vertical-align: middle;
}

.resulturl:hover .cell {
  opacity: 1;
}

.resulturl:hover:after {
  opacity: 0.5;
}

.show-btn {
  border: 1px dashed #fff;
  padding: 0 10px;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  margin: 0 auto;
}

.nomal-outer{
  width: 100%;
  height: 100%;
  display: table;
}

.nomal-inner{
  width: 100%;
  height: 100%;
  display: table-cell;
  vertical-align: middle;
}

</style>
