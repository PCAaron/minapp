<template>
    <div class="list">
        <el-table 
            v-loading="loading"
            :data="playlist"
            stripe
            style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="封面" width="100">
                <template slot-scope="scope">
                    <img :src="scope.row.imgurl | filterImg" height="50"/>
                </template>
            </el-table-column>
            <el-table-column
            prop="rankname"
            label="名称">
            </el-table-column>
            <el-table-column
            prop="intro"
            label="描述">
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { fetchList, del } from '@/api/playlist'
import scroll from '@/utils/scroll'

export default {
    data() {
        return {
            playlist: [],
            loading: false,
            count: 20
        }
    },
    async mounted() {
        await this.getList()
        scroll.start(this.getList)
    },
    filters: {
        filterImg(val){
            return val.replace('{size}', 400)
        }
    },
    methods: {
        async getList() {
            this.loading = true
            try {
                const {data} = await fetchList({
                    start: this.playlist.length,
                    count: this.count
                })
                this.playlist = this.playlist.concat(data)
                if (data.length < this.count) {
                    scroll.end()
                }
            } catch(e) {
                console.warn(e)
            } finally {
                this.loading = false
            }
            
        },
        onEdit(row) {
            this.$router.push({
                path: `/playlist/edit/${row._id}`
            })
        },
        onDelete(row){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const {data} = await del({
                        _id: row._id
                    })
                    if (data.deleted > 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.playlist = []
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