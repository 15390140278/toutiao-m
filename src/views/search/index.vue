<template>
  <div class="search-container">
<!--    搜索栏-->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
<!--    /搜索栏-->
<!--  搜索结果-->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />
<!--  /搜索结果-->
<!--    联想建议-->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
<!--    /联想建议-->
<!--    搜索历史记录-->
    <search-history
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
      v-else/>
<!--    /搜索历史记录-->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import SearchSuggestion from './components/search-suggestion'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  methods: {
    onSearch (val) {
      console.log(val)
      this.searchText = val
      const index = this.searchHistories.indexOf(val)
      // if (index === -1) {
      //   this.searchHistories.unshift(val)
      // }
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      //  一定要每一个都重新加进去,上面的方法不行
      this.searchHistories.unshift(val)
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
