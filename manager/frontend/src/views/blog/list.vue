<template>
    <div class="blog">
        <el-table :data="blogList" stripe>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="avatarUrl" label="头像">
                <template slot-scope="scope">
                    <img :src="scope.row.avatarUrl" width="50"/>
                </template>
            </el-table-column>
            <el-table-column prop="nickName" label="发布人"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { fetchList, del } from '@/api/blog'
import scroll from '@/utils/scroll'

export default {
    data() {
        return {
            blogList: [],
            count: 50
        }
    },
    async mounted() {
        scroll.start(await this.getList())
    },
    methods: {
        async getList() {
            const { data } = await fetchList({
                start: this.blogList.length,
                count: this.count
            })
            let _blogList = []
            data.forEach(item => {
                _blogList.push(JSON.parse(item))
            })
            this.blogList = this.blogList.concat(_blogList)
            console.log(this.blogList)
            if (_blogList.length < this.count) {
                scroll.end()
            }
        },
        onDel(row){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const {data} = await del(row)
                    console.log(data)
                    if (data.length > 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.blogList = []
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
        }
    },
}
</script>

<style scoped lang="scss">

</style>