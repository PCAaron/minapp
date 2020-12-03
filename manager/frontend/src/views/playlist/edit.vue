<template>
    <div class="edit">
        <el-form ref="form" :model="detail" label-width="200">
            <el-form-item label="歌单名称">
                <el-input v-model="detail.rankname"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="detail.intro"></el-input>
            </el-form-item>
            <el-form-item label="封面">
                <el-input v-model="detail.imgurl"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">更新</el-button>
                <el-button type="danger" @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { fetchById, update } from '@/api/playlist'

export default {
    data() {
        return{
            detail: null
        }
    },
    async created() {
        await this.getDetail()
    },
    methods: {
        async getDetail() {
            const {data} = await fetchById({
                id: this.$route.params.id
            })
            this.detail = data
        },
        async onSubmit() {
            const { data } = await update(this.detail)
            if (data.modified > 0) {
                this.$message.success('更新成功')
            } else {
                this.$message.error('更新失败')
            }
            this.$router.push('/playlist/list')
        },
        onCancel() {
            this.$router.go(-1)
        }
    },
}
</script>