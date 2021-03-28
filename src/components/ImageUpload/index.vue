<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <!-- 进度条 -->
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />

    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
var COS = require('cos-js-sdk-v5')
var cos = new COS({
  SecretId: 'AKIDCGASVKXiGeosnT5HTekqMipJAjCcPrge',
  SecretKey: '3z3sdDcqwnQyJdsyqX6V4oQXRPAPQC2i'
})
export default {
  name: 'ImageUpload',

  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null,
      showPercent: false, // 控制进度条是否显示
      percent: 0 // 进度百分比
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file) {
    // 将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },

    //! 当定义 http-request 后 上传成功这里会触发一次
    changeFile(file, fileList) {
      // this.fileList = fileList
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 文件上传的检查
      // 文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true // 显示进度条
      return true
    },
    // 进行上传操作
    upload(params) {
      console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'renzhi-uploadimage-1305395387', // 存储桶
          Region: 'ap-chengdu', // 地域
          Key: params.file.uid + '', // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: (progressData) => {
            this.percent = progressData.percent * 100
          }
          // 上传到腾讯云 => 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // 这里的 function 会有 this 指向问题
          if (!err && data.statusCode === 200) {
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的 fileList是一个数组
            // ! 为后期上传多张图片预留空间
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
                // upload 为 true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              // 将上传成功的地址 回写到了 fileList中 fileList变化  => upload组件 就会根据 fileList的变化而去渲染视图
              return item
            })
            this.showPercent = false // 隐藏进度条
            this.percent = 0 // 进度归0
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .disabled .el-upload--picture-card {
  display: none
}
</style>
