<template>
    <div class="swpier">
        <div class="filter-container">
            <el-upload
                class="upload"
                action="http://localhost:3000/swiper/upload"
                :on-success="uploadSuccess"
                :show-file-list="false"
            >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </div>
        <el-table v-loading="loading" :data="swiperList">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="图片" width="400">
                <template slot-scope="scope">
                    <img :src="scope.row.download_url" height="50"/>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {fetchList, del} from '@/api/swiper'

export default {
    data() {
        return {
            swiperList: [],
            loading: false
        }
    },
    async created() {
        this.loading = true
        await this.getList()
    },
    methods: {
        async getList() {
            const {data} =  await fetchList()
            this.swiperList = data
            this.loading = false
        },
        handleDel(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const {data} = await del({
                        _id: row._id,
                        fileid: row.fileid
                    })
                    if (data.res.deleted > 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        await this.getList()
                    } else {
                        this.$message.warn('删除失败！')
                    }
                } catch (e) {
                    console.warn(e)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        async uploadSuccess(res) {
            if (res.data.length) {
                this.$message({
                    type:'success',
                    message:'上传成功'
                })
                await this.getList()
            }
        }
    },
}
</script>

<style scoped lang="scss">
    
</style>